import SwiftUI

struct SongSearchView: View {
    @StateObject private var songService = SongService.shared
    @State private var searchQuery: String = ""
    @State private var selectedSong: Song? = nil
    @State private var showingFavoritesOnly: Bool = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Search and filters
                VStack(spacing: 12) {
                    HStack {
                        Image(systemName: "magnifyingglass")
                        TextField("Search songs", text: $searchQuery)
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
                    
                    Toggle(isOn: $showingFavoritesOnly) {
                        Text("Show Favorites Only")
                    }
                    .toggleStyle(.switch)
                    .padding(.horizontal)
                }
                .padding(.vertical, 8)
                .background(Color(.systemBackground))
                
                // Results list
                if showingFavoritesOnly {
                    FavoriteSongsListView(songs: songService.getFavoriteSongs(), selectedSong: $selectedSong)
                } else if !searchQuery.isEmpty {
                    SongSearchResultsView(query: searchQuery, songs: songService, selectedSong: $selectedSong)
                } else {
                    RecentSongsListView(songs: songService.getSongs(), selectedSong: $selectedSong)
                }
            }
            .navigationTitle("Song Search")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        // Show filters or sort options
                    }) {
                        Image(systemName: "line.3.horizontal.decrease.circle")
                    }
                }
            }
        }
        .navigationViewStyle(.stack)
    }
}

struct FavoriteSongsListView: View {
    let songs: [Song]
    @Binding var selectedSong: Song?
    
    var body: some View {
        if songs.isEmpty {
            ContentUnavailableView(
                "No favorite songs",
                systemImage: "heart.slash",
                description: Text("You haven't favorited any songs yet")
            )
        } else {
            List {
                ForEach(songs) { song in
                    SongRowView(song: song)
                        .contentShape(Rectangle())
                        .onTapGesture {
                            selectedSong = song
                        }
                        .swipeActions(edge: .trailing) {
                            Button(role: .destructive) {
                                // Remove from favorites
                                SongService.shared.toggleFavorite(for: song)
                            } label: {
                                Label("Remove", systemImage: "heart.slash")
                            }
                            .tint(.red)
                        }
                }
            }
            .listStyle(.plain)
        }
    }
}

struct RecentSongsListView: View {
    let songs: [Song]
    @Binding var selectedSong: Song?
    
    var body: some View {
        List {
            ForEach(songs) { song in
                SongRowView(song: song)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        selectedSong = song
                    }
            }
        }
        .listStyle(.plain)
    }
}

struct SongSearchResultsView: View {
    let query: String
    let songService: SongService
    @Binding var selectedSong: Song?
    
    var body: some View {
        let results = songService.searchSongs(query: query)
        
        if results.isEmpty {
            ContentUnavailableView(
                "No songs found",
                systemImage: "music.note",
                description: Text("Try searching for a different song or artist")
            )
        } else {
            List(results) { song in
                SongRowView(song: song)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        selectedSong = song
                    }
                    .swipeActions {
                        Button {
                            SongService.shared.toggleFavorite(for: song)
                        } label: {
                            Label("Favorite", systemImage: "star")
                        }
                        .tint(.yellow)
                    }
            }
            .listStyle(.plain)
        }
    }
}

struct SongRowView: View {
    let song: Song
    
    var body: some View {
        HStack(spacing: 16) {
            // Album art placeholder
            ZStack {
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color(.systemGray5))
                    .frame(width: 60, height: 60)
                
                Image(systemName: "music.note")
                    .font(.system(size: 24))
                    .foregroundColor(.secondary)
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(song.title)
                    .font(.headline)
                    .lineLimit(1)
                
                Text(song.artist)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .lineLimit(1)
                
                HStack(spacing: 12) {
                    Label(song.formattedDuration, systemImage: "clock")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Label(song.difficulty.displayName, systemImage: "gauge")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    if song.isFavorite {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                    }
                }
            }
            
            Spacer()
            
            // Favorite button
            Button(action: {
                // Toggle favorite - handled in parent view
            }) {
                Image(systemName: song.isFavorite ? "star.fill" : "star")
                    .font(.system(size: 20))
                    .foregroundColor(song.isFavorite ? .yellow : .secondary)
            }
            .buttonStyle(.plain)
        }
        .padding()
        .background(Color(.systemBackground))
    }
}