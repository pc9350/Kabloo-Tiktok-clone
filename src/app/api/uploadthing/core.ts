import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  videoUploader: f({ video: { maxFileSize: "64MB" } })
  .middleware(async ({ req }) => {
    try {
      // Get auth user
      const { userId } = await auth();
      console.log("Auth userId:", userId);

      if (!userId) {
        throw new UploadThingError("Unauthorized: No userId");
      }

      // Verify user exists in database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });
      console.log("Database user:", user);

      if (!user) {
        throw new UploadThingError("User not found in database");
      }

      return { userId: user.id };
    } catch (err) {
      console.error("Middleware error:", err);
      throw new UploadThingError(
        err instanceof Error ? err.message : "Failed to authenticate"
      );
    }
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;