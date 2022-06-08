import { Router } from 'express'
import { authenticateToken } from '../infra/jwt-helper'
import * as Controller from '../controller/trade-controller'
import Schema from '../domain/models/trade'
import { Joi, celebrate, Segments } from 'celebrate'

const baseRoute = 'trade'

export default (router: Router): void => {
  router.post(baseRoute + '/',
    authenticateToken,
    celebrate({
      [Segments.BODY]: Schema
    }), Controller.createTrade)

  router.put(baseRoute + '/enter',
    authenticateToken,
    celebrate({
      [Segments.BODY]: Joi.object({
        circleId: Joi.string().required(),
        tradeId: Joi.string().required(),
        publicAddress: Joi.string().required()
      })
    }), Controller.enterTrade)

  router.get(baseRoute + '/circleId/:circleId',
    authenticateToken,
    celebrate({
      [Segments.PARAMS]: Joi.object({ circleId: Joi.string().required() })
    }), Controller.getAll)
}
