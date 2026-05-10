# Guitar & Ukulele Learning App

An iOS app designed to help users learn guitar and ukulele through interactive lessons, chord lookup, song search with tabs/lyrics, and a practice mode that uses microphone input for real-time validation.

## Features

### 1. Chord Lookup
- Search for any chord and see all possible fingerings/positions
- Visual diagrams showing finger placement on fretboard
- Audio playback of each chord variation
- Filter by instrument (guitar/ukulele), tuning, difficulty
- Favorite chord positions for quick access

### 2. Song Search & Learning
- Search any song by title/artist
- Display synchronized tabs and lyrics
- Adjustable tempo and transpose controls
- Loop specific sections for focused practice
- Download songs for offline learning
- Community-contributed and verified chord/tab submissions

### 3. Practice Mode (Karaoke Style)
- Scrolling tablature with highlighted current position
- Lyrics displayed in sync with music
- Microphone input validation:
  - Real-time pitch detection
  - Feedback on timing accuracy
  - Visual indicators for correct/incorrect notes
  - Post-session statistics and improvement suggestions
- Adjustable difficulty levels (beginner to advanced)
- Backing tracks with instrument isolation (mute guitar/ukulele to play along)

### 4. Universal iOS Design
- Optimized layouts for iPhone and iPad
- Split-view on iPad for chord lookup + song view
- Portrait and landscape support
- Consistent experience across devices via iCloud sync
- Adaptive font sizes and touch targets

### 5. User Personalization
- Favorite songs and chords for quick access
- Practice history and progress tracking
- Customizable practice routines
- Achievements and streaks to motivate regular practice
- Multiple user profiles (for family sharing)

## Technical Requirements

### Platform
- iOS 15.0+
- Universal app (iPhone & iPad)
- SwiftUI framework
- Combine for reactive programming

### Core Technologies
- AudioKit/SonicKit for audio processing and pitch detection
- AVFoundation for microphone input and audio playback
- CoreData for local storage and caching
- CloudKit for sync across devices
- Spotify/Apple Music APIs for song metadata (optional)
- Ultimate Guitar API or similar for chord/tab data (with licensing)

### Data Models

#### Chord
```swift
struct Chord: Identifiable, Codable {
    let id: UUID
    let name: String // e.g., "Cmaj7", "G", "F#m"
    let instrument: Instrument // .guitar or .ukulele
    let positions: [ChordPosition]
    let difficulty: DifficultyLevel
    var isFavorite: Bool
}

struct ChordPosition: Identifiable, Codable {
    let id: UUID
    let fretPositions: [Int?] // nil = mute string, 0 = open, 1+ = fret number
    let barres: [(Int, Int)] // (startFret, endFret) for barre chords
    let fingering: [Int?] // which finger to use (1=index, 2=middle, etc.)
    let audioURL: URL? // pre-recorded chord sound
}
```

#### Song
```swift
struct Song: Identifiable, Codable {
    let id: UUID
    let title: String
    let artist: String
    let sections: [SongSection]
    let difficulty: DifficultyLevel
    let duration: TimeInterval
    var isFavorite: Bool
    let addedDate: Date
}

struct SongSection: Identifiable, Codable {
    let id: UUID
    let type: SectionType // .verse, .chorus, .bridge, .intro, .outro
    let lyrics: String
    let tablature: String // formatted tab notation
    let chords: [Chord] // chords used in this section
    let audioStartTime: TimeInterval
    let audioEndTime: TimeInterval
}
```

#### Practice Session
```swift
struct PracticeSession: Identifiable, Codable {
    let id: UUID
    let songId: UUID
    let date: Date
    let duration: TimeInterval
    let accuracyScore: Double // percentage of correct notes
    let timingScore: Double // percentage notes on beat
    let notesPlayed: Int
    let mistakes: [PracticeMistake]
}

struct PracticeMistake: Identifiable, Codable {
    let id: UUID
    let timestamp: TimeInterval // within the song
    let expectedNote: String
    let detectedNote: String? // what was actually played (nil if missed)
    let mistakeType: MistakeType // .wrongNote, .wrongTiming, .missedNote
}
```

### Instrument Support
- **Guitar**: Standard tuning (EADGBE), plus common alternate tunings
- **Ukulele**: Standard tuning (GCEA), baritone ukulele (DGBE)
- Easy switching between instruments with chord translation

## UI/UX Flow

### Onboarding
1. Welcome screen with instrument selection (guitar/ukulele/both)
2. Skill level assessment (beginner/intermediate/advanced)
3. Goal setting (learn chords, learn songs, improve technique)
4. Optional: connect to music streaming services for song search

### Main Tab Bar
1. **Discover** - Search for songs, browse trending/popular
2. **Learn** - Chord lookup tool, lessons, exercises
3. **Practice** - Active practice mode with current song
4. **Library** - Favorites, playlists, practice history
5. **Profile** - Settings, achievements, account

### Chord Lookup Screen
- Search bar at top
- Instrument selector (guitar/ukulele toggle)
- Results grid showing chord diagrams
- Tap on chord to see:
  - Large diagram with finger positions
  - Audio play button
  - Alternative positions (swipe carousel)
  - Difficulty rating
  - Favorite button

### Song View Screen
- Header: Song title, artist, favorite button
- Controls: Tempo slider, transpose (+/- semitones), loop toggle
- Main view: Scrolling tablature with lyrics underneath
- Currently playing note highlighted in both tab and lyrics
- Bottom controls: Play/pause, backward/forward 10s, volume

### Practice Mode
- Full-screen scrolling tab/lyrics view
- Microphone level indicator at top
- Real-time feedback:
  - Green note = correct pitch & timing
  - Yellow note = correct pitch, slightly off timing
  - Red note = wrong pitch
  - Missed note = no audio detected when expected
- Post-session summary:
  - Overall accuracy percentage
  - Streak of correct notes
  - Most common mistakes
  - Suggested exercises for improvement

## Development Roadmap

### Phase 1: Core Functionality (MVP)
- [ ] Chord lookup with diagrams and audio
- [ ] Basic song search with static tab/lyrics display
- [ ] Simple practice mode with scrolling tab
- [ ] iPhone layout only
- [ ] Local data storage (no sync)
- [ ] Basic microphone input (volume only, no pitch detection)

### Phase 2: Enhanced Features
- [ ] Pitch detection for note validation
- [ ] Ukulele support
- [ ] iPad-optimized layouts
- [ ] Favorites system
- [ ] CloudKit sync between devices
- [ ] Tempo and transpose controls

### Phase 3: Social & Community
- [ ] User accounts and profiles
- [ ] Share favorite songs/chords
- [ ] Community tab/tab submissions (with moderation)
- [ ] Achievements and leaderboards
- [ ] Integration with Apple Game Center

### Phase 4: Polish & Advanced Features
- [ ] Backing tracks with instrument isolation
- [ ] Advanced lesson library (scales, techniques, theory)
- [ ] Progress tracking and learning paths
- [ ] Export/import functionality
- [ ] Accessibility features (VoiceOver support, larger text options)
- [ ] Widget for Today View (daily chord practice)

## Monetization Strategy
- Free tier with basic chords and limited songs
- Premium subscription ($4.99/month or $49.99/year) for:
  - Full song library access
  - Advanced practice features
  - Multiple instrument support
  - Cloud sync and backup
  - Ad-free experience
- One-time purchases for premium song packs or lesson bundles

## Open Questions for Further Research
1. Best approach for real-time pitch detection on iOS (AudioKit vs SonicKit vs custom DSP)
2. Licensing considerations for chord/tab data (Ultimate Guitar, Songsterr, or create own database)
3. Optimal audio latency for real-time feedback (<20ms imperceptible, 20-40ms acceptable)
4. Battery impact of continuous microphone audio processing
5. How to handle different capotasto positions in chord detection
6. Best practices for teaching strumming patterns and rhythm

## Next Steps
1. Create prototype chord lookup view with basic diagrams
2. Implement microphone audio input and basic visualization
3. Design data models and local storage layer
4. Create sample song data for testing
5. Begin UI development for iPhone layout
6. Research pitch detection libraries and implement prototype