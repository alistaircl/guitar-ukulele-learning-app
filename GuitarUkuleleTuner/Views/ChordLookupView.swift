import SwiftUI

struct ChordLookupView: View {
    @StateObject private var chordService = ChordService.shared
    @State private var searchQuery: String = ""
    @State private var selectedInstrument: Instrument = .guitar
    @State private var selectedChord: String? = nil
    @State private var chordPositions: [ChordPosition] = []
    @State private var showingFavoritesOnly: Bool = false
    @AppStorage("favoriteChords") private var favoriteChordsData: Data = Data()
    
    private var favoriteChords: Set<String> {
        get {
            if let data = try? JSONDecoder().decode([String].self, from: favoriteChordsData) {
                return Set(data)
            }
            return Set()
        }
        set {
            if let data = try? JSONEncoder().encode(Array(newValue)) {
                favoriteChordsData = data
            }
        }
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Search and filters
                VStack(spacing: 12) {
                    HStack {
                        Image(systemName: "magnifyingglass")
                        TextField("Search chords (e.g., C, G, Am7)", text: $searchQuery)
                            .textFieldStyle(.roundedBorder)
                        Button(action: {
                            searchQuery = ""
                        }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.secondary)
                        }
                        .opacity(!searchQuery.isEmpty ? 1 : 0)
                    }
                    .padding(.horizontal)
                    
                    HStack {
                        Picker("Instrument", selection: $selectedInstrument) {
                            Text("Guitar").tag(Instrument.guitar)
                            Text("Ukulele").tag(Instrument.ukulele)
                        }
                        .pickerStyle(.segmented)
                        
                        Toggle(isOn: $showingFavoritesOnly) {
                            Text("Favorites")
                        }
                        .toggleStyle(.button)
                        .buttonStyle(.bordered)
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical, 8)
                .background(Color(.systemBackground))
                
                // Results list
                if showingFavoritesOnly && !favoriteChords.isEmpty {
                    FavoriteChordsView(favoriteChords: favoriteChords, selectedChord: $selectedChord, chordPositions: $chordPositions, selectedInstrument: $selectedInstrument)
                } else if !searchQuery.isEmpty {
                    ChordSearchResultsView(query: searchQuery, instrument: selectedInstrument, selectedChord: $selectedChord, chordPositions: $chordPositions, chordService: chordService)
                } else if let selectedChord = selectedChord, !chordPositions.isEmpty {
                    ChordDetailView(chordName: selectedChord, positions: chordPositions, instrument: selectedInstrument)
                        .onDisappear {
                            self.selectedChord = nil
                            self.chordPositions = []
                        }
                } else {
                    // Placeholder
                    VStack(spacing: 20) {
                        Image(systemName: "music.note.list")
                            .font(.system(size: 60))
                            .foregroundColor(.secondary)
                        Text("Search for a chord")
                            .font(.title3)
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
            .navigationTitle("Chord Lookup")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        // Show quick reference or help
                    }) {
                        Image(systemName: "questionmark.circle")
                    }
                }
            }
        }
        .navigationViewStyle(.stack)
    }
}

struct FavoriteChordsView: View {
    let favoriteChords: Set<String>
    @Binding var selectedChord: String?
    @Binding var chordPositions: [ChordPosition]
    @Binding var selectedInstrument: Instrument
    
    var body: some View {
        List {
            ForEach(Array(favoriteChords).sorted(), id: \.self) { chordName in
                Button(action: {
                    selectedChord = chordName
                    loadChordPositions(for: chordName)
                }) {
                    HStack {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                        Text(chordName)
                        Spacer()
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
            .onDelete { indexSet in
                // Remove from favorites
                let chordsToRemove = indexSet.map { Array(favoriteChords).sorted()[$0] }
                for chord in chordsToRemove {
                    favoriteChords.remove(chord)
                }
            }
        }
        .listStyle(.plain)
    }
    
    private func loadChordPositions(for chordName: String) {
        // Parse chord name into key and suffix
        // This is simplified - real parsing would handle complex chords
        let key = String(chordName.dropLast(while: { !"ABCDEFG".contains($0) && $0 != "#" && $0 != "b" }))
        let suffix = String(chordName.dropFirst(key.count))
        // For simplicity, we'll just reset and let the detail view load via service
        // In a real app, we'd fetch from service here
        chordPositions = [] // Placeholder - detail view would load
    }
}

struct ChordSearchResultsView: View {
    let query: String
    let instrument: Instrument
    @Binding var selectedChord: String?
    @Binding var chordPositions: [ChordPosition]
    let chordService: ChordService
    
    var body: some View {
        let results = chordService.searchChords(query: query)
            .filter { chord in
                // Filter by instrument if needed - for now show all
                true
            }
        
        if results.isEmpty {
            ContentUnavailableView(
                "No chords found",
                systemImage: "music.note",
                description: Text("Try searching for a different chord")
            )
        } else {
            List(results, id: \.self) { chordName in
                Button(action: {
                    selectedChord = chordName
                    loadChordPositions(for: chordName)
                }) {
                    HStack {
                        Image(systemName: "music.note")
                        Text(chordName)
                        Spacer()
                        if favoriteChords.contains(chordName) {
                            Image(systemName: "star.fill")
                                .foregroundColor(.yellow)
                        }
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
        }
    }
    
    @AppStorage("favoriteChords") private var favoriteChordsData: Data = Data()
    private var favoriteChords: Set<String> {
        get {
            if let data = try? JSONDecoder().decode([String].self, from: favoriteChordsData) {
                return Set(data)
            }
            return Set()
        }
        set {
            if let data = try? JSONEncoder().encode(Array(newValue)) {
                favoriteChordsData = data
            }
        }
    }
    
    private func loadChordPositions(for chordName: String) {
        // Parse and load chord positions
        // Simplified parsing
        let key = String(chordName.dropLast(while: { !"ABCDEFG".contains($0) && $0 != "#" && $0 != "b" }))
        let suffix = String(chordName.dropFirst(key.count))
        
        let positions = chordService.getChords(for: instrument, key: key, suffix: suffix)
        self.chordPositions = positions
        self.selectedChord = chordName
    }
}

struct ChordDetailView: View {
    let chordName: String
    let positions: [ChordPosition]
    let instrument: Instrument
    @State private var selectedPositionIndex: Int = 0
    @AppStorage("favoriteChords") private var favoriteChordsData: Data = Data()
    
    private var favoriteChords: Set<String> {
        get {
            if let data = try? JSONDecoder().decode([String].self, from: favoriteChordsData) {
                return Set(data)
            }
            return Set()
        }
        set {
            if let data = try? JSONEncoder().encode(Array(newValue)) {
                favoriteChordsData = data
            }
        }
    }
    
    var isFavorite: Bool {
        favoriteChords.contains(chordName)
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Chord name header
                VStack(spacing: 8) {
                    Text(chordName)
                        .font(.system(size: 48, weight: .bold))
                    
                    Button(action: {
                        toggleFavorite()
                    }) {
                        Image(systemName: isFavorite ? "star.fill" : "star")
                            .font(.system(size: 28))
                            .foregroundColor(isFavorite ? .yellow : .secondary)
                    }
                }
                .padding(.top, 20)
                
                // Position selector
                if positions.count > 1 {
                    Picker("Position", selection: $selectedPositionIndex) {
                        ForEach(0..<positions.count, id: \.self) { index in
                            let pos = positions[index]
                            Label(
                                "Pos \(index + 1)" + (pos.isOpenPosition ? " (open)" : "") +
                                (pos.capo ? " capo\(pos.baseFret)" : ""),
                                systemImage: "hand.point.up.left.and.text"
                            )
                        }
                    }
                    .pickerStyle(.segmented)
                    .padding(.horizontal)
                }
                
                // Chord diagram
                ChordDiagramView(position: positions[selectedPositionIndex], instrument: instrument)
                    .frame(maxWidth: .infinity)
                    .padding(.horizontal)
                
                // Fingering info
                VStack(alignment: .leading, spacing: 12) {
                    Text("Fingering")
                        .font(.headline)
                    
                    HStack(spacing: 20) {
                        ForEach(0..<6, id: \.self) { stringIndex in
                            VStack {
                                Text("\(stringIndex + 1)")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                                Circle()
                                    .fill(Color(.systemGray5))
                                    .frame(width: 24, height: 24)
                                    .overlay(
                                        Text("\(positions[selectedPositionIndex].finger(for: stringIndex))")
                                            .font(.system(size: 12, weight: .bold))
                                            .opacity(positions[selectedPositionIndex].finger(for: stringIndex) > 0 ? 1 : 0)
                                    )
                            }
                        }
                    }
                    
                    Text("Frets: \(positions[selectedPositionIndex].frets.map { $0 == -1 ? "x" : "\($0)" }.joined(separator: " "))")
                        .font(.callout)
                        .foregroundColor(.secondary)
                    
                    if positions[selectedPositionIndex].capo {
                        Text("Capo on fret \(positions[selectedPositionIndex].baseFret)")
                            .font(.callout)
                            .foregroundColor(.secondary)
                    }
                    
                    if !positions[selectedPositionIndex].barres.isEmpty {
                        Text("Barre: fret \(positions[selectedPositionIndex].barres[0])")
                            .font(.callout)
                            .foregroundColor(.secondary)
                    }
                    
                    Text("Difficulty: \(String(format: "%.1f", positions[selectedPositionIndex].difficultyLevel))/5.0")
                        .font(.callout)
                        .foregroundColor(.secondary)
                }
                .padding()
                .background(Color(.systemGroupedBackground))
                .cornerRadius(12)
                .padding(.horizontal)
                
                // Audio playback button (placeholder)
                Button(action: {
                    playChordSound()
                }) {
                    Label("Play Chord", systemImage: "speaker.wave.2")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .padding(.horizontal)
                .padding(.vertical, 12)
                
                Spacer()
            }
        }
        .navigationTitle(chordName)
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private func toggleFavorite() {
        if isFavorite {
            favoriteChords.remove(chordName)
        } else {
            favoriteChords.insert(chordName)
        }
    }
    
    private func playChordSound() {
        // TODO: Implement audio playback using AudioKit or AVFoundation
        print("Playing chord sound for \(chordName)")
    }
}

struct ChordDiagramView: View {
    let position: ChordPosition
    let instrument: Instrument
    
    private let stringCount: Int
    private let fretCount: Int
    
    init(position: ChordPosition, instrument: Instrument) {
        self.position = position
        self.instrument = instrument
        self.stringCount = instrument == .guitar ? 6 : 4
        self.fretCount = max(4, (position.frets.max() ?? 0) + 1)
    }
    
    var body: some View {
        VStack(spacing: 16) {
            // String labels (note names)
            HStack(spacing: 0) {
                ForEach(0..<stringCount, id: \.self) { stringIndex in
                    VStack(spacing: 4) {
                        Text(stringNote(for: stringIndex))
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Rectangle()
                            .fill(Color(.systemGray4))
                            .frame(width: 2, height: 24)
                    }
                    .frame(width: 24)
                }
            }
            
            // Fret board
            VStack(spacing: 12) {
                // Nut (top thick line)
                Rectangle()
                    .fill(Color.black)
                    .frame(height: 4)
                    .frame(maxWidth: .infinity)
                
                // Frets
                ForEach(0..<fretCount, id: \.self) { fretIndex in
                    ZStack(alignment: .leading) {
                        // Fret wire
                        Rectangle()
                            .fill(Color.black)
                            .frame(width: 2)
                            .frame(maxWidth: .infinity)
                        
                        // Finger positions
                        HStack(spacing: 0) {
                            ForEach(0..<stringCount, id: \.self) { stringIndex in
                                let fret = position.fret(for: stringIndex)
                                let finger = position.finger(for: stringIndex)
                                
                                ZStack {
                                    if fret == -1 {
                                        // Muted string
                                        Image(systemName: "xmark")
                                            .font(.system(size: 12, weight: .bold))
                                            .foregroundColor(.red)
                                    } else if fret > 0 {
                                        // Fretted note
                                        Circle()
                                            .fill(finger > 0 ? Color.blue : Color.gray)
                                            .frame(width: 28, height: 28)
                                            .overlay(
                                                Text("\(finger)")
                                                    .font(.system(size: 10, weight: .bold))
                                                    .foregroundColor(.white)
                                                    .opacity(finger > 0 ? 1 : 0)
                                            )
                                    } else {
                                        // Open string
                                        Circle()
                                            .stroke(Color.gray, lineWidth: 1)
                                            .frame(width: 20, height: 20)
                                            .overlay(
                                                Text("0")
                                                    .font(.system(size: 10))
                                                    .foregroundColor(.primary)
                                            )
                                    }
                                }
                                .frame(width: 24)
                            }
                        }
                    }
                    .padding(.horizontal, 8)
                    
                    // Fret number label (except for nut)
                    if fretIndex > 0 {
                        Text("\(fretIndex)")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(.leading, 8)
                    }
                }
            }
            
            // Position label if not open
            if position.baseFret > 0 {
                Text("\(position.baseFret)fr")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                    .padding(.trailing, 8)
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(.systemBackground))
                .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)
        )
    }
    
    private func stringNote(for stringIndex: Int) -> String {
        // Standard tuning notes from lowest to highest string
        let guitarNotes = ["E", "A", "D", "G", "B", "E"]
        let ukuleleNotes = ["G", "C", "E", "A"]
        
        let notes = instrument == .guitar ? guitarNotes : ukuleleNotes
        guard stringIndex < notes.count else { return "" }
        return notes[stringIndex]
    }
}