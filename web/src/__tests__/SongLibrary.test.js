import { render } from '@testing-library/react';
import SongLibrary from '../components/SongLibrary';

test('renders SongLibrary with song cards', () => {
  render(<SongLibrary />);
  const cards = document.querySelectorAll('.song-card');
  console.log('SONG_CARD_COUNT=' + cards.length);
  const titles = Array.from(document.querySelectorAll('.song-title')).map(el => el.textContent);
  console.log('TITLES=' + JSON.stringify(titles));
  expect(cards.length).toBeGreaterThan(0);
});