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
3. Each slide should be detailed but well-structured (200-300 words per slide)
4. Format each slide content using Markdown for better readability
5. Cover the main themes, key points, conclusions, and any important data/insights
6. DO NOT include slide numbers (like "Slide 1:", "Slide 2:", etc.) in the content
7. Focus on creating logical, well-chunked content sections

Document filename: ${fileName}
Document content:
${text}

Please respond in the following JSON format with markdown-formatted content (use actual newlines in the slide content, not escaped characters):
{
  "title": "Generated title based on content",
  "slides": [
    "# Introduction and Overview\n\n**Core Purpose**\n\nDetailed introduction explaining the main purpose and scope of the document...\n\n- Key foundational concept 1\n- Key foundational concept 2\n- Key foundational concept 3\n\n*Context and background information that sets the stage for understanding the content.*",
    "# Key Themes and Concepts\n\n**Main Ideas**\n\nDetailed explanation of the primary themes and concepts...\n\n> Important insight or quote from the document\n\n## Sub-theme Analysis\n\nBreakdown of specific areas:\n- Theme 1 with detailed explanation\n- Theme 2 with supporting evidence\n- Theme 3 with practical implications",
    "# Detailed Analysis and Findings\n\n**Research Results**\n\nComprehensive analysis of findings and data...\n\n1. Primary finding with explanation\n2. Secondary finding with context\n3. Supporting evidence and methodology\n\n**Statistical Insights:**\n- Key metric 1\n- Key metric 2\n- Trend analysis",
    "# Implementation and Applications\n\n**Practical Applications**\n\nHow the content can be applied in real-world scenarios...\n\n### Technical Implementation\n- Step-by-step process\n- Required resources\n- Expected outcomes\n\n### Best Practices\n- Recommended approaches\n- Common pitfalls to avoid",
    "# Conclusions and Future Directions\n\n**Summary of Key Points**\n\nFinal thoughts and synthesis of the main ideas...\n\n**Action Items:**\n- Immediate next steps\n- Long-term considerations\n- Areas for further research\n\n*The document concludes with forward-looking insights and recommendations.*"
  ]
}

Important: Create well-structured, meaningful chunks of content. Each slide should stand alone while contributing to the overall narrative. Use proper markdown formatting including headers, bold text, italic text, lists, blockquotes, and code blocks where appropriate. DO NOT use slide numbers in the content itself.`;

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
      
      // Ensure all slides are proper markdown strings
      const finalSlides = (parsedResponse.slides || ["Summary unavailable - please try again."]).map((slide: any) => {
        // If it's already a string, return as-is (should be markdown)
        if (typeof slide === 'string') {
          return slide;
        }
        
        // If it's an object, convert to proper markdown
        if (typeof slide === 'object' && slide !== null) {
          // Handle different object formats and convert to markdown
          if (slide.slide && typeof slide.slide === 'string') {
            return slide.slide;
          }
          if (slide.content && typeof slide.content === 'string') {
            if (slide.slide_title || slide.title) {
              return `# ${slide.slide_title || slide.title}\n\n${slide.content}`;
            }
            return slide.content;
          }
          if (slide.text) return String(slide.text);
          if (slide.summary) return String(slide.summary);
          if (slide.slide_title || slide.title) return `# ${slide.slide_title || slide.title}`;
          
          // Convert object to markdown format
          return Object.keys(slide).map(key => {
            const value = slide[key];
            if (key === 'slide_title' || key === 'title') {
              return `# ${value}`;
            }
            if (key === 'content' || key === 'text' || key === 'summary') {
              return value;
            }
            return `**${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}**: ${value}`;
          }).join('\n\n');
        }
        
        // Fallback: convert to string
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
