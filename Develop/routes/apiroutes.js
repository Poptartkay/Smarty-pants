// Import required modules
const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const fs = require('fs');
const util = require('util');
const path = require('path');
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

// Define helper functions for managing notes
const addNote = (note) => {
return new Promise(function(resolve, reject) {
if (!note.title || !note.text) {
throw new Error('You must provide a title and text for the note.');
}
const newNote = {id: uuid.v4(), title: note.title, text: note.text};
getNotes()
.then((notes) => [...notes, newNote])
.then((updatedNotes) => {
writeFileAsync('./db/db.json', JSON.stringify(updatedNotes));
resolve(newNote);
});
});
};

const deleteNote = (id) => {
return new Promise(function(resolve, reject) {
getNotes()
.then((notes) => notes.filter((note) => note.id !== id))
.then((filteredNotes) => {
writeFileAsync('./db/db.json', JSON.stringify(filteredNotes));
resolve();
});
});
};

const getNotes = () => {
return new Promise(function(resolve, reject) {
readFileAsync('./db/db.json', 'utf8')
.then((notes) => {
let notesArr = [];
try {
notesArr = JSON.parse(notes);
} catch (err) {
notesArr = [];
}
resolve(notesArr);
});
});
};

// Define API routes for managing notes
router.get('/notes', async (req, res) => {
try {
const notes = await getNotes();
console.log(notes);
res.json(notes);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

router.post('/notes', async (req, res) => {
try {
const newNote = await addNote(req.body);
res.json(newNote);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

router.delete('/notes/:id', async (req, res) => {
try {
await deleteNote(req.params.id);
res.json({ status: true });
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// Export router object
module.exports = router;
