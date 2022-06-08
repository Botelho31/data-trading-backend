import { Request, Response, NextFunction } from 'express'
import knex from '../database'
import * as jwtHelper from '../infra/jwt-helper'
import { ethers } from 'ethers'
const crypto = require('crypto')

const tableName = 'user'

export async function createNonce (publicAddress: string) : Promise<String> {
  const nonce = crypto.randomBytes(16).toString('hex')
  await knex(tableName)
    .update({ nonce })
    .where({ publicAddress })
  return nonce
}

export async function signup (req: Request, res: Response, next: NextFunction) {
  try {
    const { publicAddress, email } = req.body
    const results = await knex(tableName)
      .where({ publicAddress }).orWhere({ email })
    if (results.length > 0) {
      res.status(409)
      return res.json({ message: 'PUBLIC_ADDRESS_ALREADY_EXISTS' })
    }
    await knex(tableName).insert(req.body)
    return res.json(req.body)
  } catch (error) {
    return next(error)
  }
}

export async function getNonce (req: Request, res: Response, next: NextFunction) {
  try {
    const { publicAddress } = req.params
    const results = await knex(tableName)
      .where({ publicAddress })
    if (results.length === 0) {
      res.status(404)
      return res.json({ message: 'PUBLIC_ADDRESS_DOES_NOT_EXIST' })
    }
    const nonce = await module.exports.createNonce(publicAddress)
    return res.json({ nonce })
  } catch (error) {
    return next(error)
  }
}

export async function verifyAuth (req: Request, res: Response, next: NextFunction) {
  try {
    const { publicAddress, nonce } = req.body
    const results = await knex(tableName).where({ publicAddress })
    if (results.length === 0) {
      res.status(404)
      return res.json({ message: 'PUBLIC_ADDRESS_DOES_NOT_EXIST' })
    }
    const row = results[0]
    const response = ethers.utils.verifyMessage(row.nonce, nonce)
    if (publicAddress === response) {
      const jwtsecret = jwtHelper.generateAccessToken(row)
      await module.exports.createNonce(publicAddress)
      return res.json(jwtsecret)
    }
    res.status(401)
    return res.json('NOT_AUTHORIZED')
  } catch (error) {
    return next(error)
  }
}

export async function getAllFromCircle (req: Request, res: Response, next: NextFunction) {
  try {
    const { circleAddress } = req.params

    const users = await knex('circle_user').where({ circleAddress })
    return res.json(users)
  } catch (error) {
    return next(error)
  }
}
