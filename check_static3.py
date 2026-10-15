with open('static/js/main.30fddd60.js', 'r') as f:
    content = f.read()

# Search for Baritone with 196 Hz
import re
# Look for patterns like "Baritone" near 196
matches = list(re.finditer(r'Baritone|196', content))
for m in matches:
    start = max(0, m.start() - 50)
    end = min(len(content), m.end() + 100)
    print(f"Match at {m.start()}: ...{content[start:end]}...")
    print("---")
