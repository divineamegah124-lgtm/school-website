const fs = require('fs');

const schoolId = process.env.SCHOOL_ID || 'demo';
const apiBase = process.env.API_BASE || 'https://school-website-backend-production.up.railway.app';

const content = `window.SCHOOL_ID = '${schoolId}';\nwindow.API_BASE = '${apiBase}';\n`;

fs.writeFileSync('./public/js/site-config.js', content);
console.log(`site-config.js generated for school: ${schoolId}`);