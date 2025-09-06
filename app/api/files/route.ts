import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserFiles, getFileByKey } from '../uploadthing/core';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const fileKey = url.searchParams.get('fileKey');

    if (fileKey) {
      // Get specific file
      const file = getFileByKey(fileKey);
      
      if (!file || file.userId !== userId) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      
      return NextResponse.json(file);
    } else {
      // Get all files for user
      const files = getUserFiles(userId);
      return NextResponse.json(files);
    }
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
