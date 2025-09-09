import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { createPdfSummary } from '@/lib/db';
import { getOrCreateUserFromClerk } from '@/lib/clerk-helpers';

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
      // Use Clerk for authentication via our helper
      try {
        const { user, clerkUser } = await getOrCreateUserFromClerk();
        
        // Return user details for use in onUploadComplete
        return { 
          userId: user.id,
          userEmail: user.email
        };
      } catch (error) {
        console.error('Authentication error:', error);
        throw new UploadThingError("Unauthorized");
      }
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
        // Create an initial PDF summary record with "pending" status
        // The actual summary will be updated when processing is complete
        await createPdfSummary(
          metadata.userId,
          file.url,
          "", // Empty summary text until processing completes
          file.name, // Use filename as initial title
          file.name,
          "pending" // Set status as pending
        );

        console.log("PDF file record saved to database, ready for processing");
      } catch (error) {
        console.error("Error saving to database:", error);
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
