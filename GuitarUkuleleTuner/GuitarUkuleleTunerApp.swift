import SwiftUI

@main
struct GuitarUkuleleTunerApp: App {
    @StateObject private var chordService = ChordService.shared
    @StateObject private var songService = SongService.shared
    
    var body: some Scene {
        WindowGroup {
            TabView {
                NavigationView {
                    ChordLookupView()
                }
                .tabItem {
                    Label("Chords", systemImage: "guitar")
                }
                
                NavigationView {
                    SongSearchView()
                }
                .tabItem {
                    Label("Songs", systemImage: "music.note")
                }
                
                NavigationView {
                    PracticeView()
                }
                .tabItem {
                    Label("Practice", systemImage: "music.mic")
                }
                
                NavigationView {
                    SettingsView()
                }
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
            }
            .accentColor(.blue)
        }
    }
}

// MARK: - Practice View (placeholder for now)

struct PracticeView: View {
    @StateObject private var songService = SongService.shared
    @State private var selectedSong: Song? = nil
    
    var body: some View {
        VStack(spacing: 20) {
            if let song = selectedSong {
                SongView(song: song)
            } else {
                VStack(spacing: 24) {
                    Image(systemName: "music.mic")
                        .font(.system(size: 60))
                        .foregroundColor(.blue)
                    
                    Text("Select a song to practice")
                        .font(.title2)
                    
                    Text("Choose a song from the Songs tab to begin practicing with real-time feedback")
                        .font(.body)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .navigationTitle("Practice")
        .onAppear {
            // Select a random song or first favorite for demo
            if selectedSong == nil {
                let favorites = songService.getFavoriteSongs()
                if !favorites.isEmpty {
                    selectedSong = favorites.first
                } else {
                    let allSongs = songService.getSongs()
                    if !allSongs.isEmpty {
                        selectedSong = allSongs.first
                    }
                }
            }
        }
    }
}

// MARK: - Settings View

struct SettingsView: View {
    @AppStorage("userName") private var userName: String = ""
    @AppStorage("preferredInstrument") private var preferredInstrumentRaw: String = Instrument.guitar.rawValue
    @AppStorage("microphoneSensitivity") private var microphoneSensitivity: Double = 0.8
    @AppStorage("showChordNames") private var showChordNames: Bool = true
    @AppStorage("autoAdvance") private var autoAdvance: Bool = true
    
    var preferredInstrument: Instrument {
        get { Instrument(rawValue: preferredInstrumentRaw) ?? .guitar }
        set { preferredInstrumentRaw = newValue.rawValue }
    }
    
    var body: some View {
        Form {
            Section(header: Text("Profile")) {
                TextField("Your Name", text: $userName)
                
                Picker("Preferred Instrument", selection: $preferredInstrument) {
                    Text("Guitar").tag(Instrument.guitar)
                    Text("Ukulele").tag(Instrument.ukulele)
                }
                .pickerStyle(.segmented)
            }
            
            Section(header: Text("Audio")) {
                Slider(value: $microphoneSensitivity, in: 0.1...1.0) {
                    Text("Microphone Sensitivity")
                }
                Text("\(Int(microphoneSensitivity * 100))%")
                    .font(.caption)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                    .foregroundColor(.secondary)
            }
            
            Section(header: Text("Display")) {
                Toggle("Show Chord Names", isOn: $showChordNames)
                Toggle("Auto-advance Lyrics/Tabs", isOn: $autoAdvance)
            }
            
            Section(header: Text("About")) {
                HStack {
                    Text("Version")
                    Spacer()
                    Text("1.0.0")
                        .foregroundColor(.secondary)
                }
                
                HStack {
                    Text("Build")
                    Spacer()
                    Text("\(Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1")")
                        .foregroundColor(.secondary)
                }
                
                Button(action: {
                    // TODO: Show privacy policy or credits
                }) {
                    Text("Credits & Acknowledgements")
                        .foregroundColor(.blue)
                }
            }
        }
        .navigationTitle("Settings")
    }
}