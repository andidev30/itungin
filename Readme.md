# Itungin - AI Assistant for Split Bill and Fund Pool

Itungin is an AI assistant that helps Indonesian users handle:

- **Split Bill** - Calculate and divide restaurant or food order bills
- **Fund Pool (Patungan)** - Manage group contributions for shared goals

## Architecture

```
┌─────────────────┐     HTTP      ┌─────────────────┐     MCP      ┌─────────────────┐
│  Telegram Bot   │ ──────────▶  │  Itungin Agent  │ ──────────▶  │    Firestore    │
│  (Node.js)      │              │  (Python ADK)   │              │    Database     │
└─────────────────┘              └─────────────────┘              └─────────────────┘
                                        │
                                        ▼
                                 ┌─────────────────┐
                                 │  Gemini AI      │
                                 │  (Multimodal)   │
                                 └─────────────────┘
```

## Components

### 1. Python Agent (ADK)

- Location: `itungin_agent/`
- Framework: Google Agent Development Kit (ADK)
- Exposes HTTP API at `/agent/invoke`
- Uses Gemini multimodal for text, image, and audio processing
- Database access via MCP Toolbox for Databases

### 2. Telegram Bot (Node.js)

- Location: `telegram_bot/`
- Framework: Telegraf
- Handles text, photo, document, and voice messages
- Forwards messages to the Python agent

### 3. MCP Toolbox Configuration

- Location: `tools.yaml`
- Configures Firestore source and database tools

## Prerequisites

- Python 3.11+
- Node.js 18+
- Google Cloud Project with Firestore enabled
- Gemini API key
- Telegram Bot Token (from @BotFather)
- MCP Toolbox for Databases binary

## Setup

### 1. Install MCP Toolbox for Databases

```bash
# macOS
brew install googleapis/genai-toolbox/toolbox

# Or download binary
curl -O https://storage.googleapis.com/genai-toolbox/v0.21.0/linux/amd64/toolbox
chmod +x toolbox
```

### 2. Setup Python Agent

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your configuration
```

### 3. Setup Telegram Bot

```bash
cd telegram_bot

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your Telegram bot token
```

## Running Locally

### 1. Start MCP Toolbox Server

The MCP Toolbox runs as a separate server that the agent connects to:

```bash
# Download the toolbox binary from:
# https://github.com/googleapis/genai-toolbox/releases

# Start the toolbox server (runs on port 5000 by default)
cd toolbox-db
./toolbox --tools-file tools.yaml
```

### 2. Start ADK Agent

```bash
# From project root
pip install -r requirements.txt

# Run ADK API server (default port 8000)
adk api_server itungin_agent
```

### 3. Start Telegram Bot

```bash
cd telegram_bot
npm start
```

## Environment Variables

### ADK Agent

| Variable                    | Description                                             | Required |
| --------------------------- | ------------------------------------------------------- | -------- |
| `GOOGLE_CLOUD_PROJECT`      | GCP project ID                                          | Yes      |
| `GOOGLE_CLOUD_LOCATION`     | GCP location (default: us-central1)                     | No       |
| `GOOGLE_GENAI_USE_VERTEXAI` | Use Vertex AI (set to True)                             | Yes      |
| `MCP_TOOLBOX_URL`           | MCP Toolbox server URL (default: http://127.0.0.1:5000) | No       |

### Telegram Bot (.env)

| Variable             | Description                                  | Required |
| -------------------- | -------------------------------------------- | -------- |
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather                    | Yes      |
| `AGENT_API_URL`      | ADK API URL (default: http://localhost:8000) | No       |

## API Contract

### ADK API - POST /run_sse

Request (text only):

```json
{
  "app_name": "itungin",
  "user_id": "telegram_chat_id",
  "session_id": "telegram_chat_id",
  "new_message": {
    "role": "user",
    "parts": [{ "text": "patungan boneka 5 orang" }]
  }
}
```

Request (with file - base64):

```json
{
  "app_name": "itungin",
  "user_id": "telegram_chat_id",
  "session_id": "telegram_chat_id",
  "new_message": {
    "role": "user",
    "parts": [
      { "text": "Analisis foto struk ini" },
      {
        "inline_data": {
          "mime_type": "image/jpeg",
          "data": "base64_encoded_file_content"
        }
      }
    ]
  }
}
```

Response (SSE stream):

```
data: {"content": {"parts": [{"text": "Siap! Mau patungan apa nih? ..."}]}}
```

## Test Scenarios

### 1. Split Bill via Text

```
User: Split bill dong, ada 3 orang. Nasi goreng 25rb x2, es teh 5rb x3, pajak 10%
Bot: [Calculates and returns per-person breakdown]
```

### 2. Split Bill via Receipt Photo

```
User: [Sends photo of restaurant receipt]
Bot: [Parses receipt, asks who ordered what, calculates split]
```

### 3. Fund Pool via Text

```
User: Patungan kado bos 500rb, 5 orang: Andi, Budi, Caca, Dedi, Eka
Bot: [Creates pool, shows status]
```

### 4. Fund Pool Payment Update

```
User: Budi udah bayar 100rb
Bot: [Updates payment, shows new status]
```

### 5. Voice Note

```
User: [Sends voice note: "Asep udah transfer 150 ribu ya"]
Bot: [Transcribes, updates payment]
```

## Project Structure

```
.
├── main.py                 # Python agent entry point
├── requirements.txt        # Python dependencies
├── tools.yaml              # MCP Toolbox configuration
├── .env.example            # Environment template
├── itungin_agent/
│   ├── __init__.py
│   ├── agent.py            # ADK agent definition
│   ├── prompts.py          # System prompts
│   ├── server.py           # FastAPI HTTP server
│   └── tools/
│       ├── __init__.py
│       ├── fund_pool_tools.py
│       └── split_bill_tools.py
├── telegram_bot/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       └── index.js        # Telegraf bot
└── collections/
    ├── fund_pools.json     # Fund pool schema
    └── split_bills.json    # Split bill schema
```

## License

MIT
