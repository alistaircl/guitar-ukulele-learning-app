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
        {/* Always display the primary chord first */}
        <div className="variation-item">
          <ChordDiagram
            frets={chord.frets}
            fingers={chord.fingers}
            size={120}
            className="chord-detail-diagram"
          />
          <div className="variation-info">
            <p className="variation-label">{showPrimaryLabel ? 'Primary' : 'Standard'}</p>
            <p className="variation-desc">Standard open position voicing</p>
          </div>
        </div>
        
        {/* Display variations if they exist */}
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
              {v.label !== 'Primary' && getVariationDescription(v.label) && <p className="variation-desc">{getVariationDescription(v.label)}</p>}
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
  if (!label) return '';
  
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('barre')) return 'Barre chord shape — great for moving up the neck';
  if (lowerLabel.includes('easy')) return 'Simplified fingering — great for learners';
  if (lowerLabel.includes('no pinky')) return 'Simplified version — easier for beginners';
  if (lowerLabel.includes('standard')) return 'Standard open position voicing';
  if (lowerLabel.includes('pinky')) return 'Alternative fingering using pinky';
  
  return '';
}

export default ChordDetail;