const axios = require('axios');

const API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

// IDs e temporadas dos campeonatos
const LIGAS = {
  brasileirao: { id: 71, season: 2025, nome: 'Brasileirão Série A' },
  laliga:       { id: 140, season: 2025, nome: 'La Liga' },
  premier:      { id: 39, season: 2025, nome: 'Premier League' },
  copamundo:    { id: 1, season: 2026, nome: 'Copa do Mundo 2026' }
};

async function buscarTabela(liga) {
  const config = LIGAS[liga];
  if (!config) {
    throw new Error(`Liga "${liga}" não encontrada`);
  }

  console.log(`⚽ Buscando tabela: ${config.nome} (${config.season})`);

  const response = await axios.get(`${BASE_URL}/standings`, {
    params: { league: config.id, season: config.season },
    headers: { 'x-apisports-key': API_KEY }
  });

  console.log(`✅ Tabela recebida: ${config.nome}`);
  return response.data.response;
}

async function buscarJogos(liga, quantidade = 10) {
  const config = LIGAS[liga];
  if (!config) throw new Error(`Liga "${liga}" não encontrada`);

  console.log(`🎮 Buscando jogos: ${config.nome}`);

  const response = await axios.get(`${BASE_URL}/fixtures`, {
    params: {
      league: config.id,
      season: config.season,
      next: quantidade
    },
    headers: { 'x-apisports-key': API_KEY }
  });

  return response.data.response;
}

async function buscarResultados(liga, quantidade = 10) {
  const config = LIGAS[liga];
  if (!config) throw new Error(`Liga "${liga}" não encontrada`);

  console.log(`📊 Buscando resultados: ${config.nome}`);

  const response = await axios.get(`${BASE_URL}/fixtures`, {
    params: {
      league: config.id,
      season: config.season,
      last: quantidade
    },
    headers: { 'x-apisports-key': API_KEY }
  });

  return response.data.response;
}

module.exports = { buscarTabela, buscarJogos, buscarResultados, LIGAS };
