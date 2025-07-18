// app.js o index.js o server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.js'
import classifyRoutes from './routes/classify.js'
import messagesRouter from './routes/messages.js'
import uploadRoutes from './routes/upload.js' // ✅ NUEVO

dotenv.config()
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/classify', classifyRoutes)
app.use('/api/messages', messagesRouter)
app.use('/api/upload', uploadRoutes) // ✅ Ruta para subir imágenes (foto de perfil)

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión MongoDB:', err))

// Servidor
app.listen(3001, '0.0.0.0', () => {
  console.log('✅ Backend escuchando en http://localhost:3001')
})
