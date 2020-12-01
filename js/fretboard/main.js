let notes = allNotes;

const randomNote = previousNote => {
  const allowedNotes = notes.filter(note => note !== previousNote);
  const selectedNote =
    allowedNotes[Math.floor(Math.random() * allowedNotes.length)];
  notes = notes.filter(note => note !== selectedNote);

  return selectedNote;
};

const changeNote = () => {
  if (notes.length === 0) {
    notes = allNotes;
  }
  const currentNote = document.getElementById("note").innerHTML;
  document.getElementById("note").innerHTML = randomNote(currentNote);
  renderNotes();
};

const renderNotes = () => {
  document.getElementById("notes").innerHTML = "";
  notes.forEach(note => {
    const noteElement = document.createElement("div");
    noteElement.innerHTML = note;
    document.getElementById("notes").appendChild(noteElement);
  });
};

document.getElementById("button").addEventListener("click", changeNote);

changeNote();
