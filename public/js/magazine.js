// magazine.js
// Magazine page: filter logic + lightbox for images and YouTube videos

document.addEventListener('DOMContentLoaded', () => {

  const yearFilter = document.getElementById('yearFilter');
  const eventFilter = document.getElementById('eventFilter');
  const searchFilter = document.getElementById('searchFilter');
  const items = document.querySelectorAll('.magazine-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxVideoWrapper = document.getElementById('lightboxVideoWrapper');
  const lightboxIframe = document.getElementById('lightboxIframe');

  // --- FILTER LOGIC ---
  function applyFilters() {
    const year = yearFilter ? yearFilter.value : 'all';
    const event = eventFilter ? eventFilter.value : 'all';
    const search = searchFilter ? searchFilter.value.toLowerCase().trim() : '';

    items.forEach(item => {
      const itemYear = item.getAttribute('data-year');
      const itemEvent = item.getAttribute('data-event');
      const itemTitle = item.querySelector('h3')
        ? item.querySelector('h3').textContent.toLowerCase()
        : '';

      const matchYear = year === 'all' || itemYear === year;
      const matchEvent = event === 'all' || itemEvent === event;
      const matchSearch = search === '' || itemTitle.includes(search);

      if (matchYear && matchEvent && matchSearch) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  if (yearFilter) yearFilter.addEventListener('change', applyFilters);
  if (eventFilter) eventFilter.addEventListener('change', applyFilters);
  if (searchFilter) searchFilter.addEventListener('input', applyFilters);

  // --- LIGHTBOX LOGIC ---
  function openLightbox(type, src) {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (type === 'video') {
      // Show video iframe, hide image
      lightboxImage.style.display = 'none';
      lightboxVideoWrapper.style.display = 'flex';
      // Append autoplay to YouTube URL
      lightboxIframe.src = src + '?autoplay=1&rel=0';
    } else {
      // Show image, hide video
      lightboxVideoWrapper.style.display = 'none';
      lightboxImage.style.display = 'block';
      lightboxImage.src = src;
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Stop video by clearing iframe src
    lightboxIframe.src = '';
    lightboxImage.src = '';
  }

  // Click each magazine item to open lightbox
  items.forEach(item => {
    item.addEventListener('click', () => {
      const type = item.getAttribute('data-type') || 'image';
      const src = item.getAttribute('data-src');
      if (src) openLightbox(type, src);
    });
  });

  // Close lightbox
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

});