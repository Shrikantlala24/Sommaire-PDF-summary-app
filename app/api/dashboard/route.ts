import { NextResponse } from 'next/server';
import { getUserSummaries } from '@/lib/db';
import { getOrCreateUserFromClerk } from '@/lib/clerk-helpers';

export async function GET() {
  try {
    // Get or create user using proper Clerk integration
    const { user } = await getOrCreateUserFromClerk();

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
