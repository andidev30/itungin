const { forwardToMessageIn } = require('../services/message-in');

const handleMessage = async (ctx) => {
    const message = ctx.message;
    console.log(JSON.stringify(message, null, 2));

    if (message.video) {
        await ctx.reply('saat ini belum bisa proses audio');
        return;
    }

    try {
        const text = message.text || message.caption || '';
        const caption = message.caption;

        let fileId = null;
        let fileSize = 0;
        let fieldName = 'file';

        if (message.photo) {
            const largestPhoto = message.photo[message.photo.length - 1];
            fileId = largestPhoto.file_id;
            fileSize = largestPhoto.file_size;
        } else if (message.voice) {
            fileId = message.voice.file_id;
            fileSize = message.voice.file_size;
            fieldName = 'voice';
        } else if (message.document) {
            fileId = message.document.file_id;
            fileSize = message.document.file_size;
        } else if (message.audio) {
            fileId = message.audio.file_id;
            fileSize = message.audio.file_size;
        }

        if (fileSize > 5 * 1024 * 1024) {
            await ctx.reply('file terlalu besar');
            return;
        }

        let fileLink = null;
        let filename = null;

        if (fileId) {
            const link = await ctx.telegram.getFileLink(fileId);
            fileLink = link.href;
            filename = link.pathname.split('/').pop() || 'downloaded_file';
        }

        await forwardToMessageIn({
            userId: ctx.from.id,
            text,
            caption,
            fileLink,
            filename,
            fieldName
        });

        console.log('Successfully forwarded message to message-in');

    } catch (error) {
        console.error(`Error forwarding message: ${error.message}`);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
};

module.exports = { handleMessage };
