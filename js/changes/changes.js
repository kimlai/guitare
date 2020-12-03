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

synth = new Tone.Synth({
  oscillator: {
    type: "sine",
    modulationFrequency: 0.2
  },
  envelope: {
    attack: 0,
    decay: 0.1,
    sustain: 0,
    release: 0.1
  }
}).toMaster();

const bpmSlider = document.getElementById("bpm-slider");
const bpm = document.getElementById("bpm");
bpmSlider.addEventListener("input", e => {
  Tone.Transport.bpm.value = e.target.value;
  bpm.innerHTML = e.target.value;
});

Tone.Transport.bpm.value = bpmSlider.value;

let currentQuarterNote = 0;

// loop on quarter notes
const loop = new Tone.Loop(time => {
  // Advance the beat number, wrap to zero
  currentQuarterNote++;
  if (currentQuarterNote === chords.length) {
    currentQuarterNote = 0;
  }
  if (currentQuarterNote % 2 === 1) {
    synth.triggerAttackRelease(440, "8n", time);
  }
  Tone.Draw.schedule(() => {
    document.getElementById("current-chord").innerHTML =
      chords[currentQuarterNote];
    document.getElementById("current-beat").innerHTML =
      (currentQuarterNote % 4) + 1;
  }, time);
}, "4n").start("+0.5");

const play = document.getElementById("play-button");
const pause = document.getElementById("pause-button");
play.addEventListener("click", () => {
  Tone.Transport.start("+0.5");
});
pause.addEventListener("click", () => {
  Tone.Transport.stop();
});
