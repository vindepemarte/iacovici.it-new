const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { sendTemplateDownloadNotification } = require('../services/emailService');

// Get all templates
router.get('/', async (req, res) => {
  try {
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