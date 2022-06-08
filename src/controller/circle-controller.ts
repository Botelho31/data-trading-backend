import { Request, Response, NextFunction } from 'express'
import { hasRequestedEntry } from '../infra/web3/web3-helper'
const dynamoHelper = require('../infra/dynamo-helper')

const tableName = 'circle'

export async function getAll (req: Request, res: Response, next: NextFunction) {
  try {
    const circles = await dynamoHelper.scan(tableName)
    return res.json(circles)
  } catch (error) {
    return next(error)
  }
}

export async function putEntryRequest (req: any, res: Response, next: NextFunction) {
  try {
    const hasBeenRequested = await hasRequestedEntry(req.user.publicAddress, req.body.circleAddress)
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
