const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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
      
      // Read and execute schema.sql
      const schemaPath = path.join(__dirname, '../../schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
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