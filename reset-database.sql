-- Complete Database Reset Script for Coolify Deployment
-- This script forcefully recreates the entire database from scratch

-- Drop all tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS template_downloads CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- Drop any existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create templates table for n8n workflow templates
CREATE TABLE templates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    is_pro BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2) DEFAULT 0.00,
    workflow_data_json JSONB NOT NULL,
    tutorial_link VARCHAR(500),
    icon_name VARCHAR(100) DEFAULT 'workflow',
    download_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create blog_posts table for SEO articles and tutorials
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content_markdown TEXT NOT NULL,
    excerpt TEXT,
    author VARCHAR(100) DEFAULT 'Iacovici.it',
    publication_date DATE DEFAULT CURRENT_DATE,
    featured_image VARCHAR(500),
    tags TEXT[], -- Array of tags for categorization
    is_published BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_submissions table for lead tracking
CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    form_type VARCHAR(100) DEFAULT 'contact',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create template_downloads table for analytics
CREATE TABLE template_downloads (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
    email VARCHAR(255),
    ip_address INET,
    download_type VARCHAR(50) DEFAULT 'free', -- 'free' or 'purchased'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table for admin authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    api_key VARCHAR(255) UNIQUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create site_settings table for dynamic configuration
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string', -- 'string', 'json', 'boolean', 'number'
    is_public BOOLEAN DEFAULT TRUE, -- Whether this setting can be accessed publicly
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_is_pro ON templates(is_pro);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, publication_date DESC);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_api_key ON users(api_key);
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX idx_site_settings_public ON site_settings(is_public);

-- Insert sample free templates
INSERT INTO templates (title, description, category, is_pro, workflow_data_json, tutorial_link, icon_name, download_count, rating) VALUES 
(
    'Social Media Auto-Poster',
    'Automatically post content to multiple social media platforms (Twitter, LinkedIn, Facebook) from a single trigger. Includes content scheduling and hashtag management.',
    'Social Media Automation',
    FALSE,
    '{"nodes": [{"id": "trigger", "type": "webhook"}, {"id": "twitter", "type": "twitter"}, {"id": "linkedin", "type": "linkedin"}], "connections": {}}',
    '/blog/social-media-automation-tutorial',
    'share',
    2100,
    4.8
),
(
    'Email to CRM Sync',
    'Sync new email contacts directly to your CRM system. Automatically parse email signatures and extract contact information.',
    'CRM Integration',
    FALSE,
    '{"nodes": [{"id": "email_trigger", "type": "email"}, {"id": "parser", "type": "function"}, {"id": "crm", "type": "hubspot"}], "connections": {}}',
    '/blog/email-crm-integration-guide',
    'mail',
    1800,
    4.9
),
(
    'Advanced Lead Scoring System',
    'Sophisticated lead scoring automation with multi-channel data integration, behavioral tracking, and automated nurturing sequences.',
    'Marketing Automation',
    TRUE,
    '{"nodes": [], "connections": {}}',
    '/blog/advanced-lead-scoring',
    'target',
    650,
    4.9
),
(
    'E-commerce Inventory Management',
    'Complete inventory management system with low-stock alerts, automatic reordering, and multi-platform sync for Shopify, WooCommerce, and more.',
    'E-commerce',
    TRUE,
    '{"nodes": [], "connections": {}}',
    '/blog/ecommerce-inventory-automation',
    'package',
    420,
    4.8
);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content_markdown, excerpt, tags, seo_title, seo_description) VALUES
(
    'How to Automate Social Media Posting with n8n',
    'social-media-automation-tutorial',
    '# How to Automate Social Media Posting with n8n

Social media automation can save hours of manual work every week. In this comprehensive guide, we''ll build a complete automation that posts to Twitter, LinkedIn, and Facebook simultaneously.

## Prerequisites
- n8n instance (local or cloud)
- Social media API keys
- Basic understanding of webhooks

## Step 1: Setting Up the Webhook Trigger
First, we''ll create a webhook that will receive our content to post...

## Step 2: Content Processing
Next, we''ll add logic to format the content appropriately for each platform...

## Step 3: Multi-Platform Publishing
Finally, we''ll configure the social media nodes...

## Download the Template
Ready to implement this automation? [Download the free n8n template](/templates) and import it directly into your n8n instance.',
    'Learn how to create a powerful social media automation that posts to multiple platforms simultaneously using n8n workflows.',
    ARRAY['n8n', 'automation', 'social media', 'marketing'],
    'Complete Guide: Automate Social Media Posting with n8n - Free Template',
    'Step-by-step tutorial for creating social media automation with n8n. Includes free workflow template for Twitter, LinkedIn, and Facebook posting.'
),
(
    'Building AI-Powered Customer Support with n8n and OpenAI',
    'ai-customer-support-automation',
    '# Building AI-Powered Customer Support with n8n and OpenAI

Modern businesses need intelligent customer support that works 24/7. In this tutorial, we''ll build an AI-powered support system using n8n and OpenAI.

## The Power of AI in Customer Support
AI can handle 80% of routine customer inquiries, leaving your team to focus on complex issues that require human touch.

## Architecture Overview
Our system will include:
- Email/chat intake
- AI analysis and response generation  
- Escalation to human agents when needed
- Knowledge base integration

## Implementation Steps
Let''s build this step by step...

## Results and Benefits
Companies using this automation report 60% reduction in response time and 40% improvement in customer satisfaction.',
    'Create an intelligent customer support system that uses AI to handle routine inquiries and escalates complex issues to human agents.',
    ARRAY['AI', 'customer support', 'automation', 'OpenAI', 'n8n'],
    'AI Customer Support Automation: Complete n8n + OpenAI Guide',
    'Build intelligent customer support with n8n and OpenAI. Automated responses, smart escalation, and 24/7 availability for your business.'
);

-- Insert default admin user (password: admin123 - CHANGE THIS IN PRODUCTION!)
-- This is a bcrypt hash of 'admin123' for initial development setup
INSERT INTO users (email, password_hash, name, role, api_key) VALUES 
(
    'admin@iacovici.it',
    '$2a$10$42uwZyATRNtHZOJglb/IX./2Gx8ShCVRDCJcP6MTeaUSUs66DJ0vi',
    'Administrator',
    'admin',
    'iak_live_' || md5(random()::text || clock_timestamp()::text || 'iacovici_secret_salt')
);

-- Insert comprehensive site settings for dynamic configuration
INSERT INTO site_settings (setting_key, setting_value, setting_type, is_public, description) VALUES 
-- Company Information
('company_name', 'Iacovici.it', 'string', true, 'Company name displayed across the website'),
('company_tagline', 'AI & Automation Solutions for Business Growth', 'string', true, 'Company tagline for hero sections'),
('company_description', 'Transform your business with intelligent automation, AI integration, and modern web solutions. We help companies streamline operations and boost productivity through cutting-edge technology.', 'string', true, 'Detailed company description'),

-- Contact Information
('contact_email', 'admin@iacovici.it', 'string', true, 'Main contact email address'),
('contact_phone', '+39 378 0875700', 'string', true, 'Primary contact phone number'),
('whatsapp_number', '+393780875700', 'string', true, 'WhatsApp business number for direct contact'),
('contact_form_email', 'contact@iacovici.it', 'string', true, 'Email where contact forms are sent'),

-- Address Information
('company_address', '{"street": "Via della Tecnologia 123", "city": "Milan", "state": "Lombardy", "country": "Italy", "zip": "20100", "display": "Milan, Italy"}', 'json', true, 'Complete company address information'),

-- Social Media Links (these should be updated from environment variables)
('social_github', 'https://github.com/vindepemarte', 'string', true, 'GitHub profile URL'),
('social_linkedin', 'https://linkedin.com/in/alexandruiacovici', 'string', true, 'LinkedIn profile URL'),
('social_telegram', 'https://t.me/alexandruiacovici', 'string', true, 'Telegram contact handle'),
('social_twitter', '', 'string', true, 'Twitter profile URL (optional)'),
('social_youtube', '', 'string', true, 'YouTube channel URL (optional)'),
('social_instagram', '', 'string', true, 'Instagram profile URL (optional)'),

-- Business Information
('business_hours', '{"monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "9:00-18:00", "saturday": "10:00-14:00", "sunday": "closed"}', 'json', true, 'Business operating hours'),
('timezone', 'Europe/Rome', 'string', true, 'Business timezone'),
('vat_number', 'IT12345678901', 'string', true, 'VAT registration number'),
('tax_code', 'CVCDNL85R15F205X', 'string', true, 'Italian tax identification code'),

-- Services & Pricing
('consultation_price', '150', 'number', true, 'Hourly consultation rate in EUR'),
('free_consultation_duration', '30', 'number', true, 'Free consultation duration in minutes'),
('min_project_value', '2500', 'number', true, 'Minimum project value in EUR'),

-- Legal Information
('privacy_policy_last_updated', '2024-01-01', 'string', true, 'Privacy policy last update date'),
('terms_last_updated', '2024-01-01', 'string', true, 'Terms of service last update date'),
('cookies_policy_last_updated', '2024-01-01', 'string', true, 'Cookie policy last update date'),
('gdpr_compliance', 'true', 'boolean', true, 'GDPR compliance status'),

-- Website Configuration
('site_url', 'https://iacovici.it', 'string', true, 'Primary website URL'),
('site_logo', '/images/logo.png', 'string', true, 'Site logo path'),
('site_favicon', '/favicon.ico', 'string', true, 'Site favicon path'),
('calendar_booking_url', 'https://cal.com/iacovici', 'string', true, 'Calendar booking system URL'),
('google_analytics_id', '', 'string', false, 'Google Analytics tracking ID (private)'),

-- SEO Configuration
('site_keywords', 'automation, AI, n8n, business process automation, workflow automation, artificial intelligence, digital transformation', 'string', true, 'Primary SEO keywords'),
('default_og_image', '/images/og-default.jpg', 'string', true, 'Default Open Graph image'),

-- Email Configuration (mostly private)
('smtp_host', '', 'string', false, 'SMTP server hostname (private)'),
('smtp_port', '587', 'string', false, 'SMTP server port (private)'),
('smtp_user', '', 'string', false, 'SMTP username (private)'),
('email_from_name', 'Iacovici.it Team', 'string', true, 'Display name for outgoing emails'),
('email_signature', 'Best regards,\nAlexandru Iacovici\nIacovici.it - AI & Automation Solutions', 'string', true, 'Standard email signature'),

-- Feature Flags
('blog_enabled', 'true', 'boolean', true, 'Enable/disable blog functionality'),
('templates_enabled', 'true', 'boolean', true, 'Enable/disable templates section'),
('contact_form_enabled', 'true', 'boolean', true, 'Enable/disable contact forms'),
('analytics_enabled', 'true', 'boolean', true, 'Enable/disable analytics tracking'),
('maintenance_mode', 'false', 'boolean', true, 'Site maintenance mode status'),

-- Content Configuration
('hero_title', 'Transform Your Business with AI & Automation', 'string', true, 'Main hero section title'),
('hero_subtitle', 'Streamline operations, boost productivity, and scale your business with intelligent automation solutions and AI integration.', 'string', true, 'Hero section subtitle'),
('hero_cta_text', 'Start Your Automation Journey', 'string', true, 'Hero call-to-action button text'),
('hero_cta_link', '/contact', 'string', true, 'Hero call-to-action button link'),

-- Testimonials & Social Proof
('clients_count', '50', 'number', true, 'Number of clients served'),
('projects_completed', '125', 'number', true, 'Number of projects completed'),
('automation_hours_saved', '10000', 'number', true, 'Total automation hours saved for clients'),

-- API Configuration
('api_rate_limit', '1000', 'number', false, 'API requests per hour limit (private)'),
('api_version', 'v1', 'string', true, 'Current API version'),

-- Notification Settings
('notify_new_contact', 'true', 'boolean', false, 'Send notifications for new contacts (private)'),
('notify_new_download', 'false', 'boolean', false, 'Send notifications for template downloads (private)'),

-- Cache Settings
('cache_duration', '3600', 'number', false, 'Cache duration in seconds (private)'),
('enable_cdn', 'true', 'boolean', false, 'Enable CDN for static assets (private)');

-- Create triggers to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Database reset completed successfully!' as status;