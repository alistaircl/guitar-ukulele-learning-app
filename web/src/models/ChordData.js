// Chord database for guitar and ukulele
// Simplified version - in a real app, this would be more comprehensive
export const CHORD_DATABASE = {
  [Instrument.GUITAR]: {
    // Major chords
    'C': [
      [-1, 3, 2, 0, 1, 0], // Open C
      [3, 3, 5, 5, 5, 3], // Barre C at 3rd fret
      [8, 10, 10, 9, 8, 8] // Barre C at 8th fret
    ],
    'G': [
      [3, 2, 0, 0, 0, 3], // Open G
      [3, 5, 5, 4, 3, 3], // G barre shape
      [10, 12, 12, 12, 10, 10] // G at 10th fret
    ],
    'D': [
      [-1, -1, 0, 2, 3, 2], // Open D
      [5, 5, 7, 7, 7, 5], // D barre at 5th fret
      [10, 10, 12, 12, 12, 10] // D at 10th fret
    ],
    'A': [
      [0, 0, 2, 2, 2, 0], // Open A
      [5, 7, 7, 6, 5, 5], // A barre at 5th fret
      [12, 14, 14, 13, 12, 12] // A at 12th fret
    ],
    'E': [
      [0, 2, 2, 1, 0, 0], // Open E
      [7, 9, 9, 9, 8, 7], // E barre at 7th fret
      [12, 14, 14, 13, 12, 12] // E shape at 12th fret (same as A but shifted)
    ],
    // Minor chords
    'Am': [
      [0, 0, 2, 2, 1, 0], // Open Am
      [5, 7, 7, 5, 5, 5], // Am barre at 5th fret
      [12, 14, 14, 12, 12, 12] // Am at 12th fret
    ],
    'Em': [
      [0, 2, 2, 0, 0, 0], // Open Em
      [7, 9, 9, 8, 7, 7], // Em barre at 7th fret
      [12, 14, 14, 12, 12, 12] // Em at 12th fret
    ],
    // Seventh chords
    'G7': [
      [3, 2, 0, 0, 0, 1], // Open G7
      [3, 5, 3, 4, 3, 3], // G7 shape
      [10, 12, 10, 11, 10, 10] // G7 at 10th fret
    ],
    'C7': [
      [-1, 3, 2, 3, 1, 0], // Open C7
      [3, 3, 6, 5, 5, 3], // C7 barre at 3rd fret
      [8, 10, 10, 10, 8, 8] // C7 at 8th fret
    ]
  },
  [Instrument.UKULELE]: {
    // Major chords
    'C': [
      [0, 0, 0, 3], // Open C
      [0, 0, 0, 0], // C with barre (capo effect)
      [5, 4, 0, 0] // C at 5th position
    ],
    'G': [
      [0, 2, 3, 2], // Open G
      [0, 2, 3, 2], // G alternative
      [3, 0, 0, 0] // G at 3rd position
    ],
    'F': [
      [2, 0, 1, 0], // Open F
      [5, 3, 4, 3], // F at 5th position
      [2, 0, 1, 0] // F alternative
    ],
    // Minor chords
    'Am': [
      [2, 0, 0, 0], // Open Am
      [5, 3, 3, 3], // Am at 5th position
      [2, 0, 0, 0] // Am alternative
    ],
    'Em': [
      [0, 4, 3, 2], // Open Em
      [4, 3, 2, 1], // Em at 2nd position
      [0, 4, 3, 2] // Em alternative
    ]
  }
};