const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Gestao_Condominio'
});

connection.connect(function(err) {
    if(err){
        console.error("Erro: ", err);
        return;
    } else {
        console.log("Conexão ok");
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/blocos', (req, res) => {
    res.sendFile(__dirname + '/blocos.html');
});

app.post('/blocos',(req, res) => {
    const id_bloco = req.body.id_bloco;
    const descricao = req.body.descricao;
    const qtd_apartamentos = req.body.qtd_apartamentos;

    const insert = 
        'INSERT INTO Bloco (id_bloco, descricao, qtd_apartamentos) VALUES (?, ?, ?)';

    connection.query(insert, [id_bloco, descricao, qtd_apartamentos], (err, results) => {
        if (err) {
            console.error("Erro ao cadastrar blocos: ", err);
            res.status(500).send('Erro ao cadastrar bloco');
            return;
        } else{
            console.log("Bloco cadastrado com sucesso");
            res.redirect('/');
        }
    });
});

app.get('/blocos', (req, res) => {
    const select = 'SELECT * FROM Bloco';
 
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar bloco: ", err);
            res.status(500).send('Erro ao listar bloco');
            return;
        } else {
            console.log("Bloco listados com sucesso");
            res.send(`
                <h1>Dados do Bloco</h1>
                <table border="1">
                    <tr>
                        <th>ID</th>
                        <th>Descrição</th>
                        <th>Quantidade Apartamentos</th>
                    </tr>
                    ${rows.map(row => `
                        <tr>
                            <td>${row.id_bloco}</td>
                            <td>${row.descricao}</td>
                            <td>${row.qtd_apartamentos}</td>
                            <td><a href= "/deletar/${row.id}">Deletar</a></td>
                        </tr>`).join('')}
                </table>
                <a href="/">Voltar</a>
            `);
        }
    });
});

app.get('/deletar/:id_bloco', (req, res) => {
    const id_bloco = req.params.id_bloco;
    const deletar = 'DELETE FROM Bloco WHERE id_bloco =?';
    connection.query(deletar, [id_bloco], (err, results) => {
        if (err) {
            console.error("Erro ao deletar bloco: ", err);
            res.status(500).send('Erro ao deletar bloco');
            return;
        } else {
            console.log("Bloco deletado com sucesso");
            res.redirect('/blocos');
        }
    });
});

app.get('/atualizar/:id_bloco', (req, res) => {
    const id_bloco = req.params.id_bloco;
    const select = 'SELECT * FROM Bloco WHERE id_bloco = ?';

    connection.query(select, [id_bloco], (err, rows) => {
        if(!err && rows.length > 0) {
            const bloco = rows[0];
            res.send(`
                <html>
                    <head>
                        <tittle>Atualizar Bloco</h1>
                        <form action="/atualizar/${bloco.id_bloco}" method="POST">
                            <label for="nome">Id Bloco:</label>
                            <input type="text" id="id_bloco" name="nome"
                            value="${bloco.id_bloco}" required><br><br>

                            <label for="quantidade">Quantidade de Apartamentos:></label>
                            <input type="number" id="quantidade" name="quantidade"
                            value="${bloco.qtd_apartamentos}" required><br><br>

                            <label for="preco">Descrição:</label>
                            <input type="number" id="preco" name="preco"
                            value="${bloco.descricao}" required><br><br>

                                <input type="submit" value="Atualizar">
                        </form>
                        <a href="/blocos">Voltar</a>
                    </body>
                </html>
                `);
        } else {
            res.status(404).send('Bloco não encontrado');
        }
    });
});

app.get('/apartamentos', (req, res) => {
    res.sendFile(__dirname + '/apartamentos.html');
});

app.post('/apartamentos',(req, res) => {
    const id_apartamento = req.body.id_apartamento;
    const numero = req.body.numero;
    const andar = req.body.andar;
    const id_bloco = req.body.id_bloco;

    const insert = 
        'INSERT INTO Apartamento (id_apartamento, numero, andar, id_bloco) VALUES (?, ?, ?, ?)';

    connection.query(insert, [id_apartamento, numero, andar, id_bloco], (err, results) => {
        if (err) {
            console.error("Erro ao cadastrar apartamento: ", err);
            res.status(500).send('Erro ao cadastrar apartamento');
            return;
        } else{
            console.log("Apartamento cadastrado com sucesso");
            res.redirect('/');
        }
    });
});

app.get('/apartamentos', (req, res) => {
    const select = 'SELECT * FROM Apartamento';
 
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar apartamentos: ", err);
            res.status(500).send('Erro ao listar apartamentos');
            return;
        } else {
            console.log("Apartamentos listados com sucesso");
            res.send(`
                <h1>Dados do Apartamento</h1>
                <table border="1">
                    <tr>
                        <th>ID</th>
                        <th>Número</th>
                        <th>Andar</th>
                    </tr>
                    ${rows.map(row => `
                        <tr>
                            <td>${row.id_apartamento}</td>
                            <td>${row.numero}</td>
                            <td>${row.andar}</td>
                            <td>${row.id_bloco}</td>
                            <td><a href= "/deletar/${row.id}">Deletar</a></td>
                        </tr>`).join('')}
                </table>
                <a href="/">Voltar</a>
            `);
        }
    });
});

app.get('/deletar/:id_apartamento', (req, res) => {
    const id_apartamento = req.params.id_apartamento;
    const deletar = 'DELETE FROM Apartamento WHERE id_apartamento =?';
    connection.query(deletar, [id_apartamento], (err, results) => {
        if (err) {
            console.error("Erro ao deletar apartamento: ", err);
            res.status(500).send('Erro ao deletar apartamento');
            return;
        } else {
            console.log("Apartamento deletado com sucesso");
            res.redirect('/apartamentos');
        }
    });
});

app.get('/atualizar/:id_apartamento', (req, res) => {
    const id_apartamento = req.params.id_apartamento;
    const select = 'SELECT * FROM Apartamento WHERE id_apartamento = ?';

    connection.query(select, [id_apartamento], (err, rows) => {
        if(!err && rows.length > 0) {
            const apartamento = rows[0];
            res.send(`
                <html>
                    <head>
                        <tittle>Atualizar Apartamento</h1>
                        <form action="/atualizar/${apartamento.id_apartamento}" method="POST">
                            <label for="id_apartamento">Id Apartamento:</label>
                            <input type="text" id="id_apartamento" name="id_apartamento"
                            value="${apartamento.id_apartamento}" required><br><br>

                            <label for="numero">Número do Apartamento:></label>
                            <input type="number" id="numero" name="numero"
                            value="${apartamento.numero}" required><br><br>

                            <label for="andar">Andar do Apartamento:</label>
                            <input type="number" id="andar" name="andar"
                            value="${apartamento.andar}" required><br><br>

                            <label for="id_bloco">Id do Bloco:></label>
                            <input type="number" id="id_bloco" name="id_bloco"
                            value="${apartamento.id_bloco}" required><br><br>

                                <input type="submit" value="Atualizar">
                        </form>
                        <a href="/apartamentos">Voltar</a>
                    </body>
                </html>
                `);
        } else {
            res.status(404).send('Apartamento não encontrado');
        }
    });
});

app.get('/moradores', (req, res) => {
    res.sendFile(__dirname + '/morador.html');
});

app.post('/moradores',(req, res) => {
    const id_morador = req.body.id_morador;
    const nome = req.body.nome;
    const cpf = req.body.cpf;
    const telefone = req.body.telefone;
    const id_apartamento = req.body.id_apartamento;

    const insert = 
        'INSERT INTO Morador (id_morador, nome, cpf, telefone, id_apartamento) VALUES (?, ?, ?, ?, ?)';

    connection.query(insert, [id_morador, nome, cpf, telefone, id_apartamento], (err, results) => {
        if (err) {
            console.error("Erro ao cadastrar morador: ", err);
            res.status(500).send('Erro ao cadastrar morador');
            return;
        } else{
            console.log("Morador cadastrado com sucesso");
            res.redirect('/');
        }
    });
});

app.get('/moradores', (req, res) => {
    const select = 'SELECT * FROM Morador';
 
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar moradores: ", err);
            res.status(500).send('Erro ao listar moradores');
            return;
        } else {
            console.log("Moradores listados com sucesso");
            res.send(`
                <h1>Dados do Morador</h1>
                <table border="1">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Telefone</th>
                        <th>Id Apartamento</th>
                    </tr>
                    ${rows.map(row => `
                        <tr>
                            <td>${row.id_morador}</td>
                            <td>${row.nome}</td>
                            <td>${row.cpf}</td>
                            <td>${row.telefone}</td>
                            <td>${row.id_apartamento}</td>
                            <td><a href= "/deletar/${row.id}">Deletar</a></td>
                        </tr>`).join('')}
                </table>
                <a href="/">Voltar</a>
            `);
        }
    });
});

app.get('/deletar/:id_morador', (req, res) => {
    const id_morador = req.params.id_morador;
    const deletar = 'DELETE FROM Morador WHERE id_morador = ?';
    connection.query(deletar, [id_morador], (err, results) => {
        if (err) {
            console.error("Erro ao deletar morador: ", err);
            res.status(500).send('Erro ao deletar morador');
            return;
        } else {
            console.log("Morador deletado com sucesso");
            res.redirect('/moradores');
        }
    });
});

app.get('/atualizar/:id_morador', (req, res) => {
    const id_morador = req.params.id;
    const select = 'SELECT * FROM Morador WHERE id_morador = ?';

    connection.query(select, [id_morador], (err, rows) => {
        if(!err && rows.length > 0) {
            const morador = rows[0];
            res.send(`
                <html>
                    <head>
                        <tittle>Atualizar Moradores</h1>
                        <form action="/atualizar/${morador.id_morador}" method="POST">
                            <label for="id_morador">Id Morador:</label>
                            <input type="text" id="id_morador" name="id_morador"
                            value="${morador.id_morador}" required><br><br>

                            <label for="nome">Nome do Morador:></label>
                            <input type="text" id="nome" name="nome"
                            value="${morador.nome}" required><br><br>

                            <label for="cpf">CPF do Morador:</label>
                            <input type="text" id="cpf" name="cpf"
                            value="${morador.cpf}" required><br><br>

                            <label for="telefone">Telefone do Morador:</label>
                            <input type="text" id="telefone" name="telefone"
                            value="${morador.telefone}" required><br><br>

                            <label for="id_apartamento">Id do Apartamento:></label>
                            <input type="number" id="id_apartamento" name="id_apartamento"
                            value="${morador.id_apartamento}" required><br><br>

                                <input type="submit" value="Atualizar">
                        </form>
                        <a href="/moradores">Voltar</a>
                    </body>
                </html>
                `);
        } else {
            res.status(404).send('Morador não encontrado');
        }
    });
});

app.get('/referencia', (req, res) => {
    res.sendFile(__dirname + '/referencia.html');
});

app.post('/referencia',(req, res) => {
    const id_referencia = req.body.referencia;
    const mes = req.body.mes;
    const ano = req.body.ano;
    const valor_condominio = req.body.valor_condominio;
    const vencimento = req.body.vencimento;

    const insert = 
        'INSERT INTO Referencia (id_referencia, mes, ano, valor_condominio, id_apartamento) VALUES (?, ?, ?, ?, ?)';

    connection.query(insert, [id_referencia, mes, ano, valor_condominio, vencimento], (err, results) => {
        if (err) {
            console.error("Erro ao cadastrar referência: ", err);
            res.status(500).send('Erro ao cadastrar referência');
            return;
        } else{
            console.log("Referência cadastrada com sucesso");
            res.redirect('/');
        }
    });
});

app.get('/referencia', (req, res) => {
    const select = 'SELECT * FROM Referencia';
 
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar referências: ", err);
            res.status(500).send('Erro ao listar referências');
            return;
        } else {
            console.log("Referências listadas com sucesso");
            res.send(`
                <h1>Dados da Referência</h1>
                <table border="1">
                    <tr>
                        <th>ID</th>
                        <th>Mês</th>
                        <th>Ano</th>
                        <th>Valor do Condomínio</th>
                        <th>Vencimento</th>
                    </tr>
                    ${rows.map(row => `
                        <tr>
                            <td>${row.id_referencia}</td>
                            <td>${row.mes}</td>
                            <td>${row.ano}</td>
                            <td>${row.valor_condominio}</td>
                            <td>${row.vencimento}</td>
                            <td><a href= "/deletar/${row.id}">Deletar</a></td>
                        </tr>`).join('')}
                </table>
                <a href="/">Voltar</a>
            `);
        }
    });
});

app.get('/deletar/:id_referencia', (req, res) => {
    const id_referencia = req.params.id_referencia;
    const deletar = 'DELETE FROM Referencia WHERE id_referencia =?';
    connection.query(deletar, [id_referencia], (err, results) => {
        if (err) {
            console.error("Erro ao deletar referência: ", err);
            res.status(500).send('Erro ao deletar referência');
            return;
        } else {
            console.log("Referência deletada com sucesso");
            res.redirect('/referencia');
        }
    });
});

app.get('/atualizar/:id_referencia', (req, res) => {
    const id_referencia = req.params.id_referencia;
    const select = 'SELECT * FROM Referencia WHERE id_referencia = ?';

    connection.query(select, [id_referencia], (err, rows) => {
        if(!err && rows.length > 0) {
            const referencia = rows[0];
            res.send(`
                <html>
                    <head>
                        <tittle>Atualizar Referências</h1>
                        <form action="/atualizar/${referencia.id_referencia}" method="POST">
                            <label for="id_referencia">Id Referência:</label>
                            <input type="text" id="id_referencia" name="id_referencia"
                            value="${referencia.id_referencia}" required><br><br>

                            <label for="mes">Mês da Referência:></label>
                            <input type="text" id="mes" name="mes"
                            value="${referencia.mes}" required><br><br>

                            <label for="ano">Ano da Referência:</label>
                            <input type="text" id="ano" name="ano"
                            value="${referencia.ano}" required><br><br>

                            <label for="valor_condominio">Valor do Condomínio:</label>
                             <input type="number" step="0.01" id="valor_condominio" name="valor_condominio"
                            value="${referencia.valor_condominio}" required><br><br>

                            <label for="vencimento">Data de Vencimento:></label>
                            <input type="number" id="vencimento" name="vencimento"
                            value="${referencia.referencia}" required><br><br>

                                <input type="submit" value="Atualizar">
                        </form>
                        <a href="/referencia">Voltar</a>
                    </body>
                </html>
                `);
        } else {
            res.status(404).send('Referência não encontrada');
        }
    });
});

app.get('/pagamentos', (req, res) => {
    res.sendFile(__dirname + '/pagamentos.html');
});

app.post('/pagamentos',(req, res) => {
    const id_pagamento = req.body.id_pagamento;
    const id_morador = req.body.id_morador;
    const id_referencia = req.body.id_referencia;
    const data_pagamento = req.body.data_pagamento;
    const valor_pago = req.body.valor_pago;

    const insert = 
        'INSERT INTO Pagamento (id_pagamento, id_morador, id_referencia, data_pagamento, valor_pago) VALUES (?, ?, ?, ?, ?)';

    connection.query(insert, [id_pagamento, id_morador, id_referencia, data_pagamento, valor_pago], (err, results) => {
        if (err) {
            console.error("Erro ao cadastrar pagamento: ", err);
            res.status(500).send('Erro ao cadastrar pagamento');
            return;
        } else{
            console.log("Pagamento cadastrado com sucesso");
            res.redirect('/');
        }
    });
});

app.get('/pagamento', (req, res) => {
    const select = 'SELECT * FROM Pagamento';
 
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar pagamentos: ", err);
            res.status(500).send('Erro ao listar pagamentos');
            return;
        } else {
            console.log("Pagamentos listados com sucesso");
            res.send(`
                <h1>Dados do Pagamento</h1>
                <table border="1">
                    <tr>
                        <th>ID Pagamento</th>
                        <th>ID Morador</th>
                        <th>ID Referência</th>
                        <th>Data do Pagamento</th>
                        <th>Valor Pago</th>
                    </tr>
                    ${rows.map(row => `
                        <tr>
                            <td>${row.id_pagamento}</td>
                            <td>${row.id_morador}</td>
                            <td>${row.id_referencia}</td>
                            <td>${row.data_pagamento}</td>
                            <td>${row.valor_pago}</td>
                            <td><a href= "/deletar/${row.id_pagamento}">Deletar</a></td>
                        </tr>`).join('')}
                </table>
                <a href="/">Voltar</a>
            `);
        }
    });
});

app.get('/deletar/:id_pagamento', (req, res) => {
    const id_pagamento = req.params.id_pagamento;
    const deletar = 'DELETE FROM Pagamento WHERE id_pagamento = ?';
    connection.query(deletar, [id_pagamento], (err, results) => {
        if (err) {
            console.error("Erro ao deletar pagamento: ", err);
            res.status(500).send('Erro ao deletar pagamento');
            return;
        } else {
            console.log("Pagamento deletado com sucesso");
            res.redirect('/pagamentos');
        }
    });
});

app.get('/atualizar/:id_pagamento', (req, res) => {
    const id_pagamento = req.params.id_pagamento;
    const select = 'SELECT * FROM Pagamento WHERE id_pagamento = ?';

    connection.query(select, [id_pagamento], (err, rows) => {
        if(!err && rows.length > 0) {
            const pagamento = rows[0];
            res.send(`
                <html>
                    <head>
                        <tittle>Atualizar Pagamentos</h1>
                        <form action="/atualizar/${pagamento.id_pagamento}" method="POST">
                            <label for="id_pagamento">Id Pagamento:</label>
                            <input type="text" id="id_pagamento" name="id_pagamento"
                            value="${pagamento.id_pagamento}" required><br><br>

                            <label for="id_referencia">ID da Referência:></label>
                            <input type="text" id="id_referencia" name="id_referencia"
                            value="${pagamento.id_referencia}" required><br><br>

                            <label for="data_pagamento">Data do Pagamento:</label>
                            <input type="text" id="data_pagamento" name="data_pagamento"
                            value="${pagamento.data_pagamento}" required><br><br>

                            <label for="valor_pago">Valor Pago:</label>
                             <input type="number" step="0.01" id="valor_pago" name="valor_pago"
                            value="${pagamento.valor_pago}" required><br><br>

                                <input type="submit" value="Atualizar">
                        </form>
                        <a href="/pagamento">Voltar</a>
                    </body>
                </html>
                `);
        } else {
            res.status(404).send('Pagamento não encontrado');
        }
    });
});

app.get('/manutencao', (req, res) => {
    res.sendFile(__dirname + '/manutencao.html');
});

app.post('/manutencao',(req, res) => {
    const id_manutencao = req.body.id_manutencao;
    const id_tipo = req.body.id_tipo;
    const data0 = req.body.data0;
    const locall = req.body.locall;

    const insert = 
        'INSERT INTO Manutencao (id_manutencao, id_tipo, data0, locall) VALUES (?, ?, ?, ?)';

    connection.query(insert, [id_manutencao, id_tipo, data0, locall], (err, results) => {
        if (err) {
            console.error("Erro ao cadastrar manutenção: ", err);
            res.status(500).send('Erro ao cadastrar manutenção');
            return;
        } else{
            console.log("Manutenção cadastrada com sucesso");
            res.redirect('/');
        }
    });
});

app.get('/manutencao', (req, res) => {
    const select = 'SELECT * FROM Manutencao';
 
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar manutenções: ", err);
            res.status(500).send('Erro ao listar manutenções');
            return;
        } else {
            console.log("Manutenções listadas com sucesso");
            res.send(`
                <h1>Dados da Manutenção</h1>
                <table border="1">
                    <tr>
                        <th>ID Manutenção</th>
                        <th>ID Tipo</th>
                        <th>Data da Manutenção</th>
                        <th>Local da Manutenção</th>
                    </tr>
                    ${rows.map(row => `
                        <tr>
                            <td>${row.id_manutencao}</td>
                            <td>${row.id_tipo}</td>
                            <td>${row.data0}</td>
                            <td>${row.locall}</td>
                            <td><a href= "/deletar/${row.id_manutencao}">Deletar</a></td>
                        </tr>`).join('')}
                </table>
                <a href="/">Voltar</a>
            `);
        }
    });
});

app.get('/deletar/:id_manutencao', (req, res) => {
    const id_manutencao = req.params.id_manutencao;
    const deletar = 'DELETE FROM Manutencao WHERE id_manutencao = ?';
    connection.query(deletar, [id_manutencao], (err, results) => {
        if (err) {
            console.error("Erro ao deletar manutenção: ", err);
            res.status(500).send('Erro ao deletar manutenção');
            return;
        } else {
            console.log("Manutenção deletada com sucesso");
            res.redirect('/manutencao');
        }
    });
});


app.get('/atualizar/:id_manutencao', (req, res) => {
    const id_manutencao = req.params.id_manutencao;
    const select = 'SELECT * FROM Manutencao WHERE id_manutencao = ?';

    connection.query(select, [id_manutencao], (err, rows) => {
        if(!err && rows.length > 0) {
            const manutencao = rows[0];
            res.send(`
                <html>
                    <head>
                        <tittle>Atualizar Manutenções</h1>
                        <form action="/atualizar/${manutencao.id_manutencao}" method="POST">
                            <label for="id_manutencao">Id Manurtenção:</label>
                            <input type="text" id="id_manutencao" name="id_manutencao"
                            value="${manutencao.id_manutencao}" required><br><br>

                            <label for="id_tipo">Tipo da Manutenção(ID):></label>
                            <input type="text" id="id_tipo" name="id_tipo"
                            value="${manutencao.id_tipo}" required><br><br>

                            <label for="data0">Data da Manutenção:</label>
                            <input type="text" id="data0" name="data0"
                            value="${manutencao.data_pagamento}" required><br><br>

                            <label for="locall">Local Manutenção:</label>
                             <input type="text" id="locall" name="locall"
                            value="${manutencao.locall}" required><br><br>

                                <input type="submit" value="Atualizar">
                        </form>
                        <a href="/manutencao">Voltar</a>
                    </body>
                </html>
                `);
        } else {
            res.status(404).send('Manutenção não encontrada');
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});