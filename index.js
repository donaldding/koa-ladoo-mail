require('dotenv').config();

const Koa = require('koa');
const bodyparser = require('koa-bodyparser')
const cors = require('koa2-cors')
const router = require('./router')
const app = new Koa();

app.use(
  bodyparser({
    enableTypes: ['json']
  })
)
app.use(cors())
app.use(router.routes(), router.allowedMethods())

app.listen(3000);