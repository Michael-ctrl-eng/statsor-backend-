# Use Node.js 18 LTS for Koyeb/Railway compatibility
FROM node:18-alpine

# Set environment variables (PORT will be provided by the platform)
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install --production
RUN cd backend && npm install --production

# Copy application files
COPY . .

# Change to backend directory
WORKDIR /app/backend

# Create uploads directory if needed
RUN mkdir -p uploads

# Expose the application port (platform will map its own PORT env)
EXPOSE 3001

# Start the application
CMD ["node", "../server.js"]