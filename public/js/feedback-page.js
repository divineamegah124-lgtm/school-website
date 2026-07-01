// feedback-page.js
// Handles feedback form submission to backend

(function () {

  const feedbackForm   = document.getElementById('feedbackForm');
  const feedbackStatus = document.getElementById('feedbackStatus');

  if (!feedbackForm) return;

  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name     = document.getElementById('fbName').value.trim();
    const role     = document.getElementById('fbRole').value;
    const email    = document.getElementById('fbEmail').value.trim();
    const category = document.getElementById('fbCategory').value;
    const message  = document.getElementById('fbMessage').value.trim();

    if (!name || !role || !category || !message) return;

    const submitBtn = feedbackForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Submitting...';
    }

    // Fold role into message so it's visible to the admin
    const fullMessage = `[${role.charAt(0).toUpperCase() + role.slice(1)}] ${message}`;

    try {
      await submitFeedback({
        name,
        email:   email || undefined,
        subject: category,
        message: fullMessage
      });

      if (feedbackStatus) {
        feedbackStatus.textContent = 'Thank you. Your feedback has been submitted privately.';
        feedbackStatus.style.color = '#14532d';
        setTimeout(() => { feedbackStatus.textContent = ''; }, 6000);
      }

      feedbackForm.reset();

    } catch (err) {
      if (feedbackStatus) {
        feedbackStatus.textContent = 'Could not submit feedback. Please try again.';
        feedbackStatus.style.color = '#dc2626';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Submit Privately';
      }
    }
  });

})();