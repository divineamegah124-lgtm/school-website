// facilities-page.js
// Loads facilities dynamically from backend API

(async function () {
  const API = window.API_BASE || 'https://school-website-backend-production.up.railway.app';
  const schoolId = window.SCHOOL_ID || 'demo';

  const grid = document.getElementById('facilitiesGrid');
  if (!grid) return;

  try {
    const res = await fetch(`${API}/api/facilities/${schoolId}`);
    const facilities = await res.json();

    if (!Array.isArray(facilities) || facilities.length === 0) {
      return; // leave the "No facilities added yet" message showing
    }

    grid.innerHTML = facilities.map(f => `
      <a href="/facility-detail.html?id=${f.id}" class="facility-card">
        <img src="${f.coverImage || '/images/facility-placeholder.png'}" alt="${f.name}" />
        <div class="facility-overlay">
          <h3>${f.name}</h3>
        </div>
      </a>
    `).join('');

  } catch (e) {
    console.error('Failed to load facilities', e);
  }
})();