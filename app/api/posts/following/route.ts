import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/authUtils';

export async function GET() {
  try {
    const session = await getAuthenticatedUser();

    // Get current user with their following list
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get posts from followed users
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: currentUser.followingIds
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching following posts:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
