# ADK Agent Dockerfile
FROM python:3.12-slim

# Working dir is parent of agent folder
WORKDIR /workspace

# Install dependencies
RUN pip install --no-cache-dir google-adk toolbox-core

# Copy agent code - structure: /workspace/itungin_agent/agent.py
COPY . ./itungin_agent/

# Run ADK API server from workspace (parent of itungin_agent)
CMD ["adk", "api_server", "--host", "0.0.0.0", "--port", "8000"]
