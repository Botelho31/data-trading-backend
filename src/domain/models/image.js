const { Joi } = require('celebrate');

module.exports = Joi.object({
  link: Joi.string().required(),
  body: Joi.string().required(),
  hoverDescription: Joi.string().required(),
  id: Joi.number()
    .integer()
    .min(0)
    .max(9999)
    .required(),
});
