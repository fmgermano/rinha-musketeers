//aqui estou cuidando da inicializacao do servidor e do registro do plugins e rotas

const Fastify = require('fastify');
const dbPlugin = require('./src/config/plugins'); // Plugin para conexão com o banco de dados
const routes = require('./src/routes/routes'); // Importando o arquivo de rotas

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    await fastify.register(dbPlugin); // Registra o plugin do banco de dados

    await fastify.register(routes); // Registra as rotas

    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();