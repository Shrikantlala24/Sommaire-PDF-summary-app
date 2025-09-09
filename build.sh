#!/bin/bash
# Simplified build script for Render deployment

# Install dependencies with legacy-peer-deps flag
echo "Installing dependencies with --legacy-peer-deps..."
npm install --legacy-peer-deps

# Build Next.js application
echo "Building Next.js application..."
npm run build

# Exit with success
echo "Build completed successfully!"
exit 0
