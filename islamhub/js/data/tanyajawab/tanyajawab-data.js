/**
 * Tanya Jawab Islam — Knowledge Base & Configuration
 * ===================================================
 * Contains system prompt, example questions, and curated Q&A dataset.
 */

// ── System Prompt (ported from prototype, enhanced for client-side) ──
export const SYSTEM_PROMPT = `Antum adalah asisten IslamHub yang membantu menjawab pertanyaan seputar Islam berdasarkan Al-Qur'an, Hadits Shahih, dan pendapat ulama salafush shalih.

PRINSIP PENTING:
1. WAJIB menjawab berdasarkan Al-Qur'an, Hadits Shahih, dan pendapat ulama yang terpercaya
2. DILARANG mengarang atau berfatwa tanpa dalil
3. Jika tidak yakin dengan jawaban, katakan: "Afwan (maaf), ana tidak menemukan dalil yang cukup untuk menjawab pertanyaan ini. Silakan bertanya kepada ulama yang amanah."
4. WAJIB menyebutkan sumber: ayat Al-Qur'an, hadits, atau perkataan ulama
5. Jika ada ikhtilaf (perbedaan pendapat), sebutkan pendapat yang terkuat dengan dalilnya
6. Gunakan bahasa yang santun dan mudah dipahami
7. Utamakan pendapat ulama salaf dan ulama yang mengikuti manhaj salaf seperti: Syaikh Ibn Baz, Syaikh Ibn Utsaimin, Syaikh Al-Albani, Syaikh Shalih Al-Fauzan, dan Lajnah Da'imah

GAYA BAHASA:
- Sapaan: antum/anta, anti, ikhwan/akhawat
- Istilah: insya Allah, maa syaa Allah, baarakallahu fiikum
- Akhiri jawaban dengan: wallahu a'lam (dan Allah yang lebih mengetahui)
- Gunakan: afwan (maaf), na'am (ya), laa (tidak)

FORMAT JAWABAN:
1. Penjelasan singkat dan jelas tentang hukum/jawaban
2. Dalil dari Al-Qur'an dan/atau Hadits
3. Pendapat ulama (sebutkan nama ulama dan kitabnya jika memungkinkan)
4. Penutup: wallahu a'lam

BATASAN:
- Jawab HANYA pertanyaan seputar Islam (aqidah, fiqh, akhlaq, sirah, tafsir, hadits)
- Jika pertanyaan di luar topik Islam, sampaikan dengan sopan bahwa antum hanya bisa menjawab pertanyaan seputar Islam
- Jangan memberikan fatwa tentang hal-hal yang sangat spesifik dan memerlukan penelaahan mendalam oleh ulama (contoh: kasus waris yang sangat kompleks, masalah pernikahan yang rumit)`;

// ── Example Questions (shown on welcome screen) ──
export const EXAMPLE_QUESTIONS = [
    {
        text: 'Bagaimana tata cara wudhu yang benar?',
        icon: 'fa-hand-holding-droplet',
        category: 'fiqh'
    },
    {
        text: 'Apa hukum sholat berjamaah bagi laki-laki?',
        icon: 'fa-mosque',
        category: 'fiqh'
    },
    {
        text: 'Bagaimana cara bertaubat yang benar?',
        icon: 'fa-heart',
        category: 'akhlaq'
    },
    {
        text: 'Apa saja rukun Islam dan rukun iman?',
        icon: 'fa-star-and-crescent',
        category: 'aqidah'
    },
    {
        text: 'Apa hukum membaca Al-Quran tanpa wudhu?',
        icon: 'fa-book-quran',
        category: 'fiqh'
    },
    {
        text: 'Bagaimana hukum musik dalam Islam?',
        icon: 'fa-music',
        category: 'fiqh'
    }
];

// ── Model Options (for settings panel) ──
export const MODEL_OPTIONS = [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Recommended)', provider: 'groq' },
    { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', provider: 'groq' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Faster)', provider: 'groq' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider: 'groq' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', provider: 'groq' },
];

// ── Default Configuration ──
export const DEFAULT_CONFIG = {
    provider: 'groq',       // 'groq' or 'local'
    groqApiKey: '',
    groqModel: 'llama-3.3-70b-versatile',
    localUrl: 'http://localhost:11434', // Ollama default
    localModel: 'qwen2.5:7b-instruct',
    maxTokens: 1024,
    temperature: 0.3,
    maxHistory: 6,           // Keep last N messages for context
    maxHistoryChars: 800,    // Truncate each history message
};

// ── Curated Knowledge Base (compact reference data) ──
export const KNOWLEDGE_BASE = [
    {
        id: 'wudhu_tata_cara',
        keywords: ['wudhu', 'wudlu', 'wudu', 'berwudhu', 'tata cara wudhu', 'cara wudhu'],
        question: 'Bagaimana tata cara wudhu yang benar?',
        summary: 'Wudhu memiliki 6 rukun menurut jumhur ulama: (1) Niat, (2) Membasuh wajah, (3) Membasuh kedua tangan sampai siku, (4) Mengusap kepala, (5) Membasuh kedua kaki sampai mata kaki, (6) Tertib. Dalil: QS. Al-Maidah: 6. Sunnah wudhu antara lain: membaca bismillah, bersiwak, membasuh telapak tangan, berkumur, menghirup air ke hidung, mendahulukan anggota kanan, membasuh tiga kali, dan berdoa setelahnya.',
        source: 'QS. Al-Maidah: 6, HR. Muslim no. 226'
    },
    {
        id: 'sholat_berjamaah',
        keywords: ['sholat berjamaah', 'jamaah', 'berjamaah', 'sholat bersama'],
        question: 'Apa hukum sholat berjamaah bagi laki-laki?',
        summary: 'Mayoritas ulama berpendapat sholat berjamaah wajib ain bagi laki-laki yang mampu. Dalil: "Sungguh aku ingin menyuruh seseorang untuk mengimami sholat, lalu aku keluar menuju orang-orang yang tidak menghadiri sholat (berjamaah) lalu aku bakar rumah-rumah mereka." (HR. Bukhari 644, Muslim 651). Syaikh Ibn Utsaimin dan Syaikh Ibn Baz rahimahumallah berpendapat wajib ain.',
        source: 'HR. Bukhari no. 644, HR. Muslim no. 651'
    },
    {
        id: 'taubat',
        keywords: ['taubat', 'tobat', 'bertaubat', 'bertobat', 'ampunan', 'istighfar', 'minta ampun'],
        question: 'Bagaimana cara bertaubat yang benar?',
        summary: 'Syarat taubat yang diterima menurut Imam An-Nawawi: (1) Menyesali perbuatan dosa, (2) Meninggalkan dosa tersebut saat itu juga, (3) Bertekad kuat untuk tidak mengulanginya. Jika dosa berkaitan dengan hak manusia, ditambah syarat ke-4: mengembalikan hak tersebut atau meminta maaf. Dalil: "Bertaubatlah kepada Allah wahai orang-orang beriman agar kalian beruntung" (QS. An-Nur: 31). Allah berfirman: "Sesungguhnya Allah menyukai orang-orang yang bertaubat" (QS. Al-Baqarah: 222).',
        source: 'QS. An-Nur: 31, QS. Al-Baqarah: 222'
    },
    {
        id: 'rukun_islam_iman',
        keywords: ['rukun islam', 'rukun iman', '5 rukun', '6 rukun', 'pilar islam'],
        question: 'Apa saja rukun Islam dan rukun iman?',
        summary: 'Rukun Islam ada 5: (1) Syahadat, (2) Sholat, (3) Zakat, (4) Puasa Ramadhan, (5) Haji. Dalil: HR. Bukhari 8, Muslim 16. Rukun Iman ada 6: (1) Iman kepada Allah, (2) Malaikat-Nya, (3) Kitab-kitab-Nya, (4) Rasul-rasul-Nya, (5) Hari Akhir, (6) Qadar baik dan buruk. Dalil: HR. Muslim 8 (Hadits Jibril).',
        source: 'HR. Bukhari no. 8, HR. Muslim no. 16, HR. Muslim no. 8'
    },
    {
        id: 'quran_tanpa_wudhu',
        keywords: ['quran tanpa wudhu', 'baca quran', 'pegang mushaf', 'tanpa wudhu', 'hadas'],
        question: 'Apa hukum membaca Al-Quran tanpa wudhu?',
        summary: 'Membaca Al-Quran tanpa wudhu (dengan hafalan atau dari HP) diperbolehkan menurut jumhur ulama. Namun menyentuh mushaf Al-Quran tanpa wudhu hukumnya haram menurut mayoritas ulama (Hanafi, Maliki, Syafii, Hanbali). Dalil: "Tidak boleh menyentuh Al-Quran kecuali orang yang dalam keadaan suci" (HR. Malik dalam Al-Muwaththa, hadits marfu dari Amr bin Hazm). Syaikh Ibn Baz rahimahullah memfatwakan tidak boleh menyentuh mushaf tanpa wudhu.',
        source: 'QS. Al-Waqiah: 79, HR. Malik (Al-Muwaththa)'
    },
    {
        id: 'hukum_musik',
        keywords: ['musik', 'nyanyian', 'lagu', 'alat musik', 'nasyid'],
        question: 'Bagaimana hukum musik dalam Islam?',
        summary: 'Jumhur ulama mengharamkan alat-alat musik kecuali duff (rebana) untuk wanita di hari raya dan pernikahan. Dalil: "Sungguh akan ada dari umatku kaum-kaum yang menghalalkan zina, sutera, khamr, dan alat musik" (HR. Bukhari 5590). Ibnu Abbas, Ibnu Mas\'ud, dan mayoritas sahabat mengharamkannya. Syaikh Al-Albani, Ibn Baz, dan Ibn Utsaimin rahimahumullah sepakat mengharamkan musik. Adapun nasyid tanpa alat musik, ulama berbeda pendapat, yang rajih diperbolehkan dengan syarat kontennya baik.',
        source: 'HR. Bukhari no. 5590'
    },
    {
        id: 'sholat_tahajud',
        keywords: ['tahajud', 'qiyamul lail', 'sholat malam', 'witir'],
        question: 'Bagaimana cara sholat tahajud?',
        summary: 'Sholat tahajud adalah sholat sunnah yang dilakukan setelah tidur di malam hari. Waktu terbaik adalah sepertiga malam terakhir. Jumlah rakaat paling utama adalah 11 rakaat (salam setiap 2 rakaat, ditutup 1 rakaat witir) sebagaimana sholat Nabi ﷺ. Boleh juga 2, 4, 6, 8 rakaat ditambah witir. Dalil: "Sholat malam itu dua-dua (rakaat). Apabila salah seorang di antara kalian khawatir masuk waktu subuh, maka sholatlah satu rakaat sebagai witir" (HR. Bukhari 990, Muslim 749).',
        source: 'HR. Bukhari no. 990, HR. Muslim no. 749'
    },
    {
        id: 'puasa_sunnah',
        keywords: ['puasa sunnah', 'puasa senin kamis', 'puasa ayyamul bidh', 'puasa daud'],
        question: 'Apa saja puasa sunnah yang dianjurkan?',
        summary: 'Puasa sunnah yang dianjurkan: (1) Puasa Senin & Kamis - "Amal-amal dihadapkan pada hari Senin dan Kamis" (HR. Tirmidzi 747). (2) Puasa Ayyamul Bidh (13, 14, 15 setiap bulan Hijriyah). (3) Puasa 6 hari di bulan Syawwal. (4) Puasa hari Arafah (9 Dzulhijjah) bagi yang tidak berhaji. (5) Puasa Asyura (10 Muharram) ditambah 1 hari sebelumnya. (6) Puasa Daud (selang-seling) - puasa paling utama.',
        source: 'HR. Tirmidzi no. 747, HR. Muslim no. 1162'
    },
    {
        id: 'riba',
        keywords: ['riba', 'bunga bank', 'bank konvensional', 'kredit', 'pinjaman bunga'],
        question: 'Apa hukum riba dalam Islam?',
        summary: 'Riba hukumnya HARAM secara mutlak berdasarkan Al-Quran, Sunnah, dan ijma ulama. "Allah menghalalkan jual beli dan mengharamkan riba" (QS. Al-Baqarah: 275). Nabi ﷺ melaknat pemakan riba, pemberi makan riba, penulisnya, dan dua saksinya (HR. Muslim 1598). Bunga bank konvensional termasuk riba menurut fatwa Lajnah Da\'imah, Syaikh Ibn Baz, dan Majma\' Al-Fiqh Al-Islami. Alternatifnya adalah bank syariah dengan akad yang sesuai syariat.',
        source: 'QS. Al-Baqarah: 275-279, HR. Muslim no. 1598'
    },
    {
        id: 'bid_ah',
        keywords: ['bidah', 'bid\'ah', 'amalan baru', 'perkara baru', 'tradisi agama'],
        question: 'Apa itu bid\'ah dalam Islam?',
        summary: 'Bid\'ah adalah segala perkara baru dalam agama yang tidak ada contohnya dari Nabi ﷺ dan para sahabat. Nabi ﷺ bersabda: "Setiap perkara yang diada-adakan (dalam agama) adalah bid\'ah, dan setiap bid\'ah adalah kesesatan" (HR. Muslim 867). Bid\'ah berbeda dengan maslahat mursalah atau ijtihad ulama dalam perkara yang ada dasarnya. Contoh bid\'ah: merayakan maulid Nabi, tahlilan, dzikir berjamaah setelah sholat dengan cara tertentu yang tidak ada dalilnya. Syaikh Al-Islam Ibn Taimiyah menjelaskan bahwa semua bid\'ah dalam ibadah adalah tercela.',
        source: 'HR. Muslim no. 867, HR. Bukhari no. 2697'
    },
    {
        id: 'hijab_wanita',
        keywords: ['hijab', 'jilbab', 'cadar', 'niqab', 'aurat wanita', 'menutup aurat'],
        question: 'Bagaimana hukum hijab bagi wanita muslimah?',
        summary: 'Menutup aurat dengan hijab wajib bagi wanita muslimah berdasarkan dalil yang tegas. "Wahai Nabi, katakanlah kepada istri-istrimu, anak-anak perempuanmu, dan istri-istri orang beriman hendaklah mereka mengulurkan jilbabnya ke seluruh tubuh mereka" (QS. Al-Ahzab: 59). Syarat hijab syar\'i: (1) Menutup seluruh tubuh kecuali wajah dan telapak tangan (menurut jumhur), (2) Tidak ketat/membentuk lekuk tubuh, (3) Tidak transparan, (4) Tidak menyerupai pakaian laki-laki, (5) Tidak menyerupai pakaian orang kafir, (6) Bukan pakaian untuk bermegah-megahan. Adapun cadar/niqab, Syaikh Ibn Baz dan Ibn Utsaimin rahimahumallah mengatakan wajib, sementara ulama lain mengatakan sunnah muakkadah.',
        source: 'QS. Al-Ahzab: 59, QS. An-Nur: 31'
    },
    {
        id: 'tauhid_jenis',
        keywords: ['tauhid', 'jenis tauhid', 'rububiyah', 'uluhiyah', 'asma wa sifat'],
        question: 'Apa saja jenis-jenis tauhid?',
        summary: 'Tauhid terbagi menjadi 3 jenis menurut ulama Ahlus Sunnah: (1) Tauhid Rububiyah - mengesakan Allah dalam perbuatan-Nya (mencipta, memberi rezeki, mengatur alam semesta). (2) Tauhid Uluhiyah/Ibadah - mengesakan Allah dalam ibadah (doa, sholat, kurban, nadzar hanya untuk Allah). Ini yang menjadi inti dakwah para rasul. (3) Tauhid Asma wa Sifat - menetapkan nama-nama dan sifat-sifat Allah sebagaimana yang Allah tetapkan untuk diri-Nya dan yang ditetapkan Rasul-Nya, tanpa tahrif (mengubah), ta\'thil (meniadakan), takyif (menanyakan bagaimana), dan tamtsil (menyerupakan dengan makhluk).',
        source: 'Kitab Tauhid - Syaikh Muhammad bin Abdul Wahhab'
    },
    {
        id: 'doa_mustajab',
        keywords: ['doa', 'berdoa', 'waktu mustajab', 'doa dikabulkan', 'adab doa'],
        question: 'Kapan waktu-waktu mustajab untuk berdoa?',
        summary: 'Waktu-waktu mustajab untuk berdoa: (1) Sepertiga malam terakhir - "Rabb kita turun ke langit dunia setiap malam di sepertiga malam terakhir" (HR. Bukhari 1145). (2) Antara adzan dan iqamah (HR. Abu Dawud 521). (3) Saat sujud - "Kondisi terdekat seorang hamba dengan Rabbnya adalah saat sujud, maka perbanyaklah doa" (HR. Muslim 482). (4) Hari Jumat, ada satu saat yang tidak seorang muslim pun berdoa kecuali dikabulkan (HR. Bukhari 935). (5) Saat turun hujan. (6) Saat berbuka puasa. (7) Doa musafir. (8) Doa orang yang dizalimi.',
        source: 'HR. Bukhari no. 1145, HR. Muslim no. 482'
    },
    {
        id: 'sholat_jenazah',
        keywords: ['jenazah', 'sholat jenazah', 'memandikan', 'mengkafani', 'menguburkan'],
        question: 'Bagaimana tata cara mengurus jenazah?',
        summary: 'Kewajiban terhadap jenazah muslim ada 4 (fardhu kifayah): (1) Memandikan - dimulai dengan bagian kanan dan anggota wudhu, menggunakan air dan daun bidara, minimal sekali, dianjurkan ganjil (3, 5, 7 kali). (2) Mengkafani - dengan kain putih, untuk laki-laki 3 lapis, untuk perempuan 5 bagian. (3) Mensholatkan - 4 takbir: takbir 1 baca Al-Fatihah, takbir 2 baca sholawat, takbir 3 baca doa untuk mayit, takbir 4 baca doa lalu salam. (4) Menguburkan - menghadap kiblat di liang lahat.',
        source: 'HR. Bukhari no. 1253, HR. Muslim no. 939'
    },
    {
        id: 'zakat_mal',
        keywords: ['zakat mal', 'zakat harta', 'nisab', 'haul', 'zakat emas'],
        question: 'Bagaimana ketentuan zakat mal?',
        summary: 'Zakat mal wajib dikeluarkan jika memenuhi syarat: (1) Milik penuh, (2) Mencapai nisab - untuk emas: 85 gram, untuk perak: 595 gram, untuk uang: setara nisab emas/perak, (3) Berlalu haul (1 tahun hijriyah), (4) Harta berkembang. Kadar zakat: 2,5% dari total harta yang mencapai nisab. Dalil: "Ambillah zakat dari harta mereka, yang membersihkan dan menyucikan mereka" (QS. At-Taubah: 103). 8 golongan penerima zakat disebutkan dalam QS. At-Taubah: 60.',
        source: 'QS. At-Taubah: 103, QS. At-Taubah: 60'
    }
];

/**
 * Search the knowledge base for relevant references.
 * Uses simple keyword matching similar to the prototype's fallback search.
 *
 * @param {string} query - User's question
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Array} Matching knowledge base entries
 */
export function searchKnowledgeBase(query, maxResults = 5) {
    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/).filter(w => w.length > 2);

    const scored = KNOWLEDGE_BASE.map(entry => {
        let score = 0;

        // Exact phrase match in keywords
        for (const kw of entry.keywords) {
            if (q.includes(kw)) score += 10;
        }

        // Individual word matches in keywords
        for (const word of words) {
            for (const kw of entry.keywords) {
                if (kw.includes(word)) score += 3;
            }
        }

        // Word matches in question
        for (const word of words) {
            if (entry.question.toLowerCase().includes(word)) score += 2;
        }

        // Word matches in summary
        for (const word of words) {
            if (entry.summary.toLowerCase().includes(word)) score += 1;
        }

        return { ...entry, score };
    });

    return scored
        .filter(e => e.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults);
}
