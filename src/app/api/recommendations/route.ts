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
  const currentUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  const videos = await prisma.video.findMany({
    include: {
      creator: {
        include: {
          followers: {
            where: {
              followerId: currentUser?.id,
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  interface VideoWithFollowers extends VideoWithCreatorAndCount {
    creator: {
      followers: { followerId: string }[];
      id: string;
      clerkId: string;
      username: string;
      avatar: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }

  interface ProcessedVideoWithFollowers {
    id: string;
    creator: {
      id: string;
      clerkId: string;
      username: string;
      avatar: string;
      createdAt: Date;
      updatedAt: Date;
      isFollowing: boolean;
    };
    _count: VideoCount;
  }

  const videosWithFollowStatus: ProcessedVideoWithFollowers[] = videos.map(
    (video: VideoWithFollowers) => ({
      ...video,
      creator: {
        ...video.creator,
        isFollowing: video.creator.followers.length > 0,
        followers: undefined,
      },
    })
  );

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
          ...videosWithFollowStatus.map(
            (v: ProcessedVideoWithFollowers) => v.id
          ),
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
        ...videosWithFollowStatus,
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
