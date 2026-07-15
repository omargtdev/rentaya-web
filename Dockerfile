# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine

# Install envsubst (gettext) for environment variable substitution
RUN apk add --no-cache gettext

# Copy built Angular app
COPY --from=builder /app/dist/rentaya-web/browser /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script for env substitution
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 80

# Environment variable for API backend URL (override at runtime)
ENV API_URL=http://localhost:8080

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
