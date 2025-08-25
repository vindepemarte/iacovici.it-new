const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

async function updateSettingsFromEnv() {
  console.log('🔄 Updating site settings from environment variables...');
  
  try {
    const client = await pool.connect();
    
    // Define environment variable mappings
    const envMappings = [
      { env: 'REACT_APP_SOCIAL_GITHUB', setting: 'social_github' },
      { env: 'REACT_APP_SOCIAL_LINKEDIN', setting: 'social_linkedin' },
      { env: 'REACT_APP_SOCIAL_TELEGRAM', setting: 'social_telegram' },
      { env: 'REACT_APP_GOOGLE_ANALYTICS_ID', setting: 'google_analytics_id' },
      { env: 'REACT_APP_SITE_URL', setting: 'site_url' },
      { env: 'SERVICE_FQDN_WEB', setting: 'site_url' }, // Fallback to Coolify URL
    ];
    
    let updatedCount = 0;
    
    for (const mapping of envMappings) {
      const envValue = process.env[mapping.env];
      
      if (envValue && envValue.trim() !== '') {
        try {
          // Update the setting if the environment variable exists and is not empty
          const result = await client.query(
            `UPDATE site_settings 
             SET setting_value = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE setting_key = $2 AND (setting_value != $1 OR setting_value IS NULL)`,
            [envValue.trim(), mapping.setting]
          );
          
          if (result.rowCount > 0) {
            console.log(`✅ Updated ${mapping.setting} from ${mapping.env}: ${envValue}`);
            updatedCount++;
          }
        } catch (err) {
          console.warn(`⚠️  Failed to update ${mapping.setting}:`, err.message);
        }
      }
    }
    
    // Special handling for contact_email if not set
    const contactEmail = process.env.EMAIL_FROM_ADDRESS;
    if (contactEmail && contactEmail.trim() !== '') {
      try {
        const result = await client.query(
          `UPDATE site_settings 
           SET setting_value = $1, updated_at = CURRENT_TIMESTAMP 
           WHERE setting_key = 'contact_email' AND (setting_value = 'admin@iacovici.it' OR setting_value IS NULL)`,
          [contactEmail.trim()]
        );
        
        if (result.rowCount > 0) {
          console.log(`✅ Updated contact_email from EMAIL_FROM_ADDRESS: ${contactEmail}`);
          updatedCount++;
        }
      } catch (err) {
        console.warn('⚠️  Failed to update contact_email:', err.message);
      }
    }
    
    client.release();
    
    if (updatedCount > 0) {
      console.log(`✅ Successfully updated ${updatedCount} site settings from environment variables`);
    } else {
      console.log('ℹ️  No site settings needed updating from environment variables');
    }
    
  } catch (err) {
    console.error('❌ Error updating site settings from environment variables:', err.message);
    throw err;
  }
}

module.exports = { updateSettingsFromEnv };

// Run immediately if this script is executed directly
if (require.main === module) {
  updateSettingsFromEnv()
    .then(() => {
      console.log('✅ Site settings update completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Site settings update failed:', err);
      process.exit(1);
    });
}