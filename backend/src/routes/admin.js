const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get total templates
    const templatesResult = await query('SELECT COUNT(*) as count FROM templates');
    const totalTemplates = parseInt(templatesResult.rows[0].count);
    
    // Get total blog posts
    const blogResult = await query('SELECT COUNT(*) as count FROM blog_posts');
    const totalBlogPosts = parseInt(blogResult.rows[0].count);
    
    // Get recent contact submissions
    const contactsResult = await query('SELECT COUNT(*) as count FROM contact_submissions WHERE created_at >= CURRENT_DATE - INTERVAL \'7 days\'');
    const recentContacts = parseInt(contactsResult.rows[0].count);
    
    res.json({
      totalTemplates,
      totalBlogPosts,
      recentContacts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get detailed analytics
router.get('/dashboard/analytics', async (req, res) => {
  try {
    // Get template download statistics
    const downloadStats = await query(`
      SELECT 
        t.title,
        t.category,
        t.is_pro,
        t.download_count,
        COUNT(td.id) as recent_downloads
      FROM templates t
      LEFT JOIN template_downloads td ON t.id = td.template_id 
        AND td.created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY t.id, t.title, t.category, t.is_pro, t.download_count
      ORDER BY t.download_count DESC
    `);
    
    // Get downloads by date (last 30 days)
    const downloadsByDate = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as downloads
      FROM template_downloads
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `);
    
    // Get top categories
    const topCategories = await query(`
      SELECT 
        category,
        COUNT(*) as template_count,
        SUM(download_count) as total_downloads
      FROM templates
      GROUP BY category
      ORDER BY total_downloads DESC
    `);
    
    // Get contact form statistics
    const contactStats = await query(`
      SELECT 
        form_type,
        COUNT(*) as submissions
      FROM contact_submissions
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY form_type
      ORDER BY submissions DESC
    `);
    
    res.json({
      downloadStats: downloadStats.rows,
      downloadsByDate: downloadsByDate.rows,
      topCategories: topCategories.rows,
      contactStats: contactStats.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all templates (admin)
router.get('/templates', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, title, description, category, is_pro, price, workflow_data_json, tutorial_link, icon_name, download_count, rating, created_at, updated_at FROM templates ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create or update template
router.post('/templates', async (req, res) => {
  try {
    const { id, title, description, category, isPro, price, workflowData, tutorialLink, iconName } = req.body;
    
    // Ensure workflowData is not null - provide default if missing
    const safeWorkflowData = workflowData || { nodes: [], connections: {} };
    
    let result;
    if (id) {
      // Update existing template
      result = await query(
        'UPDATE templates SET title = $1, description = $2, category = $3, is_pro = $4, price = $5, workflow_data_json = $6, tutorial_link = $7, icon_name = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
        [title, description, category, isPro, price, safeWorkflowData, tutorialLink, iconName, id]
      );
    } else {
      // Create new template
      result = await query(
        'INSERT INTO templates (title, description, category, is_pro, price, workflow_data_json, tutorial_link, icon_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [title, description, category, isPro, price, safeWorkflowData, tutorialLink, iconName]
      );
    }
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Template creation/update error:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Delete template
router.delete('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await query('DELETE FROM templates WHERE id = $1', [id]);
    
    res.json({ message: 'Template deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all blog posts (admin)
router.get('/blog-posts', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, title, slug, excerpt, author, publication_date, is_published, created_at FROM blog_posts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create or update blog post
router.post('/blog-posts', async (req, res) => {
  try {
    const { id, title, slug, contentMarkdown, excerpt, author, publicationDate, featuredImage, tags, isPublished, seoTitle, seoDescription } = req.body;
    
    let result;
    if (id) {
      // Update existing blog post
      result = await query(
        'UPDATE blog_posts SET title = $1, slug = $2, content_markdown = $3, excerpt = $4, author = $5, publication_date = $6, featured_image = $7, tags = $8, is_published = $9, seo_title = $10, seo_description = $11, updated_at = CURRENT_TIMESTAMP WHERE id = $12 RETURNING *',
        [title, slug, contentMarkdown, excerpt, author, publicationDate, featuredImage, tags, isPublished, seoTitle, seoDescription, id]
      );
    } else {
      // Create new blog post
      result = await query(
        'INSERT INTO blog_posts (title, slug, content_markdown, excerpt, author, publication_date, featured_image, tags, is_published, seo_title, seo_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [title, slug, contentMarkdown, excerpt, author, publicationDate, featuredImage, tags, isPublished, seoTitle, seoDescription]
      );
    }
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete blog post
router.delete('/blog-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await query('DELETE FROM blog_posts WHERE id = $1', [id]);
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get contact submissions
router.get('/contacts', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, email, message, form_type, created_at FROM contact_submissions ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;