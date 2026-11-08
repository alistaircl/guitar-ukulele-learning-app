
import { render, fireEvent, screen, act } from '@testing-library/react';
import Tuner from '../components/Tuner';

test('renders Tuner without crashing', () => {
  render(<Tuner />);
  // We can add more specific assertions here
});

test('shows an error message when microphone permission is denied (issue #486)', async () => {
  const originalAudioContext = window.AudioContext;
  const originalMediaDevices = navigator.mediaDevices;
  // Mock an available AudioContext so startTuner proceeds to getUserMedia
  window.AudioContext = class {
    constructor() { this.state = 'running'; }
  };
  navigator.mediaDevices = {
    getUserMedia: jest.fn(() => {
      const err = new Error('Permission denied');
      err.name = 'NotAllowedError';
      return Promise.reject(err);
    }),
  };
  try {
    render(<Tuner />);
    fireEvent.click(screen.getByText('Start'));
    // Flush the async getUserMedia rejection + React re-render
    await act(async () => {});
    expect(screen.getByText(/Microphone access denied/i)).toBeTruthy();
  } finally {
    window.AudioContext = originalAudioContext;
    navigator.mediaDevices = originalMediaDevices;
  }
});
