// Includes and global variables
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const data = fs.readFileSync("./db/db.json", "utf-8");
const noteList = JSON.parse(data);

// Express setup
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helper Functions

function writeNotes(notes) {
  fs.writeFile(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(notes),
    (err) => (err ? console.err(err) : console.log("File saved!"))
  );
}

//ROUTES
// ============== GET ============== //

// Returns the main index
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// Serves the notes main view
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "notes.html"))
);

// Makes sure JS references are correct
app.get("/assets/js/index.js", (req, res) =>
  res.sendFile(path.join(__dirname, "/assets/js/index.js"))
);

// Makes sure CSS references are correct
app.get("/assets/css/styles.css", (req, res) => {
  res.set("Content-Type", "text/css");
  res.sendFile(path.join(__dirname, "/assets/css/styles.css"));
});

// Returns the notes JSON
app.get("/api/notes", (req, res) => {
  res.set("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

// ============== POST ============== //

// Handles saving of notes
app.post("/api/notes", (req, res) => {
  // get the note contents, then add a generated UUID
  let note = req.body;
  let newID = uuidv4();
  note.id = newID;
  noteList.push(note);

  // Write the notelist with the new note
  writeNotes(noteList);
  res.end();
});

// ============== DELETE ============== //
app.delete("/api/notes/:uuid", (req, res) => {
  for (let i = 0; i < noteList.length; i++) {
    if (noteList[i].id === req.params.uuid) {
      noteList.splice(i, 1);
    }
  }
  writeNotes(noteList);
  res.end();
});

// ============== START ============== //

app.listen(PORT, () => console.log(`App running at http://localhost:${PORT}`));
