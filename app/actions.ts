"use server";

import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import { getUserSummaries } from "@/lib/db";
import { getOrCreateUserFromClerk } from "@/lib/clerk-helpers";

// Initialize database connection
const sql = neon(process.env.DATABASE_URL!);

// Get user data and summaries - Updated for new schema
export async function getUserData() {
  try {
    // Get or create user using proper Clerk integration
    const { user } = await getOrCreateUserFromClerk();

    // Get user summaries
    const summaries = await getUserSummaries(user.id);

    return {
      success: true,
      data: {
        user,
        summaries,
        isNewUser: summaries.length === 0
      }
    };
  } catch (error) {
    console.error("Error in getUserData:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Get user summaries data - Updated for new schema
export async function getUserSummariesData() {
  try {
    // Get or create user using proper Clerk integration
    const { user } = await getOrCreateUserFromClerk();

    const summaries = await getUserSummaries(user.id);

    return {
      success: true,
      data: summaries
    };
  } catch (error) {
    console.error("Error in getUserSummariesData:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Generic database query function
export async function executeQuery(query: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Execute the query - NeonDB doesn't support parameterized queries with unsafe
    // For production, use the database service functions which use template literals
    const result = await sql.unsafe(query);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error executing query:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT version()`;
    
    return {
      success: true,
      data: {
        connected: true,
        version: result[0]?.version || "Unknown version"
      }
    };
  } catch (error) {
    console.error("Database connection test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed"
    };
  }
}

// Initialize database tables
export async function initializeDatabaseTables() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Create tables if they don't exist - Updated schema
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        customer_id VARCHAR(255),
        price_id VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS pdf_summaries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        original_file_url TEXT NOT NULL,
        summary_text TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'completed',
        title VARCHAR(500) NOT NULL,
        file_name VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_pdf_summaries_user_id ON pdf_summaries(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_pdf_summaries_status ON pdf_summaries(status)`;

    return {
      success: true,
      message: "Database tables initialized successfully"
    };
  } catch (error) {
    console.error("Error initializing database tables:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Initialization failed"
    };
  }
}
