import Foundation

// MARK: - Chord Data Service

class ChordService {
    static let shared = ChordService()
    
    private(set) var guitarChords: [String: [Chord]] = [:]
    private(set) var ukuleleChords: [String: [UkuleleChord]] = [:]
    private(set) var allChordNames: [String] = []
    
    private init() {
        loadChordData()
        prepareChordNames()
    }
    
    private func loadChordData() {
        // Load guitar chords
        if let guitarURL = Bundle.main.url(forResource: "guitar_chords", withExtension: "json") {
            do {
                let data = try Data(contentsOf: guitarURL)
                let decoder = JSONDecoder()
                let database = try decoder.decode(ChordDatabase.self, from: data)
                guitarChords = database.chords
            } catch {
                print("Error loading guitar chords: \(error)")
                // Create fallback data
                guitarChords = createFallbackGuitarChords()
            }
        } else {
            print("guitar_chords.json not found in bundle")
            guitarChords = createFallbackGuitarChords()
        }
        
        // Load ukulele chords (simplified for now)
        ukuleleChords = createFallbackUkuleleChords()
    }
    
    private func prepareChordNames() {
        var names: Set<String> = []
        
        // Add guitar chord names
        for (key, suffixes) in guitarChords {
            for suffix in suffixes {
                let chord = Chord(key: key, suffix: suffix.suffix, positions: [])
                names.insert(chord.displayName)
            }
        }
        
        // Add ukulele chord names
        for (key, suffixes) in ukuleleChords {
            for suffix in suffixes {
                let chord = UkuleleChord(key: key, suffix: suffix.suffix, positions: [])
                names.insert(chord.displayName)
            }
        }
        
        allChordNames = Array(names).sorted()
    }
    
    func getChords(for instrument: Instrument, key: String, suffix: String) -> [ChordPosition] {
        switch instrument {
        case .guitar:
            let chordKey = "\(key)\(suffix)"
            if let chordArray = guitarChords[chordKey], !chordArray.isEmpty {
                return chordArray.first?.positions ?? []
            }
        case .ukulele:
            let chordKey = "\(key)\(suffix)"
            if let chordArray = ukuleleChords[chordKey], !chordArray.isEmpty {
                return chordArray.first?.positions.map { ukulelePosition in
                    // Convert ukulele position to generic ChordPosition
                    ChordPosition(
                        frets: ukulelePosition.frets,
                        fingers: ukulelePosition.fingers,
                        baseFret: ukulelePosition.baseFret,
                        barres: ukulelePosition.barres,
                        capo: ukulelePosition.capo,
                        midi: ukulelePosition.midi
                    )
                } ?? []
            }
        }
        return []
    }
    
    func searchChords(query: String) -> [String] {
        if query.isEmpty {
            return Array(allChordNames.prefix(20)) // Return first 20 if empty query
        }
        
        let lowercasedQuery = query.lowercased()
        return allChordNames.filter { $0.lowercased().contains(lowercasedQuery) }
            .prefix(50)
            .map { String($0) }
    }
    
    // MARK: - Fallback Data
    
    private func createFallbackGuitarChords() -> [String: [Chord]] {
        var fallback: [String: [Chord]] = [:]
        
        // Common chords for demo
        let commonChords: [(key: String, suffix: String, positions: [ChordPosition])] = [
            ("C", "major", [
                ChordPosition(frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1, barres: [], capo: false, midi: [48, 52, 55, 60, 64]),
                ChordPosition(frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], baseFret: 1, barres: [1], capo: true, midi: [48, 55, 60, 64, 67])
            ]),
            ("G", "major", [
                ChordPosition(frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 0, barres: [], capo: false, midi: [43, 47, 50, 55, 59, 64]),
                ChordPosition(frets: [3, 0, 0, 0, 2, 3], fingers: [2, 0, 0, 0, 1, 3], baseFret: 0, barres: [], capo: false, midi: [43, 47, 50, 55, 59, 64])
            ]),
            ("D", "major", [
                ChordPosition(frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 1, 2, 3, 2], baseFret: 2, barres: [], capo: false, midi: [50, 54, 57, 62])
            ]),
            ("Am", "minor", [
                ChordPosition(frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 1, 2, 2, 1, 0], baseFret: 0, barres: [], capo: false, midi: [45, 50, 55, 59, 64])
            ]),
            ("Em", "minor", [
                ChordPosition(frets: [0, 2, 2, 0, 0, 0], fingers: [0, 1, 2, 0, 0, 0], baseFret: 0, barres: [], capo: false, midi: [40, 44, 47, 52, 59, 64])
            ])
        ]
        
        for (key, suffix, positions) in commonChords {
            let chordKey = "\(key)\(suffix)"
            fallback[chordKey] = [Chord(key: key, suffix: suffix, positions: positions)]
        }
        
        return fallback
    }
    
    private func createFallbackUkuleleChords() -> [String: [UkuleleChord]] {
        var fallback: [String: [UkuleleChord]] = [:]
        
        // Common ukulele chords
        let commonChords: [(key: String, suffix: String, positions: [UkuleleChordPosition])] = [
            ("C", "major", [
                UkuleleChordPosition(frets: [0, 0, 0, 3], fingers: [1, 1, 1, 2], baseFret: 0, barres: [], capo: false, midi: [48, 52, 55, 60]),
                UkuleleChordPosition(frets: [0, 0, 0, 0], fingers: [1, 1, 1, 1], baseFret: 0, barres: [], capo: true, midi: [48, 52, 55, 60]) // With capo at 3rd fret
            ]),
            ("G", "major", [
                UkuleleChordPosition(frets: [0, 2, 3, 2], fingers: [1, 2, 3, 2], baseFret: 0, barres: [], capo: false, midi: [43, 47, 50, 55]),
                UkuleleChordPosition(frets: [0, 2, 3, 2], fingers: [1, 2, 3, 2], baseFret: 0, barres: [], capo: false, midi: [43, 47, 50, 55])
            ]),
            ("F", "major", [
                UkuleleChordPosition(frets: [2, 0, 1, 0], fingers: [2, 1, 2, 1], baseFret: 0, barres: [], capo: false, midi: [41, 45, 50, 55])
            ]),
            ("Am", "minor", [
                UkuleleChordPosition(frets: [2, 0, 0, 0], fingers: [2, 1, 1, 1], baseFret: 0, barres: [], capo: false, midi: [45, 50, 55, 59])
            ])
        ]
        
        for (key, suffix, positions) in commonChords {
            let chordKey = "\(key)\(suffix)"
            fallback[chordKey] = [UkuleleChord(key: key, suffix: suffix, positions: positions)]
        }
        
        return fallback
    }
}