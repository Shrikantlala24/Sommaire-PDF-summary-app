import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getFileByKey } from '../uploadthing/core';
import { pdfProcessor } from '@/lib/pdf-processor';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileKey } = await request.json();

    if (!fileKey) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    // Get file information
    const file = getFileByKey(fileKey);
    
    if (!file || file.userId !== userId) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    if (file.processed) {
      return NextResponse.json({ 
        message: 'File already processed', 
        file 
      });
    }

    console.log(`Processing PDF: ${file.fileName} from URL: ${file.fileUrl}`);

    // Process the PDF
    const processedPDF = await pdfProcessor.processPDFFromURL(
      file.fileUrl, 
      file.fileName
    );

    // Generate summary
    const summary = await pdfProcessor.generateSummary(processedPDF.chunks);
    processedPDF.summary = summary;

    // Mark file as processed (in production, update database)
    file.processed = true;

    return NextResponse.json({
      message: 'PDF processed successfully',
      processedPDF: {
        fileName: processedPDF.fileName,
        fileUrl: processedPDF.fileUrl,
        chunkCount: processedPDF.chunks.length,
        wordCount: processedPDF.wordCount,
        processingTime: processedPDF.processingTime,
        summary: processedPDF.summary
      }
    });

  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
