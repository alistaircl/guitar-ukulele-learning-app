import { render, fireEvent, waitFor } from '@testing-library/react';
import PracticeMode from '../components/PracticeMode';

// Mock AudioContext so chord playback does not throw in jsdom, which has no
// Web Audio API. Practice mode must keep working (timer + countdown) even
// when audio is unavailable (issues #155, #206, #387).
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
