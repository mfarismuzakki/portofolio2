// Database Sunnah Sholat berdasarkan Al-Qur'an dan Hadits Shahih
// Sumber: Zad al-Ma'ad, Fiqh as-Sunnah, Al-Mulakhkhas al-Fiqhi

window.sunnahSholat = [
    // ===== SUNNAH QABLIYAH (SEBELUM SHOLAT) =====
    {
        id: 'sunnah_subuh_qabliyah',
        name: 'Sunnah Subuh (2 Rakaat)',
        category: 'sunnah',
        type: 'qabliyah',
        icon: '🌅',
        rakaat: 2,
        timing: 'Sebelum sholat Subuh',
        arabic: 'سُنَّةُ الصُّبْحِ',
        latin: 'Sunnatu ash-Shubh',
        translation: 'Sunnah Subuh',
        description: 'Sholat sunnah 2 rakaat sebelum sholat Subuh, sangat dianjurkan dan tidak pernah ditinggalkan Rasulullah ﷺ',
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 1163, Muslim 724',
                arabic: 'رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا',
                translation: 'Dua rakaat (sunnah) Fajar lebih baik dari dunia dan segala isinya'
            }
        ],
        tips: 'Ringan dan singkat, baca Al-Fatihah dan surat pendek. Boleh dikerjakan di rumah',
        commonMistakes: 'Jangan meninggalkan sunnah Subuh karena pahalanya sangat besar',
        bacaan_sunnah: [
            'Rakaat 1: Al-Fatihah + Al-Kafirun',
            'Rakaat 2: Al-Fatihah + Al-Ikhlas'
        ]
    },
    {
        id: 'sunnah_dzuhur_qabliyah',
        name: 'Sunnah Dzuhur Qabliyah (4 Rakaat)',
        category: 'sunnah',
        type: 'qabliyah',
        icon: '☀️',
        rakaat: 4,
        timing: 'Sebelum sholat Dzuhur',
        arabic: 'سُنَّةُ الظُّهْرِ الْقَبْلِيَّةُ',
        latin: 'Sunnatu azh-Zhuhri al-Qabliyyah',
        translation: 'Sunnah Dzuhur Sebelum',
        description: 'Sholat sunnah 4 rakaat sebelum sholat Dzuhur, dikerjakan dengan salam setiap 2 rakaat',
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Tirmidzi 428, Abu Dawud 1269',
                arabic: 'مَنْ صَلَّى أَرْبَعًا قَبْلَ الظُّهْرِ وَأَرْبَعًا بَعْدَهَا حَرَّمَهُ اللَّهُ عَلَى النَّارِ',
                translation: 'Barangsiapa sholat 4 rakaat sebelum Dzuhur dan 4 rakaat setelahnya, Allah haramkan dia dari neraka'
            }
        ],
        tips: 'Dikerjakan 2-2 rakaat dengan salam. Perbanyak dzikir dan doa',
        commonMistakes: 'Jangan sholat 4 rakaat sekaligus tanpa salam di tengah'
    },
    {
        id: 'sunnah_ashar_qabliyah',
        name: 'Sunnah Ashar Qabliyah (4 Rakaat)',
        category: 'sunnah',
        type: 'qabliyah',
        icon: '🌆',
        rakaat: 4,
        timing: 'Sebelum sholat Ashar',
        arabic: 'سُنَّةُ الْعَصْرِ الْقَبْلِيَّةُ',
        latin: 'Sunnatu al-\'Ashri al-Qabliyyah',
        translation: 'Sunnah Ashar Sebelum',
        description: 'Sholat sunnah 4 rakaat sebelum sholat Ashar, pahalanya besar meski tidak seketat sunnah rawatib lainnya',
        ruling: 'Sunnah',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Abu Dawud 1271, Tirmidzi 430',
                arabic: 'رَحِمَ اللَّهُ امْرَأً صَلَّى أَرْبَعًا قَبْلَ الْعَصْرِ',
                translation: 'Semoga Allah merahmati seseorang yang sholat 4 rakaat sebelum Ashar'
            }
        ],
        tips: 'Tidak wajib seperti sunnah rawatib, tapi sangat dianjurkan',
        commonMistakes: 'Tidak masalah jika kadang ditinggalkan karena bukan sunnah muakkad'
    },
    {
        id: 'sunnah_maghrib_qabliyah',
        name: 'Sunnah Maghrib Qabliyah (2 Rakaat)',
        category: 'sunnah',
        type: 'qabliyah',
        icon: '🌅',
        rakaat: 2,
        timing: 'Sebelum sholat Maghrib (antara adzan dan iqamah)',
        arabic: 'سُنَّةُ الْمَغْرِبِ الْقَبْلِيَّةُ',
        latin: 'Sunnatu al-Maghribi al-Qabliyyah',
        translation: 'Sunnah Maghrib Sebelum',
        description: 'Sholat sunnah 2 rakaat sebelum sholat Maghrib, dikerjakan setelah adzan Maghrib',
        ruling: 'Sunnah',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 1183',
                arabic: 'صَلُّوا قَبْلَ صَلَاةِ الْمَغْرِبِ، صَلُّوا قَبْلَ صَلَاةِ الْمَغْرِبِ، لِمَنْ شَاءَ',
                translation: 'Sholatlah sebelum sholat Maghrib, sholatlah sebelum sholat Maghrib, bagi yang menginginkan'
            }
        ],
        tips: 'Waktunya singkat antara adzan dan iqamah, jadi harus cepat',
        commonMistakes: 'Jangan sampai ketinggalan jamaah Maghrib karena sunnah qabliyah'
    },
    {
        id: 'sunnah_isya_qabliyah',
        name: 'Sunnah Isya Qabliyah (4 Rakaat)',
        category: 'sunnah',
        type: 'qabliyah',
        icon: '🌙',
        rakaat: 4,
        timing: 'Sebelum sholat Isya',
        arabic: 'سُنَّةُ الْعِشَاءِ الْقَبْلِيَّةُ',
        latin: 'Sunnatu al-\'Isyaa\' al-Qabliyyah',
        translation: 'Sunnah Isya Sebelum',
        description: 'Sholat sunnah 4 rakaat sebelum sholat Isya, dikerjakan 2-2 rakaat',
        ruling: 'Sunnah',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Ibn Majah 1154',
                arabic: 'بَيْنَ كُلِّ أَذَانَيْنِ صَلَاةٌ لِمَنْ شَاءَ',
                translation: 'Di antara setiap dua adzan ada sholat bagi yang menginginkan'
            }
        ],
        tips: 'Manfaatkan waktu sebelum jamaah Isya untuk sholat sunnah',
        commonMistakes: 'Tidak wajib, tapi sangat baik untuk menambah pahala'
    },

    // ===== SUNNAH BA'DIYAH (SETELAH SHOLAT) =====
    {
        id: 'sunnah_dzuhur_badiyah',
        name: 'Sunnah Dzuhur Ba\'diyah (2 Rakaat)',
        category: 'sunnah',
        type: 'badiyah',
        icon: '☀️',
        rakaat: 2,
        timing: 'Setelah sholat Dzuhur',
        arabic: 'سُنَّةُ الظُّهْرِ الْبَعْدِيَّةُ',
        latin: 'Sunnatu azh-Zhuhri al-Ba\'diyyah',
        translation: 'Sunnah Dzuhur Sesudah',
        description: 'Sholat sunnah 2 rakaat setelah sholat Dzuhur, termasuk sunnah rawatib yang sangat dianjurkan',
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 1180, Muslim 729',
                arabic: 'مَا مِنْ عَبْدٍ مُسْلِمٍ يُصَلِّي لِلَّهِ كُلَّ يَوْمٍ ثِنْتَيْ عَشْرَةَ رَكْعَةً تَطَوُّعًا غَيْرَ فَرِيضَةٍ إِلَّا بَنَى اللَّهُ لَهُ بَيْتًا فِي الْجَنَّةِ',
                translation: 'Tidaklah seorang hamba muslim yang sholat sunnah 12 rakaat setiap hari selain fardhu, melainkan Allah akan membangunkan untuknya rumah di surga'
            }
        ],
        tips: 'Bagian dari 12 rakaat sunnah rawatib yang dijanjikan rumah di surga',
        commonMistakes: 'Jangan sering meninggalkan sunnah rawatib karena pahalanya luar biasa'
    },
    {
        id: 'sunnah_maghrib_badiyah',
        name: 'Sunnah Maghrib Ba\'diyah (2 Rakaat)',
        category: 'sunnah',
        type: 'badiyah',
        icon: '🌅',
        rakaat: 2,
        timing: 'Setelah sholat Maghrib',
        arabic: 'سُنَّةُ الْمَغْرِبِ الْبَعْدِيَّةُ',
        latin: 'Sunnatu al-Maghribi al-Ba\'diyyah',
        translation: 'Sunnah Maghrib Sesudah',
        description: 'Sholat sunnah 2 rakaat setelah sholat Maghrib, bagian dari sunnah rawatib yang sangat dianjurkan',
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 1180, Muslim 729',
                arabic: '12 rakaat sunnah rawatib termasuk 2 rakaat setelah Maghrib',
                translation: '12 rakaat sunnah rawatib termasuk 2 rakaat setelah Maghrib'
            }
        ],
        tips: 'Segera kerjakan setelah sholat Maghrib sebelum makan atau aktivitas lain',
        commonMistakes: 'Jangan menunda-nunda karena waktu Maghrib relatif singkat'
    },
    {
        id: 'sunnah_isya_badiyah',
        name: 'Sunnah Isya Ba\'diyah (2 Rakaat)',
        category: 'sunnah',
        type: 'badiyah',
        icon: '🌙',
        rakaat: 2,
        timing: 'Setelah sholat Isya',
        arabic: 'سُنَّةُ الْعِشَاءِ الْبَعْدِيَّةُ',
        latin: 'Sunnatu al-\'Isyaa\' al-Ba\'diyyah',
        translation: 'Sunnah Isya Sesudah',
        description: 'Sholat sunnah 2 rakaat setelah sholat Isya, bagian dari sunnah rawatib',
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 1180, Muslim 729',
                arabic: '12 rakaat sunnah rawatib termasuk 2 rakaat setelah Isya',
                translation: '12 rakaat sunnah rawatib termasuk 2 rakaat setelah Isya'
            }
        ],
        tips: 'Bisa dikerjakan sebelum sholat Witir atau setelahnya',
        commonMistakes: 'Jangan sampai tertidur dan meninggalkan sunnah ba\'diyah Isya'
    },

    // ===== SUNNAH DALAM SHOLAT =====
    {
        id: 'mengangkat_tangan_takbir',
        name: 'Mengangkat Tangan Saat Takbir',
        category: 'sunnah',
        type: 'dalam_sholat',
        icon: '🤲',
        position: 'Takbiratul ihram, ruku\', i\'tidal, berdiri rakaat 3',
        arabic: 'رَفْعُ اليَدَيْنِ',
        latin: 'Raf\'ul Yadain',
        translation: 'Mengangkat kedua tangan',
        description: 'Mengangkat kedua tangan setinggi pundak atau telinga pada empat tempat dalam sholat',
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 739, Muslim 390',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ إِذَا كَبَّرَ رَفَعَ يَدَيْهِ',
                translation: 'Rasulullah ﷺ apabila bertakbir mengangkat kedua tangannya'
            }
        ],
        tips: 'Angkat setinggi pundak atau telinga, telapak tangan menghadap kiblat',
        commonMistakes: 'Jangan mengangkat terlalu tinggi atau terlalu rendah'
    },
    {
        id: 'meletakkan_tangan_dada',
        name: 'Meletakkan Tangan di Dada',
        category: 'sunnah',
        type: 'dalam_sholat',
        icon: '🤝',
        position: 'Saat berdiri dalam sholat',
        arabic: 'وَضْعُ اليَدَيْنِ عَلَى الصَّدْرِ',
        latin: 'Wadh\'ul Yadaini \'ala ash-Shadr',
        translation: 'Meletakkan kedua tangan di dada',
        description: 'Meletakkan tangan kanan di atas tangan kiri di atas dada saat berdiri dalam sholat',
        ruling: 'Sunnah',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Abu Dawud 759, dishahihkan Al-Albani',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ يَضَعُ يَدَهُ الْيُمْنَى عَلَى يَدِهِ الْيُسْرَى',
                translation: 'Rasulullah ﷺ meletakkan tangan kanannya di atas tangan kirinya'
            }
        ],
        tips: 'Tangan kanan di atas tangan kiri, posisi di dada',
        commonMistakes: 'Jangan meletakkan di perut atau terlalu rendah'
    },
    {
        id: 'membaca_surat_setelah_fatihah',
        name: 'Membaca Surat Setelah Al-Fatihah',
        category: 'sunnah',
        type: 'dalam_sholat',
        icon: '📖',
        position: 'Rakaat pertama dan kedua (sholat jahr)',
        arabic: 'قِرَاءَةُ السُّورَةِ بَعْدَ الْفَاتِحَةِ',
        latin: 'Qira\'atus Surati ba\'dal Fatihah',
        translation: 'Membaca surat setelah Al-Fatihah',
        description: 'Membaca surat atau ayat Al-Quran setelah Al-Fatihah pada rakaat pertama dan kedua',
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 776, Muslim 396',
                arabic: 'كَانَ النَّبِيُّ ﷺ يَقْرَأُ فِي الصُّبْحِ بِالسُّورَتَيْنِ الطِّوَالِ',
                translation: 'Nabi ﷺ membaca dalam sholat Subuh dengan dua surat yang panjang'
            }
        ],
        tips: 'Subuh: surat panjang, Dzuhur-Ashar: sedang, Maghrib-Isya: pendek-sedang',
        commonMistakes: 'Jangan terlalu panjang hingga memberatkan jamaah'
    },
    {
        id: 'gerak_telunjuk_tasyahud',
        name: 'Menggerakkan Telunjuk Saat Tasyahud',
        category: 'sunnah',
        type: 'dalam_sholat',
        icon: '☝️',
        position: 'Saat duduk tasyahud',
        arabic: 'تَحْرِيكُ السَّبَّابَةِ فِي التَّشَهُّدِ',
        latin: 'Tahriku as-Sabbabati fi at-Tasyahud',
        translation: 'Menggerakkan telunjuk dalam tasyahud',
        description: 'Menggerakkan telunjuk tangan kanan saat menyebut nama Allah dalam tasyahud',
        ruling: 'Sunnah',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Muslim 580',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ إِذَا جَلَسَ يُشِيرُ بِإِصْبَعِهِ',
                translation: 'Rasulullah ﷺ apabila duduk mengisyaratkan dengan jarinya'
            }
        ],
        tips: 'Gerakkan ketika menyebut "illa Allah" atau sepanjang tasyahud',
        commonMistakes: 'Jangan menggerak-gerakkan berlebihan atau terlalu kaku'
    },

    // ===== SHOLAT SUNNAH KHUSUS =====
    {
        id: 'sholat_dhuha',
        name: 'Sholat Dhuha',
        category: 'khusus',
        type: 'sunnah_khusus',
        icon: '☀️',
        rakaat: '2-8 rakaat',
        timing: 'Antara terbit matahari hingga sebelum Dzuhur',
        arabic: 'صَلَاةُ الضُّحَى',
        latin: 'Shalatudh Dhuha',
        translation: 'Sholat Dhuha',
        description: 'Sholat sunnah yang dikerjakan pada waktu dhuha (pagi hari), minimal 2 rakaat maksimal 8 rakaat',
        ruling: 'Sunnah',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Muslim 719',
                arabic: 'يُصْبِحُ عَلَى كُلِّ سُلَامَى مِنْ أَحَدِكُمْ صَدَقَةٌ... وَيُجْزِئُ مِنْ ذَلِكَ رَكْعَتَانِ يَرْكَعُهُمَا مِنَ الضُّحَى',
                translation: 'Setiap pagi pada setiap ruas tulang salah seorang dari kalian ada sedekah... dan dapat ditunaikan dengan dua rakaat sholat Dhuha'
            }
        ],
        tips: 'Waktu terbaik adalah ketika matahari sudah tinggi (sekitar jam 9-11)',
        commonMistakes: 'Jangan dikerjakan tepat setelah terbit matahari (waktu terlarang)'
    },
    {
        id: 'sholat_tahajud',
        name: 'Sholat Tahajud',
        category: 'khusus',
        type: 'sunnah_khusus',
        icon: '🌙',
        rakaat: 'Minimal 2 rakaat, maksimal 11 rakaat',
        timing: 'Setelah tidur di malam hari hingga sebelum Subuh',
        arabic: 'صَلَاةُ التَّهَجُّدِ',
        latin: 'Shalatut Tahajjud',
        translation: 'Sholat Tahajud',
        description: 'Sholat sunnah yang dikerjakan di malam hari setelah tidur, merupakan sholat yang sangat mulia',
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-Isra: 79',
                arabic: 'وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا',
                translation: 'Dan pada sebahagian malam hari bersholat tahajudlah kamu sebagai suatu ibadah tambahan bagimu; mudah-mudahan Tuhan-mu mengangkat kamu ke tempat yang terpuji'
            }
        ],
        tips: 'Sepertiga malam terakhir adalah waktu terbaik, tidur dulu baru bangun',
        commonMistakes: 'Tahajud harus setelah tidur, bukan begadang langsung'
    },
    {
        id: 'sholat_witir',
        name: 'Sholat Witir',
        category: 'khusus',
        type: 'sunnah_khusus',
        icon: '🌟',
        rakaat: 'Minimal 1 rakaat, bisa 3, 5, 7, 9, atau 11 rakaat',
        timing: 'Setelah sholat Isya hingga sebelum Subuh',
        arabic: 'صَلَاةُ الْوِتْرِ',
        latin: 'Shalatul Witir',
        translation: 'Sholat Witir',
        description: 'Sholat sunnah dengan jumlah rakaat ganjil, menutup sholat malam',
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Tirmidzi 453, Abu Dawud 1416',
                arabic: 'إِنَّ اللَّهَ وِتْرٌ يُحِبُّ الْوِتْرَ فَأَوْتِرُوا يَا أَهْلَ الْقُرْآنِ',
                translation: 'Sesungguhnya Allah itu witir (ganjil) dan menyukai yang witir, maka berwitrlah wahai ahli Al-Quran'
            }
        ],
        tips: 'Paling mudah 1 rakaat sebelum tidur, paling afdhol 3 rakaat',
        commonMistakes: 'Jangan sholat Witir dua kali dalam satu malam'
    },

    // ===== SHOLAT KHUSUS =====
    {
        id: 'sholat_ied',
        name: 'Sholat Ied (Fitri & Adha)',
        category: 'khusus',
        type: 'sunnah_muakkad',
        icon: '🌙',
        rakaat: 2,
        timing: 'Pagi hari Ied setelah terbitnya matahari hingga menjelang Dzuhur',
        arabic: 'صَلَاةُ الْعِيدَيْنِ',
        latin: 'Shalaatul Eidaini',
        translation: 'Sholat Dua Hari Raya',
        description: 'Sholat 2 rakaat pada hari Ied Fitri dan Ied Adha dengan 7 takbir di rakaat pertama dan 5 takbir di rakaat kedua (setelah takbiratul ihram)',
        ruling: 'Sunnah Muakkad/Fardhu Kifayah (menurut sebagian ulama)',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 964, Muslim 884',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ يُكَبِّرُ فِي الْفِطْرِ وَالْأَضْحَى',
                translation: 'Rasulullah ﷺ bertakbir pada (sholat) Fitri dan Adha'
            }
        ],
        steps: [
            '1. Takbiratul ihram lalu 6 takbir lagi di rakaat pertama',
            '2. Baca Al-Fatihah dan surat (sunnah: Al-A\'la)',
            '3. Ruku\' dan sujud seperti biasa',
            '4. Bangkit untuk rakaat kedua, takbir 5 kali',
            '5. Baca Al-Fatihah dan surat (sunnah: Al-Ghashiyah)',
            '6. Ruku\', sujud, dan salam',
            '7. Mendengarkan khutbah Ied (2 khutbah)'
        ],
        tips: 'Mandi, memakai pakaian terbaik, dan berangkat dengan jalan berbeda pulang-pergi',
        commonMistakes: 'Jangan meninggalkan takbir tambahan yang merupakan sunnah dalam sholat Ied'
    },
    {
        id: 'sholat_gerhana',
        name: 'Sholat Gerhana (Kusuf/Khusuf)',
        category: 'khusus',
        type: 'sunnah_muakkad',
        icon: '🌕',
        rakaat: 2,
        timing: 'Saat terjadi gerhana matahari atau bulan',
        arabic: 'صَلَاةُ الْكُسُوفِ وَالْخُسُوفِ',
        latin: 'Shalaatul Kusufi wal Khusufi',
        translation: 'Sholat Gerhana Matahari dan Bulan',
        description: 'Sholat 2 rakaat dengan cara khusus: setiap rakaat ada 2 kali ruku\' dan qira\'ah yang panjang, dikerjakan berjamaah',
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 1044, Muslim 901',
                arabic: 'إِنَّ الشَّمْسَ وَالْقَمَرَ آيَتَانِ مِنْ آيَاتِ اللَّهِ لاَ يَنْكَسِفَانِ لِمَوْتِ أَحَدٍ وَلاَ لِحَيَاتِهِ فَإِذَا رَأَيْتُمُوهُمَا فَادْعُوا اللَّهَ وَصَلُّوا',
                translation: 'Sesungguhnya matahari dan bulan adalah dua tanda dari tanda-tanda Allah, keduanya tidak gerhana karena kematian atau kelahiran seseorang. Jika kalian melihat gerhana, maka berdoalah kepada Allah dan sholatlah'
            }
        ],
        steps: [
            '1. Takbiratul ihram dan baca Al-Fatihah + surat panjang',
            '2. Ruku\' panjang (sekitar 1 menit)',
            '3. Bangkit dan baca Al-Fatihah + surat lagi (lebih pendek)',
            '4. Ruku\' kedua (lebih pendek dari ruku\' pertama)',
            '5. Sujud dua kali seperti biasa',
            '6. Rakaat kedua sama seperti pertama tapi lebih pendek',
            '7. Setelah salam: khutbah dan perbanyak dzikir, istighfar'
        ],
        tips: 'Perbanyak dzikir, doa, dan istighfar. Bacaan Al-Quran dipanjangkan',
        commonMistakes: 'Jangan meninggalkan sholat ini saat terjadi gerhana, ini adalah sunnah yang sangat dianjurkan'
    },
    {
        id: 'sholat_jenazah',
        name: 'Sholat Jenazah',
        category: 'khusus',
        type: 'fardhu_kifayah',
        icon: '🤲',
        rakaat: 'Tidak ada rakaat (hanya berdiri dengan 4 takbir)',
        timing: 'Setelah memandikan dan mengkafani jenazah, sebelum dikubur',
        arabic: 'صَلَاةُ الْجَنَازَةِ',
        latin: 'Shalaatul Janazah',
        translation: 'Sholat Jenazah',
        description: 'Sholat khusus untuk mendoakan mayit muslim, terdiri dari 4 takbir tanpa ruku\' dan sujud, merupakan kewajiban komunal (fardhu kifayah)',
        ruling: 'Fardhu Kifayah',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 1335, Muslim 963',
                arabic: 'صَلُّوا عَلَى مَنْ قَالَ لاَ إِلَهَ إِلاَّ اللَّهُ',
                translation: 'Sholatkanlah orang yang mengucapkan laa ilaaha illallah'
            }
        ],
        steps: [
            '1. Takbir pertama: baca Al-Fatihah',
            '2. Takbir kedua: baca sholawat untuk Nabi ﷺ',
            '3. Takbir ketiga: baca doa untuk mayit',
            '4. Takbir keempat: doa penutup singkat lalu salam'
        ],
        tips: 'Imam berdiri sejajar kepala mayit laki-laki, sejajar pinggang mayit perempuan',
        commonMistakes: 'Jangan menganggap remeh sholat jenazah, ini kewajiban bersama umat Islam',
        bacaan_khusus: [
            'Doa mayit dewasa: اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ',
            'Doa mayit anak: اللَّهُمَّ اجْعَلْهُ فَرَطًا وَذُخْرًا لِوَالِدَيْهِ وَشَفِيعًا مُجَابًا'
        ]
    },
    {
        id: 'sholat_istisqa',
        name: 'Sholat Istisqa (Minta Hujan)',
        category: 'khusus',
        type: 'sunnah_muakkad',
        icon: '🌧️',
        rakaat: 2,
        timing: 'Saat kemarau panjang atau kekurangan air',
        arabic: 'صَلَاةُ الْإِسْتِسْقَاءِ',
        latin: 'Shalaatul Istisqa',
        translation: 'Sholat Meminta Hujan',
        description: 'Sholat 2 rakaat berjamaah untuk memohon hujan kepada Allah saat terjadi kemarau atau kekurangan air, diikuti khutbah dan doa bersama',
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 1025, Abu Dawud 1173',
                arabic: 'خَرَجَ رَسُولُ اللَّهِ ﷺ يَسْتَسْقِي فَتَوَضَّأَ وَصَلَّى رَكْعَتَيْنِ وَحَوَّلَ رِدَاءَهُ',
                translation: 'Rasulullah ﷺ keluar untuk istisqa, lalu berwudhu, sholat dua rakaat, dan membalik selendangnya'
            }
        ],
        steps: [
            '1. Keluar ke tanah lapang dengan tawadhu\'',
            '2. Sholat 2 rakaat seperti sholat Ied (dengan takbir tambahan)',
            '3. Imam berkhutbah 2 khutbah',
            '4. Membalik pakaian (ridha) sebagai simbol perubahan',
            '5. Berdoa bersama memohon hujan',
            '6. Perbanyak istighfar dan bertaubat'
        ],
        tips: 'Keluar dengan tawadhu\', memakai pakaian sederhana, banyak beristighfar',
        commonMistakes: 'Yang terpenting adalah taubat dan kembali kepada Allah, bukan hanya ritual sholatnya'
    },
    {
        id: 'sholat_tahajjud',
        name: 'Sholat Tahajjud',
        category: 'khusus',
        type: 'sunnah_muakkad',
        icon: '🌙',
        rakaat: 'Minimal 2 rakaat, bisa sampai 8 atau 12 rakaat',
        timing: 'Sepertiga malam terakhir hingga sebelum Subuh',
        arabic: 'صَلَاةُ التَّهَجُّدِ',
        latin: 'Shalaatul Tahajjud',
        translation: 'Sholat Tahajjud',
        description: 'Sholat malam setelah tidur, merupakan sholat yang sangat dianjurkan dan menjadi kebiasaan para nabi dan orang-orang shalih',
        ruling: 'Sunnah Muakkad',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-Isra: 79',
                arabic: 'وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَكَ عَسَى أَنْ يَبْعَثَكَ رَبُّكَ مَقَامًا مَحْمُودًا',
                translation: 'Dan pada sebagian malam hari bersholat tahajjudlah kamu sebagai suatu ibadah tambahan bagimu; mudah-mudahan Tuhanmu mengangkat kamu ke tempat yang terpuji'
            },
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 1127, Muslim 776',
                arabic: 'أَفْضَلُ الصَّلاَةِ بَعْدَ الْفَرِيضَةِ صَلاَةُ اللَّيْلِ',
                translation: 'Sholat yang paling utama setelah sholat fardhu adalah sholat malam'
            }
        ],
        steps: [
            '1. Bangun di sepertiga malam terakhir',
            '2. Berwudhu dan bersugi (gosok gigi)',
            '3. Mulai dengan 2 rakaat ringan',
            '4. Dilanjutkan sesuai kemampuan (2-2 rakaat)',
            '5. Akhiri dengan sholat Witir',
            '6. Perbanyak doa dan dzikir'
        ],
        tips: 'Mulai sedikit tapi istiqomah, dipanjangkan bacaan dan rukunnya',
        commonMistakes: 'Jangan memaksakan diri di awal, mulai bertahap dan istiqomah'
    }
];