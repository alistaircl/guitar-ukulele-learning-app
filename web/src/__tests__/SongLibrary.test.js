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

// Regression guard for issue #457: song cards are interactive (button role)
// and clicking one navigates to the song detail view.
test('song cards are clickable and open the song detail view', () => {
  render(<SongLibrary />);
  fireEvent.click(screen.getByText('Somewhere Over the Rainbow').closest('[role="button"]'));
  expect(screen.getByText('Somewhere Over the Rainbow')).toBeTruthy();
  expect(screen.getByText(/Chords Used/)).toBeTruthy();
});