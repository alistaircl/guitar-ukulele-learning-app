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
      <header className="app-header">
        <h1>🎸 Ukulele Learning</h1>
      </header>

      <main className="main-content">
        {renderContent()}
      </main>

      <nav className="bottom-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;