-- Criação das tabelas e inserção de dados iniciais

-- Use db_rinha; -- Descomente esta linha se seu banco de dados não for definido como padrão

-- Criação da tabela 'clientes'
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    limite INT NOT NULL,
    saldo INT NOT NULL DEFAULT 0
);

-- Criação da tabela 'transacoes'
CREATE TABLE IF NOT EXISTS transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clienteId INT,
    valor INT,
    tipo CHAR(1),
    descricao VARCHAR(255),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clienteId) REFERENCES clientes(id)
);

-- Inserção de clientes iniciais
INSERT INTO clientes (id, nome, limite, saldo) VALUES
(1, 'Cliente 1', 100000, 0),
(2, 'Cliente 2', 80000, 0),
(3, 'Cliente 3', 1000000, 0),
(4, 'Cliente 4', 10000000, 0),
(5, 'Cliente 5', 500000, 0)
ON DUPLICATE KEY UPDATE nome = VALUES(nome), limite = VALUES(limite), saldo = VALUES(saldo);

-- Nota: A opção ON DUPLICATE KEY UPDATE é utilizada para evitar erros
-- caso o script seja executado múltiplas vezes. Ela atualiza os dados
-- dos clientes caso eles já existam, baseando-se no ID.