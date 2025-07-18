import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  foto: { type: String, required: true }, // URL foto usuario
  contenido: { type: String, required: true },
  tipo: {
    type: String,
    enum: ['texto', 'emoji', 'link', 'sticker'], // ✅ Aquí está el fix
    default: 'texto',
  },
  tema: { type: String, required: true },
  subtema: { type: String, required: true },
  imagenUrl: { type: String }, // URL imagen mensaje (si hay)
}, { timestamps: true })

export default mongoose.model('Message', messageSchema)
