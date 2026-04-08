import re
import os

# Read the original file
with open('C:/Users/DELL/Desktop/youtube/linkdin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Create directories
os.makedirs('C:/Users/DELL/Desktop/youtube/css', exist_ok=True)
os.makedirs('C:/Users/DELL/Desktop/youtube/js', exist_ok=True)
os.makedirs('C:/Users/DELL/Desktop/youtube/assets', exist_ok=True)

# Extract CSS (everything between <style> and </style>)
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if style_match:
    css_content = style_match.group(1)
    with open('C:/Users/DELL/Desktop/youtube/css/style.css', 'w', encoding='utf-8') as f:
        f.write(css_content)
    print("✓ css/style.css created")

# Extract all JavaScript (everything between <script> and </script>)
script_matches = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)
if script_matches:
    js_content = '\n\n'.join(script_matches)
    with open('C:/Users/DELL/Desktop/youtube/js/app.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    print("✓ js/app.js created")

# Create new HTML file
# Extract everything before <style>
head_match = re.search(r'(<head>.*?)(<style>.*?</style>)', content, re.DOTALL)
if head_match:
    head_content = head_match.group(1)
else:
    head_content = '<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>LinkedIn</title>\n'

# Extract body content
body_match = re.search(r'<body>(.*?)</body>', content, re.DOTALL)
if body_match:
    body_content = body_match.group(1)
    # Remove inline scripts from body
    body_content = re.sub(r'<script>.*?</script>', '', body_content, flags=re.DOTALL)

new_html = f'''<!DOCTYPE html>
<html lang="en">
{head_content.strip()}
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
{body_content}
    <script src="js/app.js"></script>
</body>
</html>'''

with open('C:/Users/DELL/Desktop/youtube/index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
print("✓ index.html created")

# Backup original file
os.rename('C:/Users/DELL/Desktop/youtube/linkdin.html', 
          'C:/Users/DELL/Desktop/youtube/linkdin_backup.html')
print("✓ Original file backed up as linkdin_backup.html")

print("\n" + "="*50)
print("FOLDER STRUCTURE CREATED:")
print("="*50)
print("youtube/")
print("├── index.html          (Main HTML file)")
print("├── css/")
print("│   └── style.css       (All styles)")
print("├── js/")
print("│   └── app.js          (All JavaScript)")
print("├── assets/             (For images/files)")
print("├── FIREBASE_SETUP.md   (Setup guide)")
print("└── linkdin_backup.html (Original backup)")
print("="*50)
