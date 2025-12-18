import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function POST() {
  try {
    // Clear existing data
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});
    
    // Fetch from correct DummyJSON API
    const response = await fetch('https://dummyjson.com/posts');
    const data = await response.json();
    
    console.log(`Fetched ${data.posts.length} posts from DummyJSON`);

    // Get unique user IDs from posts
    const userIds = [...new Set(data.posts.map((post: any) => post.userId))];
    
    // Create dummy users for each userId
    const userIdMap = new Map();
    for (const userId of userIds) {
      const user = await prisma.user.create({
        data: {
          email: `user${userId}@dummy.com`,
          name: `User ${userId}`,
          username: `user${userId}`,
        }
      });
      userIdMap.set(userId, user.id);
    }

    // Create posts with exact DummyJSON data
    for (const post of data.posts) {
      const userId = userIdMap.get(post.userId);
      if (userId) {
        await prisma.post.create({
          data: {
            body: post.body,
            userId: userId,
          }
        });
      }
    }

    return NextResponse.json({ 
      message: `Synced ${data.posts.length} posts from DummyJSON`,
      posts: data.posts.length,
      users: userIds.length
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
