import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from '@clerk/nextjs/server';

const f = createUploadthing();

// Store uploaded files (in production, you'd use a database)
const uploadedFiles: Array<{
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
  processed: boolean;
}> = [];

// FileRouter for your app, can upload PDFs and documents
export const ourFileRouter = {
  // PDF and document uploader
  pdfUploader: f({
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req }) => {
      // Use Clerk for authentication
      const { userId } = await auth();
      
      if (!userId) throw new UploadThingError("Unauthorized");
      
      return { userId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      console.log("file name", file.name);
      
      // Store file information
      const fileRecord = {
        id: file.key,
        userId: metadata.userId,
        fileName: file.name,
        fileUrl: file.url,
        fileSize: file.size,
        uploadedAt: new Date(),
        processed: false
      };
      
      uploadedFiles.push(fileRecord);
      
      // TODO: Process PDF with LangChain here
      console.log("PDF ready for processing:", fileRecord);
      
      // Here you can save file info to your database
      // await db.file.create({
      //   data: {
      //     userId: metadata.userId,
      //     name: file.name,
      //     url: file.url,
      //     size: file.size,
      //   },
      // });
      
      return { 
        uploadedBy: metadata.userId, 
        fileName: file.name,
        fileUrl: file.url,
        fileKey: file.key
      };
    }),

  // Document uploader (DOC, DOCX, TXT)
  documentUploader: f({
    text: {
      maxFileSize: "8MB",
      maxFileCount: 3,
    },
  })
    .middleware(async ({ req }) => {
      const { userId } = await auth();
      
      if (!userId) throw new UploadThingError("Unauthorized");
      
      return { userId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      console.log("file name", file.name);
      
      // Store file information
      const fileRecord = {
        id: file.key,
        userId: metadata.userId,
        fileName: file.name,
        fileUrl: file.url,
        fileSize: file.size,
        uploadedAt: new Date(),
        processed: false
      };
      
      uploadedFiles.push(fileRecord);
      
      // TODO: Process document with LangChain here
      console.log("Document ready for processing:", fileRecord);
      
      return { 
        uploadedBy: metadata.userId, 
        fileName: file.name,
        fileUrl: file.url,
        fileKey: file.key
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Export function to get uploaded files for a user
export function getUserFiles(userId: string) {
  return uploadedFiles.filter(file => file.userId === userId);
}

// Export function to get a specific file
export function getFileByKey(fileKey: string) {
  return uploadedFiles.find(file => file.id === fileKey);
}
