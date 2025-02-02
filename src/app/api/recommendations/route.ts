import { prisma } from "@/lib/prisma";

type VideoWithCreator = {
  id: string;
  url: string; // Add this field
  caption: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  creator: {
    id: string;
    clerkId: string;
    username: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
    isFollowing: boolean;
  };
  _count: {
    likes: number;
    comments: number;
  };
};

export async function getRecommendedVideos(
  userId: string
): Promise<VideoWithCreator[]> {
  const userVideos = await prisma.video.findMany({
    where: { creatorId: userId },
    include: {
      creator: true,
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const recentLikes = await prisma.like.findMany({
    where: { userId },
    include: { video: { select: { caption: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const similarCaptionVideos = await prisma.video.findMany({
    where: {
      caption: {
        contains: recentLikes[0]?.video.caption || "",
        mode: "insensitive",
      },
      creatorId: { not: userId },
    },
    include: {
      creator: true,
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  interface Follow {
    followingId: string;
  }

  interface VideoCreator {
    id: string;
    clerkId: string;
    username: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface VideoCount {
    likes: number;
    comments: number;
  }

  interface VideoWithCreatorAndCount {
    id: string;
    creator: VideoCreator;
    _count: VideoCount;
  }

  const followingVideos: VideoWithCreatorAndCount[] =
    await prisma.video.findMany({
      where: { creatorId: { in: following.map((f: Follow) => f.followingId) } },
      include: {
        creator: true,
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

  interface RestVideo {
    id: string;
    creator: VideoCreator;
    _count: VideoCount;
  }

  const restVideos: RestVideo[] = await prisma.video.findMany({
    where: {
      id: {
        notIn: [
          ...userVideos.map((v: VideoWithCreator) => v.id),
          ...similarCaptionVideos.map((v: VideoWithCreator) => v.id),
          ...followingVideos.map((v: VideoWithCreatorAndCount) => v.id),
        ],
      },
    },
    include: {
      creator: true,
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  interface ProcessedVideo extends VideoWithCreator {
    creator: ProcessedCreator;
  }

  interface ProcessedCreator extends VideoCreator {
    isFollowing: boolean;
  }

  const allVideos: ProcessedVideo[] = Array.from(
    new Map<string, ProcessedVideo>(
      [
        ...userVideos,
        ...similarCaptionVideos,
        ...followingVideos,
        ...restVideos,
      ].map((video): [string, ProcessedVideo] => [
        video.id,
        {
          ...video,
          creator: {
            id: video.creator.id,
            clerkId: video.creator.clerkId,
            username: video.creator.username,
            avatar: video.creator.avatar,
            createdAt: video.creator.createdAt,
            updatedAt: video.creator.updatedAt,
            isFollowing: following.some(
              (f: Follow) => f.followingId === video.creatorId
            ),
          },
        },
      ])
    ).values()
  );

  return allVideos;
}
