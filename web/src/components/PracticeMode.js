import React, { useState, useRef, useEffect, useCallback } from 'react';

const PRACTICE_SONGS = [
  { id: 1, title: 'Somewhere Over the Rainbow',
    artist: 'Israel Kamakawiwo\'ole',
    difficulty: 'Beginner',
    key: 'C',
    bpm: 66,
    chords: ['C', 'F', 'G', 'Em', 'Am'],
    lyrics: [
      { text: "Oooooooo ooooo ooooo ooooo", chord: 'C', beats: 8 },
      { text: "Somewhere over the rainbow", chord: null, beats: 4 },
      { text: "Way up high", chord: 'F', beats: 4 },
      { text: "There's a land that I heard of", chord: 'G', beats: 4 },
      { text: "Once in a lullaby", chord: 'Em', beats: 4 },
      { text: "Somewhere over the rainbow", chord: 'Am', beats: 4 },
      { text: "Skies are blue", chord: 'C', beats: 4 },
      { text: "And the dreams that you dare to dream", chord: null, beats: 4 },
      { text: "Really do come true", chord: 'F', beats: 4 },
      { text: "Someday I'll wish upon a star", chord: 'G', beats: 4 },
      { text: "And wake up where the clouds are far behind me", chord: 'Em', beats: 4 },
      { text: "Where trouble melts like lemon drops", chord: 'Am', beats: 4 },
      { text: "High above the chimney top", chord: 'C', beats: 4 },
      { text: "That's where you'll find me", chord: null, beats: 4 },
      { text: "Oooooooo ooooo ooooo ooooo", chord: 'F', beats: 8 },
      { text: "Somewhere over the rainbow", chord: 'G', beats: 4 },
      { text: "Bluebirds fly", chord: 'Em', beats: 4 },
      { text: "Birds fly over the rainbow", chord: 'Am', beats: 4 },
      { text: "Why then oh why can't I?", chord: 'C', beats: 4 },
      { text: "If happy little bluebirds fly", chord: null, beats: 4 },
      { text: "Beyond the rainbow", chord: 'F', beats: 4 },
      { text: "Why oh why can't I?", chord: 'G', beats: 4 },
      { text: "Well I see trees of green", chord: 'Em', beats: 4 },
      { text: "Red roses too", chord: 'Am', beats: 4 },
      { text: "I see them bloom", chord: 'C', beats: 4 },
      { text: "For me and you", chord: null, beats: 4 },
      { text: "And I think to myself", chord: 'F', beats: 4 },
      { text: "What a wonderful world", chord: 'G', beats: 4 },
      { text: "Well I see skies of blue", chord: 'Em', beats: 4 },
      { text: "And I see clouds of white", chord: 'Am', beats: 4 },
      { text: "And the brightness of day", chord: 'C', beats: 4 },
      { text: "I like the dark", chord: null, beats: 4 },
      { text: "And I think to myself", chord: 'F', beats: 4 },
      { text: "What a wonderful world", chord: 'G', beats: 4 },
      { text: "The colors of the rainbow", chord: 'Em', beats: 4 },
      { text: "So pretty in the sky", chord: 'Am', beats: 4 },
      { text: "Are also on the faces", chord: 'C', beats: 4 },
      { text: "Of people going by", chord: null, beats: 4 },
      { text: "I see friends shaking hands", chord: 'F', beats: 4 },
      { text: "Saying how do you do", chord: 'G', beats: 4 },
      { text: "They're really saying", chord: 'Em', beats: 4 },
      { text: "I I love you", chord: 'Am', beats: 4 },
      { text: "I hear babies cry", chord: 'C', beats: 4 },
      { text: "I watch them grow", chord: null, beats: 4 },
      { text: "They'll learn much more", chord: 'F', beats: 4 },
      { text: "Than we'll ever know", chord: 'G', beats: 4 },
      { text: "And I think to myself", chord: 'Em', beats: 4 },
      { text: "What a wonderful world", chord: 'Am', beats: 4 },
      { text: "Someday I'll wish upon a star", chord: 'C', beats: 4 },
      { text: "And wake up where the clouds are far behind me", chord: null, beats: 4 },
      { text: "Where trouble melts like lemon drops", chord: 'F', beats: 4 },
      { text: "High above the chimney top", chord: 'G', beats: 4 },
      { text: "That's where you'll find me", chord: 'Em', beats: 4 },
      { text: "Oooooooo ooooo ooooo ooooo", chord: 'Am', beats: 8 },
      { text: "Somewhere over the rainbow", chord: 'C', beats: 4 },
      { text: "Way up high", chord: null, beats: 4 },
      { text: "And the dreams that you dare to dream", chord: 'F', beats: 4 },
      { text: "Really do come true", chord: 'G', beats: 4 },
    ]
  },
  { id: 2, title: 'You Are My Sunshine',
    artist: 'Traditional',
    difficulty: 'Beginner',
    key: 'C',
    bpm: 138,
    chords: ['C', 'F', 'G'],
lyrics: [
      { text: 'You are my sunshine', chord: 'C', beats: 4 },
      { text: 'My only sunshine', chord: 'F', beats: 4 },
      { text: 'You make me happy', chord: 'C', beats: 4 },
      { text: "When skies are gray", chord: 'G', beats: 4 },
      { text: "You'll never know dear", chord: 'C', beats: 4 },
      { text: 'How much I love you', chord: 'F', beats: 4 },
      { text: "Please don't take", chord: 'C', beats: 4 },
      { text: 'My sunshine away', chord: 'G', beats: 4 },
    ]
  },
  { id: 3, title: 'Let It Be',
    artist: 'The Beatles',
    difficulty: 'Beginner',
    key: 'C',
    bpm: 76,
    chords: ['C', 'G', 'Am', 'F'],
    lyrics: [
      { text: 'When I find myself in times of trouble', chord: 'C', beats: 4 },
      { text: 'Mother Mary comes to me', chord: 'G', beats: 4 },
      { text: 'Speaking words of wisdom', chord: 'Am', beats: 4 },
      { text: 'Let it be', chord: 'F', beats: 4 },
      { text: 'And in my hour of darkness', chord: 'C', beats: 4 },
      { text: 'She is standing right in front of me', chord: 'G', beats: 4 },
      { text: 'Speaking words of wisdom', chord: 'Am', beats: 4 },
      { text: 'Let it be', chord: 'F', beats: 4 },
    ]
  },
  { id: 4, title: 'House of Gold',
    artist: 'Twenty One Pilots',
    difficulty: 'Intermediate',
    key: 'G',
    bpm: 150,
    chords: ['G', 'C', 'Em', 'D'],
    lyrics: [
      { text: 'How do you think I\'m going to feel', chord: 'G', beats: 4 },
      { text: 'When I\'m coming home again', chord: 'C', beats: 4 },
      { text: 'Tell me tell me', chord: 'Em', beats: 4 },
      { text: 'What do you see when you look at me', chord: 'D', beats: 4 },
    ]
  },
  { id: 5, title: 'Stand By Me',
    artist: 'Ben E. King',
    difficulty: 'Intermediate',
    key: 'A',
    bpm: 120,
    chords: ['A', 'F#m', 'D', 'E'],
    lyrics: [
      { text: 'When the night has come', chord: 'A', beats: 4 },
      { text: 'And the land is dark', chord: 'F#m', beats: 4 },
      { text: 'And the moon is the only light we\'ll see', chord: 'D', beats: 4 },
      { text: 'No I won\'t be afraid', chord: 'E', beats: 4 },
    ]
  },
  { id: 6, title: 'Riptide',
    artist: 'Vance Joy',
    difficulty: 'Intermediate',
    key: 'Am',
    bpm: 158,
    chords: ['Am', 'G', 'C', 'F'],
    lyrics: [
      { text: 'I was scared of dentists and the dark', chord: 'Am', beats: 4 },
      { text: 'I was scared of pretty girls and Sunday mornings', chord: 'G', beats: 4 },
      { text: 'I was scared of little bits of paper in the park', chord: 'C', beats: 4 },
      { text: 'And I turned around and you were gone', chord: 'F', beats: 4 },
    ]
  },
  { id: 7, title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    difficulty: 'Intermediate',
    key: 'D',
    bpm: 79,
    chords: ['Em', 'G', 'D', 'C'],
    lyrics: [
      { text: 'When your legs don\'t work like they used to before', chord: 'Em', beats: 4 },
      { text: 'And I can\'t sweep you off of your feet', chord: 'G', beats: 4 },
      { text: 'Will your mouth still remember the taste of my love', chord: 'D', beats: 4 },
      { text: 'Will your eyes still smile from your cheeks', chord: 'C', beats: 4 },
    ]
  },
  { id: 8, title: 'I\'m Yours',
    artist: 'Jason Mraz',
    difficulty: 'Beginner',
    key: 'B',
    bpm: 104,
    chords: ['B', 'E', 'G#m', 'F#'],
    lyrics: [
      { text: 'Well I\'ve been playing hard to get', chord: 'B', beats: 4 },
      { text: 'Time to make my heart bet', chord: 'E', beats: 4 },
      { text: 'I wanna be yours, pretty baby', chord: 'G#m', beats: 4 },
      { text: 'Don\'t you make me wait too long', chord: 'F#', beats: 4 },
    ]
  },
  { id: 9, title: 'Hotel California',
    artist: 'Eagles',
    difficulty: 'Intermediate',
    key: 'Am',
    bpm: 75,
    chords: ["Am", "E7", "G", "D", "F", "C", "Dm", "E7"],
    lyrics: [
      { text: "(Instrumental Intro - Fingerpicking Pattern)", chord: null, beats: 8 },
      { text: "Am: 4-3-2-1-2-1, 3-2-1", chord: "Am", beats: 4 },
      { text: "E7: 4-3-2-1-2-1", chord: "E7", beats: 4 },
      { text: "G: 4-3-2-1-2-1, 3-2-1", chord: "G", beats: 4 },
      { text: "D: 4-3-2-1-2-1", chord: "D", beats: 4 },
      { text: "F: 4-3-2-1-2-1, 3-2-1", chord: "F", beats: 4 },
      { text: "C: 4-3-2-1-2-1", chord: "C", beats: 4 },
      { text: "Dm: 4-3-2-1-2-1, 3-2-1", chord: "Dm", beats: 4 },
      { text: "E7: 4-3-2-1-2-1 (Let ring)", chord: "E7", beats: 8 },
      { text: "", chord: null, beats: 4 },
      { text: "On a dark desert highway", chord: "Am", beats: 4 },
      { text: "Cool wind in my hair", chord: "E7", beats: 4 },
      { text: "Warm smell of colitas", chord: "G", beats: 4 },
      { text: "Rising up through the air", chord: "D", beats: 4 },
      { text: "Up ahead in the distance", chord: "F", beats: 4 },
      { text: "I saw a shimmering light", chord: "C", beats: 4 },
      { text: "My head grew heavy and my sight grew dim", chord: "Dm", beats: 4 },
      { text: "I had to stop for the night", chord: "E7", beats: 4 },
      { text: "There she stood in the doorway", chord: "Am", beats: 4 },
      { text: "I heard the mission bell", chord: "E7", beats: 4 },
      { text: "And I was thinking to myself", chord: "G", beats: 4 },
      { text: "This could be heaven or this could be hell", chord: "D", beats: 4 },
      { text: "Then she lit up a candle", chord: "F", beats: 4 },
      { text: "And she showed me the way", chord: "C", beats: 4 },
      { text: "There were voices down the corridor", chord: "Dm", beats: 4 },
      { text: "I thought I heard them say", chord: "E7", beats: 4 },
      { text: "Welcome to the Hotel California", chord: "Am", beats: 4 },
      { text: "Such a lovely place (such a lovely place)", chord: "E7", beats: 4 },
      { text: "Such a lovely face", chord: "G", beats: 4 },
      { text: "Plenty of room at the Hotel California", chord: "D", beats: 4 },
      { text: "Any time of year (any time of year)", chord: "F", beats: 4 },
      { text: "You can find it here", chord: "C", beats: 4 },
      { text: "Her mind is Tiffany-twisted", chord: "Dm", beats: 4 },
      { text: "She got the Mercedes-Benz, uh", chord: "E7", beats: 4 },
      { text: "She got a lot of pretty, pretty boys", chord: "Am", beats: 4 },
      { text: "That she calls friends", chord: "E7", beats: 4 },
      { text: "How they danced in the courtyard", chord: "F", beats: 4 },
      { text: "Sweet summer sweat", chord: "Dm", beats: 4 },
      { text: "Some dance to remember", chord: "Am", beats: 4 },
      { text: "Some dance to forget", chord: "E7", beats: 4 },
      { text: "So I called up the captain", chord: "Am", beats: 4 },
      { text: '"Please bring me my wine"', chord: "E7", beats: 4 },
      { text: 'He said, "We haven\'t had that spirit here since 1969"', chord: "G", beats: 4 },
      { text: "And still those voices are calling from far away", chord: "D", beats: 4 },
      { text: "Wake you up in the middle of the night", chord: "F", beats: 4 },
      { text: "Just to hear them say", chord: "C", beats: 4 },
      { text: "Welcome to the Hotel California", chord: "Dm", beats: 4 },
      { text: "Such a lovely place (such a lovely place)", chord: "E7", beats: 4 },
      { text: "Such a lovely face", chord: "G", beats: 4 },
      { text: "They're livin' it up at the Hotel California", chord: "D", beats: 4 },
      { text: "What a nice surprise (what a nice surprise)", chord: "F", beats: 4 },
      { text: "Bring your alibis", chord: "C", beats: 4 },
      { text: "Mirrors on the ceiling", chord: "Dm", beats: 4 },
      { text: "The pink champagne on ice", chord: "E7", beats: 4 },
      { text: 'And she said, "We are all just prisoners here"', chord: "Am", beats: 4 },
      { text: "Of our own device", chord: "E7", beats: 4 },
      { text: "And in the master's chambers", chord: "Am", beats: 4 },
      { text: "They gathered for the feast", chord: "E7", beats: 4 },
      { text: "They stab it with their steely knives", chord: "G", beats: 4 },
      { text: "But they just can't kill the beast", chord: "D", beats: 4 },
      { text: "Last thing I remember", chord: "F", beats: 4 },
      { text: "I was running for the door", chord: "C", beats: 4 },
      { text: "I had to find the passage back", chord: "Dm", beats: 4 },
      { text: "To the place I was before", chord: "E7", beats: 4 },
      { text: '"Relax, " said the night man', chord: "Am", beats: 4 },
      { text: "We are programmed to receive", chord: "E7", beats: 4 },
      { text: "You can check out any time you like", chord: "G", beats: 4 },
      { text: "But you can never leave", chord: "F", beats: 8 }
    ]
  }
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
  const lyricsContainerRef = useRef(null);
  const lineRefs = useRef([]);

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
    'C': 261.63,
    'D': 293.66,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'B': 493.88,
    'Em': 329.63,
    'F#m': 369.99,
    'G#m': 415.30,
    'Dm': 293.66,
    'E7': 329.63,
    'A7': 440.00,
    'B7': 493.88,
    // Expanded frequencies for all used chords
  };

  const playChord = (chord) => {
    if (!chord) return;
    const freq = CHORD_FREQ[chord] || 440;
    playNote(freq);
  };

  // Per-bar duration: one bar (4 beats) at the current BPM
  const barDuration = () => (60 / selectedSong.bpm) * 4000;

  // Per-line duration: beats field × bar duration (defaults to 4 beats = 1 bar if missing)
  const lineDuration = (line) => barDuration() * ((line.beats || 4) / 4);

  // Auto-scroll the active line into view
  const scrollToLine = useCallback((idx) => {
    const el = lineRefs.current[idx];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

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
    
    // Pulse animation on the beat
    setBeatPulse(true);
    setTimeout(() => setBeatPulse(false), 150);
    
    // Play first chord immediately
    if (selectedSong.lyrics[0].chord) {
      playChord(selectedSong.lyrics[0].chord);
    }
    
    // Use setTimeout chain: each line advances after its own beats duration
    const advance = (idx) => {
      timerRef.current = setTimeout(() => {
        const next = idx + 1;
        
        if (next >= selectedSong.lyrics.length) {
          // Song finished
          timerRef.current = null;
          setIsPlaying(false);
          setFeedback({ type: 'complete', message: '🎵 Song complete! Great practice!' });
          return;
        }
        
        setCurrentIndex(next);
        setBeatPulse(true);
        setTimeout(() => setBeatPulse(false), 150);
        setFeedback(null);
        scrollToLine(next);
        
        // Play chord on beat
        if (selectedSong.lyrics[next].chord) {
          playChord(selectedSong.lyrics[next].chord);
        }
        
        // Schedule the next line with its own beat count
        advance(next);
      }, lineDuration(selectedSong.lyrics[idx]));
    };
    
    // Start the chain from the first line
    advance(0);
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
    setStreak(s => Math.max(0, s - 1));
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

          {/* Lyrics lines — with inline indicator on active line */}
          <div 
            ref={lyricsContainerRef}
            style={{ 
              maxHeight: '420px', 
              overflowY: 'auto',
              scrollBehavior: 'smooth',
              padding: '0.5rem 1rem',
            }}
          >
            {selectedSong.lyrics.map((line, idx) => {
              const isCurrent = idx === currentIndex;
              const isPast = idx < currentIndex;
              const isUpcoming = idx > currentIndex;
              
              return (
                <div
                  key={idx}
                  ref={el => lineRefs.current[idx] = el}
                  role="button"
                  tabIndex={isPlaying ? -1 : 0}
                  aria-label={`Line ${idx + 1}${line.chord ? `, chord: ${line.chord}` : ''}`}
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
                    alignItems: 'center',
                    gap: '0.5rem',
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
                  {/* Indicator dot — moves with the line */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.2rem',
                    height: '1.2rem',
                    flexShrink: 0,
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: isCurrent ? '10px' : '6px',
                      height: isCurrent ? '10px' : '6px',
                      borderRadius: '50%',
                      background: isCurrent ? 'var(--accent-primary)' : 'transparent',
                      boxShadow: isCurrent ? '0 0 10px rgba(102, 126, 234, 0.7)' : 'none',
                      animation: isPlaying && isCurrent ? 'bounce 0.5s infinite alternate' : 'none',
                      transition: 'all 0.2s ease',
                    }} />
                  </span>
                  {/* Lyric content */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {line.chord && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        color: isCurrent ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        opacity: isCurrent ? 1 : 0.6,
                      }}>
                        {line.chord}
                      </span>
                    )}
                    <span style={{
                      fontSize: isCurrent ? '1.3rem' : '1rem',
                      fontWeight: isCurrent ? '600' : '400',
                      color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                      lineHeight: '1.4',
                    }}>
                      {line.text}
                    </span>
                  </div>
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
        <button className="control-btn" onClick={prevLine} aria-label="Previous line" disabled={currentIndex === 0}>
          ← Prev
        </button>
        <button 
          className="control-btn" 
          onClick={markCorrect}
          aria-label="Mark as correct"
          style={{ background: 'var(--success)', color: 'white' }}
        >
          ✓ Got it!
        </button>
        <button 
          className="control-btn" 
          onClick={markIncorrect}
          aria-label="Mark as missed"
          style={{ background: 'var(--danger)', color: 'white' }}
        >
          ✗ Missed
        </button>
        <button 
          className="control-btn" 
          onClick={() => current.chord && playChord(current.chord)}
          aria-label="Play chord sound"
          style={{ background: 'var(--accent-secondary)' }}
        >
          🔊 Play
        </button>
        <button className="control-btn" onClick={nextLine} aria-label="Next line" disabled={currentIndex === selectedSong.lyrics.length - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}

export default PracticeMode;
export { PRACTICE_SONGS };