module.exports = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : 'ladoo_development'
  }
}).on('query', queryData => {
  console.log("KNEX SQL: " + queryData.sql + ", " + queryData.bindings )
});
