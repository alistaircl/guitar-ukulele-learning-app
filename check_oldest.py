import subprocess

result = subprocess.run(['git', 'show', '5a1a5fc8:static/js/main.cc131ee3.js'], capture_output=True, text=True)
content = result.stdout

import re
match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content)
if match:
    print(f'Oldest deploy: {match.group(1)}')
else:
    print('Not found')

# Also check a few intermediate ones
for commit in ['dcd63c3d', 'c7994553', '205dcc21', '5b9eec28', 'b90d05bf']:
    result = subprocess.run(['git', 'ls-tree', commit, 'static/js/'], capture_output=True, text=True)
    for line in result.stdout.strip().split('\n'):
        if 'main.' in line and '.map' not in line and '.LICENSE' not in line:
            parts = line.split()
            blob_hash = parts[2]
            js_file = parts[3]
            js_result = subprocess.run(['git', 'show', f'{commit}:static/js/{js_file}'], capture_output=True, text=True)
            content = js_result.stdout
            match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content)
            if match:
                print(f"{commit} ({js_file}): {match.group(1)}")
