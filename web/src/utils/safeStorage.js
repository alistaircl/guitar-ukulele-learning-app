// Safe storage helpers used across the app (Tuner, Chord Library, Song
// Library, App). Try localStorage first, then sessionStorage, and
// gracefully handle environments where storage is blocked (private
// browsing, disabled cookies, quota exceeded).
//
// safeStorageGet returns { value, error } so callers can distinguish "key
// not present" (value: null, error: null) from "storage unavailable"
// (value: null, error: Error) and surface the latter to the user
// (issue #534). The error names each backend that was tried and the last
// specific failure so it can be diagnosed (issue #636).
// safeStorageSet returns { success, error } so callers can distinguish a
// successful write from a blocked one and surface the underlying error.
export function safeStorageGet(key) {
  const attempted = [];
  let lastError = null;
  for (const storeName of ['localStorage', 'sessionStorage']) {
    attempted.push(storeName);
    try {
      const store = window[storeName];
      const value = store.getItem(key);
      return { value, error: null };
    } catch (e) {
      lastError = e;
      console.error(`Could not read "${key}" from ${storeName}:`, e.message || e);
    }
  }
  return {
    value: null,
    error: new Error(
      `Storage is unavailable or blocked (tried: ${attempted.join(', ')}; last error: ${lastError?.message || lastError})`
    ),
  };
}

export function safeStorageSet(key, value) {
  const attempted = [];
  let lastError = null;
  for (const storeName of ['localStorage', 'sessionStorage']) {
    attempted.push(storeName);
    try {
      window[storeName].setItem(key, value);
      return { success: true };
    } catch (e) {
      lastError = e;
      console.error(`Could not save "${key}" to ${storeName}:`, e.message || e);
    }
  }
  return {
    success: false,
    error: new Error(
      `Storage is unavailable or blocked (tried: ${attempted.join(', ')}; last error: ${lastError?.message || lastError})`
    ),
  };
}
