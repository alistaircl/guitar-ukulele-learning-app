import React, { useState } from 'react';
// import ChordDiagram from './ChordLibrary'; // Reuse the ChordDiagram from ChordLibrary
import SongDetail from './SongDetail';

// Import the song data with lyrics from PracticeMode
import { PRACTICE_SONGS } from './PracticeMode';

function SongLibrary({ onStartPractice }) {
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detail'

  // Find song by ID
  const selectedSong = PRACTICE_SONGS.find(s => s.id === selectedSongId);

  const handleSongSelect = (songId) => {
    setSelectedSongId(songId);
    setViewMode('detail');
  };

  const handleBackToGrid = () => {
    setSelectedSongId(null);
    setViewMode('grid');
  };

  return (
    <div className="section">
      <h2 className="section-title">Song Library</h2>
      
      {viewMode === 'grid' ? (
        // Song Grid View
        <div className="song-grid">
          {PRACTICE_SONGS.map(song => (
            <div
              key={song.id}
              className={`song-card ${selectedSongId === song.id ? 'selected' : ''}`}
              onClick={() => handleSongSelect(song.id)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSongSelect(song.id); } }}
              role="button"
              tabIndex={0}
              aria-pressed={selectedSongId === song.id}
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
      ) : (
        // Song Detail View
        <SongDetail 
          songId={selectedSongId} 
          onBack={handleBackToGrid} 
        />
      )}

      {/* Practice button (always visible in grid mode) */}
      {viewMode === 'grid' && selectedSongId && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            className="control-btn"
            onClick={(e) => { e.stopPropagation(); if (onStartPractice) onStartPractice(selectedSong); }}
          >
            🎯 Practice this song
          </button>
        </div>
      )}
    </div>
  );
}

export default SongLibrary;