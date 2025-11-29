const axios = require('axios');
const FormData = require('form-data');

const MESSAGE_IN_URL = process.env.MESSAGE_IN_URL || 'http://localhost:3000/telegram';

const forwardToMessageIn = async ({ userId, text, caption, fileLink, filename, fieldName }) => {
    const formData = new FormData();
    formData.append('userId', String(userId));
    formData.append('message', text || '');
    if (caption) {
        formData.append('caption', caption);
    }

    if (fileLink) {
        const response = await axios.get(fileLink, { responseType: 'stream' });
        formData.append(fieldName || 'file', response.data, { filename });
    }

    await axios.post(MESSAGE_IN_URL, formData, {
        headers: {
            ...formData.getHeaders()
        }
    });
};

module.exports = { forwardToMessageIn };
