// main.js

// -------------------------------------------------------
// MOBILE MENU TOGGLE
// -------------------------------------------------------
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// -------------------------------------------------------
// NAVBAR SHRINK ON SCROLL
// -------------------------------------------------------
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.padding = window.scrollY > 50 ? '0' : '';
  });
}

// -------------------------------------------------------
// STATS COUNTER ANIMATION
// Waits for DOM + theme-loader to finish setting data-target
// values before reading them, so saved stats always show.
// -------------------------------------------------------
function animateCounter(counter) {
  const target    = +counter.getAttribute('data-target');
  if (!target) return;
  const increment = target / 200;
  let current     = 0;

  const tick = () => {
    current += increment;
    if (current < target) {
      counter.innerText = Math.ceil(current);
      requestAnimationFrame(tick);
    } else {
      counter.innerText = target;
    }
  };
  tick();
}

function initCounters() {
  const counters     = document.querySelectorAll('.counter');
  const statsSection = document.querySelector('.stats');
  if (!statsSection || !counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Read data-target AFTER theme-loader has already set them
        counters.forEach(c => animateCounter(c));
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

// Defer until after all scripts (including theme-loader.js) have run
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCounters);
} else {
  // Already loaded — use setTimeout to ensure theme-loader IIFE has finished
  setTimeout(initCounters, 0);
}

// -------------------------------------------------------
// FEEDBACK FORM (placeholder — backend pending)
// -------------------------------------------------------
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedbackStatus = document.getElementById('feedbackStatus');
    if (feedbackStatus) {
      feedbackStatus.textContent = 'Thank you. Your feedback has been received privately by the administration.';
      feedbackStatus.style.color = '#14532d';
    }
    feedbackForm.reset();
  });
}