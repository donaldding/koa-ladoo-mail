const Router = require('koa-router')
const router = new Router()
const webhook = require('./controller/webhook')

router.post('/api/mailgun_webhook', webhook.mailgun)

module.exports = router
