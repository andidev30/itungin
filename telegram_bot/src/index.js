/**
 * Itungin Telegram Bot
 * Handles text, photo, document, and voice messages from users
 * and forwards them to the ADK Agent API.
 */

import { Telegraf } from 'telegraf';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// ADK default API endpoint (adk api_server runs on port 8000)
const AGENT_API_URL = process.env.AGENT_API_URL || 'http://localhost:8000';
const APP_NAME = 'itungin_agent';

if (!BOT_TOKEN) {
  console.error('Error: TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

// Initialize bot
const bot = new Telegraf(BOT_TOKEN);

/**
 * Download file from Telegram and convert to base64
 * @param {string} fileId - Telegram file ID
 * @returns {Promise<{base64: string, mimeType: string}>} - Base64 data
 */
async function downloadFileAsBase64(fileId) {
  try {
    const file = await bot.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data).toString('base64');
    return base64;
  } catch (error) {
    console.error('Error downloading file:', error);
    return null;
  }
}

// Store session IDs per user
const userSessions = new Map();

/**
 * Get or create session for user
 */
async function getOrCreateSession(userId) {
  if (userSessions.has(userId)) {
    return userSessions.get(userId);
  }

  try {
    const response = await axios.post(
      `${AGENT_API_URL}/apps/${APP_NAME}/users/${userId}/sessions`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    const sessionId = response.data.id;
    userSessions.set(userId, sessionId);
    return sessionId;
  } catch (error) {
    console.error('Error creating session:', error.message);
    throw error;
  }
}

/**
 * Send request to ADK Agent API
 * @param {string} userId - User ID for session
 * @param {string} message - Text message
 * @param {string} file - Base64 encoded file (optional)
 * @param {string} mimeType - MIME type of file (optional)
 * @returns {Promise<string>} - Agent response text
 */
async function invokeAgent(userId, message, file = null, mimeType = null) {
  try {
    const sessionId = await getOrCreateSession(userId);

    const payload = {
      app_name: APP_NAME,
      user_id: userId,
      session_id: sessionId,
      new_message: {
        role: 'user',
        parts: []
      }
    };

    // Add text part
    if (message) {
      payload.new_message.parts.push({ text: message });
    }

    // Add file part (inline_data with base64)
    if (file && mimeType) {
      payload.new_message.parts.push({
        inline_data: {
          mime_type: mimeType,
          data: file
        }
      });
    }

    const response = await axios.post(`${AGENT_API_URL}/run_sse`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000, // 120 second timeout for AI processing
      responseType: 'text'
    });

    // Parse SSE response - get the last text response
    const lines = response.data.split('\n');
    let lastText = '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.content?.parts) {
            for (const part of data.content.parts) {
              if (part.text) {
                lastText = part.text;
              }
            }
          }
        } catch (e) {
          // Skip non-JSON lines
        }
      }
    }

    return lastText || 'Maaf, aku lagi bingung nih 😅';
  } catch (error) {
    console.error('Error invoking agent:', error.message);
    return 'Lagi ada kendala teknis, coba lagi sebentar ya 🙏';
  }
}

/**
 * Get user ID for session management
 */
function getUserId(ctx) {
  return String(ctx.chat.id);
}

// Handle /start command
bot.start((ctx) => {
  ctx.reply(
    `Halo ${ctx.from.first_name || 'kak'}! 👋\n\n` +
    `Aku Itungin, asisten untuk bantu kamu:\n` +
    `💰 *Split Bill* - Bagi-bagi tagihan makan\n` +
    `🎁 *Patungan* - Kelola iuran bersama\n\n` +
    `Kirim aja pesan, foto struk, atau voice note!\n` +
    `Contoh:\n` +
    `- "Split bill dong, ada 3 orang"\n` +
    `- "Patungan kado 500rb, 5 orang"\n` +
    `- Kirim foto struk restoran`,
    { parse_mode: 'Markdown' }
  );
});

// Handle /help command
bot.help((ctx) => {
  ctx.reply(
    `📖 *Cara Pakai Itungin*\n\n` +
    `*Split Bill:*\n` +
    `- Ketik detail tagihan atau kirim foto struk\n` +
    `- Sebutkan siapa makan apa\n` +
    `- Aku hitung pembagiannya!\n\n` +
    `*Patungan:*\n` +
    `- "Patungan [judul] [target] [nama-nama]"\n` +
    `- "Asep udah bayar 150k"\n` +
    `- Kirim bukti transfer\n` +
    `- "Rekap patungan"\n\n` +
    `Bisa juga kirim voice note! 🎤`,
    { parse_mode: 'Markdown' }
  );
});

// Handle text messages
bot.on('text', async (ctx) => {
  const userId = getUserId(ctx);
  const text = ctx.message.text;

  const response = await invokeAgent(userId, text);
  await ctx.reply(response);
});

// Handle photo messages
bot.on('photo', async (ctx) => {
  const userId = getUserId(ctx);
  const photos = ctx.message.photo;
  const photo = photos[photos.length - 1];
  const caption = ctx.message.caption || 'Analisis foto ini';

  const base64 = await downloadFileAsBase64(photo.file_id);
  const response = await invokeAgent(userId, caption, base64, 'image/jpeg');
  await ctx.reply(response);
});

// Handle document messages
bot.on('document', async (ctx) => {
  const userId = getUserId(ctx);
  const doc = ctx.message.document;
  const caption = ctx.message.caption || `Analisis dokumen: ${doc.file_name}`;
  const mimeType = doc.mime_type || 'application/octet-stream';

  const base64 = await downloadFileAsBase64(doc.file_id);
  const response = await invokeAgent(userId, caption, base64, mimeType);
  await ctx.reply(response);
});

// Handle voice messages
bot.on('voice', async (ctx) => {
  const userId = getUserId(ctx);
  const voice = ctx.message.voice;
  const mimeType = voice.mime_type || 'audio/ogg';

  const base64 = await downloadFileAsBase64(voice.file_id);
  const response = await invokeAgent(userId, 'Transkrip dan pahami voice note ini', base64, mimeType);
  await ctx.reply(response);
});

// Error handling
bot.catch((err, ctx) => {
  console.log(err)
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply('Lagi ada kendala teknis, coba lagi sebentar ya 🙏');
});

// Launch bot
console.log('Starting Itungin Telegram Bot...');
bot.launch()
  .then(() => console.log('Bot is running!'))
  .catch((err) => {
    console.error('Failed to start bot:', err);
    process.exit(1);
  });

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

