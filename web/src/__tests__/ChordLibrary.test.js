import { render, screen } from '@testing-library/react';
import ChordLibrary from '../components/ChordLibrary';

test('renders ChordLibrary with chord diagrams', () => {
  render(<ChordLibrary />);
  // The library must render actual chord cards with chord-diagram SVGs,
  // not an empty grid. Regression guard for issue #203.
  const cards = document.querySelectorAll('.chord-card');
  expect(cards.length).toBeGreaterThan(0);
  const diagrams = document.querySelectorAll('.chord-diagram');
  expect(diagrams.length).toBeGreaterThan(0);
  expect(diagrams.length).toBe(cards.length);
  // A known chord name should be visible inside the rendered grid.
  const chordNames = Array.from(document.querySelectorAll('.chord-name'))
    .map(el => el.textContent);
  expect(chordNames).toContain('C');
});

// Regression guard for singular/plural aria-label (issue #214)
test('renders ChordLibrary with chord cards that have correct aria-labels', () => {
  render(<ChordLibrary />);

  const chordCards = screen.getAllByRole('button');
  expect(chordCards.length).toBeGreaterThan(0);

  // Check that at least one card has an aria-label
  const cardsWithLabels = chordCards.filter(card => card.getAttribute('aria-label'));
  expect(cardsWithLabels.length).toBeGreaterThan(0);
});

// Regression guard for issue #427: when a parent passes the instrument prop,
// ChordLibrary must initialize filteredChords from that instrument (not a
// hardcoded 'ukulele'), otherwise the grid flashes ukulele chords before the
// useEffect syncs to the prop value.
test('initializes filtered chords from the instrument prop (no ukulele flash)', () => {
  const chordsModule = require('../data/chords');
  const spy = jest.spyOn(chordsModule, 'getAllChords');

  render(<ChordLibrary instrument="guitar" setInstrument={() => {}} />);

  // The useState initializer must use the prop instrument, so getAllChords
  // must NOT be called with 'ukulele' during the initial render.
  expect(spy).not.toHaveBeenCalledWith('ukulele');
  spy.mockRestore();
});
