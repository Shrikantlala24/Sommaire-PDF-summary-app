# Database Schema and Setup

## Overview

Sommaire uses a PostgreSQL database hosted on Neon, a serverless database platform. The database stores user information and PDF summaries.

## Schema

The database has two main tables:

### Users Table

```sql
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
```

### PDF Summaries Table

```sql
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
```

## Indexes

For performance optimization, the following indexes are created:

```sql
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);
CREATE INDEX IF NOT EXISTS idx_pdf_summaries_user_id ON pdf_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_summaries_status ON pdf_summaries(status);
```

## Setup

1. Create a Neon account and project at https://console.neon.tech/
2. Get your database connection string from the Neon console
3. Add your connection string to the `.env.local` file:

```
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

4. Initialize the database by running the following command:

```
npm run db:init
```

or using PowerShell:

```
./scripts/init-db.ps1
```

## Testing the Connection

You can test your database connection by running:

```
npm run db:test
```

or using PowerShell:

```
./scripts/test-db.ps1
```
