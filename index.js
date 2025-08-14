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

app.get('/deletar/:id', (req, res) => {
    const id = req.params.id;
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

app.get('/atualizar/:id', (req, res) => {
    const id = req.params.id;
    const select = 'SELECT * FROM Bloco WHERE id_bloco = ?';

    connection.query(select, [id_bloco], (err, rows) => {
        if(!err && rows.length > 0) {
            const Bloco = rows[0];
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
                            <input type="number" step="0.01" id="preco" name="preco"
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

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});