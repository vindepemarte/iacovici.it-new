const { Pool } = require('pg');
// Removed dotenv import as we're using Docker Compose environment variables

// Removed dotenv.config() as we're using Docker Compose environment variables

// Create a new pool instance with retry logic
const pool = new Pool({
  // Use DATABASE_URL if available (Coolify pattern), otherwise individual env vars
  connectionString: process.env.DATABASE_URL,
  user: process.env.POSTGRES_USER || 'iacovici_user',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'iacovici_db',
  password: process.env.POSTGRES_PASSWORD || 'secure_password_change_in_production',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  // Retry settings
  statement_timeout: 30000,
  query_timeout: 30000,
});

// Retry connection function
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting database connection (attempt ${i + 1}/${retries})...`);
      console.log('Database config:', {
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        port: process.env.POSTGRES_PORT,
      });
      
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Database connection established successfully');
      console.log('Connected to:', process.env.POSTGRES_DB, 'as', process.env.POSTGRES_USER);
      return result;
    } catch (err) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, err.message);
      
      if (i === retries - 1) {
        console.error('🚨 All database connection attempts failed');
        throw err;
      }
      
      console.log(`⏳ Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Start connection attempts
connectWithRetry().catch(err => {
  console.error('Failed to establish database connection:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};