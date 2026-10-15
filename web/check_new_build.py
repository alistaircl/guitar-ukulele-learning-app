with open('build/static/js/main.6d63e905.js', 'r') as f:
    content = f.read()

import re
matches = list(re.finditer(r'Baritone|D4 G4 B4 E5', content))
for m in matches:
    start = max(0, m.start() - 50)
    end = min(len(content), m.end() + 150)
    print(f"Match at {m.start()}: ...{content[start:end]}...")
    print("---")
