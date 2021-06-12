import { Router } from 'express'
import multer from 'multer'

const getFileExt = (fileName) => {
  const ext = fileName.match(/\.([a-zA-Z]+)(?:[\?#]|$)/g)
  return ext && ext[0].toLowerCase()
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/')
  },
  filename: function (req, file, cb) {
    const ext = getFileExt(file.originalname)
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
})

const upload = multer({ storage })

const router = Router()

router.post('/upload', upload.single('file'), (req, res) => {
  res.send(req.file)
})

export { router }
