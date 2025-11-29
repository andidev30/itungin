require('dotenv').config();

const { Telegraf } = require('telegraf');
const { PubSub } = require('@google-cloud/pubsub');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const { checkOrCreateUser } = require('./middleware');

const pubSubClient = new PubSub({ projectId: process.env.GOOGLE_CLOUD_PROJECT_ID });
const topicName = process.env.PUBSUB_TOPIC_NAME;

// Middleware to check/create user
bot.use(async (ctx, next) => {
    if (ctx.from) {
        try {
            await checkOrCreateUser(ctx.from);
        } catch (error) {
            console.error('Failed to check/create user:', error);
        }
    }
    return next();
});

bot.on(['text', 'photo', 'document', 'video', 'voice', 'audio'], async (ctx) => {
    const message = ctx.message;
    console.log(JSON.stringify(message, null, 2));
    const data = JSON.stringify(message);
    const dataBuffer = Buffer.from(data);

    try {
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published.`);
    } catch (error) {
        console.error(`Received error while publishing: ${error.message}`);
    }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Telegram listener service started...');
