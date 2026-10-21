import React from 'react';
import ChordDiagram from './ChordDiagram';
import { CHORD_FREQ } from '../components/PracticeMode';

// Compare two arrays by value.
function arraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

// Detect whether a voicing uses a barre: the same finger (>0) pressing 2+
// adjacent strings at the same fret (>0). Open/muted strings (fret <= 0)
// and finger 0 are ignored.
function isBarreVoicing(frets, fingers) {
  const groups = {};
  frets.forEach((fret, stringIdx) => {
    const finger = fingers[stringIdx] || 0;
    if (finger > 0 && fret > 0) {
      if (!groups[finger]) groups[finger] = [];
      groups[finger].push({ stringIdx, fret });
    }
  });
  return Object.values(groups).some(strings => {
    strings.sort((a, b) => a.stringIdx - b.stringIdx);
    for (let k = 1; k < strings.length; k++) {
      if (strings[k].stringIdx === strings[k - 1].stringIdx + 1 &&
          strings[k].fret === strings[k - 1].fret) {
        return true;
      }
    }
    return false;
  });
}

// Play a chord's notes using the shared CHORD_FREQ table (same source of
// truth as Practice Mode playback). Created on a user gesture so it works
// under browser autoplay policy.
function playChordNotes(freqs) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext || !freqs || freqs.length === 0) return;
  const ctx = new AudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  const now = ctx.currentTime;
  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  });
}

function playChordFor(chordName) {
  if (!chordName) return;
  const key = Object.keys(CHORD_FREQ).find(
    (k) => k.toLowerCase() === chordName.toLowerCase()
  );
  if (key) playChordNotes(CHORD_FREQ[key]);
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
  
  return (
    <div className="chord-detail">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        {!showPrimaryLabel && <h2 style={{ margin: 0 }}>{chord.name}</h2>}
        <button
          className="control-btn"
          onClick={() => playChordFor(chord.name)}
          aria-label={`Play ${chord.name} chord`}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', cursor: 'pointer' }}
        >
          ▶ Play chord
        </button>
      </div>
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
            <p className="variation-desc">{isBarreVoicing(chord.frets, chord.fingers) ? 'Barre chord shape — great for moving up the neck' : 'Standard open position voicing'}</p>
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