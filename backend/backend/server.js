const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Erro no MongoDB:', err));

// Rotas
app.use('/api/posts', require('./routes/posts'));
app.use('/api/tabelas', require('./routes/tabelas'));
app.use('/api/gerar', require('./routes/gerar'));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ status: 'ok', mensagem: 'Fut Inteligente API rodando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});