// Database Rukun dan Syarat Sholat berdasarkan Al-Qur'an dan Hadits Shahih
// Sumber: Al-Mukhallashah fil Fiqih, Zad al-Ma'ad, Sifat Sholat Nabi

window.sholatData = [
    // ===== RUKUN SHOLAT (14 RUKUN) =====
    {
        id: 'takbiratul_ihram',
        name: 'Takbiratul Ihram',
        category: 'rukun',
        order: 1,
        icon: '🤲',
        arabic: 'اللَّهُ أَكْبَرُ',
        latin: 'Allahu akbar',
        translation: 'Allah Maha Besar',
        description: 'Rukun pertama dalam sholat yang membuka ibadah dan mengharamkan hal-hal yang membatalkan sholat',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-Muddatsir: 3',
                arabic: 'وَرَبَّكَ فَكَبِّرْ',
                translation: 'Dan Tuhanmu agungkanlah'
            },
            {
                source: 'Hadits',
                reference: 'HR. Abu Dawud 61, Tirmidzi 3',
                arabic: 'مِفْتَاحُ الصَّلاَةِ الطُّهُورُ وَتَحْرِيمُهَا التَّكْبِيرُ وَتَحْلِيلُهَا التَّسْلِيمُ',
                translation: 'Kunci sholat adalah bersuci, yang mengharamkan (hal-hal yang membatalkan) adalah takbir, dan yang menghalalkan adalah salam'
            }
        ],
        tips: 'Angkat kedua tangan setinggi telinga sambil mengucapkan takbir dengan suara yang terdengar oleh diri sendiri',
        commonMistakes: 'Jangan mengangkat tangan terlalu tinggi melampaui kepala atau terlalu rendah di bawah pundak'
    },
    {
        id: 'berdiri_bagi_yang_mampu',
        name: 'Berdiri (Bagi Yang Mampu)',
        category: 'rukun',
        order: 2,
        icon: '🧍',
        arabic: 'الْقِيَامُ',
        latin: 'Al-Qiyam',
        translation: 'Berdiri',
        description: 'Berdiri tegak menghadap kiblat bagi yang mampu, merupakan rukun sholat yang tidak boleh ditinggalkan kecuali ada uzur syar\'i',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-Baqarah: 238',
                arabic: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ',
                translation: 'Peliharalah semua sholat dan sholat wustha. Berdirilah untuk Allah (dalam sholatmu) dengan khusyuk'
            },
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 1117',
                arabic: 'صَلِّ قَائِمًا فَإِنْ لَمْ تَسْتَطِعْ فَقَاعِدًا فَإِنْ لَمْ تَسْتَطِعْ فَعَلَى جَنْبٍ',
                translation: 'Sholatlah dengan berdiri, jika tidak mampu maka duduk, jika tidak mampu maka berbaring miring'
            }
        ],
        tips: 'Berdiri tegak, rileks, kedua kaki rapat atau sedikit terbuka, pandangan ke tempat sujud',
        commonMistakes: 'Jangan bersandar atau berdiri tidak tegak tanpa uzur yang dibenarkan syariat'
    },
    {
        id: 'membaca_fatihah',
        name: 'Membaca Al-Fatihah',
        category: 'rukun',
        order: 3,
        icon: '📖',
        arabic: 'قِرَاءَةُ الْفَاتِحَةِ',
        latin: 'Qira\'atul Fatihah',
        translation: 'Membaca Al-Fatihah',
        description: 'Membaca surat Al-Fatihah secara lengkap dalam setiap rakaat, merupakan rukun yang tidak sah sholat tanpanya',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 756, Muslim 394',
                arabic: 'لَا صَلَاةَ لِمَنْ لَمْ يَقْرَأْ بِفَاتِحَةِ الْكِتَابِ',
                translation: 'Tidak sah sholat bagi orang yang tidak membaca Fatihatul Kitab (Al-Fatihah)'
            },
            {
                source: 'Al-Quran',
                reference: 'QS. Al-Hijr: 87',
                arabic: 'وَلَقَدْ آتَيْنَاكَ سَبْعًا مِّنَ الْمَثَانِي وَالْقُرْآنَ الْعَظِيمَ',
                translation: 'Dan sesungguhnya Kami telah memberikan kepadamu tujuh ayat yang dibaca berulang-ulang (Al-Fatihah) dan Al-Quran yang agung'
            }
        ],
        tips: 'Baca dengan tartil, jelas setiap huruf dan harakatnya, jangan tergesa-gesa',
        commonMistakes: 'Jangan membaca terlalu cepat hingga tidak jelas atau meninggalkan sebagian ayat'
    },
    {
        id: 'ruku_dengan_thumaninah',
        name: 'Ruku\' dengan Tuma\'ninah',
        category: 'rukun',
        order: 4,
        icon: '🙇',
        arabic: 'الرُّكُوعُ',
        latin: 'Ar-Ruku\'',
        translation: 'Ruku\'',
        description: 'Membungkuk hingga kedua telapak tangan dapat menyentuh lutut dengan tuma\'ninah (tenang tidak tergesa-gesa)',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-Hajj: 77',
                arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا ارْكَعُوا وَاسْجُدُوا',
                translation: 'Hai orang-orang yang beriman, rukuklah dan sujudlah'
            }
        ],
        tips: 'Punggung lurus sejajar, kedua tangan di lutut, pandangan ke bawah',
        commonMistakes: 'Jangan ruku\' terlalu sedikit atau tergesa-gesa tanpa tuma\'ninah'
    },
    {
        id: 'iktidal_dengan_thumaninah',
        name: 'I\'tidal dengan Tuma\'ninah',
        category: 'rukun',
        order: 5,
        icon: '🧍',
        arabic: 'الاِعْتِدَالُ',
        latin: 'Al-I\'tidal',
        translation: 'Berdiri tegak kembali',
        description: 'Bangun dari ruku\' kembali ke posisi berdiri tegak dengan tuma\'ninah sebelum melanjutkan ke sujud',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 792',
                arabic: 'ثُمَّ ارْفَعْ حَتَّى تَعْتَدِلَ قَائِمًا',
                translation: 'Kemudian angkat (kepala) hingga kamu berdiri tegak'
            }
        ],
        tips: 'Berdiri tegak sempurna, kedua tangan di samping badan, tenang sejenak',
        commonMistakes: 'Jangan langsung sujud tanpa berdiri tegak terlebih dahulu'
    },
    {
        id: 'sujud_pertama_dengan_thumaninah',
        name: 'Sujud Pertama dengan Tuma\'ninah',
        category: 'rukun',
        order: 6,
        icon: '🤲',
        arabic: 'السُّجُودُ الأَوَّلُ',
        latin: 'As-Sujud al-Awwal',
        translation: 'Sujud Pertama',
        description: 'Sujud dengan tujuh anggota badan (dahi, hidung, kedua telapak tangan, kedua lutut, kedua ujung kaki) dengan tuma\'ninah',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-Hajj: 77',
                arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا ارْكَعُوا وَاسْجُدُوا',
                translation: 'Hai orang-orang yang beriman, rukuklah dan sujudlah'
            },
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 809, Muslim 490',
                arabic: 'أُمِرْتُ أَنْ أَسْجُدَ عَلَى سَبْعَةِ أَعْظُمٍ',
                translation: 'Aku diperintahkan untuk sujud dengan tujuh tulang'
            }
        ],
        tips: 'Letakkan dahi dan hidung ke tanah, kedua tangan terbuka di samping kepala, jari menghadap kiblat',
        commonMistakes: 'Jangan mengangkat sebagian dari tujuh anggota sujud atau tergesa-gesa'
    },
    {
        id: 'duduk_antara_dua_sujud',
        name: 'Duduk Antara Dua Sujud',
        category: 'rukun',
        order: 7,
        icon: '🧘',
        arabic: 'الجُلُوسُ بَيْنَ السَّجْدَتَيْنِ',
        latin: 'Al-Julus baina as-Sajdatain',
        translation: 'Duduk antara dua sujud',
        description: 'Bangun dari sujud pertama ke posisi duduk dengan tuma\'ninah sebelum sujud kedua',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 792',
                arabic: 'ثُمَّ اجْلِسْ حَتَّى تَطْمَئِنَّ جَالِسًا',
                translation: 'Kemudian duduklah hingga kamu tenang dalam duduk'
            }
        ],
        tips: 'Duduk iftirasy (kaki kiri dilipat, kaki kanan ditegakkan), kedua tangan di atas paha',
        commonMistakes: 'Jangan langsung sujud kedua tanpa duduk tenang terlebih dahulu'
    },
    {
        id: 'sujud_kedua_dengan_thumaninah',
        name: 'Sujud Kedua dengan Tuma\'ninah',
        category: 'rukun',
        order: 8,
        icon: '🤲',
        arabic: 'السُّجُودُ الثَّانِي',
        latin: 'As-Sujud ats-Tsani',
        translation: 'Sujud Kedua',
        description: 'Sujud kedua dengan tujuh anggota badan dan tuma\'ninah seperti sujud pertama',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 792',
                arabic: 'ثُمَّ اسْجُدْ حَتَّى تَطْمَئِنَّ سَاجِدًا',
                translation: 'Kemudian sujudlah hingga kamu tenang dalam sujud'
            }
        ],
        tips: 'Sama seperti sujud pertama, tenang dan tidak tergesa-gesa',
        commonMistakes: 'Jangan mempercepat sujud kedua atau mengurangi tuma\'ninah'
    },
    {
        id: 'duduk_akhir',
        name: 'Duduk Akhir untuk Tasyahud',
        category: 'rukun',
        order: 9,
        icon: '🧘',
        arabic: 'الجُلُوسُ الأَخِيرُ',
        latin: 'Al-Julus al-Akhir',
        translation: 'Duduk Akhir',
        description: 'Duduk pada akhir sholat untuk membaca tasyahud akhir dan sholawat atas Nabi',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 1202, Muslim 402',
                arabic: 'كَانَ النَّبِيُّ ﷺ إِذَا قَعَدَ فِي الصَّلَاةِ وَضَعَ كَفَّهُ الْيُمْنَى عَلَى فَخِذِهِ الْيُمْنَى',
                translation: 'Nabi ﷺ apabila duduk dalam sholat, meletakkan telapak tangan kanannya di atas paha kanannya'
            }
        ],
        tips: 'Duduk tawarruk (kedua kaki ke samping kiri) pada tasyahud akhir',
        commonMistakes: 'Jangan berdiri sebelum selesai tasyahud akhir dan sholawat'
    },
    {
        id: 'membaca_tasyahud_akhir',
        name: 'Membaca Tasyahud Akhir',
        category: 'rukun',
        order: 10,
        icon: '📿',
        arabic: 'التَّشَهُّدُ الأَخِيرُ',
        latin: 'At-Tasyahud al-Akhir',
        translation: 'Tasyahud Akhir',
        description: 'Membaca tasyahud akhir yang mencakup kesaksian dan sholawat atas Nabi Muhammad ﷺ',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 6230, Muslim 403',
                arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ...',
                translation: 'Segala penghormatan bagi Allah, dan sholat serta kebaikan...'
            }
        ],
        tips: 'Baca dengan khusyuk dan fahami maknanya, gerakkan telunjuk saat menyebut nama Allah',
        commonMistakes: 'Jangan meninggalkan sholawat atas Nabi dalam tasyahud akhir'
    },
    {
        id: 'sholawat_atas_nabi',
        name: 'Sholawat atas Nabi',
        category: 'rukun',
        order: 11,
        icon: '💚',
        arabic: 'الصَّلَاةُ عَلَى النَّبِيِّ',
        latin: 'As-Sholatu \'ala an-Nabiyy',
        translation: 'Sholawat atas Nabi',
        description: 'Membaca sholawat atas Nabi Muhammad ﷺ dalam tasyahud akhir sebagai bagian dari rukun sholat',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 6357, Muslim 406',
                arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ...',
                translation: 'Ya Allah, limpahkanlah sholawat atas Muhammad dan keluarga Muhammad...'
            }
        ],
        tips: 'Perbanyak variasi sholawat yang diajarkan Rasulullah ﷺ',
        commonMistakes: 'Jangan meninggalkan sholawat dalam tasyahud akhir karena ini rukun'
    },
    {
        id: 'salam_pertama',
        name: 'Salam Pertama (Kanan)',
        category: 'rukun',
        order: 12,
        icon: '👋',
        arabic: 'السَّلَامُ الأَوَّلُ',
        latin: 'As-Salam al-Awwal',
        translation: 'Salam Pertama',
        description: 'Mengucapkan salam ke kanan sebagai penutup sholat yang menghalalkan hal-hal yang diharamkan takbir',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Abu Dawud 61, Tirmidzi 3',
                arabic: 'وَتَحْلِيلُهَا التَّسْلِيمُ',
                translation: 'Dan yang menghalalkan (sholat) adalah salam'
            },
            {
                source: 'Hadits',
                reference: 'HR. Muslim 591',
                arabic: 'كَانَ رَسُولُ اللَّهِ ﷺ يُسَلِّمُ عَنْ يَمِينِهِ وَعَنْ شِمَالِهِ',
                translation: 'Rasulullah ﷺ memberi salam ke kanan dan ke kiri'
            }
        ],
        tips: 'Palingkan wajah ke kanan sambil mengucapkan "Assalamu\'alaikum warahmatullahi wabarakatuh"',
        commonMistakes: 'Jangan hanya mengucapkan "Assalamu\'alaikum" tanpa warahmatullah'
    },

    // ===== ADAB DAN SUNNAH TAMBAHAN =====
    {
        id: 'adab_masuk_masjid',
        name: 'Adab Masuk Masjid',
        category: 'sunnah',
        type: 'adab',
        icon: '🕌',
        position: 'Sebelum sholat',
        arabic: 'بِسْمِ اللهِ، اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
        latin: 'Bismillah, Allahumma shalli \'ala Muhammad',
        translation: 'Dengan nama Allah, ya Allah limpahkanlah sholawat atas Muhammad',
        description: 'Doa dan adab ketika memasuki masjid dengan kaki kanan terlebih dahulu',
        ruling: 'Sunnah Mustahab',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Abu Dawud 466, dishahihkan Al-Albani',
                arabic: 'إِذَا دَخَلَ أَحَدُكُمُ الْمَسْجِدَ فَلْيَقُلْ: اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
                translation: 'Jika salah seorang dari kalian masuk masjid, hendaklah ia berkata: Ya Allah bukakanlah untukku pintu-pintu rahmat-Mu'
            }
        ],
        tips: 'Masuk dengan kaki kanan, keluar dengan kaki kiri',
        commonMistakes: 'Jangan masuk masjid dengan tergesa-gesa tanpa doa'
    },
    {
        id: 'adab_keluar_masjid',
        name: 'Adab Keluar Masjid',
        category: 'sunnah',
        type: 'adab',
        icon: '🚪',
        position: 'Setelah sholat',
        arabic: 'بِسْمِ اللهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ',
        latin: 'Bismillah, Allahumma inni as\'aluka min fadhlika wa rahmatik',
        translation: 'Dengan nama Allah, ya Allah aku memohon kepada-Mu dari karunia dan rahmat-Mu',
        description: 'Doa dan adab ketika keluar dari masjid dengan kaki kiri terlebih dahulu',
        ruling: 'Sunnah Mustahab',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Muslim 713',
                arabic: 'وَإِذَا خَرَجَ فَلْيَقُلْ: اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ',
                translation: 'Dan jika keluar hendaklah berkata: Ya Allah aku memohon kepada-Mu dari karunia dan rahmat-Mu'
            }
        ],
        tips: 'Keluar dengan kaki kiri, jangan buru-buru setelah sholat',
        commonMistakes: 'Jangan langsung keluar tanpa dzikir dan doa'
    },
    {
        id: 'tahiyatul_masjid',
        name: 'Tahiyatul Masjid',
        category: 'sunnah',
        type: 'sunnah_khusus',
        icon: '🕌',
        position: 'Ketika masuk masjid',
        arabic: 'تَحِيَّةُ الْمَسْجِدِ',
        latin: 'Tahiyyatul Masjid',
        translation: 'Salam kepada masjid',
        description: 'Sholat sunnah 2 rakaat yang dikerjakan ketika masuk masjid sebelum duduk',
        ruling: 'Sunnah Muakkad',
        rakaat: 2,
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 1163, Muslim 714',
                arabic: 'إِذَا دَخَلَ أَحَدُكُمُ الْمَسْجِدَ فَلْيَرْكَعْ رَكْعَتَيْنِ قَبْلَ أَنْ يَجْلِسَ',
                translation: 'Jika salah seorang dari kalian masuk masjid, hendaklah ia sholat dua rakaat sebelum duduk'
            }
        ],
        tips: 'Dikerjakan setiap kali masuk masjid, kecuali saat khutbah Jumat',
        commonMistakes: 'Jangan langsung duduk tanpa sholat tahiyatul masjid'
    },
    {
        id: 'istinja_dan_wudhu',
        name: 'Istinja dan Wudhu',
        category: 'syarat',
        type: 'thaharah',
        icon: '💧',
        position: 'Sebelum sholat',
        arabic: 'الطَّهَارَةُ',
        latin: 'Ath-Thaharah',
        translation: 'Bersuci',
        description: 'Bersuci dari hadats kecil dengan wudhu dan hadats besar dengan mandi wajib',
        ruling: 'Syarat Sah Sholat',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-Maidah: 6',
                arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ',
                translation: 'Hai orang-orang yang beriman, apabila kamu hendak mengerjakan sholat, maka basuhlah mukamu dan tanganmu sampai dengan siku'
            }
        ],
        tips: 'Pastikan wudhu sempurna dan tidak ada yang membatalkan',
        commonMistakes: 'Jangan sholat dalam keadaan tidak suci'
    },
    {
        id: 'menutup_aurat',
        name: 'Menutup Aurat',
        category: 'syarat',
        type: 'pakaian',
        icon: '👕',
        position: 'Selama sholat',
        arabic: 'سَتْرُ الْعَوْرَةِ',
        latin: 'Satrul \'Awrah',
        translation: 'Menutup aurat',
        description: 'Menutup bagian tubuh yang wajib ditutupi saat sholat sesuai syariat Islam',
        ruling: 'Syarat Sah Sholat',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-A\'raf: 31',
                arabic: 'يَا بَنِي آدَمَ خُذُوا زِينَتَكُمْ عِندَ كُلِّ مَسْجِدٍ',
                translation: 'Hai anak Adam, pakailah pakaianmu yang indah di setiap (memasuki) masjid'
            }
        ],
        tips: 'Laki-laki: pusar hingga lutut. Perempuan: seluruh tubuh kecuali wajah dan telapak tangan',
        commonMistakes: 'Pastikan pakaian tidak tembus pandang atau terlalu ketat'
    },
    {
        id: 'menghadap_kiblat',
        name: 'Menghadap Kiblat',
        category: 'syarat',
        type: 'arah',
        icon: '🧭',
        position: 'Selama sholat',
        arabic: 'اسْتِقْبَالُ الْقِبْلَةِ',
        latin: 'Istiqbalul Qiblah',
        translation: 'Menghadap kiblat',
        description: 'Menghadap ke arah Ka\'bah di Masjidil Haram, Makkah saat melakukan sholat',
        ruling: 'Syarat Sah Sholat',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-Baqarah: 144',
                arabic: 'فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ ۚ وَحَيْثُ مَا كُنتُمْ فَوَلُّوا وُجُوهَكُمْ شَطْرَهُ',
                translation: 'Maka palingkanlah mukamu ke arah Masjidil Haram, dan dimana saja kamu berada, palingkanlah mukamu ke arahnya'
            }
        ],
        tips: 'Gunakan kompas atau aplikasi kiblat untuk memastikan arah',
        commonMistakes: 'Jangan asal mengira arah kiblat tanpa memastikan'
    },
    {
        id: 'tertib_rukun',
        name: 'Tertib (Urutan Rukun)',
        category: 'rukun',
        order: 14,
        icon: '📋',
        arabic: 'التَّرْتِيبُ',
        latin: 'At-Tartib',
        translation: 'Tertib/Urutan',
        description: 'Melakukan rukun-rukun sholat sesuai urutan yang telah ditetapkan, tidak boleh mendahului atau mengakhirkan',
        ruling: 'Rukun (Wajib)',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Bukhari 6667, Muslim 397',
                arabic: 'صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي',
                translation: 'Sholatlah kalian sebagaimana kalian melihat aku sholat'
            }
        ],
        tips: 'Pelajari urutan rukun sholat dengan baik dan konsisten menerapkannya',
        commonMistakes: 'Jangan mengubah urutan rukun sholat karena akan membatalkan sholat'
    },

    // ===== SYARAT SHOLAT =====
    {
        id: 'masuk_waktu_sholat',
        name: 'Masuk Waktu Sholat',
        category: 'syarat',
        order: 1,
        icon: '🕐',
        arabic: 'دُخُولُ الْوَقْتِ',
        latin: 'Dukhul al-Waqt',
        translation: 'Masuknya Waktu',
        description: 'Sholat harus dilakukan pada waktunya yang telah ditentukan, merupakan syarat sah yang tidak boleh dilanggar',
        ruling: 'Syarat Sah',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. An-Nisa: 103',
                arabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
                translation: 'Sesungguhnya sholat itu adalah fardhu yang ditentukan waktunya atas orang-orang yang beriman'
            }
        ],
        tips: 'Pelajari waktu-waktu sholat dengan akurat, jangan menunda sholat hingga mendekati habis waktu',
        commonMistakes: 'Jangan sholat sebelum masuk waktu atau setelah habis waktu tanpa uzur syar\'i'
    },
    {
        id: 'bersuci_dari_hadats',
        name: 'Bersuci dari Hadats',
        category: 'syarat',
        order: 2,
        icon: '🚿',
        arabic: 'الطَّهَارَةُ مِنَ الْحَدَثِ',
        latin: 'At-Thaharatu min al-Hadats',
        translation: 'Bersuci dari Hadats',
        description: 'Berwudhu untuk hadats kecil atau mandi untuk hadats besar sebelum sholat',
        ruling: 'Syarat Sah',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-Maidah: 6',
                arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ',
                translation: 'Hai orang-orang yang beriman, apabila kamu hendak mengerjakan sholat, maka basuhlah mukamu'
            }
        ],
        tips: 'Pastikan wudhu atau mandi sesuai tata cara yang benar, jaga agar tidak batal sebelum sholat',
        commonMistakes: 'Jangan sholat dalam keadaan hadats atau ragu-ragu tentang kesucian'
    },
    {
        id: 'bersuci_dari_najis',
        name: 'Bersuci dari Najis',
        category: 'syarat',
        order: 3,
        icon: '🧼',
        arabic: 'الطَّهَارَةُ مِنَ النَّجَاسَةِ',
        latin: 'At-Thaharatu min an-Najasah',
        translation: 'Bersuci dari Najis',
        description: 'Membersihkan badan, pakaian, dan tempat sholat dari najis',
        ruling: 'Syarat Sah',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-Muddatsir: 4',
                arabic: 'وَثِيَابَكَ فَطَهِّرْ',
                translation: 'Dan pakaianmu bersihkanlah'
            }
        ],
        tips: 'Periksa badan, pakaian, dan tempat sholat dari najis sebelum sholat',
        commonMistakes: 'Jangan mengabaikan najis kecil yang terlihat atau tercium'
    },
    {
        id: 'menutup_aurat',
        name: 'Menutup Aurat',
        category: 'syarat',
        order: 4,
        icon: '👔',
        arabic: 'سَتْرُ الْعَوْرَةِ',
        latin: 'Satru al-\'Awrah',
        translation: 'Menutup Aurat',
        description: 'Menutup aurat sesuai ketentuan syariat dalam sholat',
        ruling: 'Syarat Sah',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-A\'raf: 31',
                arabic: 'يَا بَنِي آدَمَ خُذُوا زِينَتَكُمْ عِندَ كُلِّ مَسْجِدٍ',
                translation: 'Hai anak Adam, pakailah pakaianmu yang indah di setiap (memasuki) masjid'
            }
        ],
        tips: 'Laki-laki: dari pusat hingga lutut. Perempuan: seluruh tubuh kecuali wajah dan telapak tangan',
        commonMistakes: 'Jangan memakai pakaian transparan atau terlalu ketat'
    },
    {
        id: 'menghadap_kiblat',
        name: 'Menghadap Kiblat',
        category: 'syarat',
        order: 5,
        icon: '🕋',
        arabic: 'اسْتِقْبَالُ الْقِبْلَةِ',
        latin: 'Istiqbal al-Qiblah',
        translation: 'Menghadap Kiblat',
        description: 'Menghadap ke arah Ka\'bah di Makkah saat sholat bagi yang mampu mengetahui arahnya',
        ruling: 'Syarat Sah',
        dalil: [
            {
                source: 'Al-Quran',
                reference: 'QS. Al-Baqarah: 144',
                arabic: 'فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ',
                translation: 'Maka palingkanlah wajahmu ke arah Masjidil Haram'
            }
        ],
        tips: 'Gunakan kompas atau aplikasi kiblat yang akurat, ijtihad jika tidak tahu pasti',
        commonMistakes: 'Jangan sholat memunggungi kiblat atau serong tanpa uzur'
    },
    {
        id: 'berakal_dan_tamyiz',
        name: 'Berakal dan Tamyiz',
        category: 'syarat',
        order: 6,
        icon: '🧠',
        arabic: 'الْعَقْلُ وَالتَّمْيِيزُ',
        latin: 'Al-\'Aqlu wat-Tamyiz',
        translation: 'Berakal dan Tamyiz',
        description: 'Memiliki akal sehat dan kemampuan membedakan (tamyiz) untuk memahami sholat',
        ruling: 'Syarat Wajib',
        dalil: [
            {
                source: 'Hadits',
                reference: 'HR. Abu Dawud 4403, dishahihkan Al-Albani',
                arabic: 'رُفِعَ الْقَلَمُ عَنْ ثَلَاثَةٍ عَنِ الْمَجْنُونِ حَتَّى يُفِيقَ',
                translation: 'Diangkat pena (pencatat amal) dari tiga orang: dari orang gila hingga dia sadar'
            }
        ],
        tips: 'Anak yang sudah tamyiz (sekitar 7 tahun) mulai dilatih sholat',
        commonMistakes: 'Tidak memaksa orang yang tidak berakal untuk sholat'
    }
];

// Categories untuk navigasi
window.sholatCategories = [
    {
        id: 'rukun',
        name: 'Rukun Sholat',
        icon: '🕌',
        description: '14 rukun wajib dalam sholat yang tidak boleh ditinggalkan',
        count: 14
    },
    {
        id: 'syarat',
        name: 'Syarat Sholat',
        icon: '✅',
        description: 'Syarat wajib dan syarat sah yang harus dipenuhi sebelum sholat',
        count: 6
    },
    {
        id: 'sunnah',
        name: 'Sunnah Sholat',
        icon: '⭐',
        description: 'Sunnah qabliyah, ba\'diyah, dan sunnah dalam sholat',
        count: 12
    },
    {
        id: 'bacaan',
        name: 'Bacaan Sholat',
        icon: '📖',
        description: 'Bacaan wajib dan sunnah dalam setiap gerakan sholat',
        count: 15
    },
    {
        id: 'khusus',
        name: 'Sholat Khusus',
        icon: '🌙',
        description: 'Tata cara sholat Jumat, Eid, Tarawih, Witir, dan lainnya',
        count: 8
    },
    {
        id: 'doa',
        name: 'Doa Setelah Sholat',
        icon: '🤲',
        description: 'Doa-doa ma\'tsur yang dianjurkan setelah sholat',
        count: 10
    },
    {
        id: 'kesalahan',
        name: 'Kesalahan Umum',
        icon: '⚠️',
        description: 'Hal-hal yang membatalkan atau makruh dalam sholat',
        count: 8
    },
    {
        id: 'tata_cara',
        name: 'Tata Cara Lengkap',
        icon: '📋',
        description: 'Panduan step-by-step sholat dari takbir hingga salam',
        count: 4
    }
];