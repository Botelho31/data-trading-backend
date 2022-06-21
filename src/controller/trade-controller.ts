import { Request, Response, NextFunction } from 'express'
import Web3 from 'web3'
import knex from '../database'
import { getSignedUrl, headObjectS3 } from '../infra/s3-helper'
import { getTrade, hasBeenUploaded, isTraderPresent } from '../infra/web3/web3-helper'

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

export async function validateTrade (req: any, res: Response, next: NextFunction) {
  try {
    const { idTrade } = req.params
    const { publicAddress } = req.user

    const trades = await knex(tableName).where({ idTrade })
    if (trades.length === 0) return res.json({ message: 'TRADE-DOESNT-EXIST' })
    const trade = trades[0]
    if (trade.saleTo !== publicAddress && trade.saleFrom !== publicAddress) return res.status(403).json({ message: 'CANT-VALIDATE-TRADE-FOR-OTHER-TRADER' })
    const contractTrade = await getTrade(trade.idTrade, trade.circleAddress)
    if (contractTrade[0] === '0x0000000000000000000000000000000000000000') return res.json({ message: 'TRADE-NOT-PAYED' })
    let invalidTrade = false
    invalidTrade = (contractTrade[0] !== trade.saleFrom)
    invalidTrade = invalidTrade && (contractTrade[1] !== trade.saleTo)
    invalidTrade = invalidTrade && (contractTrade[2] !== Web3.utils.toWei(String(trade.price), 'ether').toString())
    invalidTrade = invalidTrade && !contractTrade[4]
    if (invalidTrade) {
      await knex(tableName).update({ status: 'cancelled' }).where({ idTrade })
      return res.json({ message: 'TRADE-CANCELLED-INVALID-DATA' })
    }
    if (contractTrade[3]) {
      await knex(tableName).update({ status: 'close' }).where({ idTrade })
      return res.json({ message: 'TRADE-CLOSED' })
    } else {
      await knex(tableName).update({ status: 'await_files' }).where({ idTrade })
      return res.json({ message: 'TRADE-WAITING-FILES' })
    }
  } catch (error) {
    return next(error)
  }
}

export async function validateUploadFile (req: any, res: Response, next: NextFunction) {
  try {
    const { idTrade } = req.params
    const { publicAddress } = req.user

    const trades = await knex(tableName).where({ idTrade })
    if (trades.length === 0) return res.json({ message: 'TRADE-DOESNT-EXIST' })
    const trade = trades[0]
    if (trade.saleTo !== publicAddress && trade.saleFrom !== publicAddress) return res.status(403).json({ message: 'CANT-VALIDATE-TRADE-FOR-OTHER-TRADER' })
    const contractTrade = await getTrade(trade.idTrade, trade.circleAddress)
    if (contractTrade[0] === '0x0000000000000000000000000000000000000000') return res.json({ message: 'TRADE-NOT-PAYED' })
    let invalidTrade = false
    invalidTrade = (contractTrade[0] !== trade.saleFrom)
    invalidTrade = invalidTrade && (contractTrade[1] !== trade.saleTo)
    invalidTrade = invalidTrade && (contractTrade[2] !== Web3.utils.toWei(String(trade.price), 'ether').toString())
    invalidTrade = invalidTrade && !contractTrade[4]
    if (invalidTrade) {
      await knex(tableName).update({ status: 'cancelled' }).where({ idTrade })
      return res.json({ message: 'TRADE-CANCELLED-INVALID-DATA' })
    }
    if (contractTrade[3]) {
      await knex(tableName).update({ status: 'close' }).where({ idTrade })
      return res.json({ message: 'TRADE-CLOSED' })
    }
    let isObjectPresent = false
    try {
      await headObjectS3(String(trade.idTrade))
      isObjectPresent = true
    } catch (error) {
      console.log(error)
    }
    if (isObjectPresent) {
      const finished = await hasBeenUploaded(trade.idTrade, trade.circleAddress)
      if (finished) {
        await knex(tableName).update({ status: 'close' }).where({ idTrade })
        return res.json({ message: 'TRADE-CLOSED' })
      }
    }
    await knex(tableName).update({ status: 'await_files' }).where({ idTrade })
    return res.json({ message: 'TRADE-WAITING-FILES' })
  } catch (error) {
    return next(error)
  }
}

export async function getDownloadLink (req: any, res: Response, next: NextFunction) {
  try {
    const { idTrade } = req.params
    const { publicAddress } = req.user

    const trades = await knex(tableName).where({ idTrade })
    if (trades.length === 0) return res.json({ message: 'TRADE-DOESNT-EXIST' })
    const trade = trades[0]
    if (trade.saleTo !== publicAddress) return res.status(403).json({ message: 'CANT-DOWNLOAD-TRADE-NOT-BOUGHT' })
    const contractTrade = await getTrade(trade.idTrade, trade.circleAddress)
    if (contractTrade[0] === '0x0000000000000000000000000000000000000000') return res.json({ message: 'TRADE-NOT-PAYED' })
    let isObjectPresent = false
    try {
      await headObjectS3(String(trade.idTrade))
      isObjectPresent = true
    } catch (error) {
      console.log(error)
    }
    if (isObjectPresent && contractTrade[3]) {
      const signedUrl = getSignedUrl(String(trade.idTrade))
      res.json({ url: signedUrl })
    }
    return res.json({ message: 'TRADE-NOT-UPLOADED' })
  } catch (error) {
    return next(error)
  }
}
