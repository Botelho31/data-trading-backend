const { Joi, celebrate, Segments } = require('celebrate');
const router = require('express').Router();
const jwtHelper = require('../infra/jwt-helper');
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
      publicAddress: Joi.string().required(),
    }),
  }), Controller.verifyAuth);

router.get('/verify-token',
  jwtHelper.authenticateToken,
  (req, res) => {
    res.json({});
  });

router.get('/circleId/:circleId',
  jwtHelper.authenticateToken,
  celebrate({
    [Segments.PARAMS]: Joi.object({ circleId: Joi.string().required() }),
  }), Controller.getAllFromCircle);

module.exports = router;
