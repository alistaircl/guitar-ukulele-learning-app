import React, { useState } from 'react';
import Tuner from './components/Tuner';
import ChordLibrary from './components/ChordLibrary';
import SongLibrary from './components/SongLibrary';
import PracticeMode from './components/PracticeMode';

const TABS = [
  { id: 'tuner', label: 'Tuner', icon: '🎵' },
  { id: 'chords', label: 'Chords', icon: '🎸' },
  { id: 'songs', label: 'Songs', icon: '🎤' },
  { id: 'practice', label: 'Practice', icon: '🎯' },
];

function App() {
  const [activeTab, setActiveTab] = useState('tuner');
  const [practiceSongId, setPracticeSongId] = useState(null);

  const handleStartPractice = (song) => {
    setPracticeSongId(song.id);
    setActiveTab('practice');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'tuner': return <Tuner />;
      case 'chords': return <ChordLibrary />;
      case 'songs': return <SongLibrary onStartPractice={handleStartPractice} />;
      case 'practice': return <PracticeMode initialSongId={practiceSongId} onDone={() => setPracticeSongId(null)} />;
      default: return <Tuner />;
    }
  };

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="app-header" role="banner">
        <h1>🎸 Guitar & Ukulele Learning</h1>
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