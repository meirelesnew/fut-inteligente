const API = 'https://fut-inteligente.onrender.com';

// Carregar posts ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
  carregarPosts();
  carregarTabela('brasileirao');
});

// Buscar e exibir posts
async function carregarPosts() {
  try {
    const res = await fetch(`${API}/api/posts`);
    const posts = await res.json();

    const lista = document.getElementById('lista-posts');
    const flamengo = document.getElementById('posts-flamengo');

    if (posts.length === 0) {
      lista.innerHTML = '<p class="carregando">Nenhum post ainda.</p>';
      return;
    }

    lista.innerHTML = '';
    flamengo.innerHTML = '';

    posts.forEach(post => {
      const card = `
        <div class="card" onclick="abrirPost('${post.slug}')">
          <h3>${post.titulo}</h3>
          <p>${post.resumo || ''}</p>
          <div class="data">${new Date(post.criadoEm).toLocaleDateString('pt-BR')}</div>
        </div>
      `;
      lista.innerHTML += card;

      // Posts do Flamengo na seção especial
      if (post.tags && post.tags.includes('flamengo')) {
        flamengo.innerHTML += card;
      }
    });

  } catch (err) {
    document.getElementById('lista-posts').innerHTML =
      '<p class="erro">Erro ao carregar posts.</p>';
  }
}

// Abrir post individual
function abrirPost(slug) {
  window.location.href = `post.html?slug=${slug}`;
}

// Carregar tabela de campeonato
async function carregarTabela(liga) {
  const container = document.getElementById('tabela-container');
  container.innerHTML = '<p class="carregando">Carregando tabela...</p>';

  // Atualizar botão ativo
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('ativo'));
  event.target.classList.add('ativo');

  try {
    const res = await fetch(`${API}/api/tabelas/${liga}`);
    const dados = await res.json();

    if (!dados || dados.length === 0) {
      container.innerHTML = '<p class="carregando">Tabela não disponível.</p>';
      return;
    }

    const times = dados[0]?.league?.standings[0] || [];

    let html = `
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Time</th>
            <th>P</th>
            <th>J</th>
            <th>V</th>
            <th>E</th>
            <th>D</th>
            <th>SG</th>
          </tr>
        </thead>
        <tbody>
    `;

    times.forEach(item => {
      html += `
        <tr>
          <td>${item.rank}</td>
          <td>${item.team.name}</td>
          <td><strong>${item.points}</strong></td>
          <td>${item.all.played}</td>
          <td>${item.all.win}</td>
          <td>${item.all.draw}</td>
          <td>${item.all.lose}</td>
          <td>${item.goalsDiff}</td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

  } catch (err) {
    container.innerHTML = '<p class="erro">Erro ao carregar tabela.</p>';
  }
}