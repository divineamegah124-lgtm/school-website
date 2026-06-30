// facility-detail-page.js
// Loads a single facility's details using the ?id= URL parameter

(async function () {
  const API = window.API_BASE || 'https://school-website-backend-production.up.railway.app';

  const params = new URLSearchParams(window.location.search);
  const facilityId = params.get('id');

  const nameEl = document.getElementById('facilityName');
  const descEl = document.getElementById('facilityDescription');
  const wrapper = document.getElementById('galleryPhotoWrapper');

  if (!facilityId) {
    if (nameEl) nameEl.textContent = 'Facility Not Found';
    if (descEl) descEl.textContent = 'No facility was specified.';
    return;
  }

  try {
    const res = await fetch(`${API}/api/facilities/single/${facilityId}`);
    if (!res.ok) {
      if (nameEl) nameEl.textContent = 'Facility Not Found';
      if (descEl) descEl.textContent = 'This facility could not be loaded.';
      return;
    }

    const facility = await res.json();

    if (nameEl) nameEl.textContent = facility.name || 'Untitled Facility';
    if (descEl) descEl.textContent = facility.description || '';

    let photos = [];
    try { photos = JSON.parse(facility.photos || '[]'); } catch {}

    const allImages = [];
    if (facility.coverImage) allImages.push(facility.coverImage);
    allImages.push(...photos);

    if (wrapper) {
      if (allImages.length === 0) {
        wrapper.innerHTML = `<img src="/images/facility-placeholder.png" class="gallery-photo active" data-index="0" alt="${facility.name || 'Facility'}" />`;
      } else {
        wrapper.innerHTML = allImages.map((url, i) => `
          <img src="${url}" class="gallery-photo${i === 0 ? ' active' : ''}" data-index="${i}" alt="${facility.name || 'Facility'} photo ${i + 1}" />
        `).join('');
      }
    }

  } catch (e) {
    console.error('Failed to load facility', e);
    if (nameEl) nameEl.textContent = 'Error Loading Facility';
    if (descEl) descEl.textContent = 'Please try again later.';
  }
})();