// ============================================
// DIVINE TECH VENTURE — Premium Animations v2
// /public/js/scroll-animations.js
// ============================================

(function () {

  // ── PAGE TRANSITION ──────────────────────
  const transitionStyle = document.createElement('style');
  transitionStyle.textContent = `

    /* Page enter animation */
    @keyframes pageEnter {
      0%  { opacity: 0; transform: translateY(18px); }
      100%{ opacity: 1; transform: translateY(0); }
    }

    body {
      animation: pageEnter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    /* Page exit */
    body.page-exit {
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 0.25s ease, transform 0.25s ease;
      pointer-events: none;
    }

    /* ── SCROLL REVEAL BASE ── */
    .reveal {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: opacity, transform;
    }

    .reveal.from-left  { transform: translateX(-40px); }
    .reveal.from-right { transform: translateX(40px); }
    .reveal.scale-in   { transform: scale(0.94) translateY(20px); }

    .reveal.visible {
      opacity: 1;
      transform: translate(0,0) scale(1);
    }

    /* Stagger delays */
    .reveal.delay-1 { transition-delay: 0.08s; }
    .reveal.delay-2 { transition-delay: 0.16s; }
    .reveal.delay-3 { transition-delay: 0.24s; }
    .reveal.delay-4 { transition-delay: 0.32s; }
    .reveal.delay-5 { transition-delay: 0.40s; }

    /* Heading split lines */
    .reveal-heading .word {
      display: inline-block;
      opacity: 0;
      transform: translateY(100%);
      transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1),
                  transform 0.5s cubic-bezier(0.22,1,0.36,1);
      margin-right: 0.25em;
    }

    .reveal-heading.visible .word {
      opacity: 1;
      transform: translateY(0);
    }

    .reveal-heading .word:nth-child(1) { transition-delay: 0.00s; }
    .reveal-heading .word:nth-child(2) { transition-delay: 0.07s; }
    .reveal-heading .word:nth-child(3) { transition-delay: 0.14s; }
    .reveal-heading .word:nth-child(4) { transition-delay: 0.21s; }
    .reveal-heading .word:nth-child(5) { transition-delay: 0.28s; }
    .reveal-heading .word:nth-child(6) { transition-delay: 0.35s; }
    .reveal-heading .word:nth-child(7) { transition-delay: 0.42s; }
    .reveal-heading .word:nth-child(8) { transition-delay: 0.49s; }

    /* Image reveal */
    .reveal-img {
      opacity: 0;
      transform: scale(1.06);
      transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1),
                  transform 0.8s cubic-bezier(0.22,1,0.36,1);
    }
    .reveal-img.visible {
      opacity: 1;
      transform: scale(1);
    }

    /* Reduce motion */
    @media (prefers-reduced-motion: reduce) {
      .reveal, .reveal-heading .word, .reveal-img, body {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
        animation: none !important;
      }
    }
  `;
  document.head.appendChild(transitionStyle);


  // ── PAGE EXIT on nav click ────────────────
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        link.target === '_blank') return;

    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.href;
      document.body.classList.add('page-exit');
      setTimeout(() => { window.location.href = target; }, 260);
    });
  });


  // ── WORD-BY-WORD HEADINGS ─────────────────
  function splitHeadings() {
    document.querySelectorAll(
      '.page-header h1, .hero-content h1, .content-block h2, .events-strip-heading h2, .footer-col h3'
    ).forEach(el => {
      if (el.dataset.split) return;
      el.dataset.split = true;
      const words = el.textContent.trim().split(' ');
      el.innerHTML = words.map(w => `<span class="word">${w}</span>`).join('');
      el.classList.add('reveal-heading');
    });
  }


  // ── TAG ELEMENTS ─────────────────────────
  function tagElements() {

    // Paragraphs
    document.querySelectorAll(
      '.content-block p, .page-header p, .hero-content p'
    ).forEach(el => {
      el.classList.add('reveal');
    });

    // Cards — staggered
    [
      '.step-card', '.staff-card', '.event-card',
      '.event-strip-card', '.facility-card', '.magazine-item',
      '.download-card', '.leader-card'
    ].forEach(selector => {
      document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('reveal', 'scale-in');
        el.classList.add(`delay-${Math.min(i + 1, 5)}`);
      });
    });

    // Stats
    document.querySelectorAll('.stat-item').forEach((el, i) => {
      el.classList.add('reveal');
      el.classList.add(`delay-${i + 1}`);
    });

    // List items
    document.querySelectorAll('.dashboard-list-item').forEach((el, i) => {
      el.classList.add('reveal');
      el.classList.add(`delay-${Math.min(i + 1, 5)}`);
    });

    // Strips & sections
    document.querySelectorAll(
      '.announcements-strip, .events-strip, .stats, .footer-col, .info-list li, .process-steps'
    ).forEach(el => {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });

    // Images
    document.querySelectorAll(
      '.facility-card img, .magazine-item img, .leader-card img, .event-card-image'
    ).forEach(el => {
      el.classList.add('reveal-img');
    });
  }


  // ── INTERSECTION OBSERVER ─────────────────
  function startObserver() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-heading, .reveal-img')
      .forEach(el => observer.observe(el));
  }


  // ── INIT ──────────────────────────────────
  function init() {
    splitHeadings();
    tagElements();
    startObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();