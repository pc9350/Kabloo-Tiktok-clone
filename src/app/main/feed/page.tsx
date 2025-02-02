import { prisma } from "@/lib/prisma";
import { VideoFeed } from "@/components/video/VideoFeed";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getRecommendedVideos } from "@/app/api/recommendations/route";
import { Suspense } from "react";

export default async function FeedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const currentUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!currentUser) redirect("/");

  // Fetch recommended videos
  const recommendedVideos = await getRecommendedVideos(currentUser.id);

  return (
    <main className="h-screen w-full bg-black">
      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        }
      >
        <VideoFeed initialVideos={recommendedVideos} />
      </Suspense>
    </main>
  );
}
