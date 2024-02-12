
const fp = require('fastify-plugin');
const connectToDatabase = require('./db');

async function dbPlugin(fastify, opts) {
  const db = await connectToDatabase();
  fastify.decorate('db', db);

  // Outras configurações ou hooks...
}

module.exports = fp(dbPlugin);