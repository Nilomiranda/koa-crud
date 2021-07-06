import "reflect-metadata";
import Koa from 'koa'
import dotenv from 'dotenv'

const app = new Koa()

dotenv.config()

app.listen(process.env.APPLICATION_PORT, () => {
  console.log(`Application running on port ${process.env.APPLICATION_PORT}`)
})
