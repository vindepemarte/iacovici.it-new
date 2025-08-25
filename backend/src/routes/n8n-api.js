const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Helper function to generate URL-friendly slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
};

// Helper function to validate required fields
const validateRequired = (fields, data) => {
  const missing = fields.filter(field => !data[field] || data[field].toString().trim() === '');
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

// Helper function to validate JSON
const validateJSON = (jsonString, fieldName) => {
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error(`Invalid JSON in ${fieldName}: ${err.message}`);
  }
};

// Middleware to authenticate API key
const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }
    
    const result = await query(
      'SELECT id, email, name, role FROM users WHERE api_key = $1 AND is_active = true',
      [apiKey]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error('API key authentication error:', err);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Apply authentication middleware to all routes
router.use(authenticateApiKey);

// Templates API endpoints
router.get('/templates', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM templates ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/templates', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      is_pro,
      price,
      workflow_data_json,
      tutorial_link,
      icon_name,
      seo_title,
      seo_description
    } = req.body;
    
    // Validate required fields
    validateRequired(['title', 'description', 'workflow_data_json'], req.body);
    
    // Validate and parse workflow JSON
    const workflowData = validateJSON(workflow_data_json, 'workflow_data_json');
    
    // Validate price if pro template
    if (is_pro && (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0)) {
      return res.status(400).json({ error: 'Pro templates must have a valid price greater than 0' });
    }
    
    // Validate URL if tutorial link provided
    if (tutorial_link && !tutorial_link.match(/^https?:\/\/.+/)) {
      return res.status(400).json({ error: 'Tutorial link must be a valid URL' });
    }
    
    const result = await query(
      `INSERT INTO templates (title, description, category, is_pro, price, workflow_data_json, tutorial_link, icon_name, seo_title, seo_description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        title.trim(), 
        description.trim(), 
        category?.trim() || 'General', 
        is_pro || false, 
        is_pro ? parseFloat(price) || 0 : 0, 
        workflowData, 
        tutorial_link?.trim() || null, 
        icon_name?.trim() || 'workflow',
        seo_title?.trim() || null,
        seo_description?.trim() || null
      ]
    );
    
    res.status(201).json({
      message: 'Template created successfully',
      template: result.rows[0]
    });
  } catch (err) {
    console.error('Create template error:', err);
    if (err.message.includes('Missing required fields') || err.message.includes('Invalid JSON')) {
      return res.status(400).json({ error: err.message });
    }
    
    // Handle specific database errors
    if (err.code === '42703') {
      return res.status(500).json({ 
        error: 'Database schema outdated. The backend will automatically add missing columns on next restart.',
        details: 'Please restart the backend service to apply schema migrations.'
      });
    }
    
    res.status(500).json({ error: 'Failed to create template' });
  }
});

router.put('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      is_pro,
      price,
      workflow_data_json,
      tutorial_link,
      icon_name
    } = req.body;
    
    const result = await query(
      `UPDATE templates SET 
       title = $1, description = $2, category = $3, is_pro = $4, price = $5,
       workflow_data_json = $6, tutorial_link = $7, icon_name = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [title, description, category, is_pro, price, workflow_data_json, tutorial_link, icon_name, id]
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

router.delete('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM templates WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json({ message: 'Template deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Blog Posts API endpoints
router.get('/blog-posts', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM blog_posts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/blog-posts', async (req, res) => {
  try {
    const {
      title,
      slug,
      content_markdown,
      excerpt,
      author,
      publication_date,
      featured_image,
      tags,
      is_published,
      seo_title,
      seo_description
    } = req.body;
    
    // Validate required fields
    validateRequired(['title', 'content_markdown', 'excerpt'], req.body);
    
    // Generate slug if not provided
    let finalSlug = slug?.trim();
    if (!finalSlug) {
      finalSlug = generateSlug(title);
    }
    
    // Ensure slug is unique
    const existingSlug = await query('SELECT id FROM blog_posts WHERE slug = $1', [finalSlug]);
    if (existingSlug.rows.length > 0) {
      const timestamp = Date.now();
      finalSlug = `${finalSlug}-${timestamp}`;
    }
    
    // Validate URL if featured image provided
    if (featured_image && !featured_image.match(/^https?:\/\/.+/)) {
      return res.status(400).json({ error: 'Featured image must be a valid URL' });
    }
    
    // Parse tags if provided as string
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    const result = await query(
      `INSERT INTO blog_posts (title, slug, content_markdown, excerpt, author, publication_date, featured_image, tags, is_published, seo_title, seo_description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        title.trim(), 
        finalSlug, 
        content_markdown.trim(), 
        excerpt.trim(), 
        author?.trim() || 'Iacovici.it', 
        publication_date || new Date(), 
        featured_image?.trim() || null, 
        parsedTags || [], 
        is_published !== false, 
        seo_title?.trim() || null, 
        seo_description?.trim() || null
      ]
    );
    
    res.status(201).json({
      message: 'Blog post created successfully',
      blog_post: result.rows[0]
    });
  } catch (err) {
    console.error('Create blog post error:', err);
    if (err.message.includes('Missing required fields')) {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Blog post with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

router.put('/blog-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      content_markdown,
      excerpt,
      author,
      publication_date,
      featured_image,
      tags,
      is_published,
      seo_title,
      seo_description
    } = req.body;
    
    const result = await query(
      `UPDATE blog_posts SET 
       title = $1, slug = $2, content_markdown = $3, excerpt = $4, author = $5,
       publication_date = $6, featured_image = $7, tags = $8, is_published = $9,
       seo_title = $10, seo_description = $11, updated_at = CURRENT_TIMESTAMP
       WHERE id = $12 RETURNING *`,
      [title, slug, content_markdown, excerpt, author, publication_date, featured_image, tags, is_published, seo_title, seo_description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/blog-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM blog_posts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Contact submissions API endpoints
router.get('/contact-submissions', async (req, res) => {
  try {
    const { page = 1, limit = 50, form_type, start_date, end_date } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [];
    let paramCount = 0;
    
    if (form_type) {
      paramCount++;
      whereClause += `WHERE form_type = $${paramCount}`;
      params.push(form_type);
    }
    
    if (start_date) {
      paramCount++;
      whereClause += whereClause ? ` AND created_at >= $${paramCount}` : `WHERE created_at >= $${paramCount}`;
      params.push(start_date);
    }
    
    if (end_date) {
      paramCount++;
      whereClause += whereClause ? ` AND created_at <= $${paramCount}` : `WHERE created_at <= $${paramCount}`;
      params.push(end_date);
    }
    
    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM contact_submissions ${whereClause}`,
      params
    );
    
    // Get paginated results
    params.push(limit, offset);
    const result = await query(
      `SELECT * FROM contact_submissions ${whereClause} ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      params
    );
    
    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });
  } catch (err) {
    console.error('Get contact submissions error:', err);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

router.get('/contact-submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'SELECT * FROM contact_submissions WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get contact submission error:', err);
    res.status(500).json({ error: 'Failed to fetch contact submission' });
  }
});

router.post('/contact-submissions', async (req, res) => {
  try {
    const {
      name,
      email,
      message,
      form_type,
      ip_address,
      user_agent
    } = req.body;
    
    // Validate required fields
    validateRequired(['name', 'email', 'message'], req.body);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const result = await query(
      `INSERT INTO contact_submissions (name, email, message, form_type, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        message.trim(),
        form_type?.trim() || 'contact',
        ip_address || null,
        user_agent || null
      ]
    );
    
    res.status(201).json({
      message: 'Contact submission created successfully',
      submission: result.rows[0]
    });
  } catch (err) {
    console.error('Create contact submission error:', err);
    if (err.message.includes('Missing required fields') || err.message.includes('Invalid email')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to create contact submission' });
  }
});

router.put('/contact-submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      message,
      form_type,
      status // Add status field for lead management
    } = req.body;
    
    // Validate required fields
    validateRequired(['name', 'email', 'message'], req.body);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const result = await query(
      `UPDATE contact_submissions SET 
       name = $1, email = $2, message = $3, form_type = $4, status = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        message.trim(),
        form_type?.trim() || 'contact',
        status?.trim() || 'new',
        id
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    res.json({
      message: 'Contact submission updated successfully',
      submission: result.rows[0]
    });
  } catch (err) {
    console.error('Update contact submission error:', err);
    if (err.message.includes('Missing required fields') || err.message.includes('Invalid email')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to update contact submission' });
  }
});

router.delete('/contact-submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM contact_submissions WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    res.json({ 
      message: 'Contact submission deleted successfully',
      deleted_submission: result.rows[0]
    });
  } catch (err) {
    console.error('Delete contact submission error:', err);
    res.status(500).json({ error: 'Failed to delete contact submission' });
  }
});

// Analytics endpoints
router.get('/analytics/dashboard', async (req, res) => {
  try {
    const [templatesCount, blogPostsCount, contactsCount, downloadsCount] = await Promise.all([
      query('SELECT COUNT(*) as count FROM templates'),
      query('SELECT COUNT(*) as count FROM blog_posts WHERE is_published = true'),
      query('SELECT COUNT(*) as count FROM contact_submissions'),
      query('SELECT COUNT(*) as count FROM template_downloads')
    ]);
    
    res.json({
      templates: parseInt(templatesCount.rows[0].count),
      blog_posts: parseInt(blogPostsCount.rows[0].count),
      contacts: parseInt(contactsCount.rows[0].count),
      downloads: parseInt(downloadsCount.rows[0].count)
    });
  } catch (err) {
    console.error('Dashboard analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
});

router.get('/analytics/templates', async (req, res) => {
  try {
    // Get top templates by downloads
    const topTemplates = await query(
      `SELECT id, title, category, download_count, rating, is_pro 
       FROM templates 
       ORDER BY download_count DESC 
       LIMIT 10`
    );
    
    // Get downloads by category
    const categoryStats = await query(
      `SELECT category, COUNT(*) as template_count, SUM(download_count) as total_downloads
       FROM templates 
       GROUP BY category 
       ORDER BY total_downloads DESC`
    );
    
    // Get recent downloads
    const recentDownloads = await query(
      `SELECT td.*, t.title, t.category
       FROM template_downloads td
       JOIN templates t ON td.template_id = t.id
       ORDER BY td.created_at DESC
       LIMIT 20`
    );
    
    res.json({
      top_templates: topTemplates.rows,
      category_stats: categoryStats.rows,
      recent_downloads: recentDownloads.rows
    });
  } catch (err) {
    console.error('Template analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch template analytics' });
  }
});

router.get('/analytics/blog', async (req, res) => {
  try {
    // Get blog post stats
    const blogStats = await query(
      `SELECT 
         COUNT(*) as total_posts,
         COUNT(*) FILTER (WHERE is_published = true) as published_posts,
         COUNT(*) FILTER (WHERE is_published = false) as draft_posts
       FROM blog_posts`
    );
    
    // Get posts by tag
    const tagStats = await query(
      `SELECT 
         unnest(tags) as tag, 
         COUNT(*) as post_count
       FROM blog_posts 
       WHERE is_published = true AND tags IS NOT NULL
       GROUP BY tag 
       ORDER BY post_count DESC
       LIMIT 10`
    );
    
    res.json({
      blog_stats: blogStats.rows[0],
      tag_stats: tagStats.rows
    });
  } catch (err) {
    console.error('Blog analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch blog analytics' });
  }
});

router.get('/analytics/leads', async (req, res) => {
  try {
    // Get lead stats by form type
    const leadStats = await query(
      `SELECT 
         form_type,
         COUNT(*) as submission_count,
         COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as recent_count
       FROM contact_submissions
       GROUP BY form_type
       ORDER BY submission_count DESC`
    );
    
    // Get leads by date (last 30 days)
    const leadsByDate = await query(
      `SELECT 
         DATE(created_at) as date,
         COUNT(*) as count
       FROM contact_submissions
       WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    );
    
    res.json({
      lead_stats: leadStats.rows,
      leads_by_date: leadsByDate.rows
    });
  } catch (err) {
    console.error('Lead analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch lead analytics' });
  }
});

// API key management
router.get('/user/api-key', async (req, res) => {
  try {
    const result = await query(
      'SELECT api_key FROM users WHERE id = $1',
      [req.user.id]
    );
    
    res.json({ api_key: result.rows[0].api_key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/user/regenerate-api-key', async (req, res) => {
  try {
    const newApiKey = 'iak_live_' + require('crypto').randomBytes(32).toString('hex');
    
    const result = await query(
      'UPDATE users SET api_key = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING api_key',
      [newApiKey, req.user.id]
    );
    
    res.json({ api_key: result.rows[0].api_key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;