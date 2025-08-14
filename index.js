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

app.post('/criar',(req, res) => {
    const id_bloco = req.body.nome;
    const quantidade = req.body.quantidade;
    const preco = req.body.preco;

    const insert = 
        'INSERT INTO Bloco (id_bloco, descricao, qtd_apartamentos) VALUES (?, ?, ?)';

    connection.query(insert, [id_bloco, descricao, qtd_apartamentos], (err, results) => {
        if (err) {
            console.error("Erro ao inserir dados: ", err);
            res.status(500).send('Erro ao cadastrar dados');
            return;
        } else{
            console.log("Dados inserido com sucesso");
            res.redirect('/');
        }
    });
});

app.get('/relatorio', (req, res) => {
    const select = 'SELECT * FROM Bloco';
 
    connection.query(select, (err, rows) => {
        if (err) {
            console.error("Erro ao listar produtos: ", err);
            res.status(500).send('Erro ao listar produtos');
            return;
        } else {
            console.log("Produtos listados com sucesso");
            res.send(`
                <h1>Dados do Bloco</h1>
                <table border="1">
                    <tr>
                        <th>ID</th>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                    ${rows.map(row => `
                        <tr>
                            <td>${row.id}</td>
                            <td>${row.produto}</td>
                            <td>${row.quantidade}</td>
                            <td>${row.preco}</td>
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
            console.error("Erro ao deletar produtos: ", err);
            res.status(500).send('Erro ao deletar produto');
            return;
        } else {
            console.log("Produto deletado com sucesso");
            res.redirect('/relatorio');
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});