const { Router } = require('express')
const upload = require('../middleware/upload')
const {
  validate,
  createProductSchema,
  replaceProductSchema,
  updateProductSchema,
  productsQuerySchema,
  idSchema
} = require('../middleware/validate')

const router = Router()

let products = []
let nextId = 1

function findProduct(req, res, next) {
  const product = products.find(item => item.id === req.params.id)

  if (!product) {
    return res.status(404).json({ error: 'Product not found' })
  }

  req.product = product
  next()
}

router.get('/', validate(productsQuerySchema, 'query'), (req, res) => {
  const { category, minPrice, maxPrice, page, limit } = req.query
  let result = [...products]

  if (category) result = result.filter(product => product.category === category)
  if (minPrice !== undefined) result = result.filter(product => product.price >= minPrice)
  if (maxPrice !== undefined) result = result.filter(product => product.price <= maxPrice)

  const total = result.length
  const offset = (page - 1) * limit

  res.json({
    data: result.slice(offset, offset + limit),
    total,
    page,
    limit
  })
})

router.get('/:id', validate(idSchema, 'params'), findProduct, (req, res) => {
  res.json(req.product)
})

router.post('/', validate(createProductSchema), (req, res) => {
  const product = {
    id: nextId++,
    ...req.body,
    imageUrl: null,
    createdAt: new Date().toISOString()
  }

  products.push(product)
  res.status(201).json(product)
})

router.put(
  '/:id',
  validate(idSchema, 'params'),
  findProduct,
  validate(replaceProductSchema),
  (req, res) => {
    const index = products.findIndex(item => item.id === req.params.id)
    const replacement = {
      id: req.product.id,
      ...req.body,
      imageUrl: req.product.imageUrl,
      createdAt: req.product.createdAt
    }

    products[index] = replacement
    res.json(replacement)
  }
)

router.patch(
  '/:id',
  validate(idSchema, 'params'),
  findProduct,
  validate(updateProductSchema),
  (req, res) => {
    Object.assign(req.product, req.body)
    res.json(req.product)
  }
)

router.delete('/:id', validate(idSchema, 'params'), findProduct, (req, res) => {
  products = products.filter(item => item.id !== req.params.id)
  res.status(204).send()
})

router.post(
  '/:id/image',
  validate(idSchema, 'params'),
  findProduct,
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' })
    }

    req.product.imageUrl = `/uploads/products/${req.file.filename}`
    res.json(req.product)
  }
)

module.exports = router
