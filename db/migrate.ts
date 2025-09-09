// Sommaire Database Schema Migration
// Version: 1.0
// Date: September 9, 2025

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get database connection string
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

// Initialize database connection
const sql = neon(DATABASE_URL);

async function runMigration() {
  try {
    console.log('🔄 Starting database migration...');

    // Create users table
    console.log('📋 Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        clerk_id VARCHAR(255),
        customer_id VARCHAR(255),
        price_id VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create pdf_summaries table
    console.log('📋 Creating pdf_summaries table...');
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
    console.log('📋 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_pdf_summaries_user_id ON pdf_summaries(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_pdf_summaries_status ON pdf_summaries(status)`;

    console.log('✅ Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
