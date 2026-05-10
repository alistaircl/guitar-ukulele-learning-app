import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tuner from './components/Tuner';
import ChordLookup from './components/ChordLookup';
import SongLibrary from './components/SongLibrary';
import PracticeMode from './components/PracticeMode';
import Settings from './components/Settings';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Guitar & Ukulele Learning App</h1>
          <nav>
            <ul>
              <li><a href="/tuner">Tuner</a></li>
              <li><a href="/chords">Chords</a></li>
              <li><a href="/songs">Songs</a></li>
              <li><a href="/practice">Practice</a></li>
              <li><a href="/settings">Settings</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Tuner />} />
            <Route path="/tuner" element={<Tuner />} />
            <Route path="/chords" element={<ChordLookup />} />
            <Route path="/songs" element={<SongLibrary />} />
            <Route path="/practice" element={<PracticeMode />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <footer className="App-footer">
          <p>© 2026 Guitar & Ukulele Learning App</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;