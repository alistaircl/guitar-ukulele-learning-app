with open('static/js/main.30fddd60.js', 'r') as f:
    content = f.read()

# Search for ALL Baritone entries
import re
matches = list(re.finditer(r'Baritone', content))
for m in matches:
    start = max(0, m.start() - 50)
    end = min(len(content), m.end() + 150)
    print(f"Baritone at {m.start()}: ...{content[start:end]}...")
    print("---")

print("\n\n=== Search for freq arrays with 196 as first element ===")
matches = list(re.finditer(r'freq:\[196', content))
for m in matches:
    start = max(0, m.start() - 80)
    end = min(len(content), m.end() + 100)
    print(f"freq:[196 at {m.start()}: ...{content[start:end]}...")
    print("---")
