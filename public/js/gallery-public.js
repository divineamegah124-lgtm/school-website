// ============================================
// DIVINE TECH VENTURE — Public Gallery
// /public/js/gallery-public.js
// ============================================

(function () {
  const API = window.API_BASE || 'https://school-website-backend-production.up.railway.app';
  const schoolId = window.SCHOOL_ID || 'demo';

  let images = [];
  let currentIndex = 0;

  async function loadGallery() {
    const grid = document.getElementById('publicGalleryGrid');
    const emptyState = document.getElementById('galleryEmptyState');
    if (!grid) return;

    try {
      const res = await fetch(`${API}/api/gallery?schoolId=${schoolId}`);
      const data = await res.json();
      images = Array.isArray(data) ? data : [];
    } catch {
      images = [];
    }

    if (!images.length) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    grid.innerHTML = '';

    images.forEach((img, i) => {
      const thumb = document.createElement('div');
      thumb.classList.add('gallery-thumb', 'reveal', 'scale-in', `delay-${Math.min((i % 6) + 1, 5)}`);
      thumb.innerHTML = `
        <img src="${img.url}" alt="${img.caption || 'Gallery image'}" loading="lazy" />
        <div class="gallery-thumb-overlay">
          <svg viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        </div>
        ${img.caption ? `<div class="gallery-thumb-caption">${img.caption}</div>` : ''}
        ${img.showInHero ? '<div class="gallery-hero-badge">Hero</div>' : ''}
      `;
      thumb.addEventListener('click', () => openLightbox(i));
      grid.appendChild(thumb);
    });

    // Re-trigger scroll animations
    if (window.triggerReveal) window.triggerReveal();
    buildLbDots();
  }

  function buildLbDots() {
    const dotsEl = document.getElementById('galleryLbDots');
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    images.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    });
  }

  function updateLbDots() {
    const dots = document.querySelectorAll('#galleryLbDots span');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  function openLightbox(index) {
    currentIndex = index;
    const lb = document.getElementById('galleryLightbox');
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    setLbImage(currentIndex);
    updateLbDots();
  }

  function closeLightbox() {
    document.getElementById('galleryLightbox').classList.remove('active');
    document.body.style.overflow = '';
  }

  function setLbImage(index) {
    const img = document.getElementById('galleryLbImg');
    const caption = document.getElementById('galleryLbCaption');
    const counter = document.getElementById('galleryLbCounter');
    img.src = images[index].url;
    img.alt = images[index].caption || '';
    caption.textContent = images[index].caption || '';
    counter.textContent = `${index + 1} / ${images.length}`;
    img.classList.remove('sliding-out-left', 'sliding-out-right');
    img.classList.add('sliding-in');
    updateLbDots();
  }

  function goTo(index, direction = 'right') {
    const img = document.getElementById('galleryLbImg');
    img.classList.remove('sliding-in');
    img.classList.add(direction === 'right' ? 'sliding-out-left' : 'sliding-out-right');
    setTimeout(() => {
      currentIndex = (index + images.length) % images.length;
      setLbImage(currentIndex);
    }, 350);
  }

  // Controls
  document.getElementById('galleryLbClose')?.addEventListener('click', closeLightbox);
  document.getElementById('galleryLbNext')?.addEventListener('click', () => goTo(currentIndex + 1, 'right'));
  document.getElementById('galleryLbPrev')?.addEventListener('click', () => goTo(currentIndex - 1, 'left'));

  // Keyboard
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('galleryLightbox');
    if (!lb?.classList.contains('active')) return;
    if (e.key === 'ArrowRight') goTo(currentIndex + 1, 'right');
    if (e.key === 'ArrowLeft') goTo(currentIndex - 1, 'left');
    if (e.key === 'Escape') closeLightbox();
  });

  // Touch swipe in lightbox
  let touchStartX = 0;
  document.getElementById('galleryLightbox')?.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  document.getElementById('galleryLightbox')?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(currentIndex + 1, 'right') : goTo(currentIndex - 1, 'left');
    }
  }, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGallery);
  } else {
    loadGallery();
  }
})();