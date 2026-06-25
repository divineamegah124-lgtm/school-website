// theme-loader.js
// Runs on every public page — applies saved logo, theme colors,
// school info, cover photo, stats, dynamic footer quick links,
// programmes footer column, SEO meta tags, page header images,
// and dark mode toggle.

(function () {

  // -------------------------------------------------------
  // DARK MODE — applied immediately to avoid flash
  // -------------------------------------------------------
  const savedDark = localStorage.getItem('appearance-dark-mode') === 'true';
  if (savedDark) document.body.classList.add('dark-mode');

  // -------------------------------------------------------
  // THEME COLORS
  // -------------------------------------------------------
  const primary = localStorage.getItem('theme-primary');
  const accent  = localStorage.getItem('theme-accent');
  if (primary) document.documentElement.style.setProperty('--theme-primary', primary);
  if (accent)  document.documentElement.style.setProperty('--theme-accent', accent);

  // -------------------------------------------------------
  // LOGO
  // -------------------------------------------------------
  const logoData = localStorage.getItem('school-logo');
  const logoImg  = document.querySelector('.logo img');
  if (logoData && logoImg) logoImg.src = logoData;

  // -------------------------------------------------------
  // SCHOOL NAME
  // -------------------------------------------------------
  const schoolName    = localStorage.getItem('school-name');
  const titleParts    = document.title.split(' - ');
  const pageTitlePart = titleParts.length > 1 ? titleParts[0].trim() : null;

  if (schoolName) {
    const navName    = document.querySelector('.school-name');
    const footerName = document.querySelector('.footer-col h3');
    if (navName)    navName.textContent    = schoolName;
    if (footerName) footerName.textContent = schoolName;
    document.title = pageTitlePart ? `${pageTitlePart} - ${schoolName}` : schoolName;

    const footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) {
      footerBottom.textContent = `© ${new Date().getFullYear()} ${schoolName}. All rights reserved.`;
    }
  }

  // -------------------------------------------------------
  // WELCOME HEADLINE
  // -------------------------------------------------------
  const welcomeHeadline = localStorage.getItem('school-welcome-headline');
  if (welcomeHeadline) {
    const heroH1 = document.querySelector('.hero-content h1');
    if (heroH1) heroH1.textContent = welcomeHeadline;
  }

  // -------------------------------------------------------
  // SCHOOL MOTTO
  // -------------------------------------------------------
  const schoolMotto = localStorage.getItem('school-motto');
  if (schoolMotto) {
    const heroSub = document.querySelector('.hero-content p');
    if (heroSub) heroSub.textContent = schoolMotto;
  }

  // -------------------------------------------------------
  // FOOTER CONTACT DETAILS (col 1)
  // -------------------------------------------------------
  const address   = localStorage.getItem('school-address');
  const phone     = localStorage.getItem('school-phone');
  const email     = localStorage.getItem('school-email');
  const footerCol = document.querySelector('.footer-col');
  if (footerCol) {
    const paras = footerCol.querySelectorAll('p');
    if (address && paras[0]) paras[0].textContent = 'Address: ' + address;
    if (phone   && paras[1]) paras[1].textContent = 'Phone: '   + phone;
    if (email   && paras[2]) paras[2].textContent = 'Email: '   + email;
  }

  // -------------------------------------------------------
  // CONTACT PAGE DETAILS
  // -------------------------------------------------------
  const officeHours        = localStorage.getItem('school-office-hours');
  const contactDetailsList = document.querySelector('.contact-details');
  if (contactDetailsList) {
    const items = contactDetailsList.querySelectorAll('li');
    if (items.length >= 4) {
      if (address)     items[0].innerHTML = `<strong>Address:</strong> ${address}`;
      if (phone)       items[1].innerHTML = `<strong>Phone:</strong> ${phone}`;
      if (email)       items[2].innerHTML = `<strong>Email:</strong> ${email}`;
      if (officeHours) items[3].innerHTML = `<strong>Office Hours:</strong> ${officeHours}`;
    }
  }

  const directionsLink = document.querySelector('.directions-link');
  if (directionsLink && address) {
    directionsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  // -------------------------------------------------------
  // HERO COVER PHOTO
  // -------------------------------------------------------
  const coverPhoto  = localStorage.getItem('school-cover');
  const heroSection = document.querySelector('.hero');
  if (coverPhoto && heroSection) {
    heroSection.style.backgroundImage    = `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('${coverPhoto}')`;
    heroSection.style.backgroundSize     = 'cover';
    heroSection.style.backgroundPosition = 'center';
    heroSection.style.backgroundRepeat   = 'no-repeat';
  }

  // -------------------------------------------------------
  // PAGE HEADER IMAGES
  // -------------------------------------------------------
  const pageHeaderMap = [
    { key: 'school-header-about',      path: '/about.html' },
    { key: 'school-header-admissions', path: '/admissions.html' },
    { key: 'school-header-facilities', path: '/facilities.html' },
    { key: 'school-header-facility',   path: '/facility-detail.html' },
    { key: 'school-header-magazine',   path: '/magazine.html' },
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

  // -------------------------------------------------------
  // SCHOOL STATS
  // -------------------------------------------------------
  const students        = localStorage.getItem('school-students');
  const staff           = localStorage.getItem('school-staff');
  const yearEstablished = localStorage.getItem('school-year-established');
  const counters        = document.querySelectorAll('.counter');
  if (counters.length >= 3) {
    if (students)        counters[0].setAttribute('data-target', students);
    if (staff)           counters[1].setAttribute('data-target', staff);
    if (yearEstablished) {
      counters[2].setAttribute('data-target',
        new Date().getFullYear() - parseInt(yearEstablished));
    }
  }

  // -------------------------------------------------------
  // DYNAMIC FOOTER QUICK LINKS (col 2)
  // -------------------------------------------------------
  const quickLinks = [
    { label: 'About Us',                  href: '/about.html' },
    { label: 'Admissions',                href: '/admissions.html' },
    { label: 'Contact',                   href: '/contact.html' },
    { label: 'Student & Parent Feedback', href: '/feedback.html' },
    { label: 'Events',                    href: '/events.html' },
    { label: 'Staff Directory',           href: '/staff.html' },
    { label: 'Notices & Downloads',       href: '/downloads.html' },
  ];

  const footerCols = document.querySelectorAll('.footer-col');
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

  // -------------------------------------------------------
  // SOCIAL MEDIA LINKS (col 3)
  // -------------------------------------------------------
  const facebook  = localStorage.getItem('school-facebook');
  const twitter   = localStorage.getItem('school-twitter');
  const instagram = localStorage.getItem('school-instagram');
  const youtube   = localStorage.getItem('school-youtube');

  if (footerCols.length >= 3) {
    const socialLinks = footerCols[2].querySelectorAll('a');
    const map = [facebook, twitter, instagram, youtube];
    socialLinks.forEach((a, i) => { if (map[i]) a.href = map[i]; });
  }

  // -------------------------------------------------------
  // PROGRAMMES FOOTER COLUMN (col 4)
  // Reads 'school-programmes', splits by comma, renders in
  // two columns inside the footer col using CSS grid.
  // Only shows if programmes are saved.
  // -------------------------------------------------------
  const programmes    = localStorage.getItem('school-programmes');
  const programmesCol = document.getElementById('footerProgrammesCol');

  if (programmes && programmesCol) {
    const list = programmes.split(',').map(p => p.trim()).filter(Boolean);
    if (list.length > 0) {
      programmesCol.style.display = 'block';

      // Build two-column grid of programme names
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

      // Clear old content except heading
      const heading = programmesCol.querySelector('h3');
      programmesCol.innerHTML = '';
      if (heading) programmesCol.appendChild(heading);
      programmesCol.appendChild(grid);
    }
  }

  // -------------------------------------------------------
  // SEO META TAGS
  // -------------------------------------------------------
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

  const metaDescription = schoolMotto
    ? schoolMotto
    : (schoolName ? `${schoolName} — quality education in Ghana.` : null);

  setMetaTag('name',     'description',    metaDescription);
  setMetaTag('property', 'og:title',       document.title);
  setMetaTag('property', 'og:description', metaDescription);
  setMetaTag('property', 'og:type',        'website');
  setMetaTag('name',     'twitter:card',   'summary_large_image');
  if (logoData) setMetaTag('property', 'og:image', logoData);

  // -------------------------------------------------------
  // DARK MODE TOGGLE — fixed bottom-right, moon/sun icon
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

})();