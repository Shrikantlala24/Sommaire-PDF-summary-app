#!/usr/bin/env node

/**
 * Database initialization script for Sommaire
 * Run this once to set up your NeonDB database tables
 */

import { initDatabase } from '../lib/db.js';

async function main() {
  console.log('🚀 Initializing Sommaire database...');
  
  try {
    await initDatabase();
    console.log('✅ Database initialization completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Make sure your DATABASE_URL is set in .env.local');
    console.log('2. Start your development server: npm run dev');
    console.log('3. Your app is ready to use!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();
