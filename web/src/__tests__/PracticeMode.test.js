import { render, fireEvent } from '@testing-library/react';
import PracticeMode from '../components/PracticeMode';

// Mock AudioContext so chord playback does not throw in jsdom, which has no
// Web Audio API. Practice mode must keep working (timer + streak) even when
// audio is unavailable (issues #155, #206, #387).
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
