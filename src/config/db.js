const mysql = require('mysql2/promise');

async function connectToDatabase() {
  try {
    const pool = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '789987',
      database: 'db_rinha'
    });
    console.log('Conexão com o banco de dados estabelecida com sucesso');
    return pool;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

module.exports = connectToDatabase;