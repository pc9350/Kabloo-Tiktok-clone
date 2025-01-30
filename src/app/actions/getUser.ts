'use server'

import { prisma } from '@/lib/prisma';

export async function getUser(clerkId: string) {
  return await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true }
  });
}