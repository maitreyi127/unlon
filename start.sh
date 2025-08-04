#!/bin/bash

# Production startup script that ensures build files exist
# This handles the missing dist/index.js error during deployment

echo "🚀 Starting Unalon application..."

# Set production environment
export NODE_ENV=production

# Check if dist/index.js exists, build if not
if [ ! -f "dist/index.js" ]; then
    echo "📦 Build output not found, building application..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed"
        exit 1
    fi
    echo "✅ Build completed successfully"
fi

# Ensure server/public directory exists for static files
if [ ! -d "server/public" ] && [ -d "dist/public" ]; then
    echo "📁 Creating server/public directory..."
    cp -r dist/public server/public
fi

# Start the application
echo "🌟 Starting server..."
node dist/index.js