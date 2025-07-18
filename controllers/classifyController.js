import { getEmbedding } from '../utils/requestIA.js'

const messages = []
const topics = {}

export const classifyMessage = async (req, res) => {
  try {
    const { text } = req.body

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Mensaje vacío' })
    }

    const embedding = await getEmbedding(text)

    const topic = 'tema-' + Math.floor(Math.random() * 5)

    messages.push({ text, embedding, topic })
    topics[topic] = (topics[topic] || 0) + 1

    res.json({ topic })

  } catch (error) {
    console.error('❌ Error en classifyMessage:', error.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
