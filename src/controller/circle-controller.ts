import { Response, NextFunction } from 'express'
import { hasRequestedEntry, isTraderPresent } from '../infra/web3/web3-helper'
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

export async function getEntryRequests (req: any, res: Response, next: NextFunction) {
  try {
    const { circleAddress } = req.params
    const requests = await knex('entry_request')
      .where({ circleAddress })
    return res.json(requests)
  } catch (error) {
    return next(error)
  }
}

export async function updateUserStatus (req: any, res: Response, next: NextFunction) {
  try {
    const hasBeenRequested = await hasRequestedEntry(req.user.publicAddress, req.body.circleAddress)
    const isTrader = await isTraderPresent(req.user.publicAddress, req.body.circleAddress)
    const obj = {
      circleAddress: req.body.circleAddress,
      publicAddress: req.user.publicAddress
    }
    if (isTrader) {
      const response = await knex('circle_user').where(obj)
      if (response.length > 0) return res.json(obj)
      await knex('circle_user').insert(obj)
      await knex('entry_request').where(obj).del()
      return res.json(obj)
    } else if (hasBeenRequested) {
      const response = await knex('entry_request').where(obj)
      if (response.length > 0) return res.json(obj)
      await knex('entry_request').insert(obj)
      return res.json(obj)
    }
    return res.status(403).json({ message: 'REQUEST-HAS-NOT-BEEN-MADE' })
  } catch (error) {
    return next(error)
  }
}

export async function updateEntryStatus (req: any, res: Response, next: NextFunction) {
  try {
    const { circleAddress, publicAddress } = req.body
    const hasPermission = await isTraderPresent(req.user.publicAddress, circleAddress)
    if (!hasPermission) return res.status(403).json({ message: 'USER-IS-NOT-TRADER' })
    const hasBeenRequested = await hasRequestedEntry(publicAddress, circleAddress)
    const isTrader = await isTraderPresent(publicAddress, circleAddress)
    const obj = {
      circleAddress,
      publicAddress
    }
    if (isTrader) {
      const response = await knex('circle_user').where(obj)
      if (response.length > 0) return res.json(obj)
      await knex('circle_user').insert(obj)
      await knex('entry_request').where(obj).del()
      return res.json(obj)
    } else if (hasBeenRequested) {
      const response = await knex('entry_request').where(obj)
      if (response.length > 0) return res.json(obj)
      await knex('entry_request').insert(obj)
      return res.json(obj)
    }
    return res.status(403).json({ message: 'REQUEST-HAS-NOT-BEEN-MADE' })
  } catch (error) {
    return next(error)
  }
}
