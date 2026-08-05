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

// Regression test for issue #184: ErrorBoundary must surface error details to
// users in production builds, not just in development. The previous code gated the
// details block behind `process.env.NODE_ENV === 'development'`, so on the
// deployed GitHub Pages build (NODE_ENV='production') the entire <details> block
// was dead-code-eliminated by the minifier and users got only a generic
// "Something went wrong" message with no error text to share in a bug report.
//
// The Jest test environment runs with NODE_ENV='test', so the dev-only gate
// (which compared against 'development') was already a no-op here — meaning this
// test FAILS against the old code (the details block never rendered) and PASSES
// once the gate is removed.
test('renders the error message in the fallback so users can report it (issue #184)', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  const { getByText } = render(
    <ErrorBoundary>
      <Bomb shouldThrow />
    </ErrorBoundary>
  );
  // The fallback should contain the error message text (inside the <pre> of a
  // <details>), so the user can expand it and copy the message into a bug
  // report. We assert via regex on the <pre> element's text content since the
  // rendered string is the full "Error: kaboom-test-error\n\nComponent stack:\n..."
  // and getByText with a regex matches it as a single element's normalized text.
  const errorPre = getByText(/kaboom-test-error/);
  // The error message must live inside a <pre> within a <details> block —
  // confirming the user-visible "Error details (for bug reports)" container
  // rendered (was dead-code-eliminated in production before the fix).
  expect(errorPre.tagName).toBe('PRE');
  expect(errorPre.closest('details')).not.toBeNull();
});
