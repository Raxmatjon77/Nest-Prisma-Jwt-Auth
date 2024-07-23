# Stage 1: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install necessary packages for native modules
RUN apk add --no-cache make gcc g++ python3

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build the project
COPY . .
RUN npm run build

# Stage 2: Production Stage
FROM node:18-alpine

WORKDIR /app

# Install necessary packages for native modules
RUN apk add --no-cache make gcc g++ python3

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Rebuild native modules to ensure they match the container environment
RUN npm rebuild bcrypt

# Set the command to run the application
CMD ["node", "dist/main.js"]
