import { render, fireEvent, waitFor } from '@testing-library/react';
import PracticeMode from '../components/PracticeMode';

// Mock AudioContext so chord playback does not throw in jsdom, which has no
// Web Audio API. Practice mode must keep working (timer + streak/countdown)
// even when audio is unavailable (issues #155, #206, #387).
global.AudioContext = class {
  constructor() {
    this.state = 'running';
    this.destination = {};
  }
  resume() {
    return Promise.resolve();
  }
  createOscillator() {
    return {
      connect: () => {},
      type: '',
      frequency: { value: 0 },
      start: () => {},
      stop: () => {},
    };
  }
  createGain() {
    return {
      connect: () => {},
      gain: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
    };
  }
  close() {
    return Promise.resolve();
  }
};

test('renders PracticeMode without crashing', () => {
  render(<PracticeMode />);
});

test('streak resets to 0 on Missed instead of decrementing (issue #388)', () => {
  const { getByText, getByLabelText } = render(<PracticeMode />);
  const gotIt = getByLabelText('Mark as correct');
  const missed = getByLabelText('Mark as missed');

  // Two correct lines -> streak 2
  fireEvent.click(gotIt);
  fireEvent.click(gotIt);
  expect(getByText('🔥 2')).toBeDefined();

  // One miss -> streak resets to 0 (not 1)
  fireEvent.click(missed);
  expect(getByText('🔥 0')).toBeDefined();
});

test('Start begins the countdown even when AudioContext.resume() never resolves (issue #387)', async () => {
  // Simulate a browser/device where resume() stays pending (no audio output,
  // strict autoplay). The countdown must still start — audio is optional.
  const NeverResumingAudioContext = class {
    constructor() {
      this.state = 'suspended';
      this.destination = {};
    }
    resume() {
      return new Promise(() => {}); // never resolves
    }
    createOscillator() {
      return {
        connect: () => {},
        type: '',
        frequency: { value: 0 },
        start: () => {},
        stop: () => {},
      };
    }
    createGain() {
      return {
        connect: () => {},
        gain: {
          setValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {},
        },
      };
    }
    close() {
      return Promise.resolve();
    }
  };
  const OriginalAudioContext = global.AudioContext;
  global.AudioContext = NeverResumingAudioContext;

  try {
    const { getByText } = render(<PracticeMode />);
    fireEvent.click(getByText('▶ Start'));

    // Countdown overlay appears immediately; it is not blocked behind resume()
    await waitFor(() => expect(getByText('3')).toBeDefined(), { timeout: 5000 });
  } finally {
    global.AudioContext = OriginalAudioContext;
  }
});
