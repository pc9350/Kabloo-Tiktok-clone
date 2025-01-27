import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  const payload = await req.json();
  const webhook = new Webhook(WEBHOOK_SECRET);

  try {
    const evt = webhook.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const { id } = evt.data;
      const username = (evt.data as { username?: string }).username || `user_${id?.slice(0, 8)}`;
      const imageUrl = (evt.data as { image_url?: string; imageUrl?: string }).image_url 
        || (evt.data as { image_url?: string; imageUrl?: string }).imageUrl 
        || '/public/user.png';

      if (evt.type === 'user.created') {
        await prisma.user.create({
          data: {
            id: id,
            clerkId: id,
            username: username,
            avatar: imageUrl,
          },
        });
      } else if (evt.type === 'user.updated') {
        await prisma.user.update({
          where: { clerkId: id },
          data: {
            username: username,
            avatar: imageUrl,
          },
        });
      }
    } else if (evt.type === 'user.deleted') {
      const { id } = evt.data;
      await prisma.user.delete({
        where: { clerkId: id },
      });
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Error occurred', { status: 400 });
  }
}