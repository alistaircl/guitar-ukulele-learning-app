import React, { useState, useEffect, useRef } from 'react';
import { Instrument } from '../models/Instrument';
import { noteToFrequency, frequencyToNote } from '../utils/noteUtils';
import { startAudioProcessing, stopAudioProcessing } from '../utils/audio';

const Tuner = () => {
  const [instrument, setInstrument] = useState(Instrument.GUITAR);
  const [note, setNote] = useState('--');
  const [centsOff, setCentsOff] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);
  const animationRef = useRef(null);

  const referenceFrequencies = instrument === Instrument.GUITAR
    ? [82.41, 110.00, 146.83, 196.00, 246.94, 329.63] // E2, A2, D3, G3, B3, E4
    : [196.00, 261.63, 329.63, 440.00]; // G3, C4, E4, A4

  const noteNames = instrument === Instrument.GUITAR
    ? ['E', 'A', 'D', 'G', 'B', 'E']
    : ['G', 'C', 'E', 'A'];

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const startListening = async () => {
    try {
      const audioProcessor = await startAudioProcessing(
        (frequency, amplitude) => {
          // Update input level (0-1)
          setInputLevel(Math.min(amplitude * 10, 1)); // Scale for visibility

          // Find closest note
          let minDistance = Infinity;
          let closestIndex = -1;

          referenceFrequencies.forEach((refFreq, index) => {
            const distance = Math.abs(frequency - refFreq);
            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = index;
            }
          });

          if (closestIndex !== -1) {
            const closestFreq = referenceFrequencies[closestIndex];
            const centsOff = 1200 * Math.log2(frequency / closestFreq);
            setNote(noteNames[closestIndex]);
            setCentsOff(Math.round(centsOff));
          } else {
            setNote('--');
            setCentsOff(0);
          }
        }
      );

      setIsListening(true);
    } catch (err) {
      console.error('Failed to start audio processing:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopListening = () => {
    stopAudioProcessing();
    setIsListening(false);
    setNote('--');
    setCentsOff(0);
    setInputLevel(0);
  };

  return (
    <div className="tuner">
      <h2>{instrument === Instrument.GUITAR ? 'Guitar Tuner' : 'Ukulele Tuner'}</h2>
      
      <div className="instrument-selector">
        <label>
          <input
            type="radio"
            value={Instrument.GUITAR}
            checked={instrument === Instrument.GUITAR}
            onChange={(e) => setInstrument(Instrument.GUITAR)}
          />
          Guitar
        </label>
        <label>
          <input
            type="radio"
            value={Instrument.UKULELE}
            checked={instrument === Instrument.UKULELE}
            onChange={(e) => setInstrument(Instrument.UKULELE)}
          />
          Ukulele
        </label>
      </div>

      <div className="note-display">
        <div className="note">{note}</div>
        <div className="cents">{centsOff !== 0 ? `${centsOff > 0 ? '+' : ''}${centsOff}` : '0'}¢</div>
      </div>

      <div className="level-meter">
        <label>Input Level:</label>
        <div className="level-container">
          <div className="level-bar" style={{ width: `${inputLevel * 100}%` }}></div>
        </div>
        <span className="level-percent">${Math.round(inputLevel * 100)}%</span>
      </div>

      <button
        onClick={isListening ? stopListening : startListening}
        className={`${isListening ? 'stop' : 'start'} btn`}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>

      {!isListening && (
        <p className="instruction">
          Click the button above and allow microphone access to tune your instrument.
        </p>
      )}
    </div>
  );
};

export default Tuner;