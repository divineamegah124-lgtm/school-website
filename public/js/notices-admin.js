// notices-admin.js
// Handles Admin Tab 10: Notices & Downloads
// All documents stored in localStorage as 'school-notices' (array of objects)

document.addEventListener('DOMContentLoaded', () => {

  const newNoticeBtn = document.getElementById('newNoticeBtn');
  const cancelNoticeBtn = document.getElementById('cancelNoticeBtn');
  const noticeForm = document.getElementById('noticeForm');
  const noticeFormFields = document.getElementById('noticeFormFields');
  const noticeFormStatus = document.getElementById('noticeFormStatus');
  const noticesList = document.getElementById('noticesList');
  const noticeFilterCategory = document.getElementById('noticeFilterCategory');

  if (!newNoticeBtn) return; // Not on dashboard, exit

  let notices = [];

  // --- Load notices from localStorage ---
  function loadNotices() {
    const stored = localStorage.getItem('school-notices');
    notices = stored ? JSON.parse(stored) : [];
  }

  // --- Save notices to localStorage ---
  function saveNotices() {
    localStorage.setItem('school-notices', JSON.stringify(notices));
  }

  // --- Render notices list in admin ---
  function renderNoticesList(filterCategory = 'all') {
    const filtered = filterCategory === 'all'
      ? notices
      : notices.filter(n => n.category === filterCategory);

    if (filtered.length === 0) {
      noticesList.innerHTML = `
        <div style="padding:16px; color:#9ca3af; font-size:0.85rem;">
          No documents found${filterCategory !== 'all' ? ' in this category' : ''}.
        </div>`;
      return;
    }

    noticesList.innerHTML = filtered.map((notice) => `
      <div class="dashboard-list-item">
        <div class="list-item-info">
          <h4>${notice.title}
            <span class="status-badge resolved" style="margin-left:8px;">
              ${notice.category}
            </span>
          </h4>
          <p>${notice.description || 'No description provided.'}</p>
          <span class="list-item-date">
            Published: ${notice.date}
            &bull; File: ${notice.fileName}
          </span>
        </div>
        <div class="list-item-actions">
          <button class="btn-delete" data-id="${notice.id}">Delete</button>
        </div>
      </div>
    `).join('');

    // Delete listeners
    noticesList.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        notices = notices.filter(n => n.id !== id);
        saveNotices();
        renderNoticesList(noticeFilterCategory.value);
      });
    });
  }

  // --- Show / hide form ---
  newNoticeBtn.addEventListener('click', () => {
    noticeForm.style.display = 'block';
    newNoticeBtn.style.display = 'none';
  });

  if (cancelNoticeBtn) {
    cancelNoticeBtn.addEventListener('click', () => {
      noticeForm.style.display = 'none';
      newNoticeBtn.style.display = 'inline-block';
      noticeFormFields.reset();
      noticeFormStatus.textContent = '';
    });
  }

  // --- Submit new document ---
  if (noticeFormFields) {
    noticeFormFields.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('noticeTitle').value.trim();
      const category = document.getElementById('noticeCategory').value;
      const date = document.getElementById('noticeDate').value;
      const description = document.getElementById('noticeDescription').value.trim();
      const fileInput = document.getElementById('noticeFile');
      const file = fileInput.files[0];

      if (!file) {
        noticeFormStatus.textContent = 'Please select a file to upload.';
        noticeFormStatus.style.color = '#dc2626';
        return;
      }

      // Read file as base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const newNotice = {
          id: Date.now(),
          title,
          category,
          date,
          description,
          fileName: file.name,
          fileType: file.type,
          fileData: event.target.result // base64
        };

        notices.unshift(newNotice); // Add to top
        saveNotices();
        renderNoticesList(noticeFilterCategory.value);

        noticeForm.style.display = 'none';
        newNoticeBtn.style.display = 'inline-block';
        noticeFormFields.reset();
        noticeFormStatus.textContent = '';
      };

      reader.onerror = () => {
        noticeFormStatus.textContent = 'Could not read file. Please try again.';
        noticeFormStatus.style.color = '#dc2626';
      };

      reader.readAsDataURL(file);
    });
  }

  // --- Filter by category ---
  if (noticeFilterCategory) {
    noticeFilterCategory.addEventListener('change', () => {
      renderNoticesList(noticeFilterCategory.value);
    });
  }

  // --- Initial load ---
  loadNotices();
  renderNoticesList();

});