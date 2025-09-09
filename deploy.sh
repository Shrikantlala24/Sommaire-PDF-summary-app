#!/bin/bash

# Render deployment script for Sommaire

# Install dependencies with legacy peer deps to avoid conflicts
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Run database initialization if needed
echo "Checking database..."
node scripts/init-db.js

# Add clerk_id column if it doesn't exist
echo "Checking clerk_id column..."
node db/add-clerk-id.js

# Build the Next.js application
echo "Building application..."
npm run build

echo "Deployment preparation complete!"
