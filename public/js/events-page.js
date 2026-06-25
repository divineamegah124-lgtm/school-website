// events-page.js
// Loads and displays all school events from backend API with localStorage fallback

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('eventsContainer');
  const emptyState = document.getElementById('eventsEmpty');

  let events = [];
  try {
    events = await getEvents();
  } catch {
    const stored = localStorage.getItem('school-events');
    events = stored ? JSON.parse(stored) : [];
  }

  if (events.length === 0) {
    container.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  // Sort events by date (upcoming first)
  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  const eventsHTML = events.map(event => {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const isFeatured = event.featured ? '<span class="event-featured-badge">Featured</span>' : '';
    const eventImage = event.image ? `<img src="${event.image}" alt="${event.title}" class="event-card-image" />` : '';

    return `
      <div class="event-card">
        ${eventImage}
        <div class="event-card-content">
          <div class="event-card-header">
            <h3>${event.title}</h3>
            ${isFeatured}
          </div>
          <p class="event-card-date">${formattedDate}</p>
          <p class="event-card-description">${event.description || ''}</p>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = eventsHTML;
  emptyState.style.display = 'none';
});