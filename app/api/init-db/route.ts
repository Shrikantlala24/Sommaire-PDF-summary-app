import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/**
 * API endpoint to initialize the database schema
 * POST /api/init-db
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Initializing database schema...');
    
    // Test database connection first
    try {
      const testResult = await sql`SELECT NOW()`;
      console.log('✅ Database connection successful:', testResult[0]);
    } catch (connError) {
      console.error('❌ Database connection failed:', connError);
      return NextResponse.json({
        success: false,
        error: 'Database connection failed: ' + (connError instanceof Error ? connError.message : String(connError))
      }, { status: 500 });
    }
    
    // Add clerk_id column if it doesn't exist
    try {
      await sql`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS clerk_id VARCHAR(255)
      `;
      console.log('✅ Added clerk_id column to users table');
    } catch (error) {
      console.error('❌ Error adding clerk_id column:', error);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully with clerk_id column added' 
    });
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handler for GET requests (for testing the endpoint)
export async function GET() {
  return NextResponse.json({ 
    status: 'Available',
    message: 'Use POST to initialize the database'
  });
}
