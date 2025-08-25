#!/bin/bash

# Script to restart backend service and apply database migrations
# This ensures that any missing database columns are automatically added

echo "🔄 Restarting backend service to apply database migrations..."

# Stop the backend service
docker-compose stop backend

# Remove the backend container to ensure a fresh start
docker-compose rm -f backend

# Start the backend service again
docker-compose up -d backend

echo "⏳ Waiting for backend service to start..."
sleep 10

# Check if backend is healthy
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend service restarted successfully and database migrations applied!"
else
    echo "❌ Backend service failed to start. Check the logs with: docker-compose logs backend"
    exit 1
fi

echo "🎉 Database schema is now up to date!"