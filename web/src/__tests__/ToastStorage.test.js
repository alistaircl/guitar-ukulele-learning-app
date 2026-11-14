import { render, waitFor } from '@testing-library/react';
import { ToastProvider } from '../components/Toast';
import ChordLibrary from '../components/ChordLibrary';

// Regression guard for issue #534: storage write failures must be surfaced
// to the user via a toast, not just logged to the console.
test('surfaces localStorage write failures via a toast (issue #534)', async () => {
  const setItemSpy = jest
    .spyOn(Storage.prototype, 'setItem')
    .mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

  try {
    const { getByText } = render(
      <ToastProvider>
        <ChordLibrary />
      </ToastProvider>
    );

    // Reading the saved preference fails -> toast; persisting the default
    // preference fails -> toast. Both mention the instrument preference.
    await waitFor(() => expect(getByText(/instrument preference/i)).toBeTruthy());
    expect(getByText(/instrument preference/i)).toBeTruthy();
  } finally {
    setItemSpy.mockRestore();
  }
});
