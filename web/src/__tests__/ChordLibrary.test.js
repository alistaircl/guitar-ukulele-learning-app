import { render, screen, fireEvent } from '@testing-library/react';
import ChordLibrary from '../components/ChordLibrary';
import { searchChordsByInstrument } from '../data/chords';

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

// Regression guard for issue #426: multi-term chord search must not match
// major-7th chords when any search term is a minor query (term ending in 'm').
// E.g. searching "c m" (C minor) must not return Cmaj7 because "cmaj7"
// contains both "c" and "m" as substrings.
test.each([['ukulele'], ['guitar']])('searchChordsByInstrument excludes maj7 chords for multi-term minor query %s', (instrument) => {
  const results = searchChordsByInstrument('c m', instrument);
  const names = results.map(chord => chord.name);
  expect(names).not.toContain('Cmaj7');
  expect(names).not.toContain('Gmaj7');
  expect(names).not.toContain('Fmaj7');
  expect(names).toContain('Cm');
});

// Regression guard for issue #470: searching a single note name returns only
// that exact chord (case-insensitive), not every chord.
test('searching a single note name returns only that exact chord', () => {
  const results = searchChordsByInstrument('C', 'ukulele');
  const names = results.map(chord => chord.name);
  expect(names).toEqual(['C']);
  const lower = searchChordsByInstrument('c', 'ukulele').map(chord => chord.name);
  expect(lower).toEqual(['C']);
  // Single note names that include accidentals still match exactly
  expect(searchChordsByInstrument('f#', 'ukulele').map(c => c.name)).toEqual(['F#']);
  expect(searchChordsByInstrument('bb', 'ukulele').map(c => c.name)).toEqual(['Bb']);
});

test('searchChordsByInstrument still matches maj7 chords when searching "c maj7"', () => {
  const results = searchChordsByInstrument('c maj7', 'ukulele');
  const names = results.map(chord => chord.name);
  expect(names).toContain('Cmaj7');
});

test('searchChordsByInstrument excludes maj7 chords for multi-term query "g m"', () => {
  const results = searchChordsByInstrument('g m', 'ukulele');
  const names = results.map(chord => chord.name);
  expect(names).not.toContain('Gmaj7');
  expect(names).toContain('Gm');
});

// Regression guard for issue #472: searching "m" returns only minor chords,
// excluding maj7 chords (whose names merely contain the substring "m").
test('searching "m" returns only minor chords, excludes maj7', () => {
  const results = searchChordsByInstrument('m', 'ukulele');
  const names = results.map(chord => chord.name);
  expect(names).toContain('Am');
  expect(names).toContain('Cm');
  expect(names).toContain('Dm');
  expect(names).not.toContain('Cmaj7');
  expect(names).not.toContain('Gmaj7');
  expect(names).not.toContain('Fmaj7');
});

// Regression guard for issue #485: clicking a chord card opens the chord
// detail view (ChordPage/ChordDetail) instead of leaving the grid unchanged.
test('clicking a chord card opens the chord detail view', () => {
  render(<ChordLibrary />);
  fireEvent.click(screen.getByText('C').closest('[role="button"]'));
  expect(screen.getByText('▶ Play chord')).toBeTruthy();
  expect(screen.getByText('Primary')).toBeTruthy();
});

// Regression guard for issue #537: chord search normalization must handle
// the standard chord notations from the issue:
// - 'C major 7' == 'Cmaj7'
// - 'C minor' == 'Cm' and must not surface Cmaj7 ('cm' is a substring of
//   'cmaj7', so a naive substring match gets it wrong)
// - bare 'major' keyword returns major chords including major 7ths
test.each([['ukulele'], ['guitar']])('searchChordsByInstrument normalizes chord names (issue #537)', (instrument) => {
  expect(searchChordsByInstrument('C major 7', instrument).map((c) => c.name)).toContain('Cmaj7');

  const minorResults = searchChordsByInstrument('C minor', instrument).map((c) => c.name);
  expect(minorResults).toContain('Cm');
  expect(minorResults).not.toContain('Cmaj7');

  const majorResults = searchChordsByInstrument('major', instrument).map((c) => c.name);
  expect(majorResults).toContain('Cmaj7');
  expect(majorResults).not.toContain('Cm');
});

// Unknown chord names (e.g. 'C#m' / 'Dbm', not in either library) must
// return no results rather than a wrong match.
test('unknown chord names return no results instead of wrong matches (issue #537)', () => {
  expect(searchChordsByInstrument('C#m', 'ukulele')).toEqual([]);
  expect(searchChordsByInstrument('Dbm', 'ukulele')).toEqual([]);
  expect(searchChordsByInstrument('C#m', 'guitar')).toEqual([]);
  expect(searchChordsByInstrument('Dbm', 'guitar')).toEqual([]);
});
