import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { subirImagenCloudinary } from '../helpers/cloudinaryUpload.js'

// REGISTRO
export const register = async (req, res) => {
  try {
    const { username, departamento, provincia, distrito, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Este correo ya está registrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let foto = ''
    if (req.file) {
      const uploadResult = await subirImagenCloudinary(req.file.buffer, 'Usuarios')
      foto = uploadResult.secure_url
    }

    const newUser = new User({
      username,
      departamento,
      provincia,
      distrito,
      email,
      password: hashedPassword,
      foto,
    })

    await newUser.save()

    res.status(201).json({ message: 'Usuario registrado con éxito' })
  } catch (error) {
    console.error('❌ Error en el registro:', error)
    res.status(500).json({ error: 'Error en el registro' })
  }
}

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' })
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        foto: user.foto,
        ubicacion: `${user.departamento} - ${user.provincia}`,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    )

    res.status(200).json({ token })
  } catch (error) {
    console.error('❌ Error en login:', error)
    res.status(500).json({ error: 'Error en login' })
  }
}

// PERFIL (protegido con middleware)
export const perfilUsuario = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json(user)
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error)
    res.status(500).json({ error: 'Error al obtener perfil' })
  }
}
