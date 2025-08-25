const { Pool } = require('pg');
// Removed dotenv import as we're using Docker Compose environment variables

// Removed dotenv.config() as we're using Docker Compose environment variables

// Create a new pool instance
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'iacovici_user',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'iacovici_db',
  password: process.env.POSTGRES_PASSWORD || 'secure_password_change_in_production',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the connection with better error logging
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
    console.error('Database config:', {
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      port: process.env.POSTGRES_PORT,
      // Don't log password for security
    });
  } else {
    console.log('Database connection established successfully');
    console.log('Connected to:', process.env.POSTGRES_DB, 'as', process.env.POSTGRES_USER);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};