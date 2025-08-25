-- Simple API key generation script that works with any PostgreSQL version
-- Run this after your database is created

-- First, ensure the api_key column exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS api_key VARCHAR(255) UNIQUE;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_users_api_key ON users(api_key);

-- Insert or update admin user with a simple API key
INSERT INTO users (email, password_hash, name, role, api_key) VALUES 
(
    'admin@iacovici.it',
    '$2a$10$42uwZyATRNtHZOJglb/IX./2Gx8ShCVRDCJcP6MTeaUSUs66DJ0vi',
    'Administrator',
    'admin',
    'iak_live_' || md5('iacovici_admin_' || extract(epoch from now())::text)
) 
ON CONFLICT (email) DO UPDATE SET 
    api_key = COALESCE(users.api_key, 'iak_live_' || md5('iacovici_admin_' || extract(epoch from now())::text)),
    password_hash = '$2a$10$42uwZyATRNtHZOJglb/IX./2Gx8ShCVRDCJcP6MTeaUSUs66DJ0vi',
    name = 'Administrator',
    role = 'admin';

-- Show the result
SELECT 'Admin user created/updated successfully!' as message;
SELECT email, api_key, role FROM users WHERE email = 'admin@iacovici.it';