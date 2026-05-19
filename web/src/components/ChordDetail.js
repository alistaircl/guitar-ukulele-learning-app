import React from 'react';
import ChordDiagram from './ChordDiagram';

function ChordDetail({ chord }) {
  const variations = chord.variations || [];
  const allVariations = [
    {
      ...chord,
      label: 'Primary',
      frets: chord.frets,
      fingers: chord.fingers,
    },
    ...variations,
  ];

  return (
    <div className="chord-detail">
      <h3>{chord.name}</h3>
      <div className="variations-grid">
        {allVariations.map((v, i) => (
          <div key={i} className="variation-item">
            <ChordDiagram 
              frets={v.frets}
              fingers={v.fingers}
              size={100}
              className="chord-detail-diagram"
            />
            <p>{v.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChordDetail;