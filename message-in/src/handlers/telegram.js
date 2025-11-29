import { uploadFile } from '../services/storage.js'
import { publishMessage } from '../services/pubsub.js'

export const handleTelegramWebhook = async (c) => {
    try {
        const body = await c.req.parseBody()
        const { userId, message, caption } = body

        const file = body['file']
        const voice = body['voice']

        let fileUrls = []

        if (file) {
            const url = await uploadFile(file)
            if (url) fileUrls.push(url)
        }
        if (voice) {
            const url = await uploadFile(voice)
            if (url) fileUrls.push(url)
        }

        const pubsubMessage = {
            channelId: userId,
            message: message || caption || '',
            fileUrl: fileUrls
        }

        await publishMessage(pubsubMessage)

        return c.json({ success: true })
    } catch (e) {
        console.error('Error processing webhook:', e)
        return c.json({ success: false, error: e.message }, 500)
    }
}
