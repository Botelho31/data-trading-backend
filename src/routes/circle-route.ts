import { Joi, celebrate, Segments } from 'celebrate'
import { authenticateToken } from '../infra/jwt-helper'
import * as Controller from '../controller/circle-controller'
import { Router } from 'express'

const baseRoute = '/circle'

export default (router: Router): void => {
  router.get(baseRoute + '/',
    authenticateToken,
    Controller.getAll)

  router.get(baseRoute + '/:circleAddress/entry-request',
    authenticateToken,
    celebrate({
      [Segments.PARAMS]: Joi.object({
        circleAddress: Joi.string().required()
      })
    }),
    Controller.getEntryRequests)

  router.put(baseRoute + '/update-user-status',
    authenticateToken,
    celebrate({
      [Segments.BODY]: Joi.object({
        circleAddress: Joi.string().required()
      })
    }),
    Controller.updateUserStatus)

  router.put(baseRoute + '/update-entry-status',
    authenticateToken,
    celebrate({
      [Segments.BODY]: Joi.object({
        circleAddress: Joi.string().required(),
        publicAddress: Joi.string().required()
      })
    }),
    Controller.updateEntryStatus)
}
