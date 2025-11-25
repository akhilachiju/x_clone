import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prismadb';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
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
