import os
import json

base_dir = os.path.dirname(os.path.abspath(__file__))
pages_dir = os.path.join(base_dir, 'islamhub', 'js', 'data', 'alquran', 'pages')
output_file = os.path.join(base_dir, 'islamhub', 'js', 'data', 'alquran', 'quran-search-index.js')

search_index = []

for i in range(1, 605):
    page_num = str(i).zfill(3)
    file_path = os.path.join(pages_dir, f'Page{page_num}.json')
    
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                if 'surahs' in data:
                    for surah in data['surahs']:
                        if 'verses' in surah:
                            for verse in surah['verses']:
                                search_index.append([
                                    surah['number'],
                                    verse['number'],
                                    verse.get('translation', ''),
                                    verse.get('arabic', ''),
                                    data['pageNumber']
                                ])
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")

js_content = f"// Auto-generated search index for IslamHub\nwindow.QURAN_SEARCH_INDEX = {json.dumps(search_index, ensure_ascii=False)};\n"

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Generated search index at {output_file}. Total verses: {len(search_index)}")
