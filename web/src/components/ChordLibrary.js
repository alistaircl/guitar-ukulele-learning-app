import React, { useState } from 'react';
import ChordDetail from './ChordDetail';
import ChordDiagram from './ChordDiagram';
import { FaArrowLeft, FaSearch, FaGuitar } from 'react-icons/fa';
import { getAllChords, searchChordsByInstrument } from '../data/chords';

// Safe storage helpers: try localStorage first, fall back to sessionStorage,
// and gracefully handle environments where both are unavailable (e.g. private
// browsing mode, disabled cookies/storage). Returns null and logs an
// informative warning on failure so callers can degrade gracefully.
const PREFERENCE_KEY = 'ukulele-chords-instrument';

function safeStorageGet(key) {
  for (const storeName of ['localStorage', 'sessionStorage']) {
    try {
      const store = window[storeName];
      const value = store.getItem(key);
      return value;
    } catch (e) {
      console.warn(`Could not read "${key}" from ${storeName}:`, e.message || e);
    }
  }
  return null;
}

// Attempt to persist. Returns true on success, false if every available
// store rejected the write (caller may surface a UI hint to the user).
function safeStorageSet(key, value) {
  for (const storeName of ['localStorage', 'sessionStorage']) {
    try {
      window[storeName].setItem(key, value);
      return true;
    } catch (e) {
      console.warn(`Could not save "${key}" to ${storeName}:`, e.message || e);
    }
  }
  return false;
}

function ChordLibrary() {
  const [selectedChord, setSelectedChord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [instrument, setInstrument] = useState(() => {
    // Load saved instrument from available storage on mount.
    // localStorage is preferred; sessionStorage is a fallback that at
    // least keeps the preference alive for the duration of the session.
    const saved = safeStorageGet(PREFERENCE_KEY);
    if (saved === 'guitar' || saved === 'ukulele') {
      return saved;
    }
    return 'ukulele'; // Default to ukulele
  });
  const [filteredChords, setFilteredChords] = useState(getAllChords('ukulele'));
  // null = unknown (no write attempted yet), true = saved, false = both
  // storage backends rejected the write — surface a UI hint in that case.
  const [preferenceSaved, setPreferenceSaved] = useState(null);

  // Update filtered chords when search query or instrument changes
  React.useEffect(() => {
    const chords = getAllChords(instrument);
    if (searchQuery.trim() === '') {
      setFilteredChords(chords);
    } else {
      setFilteredChords(searchChordsByInstrument(searchQuery, instrument));
    }
  }, [searchQuery, instrument]);

  // Save instrument preference to available storage when it changes.
  // localStorage is preferred; sessionStorage is a fallback. If both fail
  // (e.g. private browsing with all storage blocked), record it so the UI
  // can inform the user that their preference won't persist across refreshes.
  React.useEffect(() => {
    const saved = safeStorageSet(PREFERENCE_KEY, instrument);
    setPreferenceSaved(saved);
  }, [instrument]);

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {preferenceSaved === false && (
                <span
                  role="status"
                  aria-live="polite"
                  title="Private browsing mode or disabled browser storage prevents saving your instrument preference. It will reset to ukulele on refresh."
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.25rem',
                    height: '1.25rem',
                    borderRadius: '50%',
                    background: 'var(--warning)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'help'
                  }}
                  aria-label="Warning: instrument preference cannot be saved in this browser session"
                >
                  !
                </span>
              )}
              <button
                onClick={toggleInstrument}
                className="control-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'var(--bg-panel)',
                  border: `2px solid ${preferenceSaved === false ? 'var(--warning)' : 'var(--accent-primary)'}`,
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
                aria-label={`Switch to ${instrument === 'ukulele' ? 'guitar' : 'ukulele'} chords${preferenceSaved === false ? '. Note: preference cannot be saved in this session.' : ''}`}
              >
                {instrument === 'ukulele' ? <FaGuitar /> : <span style={{ fontSize: '1.2rem' }}>🎵</span>}
                {instrument === 'ukulele' ? 'Guitar' : 'Ukulele'}
              </button>
            </div>
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
      aria-label={`${chord.name} chord diagram showing ${chord.frets.filter(f => f > 0).length} finger positions${variationCount > 0 ? `, ${variationCount} variation${variationCount > 1 ? 's' : ''} available` : ''}`}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      <div className="chord-name">{chord.name}</div>
      <ChordDiagram frets={chord.frets} fingers={chord.fingers} size={100} className="chord-diagram" />
      <div className="chord-fingers">
        {fingerCount > 0
          ? `${fingerCount} finger${fingerCount > 1 ? 's' : ''}`
          : 'Open chord'}
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