with open('static/js/main.30fddd60.js', 'r') as f:
    content = f.read()
idx = content.index('D4 G4 B4 E5')
print(content[idx:idx+200])
