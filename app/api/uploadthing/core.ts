import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from '@clerk/nextjs/server';

const f = createUploadthing();

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
      
      // Here you can save file info to your database
      // await db.file.create({
      //   data: {
      //     userId: metadata.userId,
      //     name: file.name,
      //     url: file.url,
      //     size: file.size,
      //   },
      // });
      
      return { uploadedBy: metadata.userId, fileName: file.name };
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
      
      return { uploadedBy: metadata.userId, fileName: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
