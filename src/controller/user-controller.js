const crypto = require('crypto');
const jwtHelper = require('../infra/jwt-helper');
const dynamoHelper = require('../infra/dynamo-helper');
const { ethers } = require('ethers');

const tableName = 'user';

module.exports = {
  async createNonce(publicAddress) {
    const nonce = crypto.randomBytes(16).toString('hex');
    await dynamoHelper.create(tableName, {
      publicAddress,
      nonce,
    });
    return nonce;
  },
  async signup(req, res, next) {
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
  async getNonce(req, res, next) {
    try {
      const { publicAddress } = req.params;
      const user = await dynamoHelper.queryTableWhereId(tableName, 'publicAddress', publicAddress);
      if (user === undefined) {
        return res.status(404).json({ message: 'PUBLIC_ADDRESS_DOES_NOT_EXIST' });
      }
      const nonce = await module.exports.createNonce(publicAddress);
      return res.json({ nonce });
    } catch (error) {
      return next(error);
    }
  },
  async verifyAuth(req, res, next) {
    try {
      const { publicAddress, nonce } = req.body;
      const row = await dynamoHelper.queryTableWhereId(tableName, 'publicAddress', publicAddress);
      const response = await ethers.utils.verifyMessage(row.nonce, nonce);
      if (publicAddress === response) {
        const jwtsecret = jwtHelper.generateAccessToken(row);
        await module.exports.createNonce(publicAddress);
        return res.json(jwtsecret);
      }
      return res.status(401).json('NOT_AUTHORIZED');
    } catch (error) {
      return next(error);
    }
  },
  async getAllFromCircle(req, res, next) {
    try {
      const { circleId } = req.params;

      const users = await dynamoHelper.scan(tableName);
      const usersInCircle = [];
      for (let i = 0; i < users.length; i += 1) {
        const element = users[i];
        if (element.circleIds.includes(circleId)) {
          usersInCircle.push(element);
        }
      }
      return res.json(usersInCircle);
    } catch (error) {
      return next(error);
    }
  },
};
