import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = neon(process.env.DATABASE_URL!);

export { sql };

// Database types
export interface DatabaseUser {
  id: string;
  clerk_id: string;
  email?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseDocument {
  id: string;
  user_id: string;
  original_filename: string;
  file_url: string;
  file_key: string;
  file_size: number;
  upload_timestamp: Date;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface DatabaseSummary {
  id: string;
  document_id: string;
  title: string;
  slides: any; // JSONB array of slides
  metadata: any; // JSONB metadata
  created_at: Date;
  updated_at: Date;
}

// Initialize database tables
export async function initDatabase() {
  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clerk_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Documents table
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        original_filename VARCHAR(500) NOT NULL,
        file_url TEXT NOT NULL,
        file_key VARCHAR(255) UNIQUE NOT NULL,
        file_size INTEGER NOT NULL,
        upload_timestamp TIMESTAMP DEFAULT NOW(),
        processing_status VARCHAR(20) DEFAULT 'pending'
      )
    `;

    // Summaries table
    await sql`
      CREATE TABLE IF NOT EXISTS summaries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        slides JSONB NOT NULL,
        metadata JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_documents_file_key ON documents(file_key)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_summaries_document_id ON summaries(document_id)`;

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

// User operations
export async function createUser(clerkId: string, email?: string) {
  const result = await sql`
    INSERT INTO users (clerk_id, email)
    VALUES (${clerkId}, ${email})
    ON CONFLICT (clerk_id) DO UPDATE SET
      email = ${email},
      updated_at = NOW()
    RETURNING *
  `;
  return result[0] as DatabaseUser;
}

export async function getUserByClerkId(clerkId: string) {
  const result = await sql`
    SELECT * FROM users WHERE clerk_id = ${clerkId}
  `;
  return result[0] as DatabaseUser | undefined;
}

// Document operations
export async function createDocument(
  userId: string,
  filename: string,
  fileUrl: string,
  fileKey: string,
  fileSize: number
) {
  const result = await sql`
    INSERT INTO documents (user_id, original_filename, file_url, file_key, file_size)
    VALUES (${userId}, ${filename}, ${fileUrl}, ${fileKey}, ${fileSize})
    RETURNING *
  `;
  return result[0] as DatabaseDocument;
}

export async function updateDocumentStatus(fileKey: string, status: string) {
  const result = await sql`
    UPDATE documents 
    SET processing_status = ${status}
    WHERE file_key = ${fileKey}
    RETURNING *
  `;
  return result[0] as DatabaseDocument;
}

export async function getUserDocuments(userId: string) {
  const result = await sql`
    SELECT d.*, s.id as summary_id, s.title as summary_title, s.created_at as summary_created_at
    FROM documents d
    LEFT JOIN summaries s ON d.id = s.document_id
    WHERE d.user_id = ${userId}
    ORDER BY d.upload_timestamp DESC
  `;
  return result;
}

// Summary operations
export async function createSummary(
  documentId: string,
  title: string,
  slides: any[],
  metadata: any
) {
  const result = await sql`
    INSERT INTO summaries (document_id, title, slides, metadata)
    VALUES (${documentId}, ${title}, ${JSON.stringify(slides)}, ${JSON.stringify(metadata)})
    RETURNING *
  `;
  return result[0] as DatabaseSummary;
}

export async function getSummaryByDocumentId(documentId: string) {
  const result = await sql`
    SELECT * FROM summaries WHERE document_id = ${documentId}
  `;
  return result[0] as DatabaseSummary | undefined;
}

export async function getUserSummaries(userId: string) {
  const result = await sql`
    SELECT s.*, d.original_filename, d.file_size, d.upload_timestamp
    FROM summaries s
    JOIN documents d ON s.document_id = d.id
    WHERE d.user_id = ${userId}
    ORDER BY s.created_at DESC
  `;
  return result;
}
