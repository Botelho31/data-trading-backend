const { Joi, celebrate, Segments } = require('celebrate')
const router = require('express').Router()
const jwtHelper = require('../infra/jwt-helper')
const Controller = require('../controller/circle-controller')

router.get('/',
  jwtHelper.authenticateToken,
  Controller.getAll)

router.put('/entry-request',
  jwtHelper.authenticateToken,
  celebrate({
    [Segments.BODY]: Joi.object({
      circleAddress: Joi.string().required()
    })
  }),
  Controller.putEntryRequest)

module.exports = router
