import XCTest
@testable import GuitarUkuleleTuner

final class GuitarUkuleleTunerTests: XCTestCase {
    
    func testChordServiceInitialization() {
        let service = ChordService.shared
        XCTAssertNotNil(service)
        XCTAssertFalse(service.guitarChords.isEmpty || service.ukuleleChords.isEmpty)
    }
    
    func testChordLookup() {
        let service = ChordService.shared
        let positions = service.getChords(for: .guitar, key: "C", suffix: "major")
        XCTAssertFalse(positions.isEmpty)
    }
    
    func testChordSearch() {
        let service = ChordService.shared
        let results = service.searchChords(query: "C")
        XCTAssertFalse(results.isEmpty)
        XCTAssertTrue(results.contains { $0.hasPrefix("C") })
    }
    
    func testSongServiceInitialization() {
        let service = SongService.shared
        XCTAssertNotNil(service)
        XCTAssertFalse(service.getSongs().isEmpty)
    }
    
    func testSongSearch() {
        let service = SongService.shared
        let results = service.searchSongs(query: "Beatles")
        XCTAssertTrue(results.contains { $0.artist == "The Beatles" })
    }
    
    func testFavoriteToggle() {
        let service = SongService.shared
        let initialCount = service.getFavoriteSongs().count
        
        if let firstSong = service.getSongs().first {
            service.toggleFavorite(for: firstSong)
            let newCount = service.getFavoriteSongs().count
            XCTAssertEqual(newCount, initialCount + 1)
            
            // Toggle again to remove
            service.toggleFavorite(for: firstSong)
            let finalCount = service.getFavoriteSongs().count
            XCTAssertEqual(finalCount, initialCount)
        }
    }
    
    func testChordPositionDifficultyCalculation() {
        let position = ChordPosition(
            frets: [-1, 3, 2, 0, 1, 0],
            fingers: [0, 3, 2, 0, 1, 0],
            baseFret: 1,
            barres: [],
            capo: false,
            midi: [48, 52, 55, 60, 64]
        )
        
        XCTAssertGreaterThanOrEqual(position.difficultyLevel, 0)
        XCTAssertLessThanOrEqual(position.difficultyLevel, 5.0)
    }
    
    func testUkuleleChordPositionDifficultyCalculation() {
        let position = UkuleleChordPosition(
            frets: [0, 0, 0, 3],
            fingers: [1, 1, 1, 2],
            baseFret: 0,
            barres: [],
            capo: false,
            midi: [48, 52, 55, 60]
        )
        
        XCTAssertGreaterThanOrEqual(position.difficultyLevel, 0)
        XCTAssertLessThanOrEqual(position.difficultyLevel, 5.0)
    }
    
    func testSongModelProperties() {
        let song = Song(
            id: UUID(),
            title: "Test Song",
            artist: "Test Artist",
            album: "Test Album",
            duration: 180.0,
            sections: [],
            difficulty: .beginner,
            isFavorite: false,
            addedDate: Date(),
            tags: ["test"]
        )
        
        XCTAssertEqual(song.displayTitle, "Test Song - Test Artist")
        XCTAssertEqual(song.formattedDuration, "3:00")
    }
    
    func testPracticeSessionModel() {
        let session = PracticeSession(
            id: UUID(),
            songId: UUID(),
            userId: UUID(),
            date: Date(),
            duration: 120.0,
            sectionsPracticed: [],
            overallScore: 85.0,
            accuracyScore: 90.0,
            timingScore: 80.0,
            notesPlayed: 45,
            notesExpected: 50,
            mistakes: [],
            settings: PracticeSettings(
                tempo: 100.0,
                transpose: 0,
                instrument: .guitar,
                difficulty: .beginner,
                useMetronome: true,
                metronomeVolume: 0.7,
                showChords: true,
                showLyrics: true,
                showTabs: true,
                loopEnabled: false,
                loopStart: 0,
                loopEnd: 0
            )
        )
        
        XCTAssertEqual(session.notesMissed, 5)
        XCTAssertEqual(session.accuracyPercentage, "90%")
        XCTAssertEqual(session.timingPercentage, "80%")
        XCTAssertEqual(session.overallPercentage, "85%")
    }
}