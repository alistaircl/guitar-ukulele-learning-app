import React, { useState, useRef, useEffect, useCallback } from 'react';

const CHORD_FREQ = {
  'C': [261.63, 329.63, 392.0],
  'D': [293.66, 369.99, 440.0],
  'E': [329.63, 415.3, 493.88],
  'F': [349.23, 440.0, 523.25],
  'F#': [369.99, 466.16, 554.37],
  'G': [392.0, 493.88, 587.33],
  'G#': [415.3, 523.25, 622.25],
  'A': [440.0, 554.37, 659.26],
  'Am': [440.0, 523.25, 659.26],
  'B': [493.88, 622.25, 739.99],
  'Em': [329.63, 392.0, 493.88],
  'F#m': [369.99, 440.0, 554.37],
  'G#m': [415.3, 493.88, 622.25],
  'Dm': [293.66, 349.23, 440.0],
  'E7': [329.63, 415.3, 493.88, 587.33],
  'A7': [440.0, 554.37, 659.26, 783.99],
  'B7': [493.88, 622.25, 739.99, 880.0],
};

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
      { text: 'I\'ve got a house of gold', chord: 'G', beats: 4 },
      { text: 'And a heart of gold', chord: 'C', beats: 4 },
      { text: 'And a soul of gold', chord: 'Em', beats: 4 },
      { text: 'And a mind of gold', chord: 'D', beats: 4 },
      { text: 'How do you think I\'m going to feel', chord: 'G', beats: 4 },
      { text: 'When I\'m coming home again', chord: 'C', beats: 4 },
      { text: 'Tell me tell me', chord: 'Em', beats: 4 },
      { text: 'What do you see when you look at me', chord: 'D', beats: 4 },
      { text: 'She asked me son when I grow old', chord: 'G', beats: 4 },
      { text: 'Will you buy me a house of gold', chord: 'C', beats: 4 },
      { text: 'And when I\'m grown and feeling old', chord: 'Em', beats: 4 },
      { text: 'Will you buy me a house of gold', chord: 'D', beats: 4 },
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
      { text: 'Oh please stand by me', chord: 'A', beats: 4 },
      { text: 'Oh please stand by me', chord: 'F#m', beats: 4 },
      { text: 'When the night has come', chord: 'D', beats: 4 },
      { text: 'And the land is dark', chord: 'E', beats: 4 },
      { text: 'And the moon is the only light we\'ll see', chord: 'A', beats: 4 },
      { text: 'No I won\'t be afraid', chord: 'F#m', beats: 4 },
      { text: 'Oh please stand by me', chord: 'D', beats: 4 },
      { text: 'Oh please stand by me', chord: 'E', beats: 4 },
      { text: 'When stormy weather raging', chord: 'A', beats: 4 },
      { text: 'Around my door', chord: 'F#m', beats: 4 },
      { text: 'I won\'t be afraid', chord: 'D', beats: 4 },
      { text: 'Just as long as you stand by me', chord: 'E', beats: 4 },
      { text: 'Oh please stand by me', chord: 'A', beats: 4 },
      { text: 'Oh please stand by me', chord: 'F#m', beats: 4 },
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
      { text: 'I love you Riptide', chord: 'Am', beats: 4 },
      { text: 'I love you Riptide', chord: 'G', beats: 4 },
      { text: 'I love you Riptide', chord: 'C', beats: 4 },
      { text: 'I love you Riptide', chord: 'F', beats: 4 },
      { text: 'I was scared of dentists and the dark', chord: 'Am', beats: 4 },
      { text: 'I was scared of pretty girls and Sunday mornings', chord: 'G', beats: 4 },
      { text: 'I was scared of little bits of paper in the park', chord: 'C', beats: 4 },
      { text: 'And I turned around and you were gone', chord: 'F', beats: 4 },
      { text: 'Lady, running down to the riptide', chord: 'Am', beats: 4 },
      { text: 'Taken away to the dark side', chord: 'G', beats: 4 },
      { text: 'I wanna be your left hand man', chord: 'C', beats: 4 },
      { text: 'I love you when you\'re singing that song and', chord: 'F', beats: 4 },
      { text: 'I got a lump in my throat', chord: 'Am', beats: 4 },
      { text: 'And you\'re gonna sing the words wrong', chord: 'G', beats: 4 },
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
      { text: 'So baby now', chord: 'Em', beats: 4 },
      { text: 'We\'re still young', chord: 'G', beats: 4 },
      { text: 'And our hearts still beat as one', chord: 'D', beats: 4 },
      { text: 'And I\'m thinking out loud', chord: 'C', beats: 4 },
      { text: 'When your legs don\'t work like they used to before', chord: 'Em', beats: 4 },
      { text: 'And I can\'t sweep you off of your feet', chord: 'G', beats: 4 },
      { text: 'Will your mouth still remember the taste of my love', chord: 'D', beats: 4 },
      { text: 'Will your eyes still smile from your cheeks', chord: 'C', beats: 4 },
      { text: 'People fall in love in mysterious ways', chord: 'Em', beats: 4 },
      { text: 'Maybe just the touch of a hand', chord: 'G', beats: 4 },
      { text: 'And me I fall in love with you every single day', chord: 'D', beats: 4 },
      { text: 'And I just wanna tell you I am', chord: 'C', beats: 4 },
      { text: 'Take me into your loving arms', chord: 'Em', beats: 4 },
      { text: 'Kiss me under the light of a thousand stars', chord: 'G', beats: 4 },
      { text: 'Place your head on my beating heart', chord: 'D', beats: 4 },
      { text: 'I\'m thinking out loud', chord: 'C', beats: 4 },
      { text: 'That maybe we found love right where we are', chord: 'Em', beats: 4 },
      { text: 'When your hair\'s turned grey', chord: 'G', beats: 4 },
      { text: 'We can share a bed of roses', chord: 'D', beats: 4 },
      { text: 'That maybe we found love right where we are', chord: 'C', beats: 4 },
    ]
  },
  { id: 8, title: 'I\'m Yours',
    artist: 'Jason Mraz',
    difficulty: 'Beginner',
    key: 'B',
    bpm: 104,
    chords: ['B', 'E', 'G#m', 'F#'],
    lyrics: [
      { text: 'Well you done done me and you bet I felt it', chord: 'B', beats: 4 },
      { text: 'I tried to be chill but you\'re so hot that I melted', chord: 'E', beats: 4 },
      { text: 'I fell right through the cracks', chord: 'G#m', beats: 4 },
      { text: 'And now I\'m trying to get back', chord: 'F#', beats: 4 },
      { text: 'Before the cool done run out', chord: 'B', beats: 4 },
      { text: 'I\'ll be giving it my best', chord: 'E', beats: 4 },
      { text: 'Nothing\'s going to stop me but divine intervention', chord: 'G#m', beats: 4 },
      { text: 'I reckon it\'s again my turn', chord: 'F#', beats: 4 },
      { text: 'To win some or learn some', chord: 'B', beats: 4 },
      { text: 'But I won\'t hesitate no more no more', chord: 'E', beats: 4 },
      { text: 'It cannot wait I\'m yours', chord: 'G#m', beats: 4 },
      { text: 'I won\'t hesitate no more no more', chord: 'F#', beats: 4 },
      { text: 'It cannot wait I\'m yours', chord: 'B', beats: 4 },
    ]
  },
  { id: 9, title: 'Hotel California',
    artist: 'Eagles',
    difficulty: 'Intermediate',
    key: 'Am',
    bpm: 75,
    chords: ["Am", "E7", "G", "D", "F", "C", "Dm"],
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
      { text: "Welcome to Hotel California", chord: "Am", beats: 4 },
      { text: "Such a lovely place", chord: "E7", beats: 4 },
      { text: "Such a lovely face", chord: "G", beats: 4 },
      { text: "Plenty of room at Hotel California", chord: "D", beats: 4 },
      { text: "Any time of year", chord: "F", beats: 4 },
      { text: "You can find it here", chord: "C", beats: 4 },
      { text: "Her mind is Tiffany-twisted", chord: "Dm", beats: 4 },
      { text: "She got the Mercedes bends", chord: "E7", beats: 4 },
      { text: "She got a lot of pretty, pretty boys", chord: "Am", beats: 4 },
      { text: "That she calls friends", chord: "E7", beats: 4 },
      { text: "How they dance in the courtyard", chord: "F", beats: 4 },
      { text: "Sweet summer sweat", chord: "Dm", beats: 4 },
      { text: "Some dance to remember", chord: "Am", beats: 4 },
      { text: "Some dance to forget", chord: "E7", beats: 4 },
    ]
  },
  { id: 10, title: 'Sweet Caroline',
    artist: 'Neil Diamond',
    difficulty: 'Beginner',
    key: 'G',
    bpm: 120,
    chords: ['G', 'C', 'D', 'Em'],
    lyrics: [
      { text: "Where it began, I can't begin to knowing", chord: 'G', beats: 4 },
      { text: "But then I know it's growing strong", chord: 'C', beats: 4 },
      { text: "Was in the spring", chord: 'G', beats: 4 },
      { text: "And spring became the summer", chord: 'D', beats: 4 },
      { text: "Who'd have believed you'd come along", chord: 'G', beats: 4 },
      { text: "Hands, touching hands", chord: 'C', beats: 4 },
      { text: "Reaching out, touching me, touching you", chord: 'G', beats: 4 },
      { text: "Sweet Caroline", chord: 'Em', beats: 4 },
      { text: "Good times never seemed so good", chord: 'G', beats: 4 },
      { text: "Good times never seemed so good", chord: 'C', beats: 4 },
      { text: "Good times never seemed so good", chord: 'D', beats: 4 },
      { text: "Good times never seemed so good", chord: 'Em', beats: 4 },
      { text: "I've been inclined", chord: 'G', beats: 4 },
      { text: "To believe they never would", chord: 'C', beats: 4 },
      { text: "But now I", chord: 'G', beats: 4 },
      { text: "Look at the night", chord: 'Em', beats: 4 },
      { text: "And it don't seem so lonely", chord: 'C', beats: 4 },
      { text: "We fill it up with only two", chord: 'G', beats: 4 },
      { text: "And when I hurt", chord: 'Em', beats: 4 },
      { text: "Hurting runs off my shoulder", chord: 'C', beats: 4 },
      { text: "How can I hurt when holding you?", chord: 'G', beats: 4 },
      { text: "Sweet Caroline", chord: 'Em', beats: 4 },
      { text: "Good times never seemed so good", chord: 'G', beats: 4 },
      { text: "Good times never seemed so good", chord: 'C', beats: 4 },
      { text: "Good times never seemed so good", chord: 'D', beats: 4 },
      { text: "Good times never seemed so good", chord: 'Em', beats: 4 }
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
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [beatPulse, setBeatPulse] = useState(false);
  
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const rAFRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const lineRefs = useRef([]);
  const playbackStartTimeRef = useRef(null);
  const cumulativeDurationsRef = useRef([]); // Cache of cumulative line durations
  const pausedElapsedRef = useRef(null); // Track elapsed time during pause (replaces window._pausedPlaybackElapsed)

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
    setIsPaused(false);
    setCurrentIndex(0);
    setCountdown(null);
    setFeedback(null);
    playbackStartTimeRef.current = null;
    cumulativeDurationsRef.current = [];
    if (rAFRef.current) {
      cancelAnimationFrame(rAFRef.current);
      rAFRef.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearTimeout(countdownRef.current);
  };
  
  const playNote = useCallback((freq) => {
    // AudioContext should be initialized by initAudioContext() before first playNote call
    if (!audioCtxRef.current) {
      // Fallback: create if somehow not initialized (shouldn't happen)
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
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
  }, []);

  const playChord = useCallback((chord) => {
    if (!chord) return;
    const chordKey = Object.keys(CHORD_FREQ).find(k => k.toLowerCase() === chord.toLowerCase());
    const freqs = CHORD_FREQ[chordKey] || [440];
    freqs.forEach(freq => playNote(freq));
  }, [playNote]);

  // Auto-scroll the active line into view
  const scrollToLine = useCallback((idx) => {
    const el = lineRefs.current[idx];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const cancelCountdown = () => {
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(null);
  };

  // Initialize and resume AudioContext on user gesture
  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Browsers start AudioContext in 'suspended' state - must resume on user gesture
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const startAutoplay = () => {
    // Initialize audio context on user gesture (required by browsers)
    initAudioContext();
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

  // Pre-calculate cumulative durations for all lines (for rAF timing)
    const calculateCumulativeDurations = useCallback(() => {
      const durations = [];
      let cumulative = 0;
      // Inline duration calculation to avoid dependency on unstable lineDuration function
      const barDur = (60 / selectedSong.bpm) * 4000;
      for (const line of selectedSong.lyrics) {
        const lineDur = barDur * ((line.beats || 4) / 4);
        cumulative += lineDur;
        durations.push(cumulative);
      }
      return durations;
    }, [selectedSong]);
  
    // rAF-based playback loop - self-correcting timing
    const playbackLoop = useCallback(() => {
      if (!playbackStartTimeRef.current || isPaused) return;
    
      const elapsed = Date.now() - playbackStartTimeRef.current;
      const cumulative = cumulativeDurationsRef.current;
    
      // Find which line we should be on based on elapsed time
      let targetIndex = 0;
      for (let i = 0; i < cumulative.length; i++) {
        if (elapsed >= cumulative[i]) {
          targetIndex = i + 1;
        } else {
          break;
        }
      }
    
      // If we've reached the end
      if (targetIndex >= selectedSong.lyrics.length) {
        if (rAFRef.current) {
          cancelAnimationFrame(rAFRef.current);
          rAFRef.current = null;
        }
        playbackStartTimeRef.current = null;
        setIsPlaying(false);
        setIsPaused(false);
        setFeedback({ type: 'complete', message: '🎵 Song complete! Great practice!' });
        if (onDone) onDone();
        return;
      }
    
      // If we've advanced to a new line
      if (targetIndex !== currentIndex) {
        setCurrentIndex(targetIndex);
        setBeatPulse(true);
        setTimeout(() => setBeatPulse(false), 150);
        setFeedback(null);
        scrollToLine(targetIndex);
      
        // Play chord on beat
        const chord = selectedSong.lyrics[targetIndex].chord;
        if (chord) {
          playChord(chord);
        }
      }
    
      // Continue the loop
      rAFRef.current = requestAnimationFrame(playbackLoop);
    }, [currentIndex, isPaused, selectedSong, onDone, scrollToLine, playChord]);

    const beginPlayback = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentIndex(0);
      playbackStartTimeRef.current = Date.now();
      cumulativeDurationsRef.current = calculateCumulativeDurations();
    
      // Pulse animation on the beat
      setBeatPulse(true);
      setTimeout(() => setBeatPulse(false), 150);
    
      // Play first chord immediately
      if (selectedSong.lyrics[0].chord) {
        playChord(selectedSong.lyrics[0].chord);
      }
    
      // Start rAF loop
      rAFRef.current = requestAnimationFrame(playbackLoop);
    };
  
    const pauseAutoplay = () => {
      if (rAFRef.current) {
        cancelAnimationFrame(rAFRef.current);
        rAFRef.current = null;
      }
      // Adjust start time so elapsed time is preserved on resume
      if (playbackStartTimeRef.current) {
        const elapsed = Date.now() - playbackStartTimeRef.current;
        // We'll subtract this elapsed from the new start time on resume
        playbackStartTimeRef.current = null;
        // Store elapsed in a ref (replaces window._pausedPlaybackElapsed)
        pausedElapsedRef.current = elapsed;
      }
      setIsPaused(true);
    };
  
    const resumeAutoplay = () => {
      if (!isPaused) return;
    
      setIsPaused(false);
      // Start from where we left off, accounting for elapsed time
      const elapsedWhilePaused = pausedElapsedRef.current || 0;
      pausedElapsedRef.current = null;
      playbackStartTimeRef.current = Date.now() - elapsedWhilePaused;
      cumulativeDurationsRef.current = calculateCumulativeDurations();
    
      // Pulse animation on resume
      setBeatPulse(true);
      setTimeout(() => setBeatPulse(false), 150);
    
      // Resume rAF loop
      rAFRef.current = requestAnimationFrame(playbackLoop);
    };
  
  const stopAutoplay = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsPlaying(false);
      setCurrentIndex(idx);
      setFeedback(null);
      scrollToLine(idx);
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

  const current = selectedSong?.lyrics ? selectedSong.lyrics[currentIndex] : null;

  if (!selectedSong) {
    return (
      <div className="section" style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Song not found. Please select a song from the dropdown.</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="section" style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Lyrics not found for the selected song.</p>
      </div>
    );
  }

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
          {isPlaying && !isPaused && (
            <>
              <button className="control-btn" onClick={pauseAutoplay} style={{ background: 'var(--warning)', color: 'white', marginRight: '0.5rem' }}>
                ⏸ Pause
              </button>
              <button className="control-btn" onClick={stopAutoplay} style={{ background: 'var(--danger)', color: 'white' }}>
                ⏹ Stop
              </button>
            </>
          )}
          {isPlaying && isPaused && (
            <>
              <button className="control-btn" onClick={resumeAutoplay} style={{ background: 'var(--success)', color: 'white', marginRight: '0.5rem' }}>
                ▶ Resume
              </button>
              <button className="control-btn" onClick={stopAutoplay} style={{ background: 'var(--danger)', color: 'white' }}>
                ⏹ Stop
              </button>
            </>
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
          <button 
            onClick={cancelCountdown}
            className="control-btn" 
            style={{ 
              position: 'absolute', 
              bottom: '20px', 
              background: 'var(--bg-secondary)', 
              color: 'var(--text-primary)',
              fontSize: '1rem',
              padding: '0.4rem 1rem'
            }}
          >
            Cancel
          </button>
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