import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import { handleApiError } from '@/lib/errorHandler';
import { getAuthenticatedUser } from '@/lib/authUtils';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthenticatedUser();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const postId = params.id;

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    let updatedLikedIds = [...(post.likedIds || [])];

    if (updatedLikedIds.includes(currentUser.id)) {
      // Unlike
      updatedLikedIds = updatedLikedIds.filter((likedId) => likedId !== currentUser.id);
    } else {
      // Like
      updatedLikedIds.push(currentUser.id);
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { likedIds: updatedLikedIds }
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return handleApiError(error);
  }
}
