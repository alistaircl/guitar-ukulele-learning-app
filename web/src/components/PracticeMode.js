import React, { useState, useEffect, useRef } from 'react';
import { useAudioProcessing } from '../hooks/useAudioProcessing';
import { noteToFrequency, frequencyToNote } from '../utils/noteUtils';

const PracticeMode = () => {
  const [song, setSong] = useState(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [timing, setTiming] = useState(0);
  const [currentNote, setCurrentNote] = useState('--');
  const [centsOff, setCentsOff] = useState(0);
  const [isInTune, setIsInTune] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);
  const [selectedInstrument, setSelectedInstrument] = useState('guitar');
  const [tempo, setTempo] = useState(100);
  const [transpose, setTranspose] = useState(0);
  
  const { isListening, startListening, stopListening } = useAudioProcessing(
    (frequency, amplitude) => {
      // Update input level
      setInputLevel(Math.min(amplitude * 10, 1));
      
      // Process pitch for practice feedback
      if (isPracticing && song) {
        const note = frequencyToNote(frequency);
        setCurrentNote(note);
        
        // Simple feedback - in a real app this would be more sophisticated
        // For now, just show if we're playing something
        if (frequency > 80 && frequency < 500) { // Reasonable range for guitar/ukulele
          // Calculate expected note based on song position (simplified)
          const expectedNote = 'E2'; // Placeholder
          const expectedFreq = noteToFrequency(expectedNote);
          if (expectedFreq > 0) {
            const cents = 1200 * Math.log2(frequency / expectedFreq);
            setCentsOff(Math.round(cents));
            setIsInTune(Math.abs(cents) < 15); // Within 15 cents
          }
        }
      }
    }
  );

  // Mock song data - in a real app this would come from props or state
  const mockSong = {
    id: 1,
    title: "Horse with No Name",
    artist: "America",
    duration: 253,
    difficulty: "Beginner",
    sections: [
      { type: 'verse', name: 'Verse/Chorus', startTime: 0, endTime: 253, chords: ['Em', 'D69add9'] }
    ]
  };

  useEffect(() => {
    if (!song) {
      setSong(mockSong);
    }
  }, [song]);

  const startPractice = () => {
    setCurrentTime(0);
    setAccuracy(0);
    setTiming(0);
    setIsPracticing(true);
    startListening();
    
    // Start timer
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 0.1;
        if (newTime >= song.duration) {
          clearInterval(interval);
          setIsPracticing(false);
          stopListening();
          return song.duration;
        }
        return newTime;
      });
    }, 100);
    
    return () => clearInterval(interval);
  };

  const stopPractice = () => {
    setIsPracticing(false);
    stopListening();
  };

  return (
    <div className="practice-mode">
      <h2>Practice Mode</h2>
      
      {song && (
        <div className="song-info">
          <h3>{song.title}</h3>
          <p>by {song.artist}</p>
          <p>Difficulty: {song.difficulty}</p>
        </div>
      )}
      
      <div className="practice-controls">
        <div className="instrument-selector">
          <label>
            <input
              type="radio"
              value="guitar"
              checked={selectedInstrument === 'guitar'}
              onChange={(e) => setSelectedInstrument('guitar')}
            />
            Guitar
          </label>
          <label>
            <input
              type="radio"
              value="ukulele"
              checked={selectedInstrument === 'ukulele'}
              onChange={(e) => setSelectedInstrument('ukulele')}
            />
            Ukulele
          </label>
        </div>
        
        <div className="tempo-control">
          <label>Tempo: </label>
          <input
            type="range"
            min="50"
            max="200"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
          />
          <span>{tempo} BPM</span>
        </div>
        
        <div className="transpose-control">
          <label>Transpose: </label>
          <input
            type="range"
            min="-12"
            max="12"
            value={transpose}
            onChange={(e) => setTranspose(parseInt(e.target.value))}
          />
          <span>{transpose >= 0 ? '+' : ''}{transpose} semitones</span>
        </div>
      </div>

      {!isPracticing && song && (
        <button 
          onClick={startPractice}
          className="start-btn"
        >
          Start Practice
        </button>
      )}

      {isPracticing && (
        <div className="practice-display">
          <div className="time-display">
            <span className="current-time">${formatTime(currentTime)}</span>
            <span className="separator">/</span>
            <span className="total-time">${formatTime(song.duration)}</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(currentTime / song.duration) * 100}%` }}
            ></div>
          </div>
          
          <div className="feedback">
            <div className="note-display">
              <div className="note">{currentNote}</div>
              <div className="cents">{centsOff !== 0 ? `${centsOff > 0 ? '+' : ''}${centsOff}` : '0'}¢</div>
            </div>
            <div className="tune-status">
              {isInTune ? 'In Tune!' : 'Adjust...'}
            </div>
          </div>
          
          <div className="meters">
            <div className="level-meter">
              <label>Input Level:</label>
              <div className="level-container">
                <div className="level-bar" style={{ width: `${inputLevel * 100}%` }}></div>
              </div>
              <span className="level-percent">${Math.round(inputLevel * 100)}%</span>
            </div>
            
            <div className="accuracy-meter">
              <label>Accuracy:</label>
              <div className="level-container">
                <div 
                  className="level-bar"
                  style={{ 
                    width: `${accuracy}%`,
                    backgroundColor: accuracy >= 80 ? '#4CAF50' : accuracy >= 60 ? '#FF9800' : '#F44336'
                  }}
                ></div>
              </div>
              <span className="accuracy-percent">${accuracy}%</span>
            </div>
          </div>
          
          <button 
            onClick={stopPractice}
            className="stop-btn"
          >
            Stop Practice
          </button>
        </div>
      )}
      
      {!isPracticing && !song && (
        <p className="loading">Loading song...</p>
      )}
    </div>
  );
};

// Helper function to format time as MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds) % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default PracticeMode;