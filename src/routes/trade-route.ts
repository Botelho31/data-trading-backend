import { Router } from 'express'
import { authenticateToken } from '../infra/jwt-helper'
import * as Controller from '../controller/trade-controller'
import Schema from '../domain/models/trade'
import { Joi, celebrate, Segments } from 'celebrate'

const baseRoute = '/trade'

export default (router: Router): void => {
  router.post(baseRoute,
    authenticateToken,
    celebrate({
      [Segments.BODY]: Schema
    }),
    Controller.createTrade)

  router.post(baseRoute + '/enter',
    authenticateToken,
    celebrate({
      [Segments.BODY]: Joi.object({
        circleAddress: Joi.string().required(),
        idTrade: Joi.number().required(),
        publicAddress: Joi.string().required()
      })
    }), Controller.enterTrade)

  router.get(baseRoute + '/circleAddress/:circleAddress',
    authenticateToken,
    celebrate({
      [Segments.PARAMS]: Joi.object({
        circleAddress: Joi.string().required()
      })
    }), Controller.getAll)

  router.get(baseRoute + '/validate/:idTrade',
    // authenticateToken,
    celebrate({
      [Segments.PARAMS]: Joi.object({
        idTrade: Joi.string().required()
      })
    }),
    Controller.validateTrade)
}
