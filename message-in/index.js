import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'
import { handleTelegramWebhook } from './src/handlers/telegram.js'

const PORT = process.env.PORT || 3000

const app = new Hono()

app.get('/health', (c) => c.text('OK'))
app.post('/telegram', handleTelegramWebhook)

console.log(`Server is running on port ${PORT}`)

serve({
    fetch: app.fetch,
    port: Number(PORT)
})
