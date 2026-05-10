# Guitar & Ukulele Learning App (Web Version)

A responsive web application for learning guitar and ukulele, featuring:
- Real-time pitch detection tuner
- Chord library (guitar & ukulele)
- Song library with practice mode
- User settings and preferences

## Technology Stack
- React 18
- Web Audio API (for real-time pitch detection)
- CSS3 (with responsive design)
- LocalStorage (for persisting user preferences)

## Project Structure
```
/src
  /components
    Tuner.js          - Real-time instrument tuner
    ChordLookup.js    - Chord library lookup
    SongLibrary.js    - Song browser and favorites
    PracticeMode.js   - Interactive practice session
    Settings.js       - User preferences
  /hooks
    useAudioProcessing.js - Custom hook for microphone access
  /models
    Instrument.js     - Instrument enum
    ChordData.js      - Chord fingerings database
    SongData.js       - Song metadata database
  /utils
    noteUtils.js      - Note/frequency conversion utilities
    audio.js          - Web Audio API processing
  /styles
    App.css           - Global styles
  index.js            - Entry point
  App.js              - Main app component with routing
public/
  index.html          - HTML template
```

## Features

### Tuner
- Real-time pitch detection using Web Audio API
- Supports both guitar (E2 A2 D3 G3 B3 E4) and ukulele (G4 C4 E4 A4) standard tunings
- Visual feedback showing note name and cents offset
- Input level meter for microphone volume
- Start/stop listening controls

### Chord Lookup
- Comprehensive chord library for guitar and ukulele
- Search functionality to find chords by name
- Favorite chord saving (via localStorage)
- Chord position visualization with fingering
- Multiple positions per chord when available

### Song Library
- Collection of practice songs with metadata
- Search by title or artist
- Favorite song saving
- Song details including chords, lyrics, and tablature
- Difficulty ratings (Beginner/Intermediate/Advanced)

### Practice Mode
- Real-time feedback while playing along with songs
- Note detection and tuning feedback
- Adjustable tempo and transpose
- Input level meter
- Practice timing and accuracy tracking
- Visual feedback for note accuracy

### Settings
- Persistent user preferences (stored in localStorage)
- Preferred instrument selection
- Microphone sensitivity adjustment
- Display options (show chord names, auto-advance)
- Theme selection (light/dark)
- Reset to defaults option

## Installation & Usage

### Prerequisites
- Node.js (v14 or later recommended)
- npm or yarn

### Setup
1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Development
To start the development server:
```
npm start
```
or
```
yarn start
```

The app will be available at `http://localhost:3000` in your default browser.

### Production Build
To create an optimized production build:
```
npm run build
```
or
```
yarn build
```

The build artifacts will be in the `build/` directory, ready for deployment to any static web host.

## Browser Support
- Modern browsers with Web Audio API and getUserMedia support:
  - Chrome (recommended)
  - Firefox
  - Safari
  - Edge
- Requires HTTPS or localhost for microphone access (due to browser security policies)

## Notes on Real-Time Audio
- The tuner and practice mode require microphone access
- First-time use will prompt for microphone permission
- For best results, use in a quiet environment and position microphone close to instrument
- Web Audio API performance may vary between browsers and devices

## Customization
- Chord and song data can be extended in `/src/models/ChordData.js` and `/src/models/SongData.js`
- Styling modifications can be made in `/src/styles/App.css`
- Additional features can be added by extending the component structure

## License
This project is open source and available for modification and distribution.

---
*Created with React and Web Audio API*