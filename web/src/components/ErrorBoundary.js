import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Always log caught errors so production issues are diagnosable.
    // Errors must not be silently swallowed (see issue #152).
    console.error('ErrorBoundary caught:', error, errorInfo);

    // Store errorInfo in state for potential retry/reporting mechanisms.
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  // Recovery option (#160): reset the boundary so children re-mount without
  // forcing a full page reload. Useful when the error was transient (e.g. a
  // flaky async render, a one-off data fetch). If the underlying fault
  // persists, getDerivedStateFromError will re-flip hasError and the user is
  // back on the fallback — no infinite loop.
  handleTryAgain = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          background: 'var(--bg-primary, #f5f5f5)',
          color: 'var(--text-primary, #333)',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--danger, #dc3545)' }}>
            Something went wrong
          </h1>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary, #666)', maxWidth: '500px' }}>
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          {this.state.error && process.env.NODE_ENV === 'development' && (
            <details style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: 'var(--bg-tertiary, #eee)',
              borderRadius: '8px',
              textAlign: 'left',
              maxWidth: '600px',
              overflow: 'auto'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '0.5rem' }}>
                Error Details (Development)
              </summary>
              <pre style={{ 
                fontSize: '0.85rem', 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: 'var(--text-primary, #333)'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo ? '\n\nComponent stack:\n' + this.state.errorInfo.componentStack : ''}
              </pre>
            </details>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <button
              onClick={this.handleTryAgain}
              aria-label="Try Again — re-render without reloading the page"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                background: 'transparent',
                color: 'var(--accent-primary, #667eea)',
                border: '2px solid var(--accent-primary, #667eea)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, background 0.2s ease'
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = 'rgba(102, 126, 234, 0.1)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = 'transparent'; }}
            >
              Try Again
            </button>
            <button
              onClick={this.handleReload}
              aria-label="Reload Page"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                background: 'var(--accent-primary, #667eea)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Reload Page
            </button>
          </div>
          <a
            href="https://github.com/alistaircl/guitar-ukulele-learning-app/issues/new?labels=bug&template=bug_report.md"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Report this issue on GitHub (opens in a new tab)"
            style={{
              fontSize: '0.9rem',
              color: 'var(--accent-secondary, #764ba2)',
              textDecoration: 'underline'
            }}
          >
            Report this issue ↗
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;