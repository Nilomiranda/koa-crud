import "reflect-metadata";
import Koa from 'koa'
import dotenv from 'dotenv'
import { createConnection } from 'typeorm'

const app = new Koa()

dotenv.config()

app.listen(process.env.APPLICATION_PORT, () => {
  console.log(`Application running on port ${process.env.APPLICATION_PORT}`)
})

createConnection().then(() => {
  console.log('Successfully connected to database')
}).catch(err => {
  console.error('Error creating database connection', err)
})
