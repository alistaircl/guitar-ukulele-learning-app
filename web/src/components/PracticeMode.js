import React, { useState, useRef, useEffect } from 'react';

const PRACTICE_SONGS = [
  { id: 1, title: 'Somewhere Over the Rainbow',
    artist: 'Israel Kamakawiwo\'ole',
    difficulty: 'Beginner',
    key: 'C',
    bpm: 66,
    chords: ['C', 'F', 'G', 'Em', 'Am'],
    lyrics: [
      { text: 'Someday', chord: 'C' },
      { text: "I'll wish upon a star", chord: null },
      { text: 'Wake up where the clouds are far behind me', chord: 'F' },
      { text: 'Where trouble melts like lemon drops', chord: 'G' },
      { text: 'High above the chimney top', chord: 'Em' },
      { text: "That's where you'll find me", chord: 'Am' },
    ]
  },
  { id: 2, title: 'You Are My Sunshine',
    artist: 'Traditional',
    difficulty: 'Beginner',
    key: 'C',
    bpm: 138,
    chords: ['C', 'F', 'G'],
    lyrics: [
      { text: 'You are my sunshine', chord: 'C' },
      { text: 'My only sunshine', chord: 'F' },
      { text: 'You make me happy', chord: 'C' },
      { text: "When skies are gray", chord: 'G' },
      { text: "You'll never know dear", chord: 'C' },
      { text: 'How much I love you', chord: 'F' },
      { text: "Please don't take", chord: 'C' },
      { text: 'My sunshine away', chord: 'G' },
    ]
  },
  { id: 3, title: 'Let It Be',
    artist: 'The Beatles',
    difficulty: 'Beginner',
    key: 'C',
    bpm: 76,
    chords: ['C', 'G', 'Am', 'F'],
    lyrics: [
      { text: 'When I find myself in times of trouble', chord: 'C' },
      { text: 'Mother Mary comes to me', chord: 'G' },
      { text: 'Speaking words of wisdom', chord: 'Am' },
      { text: 'Let it be', chord: 'F' },
      { text: 'And in my hour of darkness', chord: 'C' },
      { text: 'She is standing right in front of me', chord: 'G' },
      { text: 'Speaking words of wisdom', chord: 'Am' },
      { text: 'Let it be', chord: 'F' },
    ]
  },
  { id: 4, title: 'House of Gold',
    artist: 'Twenty One Pilots',
    difficulty: 'Intermediate',
    key: 'G',
    bpm: 150,
    chords: ['G', 'C', 'Em', 'D'],
    lyrics: [
      { text: 'How do you think I\'m going to feel', chord: 'G' },
      { text: 'When I\'m coming home again', chord: 'C' },
      { text: 'Tell me tell me', chord: 'Em' },
      { text: 'What do you see when you look at me', chord: 'D' },
    ]
  },
  { id: 5, title: 'Stand By Me',
    artist: 'Ben E. King',
    difficulty: 'Intermediate',
    key: 'A',
    bpm: 120,
    chords: ['A', 'F#m', 'D', 'E'],
    lyrics: [
      { text: 'When the night has come', chord: 'A' },
      { text: 'And the land is dark', chord: 'F#m' },
      { text: 'And the moon is the only light we\'ll see', chord: 'D' },
      { text: 'No I won\'t be afraid', chord: 'E' },
    ]
  },
  { id: 6, title: 'Riptide',
    artist: 'Vance Joy',
    difficulty: 'Intermediate',
    key: 'Am',
    bpm: 158,
    chords: ['Am', 'G', 'C', 'F'],
    lyrics: [
      { text: 'I was scared of dentists and the dark', chord: 'Am' },
      { text: 'I was scared of pretty girls and Sunday mornings', chord: 'G' },
      { text: 'I was scared of little bits of paper in the park', chord: 'C' },
      { text: 'And I turned around and you were gone', chord: 'F' },
    ]
  },
  { id: 7, title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    difficulty: 'Intermediate',
    key: 'D',
    bpm: 79,
    chords: ['Em', 'G', 'D', 'C'],
    lyrics: [
      { text: 'When your legs don\'t work like they used to before', chord: 'Em' },
      { text: 'And I can\'t sweep you off of your feet', chord: 'G' },
      { text: 'Will your mouth still remember the taste of my love', chord: 'D' },
      { text: 'Will your eyes still smile from your cheeks', chord: 'C' },
    ]
  },
  { id: 8, title: 'I\'m Yours',
    artist: 'Jason Mraz',
    difficulty: 'Beginner',
    key: 'B',
    bpm: 104,
    chords: ['B', 'E', 'G#m', 'F#'],
    lyrics: [
      { text: 'Well I\'ve been playing hard to get', chord: 'B' },
      { text: 'Time to make my heart bet', chord: 'E' },
      { text: 'I wanna be yours, pretty baby', chord: 'G#m' },
      { text: 'Don\'t you make me wait too long', chord: 'F#' },
    ]
  },
];

function PracticeMode({ initialSongId, onDone }) {
  const [selectedSong, setSelectedSong] = useState(() => {
    if (initialSongId) {
      const found = PRACTICE_SONGS.find(s => s.id === initialSongId);
      return found || PRACTICE_SONGS[0];
    }
    return PRACTICE_SONGS[0];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const audioCtxRef = useRef(null);

  // If initialSongId changes (user picks a new song from SongLibrary), switch to it
  React.useEffect(() => {
    if (initialSongId) {
      const found = PRACTICE_SONGS.find(s => s.id === initialSongId);
      if (found) {
        setSelectedSong(found);
        setCurrentIndex(0);
        setShowNext(false);
        setFeedback(null);
      }
    }
  }, [initialSongId]);

  const playNote = (freq) => {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.5);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.5);
  };

  const CHORD_FREQ = { 'C': 261.63, 'F': 349.23, 'G': 392.00, 'Em': 329.63, 'Am': 440.00, 'E': 329.63 };

  const playChord = (chord) => {
    const freq = CHORD_FREQ[chord] || 440;
    playNote(freq);
  };

  const nextLine = () => {
    if (currentIndex < selectedSong.lyrics.length - 1) {
      setCurrentIndex(i => i + 1);
      setShowNext(false);
      setFeedback(null);
    }
  };

  const prevLine = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setShowNext(false);
      setFeedback(null);
    }
  };

  const revealAnswer = () => setShowNext(true);

  const markCorrect = () => {
    setFeedback('correct');
    setStreak(s => s + 1);
    setTotalCorrect(t => t + 1);
    playChord(selectedSong.lyrics[currentIndex].chord);
    setTimeout(nextLine, 1500);
  };

  const markIncorrect = () => {
    setFeedback('incorrect');
    setStreak(0);
    setTimeout(() => setFeedback(null), 1000);
  };

  useEffect(() => {
    return () => { if (audioCtxRef.current) audioCtxRef.current.close(); };
  }, []);

  const current = selectedSong.lyrics[currentIndex];

  return (
    <div className="section">
      <h2 className="section-title">Practice Mode</h2>

      <div className="practice-container">
        <div className="practice-controls">
          <select
            value={selectedSong?.title || ''}
            onChange={e => { setSelectedSong(PRACTICE_SONGS.find(s => s.title === e.target.value)); setCurrentIndex(0); setShowNext(false); setFeedback(null); }}
            style={{ padding: '0.5rem', borderRadius: 8, border: 'none', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
          >
            {PRACTICE_SONGS.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
          </select>
          <button className="control-btn" onClick={prevLine} disabled={currentIndex === 0}>← Prev</button>
          <button className="control-btn" onClick={revealAnswer} disabled={showNext}>Show Chords</button>
          <button className="control-btn" onClick={nextLine} disabled={currentIndex === selectedSong.lyrics.length - 1}>Next →</button>
        </div>

        <div className="practice-display">
          {selectedSong.lyrics.map((line, idx) => (
            <div
              key={idx}
              className="practice-lyrics"
              style={{ opacity: idx === currentIndex ? 1 : 0.3, fontSize: idx === currentIndex ? '1.5rem' : '1rem' }}
            >
              <div className={`practice-chord ${showNext && idx === currentIndex ? 'active' : ''}`}>
                {showNext || idx < currentIndex ? line.chord || '—' : '♪'}
              </div>
              {line.text}
            </div>
          ))}
        </div>

        {feedback && (
          <div className={`practice-status`}>
            <span className={`status-text ${feedback}`}>{feedback === 'correct' ? '✓ Correct! Keep going!' : '✗ Try again!'}</span>
          </div>
        )}

        <div className="practice-status" style={{ display: 'flex', justifyContent: 'space-around' }}>
          <span>Streak: {streak} 🔥</span>
          <span>Progress: {currentIndex + 1}/{selectedSong.lyrics.length}</span>
          <span>Total: {totalCorrect} ✓</span>
        </div>

        <div className="practice-controls" style={{ marginTop: '1rem' }}>
          <button className="control-btn" style={{ background: 'var(--success)' }} onClick={markCorrect}>✓ Got it!</button>
          <button className="control-btn" style={{ background: 'var(--danger)' }} onClick={markIncorrect}>✗ Missed it</button>
          <button className="control-btn" style={{ background: 'var(--accent-secondary)' }} onClick={() => playChord(current.chord)}>🔊 Play chord</button>
        </div>
      </div>
    </div>
  );
}

export default PracticeMode;
export { PRACTICE_SONGS };