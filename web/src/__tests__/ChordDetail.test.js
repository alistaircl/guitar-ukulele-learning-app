import { render, screen } from '@testing-library/react';
import ChordDetail from '../components/ChordDetail';
import { getAllChords } from '../data/chords';

// Regression guard for issue #212: when showPrimaryLabel is true the primary
// voicing is rendered separately, so the FIRST non-primary variation must NOT
// be renamed to 'Primary'. Doing so produced two 'Primary' labels and erased
// the first variation's real name + description.
test('does not rename the first variation to Primary (issue #212)', () => {
  // Ukulele C: primary [0,0,0,3] with two distinct variations ('C (barre)' and
  // 'C (pinky)' — the pinky voicing shares frets but uses different fingers).
  const cChord = getAllChords('ukulele').find((c) => c.name === 'C');
  expect(cChord).toBeTruthy();
  expect((cChord.variations || []).length).toBeGreaterThanOrEqual(2);

  render(<ChordDetail chord={cChord} showPrimaryLabel />);

  // The separately-rendered primary carries the only 'Primary' label.
  const primaryLabels = screen.getAllByText('Primary');
  expect(primaryLabels).toHaveLength(1);

  // The first distinct variation keeps its own label and description.
  expect(screen.getAllByText('C (barre)').length).toBeGreaterThan(0);
  expect(
    screen.getByText('Barre chord shape — great for moving up the neck')
  ).toBeTruthy();

  // The pinky variation keeps its label too.
  expect(screen.getAllByText('C (pinky)').length).toBeGreaterThan(0);
  expect(
    screen.getByText('Alternative fingering using pinky')
  ).toBeTruthy();
});