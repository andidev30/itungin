# Toolbox DB

Database tools configuration menggunakan Google GenAI Toolbox for Databases.

## Overview

Toolbox menyediakan database tools via MCP (Model Context Protocol) yang dapat digunakan oleh AI agents.

## Tech Stack

- **Toolbox**: GenAI Toolbox for Databases
- **Database**: PostgreSQL
- **Protocol**: MCP over HTTP

## Files

| File | Description |
|------|-------------|
| `tools.yaml` | Tool definitions & SQL statements |
| `Dockerfile` | Container config |

## Tools Available

### Fund Pool Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `create-fund-pool` | Buat patungan baru | title, admin_id, target_amount, contributors |
| `record-payment` | Catat pembayaran | title_keyword, contributor_name, amount |
| `get-fund-pool` | Cari patungan | title_keyword |
| `list-fund-pools` | List semua aktif | - |

### Split Bill Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `create-split-bill` | Buat split bill | merchant_name, grand_total, participants |
| `get-split-bill` | Cari split bill | merchant_keyword |
| `list-split-bills` | List semua | - |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_HOST` | Database host | Yes |
| `POSTGRES_PORT` | Database port | Yes |
| `POSTGRES_DB` | Database name | Yes |
| `POSTGRES_USER` | Database user | Yes |
| `POSTGRES_PASSWORD` | Database password | Yes |

## Running Locally

```bash
# Install toolbox (macOS)
brew install googleapis/genai-toolbox/toolbox

# Or download binary
curl -O https://storage.googleapis.com/genai-toolbox/v0.21.0/darwin/arm64/toolbox
chmod +x toolbox

# Start server (default port 5000)
./toolbox --tools-file tools.yaml
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Health check |
| `GET /api/toolsets/{name}` | Get toolset info |
| `POST /api/tool/{name}` | Execute tool |

## Toolsets

```yaml
toolsets:
  fund_pool_tools:
    - create-fund-pool
    - record-payment
    - get-fund-pool
    - list-fund-pools

  split_bill_tools:
    - create-split-bill
    - get-split-bill
    - list-split-bills
```

## Deploy

```bash
# Build & run with Docker
docker build -t itungin-toolbox .
docker run -e POSTGRES_HOST=xxx ... itungin-toolbox
```

