// downloads-page.js
// Loads announcements + notices/documents from backend API with localStorage fallback

document.addEventListener('DOMContentLoaded', async () => {

  // =============================================
  // SECTION 1 — ANNOUNCEMENTS
  // =============================================
  const announcementsSection = document.getElementById('announcementsSection');

  if (announcementsSection) {
    let announcements = [];
    try {
      announcements = await getAnnouncements();
    } catch {
      const stored = localStorage.getItem('school-announcements');
      announcements = stored ? JSON.parse(stored) : [];
    }

    if (announcements.length === 0) {
      announcementsSection.innerHTML =
        '<p style="color:#9ca3af; font-size:0.95rem;">No announcements yet.</p>';
    } else {
      announcementsSection.innerHTML = announcements.map(ann => {
        const date = ann.date
          ? new Date(ann.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })
          : '';
        return `
          <div class="announcement-card">
            <div class="announcement-card-header">
              <h3>${ann.title}</h3>
              <span class="announcement-card-date">${date}</span>
            </div>
            <p>${ann.content || ''}</p>
          </div>
        `;
      }).join('');
    }
  }

  // =============================================
  // SECTION 2 — DOCUMENTS / NOTICES
  // =============================================
  const downloadsGrid = document.getElementById('downloadsGrid');
  const downloadsFilter = document.getElementById('downloadsFilter');

  if (!downloadsGrid) return;

  let notices = [];
  try {
    notices = await getNotices();
  } catch {
    const stored = localStorage.getItem('school-notices');
    notices = stored ? JSON.parse(stored) : [];
  }

  const categoryColors = {
    'Timetable':  { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    'Results':    { bg: '#f0fdf4', color: '#16a34a', border: '#86efac' },
    'Forms':      { bg: '#fefce8', color: '#b45309', border: '#fde68a' },
    'Prospectus': { bg: '#faf5ff', color: '#7c3aed', border: '#ddd6fe' },
    'Circular':   { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
    'Other':      { bg: '#f9fafb', color: '#374151', border: '#d1d5db' },
  };

  function renderDownloads(filterCategory = 'all') {
    const filtered = filterCategory === 'all'
      ? notices
      : notices.filter(n => n.category === filterCategory);

    if (filtered.length === 0) {
      downloadsGrid.innerHTML = `
        <p style="color:#9ca3af; font-size:0.95rem;">
          No documents available${filterCategory !== 'all' ? ' in this category' : ''} yet.
        </p>`;
      return;
    }

    downloadsGrid.innerHTML = filtered.map(notice => {
      const colors = categoryColors[notice.category] || categoryColors['Other'];
      const isPDF = notice.fileType === 'application/pdf';
      const icon = isPDF ? '📄' : '🖼';
      const date = notice.createdAt
        ? new Date(notice.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })
        : '';

      return `
        <div class="download-card">
          <div class="download-card-icon">${icon}</div>
          <div class="download-card-info">
            <span class="download-category-badge"
              style="background:${colors.bg}; color:${colors.color};
              border:1px solid ${colors.border};">
              ${notice.category || 'Other'}
            </span>
            <h3>${notice.title}</h3>
            <p>${notice.description || ''}</p>
            <span class="download-date">Published: ${date}</span>
          </div>
          ${notice.fileData ? `
          <a class="download-btn btn-primary"
            href="${notice.fileData}"
            download="${notice.fileName || notice.title}"
            target="_blank">
            Download
          </a>` : ''}
        </div>
      `;
    }).join('');
  }

  if (downloadsFilter) {
    downloadsFilter.addEventListener('change', () => {
      renderDownloads(downloadsFilter.value);
    });
  }

  renderDownloads();
});