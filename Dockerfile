# Use Node.js 18 LTS for Koyeb compatibility
FROM node:18-alpine

# Set environment variables for Koyeb
ENV NODE_ENV=production
ENV PORT=3001

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies for Koyeb buildpacks
RUN npm ci --only=production && \
    cd backend && \
    npm ci --only=production

# Copy application files
COPY . .

# Change to backend directory
WORKDIR /app/backend

# Create uploads directory if needed
RUN mkdir -p uploads

# Expose the port Koyeb expects
EXPOSE 3001

# Koyeb health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application for Koyeb
CMD ["node", "../server.js"]
