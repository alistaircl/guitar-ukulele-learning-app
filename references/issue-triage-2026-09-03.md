# Issue Triage 2026-09-03: False-Positive Navigation/Tuner Reports (#196, #197)

## Summary
Two open issues (#196, #197) were filed 2026-09-02 alleging navigation/Tuner breakage in the
guitar-ukulele app, based on a misreading of the minified production bundle. Both were closed as
**not planned** (false positives). No code changes were made.

## Issues
- **#196** "Tuner tab is broken: attempts to render Symbol as React component" — claimed the App
  switch renders `z` (claimed to be `Symbol.for("react.memo_cache_sentinel")`) for the tuner tab.
- **#197** "Navigation broken: all tabs render Tuner component due to missing break statements" —
  claimed `case"tuner":default:` fall-through made every tab show the tuner.

## Root cause of the confusion (minified bundle anatomy)
- `web/src/App.js` is CORRECT. Each `case` returns its own component; both `case 'tuner'` and
  `default` return `<Tuner />`.
- The terser collapse `case"tuner":default:return(...)(z,{})` is **expected**: identical case bodies
  get merged. `z` in the App-module scope binds to the **Tuner component**
  (`const z=function(){...Tuner...}`), NOT the module helper sentinel `var z=Symbol.for(...)`
  which lives in a different IIFE scope (React Compiler runtime). Webpack reuses short var names
  across scopes.
- Local `npm run build` from current `main` produces a byte-identical bundle
  (`static/js/main.1c9814bb.js`) to the live deploy → deployment matches correct source.

## Empirical verification (decides disposition)
Rendered the live site headlessly (playwright-core + /snap/bin/chromium):
```js
#!/usr/bin/env node
const { chromium } = require('playwright-core');
// load page, capture page.on('console'/'pageerror'), click '#tab-chords|songs|practice|tuner'
```
Every tab rendered its own content with zero console/page errors:
- Chords → Chord Library (chord cards C, D, E, F…)
- Songs → Song Library (filters + grid)
- Practice → Practice Mode (song list)
- Tuner → Tuner UI (instrument selector, notes, Start)

## Actions taken
- Posted detailed investigation comments on both issues (source snippet + minified-explanation +
  live-verification evidence) via `gh issue comment --body-file`.
- `gh issue close 196 --reason "not planned"` and `gh issue close 197 --reason "not planned"`.
- Open-issue backlog now: **0**.

## Lessons
- Do not triage from minified production bundles alone — verify against source AND run a real
  headless render. Build from current source and compare bundle hash to confirm deployment matches
  source before suspecting a stale deploy or a compiler miscompilation.
- Both #196 and #197 described contradictory breakage (one said Tuner broken, the other said Tuner
  works but everything else is broken). That internal contradiction itself indicated a
  minified-code misreading rather than a genuine regression.