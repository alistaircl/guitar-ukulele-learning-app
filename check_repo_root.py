import glob
import re

# Check all JS files in repo root and static/
js_files = glob.glob('*.js') + glob.glob('static/**/*.js', recursive=True)
for js_file in js_files:
    if '.map' not in js_file and '.LICENSE' not in js_file and 'node_modules' not in js_file:
        try:
            with open(js_file, 'r') as f:
                content = f.read()
            match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content)
            if match:
                print(f"{js_file}: {match.group(1)}")
        except:
            pass

# Also check the HTML files that might have inline JS
html_files = glob.glob('*.html')
for html_file in html_files:
    try:
        with open(html_file, 'r') as f:
            content = f.read()
        if 'Baritone' in content or 'D4 G4 B4 E5' in content:
            match = re.search(r'D4 G4 B4 E5[^}]+freq:\s*\[([^\]]+)\]', content)
            if match:
                print(f"{html_file}: {match.group(1)}")
            else:
                print(f"{html_file}: Baritone mentioned but no freq array found")
    except:
        pass

