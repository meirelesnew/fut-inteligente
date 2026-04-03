const axios = require('axios');

const API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

// IDs das principais ligas
const LIGAS = {
  brasileirao: 71,
  libertadores: 13,
  copabrasil: 73,
  champions: 2,
  premier: 39
};

async function buscarTabela(liga) {
  const ligaId = LIGAS[liga] || 71;
  const response = await axios.get(`${BASE_URL}/standings`, {
    params: { league: ligaId, season: 2025 },
    headers: { 'x-apisports-key': API_KEY }
  });
  return response.data.response;
}

async function buscarNoticias(time) {
  const response = await axios.get(`${BASE_URL}/fixtures`, {
    params: { team: time, last: 5 },
    headers: { 'x-apisports-key': API_KEY }
  });
  return response.data.response;
}

module.exports = { buscarTabela, buscarNoticias };