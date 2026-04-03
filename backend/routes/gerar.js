const express = require('express');
const router = express.Router();
const { gerarPost } = require('../services/gemini');
const Post = require('../models/Post');

// Gerar e salvar post automaticamente
router.post('/', async (req, res) => {
  try {
    const { tema } = req.body;
    const post = await gerarPost(tema);
    const salvo = await Post.create(post);
    res.json(salvo);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;