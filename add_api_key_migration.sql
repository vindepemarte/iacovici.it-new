-- Migration script to add API key support to existing database
-- Run this script if your database was created before the API key feature

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
        SET api_key = 'iak_live_' || md5(random()::text || clock_timestamp()::text)
        WHERE email = 'admin@iacovici.it' AND api_key IS NULL;
        
        RAISE NOTICE 'API key column added successfully';
    ELSE
        RAISE NOTICE 'API key column already exists';
    END IF;
END $$;

-- Show the API key for the admin user
SELECT email, api_key FROM users WHERE email = 'admin@iacovici.it';