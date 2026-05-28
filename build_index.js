const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'islamhub', 'js', 'data', 'alquran', 'pages');
const outputFile = path.join(__dirname, 'islamhub', 'js', 'data', 'alquran', 'quran-search-index.js');

let searchIndex = [];

for (let i = 1; i <= 604; i++) {
    const pageNum = String(i).padStart(3, '0');
    const filePath = path.join(pagesDir, `Page${pageNum}.json`);
    
    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (data.surahs) {
                for (let s = 0; s < data.surahs.length; s++) {
                    const surah = data.surahs[s];
                    if (surah.verses) {
                        for (let v = 0; v < surah.verses.length; v++) {
                            const verse = surah.verses[v];
                            // Array format to save space:
                            // [surah_num, verse_num, arabic, translation]
                            // Also need page number so clicking takes us to the page!
                            searchIndex.push([
                                surah.number,
                                verse.number,
                                verse.translation,
                                verse.arabic,
                                data.pageNumber
                            ]);
                        }
                    }
                }
            }
        } catch (e) {
            console.error(`Error parsing ${filePath}: ${e.message}`);
        }
    }
}

const jsContent = `// Auto-generated search index for IslamHub
window.QURAN_SEARCH_INDEX = ${JSON.stringify(searchIndex)};
`;

fs.writeFileSync(outputFile, jsContent, 'utf8');
console.log(`Generated search index at ${outputFile}. Total verses: ${searchIndex.length}`);
