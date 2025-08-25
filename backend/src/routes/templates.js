const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { sendTemplateDownloadNotification } = require('../services/emailService');

// Initialize database tables if they don't exist
const initializeTables = async () => {
  try {
    // Create templates table
    await query(`
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
      )
    `);

    // Create other essential tables
    await query(`
      CREATE TABLE IF NOT EXISTS template_downloads (
        id SERIAL PRIMARY KEY,
        template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
        email VARCHAR(255),
        ip_address INET,
        download_type VARCHAR(50) DEFAULT 'free',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
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
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        form_type VARCHAR(100) DEFAULT 'contact',
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if admin user exists, if not create it
    const existingUsers = await query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) === 0) {
      await query(`
        INSERT INTO users (email, password_hash, name, role) VALUES 
        (
          'admin@iacovici.it',
          '$2a$10$42uwZyATRNtHZOJglb/IX./2Gx8ShCVRDCJcP6MTeaUSUs66DJ0vi',
          'Administrator',
          'admin'
        )
      `);
      console.log('✅ Admin user created (admin@iacovici.it / admin123)');
    }

    // Check if templates exist, if not insert sample data
    const existingTemplates = await query('SELECT COUNT(*) FROM templates');
    if (parseInt(existingTemplates.rows[0].count) === 0) {
      await query(`
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
        )
      `);
      console.log('✅ Sample templates inserted');
    }

    console.log('✅ Database tables initialized successfully');
  } catch (err) {
    console.error('❌ Error initializing database tables:', err);
  }
};

// Get all templates
router.get('/', async (req, res) => {
  try {
    // Initialize tables on first request if needed
    await initializeTables();

    const result = await query(
      'SELECT id, title, description, category, is_pro, price, tutorial_link, icon_name, download_count, rating, created_at FROM templates ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get template by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT id, title, description, category, is_pro, price, workflow_data_json, tutorial_link, icon_name, download_count, rating, created_at FROM templates WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Track template download
router.post('/download', async (req, res) => {
  try {
    const { templateId, email, ipAddress, downloadType } = req.body;

    // Validate required fields
    if (!templateId || !email) {
      return res.status(400).json({ error: 'Template ID and email are required' });
    }

    // Initialize tables first
    await initializeTables();

    // Get template information
    const templateResult = await query(
      'SELECT title, price FROM templates WHERE id = $1',
      [templateId]
    );

    if (templateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const template = templateResult.rows[0];

    // Insert download record
    await query(
      'INSERT INTO template_downloads (template_id, email, ip_address, download_type) VALUES ($1, $2, $3, $4)',
      [templateId, email, ipAddress, downloadType]
    );

    // Update download count
    await query(
      'UPDATE templates SET download_count = download_count + 1 WHERE id = $1',
      [templateId]
    );

    // Send email notification
    const emailResult = await sendTemplateDownloadNotification(
      email,
      template.title,
      downloadType
    );

    if (!emailResult.success) {
      console.error('Failed to send email notification:', emailResult.error);
    }

    res.json({
      message: 'Download tracked successfully',
      emailSent: emailResult.success
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;