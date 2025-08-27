const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Gestao_Condominio'
});

connection.connect(function(err) {
    if (err) {
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

app.get('/listar-blocos', (req, res) => {
    const select = 'SELECT * FROM Bloco';
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar bloco: ", err);
            res.status(500).send('Erro ao listar bloco');
            return;
        } else {
            res.send(`
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <title>Listagem de Blocos</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }

                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            background-color: #fff;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }

                        th, td {
                            padding: 12px 16px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }

                        th {
                            background-color: #34495e;
                            color: #fff;
                            font-weight: 600;
                        }

                        tr:hover {
                            background-color: #f1f1f1;
                        }

                        .acoes a {
                            margin-right: 10px;
                            text-decoration: none;
                            color: #2980b9;
                            font-weight: bold;
                        }

                        .acoes a:hover {
                            text-decoration: underline;
                            color: #1c5980;
                        }

                        .voltar {
                            display: inline-block;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                        }

                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                </head>
                <body>
                    <h1>Dados do Bloco</h1>
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Descrição</th>
                            <th>Quantidade Apartamentos</th>
                            <th>Ações</th>
                        </tr>
                        ${rows.map(row => `
                            <tr>
                                <td>${row.id_bloco}</td>
                                <td>${row.descricao}</td>
                                <td>${row.qtd_apartamentos}</td>
                                <td class="acoes">
                                    <a href="/deletar-blocos/${row.id_bloco}">Deletar</a>
                                    <a href="/atualizar-blocos/${row.id_bloco}">Atualizar</a>
                                </td>
                            </tr>`).join('')}
                    </table>
                    <a href="/" class="voltar">Voltar</a>
                </body>
                </html>
            `);
        }
    });
});


app.post('/blocos', (req, res) => {
    const { id_bloco, descricao, qtd_apartamentos } = req.body;
    const insert = 'INSERT INTO Bloco (id_bloco, descricao, qtd_apartamentos) VALUES (?, ?, ?)';
    connection.query(insert, [id_bloco, descricao, qtd_apartamentos], (err) => {
        if (err) {
            console.error("Erro ao cadastrar blocos: ", err);
            res.status(500).send('Erro ao cadastrar bloco');
            return;
        } else {
            res.redirect('/listar-blocos');
        }
    });
});

app.get('/deletar-blocos/:id_bloco', (req, res) => {
    const id_bloco = req.params.id_bloco;
    const deletar = 'DELETE FROM Bloco WHERE id_bloco = ?';
    connection.query(deletar, [id_bloco], (err) => {
        if (err) {
            console.error("Erro ao deletar bloco: ", err);
            res.status(500).send('Erro ao deletar bloco');
            return;
        } else {
            res.redirect('/listar-blocos');
        }
    });
});

app.get('/atualizar-blocos/:id_bloco', (req, res) => {
    const id_bloco = req.params.id_bloco;
    const select = 'SELECT * FROM Bloco WHERE id_bloco = ?';
    connection.query(select, [id_bloco], (err, rows) => {
        if (!err && rows.length > 0) {
            const bloco = rows[0];
            res.send(`
                <html>
                    <head>
                        <title>Atualizar Bloco</title>
                        <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }
                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }
                        form {
                            max-width: 500px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        label {
                            display: block;
                            margin-bottom: 8px;
                            font-weight: bold;
                        }
                        input[type="text"] {
                            width: 100%;
                            padding: 10px;
                            margin-bottom: 20px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                        }
                        input[type="submit"] {
                            background-color: #2980b9;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: bold;
                        }
                        input[type="submit"]:hover {
                            background-color: #1c5980;
                        }
                        .voltar {
                            display: block;
                            text-align: center;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-decoration: none;
                            font-weight: bold;
                            max-width: 150px;
                            margin-left: auto;
                            margin-right: auto;
                        }
                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                    </head>
                    <body>
                        <form action="/atualizar-blocos/${bloco.id_bloco}" method="POST">
                            <label for="id_bloco">Id Bloco:</label>
                            <input type="text" id="id_bloco" name="id_bloco" value="${bloco.id_bloco}" required readonly><br><br>
                            <label for="descricao">Descrição:</label>
                            <input type="text" id="descricao" name="descricao" value="${bloco.descricao}" required><br><br>
                            <label for="qtd_apartamentos">Quantidade de Apartamentos:</label>
                            <input type="number" id="qtd_apartamentos" name="qtd_apartamentos" value="${bloco.qtd_apartamentos}" required><br><br>
                            <input type="submit" value="Atualizar">
                        </form>
                        <a href="/listar-blocos">Voltar</a>
                    </body>
                </html>
            `);
        } else {
            res.status(404).send('Bloco não encontrado');
        }
    });
});

app.post('/atualizar-blocos/:id_bloco', (req, res) => {
    const id_bloco = req.params.id_bloco;
    const { descricao, qtd_apartamentos } = req.body;
    const update = 'UPDATE Bloco SET descricao = ?, qtd_apartamentos = ? WHERE id_bloco = ?';
    connection.query(update, [descricao, qtd_apartamentos, id_bloco], (err) => {
        if (err) {
            res.status(500).send('Erro ao atualizar bloco');
        } else {
            res.redirect('/listar-blocos');
        }
    });
});

app.get('/apartamentos', (req, res) => {
    res.sendFile(__dirname + '/apartamentos.html');
});

app.post('/apartamentos', (req, res) => {
    const { id_apartamento, numero, andar, id_bloco } = req.body;
    const insert = 'INSERT INTO Apartamento (id_apartamento, numero, andar, id_bloco) VALUES (?, ?, ?, ?)';
    connection.query(insert, [id_apartamento, numero, andar, id_bloco], (err) => {
        if (err) {
            console.error("Erro ao cadastrar apartamento: ", err);
            res.status(500).send('Erro ao cadastrar apartamento');
            return;
        } else {
            res.redirect('/listar-apartamentos');
        }
    });
});

app.get('/listar-apartamentos', (req, res) => {
    const select = 'SELECT * FROM Apartamento';
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar apartamentos: ", err);
            res.status(500).send('Erro ao listar apartamentos');
            return;
        } else {
            res.send(`
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <title>Listagem de Apartamentos</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }

                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            background-color: #fff;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }

                        th, td {
                            padding: 12px 16px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }

                        th {
                            background-color: #34495e;
                            color: #fff;
                            font-weight: 600;
                        }

                        tr:hover {
                            background-color: #f1f1f1;
                        }

                        .acoes a {
                            margin-right: 10px;
                            text-decoration: none;
                            color: #2980b9;
                            font-weight: bold;
                        }

                        .acoes a:hover {
                            text-decoration: underline;
                            color: #1c5980;
                        }

                        .voltar {
                            display: inline-block;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                        }

                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                </head>
                <body>
                    <h1>Dados do Apartamento</h1>
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Número</th>
                            <th>Andar</th>
                            <th>ID Bloco</th>
                            <th>Ações</th>
                        </tr>
                        ${rows.map(row => `
                            <tr>
                                <td>${row.id_apartamento}</td>
                                <td>${row.numero}</td>
                                <td>${row.andar}</td>
                                <td>${row.id_bloco}</td>
                                <td class="acoes">
                                    <a href="/deletar-apartamentos/${row.id_apartamento}">Deletar</a>
                                    <a href="/atualizar-apartamentos/${row.id_apartamento}">Atualizar</a>
                                </td>
                            </tr>`).join('')}
                    </table>
                    <a href="/" class="voltar">Voltar</a>
                </body>
                </html>
            `);
        }
    });
});

app.get('/deletar-apartamentos/:id_apartamento', (req, res) => {
    const id_apartamento = req.params.id_apartamento;
    const deletar = 'DELETE FROM Apartamento WHERE id_apartamento = ?';
    connection.query(deletar, [id_apartamento], (err) => {
        if (err) {
            console.error("Erro ao deletar apartamento: ", err);
            res.status(500).send('Erro ao deletar apartamento');
            return;
        } else {
            res.redirect('/listar-apartamentos');
        }
    });
});

app.get('/atualizar-apartamentos/:id_apartamento', (req, res) => {
    const id_apartamento = req.params.id_apartamento;
    const select = 'SELECT * FROM Apartamento WHERE id_apartamento = ?';
    connection.query(select, [id_apartamento], (err, rows) => {
        if (!err && rows.length > 0) {
            const apartamento = rows[0];
            res.send(`
                <html>
                    <head>
                        <title>Atualizar Apartamento</title>
                        <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }
                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }
                        form {
                            max-width: 500px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        label {
                            display: block;
                            margin-bottom: 8px;
                            font-weight: bold;
                        }
                        input[type="text"] {
                            width: 100%;
                            padding: 10px;
                            margin-bottom: 20px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                        }
                        input[type="submit"] {
                            background-color: #2980b9;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: bold;
                        }
                        input[type="submit"]:hover {
                            background-color: #1c5980;
                        }
                        .voltar {
                            display: block;
                            text-align: center;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-decoration: none;
                            font-weight: bold;
                            max-width: 150px;
                            margin-left: auto;
                            margin-right: auto;
                        }
                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                    </head>
                    <body>
                        <form action="/atualizar-apartamentos/${apartamento.id_apartamento}" method="POST">
                            <label for="numero">Número:</label>
                            <input type="text" id="numero" name="numero" value="${apartamento.numero}" required><br><br>
                            <label for="andar">Andar:</label>
                            <input type="text" id="andar" name="andar" value="${apartamento.andar}" required><br><br>
                            <label for="id_bloco">ID Bloco:</label>
                            <input type="text" id="id_bloco" name="id_bloco" value="${apartamento.id_bloco}" required><br><br>
                            <input type="submit" value="Atualizar">
                        </form>
                        <a href="/listar-apartamentos">Voltar</a>
                    </body>
                </html>
            `);
        } else {
            res.status(404).send('Apartamento não encontrado');
        }
    });
});

app.post('/atualizar-apartamentos/:id_apartamento', (req, res) => {
    const id_apartamento = req.params.id_apartamento;
    const { numero, andar, id_bloco } = req.body;
    const update = 'UPDATE Apartamento SET numero = ?, andar = ?, id_bloco = ? WHERE id_apartamento = ?';
    connection.query(update, [numero, andar, id_bloco, id_apartamento], (err) => {
        if (err) {
            res.status(500).send('Erro ao atualizar apartamento');
        } else {
            res.redirect('/listar-apartamentos');
        }
    });
});


app.get('/moradores', (req, res) => {
    res.sendFile(__dirname + '/morador.html');
});

app.post('/moradores', (req, res) => {
    const { id_morador, nome, cpf, telefone, id_apartamento } = req.body;
    const insert = 'INSERT INTO Morador (id_morador, nome, cpf, telefone, id_apartamento) VALUES (?, ?, ?, ?, ?)';
    connection.query(insert, [id_morador, nome, cpf, telefone, id_apartamento], (err) => {
        if (err) {
            console.error("Erro ao cadastrar morador: ", err);
            res.status(500).send('Erro ao cadastrar morador');
            return;
        } else {
            res.redirect('/listar-moradores');
        }
    });
});

app.get('/listar-moradores', (req, res) => {
    const select = 'SELECT * FROM Morador';
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar moradores: ", err);
            res.status(500).send('Erro ao listar moradores');
            return;
        } else {
            res.send(`
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <title>Listagem de Moradores</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }

                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            background-color: #fff;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }

                        th, td {
                            padding: 12px 16px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }

                        th {
                            background-color: #34495e;
                            color: #fff;
                            font-weight: 600;
                        }

                        tr:hover {
                            background-color: #f1f1f1;
                        }

                        .acoes a {
                            margin-right: 10px;
                            text-decoration: none;
                            color: #2980b9;
                            font-weight: bold;
                        }

                        .acoes a:hover {
                            text-decoration: underline;
                            color: #1c5980;
                        }

                        .voltar {
                            display: inline-block;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                        }

                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                </head>
                <body>
                    <h1>Dados do Morador</h1>
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Telefone</th>
                            <th>ID Apartamento</th>
                            <th>Ações</th>
                        </tr>
                        ${rows.map(row => `
                            <tr>
                                <td>${row.id_morador}</td>
                                <td>${row.nome}</td>
                                <td>${row.cpf}</td>
                                <td>${row.telefone}</td>
                                <td>${row.id_apartamento}</td>
                                <td class="acoes">
                                    <a href="/deletar-moradores/${row.id_morador}">Deletar</a>
                                    <a href="/atualizar-moradores/${row.id_morador}">Atualizar</a>
                                </td>
                            </tr>`).join('')}
                    </table>
                    <a href="/" class="voltar">Voltar</a>
                </body>
                </html>
            `);
        }
    });
});



app.get('/deletar-moradores/:id_morador', (req, res) => {
    const id_morador = req.params.id_morador;
    const deletar = 'DELETE FROM Morador WHERE id_morador = ?';
    connection.query(deletar, [id_morador], (err) => {
        if (err) {
            console.error("Erro ao deletar morador: ", err);
            res.status(500).send('Erro ao deletar morador');
            return;
        } else {
            res.redirect('/listar-moradores');
        }
    });
});

app.get('/atualizar-moradores/:id_morador', (req, res) => {
    const id_morador = req.params.id_morador;
    const select = 'SELECT * FROM Morador WHERE id_morador = ?';
    connection.query(select, [id_morador], (err, rows) => {
        if (!err && rows.length > 0) {
            const morador = rows[0];
            res.send(`
                <html>
                    <head>
                        <title>Atualizar Morador</title>
                        <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }
                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }
                        form {
                            max-width: 500px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        label {
                            display: block;
                            margin-bottom: 8px;
                            font-weight: bold;
                        }
                        input[type="text"] {
                            width: 100%;
                            padding: 10px;
                            margin-bottom: 20px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                        }
                        input[type="submit"] {
                            background-color: #2980b9;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: bold;
                        }
                        input[type="submit"]:hover {
                            background-color: #1c5980;
                        }
                        .voltar {
                            display: block;
                            text-align: center;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-decoration: none;
                            font-weight: bold;
                            max-width: 150px;
                            margin-left: auto;
                            margin-right: auto;
                        }
                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                    </head>
                    <body>
                        <form action="/atualizar-moradores/${morador.id_morador}" method="POST">
                            <label for="nome">Nome:</label>
                            <input type="text" id="nome" name="nome" value="${morador.nome}" required><br><br>
                            <label for="cpf">CPF:</label>
                            <input type="text" id="cpf" name="cpf" value="${morador.cpf}" required><br><br>
                            <label for="telefone">Telefone:</label>
                            <input type="text" id="telefone" name="telefone" value="${morador.telefone}" required><br><br>
                            <label for="id_apartamento">ID Apartamento:</label>
                            <input type="text" id="id_apartamento" name="id_apartamento" value="${morador.id_apartamento}" required><br><br>
                            <input type="submit" value="Atualizar">
                        </form>
                        <a href="/listar-moradores">Voltar</a>
                    </body>
                </html>
            `);
        } else {
            res.status(404).send('Morador não encontrado');
        }
    });
});

app.post('/atualizar-moradores/:id_morador', (req, res) => {
    const id_morador = req.params.id_morador;
    const { nome, cpf, telefone, id_apartamento } = req.body;
    const update = 'UPDATE Morador SET nome = ?, cpf = ?, telefone = ?, id_apartamento = ? WHERE id_morador = ?';
    connection.query(update, [nome, cpf, telefone, id_apartamento, id_morador], (err) => {
        if (err) {
            res.status(500).send('Erro ao atualizar morador');
        } else {
            res.redirect('/listar-moradores');
        }
    });
});

app.get('/referencia', (req, res) => {
    res.sendFile(path.join(__dirname, 'referencia.html'));
});

app.post('/referencia', (req, res) => {
    const { id_referencia, mes, ano, valor_condominio, vencimento } = req.body;
    const insert = 'INSERT INTO Referencia (id_referencia, mes, ano, valor_condominio, vencimento) VALUES (?, ?, ?, ?, ?)';
    connection.query(insert, [id_referencia, mes, ano, valor_condominio, vencimento], (err) => {
        if (err) {
            console.error("Erro ao cadastrar referência: ", err);
            res.status(500).send('Erro ao cadastrar referência');
        } else {
            res.redirect('/listar-referencias');
        }
    });
});

app.get('/listar-referencias', (req, res) => {
    const select = 'SELECT * FROM Referencia';
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar referências: ", err);
            res.status(500).send('Erro ao listar referências');
        } else {
            res.send(`
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <title>Listagem de Referências</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }
                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            background-color: #fff;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        th, td {
                            padding: 12px 16px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }
                        th {
                            background-color: #34495e;
                            color: #fff;
                            font-weight: 600;
                        }
                        tr:hover {
                            background-color: #f1f1f1;
                        }
                        .acoes a {
                            margin-right: 10px;
                            text-decoration: none;
                            color: #2980b9;
                            font-weight: bold;
                        }
                        .acoes a:hover {
                            text-decoration: underline;
                            color: #1c5980;
                        }
                        .voltar {
                            display: inline-block;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                        }
                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                </head>
                <body>
                    <h1>Dados da Referência</h1>
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Mês</th>
                            <th>Ano</th>
                            <th>Valor do Condomínio</th>
                            <th>Vencimento</th>
                            <th>Ações</th>
                        </tr>
                        ${rows.map(row => `
                            <tr>
                                <td>${row.id_referencia}</td>
                                <td>${row.mes}</td>
                                <td>${row.ano}</td>
                                <td>R$ ${parseFloat(row.valor_condominio).toFixed(2)}</td>
                                <td>${row.vencimento}</td>
                                <td class="acoes">
                                    <a href="/deletar-referencias/${row.id_referencia}">Deletar</a>
                                    <a href="/atualizar-referencias/${row.id_referencia}">Atualizar</a>
                                </td>
                            </tr>`).join('')}
                    </table>
                    <a href="/" class="voltar">Voltar</a>
                </body>
                </html>
            `);
        }
    });
});

app.get('/deletar-referencias/:id_referencia', (req, res) => {
    const id_referencia = req.params.id_referencia;
    const deletar = 'DELETE FROM Referencia WHERE id_referencia = ?';
    connection.query(deletar, [id_referencia], (err) => {
        if (err) {
            console.error("Erro ao deletar referência: ", err);
            res.status(500).send('Erro ao deletar referência');
        } else {
            res.redirect('/listar-referencias');
        }
    });
});

app.get('/atualizar-referencias/:id_referencia', (req, res) => {
    const id_referencia = req.params.id_referencia;
    const select = 'SELECT * FROM Referencia WHERE id_referencia = ?';
    connection.query(select, [id_referencia], (err, rows) => {
        if (!err && rows.length > 0) {
            const referencia = rows[0];
            res.send(`
                <html>
                    <head>
                        <title>Atualizar Referência</title>
                        <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }
                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }
                        form {
                            max-width: 500px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        label {
                            display: block;
                            margin-bottom: 8px;
                            font-weight: bold;
                        }
                        input[type="text"] {
                            width: 100%;
                            padding: 10px;
                            margin-bottom: 20px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                        }
                        input[type="submit"] {
                            background-color: #2980b9;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: bold;
                        }
                        input[type="submit"]:hover {
                            background-color: #1c5980;
                        }
                        .voltar {
                            display: block;
                            text-align: center;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-decoration: none;
                            font-weight: bold;
                            max-width: 150px;
                            margin-left: auto;
                            margin-right: auto;
                        }
                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                    </head>
                    <body>
                        <form action="/atualizar-referencias/${referencia.id_referencia}" method="POST">
                            <label for="mes">Mês:</label>
                            <input type="text" id="mes" name="mes" value="${referencia.mes}" required><br><br>
                            <label for="ano">Ano:</label>
                            <input type="text" id="ano" name="ano" value="${referencia.ano}" required><br><br>
                            <label for="valor_condominio">Valor do Condomínio:</label>
                            <input type="text" id="valor_condominio" name="valor_condominio" value="${referencia.valor_condominio}" required><br><br>
                            <label for="vencimento">Vencimento:</label>
                            <input type="date" id="vencimento" name="vencimento" value="${referencia.vencimento ? referencia.vencimento.toISOString().split('T')[0] : ''}" required><br><br>
                            <input type="submit" value="Atualizar">
                        </form>
                        <a href="/listar-referencias">Voltar</a>
                    </body>
                </html>
            `);
        } else {
            res.status(404).send('Referência não encontrada');
        }
    });
});

app.post('/atualizar-referencias/:id_referencia', (req, res) => {
    const id_referencia = req.params.id_referencia;
    const { mes, ano, valor_condominio, vencimento } = req.body;
    const update = 'UPDATE Referencia SET mes = ?, ano = ?, valor_condominio = ?, vencimento = ? WHERE id_referencia = ?';
    connection.query(update, [mes, ano, valor_condominio, vencimento, id_referencia], (err) => {
        if (err) {
            res.status(500).send('Erro ao atualizar referência');
        } else {
            res.redirect('/listar-referencias');
        }
    });
});

app.get('/pagamentos', (req, res) => {
    res.sendFile(__dirname + '/pagamentos.html');
});

app.post('/pagamentos', (req, res) => {
    const { id_pagamento, id_morador, id_referencia, data_pagamento, valor_pago } = req.body;
    const insert = 'INSERT INTO Pagamento (id_pagamento, id_morador, id_referencia, data_pagamento, valor_pago) VALUES (?, ?, ?, ?, ?)';
    connection.query(insert, [id_pagamento, id_morador, id_referencia, data_pagamento, valor_pago], (err) => {
        if (err) {
            console.error("Erro ao cadastrar pagamento: ", err);
            res.status(500).send('Erro ao cadastrar pagamento');
            return;
        } else {
            res.redirect('/listar-pagamentos');
        }
    });
});

app.get('/listar-pagamentos', (req, res) => {
    const select = 'SELECT * FROM Pagamento';
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar pagamentos: ", err);
            res.status(500).send('Erro ao listar pagamentos');
            return;
        } else {
            res.send(`
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <title>Listagem de Pagamentos</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }
                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            background-color: #fff;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        th, td {
                            padding: 12px 16px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }
                        th {
                            background-color: #34495e;
                            color: #fff;
                            font-weight: 600;
                        }
                        tr:hover {
                            background-color: #f1f1f1;
                        }
                        .acoes a {
                            margin-right: 10px;
                            text-decoration: none;
                            color: #2980b9;
                            font-weight: bold;
                        }
                        .acoes a:hover {
                            text-decoration: underline;
                            color: #1c5980;
                        }
                        .voltar {
                            display: inline-block;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                        }
                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                </head>
                <body>
                    <h1>Dados do Pagamento</h1>
                    <table>
                        <tr>
                            <th>ID Pagamento</th>
                            <th>ID Morador</th>
                            <th>ID Referência</th>
                            <th>Data do Pagamento</th>
                            <th>Valor Pago</th>
                            <th>Ações</th>
                        </tr>
                        ${rows.map(row => `
                            <tr>
                                <td>${row.id_pagamento}</td>
                                <td>${row.id_morador}</td>
                                <td>${row.id_referencia}</td>
                                <td>${row.data_pagamento}</td>
                                <td>R$ ${parseFloat(row.valor_pago).toFixed(2)}</td>
                                <td class="acoes">
                                    <a href="/deletar-pagamentos/${row.id_pagamento}">Deletar</a>
                                    <a href="/atualizar-pagamentos/${row.id_pagamento}">Atualizar</a>
                                </td>
                            </tr>`).join('')}
                    </table>
                    <a href="/" class="voltar">Voltar</a>
                </body>
                </html>
            `);
        }
    });
});


app.get('/deletar-pagamentos/:id_pagamento', (req, res) => {
    const id_pagamento = req.params.id_pagamento;
    const deletar = 'DELETE FROM Pagamento WHERE id_pagamento = ?';
    connection.query(deletar, [id_pagamento], (err) => {
        if (err) {
            console.error("Erro ao deletar pagamento: ", err);
            res.status(500).send('Erro ao deletar pagamento');
            return;
        } else {
            res.redirect('/listar-pagamentos');
        }
    });
});

app.get('/atualizar-pagamentos/:id_pagamento', (req, res) => {
    const id_pagamento = req.params.id_pagamento;
    const select = 'SELECT * FROM Pagamento WHERE id_pagamento = ?';
    connection.query(select, [id_pagamento], (err, rows) => {
        if (!err && rows.length > 0) {
            const pagamento = rows[0];
            res.send(`
                <html>
                    <head>
                        <title>Atualizar Pagamento</title>
                        <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }
                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }
                        form {
                            max-width: 500px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        label {
                            display: block;
                            margin-bottom: 8px;
                            font-weight: bold;
                        }
                        input[type="text"] {
                            width: 100%;
                            padding: 10px;
                            margin-bottom: 20px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                        }
                        input[type="submit"] {
                            background-color: #2980b9;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: bold;
                        }
                        input[type="submit"]:hover {
                            background-color: #1c5980;
                        }
                        .voltar {
                            display: block;
                            text-align: center;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-decoration: none;
                            font-weight: bold;
                            max-width: 150px;
                            margin-left: auto;
                            margin-right: auto;
                        }
                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                    </head>
                    <body>
                        <form action="/atualizar-pagamentos/${pagamento.id_pagamento}" method="POST">
                            <label for="id_morador">ID Morador:</label>
                            <input type="text" id="id_morador" name="id_morador" value="${pagamento.id_morador}" required><br><br>
                            <label for="id_referencia">ID Referência:</label>
                            <input type="text" id="id_referencia" name="id_referencia" value="${pagamento.id_referencia}" required><br><br>
                            <label for="data_pagamento">Data do Pagamento:</label>
                            <input type="date" id="data_pagamento" name="data_pagamento" value="${pagamento.data_pagamento ? pagamento.data_pagamento.toISOString().split('T')[0] : ''}" required><br><br>
                            <label for="valor_pago">Valor Pago:</label>
                            <input type="text" id="valor_pago" name="valor_pago" value="${pagamento.valor_pago}" required><br><br>
                            <input type="submit" value="Atualizar">
                        </form>
                        <a href="/listar-pagamentos">Voltar</a>
                    </body>
                </html>
            `);
        } else {
            res.status(404).send('Pagamento não encontrado');
        }
    });
});

app.post('/atualizar-pagamentos/:id_pagamento', (req, res) => {
    const id_pagamento = req.params.id_pagamento;
    const { id_morador, id_referencia, data_pagamento, valor_pago } = req.body;
    const update = 'UPDATE Pagamento SET id_morador = ?, id_referencia = ?, data_pagamento = ?, valor_pago = ? WHERE id_pagamento = ?';
    connection.query(update, [id_morador, id_referencia, data_pagamento, valor_pago, id_pagamento], (err) => {
        if (err) {
            res.status(500).send('Erro ao atualizar pagamento');
        } else {
            res.redirect('/listar-pagamentos');
        }
    });
});


app.get('/manutencao', (req, res) => {
    res.sendFile(__dirname + '/manutencao.html');
});

app.post('/manutencao', (req, res) => {
    const { id_manutencao, id_tipo, data0, locall } = req.body;
    const insert = 'INSERT INTO Manutencao (id_manutencao, id_tipo, data0, locall) VALUES (?, ?, ?, ?)';
    connection.query(insert, [id_manutencao, id_tipo, data0, locall], (err) => {
        if (err) {
            console.error("Erro ao cadastrar manutenção: ", err);
            res.status(500).send('Erro ao cadastrar manutenção');
            return;
        } else {
            res.redirect('/listar-manutencoes');
        }
    });
});


app.get('/listar-manutencoes', (req, res) => {
    const select = 'SELECT * FROM Manutencao';
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar manutenções: ", err);
            res.status(500).send('Erro ao listar manutenções');
            return;
        } else {
            res.send(`
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <title>Listagem de Manutenções</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }
                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            background-color: #fff;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        th, td {
                            padding: 12px 16px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }
                        th {
                            background-color: #34495e;
                            color: #fff;
                            font-weight: 600;
                        }
                        tr:hover {
                            background-color: #f1f1f1;
                        }
                        .acoes a {
                            margin-right: 10px;
                            text-decoration: none;
                            color: #2980b9;
                            font-weight: bold;
                        }
                        .acoes a:hover {
                            text-decoration: underline;
                            color: #1c5980;
                        }
                        .voltar {
                            display: inline-block;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                        }
                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                </head>
                <body>
                    <h1>Dados da Manutenção</h1>
                    <table>
                        <tr>
                            <th>ID Manutenção</th>
                            <th>ID Tipo</th>
                            <th>Data da Manutenção</th>
                            <th>Local da Manutenção</th>
                            <th>Ações</th>
                        </tr>
                        ${rows.map(row => `
                            <tr>
                                <td>${row.id_manutencao}</td>
                                <td>${row.id_tipo}</td>
                                <td>${row.data0}</td>
                                <td>${row.locall}</td>
                                <td class="acoes">
                                    <a href="/deletar-manutencoes/${row.id_manutencao}">Deletar</a>
                                    <a href="/atualizar-manutencoes/${row.id_manutencao}">Atualizar</a>
                                </td>
                            </tr>`).join('')}
                    </table>
                    <a href="/" class="voltar">Voltar</a>
                </body>
                </html>
            `);
        }
    });
});

app.get('/deletar-manutencoes/:id_manutencao', (req, res) => {
    const id_manutencao = req.params.id_manutencao;
    const deletar = 'DELETE FROM Manutencao WHERE id_manutencao = ?';
    connection.query(deletar, [id_manutencao], (err) => {
        if (err) {
            console.error("Erro ao deletar manutenção: ", err);
            res.status(500).send('Erro ao deletar manutenção');
            return;
        } else {
            res.redirect('/listar-manutencoes');
        }
    });
});

app.get('/atualizar-manutencoes/:id_manutencao', (req, res) => {
    const id_manutencao = req.params.id_manutencao;
    const select = 'SELECT * FROM Manutencao WHERE id_manutencao = ?';
    connection.query(select, [id_manutencao], (err, rows) => {
        if (!err && rows.length > 0) {
            const manutencao = rows[0];
            res.send(`
                <html>
                    <head>
                        <title>Atualizar Manutenção</title>
                        <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }
                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }
                        form {
                            max-width: 500px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        label {
                            display: block;
                            margin-bottom: 8px;
                            font-weight: bold;
                        }
                        input[type="text"] {
                            width: 100%;
                            padding: 10px;
                            margin-bottom: 20px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                        }
                        input[type="submit"] {
                            background-color: #2980b9;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: bold;
                        }
                        input[type="submit"]:hover {
                            background-color: #1c5980;
                        }
                        .voltar {
                            display: block;
                            text-align: center;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-decoration: none;
                            font-weight: bold;
                            max-width: 150px;
                            margin-left: auto;
                            margin-right: auto;
                        }
                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                    </head>
                    <body>
                        <form action="/atualizar-manutencoes/${manutencao.id_manutencao}" method="POST">
                            <label for="id_tipo">ID Tipo:</label>
                            <input type="text" id="id_tipo" name="id_tipo" value="${manutencao.id_tipo}" required><br><br>
                            <label for="data0">Data da Manutenção:</label>
                            <input type="date" id="data0" name="data0" value="${manutencao.data0 ? manutencao.data0.toISOString().split('T')[0] : ''}" required><br><br>
                            <label for="locall">Local da Manutenção:</label>
                            <input type="text" id="locall" name="locall" value="${manutencao.locall}" required><br><br>
                            <input type="submit" value="Atualizar">
                        </form>
                        <a href="/listar-manutencoes">Voltar</a>
                    </body>
                </html>
            `);
        } else {
            res.status(404).send('Manutenção não encontrada');
        }
    });
});

app.post('/atualizar-manutencoes/:id_manutencao', (req, res) => {
    const id_manutencao = req.params.id_manutencao;
    const { id_tipo, data0, locall } = req.body;
    const update = 'UPDATE Manutencao SET id_tipo = ?, data0 = ?, locall = ? WHERE id_manutencao = ?';
    connection.query(update, [id_tipo, data0, locall, id_manutencao], (err) => {
        if (err) {
            res.status(500).send('Erro ao atualizar manutenção');
        } else {
            res.redirect('/listar-manutencoes');
        }
    });
});

app.get('/tipo-manutencao', (req, res) => {
    res.sendFile(__dirname + '/tipoManutencao.html');
});

app.post('/tipo-manutencao', (req, res) => {
    const {id_tipo, descricao } = req.body;
    const insert = 'INSERT INTO Tipo_Manutencao (id_tipo, descricao) VALUES (?, ?)';
    connection.query(insert, [id_tipo, descricao], (err) => {
        if (err) {
            console.error("Erro ao cadastrar tipo de manutenção: ", err);
            res.status(500).send('Erro ao cadastrar tipo de manutenção');
            return;
        } else {
            res.redirect('/listar-tipo-manutencao');
        }
    });
});


app.get('/listar-tipo-manutencao', (req, res) => {
    const select = 'SELECT * FROM Tipo_Manutencao';
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro listar tipos de manutenções: ", err);
            res.status(500).send('Erro ao listar tipos de manutenções');
            return;
        } else {
            res.send(`
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <title>Listagem de Tipos de Manutenção</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }
                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            background-color: #fff;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        th, td {
                            padding: 12px 16px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }
                        th {
                            background-color: #34495e;
                            color: #fff;
                            font-weight: 600;
                        }
                        tr:hover {
                            background-color: #f1f1f1;
                        }
                        .acoes a {
                            margin-right: 10px;
                            text-decoration: none;
                            color: #2980b9;
                            font-weight: bold;
                        }
                        .acoes a:hover {
                            text-decoration: underline;
                            color: #1c5980;
                        }
                        .voltar {
                            display: inline-block;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                        }
                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                </head>
                <body>
                    <h1>Dados da Manutenção</h1>
                    <table>
                        <tr>
                            <th>ID Tipo</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                        ${rows.map(row => `
                            <tr>
                                <td>${row.id_tipo}</td>
                                <td>${row.descricao}</td>
                                <td class="acoes">
                                    <a href="/deletar-tipos-manutencoes/${row.id_tipo}">Deletar</a>
                                    <a href="/atualizar-tipos-manutencoes/${row.id_tipo}">Atualizar</a>
                                </td>
                            </tr>`).join('')}
                    </table>
                    <a href="/" class="voltar">Voltar</a>
                </body>
                </html>
            `);
        }
    });
});

app.get('/deletar-tipos-manutencoes/:id_tipo', (req, res) => {
    const id_tipo = req.params.id_tipo;
    const deletar = 'DELETE FROM Tipo_Manutencao WHERE id_tipo = ?';
    connection.query(deletar, [id_tipo], (err) => {
        if (err) {
            console.error("Erro ao deletar tipo de manutenção: ", err);
            res.status(500).send('Erro ao deletar tipo de manutenção');
            return;
        } else {
            res.redirect('/listar-tipo-manutencao');
        }
    });
});

app.get('/atualizar-tipos-manutencoes/:id_tipo', (req, res) => {
    const id_tipo = req.params.id_tipo;
    const select = 'SELECT * FROM Tipo_Manutencao WHERE id_tipo = ?';
    connection.query(select, [id_tipo], (err, rows) => {
        if (!err && rows.length > 0) {
            const tipo_manutencao = rows[0];
            res.send(`
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <title>Atualizar Manutenção</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            margin: 40px;
                            color: #333;
                        }
                        h1 {
                            text-align: center;
                            color: #2c3e50;
                            margin-bottom: 30px;
                        }
                        form {
                            max-width: 500px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        label {
                            display: block;
                            margin-bottom: 8px;
                            font-weight: bold;
                        }
                        input[type="text"] {
                            width: 100%;
                            padding: 10px;
                            margin-bottom: 20px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                        }
                        input[type="submit"] {
                            background-color: #2980b9;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: bold;
                        }
                        input[type="submit"]:hover {
                            background-color: #1c5980;
                        }
                        .voltar {
                            display: block;
                            text-align: center;
                            margin-top: 20px;
                            background-color: #2ecc71;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-decoration: none;
                            font-weight: bold;
                            max-width: 150px;
                            margin-left: auto;
                            margin-right: auto;
                        }
                        .voltar:hover {
                            background-color: #27ae60;
                        }
                    </style>
                </head>
                <body>
                    <h1>Atualizar Tipo de Manutenção</h1>
                    <form action="/atualizar-manutencoes/${tipo_manutencao.id_tipo}" method="POST">
                        <label for="id_tipo">ID Tipo:</label>
                        <input type="text" id="id_tipo" name="id_tipo" value="${tipo_manutencao.id_tipo}" required>

                        <label for="descricao">Descrição da Manutenção:</label>
                        <input type="text" id="descricao" name="descricao" value="${tipo_manutencao.descricao}" required>

                        <input type="submit" value="Atualizar">
                    </form>
                    <a href="/listar-tipo-manutencao" class="voltar">Voltar</a>
                </body>
                </html>
            `);
        } else {
            res.status(404).send('Tipo de manutenção não encontrada');
        }
    });
});

app.post('/atualizar-tipos-manutencoes/:id_tipo', (req, res) => {
    const id_tipo = req.params.id_tipo;
    const { descricao } = req.body;
    const update = 'UPDATE Tipo_Manutencao SET descricao = ? WHERE id_tipo = ?';
    connection.query(update, [descricao, id_tipo], (err) => {
        if (err) {
            res.status(500).send('Erro ao atualizar tipo de manutenção');
        } else {
            res.redirect('/listar-tipo-manutencao');
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});