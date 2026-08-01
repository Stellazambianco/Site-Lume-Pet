// CARRINHO

let itensCarrinho = [];

function toggleCarrinho(event) {
  event.preventDefault();
  const painel = document.getElementById('carrinhoPainel');
  painel.style.display = painel.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function(e) {
  const painel = document.getElementById('carrinhoPainel');
  if (!e.target.closest('.carrinho-icon') && !e.target.closest('.carrinho-painel')) {
    painel.style.display = 'none';
  }
});

function adicionarAoCarrinho(nome, preco) {
  const precoNum = parseFloat(preco.replace(',', '.'));
  const existente = itensCarrinho.find(i => i.nome === nome);

  if (existente) {
    existente.qtd++;
  } else {
    itensCarrinho.push({ nome, preco: precoNum, qtd: 1 });
  }

  atualizarCarrinho();
}

function alterarQtd(nome, delta) {
  const item = itensCarrinho.find(i => i.nome === nome);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) {
    itensCarrinho = itensCarrinho.filter(i => i.nome !== nome);
  }
  atualizarCarrinho();
}

function removerItem(nome) {
  itensCarrinho = itensCarrinho.filter(i => i.nome !== nome);
  atualizarCarrinho();
}

function esvaziarCarrinho() {
  itensCarrinho = [];
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById('carrinho-lista');
  const count = document.querySelector('.carrinho-count');
  const total = document.getElementById('carrinho-valor');

  const totalItens = itensCarrinho.reduce((s, i) => s + i.qtd, 0);
  count.textContent = totalItens;

  if (itensCarrinho.length === 0) {
    lista.innerHTML = '<li class="carrinho-vazio">Nenhum item ainda.</li>';
  } else {
    lista.innerHTML = itensCarrinho.map(item => `
      <li>
        <span style="flex:1">${item.nome}</span>
        <div class="item-qtd">
          <button onclick="alterarQtd('${item.nome}', -1)">−</button>
          <span>${item.qtd}</span>
          <button onclick="alterarQtd('${item.nome}', 1)">+</button>
        </div>
        <span>R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</span>
        <button class="item-remover" onclick="removerItem('${item.nome}')">🗑️</button>
      </li>
    `).join('');
  }

  const soma = itensCarrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
  total.textContent = `R$ ${soma.toFixed(2).replace('.', ',')}`;
}

// PAGAMENTO

function abrirPagamento() {
  if (itensCarrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  const resumo = document.getElementById('pagamentoResumo');
  const soma = itensCarrinho.reduce((s, i) => s + i.preco * i.qtd, 0);

  resumo.innerHTML = itensCarrinho.map(i =>
    `<p>${i.nome} x${i.qtd} — R$ ${(i.preco * i.qtd).toFixed(2).replace('.', ',')}</p>`
  ).join('') + `<hr><strong>Total: R$ ${soma.toFixed(2).replace('.', ',')}</strong>`;

  document.getElementById('pagamentoOverlay').classList.add('aberto');
  document.getElementById('carrinhoPainel').style.display = 'none';
}

function fecharPagamento() {
  document.getElementById('pagamentoOverlay').classList.remove('aberto');
}

function confirmarPedido() {
  const metodo = document.querySelector('input[name="pagamento"]:checked').value;
  const nomes = { pix: 'PIX', cartao: 'Cartão de crédito', boleto: 'Boleto' };
  alert(`✅ Pedido confirmado via ${nomes[metodo]}!\nObrigado pela compra! 🐾`);
  esvaziarCarrinho();
  fecharPagamento();
}

// LOJA - FILTROS

let categoriaAtiva = 'geral';

function filtrarCategoria(categoria) {
  categoriaAtiva = categoria;
  document.querySelectorAll('.categoria-btn').forEach(btn => btn.classList.remove('ativo'));
  event.target.classList.add('ativo');
  filtrarProdutos();
}

function filtrarProdutos() {
  const texto = document.getElementById('campoPesquisa').value.toLowerCase();
  const cards = document.querySelectorAll('.produto-card');
  const vazio = document.getElementById('lojaVazio');
  const geralProdutos = ['shampoo natural', 'ração premium', 'bolinha de borracha', 'cama pet'];
  let produtosVisiveis = 0;

  cards.forEach(card => {
    const categoria = card.dataset.categoria;
    const nome = card.dataset.nome;

    const passaCategoria = categoriaAtiva === 'geral'
      ? geralProdutos.includes(nome)
      : categoria === categoriaAtiva;

    const passaPesquisa = nome.includes(texto);
    const deveMostrar = passaCategoria && passaPesquisa;

    card.classList.toggle('oculto', !deveMostrar);
    card.classList.toggle('visivel', deveMostrar);

    if (deveMostrar) produtosVisiveis++;
  });

  if (vazio) {
    vazio.style.display = produtosVisiveis > 0 ? 'none' : 'flex';
  }
}

// Inicia mostrando o Geral
filtrarProdutos();


// CARROSSEL
(function () {
  const slidesEl   = document.getElementById('slides');
  const dotsWrap   = document.getElementById('dots');
  const progressEl = document.getElementById('progress');

  if (!slidesEl) return; // sai se não houver carrossel na página

  const total    = document.querySelectorAll('.slide').length;
  const INTERVAL = 5000; // ms entre troca automática de slide

  let current      = 0;
  let autoTimer    = null;
  let progressTimer = null;
  let progressVal  = 0;

  /* ── Criar dots dinamicamente ── */
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  }

  /* ── Ir para slide N ── */
  function goTo(n) {
    current = (n + total) % total;
    slidesEl.style.transform = 'translateX(-' + (current * 100) + '%)';
    updateDots();
    resetAuto();
  }

  /* ── Atualizar dots ── */
  function updateDots() {
    document.querySelectorAll('.dot').forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  /* ── Barra de progresso ── */
  function startProgress() {
    progressVal = 0;
    clearInterval(progressTimer);
    progressTimer = setInterval(function () {
      progressVal += 100 / (INTERVAL / 100);
      if (progressVal > 100) progressVal = 100;
      progressEl.style.width = progressVal + '%';
    }, 100);
  }

  /* ── Autoplay ── */
  function resetAuto() {
    clearInterval(autoTimer);
    clearInterval(progressTimer);
    startProgress();
    autoTimer = setInterval(function () {
      goTo(current + 1);
    }, INTERVAL);
  }

  /* ── Botões de seta ── */
  document.getElementById('prev').addEventListener('click', function () {
    goTo(current - 1);
  });
  document.getElementById('next').addEventListener('click', function () {
    goTo(current + 1);
  });

  /* ── Pausar no hover ── */
  var carouselEl = document.querySelector('.carrossel');
  carouselEl.addEventListener('mouseenter', function () {
    clearInterval(autoTimer);
    clearInterval(progressTimer);
  });
  carouselEl.addEventListener('mouseleave', resetAuto);

  /* ── Swipe (touch) ── */
  var touchStartX = null;
  slidesEl.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  slidesEl.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    touchStartX = null;
  });

  /* ── Teclado ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  /* ── Iniciar ── */
  resetAuto();
})();

//Doação
let metodoDoacao = 'pix';

function selecionarValor(valor) {
  document.getElementById('doacao-valor').value = valor;
  document.querySelectorAll('.btn-valor').forEach(btn => btn.classList.remove('ativo'));
  event.target.classList.add('ativo');
}

function limparBotoesValor() {
  document.querySelectorAll('.btn-valor').forEach(btn => btn.classList.remove('ativo'));
}

function abrirPagamentoDoacao() {
  const email = document.getElementById('doacao-email').value.trim();
  const valor = document.getElementById('doacao-valor').value.trim();
  let valido = true;

  // Limpa erros
  document.getElementById('erro-email').textContent = '';
  document.getElementById('erro-valor').textContent = '';

  // Valida email
  if (!email || !email.includes('@')) {
    document.getElementById('erro-email').textContent = 'Por favor, informe um e-mail válido.';
    valido = false;
  }

  // Valida valor
  if (!valor || parseFloat(valor) <= 0) {
    document.getElementById('erro-valor').textContent = 'Por favor, informe um valor para a doação.';
    valido = false;
  }

  if (!valido) return;

  // Preenche resumo
  const nome = document.getElementById('doacao-nome').value.trim();
  document.getElementById('doacaoResumo').innerHTML = `
    ${nome ? `<p><strong>Nome:</strong> ${nome}</p>` : ''}
    <p><strong>E-mail:</strong> ${email}</p>
    <p><strong>Valor:</strong> R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}</p>
  `;

  selecionarMetodo('pix');
  document.getElementById('doacaoOverlay').classList.add('aberto');
}

function fecharPagamentoDoacao() {
  document.getElementById('doacaoOverlay').classList.remove('aberto');
}

function selecionarMetodo(metodo) {
  metodoDoacao = metodo;

  document.querySelectorAll('.btn-metodo').forEach(btn => btn.classList.remove('ativo'));
  document.getElementById('btn-' + metodo).classList.add('ativo');

  document.getElementById('detalhe-pix').style.display = metodo === 'pix' ? 'flex' : 'none';
  document.getElementById('detalhe-cartao').style.display = metodo !== 'pix' ? 'flex' : 'none';
}

function mascaraCartao(input) {
  input.value = input.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
}

function mascaraValidade(input) {
  input.value = input.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
}

function confirmarDoacao() {
  const nomes = { pix: 'PIX', credito: 'Cartão de Crédito', debito: 'Cartão de Débito' };

  if (metodoDoacao !== 'pix') {
    const campos = document.querySelectorAll('#detalhe-cartao input');
    for (let campo of campos) {
      if (!campo.value.trim()) {
        alert('Por favor, preencha todos os dados do cartão.');
        return;
      }
    }
  }

  alert(`✅ Doação confirmada via ${nomes[metodoDoacao]}!\nObrigado pelo seu apoio! 🐾`);
  fecharPagamentoDoacao();

  // Limpa o formulário
  document.getElementById('doacao-nome').value = '';
  document.getElementById('doacao-email').value = '';
  document.getElementById('doacao-valor').value = '';
  document.querySelectorAll('.btn-valor').forEach(btn => btn.classList.remove('ativo'));
}

