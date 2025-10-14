# StatSor Backend - Football Management Platform API

## Overview
A comprehensive, production-ready backend system for the StatSor football management platform. Built with Node.js, Express, and modern web technologies to provide robust APIs for team management, player analytics, match tracking, and real-time communication.

## 🚀 Features

### Core Functionality
- **User Management**: Registration, authentication, profile management
- **Team Management**: Create teams, manage players, roles, and permissions
- **Match Management**: Schedule matches, track live events, statistics
- **Player Analytics**: Performance tracking, statistics, comparisons
- **Training Management**: Session planning, attendance, performance ratings
- **Real-time Chat**: Team communication with file sharing
- **Subscription Management**: Payment processing with Stripe and PayPal
- **File Upload**: Avatar and document management with multiple storage options

### Technical Features
- **Authentication**: JWT-based auth with refresh tokens, Google OAuth
- **Real-time Communication**: Socket.io for live updates and chat
- **Caching**: Redis for session management and performance optimization
- **Rate Limiting**: API protection and abuse prevention
- **Email Services**: SendGrid and SMTP support for notifications
- **File Storage**: AWS S3, Cloudinary, and local storage options
- **Comprehensive Logging**: Winston with daily rotation
- **Error Handling**: Centralized error management with proper HTTP responses
- **Input Validation**: Joi schemas for request validation
- **Security**: Helmet, CORS, bcrypt password hashing

## 🛠 Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL) with direct PostgreSQL support
- **Cache**: Redis with ioredis client
- **Authentication**: JWT, Passport.js (Google OAuth)
- **Real-time**: Socket.io
- **Validation**: Joi
- **File Upload**: Multer with multiple storage backends
- **Email**: SendGrid, Nodemailer
- **Payments**: Stripe, PayPal
- **Logging**: Winston with daily rotation
- **Development**: TypeScript, tsx for development

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- Redis server
- PostgreSQL database (or Supabase account)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Required Environment Variables
```bash
# Essential variables (see .env.example for complete list)
NODE_ENV=development
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_32_chars_minimum
JWT_REFRESH_SECRET=your_refresh_secret_32_chars_minimum
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Start Development Server
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start

# Build TypeScript
npm run build
```

## 🔧 Configuration

### Database Setup
The application supports both Supabase and direct PostgreSQL connections:

**Option 1: Supabase (Recommended)**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Option 2: Direct PostgreSQL**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/statsor
# OR individual settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=statsor
DB_USER=postgres
DB_PASSWORD=your_password
```

### Redis Setup
```bash
# Local Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Redis Cloud/Remote
REDIS_URL=redis://username:password@host:port
```

### Authentication Setup

**JWT Configuration**
```bash
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_REFRESH_SECRET=your_super_secret_refresh_key_at_least_32_characters_long
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

**Google OAuth Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3001/api/v1/auth/google/callback` (development)
   - `https://yourdomain.com/api/v1/auth/google/callback` (production)

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/google/callback
```

### Payment Setup

**Stripe Configuration**
1. Create account at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get API keys from Developers > API keys
3. Create webhook endpoint for `/api/v1/subscriptions/stripe/webhook`

```bash
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**PayPal Configuration**
1. Create app at [PayPal Developer](https://developer.paypal.com/)
2. Get client credentials

```bash
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # or 'live' for production
```

### Email Setup

**SendGrid (Recommended)**
```bash
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com
```

**SMTP Alternative**
```bash
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### File Upload Setup

**AWS S3**
```bash
UPLOAD_SERVICE=s3
AWS_S3_BUCKET=your_bucket_name
AWS_S3_ACCESS_KEY_ID=your_access_key
AWS_S3_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_REGION=us-east-1
```

**Cloudinary**
```bash
UPLOAD_SERVICE=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:3001/api/v1`
- Production: `https://yourdomain.com/api/v1`

### Authentication Endpoints
```
POST /auth/register          # User registration
POST /auth/login             # User login
POST /auth/refresh           # Refresh JWT token
POST /auth/logout            # User logout
POST /auth/forgot-password   # Password reset request
POST /auth/reset-password    # Password reset confirmation
GET  /auth/google            # Google OAuth login
GET  /auth/google/callback   # Google OAuth callback
```

### Core API Endpoints
```
# Players
GET    /players              # List players
POST   /players              # Create player
GET    /players/:id          # Get player details
PUT    /players/:id          # Update player
DELETE /players/:id          # Delete player

# Matches
GET    /matches              # List matches
POST   /matches              # Create match
GET    /matches/:id          # Get match details
PUT    /matches/:id          # Update match
POST   /matches/:id/events   # Add match event

# Analytics
GET    /analytics/overview   # Dashboard analytics
GET    /analytics/players/:id # Player performance
GET    /analytics/teams/:id   # Team statistics

# Training
GET    /training             # List training sessions
POST   /training             # Create training session
PUT    /training/:id         # Update training session

# Chat
GET    /chat/channels        # List chat channels
POST   /chat/channels        # Create chat channel
GET    /chat/messages/:channelId # Get messages
POST   /chat/messages        # Send message

# Subscriptions
GET    /subscriptions/plans  # List subscription plans
POST   /subscriptions        # Create subscription
PUT    /subscriptions/:id    # Update subscription
```

## 🔌 WebSocket Events

The application uses Socket.io for real-time features:

### Connection
```javascript
// Client connection with JWT token
const socket = io('http://localhost:3001', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Events
```javascript
// Join team room
socket.emit('join_team', { teamId: 'team_id' });

// Send chat message
socket.emit('send_message', {
  channelId: 'channel_id',
  message: 'Hello team!'
});

// Listen for new messages
socket.on('new_message', (data) => {
  console.log('New message:', data);
});

// Listen for match updates
socket.on('match_update', (data) => {
  console.log('Match update:', data);
});
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t statsor-backend .

# Run container
docker run -p 3001:3001 --env-file .env statsor-backend
```

### Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment-Specific Deployment

**Production Checklist:**
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Configure production database
- [ ] Set up Redis cluster/cloud
- [ ] Configure production email service
- [ ] Set up file storage (S3/Cloudinary)
- [ ] Configure payment webhooks
- [ ] Set up monitoring and logging
- [ ] Configure SSL/TLS
- [ ] Set up backup strategy

## 📊 Monitoring & Logging

### Logs Location
- Application logs: `logs/app.log`
- Error logs: `logs/error.log`
- Redis logs: `logs/redis.log`

### Health Check
```bash
# Check application health
curl http://localhost:3001/health

# Check database connection
curl http://localhost:3001/health/db

# Check Redis connection
curl http://localhost:3001/health/redis
```

## 🔒 Security Features

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: Configurable per endpoint
- **Input Validation**: Joi schemas for all inputs
- **Password Security**: bcrypt with configurable rounds
- **CORS**: Configurable origins
- **Helmet**: Security headers
- **Session Security**: Secure session management
- **API Key Support**: For external integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@statsor.com
- Documentation: [API Documentation](./API_DOCUMENTATION.md)

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.