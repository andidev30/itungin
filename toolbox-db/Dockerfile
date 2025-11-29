# MCP Toolbox for Databases Dockerfile
FROM golang:1.23-alpine AS builder

# Install toolbox
RUN go install github.com/googleapis/genai-toolbox@latest

# Runtime image
FROM alpine:3.20

# Copy toolbox binary
COPY --from=builder /go/bin/genai-toolbox /usr/local/bin/toolbox

WORKDIR /app

# Copy config
COPY tools.yaml ./

# Environment variables for PostgreSQL (override at runtime)
ENV POSTGRES_HOST=""
ENV POSTGRES_PORT="5432"
ENV POSTGRES_DB=""
ENV POSTGRES_USER=""
ENV POSTGRES_PASSWORD=""

# Expose port
EXPOSE 5000

# Run toolbox
CMD ["toolbox", "--tools-file", "tools.yaml", "--address", "0.0.0.0", "--port", "5000"]

