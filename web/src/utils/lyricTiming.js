/**
 * Lyric timing utilities for karaoke-style per-word ball movement.
 *
 * Provides helpers for splitting lyrics into syllables/words and calculating
timing offsets for karaoke-style UI.
 */

/**
 * Split a text line into words, preserving punctuation.
 * @param {string} text
 * @returns {string[]}
 */
export function splitWords(text) {
  return text.split(/\s+/).filter(Boolean);
}

/**
 * Estimate syllable count from a word (English-only heuristic).
 * @param {string} word
 * @returns {number}
 */
function estimateSyllables(word) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleaned) return 1;
  // Count vowel groups as syllables (basic heuristic)
  const matches = cleaned.match(/[aeiouy]+/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Generate timing data for a lyric line assuming even distribution.
 *
 * @param {string} text  - Lyric text
 * @param {number} beats - Number of beats for the line
 * @param {number} bpm   - Current BPM
 * @returns {Object}     - Timing object with duration, words, syllables arrays
 */
export function generateLineTiming(text, beats, bpm) {
  const words = splitWords(text);

  // Calculate total duration in ms for the line
  const lineDuration = (beats / bpm) * 60 * 1000;

  // Count total syllables across all words
  const wordSyllables = words.map(w => ({ word: w, syllables: estimateSyllables(w) }));
  const totalSyllables = wordSyllables.reduce((sum, ws) => sum + ws.syllables, 0);

  let currentOffset = 0;
  const syllableMap = [];

  wordSyllables.forEach(({ word, syllables: sylCount }, wordIdx) => {
    const wordDuration = (sylCount / totalSyllables) * lineDuration;

    // Each syllable gets even portion of the word's duration
    for (let s = 0; s < sylCount; s++) {
      const syllableDuration = wordDuration / sylCount;
      syllableMap.push({
        offset: Math.round(currentOffset),
        duration: Math.round(syllableDuration),
        wordIndex: wordIdx,
        word: word,
        isFirstSyllableOfWord: s === 0,
      });
      currentOffset += syllableDuration;
    }
  });

  // Ensure last syllable finishes at lineDuration
  if (syllableMap.length > 0) {
    const last = syllableMap[syllableMap.length - 1];
    last.duration = lineDuration - last.offset;
  }

  // Build words array with start times
  const wordStarts = new Map();
  syllableMap.forEach(syll => {
    if (syll.isFirstSyllableOfWord) {
      wordStarts.set(syll.wordIndex, syll.offset);
    }
  });

  const wordTimings = words.map((word, idx) => ({
    word,
    start: wordStarts.get(idx) ?? 0,
    index: idx,
  }));

  return {
    text,
    duration: lineDuration,
    words: wordTimings,
    syllables: syllableMap,
  };
}

/**
 * Generate timing data for an entire song.
 * @param {Object} song - Song object with lyrics array [{text, chord, beats}]
 * @returns {Object}    - Song with timing pre-calculated for each lyric line
 */
export function generateSongTiming(song) {
  const lines = song.lyrics.map((line, lineIndex) => {
    const timing = generateLineTiming(line.text, line.beats || 4, song.bpm);
    return {
      ...line,
      lineIndex,
      timing,
    };
  });

  // Calculate absolute offsets within the song
  let songOffset = 0;
  const linesWithAbsolute = lines.map(line => {
    const lineStart = songOffset;
    const timed = {
      ...line,
      startTime: lineStart,
      words: line.timing.words.map(w => ({
        ...w,
        absoluteStart: lineStart + w.start,
      })),
    };
    songOffset += line.timing.duration;
    return timed;
  });

  return {
    ...song,
    lyrics: linesWithAbsolute,
  };
}

/**
 * Find the current word and line given a song position in ms.
 *
 * @param {Object} timedSong - Song with pre-calculated timing
 * @param {number} position  - Current position in ms from song start
 * @returns {Object|null}    - {line, word, syllableIndex, isLineStart} or null if not found
 */
export function findPosition(timedSong, position) {
  for (let li = 0; li < timedSong.lyrics.length; li++) {
    const line = timedSong.lyrics[li];
    const endTime = line.startTime ? line.startTime + line.timing.duration : Infinity;

    if (position >= line.startTime && position < endTime) {
      // Find current word within this line
      const relativePos = position - line.startTime;
      let currentWord = null;
      let currentSyllable = null;

      for (let si = 0; si < line.timing.syllables.length; si++) {
        const syllable = line.timing.syllables[si];
        if (relativePos >= syllable.offset &&
            relativePos < syllable.offset + syllable.duration) {
          currentSyllable = { ...syllable, lineIndex: li, syllableIndex: si };
          break;
        }
      }

      // Find current word from syllable
      if (currentSyllable) {
        const wordIndex = currentSyllable.wordIndex;
        currentWord = line.timing.words.find(w => w.index === wordIndex);
      }

      return {
        line,
        word: currentWord,
        syllable: currentSyllable,
        isLineStart: li === 0 || position === line.startTime,
        lineIndex: li,
      };
    }
  }

  return null;
}

/**
 * Get the next position where a new line starts (used for chord changes).
 * @param {Object} timedSong
 * @param {number} currentPosition
 * @returns {number|null}
 */
export function getNextLineStart(timedSong, currentPosition) {
  for (const line of timedSong.lyrics) {
    if (line.startTime > currentPosition) {
      return line.startTime;
    }
  }
  return null;
}
