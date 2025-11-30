import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import { handleApiError } from '@/lib/errorHandler';
import { getAuthenticatedUser } from '@/lib/authUtils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    console.log('Searching for username:', username);
    
    if (username) {
      // Get specific user by username, email, or email prefix
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: username },
            { email: { startsWith: username + '@' } }
          ]
        }
      });
      
      return NextResponse.json(user);
    }
    
    const session = await getAuthenticatedUser();
    
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        bio: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Add isFollowing field based on followingIds array
    const usersWithFollowStatus = users.map(user => ({
      ...user,
      isFollowing: currentUser ? currentUser.followingIds.includes(user.id) : false
    }));

    return NextResponse.json(usersWithFollowStatus);
  } catch (error) {
    return handleApiError(error);
  }
}
