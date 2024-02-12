const ApiError = require('../errors/ApiError');

class ClienteModel {
  constructor(db) {
    this.db = db;
  }

  async getCliente(clienteId) {
    const [rows] = await this.db.query('SELECT * FROM clientes WHERE id = ?', [clienteId]);
    if (rows.length === 0) {
        throw ApiError.NotFound('Cliente não encontrado');
    }
    return rows[0];
}

async addTransacao(clienteId, { valor, tipo, descricao }) {
  const cliente = await this.getCliente(clienteId);

  if (tipo === 'd') { // Se for débito, verifica o saldo
      const saldoPotencial = cliente.saldo - valor;
      if (saldoPotencial < -cliente.limite) {
          throw ApiError.UnprocessableEntity('Saldo insuficiente para a transação');
      }
  }

  const [result] = await this.db.query(
      'INSERT INTO transacoes (clienteId, valor, tipo, descricao) VALUES (?, ?, ?, ?)', 
      [clienteId, valor, tipo, descricao]
  );

  if (result.affectedRows === 0) {
      throw new Error('Falha ao adicionar transação');
  }

  // Atualiza o saldo do cliente após a transação
  if (tipo === 'c') {
      cliente.saldo += valor;
  } else {
      cliente.saldo -= valor;
  }

  await this.db.query('UPDATE clientes SET saldo = ? WHERE id = ?', [cliente.saldo, clienteId]);
}

async getSaldo(clienteId) {
  const [rows] = await this.db.query('SELECT saldo FROM clientes WHERE id = ?', [clienteId]);
  if (rows.length === 0) {
      throw ApiError.NotFound('Cliente não encontrado');
  }
  return rows[0].saldo;
}

async getLimite(clienteId) {
  const [rows] = await this.db.query('SELECT limite FROM clientes WHERE id = ?', [clienteId]);
  if (rows.length === 0) {
      throw ApiError.NotFound('Cliente não encontrado');
  }
  return rows[0].limite;
}

async getExtrato(clienteId) {
  const [transacoes] = await this.db.query(
      'SELECT valor, tipo, descricao, DATE_FORMAT(data, "%Y-%m-%d %T") as realizada_em FROM transacoes WHERE clienteId = ? ORDER BY data DESC LIMIT 10',
      [clienteId]
  );
  const [clientes] = await this.db.query('SELECT saldo, limite FROM clientes WHERE id = ?', [clienteId]);
  if (clientes.length === 0) {
      throw ApiError.NotFound('Cliente não encontrado');
  }
  return {
      saldo: clientes[0].saldo,
      limite: clientes[0].limite,
      ultimas_transacoes: transacoes
  };
}
}

module.exports = ClienteModel;