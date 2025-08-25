# Technology Stack

## Frontend
- **React 18** with functional components and hooks
- **React Router v6** for client-side routing
- **Tailwind CSS** for styling with custom design system
- **Framer Motion** for animations
- **React Helmet Async** for SEO meta tags
- **React Hook Form** for form handling
- **Axios** for API calls
- **Stripe.js** for payment processing

## Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database with JSONB support
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email services
- **Stripe** server-side SDK
- **Helmet** and **CORS** for security

## Infrastructure
- **Docker** and **Docker Compose** for containerization
- **Nginx** for production serving and reverse proxy
- **PostgreSQL 15 Alpine** for database
- **Coolify** compatible for VPS deployment

## Development Tools
- **Create React App** build system
- **PostCSS** and **Autoprefixer**
- **Jest** for testing
- **Nodemon** for backend development

## Common Commands

### Development
```bash
# Frontend development
npm start                    # Start React dev server (port 3000)
npm run build               # Build for production
npm test                    # Run tests

# Backend development
cd backend
npm run dev                 # Start with nodemon
npm start                   # Production start
npm test                    # Run backend tests

# Full stack development
docker-compose -f docker-compose.local.yml up  # Local development with hot reload
```

### Production Deployment
```bash
# Build and deploy
docker-compose up -d        # Start all services
docker-compose down         # Stop all services
docker-compose logs web     # View frontend logs
docker-compose logs backend # View backend logs
docker-compose logs db      # View database logs

# Database operations
docker-compose exec db psql -U iacovici_user -d iacovici_db  # Connect to DB
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env
cp backend/.env.example backend/.env

# Install dependencies
npm install                 # Frontend dependencies
cd backend && npm install   # Backend dependencies
```