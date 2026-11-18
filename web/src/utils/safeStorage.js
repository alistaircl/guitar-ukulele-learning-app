// Safe storage helpers used across the app (Tuner, Chord Library, Song
// Library, App). Try localStorage first, then sessionStorage, and
// gracefully handle environments where storage is blocked (private
// browsing, disabled cookies, quota exceeded).
//
// safeStorageGet returns { value, error } so callers can distinguish "key
// not present" (value: null, error: null) from "storage unavailable"
// (value: null, error: Error) and surface the latter to the user
// (issue #534). safeStorageSet returns true on success, false if every
// available store rejected the write.
//
// Error messages are specific to the failure cause so users get
// actionable feedback (issue #561):
//   - QuotaExceededError → storage quota exceeded
//   - SecurityError/NotAllowedError → blocked (private browsing, settings)
//   - Other → generic unavailable message with store name
function storageErrorMessage(storeName, e) {
  const name = e?.name || '';
  const message = e?.message || '';

  if (name === 'QuotaExceededError' || message.includes('quota')) {
    return new Error(`Storage quota exceeded on ${storeName}. Clear some saved data and try again.`);
  }
  if (name === 'SecurityError' || name === 'NotAllowedError' ||
      message.includes('blocked') || message.includes('denied')) {
    return new Error(`Storage is blocked on ${storeName} (private browsing or browser settings?).`);
  }
  return new Error(`Storage is unavailable on ${storeName}.`);
}

export function safeStorageGet(key) {
  let lastError = null;
  for (const storeName of ['localStorage', 'sessionStorage']) {
    try {
      const store = window[storeName];
      const value = store.getItem(key);
      return { value, error: null };
    } catch (e) {
      lastError = storageErrorMessage(storeName, e);
      console.error(`Could not read "${key}" from ${storeName}:`, e.message || e);
    }
  }
  return { value: null, error: lastError || new Error('Storage is unavailable or blocked') };
}

export function safeStorageSet(key, value) {
  let lastError = null;
  for (const storeName of ['localStorage', 'sessionStorage']) {
    try {
      window[storeName].setItem(key, value);
      return true;
    } catch (e) {
      lastError = storageErrorMessage(storeName, e);
      console.error(`Could not save "${key}" to ${storeName}:`, e.message || e);
    }
  }
  return false;
}
