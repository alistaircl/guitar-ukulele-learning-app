import React from 'react';
import ChordDiagram from './ChordDiagram';

function ChordDetail({ chord, showPrimaryLabel = false }) {
  const variations = chord.variations || [];
  const allVariations = variations.map((v, index) => ({
    ...v,
    label: showPrimaryLabel && index === 0 ? 'Primary' : v.label,
  }));
  
  return (
    <div className="chord-detail">
      {!showPrimaryLabel && <h2>{chord.name}</h2>}
      <div className="variations-grid">
        {allVariations.map((v, i) => (
          <div key={i} className="variation-item">
            <ChordDiagram
              frets={v.frets}
              fingers={v.fingers}
              size={120}
              className="chord-detail-diagram"
            />
            <div className="variation-info">
              <p className="variation-label">{v.label}</p>
              {v.label !== 'Primary' && <p className="variation-desc">{getVariationDescription(v.label)}</p>}
            </div>
          </div>
        ))}
      </div>
      {!showPrimaryLabel && variations.length === 0 && (
        <p className="no-variations">No alternative variations for this chord</p>
      )}
    </div>
  );
}

function getVariationDescription(label) {
  const descriptions = {
    'G (barre)': 'Barre chord shape - great for moving up the neck',
    'G (no pinky)': 'Simplified version - easier for beginners',
    'F (easy)': 'Simplified F chord - no barre required',
    'D (barre)': 'Barre shape at 5th fret - fuller sound',
    'D (standard)': 'Standard open position D chord',
    'Dm (barre)': 'Barre shape at 5th fret - richer tone',
    'Dm (standard)': 'Standard open position D minor chord',
  };
  return descriptions[label] || '';
}

export default ChordDetail;