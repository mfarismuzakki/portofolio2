import urllib.request
import json
import os
import re

url = "https://api.hadith.gading.dev/books/bukhari?range=1-250"
output_file = os.path.join(os.path.dirname(__file__), 'islamhub', 'js', 'data', 'hadits', 'hadits-extra.js')

print(f"Fetching hadiths from {url}...")
try:
    req = urllib.request.urlopen(url)
    data = json.loads(req.read().decode('utf-8'))
    
    hadiths = data.get('data', {}).get('hadiths', [])
    print(f"Fetched {len(hadiths)} hadiths.")
    
    extra_content = []
    
    for i, h in enumerate(hadiths):
        # Determine category based on index
        if i < 50:
            cat = 'aqidah'
        elif i < 100:
            cat = 'ibadah'
        elif i < 150:
            cat = 'ilmu'
        elif i < 200:
            cat = 'akhlak'
        else:
            cat = 'doa'
            
        # Try to extract a short title from the translation
        translation = h['id']
        words = translation.split(' ')
        title_words = [w for w in words[10:20] if len(w) > 3] # skip "Telah menceritakan kepada kami..."
        title = " ".join(title_words[:3]).title().replace('"', '').replace("'", "")
        if not title:
            title = f"Hadits Bukhari {h['number']}"
            
        arab = h['arab'].replace('\n', ' ').replace("'", "\\'")
        trans_clean = translation.replace('\n', ' ').replace("'", "\\'")
        
        extra_content.append(f"""    {{
        id: 'bukhari_{h['number']}',
        category: '{cat}',
        title: '{title} (Bukhari {h['number']})',
        arabic: '{arab}',
        latin: '',
        translation: '{trans_clean}',
        source: 'HR. Bukhari no. {h['number']}',
        narrator: 'Shahabat Nabi',
        faidah: 'Hadits shahih riwayat Imam Bukhari.'
    }}""")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("export const EXTRA_HADITS = [\n")
        f.write(",\n".join(extra_content))
        f.write("\n];\n")
        
    print(f"Successfully generated {output_file}")
    
except Exception as e:
    print(f"Error: {e}")
