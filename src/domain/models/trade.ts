const { Joi } = require('celebrate')

export default Joi.object({
  circleAddress: Joi.string().required(),
  saleFrom: Joi.string().required(),
  saleTo: Joi.string().required(),
  description: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.string().required(),
  idTrade: Joi.string()
}).or('saleFrom', 'saleTo')
