import React, { useState, useEffect, useRef } from 'react';
import { FaGuitar } from 'react-icons/fa';

const TUNINGS = {
  // Ukulele tunings
  'G4 C4 E4 A4': { name: 'Standard (GCEA)', instrument: 'ukulele', notes: ['G4', 'C4', 'E4', 'A4'], freq: [392, 261.63, 329.63, 440] },
  'G3 C4 E4 A4': { name: 'Low G (GCEA)', instrument: 'ukulele', notes: ['G3', 'C4', 'E4', 'A4'], freq: [196.0, 261.63, 329.63, 440] },
  'D4 G4 B4 E5': { name: 'Baritone (DGBE)', instrument: 'ukulele', notes: ['D4', 'G4', 'B4', 'E5'], freq: [293.66, 392, 493.88, 659.25] },
  // Guitar tunings
  'E2 A2 D3 G3 B3 E4': { name: 'Standard (EADGBE)', instrument: 'guitar', notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'], freq: [82.41, 110.0, 146.83, 196.0, 246.94, 329.63] },
  'D2 A2 D3 G3 B3 E4': { name: 'Drop D (DADGBE)', instrument: 'guitar', notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'], freq: [73.42, 110.0, 146.83, 196.0, 246.94, 329.63] },
  'D2 A2 D3 G3 A3 D4': { name: 'DADGAD', instrument: 'guitar', notes: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'], freq: [73.42, 110.0, 146.83, 196.0, 220.0, 293.66] },
  'D2 G2 D3 G3 B3 D4': { name: 'Open G (DGDGBD)', instrument: 'guitar', notes: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'], freq: [73.42, 98.0, 146.83, 196.0, 246.94, 293.66] },
  'D2 A2 D3 F#3 A3 D4': { name: 'Open D (DADF#AD)', instrument: 'guitar', notes: ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'], freq: [73.42, 110.0, 146.83, 185.0, 220.0, 293.66] },
  'D#2 G#2 D#3 G#3 A#3 D#4': { name: 'Half-step down (Eb Ab Db Gb Bb Eb)', instrument: 'guitar', notes: ['D#2', 'G#2', 'D#3', 'G#3', 'A#3', 'D#4'], freq: [77.78, 103.83, 155.56, 207.65, 233.08, 311.13] },
};

// Map instrument -> ordered list of tuning keys, so the selector can render
// only the tunings for the active instrument (issue #187).
const TUNINGS_BY_INSTRUMENT = Object.keys(TUNINGS).reduce((acc, key) => {
  const inst = TUNINGS[key].instrument;
  if (!acc[inst]) acc[inst] = [];
  acc[inst].push(key);
  return acc;
}, {});

const INSTRUMENT_PREFERENCE_KEY = 'guitar-ukulele-tuner-instrument';
// Per-instrument tuning preference keys
const tuningStorageKey = (instrument) => `${instrument}-tuner-tuning`;

// Safe storage helpers (mirrors ChordLibrary): try localStorage, then
// sessionStorage, and gracefully handle environments where storage is blocked.
function safeStorageGet(key) {
  for (const storeName of ['localStorage', 'sessionStorage']) {
    try {
      const store = window[storeName];
      return store.getItem(key);
    } catch (e) {
      console.warn(`Could not read "${key}" from ${storeName}:`, e.message || e);
    }
  }
  return null;
}
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

const NOTE_FREQ_MAP = {
  // Lower octaves needed for guitar tunings (low E2 = 82.41 Hz, A2 = 110 Hz).
  // Without these, getNearestNote() would silently misidentify low guitar
  // strings by matching them to the nearest higher note (issue #187).
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.0, 'G#2': 103.83, 'A2': 110.0, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.0, 'G3': 196.0, 'G#3': 207.65, 'A3': 220.0, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.0, 'G#4': 415.3, 'A4': 440.0, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.26, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.0, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.5, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.0, 'A#6': 1864.66, 'B6': 1975.53,
};

function getNearestNote(freq) {
  let nearest = '?';
  let minDiff = Infinity;
  let signedDiff = 0;
  let targetFreq = 0;
  for (const [note, f] of Object.entries(NOTE_FREQ_MAP)) {
    const diff = Math.abs(freq - f);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = note;
      signedDiff = freq - f;
      targetFreq = f;
    }
  }
  // Calculate cents: 1200 * log2(detectedFreq / targetFreq)
  const cents = targetFreq > 0 ? Math.round(1200 * Math.log2(freq / targetFreq)) : 0;
  return { note: nearest, diff: signedDiff, freq, targetFreq, cents };
}

function Tuner() {
  // Active instrument — persisted across sessions via the safe storage helpers.
  // Defaults to ukulele to stay backwards-compatible with existing users.
  const [instrument, setInstrument] = useState(() => {
    const saved = safeStorageGet(INSTRUMENT_PREFERENCE_KEY);
    if (saved === 'guitar' || saved === 'ukulele') {
      return saved;
    }
    // Backwards compatibility: migrate the old single localStorage key so users
    // who previously selected a guitar tuning under `ukulele-tuner-tuning` keep
    // their choice when we split the keys by instrument.
    const oldSaved = safeStorageGet('ukulele-tuner-tuning');
    if (oldSaved && TUNINGS[oldSaved] && TUNINGS[oldSaved].instrument === 'guitar') {
      return 'guitar';
    }
    return 'ukulele';
  });
  const [tuning, setTuning] = useState(() => {
    const inst = (() => {
      const saved = safeStorageGet(INSTRUMENT_PREFERENCE_KEY);
      if (saved === 'guitar' || saved === 'ukulele') return saved;
      const oldSaved = safeStorageGet('ukulele-tuner-tuning');
      if (oldSaved && TUNINGS[oldSaved] && TUNINGS[oldSaved].instrument === 'guitar') return 'guitar';
      return 'ukulele';
    })();
    const saved = safeStorageGet(tuningStorageKey(inst)) || safeStorageGet('ukulele-tuner-tuning');
    if (saved && TUNINGS[saved] && TUNINGS[saved].instrument === inst) {
      return saved;
    }
    // Default to the first tuning of the active instrument
    return TUNINGS_BY_INSTRUMENT[inst][0];
  });
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState(null);
  const [error, setError] = useState(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const silenceThresholdRef = useRef(0.01); // Default threshold, will be calibrated

  const startTuner = async () => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const error = new Error('Browser does not support microphone access.');
        error.name = 'NotSupportedError';
        throw error;
      }

      // Explicitly check for available audio input devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some(device => device.kind === 'audioinput');
      
      if (!hasMic) {
        setError('No microphone found. Please connect a microphone and try again.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      // Ensure the AudioContext is active. Some browsers start it in 'suspended' state
      // and reject resume() under mobile Safari's strict autoplay policy. Wrap in its
      // own try/catch so a resume failure surfaces a clear, actionable message instead
      // of falling through to the generic catch block (issue #166).
      if (audioCtx.state === 'suspended') {
        try {
          await audioCtx.resume();
        } catch (resumeErr) {
          console.error('Failed to resume AudioContext for tuner:', resumeErr);
          // Clean up partial resources before surfacing the failure
          stream.getTracks().forEach(t => t.stop());
          throw new Error('Audio could not be initialized. Tap Start again to retry.');
        }
      }
      // Guard: refuse to start pitch detection on a suspended context, since the
      // analyser would never produce meaningful data and the user hears nothing.
      if (audioCtx.state !== 'running') {
        stream.getTracks().forEach(t => t.stop());
        throw new Error('Audio context could not be activated. Tap Start again to retry.');
      }

      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      setIsListening(true);
      setError(null);
      // Calibrate threshold before starting pitch detection
      await calibrateThreshold();
      detectPitch();
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Please enable microphone permissions in your browser settings and refresh the page.');
      } else if (err.name === 'NotSupportedError') {
        setError('Browser does not support microphone access. Please try a modern browser with microphone support.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Microphone is in use by another app or is not responding. Please close other apps and try again.');
      } else {
        setError(`Microphone error: ${err.message || 'Unknown error'}. Please check your mic and try again.`);
      }
    }
  };

  const stopTuner = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsListening(false);
    setDetectedNote(null);
  };

  const playReferenceTone = async (freq) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // New AudioContexts start in 'suspended' state on most browsers and MUST be
    // resumed on a user gesture (or the click that triggered this call) before any
    // scheduled audio will be audible. Without this, mobile Safari silently fails
    // to play the reference tone (issue #166).
    if (audioCtx.state === 'suspended') {
      try {
        await audioCtx.resume();
      } catch (resumeErr) {
        console.error('Failed to resume AudioContext for reference tone:', resumeErr);
        audioCtx.close();
        return;
      }
    }
    // Guard: never schedule an oscillator into a suspended context — it will
    // silently produce no audio (issue #166). Browsers' autoplay policy starts
    // AudioContext in 'suspended' state and only allows resume() inside a user
    // gesture; even within one, some browsers resolve resume() without flipping
    // state to 'running'. This is an expected browser security limitation, not
    // an app bug — the user just needs to interact with the page first.
    if (audioCtx.state !== 'running') {
      console.warn(
        'AudioContext is ' + audioCtx.state + ' (not "running"); skipping reference tone. ' +
        'Cause: browser autoplay policy requires a user gesture (tap/click) to start ' +
        'audio; some browsers resume() without flipping state to "running". ' +
        'This is expected browser behavior — interact with the page first, then retry.'
      );
      audioCtx.close();
      return;
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);

    // Close the AudioContext after the tone finishes to prevent memory leaks
    setTimeout(() => audioCtx.close(), 1100);
  };

  // Calibrate silence threshold by measuring ambient noise
  const calibrateThreshold = async () => {
    setIsCalibrating(true);
    const samples = [];
    const numSamples = 30; // ~500ms at 60fps
    
    for (let i = 0; i < numSamples; i++) {
      const buffer = new Float32Array(analyserRef.current.fftSize);
      analyserRef.current.getFloatTimeDomainData(buffer);
      
      let rms = 0;
      for (let j = 0; j < buffer.length; j++) {
        rms += buffer[j] * buffer[j];
      }
      rms = Math.sqrt(rms / buffer.length);
      samples.push(rms);
      
      await new Promise(resolve => setTimeout(resolve, 16)); // ~60fps
    }
    
    // Calculate average noise floor
    const avgNoise = samples.reduce((a, b) => a + b, 0) / samples.length;
    // Set threshold at 1.5x noise floor, with minimum floor of 0.005
    silenceThresholdRef.current = Math.max(0.005, avgNoise * 1.5);
    setIsCalibrating(false);
  };

  const autoCorrelate = (buffer, sampleRate) => {
    let SIZE = buffer.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < silenceThresholdRef.current) return -1;

    let r1 = 0, r2 = SIZE - 1;
    const thresh = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < thresh) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < thresh) {
        r2 = SIZE - i;
        break;
      }
    }

    const buf = buffer.slice(r1, r2);
    const c = new Array(buf.length).fill(0);
    for (let i = 0; i < buf.length; i++) {
      for (let j = 0; j < buf.length - i; j++) {
        c[i] = c[i] + buf[j] * buf[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;

    let maxVal = -1, maxPos = -1;
    for (let i = d; i < buf.length; i++) {
      if (c[i] > maxVal) {
        maxVal = c[i];
        maxPos = i;
      }
    }

    let T0 = maxPos;
    if (T0 < 1 || T0 >= buf.length - 1) return sampleRate / T0;

    // Interpolate for better accuracy
    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a !== 0) {
      T0 = T0 - b / (2 * a);
    }

    return sampleRate / T0;
  };

  const detectPitch = () => {
    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);
    const freq = autoCorrelate(buffer, audioCtxRef.current.sampleRate);
    if (freq > 50 && freq < 2000) {
      setDetectedNote(getNearestNote(freq));
    }
    rafRef.current = requestAnimationFrame(detectPitch);
  };

  // Cleanup on component unmount - ensures microphone is stopped when leaving Tuner tab
  useEffect(() => {
    return () => {
      stopTuner();
    };
  }, []);

  // Save tuning preference to available storage when it changes (per instrument)
  useEffect(() => {
    try {
      safeStorageSet(tuningStorageKey(instrument), tuning);
    } catch (e) {
      console.warn('Could not save tuning to storage:', e);
    }
  }, [tuning, instrument]);

  // Persist the active instrument so it survives refresh / revisit
  useEffect(() => {
    safeStorageSet(INSTRUMENT_PREFERENCE_KEY, instrument);
  }, [instrument]);

  // Switch instrument, and reset to that instrument's first tuning so the
  // selector never shows a tuning that doesn't belong to the active instrument.
  const toggleInstrument = () => {
    const next = instrument === 'ukulele' ? 'guitar' : 'ukulele';
    setInstrument(next);
    setTuning(TUNINGS_BY_INSTRUMENT[next][0]);
  };

  // Gauge uses a centered marker that moves left (flat) or right (sharp)
  // 50% = center (in tune), <50% = flat (left), >50% = sharp (right)
  // Uses cents for perceptually linear positioning (±50 cents = quarter tone)
  const maxCents = 50;
  const gaugePercent = detectedNote && detectedNote.note !== '?'
    ? Math.min(100, Math.max(0, 50 + (detectedNote.cents / maxCents) * 50))
    : 50;

  const gaugeColor = detectedNote && detectedNote.note !== '?'
    ? Math.abs(detectedNote.cents) < 5 ? 'in-tune' : detectedNote.cents > 0 ? 'sharp' : 'flat'
    : '';

  return (
    <div className="section tuner-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Tuner</h2>
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
          aria-label={`Switch to ${instrument === 'ukulele' ? 'guitar' : 'ukulele'} tuner`}
        >
          {instrument === 'ukulele' ? <FaGuitar aria-hidden="true" /> : <span style={{ fontSize: '1.2rem' }} aria-hidden="true">🎵</span>}
          {instrument === 'ukulele' ? 'Guitar' : 'Ukulele'}
        </button>
      </div>
      <div className="tuner-display">
        <div className="note-display">{detectedNote ? detectedNote.note : '—'}</div>
        <div className="frequency-display">{detectedNote ? `${detectedNote.freq.toFixed(1)} Hz` : '— Hz'}</div>
        {detectedNote && detectedNote.note !== '?' && (
          <div className="cents-display">
            {detectedNote.cents > 0 ? '+' : ''}{detectedNote.cents}¢
          </div>
        )}
      </div>
      <div className="tuner-gauge">
        <div className="gauge-center-marker" />
        <div className={`gauge-indicator ${gaugeColor}`} style={{ left: `${gaugePercent}%` }} />
      </div>
      {detectedNote && detectedNote.note !== '?' && (
        <div className="gauge-text-indicator" aria-live="polite">
          {gaugeColor === 'flat' && '♭ Flat'}
          {gaugeColor === 'in-tune' && '♪ In Tune'}
          {gaugeColor === 'sharp' && '♯ Sharp'}
        </div>
      )}
      <div className="tuning-selector">
        {TUNINGS_BY_INSTRUMENT[instrument].map(key => (
          <div key={key} className="tuning-option">
            <button className={`tuning-btn ${tuning === key ? 'active' : ''}`} onClick={() => setTuning(key)} aria-pressed={tuning === key}>
              {TUNINGS[key].name}
            </button>
            {tuning === key && (
              <div className="reference-tones">
                {TUNINGS[key].notes.map((note, idx) => (
                  <button key={note} className="tone-btn" onClick={() => playReferenceTone(TUNINGS[key].freq[idx])} aria-label={`Play reference tone for ${note}`}>
                    {note}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="tuner-controls">
        <button className="control-btn" type="button" onClick={isListening ? stopTuner : startTuner}>
          {isListening ? 'Stop' : 'Start'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className={`tuner-status ${isListening ? 'listening' : 'stopped'}`} aria-live="polite">
        {isCalibrating ? 'Calibrating...' : isListening ? 'Listening...' : 'Press Start to begin'}
      </div>
    </div>
  );
}

export default Tuner;