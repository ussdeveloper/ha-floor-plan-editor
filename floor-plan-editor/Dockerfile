ARG BUILD_FROM
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

# Copy backend
COPY backend/ ./backend/
WORKDIR /app/backend
RUN npm install --production

# Copy and build frontend
WORKDIR /app
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Back to app root
WORKDIR /app/backend

# Expose port
EXPOSE 3000

# Start backend server
CMD ["node", "index.js"]