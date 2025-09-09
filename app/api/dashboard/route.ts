import { NextResponse } from 'next/server';
import { getUserSummaries } from '@/lib/db';
import { getOrCreateUserFromClerk } from '@/lib/clerk-helpers';

export async function GET() {
  try {
    // Get or create user using proper Clerk integration
    const { user } = await getOrCreateUserFromClerk();

    // Get user's summaries
    const summaries = await getUserSummaries(user.id);

    // Transform summaries to match dashboard expectations
    const transformedSummaries = summaries.map(summary => {
      let slides = [];
      try {
        // Try to parse the JSON, if it fails, use an empty array
        slides = summary.summary_text ? JSON.parse(summary.summary_text) : [];
      } catch (error) {
        console.error(`Failed to parse summary_text for summary ID ${summary.id}:`, error);
        // If parsing fails, use an empty array
        slides = [];
      }

      return {
        id: summary.id,
        title: summary.title,
        slides: slides,
        metadata: {
          fileName: summary.file_name,
          pageCount: 0, // We don't store this separately, could be calculated
          wordCount: 0, // We don't store this separately, could be calculated
          processingTime: 0 // We don't store this separately
        },
        created_at: summary.created_at,
        original_filename: summary.file_name,
        file_size: 0, // We don't store this in pdf_summaries table
        upload_timestamp: summary.created_at
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        user,
        summaries: transformedSummaries,
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
