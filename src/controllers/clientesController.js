// Importando o ApiError para manipulação de erros
const ApiError = require('../errors/ApiError');
const ClienteModel = require('../models/clienteModel');

// Função para realizar transação, com validação de esquema integrada ao Fastify
async function realizarTransacao(req, reply) {
    // O Fastify já terá validado 'id', 'valor', 'tipo', 'descricao' conforme o esquema
    const { id } = req.params;
    const clienteId = parseInt(id);
    const { valor, tipo, descricao } = req.body;

    const model = new ClienteModel(this.db);

    try {
        await model.addTransacao(clienteId, { valor, tipo, descricao });
        const saldoAtualizado = await model.getSaldo(clienteId);
        reply.send({ limite: await model.getLimite(clienteId), saldo: saldoAtualizado });
    } catch (error) {
        // Verifica se é um erro de ApiError e responde adequadamente
        if (error instanceof ApiError) {
            reply.status(error.status).send({ error: error.message });
        } else {
            console.error('Erro ao processar a transação:', error);
            reply.status(500).send({ error: 'Erro interno do servidor' });
        }
    }
}

// Função para obter extrato, também com validação de esquema
async function obterExtrato(req, reply) {
    // O Fastify já terá validado 'id' conforme o esquema
    const { id } = req.params;
    const clienteId = parseInt(id);

    const model = new ClienteModel(this.db);

    try {
        const extrato = await model.getExtrato(clienteId);
        reply.send(extrato);
    } catch (error) {
        // Verifica se é um erro de ApiError e responde adequadamente
        if (error instanceof ApiError) {
            reply.status(error.status).send({ error: error.message });
        } else {
            console.error('Erro ao obter extrato:', error);
            reply.status(500).send({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = { realizarTransacao, obterExtrato };