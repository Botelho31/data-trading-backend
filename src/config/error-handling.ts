import { Express, Request, Response } from 'express'

export default (app: Express): void => {
  // catch all
  app.use((req: Request, res: Response) => {
    // res.status(error.status || 500)
    // if (res.statusCode === 500) {
    //   res.json({ error: 'Server Error' })
    // } else {
    //   res.json({ error: error.message })
    // }
  })
}
