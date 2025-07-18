// routes/upload.js
import express from 'express'
import upload from '../middleware/multer.js'
import { subirImagenCloudinary } from '../helpers/cloudinaryUpload.js'

const router = express.Router()

router.post('/imagen', upload.single('imagen'), async (req, res) => {
  try {
    const resultado = await subirImagenCloudinary(req.file.buffer, 'Socialink')
    res.json({ url: resultado.secure_url })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al subir la imagen' })
  }
})

export default router
