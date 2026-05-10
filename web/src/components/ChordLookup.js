import React, { useState } from 'react';
import { CHORD_DATABASE } from '../models/ChordData';
import { Instrument } from '../models/Instrument';

const ChordLookup = () => {
  const [instrument, setInstrument] = useState(Instrument.GUITAR);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChord, setSelectedChord] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Get chords for selected instrument
  const chords = CHORD_DATABASE[instrument] || {};
  
  // Filter chords based on search
  const filteredChords = Object.keys(chords)
    .filter(chord => 
      searchQuery === '' || 
      chord.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort();

  // Mock favorites (in a real app, this would come from localStorage or a backend)
  const favorites = JSON.parse(localStorage.getItem('guitarUkuleleFavorites') || '[]');

  const toggleFavorite = (chord) => {
    const favs = JSON.parse(localStorage.getItem('guitarUkuleleFavorites') || '[]');
    const index = favs.indexOf(chord);
    if (index === -1) {
      favs.push(chord);
    } else {
      favs.splice(index, 1);
    }
    localStorage.setItem('guitarUkuleleFavorites', JSON.stringify(favs));
  };

  const selectChord = (chord) => {
    setSelectedChord(selectedChord === chord ? null : chord);
  };

  return (
    <div className="chord-lookup">
      <h2>{instrument === Instrument.GUITAR ? 'Guitar Chords' : 'Ukulele Chords'}</h2>
      
      <div className="controls">
        <div className="instrument-selector">
          <label>
            <input
              type="radio"
              value={Instrument.GUITAR}
              checked={instrument === Instrument.GUITAR}
              onChange={(e) => setInstrument(Instrument.GUITAR)}
            />
            Guitar
          </label>
          <label>
            <input
              type="radio"
              value={Instrument.UKULELE}
              checked={instrument === Instrument.UKULELE}
              onChange={(e) => setInstrument(Instrument.UKULELE)}
            />
            Ukulele
          </label>
        </div>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Search chords (e.g., C, G, Am7)..."
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
        <p className="no-favorites">No favorite chords yet. Click the star icon to add chords to your favorites.</p>
      ) : (
        <div className="chord-grid">
          {(showFavoritesOnly ? 
            favorites.filter(chord => chords[chord]) : 
            filteredChords
          ).map(chord => (
            <div 
              key={chord} 
              className={`chord-card ${selectedChord === chord ? 'selected' : ''}`}
              onClick={() => selectChord(chord)}
            >
              <div className="chord-name">{chord}</div>
              <button 
                className="favorite-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent chord selection
                  toggleFavorite(chord);
                }}
              >
                ★
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedChord && chords[selectedChord] && (
        <div className="chord-detail">
          <h3>{selectedChord}</h3>
          <div className="chord-positions">
            {chords[selectedChord].map((position, index) => (
              <div key={index} className="chord-position">
                <div className="position-label">Position {index + 1}</div>
                <div className="chord-diagram">
                  {/* Render chord diagram - simplified for now */}
                  <div className="strings">
                    {position.map((fret, stringIndex) => (
                      <div key={stringIndex} className={`string ${fret === -1 ? 'muted' : fret === 0 ? 'open' : 'fretted'}`}>
                        {fret === -1 ? 'x' : fret === 0 ? 'o' : fret}
                      </div>
                    ))}
                  </div>
                  <div className="frets">
                    {/* Show fret numbers */}
                  </div>
                </div>
                <div className="fingering">
                  {/* Fingering would go here */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChordLookup;