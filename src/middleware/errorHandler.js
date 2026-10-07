const multer = require('multer')

function errorHandler(err, req, res, next) {
  let status = err.status || 500
  let message = err.message || 'Internal server error'

  if (err instanceof multer.MulterError) {
    status = 400

    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Image size must not exceed 2 MB'
    }
  }

  console.error(err.stack || err)

  res.status(status).json({ error: message })
}

module.exports = errorHandler
