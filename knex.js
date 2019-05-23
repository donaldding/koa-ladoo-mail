module.exports = require('knex')({
  client: 'pg',
  connection: {
    host : process.env.DB_HOST || '127.0.0.1',
    user : process.env.DB_USERNAME || 'postgres',
    password : process.env.DB_PASSWORD ||'',
    database : process.env.DB_NAME || 'ladoo_development'
  },
  pool: {
    min: 2,
    max: 10
  },
}).on('query', queryData => {
  console.log("KNEX SQL: " + queryData.sql + ", " + queryData.bindings )
});
