const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// Removed dotenv import as we're using Docker Compose environment variables
const path = require('path');

// Removed dotenv.config() as we're using Docker Compose environment variables

// Import routes
const templateRoutes = require('./routes/templates');
const blogRoutes = require('./routes/blog');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const stripeRoutes = require('./routes/stripe');
const n8nApiRoutes = require('./routes/n8n-api');
const settingsRoutes = require('./routes/settings');

// Import database connection
const { pool } = require('./config/database');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://iacovici.it',
    'https://www.iacovici.it',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(morgan('combined'));
app.use(express.json());
// Special middleware for Stripe webhooks (needs raw body)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.static(path.join(__dirname, '../../public')));

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully');
  }
});

// Routes
app.use('/api/templates', templateRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', stripeRoutes);
app.use('/api/n8n', n8nApiRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});