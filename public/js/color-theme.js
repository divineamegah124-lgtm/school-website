// color-theme.js
// School Settings: full logic for logo upload, color extraction,
// theme application, and saving all school settings to localStorage

document.addEventListener('DOMContentLoaded', () => {

  // --- Element References ---
  const logoInput = document.getElementById('setLogo');
  const logoPreviewRow = document.getElementById('logoPreviewRow');
  const logoPreviewImg = document.getElementById('logoPreviewImg');
  const extractColorsBtn = document.getElementById('extractColorsBtn');
  const themeModeAuto = document.getElementById('themeModeAuto');
  const themeModeManual = document.getElementById('themeModeManual');
  const themePreviewCard = document.getElementById('themePreviewCard');
  const themeManualRow = document.getElementById('themeManualRow');
  const paletteSwatches = document.getElementById('paletteSwatches');
  const paletteRoles = document.getElementById('paletteRoles');
  const applyThemeBtn = document.getElementById('applyThemeBtn');
  const resetThemeBtn = document.getElementById('resetThemeBtn');
  const themeFormStatus = document.getElementById('themeFormStatus');
  const manualPrimary = document.getElementById('manualPrimary');
  const manualAccent = document.getElementById('manualAccent');
  const settingsForm = document.getElementById('settingsForm');
  const settingsFormStatus = document.getElementById('settingsFormStatus');
  const yearEstablishedInput = document.getElementById('setYearEstablished');
  const yearsActiveDisplay = document.getElementById('yearsActiveDisplay');

  let extractedPrimary = null;
  let extractedAccent = null;
  let uploadedLogoBase64 = null;
  let uploadedCoverBase64 = null;

  // --- Auto-calculate years in operation ---
  function updateYearsActive() {
    if (!yearEstablishedInput || !yearsActiveDisplay) return;
    const year = parseInt(yearEstablishedInput.value);
    if (year && year > 1800 && year <= new Date().getFullYear()) {
      const years = new Date().getFullYear() - year;
      yearsActiveDisplay.textContent = `Years in operation: ${years}`;
    }
  }
  if (yearEstablishedInput) {
    yearEstablishedInput.addEventListener('input', updateYearsActive);
  }

  // --- Load saved values into form fields on page load ---
  function loadSavedSettings() {
    const fields = [
      ['school-name', 'setSchoolName'],
      ['school-motto', 'setMotto'],
      ['school-welcome-headline', 'setWelcomeHeadline'],
      ['school-address', 'setAddress'],
      ['school-phone', 'setPhone'],
      ['school-email', 'setEmail'],
      ['school-facebook', 'setFacebook'],
      ['school-twitter', 'setTwitter'],
      ['school-instagram', 'setInstagram'],
      ['school-youtube', 'setYoutube'],
      ['school-students', 'setStudents'],
      ['school-staff', 'setStaff'],
      ['school-year-established', 'setYearEstablished'],
      ['school-type', 'setSchoolType'],
      ['school-level', 'setSchoolLevel'],
      ['school-programmes', 'setProgrammes'],
      ['school-term-structure', 'setTermStructure'],
      ['school-academic-year', 'setAcademicYear'],
      ['school-fees-day', 'setFeesDayStudent'],
      ['school-fees-boarding', 'setFeesBoardingStudent'],
      ['school-fees-note', 'setFeesNote'],
      ['school-office-hours', 'setOfficeHours'],
    ];

    fields.forEach(([key, id]) => {
      const val = localStorage.getItem(key);
      const el = document.getElementById(id);
      if (val && el) el.value = val;
    });

    updateYearsActive();

    const logo = localStorage.getItem('school-logo');
    if (logo) {
      logoPreviewImg.src = logo;
      logoPreviewRow.style.display = 'flex';
      uploadedLogoBase64 = logo;
    }

    const cover = localStorage.getItem('school-cover');
    if (cover) {
      uploadedCoverBase64 = cover;
      const coverPreviewRow = document.getElementById('coverPreviewRow');
      const coverPreviewImg = document.getElementById('coverPreviewImg');
      if (coverPreviewRow && coverPreviewImg) {
        coverPreviewImg.src = cover;
        coverPreviewRow.style.display = 'flex';
      }
    }

    const primary = localStorage.getItem('theme-primary');
    const accent = localStorage.getItem('theme-accent');
    if (primary) {
      document.documentElement.style.setProperty('--theme-primary', primary);
      if (manualPrimary) manualPrimary.value = primary;
    }
    if (accent) {
      document.documentElement.style.setProperty('--theme-accent', accent);
      if (manualAccent) manualAccent.value = accent;
    }
  }

  loadSavedSettings();

  // --- Logo upload preview ---
  if (logoInput) {
    logoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        uploadedLogoBase64 = event.target.result;
        logoPreviewImg.src = event.target.result;
        logoPreviewRow.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    });
  }

  // --- Cover photo upload preview ---
  const coverInput = document.getElementById('setCoverPhoto');
  if (coverInput) {
    coverInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        uploadedCoverBase64 = event.target.result;
        const coverPreviewRow = document.getElementById('coverPreviewRow');
        const coverPreviewImg = document.getElementById('coverPreviewImg');
        if (coverPreviewRow && coverPreviewImg) {
          coverPreviewImg.src = event.target.result;
          coverPreviewRow.style.display = 'flex';
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // --- Theme mode toggle ---
  function updateThemeModeVisibility() {
    if (themeModeAuto && themeModeAuto.checked) {
      themeManualRow.style.display = 'none';
    } else {
      themeManualRow.style.display = 'flex';
      themePreviewCard.style.display = 'none';
    }
  }
  if (themeModeAuto) themeModeAuto.addEventListener('change', updateThemeModeVisibility);
  if (themeModeManual) themeModeManual.addEventListener('change', updateThemeModeVisibility);

  // --- Color utility functions ---
  function adjustForContrast(hex, targetLightness) {
    const { h, s } = hexToHsl(hex);
    return hslToHex(h, s, targetLightness);
  }

  function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  }

  // --- Canvas color extraction ---
  function extractColorsFromImage(imgElement) {
    const canvas = document.createElement('canvas');
    const size = 80;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, size, size);
    let colorCounts = {};
    try {
      const data = ctx.getImageData(0, 0, size, size).data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2], alpha = data[i + 3];
        if (alpha < 200) continue;
        if ((r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) continue;
        const key = `${Math.round(r / 16) * 16},${Math.round(g / 16) * 16},${Math.round(b / 16) * 16}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      }
    } catch (err) {
      themeFormStatus.textContent = 'Could not read image data. File may not have loaded properly.';
      themeFormStatus.style.color = '#dc2626';
      return null;
    }
    const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return null;
    const toHex = (rgbStr) => {
      const [r, g, b] = rgbStr.split(',').map(Number);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };
    const dominant = toHex(sorted[0][0]);
    const secondary = sorted.length > 1 ? toHex(sorted[1][0]) : dominant;
    return { dominant, secondary };
  }

  // --- Generate Theme from Logo ---
  if (extractColorsBtn) {
    extractColorsBtn.addEventListener('click', () => {
      const colors = extractColorsFromImage(logoPreviewImg);
      if (!colors) {
        themeFormStatus.textContent = 'Could not extract colors. Try a different image or use manual mode.';
        themeFormStatus.style.color = '#dc2626';
        return;
      }
      extractedPrimary = adjustForContrast(colors.dominant, 28);
      extractedAccent = adjustForContrast(colors.secondary, 62);
      paletteSwatches.innerHTML = `
        <div class="palette-swatch" style="background:${extractedPrimary};"></div>
        <div class="palette-swatch" style="background:${extractedAccent};"></div>
        <div class="palette-swatch" style="background:#ffffff; border:1px solid #d1d5db;"></div>
      `;
      paletteRoles.innerHTML = `
        <div><span>Primary:</span> ${extractedPrimary} &mdash; navbar, footer, buttons, headings</div>
        <div><span>Accent:</span> ${extractedAccent} &mdash; highlights, hover states, call-to-action</div>
        <div><span>Background:</span> #ffffff &mdash; kept neutral for readability</div>
      `;
      themePreviewCard.style.display = 'block';
      themeFormStatus.textContent = 'Palette generated. Click "Preview Theme on Site" to apply.';
      themeFormStatus.style.color = '#14532d';
    });
  }

  // --- Preview Theme on Site ---
  if (applyThemeBtn) {
    applyThemeBtn.addEventListener('click', () => {
      let primary, accent;
      if (themeModeAuto.checked) {
        if (!extractedPrimary) {
          themeFormStatus.textContent = 'Please click "Generate Theme from Logo" first.';
          themeFormStatus.style.color = '#dc2626';
          return;
        }
        primary = extractedPrimary;
        accent = extractedAccent;
      } else {
        primary = manualPrimary.value;
        accent = manualAccent.value;
      }
      document.documentElement.style.setProperty('--theme-primary', primary);
      document.documentElement.style.setProperty('--theme-accent', accent);
      localStorage.setItem('theme-primary', primary);
      localStorage.setItem('theme-accent', accent);
      if (uploadedLogoBase64) localStorage.setItem('school-logo', uploadedLogoBase64);
      themeFormStatus.textContent = `Theme applied: Primary ${primary}, Accent ${accent}. Open any public page to see changes.`;
      themeFormStatus.style.color = '#14532d';
    });
  }

  // --- Reset to Default ---
  if (resetThemeBtn) {
    resetThemeBtn.addEventListener('click', () => {
      document.documentElement.style.removeProperty('--theme-primary');
      document.documentElement.style.removeProperty('--theme-accent');
      localStorage.removeItem('theme-primary');
      localStorage.removeItem('theme-accent');
      localStorage.removeItem('school-logo');
      localStorage.removeItem('school-cover');
      themeFormStatus.textContent = 'Theme reset to default colors across the site.';
      themeFormStatus.style.color = '#374151';
    });
  }

  // --- Save All Settings ---
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const mappings = [
        ['school-name', 'setSchoolName'],
        ['school-motto', 'setMotto'],
        ['school-welcome-headline', 'setWelcomeHeadline'],
        ['school-address', 'setAddress'],
        ['school-phone', 'setPhone'],
        ['school-email', 'setEmail'],
        ['school-facebook', 'setFacebook'],
        ['school-twitter', 'setTwitter'],
        ['school-instagram', 'setInstagram'],
        ['school-youtube', 'setYoutube'],
        ['school-students', 'setStudents'],
        ['school-staff', 'setStaff'],
        ['school-year-established', 'setYearEstablished'],
        ['school-type', 'setSchoolType'],
        ['school-level', 'setSchoolLevel'],
        ['school-programmes', 'setProgrammes'],
        ['school-term-structure', 'setTermStructure'],
        ['school-academic-year', 'setAcademicYear'],
        ['school-fees-day', 'setFeesDayStudent'],
        ['school-fees-boarding', 'setFeesBoardingStudent'],
        ['school-fees-note', 'setFeesNote'],
        ['school-office-hours', 'setOfficeHours'],
      ];

      mappings.forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (el) localStorage.setItem(key, el.value.trim());
      });

      if (uploadedLogoBase64) localStorage.setItem('school-logo', uploadedLogoBase64);
      if (uploadedCoverBase64) localStorage.setItem('school-cover', uploadedCoverBase64);

      updateYearsActive();

      settingsFormStatus.textContent = 'All settings saved. Public pages will now reflect these details. (Permanent saving requires backend connection)';
      settingsFormStatus.style.color = '#14532d';

      setTimeout(() => { settingsFormStatus.textContent = ''; }, 6000);
    });
  }

});