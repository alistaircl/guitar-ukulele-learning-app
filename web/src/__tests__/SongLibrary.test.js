import { render, fireEvent, screen } from '@testing-library/react';
import SongLibrary from '../components/SongLibrary';

test('renders SongLibrary with song cards', () => {
  render(<SongLibrary />);
  const cards = document.querySelectorAll('.song-card');
  console.log('SONG_CARD_COUNT=' + cards.length);
  const titles = Array.from(document.querySelectorAll('.song-title')).map(el => el.textContent);
  console.log('TITLES=' + JSON.stringify(titles));
  expect(cards.length).toBeGreaterThan(0);
});

// Regression guard for issue #464: searching the Song Library filters the
// displayed songs to those matching title or artist. (#464 is a duplicate
// of #480; same underlying behavior, verified here for this issue as well.)
test('song library search filters results', () => {
  render(<SongLibrary />);
  const input = screen.getByPlaceholderText(/Search by title or artist/);
  fireEvent.change(input, { target: { value: 'Rainbow' } });
  expect(screen.getByText('Somewhere Over the Rainbow')).toBeTruthy();
  expect(screen.queryByText('You Are My Sunshine')).toBeNull();
});