import express from 'express'
import setupRoutes from './routes'
import setupMiddlewares from './middlewares'
import setupErrorHandling from './error-handling'

const app = express()
setupMiddlewares(app)
setupRoutes(app)
setupErrorHandling(app)
export default app
