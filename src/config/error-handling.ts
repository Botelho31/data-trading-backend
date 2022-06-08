import { Express, Request, Response } from 'express'
import { errors } from 'celebrate'

export default (app: Express): void => {
  app.use(errors())

  // catch all
  app.use((error: any, req: Request, res: Response) => {
    res.status(error.status || 500)
    if (res.statusCode === 500) {
      res.json({ error: 'Server Error' })
    } else {
      res.json({ error: error.message })
    }
  })
}
