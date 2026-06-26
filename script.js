/* ── Reveal no scroll ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: .06 });

document.querySelectorAll('.reveal, .gitem').forEach(el => io.observe(el));

/* ── Select ── */
document.getElementById('cf-tipo').addEventListener('change', function () {
  this.classList.add('ok');
});

/* ── Formulário ── */
const form  = document.getElementById('cf');
const btn   = document.getElementById('cf-btn');
const errEl = document.getElementById('cf-error');
const modal = document.getElementById('modal');

form.addEventListener('submit', async e => {
  e.preventDefault();
  errEl.style.display = 'none';

  const name  = form.name.value.trim();
  const email = form.email.value.trim();
  const tipo  = form.tipo.value;

  if (!name)  { erro('Nome é obrigatório.'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { erro('E-mail inválido.'); return; }
  if (!tipo)  { erro('Selecione o pacote.'); return; }

  btn.classList.add('loading');
  btn.textContent = 'Enviando…';

  try {
    /* substitua SEU_ID_AQUI pelo endpoint real do Formspree */
    const res = await fetch('https://formspree.io/f/SEU_ID_AQUI', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        nome: name, email,
        whatsapp: form.phone.value.trim(),
        tipo, mensagem: form.mensagem.value.trim()
      })
    });
    if (!res.ok) throw new Error();
    form.reset();
    document.getElementById('cf-tipo').classList.remove('ok');
    modal.classList.add('open');
  } catch {
    erro('Erro ao enviar. Tente via WhatsApp.');
  } finally {
    btn.classList.remove('loading');
    btn.textContent = 'Enviar →';
  }
});

function erro(msg) { errEl.textContent = msg; errEl.style.display = 'block'; }

document.getElementById('modal-close').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

/* ── Modal privacidade do formulário ── */
const privForm = document.getElementById('open-privacidade-form');
if (privForm) {
  privForm.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('modal-privacidade').classList.add('open');
  });
}

/* ── Modais legais ── */
['termos','privacidade'].forEach(id => {
  const btn = document.getElementById('open-' + id);
  const mod = document.getElementById('modal-' + id);
  if (!btn || !mod) return;
  btn.addEventListener('click', e => { e.preventDefault(); mod.classList.add('open'); });
  mod.addEventListener('click', e => { if (e.target === mod) mod.classList.remove('open'); });
});
document.querySelectorAll('.legal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById(btn.dataset.close).classList.remove('open');
  });
});
