import React, { useState, useEffect } from 'react';
import Tuner from './components/Tuner';
import ChordLibrary from './components/ChordLibrary';
import SongLibrary from './components/SongLibrary';
import PracticeMode from './components/PracticeMode';
import { useToast } from './components/Toast';
import { safeStorageGet, safeStorageSet } from './utils/safeStorage';

const TABS = [
  { id: 'tuner', label: 'Tuner', icon: '🎵' },
    { id: 'chords', label: 'Chord Library', icon: '🎸' },
  { id: 'songs', label: 'Songs', icon: '🎤' },
  { id: 'practice', label: 'Practice', icon: '🎯' },
];

function App() {
  const { add: addToast } = useToast();
  const [activeTab, setActiveTab] = useState('tuner');
  const [practiceSongId, setPracticeSongId] = useState(null);
  // Shared instrument preference (ukulele | guitar), persisted so chord
  // diagrams in the song detail view match the user's chosen instrument
  // (issue #270). Defaults to ukulele for backwards compatibility.
  const INSTRUMENT_PREFERENCE_KEY = 'guitar-ukulele-instrument';
  const [instrument, setInstrument] = useState(() => {
    const { value: saved, error } = safeStorageGet(INSTRUMENT_PREFERENCE_KEY);
    if (error) {
      addToast(`Unable to read your saved instrument preference: ${error.message}`);
    }
    if (saved === 'guitar' || saved === 'ukulele') return saved;
    return 'ukulele';
  });
  useEffect(() => {
    if (!safeStorageSet(INSTRUMENT_PREFERENCE_KEY, instrument)) {
      addToast('Unable to save your instrument preference (storage unavailable or full).');
    }
  }, [instrument, addToast]);

  const handleStartPractice = (song) => {
    setPracticeSongId(song.id);
    setActiveTab('practice');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'tuner': return <Tuner instrument={instrument} setInstrument={setInstrument} />;
      case 'chords': return <ChordLibrary instrument={instrument} setInstrument={setInstrument} />;
      case 'songs': return <SongLibrary instrument={instrument} onStartPractice={handleStartPractice} />;
      case 'practice': return <PracticeMode initialSongId={practiceSongId} onDone={() => setPracticeSongId(null)} />;
      default: return <Tuner />;
    }
  };

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="app-header" role="banner">
        <h1>Guitar & Ukulele Learning</h1>
      </header>

      <main className="main-content" id="main-content" role="main">
        {renderContent()}
      </main>

      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        <div className="nav-list">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              id={`tab-${tab.id}`}
            >
              <span className="nav-icon" aria-hidden="true">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;