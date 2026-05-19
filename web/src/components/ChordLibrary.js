import React, { useState } from 'react';
import ChordDetail from './ChordDetail';
import ChordDiagram from './ChordDiagram';

const CHORDS = [
  { name: 'C', frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3], variations: [] },
  { name: 'G', frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2], variations: [
    { frets: [3, 2, 0, 2], fingers: [3, 2, 0, 1], label: 'G (barre)' },
    { frets: [0, 2, 3, 0], fingers: [0, 1, 3, 0], label: 'G (no pinky)' }
  ] },
  { name: 'Am', frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0], variations: [] },
  { name: 'F', frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0], variations: [
    { frets: [1, 0, 1, 0], fingers: [1, 0, 1, 0], label: 'F (easy)' }
  ] },
  { name: 'Em', frets: [0, 4, 3, 2], fingers: [0, 4, 2, 1], variations: [] },
  { name: 'D', frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0], variations: [
    { frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0], label: 'D (alt)' }
  ] },
  { name: 'A', frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0], variations: [] },
  { name: 'E', frets: [1, 4, 0, 2], fingers: [1, 4, 0, 2], variations: [] },
  { name: 'Dm', frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0], variations: [] },
  { name: 'B7', frets: [2, 3, 2, 2], fingers: [1, 3, 2, 1], variations: [] },
  { name: 'E7', frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3], variations: [] },
  { name: 'A7', frets: [0, 1, 0, 0], fingers: [0, 1, 0, 0], variations: [] }
];

function ChordLibrary() {
  const [selectedChord, setSelectedChord] = useState(null);

  return (
    <div className="section">
      <h2 className="section-title">Chord Library</h2>
      <div className="chord-grid">
        {CHORDS.map(chord => (
          <ChordCard
            key={chord.name}
            chord={chord}
            selected={selectedChord === chord.name}
            onClick={() => setSelectedChord(selectedChord === chord.name ? null : chord.name)}
          />
        ))}
      </div>
      {selectedChord && (
        <div className="chord-detail-container">
          <ChordDetail chord={CHORDS.find(c => c.name === selectedChord)} />
        </div>
      )}
    </div>
  );
}

function ChordCard({ chord, selected, onClick }) {
  const fingerCount = chord.frets.filter(f => f > 0).length;
  return (
    <div
      className={`chord-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      aria-pressed={selected}
      aria-label={`${chord.name} chord diagram showing ${chord.frets.filter(f => f > 0).length} finger positions`}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      <div className="chord-name">{chord.name}</div>
      <ChordDiagram frets={chord.frets} fingers={chord.fingers} size={100} className="chord-diagram" />
      <div className="chord-fingers">
        {fingerCount > 0
          ? `${fingerCount} finger${fingerCount > 1 ? 's' : ''}`
          : 'Open chords'}
      </div>
    </div>
  );
}

export default ChordLibrary;