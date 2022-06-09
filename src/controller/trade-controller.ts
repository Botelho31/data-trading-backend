import { Request, Response, NextFunction } from 'express'
import knex from '../database'
import { isTraderPresent } from '../infra/web3/web3-helper'

const tableName = 'trade'

export async function createTrade (req: any, res: Response, next: NextFunction) {
  try {
    const { publicAddress } = req.user
    const { circleAddress, saleTo, saleFrom } = req.body
    if (saleTo !== publicAddress && saleFrom !== publicAddress) return res.status(403).json({ message: 'CANT-CREATE-TRADE-FOR-OTHER-TRADER' })
    const hasPermission = await isTraderPresent(publicAddress, circleAddress)
    if (!hasPermission) return res.status(403).json({ message: 'USER-IS-NOT-TRADER' })
    await knex(tableName).insert(req.body)
    res.json(req.body)
  } catch (error) {
    return next(error)
  }
}

export async function enterTrade (req: Request, res: Response, next: NextFunction) {
  try {
    const { idTrade, publicAddress } = req.body
    const trade = await knex(tableName).where({ idTrade })
    if (trade.saleTo == null) {
      await knex(tableName).update({ saleTo: publicAddress }).where({ idTrade })
    } else {
      await knex(tableName).update({ saleFrom: publicAddress }).where({ idTrade })
    }
    const newTrade = await knex(tableName).where({ idTrade })
    return res.json(newTrade)
  } catch (error) {
    return next(error)
  }
}

export async function getAll (req: Request, res: Response, next: NextFunction) {
  try {
    const { circleAddress } = req.params

    const trades = await knex(tableName).where({ circleAddress })
    return res.json(trades)
  } catch (error) {
    return next(error)
  }
}
