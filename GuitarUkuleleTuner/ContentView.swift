
import SwiftUI

struct ContentView: View {
    @StateObject private var tuner = InstrumentTuner()
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Guitar & Ukulele Tuner")
                .font(.largeTitle)
                .padding()
            
            // Instrument selector
            Picker("Instrument", selection: $tuner.selectedInstrument) {
                Text("Guitar").tag(Instrument.guitar)
                Text("Ukulele").tag(Instrument.ukulele)
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)
            
            // Note display
            VStack(spacing: 10) {
                Text(tuner.displayNote)
                    .font(.system(size: 72, weight: .bold))
                    .foregroundColor(tuner.isInTune ? .green : .red)
                
                Text(tuner.centsOffString)
                    .font(.title2)
                    .foregroundColor(.secondary)
            }
            .padding()
            
            // Microphone level
            HStack {
                Text("Input Level:")
                Spacer()
                Text("\(String(format: "%.1f", tuner.inputLevel * 100))%")
            }
            .padding(.horizontal)
            
            ProgressView(value: tuner.inputLevel)
                .padding(.horizontal)
                .frame(height: 20)
            
            // Start/Stop button
            Button(tuner.isRunning ? "Stop Listening" : "Start Listening") {
                if tuner.isRunning {
                    tuner.stop()
                } else {
                    tuner.start()
                }
            }
            .buttonStyle(.borderedProminent)
            .padding()
            
            Spacer()
        }
        .padding()
        .onAppear {
            // Request microphone permission when view appears
            AudioPermissionManager.requestPermission { granted in
                if !granted {
                    print("Microphone permission denied")
                }
            }
        }
    }
}

// MARK: - Supporting Types

enum Instrument: String, CaseIterable, Identifiable {
    case guitar, ukulele
    
    var id: String { self.rawValue }
    
    var displayName: String {
        rawValue.capitalized
    }
    
    var standardTuning: [String] {
        switch self {
        case .guitar:
            return ["E2", "A2", "D3", "G3", "B3", "E4"]
        case .ukulele:
            return ["G4", "C4", "E4", "A4"]
        }
    }
}

class InstrumentTuner: ObservableObject {
    @Published private(set) var displayNote: String = "--"
    @Published private(set) var centsOffString: String = "0"
    @Published private(set) var isInTune: Bool = false
    @Published private(set) var inputLevel: Float = 0.0
    @Published private(set) var isRunning: Bool = false
    
    @Published var selectedInstrument: Instrument = .guitar {
        didSet {
            updateReferenceFrequencies()
        }
    }
    
    private let conductor = Conductor()
    private var referenceFrequencies: [Double] = []
    
    init() {
        updateReferenceFrequencies()
        conductor.onPitchDetected = { [weak self] frequency, amplitude in
            DispatchQueue.main.async {
                self?.processPitch(frequency: frequency, amplitude: amplitude)
            }
        }
    }
    
    private func updateReferenceFrequencies() {
        referenceFrequencies = selectedInstrument.standardTuning.map { noteToFrequency($0) }
    }
    
    private func processPitch(frequency: Double, amplitude: Double) {
        // Update input level (simple amplitude smoothing)
        let newLevel = Float(amplitude)
        inputLevel = inputLevel * 0.9 + newLevel * 0.1
        
        // Find closest note
        guard let closestNote = findClosestNote(to: frequency) else {
            displayNote = "--"
            centsOffString = "0"
            isInTune = false
            return
        }
        
        displayNote = closestNote.name
        let centsOff = closestNote.centsOff
        centsOffString = String(format: "%+d", Int(round(centsOff)))
        isInTune = abs(centsOff) < 10 // Within 10 cents is considered in tune
    }
    
    private func findClosestNote(to frequency: Double) -> (name: String, centsOff: Double)? {
        guard !referenceFrequencies.isEmpty else { return nil }
        
        var minDistance = Double.infinity
        var closestIndex = 0
        
        for (i, refFreq) in referenceFrequencies.enumerated() {
            let distance = abs(frequency - refFreq)
            if distance < minDistance {
                minDistance = distance
                closestIndex = i
            }
        }
        
        let closestFreq = referenceFrequencies[closestIndex]
        let centsOff = 1200 * log2(frequency / closestFreq)
        
        let noteNames = selectedInstrument == .guitar ?
            ["E", "A", "D", "G", "B", "E"] :
            ["G", "C", "E", "A"]
        
        return (noteNames[closestIndex], centsOff)
    }
    
    func start() {
        conductor.start()
        isRunning = true
    }
    
    func stop() {
        conductor.stop()
        isRunning = false
        displayNote = "--"
        centsOffString = "0"
        isInTune = false
        inputLevel = 0.0
    }
}

// MARK: - Audio Conductor (AudioKit wrapper)

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

// Simple frequency to note conversion
func noteToFrequency(_ note: String) -> Double {
    let noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    
    if note.count < 2 { return 0 }
    
    let noteName = String(note.dropLast(1))
    let octave = Int(String(note.last!)) ?? 4
    
    guard let noteIndex = noteNames.firstIndex(of: noteName) else { return 0 }
    
    let n = Double(noteIndex) + (octave - 4) * 12
    let freq = 440.0 * pow(2.0, n / 12.0)
    return freq
}

// Simple permission manager (placeholder)
class AudioPermissionManager {
    static func requestPermission(completion: @escaping (Bool) -> Void) {
        // In a real app, this would use AVAudioSession to request permission
        // For now, we'll just call completion with true
        completion(true)
    }
}

// MARK: - Preview

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
