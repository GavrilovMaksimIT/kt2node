const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { productsUploadDir } = require('../config')

fs.mkdirSync(productsUploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, productsUploadDir)
  },
  filename(req, file, callback) {
    const extension = file.mimetype === 'image/png' ? '.png' : '.jpg'
    callback(null, `${crypto.randomUUID()}${extension}`)
  }
})

function fileFilter(req, file, callback) {
  const allowedTypes = ['image/jpeg', 'image/png']

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Only JPEG and PNG images are allowed')
    error.status = 400
    return callback(error)
  }

  callback(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
})

module.exports = upload
