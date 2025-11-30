# Itungin Telegram Bot

Telegram bot interface untuk Itungin menggunakan Telegraf.

## Features

- 💬 Handle text messages
- 📷 Handle photo/image messages
- 📎 Handle document attachments
- 🎤 Handle voice notes
- 🔄 Session management per user
- ♻️ Reset session dengan keyword "reset"

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Telegraf
- **HTTP Client**: Axios

## Files

| File | Description |
|------|-------------|
| `src/index.js` | Main bot logic |
| `Dockerfile` | Container config |
| `package.json` | Dependencies |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Token dari @BotFather | Yes |
| `AGENT_API_URL` | ADK API URL (default: http://localhost:8000) | No |

## Running Locally

```bash
# Install dependencies
npm install

# Start bot
npm start
```

## Message Flow

```
User sends message
        │
        ▼
┌───────────────────┐
│ Check reset cmd?  │──Yes──▶ Create new session
└───────────────────┘
        │ No
        ▼
┌───────────────────┐
│ Get/create session│
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Download media    │ (if photo/doc/voice)
│ Convert to base64 │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ POST /run_sse     │──────▶ ADK Agent
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Parse SSE response│
│ Get last text     │
└───────────────────┘
        │
        ▼
    Reply to user
```

## Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/help` | Panduan penggunaan |
| `reset` | Reset session (mulai baru) |

## Deploy

```bash
# Build & run with Docker
docker build -t itungin-bot .
docker run -e TELEGRAM_BOT_TOKEN=xxx -e AGENT_API_URL=xxx itungin-bot
```

