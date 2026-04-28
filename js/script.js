/* ============================================================
   script.js — Lume Pet
   ============================================================ */

/* ══════════════════════════════════
   CARROSSEL
   ══════════════════════════════════ */
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


/* ══════════════════════════════════
   DOAÇÃO — botões de valor rápido
   ══════════════════════════════════ */
(function () {
  var btnsValor = document.querySelectorAll('.btn-valor');
  var inputValor = document.querySelector('.doacao .container input[type="number"]');

  btnsValor.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btnsValor.forEach(function (b) { b.classList.remove('ativo'); });
      btn.classList.add('ativo');
      if (inputValor) {
        // extrai apenas o número do texto do botão (ex: "R$ 50" → "50")
        var valor = btn.textContent.replace(/\D/g, '');
        inputValor.value = valor;
      }
    });
  });
})();


/* ══════════════════════════════════
   DOAÇÃO — botões de pagamento
   ══════════════════════════════════ */
(function () {
  var btnsPag = document.querySelectorAll('.btn-pag');

  btnsPag.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btnsPag.forEach(function (b) { b.classList.remove('ativo'); });
      btn.classList.add('ativo');
    });
  });
})();