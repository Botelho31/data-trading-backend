const { Joi, celebrate, Segments } = require('celebrate');
const router = require('express').Router();
const Controller = require('../controller/image-controller');
const Schema = require('../domain/models/image');
const jwtHelper = require('../infra/jwt-helper');

router.post('/',
  jwtHelper.authenticateToken,
  celebrate({
    [Segments.BODY]: Schema,
  }), Controller.create);

router.get('/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object({ id: Joi.string().required() }),
  }), Controller.getById);

module.exports = router;
