import app from './config/app'
import { Request, Response } from 'express'
require('dotenv').config()

app.get('/', (req: Request, res: Response) => {
  res.send('TCC')
})

app.listen(8080, () => console.log(`Server running at http://localhost:${8080}`))
