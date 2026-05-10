import Foundation

// MARK: - Song Service

class SongService {
    static let shared = SongService()
    
    private(set) var songs: [Song] = []
    private(set) var favoriteSongs: [Song] = []
    
    private init() {
        loadSampleData()
        loadFavorites()
    }
    
    private func loadSampleData() {
        songs = SampleDataGenerator.shared.generateSampleSongs()
    }
    
    private func loadFavorites() {
        // Load from UserDefaults or similar in real app
        // For now, just filter songs that are marked as favorite
        favoriteSongs = songs.filter { $0.isFavorite }
    }
    
    func getSongs() -> [Song] {
        return songs
    }
    
    func getFavoriteSongs() -> [Song] {
        return favoriteSongs
    }
    
    func searchSongs(query: String) -> [Song] {
        if query.isEmpty {
            return songs
        }
        
        let lowercasedQuery = query.lowercased()
        return songs.filter { 
            $0.title.lowercased().contains(lowercasedQuery) ||
            $0.artist.lowercased().contains(lowercasedQuery) ||
            $0.album.lowercased().contains(lowercasedQuery)
        }
    }
    
    func toggleFavorite(for song: Song) {
        if let index = songs.firstIndex(where: { $0.id == song.id }) {
            songs[index].isFavorite.toggle()
            
            if songs[index].isFavorite {
                favoriteSongs.append(songs[index])
                favoriteSongs.sort { $0.title < $1.title }
            } else {
                favoriteSongs.removeAll { $0.id == song.id }
            }
        }
    }
    
    func getSong(byId id: UUID) -> Song? {
        return songs.first { $0.id == id }
    }
}