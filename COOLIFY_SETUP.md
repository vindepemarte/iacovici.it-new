# Coolify Deployment Setup

Simple, clean deployment configuration for iacovici.it-new on Coolify.

## Architecture

**3 Containers (Coolify Best Practice):**
- **web**: React frontend (Nginx)
- **backend**: Node.js/Express API
- **postgres**: PostgreSQL database

## Required Environment Variables

### Database
```bash
POSTGRES_DB=iacovici_db
POSTGRES_USER=iacovici_user
POSTGRES_PASSWORD=your_secure_password
```

### Authentication
```bash
JWT_SECRET=your_jwt_secret
```

### Social Media (will be passed to frontend)
```bash
REACT_APP_SOCIAL_GITHUB=https://github.com/your-username
REACT_APP_SOCIAL_LINKEDIN=https://linkedin.com/in/your-profile
REACT_APP_SOCIAL_TELEGRAM=https://t.me/your-handle
```

### Optional
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
REACT_APP_GOOGLE_ANALYTICS_ID=GA-XXXXX-X
EMAIL_FROM_ADDRESS=no-reply@yourdomain.com
```

## CRITICAL: Do NOT Set These

❌ **Remove these if they exist:**
```bash
REACT_APP_API_URL=/api  # ← DELETE THIS
```

The docker-compose.yml automatically sets:
- `REACT_APP_API_URL=${SERVICE_FQDN_BACKEND}/api`
- `REACT_APP_SITE_URL=${SERVICE_FQDN_WEB}`

## Deployment Steps

1. **Create new service** in Coolify
2. **Select Docker Compose**
3. **Set environment variables** (see above)
4. **Deploy**

That's it! The frontend will automatically connect to the backend using Coolify's service networking.

## Verification

After deployment:
- Frontend should be accessible at your Coolify web URL
- No console errors about localhost connections
- API calls should work (check Network tab in browser dev tools)

## Troubleshooting

If you see localhost errors:
1. Check that `REACT_APP_API_URL` is NOT set in environment variables
2. Verify `SERVICE_FQDN_BACKEND` and `SERVICE_FQDN_WEB` are available during build
3. Force rebuild by changing a file and redeploying