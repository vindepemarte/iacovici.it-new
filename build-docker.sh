#!/bin/bash

# Docker build optimization script for Iacovici.it

echo "🚀 Starting optimized Docker build..."

# Set build arguments for better performance
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down --remove-orphans

# Remove old images to free up space
echo "🗑️  Removing old images..."
docker image prune -f

# Build with optimized settings
echo "🔨 Building with optimized settings..."
docker-compose build --no-cache --parallel

# Start the services
echo "🚀 Starting services..."
docker-compose up -d

# Show status
echo "✅ Build complete! Checking status..."
docker-compose ps

echo "🎉 Deployment complete!"
echo "📊 Check logs with: docker-compose logs -f"
echo "🔍 Check API key with: docker-compose exec postgres psql -U iacovici_user -d iacovici_db -c \"SELECT email, api_key FROM users WHERE email = 'admin@iacovici.it';\""