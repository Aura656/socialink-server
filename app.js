// server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Importar rutas
import authRoutes from './routes/auth.js'
import classifyRoutes from './routes/classify.js'
import messagesRouter from './routes/messages.js'
import uploadRoutes from './routes/upload.js'

dotenv.config()

const app = express()

// ✅ CORS configurado para frontend en Vercel
app.use(cors({
  origin: 'https://socialink-client.vercel.app', // cámbialo a http://localhost:5173 si estás en local
  credentials: true,
}))

// ✅ Middleware para parsear JSON y formularios
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // 🔥 necesario para FormData

// ✅ Rutas
app.use('/api/auth', authRoutes)
app.use('/api/classify', classifyRoutes)
app.use('/api/messages', messagesRouter)
app.use('/api/upload', uploadRoutes)

// ✅ Conexión con MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión MongoDB:', err))

// ✅ Levantar servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`)
})
