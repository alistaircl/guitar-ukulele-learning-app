import React from 'react';
// Import the song data with lyrics from PracticeMode
import { PRACTICE_SONGS } from './PracticeMode';
// Import chord diagram + lookup so the song detail view can render
// fretboard diagrams for each chord used in the song (fixes #183).
import ChordDiagram from './ChordDiagram';
import { getChordByName } from '../data/chords';

function SongDetail({ songId, onBack }) {
  // Find the song by ID
  const song = PRACTICE_SONGS.find(s => s.id === songId);

  if (!song) {
    return <div>Song not found</div>;
  }

  // Resolve each chord name used in the song to its frets/fingers data.
  // Songs store chord names (e.g. 'Am', 'F#'); the chord library's
  // getChordByName() looks up the matching shape. If a chord isn't in the
  // database we still show its name so users at least see what's required.
  const resolvedChords = (song.chords || []).map(name => ({
    name,
    chord: getChordByName(name),
  }));

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
      
      <div style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        {song.artist} • Key: {song.key} • {song.bpm} BPM
      </div>

      {/* Chord reference: diagrams for every chord used in the song (#183).
          Rendered before the chord sheet so users have a fretboard reference
          without having to flip to the Chord Library tab. */}
      {resolvedChords.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Chords Used</h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}
            aria-label={`Chord diagrams for ${song.title}`}
          >
            {resolvedChords.map(({ name, chord }) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.5rem 0.5rem 0.6rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  minWidth: '90px',
                }}
              >
                <div
                  style={{
                    fontWeight: '700',
                    color: 'var(--accent-primary)',
                    marginBottom: '0.25rem',
                    fontSize: '0.95rem',
                  }}
                >
                  {name}
                </div>
                {chord ? (
                  <ChordDiagram
                    frets={chord.frets}
                    fingers={chord.fingers}
                    size={90}
                    className="chord-diagram"
                    aria-label={`${name} chord diagram`}
                  />
                ) : (
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      padding: '0 0.25rem',
                    }}
                    aria-label={`${name} chord diagram not available in library`}
                  >
                    Diagram not in library
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chord sheet view: chords inline above lyrics — Ultimate Guitar style */}
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Chord Sheet</h3>
        <div style={{ 
          fontFamily: '"Fira Code", "SF Mono", "Cascadia Code", monospace',
          fontSize: '1rem', 
          lineHeight: '1.1',
          whiteSpace: 'pre-wrap',
          background: 'var(--bg-tertiary)',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          overflowX: 'auto'
        }}>
          {song.lyrics.map((line, index) => (
            <div 
              key={`${song.id}-lyric-${index}`} 
              style={{ marginBottom: '0.3rem' }}
            >
              {/* Chord line — shown above lyrics when present */}
              {line.chord && (
                <div style={{ 
                  color: 'var(--accent-primary)', 
                  fontWeight: '600',
                  marginBottom: '0.1rem'
                }}>
                  {line.chord}
                </div>
              )}
              {/* Lyric line */}
              <div style={{ color: 'var(--text-primary)' }}>
                {line.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SongDetail;
