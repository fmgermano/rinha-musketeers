// defino as rotas 

const { realizarTransacao, obterExtrato } = require('../controllers/clientesController');

module.exports = async function routes(fastify, options) {
  // Rota para realizar transação
  fastify.post('/clientes/:id/transacoes', {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
            },
            required: ['id']
        },
        body: {
            type: 'object',
            properties: {
                valor: { type: 'integer', minimum: 1 },
                tipo: { type: 'string', enum: ['c', 'd'] },
                descricao: { type: 'string', maxLength: 10 },
            },
            required: ['valor', 'tipo', 'descricao']
        }
    }
}, realizarTransacao);

  // Rota para obter extrato
  fastify.get('/clientes/:id/extrato', obterExtrato);
}

