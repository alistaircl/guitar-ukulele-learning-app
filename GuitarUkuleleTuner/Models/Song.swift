import Foundation

// MARK: - Song Data Models

struct Song: Identifiable, Codable, Equatable {
    let id: UUID
    let title: String
    let artist: String
    let album: String?
    let duration: TimeInterval
    let sections: [SongSection]
    let difficulty: DifficultyLevel
    var isFavorite: Bool
    let addedDate: Date
    let tags: [String] // genre, mood, etc.
    
    // Computed properties
    var displayTitle: String {
        "\(title) - \(artist)"
    }
    
    var formattedDuration: String {
        let minutes = Int(duration) / 60
        let seconds = Int(duration) % 60
        return String(format: "%d:%02d", minutes, seconds)
    }
}

struct SongSection: Identifiable, Codable, Equatable {
    let id: UUID
    let type: SectionType
    let name: String // e.g., "Verse 1", "Chorus", "Bridge"
    let startTime: TimeInterval
    let endTime: TimeInterval
    let lyrics: String
    let tablature: String // formatted tab notation
    let chords: [ChordReference] // chords used in this section with timing
    
    var duration: TimeInterval {
        endTime - startTime
    }
}

enum SectionType: String, Codable, CaseIterable {
    case intro, verse, preChorus, chorus, bridge, breakdown, solo, outro
    
    var displayName: String {
        rawValue.capitalized
    }
    
    var systemImage: String {
        switch self {
        case .intro: return "play.circle"
        case .verse: return "text.alignleft"
        case .preChorus: return "music.note"
        case .chorus: return "music.mic"
        case .bridge: return "arrow.left.and.right"
        case .breakdown: return "waveform"
        case .solo: return "guitarstrings"
        case .outro: return "stop.fill"
        }
    }
}

struct ChordReference: Identifiable, Codable, Equatable {
    let id: UUID
    let chordName: String // e.g., "C", "G7", "Am"
    let startTime: TimeInterval // relative to section start
    let duration: TimeInterval // how long chord lasts
    let strumPattern: String? // e.g., "D DU UDU"
    
    var endTime: TimeInterval {
        startTime + duration
    }
}

// MARK: - Practice Session Models

struct PracticeSession: Identifiable, Codable, Equatable {
    let id: UUID
    let songId: UUID
    let userId: UUID
    let date: Date
    let duration: TimeInterval
    let sectionsPracticed: [UUID] // section IDs that were practiced
    let overallScore: Double // 0-100
    let accuracyScore: Double // note accuracy %
    let timingScore: Double // timing accuracy %
    let notesPlayed: Int
    let notesExpected: Int
    let mistakes: [PracticeMistake]
    let settings: PracticeSettings
    
    var notesMissed: Int {
        notesExpected - notesPlayed
    }
    
    var accuracyPercentage: String {
        String(format: "%.0f%%", accuracyScore)
    }
    
    var timingPercentage: String {
        String(format: "%.0f%%", timingScore)
    }
    
    var overallPercentage: String {
        String(format: "%.0f%%", overallScore)
    }
}

struct PracticeMistake: Identifiable, Codable, Equatable {
    let id: UUID
    let timestamp: TimeInterval // within the song
    let sectionId: UUID?
    let expectedChord: String
    let detectedChord: String? // what was actually played (nil if missed/muted)
    let expectedNote: String? // specific note if doing note detection
    let detectedNote: String? // what was actually played
    let mistakeType: MistakeType
    let severity: Double // 0-1, how bad the mistake was
}

enum MistakeType: String, Codable {
    case wrongChord
    case wrongNote
    case wrongTiming
    case missedChord
    case missedNote
    case early
    case late
    case extraStrum
    case mutedString
}

struct PracticeSettings: Codable, Equatable {
    let tempo: Double // BPM multiplier (1.0 = normal speed)
    let transpose: Int // semitones (-12 to +12)
    let instrument: Instrument
    let difficulty: DifficultyLevel
    let useMetronome: Bool
    let metronomeVolume: Double
    let showChords: Bool
    let showLyrics: Bool
    let showTabs: Bool
    let loopEnabled: Bool
    let loopStart: TimeInterval
    let loopEnd: TimeInterval
}

// MARK: - Enums

enum Instrument: String, Codable, CaseIterable, Identifiable {
    case guitar, ukulele
    
    var id: String { self.rawValue }
    
    var displayName: String {
        rawValue.capitalized
    }
    
    var iconName: String {
        switch self {
        case .guitar: return "guitar"
        case .ukulele: return "guitar" // Could use a ukulele-specific icon if available
        }
    }
}

enum DifficultyLevel: String, Codable, CaseIterable, Comparable {
    case beginner, intermediate, advanced, expert
    
    var displayName: String {
        rawValue.capitalized
    }
    
    var level: Int {
        switch self {
        case .beginner: return 1
        case .intermediate: return 2
        case .advanced: return 3
        case .expert: return 4
        }
    }
    
    static func < (lhs: DifficultyLevel, rhs: DifficultyLevel) -> Bool {
        lhs.level < rhs.level
    }
}

// MARK: - Sample Data Generator (for development/testing)

class SampleDataGenerator {
    static let shared = SampleDataGenerator()
    
    func generateSampleSongs() -> [Song] {
        var songs: [Song] = []
        
        // Sample song 1: Simple pop song
        let song1 = Song(
            id: UUID(),
            title: "Horse with No Name",
            artist: "America",
            album: "America",
            duration: 253.0, // 4:13
            sections: generateHorseWithNoNameSections(),
            difficulty: .beginner,
            isFavorite: false,
            addedDate: Date().addingTimeInterval(-86400 * 30), // 30 days ago
            tags: ["folk", "rock", "70s"]
        )
        songs.append(song1)
        
        // Sample song 2: Beginner chord practice
        let song2 = Song(
            id: UUID(),
            title: "Stand By Me",
            artist: "Ben E. King",
            album: "Don't Play That Song!",
            duration: 176.0, // 2:56
            sections: generateStandByMeSections(),
            difficulty: .beginner,
            isFavorite: true,
            addedDate: Date().addingTimeInterval(-86400 * 15), // 15 days ago
            tags: ["soul", "classic", "60s"]
        )
        songs.append(song2)
        
        // Sample song 3: Intermediate
        let song3 = Song(
            id: UUID(),
            title: "Let It Be",
            artist: "The Beatles",
            album: "Let It Be",
            duration: 243.0, // 4:03
            sections: generateLetItBeSections(),
            difficulty: .intermediate,
            isFavorite: false,
            addedDate: Date().addingTimeInterval(-86400 * 60), // 60 days ago
            tags: ["rock", "pop", "70s"]
        )
        songs.append(song3)
        
        return songs
    }
    
    private func generateHorseWithNoNameSections() -> [SongSection] {
        // Simplified version - just 2 chords repeating
        let em = ChordReference(id: UUID(), chordName: "Em", startTime: 0, duration: 2, strumPattern: "D DU")
        let d69add9 = ChordReference(id: UUID(), chordName: "D69add9", startTime: 2, duration: 2, strumPattern: "D DU")
        
        let verse = SongSection(
            id: UUID(),
            type: .verse,
            name: "Verse/Chorus",
            startTime: 0,
            endTime: 253,
            lyrics: "On the first part of the journey\nI was looking at all the life\nThere were plants and birds and rocks and things\nThere was sand and hills and rings\n\nThe first thing I met was a fly with a buzz\nAnd the sky with no clouds\nThe heat was hot and the ground was dry\nBut the air was full of sound\n\nI've been through the desert on a horse with no name\nIt felt good to be out of the rain\nIn the desert you can remember your name\n'Cause there ain't no one for to give you no pain\n\nLa, la ...",
            tablature: "[Simplified tab - Em and D69add9 alternating]",
            chords: [em, d69add9, em, d69add9] // Simplified - repeating
        )
        
        return [verse]
    }
    
    private func generateStandByMeSections() -> [SongSection] {
        // I-IV-V progression in A: A, F#m, D, E
        let a = ChordReference(id: UUID(), chordName: "A", startTime: 0, duration: 2, strumPattern: "D DU")
        let fshm = ChordReference(id: UUID(), chordName: "F#m", startTime: 2, duration: 2, strumPattern: "D DU")
        let d = ChordReference(id: UUID(), chordName: "D", startTime: 4, duration: 2, strumPattern: "D DU")
        let e = ChordReference(id: UUID(), chordName: "E", startTime: 6, duration: 2, strumPattern: "D DU")
        
        let verse = SongSection(
            id: UUID(),
            type: .verse,
            name: "Verse/Chorus",
            startTime: 0,
            endTime: 176,
            lyrics: "When the night has come\nAnd the land is dark\nAnd the moon is the only light we'll see\nNo I won't be afraid, no I won't be afraid\nJust as long as you stand, stand by me\n\nSo darling, darling, stand by me\nOh, stand by me\nOh, stand, stand by me\nStand by me",
            tablature: "[Simplified tab - A F#m D E progression]",
            chords: [a, fshm, d, e, a, fshm, d, e] // Simplified pattern
        )
        
        return [verse]
    }
    
    private func generateLetItBeSections() -> [SongSection] {
        // C G Am F progression
        let c = ChordReference(id: UUID(), chordName: "C", startTime: 0, duration: 2, strumPattern: "D DU")
        let g = ChordReference(id: UUID(), chordName: "G", startTime: 2, duration: 2, strumPattern: "D DU")
        let am = ChordReference(id: UUID(), chordName: "Am", startTime: 4, duration: 2, strumPattern: "D DU")
        let f = ChordReference(id: UUID(), chordName: "F", startTime: 6, duration: 2, strumPattern: "D DU")
        
        let verse = SongSection(
            id: UUID(),
            type: .verse,
            name: "Verse",
            startTime: 0,
            endTime: 90,
            lyrics: "When I find myself in times of trouble\nMother Mary comes to me\nSpeaking words of wisdom, let it be\nAnd in my hour of darkness\nShe is standing right in front of me\nSpeaking words of wisdom, let it be\n\nLet it be, let it be\nLet it be, let it be\nWhisper words of wisdom, let it be",
            tablature: "[Simplified tab - C G Am F]",
            chords: [c, g, am, f]
        )
        
        let chorus = SongSection(
            id: UUID(),
            type: .chorus,
            name: "Chorus",
            startTime: 90,
            endTime: 150,
            lyrics: "And when the broken hearted people\nLiving in the world agree\nThere will be an answer, let it be\nFor though they may be parted\nThere is still a chance that they will see\nThere will be an answer, let it be\n\nLet it be, let it be\nLet it be, let it be\nYeah there will be an answer, let it be",
            tablature: "[Simplified tab - C G Am F]",
            chords: [c, g, am, f, c, g, am, f]
        )
        
        return [verse, chorus]
    }
}