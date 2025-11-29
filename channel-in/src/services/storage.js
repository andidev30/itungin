import { Storage } from '@google-cloud/storage'
import 'dotenv/config'

const storage = new Storage()
const BUCKET_NAME = process.env.GCS_BUCKET_NAME

export const uploadFile = async (fileObj) => {
    if (!fileObj || !(fileObj instanceof File)) return null

    const filename = `${Date.now()}-${fileObj.name || 'unnamed'}`
    const bucket = storage.bucket(BUCKET_NAME)
    const blob = bucket.file(filename)

    const arrayBuffer = await fileObj.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await blob.save(buffer)

    return `gs://${BUCKET_NAME}/${filename}`
}
