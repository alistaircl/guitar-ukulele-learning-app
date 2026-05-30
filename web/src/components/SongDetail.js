import React from 'react';
// Import the song data with lyrics from PracticeMode
import { PRACTICE_SONGS } from './PracticeMode';

function SongDetail({ songId, onBack }) {
  // Find the song by ID
  const song = PRACTICE_SONGS.find(s => s.id === songId);

  if (!song) {
    return <div>Song not found</div>;
  }

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