ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:latest
FROM $BUILD_FROM

# Install Node.js and dependencies
RUN apk add --no-cache \
    nodejs \
    npm \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /app

# Copy backend package.json first for better caching
COPY backend/package.json ./backend/package.json
WORKDIR /app/backend
RUN npm install --production

# Copy rest of backend
WORKDIR /app
COPY backend/ ./backend/

# Copy and build frontend
WORKDIR /app
COPY frontend/package.json ./frontend/package.json
WORKDIR /app/frontend
RUN npm install

# Copy rest of frontend and build
WORKDIR /app
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm run build

# Back to app root
WORKDIR /app/backend

# Expose port
EXPOSE 3000

# Start backend server
CMD ["node", "index.js"]