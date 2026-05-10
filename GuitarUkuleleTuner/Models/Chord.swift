import Foundation

// MARK: - Chord Data Models

struct ChordDatabase: Codable {
    let main: Main
    let tunings: Tunings
    let keys: [String]
    let suffixes: [String]
    let chords: [String: [Chord]]
    
    struct Main: Codable {
        let strings: Int
        let fretsOnChord: Int
        let name: String
    }
    
    struct Tunings: Codable {
        let standard: [String]
    }
}

struct Chord: Codable, Identifiable {
    let id = UUID()
    let key: String
    let suffix: String
    let positions: [ChordPosition]
    
    var fullName: String {
        if suffix.hasPrefix("/") {
            // Slash chord like C/G
            return "\(key)\(suffix)"
        } else {
            return "\(key)\(suffix)"
        }
    }
    
    var displayName: String {
        fullName
    }
}

struct ChordPosition: Codable, Identifiable {
    let id = UUID()
    let frets: [Int]        // -1 = muted, 0 = open, 1+ = fret number
    let fingers: [Int]      // 0 = unused/muted, 1-4 = finger number
    let baseFret: Int
    let barres: [Int]       // Typically shows which fret has a barre
    let capo: Bool
    let midi: [Int]         // MIDI note numbers
    
    // Convenience properties
    var isOpenPosition: Bool {
        baseFret == 0
    }
    
    var difficultyLevel: Double {
        // Simple heuristic: more frets spread and barres = harder
        let fretSpread = (frets.max() ?? 0) - (frets.min() ?? 0)
        let barrePenalty = barres.contains { $0 > 0 } ? 2 : 0
        let mutePenalty = frets.filter { $0 == -1 }.count
        return Double(fretSpread + barrePenalty + mutePenalty) / 10.0
    }
    
    func finger(for stringIndex: Int) -> Int {
        guard stringIndex >= 0 && stringIndex < fingers.count else { return 0 }
        return fingers[stringIndex]
    }
    
    func fret(for stringIndex: Int) -> Int {
        guard stringIndex >= 0 && stringIndex < frets.count else { return 0 }
        return frets[stringIndex]
    }
}

// MARK: - Ukulele Chord Model (simplified)

struct UkuleleChordDatabase: Codable {
    let main: Main
    let tunings: Tunings
    let keys: [String]
    let suffixes: [String]
    let chords: [String: [UkuleleChord]]
    
    struct Main: Codable {
        let strings: Int
        let fretsOnChord: Int
        let name: String
    }
    
    struct Tunings: Codable {
        let standard: [String]
    }
}

struct UkuleleChord: Codable, Identifiable {
    let id = UUID()
    let key: String
    let suffix: String
    let positions: [UkuleleChordPosition]
    
    var fullName: String {
        if suffix.hasPrefix("/") {
            return "\(key)\(suffix)"
        } else {
            return "\(key)\(suffix)"
        }
    }
    
    var displayName: String {
        fullName
    }
}

struct UkuleleChordPosition: Codable, Identifiable {
    let id = UUID()
    let frets: [Int]        // -1 = muted, 0 = open, 1+ = fret number
    let fingers: [Int]      // 0 = unused/muted, 1-4 = finger number
    let baseFret: Int
    let barres: [Int]
    let capo: Bool
    let midi: [Int]
    
    var isOpenPosition: Bool {
        baseFret == 0
    }
    
    var difficultyLevel: Double {
        let fretSpread = (frets.max() ?? 0) - (frets.min() ?? 0)
        let barrePenalty = barres.contains { $0 > 0 } ? 2 : 0
        let mutePenalty = frets.filter { $0 == -1 }.count
        return Double(fretSpread + barrePenalty + mutePenalty) / 10.0
    }
    
    func finger(for stringIndex: Int) -> Int {
        guard stringIndex >= 0 && stringIndex < fingers.count else { return 0 }
        return fingers[stringIndex]
    }
    
    func fret(for stringIndex: Int) -> Int {
        guard stringIndex >= 0 && stringIndex < frets.count else { return 0 }
        return frets[stringIndex]
    }
}