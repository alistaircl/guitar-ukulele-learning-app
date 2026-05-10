import SwiftUI
import AVFoundation

struct SongView: View {
    let song: Song
    @StateObject private var viewModel: SongViewModel
    @State private var isPracticing: Bool = false
    @State private var currentTime: TimeInterval = 0
    @State private var timer: Timer?
    
    init(song: Song) {
        self.song = song
        self._viewModel = StateObject(wrappedValue: SongViewModel(song: song))
    }
    
    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                gradient: Gradient(colors: [Color(.systemBackground), Color(.secondarySystemBackground)]),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Song header
                SongHeaderView(song: song)
                    .padding()
                
                // Controls
                SongControlsView(
                    viewModel: viewModel,
                    isPracticing: $isPracticing,
                    currentTime: $currentTime
                )
                .padding(.horizontal)
                
                // Main content - tabs and lyrics
                if isPracticing {
                    PracticeModeView(
                        viewModel: viewModel,
                        currentTime: $currentTime,
                        song: song
                    )
                } else {
                    SongContentView(
                        song: song,
                        sections: viewModel.sections
                    )
                }
                
                Spacer()
            }
        }
        .navigationTitle(song.title)
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            setupAudioSession()
        }
        .onDisappear {
            stopPractice()
            AudioManager.shared.stop()
        }
    }
    
    private func setupAudioSession() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playAndRecord, mode: .default, options: [.allowBluetooth, .allowBluetoothA2DP])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("Failed to set up audio session: \(error)")
        }
    }
    
    private func startPractice() {
        isPracticing = true
        currentTime = 0
        viewModel.startListening()
        
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.currentTime += 0.1
            
            // Update practice view with current time
            self.viewModel.update(currentTime: self.currentTime)
            
            // Check if song is done
            if self.currentTime >= self.song.duration {
                self.stopPractice()
            }
        }
    }
    
    private func stopPractice() {
        isPracticing = false
        timer?.invalidate()
        timer = nil
        viewModel.stopListening()
    }
}

struct SongHeaderView: View {
    let song: Song
    
    var body: some View {
        VStack(spacing: 12) {
            // Song info
            VStack(spacing: 4) {
                Text(song.title)
                    .font(.title2)
                    .fontWeight(.bold)
                
                Text(song.artist)
                    .font(.title3)
                    .foregroundColor(.secondary)
                
                if let album = song.album {
                    Text(album)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            // Stats
            HStack(spacing: 20) {
                StatView(label: "Duration", value: song.formattedDuration)
                StatView(label: "Difficulty", value: song.difficulty.displayName)
                StatView(label: "Sections", value: "\(song.sections.count)")
            }
            
            // Favorite button
            Button(action: {
                SongService.shared.toggleFavorite(for: song)
            }) {
                Image(systemName: SongService.shared.getFavoriteSongs().contains(where: { $0.id == song.id }) ? "star.fill" : "star")
                    .font(.system(size: 24))
                    .foregroundColor(.yellow)
            }
        }
    }
}

struct StatView: View {
    let label: String
    let value: String
    
    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.headline)
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }
}

struct SongControlsView: View {
    @ObservedObject var viewModel: SongViewModel
    @Binding var isPracticing: Bool
    @Binding var currentTime: TimeInterval
    
    var body: some View {
        VStack(spacing: 16) {
            // Progress bar
            VStack(spacing: 8) {
                Slider(value: Binding(
                    get: { currentTime },
                    set: { newValue in
                        currentTime = newValue
                        viewModel.seek(to: newValue)
                    }
                ), in: 0...song.duration)
                .accentColor(.blue)
                
                HStack {
                    Text(formatTime(currentTime))
                    Spacer()
                    Text(formatTime(song.duration))
                }
                .font(.caption)
                .foregroundColor(.secondary)
            }
            
            // Tempo and transpose controls
            HStack(spacing: 20) {
                ControlButton(label: "Tempo", value: "\(Int(viewModel.tempo))%", systemImage: "gauge") {
                    // Show tempo slider
                }
                
                ControlButton(label: "Key", value: "\(viewModel.transpose >= 0 ? "+" : "")\(viewModel.transpose)", systemImage: "music.note") {
                    // Show transpose selector
                }
                
                Button(action: {
                    if isPracticing {
                        stopPractice()
                    } else {
                        startPractice()
                    }
                }) {
                    Label(isPracticing ? "Stop" : "Practice", systemImage: isPracticing ? "stop.fill" : "play.fill")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .padding()
        .background(Color(.systemGroupedBackground))
        .cornerRadius(12)
        .padding(.horizontal)
    }
    
    private func formatTime(_ time: TimeInterval) -> String {
        let minutes = Int(time) / 60
        let seconds = Int(time) % 60
        return String(format: "%d:%02d", minutes, seconds)
    }
    
    private func startPractice() {
        isPracticing = true
        currentTime = 0
        viewModel.startListening()
        
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.currentTime += 0.1
            
            // Update practice view with current time
            self.viewModel.update(currentTime: self.currentTime)
            
            // Check if song is done
            if self.currentTime >= self.song.duration {
                self.stopPractice()
            }
        }
    }
    
    private func stopPractice() {
        isPracticing = false
        timer?.invalidate()
        timer = nil
        viewModel.stopListening()
    }
    
    private var song: Song {
        viewModel.song
    }
}

struct ControlButton: View {
    let label: String
    let value: String
    let systemImage: String
    let action: () -> Void
    
    var body: some View {
        VStack(spacing: 4) {
            Button(action: action) {
                VStack {
                    Image(systemName: systemImage)
                        .font(.system(size: 20))
                    Text(value)
                        .font(.caption2)
                        .fontWeight(.medium)
                }
                .frame(width: 60)
            }
            
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}

struct SongContentView: View {
    let song: Song
    let sections: [SongSectionViewModel]
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                ForEach(sections) { section in
                    SongSectionView(section: section)
                }
            }
            .padding()
        }
    }
}

struct SongSectionView: View {
    let section: SongSectionViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Section header
            HStack {
                Image(systemName: section.type.systemImage)
                    .font(.system(size: 20))
                    .foregroundColor(.blue)
                
                Text(section.name)
                    .font(.title3)
                    .fontWeight(.semibold)
                
                Spacer()
                
                Text("\(Int(section.startTime))s - \(Int(section.endTime))s")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            // Chords in this section
            if !section.chords.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(section.chords) { chordRef in
                            ChordChipView(chordName: chordRef.chordName)
                        }
                    }
                }
                .padding(.vertical, 4)
            }
            
            // Lyrics
            if !section.lyrics.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                Text(section.lyrics)
                    .font(.body)
                    .fixedSize(horizontal: false, vertical: true)
                    .padding(.vertical, 4)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color(.systemGray5))
                    )
            }
            
            // Tablature (simplified representation)
            if !section.tablature.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                Text(section.tablature)
                    .font(.system(.body, design: .monospaced))
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.vertical, 4)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color(.systemGroupedBackground))
                    )
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(.systemBackground))
                .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
        )
    }
}

struct ChordChipView: View {
    let chordName: String
    
    var body: some View {
        Text(chordName)
            .font(.headline)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color.blue.opacity(0.1))
            )
            .foregroundColor(.blue)
    }
}