// contact-page.js
// Handles contact details sync, map sync, and form submission saving.

(function () {

  const address     = localStorage.getItem('school-address');
  const phone       = localStorage.getItem('school-phone');
  const email       = localStorage.getItem('school-email');
  const officeHours = localStorage.getItem('school-office-hours');

  // --- Update contact details ---
  const addressItem = document.getElementById('contactAddressItem');
  const phoneItem   = document.getElementById('contactPhoneItem');
  const emailItem   = document.getElementById('contactEmailItem');
  const hoursItem   = document.getElementById('contactHoursItem');

  if (address && addressItem) addressItem.innerHTML = `<strong>Address:</strong> ${address}`;
  if (phone   && phoneItem)   phoneItem.innerHTML   = `<strong>Phone:</strong> ${phone}`;
  if (email   && emailItem)   emailItem.innerHTML   = `<strong>Email:</strong> ${email}`;
  if (officeHours && hoursItem) hoursItem.innerHTML = `<strong>Office Hours:</strong> ${officeHours}`;

  // --- Map sync ---
  const mapEmbed       = document.getElementById('schoolMapEmbed');
  const directionsLink = document.getElementById('directionsLink');

  if (address) {
    const encoded = encodeURIComponent(address);
    if (mapEmbed)       mapEmbed.src          = `https://maps.google.com/maps?q=${encoded}&output=embed`;
    if (directionsLink) directionsLink.href   = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  }

  // --- Contact form — save to localStorage ---
  const contactForm   = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('conName').value.trim();
      const email   = document.getElementById('conEmail').value.trim();
      const phone   = document.getElementById('conPhone').value.trim();
      const subject = document.getElementById('conSubject').value.trim();
      const message = document.getElementById('conMessage').value.trim();

      if (!name || !email || !subject || !message) return;

      const stored   = localStorage.getItem('school-contact-messages');
      const messages = stored ? JSON.parse(stored) : [];

      messages.unshift({
        id:      Date.now(),
        name, email,
        phone:   phone || 'Not provided',
        subject, message,
        date:    new Date().toISOString(),
        read:    false
      });

      localStorage.setItem('school-contact-messages', JSON.stringify(messages));

      if (contactStatus) {
        contactStatus.textContent = 'Message sent. We will get back to you shortly.';
        contactStatus.style.color = '#14532d';
        setTimeout(() => { contactStatus.textContent = ''; }, 5000);
      }

      contactForm.reset();
    });
  }

})();