import { render, screen } from '@testing-library/react';
import ChordDiagram from '../components/ChordDiagram';

// Regression guard for issue #234: on the 6-string guitar the lowest two
// strings must render as wound (thicker) bass strings — the previous
// hard-coded `i < 2` rule treated a guitar fretboard like a 4-string ukulele.
const lineWidths = (svg) =>
  Array.from(svg.querySelectorAll('line'))
    .filter((el) => el.getAttribute('x1') === el.getAttribute('x2')) // vertical strings
    .map((el) => Number(el.getAttribute('stroke-width')));

test('guitar diagrams mark three wound (bass) strings as thicker', () => {
  // Full-barre F: frets [E,A,D,G,B,e] = [1,3,3,2,1,1]
  render(
    <ChordDiagram frets={[1, 3, 3, 2, 1, 1]} fingers={[1, 3, 4, 2, 1, 1]} instrument="guitar" size={100} />
  );
  const svg = screen.getByRole('img');
  const widths = lineWidths(svg);
  expect(widths).toHaveLength(6);
  expect(widths).toEqual([1.5, 1.5, 1.5, 1, 1, 1]);
});

test('ukulele diagrams keep only two thick strings (unchanged behaviour)', () => {
  render(<ChordDiagram frets={[0, 0, 0, 3]} fingers={[0, 0, 0, 1]} instrument="ukulele" size={100} />);
  const widths = lineWidths(screen.getByRole('img'));
  expect(widths).toEqual([1.5, 1.5, 1, 1]);
});

// Issue #234 also reported the 5th/6th string muting being ignored in the
// accessible description. The diagram must announce the muted low strings.
test('guitar easy-F announces its muted low strings in the aria-label', () => {
  render(
    <ChordDiagram frets={[-1, -1, 3, 2, 1, 1]} fingers={[0, 0, 3, 2, 1, 1]} instrument="guitar" size={100} />
  );
  const label = screen.getByRole('img').getAttribute('aria-label');
  expect(label).toContain('Guitar chord diagram');
  expect(label).toContain('6 strings');
  // Muted low E and A strings must be reported as muted (issue #234).
  expect(label).toContain('low E=x');
  expect(label).toContain('A=x');
  expect(label).toContain('D=3');
});
