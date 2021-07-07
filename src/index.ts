import "reflect-metadata";
import Koa from 'koa'
import dotenv from 'dotenv'
import { createConnection } from 'typeorm'
import Router from '@koa/router'

const app = new Koa()
const router = new Router()

dotenv.config()

app.listen(process.env.APPLICATION_PORT, () => {
  console.log(`Application running on port ${process.env.APPLICATION_PORT}`)
})

createConnection().then(() => {
  console.log('Successfully connected to database')
}).catch(err => {
  console.error('Error creating database connection', err)
})

router.get('/', (ctx) => {
  ctx.body = 'Hello'
})

app.use(router.routes())
