const { Pool } = require('pg');
// Removed dotenv import as we're using Docker Compose environment variables

// Removed dotenv.config() as we're using Docker Compose environment variables

// Create a new pool instance
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'iacovici_user',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'iacovici_db',
  password: process.env.POSTGRES_PASSWORD || 'secure_password_change_in_production',
  port: process.env.POSTGRES_PORT || 5432,
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connection established');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};