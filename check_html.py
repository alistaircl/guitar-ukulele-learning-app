with open('homepage.html', 'r') as f:
    content = f.read()
idx = content.find('D4 G4 B4 E5')
if idx != -1:
    print("homepage.html:", content[idx:idx+200])
else:
    print("Not found in homepage.html")

with open('tab_tuner.html', 'r') as f:
    content = f.read()
idx = content.find('D4 G4 B4 E5')
if idx != -1:
    print("tab_tuner.html:", content[idx:idx+200])
else:
    print("Not found in tab_tuner.html")
