// Database Sahabat Utama
// Berdasarkan riwayat shahih dari Al-Quran, hadits, dan atsar

const sahabatDatabase = [
    {
        id: 'abu-bakar',
        name: 'Abu Bakar Ash-Shiddiq',
        arabicName: 'أبو بكر',
        title: 'Khalifatur Rasulillah Radhiyallahu \'Anhu',
        category: 'sahabat',
        subcategory: 'khulafaur-rasyidin',
        period: '573-634 M / 61 tahun',
        periodHijri: '47 SH - 13 H',
        birthPlace: 'Makkah',
        tribe: 'Quraisy (Banu Taim)',
        father: 'Abu Quhafah (Utsman bin Amir)',
        mother: 'Ummu Khair (Salma binti Shakhr)',
        wife: ['Qutailah binti Abdul Uzza', 'Ummu Ruman', 'Asma binti Umais', 'Habibah binti Kharijah'],
        children: ['Abdullah', 'Aisyah', 'Asma', 'Abdul Rahman', 'Ummu Kultsum', 'Muhammad'],
        profession: 'Pedagang, Khalifah',
        qualities: ['Ash-Shiddiq', 'Sahabat terbaik', 'Dermawan', 'Tawadhu\'', 'Tegas dalam kebenaran'],
        biography: 'Abu Bakar Ash-Shiddiq adalah sahabat terdekat Rasulullah dan khalifah pertama setelah wafatnya Nabi. Beliau dijuluki Ash-Shiddiq karena langsung membenarkan peristiwa Isra Mi\'raj. Abu Bakar terkenal dengan kedermawanannya, keberanian dalam membela Islam, dan kepemimpinannya yang bijaksana dalam menjaga persatuan umat.',
        majorEvents: [
            {
                event: 'Masuk Islam pertama kali',
                year: '610 M / 13 SH',
                description: 'Menjadi orang dewasa pertama yang masuk Islam dan langsung membenarkan dakwah Rasulullah',
                references: ['Sirah Ibn Hisyam 1/245', 'Tabaqat Ibn Sa\'d 3/169']
            },
            {
                event: 'Membenarkan Isra Mi\'raj',
                year: '621 M / 2 SH',
                description: 'Langsung membenarkan peristiwa Isra Mi\'raj sehingga diberi gelar Ash-Shiddiq',
                references: ['Sirah Ibn Hisyam 1/398', 'Dalail an-Nubuwwah 2/355']
            },
            {
                event: 'Menemani Hijrah',
                year: '622 M / 1 H',
                description: 'Menemani Rasulullah hijrah ke Madinah dan bersembunyi di Gua Tsur',
                references: ['Shahih Bukhari 3905', 'QS. At-Taubah: 40']
            },
            {
                event: 'Memimpin shalat saat Nabi sakit',
                year: '632 M / 11 H',
                description: 'Ditunjuk Rasulullah untuk memimpin shalat saat beliau sakit menjelang wafat',
                references: ['Shahih Bukhari 4445', 'Shahih Muslim 418']
            },
            {
                event: 'Dibaiat menjadi Khalifah',
                year: '632 M / 11 H',
                description: 'Dibaiat oleh para sahabat menjadi khalifah pertama di Saqifah Bani Sa\'idah',
                references: ['Tabaqat Ibn Sa\'d 3/183', 'Tarikh ath-Thabari 2/244']
            }
        ],
        lessons: [
            'Kesetiaan dan persahabatan sejati kepada Rasulullah',
            'Kedermawanan dalam mengorbankan harta untuk Islam',
            'Ketegasan dalam menjaga kemurnian ajaran Islam',
            'Kepemimpinan yang bijaksana dalam masa krisis'
        ],
        references: [
            'Al-Quran: QS. At-Taubah: 40',
            'Shahih Bukhari: 3905, 4445, 5063',
            'Shahih Muslim: 418, 2381',
            'Tabaqat Ibn Sa\'d: Jilid 3',
            'Sirah Ibn Hisyam tentang hijrah'
        ],
        haditsShahih: [
            {
                arabic: 'مَا نَفَعَنِي مَالٌ قَطُّ مَا نَفَعَنِي مَالُ أَبِي بَكْرٍ',
                latin: 'Ma nafa\'anii malun qattu ma nafa\'anii malu Abi Bakr',
                translation: 'Tidak ada harta yang memberi manfaat kepadaku seperti harta Abu Bakar',
                source: 'HR. At-Tirmidzi 3661, dishahihkan Al-Albani'
            }
        ]
    },
    {
        id: 'umar-ibn-khattab',
        name: 'Umar bin Al-Khattab',
        arabicName: 'عمر',
        title: 'Al-Faruq Radhiyallahu \'Anhu',
        category: 'sahabat',
        subcategory: 'khulafaur-rasyidin',
        period: '584-644 M / 60 tahun',
        periodHijri: '40 SH - 23 H',
        birthPlace: 'Makkah',
        tribe: 'Quraisy (Banu Adi)',
        father: 'Al-Khattab bin Nufail',
        mother: 'Hantamah binti Hisyam',
        wife: ['Zainab binti Mazh\'un', 'Mulaikah binti Jarwal', 'Quraibah binti Abi Umayyah', 'Ummu Hakim binti Al-Harits'],
        children: ['Abdullah', 'Hafshah', 'Zaid', 'Ubaidullah', 'Abdul Rahman', 'Asim'],
        profession: 'Khalifah, Panglima',
        qualities: ['Al-Faruq', 'Adil', 'Tegas', 'Zuhud', 'Visioner'],
        biography: 'Umar bin Al-Khattab adalah khalifah kedua yang dijuluki Al-Faruq karena kemampuannya membedakan antara haq dan batil. Sebelum Islam, beliau termasuk yang memusuhi Muslims, namun setelah masuk Islam menjadi salah satu pejuang terdepan. Sebagai khalifah, Umar memperluas wilayah Islam dan membangun sistem pemerintahan yang adil.',
        majorEvents: [
            {
                event: 'Masuk Islam',
                year: '616 M / 6 SH',
                description: 'Masuk Islam setelah mendengar bacaan Al-Quran dari adiknya Fatimah',
                references: ['Sirah Ibn Hisyam 1/344', 'Tabaqat Ibn Sa\'d 3/265']
            },
            {
                event: 'Diangkat menjadi Khalifah',
                year: '634 M / 13 H',
                description: 'Diangkat menjadi khalifah kedua atas wasiat Abu Bakar',
                references: ['Tabaqat Ibn Sa\'d 3/274', 'Tarikh ath-Thabari 2/353']
            },
            {
                event: 'Penaklukan Baitul Maqdis',
                year: '638 M / 17 H',
                description: 'Memimpin penaklukan Baitul Maqdis dan menerima kunci kota secara damai',
                references: ['Tarikh ath-Thabari 2/449', 'Al-Bidayah wan Nihayah 7/68']
            }
        ],
        lessons: [
            'Keberanian dalam menyatakan kebenaran tanpa takut',
            'Keadilan dalam memimpin tanpa membeda-bedakan',
            'Kesederhanaan hidup meski memimpin imperium besar',
            'Visi jauh ke depan dalam membangun peradaban'
        ],
        references: [
            'Shahih Bukhari: 3700, 4269, 5063',
            'Shahih Muslim: 2389, 1763',
            'Tabaqat Ibn Sa\'d: Jilid 3',
            'Tarikh ath-Thabari: Jilid 2'
        ],
        haditsShahih: [
            {
                arabic: 'لَقَدْ كَانَ فِيمَنْ كَانَ قَبْلَكُمْ مِنَ الأُمَمِ رِجَالٌ مُحَدَّثُونَ فَإِنْ يَكُنْ فِي أُمَّتِي مِنْهُمْ أَحَدٌ فَعُمَرُ',
                latin: 'Laqad kana fiiman kana qablakum minal umami rijalun muhaddasuna fa in yakun fi ummatii minhum ahadun fa\'Umar',
                translation: 'Sungguh telah ada pada umat sebelum kalian orang-orang yang diajak bicara (oleh malaikat), jika ada di umatku salah seorang dari mereka, maka dialah Umar',
                source: 'HR. Bukhari 3689'
            }
        ]
    },
    {
        id: 'aisyah-binti-abi-bakar',
        name: 'Aisyah binti Abi Bakar',
        arabicName: 'عائشة',
        title: 'Ummul Mu\'minin Radhiyallahu \'Anha',
        category: 'sahabat',
        subcategory: 'sahabat-wanita',
        period: '613-678 M / 65 tahun',
        periodHijri: '9 SH - 58 H',
        birthPlace: 'Makkah',
        tribe: 'Quraisy (Banu Taim)',
        father: 'Abu Bakar Ash-Shiddiq',
        mother: 'Ummu Ruman',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Ummul Mu\'minin, Ulama',
        qualities: ['Ummul Mu\'minin', 'Alimah', 'Faqihah', 'Cerdas', 'Pemberani'],
        biography: 'Aisyah binti Abi Bakar adalah istri Rasulullah yang paling muda dan paling dicintai. Beliau dikenal sangat cerdas, alim, dan menjadi rujukan para sahabat dalam masalah fiqih dan hadits. Aisyah meriwayatkan lebih dari 2000 hadits dan menjadi guru bagi banyak sahabat dan tabiin.',
        majorEvents: [
            {
                event: 'Menikah dengan Rasulullah',
                year: '622 M / 1 H',
                description: 'Menikah dengan Rasulullah di Madinah pada usia 9 tahun',
                references: ['Shahih Bukhari 5134', 'Shahih Muslim 1422']
            },
            {
                event: 'Peristiwa Ifki',
                year: '627 M / 6 H',
                description: 'Difitnah oleh kaum munafik, lalu dibersihkan Allah melalui wahyu',
                references: ['QS. An-Nur: 11-20', 'Shahih Bukhari 4750']
            },
            {
                event: 'Rasulullah wafat di pangkuannya',
                year: '632 M / 11 H',
                description: 'Rasulullah menghembuskan napas terakhir di pangkuan dan di kamarnya',
                references: ['Shahih Bukhari 4448', 'Shahih Muslim 2443']
            }
        ],
        lessons: [
            'Keutamaan menuntut ilmu bagi wanita muslimah',
            'Pentingnya menjaga kehormatan dari fitnah dan dusta',
            'Peran mulia sebagai pendidik dan penyebar ilmu',
            'Kedudukan tinggi istri-istri Nabi sebagai Ummahatul Mu\'minin'
        ],
        references: [
            'Al-Quran: QS. An-Nur: 11-20',
            'Shahih Bukhari: 5134, 4750, 4448',
            'Shahih Muslim: 1422, 2443',
            'Tabaqat Ibn Sa\'d: Jilid 8'
        ],
        haditsShahih: [
            {
                arabic: 'فَضْلُ عَائِشَةَ عَلَى النِّسَاءِ كَفَضْلِ الثَّرِيدِ عَلَى سَائِرِ الطَّعَامِ',
                latin: 'Fadhlu \'A\'isyata \'alan nisai kafadhlit tsariidi \'ala sa\'iril tha\'am',
                translation: 'Keutamaan Aisyah atas wanita-wanita lain seperti keutamaan tsarid atas makanan lainnya',
                source: 'HR. Bukhari 3770'
            }
        ]
    }
];

// Export untuk digunakan
export { sahabatDatabase };