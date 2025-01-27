import { prisma } from '@/lib/prisma';
import { VideoFeed } from '@/components/video/VideoFeed';

export default async function FeedPage() {
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
      <VideoFeed initialVideos={videos} />
    </main>
  );
}