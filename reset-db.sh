#!/bin/bash

# Database Reset Script for Coolify Deployment
# This script forces a complete database recreation on every deployment

set -e  # Exit on any error

echo "🔄 Starting database reset process..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "postgres" -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping for 2 seconds"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Drop the existing database if it exists
echo "🗑️  Dropping existing database '$POSTGRES_DB' if it exists..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "postgres" -c "DROP DATABASE IF EXISTS \"$POSTGRES_DB\";"

# Create a fresh database
echo "🆕 Creating fresh database '$POSTGRES_DB'..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "postgres" -c "CREATE DATABASE \"$POSTGRES_DB\";"

# Execute the database reset script
echo "📊 Executing database schema and data reset..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/reset-database.sql

# Update settings with environment variables if they exist
echo "🔧 Updating site settings from environment variables..."
if [ ! -z "$REACT_APP_SOCIAL_GITHUB" ]; then
    PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "UPDATE site_settings SET setting_value = '$REACT_APP_SOCIAL_GITHUB' WHERE setting_key = 'social_github';"
fi

if [ ! -z "$REACT_APP_SOCIAL_LINKEDIN" ]; then
    PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "UPDATE site_settings SET setting_value = '$REACT_APP_SOCIAL_LINKEDIN' WHERE setting_key = 'social_linkedin';"
fi

if [ ! -z "$REACT_APP_SOCIAL_TELEGRAM" ]; then
    PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "UPDATE site_settings SET setting_value = '$REACT_APP_SOCIAL_TELEGRAM' WHERE setting_key = 'social_telegram';"
fi

if [ ! -z "$SERVICE_FQDN_WEB" ]; then
    PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "UPDATE site_settings SET setting_value = '$SERVICE_FQDN_WEB' WHERE setting_key = 'site_url';"
fi

echo "✅ Database reset completed successfully!"
echo "🚀 Database '$POSTGRES_DB' is ready with fresh schema and data!"

# Keep the container running if this is used as an init container
# or exit successfully if used as a one-time script
if [ "$1" = "--keep-running" ]; then
    echo "🔄 Keeping container running as requested..."
    tail -f /dev/null
else
    echo "✅ Database reset script completed. Container will exit."
    exit 0
fi