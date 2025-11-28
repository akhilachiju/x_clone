import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prismadb';
import { authOptions } from '../auth/[...nextauth]/route';

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
    
    const session = await getServerSession(authOptions);
    
    const currentUser = session?.user?.email ? await prisma.user.findUnique({
      where: { email: session.user.email }
    }) : null;

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
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
