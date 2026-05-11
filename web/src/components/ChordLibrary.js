import React, { useState } from 'react';

const CHORDS = [
  { name: 'C', frets: [0, 0, 0, -1], fingers: [0, 0, 0, 0] },
  { name: 'G', frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  { name: 'Am', frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0] },
  { name: 'F', frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  { name: 'Em', frets: [0, 4, 3, 2], fingers: [0, 4, 2, 1] },
  { name: 'D', frets: [-1, -1, 0, 2], fingers: [0, 0, 0, 1] },
  { name: 'A', frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0] },
  { name: 'E', frets: [1, 4, 3, 2], fingers: [1, 4, 3, 2] },
  { name: 'Dm', frets: [-1, -1, 0, 2], fingers: [0, 0, 0, 1] },
  { name: 'B7', frets: [-1, 3, 2, 3], fingers: [0, 1, 2, 3] },
  { name: 'E7', frets: [0, 2, 0, 1], fingers: [0, 2, 0, 1] },
  { name: 'A7', frets: [2, 2, 1, 2], fingers: [1, 2, 0, 3] },
];

function ChordCard({ chord, selected, onClick }) {
  return (
    <div className={`chord-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="chord-name">{chord.name}</div>
      <div className="chord-diagram">
        {[0, 1, 2, 3].map(string => (
          <div key={string} className="chord-string">
            {chord.frets[string] === -1 ? (
              <div className="chord-dot muted">×</div>
            ) : chord.frets[string] === 0 ? (
              <div className="chord-dot open" />
            ) : (
              <div className="chord-dot fingered" title={`Fret ${chord.frets[string]}`} />
            )}
          </div>
        ))}
      </div>
      <div className="chord-fingers">
        {chord.frets.filter(f => f > 0).length > 0
          ? `${chord.frets.filter(f => f > 0).length} finger${chord.frets.filter(f => f > 0).length > 1 ? 's' : ''}`
          : 'Open chords'}
      </div>
    </div>
  );
}

function ChordLibrary() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="section">
      <h2 className="section-title">Chord Library</h2>
      <div className="chord-grid">
        {CHORDS.map(chord => (
          <ChordCard
            key={chord.name}
            chord={chord}
            selected={selected === chord.name}
            onClick={() => setSelected(selected === chord.name ? null : chord.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default ChordLibrary;