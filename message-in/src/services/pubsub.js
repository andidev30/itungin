import { PubSub } from '@google-cloud/pubsub'
import 'dotenv/config'

const pubsub = new PubSub()
const TOPIC_NAME = process.env.PUBSUB_TOPIC_NAME

export const publishMessage = async (data) => {
    const dataBuffer = Buffer.from(JSON.stringify(data))
    try {
        await pubsub.topic(TOPIC_NAME).publishMessage({ data: dataBuffer })
        return true
    } catch (pubsubError) {
        console.error('PubSub Error:', pubsubError)
        return false
    }
}
