# Sommaire - AI-Powered PDF to Carousel Generator with Dashboard

A complete SaaS application that transforms PDF documents into interactive carousel presentations using AI, now with user dashboard and database persistence.

## 🎯 New Features

### ✅ **User Dashboard**
- View all your processed summaries
- Statistics and analytics
- Easy navigation to summaries
- New user detection and redirection

### ✅ **Database Integration (NeonDB)**
- Persistent storage for users, documents, and summaries
- User history and document tracking
- Proper data relationships and indexes

### ✅ **Improved UI/UX**
- Enhanced summary page design
- Better slide navigation with indicators
- Improved markdown rendering
- No more slide numbers in content

### ✅ **Better Content Chunking**
- Enhanced AI prompts for better content structure
- Longer, more detailed slides (200-300 words)
- Logical content sections without slide numbers
- Improved markdown formatting

## 🚀 Quick Setup

### 1. **Clone and Install**
```bash
git clone <your-repo-url>
cd Sommaire-PDF-summary-app
npm install
```

### 2. **Environment Setup**
Update your `.env.local` file with your NeonDB connection:

```bash
# NeonDB Connection
DATABASE_URL="postgresql://your-user:your-password@your-endpoint.neon.tech/your-database?sslmode=require&channel_binding=require"

# Existing environment variables (keep them as they are)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
UPLOADTHING_TOKEN=...
GEMINI_API_KEY=...
```

### 3. **Database Setup**
Initialize your NeonDB database:

```bash
# Option 1: Using the API (with server running)
npm run dev
npm run db:init

# Option 2: Direct script (server not needed)
npm run init-db
```

### 4. **Start Development**
```bash
npm run dev
```

## 🗄️ Database Schema

The application creates the following tables automatically:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents table  
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_filename VARCHAR(500) NOT NULL,
  file_url TEXT NOT NULL,
  file_key VARCHAR(255) UNIQUE NOT NULL,
  file_size INTEGER NOT NULL,
  upload_timestamp TIMESTAMP DEFAULT NOW(),
  processing_status VARCHAR(20) DEFAULT 'pending'
);

-- Summaries table
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slides JSONB NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔄 User Flow

### **New Users**
1. Sign up → Automatically redirected to Dashboard
2. Dashboard detects no summaries → Redirects to Upload page
3. Upload first PDF → Process → View summary
4. Future logins → Dashboard with history

### **Returning Users**
1. Sign in → Dashboard with summary history
2. View existing summaries or create new ones
3. All data persists across sessions

## 📊 Features Overview

### **Dashboard**
- **Statistics**: Total summaries, monthly count, total slides
- **Summary Cards**: Preview of all processed documents
- **Quick Actions**: View summaries, create new ones
- **Responsive Design**: Works on all devices

### **Enhanced Summary Page**
- **Better Design**: Cleaner layout with improved typography
- **Smooth Navigation**: Enhanced slide indicators and buttons
- **Improved Content**: No slide numbers, better chunking
- **Export Function**: Download as markdown file

### **AI Improvements**
- **Better Prompts**: More detailed instructions for content generation
- **Longer Slides**: 200-300 words per slide for more comprehensive content
- **Logical Structure**: Content flows naturally without artificial slide numbering
- **Enhanced Formatting**: Better use of markdown features

## 🛠️ Technical Architecture

### **Database Layer**
- **NeonDB**: Serverless PostgreSQL with auto-scaling
- **Connection Pooling**: Built-in PgBouncer support
- **Branching**: Database branching for development/testing

### **Authentication**
- **Clerk**: Complete user management
- **Middleware**: Automatic redirects based on user state
- **Protected Routes**: Dashboard and upload pages

### **File Processing**
- **UploadThing**: Cloud file storage
- **LangChain**: PDF processing and chunking
- **Gemini AI**: Advanced content summarization
- **MDX**: Markdown rendering with React components

### **State Management**
- **Database Persistence**: All data stored in NeonDB
- **Session State**: URL parameters for summary viewing
- **Client State**: React hooks for UI interactions

## 🚀 Deployment

### **Environment Variables**
Make sure to set these in production:
- `DATABASE_URL`: Your NeonDB connection string
- `CLERK_SECRET_KEY`: Clerk authentication
- `UPLOADTHING_TOKEN`: File upload service
- `GEMINI_API_KEY`: AI processing

### **Database Migration**
The app automatically creates tables on first run, but you can also run:
```bash
npm run init-db
```

## 📈 Performance Features

### **Database Optimizations**
- **Indexes**: Optimized queries with proper indexing
- **JSON Storage**: Efficient storage of slides and metadata
- **Cascading Deletes**: Proper cleanup of related data

### **Caching Strategy**
- **Static Generation**: Landing pages cached
- **Dynamic Content**: User-specific data fresh on each request
- **File Storage**: CDN-backed file delivery

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run init-db      # Initialize database tables
npm run db:init      # Initialize via API (requires running server)

# Code Quality
npm run lint         # Run ESLint
```

## 🎨 UI Components

### **Dashboard Components**
- Statistics cards with icons
- Summary preview cards
- Empty state handling
- Loading states

### **Summary Components**
- Enhanced carousel with smooth transitions
- Improved slide indicators
- Better typography and spacing
- Responsive design

## 🔐 Security Features

- **Authentication**: Clerk-based user management
- **Authorization**: Route-level protection
- **Data Isolation**: User-specific data access
- **File Validation**: PDF-only uploads with size limits

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Great experience on tablets
- **Desktop Enhanced**: Full features on desktop
- **Dark Mode**: Complete dark theme support

---

## 🎉 Ready to Use!

Your Sommaire application now includes:
- ✅ Complete user dashboard
- ✅ Database persistence with NeonDB
- ✅ Enhanced AI content generation
- ✅ Improved UI/UX design
- ✅ Better content chunking
- ✅ Comprehensive user management

Start building your PDF summary collection today! 🚀
