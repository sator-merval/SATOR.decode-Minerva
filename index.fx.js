// index_fx.js — micro-événements Minerva (compat CSS actuel)
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const content = document.querySelector('.content');
  const paras = Array.from(document.querySelectorAll('.content p'));

  if (!content || !paras.length) return;

  // Oscillation continue : fixe 50% / soft 48% / hard 2%
  function setOscillation() {
    content.classList.remove('oscSoft', 'oscHard');
    const r = Math.random();
    if (r < 0.02)       content.classList.add('oscHard'); // 2%
    else if (r < 0.50)  content.classList.add('oscSoft'); // 48%
    // 50%: pas de classe -> fixe
  }
  setOscillation();
  setInterval(setOscillation, 200 + Math.random() * 600);

  // Tick ~3 fois par seconde : secousse, flash, glow, vanish
  setInterval(() => {
    // 12%: petit shake global
    if (Math.random() < 0.12) {
      body.classList.add('shakeSoft');
      setTimeout(() => body.classList.remove('shakeSoft'), 160);
    }

    // 8%: flash plein écran (discret)
    if (Math.random() < 0.08) {
      body.classList.add('flashSoft');
      setTimeout(() => body.classList.remove('flashSoft'), 140);
    }

    // 18%: un paragraphe "glow" bref
    if (Math.random() < 0.18) {
      const p = paras[Math.floor(Math.random() * paras.length)];
      p.classList.add('glow');
      setTimeout(() => p.classList.remove('glow'), 180);
    }

    // 10%: un paragraphe "vanish" bref
    if (Math.random() < 0.10) {
      const p = paras[Math.floor(Math.random() * paras.length)];
      p.classList.add('vanish');
      setTimeout(() => p.classList.remove('vanish'), 160);
    }
  }, 350);
});
