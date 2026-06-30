// about-page.js
// Populates the About page dynamically from backend API

(async function () {
  const API = window.API_BASE || 'https://school-website-backend-production.up.railway.app';
  const schoolId = window.SCHOOL_ID || 'demo';

  // -------------------------------------------------------
  // MISSION / VISION / HISTORY — fetch from settings API
  // -------------------------------------------------------
  try {
    const res = await fetch(`${API}/api/settings/${schoolId}`);
    if (res.ok) {
      const data = await res.json();

      const missionEl = document.getElementById('aboutMission');
      if (missionEl && data.mission) missionEl.textContent = data.mission;

      const visionEl = document.getElementById('aboutVision');
      if (visionEl && data.vision) visionEl.textContent = data.vision;

      const historyEl = document.getElementById('aboutHistory');
      if (historyEl && data.history) historyEl.textContent = data.history;
    }
  } catch (e) {
    console.error('Failed to load about page content', e);
  }

  // -------------------------------------------------------
  // LEADERSHIP GRID
  // -------------------------------------------------------
  const grid = document.getElementById('leadershipGrid');
  if (!grid) return;

  let leaders = [];
  try {
    leaders = await getLeadership();
  } catch {
    leaders = [];
  }

  const active = leaders.filter(l => l.name || l.role);

  if (active.length === 0) {
    grid.innerHTML = `
      <div class="leader-card">
        <img src="/images/staff-placeholder.png" alt="Headmaster" />
        <h3>Headmaster's Name</h3>
        <p>Headmaster</p>
      </div>
      <div class="leader-card">
        <img src="/images/staff-placeholder.png" alt="Assistant Headmaster" />
        <h3>Assistant Headmaster's Name</h3>
        <p>Assistant Headmaster</p>
      </div>
      <div class="leader-card">
        <img src="/images/staff-placeholder.png" alt="Head of Academics" />
        <h3>Head of Academics' Name</h3>
        <p>Head of Academics</p>
      </div>`;
    return;
  }

  grid.innerHTML = active.map(leader => `
    <div class="leader-card">
      <img
        src="${leader.photo || '/images/staff-placeholder.png'}"
        alt="${leader.role || 'Leader'}"
      />
      <h3>${leader.name || '—'}</h3>
      <p>${leader.role || '—'}</p>
    </div>
  `).join('');

})();