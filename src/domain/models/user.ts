const { Joi } = require('celebrate')

export default Joi.object({
  publicAddress: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().required()
})
