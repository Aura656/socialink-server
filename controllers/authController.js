// controllers/authController.js
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { subirImagenCloudinary } from '../helpers/cloudinaryUpload.js'

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_superseguro'

export const register = async (req, res) => {
  try {
    // 🟡 Consolas para depurar
    console.log('📩 req.body:', req.body)
    console.log('🖼️ req.file:', req.file)

    const { username, departamento, provincia, distrito, email, password } = req.body

    if (!username || !departamento || !provincia || !distrito || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' })
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ error: 'El email o usuario ya están registrados' })
    }

    // Subir imagen perfil a Cloudinary si se envió archivo
    let photoUrl = ''
    if (req.file) {
      try {
        const uploadResult = await subirImagenCloudinary(req.file.buffer, 'usuarios_perfiles')
        photoUrl = uploadResult.secure_url
      } catch (err) {
        console.error('Error subiendo imagen a Cloudinary:', err)
        return res.status(500).json({ error: 'Error al subir la imagen' })
      }
    }

    const newUser = new User({
      username,
      photoUrl,
      departamento,
      provincia,
      distrito,
      email,
      password, // se hashea con pre 'save'
    })

    await newUser.save()
    res.status(201).json({ message: 'Usuario registrado correctamente' })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ error: 'Error en el registro' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' })

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        photoUrl: user.photoUrl,
        departamento: user.departamento,
        provincia: user.provincia,
        distrito: user.distrito,
        email: user.email,
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en el login' })
  }
}
