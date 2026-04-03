const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS restrito ao frontend
app.use(cors({
  origin: [
    'https://meirelesnew.github.io',
    'http://localhost:3000'
  ]
}));

app.use(express.json());

// ✅ Conexão MongoDB com logs
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Erro no MongoDB:', err.message));

// ✅ Middleware de autenticação para rotas protegidas
function autenticar(req, res, next) {
  const token = req.headers['x-api-token'];
  if (!token || token !== process.env.API_TOKEN) {
    return res.status(401).json({ erro: 'Token inválido ou ausente' });
  }
  next();
}

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado',
    uptime: process.uptime()
  });
});

// Rota pública de teste
app.get('/', (req, res) => {
  res.json({ status: 'ok', mensagem: 'Fut Inteligente API rodando!' });
});

// Rotas públicas
app.use('/api/posts', require('./routes/posts'));
app.use('/api/tabelas', require('./routes/tabelas'));

// Rotas protegidas
app.use('/api/gerar', autenticar, require('./routes/gerar'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
