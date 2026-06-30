// ============================================
// DIVINE TECH VENTURE — Site Loader
// Fills in school-specific data dynamically
// /public/js/site-loader.js
// ============================================

(function () {
  const API = window.API_BASE || 'https://school-website-backend-production.up.railway.app';
  const schoolId = window.SCHOOL_ID || 'demo';

  async function loadSiteSettings() {
    try {
      const res = await fetch(`${API}/api/settings/${schoolId}`);
      if (!res.ok) return;
      const data = await res.json();
      applySettings(data);
    } catch (e) {
      console.error('Failed to load site settings', e);
    }
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  function setAttr(id, attr, value) {
    const el = document.getElementById(id);
    if (el && value) el.setAttribute(attr, value);
  }

  function applySettings(data) {
    // Page title
    if (data.name) {
  const titleEl = document.getElementById('pageTitle');
  const currentTitle = titleEl ? titleEl.textContent : document.title;
  const pageLabel = currentTitle.includes(' - ') ? currentTitle.split(' - ')[0] : '';
  document.title = pageLabel ? `${pageLabel} - ${data.name}` : data.name;
}

    // Navbar
    setText('navSchoolName', data.name);
    setAttr('navLogo', 'src', data.logo);

    // Hero
    setText('heroHeadline', data.welcomeHeadline || `Welcome to ${data.name}`);
    setText('heroSubtext', data.motto);

    // Stats
    setStatIfExists('statStudents', data.students);
    setStatIfExists('statStaff', data.staffCount);
    if (data.yearEstablished) {
      const years = new Date().getFullYear() - parseInt(data.yearEstablished);
      setStatIfExists('statYears', years);
    }

    // Footer
    setText('footerSchoolName', data.name);
    if (data.address) setText('footerAddress', `Address: ${data.address}`);
    if (data.phone) setText('footerPhone', `Phone: ${data.phone}`);
    if (data.email) setText('footerEmail', `Email: ${data.email}`);
    setText('footerCopyright', `© ${new Date().getFullYear()} ${data.name || ''}. All rights reserved.`);

    // Social links
    setAttr('socialFacebook', 'href', data.facebook);
    setAttr('socialTwitter', 'href', data.twitter);
    setAttr('socialInstagram', 'href', data.instagram);
    setAttr('socialYoutube', 'href', data.youtube);
  }

  function setStatIfExists(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) {
      el.setAttribute('data-target', value);
      el.textContent = '0'; // counter animation script will animate up to this
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSiteSettings);
  } else {
    loadSiteSettings();
  }
})();