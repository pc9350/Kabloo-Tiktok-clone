import { currentUser } from '@clerk/nextjs/server'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from './prisma';

export async function getCurrentUser() {
  const user = await currentUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  return dbUser;
}

export async function checkAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/main/upload");
  }
  
  return userId;
}