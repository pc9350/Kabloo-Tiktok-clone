import { prisma } from "@/lib/prisma";
import { VideoFeed } from "@/components/video/VideoFeed";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function FeedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const videos = await prisma.video.findMany({
    include: {
      creator: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="h-screen w-full bg-black">
      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        }
      >
        <VideoFeed initialVideos={videos} />
      </Suspense>
    </main>
  );
}
