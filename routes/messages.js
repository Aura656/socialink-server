// routes/messages.js
import express from 'express'
import { crearMensaje, obtenerMensajes, eliminarMensaje } from '../controllers/messageController.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

// Obtener mensajes por tema y subtema (protegido con JWT)
router.get('/:tema/:subtema', verifyToken, obtenerMensajes)

// Enviar nuevo mensaje (solo texto por ahora)
router.post('/', verifyToken, crearMensaje)

// Eliminar mensaje (requiere token)
router.delete('/:id', verifyToken, eliminarMensaje)

export default router
