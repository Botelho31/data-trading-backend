import { Express, NextFunction, Request, Response } from 'express'
import { errors, isCelebrateError } from 'celebrate'

export default (app: Express): void => {
  // catch all
  app.use(errors())
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (isCelebrateError(error)) {
      res.status(res.statusCode || 500)
      if (res.statusCode === 500) {
        res.json({ error: 'Server Error' })
      } else {
        res.json({ error: error.message })
      }
    } else {
      next(error)
    }
  })

  app.use((error: any, req: Request, res: Response) => {
    console.error(error.stack)
    // res.status(500).send('Something broke!')
  })
}
