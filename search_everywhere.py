import subprocess
import re
import glob

# Search ALL files in the repo for Baritone with 196 Hz
all_files = glob.glob('**/*', recursive=True)
for f in all_files:
    if '.git' in f or 'node_modules' in f or '.pyc' in f:
        continue
    try:
        with open(f, 'r') as file:
            content = file.read()
        if 'Baritone' in content and '196' in content:
            # Check if they appear near each other
            idx1 = content.find('Baritone')
            idx2 = content.find('196')
            if abs(idx1 - idx2) < 200:
                print(f"{f}: Baritone and 196 close together")
                print(f"  ...{content[max(0,idx1-50):idx1+200]}...")
    except:
        pass

