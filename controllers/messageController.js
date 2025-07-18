import Message from '../models/Message.js'
import User from '../models/User.js'

// Crear mensaje (solo texto)
export const crearMensaje = async (req, res) => {
  try {
    const { contenido, tipo, tema, subtema } = req.body

    // 🔍 Verifica si el token trajo al usuario
    console.log('🟡 Usuario desde token:', req.user)

    const user = await User.findById(req.user.id)

    // 🟥 Si no encuentra el usuario en la base de datos
    if (!user) {
      console.log('🔴 No se encontró el usuario con ID:', req.user.id)
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // ⚠️ Validaciones del cuerpo del mensaje
    if (!contenido) {
      return res.status(400).json({ error: 'Se requiere contenido' })
    }
    if (!tema || !subtema) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' })
    }

    const nuevoMensaje = new Message({
      userId: user._id,
      username: user.username,
      foto: user.photoUrl,
      contenido,
      tipo,
      tema,
      subtema
    })

    await nuevoMensaje.save()

    console.log('✅ Mensaje guardado correctamente:', nuevoMensaje)

    res.status(201).json(nuevoMensaje)
  } catch (error) {
    console.error('❌ Error al guardar mensaje:', error)
    res.status(500).json({ error: 'Error al guardar mensaje' })
  }
}

// Obtener mensajes por tema y subtema
export const obtenerMensajes = async (req, res) => {
  try {
    const { tema, subtema } = req.params

    const mensajes = await Message.find({ tema, subtema }).sort({ createdAt: 1 })
    res.json(mensajes)
  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error)
    res.status(500).json({ error: 'Error al obtener mensajes' })
  }
}

// Eliminar mensaje por ID (solo si es del usuario)
export const eliminarMensaje = async (req, res) => {
  try {
    const { id } = req.params

    const mensaje = await Message.findById(id)
    if (!mensaje) {
      return res.status(404).json({ error: 'Mensaje no encontrado' })
    }

    if (mensaje.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado para eliminar este mensaje' })
    }

    await mensaje.deleteOne()
    res.json({ mensaje: 'Mensaje eliminado correctamente' })
  } catch (error) {
    console.error('❌ Error al eliminar mensaje:', error)
    res.status(500).json({ error: 'Error al eliminar mensaje' })
  }
}
