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
export function safeStorageGet(key) {
  for (const storeName of ['localStorage', 'sessionStorage']) {
    try {
      const store = window[storeName];
      const value = store.getItem(key);
      return { value, error: null };
    } catch (e) {
      console.error(`Could not read "${key}" from ${storeName}:`, e.message || e);
    }
  }
  return { value: null, error: new Error('Storage is unavailable or blocked') };
}

export function safeStorageSet(key, value) {
  for (const storeName of ['localStorage', 'sessionStorage']) {
    try {
      window[storeName].setItem(key, value);
      return true;
    } catch (e) {
      console.error(`Could not save "${key}" to ${storeName}:`, e.message || e);
    }
  }
  return false;
}
