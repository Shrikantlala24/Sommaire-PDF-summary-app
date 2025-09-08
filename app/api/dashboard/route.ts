import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createUser, getUserByClerkId, getUserSummaries } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in database
    let user = await getUserByClerkId(userId);
    if (!user) {
      user = await createUser(userId);
    }

    // Get user's summaries
    const summaries = await getUserSummaries(user.id);

    return NextResponse.json({
      success: true,
      data: {
        user,
        summaries,
        isNewUser: summaries.length === 0
      }
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}
