const path = require('path')

require('dotenv').config()

module.exports = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  productsUploadDir: path.join(process.cwd(), 'uploads', 'products')
}
