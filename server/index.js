const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve frontend pages
app.use(express.static(path.join(__dirname, '..', 'pages')));

// Serve admin pages under /admin path
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

app.get('/', (req, res) => {
  res.send('School website server is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});