const { Datastore } = require('@google-cloud/datastore');

const datastore = new Datastore({ projectId: process.env.GOOGLE_CLOUD_PROJECT_ID });
const KIND = 'users';

/**
 * Checks if a user exists in Datastore, creates if not.
 * @param {object} telegramUser - The user object from Telegram (ctx.from).
 * @returns {Promise<string>} - The user ID.
 */
async function checkOrCreateUser(telegramUser) {
    const userId = String(telegramUser.id);
    const key = datastore.key([KIND, userId]);

    try {
        const [entity] = await datastore.get(key);

        if (entity) {
            console.log(`User ${userId} already exists.`);
            return userId;
        }

        console.log(`User ${userId} not found. Creating new user...`);
        const newUser = {
            key: key,
            data: {
                id: userId,
                name: `${telegramUser.first_name || ''} ${telegramUser.last_name || ''}`.trim(),
                username: telegramUser.username || '',
                language_code: telegramUser.language_code || '',
                created_at: new Date(),
            },
        };

        await datastore.save(newUser);
        console.log(`User ${userId} created.`);
        return userId;
    } catch (error) {
        console.error('Error in checkOrCreateUser:', error);
        throw error;
    }
}

module.exports = { checkOrCreateUser };
