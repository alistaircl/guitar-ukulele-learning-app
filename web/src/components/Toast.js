import React, { useCallback, useContext, useState } from 'react';

const ToastContext = React.createContext(null);

// Hook for components that want to surface non-blocking messages to the
// user (e.g. storage failures). Safe to use outside a ToastProvider — it
// then becomes a no-op, so components render standalone in tests.
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { add: () => {}, remove: () => {}, toasts: [] };
  }
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, { duration = 4000 } = {}) => {
    const id = String(Date.now()) + '-' + Math.random().toString(36).slice(2, 8);
    setToasts((t) => [...t, { id, message, duration }]);
    return setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ add, remove, toasts }}>
      {children}
      <div className="toast-container" aria-live="polite" role="status" aria-label="Notifications">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast" role="alert" aria-label={toast.message}>
            <span>{toast.message}</span>
            <button type="button" onClick={() => remove(toast.id)} aria-label="Dismiss">
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
