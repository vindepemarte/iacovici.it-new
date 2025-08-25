#!/bin/bash

echo "🔍 Testing Docker Compose Build Arguments"
echo "=========================================="

echo "Environment variables from shell:"
echo "SERVICE_FQDN_BACKEND: ${SERVICE_FQDN_BACKEND}"
echo "SERVICE_FQDN_WEB: ${SERVICE_FQDN_WEB}"
echo "REACT_APP_SOCIAL_GITHUB: ${REACT_APP_SOCIAL_GITHUB}"

echo ""
echo "Building with docker-compose and showing build output..."

# Build only the web service to see build arguments
docker-compose build web