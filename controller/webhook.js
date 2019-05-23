const knex = require('../knex')

class Webhook {
  static async mailgun (ctx) {
    const event_data = ctx.request.body['event-data']
    const item = event_data['user-variables']['email_id']
    if (item === undefined) {
      ctx.body = 'error'
      ctx.response.status = 500
      return
    }
    const email_id = JSON.parse(item)['email_id']
    const emails = await knex('emails').where({
      id: email_id
    })
    if (emails.length < 1) {
      ctx.body = 'error'
      ctx.response.status = 500
      return
    }
    const email = row[0]

    const event_id = email_id + '_' + event_data['id']
    const events = await knex('email_events').where({
      event_id: event_id
    })
    if (events.length > 0) {
      ctx.body = 'error'
      ctx.response.status = 500
      return
    }

    const event_type = event_data['event']
    switch(event_type){
      case "rejected":
      break;
      case "accepted":
      break;
      case "delivered":
      break;
      case "failed":
      break;
      case "opened":
      break;
      case "clicked":
      break;
    }
    // event
    await knex.select('id', 'email').from('users').then(rows => {
      console.log(rows)
      ctx.body = rows
    })

  }
}

module.exports = Webhook
