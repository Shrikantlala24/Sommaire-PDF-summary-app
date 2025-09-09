import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = neon(process.env.DATABASE_URL!);

export { sql };

// Database types - Updated to match schema diagram
export interface DatabaseUser {
  id: string;
  email: string;
  full_name?: string;
  customer_id?: string;
  price_id?: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
  clerk_id?: string;
}

export interface DatabasePdfSummary {
  id: string;
  user_id: string;
  original_file_url: string;
  summary_text: string;
  status: string;
  title: string;
  file_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface DatabasePayment {
  id: string;
  amount: number;
  status: string;
  stripe_payment_id?: string;
  price_id?: string;
  user_email: string;
  created_at: Date;
  updated_at: Date;
}

// Initialize database tables - Updated to match schema diagram
export async function initDatabase() {
  try {
    // Users table (matches schema diagram)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        customer_id VARCHAR(255),
        price_id VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active',
        clerk_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // PDF Summaries table (matches schema diagram)  
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

    // Payments table (matches schema diagram)
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        amount INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL,
        stripe_payment_id VARCHAR(255),
        price_id VARCHAR(255),
        user_email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_pdf_summaries_user_id ON pdf_summaries(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_pdf_summaries_status ON pdf_summaries(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payments_user_email ON payments(user_email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)`;

    console.log('✅ Database tables initialized successfully with complete schema (users, pdf_summaries, payments)');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

// User operations - Updated for new schema
export async function createUser(email: string, fullName?: string, clerkId?: string) {
  const result = await sql`
    INSERT INTO users (email, full_name, clerk_id)
    VALUES (${email}, ${fullName}, ${clerkId})
    ON CONFLICT (email) DO UPDATE SET
      full_name = COALESCE(${fullName}, users.full_name),
      clerk_id = COALESCE(${clerkId}, users.clerk_id),
      updated_at = NOW()
    RETURNING *
  `;
  return result[0] as DatabaseUser;
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return result[0] as DatabaseUser | undefined;
}

export async function getUserById(id: string) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id}
  `;
  return result[0] as DatabaseUser | undefined;
}

// PDF Summary operations - Updated for new schema
export async function createPdfSummary(
  userId: string,
  originalFileUrl: string,
  summaryText: string,
  title: string,
  fileName: string,
  status: string = 'completed'
) {
  const result = await sql`
    INSERT INTO pdf_summaries (user_id, original_file_url, summary_text, title, file_name, status)
    VALUES (${userId}, ${originalFileUrl}, ${summaryText}, ${title}, ${fileName}, ${status})
    RETURNING *
  `;
  return result[0] as DatabasePdfSummary;
}

export async function getUserSummaries(userId: string) {
  const result = await sql`
    SELECT * FROM pdf_summaries 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return result as DatabasePdfSummary[];
}

export async function getSummaryById(id: string) {
  const result = await sql`
    SELECT * FROM pdf_summaries WHERE id = ${id}
  `;
  return result[0] as DatabasePdfSummary | undefined;
}

export async function deleteSummary(id: string) {
  const result = await sql`
    DELETE FROM pdf_summaries WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as DatabasePdfSummary | undefined;
}

// Additional functions needed by the application
export async function getUserByClerkId(clerkId: string) {
  const result = await sql`
    SELECT * FROM users WHERE clerk_id = ${clerkId}
  `;
  return result[0] as DatabaseUser | undefined;
}

// Note: Since we're using a simplified schema with pdf_summaries instead of separate documents/summaries,
// these functions work with the pdf_summaries table directly
export async function updateSummaryStatus(summaryId: string, status: string) {
  const result = await sql`
    UPDATE pdf_summaries 
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${summaryId}
    RETURNING *
  `;
  return result[0] as DatabasePdfSummary | undefined;
}

// Payment operations
export async function createPayment(
  amount: number,
  status: string,
  userEmail: string,
  stripePaymentId?: string,
  priceId?: string
) {
  const result = await sql`
    INSERT INTO payments (amount, status, user_email, stripe_payment_id, price_id)
    VALUES (${amount}, ${status}, ${userEmail}, ${stripePaymentId}, ${priceId})
    RETURNING *
  `;
  return result[0] as DatabasePayment;
}

export async function getPaymentsByUserEmail(userEmail: string) {
  const result = await sql`
    SELECT * FROM payments 
    WHERE user_email = ${userEmail}
    ORDER BY created_at DESC
  `;
  return result as DatabasePayment[];
}

export async function updatePaymentStatus(paymentId: string, status: string) {
  const result = await sql`
    UPDATE payments 
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${paymentId}
    RETURNING *
  `;
  return result[0] as DatabasePayment | undefined;
}
