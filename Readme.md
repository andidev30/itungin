# 🧾 Itungin: AI-Powered Multi-Agent Financial Orchestrator

> **BNB Marathon 2025 Submission**

![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Cloud Run](https://img.shields.io/badge/Cloud_Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Vertex AI](https://img.shields.io/badge/Vertex_AI-FBBC04?style=for-the-badge&logo=google-cloud&logoColor=white)
![Gemini](https://img.shields.io/badge/Powered_by-Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

**Itungin** streamlines group expenses by acting as an intelligent orchestrator that handles both complex receipt-based bill splitting and collective fund pooling. By leveraging a **Multi-Agent Architecture** on Google Cloud, it eliminates the friction of manual coordination, math errors, and awkward money conversations.

---

## 🚀 Key Features

### 1. 🧾 Smart Split Bill Agent (The "Math Wizard")
Unlike standard calculators, this agent handles real-world chaos:
* **Multimodal Receipt Scanning:** Uses **Gemini 1.5 Flash** via Vertex AI to parse unstructured receipt images instantly.
* **Complex Logic Solver:** Automatically identifies and calculates **Tax (PB1)**, **Service Charges**, and **Discounts**.
* **Natural Language Rules:** Understands context like *"Diskon 50% max 20rb, ongkir ditanggung si Bos"* to calculate fair shares.

### 2. 💰 Pool Fund Agent (The "Treasurer")
* **Transparent Collection:** Tracks contributions for shared goals (e.g., gifts, trips) in real-time.
* **Status Tracking:** Monitors target amounts vs. collected funds stored securely in Firestore.

---

## 🏗️ High-Level Architecture

Itungin utilizes an **Event-Driven Microservices** pattern to ensure scalability and responsiveness.

![High-Level Architecture](documentation/Itungin%20HLD%20from%20GenArch.png)

### Tech Stack

  * **Compute:** Google Cloud Run
  * **Event Bus:** Cloud Pub/Sub
A  * **Framework:** AI Agent Development Kit (ADK)
  * **Database:** Firestore (Datastore)
  * **Language:** Node.js

-----

## 📂 Database Schema (Firestore)

The system relies on three core collections to maintain state and history:

1.  **`users`**: User profiles and notification preferences.
2.  **`split_bills`**: Stores receipt images, extracted line items, natural language rules, and final calculation per participant.
3.  **`fund_pools`**: Manages collective funding targets, deadlines, and contributor ledgers.

-----




*Built with ❤️ at BNB Marathon 2025 Jakarta*