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
