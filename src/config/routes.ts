import { Router, Express } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use(router)
  fg.sync('**/src/routes/**route.ts').map(async file => {
    const subRouter = await import(`../../${file}`)
    subRouter.default(router)
  })
}
