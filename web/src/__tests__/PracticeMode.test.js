import { render, fireEvent, waitFor, screen } from '@testing-library/react';
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

// Regression guard for issue #458: clicking Start initiates a practice session
// (countdown begins and the Start button gives way to playback controls).
test('Start button initiates a practice session', async () => {
  const { getByText, queryByText } = render(<PracticeMode />);
  fireEvent.click(getByText('▶ Start'));
  await waitFor(() => expect(getByText('3')).toBeDefined(), { timeout: 5000 });
  // Start button gives way to playback controls once the countdown is underway
  expect(queryByText('▶ Start')).toBeNull();
});

// Regression guard for issue #536: Reset requires explicit confirmation
// before clearing saved practice progress for all songs.
test('Reset requires confirmation before clearing all progress (issue #536)', () => {
  localStorage.clear();
  const { getByText, queryByText } = render(<PracticeMode />);

  // First click opens the confirmation instead of resetting immediately
  fireEvent.click(getByText('Reset'));
  expect(queryByText('Reset')).toBeNull();
  expect(getByText(/cannot be undone/i)).toBeTruthy();

  // Cancel aborts the reset
  fireEvent.click(getByText('Cancel'));
  expect(queryByText(/cannot be undone/i)).toBeNull();
  expect(getByText('Reset')).toBeTruthy();

  // Confirm performs the reset and surfaces an info message
  fireEvent.click(getByText('Reset'));
  fireEvent.click(getByText('Confirm Reset'));
  expect(getByText(/Progress reset for all songs/i)).toBeTruthy();
});

// Regression guard for issue #519: clicking Next during playback should
// advance to the next line and KEEP the session going, not reset it back to
// the Start screen (which happens when goToLine stops playback and
// beginPlayback restarts from index 0).
test('Next button advances to next line without resetting the session (issue #519)', async () => {
  const { getByText, queryByText } = render(<PracticeMode />);
  fireEvent.click(getByText('▶ Start'));
  // Wait for playback to genuinely begin: Start button gone AND the chord
  // diagram rendering (only shown while isPlaying is true).
  await waitFor(() => expect(queryByText('▶ Start')).toBeNull(), { timeout: 8000 });
  await waitFor(() => expect(screen.queryByRole('img', { name: /Chord diagram for/ })).toBeTruthy(), { timeout: 8000 });
  fireEvent.click(getByText('Next →'));
  // Session must NOT reset: Start button stays gone (isPlaying stays true)
  expect(queryByText('▶ Start')).toBeNull();
  // The line counter should have advanced past the line that was playing
  await waitFor(() => expect(screen.queryByText(/\d \//)).toBeTruthy(), { timeout: 5000 });
});

// Regression guard for issue #554: selecting a different song from the
// Practice mode song selector dropdown updates the practice view to that song.
test('song selector dropdown changes the practice song (issue #554)', () => {
  localStorage.clear();
  const { getByLabelText, queryByText } = render(<PracticeMode />);
  const selector = getByLabelText(/Select song to practice/);
  // Default song is Somewhere Over the Rainbow (id 1): its first lyric line shows
  expect(screen.getAllByText('Oooooooo ooooo ooooo ooooo').length).toBeGreaterThan(0);
  // Switch to Let It Be (id 3)
  fireEvent.change(selector, { target: { value: '3' } });
  // Practice view now shows Let It Be's content
  expect(screen.getAllByText('Mother Mary comes to me').length).toBeGreaterThan(0);
  // Previous song's first line is no longer displayed in the practice view
  expect(queryByText('Oooooooo ooooo ooooo ooooo')).toBeNull();
});

// Regression guard for issue #556: Practice Mode must render chord diagrams
// matching the selected instrument (guitar = 6 strings, ukulele = 4 strings),
// not a hardcoded 'ukulele'. Chord diagrams render once playback begins, so we
// start the session and inspect the rendered SVG (matches the #519 test's
// countdown/playback timing).
test('renders a 6-string guitar chord diagram when instrument is guitar (issue #556)', async () => {
  render(<PracticeMode instrument="guitar" />);
  fireEvent.click(screen.getByText('▶ Start'));
  await waitFor(() => expect(screen.queryByText('▶ Start')).toBeNull(), { timeout: 8000 });
  const diagram = await waitFor(() => screen.getByRole('img', { name: /Chord diagram for C/ }), { timeout: 8000 });
  // Vertical lines are the strings; guitar has 6, ukulele has 4.
  const stringLines = Array.from(diagram.querySelectorAll('line')).filter(
    (line) => line.getAttribute('x1') === line.getAttribute('x2')
  );
  expect(stringLines).toHaveLength(6);
});

test('renders a 4-string ukulele chord diagram by default (issue #556)', async () => {
  render(<PracticeMode />);
  fireEvent.click(screen.getByText('▶ Start'));
  await waitFor(() => expect(screen.queryByText('▶ Start')).toBeNull(), { timeout: 8000 });
  const diagram = await waitFor(() => screen.getByRole('img', { name: /Chord diagram for C/ }), { timeout: 8000 });
  const stringLines = Array.from(diagram.querySelectorAll('line')).filter(
    (line) => line.getAttribute('x1') === line.getAttribute('x2')
  );
  expect(stringLines).toHaveLength(4);
});
