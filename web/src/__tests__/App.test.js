import { render, fireEvent, screen } from '@testing-library/react';
import App from '../App';
import fs from 'fs';
import path from 'path';

// Regression guard for issue #520: switching tabs should always show the
// library view for that tab, not a detail view left open from a previous
// interaction. Components unmount/remount on tab switch, so the detail-view
// state must reset.
test('switching tabs resets to library view instead of showing a detail view (issue #520)', () => {
  render(<App />);

  // Open Songs tab and select a song to reveal its detail view
  fireEvent.click(screen.getByRole('button', { name: 'Navigate to Songs' }));
  fireEvent.click(screen.getByText('Somewhere Over the Rainbow'));
  expect(screen.getByText(/Back to Songs/)).toBeTruthy();

  // Switch to Tuner, then back to Songs
  fireEvent.click(screen.getByRole('button', { name: 'Navigate to Tuner' }));
  fireEvent.click(screen.getByRole('button', { name: 'Navigate to Songs' }));

  // Back on Songs: library list should be shown, not the detail view
  expect(screen.queryByText(/Back to Songs/)).toBeNull();
  expect(screen.getAllByText('Somewhere Over the Rainbow').length).toBeGreaterThan(0);
});

// Regression guard for issue #597: the document title must not contain the
// incorrect horse emoji; it should match the Open Graph title exactly.
// The title is defined in public/index.html, so assert against that source.

test('document title contains no horse emoji (issue #597)', () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../../public/index.html'), 'utf8');
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : '';
  expect(title).not.toContain('🐴');
  expect(title).toBe('🎸🎵 Guitar & Ukulele Learning App');
});
