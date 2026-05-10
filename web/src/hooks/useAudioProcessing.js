import { useState, useEffect, useCallback } from 'react';
import { startAudioProcessing, stopAudioProcessing } from '../utils/audio';

export const useAudioProcessing = (callback) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(async () => {
    try {
      await startAudioProcessing(callback);
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start audio processing:', err);
      // Don't set listening state to true if it failed
    }
  }, [callback]);

  const stopListening = useCallback(() => {
    stopAudioProcessing();
    setIsListening(false);
  }, []);

  return { isListening, startListening, stopListening };
};