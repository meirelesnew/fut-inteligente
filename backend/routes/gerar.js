const express = require('express');
const router = express.Router();
const { gerarPost } = require('../services/gemini');
const Post = require('../models/Post');

router.post('/', async (req, res) => {
  const { tema } = req.body;

  if (!tema) {
    return res.status(400).json({ erro: 'Campo "tema" é obrigatório' });
  }

  console.log(`📨 Requisição para gerar post: ${tema}`);

  try {
    // Gerar post via Gemini
    const post = await gerarPost(tema);

    // Verificar slug duplicado
    const existe = await Post.findOne({ slug: post.slug });
    if (existe) {
      post.slug = `${post.slug}-${Date.now()}`;
      console.log(`⚠️ Slug duplicado, novo slug: ${post.slug}`);
    }

    // Salvar no banco
    const salvo = await Post.create(post);
    console.log(`💾 Post salvo no banco: ${salvo._id}`);

    res.json(salvo);

  } catch (err) {
    console.error(`❌ Erro ao gerar post: ${err.message}`);
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
