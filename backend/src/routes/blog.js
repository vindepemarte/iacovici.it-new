const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, title, slug, excerpt, author, publication_date, featured_image, tags, is_published, seo_title, seo_description, created_at FROM blog_posts WHERE is_published = true ORDER BY publication_date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await query(
      'SELECT id, title, slug, content_markdown, excerpt, author, publication_date, featured_image, tags, is_published, seo_title, seo_description, created_at FROM blog_posts WHERE slug = $1 AND is_published = true',
      [slug]
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

module.exports = router;