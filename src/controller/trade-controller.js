const crypto = require('crypto');
const jwtHelper = require('../infra/jwt-helper');
const dynamoHelper = require('../infra/dynamo-helper');

const tableName = 'user';

module.exports = {
  async createTrade(req, res, next) {
    try {
      if(req.body.id === null){
        const trade = await dynamoHelper.create(tableName, req.body);
        console.log(trade);
        return res.json(trade);
      } else if(req.body.saleTo !== null) {
        const trade = await dynamoHelper.updateObject(tableName, {
          id: req.body.id
        }, 'saleTo', req.body.saleTo);
        return res.json(trade);
      } else {
        const trade = await dynamoHelper.updateObject(tableName, {
          id: req.body.id
        }, 'saleFrom', req.body.saleFrom);
        return res.json(trade);
      }
    } catch (error) {
      return next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const { circleId } = req.body;
      const user = await dynamoHelper.queryTableWhereId(tableName, 'publicAddress', publicAddress);
      if (user !== undefined) {
        return res.status(409).json({ message: 'PUBLIC_ADDRESS_ALREADY_EXISTS' });
      }
      const nonce = await module.exports.createNonce(publicAddress);
      req.body.nonce = nonce;
      return res.json(req.body);
    } catch (error) {
      return next(error);
    }
  },
}