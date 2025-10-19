// Database Nabi dan Rasul - Part 4 (5 Nabi: Daud - Ilyas)

const nabiPart4 = [
    {
        id: 'daud',
        name: 'Daud',
        arabicName: 'داود',
        title: 'Nabi dan Raja \'Alaihissalam',
        category: 'nabi',
        subcategory: 'rasul',
        period: 'Disebutkan memerintah sekitar 40 tahun',
        periodHijri: 'Jauh sebelum zaman Nabi Muhammad',
        birthPlace: 'Tanah Suci (Palestina)',
        deathPlace: 'Baitul Maqdis (Yerusalem)',
        tribe: 'Bani Israil',
        father: 'Disebutkan dari keluarga saleh',
        mother: 'tidak diketahui',
        wife: ['Beberapa istri menurut syariat saat itu'],
        children: ['Sulaiman', 'Absalom', 'dan anak-anak lainnya'],
        profession: 'Nabi, Rasul, Raja, penggembala, ahli besi',
        qualities: ['Suara merdu (tilawah Zabur)', 'Kuat', 'Adil', 'Tawadhu\'', 'Ahli perang', 'Pandai besi'],
        biography: 'Nabi Daud \'alaihissalam adalah nabi yang dikaruniai suara merdu hingga gunung dan burung ikut berdzikir bersamanya. Beliau mengalahkan Jalut (Goliath) saat masih muda, menjadi raja Bani Israil, dan menerima Kitab Zabur. Daud juga ahli dalam membuat baju besi dan berbagai kerajinan logam.',
        majorEvents: [
            {
                event: 'Tumbuh sebagai penggembala muda',
                year: 'Masa kanak-kanak',
                description: 'Daud tumbuh sebagai anak bungsu dari 8 bersaudara, bekerja sebagai penggembala kambing ayahnya',
                references: ['Riwayat dalam kitab-kitab sirah']
            },
            {
                event: 'Dipilih untuk melawan Jalut (Goliath)',
                year: 'Masa remaja',
                description: 'Raja Talut memilih para pemuda untuk berperang, termasuk Daud yang masih muda',
                references: ['QS. Al-Baqarah: 249-251']
            },
            {
                event: 'Mengalahkan Jalut dengan ketapel',
                year: 'Dalam peperangan',
                description: 'Daud yang masih remaja berhasil membunuh Jalut yang raksasa dengan ketapel dan batu kecil',
                references: ['QS. Al-Baqarah: 251']
            },
            {
                event: 'Diberi kerajaan dan hikmah oleh Allah',
                year: 'Setelah mengalahkan Jalut',
                description: 'Allah memberikan kerajaan, hikmah, dan berbagai ilmu kepada Daud setelah kemenangannya',
                references: ['QS. Al-Baqarah: 251']
            },
            {
                event: 'Diangkat menjadi nabi dan raja',
                year: 'Masa dewasa',
                description: 'Daud diangkat Allah menjadi nabi dan raja Bani Israil menggantikan Raja Talut',
                references: ['QS. Al-An\'am: 84', 'QS. Shad: 20']
            },
            {
                event: 'Menerima Kitab Zabur',
                year: 'Setelah menjadi nabi',
                description: 'Allah menurunkan Kitab Zabur kepada Daud yang berisi pujian dan doa-doa',
                references: ['QS. Al-Isra: 55', 'QS. Al-Anbiya: 105']
            },
            {
                event: 'Diajarkan membuat baju besi',
                year: 'Masa kenabian',
                description: 'Allah mengajarkan Daud cara membuat baju besi yang kuat namun fleksibel untuk perang',
                references: ['QS. Al-Anbiya: 80', 'QS. Saba: 10-11']
            },
            {
                event: 'Gunung dan burung ikut berdzikir bersamanya',
                year: 'Selama kenabian',
                description: 'Ketika Daud membaca Zabur, gunung-gunung dan burung-burung ikut bertasbih bersamanya',
                references: ['QS. Al-Anbiya: 79', 'QS. Shad: 18-19', 'QS. Saba: 10']
            },
            {
                event: 'Ujian dua orang yang bersengketa',
                year: 'Masa menjadi hakim',
                description: 'Dua orang (malaikat dalam penyamaran) datang bersengketa untuk menguji keadilan Daud dalam memutuskan perkara',
                references: ['QS. Shad: 21-24']
            },
            {
                event: 'Bertaubat dan memohon ampun',
                year: 'Setelah ujian',
                description: 'Daud menyadari ujian tersebut, bertaubat kepada Allah dan memohon ampun atas kelalaiannya',
                references: ['QS. Shad: 24-25']
            },
            {
                event: 'Menjadi khalifah di muka bumi',
                year: 'Masa pemerintahan',
                description: 'Allah mengangkat Daud sebagai khalifah di muka bumi dan memerintahkannya memutuskan perkara dengan adil',
                references: ['QS. Shad: 26']
            },
            {
                event: 'Membangun kerajaan yang adil dan makmur',
                year: 'Selama 40 tahun memerintah',
                description: 'Daud memimpin Bani Israil dengan adil, membangun kekuatan militer dan kemakmuran ekonomi',
                references: ['Riwayat dalam kitab tarikh']
            },
            {
                event: 'Sulaiman dipersiapkan sebagai penerus',
                year: 'Akhir pemerintahan',
                description: 'Daud mempersiapkan anaknya Sulaiman untuk menjadi penerusnya sebagai raja dan nabi',
                references: ['QS. Al-Anbiya: 78-79']
            }
        ],
        lessons: [
            'Kekuatan sejati berasal dari Allah, bukan dari fisik',
            'Pentingnya keadilan dalam memimpin dan memutuskan perkara',
            'Berdzikir dan bertasbih dapat mempengaruhi alam semesta',
            'Skill dan keahlian dunia juga penting dalam dakwah',
            'Taubat dan istighfar ketika menyadari kesalahan'
        ],
        references: [
            'Al-Quran: QS. Al-Baqarah: 249-251',
            'Al-Quran: QS. Al-Anbiya: 78-80',
            'Al-Quran: QS. Saba: 10-11',
            'Al-Quran: QS. Shad: 17-26',
            'Al-Quran: QS. Al-Isra: 55',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya',
            'Tafsir Ibn Katsir: Surah Al-Baqarah dan Shad',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'أَحَبُّ الصِّيَامِ إِلَى اللَّهِ صِيَامُ دَاوُدَ كَانَ يَصُومُ يَوْمًا وَيُفْطِرُ يَوْمًا',
                latin: 'Ahabbu ash-shiyami ilallahi shiyamu Dawud, kana yasumu yawman wa yuftiru yawman',
                translation: 'Puasa yang paling disukai Allah adalah puasa Daud, dia berpuasa sehari dan berbuka sehari',
                source: 'HR. Bukhari 1976'
            },
            {
                arabic: 'أَحَبُّ الصَّلاَةِ إِلَى اللَّهِ صَلاَةُ دَاوُدَ وَأَحَبُّ الصِّيَامِ إِلَى اللَّهِ صِيَامُ دَاوُدَ',
                latin: 'Ahabbu ash-shalati ilallahi shalatu Dawud wa ahabbu ash-shiyami ilallahi shiyamu Dawud',
                translation: 'Shalat yang paling disukai Allah adalah shalatnya Daud, dan puasa yang paling disukai Allah adalah puasanya Daud',
                source: 'HR. Bukhari 1131'
            }
        ]
    },
    {
        id: 'sulaiman',
        name: 'Sulaiman',
        arabicName: 'سليمان',
        title: 'Nabi dan Raja \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'Sekitar 53 tahun',
        periodHijri: 'Sekitar 950 tahun sebelum hijrah',
        birthPlace: 'Yerusalem (Baitul Maqdis)',
        deathPlace: 'Yerusalem',
        tribe: 'Bani Israil (suku Yahuda)',
        father: 'Daud',
        mother: 'Batsyeba',
        wife: ['Ratu Saba (Bilqis)', 'istri-istri lainnya'],
        children: ['Rahabam', 'dan anak-anak lainnya'],
        profession: 'Nabi, Rasul, Raja terbesar dalam sejarah',
        qualities: ['Hikmah luar biasa', 'Memahami bahasa hewan', 'Menguasai jin', 'Adil', 'Bijaksana', 'Kaya raya'],
        biography: 'Nabi Sulaiman \'alaihissalam adalah raja terbesar dalam sejarah yang menguasai manusia, jin, dan hewan. Allah memberikannya kerajaan yang tidak akan diberikan kepada siapapun setelahnya. Sulaiman membangun Baitul Maqdis (Masjid Al-Aqsha) dan terkenal dengan hikayahnya bersama Ratu Saba (Bilqis).',
        majorEvents: [
            {
                event: 'Menunjukkan hikmah dalam memutuskan perkara',
                year: 'Masa muda',
                description: 'Sulaiman menunjukkan kebijaksanaan luar biasa dalam memutuskan sengketa dua wanita tentang bayi',
                references: ['QS. Al-Anbiya: 78-79']
            },
            {
                event: 'Mewarisi kerajaan dan kenabian dari Daud',
                year: 'Setelah Daud wafat',
                description: 'Sulaiman mewarisi kerajaan dan kenabian ayahnya serta diberikan ilmu yang luar biasa',
                references: ['QS. An-Naml: 16']
            },
            {
                event: 'Diajarkan bahasa burung dan hewan',
                year: 'Awal pemerintahan',
                description: 'Allah mengajarkan Sulaiman bahasa burung dan semua makhluk hidup',
                references: ['QS. An-Naml: 16']
            },
            {
                event: 'Diberikan kekuasaan atas jin',
                year: 'Masa pemerintahan',
                description: 'Allah menundukkan jin-jin untuk bekerja kepada Sulaiman dalam membangun kerajaannya',
                references: ['QS. Saba: 12-14', 'QS. Shad: 37-38']
            },
            {
                event: 'Pasukan jin, manusia, dan burung',
                year: 'Masa kejayaan',
                description: 'Sulaiman memiliki pasukan yang terdiri dari jin, manusia, dan burung yang sangat terorganisir',
                references: ['QS. An-Naml: 17']
            },
            {
                event: 'Peristiwa dengan semut',
                year: 'Dalam perjalanan',
                description: 'Sulaiman mendengar percakapan semut yang memperingatkan koloninya, lalu tersenyum dan bersyukur',
                references: ['QS. An-Naml: 18-19']
            },
            {
                event: 'Burung Hud-hud tidak hadir tanpa izin',
                year: 'Saat inspeksi pasukan',
                description: 'Sulaiman mencari burung Hud-hud yang tidak hadir dalam barisan dan mengancam akan menghukumnya',
                references: ['QS. An-Naml: 20-21']
            },
            {
                event: 'Hud-hud membawa berita tentang Ratu Saba',
                year: 'Setelah dicari',
                description: 'Hud-hud datang dengan berita tentang Ratu Saba dan kaumnya yang menyembah matahari',
                references: ['QS. An-Naml: 22-26']
            },
            {
                event: 'Mengirim surat kepada Ratu Saba',
                year: 'Setelah mendengar laporan',
                description: 'Sulaiman mengirim surat melalui Hud-hud kepada Ratu Saba berisi ajakan untuk beriman',
                references: ['QS. An-Naml: 27-28']
            },
            {
                event: 'Ratu Saba mengirim hadiah',
                year: 'Setelah menerima surat',
                description: 'Ratu Saba (Bilqis) bermusyawarah dengan pembesar kerajaan dan memutuskan mengirim hadiah',
                references: ['QS. An-Naml: 35']
            },
            {
                event: 'Menolak hadiah dan mengancam perang',
                year: 'Saat utusan datang',
                description: 'Sulaiman menolak hadiah dan mengancam akan datang dengan pasukan yang tidak dapat dilawan',
                references: ['QS. An-Naml: 36-37']
            },
            {
                event: 'Memindahkan singgasana Ratu Saba',
                year: 'Sebelum kedatangan Bilqis',
                description: 'Sulaiman meminta jin memindahkan singgasana Bilqis ke istananya sebelum dia datang',
                references: ['QS. An-Naml: 38-40']
            },
            {
                event: 'Ratu Saba beriman dan menikah dengan Sulaiman',
                year: 'Saat Bilqis datang',
                description: 'Bilqis terpesona dengan keajaiban kerajaan Sulaiman, beriman kepada Allah, dan menikah dengannya',
                references: ['QS. An-Naml: 41-44']
            },
            {
                event: 'Membangun Baitul Maqdis (Masjid Al-Aqsha)',
                year: 'Masa pemerintahan',
                description: 'Sulaiman membangun Baitul Maqdis dengan bantuan jin yang ahli dalam berbagai kerajinan',
                references: ['Riwayat dalam hadits dan sirah']
            },
            {
                event: 'Jin terus bekerja setelah Sulaiman wafat',
                year: 'Saat wafat',
                description: 'Sulaiman wafat dalam posisi berdiri bersandar tongkat, jin tidak mengetahui hingga tongkatnya dimakan rayap',
                references: ['QS. Saba: 14']
            }
        ],
        lessons: [
            'Kekuasaan yang besar harus digunakan untuk kebaikan',
            'Pentingnya bersyukur atas nikmat dan kemampuan yang diberikan Allah',
            'Hikmah dalam berdakwah kepada penguasa lain',
            'Keadilan harus ditegakkan meski kepada makhluk kecil',
            'Semua makhluk Allah memiliki tugasnya masing-masing'
        ],
        references: [
            'Al-Quran: QS. Al-Baqarah: 102',
            'Al-Quran: QS. An-Naml: 15-44',
            'Al-Quran: QS. Saba: 12-14',
            'Al-Quran: QS. Shad: 30-40',
            'Al-Quran: QS. Al-Anbiya: 78-82',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya',
            'Tafsir Ibn Katsir: Surah An-Naml dan Saba',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'إِنَّ عِفْرِيتًا مِّنَ الْجِنِّ قَالَ أَنَا آتِيكَ بِهِ قَبْلَ أَن تَقُومَ مِن مَّقَامِكَ',
                latin: 'Inna \'ifritan minal jinni qala ana atika bihi qabla an taquma min maqamik',
                translation: 'Sesungguhnya seorang Ifrit dari jin berkata: "Aku akan datang kepadamu dengan membawa singgasana itu sebelum engkau berdiri dari tempat dudukmu"',
                source: 'QS. An-Naml: 39 (dalam konteks kisah Sulaiman)'
            }
        ]
    },
    {
        id: 'yunus',
        name: 'Yunus',
        arabicName: 'يونس',
        title: 'Dzun-Nun (Pemilik Ikan) \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'Abad ke-8 SM',
        periodHijri: 'Sekitar 800 tahun sebelum hijrah',
        birthPlace: 'Gath-Hepher (dekat Nazaret), Palestina',
        deathPlace: 'Ninawa (Niniwe), Irak',
        tribe: 'Bani Israil',
        father: 'Mata (Amittai)',
        mother: 'tidak diketahui',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Nabi dan Rasul',
        qualities: ['Sabar setelah ujian', 'Bertaubat', 'Tawakkal', 'Berdakwah gigih', 'Istiqamah'],
        biography: 'Nabi Yunus \'alaihissalam dikenal dengan sebutan Dzun-Nun (pemilik ikan) karena ditelan ikan besar ketika melarikan diri dari kaumnya. Beliau diutus kepada penduduk Ninawa yang akhirnya beriman setelah melihat tanda-tanda azab. Kisah Yunus dalam perut ikan menjadi pelajaran tentang taubat dan rahmat Allah.',
        majorEvents: [
            {
                event: 'Diutus kepada penduduk Ninawa',
                year: 'Awal kenabian',
                description: 'Yunus diutus Allah untuk berdakwah kepada penduduk Ninawa (Niniwe) yang durhaka',
                references: ['QS. Yunus: 98', 'QS. As-Saffat: 139']
            },
            {
                event: 'Berdakwah kepada kaumnya',
                year: 'Masa kenabian',
                description: 'Yunus berdakwah kepada penduduk Ninawa untuk beriman kepada Allah dan meninggalkan kemusyrikan',
                references: ['QS. Yunus: 98']
            },
            {
                event: 'Kaumnya menolak dakwah',
                year: 'Selama berdakwah',
                description: 'Penduduk Ninawa menolak dakwah Yunus dan tetap dalam kekafiran dan kemaksiatan',
                references: ['Riwayat dalam kitab-kitab sirah']
            },
            {
                event: 'Yunus meninggalkan kaumnya dalam kemarahan',
                year: 'Setelah dakwah ditolak',
                description: 'Yunus meninggalkan kaumnya karena marah dan kecewa tanpa menunggu izin dari Allah',
                references: ['QS. Al-Anbiya: 87', 'QS. As-Saffat: 140']
            },
            {
                event: 'Naik kapal untuk melarikan diri',
                year: 'Saat melarikan diri',
                description: 'Yunus naik kapal untuk pergi jauh dari Ninawa dan melarikan diri dari tugasnya',
                references: ['QS. As-Saffat: 140']
            },
            {
                event: 'Kapal menghadapi badai besar',
                year: 'Dalam perjalanan laut',
                description: 'Kapal yang ditumpangi Yunus menghadapi badai besar dan terancam tenggelam',
                references: ['Riwayat dalam tafsir']
            },
            {
                event: 'Undian dan Yunus terpilih untuk dibuang',
                year: 'Saat kapal dalam bahaya',
                description: 'Penumpang kapal mengadakan undian untuk menentukan siapa yang harus dibuang, Yunus terpilih',
                references: ['QS. As-Saffat: 141']
            },
            {
                event: 'Ditelan ikan besar (hut)',
                year: 'Setelah dibuang ke laut',
                description: 'Yunus dibuang ke laut dan ditelan oleh ikan besar (paus) atas kehendak Allah',
                references: ['QS. As-Saffat: 142', 'QS. Al-Qalam: 48']
            },
            {
                event: 'Bertasbih dalam perut ikan',
                year: 'Selama dalam perut ikan',
                description: 'Yunus bertasbih dan berdoa dalam perut ikan dengan doa: "Laa ilaaha illa Anta subhaanaka inni kuntu minazh zhaalimin"',
                references: ['QS. Al-Anbiya: 87']
            },
            {
                event: 'Doa Yunus dikabulkan Allah',
                year: 'Setelah bertaubat',
                description: 'Allah mengabulkan doa Yunus dan menyelamatkannya dari kesedihan dalam perut ikan',
                references: ['QS. Al-Anbiya: 88']
            },
            {
                event: 'Dimuntahkan ikan ke pantai',
                year: 'Setelah 40 hari (menurut sebagian riwayat)',
                description: 'Ikan memuntahkan Yunus ke pantai dalam keadaan lemah seperti anak kecil yang baru lahir',
                references: ['QS. As-Saffat: 145']
            },
            {
                event: 'Disembuhkan dengan pohon labu',
                year: 'Setelah keluar dari ikan',
                description: 'Allah menumbuhkan pohon labu di atasnya untuk menyembuhkan dan melindunginya dari panas',
                references: ['QS. As-Saffat: 146']
            },
            {
                event: 'Diperintahkan kembali ke Ninawa',
                year: 'Setelah sembuh',
                description: 'Allah memerintahkan Yunus untuk kembali berdakwah kepada penduduk Ninawa',
                references: ['QS. As-Saffat: 147']
            },
            {
                event: 'Penduduk Ninawa beriman',
                year: 'Saat Yunus kembali',
                description: 'Kali ini penduduk Ninawa beriman kepada Allah setelah melihat tanda-tanda azab yang akan datang',
                references: ['QS. Yunus: 98']
            },
            {
                event: 'Allah mengangkat azab dari Ninawa',
                year: 'Setelah mereka beriman',
                description: 'Karena penduduk Ninawa beriman dan bertaubat, Allah mengangkat azab yang akan menimpa mereka',
                references: ['QS. Yunus: 98']
            }
        ],
        lessons: [
            'Tidak boleh melarikan diri dari tugas dakwah yang diberikan Allah',
            'Taubat dan istighfar dapat menyelamatkan dari segala kesulitan',
            'Allah Maha Pengampun bagi hamba yang bertaubat dengan tulus',
            'Kesabaran dalam berdakwah hingga Allah memberikan hidayah',
            'Mukjizat Allah dapat terjadi dengan cara yang tidak terduga'
        ],
        references: [
            'Al-Quran: QS. Yunus: 98',
            'Al-Quran: QS. Al-Anbiya: 87-88',
            'Al-Quran: QS. As-Saffat: 139-148',
            'Al-Quran: QS. Al-Qalam: 48-50',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya',
            'Shahih Muslim: Kitab Dzikr wa Dua 2730',
            'Tafsir Ibn Katsir: Surah Yunus dan As-Saffat',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'لاَ يَنْبَغِي لِعَبْدٍ أَنْ يَقُولَ أَنَا خَيْرٌ مِنْ يُونُسَ بْنِ مَتَّى',
                latin: 'La yanbaghii li\'abdin an yaqula ana khayrun min Yunusa ibni Matta',
                translation: 'Tidak pantas bagi seorang hamba berkata: "Aku lebih baik dari Yunus bin Mata"',
                source: 'HR. Bukhari 3395'
            },
            {
                arabic: 'دَعْوَةُ ذِي النُّونِ إِذْ دَعَا وَهُوَ فِي بَطْنِ الْحُوتِ لاَ إِلَهَ إِلاَّ أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
                latin: 'Da\'watu dzin-nun idz da\'a wa huwa fi bathnil hut: La ilaha illa anta subhanaka inni kuntu minazh zhaalimin',
                translation: 'Doa Dzun-Nun ketika dia berdoa dalam perut ikan: "Tidak ada Tuhan selain Engkau, Maha Suci Engkau, sesungguhnya aku termasuk orang-orang yang zalim"',
                source: 'HR. Tirmidzi 3505, dishahihkan Al-Albani'
            }
        ]
    },
    {
        id: 'zakariya',
        name: 'Zakariya',
        arabicName: 'زكريا',
        title: 'Nabi \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'Abad ke-1 SM',
        periodHijri: 'Sekitar 100 tahun sebelum hijrah',
        birthPlace: 'Palestina',
        deathPlace: 'Baitul Maqdis (dibunuh)',
        tribe: 'Bani Israil (keturunan Harun)',
        father: 'Barakha',
        mother: 'tidak diketahui',
        wife: ['Aisyaba (saudara Imran, ibu Maryam)'],
        children: ['Yahya'],
        profession: 'Nabi, imam Baitul Maqdis, tukang kayu',
        qualities: ['Penjaga Maryam', 'Rajin beribadah', 'Sabar', 'Tawadhu\'', 'Pekerja keras'],
        biography: 'Nabi Zakariya \'alaihissalam adalah paman Maryam (ibu Isa) yang menjadi walinya setelah orang tuanya wafat. Beliau dikaruniai anak Yahya di usia tua sebagai mukjizat. Zakariya bekerja sebagai tukang kayu dan imam di Baitul Maqdis, dikenal sangat rajin beribadah dan mengasuh Maryam dengan penuh kasih sayang.',
        majorEvents: [
            {
                event: 'Menjadi wali Maryam',
                year: 'Saat Maryam kecil',
                description: 'Zakariya menjadi wali dan pengasuh Maryam setelah orang tuanya (Imran dan Hanna) wafat',
                references: ['QS. Ali Imran: 37']
            },
            {
                event: 'Mengasuh Maryam di mihrab',
                year: 'Selama Maryam tumbuh',
                description: 'Zakariya menempatkan Maryam di mihrab khusus dan merawatnya dengan penuh kasih sayang',
                references: ['QS. Ali Imran: 37']
            },
            {
                event: 'Menemukan makanan tidak biasa di sisi Maryam',
                year: 'Saat Maryam remaja',
                description: 'Zakariya sering menemukan buah-buahan di luar musimnya di sisi Maryam sebagai rezeki dari Allah',
                references: ['QS. Ali Imran: 37']
            },
            {
                event: 'Terinspirasi untuk berdoa meminta anak',
                year: 'Setelah melihat keajaiban pada Maryam',
                description: 'Melihat Allah memberikan rezeki luar biasa kepada Maryam, Zakariya terinspirasi untuk memohon keturunan',
                references: ['QS. Ali Imran: 38']
            },
            {
                event: 'Berdoa memohon keturunan yang shalih',
                year: 'Di usia tua (sekitar 80-90 tahun)',
                description: 'Zakariya berdoa kepada Allah memohon keturunan yang shalih meski dia dan istrinya sudah tua',
                references: ['QS. Ali Imran: 38', 'QS. Maryam: 2-4']
            },
            {
                event: 'Malaikat memberikan kabar gembira',
                year: 'Setelah berdoa',
                description: 'Malaikat memberikan kabar gembira kepada Zakariya bahwa doanya dikabulkan dan akan dikaruniai anak bernama Yahya',
                references: ['QS. Ali Imran: 39', 'QS. Maryam: 7']
            },
            {
                event: 'Meminta tanda sebagai bukti',
                year: 'Setelah mendapat kabar gembira',
                description: 'Zakariya meminta tanda kepada Allah sebagai bukti bahwa dia akan dikaruniai anak',
                references: ['QS. Ali Imran: 41', 'QS. Maryam: 10']
            },
            {
                event: 'Tidak bisa berbicara selama 3 hari',
                year: 'Sebagai tanda',
                description: 'Allah memberikan tanda berupa Zakariya tidak bisa berbicara kepada manusia selama 3 hari kecuali dengan isyarat',
                references: ['QS. Ali Imran: 41', 'QS. Maryam: 10']
            },
            {
                event: 'Kelahiran Yahya',
                year: 'Setelah masa kehamilan',
                description: 'Istri Zakariya yang sudah tua dan mandul melahirkan Yahya sebagai mukjizat Allah',
                references: ['QS. Al-Anbiya: 90']
            },
            {
                event: 'Yahya tumbuh menjadi anak shalih',
                year: 'Masa pertumbuhan Yahya',
                description: 'Yahya tumbuh menjadi anak yang sangat shalih, cerdas, dan takwa kepada Allah',
                references: ['QS. Maryam: 12-15']
            },
            {
                event: 'Mengajarkan agama kepada Yahya',
                year: 'Selama mendidik Yahya',
                description: 'Zakariya mengajarkan ilmu agama dan akhlak kepada Yahya hingga menjadi pemuda yang luar biasa',
                references: ['Riwayat dalam kitab sirah']
            },
            {
                event: 'Yahya diangkat menjadi nabi',
                year: 'Saat Yahya masih muda',
                description: 'Yahya diangkat Allah menjadi nabi di usia muda untuk meneruskan dakwah ayahnya',
                references: ['QS. Maryam: 12']
            },
            {
                event: 'Dibunuh oleh Bani Israil',
                year: 'Akhir hayat',
                description: 'Zakariya dibunuh oleh orang-orang zalim dari Bani Israil karena menegur kemungkaran mereka',
                references: ['Riwayat dalam hadits dan sirah']
            }
        ],
        lessons: [
            'Tidak ada yang mustahil bagi Allah meski secara logika tidak mungkin',
            'Pentingnya berdoa dan memohon kepada Allah',
            'Kasih sayang dalam mengasuh anak yatim',
            'Kesabaran dalam mendidik generasi penerus',
            'Bekerja sambil beribadah dan berdakwah'
        ],
        references: [
            'Al-Quran: QS. Ali Imran: 37-41',
            'Al-Quran: QS. Maryam: 2-11',
            'Al-Quran: QS. Al-Anbiya: 89-90',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya',
            'Tafsir Ibn Katsir: Surah Ali Imran dan Maryam',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: []
    },
    {
        id: 'ilyas',
        name: 'Ilyas',
        arabicName: 'إلياس',
        title: 'Nabi \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'Abad ke-9 SM',
        periodHijri: 'Sekitar 900 tahun sebelum hijrah',
        birthPlace: 'Gilead (Palestina Timur)',
        deathPlace: 'Diangkat ke langit hidup-hidup',
        tribe: 'Bani Israil',
        father: 'Yasin',
        mother: 'tidak diketahui',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Nabi dan Rasul',
        qualities: ['Pemberani', 'Tegas dalam kebenaran', 'Zuhud', 'Kuat iman', 'Gigih berdakwah'],
        biography: 'Nabi Ilyas \'alaihissalam diutus kepada Bani Israil yang menyembah berhala Ba\'al pada masa Raja Ahab. Beliau berdakwah dengan tegas menentang penyembahan berhala dan kemungkaran. Ilyas dikenal sangat keras dalam menegakkan kebenaran dan akhirnya diangkat Allah ke langit dalam keadaan hidup.',
        majorEvents: [
            {
                event: 'Diutus pada masa Raja Ahab',
                year: 'Abad ke-9 SM',
                description: 'Ilyas diutus kepada Bani Israil pada masa pemerintahan Raja Ahab yang menyembah Ba\'al',
                references: ['QS. As-Saffat: 123']
            },
            {
                event: 'Berdakwah menentang penyembahan Ba\'al',
                year: 'Masa kenabian',
                description: 'Ilyas berdakwah keras menentang penyembahan Ba\'al (dewa badai dan kesuburan) yang dipromosikan Ratu Izebel',
                references: ['QS. As-Saffat: 125']
            },
            {
                event: 'Konfrontasi dengan nabi-nabi Ba\'al',
                year: 'Puncak dakwah',
                description: 'Ilyas menghadapi 450 nabi Ba\'al di Gunung Karmel untuk membuktikan kebenaran Allah',
                references: ['Riwayat dalam kitab-kitab sirah']
            },
            {
                event: 'Mukjizat api dari langit',
                year: 'Saat kontes dengan nabi Ba\'al',
                description: 'Allah menurunkan api dari langit membakar korban Ilyas, sementara Ba\'al tidak merespon nabi-nabinya',
                references: ['Riwayat dalam Kitab Raja-raja']
            },
            {
                event: 'Membunuh nabi-nabi Ba\'al',
                year: 'Setelah mukjizat',
                description: 'Setelah terbukti Allah Yang Maha Benar, Ilyas membunuh 450 nabi Ba\'al yang menyesatkan',
                references: ['Riwayat dalam sirah']
            },
            {
                event: 'Doa meminta hujan setelah kemarau',
                year: 'Setelah kemenangan',
                description: 'Ilyas berdoa kepada Allah dan turunlah hujan lebat setelah kemarau panjang 3,5 tahun',
                references: ['Riwayat dalam kitab sirah']
            },
            {
                event: 'Diancam Ratu Izebel',
                year: 'Setelah membunuh nabi Ba\'al',
                description: 'Ratu Izebel mengancam akan membunuh Ilyas dalam 24 jam sebagai balas dendam',
                references: ['Riwayat dalam sirah']
            },
            {
                event: 'Melarikan diri ke gunung',
                year: 'Setelah diancam',
                description: 'Ilyas melarikan diri ke gunung dan bersembunyi dalam gua karena takut ancaman Izebel',
                references: ['Riwayat dalam sirah']
            },
            {
                event: 'Allah berbicara dengan suara lembut',
                year: 'Saat di gua',
                description: 'Allah tidak berbicara melalui angin ribut, gempa, atau api, tapi dengan suara lembut kepada Ilyas',
                references: ['Riwayat dalam sirah']
            },
            {
                event: 'Menerima perintah melanjutkan dakwah',
                year: 'Setelah Allah berbicara',
                description: 'Allah memerintahkan Ilyas untuk terus berdakwah dan tidak takut kepada ancaman manusia',
                references: ['Riwayat dalam sirah']
            },
            {
                event: 'Mendidik Alyasa\' sebagai penerus',
                year: 'Masa akhir dakwah',
                description: 'Ilyas mendidik Alyasa\' (Elisha) untuk menjadi penerusnya dalam berdakwah',
                references: ['QS. Al-An\'am: 86', 'QS. Shad: 48']
            },
            {
                event: 'Diangkat ke langit hidup-hidup',
                year: 'Akhir hayat',
                description: 'Ilyas diangkat Allah ke langit dalam keadaan hidup dengan kereta api dan kuda api',
                references: ['Riwayat dalam sirah, QS. As-Saffat: 130']
            }
        ],
        lessons: [
            'Keberanian dalam menegakkan tauhid meski menghadapi ancaman',
            'Tidak boleh takut kepada penguasa zalim dalam menyampaikan kebenaran',
            'Allah akan membantu hamba-Nya yang berjuang di jalan-Nya',
            'Pentingnya mempersiapkan kader penerus dakwah',
            'Mukjizat Allah sebagai bukti kebenaran risalah'
        ],
        references: [
            'Al-Quran: QS. As-Saffat: 123-130',
            'Al-Quran: QS. Al-An\'am: 85',
            'Tafsir Ibn Katsir: Surah As-Saffat',
            'Qishash al-Anbiya - Ibn Katsir',
            'Riwayat dalam Kitab Raja-raja (Perjanjian Lama)'
        ],
        haditsShahih: []
    }
];

// Export untuk digunakan
export { nabiPart4 };