const { Joi, celebrate, Segments } = require('celebrate');
const router = require('express').Router();
const Schema = require('../domain/models/user');
const Controller = require('../controller/user-controller');

router.post('/signup',
  celebrate({
    [Segments.BODY]: Schema,
  }), Controller.signup);

router.get('/nonce/:publicAddress',
  celebrate({
    [Segments.PARAMS]: Joi.object({ publicAddress: Joi.string().required() }),
  }), Controller.getNonce);

router.post('/verify-auth',
  celebrate({
    [Segments.BODY]: Joi.object({
      nonce: Joi.string().required(),
    }),
  }), Controller.verifyAuth);

router.post('/circleId/:circleId',
  celebrate({
    [Segments.BODY]: Joi.object({
      nonce: Joi.string().required(),
    }),
    [Segments.PARAMS]: Joi.object({ circleId: Joi.string().required() }),
  }), Controller.getAllFromCircle);

module.exports = router;
