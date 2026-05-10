// Converts a note string (e.g., "A4", "C#3") to frequency in Hz
export const noteToFrequency = (note) => {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  if (note.length < 2) return 0;

  const noteName = note.slice(0, -1);
  const octave = parseInt(note.slice(-1), 10);

  const noteIndex = noteNames.indexOf(noteName);
  if (noteIndex === -1) return 0;

  // A4 is 440 Hz. This is the 9th note in the array (index 9) in the 4th octave.
  // Formula: f = 440 * 2^((n - 9) / 12) where n is the number of semitones from A4.
  // Alternatively, we can compute the semitone offset from C0 and then use the formula.
  // But let's do: n = (octave + 1) * 12 + noteIndex  [where C0 is noteIndex 0, octave 0]
  // Then frequency = 440 * 2^((n - 4*12 - 9) / 12) = 440 * 2^((n - 57) / 12)
  // However, a simpler way: 
  //   let n = noteIndex + (octave - 4) * 12;
  //   return 440 * Math.pow(2, n / 12);
  const n = noteIndex + (octave - 4) * 12;
  return 440 * Math.pow(2, n / 12);
};

// Converts frequency in Hz to the closest note string (e.g., "A4")
export const frequencyToNote = (frequency) => {
  if (frequency <= 0) return '--';

  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  // Calculate the number of semitones away from A4
  const n = 12 * Math.log2(frequency / 440);
  // Round to the nearest integer to get the semitone offset from A4
  const n0 = Math.round(n);
  // Calculate the frequency of the nearest note
  const nearestFrequency = 440 * Math.pow(2, n0 / 12);
  // Calculate the number of semitones from C0 to this note
  // A4 is the 57th semitone from C0 (since C0 is semitone 0, A4 is 4*12 + 9 = 57)
  const semitonesFromC0 = 57 + n0;
  const octave = Math.floor(semitonesFromC0 / 12) - 1;
  const noteIndex = semitonesFromC0 % 12;
  return noteNames[noteIndex] + octave;
};