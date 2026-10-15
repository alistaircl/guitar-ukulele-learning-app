import subprocess

# More detailed test
test_code = '''
const ALL_CHORDS = [
  { name: 'C', frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3], variations: [] },
  { name: 'Cm', frets: [0, 3, 3, 3], fingers: [0, 3, 3, 3], variations: [] },
  { name: 'Cmaj7', frets: [0, 0, 0, 2], fingers: [0, 0, 0, 2], variations: [] },
  { name: 'D', frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0], variations: [] },
  { name: 'Dm', frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0], variations: [] },
  { name: 'Dmaj7', frets: [2, 2, 2, 4], fingers: [1, 2, 3, 4], variations: [] },
];

function searchChords(query) {
  const lowerQuery = query.toLowerCase().trim();
  let normalizedQuery = lowerQuery
    .replace(/\\s*chords\\b/g, '')
    .replace(/\\s+major\\s+7\\b/g, 'maj7')
    .replace(/\\s+major\\s+seventh\\b/g, 'maj7')
    .replace(/\\s+major\\s+7th\\b/g, 'maj7')
    .replace(/\\s+minor\\b/g, 'm')
    .replace(/\\s+major\\b/g, '')
    .replace(/\\s+(seventh|7th)\\b/g, '7')
    .replace(/\\s+sus4\\b/g, 'sus4')
    .replace(/\\s+sus2\\b/g, 'sus2')
    .replace(/\\s+sus\\b/g, 'sus')
    .replace(/\\s+add9\\b/g, 'add9')
    .replace(/\\s+add\\b/g, 'add')
    .replace(/\\s+dim7\\b/g, 'dim7')
    .replace(/\\s+dim\\b/g, 'dim')
    .replace(/\\s+aug\\b/g, 'aug')
    .replace(/\\s+\\+\\b/g, 'aug')
    .trim();

  console.log("Query:", query, "-> normalized:", normalizedQuery);

  if (normalizedQuery === '') {
    if (lowerQuery.includes('major')) {
      return ALL_CHORDS.filter(chord => {
        const name = chord.name.toLowerCase();
        return /^[a-g][#b]?(maj7)?$/.test(name);
      });
    }
    return ALL_CHORDS;
  }

  if (normalizedQuery === 'm') {
    console.log("  -> matched 'm' special case");
    return ALL_CHORDS.filter(chord => {
      const name = chord.name.toLowerCase();
      return /^[a-g][#b]?m(7|$)/.test(name);
    });
  }

  if (/^[a-g][#b]?m$/.test(normalizedQuery)) {
    console.log("  -> matched note+m special case");
    return ALL_CHORDS.filter(chord => {
      const name = chord.name.toLowerCase();
      return /^[a-g][#b]?m(7|$)/.test(name);
    });
  }

  const searchTerms = normalizedQuery.split(/\\s+/).filter(term => term.length > 0);

  if (searchTerms.length === 1) {
    console.log("  -> single term search:", searchTerms[0]);
    return ALL_CHORDS.filter(chord => 
      chord.name.toLowerCase().includes(searchTerms[0])
    );
  }

  console.log("  -> multiple terms:", searchTerms);
  return ALL_CHORDS.filter(chord => {
    const chordName = chord.name.toLowerCase();
    return searchTerms.every(term => chordName.includes(term));
  });
}

console.log("=== Testing 'C minor' ===");
console.log("Results:", searchChords('C minor').map(c => c.name));

console.log("\\n=== Testing 'D minor' ===");
console.log("Results:", searchChords('D minor').map(c => c.name));

console.log("\\n=== Testing 'minor' ===");
console.log("Results:", searchChords('minor').map(c => c.name));

console.log("\\n=== Testing 'C major' ===");
console.log("Results:", searchChords('C major').map(c => c.name));

console.log("\\n=== Testing 'C major 7' ===");
console.log("Results:", searchChords('C major 7').map(c => c.name));
'''

with open('/tmp/test_search2.js', 'w') as f:
    f.write(test_code)

result = subprocess.run(['node', '/tmp/test_search2.js'], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)
