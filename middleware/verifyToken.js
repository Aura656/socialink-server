// middleware/verifyToken.js
import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token o formato incorrecto' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Token mal formado' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' })
      }

      req.user = decoded
      next()
    })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
