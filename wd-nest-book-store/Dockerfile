FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set environment variables for Windows file watching
ENV TSC_WATCHFILE=PriorityPollingInterval
ENV TSC_WATCHDIRECTORY=RecursiveDirectoryUsingDynamicPriorityPolling

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start in development mode with hot reload
CMD ["npm", "run", "start:dev"]
