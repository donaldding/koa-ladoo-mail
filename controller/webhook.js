const knex = require('../knex')

class Webhook {
  static async mailgun (ctx) {
    const event_data = ctx.request.body['event-data']
    const item = event_data['user-variables']['email_id']
    if (item === undefined) {
      ctx.body = 'error'
      ctx.response.status = 406
      return
    }
    const email_id = JSON.parse(item)['email_id']
    const emails = await knex('emails').where({
      id: email_id
    })
    if (emails.length < 1) {
      ctx.body = 'error'
      ctx.response.status = 406
      return
    }
    const email = emails[0]

    const event_id = email_id + '_' + event_data['id']
    const events = await knex('email_events').where({
      event_id: event_id
    })
    if (events.length > 0) {
      ctx.body = 'error'
      ctx.response.status = 406
      return
    }
    let state = ''
    let fail_reason = ''
    const event_type = event_data['event']
    const email_params = {}
    state = event_type
    switch(event_type){
      case "failed":
        fail_reason = event_data['reason']
        state = 'failure'
        email_params['failure_at'] = new Date().toUTCString()
        break
      case "rejected":
        fail_reason = event_data['reject']['reason']
        email_params['rejected_at'] = new Date().toUTCString()
        break
      case "delivered":
        email_params['delivered_at'] = new Date().toUTCString()
        break
      case "opened":
        email_params['opened_at'] = new Date().toUTCString()
        break
      case "clicked":
        email_params['clicked_at'] = new Date().toUTCString()
        break
      break;
    }

    await knex('emails').where({id: email_id}).update({
      state,
      fail_reason,
      ...email_params
    })

    const email_event = await knex('email_events').insert({
      event_type,
      email_id,
      occured_at: new Date(event_data['timestamp'] * 1000).toUTCString(),
      recipient: event_data['recipient'],
      sender: event_data['message']['headers']['from'],
      message_id: event_data['message']['headers']['message-id'],
      batch_emails_id: email.batch_emails_id,
      event_id: email.id + "_" + event_data['id'],
      created_at: new Date().toUTCString(),
      updated_at: new Date().toUTCString()
    })

    if (['opened', 'clicked'].includes(event_type)){
      const params = {}
      const location = email_event['geolocation']
      if (location){
        params = { ...location }
      }
      const client_info = email_event['client-info']
      if (client_info){
        params = { ...params, ...client_info}
      }

      await knex('event_client_infos').insert({
        email_event_id: email_event[0],
        created_at: new Date().toUTCString(),
        updated_at: new Date().toUTCString(),
        ...params
      })
    end
    }
    ctx.response.status = 200
    ctx.body = 'success'

  }
}

module.exports = Webhook
