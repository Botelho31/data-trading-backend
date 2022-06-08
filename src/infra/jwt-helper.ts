import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET as string

export function generateAccessToken (user: any) {
  return jwt.sign(user, SECRET_KEY, { expiresIn: '1h' })
}

export async function authenticateToken (req: any, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  try {
    const user = jwt.verify(token, SECRET_KEY)
    req.user = user
    return next()
  } catch (err) {
    return res.sendStatus(403)
  }
}
