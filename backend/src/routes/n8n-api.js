const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

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
      icon_name
    } = req.body;
    
    const result = await query(
      `INSERT INTO templates (title, description, category, is_pro, price, workflow_data_json, tutorial_link, icon_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, category || 'General', is_pro || false, price || 0, workflow_data_json, tutorial_link, icon_name || 'workflow']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
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
    
    const result = await query(
      `INSERT INTO blog_posts (title, slug, content_markdown, excerpt, author, publication_date, featured_image, tags, is_published, seo_title, seo_description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [title, slug, content_markdown, excerpt, author || 'Iacovici.it', publication_date || new Date(), featured_image, tags, is_published !== false, seo_title, seo_description]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
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
    const result = await query(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
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
    console.error(err);
    res.status(500).json({ error: 'Server error' });
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