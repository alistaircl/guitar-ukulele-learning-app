import React, { useState } from 'react';
import ChordDetail from './ChordDetail';
import ChordDiagram from './ChordDiagram';
import { FaArrowLeft, FaSearch, FaGuitar } from 'react-icons/fa';
import { getAllChords, searchChordsByInstrument } from '../data/chords';

function ChordLibrary() {
  const [selectedChord, setSelectedChord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [instrument, setInstrument] = useState('ukulele');
  const [filteredChords, setFilteredChords] = useState(getAllChords('ukulele'));

  // Update filtered chords when search query or instrument changes
  React.useEffect(() => {
    const chords = getAllChords(instrument);
    if (searchQuery.trim() === '') {
      setFilteredChords(chords);
    } else {
      setFilteredChords(searchChordsByInstrument(searchQuery, instrument));
    }
  }, [searchQuery, instrument]);

  const toggleInstrument = () => {
    setInstrument(instrument === 'ukulele' ? 'guitar' : 'ukulele');
    setSearchQuery('');
  };

  return (
    <div className="section">
      {selectedChord ? (
        <ChordPage 
          chord={selectedChord}
          onGoBack={() => setSelectedChord(null)}
        />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Chord Library</h2>
            <button
              onClick={toggleInstrument}
              className="control-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--bg-panel)',
                border: '2px solid var(--accent-primary)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
              aria-label={`Switch to ${instrument === 'ukulele' ? 'guitar' : 'ukulele'} chords`}
            >
              {instrument === 'ukulele' ? <FaGuitar /> : <span style={{ fontSize: '1.2rem' }}>🎵</span>}
              {instrument === 'ukulele' ? 'Guitar' : 'Ukulele'}
            </button>
          </div>
          
          {/* Search bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder={`Search ${instrument} chords (C, G, Am, F, etc.)...`}
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
                selected={selectedChord?.name === chord.name}
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
  const variationCount = chord.variations ? chord.variations.length : 0;
  return (
    <div
      className={`chord-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      aria-pressed={selected}
      aria-label={`${chord.name} chord diagram showing ${chord.frets.filter(f => f > 0).length} finger positions${variationCount > 0 ? `, ${variationCount} variations available` : ''}`}
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
      {variationCount > 0 && (
        <div className="variations-badge">
          {variationCount} variation{variationCount > 1 ? 's' : ''} available
        </div>
      )}
    </div>
  );
}

export default ChordLibrary;