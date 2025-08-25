#!/bin/bash

# Coolify-optimized build script for Iacovici.it
echo "🚀 Starting Coolify build process..."

# Set build optimizations
export NODE_OPTIONS="--max-old-space-size=4096"
export GENERATE_SOURCEMAP=false
export CI=false
export DISABLE_ESLINT_PLUGIN=true

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --silent --no-audit --no-fund

# Build the application
echo "🔨 Building React application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build files are ready in ./build directory"