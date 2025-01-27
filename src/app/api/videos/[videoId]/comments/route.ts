import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    _req: Request,
    context: { params: { videoId: string } }
  ) {
    try {
        const {videoId} = await Promise.resolve(context.params);
      
      const comments = await prisma.comment.findMany({
        where: { videoId },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      return NextResponse.json(comments);
    } catch (error) {
      console.error('[COMMENTS_GET]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

export async function POST(
  req: Request,
  context: { params: { videoId: string } }
) {
  try {
    
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { text } = await req.json();
    const { videoId } = await Promise.resolve(context.params);

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        videoId,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('[COMMENTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}