const express = require('express');
const router = express.Router();
const { buscarTabela, buscarJogos, buscarResultados } = require('../services/football');

// Buscar tabela de um campeonato
router.get('/:liga', async (req, res) => {
  try {
    const tabela = await buscarTabela(req.params.liga);
    if (!tabela || tabela.length === 0) {
      return res.status(404).json({ erro: 'Tabela não disponível para esta liga' });
    }
    res.json(tabela);
  } catch (err) {
    console.error(`❌ Erro tabela: ${err.message}`);
    res.status(500).json({ erro: err.message });
  }
});

// Buscar próximos jogos
router.get('/:liga/jogos', async (req, res) => {
  try {
    const jogos = await buscarJogos(req.params.liga, 10);
    res.json(jogos);
  } catch (err) {
    console.error(`❌ Erro jogos: ${err.message}`);
    res.status(500).json({ erro: err.message });
  }
});

// Buscar últimos resultados
router.get('/:liga/resultados', async (req, res) => {
  try {
    const resultados = await buscarResultados(req.params.liga, 10);
    res.json(resultados);
  } catch (err) {
    console.error(`❌ Erro resultados: ${err.message}`);
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
