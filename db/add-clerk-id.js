// Use CommonJS style imports
const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');

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

async function addClerkIdColumn() {
  try {
    console.log('🔄 Adding clerk_id column to users table...');

    // Check if the column exists
    const checkColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'clerk_id'
    `;

    if (checkColumn.length === 0) {
      // Add clerk_id column if it doesn't exist
      await sql`
        ALTER TABLE users 
        ADD COLUMN clerk_id VARCHAR(255)
      `;
      console.log('✅ clerk_id column added successfully!');
    } else {
      console.log('✅ clerk_id column already exists.');
    }

    // Verify the column was added
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;

    console.log('📋 Current users table columns:');
    columns.forEach(col => {
      console.log(`   - ${col.column_name}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the function
addClerkIdColumn();
