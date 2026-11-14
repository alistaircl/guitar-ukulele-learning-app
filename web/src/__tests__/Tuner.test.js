
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
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

// Regression guard for issue #538: starting the tuner shows a loading state
// (and disables Start) while microphone permission and the audio context are
// being initialized, instead of leaving the user with no feedback.
test('shows a loading state while tuner microphone access initializes (issue #538)', async () => {
  const originalAudioContext = window.AudioContext;
  const originalMediaDevices = navigator.mediaDevices;
  let resolveStream;
  window.AudioContext = class {
    constructor() {
      this.state = 'running';
    }
    createAnalyser() {
      return {
        fftSize: 0,
        getFloatTimeDomainData: () => {},
        connect: () => {},
      };
    }
    createMediaStreamSource() {
      return { connect: () => {} };
    }
    close() {
      return Promise.resolve();
    }
  };
  navigator.mediaDevices = {
    getUserMedia: jest.fn(() => new Promise((resolve) => { resolveStream = resolve; })),
  };

  try {
    const { getByText, getByRole } = render(<Tuner />);
    fireEvent.click(getByText('Start'));

    // Loading state appears immediately and Start is disabled while in flight
    await waitFor(() => expect(getByText(/Requesting microphone access/i)).toBeTruthy());
    expect(getByRole('button', { name: /Start/ }).disabled).toBe(true);

    // Grant microphone access -> calibration completes -> Listening
    resolveStream({ getTracks: () => [] });
    await act(async () => {});
    await waitFor(() => expect(getByText(/Listening/i)).toBeTruthy());
    expect(getByText('Stop').disabled).toBe(false);

    fireEvent.click(getByText('Stop'));
    await act(async () => {});
  } finally {
    window.AudioContext = originalAudioContext;
    navigator.mediaDevices = originalMediaDevices;
  }
});
