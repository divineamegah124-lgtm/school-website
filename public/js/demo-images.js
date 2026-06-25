// demo-images.js
// -------------------------------------------------------
// DEMO PLACEHOLDER IMAGES — for presentation purposes only.
// All images sourced from Unsplash (free, no account needed).
//
// TO DISABLE FOR A REAL SCHOOL:
//   1. Delete this file
//   2. Remove <script src="/js/demo-images.js"></script>
//      from every HTML page that includes it
//   Nothing else in the system is affected.
// -------------------------------------------------------

(function () {

  // -------------------------------------------------------
  // IMAGE LIBRARY
  // Grouped by page/purpose for easy swapping.
  // To change any image, replace the URL string only.
  // -------------------------------------------------------
  const DEMO = {

    // Homepage hero cover (fallback if no admin upload)
    homeCover: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80',

    // Homepage — no extra images needed beyond cover

    // Facilities grid — one image per facility card
    facilities: [
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80', // Library
      'https://images.unsplash.com/photo-1532094349884-543559c0be4e?w=800&q=80', // Science Lab
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', // Sports Field
      'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80', // Classroom
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', // Computer Lab
      'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&q=80', // Dining Hall
    ],

    // Facility detail scroll gallery
    facilityDetail: [
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
      'https://images.unsplash.com/photo-1532094349884-543559c0be4e?w=1200&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80',
    ],

    // Magazine grid
    magazine: [
      'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=800&q=80', // Sports day
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', // Graduation
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', // Computer class
      'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80', // Students
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', // School building
      'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&q=80', // Dining
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80', // Library
      'https://images.unsplash.com/photo-1532094349884-543559c0be4e?w=800&q=80', // Lab
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', // Field
    ],

    // Events — one image per event card (cycles if more events than images)
    events: [
      'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=800&q=80', // Sports
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', // Graduation
      'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80', // Students
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', // School
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', // Class
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', // Field
    ],

    // Staff directory — avatar fallback photos (cycles through list)
    staff: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', // Male 1
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', // Female 1
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', // Male 2
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', // Female 2
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', // Male 3
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80', // Female 3
    ],

  };

  // -------------------------------------------------------
  // HOMEPAGE — hero cover (only if no admin upload exists)
  // -------------------------------------------------------
  const adminCover = localStorage.getItem('school-cover');
  if (!adminCover) {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.backgroundImage    = `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('${DEMO.homeCover}')`;
      hero.style.backgroundSize     = 'cover';
      hero.style.backgroundPosition = 'center';
      hero.style.backgroundRepeat   = 'no-repeat';
    }
  }

  // -------------------------------------------------------
  // FACILITIES GRID
  // -------------------------------------------------------
  const facilityCards = document.querySelectorAll('.facility-card img');
  if (facilityCards.length) {
    facilityCards.forEach((img, i) => {
      if (!img.src || img.src.includes('placeholder')) {
        img.src = DEMO.facilities[i % DEMO.facilities.length];
      }
    });
  }

  // -------------------------------------------------------
  // FACILITY DETAIL — scroll gallery
  // -------------------------------------------------------
  const galleryPhotos = document.querySelectorAll('.gallery-photo');
  if (galleryPhotos.length) {
    galleryPhotos.forEach((img, i) => {
      if (!img.src || img.src.includes('placeholder')) {
        img.src = DEMO.facilityDetail[i % DEMO.facilityDetail.length];
      }
    });
  }

  // -------------------------------------------------------
  // MAGAZINE GRID
  // -------------------------------------------------------
  const magazineItems = document.querySelectorAll('.magazine-item img');
  if (magazineItems.length) {
    magazineItems.forEach((img, i) => {
      if (!img.src || img.src.includes('placeholder')) {
        img.src = DEMO.magazine[i % DEMO.magazine.length];
      }
    });
  }

  // -------------------------------------------------------
  // EVENTS — inject into event cards after they render
  // Events are dynamically rendered from localStorage, so we
  // use a MutationObserver to catch cards as they appear.
  // -------------------------------------------------------
  function applyEventImages() {
    const eventCards = document.querySelectorAll('.event-card-image');
    eventCards.forEach((img, i) => {
      if (!img.src || img.src.includes('placeholder') || !img.src.trim()) {
        img.src = DEMO.events[i % DEMO.events.length];
      }
    });
  }

  const eventsContainer = document.querySelector('.events-container');
  if (eventsContainer) {
    applyEventImages();
    const observer = new MutationObserver(applyEventImages);
    observer.observe(eventsContainer, { childList: true, subtree: true });
  }

  // -------------------------------------------------------
  // STAFF DIRECTORY — inject into avatar elements
  // Staff cards use initials divs by default. This converts
  // them to photo avatars for demo if no real photo exists.
  // Uses MutationObserver since staff renders dynamically.
  // -------------------------------------------------------
  function applyStaffImages() {
    const avatars = document.querySelectorAll('.staff-card-avatar');
    avatars.forEach((avatar, i) => {
      if (avatar.tagName === 'DIV' && !avatar.querySelector('img')) {
        const photoUrl = DEMO.staff[i % DEMO.staff.length];
        avatar.style.backgroundImage    = `url('${photoUrl}')`;
        avatar.style.backgroundSize     = 'cover';
        avatar.style.backgroundPosition = 'center';
        avatar.style.color              = 'transparent';
        avatar.style.fontSize           = '0';
      }
    });
  }

  const staffGrid = document.querySelector('.staff-grid');
  if (staffGrid) {
    applyStaffImages();
    const observer = new MutationObserver(applyStaffImages);
    observer.observe(staffGrid, { childList: true, subtree: true });
  }

})();