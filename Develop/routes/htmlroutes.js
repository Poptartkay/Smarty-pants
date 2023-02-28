const path = require('path');
const express = require('express');
const router = express.Router();

// Serve the notes.html file
router.get('/notes', (req, res) => {
  const notesPath = path.join(__dirname, '../public/notes.html');
  res.sendFile(notesPath);
});

// Serve the index.html file for all other routes
router.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../public/index.html');
  res.sendFile(indexPath);
});

module.exports = router;
