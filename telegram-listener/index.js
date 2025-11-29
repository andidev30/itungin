require('dotenv').config();

const { Telegraf } = require('telegraf');
const { handleMessage } = require('./src/handlers/message');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.on(['text', 'photo', 'document', 'video', 'voice', 'audio'], handleMessage);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Telegram listener service started...');
