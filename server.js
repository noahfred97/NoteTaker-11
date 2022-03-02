const PORT = process.env.PORT || 3001; //either gets the environment port or assigns 3001
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid'); 

const express = require('express');
const app = express();

const savedNotes = require('./db/db.json');

// middleware to recognize incoming req as string or array
app.use(express.urlencoded({ extended: true }));
// middleware to recognize incoming req as JSON
app.use(express.json());
// middleware to use any assets in the public folder
app.use(express.static('public'));



//get all notes route
app.get('/api/notes', (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err
    res.send(data)
  })
});

// sends response to notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});



function saveNewNote(body, notesArr) {
  const newNote = body;
  if (!Array.isArray(notesArr)) //if there is no array, create one called notesArr
   notesArr = [];
  
  newNote.id = uniqid();
  
  notesArr.push(newNote);
  fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(notesArr, null, 2) //makes the json more readable in the db.json
  );
  return newNote;
}

//post new note route
app.post('/api/notes', (req, res) => {
  const newNote = saveNewNote(req.body, savedNotes);
  res.json(newNote);
});


function deleteNote(id, notesArr) {
  for (let i = 0; i < notesArr.length; i++) {
      let note = notesArr[i];

      if (note.id == id) {
          notesArr.splice(i, 1);
          fs.writeFileSync(
              path.join(__dirname, './db/db.json'),
              JSON.stringify(notesArr, null, 2)
          );

          break;
      }
  }
}

app.delete('/api/notes/:id', (req, res) => {
  deleteNote(req.params.id, savedNotes);
  res.json(true);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
  });