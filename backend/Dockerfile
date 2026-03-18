FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the backend source code
COPY . .

# Ensure public directory exists
RUN mkdir -p public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Expose the port (Render usually detects this)
EXPOSE 10000

# Start the application
CMD ["node", "src/server.js"]
