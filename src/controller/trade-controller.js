const crypto = require('crypto');
const jwtHelper = require('../infra/jwt-helper');
const dynamoHelper = require('../infra/dynamo-helper');

const tableName = 'user';

module.exports = {
  async createTrade(req, res, next) {
    try {
      const { publicAddress } = req.body;
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
  async getAll(req, res, next) {
    try {
      const { publicAddress } = req.body;
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