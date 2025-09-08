import { GoogleGenerativeAI } from "@google/generative-ai";

interface SummarySlide {
  title: string;
  content: string;
}

interface SummaryResult {
  title: string;
  slides: string[];
  wordCount: number;
  processingTime: number;
}

export class GeminiSummarizationService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateSummary(text: string, fileName: string): Promise<SummaryResult> {
    const startTime = Date.now();
    
    try {
      console.log('🤖 Starting Gemini summarization...');
      
      // Create a comprehensive prompt for PDF summarization with markdown formatting
      const prompt = `Please analyze and summarize the following PDF document content. Create a comprehensive summary that includes:

1. Generate an engaging title based on the document content
2. Create 5-7 summary slides, each focusing on a key aspect of the document
3. Each slide should be detailed but concise (150-200 words per slide)
4. Format each slide content using Markdown for better readability
5. Cover the main themes, key points, conclusions, and any important data/insights

Document filename: ${fileName}
Document content:
${text}

Please respond in the following JSON format with markdown-formatted content (use actual newlines in the slide content, not escaped characters):
{
  "title": "Generated title based on content",
  "slides": [
    "# Slide Title 1\n\n**Overview and Introduction**\n\nDetailed content with *emphasis* and proper formatting...\n\n- Key point 1\n- Key point 2\n- Key point 3",
    "# Slide Title 2\n\n**Key Themes and Concepts**\n\nDetailed content with proper markdown formatting...\n\n> Important quote or insight\n\n## Subsection\n\nMore details...",
    "# Slide Title 3\n\n**Main Findings**\n\nDetailed content...\n\n1. First finding\n2. Second finding\n3. Third finding",
    "# Slide Title 4\n\n**Supporting Details**\n\nDetailed content...\n\nCode or technical details if applicable",
    "# Slide Title 5\n\n**Conclusions and Implications**\n\nDetailed content with proper formatting...\n\n**Key Takeaways:**\n- Point 1\n- Point 2"
  ]
}

Use proper markdown formatting including headers, bold text, italic text, lists, blockquotes, and code blocks where appropriate. Make sure the response is valid JSON and each slide provides meaningful, well-formatted content about the document.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      console.log('✅ Gemini response received');
      console.log('📄 Raw Gemini response:', responseText);
      
      // Parse the JSON response
      let parsedResponse;
      try {
        // Clean the response text - remove markdown code blocks if present
        let cleanText = responseText.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.substring(7);
        }
        if (cleanText.endsWith('```')) {
          cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        cleanText = cleanText.trim();
        console.log('🧹 Cleaned response:', cleanText);
        parsedResponse = JSON.parse(cleanText);
        console.log('📊 Parsed response:', parsedResponse);
        
        // Ensure slides are strings, not objects
        if (parsedResponse.slides && Array.isArray(parsedResponse.slides)) {
          parsedResponse.slides = parsedResponse.slides.map((slide: any) => {
            if (typeof slide === 'object') {
              // If slide is an object, convert it to string
              return JSON.stringify(slide);
            }
            return String(slide);
          });
        }
        
      } catch (parseError) {
        console.error('❌ Failed to parse Gemini response:', parseError);
        console.log('Raw response:', responseText);
        
        // Try to extract content manually if JSON parsing fails
        const fallbackContent = this.extractContentManually(responseText, fileName);
        if (fallbackContent) {
          parsedResponse = fallbackContent;
        } else {
          // Fallback to default response
          parsedResponse = {
            title: `Summary of ${fileName}`,
            slides: [
              "This document contains important information that requires further analysis.",
              "The content covers various topics that need detailed examination.",
              "Key insights and findings are present throughout the document.",
              "The document provides valuable information for understanding the subject matter.",
              "Additional analysis may be needed to fully capture all important points."
            ]
          };
        }
      }
      
      const processingTime = Date.now() - startTime;
      const wordCount = text.split(/\s+/).length;
      
      // Ensure all slides are strings with proper markdown content extraction
      const finalSlides = (parsedResponse.slides || ["Summary unavailable - please try again."]).map((slide: any) => {
        if (typeof slide === 'string') {
          return slide;
        } else if (typeof slide === 'object' && slide !== null) {
          // If it's an object, extract the content and format as markdown
          // Check for 'slide' property first (current Gemini format)
          if (slide.slide && typeof slide.slide === 'string') {
            return slide.slide;
          }
          // Check for 'content' property (alternative format)
          if (slide.content && typeof slide.content === 'string') {
            // If there's a slide_title, format as markdown header
            if (slide.slide_title) {
              return `# ${slide.slide_title}\n\n${slide.content}`;
            }
            return slide.content;
          }
          if (slide.text) return String(slide.text);
          if (slide.summary) return String(slide.summary);
          // If it has a title but no content, use the title as header
          if (slide.slide_title) return `# ${slide.slide_title}`;
          // Otherwise convert to readable markdown format
          return Object.keys(slide).map(key => {
            if (key === 'slide_title' || key === 'title') {
              return `# ${slide[key]}`;
            }
            return `**${key}**: ${slide[key]}`;
          }).join('\n\n');
        }
        return String(slide);
      });
      
      return {
        title: parsedResponse.title || `Summary of ${fileName}`,
        slides: finalSlides,
        wordCount,
        processingTime
      };
      
    } catch (error) {
      console.error('❌ Gemini summarization failed:', error);
      
      // Return fallback summary
      const processingTime = Date.now() - startTime;
      const wordCount = text.split(/\s+/).length;
      
      return {
        title: `Summary of ${fileName}`,
        slides: [
          "This document has been processed but summarization encountered an error.",
          "The content appears to contain important information that requires review.",
          "Manual analysis may be needed to extract key insights.",
          "Please try uploading the document again for better results."
        ],
        wordCount,
        processingTime
      };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent("Hello, can you respond with 'Connection successful'?");
      const response = await result.response;
      return response.text().includes('Connection successful');
    } catch (error) {
      console.error('❌ Gemini connection test failed:', error);
      return false;
    }
  }

  private extractContentManually(responseText: string, fileName: string): { title: string; slides: string[] } | null {
    try {
      // Try to extract title and slides even if JSON parsing fails
      const lines = responseText.split('\n').filter(line => line.trim());
      
      let title = `Summary of ${fileName}`;
      const slides: string[] = [];
      
      // Look for title patterns
      const titleMatch = responseText.match(/"title":\s*"([^"]+)"/);
      if (titleMatch) {
        title = titleMatch[1];
      }
      
      // Look for slide content patterns
      const slideMatches = responseText.match(/"slides":\s*\[([\s\S]*?)\]/);
      if (slideMatches) {
        const slideContent = slideMatches[1];
        const slideTexts = slideContent.match(/"([^"]+)"/g);
        if (slideTexts) {
          slideTexts.forEach(slideText => {
            const cleanSlide = slideText.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
            if (cleanSlide.length > 10) { // Only add meaningful content
              slides.push(cleanSlide);
            }
          });
        }
      }
      
      if (slides.length > 0) {
        return { title, slides };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Manual content extraction failed:', error);
      return null;
    }
  }
}
