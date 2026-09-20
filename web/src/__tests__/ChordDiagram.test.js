import { render, screen } from '@testing-library/react';
import ChordDiagram from '../components/ChordDiagram';

// Regression guard for issue #213: open-position chords must never display a
// starting-fret label ('Nfr') because they are played at the nut. The label
// would contradict the open-string (O) markers above the nut.
test.each([
  ['ukulele C', [0, 0, 0, 3]],
  ['ukulele D', [2, 2, 2, 0]],
  ['ukulele G', [0, 2, 3, 2]],
  ['ukulele Am', [2, 0, 0, 0]],
  ['ukulele Em', [0, 4, 3, 2]],
])('does not render Nfr label for open-position %s', (name, frets) => {
  const fingers = frets.map((f, i) => (f > 0 ? 1 : 0)); // dummy fingering
  render(<ChordDiagram frets={frets} fingers={fingers} size={100} />);
  
  const svg = screen.getByRole('img');
  const textElements = svg.querySelectorAll('text');
  const startFretLabels = Array.from(textElements).filter(el => /fr$/.test(el.textContent));
  expect(startFretLabels).toHaveLength(0);
});

// A barre chord with no open strings (all fretted or muted) may shift base fret.
test('renders correct Nfr label for barre chord with no open strings', () => {
  // ukulele Bm shape: [4, 2, 2, 2] -> fret range 2-4 (<4) so startFret=2
  render(<ChordDiagram frets={[4, 2, 2, 2]} fingers={[4, 1, 1, 1]} size={100} />);
  
  const svg = screen.getByRole('img');
  const textElements = svg.querySelectorAll('text');
  const startFretLabels = Array.from(textElements).filter(el => /fr$/.test(el.textContent));
  expect(startFretLabels).toHaveLength(1);
  expect(startFretLabels[0].textContent).toBe('2fr');
});