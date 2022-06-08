const { Joi } = require('celebrate')

module.exports = Joi.object({
  circleId: Joi.string().required(),
  saleFrom: Joi.string().required(),
  saleTo: Joi.string().required(),
  description: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.string().required(),
  id: Joi.string()
}).or('saleFrom', 'saleTo')
