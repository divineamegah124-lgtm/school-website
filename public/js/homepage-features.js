// homepage-features.js
// Powers 3 premium homepage features:
// 1. Admissions status banner
// 2. Latest announcements strip
// 3. Upcoming events strip

document.addEventListener('DOMContentLoaded', async () => {

  // =============================================
  // 1. ADMISSIONS STATUS BANNER
  // =============================================
  let admissionsData = {};
  try {
    admissionsData = await getAdmissions();
  } catch {
    const stored = localStorage.getItem('school-admissions');
    admissionsData = stored ? JSON.parse(stored) : {};
  }

  const banner = document.getElementById('admissionsBanner');
  const bannerText = document.getElementById('admissionsBannerText');

  if (admissionsData.status && banner && bannerText) {
    if (admissionsData.status === 'open') {
      let text = 'Admissions are now open.';
      if (admissionsData.deadline) {
        const deadline = new Date(admissionsData.deadline);
        const now = new Date();
        const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        if (daysLeft > 0) {
          text = `Admissions are open — Application deadline: ${
            deadline.toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })
          } (${daysLeft} days left)`;
        }
      }
      bannerText.textContent = text;
      banner.style.display = 'flex';
      banner.classList.add('banner-open');

    } else if (admissionsData.status === 'closed') {
      bannerText.textContent = 'Admissions are currently closed. Check back soon.';
      banner.style.display = 'flex';
      banner.classList.add('banner-closed');
    }
  }

  // =============================================
  // 2. LATEST ANNOUNCEMENTS STRIP
  // =============================================
  let announcements = [];
  try {
    announcements = await getAnnouncements();
  } catch {
    const stored = localStorage.getItem('school-announcements');
    announcements = stored ? JSON.parse(stored) : [];
  }

  const announcementsStrip = document.getElementById('announcementsStrip');
  const announcementsStripItems = document.getElementById('announcementsStripItems');
  const announcementsStripMore = document.querySelector('.announcements-strip-more');

  if (announcementsStripMore) {
    announcementsStripMore.href = '/downloads.html';
    announcementsStripMore.textContent = 'View All Announcements';
  }

  if (announcements.length > 0 && announcementsStrip && announcementsStripItems) {
    const latest = announcements.slice(0, 3);

    announcementsStripItems.innerHTML = latest.map(ann => `
      <div class="announcement-strip-item">
        <span class="announcement-strip-dot"></span>
        <a href="/downloads.html" class="announcement-strip-title"
          style="text-decoration:none; color:inherit;">
          ${ann.title}
        </a>
        <span class="announcement-strip-date">${
          ann.date
            ? new Date(ann.date).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric'
              })
            : ''
        }</span>
      </div>
    `).join('');

    announcementsStrip.style.display = 'block';
  }

  // =============================================
  // 3. UPCOMING EVENTS STRIP
  // =============================================
  let events = [];
  try {
    events = await getEvents();
  } catch {
    const stored = localStorage.getItem('school-events');
    events = stored ? JSON.parse(stored) : [];
  }

  const eventsStrip = document.getElementById('eventsStrip');
  const eventsStripCards = document.getElementById('eventsStripCards');

  if (events.length > 0 && eventsStrip && eventsStripCards) {
    const now = new Date();

    const upcoming = events
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);

    if (upcoming.length > 0) {
      eventsStripCards.innerHTML = upcoming.map(event => {
        const eventDate = new Date(event.date);
        const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
        const day = eventDate.toLocaleDateString('en-US', { day: 'numeric' });
        const year = eventDate.toLocaleDateString('en-US', { year: 'numeric' });

        return `
          <div class="event-strip-card">
            <div class="event-strip-date">
              <span class="event-strip-month">${month}</span>
              <span class="event-strip-day">${day}</span>
              <span class="event-strip-year">${year}</span>
            </div>
            <div class="event-strip-info">
              <h3>${event.title}</h3>
              <p>${event.description
                ? event.description.substring(0, 80) +
                  (event.description.length > 80 ? '...' : '')
                : ''
              }</p>
            </div>
            ${event.featured
              ? '<span class="event-strip-featured">Featured</span>'
              : ''
            }
          </div>
        `;
      }).join('');

      eventsStrip.style.display = 'block';
    }
  }

});