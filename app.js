import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.js'
import classifyRoutes from './routes/classify.js'
import messagesRouter from './routes/messages.js'
import uploadRoutes from './routes/upload.js'

dotenv.config()
const app = express()

app.use(cors({
  origin: 'https://socialink-client.vercel.app',
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/classify', classifyRoutes)
app.use('/api/messages', messagesRouter)
app.use('/api/upload', uploadRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión MongoDB:', err))

const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`)
})
