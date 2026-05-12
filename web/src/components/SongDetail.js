import React, { useState } from 'react';
import ChordDiagram from './ChordLibrary'; // Reuse the ChordDiagram from ChordLibrary
// Import the song data with lyrics from PracticeMode
import { PRACTICE_SONGS } from './PracticeMode';

function SongDetail({ songId, onBack }) {
  // Find the song by ID
  const song = PRACTICE_SONGS.find(s => s.id === songId);
  
  // Initialize state BEFORE any conditional returns
  const [selectedChord, setSelectedChord] = useState(null);

  if (!song) {
    return <div>Song not found</div>;
  }

  // Get unique chords in order of appearance
  const uniqueChords = [...new Set(song.chords)];

  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button 
          className="control-btn" 
          onClick={onBack}
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          ← Back to Songs
        </button>
        <h2 style={{ margin: 0 }}>{song.title}</h2>
      </div>
      
      <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        {song.artist} • {song.key} major • {song.bpm} BPM
      </div>

      {/* Concise Chords Section - just show chord names, no diagrams */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Chords in this song</h3>
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {uniqueChords.map((chord, index) => (
            <span 
              key={`${song.id}-chord-${index}`} 
              onClick={() => setSelectedChord(chord)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedChord(chord); } }}
              role="button"
              tabIndex={0}
              aria-pressed={selectedChord === chord}
              style={{
                border: selectedChord === chord ? '2px solid var(--accent-primary)' : '1px solid var(--bg-tertiary)',
                borderRadius: '4px',
                padding: '0.3rem 0.6rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                background: selectedChord === chord ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: selectedChord === chord ? 'white' : 'var(--text-primary)'
              }}
            >
              {chord}
            </span>
          ))}
        </div>
      </div>

      {/* Selected Chord Detail (optional - show when chord is clicked) */}
      {selectedChord && (
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>{selectedChord} Chord</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ChordDiagram 
              frets={getChordFrets(selectedChord)} 
              size={100} 
            />
            <div>
              <p style={{ margin: '0.25rem 0' }}>
                <strong>Finger positions:</strong> {getChordFingering(selectedChord)}
              </p>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <strong>Strings:</strong> G–C–E–A (top to bottom)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lyrics Section with chords overlay */}
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Lyrics</h3>
        <div style={{ lineHeight: '2.0', fontSize: '1.1rem', position: 'relative' }}>
          {song.lyrics.map((line, index) => (
            <div 
              key={`${song.id}-lyric-${index}`} 
              style={{ 
                position: 'relative', 
                marginBottom: '1.5rem',
                minHeight: '2.5rem'  // Ensure space for chord above
              }}
            >
              {/* Chord above the lyric line */}
              {line.chord && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    left: 0, 
                    top: '-1.8rem', 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    color: 'var(--accent-primary)',
                    textAlign: 'center',
                    minWidth: '2rem'
                  }}
                >
                  {line.chord}
                </div>
              )}
              <div style={{ marginLeft: line.chord ? '2.5rem' : 0, lineHeight: '2.0' }}>
                {line.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper functions to get chord data
function getChordFrets(chordName) {
  // Map chord names to their fret positions (from ChordLibrary.js data)
  const chordMap = {
    'C': [0, 0, 0, 3],
    'G': [0, 2, 3, 2],
    'Am': [2, 0, 0, 0],
    'F': [2, 0, 1, 0],
    'Em': [0, 4, 3, 2],
    'D': [2, 2, 2, 0],
    'A': [2, 1, 0, 0],
    'E': [1, 4, 0, 2],
    'Dm': [2, 2, 1, 0],
    'B7': [2, 3, 2, 2],
    'E7': [1, 2, 0, 2],
    'A7': [0, 1, 0, 0],
    'G#m': [2, 1, 2, 2], // Approximate
    'F#': [2, 1, 2, 0],  // Approximate
    // Add more as needed
  };
  
  return chordMap[chordName] || [0, 0, 0, 0]; // Default to open if not found
}

function getChordFingering(chordName) {
  // Map chord names to their finger positions
  const fingeringMap = {
    'C': '0-0-0-3',
    'G': '0-1-3-2',
    'Am': '1-0-0-0',
    'F': '2-0-1-0',
    'Em': '0-4-2-1',
    'D': '1-2-3-0',
    'A': '2-1-0-0',
    'E': '1-4-0-2',
    'Dm': '2-3-1-0',
    'B7': '1-3-2-1',
    'E7': '1-2-0-3',
    'A7': '0-1-0-0',
    'G#m': '2-1-2-2', // Approximate
    'F#': [2, 1, 2, 0],  // Approximate
    // Add more as needed
  };
  
  return fingeringMap[chordName] || '0-0-0-0'; // Default if not found
}

export default SongDetail;