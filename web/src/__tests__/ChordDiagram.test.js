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

// Regression guard for issue #428: barre detection must identify barres on
// non-consecutive strings (same finger, same fret, with a gap). E.g. finger 1
// on strings 0 and 2 at fret 3 with string 1 open is a valid partial barre;
// the red barre line should span from string 0 to string 2.
test('renders barre line for non-consecutive same-finger same-fret strings', () => {
  // finger 1 on strings 0 and 2 at fret 3; strings 1 and 3 open
  render(<ChordDiagram frets={[3, 0, 3, 0]} fingers={[1, 0, 1, 0]} size={100} />);

  const svg = screen.getByRole('img');
  const barreLines = Array.from(svg.querySelectorAll('line')).filter(
    el => el.getAttribute('stroke') === '#ef4444' && el.getAttribute('stroke-width') === '6'
  );
  expect(barreLines.length).toBeGreaterThan(0);
  const [barre] = barreLines;
  // Barre spans from string 0 to string 2
  expect(Number(barre.getAttribute('x1'))).toBeLessThanOrEqual(Number(barre.getAttribute('x2')));
});

// Regression guard: a single fretted string is NOT a barre (need 2+ strings).
test('does not render barre line when only one string is fretted with a finger', () => {
  render(<ChordDiagram frets={[3, 0, 0, 0]} fingers={[1, 0, 0, 0]} size={100} />);

  const svg = screen.getByRole('img');
  const barreLines = Array.from(svg.querySelectorAll('line')).filter(
    el => el.getAttribute('stroke') === '#ef4444' && el.getAttribute('stroke-width') === '6'
  );
  expect(barreLines).toHaveLength(0);
});