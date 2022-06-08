import { Router } from 'express'
import { Joi, celebrate, Segments } from 'celebrate'
import { authenticateToken } from '../infra/jwt-helper'
import Schema from '../domain/models/user'
import * as Controller from '../controller/user-controller'

const baseRoute = 'user'

export default (router: Router): void => {
  router.post(baseRoute + '/signup',
    celebrate({
      [Segments.BODY]: Schema
    }), Controller.signup)

  router.get(baseRoute + '/nonce/:publicAddress',
    celebrate({
      [Segments.PARAMS]: Joi.object({ publicAddress: Joi.string().required() })
    }), Controller.getNonce)

  router.post(baseRoute + '/verify-auth',
    celebrate({
      [Segments.BODY]: Joi.object({
        nonce: Joi.string().required(),
        publicAddress: Joi.string().required()
      })
    }), Controller.verifyAuth)

  router.get(baseRoute + '/verify-token',
    authenticateToken,
    (req, res) => {
      res.json({})
    })

  router.get(baseRoute + '/circleId/:circleId',
    authenticateToken,
    celebrate({
      [Segments.PARAMS]: Joi.object({ circleId: Joi.string().required() })
    }), Controller.getAllFromCircle)
}
