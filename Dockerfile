# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory to backend
WORKDIR /app/backend

# Copy backend package.json and install dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy all backend files
COPY backend/ ./

# Copy root package.json for server.js
COPY package.json ../
COPY server.js ../

# Expose port
EXPOSE 3001

# Change to root directory for server.js
WORKDIR /app

# Start the server
CMD ["node", "server.js"]
