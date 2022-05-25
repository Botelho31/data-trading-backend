const dynamoHelper = require('../infra/dynamo-helper');

const tableName = 'user';

module.exports = {
  async createTrade(req, res, next) {
    try {
      if (req.body.id === null) {
        const trade = await dynamoHelper.create(tableName, req.body);
        return res.json(trade);
      }
      if (req.body.saleTo !== null) {
        const trade = await dynamoHelper.updateObject(tableName, {
          id: req.body.id,
        }, 'saleTo', req.body.saleTo);
        return res.json(trade);
      // eslint-disable-next-line no-else-return
      } else {
        const trade = await dynamoHelper.updateObject(tableName, {
          id: req.body.id,
        }, 'saleFrom', req.body.saleFrom);
        return res.json(trade);
      }
    } catch (error) {
      return next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const { circleId } = req.params;

      const trades = await dynamoHelper.scan(tableName);
      const tradesInCircle = [];
      for (let i = 0; i < trades.length; i += 1) {
        const element = trades[i];
        if (element.circleId === circleId) {
          tradesInCircle.push(element);
        }
      }
      return res.json(tradesInCircle);
    } catch (error) {
      return next(error);
    }
  },
};
