const dynamoHelper = require('../infra/dynamo-helper')
const web3Helper = require('../infra/web3/web3-helper')

const tableName = 'circle'

module.exports = {
  async getAll (req, res, next) {
    try {
      const circles = await dynamoHelper.scan(tableName)
      return res.json(circles)
    } catch (error) {
      return next(error)
    }
  },
  async putEntryRequest (req, res, next) {
    try {
      const hasBeenRequested = await web3Helper.hasRequestedEntry(req.user.publicAddress, req.body.circleAddress)
      if (hasBeenRequested) {
        const obj = {
          circleAddress: req.body.circleAddress,
          publicAddress: req.user.publicAddress
        }
        await dynamoHelper.create('entry-request', obj)
        return res.json(obj)
      }
      return res.status(403).json({ message: 'REQUEST-HAS-NOT-BEEN-MADE' })
    } catch (error) {
      return next(error)
    }
  }
}
