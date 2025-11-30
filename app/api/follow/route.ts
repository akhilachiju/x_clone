import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import { handleApiError } from '@/lib/errorHandler';
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/authUtils';

export async function POST(request: Request) {
  try {
    const session = await getAuthenticatedUser();

    const { followingId } = await request.json();

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if already following
    const isFollowing = (currentUser.followingIds || []).includes(followingId);

    if (isFollowing) {
      // Unfollow - remove from followingIds array
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          followingIds: {
            set: (currentUser.followingIds || []).filter(id => id !== followingId)
          }
        }
      });

      return NextResponse.json({ following: false });
    } else {
      // Follow - add to followingIds array
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          followingIds: {
            set: [...(currentUser.followingIds || []), followingId]
          }
        }
      });

      return NextResponse.json({ following: true });
    }
  } catch (error) {
    return handleApiError(error);
  }
}
