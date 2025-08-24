# Deploying to Coolify

This document provides detailed instructions for deploying this application to Coolify.

## Environment Variables Configuration

When deploying to Coolify, you need to set the following environment variables in the Coolify dashboard:

### Database Configuration

- `POSTGRES_DB`: The name of the PostgreSQL database (e.g., `iacovici_db`)
- `POSTGRES_USER`: The PostgreSQL user (e.g., `iacovici_user`)
- `POSTGRES_PASSWORD`: The PostgreSQL password (use a strong, secure password)
- `POSTGRES_PORT`: The PostgreSQL port (typically `5432`)

### Frontend Configuration

- `REACT_APP_API_URL`: The public URL of your backend API service in Coolify. This should be set to the URL of your backend service followed by `/api`, for example: `https://backend-service-id.coolify.app/api`
- `REACT_APP_SITE_URL`: The public URL of your frontend service in Coolify, for example: `https://frontend-service-id.coolify.app`
- `FRONTEND_URL`: Same as `REACT_APP_SITE_URL`, used for redirects in the backend
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (starts with `pk_`)
- `REACT_APP_GOOGLE_ANALYTICS_ID`: Your Google Analytics ID (e.g., `GA-XXXXX-X`)
- `REACT_APP_SOCIAL_TELEGRAM`: Your Telegram profile URL
- `REACT_APP_SOCIAL_GITHUB`: Your GitHub profile URL
- `REACT_APP_SOCIAL_LINKEDIN`: Your LinkedIn profile URL

### Stripe Configuration (for payments)

- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_`)
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret (starts with `whsec_`)

### JWT Configuration (for authentication)

- `JWT_SECRET`: A secure random string used for JWT token generation and validation

### Email Configuration (for contact forms and notifications)

- `EMAIL_FROM_ADDRESS`: The email address from which to send emails (e.g., `no-reply@iacovici.it`)
- `SMTP_HOST`: Your SMTP server hostname
- `SMTP_PORT`: Your SMTP server port (typically `587` for TLS)
- `SMTP_SECURE`: Whether to use secure connection (`true` or `false`)
- `SMTP_USER`: Your SMTP username
- `SMTP_PASS`: Your SMTP password

### Backend Configuration

- `BACKEND_PORT`: The port on which the backend service runs (typically `3001`)
- `GOOGLE_ANALYTICS_ID`: Your Google Analytics ID (e.g., `GA-XXXXX-X`)

## Deployment Steps

1. **Create a new service in Coolify**:
   - Select "Docker Compose" as the deployment method
   - Point to your repository and the `docker-compose.yml` file

2. **Configure environment variables**:
   - In the Coolify dashboard, navigate to your service
   - Go to the "Environment Variables" section
   - Add all the required environment variables listed above
   - For sensitive information like passwords and API keys, use Coolify's secret management

3. **Deploy the service**:
   - Click "Deploy" to build and deploy your application
   - Coolify will use the `docker-compose.yml` file to set up all services

4. **Verify the deployment**:
   - Check the deployment logs for any errors
   - Once deployed, access your frontend service at the URL provided by Coolify
   - Test key functionality like authentication, template loading, etc.

## Troubleshooting

If you encounter issues during deployment:

1. **Check the logs** in the Coolify dashboard for error messages
2. **Verify environment variables** are correctly set
3. **Ensure network connectivity** between services
4. **Check resource limits** if services are failing to start
5. **Verify domain configuration** if using custom domains

## Important Notes

- The frontend and backend are deployed as separate services, each with its own URL
- The frontend must be configured to connect to the backend using the `REACT_APP_API_URL` environment variable
- Database data is persisted in a Docker volume, ensure you have backup strategies in place
- For production deployments, always use secure passwords and proper SSL configuration
- All environment variables with the `REACT_APP_` prefix are exposed to the frontend
- Environment variables without the `REACT_APP_` prefix are only available to the backend