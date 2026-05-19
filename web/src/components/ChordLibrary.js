import React, { useState } from 'react';
import ChordDetail from './ChordDetail';
import ChordDiagram from './ChordDiagram';
import { FaArrowLeft } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { ALL_CHORDS, searchChords } from '../data/chords';

function ChordLibrary() {
  const [selectedChord, setSelectedChord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChords, setFilteredChords] = useState(ALL_CHORDS);

  // Update filtered chords when search query changes
  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChords(ALL_CHORDS);
    } else {
      setFilteredChords(searchChords(searchQuery));
    }
  }, [searchQuery]);

  return (
    <div className="section">
      {selectedChord ? (
        <ChordPage 
          chord={selectedChord}
          onGoBack={() => setSelectedChord(null)}
        />
      ) : (
        <>
          <h2 className="section-title">Chord Library</h2>
          
          {/* Search bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search chords (C, G, Am, F, etc.)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>
          
          <div className="chord-grid">
            {filteredChords.map(chord => (
              <ChordCard
                key={chord.name}
                chord={chord}
                selected={false}
                onClick={() => setSelectedChord(chord)}
              />
            ))}
            {filteredChords.length === 0 && searchQuery.trim() !== '' && (
              <div className="no-results">
                No chords found for "{searchQuery}". Try a different search.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ChordPage({ chord, onGoBack }) {
  return (
    <div className="chord-page">
      <div className="chord-page-header">
        <button onClick={onGoBack} className="back-button">
          <FaArrowLeft /> Back to Chords
        </button>
        <h1>{chord.name}</h1>
      </div>
      <ChordDetail chord={chord} showPrimaryLabel={true} />
    </div>
  );
}

function ChordCard({ chord, selected, onClick }) {
  const fingerCount = chord.frets.filter(f => f > 0).length;
  return (
    <div
      className={`chord-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      aria-pressed={selected}
      aria-label={`${chord.name} chord diagram showing ${chord.frets.filter(f => f > 0).length} finger positions`}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      <div className="chord-name">{chord.name}</div>
      <ChordDiagram frets={chord.frets} fingers={chord.fingers} size={100} className="chord-diagram" />
      <div className="chord-fingers">
        {fingerCount > 0
          ? `${fingerCount} finger${fingerCount > 1 ? 's' : ''}`
          : 'Open chords'}
      </div>
    </div>
  );
}

export default ChordLibrary;