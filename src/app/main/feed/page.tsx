import { prisma } from "@/lib/prisma";
import { VideoFeed } from "@/components/video/VideoFeed";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function FeedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const currentUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!currentUser) redirect("/");

  // const follows = await prisma.follow.findMany({
  //   where: {
  //     followerId: currentUser?.id
  //   }
  // });

  // console.log("Current follows:", follows); // Debug log
  // console.log("Current user ID:", currentUser?.id);

  // const followingIds = follows.map((f) => f.followingId);
  // console.log("Following IDs:", followingIds);

  const videos = await prisma.video.findMany({
    include: {
      creator: {
        include: {
          followers: {
            where: {
              followerId: currentUser?.id
            }
          }
        }
      },
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

  console.log('Debug - First video:', {
    creatorId: videos[0]?.creator.id,
    followers: videos[0]?.creator.followers,
    currentUserId: currentUser?.id
  });

  const videosWithFollowStatus = videos.map(video => ({
    ...video,
    creator: {
      ...video.creator,
      isFollowing: video.creator.followers.length > 0,
      followers: undefined
    }
  }));

  return (
    <main className="h-screen w-full bg-black">
      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        }
      >
        <VideoFeed initialVideos={videosWithFollowStatus} />
      </Suspense>
    </main>
  );
}
