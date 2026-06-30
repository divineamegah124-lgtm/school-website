// admissions-page.js
// Loads all admissions data from backend API

document.addEventListener('DOMContentLoaded', async () => {

  let admissionsData = {};
  try {
    admissionsData = await getAdmissions();
  } catch (e) {
    console.error('Failed to load admissions data', e);
    admissionsData = {};
  }

  // --- Admissions status badge ---
  const badge = document.getElementById('admissionsStatusBadge');
  if (badge && admissionsData.status) {
    if (admissionsData.status === 'open') {
      badge.textContent = 'Open';
      badge.style.background = '#f0fdf4';
      badge.style.color = '#16a34a';
      badge.style.border = '1px solid #86efac';
    } else {
      badge.textContent = 'Closed';
      badge.style.background = '#fef2f2';
      badge.style.color = '#dc2626';
      badge.style.border = '1px solid #fca5a5';
    }
  }

  // --- Deadline countdown ---
  if (admissionsData.deadline) {
    const deadlineEl = document.getElementById('admissionsDeadlineText');
    if (deadlineEl) {
      const deadlineDate = new Date(admissionsData.deadline);
      const now = new Date();
      const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
      if (daysLeft > 0) {
        deadlineEl.textContent = `Deadline: ${deadlineDate.toLocaleDateString(
          'en-US', { month: 'long', day: 'numeric', year: 'numeric' }
        )} (${daysLeft} days left)`;
      } else if (daysLeft === 0) {
        deadlineEl.textContent = 'Deadline: TODAY!';
        deadlineEl.style.color = '#fca5a5';
      } else {
        deadlineEl.textContent = 'Applications are now closed.';
        deadlineEl.style.color = '#fca5a5';
      }
    }
  }

  // --- Requirements list ---
  if (admissionsData.requirements) {
    try {
      const requirements = typeof admissionsData.requirements === 'string'
        ? JSON.parse(admissionsData.requirements)
        : admissionsData.requirements;
      if (Array.isArray(requirements) && requirements.length > 0) {
        const reqList = document.getElementById('requirementsList');
        if (reqList) {
          reqList.innerHTML = requirements.map(req =>
            `<li>${typeof req === 'string' ? req : req.text}</li>`
          ).join('');
        }
      }
    } catch (e) {
      console.error('Failed to parse requirements', e);
    }
  }

  // --- Process steps ---
  if (admissionsData.processSteps) {
    try {
      const steps = typeof admissionsData.processSteps === 'string'
        ? JSON.parse(admissionsData.processSteps)
        : admissionsData.processSteps;
      if (Array.isArray(steps) && steps.length > 0) {
        const stepsContainer = document.getElementById('processSteps');
        if (stepsContainer) {
          stepsContainer.innerHTML = steps.map((step, idx) => `
            <div class="step-card">
              <div class="step-number">${idx + 1}</div>
              <h3>${step.title}</h3>
              <p>${step.description}</p>
            </div>
          `).join('');
        }
      }
    } catch (e) {
      console.error('Failed to parse process steps', e);
    }
  }

  // --- Fees table ---
  if (admissionsData.fees) {
    try {
      const f = typeof admissionsData.fees === 'string'
        ? JSON.parse(admissionsData.fees)
        : admissionsData.fees;
      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el && val) el.textContent = val;
      };
      set('tuitionFeeCell', f.tuitionFee);
      set('admissionFeeCell', f.admissionFee);
      set('boardingFeeCell', f.boardingFee);
      set('booksMaterielsCell', f.booksAndMaterials);
      set('feesNote', f.feesNote);
    } catch (e) {
      console.error('Failed to parse fees', e);
    }
  }

  // --- Download Application Form button ---
  const downloadBtn = document.getElementById('downloadFormBtn');
  const noFormMsg = document.getElementById('noFormMsg');
  if (admissionsData.formUrl) {
    if (downloadBtn) {
      downloadBtn.href = admissionsData.formUrl;
      downloadBtn.download = admissionsData.formFileName || 'Application-Form';
      downloadBtn.style.display = 'inline-block';
    }
    if (noFormMsg) noFormMsg.style.display = 'none';
  } else {
    if (downloadBtn) downloadBtn.style.display = 'none';
    if (noFormMsg) noFormMsg.style.display = 'block';
  }
});