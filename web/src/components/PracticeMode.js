import React, { useState, useRef, useEffect, useCallback } from 'react';

const PRACTICE_SONGS = [
  { id: 1, title: 'Somewhere Over the Rainbow',
    artist: 'Israel Kamakawiwo\'ole',
    difficulty: 'Beginner',
    key: 'C',
    bpm: 66,
    chords: ['C', 'F', 'G', 'Em', 'Am'],
    lyrics: [
      { text: "Oooooooo ooooo ooooo ooooo", chord: 'C' },
      { text: "Somewhere over the rainbow", chord: null },
      { text: "Way up high", chord: 'F' },
      { text: "There's a land that I heard of", chord: 'G' },
      { text: "Once in a lullaby", chord: 'Em' },
      { text: "Somewhere over the rainbow", chord: 'Am' },
      { text: "Skies are blue", chord: 'C' },
      { text: "And the dreams that you dare to dream", chord: null },
      { text: "Really do come true", chord: 'F' },
      { text: "Someday I'll wish upon a star", chord: 'G' },
      { text: "And wake up where the clouds are far behind me", chord: 'Em' },
      { text: "Where trouble melts like lemon drops", chord: 'Am' },
      { text: "High above the chimney top", chord: 'C' },
      { text: "That's where you'll find me", chord: null },
      { text: "Oooooooo ooooo ooooo ooooo", chord: 'F' },
      { text: "Somewhere over the rainbow", chord: 'G' },
      { text: "Bluebirds fly", chord: 'Em' },
      { text: "Birds fly over the rainbow", chord: 'Am' },
      { text: "Why then oh why can't I?", chord: 'C' },
      { text: "If happy little bluebirds fly", chord: null },
      { text: "Beyond the rainbow", chord: 'F' },
      { text: "Why oh why can't I?", chord: 'G' },
      { text: "Well I see trees of green", chord: 'Em' },
      { text: "Red roses too", chord: 'Am' },
      { text: "I see them bloom", chord: 'C' },
      { text: "For me and you", chord: null },
      { text: "And I think to myself", chord: 'F' },
      { text: "What a wonderful world", chord: 'G' },
      { text: "Well I see skies of blue", chord: 'Em' },
      { text: "And I see clouds of white", chord: 'Am' },
      { text: "And the brightness of day", chord: 'C' },
      { text: "I like the dark", chord: null },
      { text: "And I think to myself", chord: 'F' },
      { text: "What a wonderful world", chord: 'G' },
      { text: "The colors of the rainbow", chord: 'Em' },
      { text: "So pretty in the sky", chord: 'Am' },
      { text: "Are also on the faces", chord: 'C' },
      { text: "Of people going by", chord: null },
      { text: "I see friends shaking hands", chord: 'F' },
      { text: "Saying how do you do", chord: 'G' },
      { text: "They're really saying", chord: 'Em' },
      { text: "I I love you", chord: 'Am' },
      { text: "I hear babies cry", chord: 'C' },
      { text: "I watch them grow", chord: null },
      { text: "They'll learn much more", chord: 'F' },
      { text: "Than we'll ever know", chord: 'G' },
      { text: "And I think to myself", chord: 'Em' },
      { text: "What a wonderful world", chord: 'Am' },
      { text: "Someday I'll wish upon a star", chord: 'C' },
      { text: "And wake up where the clouds are far behind me", chord: null },
      { text: "Where trouble melts like lemon drops", chord: 'F' },
      { text: "High above the chimney top", chord: 'G' },
      { text: "That's where you'll find me", chord: 'Em' },
      { text: "Oooooooo ooooo ooooo ooooo", chord: 'Am' },
      { text: "Somewhere over the rainbow", chord: 'C' },
      { text: "Way up high", chord: null },
      { text: "And the dreams that you dare to dream", chord: 'F' },
      { text: "Really do come true", chord: 'G' },
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [beatPulse, setBeatPulse] = useState(false);
  
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const displayRef = useRef(null);

  // If initialSongId changes (user picks a new song from SongLibrary), switch to it
  useEffect(() => {
    if (initialSongId) {
      const found = PRACTICE_SONGS.find(s => s.id === initialSongId);
      if (found) {
        setSelectedSong(found);
        resetSong();
      }
    }
  }, [initialSongId]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearTimeout(countdownRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const resetSong = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setCountdown(null);
    setFeedback(null);
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearTimeout(countdownRef.current);
  };

  const playNote = (freq) => {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.25, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.4);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.4);
  };

  const CHORD_FREQ = { 
    'C': 261.63, 'F': 349.23, 'G': 392.00, 'Em': 329.63, 'Am': 440.00, 
    'E': 329.63, 'D': 293.66, 'A': 440.00, 'B': 493.88, 
    'F#': 369.99, 'F#m': 369.99, 'G#m': 415.30, 'Dm': 293.66, 
    'E7': 329.63, 'A7': 440.00, 'B7': 493.88 
  };

  const playChord = useCallback((chord) => {
    if (!chord) return;
    const freq = CHORD_FREQ[chord] || 440;
    playNote(freq);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // BPM-based interval per line: each line = 1 beat at the given BPM
  const getBeatDuration = () => (60 / selectedSong.bpm) * 1000;

  const startAutoplay = () => {
    setCountdown(3);
    let count = 3;
    const countdownStep = () => {
      if (count > 0) {
        setCountdown(count);
        count--;
        countdownRef.current = setTimeout(countdownStep, 800);
      } else {
        setCountdown('Go!');
        countdownRef.current = setTimeout(() => {
          setCountdown(null);
          beginPlayback();
        }, 600);
      }
    };
    countdownStep();
  };

  const beginPlayback = () => {
    setIsPlaying(true);
    setCurrentIndex(0);
    
    const interval = getBeatDuration();
    
    // Pulse animation on the beat
    setBeatPulse(true);
    setTimeout(() => setBeatPulse(false), 150);
    
    // Play first chord immediately
    if (selectedSong.lyrics[0].chord) {
      playChord(selectedSong.lyrics[0].chord);
    }
    
    let idx = 0;
    timerRef.current = setInterval(() => {
      idx++;
      
      if (idx >= selectedSong.lyrics.length) {
        // Song finished
        clearInterval(timerRef.current);
        timerRef.current = null;
        setIsPlaying(false);
        setFeedback({ type: 'complete', message: '🎵 Song complete! Great practice!' });
        return;
      }
      
      setCurrentIndex(idx);
      setBeatPulse(true);
      setTimeout(() => setBeatPulse(false), 150);
      setFeedback(null);
      
      // Play chord on beat
      if (selectedSong.lyrics[idx].chord) {
        playChord(selectedSong.lyrics[idx].chord);
      }
    }, interval);
  };

  const stopAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  const markCorrect = () => {
    setFeedback({ type: 'correct', message: '✓ Nice!' });
    setStreak(s => s + 1);
    setTotalCorrect(t => t + 1);
    if (selectedSong.lyrics[currentIndex].chord) {
      playChord(selectedSong.lyrics[currentIndex].chord);
    }
  };

  const markIncorrect = () => {
    setFeedback({ type: 'incorrect', message: '✗ Keep trying!' });
    setStreak(0);
  };

  const goToLine = (idx) => {
    if (idx >= 0 && idx < selectedSong.lyrics.length) {
      setCurrentIndex(idx);
      setFeedback(null);
    }
  };

  const nextLine = () => {
    if (currentIndex < selectedSong.lyrics.length - 1) {
      goToLine(currentIndex + 1);
    }
  };

  const prevLine = () => {
    if (currentIndex > 0) {
      goToLine(currentIndex - 1);
    }
  };

  const current = selectedSong.lyrics[currentIndex];

  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={selectedSong?.title || ''}
            onChange={e => {
              const song = PRACTICE_SONGS.find(s => s.title === e.target.value);
              setSelectedSong(song);
              resetSong();
            }}
            disabled={isPlaying}
            style={{ padding: '0.5rem', borderRadius: 8, border: 'none', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
          >
            {PRACTICE_SONGS.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
          </select>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {selectedSong.bpm} BPM • {selectedSong.artist}
          </span>
        </div>
        <div>
          {!isPlaying && countdown === null && (
            <button className="control-btn" onClick={startAutoplay} style={{ background: 'var(--accent-primary)', color: 'white', fontSize: '1rem', padding: '0.6rem 1.5rem' }}>
              ▶ Start
            </button>
          )}
          {isPlaying && (
            <button className="control-btn" onClick={stopAutoplay} style={{ background: 'var(--danger)', color: 'white' }}>
              ⏹ Stop
            </button>
          )}
        </div>
      </div>

      {/* Countdown overlay */}
      {countdown !== null && (
        <div style={{
          position: 'relative', height: '300px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius)',
          marginBottom: '1rem'
        }}>
          <span style={{ 
            fontSize: countdown === 'Go!' ? '4rem' : '6rem', 
            fontWeight: 'bold',
            color: countdown === 'Go!' ? 'var(--success)' : 'var(--accent-primary)',
            animation: 'countdownPop 0.6s ease-out'
          }}>
            {countdown}
          </span>
        </div>
      )}

      {/* Main practice display — karaoke style */}
      {countdown === null && (
        <div 
          ref={displayRef}
          style={{
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--border-radius)',
            padding: '1rem 1.25rem',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}
        >
          {/* Current chord display — big and prominent */}
          {current.chord && (
            <div style={{
              textAlign: 'center',
              marginBottom: '0.5rem',
              padding: '0.5rem',
            }}>
              <span style={{
                fontSize: '2.2rem',
                fontWeight: 'bold',
                color: 'var(--accent-primary)',
                display: 'inline-block',
                padding: '0.3rem 1.2rem',
                borderRadius: '12px',
                background: beatPulse ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                transform: beatPulse ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.1s ease-out, background 0.1s ease-out',
                textShadow: beatPulse ? '0 0 20px rgba(102, 126, 234, 0.6)' : 'none',
              }}>
                {current.chord}
              </span>
            </div>
          )}

          {/* Bouncing dot indicator — follows the active line */}
          <div style={{
            position: 'absolute',
            left: '0.3rem',
            top: `${(currentIndex * (48 / selectedSong.lyrics.length)) * selectedSong.lyrics.length / 2 + 50}px`,
            transition: 'top 0.3s ease',
            display: 'flex',
            alignItems: 'center',
          }}>
            <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              boxShadow: '0 0 12px rgba(102, 126, 234, 0.8)',
              animation: isPlaying ? 'bounce 0.6s infinite alternate' : 'none',
            }} />
          </div>

          {/* Lyrics lines */}
          <div style={{ 
            maxHeight: '420px', 
            overflowY: 'auto',
            scrollBehavior: 'smooth',
            padding: '0.5rem 1.5rem',
          }}>
            {selectedSong.lyrics.map((line, idx) => {
              const isCurrent = idx === currentIndex;
              const isPast = idx < currentIndex;
              const isUpcoming = idx > currentIndex;
              
              return (
                <div
                  key={idx}
                  role="button"
                  tabIndex={isPlaying ? -1 : 0}
                  aria-current={isCurrent ? 'step' : undefined}
                  onClick={() => !isPlaying && goToLine(idx)}
                  onKeyDown={e => {
                    if (!isPlaying && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      goToLine(idx);
                    }
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0.5rem 0.75rem',
                    margin: '0.15rem 0',
                    borderRadius: '8px',
                    cursor: isPlaying ? 'default' : 'pointer',
                    background: isCurrent 
                      ? (beatPulse ? 'rgba(102, 126, 234, 0.15)' : 'rgba(255, 255, 255, 0.06)')
                      : 'transparent',
                    transition: 'all 0.2s ease',
                    borderLeft: isCurrent ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    opacity: isPast ? 0.4 : isUpcoming ? 0.55 : 1,
                  }}
                >
                  {/* Chord hint on each line */}
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: isCurrent ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    opacity: line.chord ? 1 : 0,
                    minHeight: '1rem',
                    transform: isCurrent && beatPulse ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.1s ease',
                  }}>
                    {line.chord || '\u00A0'}
                  </span>
                  {/* Lyric text */}
                  <span style={{
                    fontSize: isCurrent ? '1.3rem' : '1rem',
                    fontWeight: isCurrent ? '600' : '400',
                    color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                    lineHeight: '1.4',
                  }}>
                    {line.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback display */}
      {feedback && (
        <div style={{
          textAlign: 'center',
          padding: '0.75rem',
          borderRadius: '8px',
          background: feedback.type === 'correct' ? 'rgba(0, 255, 136, 0.1)' 
                     : feedback.type === 'incorrect' ? 'rgba(255, 77, 77, 0.1)' 
                     : feedback.type === 'complete' ? 'rgba(102, 126, 234, 0.15)'
                     : 'var(--bg-tertiary)',
          marginBottom: '0.75rem',
          animation: 'fadeInUp 0.3s ease-out',
        }}>
          <span style={{ 
            fontSize: '1.2rem',
            color: feedback.type === 'correct' ? 'var(--success)'
                 : feedback.type === 'incorrect' ? 'var(--danger)'
                 : feedback.type === 'complete' ? 'var(--accent-primary)'
                 : 'var(--text-primary)',
          }}>
            {feedback.message}
          </span>
        </div>
      )}

      {/* Status bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0.75rem',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--border-radius)',
        marginBottom: '0.75rem',
      }}>
        <span>🔥 {streak}</span>
        <span>{currentIndex + 1} / {selectedSong.lyrics.length}</span>
        <span>✓ {totalCorrect}</span>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="control-btn" onClick={prevLine} disabled={currentIndex === 0}>
          ← Prev
        </button>
        <button 
          className="control-btn" 
          onClick={markCorrect}
          style={{ background: 'var(--success)', color: 'white' }}
        >
          ✓ Got it!
        </button>
        <button 
          className="control-btn" 
          onClick={markIncorrect}
          style={{ background: 'var(--danger)', color: 'white' }}
        >
          ✗ Missed
        </button>
        <button 
          className="control-btn" 
          onClick={() => current.chord && playChord(current.chord)}
          style={{ background: 'var(--accent-secondary)' }}
        >
          🔊 Play
        </button>
        <button className="control-btn" onClick={nextLine} disabled={currentIndex === selectedSong.lyrics.length - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}

export default PracticeMode;
export { PRACTICE_SONGS };