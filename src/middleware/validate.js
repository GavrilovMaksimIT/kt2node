const Joi = require('joi')

const categories = ['electronics', 'clothing', 'food', 'other']

const productFields = {
  name: Joi.string().trim().min(2).max(100),
  price: Joi.number().positive(),
  category: Joi.string().valid(...categories),
  stock: Joi.number().integer().min(0),
  description: Joi.string().max(500)
}

const createProductSchema = Joi.object({
  ...productFields,
  name: productFields.name.required(),
  price: productFields.price.required(),
  category: productFields.category.required(),
  stock: productFields.stock.default(0)
})

const replaceProductSchema = createProductSchema

const updateProductSchema = Joi.object(productFields).min(1)

const productsQuerySchema = Joi.object({
  category: Joi.string().valid(...categories),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10)
})

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required()
})

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      convert: true
    })

    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      })
    }

    req[source] = value
    next()
  }
}

module.exports = {
  validate,
  createProductSchema,
  replaceProductSchema,
  updateProductSchema,
  productsQuerySchema,
  idSchema
}
