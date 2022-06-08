const { Joi, celebrate, Segments } = require('celebrate')
const router = require('express').Router()
const jwtHelper = require('../infra/jwt-helper')
const Schema = require('../domain/models/trade')
const Controller = require('../controller/trade-controller')

router.post('/',
  jwtHelper.authenticateToken,
  celebrate({
    [Segments.BODY]: Schema
  }), Controller.createTrade)

router.put('/enter',
  jwtHelper.authenticateToken,
  celebrate({
    [Segments.BODY]: Joi.object({
      circleId: Joi.string().required(),
      tradeId: Joi.string().required(),
      publicAddress: Joi.string().required()
    })
  }), Controller.enterTrade)

router.get('/circleId/:circleId',
  jwtHelper.authenticateToken,
  celebrate({
    [Segments.PARAMS]: Joi.object({ circleId: Joi.string().required() })
  }), Controller.getAll)

module.exports = router
