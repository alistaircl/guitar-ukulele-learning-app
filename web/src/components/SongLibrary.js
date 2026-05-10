import React, { useState } from 'react';
import { SONG_DATA } from '../models/SongData';

const SongLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Mock favorites
  const favorites = JSON.parse(localStorage.getItem('guitarUkuleleFavoriteSongs') || '[]');

  // Filter songs based on search
  const filteredSongs = SONG_DATA.filter(song =>
    searchQuery === '' ||
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (songId) => {
    const favs = JSON.parse(localStorage.getItem('guitarUkuleleFavoriteSongs') || '[]');
    const index = favs.indexOf(songId);
    if (index === -1) {
      favs.push(songId);
    } else {
      favs.splice(index, 1);
    }
    localStorage.setItem('guitarUkuleleFavoriteSongs', JSON.stringify(favs));
  };

  return (
    <div className="song-library">
      <h2>Song Library</h2>
      
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search songs by title or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setSearchQuery('')}>
            ×
          </button>
        </div>
        
        <div className="filter-options">
          <label>
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            />
            Show Favorites Only
          </label>
        </div>
      </div>

      {showFavoritesOnly && favorites.length === 0 ? (
        <p className="no-favorites">No favorite songs yet. Click the star icon to add songs to your favorites.</p>
      ) : (
        <div className="song-list">
          {(showFavoritesOnly ? 
            SONG_DATA.filter(song => favorites.includes(song.id)) : 
            filteredSongs
          ).map(song => (
            <div key={song.id} className="song-card">
              <div className="song-info">
                <h3>{song.title}</h3>
                <p className="artist">{song.artist}</p>
                {song.album && <p className="album">{song.album}</p>}
              </div>
              <div className="song-meta">
                <span className="duration">{song.durationFormatted}</span>
                <span className="difficulty">{song.difficulty}</span>
                <button
                  className="favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(song.id);
                  }}
                >
                  ★
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSong && (
        <div className="song-detail">
          <h2>{selectedSong.title}</h2>
          <p className="artist">by {selectedSong.artist}</p>
          {selectedSong.album && <p className="album">Album: {selectedSong.album}</p>}
          
          <div className="song-tabs">
            <button 
              className={`tab-btn ${selectedTab === 'chords' ? 'active' : ''}`}
              onClick={() => setSelectedTab('chords')}
            >
              Chords
            </button>
            <button 
              className={`tab-btn ${selectedTab === 'lyrics' ? 'active' : ''}`}
              onClick={() => setSelectedTab('lyrics')}
            >
              Lyrics
            </button>
            <button 
              className={`tab-btn ${selectedTab === 'tabs' ? 'active' : ''}`}
              onClick={() => setSelectedTab('tabs')}
            >
              Tablature
            </button>
          </div>
          
          {selectedTab === 'chords' && (
            <div className="chords-section">
              <h3>Chords Used</h3>
              <div className="chord-tags">
                {selectedSong.chords.map(chord => (
                  <span key={chord} className="chord-tag">{chord}</span>
                ))}
              </div>
            </div>
          )}
          
          {selectedTab === 'lyrics' && (
            <div className="lyrics-section">
              <h3>Lyrics</h3>
              <div className="lyrics-text">{selectedSong.lyrics}</div>
            </div>
          )}
          
          {selectedTab === 'tabs' && (
            <div className="tabs-section">
              <h3>Tablature</h3>
              <pre className="tab-content">{selectedSong.tablature}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SongLibrary;

// Initialize selectedTab state (this is a simplification - in practice would use useState inside component)
let selectedTab = 'chords';