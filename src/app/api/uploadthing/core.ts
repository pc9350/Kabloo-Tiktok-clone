import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getVideoDuration } from "@/lib/video";
import { nanoid } from "nanoid";

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

        let user = await prisma.user.findUnique({
          where: { clerkId: userId || "" },
        });

        if (!user) {
          // Get user data from Clerk
          const client = await clerkClient();
          const clerkUser = await client.users.getUser(userId);

          console.log("Clerk user:", clerkUser);

          // Create user in your database
          user = await prisma.user.create({
            data: {
              id: nanoid(),
              clerkId: userId,
              username: clerkUser.username || `user_${userId.slice(0, 8)}`,
              avatar:
                clerkUser.imageUrl ||
                "https://api.dicebear.com/7.x/avatars/svg?seed=" + userId,
            },
          });
        }

        console.log("Database user:", user);
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
