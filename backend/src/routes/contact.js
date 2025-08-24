const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message, formType } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    const result = await query(
      'INSERT INTO contact_submissions (name, email, message, form_type, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, message, formType || 'contact', ipAddress, userAgent]
    );
    
    res.status(201).json({
      message: 'Contact submission received',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all contact submissions (admin only)
router.get('/submissions', async (req, res) => {
  try {
    // In a real implementation, you would check for admin authentication
    // For now, we'll just return all submissions
    
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