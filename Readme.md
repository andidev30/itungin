# Itungin

> 🏆 **Build and Blog Marathon 2025**

**Itungin** adalah asisten AI berbahasa Indonesia yang membantu split bill dan patungan bareng teman melalui Telegram.

## 🚀 Demo

👉 **Try it now: [@itungin_sini_bot](https://t.me/itungin_sini_bot)**

## 🎯 Problem Statement

Pernahkah mengalami situasi ini?

- 🍕 Makan bareng teman, bingung hitung siapa bayar berapa
- 🎁 Patungan kado, susah tracking siapa udah bayar siapa belum
- 📝 Hitung manual di notes, sering salah & ribet

**Itungin hadir untuk solve ini semua!**

## 💡 Solution

Cukup chat di Telegram, Itungin akan bantu:

### 💸 Split Bill
Bagi tagihan makan dengan adil - support foto struk, voice note, atau ketik manual.

```
User: "Split bill dong, Andi makan nasi goreng 25rb, Budi mie ayam 20rb"
Bot:  📝 Split Bill:
      👤 Andi: Rp 25.000
      👤 Budi: Rp 20.000
      ✅ Tersimpan!
```

### �� Patungan
Kelola iuran bersama - tracking siapa sudah bayar, reminder yang belum.

```
User: "Patungan kado ultah Rani 500rb, peserta: Andi, Budi, Cici"
Bot:  💰 Patungan: Kado Ultah Rani
      🎯 Target: Rp 500.000
      ⏳ Andi - Belum bayar
      ⏳ Budi - Belum bayar
      ⏳ Cici - Belum bayar

User: "Andi udah bayar 170rb"
Bot:  ✅ Pembayaran Andi Rp 170.000 tercatat!
      💰 Terkumpul: Rp 170.000 (34%)
```

## 🏗️ High Level Design

![Architecture](documentation/GenArch%20Diagram.png)

### Services

| Service | Description |
|---------|-------------|
| **Telegram Bot** | Interface utama untuk user berinteraksi via chat |
| **Itungin Agent** | AI Agent dengan multi-agent orchestration (Gemini) |
| **Toolbox DB** | Database layer dengan MCP protocol |
| **PostgreSQL** | Persistent storage untuk data patungan & split bill |

### Flow

```
User (Telegram) 
    → Telegram Bot (message handler)
    → ADK Agent (AI processing)
        ├── Split Bill Agent (tools: create, get, list)
        └── Fund Pool Agent (tools: create, record, get, list)
    → Toolbox DB (SQL execution)
    → PostgreSQL
```

## ✨ Key Features

- 🤖 **Natural Language** - Chat seperti ngobrol biasa
- 📷 **Multimodal** - Kirim foto struk, langsung diproses
- 🎤 **Voice Note** - Males ngetik? Kirim voice aja
- �� **Persistent** - Data tersimpan, bisa dicek kapan aja
- 🔄 **Session** - Lanjut conversation, gak perlu ulang dari awal

## 🛠️ Tech Stack

- **AI**: Google Gemini 2.5 Flash via Vertex AI
- **Agent Framework**: Google Agent Development Kit (ADK)
- **Database Tools**: GenAI Toolbox for Databases (MCP)
- **Bot Framework**: Telegraf (Node.js)
- **Database**: PostgreSQL
- **Deployment**: Google Cloud Run

## 👥 Team

Build and Blog Marathon 2025

## 📄 License

MIT
