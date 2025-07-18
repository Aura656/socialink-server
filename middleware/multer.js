// middlewares/multer.js
import multer from 'multer'

const storage = multer.memoryStorage() // guarda como buffer
const upload = multer({ storage })

export default upload
