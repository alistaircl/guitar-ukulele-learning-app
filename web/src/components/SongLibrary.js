import React, { useState } from 'react';

const SONGS = [
  { id: 1, title: 'Somewhere Over the Rainbow', artist: 'Israel Kamakawiwo\'ole', difficulty: 'easy', key: 'C', bpm: 80 },
  { id: 2, title: 'You Are My Sunshine', artist: 'Traditional', difficulty: 'easy', key: 'C', bpm: 100 },
  { id: 3, title: 'Riptide', artist: 'Vance Joy', difficulty: 'medium', key: 'Am', bpm: 126 },
  { id: 4, title: 'House of Gold', artist: 'Twenty One Pilots', difficulty: 'medium', key: 'G', bpm: 85 },
  { id: 5, title: 'I\'m Yours', artist: 'Jason Mraz', difficulty: 'medium', key: 'B', bpm: 86 },
  { id: 6, title: 'Let It Be', artist: 'The Beatles', difficulty: 'easy', key: 'C', bpm: 76 },
  { id: 7, title: 'Stand By Me', artist: 'Ben E. King', difficulty: 'easy', key: 'A', bpm: 72 },
  { id: 8, title: 'Thinking Out Loud', artist: 'Ed Sheeran', difficulty: 'hard', key: 'Em', bpm: 79 },
];

function SongLibrary() {
  const [selectedSong, setSelectedSong] = useState(null);

  return (
    <div className="section">
      <h2 className="section-title">Song Library</h2>
      <div className="song-grid">
        {SONGS.map(song => (
          <div
            key={song.id}
            className="song-card"
            onClick={() => setSelectedSong(selectedSong?.id === song.id ? null : song)}
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
        <div className="section" style={{ marginTop: '1rem' }}>
          <h3>{selectedSong.title}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
            {selectedSong.artist} • {selectedSong.key} major • {selectedSong.bpm} BPM
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Visit Practice mode to learn this song chord by chord.
          </p>
        </div>
      )}
    </div>
  );
}

export default SongLibrary;