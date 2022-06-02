const dynamoHelper = require('../infra/dynamo-helper');

const tableName = 'circle';

module.exports = {
  async getAll(req, res, next) {
    try {
      const circles = await dynamoHelper.scan(tableName);
      return res.json(circles);
    } catch (error) {
      return next(error);
    }
  },
};
