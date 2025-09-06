import { NextRequest, NextResponse } from 'next/server';
import { pdfProcessor } from '@/lib/pdf-processor';

export async function POST(request: NextRequest) {
  try {
    const { fileUrl, fileName } = await request.json();

    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
    }

    console.log(`🧪 Testing LangChain integration with: ${fileName}`);
    console.log(`📡 URL: ${fileUrl}`);

    // Test the updated PDF processor
    const startTime = Date.now();
    const processedPDF = await pdfProcessor.processPDFFromURL(fileUrl, fileName);

    // Generate summary with the new implementation
    const summary = await pdfProcessor.generateSummary(processedPDF.chunks);

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: 'LangChain PDFLoader integration test successful!',
      results: {
        fileName: processedPDF.fileName,
        fileUrl: processedPDF.fileUrl,
        totalPages: processedPDF.totalPages,
        chunksCreated: processedPDF.chunks.length,
        wordCount: processedPDF.wordCount,
        processingTime: processingTime,
        metadata: processedPDF.metadata,
        summary: summary,
        sampleChunk: processedPDF.chunks[0] ? {
          content: processedPDF.chunks[0].pageContent.slice(0, 200) + '...',
          metadata: processedPDF.chunks[0].metadata
        } : null
      },
      langchainDetails: {
        pdfLoaderUsed: true,
        textSplitterUsed: true,
        documentsStructure: 'Each page becomes a Document with metadata',
        chunkingStrategy: 'RecursiveCharacterTextSplitter with 1000 char chunks, 200 char overlap'
      }
    });

  } catch (error) {
    console.error('❌ LangChain integration test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'LangChain integration test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
