# Check the static JS in the current working directory
with open('static/js/main.30fddd60.js', 'r') as f:
    content = f.read()

import re
matches = list(re.finditer(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content))
for m in matches:
    print(f"Current static build: {m.group(1)}")

# Check if there's an older version somewhere
import glob
js_files = glob.glob('**/*.js', recursive=True)
for js_file in js_files[:20]:
    if 'main.' in js_file and '.map' not in js_file and 'node_modules' not in js_file:
        try:
            with open(js_file, 'r') as f:
                c = f.read()
            idx = c.find('D4 G4 B4 E5')
            if idx != -1:
                match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', c[idx:idx+200])
                if match:
                    print(f"{js_file}: {match.group(1)}")
        except:
            pass

