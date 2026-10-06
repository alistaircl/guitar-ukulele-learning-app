const chordData = require('./src/data/chords.js');
console.log('ALL_CHORDS length:', chordData.ALL_CHORDS.length);
console.log('First chord:', chordData.ALL_CHORDS[0]);
console.log('getAllChords("ukulele").length:', chordData.getAllChords('ukulele').length);
console.log('Sample chord frets:', chordData.ALL_CHORDS[0].frets);
console.log('Sample chord fingers:', chordData.ALL_CHORDS[0].fingers);