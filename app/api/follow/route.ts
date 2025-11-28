import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prismadb';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
    console.error('Follow API error details:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
}
