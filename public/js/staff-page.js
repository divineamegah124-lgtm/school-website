// staff-page.js
// Loads and displays all school staff from backend API with localStorage fallback

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('staffGrid');
  const emptyState = document.getElementById('staffEmpty');
  const filterSelect = document.getElementById('staffDepartmentFilter');
  let allStaff = [];

  // Load staff from backend
  try {
    allStaff = await getStaff();
  } catch {
    const stored = localStorage.getItem('school-staff-directory');
    allStaff = stored ? JSON.parse(stored) : [];
  }

  // Render staff cards
  function renderStaff(filterDept = '') {
    let filteredStaff = allStaff;
    if (filterDept) {
      filteredStaff = allStaff.filter(s => s.department === filterDept);
    }

    if (filteredStaff.length === 0) {
      grid.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    grid.innerHTML = filteredStaff.map(staff => `
      <div class="staff-card">
        <div class="staff-card-avatar">${staff.name.charAt(0).toUpperCase()}</div>
        <div class="staff-card-content">
          <h3 class="staff-card-name">${staff.name}</h3>
          <p class="staff-card-role">${staff.role}</p>
          <span class="staff-card-dept">${staff.department || ''}</span>
        </div>
      </div>
    `).join('');
  }

  // Handle department filter
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      renderStaff(e.target.value);
    });
  }

  renderStaff();
});