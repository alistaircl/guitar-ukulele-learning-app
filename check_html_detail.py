import re

for html_file in ['tab_tuner.html', 'homepage.html']:
    with open(html_file, 'r') as f:
        content = f.read()
    
    # Search for Baritone
    matches = list(re.finditer(r'Baritone', content))
    for m in matches:
        start = max(0, m.start() - 50)
        end = min(len(content), m.end() + 200)
        print(f"{html_file} Baritone at {m.start()}: ...{content[start:end]}...")
        print("---")

