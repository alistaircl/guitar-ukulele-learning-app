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
    { frets: [0, 2, 3, 0], fingers: [0, 1, 3, 0], label: 'G (simplified)' }
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
  { name: 'Fm', frets: [1, 0, 1, 3], fingers: [1, 0, 2, 4], variations: [
    { frets: [1, 0, 1, 3], fingers: [1, 0, 2, 4], label: 'Fm (standard)' }
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
  { name: 'B7', frets: [2, 3, 2, 2], fingers: [1, 2, 1, 1], variations: [
    { frets: [2, 3, 2, 2], fingers: [1, 2, 1, 1], label: 'B7 (standard)' }
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
  { name: 'G7', frets: [0, 2, 1, 2], fingers: [0, 2, 1, 3], variations: [
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
  const lowerQuery = query.toLowerCase().trim();
  
  // Handle common aliases and normalize to shorthand
  // Important: Remove spaces before quality words to ensure "c minor" -> "cm" not "c m"
  // Order matters: handle "major 7" and variants before standalone "major" to preserve maj7 chords
  let normalizedQuery = lowerQuery
    .replace(/\s*chords\b/g, '')
    .replace(/\s+major\s+7\b/g, 'maj7')      // "c major 7" -> "cmaj7"
    .replace(/\s+major\s+seventh\b/g, 'maj7') // "c major seventh" -> "cmaj7"
    .replace(/\s+major\s+7th\b/g, 'maj7')     // "c major 7th" -> "cmaj7"
    .replace(/\s+minor\b/g, 'm')      // "c minor" -> "cm"
    .replace(/\s+major\b/g, '')       // "c major" -> "c"
    .replace(/\s+(seventh|7th)\b/g, '7')  // "c seventh" -> "c7"
    .replace(/\s+sus4\b/g, 'sus4')    // "c sus4" -> "csus4"
    .replace(/\s+sus2\b/g, 'sus2')    // "c sus2" -> "csus2"
    .replace(/\s+sus\b/g, 'sus')      // "c sus" -> "csus" (defaults to sus4 in most contexts)
    .replace(/\s+add9\b/g, 'add9')    // "c add9" -> "cadd9"
    .replace(/\s+add\b/g, 'add')      // "c add" -> "cadd"
    .replace(/\s+dim7\b/g, 'dim7')    // "c dim7" -> "cdim7"
    .replace(/\s+dim\b/g, 'dim')      // "c dim" -> "cdim"
    .replace(/\s+aug\b/g, 'aug')      // "c aug" -> "caug"
    .replace(/\s+\+\b/g, 'aug')       // "c +" -> "caug" (+ is alias for augmented)
    .trim();
  
  if (normalizedQuery === '') {
    // If the user searched for 'major', 'major chords', or just whitespace, 
    // we should probably return an empty list or a sensible default.
    // But based on the issue, if they search for 'major', they want major chords.
    if (lowerQuery.includes('major')) {
      return ALL_CHORDS.filter(chord => {
        const name = chord.name.toLowerCase();
        // Match basic major (e.g., C, F#) or major 7th (e.g., Cmaj7, F#maj7)
        return /^[a-g][#b]?(maj7)?$/.test(name);
      });
    }
    return ALL_CHORDS;
  }
  
  // Special handling for 'm' (minor) to avoid matching 'maj7' chords
  // The letter 'm' alone should match minor chords (Am, Bm, Cm, etc.) but not maj7 chords
  if (normalizedQuery === 'm') {
    return ALL_CHORDS.filter(chord => {
      const name = chord.name.toLowerCase();
      // Match chords where 'm' indicates minor quality:
      // - Ends with 'm' (e.g., Am, Bbm, Cm)
      // - Has 'm' followed by a number (e.g., Am7, Bm7)
      // Exclude 'maj' which contains 'm' but indicates major
      return /^[a-g][#b]?m(7|$)/.test(name);
    });
  }
  
  // Handle multiple search terms (e.g., "C minor G major" → ["cm", "g"])
  const searchTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0);
  
  if (searchTerms.length === 1) {
    // Single term: direct includes match
    return ALL_CHORDS.filter(chord => 
      chord.name.toLowerCase().includes(searchTerms[0])
    );
  }
  
  // Multiple terms: find chords matching ALL terms (AND logic)
  return ALL_CHORDS.filter(chord => {
    const chordName = chord.name.toLowerCase();
    return searchTerms.every(term => chordName.includes(term));
  });
}

// Guitar chord database (standard tuning: E-A-D-G-B-E, 6 strings)
// Fret arrays are ordered: [E2, A2, D3, G3, B3, E4] (low to high)
// -1 means muted/not played, 0 means open string
export const GUITAR_CHORDS = [
  // Major chords
  { name: 'C', frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], variations: [
    { frets: [-1, 3, 5, 5, 5, 3], fingers: [0, 3, 1, 1, 1, 2], label: 'C (barre)' },
    { frets: [8, 10, 10, 9, 8, 8], fingers: [1, 3, 4, 2, 1, 1], label: 'C (high barre)' }
  ] },
  { name: 'D', frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], variations: [
    { frets: [5, 5, 7, 7, 7, 5], fingers: [1, 1, 3, 4, 4, 2], label: 'D (barre)' }
  ] },
  { name: 'E', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], variations: [
    { frets: [-1, 7, 9, 9, 9, 7], fingers: [0, 1, 3, 4, 4, 2], label: 'E (barre)' }
  ] },
  { name: 'F', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], variations: [
    { frets: [-1, -1, 3, 2, 1, 1], fingers: [0, 0, 3, 2, 1, 1], label: 'F (easy)' },
    { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], label: 'F (full barre)'}
  ] },
  { name: 'G', frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4], variations: [
    { frets: [3, 5, 5, 4, 3, 3], fingers: [1, 3, 4, 2, 1, 1], label: 'G (barre)' }
  ] },
  { name: 'A', frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], variations: [
    { frets: [5, 7, 7, 6, 5, 5], fingers: [1, 3, 4, 2, 1, 1], label: 'A (barre)' }
  ] },
  { name: 'B', frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 3, 4, 4, 2], variations: [
    { frets: [7, 9, 9, 8, 7, 7], fingers: [1, 3, 4, 2, 1, 1], label: 'B (high barre)' }
  ] },
  
  // Minor chords
  { name: 'Am', frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], variations: [
    { frets: [5, 7, 7, 5, 5, 5], fingers: [1, 3, 4, 1, 1, 1], label: 'Am (barre)' }
  ] },
  { name: 'Bm', frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], variations: [] },
  { name: 'Cm', frets: [-1, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], variations: [] },
  { name: 'Dm', frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], variations: [
    { frets: [5, 5, 7, 7, 6, 5], fingers: [1, 1, 3, 4, 2, 1], label: 'Dm (barre)' }
  ] },
  { name: 'Em', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], variations: [
    { frets: [-1, 7, 9, 9, 8, 7], fingers: [0, 1, 3, 4, 2, 1], label: 'Em (barre)' }
  ] },
  { name: 'Fm', frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], variations: [] },
  { name: 'Gm', frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], variations: [] },
  
  // 7th chords
  { name: 'A7', frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0], variations: [] },
  { name: 'B7', frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 2, 0, 3], variations: [] },
  { name: 'C7', frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], variations: [] },
  { name: 'D7', frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], variations: [] },
  { name: 'E7', frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], variations: [] },
  { name: 'G7', frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], variations: [] },
  
  // Major 7th chords
  { name: 'Cmaj7', frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0], variations: [] },
  { name: 'Dmaj7', frets: [-1, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 2, 3], variations: [] },
  { name: 'Emaj7', frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0], variations: [] },
  { name: 'Gmaj7', frets: [3, 2, 0, 0, 0, 2], fingers: [3, 2, 0, 0, 0, 4], variations: [] },
  
  // Suspended chords
  { name: 'Csus2', frets: [-1, 3, 5, 5, 3, 3], fingers: [0, 1, 3, 4, 1, 1], variations: [
    { frets: [-1, 3, 0, 0, 1, -1], fingers: [0, 2, 0, 0, 3, 0], label: 'Csus2 (low)' }
  ] },
  { name: 'Csus4', frets: [-1, 3, 5, 5, 6, 6], fingers: [0, 1, 2, 2, 3, 4], variations: [] },
  { name: 'Dsus2', frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0], variations: [] },
  { name: 'Dsus4', frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 2], variations: [] },
  { name: 'Gsus2', frets: [3, 5, 5, 5, 3, 3], fingers: [1, 3, 4, 4, 1, 1], variations: [
    { frets: [3, 5, 0, 0, 3, 3], fingers: [1, 2, 0, 0, 3, 3], label: 'Gsus2 (partial)' }
  ] },
  { name: 'Gsus4', frets: [3, 5, 5, 5, 6, 6], fingers: [1, 2, 2, 2, 3, 4], variations: [] }
];

// Helper to combine all chords with instrument info
export function getAllChords(instrument = 'ukulele') {
  return instrument === 'guitar' ? GUITAR_CHORDS : ALL_CHORDS;
}

// Helper to get chord by name from a specific instrument library (instrument-aware version)
export function getChordByInstrument(name, instrument = 'ukulele') {
  const chords = instrument === 'guitar' ? GUITAR_CHORDS : ALL_CHORDS;
  return chords.find(chord => chord.name.toLowerCase() === name.toLowerCase());
}

// Helper to search chords by name (partial match) for a specific instrument
export function searchChordsByInstrument(query, instrument = 'ukulele') {
  const chords = instrument === 'guitar' ? GUITAR_CHORDS : ALL_CHORDS;
  const lowerQuery = query.toLowerCase().trim();
  
  // Handle common aliases and normalize to shorthand
  // Order matters: handle "major 7" and variants before standalone "major" to preserve maj7 chords
  let normalizedQuery = lowerQuery
    .replace(/\s*chords\b/g, '')
    .replace(/\s+major\s+7\b/g, 'maj7')      // "c major 7" -> "cmaj7"
    .replace(/\s+major\s+seventh\b/g, 'maj7') // "c major seventh" -> "cmaj7"
    .replace(/\s+major\s+7th\b/g, 'maj7')     // "c major 7th" -> "cmaj7"
    .replace(/\s+minor\b/g, 'm')
    .replace(/\s+major\b/g, '')
    .replace(/\s+(seventh|7th)\b/g, '7')
    .replace(/\s+sus4\b/g, 'sus4')    // "c sus4" -> "csus4"
    .replace(/\s+sus2\b/g, 'sus2')    // "c sus2" -> "csus2"
    .replace(/\s+sus\b/g, 'sus')      // "c sus" -> "csus"
    .replace(/\s+add9\b/g, 'add9')    // "c add9" -> "cadd9"
    .replace(/\s+add\b/g, 'add')      // "c add" -> "cadd"
    .replace(/\s+dim7\b/g, 'dim7')    // "c dim7" -> "cdim7"
    .replace(/\s+dim\b/g, 'dim')      // "c dim" -> "cdim"
    .replace(/\s+aug\b/g, 'aug')      // "c aug" -> "caug"
    .replace(/\s+\+\b/g, 'aug')       // "c +" -> "caug" (+ is alias for augmented)
    .trim();
  
  if (normalizedQuery === '') {
    if (lowerQuery.includes('major')) {
      return chords.filter(chord => {
        const name = chord.name.toLowerCase();
        return /^[a-g][#b]?(maj7)?$/.test(name);
      });
    }
    return chords;
  }
  
  if (normalizedQuery === 'm') {
    return chords.filter(chord => {
      const name = chord.name.toLowerCase();
      return /^[a-g][#b]?m(7|$)/.test(name);
    });
  }
  
  const searchTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0);
  
  if (searchTerms.length === 1) {
    return chords.filter(chord => 
      chord.name.toLowerCase().includes(searchTerms[0])
    );
  }
  
  // Multiple terms: find chords matching ALL terms (AND logic)
  return chords.filter(chord => {
    const chordName = chord.name.toLowerCase();
    return searchTerms.every(term => chordName.includes(term));
  });
}