// Database Bacaan Sholat berdasarkan Al-Qur'an dan Hadits Shahih
// Sumber: Sifat Sholat Nabi (Syaikh Al-Albani), Zad al-Ma'ad

window.bacaanSholat = [
    // ===== BACAAN WAJIB =====
    {
        id: 'fatihah',
        name: 'Surat Al-Fatihah',
        category: 'bacaan',
        type: 'wajib',
        icon: '📖',
        position: 'Setiap rakaat setelah takbiratul ihram',
        arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
الرَّحْمَٰنِ الرَّحِيمِ
مَالِكِ يَوْمِ الدِّينِ
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ`,
        latin: `Bismillahir rahmanir rahim
Alhamdulillahi rabbil 'alamin
Ar-rahmanir rahim
Maliki yaumiddin
Iyyaka na'budu wa iyyaka nasta'in
Ihdinash shiratal mustaqim
Shiratalladzina an'amta 'alaihim ghairil maghdubi 'alaihim wa ladh dhallin`,
        translation: `Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang
Segala puji bagi Allah, Tuhan semesta alam
Yang Maha Pengasih lagi Maha Penyayang
Yang menguasai hari pembalasan
Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami meminta pertolongan
Tunjukilah kami jalan yang lurus
Yaitu jalan orang-orang yang telah Engkau beri nikmat, bukan jalan mereka yang dimurkai dan bukan pula jalan mereka yang sesat`,
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 756, Muslim 394',
                arabic: 'لَا صَلَاةَ لِمَنْ لَمْ يَقْرَأْ بِفَاتِحَةِ الْكِتَابِ',
                translation: 'Tidak sah sholat bagi orang yang tidak membaca Fatihatul Kitab'
            }
        ],
        tips: 'Baca dengan tartil, jelas setiap huruf. Dianjurkan membaca "Amin" setelah selesai',
        commonMistakes: 'Jangan membaca terlalu cepat atau meninggalkan sebagian ayat'
    },
    {
        id: 'tasyahud_awal',
        name: 'Tasyahud Awal',
        category: 'bacaan',
        type: 'wajib',
        icon: '📿',
        position: 'Duduk pada akhir rakaat kedua (sholat 3-4 rakaat)',
        arabic: `التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ`,
        latin: `Attahiyyatu lillahi wash shalawatu wath thayyibat. Assalamu 'alaika ayyuhan nabiyyu wa rahmatullahi wa barakatuh. Assalamu 'alaina wa 'ala 'ibadillahish shalihin. Asyhadu alla ilaha illallahu wa asyhadu anna Muhammadan 'abduhu wa rasuluh`,
        translation: `Segala penghormatan, sholat dan kebaikan hanya milik Allah. Keselamatan semoga terlimpah kepadamu wahai Nabi, demikian pula rahmat Allah dan berkah-Nya. Keselamatan semoga terlimpah kepada kami dan kepada hamba-hamba Allah yang shalih. Aku bersaksi bahwa tidak ada Tuhan yang berhak disembah kecuali Allah, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya`,
        ruling: 'Wajib',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 6230, Muslim 403',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ يُعَلِّمُنَا التَّشَهُّدَ',
                translation: 'Rasulullah ﷺ mengajarkan kepada kami tasyahud'
            }
        ],
        tips: 'Gerakkan telunjuk tangan kanan ketika menyebut "illa Allah"',
        commonMistakes: 'Jangan melupakan tasyahud awal dalam sholat 3-4 rakaat'
    },
    {
        id: 'tasyahud_akhir',
        name: 'Tasyahud Akhir dan Sholawat',
        category: 'bacaan',
        type: 'wajib',
        icon: '💚',
        position: 'Duduk akhir sebelum salam',
        arabic: `التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ

اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ`,
        latin: `Attahiyyatu lillahi... (tasyahud seperti di atas)

Allahumma shalli 'ala Muhammad wa 'ala ali Muhammad kama shallaita 'ala Ibrahim wa 'ala ali Ibrahim innaka hamidum majid. Allahumma barik 'ala Muhammad wa 'ala ali Muhammad kama barakta 'ala Ibrahim wa 'ala ali Ibrahim innaka hamidum majid`,
        translation: `(Tasyahud sama seperti di atas)

Ya Allah, limpahkanlah sholawat kepada Muhammad dan keluarga Muhammad sebagaimana Engkau telah melimpahkan sholawat kepada Ibrahim dan keluarga Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Agung. Ya Allah, limpahkanlah berkah kepada Muhammad dan keluarga Muhammad sebagaimana Engkau telah melimpahkan berkah kepada Ibrahim dan keluarga Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Agung`,
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 6357, Muslim 406',
                arabic: 'قُولُوا: اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ...',
                translation: 'Ucapkanlah: Ya Allah, limpahkanlah sholawat kepada Muhammad...'
            }
        ],
        tips: 'Sholawat dalam tasyahud akhir adalah rukun, tidak boleh ditinggalkan',
        commonMistakes: 'Jangan meninggalkan sholawat dalam tasyahud akhir'
    },

    // ===== BACAAN SUNNAH =====
    {
        id: 'doa_iftitah',
        name: 'Doa Iftitah',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🤲',
        position: 'Setelah takbiratul ihram, sebelum membaca Al-Fatihah',
        arabic: `سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ`,
        latin: `Subhanakallahuma wa bihamdika wa tabarakasmuka wa ta'ala jadduka wa la ilaha ghairuk`,
        translation: `Maha Suci Engkau ya Allah, dengan memuji-Mu, Maha Berkah nama-Mu, Maha Tinggi keagungan-Mu, dan tidak ada Tuhan selain Engkau`,
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Abu Dawud 775, Tirmidzi 243',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ إِذَا قَامَ إِلَى الصَّلَاةِ قَالَ...',
                translation: 'Rasulullah ﷺ apabila berdiri untuk sholat mengucapkan...'
            }
        ],
        tips: 'Baca dalam hati atau dengan suara pelan, khusyuk meresapi maknanya',
        commonMistakes: 'Jangan membaca terlalu lama hingga menunda Al-Fatihah'
    },
    {
        id: 'taawudz',
        name: 'Ta\'awudz',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🛡️',
        position: 'Sebelum membaca Al-Fatihah',
        arabic: `أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ`,
        latin: `A'udzu billahi minasy syaithanir rajim`,
        translation: `Aku berlindung kepada Allah dari godaan syetan yang terkutuk`,
        ruling: 'Sunnah',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. An-Nahl: 98',
                arabic: 'فَإِذَا قَرَأْتَ الْقُرْآنَ فَاسْتَعِذْ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
                translation: 'Apabila kamu membaca Al-Quran hendaklah kamu meminta perlindungan kepada Allah dari syetan yang terkutuk'
            }
        ],
        tips: 'Baca sebelum Al-Fatihah di rakaat pertama atau setiap rakaat',
        commonMistakes: 'Tidak menghukumi wajib, ini adalah sunnah'
    },
    {
        id: 'dzikr_ruku',
        name: 'Dzikir Ruku\'',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🙇',
        position: 'Ketika ruku\'',
        arabic: `سُبْحَانَ رَبِّيَ الْعَظِيمِ`,
        latin: `Subhana rabbiy al-'azhim`,
        translation: `Maha Suci Tuhanku Yang Maha Agung`,
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Muslim 484',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ يَقُولُ فِي رُكُوعِهِ وَسُجُودِهِ',
                translation: 'Rasulullah ﷺ mengucapkan dalam ruku\' dan sujudnya'
            }
        ],
        tips: 'Minimal 3 kali, boleh lebih. Bisa ditambah dzikir lainnya',
        commonMistakes: 'Jangan hanya sekali, minimal 3 kali lebih baik'
    },
    {
        id: 'dzikr_iktidal',
        name: 'Dzikir I\'tidal',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🤲',
        position: 'Ketika bangun dari ruku\' (i\'tidal)',
        arabic: `رَبَّنَا وَلَكَ الْحَمْدُ`,
        latin: `Rabbana wa lakal hamd`,
        translation: `Ya Tuhan kami, bagi-Mu segala puji`,
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 732, Muslim 392',
                arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ',
                translation: 'Allah mendengar orang yang memuji-Nya, ya Tuhan kami, bagi-Mu segala puji'
            }
        ],
        tips: 'Imam membaca "Sami\'allahu liman hamidah", makmum melanjutkan "Rabbana wa lakal hamd"',
        commonMistakes: 'Jangan meninggalkan bacaan ini ketika i\'tidal'
    },
    {
        id: 'dzikr_sujud',
        name: 'Dzikir Sujud',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🤲',
        position: 'Ketika sujud',
        arabic: `سُبْحَانَ رَبِّيَ الْأَعْلَى`,
        latin: `Subhana rabbiy al-a'la`,
        translation: `Maha Suci Tuhanku Yang Maha Tinggi`,
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Muslim 484',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ يَقُولُ فِي رُكُوعِهِ وَسُجُودِهِ',
                translation: 'Rasulullah ﷺ mengucapkan dalam ruku\' dan sujudnya'
            }
        ],
        tips: 'Minimal 3 kali, sujud adalah posisi terdekat dengan Allah',
        commonMistakes: 'Jangan tergesa-gesa, perbanyak dzikir dan doa dalam sujud'
    },
    {
        id: 'doa_duduk_antara_sujud',
        name: 'Doa Duduk Antara Dua Sujud',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🤲',
        position: 'Ketika duduk antara dua sujud',
        arabic: `رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي`,
        latin: `Rabbighfir li, rabbighfir li`,
        translation: `Ya Tuhanku, ampunilah aku. Ya Tuhanku, ampunilah aku`,
        ruling: 'Sunnah',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Abu Dawud 874, Ibn Majah 898',
                arabic: 'كَانَ النَّبِيُّ ﷺ يَقُولُ بَيْنَ السَّجْدَتَيْنِ',
                translation: 'Nabi ﷺ mengucapkan antara dua sujud'
            }
        ],
        tips: 'Perbanyak istighfar dan doa dalam posisi ini',
        commonMistakes: 'Jangan diam saja, manfaatkan waktu untuk berdoa'
    }
];