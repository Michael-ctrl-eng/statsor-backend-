#!/bin/bash

echo "🚀 Deploying Statsor to production..."

# Set environment variables
export NODE_ENV=production
export COMPOSE_PROJECT_NAME=statsor

# Build and deploy
echo "📦 Building Docker images..."
docker-compose -f docker-compose.production.yml build

echo "🔄 Starting services..."
docker-compose -f docker-compose.production.yml up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Health checks
echo "🏥 Running health checks..."

# Check backend
if curl -f http://localhost:3001/api/health; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Check frontend
if curl -f http://localhost; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "🌐 Frontend: https://statsor.com"
echo "🔗 API: https://api.statsor.com"
echo "📊 Health: https://api.statsor.com/health" 