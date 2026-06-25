// about-page.js
// Populates the About page dynamically from backend API with localStorage fallback

(async function () {

  // -------------------------------------------------------
  // MISSION
  // -------------------------------------------------------
  const mission = localStorage.getItem('school-mission');
  const missionEl = document.getElementById('aboutMission');
  if (mission && missionEl) missionEl.textContent = mission;

  // -------------------------------------------------------
  // VISION
  // -------------------------------------------------------
  const vision = localStorage.getItem('school-vision');
  const visionEl = document.getElementById('aboutVision');
  if (vision && visionEl) visionEl.textContent = vision;

  // -------------------------------------------------------
  // HISTORY
  // -------------------------------------------------------
  const history = localStorage.getItem('school-history');
  const historyEl = document.getElementById('aboutHistory');
  if (history && historyEl) historyEl.textContent = history;

  // -------------------------------------------------------
  // LEADERSHIP GRID
  // -------------------------------------------------------
  const grid = document.getElementById('leadershipGrid');
  if (!grid) return;

  let leaders = [];
  try {
    leaders = await getLeadership();
  } catch {
    const stored = localStorage.getItem('school-leadership');
    leaders = stored ? JSON.parse(stored) : [];
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