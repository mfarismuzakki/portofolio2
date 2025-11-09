/* ===== Al-Quran Verses Sample Data ===== */
// Data ayat per halaman dalam format: page_X: [{surah, verse}, ...]
// Struktur disesuaikan untuk audio per halaman

const SAMPLE_VERSES = {
    // Convert old format to new format for audio playback
    page_1: [
        {surah: 1, verse: 1},
        {surah: 1, verse: 2},
        {surah: 1, verse: 3},
        {surah: 1, verse: 4},
        {surah: 1, verse: 5},
        {surah: 1, verse: 6},
        {surah: 1, verse: 7}
    ],
    page_2: [
        {surah: 2, verse: 1},
        {surah: 2, verse: 2},
        {surah: 2, verse: 3},
        {surah: 2, verse: 4},
        {surah: 2, verse: 5}
    ],
    // Old format kept for backward compatibility
    1: {
        // Halaman 1 - Al-Fatihah
        verses: [
            {
                surah: 1,
                verse: 1,
                arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
                transliteration: "Bismillahir rahmanir raheem",
                translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang"
            },
            {
                surah: 1,
                verse: 2,
                arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
                transliteration: "Alhamdu lillahi rabbil 'alameen",
                translation: "Segala puji bagi Allah, Tuhan seluruh alam"
            },
            {
                surah: 1,
                verse: 3,
                arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
                transliteration: "Ar rahmanir raheem",
                translation: "Yang Maha Pengasih, Maha Penyayang"
            },
            {
                surah: 1,
                verse: 4,
                arabic: "مَالِكِ يَوْمِ الدِّينِ",
                transliteration: "Maliki yawmid deen",
                translation: "Pemilik hari pembalasan"
            },
            {
                surah: 1,
                verse: 5,
                arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
                transliteration: "Iyyaka na'budu wa iyyaka nasta'een",
                translation: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan"
            },
            {
                surah: 1,
                verse: 6,
                arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
                transliteration: "Ihdinash shiratal mustaqeem",
                translation: "Tunjukilah kami jalan yang lurus"
            },
            {
                surah: 1,
                verse: 7,
                arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
                transliteration: "Shirathal ladzeena an'amta 'alaihim ghairil maghdubi 'alaihim waladhdhaaleen",
                translation: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat"
            }
        ]
    },
    2: {
        // Halaman 2 - Awal Al-Baqarah
        verses: [
            {
                surah: 2,
                verse: 1,
                arabic: "الم",
                transliteration: "Alif Lam Meem",
                translation: "Alif Laam Miim"
            },
            {
                surah: 2,
                verse: 2,
                arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
                transliteration: "Dzalikal kitabu la raiba feeh, hudan lil muttaqeen",
                translation: "Kitab (Al-Qur'an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertaqwa"
            }
            // ... ayat selanjutnya
        ]
    }
    // Data ayat untuk halaman lainnya akan ditambahkan sesuai kebutuhan
};

// Function untuk mengambil ayat berdasarkan halaman
function getVersesByPage(page) {
    return SAMPLE_VERSES[page] || {
        verses: [],
        note: "Data ayat untuk halaman ini belum tersedia. Implementasi lengkap memerlukan integrasi dengan database atau API Al-Qur'an."
    };
}

// Function untuk mencari ayat berdasarkan surat dan ayat
function getVerseByReference(surah, verse) {
    for (let page in SAMPLE_VERSES) {
        const verses = SAMPLE_VERSES[page].verses;
        const found = verses.find(v => v.surah === surah && v.verse === verse);
        if (found) {
            return { ...found, page: parseInt(page) };
        }
    }
    return null;
}

// Function untuk memuat data surat dari file JSON
async function loadSurahData(surahNumber) {
    try {
        const paddedNumber = String(surahNumber).padStart(3, '0');
        const response = await fetch(`js/data/alquran/surahs/${paddedNumber}-*.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to load surah ${surahNumber}`);
        }
        
        const surahData = await response.json();
        return surahData;
    } catch (error) {
        console.error('Error loading surah data:', error);
        return null;
    }
}

// Function untuk memuat data surat berdasarkan nama file
async function loadSurahByFileName(fileName) {
    try {
        const response = await fetch(`js/data/alquran/surahs/${fileName}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load surah from ${fileName}`);
        }
        
        const surahData = await response.json();
        return surahData;
    } catch (error) {
        console.error('Error loading surah data:', error);
        return null;
    }
}

// Cache untuk data surat yang sudah dimuat
const SURAH_CACHE = {};

// Function untuk mendapatkan ayat dari surat (dengan cache)
async function getVersesBySurah(surahNumber) {
    // Cek cache terlebih dahulu
    if (SURAH_CACHE[surahNumber]) {
        return SURAH_CACHE[surahNumber];
    }
    
    // Load data surat
    const surahData = await loadSurahByFileName(`${String(surahNumber).padStart(3, '0')}-al-fatihah.json`);
    
    if (surahData) {
        SURAH_CACHE[surahNumber] = surahData;
        return surahData;
    }
    
    return null;
}

// Export untuk Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SAMPLE_VERSES,
        getVersesByPage,
        getVerseByReference,
        loadSurahData,
        loadSurahByFileName,
        getVersesBySurah,
        SURAH_CACHE
    };
}

// Export ke window untuk browser
if (typeof window !== 'undefined') {
    window.QURAN_VERSES = SAMPLE_VERSES;
    window.getVersesByPage = getVersesByPage;
    window.getVerseByReference = getVerseByReference;
    window.loadSurahData = loadSurahData;
    window.loadSurahByFileName = loadSurahByFileName;
    window.getVersesBySurah = getVersesBySurah;
    window.SURAH_CACHE = SURAH_CACHE;
}