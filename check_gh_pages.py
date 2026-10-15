import subprocess
result = subprocess.run(['git', 'show', 'gh-pages:static/js/main.d7f01dc5.js'], capture_output=True, text=True)
content = result.stdout
idx = content.find('D4 G4 B4 E5')
if idx != -1:
    print(content[idx:idx+200])
else:
    print('Not found')
