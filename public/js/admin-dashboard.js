// admin-dashboard.js
// Admin Dashboard — all 9 tabs wired to backend API

// -------------------------------------------------------
// ADMIN LOGO & NAME SYNC
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const savedLogo = localStorage.getItem('school-logo');
  const adminLogoImg = document.querySelector('.dashboard-logo img');
  if (savedLogo && adminLogoImg) adminLogoImg.src = savedLogo;

  const savedName = localStorage.getItem('school-name');
  const adminLogoSpan = document.querySelector('.dashboard-logo span');
  if (savedName && adminLogoSpan) adminLogoSpan.textContent = savedName + ' — Admin';

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      apiLogout();
      window.location.href = '/admin/login.html';
    });
  }
});

// -------------------------------------------------------
// TAB SWITCHING
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const tabs   = document.querySelectorAll('.dashboard-tab');
  const panels = document.querySelectorAll('.dashboard-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`panel-${target}`).classList.add('active');
    });
  });
});

// -------------------------------------------------------
// TAB 1: ANNOUNCEMENTS
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const newAnnouncementBtn     = document.getElementById('newAnnouncementBtn');
  const announcementForm       = document.getElementById('announcementForm');
  const cancelAnnouncementBtn  = document.getElementById('cancelAnnouncementBtn');
  const announcementFormFields = document.getElementById('announcementFormFields');
  const list                   = document.getElementById('announcementsList');
  if (!newAnnouncementBtn) return;

  // Load and render announcements
  async function loadAnnouncements() {
    try {
      const announcements = await getAnnouncements();
      if (announcements.length === 0) {
        list.innerHTML = '<div style="padding:16px;color:#9ca3af;font-size:0.85rem;">No announcements yet.</div>';
        return;
      }
      list.innerHTML = announcements.map(ann => `
        <div class="dashboard-list-item" data-id="${ann.id}">
          <div class="list-item-info">
            <h4>${ann.title}</h4>
            <p>${ann.content || ''}</p>
            <span class="list-item-date">Published: ${ann.date ? new Date(ann.date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) : ''}</span>
          </div>
          <div class="list-item-actions">
            <button class="btn-delete" data-id="${ann.id}">Delete</button>
          </div>
        </div>
      `).join('');

      list.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this announcement?')) return;
          try {
            await deleteAnnouncement(btn.dataset.id);
            loadAnnouncements();
          } catch (err) {
            alert('Failed to delete: ' + err.message);
          }
        });
      });
    } catch (err) {
      list.innerHTML = '<div style="padding:16px;color:#dc2626;">Failed to load announcements.</div>';
    }
  }

  loadAnnouncements();

  newAnnouncementBtn.addEventListener('click', () => {
    announcementForm.style.display = 'block';
    newAnnouncementBtn.style.display = 'none';
  });

  cancelAnnouncementBtn.addEventListener('click', () => {
    announcementForm.style.display = 'none';
    newAnnouncementBtn.style.display = 'inline-block';
    announcementFormFields.reset();
  });

  announcementFormFields.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title   = document.getElementById('annTitle').value.trim();
    const content = document.getElementById('annBody').value.trim();
    const date    = document.getElementById('annDate').value;
    if (!title || !content || !date) return;

    try {
      await createAnnouncement({ title, content, date });
      announcementForm.style.display = 'none';
      newAnnouncementBtn.style.display = 'inline-block';
      announcementFormFields.reset();
      loadAnnouncements();
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
  });
});


// -------------------------------------------------------
// TAB 3: FEEDBACK
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const feedbackList = document.getElementById('feedbackList');
  if (!feedbackList) return;

  const feedbackSubBtn  = document.getElementById('feedbackSubBtn');
  const messagesSubBtn  = document.getElementById('messagesSubBtn');
  const feedbackSub     = document.getElementById('feedbackSubSection');
  const messagesSub     = document.getElementById('messagesSubSection');

  if (feedbackSubBtn) {
    feedbackSubBtn.addEventListener('click', () => {
      feedbackSubBtn.classList.add('active');
      messagesSubBtn.classList.remove('active');
      feedbackSub.style.display = 'block';
      messagesSub.style.display = 'none';
    });
    messagesSubBtn.addEventListener('click', () => {
      messagesSubBtn.classList.add('active');
      feedbackSubBtn.classList.remove('active');
      messagesSub.style.display = 'block';
      feedbackSub.style.display = 'none';
    });
  }

  async function loadFeedback() {
    try {
      const items = await getFeedback();
      if (items.length === 0) {
        feedbackList.innerHTML = '<div style="padding:16px;color:#9ca3af;font-size:0.85rem;">No feedback yet.</div>';
        return;
      }
      feedbackList.innerHTML = items.map(item => `
        <div class="dashboard-list-item feedback-item" data-id="${item.id}" data-status="${item.resolved ? 'resolved' : 'unresolved'}">
          <div class="list-item-info">
            <h4>${item.name || 'Anonymous'} <span class="status-badge ${item.resolved ? 'resolved' : 'unresolved'}">${item.resolved ? 'Resolved' : 'Unresolved'}</span></h4>
            <p>${item.message}</p>
            <span class="list-item-date">Submitted: ${new Date(item.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })} &bull; Email: ${item.email || 'not provided'}</span>
          </div>
          <div class="list-item-actions">
            ${!item.resolved ? `<button class="btn-edit mark-resolved-btn" data-id="${item.id}">Mark Resolved</button>` : ''}
            <button class="btn-delete" data-id="${item.id}">Delete</button>
          </div>
        </div>
      `).join('');

      feedbackList.querySelectorAll('.mark-resolved-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          try {
            await resolveFeedback(btn.dataset.id);
            loadFeedback();
          } catch (err) {
            alert('Failed: ' + err.message);
          }
        });
      });

      feedbackList.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this feedback?')) return;
          try {
            await deleteFeedback(btn.dataset.id);
            loadFeedback();
          } catch (err) {
            alert('Failed: ' + err.message);
          }
        });
      });

      // Filter
      const filter = document.getElementById('feedbackStatusFilter');
      if (filter) {
        filter.addEventListener('change', () => {
          const val = filter.value;
          feedbackList.querySelectorAll('.feedback-item').forEach(item => {
            item.style.display = (val === 'all' || item.dataset.status === val) ? 'flex' : 'none';
          });
        });
      }

    } catch (err) {
      feedbackList.innerHTML = '<div style="padding:16px;color:#dc2626;">Failed to load feedback.</div>';
    }
  }

  loadFeedback();
});

// -------------------------------------------------------
// TAB 5: EVENTS
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const newEventBtn     = document.getElementById('newEventBtn');
  const eventForm       = document.getElementById('eventForm');
  const cancelEventBtn  = document.getElementById('cancelEventBtn');
  const eventFormFields = document.getElementById('eventFormFields');
  const eventsList      = document.getElementById('eventsList');
  if (!newEventBtn) return;

  async function loadEvents() {
    try {
      const events = await getEvents();
      if (events.length === 0) {
        eventsList.innerHTML = '<div style="padding:16px;color:#9ca3af;font-size:0.85rem;">No events yet.</div>';
        return;
      }
      eventsList.innerHTML = events.map(ev => `
        <div class="dashboard-list-item" data-id="${ev.id}">
          <div class="list-item-info">
            <h4>${ev.title}</h4>
            <p>${ev.description || ''}</p>
            <span class="list-item-date">${ev.date ? new Date(ev.date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) : ''} ${ev.location ? '&bull; ' + ev.location : ''}</span>
          </div>
          <div class="list-item-actions">
            <button class="btn-delete" data-id="${ev.id}">Delete</button>
          </div>
        </div>
      `).join('');

      eventsList.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this event?')) return;
          try {
            await deleteEvent(btn.dataset.id);
            loadEvents();
          } catch (err) {
            alert('Failed: ' + err.message);
          }
        });
      });
    } catch (err) {
      eventsList.innerHTML = '<div style="padding:16px;color:#dc2626;">Failed to load events.</div>';
    }
  }

  loadEvents();

  newEventBtn.addEventListener('click', () => {
    eventForm.style.display = 'block';
    newEventBtn.style.display = 'none';
  });

  cancelEventBtn.addEventListener('click', () => {
    eventForm.style.display = 'none';
    newEventBtn.style.display = 'inline-block';
    eventFormFields.reset();
  });

  eventFormFields.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title       = document.getElementById('eventTitle').value.trim();
    const date        = document.getElementById('eventDate').value;
    const description = document.getElementById('eventDescription').value.trim();
    const featured    = document.getElementById('eventFeatured').checked;
    if (!title || !date || !description) return;

    try {
      await createEvent({ title, date, description, featured });
      eventForm.style.display = 'none';
      newEventBtn.style.display = 'inline-block';
      eventFormFields.reset();
      loadEvents();
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
  });
});
// -------------------------------------------------------
// TAB 6: STAFF DIRECTORY
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const newStaffBtn     = document.getElementById('newStaffBtn');
  const staffForm       = document.getElementById('staffForm');
  const cancelStaffBtn  = document.getElementById('cancelStaffBtn');
  const staffList       = document.getElementById('staffList');
  if (!newStaffBtn) return;

  // Department manager
  let departments = JSON.parse(localStorage.getItem('school-departments') || '["Mathematics","English","Science","Social Studies","ICT","Physical Education","Arts","Other"]');

  function saveDepartments() {
    localStorage.setItem('school-departments', JSON.stringify(departments));
  }

  function renderDepartmentSelect() {
    const select = document.getElementById('staffDepartment');
    if (!select) return;
    select.innerHTML = '<option value="">Select a department</option>' +
      departments.map(d => `<option value="${d}">${d}</option>`).join('') +
      '<option value="__new__">+ Add New Department</option>';
  }

  function renderDepartmentManager() {
    const mgr = document.getElementById('departmentManagerList');
    if (!mgr) return;
    mgr.innerHTML = departments.map((d, i) => `
      <div class="dashboard-list-item" style="padding:10px 14px;">
        <div class="list-item-info"><h4 style="font-size:0.88rem;">${d}</h4></div>
        <div class="list-item-actions">
          <button class="btn-delete" data-index="${i}">Delete</button>
        </div>
      </div>
    `).join('');

    mgr.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        departments.splice(btn.dataset.index, 1);
        saveDepartments();
        renderDepartmentSelect();
        renderDepartmentManager();
      });
    });
  }

  // Add department button
  const addDeptBtn = document.getElementById('addDeptBtn');
  if (addDeptBtn) {
    addDeptBtn.addEventListener('click', () => {
      const input = document.getElementById('addDeptInput');
      const val = input.value.trim();
      if (!val) return;
      if (!departments.includes(val)) {
        departments.push(val);
        saveDepartments();
        renderDepartmentSelect();
        renderDepartmentManager();
      }
      input.value = '';
    });
  }

  // Inline new department in staff form
  const staffDeptSelect = document.getElementById('staffDepartment');
  if (staffDeptSelect) {
    staffDeptSelect.addEventListener('change', () => {
      const row = document.getElementById('newDeptInlineRow');
      if (staffDeptSelect.value === '__new__') {
        row.style.display = 'flex';
      } else {
        row.style.display = 'none';
      }
    });
  }

  const confirmNewDeptBtn = document.getElementById('confirmNewDeptBtn');
  if (confirmNewDeptBtn) {
    confirmNewDeptBtn.addEventListener('click', () => {
      const input = document.getElementById('newDeptInlineInput');
      const val = input.value.trim();
      if (!val) return;
      if (!departments.includes(val)) {
        departments.push(val);
        saveDepartments();
        renderDepartmentSelect();
        renderDepartmentManager();
      }
      staffDeptSelect.value = val;
      document.getElementById('newDeptInlineRow').style.display = 'none';
      input.value = '';
    });
  }

  const cancelNewDeptBtn = document.getElementById('cancelNewDeptBtn');
  if (cancelNewDeptBtn) {
    cancelNewDeptBtn.addEventListener('click', () => {
      document.getElementById('newDeptInlineRow').style.display = 'none';
      document.getElementById('newDeptInlineInput').value = '';
      staffDeptSelect.value = '';
    });
  }

  renderDepartmentSelect();
  renderDepartmentManager();

  async function loadStaff() {
    try {
      const staff = await getStaff();
      if (staff.length === 0) {
        staffList.innerHTML = '<div style="padding:16px;color:#9ca3af;font-size:0.85rem;">No staff added yet.</div>';
        return;
      }
      staffList.innerHTML = staff.map(s => `
        <div class="dashboard-list-item" data-id="${s.id}">
          <div class="list-item-info">
            <h4>${s.name}</h4>
            <p>${s.role} ${s.department ? '&bull; ' + s.department : ''}</p>
            <span class="list-item-date">${s.email || ''}</span>
          </div>
          <div class="list-item-actions">
            <button class="btn-delete" data-id="${s.id}">Delete</button>
          </div>
        </div>
      `).join('');

      staffList.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this staff member?')) return;
          try {
            await deleteStaff(btn.dataset.id);
            loadStaff();
          } catch (err) {
            alert('Failed: ' + err.message);
          }
        });
      });
    } catch (err) {
      staffList.innerHTML = '<div style="padding:16px;color:#dc2626;">Failed to load staff.</div>';
    }
  }

  loadStaff();

  newStaffBtn.addEventListener('click', () => {
    staffForm.style.display = 'block';
    newStaffBtn.style.display = 'none';
  });

  cancelStaffBtn.addEventListener('click', () => {
    staffForm.style.display = 'none';
    newStaffBtn.style.display = 'inline-block';
    document.getElementById('staffFormFields').reset();
  });

  async function saveStaff() {
    const name       = document.getElementById('staffName').value.trim();
    const role       = document.getElementById('staffRole').value.trim();
    const department = document.getElementById('staffDepartment').value;
    const email      = '';
    const status     = document.getElementById('staffFormStatus');
    if (!name || !role || !department || department === '__new__') {
      if (status) status.textContent = 'Please fill in all fields.';
      return;
    }

    // Read photo as base64 if selected
    let photo = '';
    const photoFile = document.getElementById('staffPhoto');
    if (photoFile && photoFile.files[0]) {
      photo = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(photoFile.files[0]);
      });
    }

    try {
      await createStaff({ name, role, department, email, photo });
      staffForm.style.display = 'none';
      newStaffBtn.style.display = 'inline-block';
      document.getElementById('staffFormFields').reset();
      if (status) status.textContent = '';
      loadStaff();
    } catch (err) {
      if (status) status.textContent = 'Failed: ' + err.message;
    }
  }

  const saveStaffBtn = document.getElementById('saveStaffBtn');
  if (saveStaffBtn) saveStaffBtn.addEventListener('click', saveStaff);

  const saveAndAddBtn = document.getElementById('saveAndAddStaffBtn');
  if (saveAndAddBtn) {
    saveAndAddBtn.addEventListener('click', async () => {
      await saveStaff();
      staffForm.style.display = 'block';
      newStaffBtn.style.display = 'none';
    });
  }
});

// -------------------------------------------------------
// TAB 7: ADMISSIONS CONTROL
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const admissionsStatusForm = document.getElementById('admissionsStatusForm');
  if (!admissionsStatusForm) return;

  // Load current admissions data
  try {
    const data = await getAdmissions();
    if (data.status) {
      const select = document.getElementById('admissionsOpen');
      if (select) select.value = data.status;
    }
    if (data.deadline) {
      const deadlineInput = document.getElementById('admissionsDeadline');
      if (deadlineInput) deadlineInput.value = data.deadline.split('T')[0];
    }
  } catch {}

  admissionsStatusForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status   = document.getElementById('admissionsOpen').value;
    const deadline = document.getElementById('admissionsDeadline').value;
    const msg      = document.getElementById('admissionsStatusMsg');
    try {
      await updateAdmissions({ status, deadline });
      if (msg) { msg.textContent = 'Saved.'; msg.style.color = '#16a34a'; }
    } catch (err) {
      if (msg) { msg.textContent = 'Failed: ' + err.message; msg.style.color = '#dc2626'; }
    }
  });

  // Requirements (localStorage)
  const addReqForm = document.getElementById('addRequirementForm');
  const reqsList   = document.getElementById('requirementsList');

  function loadRequirements() {
    const reqs = JSON.parse(localStorage.getItem('school-admissions-requirements') || '[]');
    if (!reqsList) return;
    reqsList.innerHTML = reqs.map((r, i) => `
      <div class="dashboard-list-item" style="padding:10px 14px;">
        <div class="list-item-info"><p>${r.text}</p></div>
        <div class="list-item-actions">
          <button class="btn-delete" data-index="${i}">Delete</button>
        </div>
      </div>
    `).join('');
    reqsList.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const updated = reqs.filter((_, i) => i != btn.dataset.index);
        localStorage.setItem('school-admissions-requirements', JSON.stringify(updated));
        loadRequirements();
      });
    });
  }

  if (addReqForm) {
    addReqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = document.getElementById('reqItem').value.trim();
      if (!text) return;
      const reqs = JSON.parse(localStorage.getItem('school-admissions-requirements') || '[]');
      reqs.push({ text });
      localStorage.setItem('school-admissions-requirements', JSON.stringify(reqs));
      addReqForm.reset();
      loadRequirements();
    });
  }

  loadRequirements();

  // Fees form (localStorage)
  const feesForm = document.getElementById('admissionsFeesForm');
  const savedFees = JSON.parse(localStorage.getItem('school-admissions-fees') || '{}');
  if (savedFees.tuitionFee) document.getElementById('tuitionFee').value = savedFees.tuitionFee;
  if (savedFees.admissionFee) document.getElementById('admissionFee').value = savedFees.admissionFee;
  if (savedFees.boardingFee) document.getElementById('boardingFee').value = savedFees.boardingFee;
  if (savedFees.booksAndMaterials) document.getElementById('booksAndMaterials').value = savedFees.booksAndMaterials;
  if (savedFees.feesNote) document.getElementById('feesNote').value = savedFees.feesNote;

  if (feesForm) {
    feesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fees = {
        tuitionFee: document.getElementById('tuitionFee').value,
        admissionFee: document.getElementById('admissionFee').value,
        boardingFee: document.getElementById('boardingFee').value,
        booksAndMaterials: document.getElementById('booksAndMaterials').value,
        feesNote: document.getElementById('feesNote').value,
      };
      localStorage.setItem('school-admissions-fees', JSON.stringify(fees));
      const msg = document.getElementById('admissionsFeesMsg');
      if (msg) { msg.textContent = 'Fees saved.'; msg.style.color = '#16a34a'; }
    });
  }
});

// -------------------------------------------------------
// TAB 8: NOTICES & DOWNLOADS
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const newNoticeBtn     = document.getElementById('newNoticeBtn');
  const noticeForm       = document.getElementById('noticeForm');
  const cancelNoticeBtn  = document.getElementById('cancelNoticeBtn');
  const noticeFormFields = document.getElementById('noticeFormFields');
  const noticesList      = document.getElementById('noticesList');
  if (!newNoticeBtn) return;

  async function loadNotices() {
    try {
      const notices = await getNotices();
      if (notices.length === 0) {
        noticesList.innerHTML = '<div style="padding:16px;color:#9ca3af;font-size:0.85rem;">No documents added yet.</div>';
        return;
      }
      noticesList.innerHTML = notices.map(n => `
        <div class="dashboard-list-item" data-id="${n.id}">
          <div class="list-item-info">
            <h4>${n.title}</h4>
            <p>${n.category || ''}</p>
            <span class="list-item-date">${n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) : ''}</span>
          </div>
          <div class="list-item-actions">
            <button class="btn-delete" data-id="${n.id}">Delete</button>
          </div>
        </div>
      `).join('');

      noticesList.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this notice?')) return;
          try {
            await deleteNotice(btn.dataset.id);
            loadNotices();
          } catch (err) {
            alert('Failed: ' + err.message);
          }
        });
      });
    } catch (err) {
      noticesList.innerHTML = '<div style="padding:16px;color:#dc2626;">Failed to load notices.</div>';
    }
  }

  loadNotices();

  newNoticeBtn.addEventListener('click', () => {
    noticeForm.style.display = 'block';
    newNoticeBtn.style.display = 'none';
  });

  cancelNoticeBtn.addEventListener('click', () => {
    noticeForm.style.display = 'none';
    newNoticeBtn.style.display = 'inline-block';
    noticeFormFields.reset();
  });

noticeFormFields.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title       = document.getElementById('noticeTitle').value.trim();
    const category    = document.getElementById('noticeCategory').value;
    const description = document.getElementById('noticeDescription').value.trim();
    const fileInput   = document.getElementById('noticeFile');
    const file        = fileInput.files[0];
    const status      = document.getElementById('noticeFormStatus');
    if (!title || !category) return;

    if (!file) {
      if (status) status.textContent = 'Please select a file to upload.';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        await createNotice({
          title,
          category,
          description,
          fileData: event.target.result // base64 string
        });
        noticeForm.style.display = 'none';
        newNoticeBtn.style.display = 'inline-block';
        noticeFormFields.reset();
        if (status) status.textContent = '';
        loadNotices();
      } catch (err) {
        if (status) status.textContent = 'Failed: ' + err.message;
      }
    };
    reader.onerror = () => {
      if (status) status.textContent = 'Could not read file. Please try again.';
    };
    reader.readAsDataURL(file);
  });

  // Filter
  const filter = document.getElementById('noticeFilterCategory');
  if (filter) {
    filter.addEventListener('change', () => {
      const val = filter.value;
      noticesList.querySelectorAll('.dashboard-list-item').forEach(item => {
        const cat = item.querySelector('p') ? item.querySelector('p').textContent : '';
        item.style.display = (val === 'all' || cat === val) ? 'flex' : 'none';
      });
    });
  }
});

// -------------------------------------------------------
// TAB 9: SCHOOL SETTINGS — LEADERSHIP
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const leadershipContainer = document.getElementById('leadershipFormContainer');
  const addLeaderBtn        = document.getElementById('addLeaderBtn');
  const saveLeadershipBtn   = document.getElementById('saveLeadershipBtn');
  const leadershipSaveMsg   = document.getElementById('leadershipSaveMsg');
  if (!leadershipContainer) return;

  let leaders = [];

  async function loadLeadership() {
    try {
      leaders = await getLeadership();
    } catch {
      const stored = localStorage.getItem('school-leadership');
      leaders = stored ? JSON.parse(stored) : [];
    }
    renderLeadershipForms();
  }

  function renderLeadershipForms() {
    leadershipContainer.innerHTML = leaders.map((l, i) => `
      <div class="dashboard-form-card" style="margin-bottom:12px;" data-index="${i}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h4 style="margin:0; font-size:0.88rem;">Leader ${i + 1}</h4>
          <button type="button" class="btn-delete remove-leader-btn" data-index="${i}">Remove</button>
        </div>
        <label>Name</label>
        <input type="text" class="leader-name" value="${l.name || ''}" style="margin-bottom:8px;" />
        <label>Role / Title</label>
        <input type="text" class="leader-role" value="${l.role || ''}" />
      </div>
    `).join('');

    leadershipContainer.querySelectorAll('.remove-leader-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        leaders.splice(btn.dataset.index, 1);
        renderLeadershipForms();
      });
    });
  }

  if (addLeaderBtn) {
    addLeaderBtn.addEventListener('click', () => {
      leaders.push({ name: '', role: '' });
      renderLeadershipForms();
    });
  }

  if (saveLeadershipBtn) {
    saveLeadershipBtn.addEventListener('click', async () => {
      const nameInputs = leadershipContainer.querySelectorAll('.leader-name');
      const roleInputs = leadershipContainer.querySelectorAll('.leader-role');
      const updated = Array.from(nameInputs).map((input, i) => ({
        name: input.value.trim(),
        role: roleInputs[i].value.trim()
      })).filter(l => l.name || l.role);

      try {
        // Delete existing and recreate
        for (const l of leaders) {
          if (l.id) await deleteLeader(l.id);
        }
        for (const l of updated) {
          await createLeader({ name: l.name, role: l.role, order: 1 });
        }
        if (leadershipSaveMsg) {
          leadershipSaveMsg.textContent = 'Leadership saved.';
          leadershipSaveMsg.style.color = '#16a34a';
        }
        loadLeadership();
      } catch (err) {
        if (leadershipSaveMsg) {
          leadershipSaveMsg.textContent = 'Failed: ' + err.message;
          leadershipSaveMsg.style.color = '#dc2626';
        }
      }
    });
  }

  loadLeadership();

  // Settings sub-navigation
  document.querySelectorAll('.settings-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.settings-nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('settings-' + btn.getAttribute('data-section')).classList.add('active');
    });
  });
});
// -------------------------------------------------------
// TAB 9: SCHOOL SETTINGS — MAIN FORM
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const settingsForm = document.getElementById('settingsForm');
  if (!settingsForm) return;

  // Load existing settings and populate form
  try {
    const data = await getSettings();
    if (data) {
      if (data.name)            document.getElementById('setSchoolName').value    = data.name;
      if (data.motto)           document.getElementById('setMotto').value          = data.motto;
      if (data.welcomeHeadline) document.getElementById('setWelcomeHeadline').value = data.welcomeHeadline;
      if (data.address)         document.getElementById('setAddress').value        = data.address;
      if (data.phone)           document.getElementById('setPhone').value          = data.phone;
      if (data.email)           document.getElementById('setEmail').value          = data.email;
      if (data.facebook)        document.getElementById('setFacebook').value       = data.facebook;
      if (data.twitter)         document.getElementById('setTwitter').value        = data.twitter;
      if (data.instagram)       document.getElementById('setInstagram').value      = data.instagram;
      if (data.youtube)         document.getElementById('setYoutube').value        = data.youtube;
      if (data.students)        document.getElementById('setStudents').value       = data.students;
      if (data.staffCount)      document.getElementById('setStaff').value          = data.staffCount;
      if (data.yearEstablished) document.getElementById('setYearEstablished').value = data.yearEstablished;
      if (data.mission)         document.getElementById('setMission').value        = data.mission;
      if (data.vision)          document.getElementById('setVision').value         = data.vision;
      if (data.history)         document.getElementById('setHistory').value        = data.history;

      // Show logo preview if saved
      if (data.logo) {
        const previewRow = document.getElementById('logoPreviewRow');
        const previewImg = document.getElementById('logoPreviewImg');
        if (previewRow) previewRow.style.display = 'flex';
        if (previewImg) previewImg.src = data.logo;

        // Also update dashboard topbar logo
        const adminLogoImg = document.querySelector('.dashboard-logo img');
        if (adminLogoImg) adminLogoImg.src = data.logo;
      }

      // Show cover photo preview if saved
      if (data.coverPhoto) {
        const coverRow = document.getElementById('coverPreviewRow');
        const coverImg = document.getElementById('coverPreviewImg');
        if (coverRow) coverRow.style.display = 'flex';
        if (coverImg) coverImg.src = data.coverPhoto;
      }
    }
  } catch (err) {
    console.error('Failed to load settings', err);
  }

  // Logo file input preview
  const logoInput = document.getElementById('setLogo');
  if (logoInput) {
    logoInput.addEventListener('change', () => {
      const file = logoInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewRow = document.getElementById('logoPreviewRow');
        const previewImg = document.getElementById('logoPreviewImg');
        if (previewRow) previewRow.style.display = 'flex';
        if (previewImg) previewImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Cover photo file input preview
  const coverInput = document.getElementById('setCoverPhoto');
  if (coverInput) {
    coverInput.addEventListener('change', () => {
      const file = coverInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const coverRow = document.getElementById('coverPreviewRow');
        const coverImg = document.getElementById('coverPreviewImg');
        if (coverRow) coverRow.style.display = 'flex';
        if (coverImg) coverImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Settings form submit
  settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusEl = document.getElementById('settingsFormStatus');

    // Read logo as base64 if a new file was selected
    const logoFile  = document.getElementById('setLogo').files[0];
    const coverFile = document.getElementById('setCoverPhoto').files[0];

    async function readFileAsBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    try {
      if (statusEl) { statusEl.textContent = 'Saving...'; statusEl.style.color = '#6b7280'; }

      const payload = {
        name:             document.getElementById('setSchoolName').value.trim(),
        motto:            document.getElementById('setMotto').value.trim(),
        welcomeHeadline:  document.getElementById('setWelcomeHeadline').value.trim(),
        address:          document.getElementById('setAddress').value.trim(),
        phone:            document.getElementById('setPhone').value.trim(),
        email:            document.getElementById('setEmail').value.trim(),
        facebook:         document.getElementById('setFacebook').value.trim(),
        twitter:          document.getElementById('setTwitter').value.trim(),
        instagram:        document.getElementById('setInstagram').value.trim(),
        youtube:          document.getElementById('setYoutube').value.trim(),
        students:         document.getElementById('setStudents').value,
        staffCount:       document.getElementById('setStaff').value,
        yearEstablished:  document.getElementById('setYearEstablished').value,
        mission:          document.getElementById('setMission').value.trim(),
        vision:           document.getElementById('setVision').value.trim(),
        history:          document.getElementById('setHistory').value.trim(),
      };

      // Convert logo to base64 if new file selected
      if (logoFile) {
        payload.logo = await readFileAsBase64(logoFile);
      }

      // Convert cover photo to base64 if new file selected
      if (coverFile) {
        payload.coverPhoto = await readFileAsBase64(coverFile);
      }

      await updateSettings(payload);

      // Update dashboard topbar immediately
      if (payload.name) {
        const adminLogoSpan = document.querySelector('.dashboard-logo span');
        if (adminLogoSpan) adminLogoSpan.textContent = payload.name + ' — Admin';
      }
      if (payload.logo) {
        const adminLogoImg = document.querySelector('.dashboard-logo img');
        if (adminLogoImg) adminLogoImg.src = payload.logo;
      }

      if (statusEl) {
        statusEl.textContent = 'Settings saved successfully.';
        statusEl.style.color = '#16a34a';
        setTimeout(() => { statusEl.textContent = ''; }, 4000);
      }

    } catch (err) {
      if (statusEl) {
        statusEl.textContent = 'Failed to save: ' + err.message;
        statusEl.style.color = '#dc2626';
      }
    }
  });
});

// -------------------------------------------------------
// TAB 9: SCHOOL SETTINGS — LEADERSHIP PHOTO SUPPORT
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const leadershipContainer = document.getElementById('leadershipFormContainer');
  if (!leadershipContainer) return;

  // Override renderLeadershipForms to include photo field
  window.renderLeadershipFormsWithPhoto = function(leaders) {
    leadershipContainer.innerHTML = leaders.map((l, i) => `
      <div class="dashboard-form-card" style="margin-bottom:12px;" data-index="${i}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h4 style="margin:0; font-size:0.88rem;">Leader ${i + 1}</h4>
          <button type="button" class="btn-delete remove-leader-btn" data-index="${i}">Remove</button>
        </div>
        <label>Name</label>
        <input type="text" class="leader-name" value="${l.name || ''}" style="margin-bottom:8px;" />
        <label>Role / Title</label>
        <input type="text" class="leader-role" value="${l.role || ''}" style="margin-bottom:8px;" />
        <label>Photo</label>
        <input type="file" class="leader-photo-file" accept="image/*" style="margin-bottom:6px;" />
        ${l.photo ? `<img src="${l.photo}" alt="Photo" style="width:60px;height:60px;object-fit:cover;border-radius:50%;border:2px solid #d1d5db;margin-top:4px;" />` : ''}
      </div>
    `).join('');

    leadershipContainer.querySelectorAll('.remove-leader-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        leaders.splice(btn.dataset.index, 1);
        window.renderLeadershipFormsWithPhoto(leaders);
      });
    });

    return leaders;
  };
});

// -------------------------------------------------------
// TAB 6: STAFF — PHOTO SUPPORT
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Add photo field to staff form in HTML dynamically
  const staffFormFields = document.getElementById('staffFormFields');
  if (!staffFormFields) return;

  // Insert photo field before the form buttons
  const formButtons = staffFormFields.querySelector('.form-buttons');
  if (formButtons && !document.getElementById('staffPhotoField')) {
    const photoDiv = document.createElement('div');
    photoDiv.id = 'staffPhotoField';
    photoDiv.innerHTML = `
      <label style="display:block; font-size:0.78rem; font-weight:600; color:#374151; text-transform:uppercase; letter-spacing:0.3px; margin-bottom:6px; margin-top:12px;">
        Photo (optional)
      </label>
      <input type="file" id="staffPhoto" accept="image/*"
        style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:2px; font-size:0.85rem;" />
      <div id="staffPhotoPreview" style="display:none; margin-top:8px;">
        <img id="staffPhotoImg" src="" alt="Preview"
          style="width:60px; height:60px; object-fit:cover; border-radius:50%; border:2px solid #d1d5db;" />
      </div>
    `;
    staffFormFields.insertBefore(photoDiv, formButtons);

    // Preview on file select
    document.getElementById('staffPhoto').addEventListener('change', function() {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('staffPhotoImg').src = e.target.result;
        document.getElementById('staffPhotoPreview').style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  }
});