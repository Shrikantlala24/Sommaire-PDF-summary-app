import { NextRequest, NextResponse } from 'next/server';
import { pdfProcessor } from '@/lib/pdf-processor';
import { GeminiSummarizationService } from '@/lib/gemini-service';
import { createPdfSummary } from '@/lib/db';
import { getOrCreateUserFromClerk } from '@/lib/clerk-helpers';

interface ProcessedSummary {
  title: string;
  slides: string[];
  metadata: {
    fileName: string;
    pageCount: number;
    wordCount: number;
    processingTime: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get or create user using proper Clerk integration
    const { user } = await getOrCreateUserFromClerk();

    const { fileKey, fileName, fileUrl } = await request.json();

    if (!fileKey || !fileName || !fileUrl) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'fileKey, fileName, and fileUrl are required'
      }, { status: 400 });
    }

    console.log(`🔄 Starting full processing and summarization for: ${fileName}`);
    console.log(`📁 File URL: ${fileUrl}`);

    // Step 1: Process PDF with LangChain
    const processedPDF = await pdfProcessor.processPDFFromURL(
      fileUrl, 
      fileName
    );

    console.log(`✅ PDF processing complete: ${processedPDF.chunks.length} chunks created`);

    // Step 2: Generate summary with Gemini AI
    const geminiService = new GeminiSummarizationService();
    
    // Combine all chunks into full text for summarization
    const fullText = processedPDF.chunks
      .map(chunk => chunk.pageContent)
      .join('\n\n');
    
    console.log(`🤖 Starting Gemini summarization for ${fileName}...`);
    const summaryResult = await geminiService.generateSummary(fullText, fileName);

    // Note: In our simplified schema, we'll update the summary status after creation

    const response: ProcessedSummary = {
      title: summaryResult.title,
      slides: summaryResult.slides,
      metadata: {
        fileName: fileName,
        pageCount: processedPDF.totalPages || processedPDF.chunks.length,
        wordCount: summaryResult.wordCount,
        processingTime: processedPDF.processingTime + summaryResult.processingTime
      }
    };

    // Save summary to database
    try {
      const { user } = await getOrCreateUserFromClerk();
      
      // Create summary record in pdf_summaries table
      const savedSummary = await createPdfSummary(
        user.id,
        fileUrl,
        JSON.stringify(summaryResult.slides),
        summaryResult.title,
        fileName,
        'completed'
      );
      
      console.log('✅ Summary saved to database with ID:', savedSummary.id);
      
    } catch (dbError) {
      console.error('Failed to save summary to database:', dbError);
      // Continue even if database save fails
    }

    console.log(`✅ Full processing complete for ${fileName}`);
    
    return NextResponse.json({
      success: true,
      summary: response
    });

  } catch (error) {
    console.error('❌ Error in full processing:', error);
    return NextResponse.json({
      success: false,
      error: 'Processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
