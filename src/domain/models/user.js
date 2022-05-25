const { Joi } = require('celebrate');

module.exports = Joi.object({
  publicAddress: Joi.string().required(),
  signedNonce: Joi.string(),
});
