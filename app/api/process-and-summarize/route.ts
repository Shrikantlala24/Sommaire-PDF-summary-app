import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { pdfProcessor } from '@/lib/pdf-processor';
import { GeminiSummarizationService } from '@/lib/gemini-service';
import { createSummary, updateDocumentStatus, getUserByClerkId, sql } from '@/lib/db';

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
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Update document status to completed
    try {
      await updateDocumentStatus(fileKey, 'completed');
    } catch (dbError) {
      console.error('Failed to update document status:', dbError);
    }

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
      const user = await getUserByClerkId(userId);
      if (user) {
        // Find the document record
        const documentQuery = await sql`
          SELECT id FROM documents WHERE file_key = ${fileKey} AND user_id = ${user.id}
        `;
        
        if (documentQuery.length > 0) {
          const documentId = documentQuery[0].id;
          
          await createSummary(
            documentId,
            summaryResult.title,
            summaryResult.slides,
            response.metadata
          );
          
          console.log('✅ Summary saved to database');
        }
      }
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
