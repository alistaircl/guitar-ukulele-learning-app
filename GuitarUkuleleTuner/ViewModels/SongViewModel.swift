import SwiftUI
import Combine

// MARK: - Practice Mode View

struct PracticeModeView: View {
    @ObservedObject var viewModel: SongViewModel
    @Binding var currentTime: TimeInterval
    let song: Song
    
    var body: some View {
        VStack(spacing: 20) {
            // Microphone level indicator
            MicrophoneLevelView(level: viewModel.inputLevel)
                .frame(height: 4)
                .padding(.horizontal)
            
            // Current chord/note display
            VStack(spacing: 12) {
                Text(viewModel.currentChordDisplay)
                    .font(.system(size: 48, weight: .bold))
                    .foregroundColor(viewModel.isChordCorrect ? .green : .red)
                
                Text(viewModel.centsOffString)
                    .font(.title2)
                    .foregroundColor(.secondary)
                
                if let noteFeedback = viewModel.noteFeedback {
                    Text(noteFeedback)
                        .font(.headline)
                        .foregroundColor(noteFeedbackColor)
                }
            }
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color(.systemGroupedBackground))
            )
            
            // Lyrics with current word highlighted
            LyricsView(
                lyrics: viewModel.currentLyrics,
                currentWordIndex: viewModel.currentWordIndex
            )
            .padding(.horizontal)
            
            // Tablature with current position highlighted
            TablatureView(
                tablature: viewModel.currentTablature,
                currentPosition: viewModel.currentTabPosition
            )
            .padding(.horizontal)
            
            // Practice controls
            HStack(spacing: 20) {
                Button(action: {
                    viewModel.skipBackward()
                }) {
                    Image(systemName: "gobackward.15")
                        .font(.system(size: 24))
                }
                
                Button(action: {
                    viewModel.togglePlayPause()
                }) {
                    Image(systemName: viewModel.isPlaying ? "pause.circle.fill" : "play.circle.fill")
                        .font(.system(size: 44))
                }
                
                Button(action: {
                    viewModel.skipForward()
                }) {
                    Image(systemName: "goforward.15")
                        .font(.system(size: 24))
                }
            }
            .padding(.vertical, 12)
            
            // Progress and stats
            VStack(spacing: 8) {
                HStack {
                    Text("Accuracy: \(String(format: "%.0f%%", viewModel.accuracyScore))")
                    Spacer()
                    Text("Timing: \(String(format: "%.0f%%", viewModel.timingScore))")
                }
                .font(.caption)
                .foregroundColor(.secondary)
                
                ProgressView(value: viewModel.accuracyScore / 100)
                    .accentColor(viewModel.accuracyScore >= 80 ? .green : .red)
                    .padding(.horizontal)
            }
            .padding(.horizontal)
            
            Spacer()
        }
        .background(Color(.systemBackground).ignoresSafeArea())
    }
    
    private var noteFeedbackColor: Color {
        guard let feedback = viewModel.noteFeedback else { return .secondary }
        if feedback.contains("Correct") { return .green }
        if feedback.contains("Close") { return .yellow }
        return .red
    }
}

// MARK: - Supporting Views for Practice Mode

struct MicrophoneLevelView: View {
    let level: Float // 0.0 to 1.0
    
    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                Rectangle()
                    .fill(Color(.systemGray4))
                    .frame(height: 4)
                
                Rectangle()
                    .fill(level > 0.5 ? .green : .red)
                    .frame(width: CGFloat(level) * geometry.width, height: 4)
                    .animation(.easeInOut(duration: 0.1), value: level)
            }
        }
    }
}

struct LyricsView: View {
    let lyrics: String
    let currentWordIndex: Int
    
    var body: some View {
        let words = lyrics.components(separatedBy: " ")
        let attributedString = NSMutableAttributedString(string: lyrics)
        
        // Highlight current word
        if currentWordIndex >= 0 && currentWordIndex < words.count {
            var currentIndex = 0
            for word in words {
                let wordLength = word.count
                if currentIndex <= currentWordIndex && currentIndex + wordLength > currentWordIndex {
                    attributedString.addAttribute(
                        .backgroundColor,
                        value: UIColor.yellow.withAlphaComponent(0.3),
                        range: NSRange(location: currentIndex, length: wordLength)
                    )
                    break
                }
                currentIndex += wordLength + 1 // +1 for space
            }
        }
        
        return Text(attributedString)
            .font(.title2)
            .multilineTextAlignment(.center)
            .fixedSize(horizontal: false, vertical: true)
    }
}

struct TablatureView: View {
    let tablature: String
    let currentPosition: Int // character position to highlight
    
    var body: some View {
        // Simplified tablature display - in reality this would be more sophisticated
        ScrollView(.horizontal) {
            Text(tablature)
                .font(.system(.body, design: .monospaced))
                .foregroundColor(.primary)
                .padding(.vertical, 8)
                .overlay(
                    // Highlight current position
                    GeometryReader { geometry in
                        let charWidth = geometry.width / CGFloat(tablature.count)
                        let offset = CGFloat(currentPosition) * charWidth
                        
                        Rectangle()
                            .fill(Color.yellow.opacity(0.3))
                            .frame(width: 2, height: 20)
                            .offset(x: offset)
                    }
                    .clipped()
                )
        }
    }
}

// MARK: - Song View Model

import AudioKit

class SongViewModel: ObservableObject {
    @Published var song: Song
    @Published var sections: [SongSectionViewModel] = []
    
    // Practice state
    @Published var isPlaying: Bool = false
    @Published var isListening: Bool = false
    @Published var currentSectionIndex: Int = 0
    @Published var currentChordDisplay: String = "--"
    @Published var centsOffString: String = "0"
    @Published var isChordCorrect: Bool = false
    @Published var noteFeedback: String? = nil
    @Published var currentLyrics: String = ""
    @Published var currentWordIndex: Int = -1
    @Published var currentTabPosition: Int = 0
    @Published var inputLevel: Float = 0.0
    
    // Practice scores
    @Published var accuracyScore: Double = 0.0
    @Published var timingScore: Double = 0.0
    @Published var totalNotesExpected: Int = 0
    @Published var totalNotesPlayed: Int = 0
    
    // Audio components
    private let conductor: Conductor
    private var cancellables = Set<AnyCancellable>()
    private var practiceTimer: Timer?
    private var startTime: Date?
    
    // Settings
    var tempo: Double = 100.0 { // BPM
        didSet {
            updatePlaybackRate()
        }
    }
    var transpose: Int = 0 // semitones
    
    init(song: Song) {
        self.song = song
        self.conductor = Conductor()
        self.sections = song.sections.map { SongSectionViewModel(section: $0) }
        setupAudio()
        setupPracticeTimer()
    }
    
    private func setupAudio() {
        conductor.onPitchDetected = { [weak self] frequency, amplitude in
            DispatchQueue.main.async {
                self?.processPitch(frequency: frequency, amplitude: amplitude)
            }
        }
    }
    
    private func setupPracticeTimer() {
        practiceTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            self?.updatePracticeState()
        }
    }
    
    func startListening() {
        isListening = true
        conductor.start()
        startTime = Date()
        
        // Reset practice stats
        accuracyScore = 0
        timingScore = 0
        totalNotesExpected = 0
        totalNotesPlayed = 0
    }
    
    func stopListening() {
        isListening = false
        try? conductor.stop()
        startTime = nil
    }
    
    func togglePlayPause() {
        isPlaying.toggle()
        if isPlaying {
            startPlayback()
        } else {
            stopPlayback()
        }
    }
    
    private func startPlayback() {
        // TODO: Implement actual audio playback
        print("Starting playback at \(tempo) BPM")
    }
    
    private func stopPlayback() {
        // TODO: Stop audio playback
        print("Stopping playback")
    }
    
    func skipBackward() {
        // Go back 10 seconds
        // TODO: Implement actual seeking
        print("Skipping backward")
    }
    
    func skipForward() {
        // Go forward 10 seconds
        // TODO: Implement actual seeking
        print("Skipping forward")
    }
    
    private func updatePracticeState() {
        guard let startTime = startTime else { return }
        let elapsed = Date().timeIntervalSince(startTime)
        currentTime = elapsed
        
        // Update current section, chord, lyrics, etc. based on time
        updateCurrentState(atTime: elapsed)
    }
    
    private func updateCurrentState(atTime time: TimeInterval) {
        // Find current section
        if let sectionIndex = sections.firstIndex(where: {
            $0.section.startTime <= time && $0.section.endTime >= time
        }) {
            currentSectionIndex = sectionIndex
            let section = sections[sectionIndex]
            let timeInSection = time - section.section.startTime
            
            // Update lyrics (simplified - word by word)
            let words = section.section.lyrics.components(separatedBy: " ")
            let wordsPerSecond = Double(words.count) / section.section.duration
            let wordIndex = Int(timeInSection * wordsPerSecond)
            currentWordIndex = min(max(wordIndex, 0), words.count - 1)
            currentLyrics = section.section.lyrics
            
            // Update tablature position (simplified)
            currentTabPosition = Int((timeInSection / section.section.duration) * Double(section.section.tablature.count))
            
            // Update current chord based on time
            updateCurrentChord(atTimeInSection: timeInSection, inSection: section)
        }
    }
    
    private func updateCurrentChord(atTimeInSection timeInSection: TimeInterval, inSection section: SongSectionViewModel) {
        // Find chord that should be played at this time
        let chordRef = section.chords.first { chordRef in
            let chordEnd = chordRef.startTime + chordRef.duration
            return timeInSection >= chordRef.startTime && timeInSection < chordEnd
        }
        
        if let chordRef = chordRef {
            currentChordDisplay = chordRef.chordName
            // TODO: Actually validate the played chord against expected chord
            // For now, just simulate
            isChordCorrect = Bool.random() // Placeholder
            centsOffString = String(format: "%+d", Int.random(in: -20...20))
            noteFeedback = isChordCorrect ? "Correct!" : "Try again"
        } else {
            currentChordDisplay = "--"
            centsOffString = "0"
            isChordCorrect = false
            noteFeedback = nil
        }
    }
    
    private func processPitch(frequency: Double, amplitude: Double) {
        // Update input level (for microphone visualization)
        let newLevel = Float(amplitude)
        inputLevel = inputLevel * 0.9 + newLevel * 0.1
        
        // Only process pitch if we're listening and have a current chord expectation
        guard isListening, !currentChordDisplay.isEmpty, currentChordDisplay != "--" else { return }
        
        // Convert frequency to note name
        let detectedNote = frequencyToNote(frequency)
        let expectedNote = noteFromChord(currentChordDisplay, string: 0) // Simplified - just first string
        
        // Calculate cents off
        if let expectedFreq = noteToFrequency(expectedNote) {
            let centsOff = 1200 * log2(frequency / expectedFreq)
            centsOffString = String(format: "%+d", Int(round(centsOff)))
            
            // Determine if correct (within 15 cents)
            isChordCorrect = abs(centsOff) < 15
            noteFeedback = isChordCorrect ? "Correct!" : 
                         abs(centsOff) < 30 ? "Close!" : "Try again"
            
            // Update practice statistics
            totalNotesExpected += 1
            if isChordCorrect {
                totalNotesPlayed += 1
            }
            accuracyScore = totalNotesExpected > 0 ? 
                Double(totalNotesPlayed) / Double(totalNotesExpected) * 100 : 0
            
            // Timing score (simplified - based on how quickly we hit the note)
            timingScore = min(100, timingScore + 1) // Placeholder
        }
    }
    
    private func frequencyToNote(_ frequency: Double) -> String {
        let noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        let noteIndex = round(12 * log2(frequency / 440.0) + 69) // MIDI note number
        let octave = Int(noteIndex / 12) - 1
        let note = noteNames[Int(Int(noteIndex) % 12)]
        return "\(note)\(octave)"
    }
    
    private func noteFromChord(_ chordName: String, string: Int) -> String {
        // Very simplified - just return the root note of the chord
        // In reality, this would depend on the string and position
        let root = chordName.prefix(while: { "ABCDEFG".contains($0) })
        return String(root)
    }
    
    private func noteToFrequency(_ note: String) -> Double? {
        // Convert note name like "E4" to frequency
        let noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        
        guard note.count >= 2,
              let noteName = note.dropLast(while: { "0123456789".contains($0) }).last.map(String.init),
              let noteIndex = noteNames.firstIndex(of: noteName),
              let octaveStr = note.dropFirst(note.count - noteName.count),
              let octave = Int(octaveStr) else {
            return nil
        }
        
        let n = Double(noteIndex) + (octave - 4) * 12
        return 440.0 * pow(2.0, n / 12.0)
    }
    
    private func updatePlaybackRate() {
        // TODO: Update actual playback rate
        print("Updating playback rate to \(tempo) BPM")
    }
}

// MARK: - Section View Model

struct SongSectionViewModel: Identifiable {
    let id = UUID()
    let section: SongSection
    
    var startTime: TimeInterval { section.startTime }
    var endTime: TimeInterval { section.endTime }
    var duration: TimeInterval { section.duration }
    
    var chords: [ChordReferenceViewModel] {
        section.chords.map { ChordReferenceViewModel(chordRef: $0) }
    }
}

// MARK: - Chord Reference View Model

struct ChordReferenceViewModel: Identifiable {
    let id = UUID()
    let chordRef: ChordReference
    
    var chordName: String { chordRef.chordName }
    var startTime: TimeInterval { chordRef.startTime }
    var duration: TimeInterval { chordRef.duration }
    var endTime: TimeInterval { chordRef.endTime }
    var strumPattern: String? { chordRef.strumPattern }
}

// MARK: - Audio Conductor (same as before but simplified for this context)

import AudioKit

class Conductor {
    var onPitchDetected: ((Double, Double) -> Void)?
    
    private let mic: AKMicrophone
    private let tracker: AKFrequencyTracker
    private let silence: AKBooster
    
    init() {
        do {
            Settings.audioInputEnabled = true
            try AKSettings.setSession(category: .playAndRecord, with: [.allowBluetooth, .allowBluetoothA2DP])
            mic = AKMicrophone()
            tracker = AKFrequencyTracker(mic, hopSize: 128, peakCount: 4000)
            silence = AKBooster(tracker, gain: 0)
        } catch {
            fatalError("Failed to initialize AudioKit: \(error)")
        }
    }
    
    func start() {
        AudioKit.output = silence
        do {
            try AudioKit.start()
        } catch {
            print("AudioKit did not start! \(error)")
        }
    }
    
    func stop() {
        try? AudioKit.stop()
    }
}