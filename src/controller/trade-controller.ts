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
    let trade = await knex(tableName).where({ idTrade })
    if (trade.length === 0) return res.status(404).json({ message: 'TRADE-DOESNT-EXIST' })
    trade = trade[0]
    if (trade.saleTo !== null && trade.saleFrom !== null) return res.status(403).json({ message: 'TRADE-ALREADY-COMPLETED' })
    if (trade.saleTo == null) {
      if (trade.saleFrom === publicAddress) return res.status(403).json({ message: 'CANT-SELL-TO-SAME-ADDRESS' })
      await knex(tableName).update({ saleTo: publicAddress, status: 'await_payment' }).where({ idTrade })
    } else {
      if (trade.saleTo === publicAddress) return res.status(403).json({ message: 'CANT-SELL-TO-SAME-ADDRESS' })
      await knex(tableName).update({ saleFrom: publicAddress, status: 'await_payment' }).where({ idTrade })
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

export async function validateTrade (req: Request, res: Response, next: NextFunction) {
  try {
    const { idTrade } = req.params

    const trades = await knex(tableName).where({ idTrade })
    if (trades.length === 0) {
      return res.json({ message: 'Trade do not exist' })
    } else {
      return res.json(trades)
    }
  } catch (error) {
    return next(error)
  }
}
