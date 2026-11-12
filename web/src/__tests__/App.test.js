import { render, fireEvent, screen } from '@testing-library/react';
import App from '../App';

// Regression guard for issue #520: switching tabs should always show the
// library view for that tab, not a detail view left open from a previous
// interaction. Components unmount/remount on tab switch, so the detail-view
// state must reset.
test('switching tabs resets to library view instead of showing a detail view (issue #520)', () => {
  render(<App />);

  // Open Songs tab and select a song to reveal its detail view
  fireEvent.click(screen.getByRole('button', { name: 'Songs' }));
  fireEvent.click(screen.getByText('Somewhere Over the Rainbow'));
  expect(screen.getByText(/Back to Songs/)).toBeTruthy();

  // Switch to Tuner, then back to Songs
  fireEvent.click(screen.getByRole('button', { name: 'Tuner' }));
  fireEvent.click(screen.getByRole('button', { name: 'Songs' }));

  // Back on Songs: library list should be shown, not the detail view
  expect(screen.queryByText(/Back to Songs/)).toBeNull();
  expect(screen.getAllByText('Somewhere Over the Rainbow').length).toBeGreaterThan(0);
});
