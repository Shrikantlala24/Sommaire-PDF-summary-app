import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from '@clerk/nextjs/server';
import { createUser, getUserById, createDocument } from '@/lib/db';

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

// FileRouter for your app - PDF uploads only
export const ourFileRouter = {
  // PDF uploader - only PDF files allowed
  pdfUploader: f({
    pdf: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Use Clerk for authentication
      const { userId } = await auth();
      
      if (!userId) throw new UploadThingError("Unauthorized");
      
      return { userId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      console.log("file name", file.name);
      
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        throw new UploadThingError("Only PDF files are allowed");
      }
      
      try {
        // Get or create user in database
        let user = await getUserById(metadata.userId);
        if (!user) {
          user = await createUser(metadata.userId);
        }

        // Create document record in database
        const document = await createDocument(
          user.id,
          file.name,
          file.url,
          file.key,
          file.size
        );

        console.log("Document saved to database:", document);
      } catch (error) {
        console.error("Error saving document to database:", error);
        // Continue with the upload even if database save fails
      }
      
      // Also keep in-memory storage for backward compatibility
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
