import express, { Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { errors } from 'celebrate'

export default (app: Express): void => {
  app.use(cors())
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb' }))
  app.use(morgan('short'))
  app.use(errors())
}
