const express = require('express');
const router = express.Router();
const { buscarTabela } = require('../services/football');

// Buscar tabela de um campeonato
router.get('/:liga', async (req, res) => {
  try {
    const tabela = await buscarTabela(req.params.liga);
    res.json(tabela);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;