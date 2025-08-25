# Iacovici.it - Professional Portfolio & Business Website

A modern, production-ready website built with React, Tailwind CSS, and PostgreSQL. Features automation templates, blog system, contact forms, and Stripe integration for digital product sales.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, React Router, and modern hooks
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Template Library**: n8n workflow templates with copy/import functionality 
- **Blog System**: SEO-optimized articles with markdown support
- **Contact Forms**: Lead generation with validation and backend integration
- **Stripe Integration**: Ready for digital product sales
- **Database Ready**: PostgreSQL schema with sample data
- **Docker Deployment**: Production-ready containerization
- **Coolify Compatible**: Optimized for VPS deployment

## 🏗️ Architecture

```
├── Frontend (React + Tailwind CSS)
├── Database (PostgreSQL)
└── Optional Backend API (Node.js/Express)
```

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for development)
- PostgreSQL (handled by Docker)

## 🚀 Quick Start

### 1. Clone & Setup

```bash
git clone <repository-url>
cd iacovici.it-new
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
POSTGRES_DB=iacovici_db
POSTGRES_USER=iacovici_user
POSTGRES_PASSWORD=your_secure_password_here

# API Configuration (optional)
REACT_APP_API_URL=http://localhost:3001/api

# Stripe Configuration (for pro templates)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Email Configuration (for contact forms)
EMAIL_SERVICE_API_KEY=your_email_service_key
```

### 3. Database Setup

The PostgreSQL database will be automatically initialized with the schema when you start the containers:

```bash
docker-compose up -d db
```

The database container will:
- Create the `iacovici_db` database
- Run the `schema.sql` file to create tables
- Insert sample templates and blog posts
- Set up proper indexes and constraints

### 4. Development Mode

For development with hot reload:

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Visit `http://localhost:3000`

### 5. Production Deployment

For production deployment (Coolify/VPS):

```bash
# Build and start all services
docker-compose up -d

# Or build manually
docker build -t iacovici-web .
docker-compose up
```

## 🐳 Docker Containers

The application uses two main containers:

### Web Container (Frontend)
- **Image**: Custom React build with Nginx
- **Port**: 80
- **Features**: 
  - Production-optimized React build
  - Nginx with gzip compression
  - Logo assets included
  - API proxy configuration

### Database Container (PostgreSQL)
- **Image**: postgres:15-alpine
- **Port**: 5432 (internal)
- **Features**:
  - Automatic schema initialization
  - Sample data included
  - Persistent volume for data
  - Performance optimizations

## 📊 Database Schema

### Templates Table
```sql
- id (Primary Key)
- title (VARCHAR)
- description (TEXT) 
- category (VARCHAR)
- is_pro (BOOLEAN)
- price (DECIMAL)
- workflow_data_json (JSONB)
- tutorial_link (VARCHAR)
- created_at (TIMESTAMP)
```

### Blog Posts Table
```sql
- id (Primary Key)
- title (VARCHAR)
- slug (VARCHAR UNIQUE)
- content_markdown (TEXT)
- author (VARCHAR)
- publication_date (DATE)
- tags (TEXT[])
- seo_title (VARCHAR)
- created_at (TIMESTAMP)
```

### Additional Tables
- `contact_submissions` - Lead tracking
- `template_downloads` - Analytics and conversion tracking

## 🎨 Customization

### Brand Colors
Update the brand colors in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    dark: '#252525',    // Main dark background
    light: '#F5F5DC',   // Light creamy text
    gray: '#404040',    // Card backgrounds
  },
  accent: {
    gold: '#D4AF37',    // Gold highlights
    blue: '#4A90E2',    // Professional blue
  }
}
```

### Logo Assets
Replace logo files in `/public/logos/`:
- `ia-logo-small-light.png` - Navbar logo
- `ia-logo-web.png` - Social media sharing
- `ia-logo-bg.png` - Homepage hero section

### Content Updates
- **Homepage**: Edit `src/pages/HomePage.js`
- **Services**: Edit `src/pages/ServicesPage.js` 
- **About**: Edit `src/pages/AboutPage.js`
- **Templates**: Update database via SQL or admin interface

## 🔒 Security Considerations

### ⚠️ IMPORTANT: Change Default Passwords

**The database schema includes a default admin user for development setup only:**
- **Email**: `admin@iacovici.it`
- **Password**: `admin123`

**🚨 CRITICAL**: You MUST change this password before deploying to production!

1. **Via Admin Dashboard**: Log in and go to Account Settings > Change Password
2. **Via Database**: Update the password hash directly in the users table

### Production Security Checklist

- [ ] Change default admin password
- [ ] Set strong `POSTGRES_PASSWORD` environment variable
- [ ] Set secure `JWT_SECRET` environment variable  
- [ ] Configure HTTPS/SSL certificates
- [ ] Review and update all API keys
- [ ] Enable firewall rules for database access
- [ ] Set up database backups
- [ ] Configure CORS origins for production domains

### Environment Variables Security

**Required for Production:**
```env
# Database (REQUIRED)
POSTGRES_PASSWORD=your_very_secure_password
JWT_SECRET=your_jwt_secret_key_min_32_chars

# Optional but Recommended
STRIPE_SECRET_KEY=sk_live_your_production_key
SMTP_PASS=your_email_service_password
```

**Never commit these to version control!**

## 🔧 Configuration

### Stripe Setup
1. Create Stripe account and get API keys
2. Update environment variables
3. Configure webhooks for successful payments
4. Test with Stripe's test cards

### Email Integration
The contact forms are ready for backend integration. Common options:
- EmailJS (client-side)
- SendGrid/Mailgun (server-side)
- Custom SMTP configuration

### Analytics
Add Google Analytics or similar:
1. Update `public/index.html` with tracking code
2. Use the analytics utilities in `src/utils/api.js`

## 📱 Deployment to Coolify

### 1. VPS Preparation
```bash
# Ensure Docker is installed
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Coolify
curl -fsSL https://cdn.coolify.io/coolify/install.sh | bash
```

### 2. Coolify Deployment
1. Access Coolify dashboard
2. Create new application
3. Connect your Git repository
4. Set environment variables
5. Deploy with Docker Compose
6. Configure domain and SSL

### 3. Production Checklist
- [ ] Update environment variables with production values
- [ ] Configure domain name and SSL certificate
- [ ] Set up database backups
- [ ] Configure email service for contact forms
- [ ] Add Stripe production keys
- [ ] Set up monitoring and logging
- [ ] Test all functionality

## 🔒 Security

- All forms include CSRF protection
- Database uses parameterized queries
- Nginx security headers configured
- Environment variables for sensitive data
- Input validation and sanitization

## 🚀 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Optimizations**: 
  - Lazy loading for images
  - Code splitting for routes
  - Gzip compression
  - Static asset caching
  - Database query optimization

## 📈 Analytics & SEO

- **SEO Optimized**: Meta tags, structured data, semantic HTML
- **Social Media**: Open Graph and Twitter Card meta tags
- **Analytics Ready**: Google Analytics integration points
- **Sitemap**: Automatically generated for blog posts and pages

## 🛠️ Development

### Available Scripts
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `docker-compose up` - Full stack with database

### Project Structure
```
src/
├── components/     # Reusable React components
├── pages/          # Page components (routes)
├── utils/          # Utility functions and API calls
├── data/           # Mock data and constants
├── hooks/          # Custom React hooks
└── index.css       # Global styles and Tailwind imports
```

## 🔧 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check if PostgreSQL container is running
docker ps
docker logs iacovici-it-new_db_1
```

**Logo Images Not Loading**
- Verify files are in `public/logos/` directory
- Check file names match exactly in components
- Ensure proper build process includes public assets

**Styling Issues**
- Verify Tailwind CSS is properly configured
- Check for CSS class conflicts
- Ensure PostCSS is processing Tailwind directives

### Support
For technical support or customization needs:
- Email: contact@iacovici.it
- Telegram: @iacovici

## 📄 License

Copyright © 2024 Iacovici.it. All rights reserved.

---

**Built with ❤️ for automation and business growth**