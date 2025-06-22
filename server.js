const express = require('express');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', async (req, res) => {
  const videos = await pool.query('SELECT * FROM videos ORDER BY id DESC');
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/api/videos', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM videos ORDER BY id DESC');
  res.json(rows);
});

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'upload.html'));
});

app.post('/upload', async (req, res) => {
  const { title, embed_code } = req.body;
  await pool.query('INSERT INTO videos (title, embed_code) VALUES ($1, $2)', [title, embed_code]);
  res.redirect('/');
});


// Serve the leaked page
app.get('/leaked', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'leaked.html'));
});

// Serve the leaked upload form
app.get('/leaked-upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'leaked-upload.html'));
});

// Handle leaked video upload
app.post('/leaked-upload', async (req, res) => {
  const { title, embed_code } = req.body;
  await pool.query('INSERT INTO leaked_videos (title, embed_code) VALUES ($1, $2)', [title, embed_code]);
  res.redirect('/leaked');
});

// API to return all leaked videos
app.get('/api/leaked_videos', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM leaked_videos ORDER BY id DESC');
  res.json(rows);
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});
