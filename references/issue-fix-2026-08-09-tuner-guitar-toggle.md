# Issue Triage & Fix Session — 2026-08-09

## Issues handled this session
- **#187** — "Tuner is ukulele-only despite app branding as 'Guitar & Ukulele'" — **FIXED & CLOSED**
- **#191** — "Guitar Tuner Only Supports Ukulele Tuning (GCEA)…" — **CLOSED as duplicate of #187**

## #187 Root Cause (Systematic Debugging — Phase 1)
- Guitar tunings (Standard EADGBE, Drop D, DADGAD, Open G, Open D, Half-step down) were already
  defined in `TUNINGS` and present in the deployed bundle since commit `331582da` (fixes #114,
  2026-06-20). The selector renders all entries via `Object.keys(TUNINGS).map(...)`.
- The reported bug ("no guitar tuner mode / no instrument toggle") was really a **UX
  discoverability** problem: 9 tuning buttons in a flat, ungrouped list with no headings or
  instrument labels. Guitar users couldn't tell guitar tunings were available.
- Additionally, `NOTE_FREQ_MAP` only covered C3–B6 (130.81 Hz+). Guitar low-E is 82.41 Hz and
  A2 is 110 Hz. `getNearestNote()` therefore silently misidentified low guitar strings as the
  nearest higher note — so even when a user selected a guitar tuning, **pitch detection was broken
  for the lowest strings**. This is the true "guitar tuner never worked" root cause.

## #187 Fix (Phase 4)
File: `web/src/components/Tuner.js` — commit `725d00e0`
1. Added `instrument` field to each `TUNINGS` entry; built `TUNINGS_BY_INSTRUMENT` lookup.
2. Added an instrument toggle button (🎸 Guitar / 🎵 Ukulele) next to the "Tuner" heading,
   matching the Chord Library pattern (with `FaGuitar` from `react-icons/fa`).
3. Selector now renders only `TUNINGS_BY_INSTRUMENT[instrument]` (filtered by active instrument).
4. Persisted instrument choice to `guitar-ukulele-tuner-instrument`; per-instrument tuning keys
   (`ukulele-tuner-tuning` / `guitar-tuner-tuning`). Backwards-compatible migration reads the old
   single `ukulele-tuner-tuning` key and detects a guitar tuning to auto-select guitar mode.
5. Extended `NOTE_FREQ_MAP` down to C2 (65.41 Hz) so E2/A2 guitar strings are correctly matched.
6. Mirrored the Chord Library `safeStorageGet`/`safeStorageSet` helpers for private-browsing safety.

## Verification
- `npm run build` — compiled successfully, no errors/warnings.
- GitHub Actions workflow `#31307916025` — `Deploy to GitHub Pages` succeeded in 37s.
- Verified deployed `gh-pages` branch contains new bundle `main.6e46036e.js` with the
  `guitar-ukulele-tuner-instrument` key and E2 (82.41 Hz) frequency present.
- Limitation: live site (https://alistaircl.github.io/guitar-ukulele-learning-app/) could not be
  loaded from the cron sandbox due to a network proxy restriction
  (`ERR_PROXY_CONNECTION_FAILED`). A local `python3 -m http.server` confirmed the build serves
  (HTTP 200). On-page visual verification deferred to a maintainer.

## Issues still open
- **#183** — "Song detail chord sheet view missing chord diagrams" (enhancement, priority:low,
  visual+ux). To be handled in a subsequent cron run.

## Cron-safe JSON processing
- Used `gh issue list --json > /tmp/open_issues.json` then read Python-style, avoiding the
  blocked `gh ... | python3 -c` pipe-to-interpreter pattern.
