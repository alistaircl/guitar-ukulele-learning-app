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
          <button
            onClick={this.handleReload}
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
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;