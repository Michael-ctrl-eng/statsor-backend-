#!/bin/bash

# Statsor.com Production Deployment Script
# Run this script on your production server

set -e

echo "🚀 Starting Statsor.com Production Deployment..."

# Configuration
DOMAIN="statsor.com"
API_DOMAIN="api.statsor.com"
PROJECT_DIR="/var/www/statsor"
NGINX_SITE="/etc/nginx/sites-available/statsor.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons."
   exit 1
fi

print_status "Step 1: Installing system dependencies..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install Docker
if ! command -v docker &> /dev/null; then
    print_status "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    print_warning "Please log out and back in to apply Docker group permissions"
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_status "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install Nginx
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx..."
    sudo apt install -y nginx
fi

# Install Certbot for SSL
if ! command -v certbot &> /dev/null; then
    print_status "Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
fi

print_status "Step 2: Setting up project directory..."

# Create project directory
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# Clone or copy project files (assuming they're already on the server)
# cd $PROJECT_DIR

print_status "Step 3: Checking environment configuration..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_warning "Creating .env.production template..."
    cat > .env.production << EOF
# Production Environment Configuration for Statsor.com

# Application
NODE_ENV=production
PORT=3001
APP_URL=https://$DOMAIN
FRONTEND_URL=https://$DOMAIN
API_URL=https://$API_DOMAIN

# Database (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters_long
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_minimum_32_characters_long

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@$DOMAIN

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# File Storage (Cloudflare R2)
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=statsor-uploads

# Payments (Optional)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Security
CORS_ORIGIN=https://$DOMAIN,https://www.$DOMAIN
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Features
ENABLE_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=true
ENABLE_SOCIAL_LOGIN=true
ENABLE_SUBSCRIPTIONS=true
ENABLE_CHAT=true
ENABLE_ANALYTICS=true
ENABLE_FILE_UPLOAD=true
EOF
    
    print_error "Please edit .env.production with your actual API keys and configuration!"
    print_error "Run: nano .env.production"
    read -p "Press Enter when you've configured .env.production..."
fi

print_status "Step 4: Setting up SSL certificates..."

# Check if SSL certificates exist
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    print_status "Obtaining SSL certificates..."
    sudo certbot certonly --nginx -d $DOMAIN -d www.$DOMAIN -d $API_DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
else
    print_status "SSL certificates already exist"
fi

print_status "Step 5: Configuring Nginx..."

# Create Nginx configuration
sudo tee $NGINX_SITE > /dev/null << EOF
# Frontend (React App)
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    root $PROJECT_DIR/dist;
    index index.html;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle React Router
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}

# Backend API
server {
    listen 443 ssl http2;
    server_name $API_DOMAIN;
    
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    client_max_body_size 50M;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN $API_DOMAIN;
    return 301 https://\$server_name\$request_uri;
}
EOF

# Enable the site
sudo ln -sf $NGINX_SITE /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

print_status "Step 6: Building and deploying the application..."

# Install frontend dependencies and build
print_status "Building frontend..."
npm install
npm run build

# Copy built files to web directory
sudo cp -r dist/* $PROJECT_DIR/
sudo chown -R www-data:www-data $PROJECT_DIR

# Build and start backend with Docker
print_status "Starting backend services..."
cd backend
sudo docker-compose -f docker-compose.production.yml down
sudo docker-compose -f docker-compose.production.yml up --build -d

print_status "Step 7: Starting services..."

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Set up automatic SSL renewal
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

print_status "Step 8: Verifying deployment..."

# Check if services are running
sleep 10

# Check Nginx
if systemctl is-active --quiet nginx; then
    print_status "✅ Nginx is running"
else
    print_error "❌ Nginx is not running"
fi

# Check backend containers
if sudo docker-compose -f backend/docker-compose.production.yml ps | grep -q "Up"; then
    print_status "✅ Backend services are running"
else
    print_error "❌ Backend services are not running"
fi

# Test API health
if curl -f -s https://$API_DOMAIN/api/v1/health > /dev/null; then
    print_status "✅ API is responding"
else
    print_warning "⚠️  API health check failed"
fi

# Test frontend
if curl -f -s https://$DOMAIN > /dev/null; then
    print_status "✅ Frontend is responding"
else
    print_warning "⚠️  Frontend check failed"
fi

print_status "🎉 Deployment completed!"
echo ""
echo "Your Statsor platform should now be available at:"
echo "Frontend: https://$DOMAIN"
echo "Backend API: https://$API_DOMAIN"
echo ""
echo "Next steps:"
echo "1. Test user registration and login"
echo "2. Configure Google OAuth in Google Cloud Console"
echo "3. Set up email service (Gmail SMTP or SendGrid)"
echo "4. Configure payment processing (Stripe)"
echo "5. Set up file storage (Cloudflare R2)"
echo ""
echo "Logs can be viewed with:"
echo "sudo docker-compose -f backend/docker-compose.production.yml logs -f"
echo ""
echo "To monitor the application:"
echo "sudo systemctl status nginx"
echo "sudo docker-compose -f backend/docker-compose.production.yml ps"