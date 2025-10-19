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
        variations: [
            {
                number: 1,
                arabic: `سُبْحَانَ رَبِّيَ الْعَظِيمِ`,
                latin: `Subhana rabbiy al-'azhim`,
                translation: `Maha Suci Tuhanku Yang Maha Agung`,
                frequency: 'Minimal 3 kali'
            },
            {
                number: 2,
                arabic: `سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ`,
                latin: `Subhana rabbiy al-'azhimi wa bihamdih`,
                translation: `Maha Suci Tuhanku Yang Maha Agung dengan segala puji bagi-Nya`,
                frequency: '3 kali atau lebih'
            },
            {
                number: 3,
                arabic: `سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلَائِكَةِ وَالرُّوحِ`,
                latin: `Subbuhun quddusun rabbul malaikati war-ruh`,
                translation: `Maha Suci, Maha Kudus, Tuhan para malaikat dan ruh`,
                frequency: 'Kadang-kadang'
            }
        ],
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Muslim 484',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ يَقُولُ فِي رُكُوعِهِ وَسُجُودِهِ: سُبْحَانَ رَبِّيَ الْعَظِيمِ، سُبْحَانَ رَبِّيَ الْأَعْلَى',
                translation: 'Rasulullah ﷺ mengucapkan dalam ruku\' dan sujudnya: Maha Suci Tuhanku Yang Maha Agung, Maha Suci Tuhanku Yang Maha Tinggi'
            },
            {
                source: 'Hadits',
                reference: 'HR. Muslim 487',
                arabic: 'سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلَائِكَةِ وَالرُّوحِ',
                translation: 'Maha Suci, Maha Kudus, Tuhan para malaikat dan ruh'
            }
        ],
        tips: 'Variasi dzikir ruku\' sesuai sunnah Nabi ﷺ. Pilih salah satu atau bergantian',
        commonMistakes: 'Jangan hanya sekali, minimal 3 kali. Jangan tergesa-gesa'
    },
    {
        id: 'dzikr_iktidal',
        name: 'Dzikir I\'tidal',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🤲',
        position: 'Ketika bangun dari ruku\' (i\'tidal)',
        variations: [
            {
                number: 1,
                arabic: `رَبَّنَا وَلَكَ الْحَمْدُ`,
                latin: `Rabbana wa lakal hamd`,
                translation: `Ya Tuhan kami, bagi-Mu segala puji`,
                note: 'Bacaan dasar yang paling sering'
            },
            {
                number: 2,
                arabic: `رَبَّنَا لَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ`,
                latin: `Rabbana lakal hamdu hamdan kathiran thayyiban mubarakan fih`,
                translation: `Ya Tuhan kami, bagi-Mu segala puji yang banyak, baik, dan penuh berkah`,
                note: 'Variasi yang lebih lengkap'
            },
            {
                number: 3,
                arabic: `رَبَّنَا وَلَكَ الْحَمْدُ مِلْءَ السَّمَاوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ`,
                latin: `Rabbana wa lakal hamdu mil'as samawati wa mil'al ardhi wa mil'a ma syi'ta min syay'in ba'd`,
                translation: `Ya Tuhan kami, bagi-Mu segala puji sepenuh langit, sepenuh bumi, dan sepenuh apa yang Engkau kehendaki setelah itu`,
                note: 'Dzikir yang sangat mulia'
            }
        ],
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 732, Muslim 392',
                arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ',
                translation: 'Allah mendengar orang yang memuji-Nya, ya Tuhan kami, bagi-Mu segala puji'
            },
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 799',
                arabic: 'رَبَّنَا لَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
                translation: 'Ya Tuhan kami, bagi-Mu segala puji yang banyak, baik, dan penuh berkah'
            }
        ],
        tips: 'Imam: "Sami\'allahu liman hamidah", Makmum/Munfarid: lanjutkan dengan hamdalah',
        commonMistakes: 'Jangan meninggalkan bacaan ini ketika i\'tidal, penting untuk tuma\'ninah'
    },
    {
        id: 'dzikr_sujud',
        name: 'Dzikir Sujud',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🤲',
        position: 'Ketika sujud',
        variations: [
            {
                number: 1,
                arabic: `سُبْحَانَ رَبِّيَ الْأَعْلَى`,
                latin: `Subhana rabbiy al-a'la`,
                translation: `Maha Suci Tuhanku Yang Maha Tinggi`,
                frequency: 'Minimal 3 kali'
            },
            {
                number: 2,
                arabic: `سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ`,
                latin: `Subhana rabbiy al-a'la wa bihamdih`,
                translation: `Maha Suci Tuhanku Yang Maha Tinggi dengan segala puji bagi-Nya`,
                frequency: '3 kali atau lebih'
            },
            {
                number: 3,
                arabic: `سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلَائِكَةِ وَالرُّوحِ`,
                latin: `Subbuhun quddusun rabbul malaikati war-ruh`,
                translation: `Maha Suci, Maha Kudus, Tuhan para malaikat dan ruh`,
                frequency: 'Kadang-kadang'
            },
            {
                number: 4,
                arabic: `اللَّهُمَّ لَكَ سَجَدْتُ وَبِكَ آمَنْتُ وَلَكَ أَسْلَمْتُ، سَجَدَ وَجْهِي لِلَّذِي خَلَقَهُ وَصَوَّرَهُ وَشَقَّ سَمْعَهُ وَبَصَرَهُ تَبَارَكَ اللَّهُ أَحْسَنُ الْخَالِقِينَ`,
                latin: `Allahumma laka sajadtu wa bika amantu wa laka aslamtu. Sajada wajhiya lilladzii khalaqahu wa shawwarahu wa syaqqa sam'ahu wa basharahu. Tabarakallahu ahsanul khaliqin`,
                translation: `Ya Allah, kepada-Mu aku sujud, kepada-Mu aku beriman, dan kepada-Mu aku berserah diri. Wajahku sujud kepada Dzat yang menciptakannya, membentuknya, dan membelah pendengarannya dan penglihatannya. Maha Berkah Allah, sebaik-baik Pencipta`,
                frequency: 'Sesekali, dzikir yang panjang'
            }
        ],
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Muslim 484',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ يَقُولُ فِي رُكُوعِهِ وَسُجُودِهِ: سُبْحَانَ رَبِّيَ الْعَظِيمِ، سُبْحَانَ رَبِّيَ الْأَعْلَى',
                translation: 'Rasulullah ﷺ mengucapkan dalam ruku\' dan sujudnya: Maha Suci Tuhanku Yang Maha Agung, Maha Suci Tuhanku Yang Maha Tinggi'
            },
            {
                source: 'Hadits',
                reference: 'HR. Muslim 771',
                arabic: 'سَجَدَ وَجْهِي لِلَّذِي خَلَقَهُ وَصَوَّرَهُ وَشَقَّ سَمْعَهُ وَبَصَرَهُ',
                translation: 'Wajahku sujud kepada Dzat yang menciptakannya, membentuknya, dan membelah pendengarannya dan penglihatannya'
            }
        ],
        tips: 'Sujud adalah posisi terdekat dengan Allah, perbanyak dzikir dan doa. Variasi sesuai sunnah',
        commonMistakes: 'Jangan tergesa-gesa, manfaatkan waktu sujud untuk bermunajat kepada Allah'
    },
    {
        id: 'doa_duduk_antara_sujud',
        name: 'Doa Duduk Antara Dua Sujud',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🤲',
        position: 'Ketika duduk antara dua sujud',
        variations: [
            {
                number: 1,
                arabic: `رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي`,
                latin: `Rabbighfir li, rabbighfir li`,
                translation: `Ya Tuhanku, ampunilah aku. Ya Tuhanku, ampunilah aku`,
                note: 'Doa yang paling sering digunakan'
            },
            {
                number: 2,
                arabic: `اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَاجْبُرْنِي وَعَافِنِي وَارْزُقْنِي وَارْفَعْنِي`,
                latin: `Allahummaghfir li war hamni wahdini wajburni wa 'afini warzuqni war fa'ni`,
                translation: `Ya Allah, ampunilah aku, sayangilah aku, berilah aku petunjuk, cukupilah aku, berilah aku kesehatan, berilah aku rezeki, dan tinggikanlah derajatku`,
                note: 'Doa yang lebih lengkap dan komprehensif'
            },
            {
                number: 3,
                arabic: `رَبِّ اغْفِرْ لِي ذَنْبِي وَخَطَئِي وَجَهْلِي`,
                latin: `Rabbighfir li dzanbi wa khatha'i wa jahli`,
                translation: `Ya Tuhanku, ampunilah dosaku, kesalahanku, dan kebodohanku`,
                note: 'Memohon ampun atas berbagai jenis kesalahan'
            }
        ],
        ruling: 'Sunnah',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Abu Dawud 874, Ibn Majah 898',
                arabic: 'كَانَ النَّبِيُّ ﷺ يَقُولُ بَيْنَ السَّجْدَتَيْنِ: رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
                translation: 'Nabi ﷺ mengucapkan antara dua sujud: Ya Tuhanku, ampunilah aku, Ya Tuhanku, ampunilah aku'
            },
            {
                source: 'Hadits',
                reference: 'HR. Abu Dawud 850',
                arabic: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَاجْبُرْنِي وَعَافِنِي وَارْزُقْنِي وَارْفَعْنِي',
                translation: 'Ya Allah, ampunilah aku, sayangilah aku, berilah aku petunjuk...'
            }
        ],
        tips: 'Posisi duduk iftirasy (kaki kiri dilipat), perbanyak istighfar dan doa',
        commonMistakes: 'Jangan diam saja, manfaatkan waktu untuk berdoa dan dzikir'
    },

    // ===== DOA-DOA TAMBAHAN DALAM SHOLAT =====
    {
        id: 'doa_qunut',
        name: 'Doa Qunut',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🤲',
        position: 'Rakaat kedua sholat Subuh atau sholat Witir',
        variations: [
            {
                number: 1,
                arabic: `اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، إِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ`,
                latin: `Allahummahdini fiman hadaita, wa 'afini fiman 'afaita, wa tawallani fiman tawallaita, wa barik li fima a'thaita, wa qini syarra ma qadhaita, fa innaka taqdhi wa la yuqdha 'alaika, innahu la yadzillu man walaita, wa la ya'izzu man 'adaita, tabarakta rabbana wa ta'alaita`,
                translation: `Ya Allah, berilah aku petunjuk sebagaimana Engkau beri petunjuk kepada orang-orang yang telah Engkau beri petunjuk. Berilah aku kesehatan sebagaimana Engkau beri kesehatan kepada orang-orang yang telah Engkau beri kesehatan. Pimpinlah aku sebagaimana Engkau pimpin orang-orang yang telah Engkau pimpin. Berkatilah bagiku apa yang telah Engkau berikan kepadaku. Peliharalah aku dari keburukan apa yang telah Engkau tetapkan. Sesungguhnya Engkau yang memutuskan dan tidak ada yang memutuskan atas-Mu. Sesungguhnya tidak akan hina orang yang Engkau pimpin dan tidak akan mulia orang yang Engkau musuhi. Maha Berkah Engkau wahai Tuhan kami dan Maha Tinggi`
            }
        ],
        ruling: 'Sunnah pada waktu-waktu tertentu',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Abu Dawud 1425, Tirmidzi 464',
                arabic: 'عَلَّمَنِي رَسُولُ اللَّهِ ﷺ الْقُنُوتَ',
                translation: 'Rasulullah ﷺ mengajarkan kepadaku qunut'
            }
        ],
        tips: 'Dibaca setelah bangkit dari ruku\' pada rakaat kedua Subuh atau rakaat terakhir Witir',
        commonMistakes: 'Jangan selalu dibaca setiap sholat, hanya pada waktu-waktu tertentu'
    },
    {
        id: 'doa_setelah_tasyahud',
        name: 'Doa Setelah Tasyahud Sebelum Salam',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🤲',
        position: 'Setelah tasyahud akhir dan sholawat, sebelum salam',
        variations: [
            {
                number: 1,
                arabic: `اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ`,
                latin: `Allahumma a'inni 'ala dzikrika wa syukrika wa husni 'ibadatika`,
                translation: `Ya Allah, tolonglah aku untuk berdzikir kepada-Mu, bersyukur kepada-Mu, dan beribadah dengan baik kepada-Mu`
            },
            {
                number: 2,
                arabic: `اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ`,
                latin: `Allahumma inni a'udzu bika min 'adzabi jahannam, wa min 'adzabil qabri, wa min fitnatil mahya wal mamat, wa min syarri fitnatil masihid dajjal`,
                translation: `Ya Allah, sesungguhnya aku berlindung kepada-Mu dari azab jahannam, dari azab kubur, dari fitnah kehidupan dan kematian, dan dari kejahatan fitnah Al-Masih Ad-Dajjal`
            },
            {
                number: 3,
                arabic: `اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَسْرَفْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي، أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ، لَا إِلَٰهَ إِلَّا أَنْتَ`,
                latin: `Allahummaghfir li ma qaddamtu wa ma akhkhartu, wa ma asrartu wa ma a'lantu, wa ma asraftu, wa ma anta a'lamu bihi minni. Antal muqaddimu wa antal mu'akhkhiru, la ilaha illa anta`,
                translation: `Ya Allah, ampunilah dosaku yang telah lalu dan yang akan datang, yang aku sembunyikan dan yang aku lahirkan, yang aku berlebihan, dan apa yang Engkau lebih mengetahuinya dariku. Engkau yang mendahulukan dan Engkau yang mengakhirkan, tidak ada Tuhan selain Engkau`
            }
        ],
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Abu Dawud 1481',
                arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
                translation: 'Ya Allah, tolonglah aku untuk berdzikir kepada-Mu...'
            },
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 832, Muslim 588',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ يَدْعُو فِي صَلَاتِهِ',
                translation: 'Rasulullah ﷺ berdoa dalam sholatnya'
            }
        ],
        tips: 'Pilih salah satu doa atau bergantian, waktu mustajab untuk berdoa',
        commonMistakes: 'Jangan terlalu panjang hingga mengganggu jamaah, sesuaikan dengan situasi'
    },
    {
        id: 'dzikr_setelah_salam',
        name: 'Dzikir Setelah Salam',
        category: 'bacaan',
        type: 'sunnah',
        icon: '✨',
        position: 'Setelah salam, sebelum meninggalkan tempat sholat',
        variations: [
            {
                number: 1,
                arabic: `أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ`,
                latin: `Astaghfirullah, astaghfirullah, astaghfirullah. Allahumma antas salamu wa minkas salam, tabarakta ya dzal jalali wal ikram`,
                translation: `Aku memohon ampun kepada Allah (3x). Ya Allah, Engkau adalah keselamatan dan dari-Mu keselamatan, Maha Berkah Engkau wahai Dzat Yang memiliki keagungan dan kemuliaan`
            },
            {
                number: 2,
                arabic: `لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ. اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ وَلَا مُعْطِيَ لِمَا مَنَعْتَ وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ`,
                latin: `La ilaha illallahu wahdahu la syarika lahu, lahul mulku wa lahul hamdu wa huwa 'ala kulli syai'in qadir. Allahumma la mani'a lima a'thaita wa la mu'thiya lima mana'ta wa la yanfa'u dzal jaddi minkal jadd`,
                translation: `Tidak ada Tuhan yang berhak disembah kecuali Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala pujian, dan Dia Maha Kuasa atas segala sesuatu. Ya Allah, tidak ada yang dapat mencegah apa yang Engkau berikan, dan tidak ada yang dapat memberi apa yang Engkau cegah, dan tidak berguna kekayaan orang yang kaya, melainkan (datang) dari-Mu`
            },
            {
                number: 3,
                arabic: `سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَاللَّهُ أَكْبَرُ`,
                latin: `Subhanallah walhamdulillah wallahu akbar`,
                translation: `Maha Suci Allah, segala puji bagi Allah, dan Allah Maha Besar`,
                note: 'Masing-masing 33 kali, kemudian ditutup dengan La ilaha illallah sekali'
            }
        ],
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Muslim 591',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ إِذَا انْصَرَفَ مِنْ صَلَاتِهِ اسْتَغْفَرَ ثَلَاثًا',
                translation: 'Rasulullah ﷺ apabila selesai dari sholatnya, beliau beristighfar tiga kali'
            },
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 844, Muslim 593',
                arabic: 'مَنْ سَبَّحَ اللَّهَ فِي دُبُرِ كُلِّ صَلَاةٍ ثَلَاثًا وَثَلَاثِينَ...',
                translation: 'Barangsiapa bertasbih kepada Allah setelah setiap sholat 33 kali...'
            }
        ],
        tips: 'Dzikir ini sangat dianjurkan, dibaca sambil duduk di tempat sholat',
        commonMistakes: 'Jangan langsung pergi setelah salam, sempatkan untuk berdzikir'
    },
    {
        id: 'doa_iftitah_tambahan',
        name: 'Variasi Doa Iftitah Lainnya',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🤲',
        position: 'Setelah takbiratul ihram, sebelum membaca Al-Fatihah',
        variations: [
            {
                number: 1,
                arabic: `وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ. إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ لَا شَرِيكَ لَهُ وَبِذَٰلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِينَ`,
                latin: `Wajjahtu wajhiya lilladzii fataras samawati wal ardha hanifan wa ma ana minal musyrikin. Inna shalati wa nusuki wa mahyaya wa mamati lillahi rabbil 'alamin, la syarika lahu wa bidzalika umirtu wa ana minal muslimin`,
                translation: `Aku hadapkan wajahku kepada Dzat yang menciptakan langit dan bumi dengan condong kepada agama yang benar, dan aku bukanlah termasuk orang-orang yang musyrik. Sesungguhnya sholatku, ibadahku, hidupku dan matiku hanyalah untuk Allah Tuhan semesta alam, tidak ada sekutu bagi-Nya. Dan dengan yang demikian itulah aku diperintahkan, dan aku termasuk orang-orang yang muslim`
            },
            {
                number: 2,
                arabic: `اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ. اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ. اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالثَّلْجِ وَالْمَاءِ وَالْبَرَدِ`,
                latin: `Allahumma ba'id baini wa baina khatayaya kama ba'adta bainal masyriq wal maghrib. Allahumma naqqini min khatayaya kama yunaqqa tsawbul abyadu minad danas. Allahummaghsilni min khatayaya bitstsalji wal ma'i wal barad`,
                translation: `Ya Allah, jauhkanlah antara aku dengan dosa-dosaku sebagaimana Engkau jauhkan antara timur dan barat. Ya Allah, bersihkanlah aku dari dosa-dosaku sebagaimana dibersihkan kain putih dari kotoran. Ya Allah, cucilah aku dari dosa-dosaku dengan salju, air, dan embun beku`
            }
        ],
        ruling: 'Sunnah',
        dalil: [
            {
                source: 'Hadits', 
                reference: 'HR. Muslim 771',
                arabic: 'وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ',
                translation: 'Aku hadapkan wajahku kepada Dzat yang menciptakan langit dan bumi'
            },
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 744, Muslim 598',
                arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ',
                translation: 'Ya Allah, jauhkanlah antara aku dengan dosa-dosaku'
            }
        ],
        tips: 'Variasi doa iftitah ini bisa digunakan bergantian sesuai sunnah Nabi ﷺ',
        commonMistakes: 'Jangan terlalu lama membaca iftitah, segera lanjut ke Al-Fatihah'
    },
    {
        id: 'doa_dalam_sujud',
        name: 'Doa-doa dalam Sujud',
        category: 'bacaan',
        type: 'sunnah',
        icon: '🤲',
        position: 'Ketika sujud, setelah dzikir tasbih',
        variations: [
            {
                number: 1,
                arabic: `اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ`,
                latin: `Allahummaghfir li dzanbi kullahu, diqqahu wa jillahu, wa awwalahu wa akhirahu, wa 'alaniyatahu wa sirrahu`,
                translation: `Ya Allah, ampunilah dosaku semuanya, yang kecil dan yang besar, yang awal dan yang akhir, yang terang-terangan dan yang tersembunyi`
            },
            {
                number: 2,
                arabic: `اللَّهُمَّ إِنِّي أَعُوذُ بِرِضَاكَ مِنْ سَخَطِكَ، وَبِمُعَافَاتِكَ مِنْ عُقُوبَتِكَ، وَأَعُوذُ بِكَ مِنْكَ لَا أُحْصِي ثَنَاءً عَلَيْكَ أَنْتَ كَمَا أَثْنَيْتَ عَلَى نَفْسِكَ`,
                latin: `Allahumma inni a'udzu bi ridhaka min sakhatika, wa bi mu'afatika min 'uqubatika, wa a'udzu bika minka la uhshi tsana'an 'alaika anta kama atsnaita 'ala nafsika`,
                translation: `Ya Allah, sesungguhnya aku berlindung dengan keridhaan-Mu dari kemurkaan-Mu, dan dengan ampunan-Mu dari siksaan-Mu, dan aku berlindung kepada-Mu dari-Mu. Aku tidak dapat menghitung pujian kepada-Mu, Engkau sebagaimana Engkau memuji diri-Mu sendiri`
            },
            {
                number: 3,
                arabic: `رَبِّ أَعِنِّي وَلَا تُعِنْ عَلَيَّ، وَانْصُرْنِي وَلَا تَنْصُرْ عَلَيَّ، وَامْكُرْ لِي وَلَا تَمْكُرْ عَلَيَّ، وَاهْدِنِي وَيَسِّرِ الْهُدَى لِي، وَانْصُرْنِي عَلَى مَنْ بَغَى عَلَيَّ`,
                latin: `Rabbi a'inni wa la tu'in 'alayya, wanshurni wa la tanshur 'alayya, wamkur li wa la tamkur 'alayya, wahdini wa yassir huda li, wanshurni 'ala man bagha 'alayya`,
                translation: `Ya Tuhanku, tolonglah aku dan jangan menolong musuhku atasku, menangkanlah aku dan jangan menangkan musuhku atasku, buatlah rencana untukku dan jangan buat rencana yang merugikanku, berilah aku petunjuk dan mudahkanlah petunjuk bagiku, dan menangkanlah aku atas orang yang berbuat aniaya kepadaku`
            }
        ],
        ruling: 'Sunnah',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Muslim 483',
                arabic: 'أَقْرَبُ مَا يَكُونُ الْعَبْدُ إِلَى رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ',
                translation: 'Seorang hamba paling dekat kepada Tuhannya ketika ia sedang sujud, maka perbanyaklah doa'
            },
            {
                source: 'Hadits',
                reference: 'HR. Muslim 486',
                arabic: 'أَعُوذُ بِرِضَاكَ مِنْ سَخَطِكَ',
                translation: 'Aku berlindung dengan keridhaan-Mu dari kemurkaan-Mu'
            }
        ],
        tips: 'Manfaatkan sujud untuk berdoa, posisi paling dekat dengan Allah',
        commonMistakes: 'Jangan hanya dzikir saja, perbanyak doa pribadi dalam sujud'
    }
];