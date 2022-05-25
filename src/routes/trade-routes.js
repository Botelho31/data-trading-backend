const { Joi, celebrate, Segments } = require('celebrate');
const router = require('express').Router();
const Schema = require('../domain/models/trade');
const Controller = require('../controller/trade-controller');

router.post('/trade',
  celebrate({
    [Segments.BODY]: Schema,
  }), Controller.createTrade);

router.get('/trade/circleId/:circleId',
  celebrate({
    [Segments.PARAMS]: Joi.object({ circleId: Joi.string().required() }),
  }), Controller.getAll);
module.exports = router;
