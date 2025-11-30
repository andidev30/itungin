# Itungin Agent

AI Agent service menggunakan Google Agent Development Kit (ADK) dengan multi-agent orchestration.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Root Agent                           │
│              (Router & Orchestrator)                    │
│                   gemini-2.5-flash                      │
├──────────────────────┬──────────────────────────────────┤
│                      │                                  │
│   ┌──────────────────▼───────────────┐                  │
│   │       split_bill_agent           │                  │
│   │   - create_split_bill            │                  │
│   │   - get_split_bill               │                  │
│   │   - list_split_bills             │                  │
│   └──────────────────────────────────┘                  │
│                                                         │
│   ┌──────────────────────────────────┐                  │
│   │       fund_pool_agent            │                  │
│   │   - create_fund_pool             │                  │
│   │   - record_payment               │                  │
│   │   - get_fund_pool                │                  │
│   │   - list_fund_pools              │                  │
│   └──────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   MCP Toolbox Client  │
              │   (toolbox_core)      │
              └───────────────────────┘
```

## Tech Stack

- **Framework**: Google Agent Development Kit (ADK)
- **Model**: Gemini 2.5 Flash (Vertex AI)
- **Database Client**: MCP Toolbox for Databases

## Files

| File | Description |
|------|-------------|
| `agent.py` | Agent definitions & tool wrappers |
| `prompts.py` | System instructions untuk tiap agent |
| `Dockerfile` | Container config untuk Cloud Run |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CLOUD_PROJECT` | GCP Project ID | Yes |
| `GOOGLE_CLOUD_LOCATION` | GCP Region (default: us-central1) | No |
| `GOOGLE_GENAI_USE_VERTEXAI` | Set to `True` | Yes |
| `MCP_TOOLBOX_URL` | Toolbox server URL | Yes |

## Running Locally

```bash
# Install dependencies
pip install google-adk toolbox-core

# Start ADK API server (port 8000)
adk api_server itungin_agent
```

## API Endpoints

ADK menyediakan endpoints berikut:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/apps/{app}/users/{user}/sessions` | POST | Create session |
| `/run_sse` | POST | Invoke agent (SSE response) |

### Request Format

```json
{
  "app_name": "itungin_agent",
  "user_id": "user123",
  "session_id": "session456",
  "new_message": {
    "role": "user",
    "parts": [
      { "text": "split bill makan siang" },
      { "inline_data": { "mime_type": "image/jpeg", "data": "base64..." } }
    ]
  }
}
```

## Deploy to Cloud Run

```bash
gcloud run deploy itungin-adk --source .
```

