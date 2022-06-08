import { Request, Response, NextFunction } from 'express'
import knex from '../database'
const crypto = require('crypto')
const { ethers } = require('ethers')
const jwtHelper = require('../infra/jwt-helper')

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
    const { publicAddress } = req.body
    const results = await knex(tableName)
      .where({ publicAddress })
    if (results.length > 0) {
      return res.status(409).json({ message: 'PUBLIC_ADDRESS_ALREADY_EXISTS' })
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
    if (results.length > 0) {
      return res.status(404).json({ message: 'PUBLIC_ADDRESS_DOES_NOT_EXIST' })
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
    const row = await knex(tableName).where({ publicAddress })
    const response = await ethers.utils.verifyMessage(row.nonce, nonce)
    if (publicAddress === response) {
      const jwtsecret = jwtHelper.generateAccessToken(row)
      await module.exports.createNonce(publicAddress)
      return res.json(jwtsecret)
    }
    return res.status(401).json('NOT_AUTHORIZED')
  } catch (error) {
    return next(error)
  }
}

export async function getAllFromCircle (req: Request, res: Response, next: NextFunction) {
  try {
    const { circleAddress } = req.params

    const users = await knex('circle-users').where({ circleAddress })
    return res.json(users)
  } catch (error) {
    return next(error)
  }
}
