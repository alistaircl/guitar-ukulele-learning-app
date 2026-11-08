import React, { useState } from 'react';
// import ChordDiagram from './ChordLibrary'; // Reuse the ChordDiagram from ChordLibrary
import SongDetail from './SongDetail';

// Import the song data with lyrics from PracticeMode
import { PRACTICE_SONGS } from './PracticeMode';

// Map difficulty values to CSS class names
const DIFFICULTY_CLASS_MAP = {
  'Beginner': 'easy',
  'Intermediate': 'medium',
  'Hard': 'hard'
};

// Persist Song Library filters (search, difficulty, key) so they survive
// navigating away from the Songs tab and returning (issue #482).
const SONG_FILTERS_KEY = 'guitar-ukulele-song-filters';

const loadSavedFilters = () => {
  try {
    const raw = localStorage.getItem(SONG_FILTERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        searchQuery: parsed.searchQuery ?? '',
        difficultyFilter: parsed.difficultyFilter ?? 'All',
        keyFilter: parsed.keyFilter ?? 'All',
      };
    }
  } catch (e) {
    // localStorage unavailable or corrupt — start from defaults
  }
  return { searchQuery: '', difficultyFilter: 'All', keyFilter: 'All' };
};

function SongLibrary({ instrument = 'ukulele', onStartPractice }) {
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detail'
  // Restore persisted filters so they survive navigating away and back (issue #482)
  const initialFilters = loadSavedFilters();
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery);
  const [difficultyFilter, setDifficultyFilter] = useState(initialFilters.difficultyFilter);
  const [keyFilter, setKeyFilter] = useState(initialFilters.keyFilter);

  // Get unique difficulties and keys for filter dropdowns
  const difficulties = ['All', ...new Set(PRACTICE_SONGS.map(s => s.difficulty))];
  const keys = ['All', ...new Set(PRACTICE_SONGS.map(s => s.key))];

  // Filter songs based on search and filters
  const filteredSongs = PRACTICE_SONGS.filter(song => {
    const matchesSearch = searchQuery === '' || 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || song.difficulty === difficultyFilter;
    const matchesKey = keyFilter === 'All' || song.key === keyFilter;
    return matchesSearch && matchesDifficulty && matchesKey;
  });

  // Persist filters whenever they change so they survive navigation (issue #482)
  React.useEffect(() => {
    try {
      localStorage.setItem(
        SONG_FILTERS_KEY,
        JSON.stringify({
          searchQuery,
          difficultyFilter,
          keyFilter,
        })
      );
    } catch (e) {
      // localStorage unavailable or full — filters won't persist across sessions
    }
  }, [searchQuery, difficultyFilter, keyFilter]);

  // Find song by ID
  const selectedSong = PRACTICE_SONGS.find(s => s.id === selectedSongId);

  const handleSongSelect = (songId) => {
    setSelectedSongId(songId);
    setViewMode('detail');
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
  };

  return (
    <div className="section">
      <h2 className="section-title">Song Library</h2>
      
      {/* Search and Filter Bar (hidden while a song detail is open - issue #315) */}
      {viewMode === 'grid' && (
        <div className="search-bar" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className="search-icon">🔍</div>
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search songs"
          />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="search-input"
            style={{ maxWidth: '150px' }}
            aria-label="Filter by difficulty"
          >
            {difficulties.map(d => (
              <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>
            ))}
          </select>
          <select
            value={keyFilter}
            onChange={(e) => setKeyFilter(e.target.value)}
            className="search-input"
            style={{ maxWidth: '120px' }}
            aria-label="Filter by key"
          >
            {keys.map(k => (
              <option key={k} value={k}>{k === 'All' ? 'All Keys' : k}</option>
            ))}
          </select>
        </div>
      )}
      
      {viewMode === 'grid' ? (
        // Song Grid View
        <div className="song-grid">
          {filteredSongs.length === 0 ? (
            <div className="no-results">
              No songs found matching your search and filters.
            </div>
          ) : (
            filteredSongs.map(song => (
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
                  <span className={`song-difficulty ${DIFFICULTY_CLASS_MAP[song.difficulty] || song.difficulty}`}>{song.difficulty}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Key: {song.key} • {song.bpm} BPM
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // Song Detail View
        <SongDetail 
          songId={selectedSongId} 
          onBack={handleBackToGrid}
          onStartPractice={onStartPractice}
          instrument={instrument}
        />
      )}

      {/* Practice button (always visible in grid mode) */}
      {viewMode === 'grid' && selectedSongId && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            type="button"
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