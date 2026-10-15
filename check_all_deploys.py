import subprocess

# Check all deploys on gh-pages for Baritone frequency
commits = [
    '21e78bef', '8e31bd13', '600c43b1', '0ea45036', 'e78f2c2a', 
    'ce4a72ae', 'd1c63a5d', '71bc72db', '58bbda82', 'f024dd4d',
    '5ce84e94', '74b38088', '96b9f860', '96e67057', 'a833dd72',
    'f89840a9', '16de2e36', 'e6e134cf', 'b90d05bf', '5b9eec28',
    '205dcc21', 'c7994553', 'dcd63c3d', '78b37757', '5a1a5fc8'
]

for commit in commits:
    try:
        result = subprocess.run(['git', 'ls-tree', commit, 'static/js/'], capture_output=True, text=True)
        if result.stdout:
            lines = result.stdout.strip().split('\n')
            for line in lines:
                if 'main.' in line and '.map' not in line and '.LICENSE' not in line:
                    parts = line.split()
                    blob_hash = parts[2]
                    js_file = parts[3]
                    
                    # Get the JS content
                    js_result = subprocess.run(['git', 'show', f'{commit}:static/js/{js_file}'], capture_output=True, text=True)
                    content = js_result.stdout
                    
                    import re
                    match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content)
                    if match:
                        print(f"{commit} ({js_file}): {match.group(1)}")
    except Exception as e:
        pass

