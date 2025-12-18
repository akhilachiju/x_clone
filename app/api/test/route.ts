import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();
    
    console.log(`Users: ${userCount}, Posts: ${postCount}`);
    
    return NextResponse.json({ 
      success: true, 
      userCount, 
      postCount,
      message: 'Database connection successful' 
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
