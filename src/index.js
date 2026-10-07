const express = require('express')
const path = require('path')
const { port } = require('./config')
const logger = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const productsRouter = require('./routes/products')

const app = express()

app.use(logger)
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/api/products', productsRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use(errorHandler)

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

module.exports = app
