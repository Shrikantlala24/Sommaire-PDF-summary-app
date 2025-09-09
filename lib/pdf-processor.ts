import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';

export interface ProcessedPDF {
  fileName: string;
  fileUrl: string;
  chunks: Document[];
  summary?: string;
  wordCount: number;
  processingTime: number;
  totalPages?: number;
  metadata?: any;
}

export class PDFProcessingService {
  private textSplitter: RecursiveCharacterTextSplitter;

  constructor() {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
  }

  async processPDFFromURL(fileUrl: string, fileName: string): Promise<ProcessedPDF> {
    const startTime = Date.now();
    
    try {
      console.log(`Starting PDF processing for: ${fileName}`);
      console.log(`PDF URL: ${fileUrl}`);
      
      // Download PDF from URL and create a temporary file
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Node.js doesn't have File constructor, use Blob instead
      const blob = new Blob([buffer], { type: 'application/pdf' });
      
      const loader = new PDFLoader(blob as any, {
        splitPages: true, // Split into individual pages (default behavior)
        parsedItemSeparator: " " // Join text elements with spaces (default)
      });
      
      console.log('Loading PDF with LangChain PDFLoader...');
      const docs = await loader.load();
      
      console.log(`✅ PDF loaded successfully: ${docs.length} pages`);
      
      // Extract metadata from the first document
      const pdfMetadata = docs[0]?.metadata?.pdf;
      const totalPages = pdfMetadata?.totalPages || docs.length;
      
      console.log(`📄 PDF Info: ${totalPages} total pages`);
      if (pdfMetadata?.info?.Title) {
        console.log(`📝 Title: ${pdfMetadata.info.Title}`);
      }
      if (pdfMetadata?.info?.Author) {
        console.log(`👤 Author: ${pdfMetadata.info.Author}`);
      }
      
      // Split documents into smaller chunks for processing
      console.log('Splitting documents into chunks...');
      const chunks = await this.textSplitter.splitDocuments(docs);
      
      // Calculate word count
      const wordCount = chunks.reduce((count, chunk) => {
        return count + chunk.pageContent.split(/\s+/).filter(word => word.length > 0).length;
      }, 0);
      
      const processingTime = Date.now() - startTime;
      
      console.log(`✅ PDF processing complete:`);
      console.log(`   - ${docs.length} pages processed`);
      console.log(`   - ${chunks.length} chunks created`);
      console.log(`   - ${wordCount} words total`);
      console.log(`   - Processing time: ${processingTime}ms`);
      
      return {
        fileName,
        fileUrl,
        chunks,
        wordCount,
        processingTime,
        totalPages,
        metadata: pdfMetadata,
      };
      
    } catch (error) {
      console.error('❌ Error processing PDF:', error);
      throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateSummary(chunks: Document[]): Promise<string> {
    // Extract sample content from chunks
    const firstFewChunks = chunks.slice(0, 3);
    const sampleText = firstFewChunks
      .map(chunk => chunk.pageContent.substring(0, 200))
      .join('\n...\n');
    
    // For now, return a detailed summary with actual content
    const totalText = chunks.map(chunk => chunk.pageContent).join(' ');
    const sentences = totalText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const avgWordsPerSentence = totalText.split(/\s+/).length / sentences.length;
    
    return `📊 Document Analysis Summary:

📄 Structure: ${chunks.length} text chunks processed
📝 Content: ~${sentences.length} sentences detected
📈 Avg sentence length: ~${Math.round(avgWordsPerSentence)} words

🔍 Sample Content:
${sampleText}

💡 This document has been successfully processed and is ready for AI summarization.
Next step: Integrate with your preferred LLM (OpenAI, Anthropic, etc.) for intelligent summarization.`;
  }

  // Method to get text from specific pages
  async getPageText(chunks: Document[], pageNumber: number): Promise<string> {
    const pageChunk = chunks.find(chunk => 
      chunk.metadata?.loc?.pageNumber === pageNumber
    );
    return pageChunk?.pageContent || '';
  }

  // Method to search for content in the PDF
  searchInDocument(chunks: Document[], query: string): Document[] {
    const normalizedQuery = query.toLowerCase();
    return chunks.filter(chunk => 
      chunk.pageContent.toLowerCase().includes(normalizedQuery)
    );
  }
}

// Singleton instance
export const pdfProcessor = new PDFProcessingService();
