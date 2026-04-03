const API = 'https://fut-inteligente.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  carregarPosts();
  carregarTabela('brasileirao', document.querySelector('.tab.ativo'));
});

async function carregarPosts() {
  try {
    const res = await fetch(`${API}/api/posts`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = await res.json();

    const lista = document.getElementById('lista-posts');
    const flamengo = document.getElementById('posts-flamengo');

    if (!posts.length) {
      lista.innerHTML = '<p class="carregando">Nenhum post ainda.</p>';
      flamengo.innerHTML = '<p class="carregando">Nenhum post ainda.</p>';
      return;
    }

    lista.innerHTML = '';
    flamengo.innerHTML = '';

    posts.forEach(post => {
      // ✅ Sem innerHTML para texto — previne XSS
      const card = document.createElement('div');
      card.className = 'card';
      card.onclick = () => abrirPost(post.slug);

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

      lista.appendChild(card.cloneNode(true));

      if (post.tags && post.tags.includes('flamengo')) {
        flamengo.appendChild(card);
      }
    });

  } catch (err) {
    console.error('Erro ao carregar posts:', err);
    document.getElementById('lista-posts').innerHTML =
      '<p class="erro">Erro ao carregar posts.</p>';
  }
}

function abrirPost(slug) {
  window.location.href = `post.html?slug=${slug}`;
}

// ✅ Corrigido: recebe btn como parâmetro explícito
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
    console.error('Erro ao carregar tabela:', err);
    container.innerHTML = '<p class="erro">Erro ao carregar tabela.</p>';
  }
}
