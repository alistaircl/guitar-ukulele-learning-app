import { render, screen } from '@testing-library/react';
import ChordLibrary from '../components/ChordLibrary';

// Simple regression test: verify ChordLibrary renders and has aria-labels
test('renders ChordLibrary with chord cards that have aria-labels', () => {
  render(<ChordLibrary />);
  
  const chordCards = screen.getAllByRole('button');
  expect(chordCards.length).toBeGreaterThan(0);
  
  // Check that at least one card has an aria-label
  const cardsWithLabels = chordCards.filter(card => card.getAttribute('aria-label'));
  expect(cardsWithLabels.length).toBeGreaterThan(0);
  
  // Log a sample label for manual inspection
  const sampleLabel = chordCards[0].getAttribute('aria-label');
  console.log('Sample aria-label:', sampleLabel);
});