require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuração do Pool de Conexão com o Neon
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Necessário para Neon
    }
});

// Rota de teste
app.get('/', (req, res) => {
    res.json({ status: 'API Ficha de Controle do Açúcar está rodando!' });
});

// Rota para salvar uma ficha
app.post('/api/fichas', async (req, res) => {
    try {
        const { nome, data, exames, sinais, partida } = req.body;

        const query = `
            INSERT INTO fichas (nome, data, exames, sinais, ponto_partida)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;

        const values = [
            nome,
            data,
            JSON.stringify(exames),
            JSON.stringify(sinais),
            JSON.stringify(partida)
        ];

        const result = await pool.query(query, values);
        
        res.status(201).json({ 
            mensagem: 'Ficha salva com sucesso!', 
            id: result.rows[0].id 
        });

    } catch (error) {
        console.error('Erro ao salvar ficha:', error);
        res.status(500).json({ erro: 'Erro interno ao salvar a ficha.' });
    }
});

// Rota para listar fichas (opcional)
app.get('/api/fichas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM fichas ORDER BY criado_em DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar fichas:', error);
        res.status(500).json({ erro: 'Erro interno ao buscar fichas.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
