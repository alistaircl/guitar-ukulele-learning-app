import subprocess

# Check current working directory
with open('web/src/components/Tuner.js', 'r') as f:
    content = f.read()

import re
matches = list(re.finditer(r"'([^']+)':\s*\{[^}]+notes:\s*\[([^\]]+)\][^}]+freq:\s*\[([^\]]+)\]", content))
for m in matches:
    key = m.group(1)
    notes_str = m.group(2)
    freq_str = m.group(3)
    
    notes = [n.strip().strip("'\"") for n in notes_str.split(',')]
    freqs = [float(f.strip()) for f in freq_str.split(',')]
    
    if 'Baritone' in key or 'D4 G4 B4 E5' in key:
        print(f"CURRENT WORKING DIR:")
        print(f"  Key: {key}")
        print(f"  Notes: {notes}")
        print(f"  Freqs: {freqs}")
        print()

# Check main branch
result = subprocess.run(['git', 'show', 'main:web/src/components/Tuner.js'], capture_output=True, text=True)
content = result.stdout
matches = list(re.finditer(r"'([^']+)':\s*\{[^}]+notes:\s*\[([^\]]+)\][^}]+freq:\s*\[([^\]]+)\]", content))
for m in matches:
    key = m.group(1)
    notes_str = m.group(2)
    freq_str = m.group(3)
    
    notes = [n.strip().strip("'\"") for n in notes_str.split(',')]
    freqs = [float(f.strip()) for f in freq_str.split(',')]
    
    if 'Baritone' in key or 'D4 G4 B4 E5' in key:
        print(f"MAIN BRANCH:")
        print(f"  Key: {key}")
        print(f"  Notes: {notes}")
        print(f"  Freqs: {freqs}")
        print()

# Check gh-pages branch
result = subprocess.run(['git', 'show', 'gh-pages:static/js/main.d7f01dc5.js'], capture_output=True, text=True)
content = result.stdout
idx = content.find('D4 G4 B4 E5')
if idx != -1:
    print(f"GH-PAGES BUILT JS:")
    print(f"  {content[idx:idx+150]}")

