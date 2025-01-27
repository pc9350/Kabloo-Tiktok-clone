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