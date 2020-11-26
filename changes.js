// Stolen from https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques

const grid = [["Dm7", 4], ["G7", 4], ["CMaj7", 4], ["A7", 4]];

const chordsToBeats = chords =>
  chords.flatMap(([chord, duration]) => {
    const res = [];
    for (let i = 0; i < duration; i++) {
      res.push(chord);
    }
    return res;
  });

const chords = chordsToBeats(grid);

const audioContext = new AudioContext();
let currentQuarterNote = 1;

const playPulse = beatNumber => {
  const time = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const envelope = audioContext.createGain();

  osc.frequency.value = beatNumber % 2 === 1 ? 800 : 0;
  envelope.gain.value = 1;
  envelope.gain.exponentialRampToValueAtTime(1, time + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

  osc.connect(envelope);
  envelope.connect(audioContext.destination);

  osc.start();
  osc.stop(time + 0.03);
};

const notesInQueue = [];
const scheduleNote = (beatNumber, time) => {
  // push the note on the queue, even if we're not playing.
  notesInQueue.push({ note: beatNumber, time: time });
  playPulse(beatNumber);
};

const tempo = 120;
let nextNoteTime = 0.0; // when the next note is due.
const nextNote = () => {
  const secondsPerBeat = 60.0 / tempo;

  nextNoteTime += secondsPerBeat; // Add beat length to last beat time

  // Advance the beat number, wrap to zero
  currentQuarterNote++;
  if (currentQuarterNote === chords.length) {
    currentQuarterNote = 0;
  }
};

let lastNoteDrawn;
const draw = () => {
  let drawNote = lastNoteDrawn;
  let currentTime = audioContext.currentTime;

  while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    drawNote = notesInQueue[0].note;
    notesInQueue.splice(0, 1); // remove note from queue
  }

  // We only need to draw if the note has moved.
  if (lastNoteDrawn !== drawNote) {
    document.getElementById("current-chord").innerHTML = chords[drawNote];
    document.getElementById("current-beat").innerHTML = (drawNote % 4) + 1;
    lastNoteDrawn = drawNote;
  }
  // set up to draw again
  requestAnimationFrame(draw);
};

let scheduleAheadTime = 0.1;
let lookahead = 25;

const scheduler = () => {
  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote(currentQuarterNote, nextNoteTime);
    nextNote();
  }

  timerID = window.setTimeout(scheduler, lookahead);
};

scheduler(); // kick off scheduling
requestAnimationFrame(draw); // start the drawing loop
