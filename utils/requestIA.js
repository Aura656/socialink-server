import fetch from 'node-fetch'

export async function getEmbedding(text) {
  try {
    const res = await fetch('http://localhost:8000/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    if (!res.ok) {
      console.error(`❌ Error en IA: ${res.status} ${res.statusText}`)
      throw new Error('Respuesta no válida del servicio de IA')
    }

    const data = await res.json()
    return data.embedding
  } catch (err) {
    console.error('❌ No se pudo conectar al servicio IA:', err.message)
    throw err
  }
}
