const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || 'postgres',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
});

async function initializeDatabase() {
  console.log('🔄 Checking database initialization...');
  
  try {
    // Check if site_settings table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'site_settings'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('📊 site_settings table does not exist. Running full database initialization...');
      
      // Embedded schema SQL (more reliable than file reading)
      const schemaSql = `
        -- Create templates table for n8n workflow templates
        CREATE TABLE IF NOT EXISTS templates (
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
        CREATE TABLE IF NOT EXISTS blog_posts (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            content_markdown TEXT NOT NULL,
            excerpt TEXT,
            author VARCHAR(100) DEFAULT 'Iacovici.it',
            publication_date DATE DEFAULT CURRENT_DATE,
            featured_image VARCHAR(500),
            tags TEXT[],
            is_published BOOLEAN DEFAULT TRUE,
            seo_title VARCHAR(255),
            seo_description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Create contact_submissions table for lead tracking
        CREATE TABLE IF NOT EXISTS contact_submissions (
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
        CREATE TABLE IF NOT EXISTS template_downloads (
            id SERIAL PRIMARY KEY,
            template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
            email VARCHAR(255),
            ip_address INET,
            download_type VARCHAR(50) DEFAULT 'free',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Create users table for admin authentication
        CREATE TABLE IF NOT EXISTS users (
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
        CREATE TABLE IF NOT EXISTS site_settings (
            id SERIAL PRIMARY KEY,
            setting_key VARCHAR(255) UNIQUE NOT NULL,
            setting_value TEXT,
            setting_type VARCHAR(50) DEFAULT 'string',
            is_public BOOLEAN DEFAULT TRUE,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
        CREATE INDEX IF NOT EXISTS idx_templates_is_pro ON templates(is_pro);
        CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
        CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, publication_date DESC);
        CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_api_key ON users(api_key);
        CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
        CREATE INDEX IF NOT EXISTS idx_site_settings_public ON site_settings(is_public);

        -- Insert sample templates
        INSERT INTO templates (title, description, category, is_pro, workflow_data_json, tutorial_link, icon_name, download_count, rating) VALUES 
        (
            'Social Media Auto-Poster',
            'Automatically post content to multiple social media platforms (Twitter, LinkedIn, Facebook) from a single trigger.',
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
        );

        -- Insert sample blog posts
        INSERT INTO blog_posts (title, slug, content_markdown, excerpt, tags, seo_title, seo_description) VALUES
        (
            'How to Automate Social Media Posting with n8n',
            'social-media-automation-tutorial',
            '# How to Automate Social Media Posting with n8n\n\nSocial media automation can save hours of manual work every week.',
            'Learn how to create a powerful social media automation that posts to multiple platforms simultaneously using n8n workflows.',
            ARRAY['n8n', 'automation', 'social media', 'marketing'],
            'Complete Guide: Automate Social Media Posting with n8n - Free Template',
            'Step-by-step tutorial for creating social media automation with n8n.'
        );

        -- Insert default admin user (password: admin123)
        INSERT INTO users (email, password_hash, name, role, api_key) VALUES 
        (
            'admin@iacovici.it',
            '$2a$10$42uwZyATRNtHZOJglb/IX./2Gx8ShCVRDCJcP6MTeaUSUs66DJ0vi',
            'Administrator',
            'admin',
            'iak_live_' || md5(random()::text || clock_timestamp()::text)
        ) ON CONFLICT (email) DO NOTHING;
      `;
      
      // Execute the schema
      await pool.query(schemaSql);
      
      console.log('✅ Database initialized successfully!');
    } else {
      console.log('✅ Database already initialized.');
      
      // Check if site_settings has data
      const settingsCount = await pool.query('SELECT COUNT(*) FROM site_settings');
      
      if (parseInt(settingsCount.rows[0].count) === 0) {
        console.log('📝 site_settings table exists but is empty. Adding default settings...');
        
        // Insert basic site settings
        await pool.query(`
          INSERT INTO site_settings (setting_key, setting_value, setting_type, is_public, description) VALUES 
          ('company_name', 'Iacovici.it', 'string', true, 'Company name'),
          ('company_tagline', 'AI & Automation Solutions for Business Growth', 'string', true, 'Company tagline'),
          ('contact_email', 'admin@iacovici.it', 'string', true, 'Main contact email'),
          ('social_github', 'https://github.com/vindepemarte', 'string', true, 'GitHub profile URL'),
          ('social_linkedin', 'https://linkedin.com/in/alexandruiacovici', 'string', true, 'LinkedIn profile URL'),
          ('social_telegram', 'https://t.me/alexandruiacovici', 'string', true, 'Telegram contact')
          ON CONFLICT (setting_key) DO NOTHING
        `);
        
        console.log('✅ Default site settings added.');
      }
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

module.exports = { initializeDatabase };