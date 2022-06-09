const { Joi } = require('celebrate')

export default Joi.object({
  circleAddress: Joi.string().required(),
  saleFrom: Joi.string().allow(null),
  saleTo: Joi.string().allow(null),
  description: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  idTrade: Joi.number()
}).or('saleFrom', 'saleTo')
