-- Update site settings from environment variables
-- This script can be run after database creation to sync settings with environment variables

-- Update social media links from environment variables if they exist
UPDATE site_settings 
SET setting_value = COALESCE(NULLIF(CURRENT_SETTING('app.social_github', true), ''), setting_value)
WHERE setting_key = 'social_github';

UPDATE site_settings 
SET setting_value = COALESCE(NULLIF(CURRENT_SETTING('app.social_linkedin', true), ''), setting_value)
WHERE setting_key = 'social_linkedin';

UPDATE site_settings 
SET setting_value = COALESCE(NULLIF(CURRENT_SETTING('app.social_telegram', true), ''), setting_value)
WHERE setting_key = 'social_telegram';

-- Update Google Analytics ID if provided
UPDATE site_settings 
SET setting_value = COALESCE(NULLIF(CURRENT_SETTING('app.google_analytics_id', true), ''), setting_value)
WHERE setting_key = 'google_analytics_id';

-- Update site URL if provided
UPDATE site_settings 
SET setting_value = COALESCE(NULLIF(CURRENT_SETTING('app.site_url', true), ''), setting_value)
WHERE setting_key = 'site_url';

-- Print confirmation
SELECT 'Site settings updated from environment variables' as status;