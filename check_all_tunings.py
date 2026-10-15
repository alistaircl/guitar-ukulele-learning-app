import subprocess
result = subprocess.run(['git', 'show', 'main:web/src/components/Tuner.js'], capture_output=True, text=True)
content = result.stdout

import re
# Find all tuning entries
matches = list(re.finditer(r"'([^']+)':\s*\{[^}]+notes:\s*\[([^\]]+)\][^}]+freq:\s*\[([^\]]+)\]", content))
for m in matches:
    key = m.group(1)
    notes_str = m.group(2)
    freq_str = m.group(3)
    
    notes = [n.strip().strip("'\"") for n in notes_str.split(',')]
    freqs = [float(f.strip()) for f in freq_str.split(',')]
    
    print(f"Key: {key}")
    print(f"  Notes: {notes}")
    print(f"  Freqs: {freqs}")
    print()

