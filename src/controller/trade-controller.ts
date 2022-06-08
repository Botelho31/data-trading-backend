import { Request, Response, NextFunction } from 'express'
import knex from '../database'

const tableName = 'trade'

export async function createTrade (req: Request, res: Response, next: NextFunction) {
  try {
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
