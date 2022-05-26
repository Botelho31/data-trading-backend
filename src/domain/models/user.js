const { Joi } = require('celebrate');

module.exports = Joi.object({
  publicAddress: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  circleIds: Joi.array().string(),
  signedNonce: Joi.string(),
});
