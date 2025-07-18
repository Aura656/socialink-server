// server/test.js
import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Servidor Express funcionando correctamente ✅')
})

app.listen(3001, () => {
  console.log('🚀 Servidor Express básico en http://localhost:3001')
})
