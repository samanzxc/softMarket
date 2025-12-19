import crypto from 'node:crypto'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

const PORT = Number(process.env.PORT || 3001)
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173'
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

if (!TELEGRAM_BOT_TOKEN) {
  console.warn('[WARN] TELEGRAM_BOT_TOKEN is not set. Telegram auth verification will fail until you create server/.env')
}

app.use(cors({ origin: ALLOWED_ORIGIN, credentials: false }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

function buildDataCheckString(payload) {
  const entries = Object.entries(payload)
    .filter(([key, value]) => key !== 'hash' && value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)])
    .sort(([a], [b]) => a.localeCompare(b))

  return entries.map(([k, v]) => `${k}=${v}`).join('\n')
}

function verifyTelegramHash(payload, botToken) {
  const receivedHash = String(payload.hash || '')
  if (!receivedHash) return false

  const dataCheckString = buildDataCheckString(payload)

  const secretKey = crypto.createHash('sha256').update(botToken).digest()
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(receivedHash, 'hex'))
}

app.post('/auth/telegram', (req, res) => {
  try {
    const payload = req.body || {}

    if (!TELEGRAM_BOT_TOKEN) {
      res.status(500).json({ ok: false, error: 'Server is not configured (TELEGRAM_BOT_TOKEN missing)' })
      return
    }

    const required = ['id', 'first_name', 'auth_date', 'hash']
    for (const k of required) {
      if (!payload[k]) {
        res.status(400).json({ ok: false, error: `Missing field: ${k}` })
        return
      }
    }

    const ok = verifyTelegramHash(payload, TELEGRAM_BOT_TOKEN)
    if (!ok) {
      res.status(401).json({ ok: false, error: 'Invalid Telegram hash' })
      return
    }

    res.json({ ok: true, data: payload })
  } catch (e) {
    console.error(e)
    res.status(500).json({ ok: false, error: 'Internal error' })
  }
})

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`)
  console.log(`[server] allowed origin: ${ALLOWED_ORIGIN}`)
})
