const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  conteudo: { type: String, required: true },
  resumo: { type: String },
  tema: { type: String },
  tags: [String],
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);