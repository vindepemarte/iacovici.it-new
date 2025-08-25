# API Key Setup Guide

You're right - the API key setup wasn't completed. Here's how to set it up:

## Option 1: Run the Migration Script (Recommended)

1. **Connect to your database** and run the migration script:

```bash
# If using Docker Compose
docker-compose exec db psql -U iacovici_user -d iacovici_db -f /docker-entrypoint-initdb.d/add_api_key_migration.sql

# Or connect manually and paste the SQL
docker-compose exec db psql -U iacovici_user -d iacovici_db
```

2. **Then paste this SQL**:
```sql
-- Add api_key column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'api_key') THEN
        ALTER TABLE users ADD COLUMN api_key VARCHAR(255) UNIQUE;
        
        -- Create index for api_key
        CREATE INDEX IF NOT EXISTS idx_users_api_key ON users(api_key);
        
        -- Generate API key for existing admin user
        UPDATE users 
        SET api_key = 'iak_live_' || encode(gen_random_bytes(32), 'hex')
        WHERE email = 'admin@iacovici.it' AND api_key IS NULL;
        
        RAISE NOTICE 'API key column added successfully';
    ELSE
        RAISE NOTICE 'API key column already exists';
    END IF;
END $$;

-- Show the API key for the admin user
SELECT email, api_key FROM users WHERE email = 'admin@iacovici.it';
```

## Option 2: Recreate Database with New Schema

1. **Stop your containers**:
```bash
docker-compose down
```

2. **Remove the database volume** (⚠️ This will delete all data):
```bash
docker volume rm $(docker-compose config --volumes | grep db)
```

3. **Start containers again**:
```bash
docker-compose up -d
```

The new `schema.sql` will be used and will include the API key column.

## Option 3: Manual Database Update

Connect to your database and run:

```sql
-- Add the column
ALTER TABLE users ADD COLUMN api_key VARCHAR(255) UNIQUE;

-- Create index
CREATE INDEX idx_users_api_key ON users(api_key);

-- Generate API key for admin user
UPDATE users 
SET api_key = 'iak_live_' || encode(gen_random_bytes(32), 'hex')
WHERE email = 'admin@iacovici.it';

-- Check the result
SELECT email, api_key FROM users WHERE email = 'admin@iacovici.it';
```

## Get Your API Key

After running any of the above options, get your API key:

```sql
SELECT api_key FROM users WHERE email = 'admin@iacovici.it';
```

## Test Your API

Once you have your API key, test it:

```bash
# Replace YOUR_DOMAIN and YOUR_API_KEY
curl -X GET "https://YOUR_DOMAIN/api/n8n/templates" \
  -H "X-API-Key: YOUR_API_KEY"
```

## Admin Dashboard

The admin dashboard now has an API key section in Settings where you can:
- View your current API key
- Copy it to clipboard  
- Regenerate it if needed
- See available API endpoints

## Files Updated

- ✅ `schema.sql` - Added api_key column
- ✅ `add_api_key_migration.sql` - Migration script
- ✅ `AdminDashboard.js` - Added API key management UI
- ✅ `backend/src/routes/n8n-api.js` - API endpoints ready
- ✅ `CURL_EXAMPLES.md` - Complete examples
- ✅ `.env.n8n.example` - Configuration template

The API system is now complete and ready to use with n8n!