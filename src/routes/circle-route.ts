import { Joi, celebrate, Segments } from 'celebrate'
import { authenticateToken } from '../infra/jwt-helper'
import * as Controller from '../controller/circle-controller'
import { Router } from 'express'

const baseRoute = 'circle'

export default (router: Router): void => {
  router.get(baseRoute + '/',
    authenticateToken,
    Controller.getAll)

  router.put(baseRoute + '/entry-request',
    authenticateToken,
    celebrate({
      [Segments.BODY]: Joi.object({
        circleAddress: Joi.string().required()
      })
    }),
    Controller.putEntryRequest)
}
