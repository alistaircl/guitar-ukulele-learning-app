import { render } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

// Regression test for issue #152: ErrorBoundary must not silently swallow errors.
// The bug was that componentDidCatch only logged via console.error when
// process.env.NODE_ENV === 'development', so production errors vanished.
//
// Test environment runs NODE_ENV='test'; the previous dev-only gate meant
// componentDidCatch was a no-op here, so asserting console.error is called
// proves the logging now runs unconditionally (the fix).

// Helper: a child component that throws on render to trigger the boundary.
function Bomb({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('kaboom-test-error');
  }
  return <div>ok</div>;
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('falls back to error UI when a child throws', () => {
  // Suppress expected React noise about the thrown error.
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const { getByText } = render(
    <ErrorBoundary>
      <Bomb shouldThrow />
    </ErrorBoundary>
  );
  // getByText throws if not found, so this proves the fallback UI rendered.
  expect(getByText('Something went wrong').tagName).toBe('H1');
  // and componentDidCatch must have logged it.
  expect(spy).toHaveBeenCalled();
});

test('componentDidCatch logs the error via console.error unconditionally', () => {
  // This is the core regression test for #152.
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <ErrorBoundary>
      <Bomb shouldThrow />
    </ErrorBoundary>
  );
  const logged = spy.mock.calls.some(
    (call) =>
      typeof call[0] === 'string' &&
      call[0].includes('ErrorBoundary') &&
      call.some(
        (arg) =>
          (arg instanceof Error && arg.message === 'kaboom-test-error') ||
          (typeof arg === 'string' && arg.includes('kaboom-test-error'))
      )
  );
  expect(logged).toBe(true);
});
