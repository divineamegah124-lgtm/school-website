// gallery.js
// Facility Detail: Cinematic crossfade scroll-driven gallery
// Smooth fade + directional slide between photos as user scrolls

document.addEventListener('DOMContentLoaded', () => {
  const photos = document.querySelectorAll('.gallery-photo');
  const gallerySection = document.getElementById('gallerySection');

  if (!photos.length || !gallerySection) return;

  const totalPhotos = photos.length;
  let currentIndex = 0;
  let isTransitioning = false;

  // Set initial state — first photo visible, rest hidden
  photos.forEach((photo, index) => {
    photo.style.transition = 'none';
    photo.style.opacity = index === 0 ? '1' : '0';
    photo.style.transform = index === 0 ? 'scale(1) translateX(0)' : 'scale(1.04) translateX(60px)';
    photo.style.position = 'absolute';
    photo.style.top = '0';
    photo.style.left = '0';
    photo.style.width = '100%';
    photo.style.height = '100%';
    photo.style.objectFit = 'cover';
    photo.style.willChange = 'opacity, transform';
  });

  // Transition to a new photo
  function transitionTo(newIndex) {
    if (newIndex === currentIndex || isTransitioning) return;
    if (newIndex < 0 || newIndex >= totalPhotos) return;

    isTransitioning = true;

    const outgoing = photos[currentIndex];
    const incoming = photos[newIndex];
    const direction = newIndex > currentIndex ? 1 : -1;

    // Position incoming photo off-screen in the scroll direction
    incoming.style.transition = 'none';
    incoming.style.opacity = '0';
    incoming.style.transform = `scale(1.04) translateX(${direction * 60}px)`;

    // Force reflow so transition starts from the above state
    incoming.offsetHeight;

    // Apply smooth transition to both
    const timing = 'cubic-bezier(0.4, 0, 0.2, 1)';
    outgoing.style.transition = `opacity 0.75s ${timing}, transform 0.75s ${timing}`;
    incoming.style.transition = `opacity 0.75s ${timing}, transform 0.75s ${timing}`;

    // Outgoing fades and slides away
    outgoing.style.opacity = '0';
    outgoing.style.transform = `scale(0.97) translateX(${direction * -40}px)`;

    // Incoming fades in and settles
    incoming.style.opacity = '1';
    incoming.style.transform = 'scale(1) translateX(0)';

    currentIndex = newIndex;

    setTimeout(() => {
      isTransitioning = false;
      // Reset outgoing photo to standby position
      outgoing.style.transition = 'none';
      outgoing.style.transform = `scale(1.04) translateX(${direction * 60}px)`;
    }, 780);
  }

  // Scroll handler — maps scroll progress to photo index
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        const sectionTop = gallerySection.offsetTop;
        const sectionHeight = gallerySection.offsetHeight - window.innerHeight;
        const scrollY = lastScrollY - sectionTop;

        let progress = scrollY / sectionHeight;
        progress = Math.max(0, Math.min(1, progress));

        const targetIndex = Math.min(
          totalPhotos - 1,
          Math.floor(progress * totalPhotos)
        );

        if (targetIndex !== currentIndex) {
          transitionTo(targetIndex);
        }

        ticking = false;
      });
      ticking = true;
    }
  });
});