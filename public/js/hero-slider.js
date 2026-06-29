// ============================================
// DIVINE TECH VENTURE — Hero Slider v2
// /public/js/hero-slider.js
// ============================================

(function () {
  const INTERVAL = 2500;
  const API = window.API_BASE || 'https://school-website-backend-production.up.railway.app';
  const schoolId = window.SCHOOL_ID || 'demo';

  async function fetchGalleryImages() {
    try {
      const res = await fetch(`${API}/api/gallery?schoolId=${schoolId}&heroOnly=false`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function buildSlideSequence(coverUrl, galleryImages) {
    // Pattern: Cover → img1 → img2 → Cover → img3 → img4 → repeat
    const sequence = [];
    let i = 0;
    const cover = { url: coverUrl, isCover: true };

    if (!galleryImages.length) return [cover];

    while (i < galleryImages.length) {
      sequence.push(cover);
      sequence.push({ url: galleryImages[i].url, isCover: false, caption: galleryImages[i].caption });
      if (galleryImages[i + 1]) {
        sequence.push({ url: galleryImages[i + 1].url, isCover: false, caption: galleryImages[i + 1].caption });
      }
      i += 2;
    }
    sequence.push(cover); // end with cover
    return sequence;
  }

  function renderSlides(sequence, slider) {
    const container = slider.querySelector('.hero-slides');
    container.innerHTML = '';
    sequence.forEach((slide, i) => {
      const div = document.createElement('div');
      div.classList.add('hero-slide');
      if (i === 0) div.classList.add('active');
      div.style.backgroundImage = `url('${slide.url}')`;
      if (slide.caption) {
        const cap = document.createElement('div');
        cap.classList.add('hero-slide-caption');
        cap.textContent = slide.caption;
        div.appendChild(cap);
      }
      container.appendChild(div);
    });
  }

  function initSlider(sequence) {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    renderSlides(sequence, slider);

    const slides = slider.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('heroDots');
    dotsContainer.innerHTML = '';

    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('hero-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => { goTo(i); clearInterval(timer); startAuto(); });
      dotsContainer.appendChild(dot);
    });

    // Progress bar
    let progress = slider.querySelector('.hero-progress');
    if (!progress) {
      progress = document.createElement('div');
      progress.classList.add('hero-progress');
      slider.appendChild(progress);
    }

    let current = 0;
    let timer = null;

    function goTo(index) {
      slides[current].classList.remove('active');
      slides[current].classList.add('exit');
      dotsContainer.querySelectorAll('.hero-dot')[current].classList.remove('active');
      setTimeout(() => {
        slides[current].classList.remove('exit');
        current = index;
        slides[current].classList.add('active');
        dotsContainer.querySelectorAll('.hero-dot')[current].classList.add('active');
        startProgress();
      }, 400);
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    function startProgress() {
      progress.style.transition = 'none';
      progress.style.width = '0%';
      setTimeout(() => {
        progress.style.transition = `width ${INTERVAL}ms linear`;
        progress.style.width = '100%';
      }, 30);
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(next, INTERVAL);
    }

    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', () => { startAuto(); startProgress(); });

    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : goTo((current - 1 + slides.length) % slides.length);
        clearInterval(timer); startAuto();
      }
    }, { passive: true });

    startProgress();
    startAuto();
  }

  async function init() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    const coverSlide = slider.querySelector('.hero-slide.cover');
    const coverUrl = coverSlide
      ? coverSlide.style.backgroundImage.slice(5, -2)
      : '/images/hero1.jpg';

    const gallery = await fetchGalleryImages();
    const sequence = buildSlideSequence(coverUrl, gallery);
    initSlider(sequence);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();