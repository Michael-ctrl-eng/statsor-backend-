# Use Node.js 18 LTS for Koyeb compatibility
FROM node:18-alpine

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

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

# Expose the port
EXPOSE 3001

# Start the application
CMD ["node", "../server.js"]