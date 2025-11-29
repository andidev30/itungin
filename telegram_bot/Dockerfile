# Telegram Bot Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Environment variables (override at runtime)
ENV TELEGRAM_BOT_TOKEN=""
ENV AGENT_API_URL="http://adk:8000"
ENV APP_NAME="itungin_agent"

# Run the bot
CMD ["node", "src/index.js"]

