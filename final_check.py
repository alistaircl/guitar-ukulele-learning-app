import subprocess
import re

# Let me check the issue's claim more carefully
# The issue says production bundle main.0be1e849.js has freq: [196, 392, 493.88, 659.25]
# But the data they show has [293.66, 392, 493.88, 659.25] with comment "index 0 wrong"

# Let me check if there's any version in git history where Baritone had 196 as first freq
result = subprocess.run(['git', 'log', '--all', '-p', '-S', 'D4 G4 B4 E5', '--', 'web/src/components/Tuner.js'], capture_output=True, text=True)
content = result.stdout

# Find all freq arrays for Baritone in the diff
matches = list(re.finditer(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content))
for m in matches:
    print(f"History: {m.group(1)}")

# Also check the current file one more time
with open('web/src/components/Tuner.js', 'r') as f:
    content = f.read()

match = re.search(r"'D4 G4 B4 E5':\s*\{[^}]+freq:\s*\[([^\]]+)\]", content)
if match:
    print(f"\nCurrent web/src/components/Tuner.js: {match.group(1)}")

# Check the static build
with open('static/js/main.30fddd60.js', 'r') as f:
    content = f.read()
match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content)
if match:
    print(f"Current static build: {match.group(1)}")

# Check new build
with open('web/build/static/js/main.6d63e905.js', 'r') as f:
    content = f.read()
match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content)
if match:
    print(f"New build: {match.group(1)}")

# Check gh-pages
result = subprocess.run(['git', 'show', 'gh-pages:static/js/main.d7f01dc5.js'], capture_output=True, text=True)
match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', result.stdout)
if match:
    print(f"GH-Pages: {match.group(1)}")

