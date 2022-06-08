import { Response, NextFunction } from 'express'
import { hasRequestedEntry } from '../infra/web3/web3-helper'
import knex from '../database'

const tableName = 'circle'

export async function getAll (req: any, res: Response, next: NextFunction) {
  try {
    const circles = await knex(tableName)
    let userCircles = await knex('circle_user')
      .where({ publicAddress: req.user.publicAddress })
    userCircles = userCircles.map((v: any) => v.circleAddress)
    let entryRequests = await knex('entry_request')
      .where({ publicAddress: req.user.publicAddress })
    entryRequests = entryRequests.map((v: any) => v.circleAddress)
    const newCircles = circles
    for (let i = 0; i < circles.length; i += 1) {
      newCircles[i].isTrader = userCircles.includes(circles[i].publicAddress)
      newCircles[i].hasRequestedEntry = entryRequests.includes(circles[i].publicAddress)
    }
    return res.json(newCircles)
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
      await knex('entry-request').insert(obj)
      return res.json(obj)
    }
    return res.status(403).json({ message: 'REQUEST-HAS-NOT-BEEN-MADE' })
  } catch (error) {
    return next(error)
  }
}
