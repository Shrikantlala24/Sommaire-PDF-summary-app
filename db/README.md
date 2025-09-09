# Sommaire Database Setup

This directory contains the database schema and migration scripts for the Sommaire application.

## Setup Instructions

### 1. Set Up Environment Variables

Ensure your `.env.local` file contains the correct database connection string:

```
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

You can get this connection string from your Neon dashboard.

### 2. Run the Migration

#### Option 1: Using npm script (recommended)

```bash
npm run db:migrate
```

#### Option 2: Using PowerShell directly

```powershell
./scripts/migrate-db.ps1
```

#### Option 3: Using Node.js directly

```bash
node scripts/migrate-db.js
```

## Schema Overview

The database consists of two main tables:

1. **users** - Stores user information
   - `id` - UUID primary key
   - `email` - User's email (unique)
   - `full_name` - User's full name
   - `customer_id` - Payment provider customer ID (for future use)
   - `price_id` - Subscription price ID (for future use)
   - `status` - User status ('active', 'inactive')
   - `created_at` - Timestamp when user was created
   - `updated_at` - Timestamp when user was last updated

2. **pdf_summaries** - Stores PDF summary information
   - `id` - UUID primary key
   - `user_id` - Foreign key to users table
   - `original_file_url` - URL to the original PDF file
   - `summary_text` - The summarized content
   - `status` - Summary status ('pending', 'completed', 'failed')
   - `title` - Summary title
   - `file_name` - Original file name
   - `created_at` - Timestamp when summary was created
   - `updated_at` - Timestamp when summary was last updated

## Database Connection

The application uses the `@neondatabase/serverless` driver to connect to Neon's serverless PostgreSQL database.

## Testing the Connection

You can test your database connection by running:

```bash
npm run db:test
```

This will verify that your database connection is working properly.
