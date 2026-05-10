// Audio processing utilities using Web Audio API
let audioContext = null;
let analyser = null;
let microphone = null;
let animationFrameId = null;
let dataArray = null;

// Buffer to hold time domain data for amplitude calculation
let timeDomainData = null;

export const startAudioProcessing = (callback) => {
  return new Promise((resolve, reject) => {
    // If already started, stop first
    if (audioContext) {
      stopAudioProcessing();
    }

    try {
      // Create audio context
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create analyser node
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048; // Good balance between frequency and time resolution
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      
      // Time domain data for amplitude (volume)
      timeDomainData = new Uint8Array(bufferLength);
      
      // Get user media (microphone)
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // Create microphone node
          microphone = audioContext.createMediaStreamSource(stream);
          
          // Connect microphone to analyser
          microphone.connect(analyser);
          
          // Start the animation loop
          const detectPitch = () => {
            // Get frequency data
            analyser.getByteFrequencyData(dataArray);
            
            // Get time domain data for amplitude
            analyser.getByteTimeDomainData(timeDomainData);
            
            // Find peak frequency
            let maxValue = 0;
            let maxIndex = 0;
            
            // Look for peak in the frequency range we care about (80Hz to 500Hz for guitar/ukulele)
            // But we'll check the whole spectrum and then filter by reasonable range
            for (let i = 0; i < dataArray.length; i++) {
              if (dataArray[i] > maxValue) {
                maxValue = dataArray[i];
                maxIndex = i;
              }
            }
            
            // Convert bin index to frequency
            const sampleRate = audioContext.sampleRate;
            const frequency = (maxIndex * sampleRate) / analyser.fftSize;
            
            // Calculate amplitude (volume) from time domain data
            // Convert to float [-1, 1] and compute RMS
            let sum = 0;
            for (let i = 0; i < timeDomainData.length; i++) {
              // Convert from 0-255 to -1 to 1
              const val = (timeDomainData[i] / 128) - 1;
              sum += val * val;
            }
            const rms = Math.sqrt(sum / timeDomainData.length);
            const amplitude = Math.min(rms * 2, 1); // Scale to 0-1 (clipped)
            
            // Call the callback with frequency and amplitude
            callback(frequency, amplitude);
            
            // Request next frame
            animationFrameId = requestAnimationFrame(detectPitch);
          };
          
          // Start the loop
          animationFrameId = requestAnimationFrame(detectPitch);
          
          // Resolve the promise when started
          resolve();
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
          reject(err);
        });
    } catch (err) {
      console.error('Error initializing audio context:', err);
      reject(err);
    }
  });
};

export const stopAudioProcessing = () => {
  // Cancel animation frame
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  // Disconnect and release resources
  if (microphone) {
    microphone.disconnect();
    microphone = null;
  }
  
  if (analyser) {
    analyser.disconnect();
    analyser = null;
  }
  
  if (audioContext) {
    // Close the audio context to release resources
    audioContext.close().then(() => {
      audioContext = null;
    });
  }
  
  // Clear buffers
  dataArray = null;
  timeDomainData = null;
};

// Helper function to convert frequency to note name (shared with tuner)
export const frequencyToNote = (frequency) => {
  if (frequency <= 0) return '--';

  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  // Calculate the number of semitones away from A4
  const n = 12 * Math.log2(frequency / 440);
  // Round to the nearest integer to get the semitone offset from A4
  const n0 = Math.round(n);
  // Calculate the frequency of the nearest note
  const nearestFrequency = 440 * Math.pow(2, n0 / 12);
  // Calculate the number of semitones from C0 to this note
  // A4 is the 57th semitone from C0 (since C0 is semitone 0, A4 is 4*12 + 9 = 57)
  const semitonesFromC0 = 57 + n0;
  const octave = Math.floor(semitonesFromC0 / 12) - 1;
  const noteIndex = semitonesFromC0 % 12;
  return noteNames[noteIndex] + octave;
};