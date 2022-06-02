const router = require('express').Router();
const jwtHelper = require('../infra/jwt-helper');
const Controller = require('../controller/circle-controller');

router.get('/',
  jwtHelper.authenticateToken,
  Controller.getAll);

module.exports = router;
