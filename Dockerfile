# Use Node.js LTS for building the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Set environment variables for better build performance
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV GENERATE_SOURCEMAP=false
ENV CI=false

# Accept build-time environment variables for React
ARG REACT_APP_API_URL
ARG REACT_APP_SITE_URL
ARG REACT_APP_STRIPE_PUBLISHABLE_KEY
ARG REACT_APP_GOOGLE_ANALYTICS_ID
ARG REACT_APP_SOCIAL_TELEGRAM
ARG REACT_APP_SOCIAL_GITHUB
ARG REACT_APP_SOCIAL_LINKEDIN

# Set environment variables for build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_SITE_URL=$REACT_APP_SITE_URL
ENV REACT_APP_STRIPE_PUBLISHABLE_KEY=$REACT_APP_STRIPE_PUBLISHABLE_KEY
ENV REACT_APP_GOOGLE_ANALYTICS_ID=$REACT_APP_GOOGLE_ANALYTICS_ID
ENV REACT_APP_SOCIAL_TELEGRAM=$REACT_APP_SOCIAL_TELEGRAM
ENV REACT_APP_SOCIAL_GITHUB=$REACT_APP_SOCIAL_GITHUB
ENV REACT_APP_SOCIAL_LINKEDIN=$REACT_APP_SOCIAL_LINKEDIN

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy logo assets to public directory
COPY iacovici-it-logo /usr/share/nginx/html/logos

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]