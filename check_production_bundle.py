import subprocess

# The issue mentions production bundle: static/js/main.0be1e849.js
# Let me check if this exists anywhere or was an older deploy

# Check all commits on gh-pages that might have this hash
result = subprocess.run(['git', 'log', '--all', '--oneline', '--grep=0be1e849'], capture_output=True, text=True)
print("Commits mentioning 0be1e849:")
print(result.stdout)

# Also check the current gh-pages static JS
result = subprocess.run(['git', 'show', 'gh-pages:static/js/main.d7f01dc5.js'], capture_output=True, text=True)
content = result.stdout

# Check if there are TWO Baritone entries
import re
matches = list(re.finditer(r'Baritone', content))
for m in matches:
    start = max(0, m.start() - 30)
    end = min(len(content), m.end() + 150)
    print(f"\nBaritone at {m.start()}: ...{content[start:end]}...")
    print("---")

