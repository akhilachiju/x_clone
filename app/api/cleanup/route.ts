import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET() {
  try {
    // Find posts with non-existent users
    const posts = await prisma.post.findMany({
      include: {
        user: true
      }
    });
    
    const orphanedPosts = posts.filter(post => !post.user);
    
    return NextResponse.json({
      totalPosts: posts.length,
      orphanedPosts: orphanedPosts.length,
      orphanedPostIds: orphanedPosts.map(p => p.id)
    });
  } catch (error) {
    console.error('Cleanup check error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Delete orphaned posts
    const posts = await prisma.post.findMany({
      include: {
        user: true
      }
    });
    
    const orphanedPosts = posts.filter(post => !post.user);
    
    if (orphanedPosts.length > 0) {
      await prisma.post.deleteMany({
        where: {
          id: {
            in: orphanedPosts.map(p => p.id)
          }
        }
      });
    }
    
    return NextResponse.json({
      message: `Deleted ${orphanedPosts.length} orphaned posts`
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
