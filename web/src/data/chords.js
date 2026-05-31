// Comprehensive ukulele chord database (GCEA tuning)
export const ALL_CHORDS = [
  // Major chords
  { name: 'C', frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3], variations: [
    { frets: [5, 4, 3, 3], fingers: [4, 3, 2, 2], label: 'C (barre)' },
    { frets: [0, 0, 0, 3], fingers: [0, 0, 0, 4], label: 'C (pinky)' }
  ] },
  { name: 'D', frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0], variations: [
    { frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0], label: 'D (standard)' },
    { frets: [5, 5, 5, 3], fingers: [4, 4, 4, 3], label: 'D (barre)' }
  ] },
  { name: 'E', frets: [4, 4, 4, 2], fingers: [4, 4, 4, 2], variations: [
    { frets: [4, 4, 4, 2], fingers: [4, 4, 4, 2], label: 'E (standard)' }
  ] },
  { name: 'F', frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0], variations: [
    { frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0], label: 'F (standard)' },
    { frets: [1, 0, 1, 0], fingers: [1, 0, 1, 0], label: 'F (easy)' }
  ] },
  { name: 'G', frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2], variations: [
    { frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2], label: 'G (standard)' },
    { frets: [3, 2, 0, 2], fingers: [3, 2, 0, 1], label: 'G (barre)' },
    { frets: [0, 2, 3, 0], fingers: [0, 1, 3, 0], label: 'G (no pinky)' }
  ] },
  { name: 'A', frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0], variations: [
    { frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0], label: 'A (standard)' }
  ] },
  { name: 'B', frets: [4, 3, 2, 2], fingers: [4, 3, 2, 2], variations: [
    { frets: [4, 3, 2, 2], fingers: [4, 3, 2, 2], label: 'B (standard)' }
  ] },
  { name: 'F#', frets: [1, 1, 2, 1], fingers: [1, 1, 2, 1], variations: [
    { frets: [1, 1, 2, 1], fingers: [1, 1, 2, 1], label: 'F# (standard)' }
  ] },

  // Minor chords
  { name: 'Am', frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0], variations: [
    { frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0], label: 'Am (standard)' }
  ] },
  { name: 'Bm', frets: [4, 2, 2, 2], fingers: [4, 2, 2, 2], variations: [
    { frets: [7, 7, 7, 5], fingers: [1, 1, 1, 4], label: 'Bm (barre)' }
  ] },
  { name: 'Cm', frets: [0, 3, 3, 3], fingers: [0, 3, 3, 3], variations: [
    { frets: [0, 3, 3, 3], fingers: [0, 3, 3, 3], label: 'Cm (standard)' }
  ] },
  { name: 'Dm', frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0], variations: [
    { frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0], label: 'Dm (standard)' },
    { frets: [5, 5, 4, 3], fingers: [4, 4, 3, 3], label: 'Dm (barre)' }
  ] },
  { name: 'Em', frets: [0, 4, 3, 2], fingers: [0, 4, 2, 1], variations: [
    { frets: [0, 4, 3, 2], fingers: [0, 4, 2, 1], label: 'Em (standard)' }
  ] },
  { name: 'Fm', frets: [1, 0, 1, 3], fingers: [2, 1, 1, 4], variations: [
    { frets: [1, 0, 1, 3], fingers: [2, 1, 1, 4], label: 'Fm (standard)' }
  ] },
  { name: 'Gm', frets: [0, 2, 3, 1], fingers: [2, 1, 3, 2], variations: [
    { frets: [0, 2, 3, 1], fingers: [0, 1, 3, 2], label: 'Gm (standard)' }
  ] },
  { name: 'F#m', frets: [2, 1, 2, 0], fingers: [2, 1, 3, 0], variations: [
    { frets: [2, 1, 2, 0], fingers: [2, 1, 3, 0], label: 'F#m (standard)' }
  ] },
  { name: 'G#m', frets: [4, 3, 4, 2], fingers: [4, 3, 4, 2], variations: [
    { frets: [4, 3, 4, 2], fingers: [4, 3, 4, 2], label: 'G#m (standard)' }
  ] },

  // 7th chords
  { name: 'A7', frets: [0, 1, 0, 0], fingers: [0, 1, 0, 0], variations: [
    { frets: [0, 1, 0, 0], fingers: [0, 1, 0, 0], label: 'A7 (standard)' }
  ] },
  { name: 'B7', frets: [3, 2, 1, 2], fingers: [1, 3, 2, 1], variations: [
    { frets: [3, 2, 1, 2], fingers: [1, 3, 2, 1], label: 'B7 (standard)' }
  ] },
  { name: 'C7', frets: [0, 0, 0, 1], fingers: [0, 0, 0, 3], variations: [
    { frets: [0, 0, 0, 1], fingers: [0, 0, 0, 3], label: 'C7 (standard)' }
  ] },
  { name: 'D7', frets: [2, 2, 2, 3], fingers: [1, 2, 3, 4], variations: [
    { frets: [2, 2, 2, 3], fingers: [1, 2, 3, 4], label: 'D7 (standard)' }
  ] },
  { name: 'E7', frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3], variations: [
    { frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3], label: 'E7 (standard)' }
  ] },
  { name: 'F7', frets: [2, 3, 1, 3], fingers: [2, 3, 1, 3], variations: [
    { frets: [2, 3, 1, 3], fingers: [2, 3, 1, 3], label: 'F7 (standard)' }
  ] },
  { name: 'G7', frets: [0, 2, 1, 2], fingers: [1, 2, 1, 2], variations: [
    { frets: [0, 2, 1, 2], fingers: [0, 2, 1, 3], label: 'G7 (standard)' }
  ] },

  // Major 7th chords
  { name: 'Cmaj7', frets: [0, 0, 0, 2], fingers: [0, 0, 0, 2], variations: [
    { frets: [0, 0, 0, 2], fingers: [0, 0, 0, 2], label: 'Cmaj7 (standard)' }
  ] },
  { name: 'Dmaj7', frets: [2, 2, 2, 4], fingers: [1, 2, 3, 4], variations: [
    { frets: [2, 2, 2, 4], fingers: [1, 2, 3, 4], label: 'Dmaj7 (standard)' }
  ] },
  { name: 'Emaj7', frets: [4, 4, 4, 4], fingers: [4, 4, 4, 4], variations: [
    { frets: [4, 4, 4, 4], fingers: [4, 4, 4, 4], label: 'Emaj7 (standard)' }
  ] },
  { name: 'Fmaj7', frets: [2, 4, 1, 3], fingers: [2, 4, 1, 3], variations: [
    { frets: [2, 4, 1, 3], fingers: [2, 4, 1, 3], label: 'Fmaj7 (standard)' },
    { frets: [5, 5, 5, 7], fingers: [4, 4, 4, 3], label: 'Fmaj7 (barre)' }
  ] },
  { name: 'Gmaj7', frets: [0, 2, 2, 2], fingers: [1, 2, 2, 2], variations: [
    { frets: [0, 2, 2, 2], fingers: [1, 2, 2, 2], label: 'Gmaj7 (standard)' }
  ] },

  // Suspended chords
  { name: 'Csus2', frets: [0, 2, 3, 3], fingers: [0, 1, 2, 4], variations: [
    { frets: [0, 2, 3, 3], fingers: [0, 1, 2, 4], label: 'Csus2 (standard)' }
  ] },
  { name: 'Csus4', frets: [0, 0, 1, 3], fingers: [0, 0, 1, 3], variations: [
    { frets: [0, 0, 1, 3], fingers: [0, 0, 1, 3], label: 'Csus4 (standard)' }
  ] },
  { name: 'Dsus2', frets: [2, 2, 0, 0], fingers: [1, 2, 0, 0], variations: [
    { frets: [2, 2, 0, 0], fingers: [1, 2, 0, 0], label: 'Dsus2 (standard)' }
  ] },
  { name: 'Dsus4', frets: [0, 2, 3, 0], fingers: [0, 1, 3, 0], variations: [
    { frets: [0, 2, 3, 0], fingers: [0, 1, 3, 0], label: 'Dsus4 (standard)' }
  ] },
  { name: 'Esus2', frets: [1, 4, 0, 2], fingers: [1, 4, 0, 2], variations: [
    { frets: [1, 4, 0, 2], fingers: [1, 4, 0, 2], label: 'Esus2 (standard)' }
  ] },
  { name: 'Esus4', frets: [4, 4, 5, 2], fingers: [4, 4, 3, 2], variations: [
    { frets: [4, 4, 5, 2], fingers: [4, 4, 3, 2], label: 'Esus4 (standard)' }
  ] },
  { name: 'Fsus2', frets: [1, 0, 1, 1], fingers: [2, 0, 1, 1], variations: [
    { frets: [1, 0, 1, 1], fingers: [2, 0, 1, 1], label: 'Fsus2 (standard)' }
  ] },
  { name: 'Fsus4', frets: [2, 0, 1, 3], fingers: [2, 0, 1, 3], variations: [
    { frets: [2, 0, 1, 3], fingers: [2, 0, 1, 3], label: 'Fsus4 (standard)' }
  ] },
  { name: 'Gsus2', frets: [0, 2, 3, 0], fingers: [0, 1, 3, 0], variations: [
    { frets: [0, 2, 3, 0], fingers: [0, 1, 3, 0], label: 'Gsus2 (standard)' }
  ] },
  { name: 'Gsus4', frets: [0, 2, 3, 3], fingers: [0, 1, 3, 4], variations: [
    { frets: [0, 2, 3, 3], fingers: [0, 1, 3, 4], label: 'Gsus4 (standard)' }
  ] }
];

// Helper function to get chord by name
export function getChordByName(name) {
  return ALL_CHORDS.find(chord => chord.name.toLowerCase() === name.toLowerCase());
}

// Helper function to get all chord names
export function getAllChordNames() {
  return ALL_CHORDS.map(chord => chord.name);
}

// Helper function to search chords by name (partial match)
export function searchChords(query) {
  const lowerQuery = query.toLowerCase();
  
  // Handle common aliases
  let normalizedQuery = lowerQuery;
  if (normalizedQuery.includes(' minor')) normalizedQuery = normalizedQuery.replace(' minor', 'm');
  if (normalizedQuery.includes(' major')) normalizedQuery = normalizedQuery.replace(' major', '');
  if (normalizedQuery.includes(' seventh') || normalizedQuery.includes(' 7th')) normalizedQuery = normalizedQuery.replace(/ seventh| 7th/, '7');
  
  return ALL_CHORDS.filter(chord => 
    chord.name.toLowerCase().includes(normalizedQuery)
  );
}