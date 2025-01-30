import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    console.log("Auth userId:", clerkId); 

    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { targetUserId } = await req.json();
    console.log("Target userId:", targetUserId);

    const currentUser = await prisma.user.findUnique({
      where: { clerkId }
    });

    console.log("Current user:", currentUser); 

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // const targetUser = await prisma.user.findUnique({
    //   where: { id: targetUserId }
    // });

    // if (!targetUser) {
    //   return new NextResponse("Target user not found", { status: 404 });
    // }

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    });

    console.log("Existing follow:", existingFollow);

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });
      console.log('Follow deleted');
      return NextResponse.json({ followed: false });
    } else {
      await prisma.follow.create({
        data: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      });
      // console.log("New follow created:", newFollow);
      return NextResponse.json({ followed: true });
    }
  } catch (error) {
    console.error("Follow error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}