import React from 'react';
import ChordDiagram from './ChordDiagram';

// Compare two arrays by value.
function arraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

function ChordDetail({ chord, showPrimaryLabel = false }) {
  const variations = chord.variations || [];
  // Filter out variations that are identical to the primary shape on BOTH frets
  // and fingers — those render the exact same diagram twice (issue #190).
  // Variations that share frets but use different fingers (e.g. "C (pinky)",
  // same shape played with finger 4 instead of 3) are preserved because the
  // finger dots differ and the alternative fingering is genuinely useful.
  const distinctVariations = variations.filter(
    (v) => !(arraysEqual(v.frets, chord.frets) && arraysEqual(v.fingers, chord.fingers))
  );
  // The primary voicing is always rendered separately above (lines "Always
  // display the primary chord first"), so the variation list must NOT rename
  // its first entry to 'Primary'. Doing so duplicated the 'Primary' label and
  // erased the first variation's real name and description (issue #212).
  const allVariations = distinctVariations;
  
  // Determine description for the primary chord based on its shape
  // Check if it's a barre chord (same finger on 2+ adjacent strings at same fret)
  const getPrimaryDescription = (frets, fingers) => {
    if (!fingers || fingers.length === 0) return 'Standard open position voicing';
    
    // Group strings by finger number (ignore 0 and negative)
    const fingerGroups = {};
    frets.forEach((fret, stringIdx) => {
      const finger = fingers[stringIdx] || 0;
      if (finger > 0 && fret > 0) {
        if (!fingerGroups[finger]) {
          fingerGroups[finger] = [];
        }
        fingerGroups[finger].push({ stringIdx, fret });
      }
    });
    
    // Check if any finger spans 2+ adjacent strings at the same fret (barre)
    for (const finger of Object.keys(fingerGroups)) {
      const strings = fingerGroups[finger].sort((a, b) => a.stringIdx - b.stringIdx);
      for (let i = 0; i < strings.length - 1; i++) {
        if (strings[i].stringIdx + 1 === strings[i + 1].stringIdx && 
            strings[i].fret === strings[i + 1].fret) {
          return 'Barre chord shape — great for moving up the neck';
        }
      }
    }
    
    return 'Standard open position voicing';
  };
  
  const primaryDescription = getPrimaryDescription(chord.frets, chord.fingers);

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
            <p className="variation-desc">{primaryDescription}</p>
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
      {!showPrimaryLabel && distinctVariations.length === 0 && (
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