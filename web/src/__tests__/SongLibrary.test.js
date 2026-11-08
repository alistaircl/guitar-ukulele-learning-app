import { render, fireEvent, screen } from '@testing-library/react';
import SongLibrary from '../components/SongLibrary';
import { PRACTICE_SONGS } from '../components/PracticeMode';
import { getChordByInstrument } from '../data/chords';

test('renders SongLibrary with song cards', () => {
  render(<SongLibrary />);
  const cards = document.querySelectorAll('.song-card');
  console.log('SONG_CARD_COUNT=' + cards.length);
  const titles = Array.from(document.querySelectorAll('.song-title')).map(el => el.textContent);
  console.log('TITLES=' + JSON.stringify(titles));
  expect(cards.length).toBeGreaterThan(0);
});

// Regression guard for issue #480: searching the Song Library filters the
// displayed songs to those matching title or artist.
test('song library search filters results', () => {
  render(<SongLibrary />);
  const input = screen.getByPlaceholderText(/Search by title or artist/);
  fireEvent.change(input, { target: { value: 'Rainbow' } });
  expect(screen.getByText('Somewhere Over the Rainbow')).toBeTruthy();
  expect(screen.queryByText('You Are My Sunshine')).toBeNull();
});

// Regression guard for issue #487: every chord used in a practice song must
// resolve to a diagram in the chord library (ukulele or guitar) so the Song
// Detail view never renders "Diagram not in library".
test('all practice-song chords resolve to a chord-library diagram', () => {
  const missing = [];
  for (const song of PRACTICE_SONGS) {
    for (const name of song.chords) {
      if (!getChordByInstrument(name, 'ukulele') && !getChordByInstrument(name, 'guitar')) {
        missing.push(`${song.title}: ${name}`);
      }
    }
  }
  expect(missing).toEqual([]);
});
