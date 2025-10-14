#!/bin/bash

# 🆓 Statsor.com Free Deployment Script
# Deploy your football platform with ZERO costs!

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}"
    echo "================================================"
    echo "🆓 STATSOR.COM - 100% FREE DEPLOYMENT"
    echo "================================================"
    echo -e "${NC}"
}

print_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header

print_step "1/6: Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    print_info "Please install Node.js 18+ from: https://nodejs.org"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    exit 1
fi

print_info "✅ Node.js and npm are installed"

print_step "2/6: Installing deployment tools..."

# Install Netlify CLI globally (for frontend deployment)
if ! command -v netlify &> /dev/null; then
    print_info "Installing Netlify CLI..."
    npm install -g netlify-cli
else
    print_info "✅ Netlify CLI already installed"
fi

print_step "3/6: Building frontend..."

# Install frontend dependencies
print_info "Installing frontend dependencies..."
npm install

# Create production environment for frontend
print_info "Creating frontend environment..."
cat > .env.production << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://statsor-backend.railway.app
VITE_APP_URL=https://statsor.com
EOF

print_warning "⚠️  Please update .env.production with your actual Supabase keys!"

# Build the frontend
print_info "Building frontend for production..."
npm run build

print_step "4/6: Preparing backend for Railway..."

cd backend

# Copy free environment template
if [ ! -f ".env" ]; then
    cp .env.free .env
    print_warning "⚠️  Please configure backend/.env with your API keys!"
fi

# Install backend dependencies
print_info "Installing backend dependencies..."
npm install

cd ..

print_step "5/6: Deployment instructions..."

echo ""
echo -e "${BLUE}================================================"
echo "🚀 READY FOR FREE DEPLOYMENT!"
echo "================================================${NC}"
echo ""

echo -e "${GREEN}FRONTEND DEPLOYMENT (Netlify):${NC}"
echo "1. Go to https://netlify.com and sign in with GitHub"
echo "2. Click 'New site from Git' → Connect to GitHub"
echo "3. Select your statsor repository"
echo "4. Build settings:"
echo "   - Build command: npm run build"
echo "   - Publish directory: dist"
echo "5. Add environment variables from .env.production"
echo "6. Deploy site"
echo "7. Add custom domain: statsor.com"
echo ""

echo -e "${GREEN}BACKEND DEPLOYMENT (Railway):${NC}"
echo "1. Go to https://railway.app and sign in with GitHub"
echo "2. Click 'Deploy from GitHub repo'"
echo "3. Select your statsor repository"
echo "4. Choose 'backend' folder as root directory"
echo "5. Add environment variables from backend/.env"
echo "6. Deploy service"
echo ""

echo -e "${GREEN}DATABASE SETUP (Supabase):${NC}"
echo "1. Go to https://supabase.com and sign in with GitHub"
echo "2. Create new project: 'statsor-production'"
echo "3. Go to SQL Editor and run migrations from /supabase/migrations/"
echo "4. Copy API keys to your environment files"
echo ""

echo -e "${GREEN}EMAIL SETUP (Gmail SMTP):${NC}"
echo "1. Enable 2-Factor Authentication on your Gmail"
echo "2. Generate App Password: Google Account → Security → App passwords"
echo "3. Use this password in SMTP_PASS environment variable"
echo ""

print_step "6/6: Testing deployment..."

echo ""
echo -e "${BLUE}TESTING CHECKLIST:${NC}"
echo "After deployment, test these URLs:"
echo "✅ Frontend: https://statsor.com"
echo "✅ API Health: https://your-backend.railway.app/api/v1/health"
echo "✅ User Registration: Create a test account"
echo "✅ Login System: Test authentication"
echo "✅ Player Management: Add/edit players"
echo "✅ File Upload: Upload player photos"
echo ""

echo -e "${GREEN}🎉 FREE DEPLOYMENT PREPARATION COMPLETE!${NC}"
echo ""
echo -e "${YELLOW}TOTAL COST: \$0.00/month${NC}"
echo ""
echo "Services used:"
echo "- Frontend: Netlify (FREE - 100GB bandwidth)"
echo "- Backend: Railway (FREE - 512MB RAM)"
echo "- Database: Supabase (FREE - 500MB)"
echo "- Email: Gmail SMTP (FREE - 500 emails/day)"
echo "- SSL: Let's Encrypt (FREE)"
echo "- CDN: Netlify (FREE)"
echo ""

echo -e "${BLUE}Next steps:${NC}"
echo "1. Configure your API keys in the environment files"
echo "2. Deploy frontend to Netlify"
echo "3. Deploy backend to Railway"
echo "4. Setup Supabase database"
echo "5. Point statsor.com DNS to Netlify"
echo "6. Test your live website!"
echo ""

print_info "🚀 Your statsor.com football platform will be live soon!"

# Create quick deploy commands file
cat > DEPLOY_COMMANDS.md << EOF
# Quick Deploy Commands

## Frontend (Netlify)
\`\`\`bash
# Login to Netlify
netlify login

# Deploy to Netlify
netlify deploy --prod --dir=dist
\`\`\`

## Backend (Railway)
1. Connect GitHub repo to Railway
2. Select backend folder
3. Add environment variables
4. Auto-deploy on push

## Environment Variables Needed:

### Frontend (.env.production):
\`\`\`
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://your-backend.railway.app
\`\`\`

### Backend (.env):
\`\`\`
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_32_char_secret
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
\`\`\`

## Free Services Setup:
1. Supabase: https://supabase.com (Database)
2. Netlify: https://netlify.com (Frontend)
3. Railway: https://railway.app (Backend)
4. Gmail: App Password for SMTP
EOF

echo ""
echo "📋 Created DEPLOY_COMMANDS.md with quick reference!"
echo ""