import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log("POST /api/videos - Start");
    
    const { userId } = await auth();
    console.log("User ID:", userId);
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { url, caption } = await req.json();
    console.log("Request data:", { url, caption });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    console.log("Found user:", user);

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    const video = await prisma.video.create({
      data: {
        url,
        caption,
        creatorId: user.id,
      },
    });
    console.log("Created video:", video);

    return NextResponse.json(video);
  } catch (error) {
    console.error('[VIDEOS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
    _req: Request,
    context : { params: { videoId: string } }
  ) {
    try {
      const { videoId } = await Promise.resolve(context.params);
      const { userId: clerkId } = await auth();

      console.log("Video ID:", videoId);
      console.log("Clerk ID:", clerkId);
  
      if (!clerkId) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }), 
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      const user = await prisma.user.findUnique({
        where: { clerkId },
      });
  
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      // Check if the video belongs to the user
      const video = await prisma.video.findUnique({
        where: { id: videoId },
        include: {
          creator: true,
        }
      });
  
      if (!video) {
        return new NextResponse(
          JSON.stringify({ error: 'Video not found' }), 
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Check if the video belongs to the user using clerkId
      if (video.creator.clerkId !== clerkId) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }), 
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Delete the video and the associated likes and comments.
      await prisma.$transaction([
        prisma.like.deleteMany({
          where: { videoId },
        }),
        prisma.comment.deleteMany({
          where: { videoId },
        }),
        prisma.video.delete({
          where: { id: videoId },
        }),
      ]);
  
      return new NextResponse(
        JSON.stringify({ success: true }), 
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('[VIDEO_DELETE]', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal Server Error' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }