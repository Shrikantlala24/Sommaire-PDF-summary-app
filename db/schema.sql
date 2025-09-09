-- Sommaire Database Schema for NeonDB (PostgreSQL)
-- Version: 1.0
-- Date: September 9, 2025
-- Language: PostgreSQL

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean reset)
DROP TABLE IF EXISTS pdf_summaries CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
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
);

-- Create pdf_summaries table
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
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);
CREATE INDEX IF NOT EXISTS idx_pdf_summaries_user_id ON pdf_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_summaries_status ON pdf_summaries(status);

-- Insert a test user (optional)
-- INSERT INTO users (email, full_name, status) 
-- VALUES ('test@example.com', 'Test User', 'active');

-- Log completion
SELECT 'Schema creation completed successfully!' as status;
