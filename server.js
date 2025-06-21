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

app.get('/player/:id', async (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'player.html'));
});

app.get('/api/video/:id', async (req, res) => {
  const { id } = req.params;
  const video = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);
  res.json(video.rows[0]);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});
