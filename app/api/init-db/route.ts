import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, sql } from '@/lib/db';

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
    
    // Initialize database schema
    await initDatabase();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully with new schema (users, pdf_summaries)' 
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
