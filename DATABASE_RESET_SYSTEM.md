# Database Reset System for Coolify Deployment

This document explains the database reset system implemented to ensure that the database is completely recreated from scratch on every Coolify deployment.

## Overview

The system forces a complete database recreation on every deployment, solving the issue where database tables weren't being created properly in Coolify. This approach ensures that:

1. All tables are created fresh on every deployment
2. Site settings are populated with current environment variables
3. Sample data is inserted for immediate functionality
4. Social media buttons and dynamic content work correctly

## Files Involved

### 1. `reset-database.sql`
- **Purpose**: Complete database schema and data reset script
- **What it does**:
  - Drops all existing tables and functions
  - Recreates all tables from scratch
  - Inserts sample templates and blog posts
  - Creates default admin user (username: admin@iacovici.it, password: admin123)
  - Populates comprehensive site settings with default values
  - Creates all necessary indexes and triggers

### 2. `reset-db.sh`
- **Purpose**: Shell script that forces database recreation
- **What it does**:
  - Waits for PostgreSQL to be ready
  - Drops the entire database if it exists
  - Creates a fresh database
  - Executes the reset-database.sql script
  - Updates site settings with current environment variables
  - Provides detailed logging of the process

### 3. `backend/src/utils/updateSettingsFromEnv.js`
- **Purpose**: Node.js utility to sync settings with environment variables
- **What it does**:
  - Updates site settings from environment variables when backend starts
  - Maps Coolify environment variables to database settings
  - Handles social media URLs, site URLs, and contact information
  - Provides fallbacks and error handling

### 4. Updated `docker-compose.yml`
- **Purpose**: Orchestrates the database reset process
- **What it adds**:
  - `db-reset` service that runs on every deployment
  - Proper service dependencies to ensure reset completes before app starts
  - Environment variable passing to the reset service
  - One-time execution with `restart: "no"`

## How It Works

### Deployment Flow

1. **PostgreSQL Service Starts**: The `postgres` service starts and becomes healthy
2. **Database Reset Runs**: The `db-reset` service executes and:
   - Connects to PostgreSQL
   - Drops the existing database completely
   - Creates a fresh database
   - Runs the complete schema and data script
   - Updates settings with environment variables
   - Exits successfully
3. **Backend Starts**: The `backend` service waits for both `postgres` health and `db-reset` completion
4. **Frontend Starts**: The `web` service waits for both `postgres` health and `db-reset` completion
5. **Settings Sync**: When backend starts, it additionally syncs settings with environment variables

### Environment Variable Mapping

The system automatically maps Coolify environment variables to database settings:

| Environment Variable | Database Setting | Description |
|---------------------|------------------|-------------|
| `REACT_APP_SOCIAL_GITHUB` | `social_github` | GitHub profile URL |
| `REACT_APP_SOCIAL_LINKEDIN` | `social_linkedin` | LinkedIn profile URL |
| `REACT_APP_SOCIAL_TELEGRAM` | `social_telegram` | Telegram contact handle |
| `SERVICE_FQDN_WEB` | `site_url` | Primary website URL |
| `EMAIL_FROM_ADDRESS` | `contact_email` | Contact email address |

## Benefits

### ✅ Advantages

1. **Guaranteed Fresh Database**: Every deployment starts with a clean, properly structured database
2. **Environment Variable Sync**: Social media buttons and dynamic content automatically update
3. **No Manual Intervention**: Completely automated process
4. **Consistent State**: No database migration issues or partial updates
5. **Easy Development**: Developers can test with fresh data every deployment
6. **Coolify Compatible**: Designed specifically for Coolify's SERVICE_FQDN_* variables

### ⚠️ Considerations

1. **Data Loss**: ALL existing data is destroyed on every deployment
2. **Performance**: Database reset adds ~10-30 seconds to deployment time
3. **Temporary Solution**: Should be removed once the database is stable

## Security Notes

### Default Admin Credentials
- **Username**: admin@iacovici.it
- **Password**: admin123
- **⚠️ IMPORTANT**: Change this password immediately after first login in production!

### Generated API Key
- A unique API key is generated for the admin user on each reset
- The key uses a secure random generation method with salting

## Monitoring and Troubleshooting

### Checking Reset Status

You can monitor the database reset process in Coolify logs:

```bash
# Look for these log messages:
🔄 Starting database reset process...
⏳ Waiting for PostgreSQL to be ready...
✅ PostgreSQL is ready!
🗑️ Dropping existing database 'iacovici_db' if it exists...
🆕 Creating fresh database 'iacovici_db'...
📊 Executing database schema and data reset...
🔧 Updating site settings from environment variables...
✅ Database reset completed successfully!
```

### Common Issues

1. **Permission Errors**: Ensure PostgreSQL environment variables are correctly set
2. **Connection Timeouts**: The script waits for PostgreSQL to be ready, but very slow systems might need adjustment
3. **Environment Variables Not Updating**: Check that the variables are properly set in Coolify

### Verifying Success

After deployment, verify the system works by:

1. Checking that the frontend loads without localhost:3001 errors
2. Verifying social media buttons show correct URLs
3. Confirming you can access the admin panel at `/admin`
4. Testing that site settings API returns proper values at `/api/settings/public`

## Removal Instructions

Once the database is stable and working correctly:

1. Remove the `db-reset` service from `docker-compose.yml`
2. Remove dependencies on `db-reset` from other services
3. Add back the normal PostgreSQL initialization:
   ```yaml
   volumes:
     - 'iacovici_postgresql_data_v2:/var/lib/postgresql/data'
     - './schema.sql:/docker-entrypoint-initdb.d/01-schema.sql'
   ```
4. Delete the reset files: `reset-database.sql`, `reset-db.sh`
5. Keep the `updateSettingsFromEnv.js` utility for ongoing environment variable sync

## Support

If you encounter issues with the database reset system:

1. Check Coolify deployment logs for error messages
2. Verify environment variables are properly set
3. Ensure PostgreSQL service is healthy before reset runs
4. Check that the reset script files are properly mounted in the container