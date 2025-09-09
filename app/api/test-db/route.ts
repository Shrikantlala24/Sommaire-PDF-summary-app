import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/**
 * API endpoint to test database connection
 */
export async function GET() {
  try {
    // Test the database connection with a simple query
    const result = await sql`SELECT NOW() as time`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      time: result[0]?.time || 'Unknown',
      driver: '@neondatabase/serverless'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
