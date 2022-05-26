const { Joi, celebrate, Segments } = require('celebrate');
const router = require('express').Router();
const Schema = require('../domain/models/trade');
const Controller = require('../controller/trade-controller');

router.post('/',
  celebrate({
    [Segments.BODY]: Schema,
  }), Controller.createTrade);

router.put('/enter',
  celebrate({
    [Segments.BODY]: Joi.object({
      circleId: Joi.string().required(),
      tradeId: Joi.string().required(),
      publicAddress: Joi.string().required(),
    }),
  }), Controller.enterTrade);

router.get('/circleId/:circleId',
  celebrate({
    [Segments.PARAMS]: Joi.object({ circleId: Joi.string().required() }),
  }), Controller.getAll);

module.exports = router;
