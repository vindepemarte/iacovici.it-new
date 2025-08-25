# Project Structure

## Root Directory
```
├── src/                    # React frontend source
├── backend/                # Node.js API server
├── public/                 # Static assets
├── .kiro/                  # Kiro configuration
├── docker-compose.yml      # Production deployment
├── docker-compose.local.yml # Development with hot reload
├── Dockerfile              # Frontend container
├── schema.sql              # Database schema and seed data
└── package.json            # Frontend dependencies
```

## Frontend Structure (`src/`)
```
src/
├── components/             # Reusable React components
│   ├── Navbar.js          # Main navigation
│   ├── Footer.js          # Site footer
│   └── *.module.css       # Component-specific styles
├── pages/                 # Route components
│   ├── HomePage.js        # Landing page
│   ├── ServicesPage.js    # Services overview
│   ├── TemplatesPage.js   # Template library
│   ├── BlogPage.js        # Blog listing
│   ├── BlogPost.js        # Individual blog posts
│   ├── ContactPage.js     # Contact form
│   ├── AdminDashboard.js  # Admin interface
│   └── CheckoutPage.js    # Stripe checkout
├── utils/                 # Utility functions
│   ├── api.js             # API client configuration
│   └── stripe.js          # Stripe integration
├── data/                  # Static data and mock content
│   ├── mockData.js        # Template and service data
│   └── blogData.js        # Blog post content
├── hooks/                 # Custom React hooks
├── App.js                 # Main app component with routing
├── index.js               # React entry point
└── index.css              # Global styles and Tailwind imports
```

## Backend Structure (`backend/`)
```
backend/
├── src/
│   ├── config/
│   │   └── database.js    # PostgreSQL connection
│   ├── routes/            # API route handlers
│   │   ├── templates.js   # Template CRUD operations
│   │   ├── blog.js        # Blog post management
│   │   ├── contact.js     # Contact form handling
│   │   ├── auth.js        # Authentication endpoints
│   │   ├── admin.js       # Admin dashboard APIs
│   │   └── stripe.js      # Payment processing
│   ├── services/
│   │   └── emailService.js # Email sending logic
│   └── server.js          # Express app configuration
├── Dockerfile             # Backend container
└── package.json           # Backend dependencies
```

## Asset Organization
```
public/
├── logos/                 # Brand assets
│   ├── ia-logo-small-light.png  # Navbar logo
│   ├── ia-logo-web.png          # Social sharing
│   └── ia-logo-*.png            # Various logo variants
├── favicon.ico
├── index.html             # HTML template
└── manifest.json          # PWA configuration
```

## Naming Conventions

### Files and Directories
- **Components**: PascalCase (e.g., `Navbar.js`, `TemplateCard.js`)
- **Pages**: PascalCase with "Page" suffix (e.g., `HomePage.js`)
- **Utilities**: camelCase (e.g., `api.js`, `emailService.js`)
- **CSS Modules**: Component name + `.module.css`

### Database Tables
- **Snake case**: `blog_posts`, `contact_submissions`, `template_downloads`
- **Descriptive names**: Clear purpose and relationships

### API Routes
- **RESTful conventions**: `/api/templates`, `/api/blog/:slug`
- **Consistent patterns**: CRUD operations follow standard HTTP methods

## Configuration Files
- **Tailwind**: `tailwind.config.js` - Custom design system
- **PostCSS**: `postcss.config.js` - CSS processing
- **Docker**: Separate configs for development and production
- **Environment**: `.env` files for configuration management

## Key Architectural Patterns

### Frontend
- **Component composition** over inheritance
- **Custom hooks** for shared logic
- **Context-free components** with props drilling
- **Route-based code splitting** ready

### Backend
- **MVC pattern** with Express routes
- **Service layer** for business logic
- **Database abstraction** through connection pooling
- **Middleware chain** for security and logging

### Database
- **Normalized schema** with proper relationships
- **JSONB fields** for flexible workflow data
- **Indexes** on frequently queried columns
- **Triggers** for automatic timestamp updates