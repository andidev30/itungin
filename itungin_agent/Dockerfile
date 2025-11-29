# ADK Agent Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir google-adk toolbox-core

# Copy agent code
COPY itungin_agent ./itungin_agent

# Environment variables
ENV GOOGLE_API_KEY=""
ENV MCP_TOOLBOX_URL="http://toolbox:5000"

# Expose port
EXPOSE 8000

# Run ADK API server
CMD ["adk", "api_server", "--host", "0.0.0.0", "--port", "8000", "itungin_agent"]

