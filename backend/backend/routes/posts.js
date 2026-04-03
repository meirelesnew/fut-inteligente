const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Listar todos os posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ criadoEm: -1 })
      .limit(20);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Buscar post por slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ erro: 'Post não encontrado' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;