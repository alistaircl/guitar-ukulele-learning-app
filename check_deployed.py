import subprocess

# Check if there's a different version in any branch
branches = ['main', 'gh-pages', 'fix/issue-247-guitar-chord-fingerings', 'backup-main']
for branch in branches:
    try:
        result = subprocess.run(['git', 'show', f'{branch}:web/src/components/Tuner.js'], capture_output=True, text=True)
        if result.returncode == 0:
            content = result.stdout
            idx = content.find('D4 G4 B4 E5')
            if idx != -1:
                # Extract the freq array
                import re
                match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content)
                if match:
                    print(f"{branch}: {match.group(1)}")
    except:
        pass

# Also check static files in gh-pages
try:
    result = subprocess.run(['git', 'ls-tree', 'gh-pages', 'static/js/'], capture_output=True, text=True)
    print("\nGH-PAGES static/js files:")
    print(result.stdout)
except:
    pass

