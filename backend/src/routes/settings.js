const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Get all public site settings (no authentication required)
router.get('/public', async (req, res) => {
  try {
    console.log('📝 Fetching public site settings...');
    const result = await query(
      'SELECT setting_key, setting_value, setting_type FROM site_settings WHERE is_public = true ORDER BY setting_key'
    );
    
    console.log('📊 Found', result.rows.length, 'public settings');
    
    // Transform results into key-value pairs with proper type casting
    const settings = {};
    result.rows.forEach(row => {
      let value = row.setting_value;
      
      // Type casting based on setting_type
      if (row.setting_type === 'json' && value) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          console.warn(`Failed to parse JSON for setting ${row.setting_key}:`, e);
        }
      } else if (row.setting_type === 'boolean') {
        value = value === 'true';
      } else if (row.setting_type === 'number') {
        value = parseFloat(value);
      }
      
      settings[row.setting_key] = value;
    });
    
    console.log('✅ Returning settings:', Object.keys(settings));
    res.json(settings);
  } catch (err) {
    console.error('❌ Error fetching public settings:', err);
    console.error('Database error details:', err.message);
    res.status(500).json({ error: 'Database connection error: ' + err.message });
  }
});

// Get all site settings (admin only)
router.get('/', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const result = await query(
      'SELECT id, setting_key, setting_value, setting_type, is_public, description, created_at, updated_at FROM site_settings ORDER BY setting_key'
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific setting by key
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const result = await query(
      'SELECT setting_key, setting_value, setting_type, is_public FROM site_settings WHERE setting_key = $1',
      [key]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    const setting = result.rows[0];
    let value = setting.setting_value;
    
    // Type casting
    if (setting.setting_type === 'json' && value) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.warn(`Failed to parse JSON for setting ${key}:`, e);
      }
    } else if (setting.setting_type === 'boolean') {
      value = value === 'true';
    } else if (setting.setting_type === 'number') {
      value = parseFloat(value);
    }
    
    res.json({
      key: setting.setting_key,
      value: value,
      type: setting.setting_type,
      isPublic: setting.is_public
    });
  } catch (err) {
    console.error('Error fetching setting:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update or create a setting (admin only)
router.put('/:key', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const { key } = req.params;
    const { value, type = 'string', isPublic = true, description } = req.body;
    
    // Convert value to string for storage
    let stringValue = value;
    if (type === 'json') {
      stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    } else if (type === 'boolean') {
      stringValue = value ? 'true' : 'false';
    } else {
      stringValue = String(value);
    }
    
    // Use UPSERT (INSERT ... ON CONFLICT)
    const result = await query(
      `INSERT INTO site_settings (setting_key, setting_value, setting_type, is_public, description)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (setting_key) 
       DO UPDATE SET 
         setting_value = EXCLUDED.setting_value,
         setting_type = EXCLUDED.setting_type,
         is_public = EXCLUDED.is_public,
         description = EXCLUDED.description,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [key, stringValue, type, isPublic, description]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating setting:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk update settings (admin only)
router.put('/', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const { settings } = req.body;
    
    if (!Array.isArray(settings)) {
      return res.status(400).json({ error: 'Settings must be an array' });
    }
    
    const results = [];
    
    // Process each setting
    for (const setting of settings) {
      const { key, value, type = 'string', isPublic = true, description } = setting;
      
      if (!key) {
        continue;
      }
      
      // Convert value to string for storage
      let stringValue = value;
      if (type === 'json') {
        stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      } else if (type === 'boolean') {
        stringValue = value ? 'true' : 'false';
      } else {
        stringValue = String(value);
      }
      
      const result = await query(
        `INSERT INTO site_settings (setting_key, setting_value, setting_type, is_public, description)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (setting_key) 
         DO UPDATE SET 
           setting_value = EXCLUDED.setting_value,
           setting_type = EXCLUDED.setting_type,
           is_public = EXCLUDED.is_public,
           description = EXCLUDED.description,
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [key, stringValue, type, isPublic, description]
      );
      
      results.push(result.rows[0]);
    }
    
    res.json(results);
  } catch (err) {
    console.error('Error bulk updating settings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a setting (admin only)
router.delete('/:key', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const { key } = req.params;
    
    const result = await query(
      'DELETE FROM site_settings WHERE setting_key = $1 RETURNING *',
      [key]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json({ message: 'Setting deleted successfully', setting: result.rows[0] });
  } catch (err) {
    console.error('Error deleting setting:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;