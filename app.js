const API = 'https://fut-inteligente.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  carregarPosts();
  carregarTabela('brasileirao', document.querySelector('.tab.ativo'));
  carregarJogos('brasileirao', document.querySelector('.tab-jogo.ativo'));
});

// ── POSTS ──────────────────────────────────────────
async function carregarPosts() {
  try {
    const res = await fetch(`${API}/api/posts`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = await res.json();

    const lista = document.getElementById('lista-posts');
    const flamengo = document.getElementById('posts-flamengo');

    if (!posts.length) {
      lista.innerHTML = '<p class="carregando">Nenhum post ainda.</p>';
      flamengo.innerHTML = '<p class="carregando">Nenhum post do Flamengo ainda.</p>';
      return;
    }

    lista.innerHTML = '';
    flamengo.innerHTML = '';

    posts.forEach(post => {
      const card = criarCardPost(post);
      lista.appendChild(card);
      if (post.tags && post.tags.some(t => t.toLowerCase().includes('flamengo'))) {
        flamengo.appendChild(criarCardPost(post));
      }
    });

  } catch (err) {
    document.getElementById('lista-posts').innerHTML = '<p class="erro">Erro ao carregar posts.</p>';
  }
}

function criarCardPost(post) {
  const card = document.createElement('div');
  card.className = 'card';
  card.onclick = () => window.location.href = `post.html?slug=${post.slug}`;

  const titulo = document.createElement('h3');
  titulo.textContent = post.titulo;

  const resumo = document.createElement('p');
  resumo.textContent = post.resumo || '';

  const data = document.createElement('div');
  data.className = 'data';
  data.textContent = new Date(post.criadoEm).toLocaleDateString('pt-BR');

  card.appendChild(titulo);
  card.appendChild(resumo);
  card.appendChild(data);
  return card;
}

// ── TABELAS ────────────────────────────────────────
async function carregarTabela(liga, btn) {
  const container = document.getElementById('tabela-container');
  container.innerHTML = '<p class="carregando">Carregando tabela...</p>';

  document.querySelectorAll('.tab').forEach(b => b.classList.remove('ativo'));
  if (btn) btn.classList.add('ativo');

  try {
    const res = await fetch(`${API}/api/tabelas/${liga}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const dados = await res.json();

    if (!dados || !dados.length) {
      container.innerHTML = '<p class="carregando">Tabela não disponível ainda.</p>';
      return;
    }

    const times = dados[0]?.league?.standings[0] || [];
    if (!times.length) {
      container.innerHTML = '<p class="carregando">Dados indisponíveis.</p>';
      return;
    }

    let html = `
      <div class="tabela-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Time</th>
              <th title="Pontos">P</th>
              <th title="Jogos">J</th>
              <th title="Vitórias">V</th>
              <th title="Empates">E</th>
              <th title="Derrotas">D</th>
              <th title="Saldo de Gols">SG</th>
            </tr>
          </thead>
          <tbody>
    `;

    times.forEach((item, index) => {
      const destaque = item.team.name.toLowerCase().includes('flamengo') ? 'class="flamengo-row"' : '';
      html += `
        <tr ${destaque}>
          <td>${item.rank}</td>
          <td class="time-nome">${item.team.name}</td>
          <td><strong>${item.points}</strong></td>
          <td>${item.all.played}</td>
          <td>${item.all.win}</td>
          <td>${item.all.draw}</td>
          <td>${item.all.lose}</td>
          <td>${item.goalsDiff > 0 ? '+' : ''}${item.goalsDiff}</td>
        </tr>
      `;
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;

  } catch (err) {
    container.innerHTML = '<p class="erro">Erro ao carregar tabela.</p>';
  }
}

// ── JOGOS ──────────────────────────────────────────
async function carregarJogos(liga, btn) {
  const container = document.getElementById('jogos-container');
  container.innerHTML = '<p class="carregando">Carregando jogos...</p>';

  document.querySelectorAll('.tab-jogo').forEach(b => b.classList.remove('ativo'));
  if (btn) btn.classList.add('ativo');

  try {
    const res = await fetch(`${API}/api/tabelas/${liga}/jogos`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const jogos = await res.json();

    if (!jogos || !jogos.length) {
      container.innerHTML = '<p class="carregando">Sem jogos agendados.</p>';
      return;
    }

    let html = '<div class="jogos-lista">';

    jogos.slice(0, 8).forEach(jogo => {
      const fixture = jogo.fixture;
      const times = jogo.teams;
      const data = new Date(fixture.date);
      const dataFormatada = data.toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit'
      });
      const hora = data.toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit'
      });

      const flamHome = times.home.name.toLowerCase().includes('flamengo') ? 'destaque' : '';
      const flamAway = times.away.name.toLowerCase().includes('flamengo') ? 'destaque' : '';

      html += `
        <div class="jogo-card">
          <div class="jogo-data">${dataFormatada} • ${hora}</div>
          <div class="jogo-times">
            <span class="time ${flamHome}">${times.home.name}</span>
            <span class="vs">×</span>
            <span class="time ${flamAway}">${times.away.name}</span>
          </div>
          <div class="jogo-local">${fixture.venue?.name || ''}</div>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;

  } catch (err) {
    container.innerHTML = '<p class="erro">Erro ao carregar jogos.</p>';
  }
}
