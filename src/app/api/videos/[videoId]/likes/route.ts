import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  _req: Request,
  context: { params: { videoId: string } }
) {
  try {
    const { videoId } = await Promise.resolve(context.params);

    const likes = await prisma.like.count({
      where: { videoId },
    });

    // Optionally check if current user has liked
    const { userId } = await auth();
    let hasLiked = false;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (user) {
        const like = await prisma.like.findFirst({
          where: {
            videoId,
            userId: user.id,
          },
        });
        hasLiked = !!like;
      }
    }

    return NextResponse.json({ likes, hasLiked });
  } catch (error) {
    console.error("[LIKES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  _req: Request,
  context: { params: { videoId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { videoId } = await Promise.resolve(context.params);

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const like = await prisma.like.create({
      data: {
        videoId,
        userId: user.id,
      },
    });

    return NextResponse.json(like);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to like video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: { videoId: string } }
) {
  try {
    const { videoId } = await Promise.resolve(context.params);
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.like.delete({
      where: {
        videoId_userId: {
          videoId,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[LIKES_DELETE]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
