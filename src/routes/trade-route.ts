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
    authenticateToken,
    celebrate({
      [Segments.PARAMS]: Joi.object({
        idTrade: Joi.string().required()
      })
    }),
    Controller.validateTrade)

  router.get(baseRoute + '/validateUpload/:idTrade',
    authenticateToken,
    celebrate({
      [Segments.PARAMS]: Joi.object({
        idTrade: Joi.string().required()
      })
    }),
    Controller.validateUploadFile)

  router.get(baseRoute + '/download/:idTrade',
    authenticateToken,
    celebrate({
      [Segments.PARAMS]: Joi.object({
        idTrade: Joi.string().required()
      })
    }),
    Controller.getDownloadLink)

  router.post(baseRoute + '/get-upload',
    authenticateToken,
    celebrate({
      [Segments.BODY]: Joi.object({
        idTrade: Joi.number().required(),
        fileSize: Joi.number().required()
      })
    }),
    Controller.getUploadLink)

  router.post(baseRoute + '/complete-upload',
    authenticateToken,
    celebrate({
      [Segments.BODY]: Joi.object({
        idTrade: Joi.number().required(),
        uploadId: Joi.string().required(),
        parts: Joi.array().required()
      })
    }),
    Controller.completeUpload)
}
