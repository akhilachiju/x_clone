import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import { handleApiError } from '@/lib/errorHandler';
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/authUtils';

export async function PUT(request: Request) {
  try {
    const session = await getAuthenticatedUser();

    const { name, bio, profileImage, coverImage } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        bio,
        image: profileImage,
        coverImage
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: Request) {
  try {
    const session = await getAuthenticatedUser();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        bio: true,
        image: true,
        coverImage: true,
        createdAt: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}
