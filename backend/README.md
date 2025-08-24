# Backend API (Optional - for future implementation)

This directory contains the backend API structure for handling:
- Contact form submissions
- Template downloads
- Stripe payment processing
- Blog post management
- Analytics and tracking

## Quick Start

```bash
cd backend
npm install
npm start
```

## API Endpoints

### Contact Forms
- `POST /api/contact` - Submit contact form
- `GET /api/contact/submissions` - Get all submissions (admin)

### Templates
- `GET /api/templates` - List all templates
- `GET /api/templates/:id` - Get single template
- `POST /api/templates/download` - Track template download

### Blog
- `GET /api/blog` - List blog posts
- `GET /api/blog/:slug` - Get single blog post
- `POST /api/blog` - Create new post (admin)

### Payments (Stripe)
- `POST /api/payments/create-checkout` - Create Stripe checkout session
- `POST /api/payments/webhook` - Handle Stripe webhooks
- `GET /api/payments/success` - Verify successful payment

## Database
The backend connects to the same PostgreSQL database using the connection string from environment variables.

## Implementation Notes
This backend is optional. The React frontend can work with:
1. Static data (current setup)
2. This Node.js/Express backend
3. Any other backend/API (Python, PHP, etc.)
4. Serverless functions (Vercel, Netlify)
5. Headless CMS (Strapi, Contentful)

Choose the implementation that best fits your deployment preferences.