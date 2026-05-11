import React, { useState } from 'react';

const SONGS = [
  { id: 1, title: 'Somewhere Over the Rainbow', artist: 'Israel Kamakawiwoʻole', difficulty: 'easy', key: 'C', bpm: 80,
    chords: ['C', 'F', 'G', 'Em', 'Am'] },
  { id: 2, title: 'You Are My Sunshine', artist: 'Traditional', difficulty: 'easy', key: 'C', bpm: 100,
    chords: ['C', 'F', 'G'] },
  { id: 3, title: 'Riptide', artist: 'Vance Joy', difficulty: 'medium', key: 'Am', bpm: 126,
    chords: ['Am', 'G', 'C', 'F'] },
  { id: 4, title: 'House of Gold', artist: 'Twenty One Pilots', difficulty: 'medium', key: 'G', bpm: 85,
    chords: ['G', 'C', 'Em', 'D'] },
  { id: 5, title: 'I\'m Yours', artist: 'Jason Mraz', difficulty: 'medium', key: 'B', bpm: 86,
    chords: ['B', 'E', 'G#m', 'F#'] },
  { id: 6, title: 'Let It Be', artist: 'The Beatles', difficulty: 'easy', key: 'C', bpm: 76,
    chords: ['C', 'G', 'Am', 'F'] },
  { id: 7, title: 'Stand By Me', artist: 'Ben E. King', difficulty: 'easy', key: 'A', bpm: 72,
    chords: ['A', 'F#m', 'D', 'E'] },
  { id: 8, title: 'Thinking Out Loud', artist: 'Ed Sheeran', difficulty: 'hard', key: 'Em', bpm: 79,
    chords: ['Em', 'G', 'D', 'C'] },
];

function SongLibrary({ onStartPractice }) {
  const [selectedSong, setSelectedSong] = useState(null);

  return (
    <div className="section">
      <h2 className="section-title">Song Library</h2>
      <div className="song-grid">
        {SONGS.map(song => (
          <div
            key={song.id}
            className={`song-card ${selectedSong?.id === song.id ? 'selected' : ''}`}
            onClick={() => setSelectedSong(selectedSong?.id === song.id ? null : song)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedSong(selectedSong?.id === song.id ? null : song); } }}
            role="button"
            tabIndex={0}
            aria-pressed={selectedSong?.id === song.id}
            aria-label={`${song.title} by ${song.artist}, ${song.difficulty} difficulty`}
          >
            <div className="song-title">{song.title}</div>
            <div className="song-artist">{song.artist}</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className={`song-difficulty ${song.difficulty}`}>{song.difficulty}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Key: {song.key} • {song.bpm} BPM
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedSong && (
        <div className="section" style={{ marginTop: '1.5rem', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>{selectedSong.title}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>
                {selectedSong.artist} • {selectedSong.key} major • {selectedSong.bpm} BPM
              </p>
            </div>
            <button
              className="control-btn"
              style={{ background: 'var(--success)', flexShrink: 0 }}
              onClick={(e) => { e.stopPropagation(); if (onStartPractice) onStartPractice(selectedSong); }}
            >
              🎯 Practice this song
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Chords used:
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {selectedSong.chords.map(chord => (
                <span key={chord} style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--accent-primary)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.7rem',
                  fontSize: '0.9rem',
                  color: 'var(--accent-primary)',
                }}>
                  {chord}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SongLibrary;
export { SONGS };