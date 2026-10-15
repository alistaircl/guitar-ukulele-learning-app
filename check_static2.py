with open('static/js/main.30fddd60.js', 'r') as f:
    content = f.read()

# Look for multiple occurrences
import re
matches = list(re.finditer(r'D4 G4 B4 E5', content))
for m in matches:
    start = m.start()
    print(f"Match at {start}: {content[start:start+150]}")
    print("---")
