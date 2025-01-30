import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ProfilePage } from "@/components/profile/ProfilePage";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const { userId: currentClerkId } = await auth();

  if (!currentClerkId) {
    redirect("/");
  }

  const profile = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followers: {
        where: {
          followerId: userId,
        },
      },
      _count: {
        select: {
          followers: true,
          following: true,
          videos: true,
        },
      },
      videos: {
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  const isFollowing = profile.followers.length > 0;

  return <ProfilePage 
    profile={profile} 
    currentClerkId={currentClerkId} 
    isFollowing={isFollowing} 
  />;
}