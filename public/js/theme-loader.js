// theme-loader.js
// Runs on every public page — fetches school settings from backend,
// falls back to localStorage if unavailable.

(function () {

  // -------------------------------------------------------
  // DARK MODE — applied immediately to avoid flash
  // -------------------------------------------------------
  const savedDark = localStorage.getItem('appearance-dark-mode') === 'true';
  if (savedDark) document.body.classList.add('dark-mode');

  // -------------------------------------------------------
  // DARK MODE TOGGLE
  // -------------------------------------------------------
  function moonIcon() {
    return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
    </svg>`;
  }

  function sunIcon() {
    return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"  stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="21" x2="12" y2="23" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      <line x1="1"  y1="12" x2="3"  y2="12" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      <line x1="21" y1="12" x2="23" y2="12" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  }

  function buildDarkToggle() {
    if (document.querySelector('.dark-mode-toggle')) return;
    const btn = document.createElement('button');
    btn.className = 'dark-mode-toggle';
    btn.title     = 'Toggle dark / light mode';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.innerHTML = document.body.classList.contains('dark-mode') ? sunIcon() : moonIcon();
    btn.addEventListener('click', () => {
      const nowDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('appearance-dark-mode', nowDark);
      btn.innerHTML = nowDark ? sunIcon() : moonIcon();
    });
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildDarkToggle);
  } else {
    buildDarkToggle();
  }

  // -------------------------------------------------------
  // APPLY SETTINGS TO PAGE
  // -------------------------------------------------------
  function applySettings(s) {

    // Theme colors
    const primary = localStorage.getItem('theme-primary');
    const accent  = localStorage.getItem('theme-accent');
    if (primary) document.documentElement.style.setProperty('--theme-primary', primary);
    if (accent)  document.documentElement.style.setProperty('--theme-accent', accent);

    // Logo
    if (s.logo) {
      const logoImg = document.querySelector('.logo img');
      if (logoImg) logoImg.src = s.logo;
    }

    // School name
    if (s.name) {
      const navName    = document.querySelector('.school-name');
      const footerName = document.querySelector('.footer-col h3');
      if (navName)    navName.textContent    = s.name;
      if (footerName) footerName.textContent = s.name;
      const titleParts    = document.title.split(' - ');
      const pageTitlePart = titleParts.length > 1 ? titleParts[0].trim() : null;
      document.title = pageTitlePart ? `${pageTitlePart} - ${s.name}` : s.name;
      const footerBottom = document.querySelector('.footer-bottom p');
      if (footerBottom) {
        footerBottom.textContent = `© ${new Date().getFullYear()} ${s.name}. All rights reserved.`;
      }
    }

    // Welcome headline
    if (s.welcomeHeadline) {
      const heroH1 = document.querySelector('.hero-content h1');
      if (heroH1) heroH1.textContent = s.welcomeHeadline;
    }

    // Motto
    if (s.motto) {
      const heroSub = document.querySelector('.hero-content p');
      if (heroSub) heroSub.textContent = s.motto;
    }

    // Footer contact details
    const footerCol = document.querySelector('.footer-col');
    if (footerCol) {
      const paras = footerCol.querySelectorAll('p');
      if (s.address && paras[0]) paras[0].textContent = 'Address: ' + s.address;
      if (s.phone   && paras[1]) paras[1].textContent = 'Phone: '   + s.phone;
      if (s.email   && paras[2]) paras[2].textContent = 'Email: '   + s.email;
    }

    // Contact page details
    const contactDetailsList = document.querySelector('.contact-details');
    if (contactDetailsList) {
      const items = contactDetailsList.querySelectorAll('li');
      const officeHours = localStorage.getItem('school-office-hours');
      if (items.length >= 4) {
        if (s.address)   items[0].innerHTML = `<strong>Address:</strong> ${s.address}`;
        if (s.phone)     items[1].innerHTML = `<strong>Phone:</strong> ${s.phone}`;
        if (s.email)     items[2].innerHTML = `<strong>Email:</strong> ${s.email}`;
        if (officeHours) items[3].innerHTML = `<strong>Office Hours:</strong> ${officeHours}`;
      }
    }

    const directionsLink = document.querySelector('.directions-link');
    if (directionsLink && s.address) {
      directionsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`;
    }

    // Cover photo
    if (s.coverPhoto) {
      const heroSlide = document.getElementById('heroMainSlide');
      if (heroSlide) {
        heroSlide.style.backgroundImage    = `url('${s.coverPhoto}')`;
        heroSlide.style.backgroundSize     = 'cover';
        heroSlide.style.backgroundPosition = 'center';
        heroSlide.style.backgroundRepeat   = 'no-repeat';
      }
    }

    // Page header images (still from localStorage — not in DB yet)
    const pageHeaderMap = [
      { key: 'school-header-about',      path: '/about.html' },
      { key: 'school-header-admissions', path: '/admissions.html' },
      { key: 'school-header-facilities', path: '/facilities.html' },
      { key: 'school-header-facility',   path: '/facility-detail.html' },
      { key: 'school-header-contact',    path: '/contact.html' },
      { key: 'school-header-feedback',   path: '/feedback.html' },
      { key: 'school-header-events',     path: '/events.html' },
      { key: 'school-header-staff',      path: '/staff.html' },
      { key: 'school-header-downloads',  path: '/downloads.html' },
    ];

    const currentPath = window.location.pathname;
    const pageHeader  = document.querySelector('.page-header');
    if (pageHeader) {
      const match = pageHeaderMap.find(p => currentPath.endsWith(p.path));
      if (match) {
        const headerImg = localStorage.getItem(match.key);
        if (headerImg) {
          pageHeader.style.backgroundImage    = `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${headerImg}')`;
          pageHeader.style.backgroundSize     = 'cover';
          pageHeader.style.backgroundPosition = 'center';
          pageHeader.style.backgroundRepeat   = 'no-repeat';
          pageHeader.style.color              = '#fff';
        }
      }
    }

    // Stats
    const counters = document.querySelectorAll('.counter');
    if (counters.length >= 3) {
      if (s.students)        counters[0].setAttribute('data-target', s.students);
      if (s.staffCount)      counters[1].setAttribute('data-target', s.staffCount);
      if (s.yearEstablished) {
        counters[2].setAttribute('data-target',
          new Date().getFullYear() - parseInt(s.yearEstablished));
      }
    }

    // Social media links
    const footerCols = document.querySelectorAll('.footer-col');
    if (footerCols.length >= 3) {
      const socialLinks = footerCols[2].querySelectorAll('a');
      const map = [s.facebook, s.twitter, s.instagram, s.youtube];
      socialLinks.forEach((a, i) => { if (map[i]) a.href = map[i]; });
    }

    // Dynamic footer quick links
    const quickLinks = [
      { label: 'About Us',                  href: '/about.html' },
      { label: 'Admissions',                href: '/admissions.html' },
      { label: 'Contact',                   href: '/contact.html' },
      { label: 'Student & Parent Feedback', href: '/feedback.html' },
      { label: 'Events',                    href: '/events.html' },
      { label: 'Staff Directory',           href: '/staff.html' },
      { label: 'Notices & Downloads',       href: '/downloads.html' },
    ];

    if (footerCols.length >= 2) {
      const quickLinksCol = footerCols[1];
      const heading       = quickLinksCol.querySelector('h3');
      quickLinksCol.innerHTML = '';
      if (heading) quickLinksCol.appendChild(heading);
      quickLinks.forEach(link => {
        const a       = document.createElement('a');
        a.href        = link.href;
        a.textContent = link.label;
        quickLinksCol.appendChild(a);
      });
    }

    // Programmes footer column
    const programmes    = localStorage.getItem('school-programmes');
    const programmesCol = document.getElementById('footerProgrammesCol');
    if (programmes && programmesCol) {
      const list = programmes.split(',').map(p => p.trim()).filter(Boolean);
      if (list.length > 0) {
        programmesCol.style.display = 'block';
        const grid = document.createElement('div');
        grid.style.cssText = `
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 12px;
          margin-top: 4px;
        `;
        list.forEach(prog => {
          const span = document.createElement('span');
          span.textContent = prog;
          span.style.cssText = `
            font-size: 0.82rem;
            color: #d1d5db;
            line-height: 1.8;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          `;
          grid.appendChild(span);
        });
        const heading = programmesCol.querySelector('h3');
        programmesCol.innerHTML = '';
        if (heading) programmesCol.appendChild(heading);
        programmesCol.appendChild(grid);
      }
    }

    // SEO meta tags
    function setMetaTag(attr, key, content) {
      if (!content) return;
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    }

    const metaDescription = s.motto
      ? s.motto
      : (s.name ? `${s.name} — quality education in Ghana.` : null);

    setMetaTag('name',     'description',    metaDescription);
    setMetaTag('property', 'og:title',       document.title);
    setMetaTag('property', 'og:description', metaDescription);
    setMetaTag('property', 'og:type',        'website');
    setMetaTag('name',     'twitter:card',   'summary_large_image');
    if (s.logo) setMetaTag('property', 'og:image', s.logo);
  }

  // -------------------------------------------------------
  // FETCH FROM BACKEND, FALL BACK TO LOCALSTORAGE
  // -------------------------------------------------------
  const schoolId  = (window.SCHOOL_ID) || 'PRESEC';
  const apiBase   = (window.API_BASE)  || 'https://school-website-backend-production.up.railway.app';

  fetch(`${apiBase}/api/settings/${schoolId}`)
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      if (data && data.schoolId) {
        applySettings(data);
      } else {
        applySettingsFromLocalStorage();
      }
    })
    .catch(() => {
      applySettingsFromLocalStorage();
    });

  function applySettingsFromLocalStorage() {
    applySettings({
      name:             localStorage.getItem('school-name'),
      motto:            localStorage.getItem('school-motto'),
      welcomeHeadline:  localStorage.getItem('school-welcome-headline'),
      address:          localStorage.getItem('school-address'),
      phone:            localStorage.getItem('school-phone'),
      email:            localStorage.getItem('school-email'),
      logo:             localStorage.getItem('school-logo'),
      coverPhoto:       localStorage.getItem('school-cover'),
      students:         localStorage.getItem('school-students'),
      staffCount:       localStorage.getItem('school-staff'),
      yearEstablished:  localStorage.getItem('school-year-established'),
      facebook:         localStorage.getItem('school-facebook'),
      twitter:          localStorage.getItem('school-twitter'),
      instagram:        localStorage.getItem('school-instagram'),
      youtube:          localStorage.getItem('school-youtube'),
    });
  }

})();