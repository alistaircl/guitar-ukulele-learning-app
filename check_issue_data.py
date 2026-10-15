# The issue says the production bundle has freq: [196, 392, 493.88, 659.25] for Baritone
# But the data shown in the issue shows [293.66, 392, 493.88, 659.25] with comment "index 0 wrong"
# This is confusing - let me verify what the current static build has

import subprocess
result = subprocess.run(['git', 'show', 'gh-pages:static/js/main.d7f01dc5.js'], capture_output=True, text=True)
content = result.stdout

import re
# Find the Baritone entry
match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content)
if match:
    print(f"GH-Pages Baritone freq: {match.group(1)}")

# Also check the current working directory static build
with open('static/js/main.30fddd60.js', 'r') as f:
    content = f.read()
match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content)
if match:
    print(f"Current static build Baritone freq: {match.group(1)}")

# Check the new build
with open('web/build/static/js/main.6d63e905.js', 'r') as f:
    content = f.read()
match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content)
if match:
    print(f"New build Baritone freq: {match.group(1)}")

