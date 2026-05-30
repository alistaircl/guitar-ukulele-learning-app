import React, { useState, useEffect, useRef } from 'react';

const TUNINGS = {
  'G4 C4 E4 A4': { name: 'Standard (GCEA)', notes: ['G4', 'C4', 'E4', 'A4'], freq: [392, 261.63, 329.63, 440] },
  'G3 C4 E4 A4': { name: 'Low G (GCEA)', notes: ['G3', 'C4', 'E4', 'A4'], freq: [196.0, 261.63, 329.63, 440] },
  'D4 G4 B4 E5': { name: 'Baritone (DGBE)', notes: ['D4', 'G4', 'B4', 'E5'], freq: [293.66, 392, 493.88, 659.25] },
};

const NOTE_FREQ_MAP = {
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.0, 'G3': 196.0, 'G#3': 207.65, 'A3': 220.0, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.0, 'G#4': 415.3, 'A4': 440.0, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.26, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.0, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.5, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.0, 'A#6': 1864.66, 'B6': 1975.53,
};

function getNearestNote(freq) {
  let nearest = '?';
  let minDiff = Infinity;
  let signedDiff = 0;
  for (const [note, f] of Object.entries(NOTE_FREQ_MAP)) {
    const diff = Math.abs(freq - f);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = note;
      signedDiff = freq - f;
    }
  }
  return { note: nearest, diff: signedDiff, freq };
}

function Tuner() {
  const [tuning, setTuning] = useState('G4 C4 E4 A4');
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState(null);
  const [error, setError] = useState(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const startTuner = async () => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser does not support microphone access.');
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
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      setIsListening(true);
      setError(null);
      detectPitch();
    } catch (err) {
      console.error('Microphone access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Please enable microphone permissions in your browser settings and refresh the page.');
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
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioCtxRef.current) audioCtxRef.current.close();
    setIsListening(false);
    setDetectedNote(null);
  };

  const playReferenceTone = (freq) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
  };


  const autoCorrelate = (buffer, sampleRate) => {
    const SIZE = buffer.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;
    let r1 = 0, r2 = SIZE - 1;
    const thresh = 0.2;
    for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buffer[i]) < thresh) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buffer[SIZE - i]) < thresh) { r2 = SIZE - i; break; }
    const buf = buffer.slice(r1, r2);
    const c = new Array(buf.length).fill(0);
    for (let i = 0; i < buf.length; i++) for (let j = 0; j < buf.length - i; j++) c[i] += buf[j] * buf[j + i];
    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxVal = -1, maxPos = -1;
    for (let i = d; i < buf.length; i++) if (c[i] > maxVal) { maxVal = c[i]; maxPos = i; }
    let T0 = maxPos;
    if (T0 < 1) return -1;
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

  useEffect(() => () => stopTuner(), []);

  const gaugePercent = detectedNote
    ? Math.min(100, Math.max(0, 50 + (detectedNote.diff / 10) * 50 * (detectedNote.freq < NOTE_FREQ_MAP[detectedNote.note] ? -1 : 1)))
    : 50;

  const gaugeColor = detectedNote
    ? Math.abs(detectedNote.diff) < 5 ? 'in-tune' : detectedNote.diff > 0 ? 'sharp' : 'flat'
    : '';

  return (
    <div className="section tuner-container">
      <h2 className="section-title">Tuner</h2>
      <div className="tuner-display">
        <div className="note-display">{detectedNote ? detectedNote.note : '—'}</div>
        <div className="frequency-display">{detectedNote ? `${detectedNote.freq.toFixed(1)} Hz` : '— Hz'}</div>
      </div>
      <div className="tuner-gauge">
        <div className={`gauge-fill ${gaugeColor}`} style={{ width: `${gaugePercent}%` }} />
      </div>
      <div className="tuning-selector">
        {Object.keys(TUNINGS).map(key => (
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
      <div className={`tuner-status ${isListening ? 'listening' : 'stopped'}`}>
        {isListening ? '🎤 Listening...' : 'Press Start to begin'}
      </div>
    </div>
  );
}

export default Tuner;