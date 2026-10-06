import re

with open('components/PracticeMode.js', 'r') as f:
    content = f.read()

# We want to replace the lyrics for the song with id 5.
# We'll use a regex to find the lyrics array for the song with id 5 and replace it.

# Pattern to match the song object for id 5 and capture the lyrics array.
pattern = re.compile(r'(\{ id: 5,.*?lyrics: \[)(.*?)(\][\s]*\},)', re.DOTALL)

def replace_lyrics(match):
    prefix = match.group(1)
    suffix = match.group(3)
    new_lyrics = '''      { text: 'When the night has come', chord: 'A', beats: 4 },
      { text: 'And the land is dark', chord: 'F#m', beats: 4 },
      { text: 'And the moon is the only light we\\'ll see', chord: 'D', beats: 4 },
      { text: 'No I won\\'t be afraid', chord: 'E', beats: 4 },
      { text: 'Oh please stand by me', chord: 'A', beats: 4 },
      { text: 'Oh please stand by me', chord: 'F#m', beats: 4 },
      { text: 'When stormy weather raging', chord: 'A', beats: 4 },
      { text: 'Around my door', chord: 'F#m', beats: 4 },
      { text: 'I won\\'t be afraid', chord: 'D', beats: 4 },
      { text: 'Just as long as you stand by me', chord: 'E', beats: 4 },
      { text: 'Oh please stand by me', chord: 'A', beats: 4 },
      { text: 'Oh please stand by me', chord: 'F#m', beats: 4 },
'''
    return prefix + new_lyrics + suffix

new_content = pattern.sub(replace_lyrics, content)

with open('components/PracticeMode.js', 'w') as f:
    f.write(new_content)