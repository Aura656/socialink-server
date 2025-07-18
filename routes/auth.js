import express from 'express'
import { register, login } from '../controllers/authController.js'
import User from '../models/User.js'
import upload from '../middleware/multer.js' // 👉 Importa multer

const router = express.Router()

// Ruta para registrar nuevo usuario con foto
router.post('/register', upload.single('photo'), register) // 👈 Agrega multer aquí

// Ruta para iniciar sesión
router.post('/login', login)

// Ruta de prueba: obtener todos los usuarios (excluyendo contraseñas)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
})

export default router
