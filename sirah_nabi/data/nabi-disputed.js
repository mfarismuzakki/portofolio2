// Database 3 Nabi yang Masih Diperdebatkan
// Berdasarkan perbedaan pendapat ulama dan dalil-dalil yang ada

const nabiDisputed = [
    {
        id: 'khidir',
        name: 'Khidir',
        arabicName: 'الخضر',
        title: 'Al-Khidir \'Alaihissalam (status diperdebatkan)',
        category: 'disputed_nabi',
        subcategory: 'disputed',
        period: 'tidak diketahui',
        periodHijri: 'tidak diketahui',
        birthPlace: 'tidak diketahui',
        deathPlace: 'Sudah wafat seperti manusia pada umumnya',
        tribe: 'tidak diketahui',
        father: 'tidak diketahui',
        mother: 'tidak diketahui',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Hamba Allah yang shalih (menurut yang menganggap bukan nabi)',
        qualities: ['Diberi ilmu laduni', 'Panjang umur', 'Banyak bepergian', 'Menolong orang', 'Misterius'],
        disputeStatus: {
            yangMenganggapNabi: [
                'Sebagian ulama salaf',
                'Al-Bukhari dalam Shahihnya memberikan bab khusus',
                'Ibnu Katsir dalam tafsirnya cenderung ke pendapat ini',
                'Al-Qurthubi dalam tafsirnya'
            ],
            yangTidakMenganggapNabi: [
                'Mayoritas ulama kontemporer',
                'Syaikh Abdul Aziz bin Baz',
                'Syaikh Muhammad Nashiruddin al-Albani',
                'Syaikh Ibn Uthaimin'
            ],
            dalilPendukungNabi: [
                'QS. Al-Kahf disebutkan "abdan min \'ibadina atainahu rahmatan min \'indina wa \'allamnahu min ladunna \'ilman" - menunjukkan keistimewaan luar biasa',
                'Ilmu laduni yang diberikan Allah kepadanya',
                'Kemampuan melihat yang ghaib (kapal akan tenggelam, anak akan membuat orang tua kafir)',
                'Perintah Musa untuk mengikutinya menunjukkan kedudukan tinggi'
            ],
            dalilPendukungBukanNabi: [
                'Tidak disebutkan eksplisit sebagai nabi dalam Al-Quran',
                'Tidak ada riwayat shahih yang menyatakan dia nabi',
                'Musa sebagai nabi disuruh belajar darinya, bukan karena dia nabi tapi karena ilmu khusus yang diberikan Allah',
                'Banyak hamba Allah yang diberi karamah tanpa harus menjadi nabi'
            ]
        },
        biography: 'Khidir adalah sosok misterius yang disebutkan dalam Al-Quran tanpa nama eksplisit dalam kisah Musa dan "hamba yang shalih". Para ulama berselisih apakah dia nabi atau hanya hamba Allah yang diberi ilmu laduni. Yang jelas dia diberi Allah ilmu khusus tentang rahasia-rahasia takdir yang tidak diketahui Musa.',
        majorEvents: [
            {
                event: 'Bertemu dengan Musa',
                year: 'Masa Musa',
                description: 'Musa bertemu dengannya di majma\'ul bahrain (pertemuan dua lautan) dan meminta mengikutinya',
                references: ['QS. Al-Kahf: 65-66']
            },
            {
                event: 'Syarat tidak boleh bertanya',
                year: 'Saat bertemu Musa',
                description: 'Khidir memberikan syarat kepada Musa untuk tidak bertanya tentang apapun yang dilakukannya',
                references: ['QS. Al-Kahf: 67-70']
            },
            {
                event: 'Merusak kapal nelayan',
                year: 'Dalam perjalanan dengan Musa',
                description: 'Khidir melubangi kapal nelayan miskin yang telah mengangkut mereka dengan gratis',
                references: ['QS. Al-Kahf: 71']
            },
            {
                event: 'Membunuh anak muda',
                year: 'Perjalanan kedua',
                description: 'Khidir membunuh seorang anak muda tanpa sebab yang jelas menurut Musa',
                references: ['QS. Al-Kahf: 74']
            },
            {
                event: 'Memperbaiki dinding tanpa upah',
                year: 'Perjalanan ketiga',
                description: 'Khidir memperbaiki dinding yang hampir roboh di kampung yang tidak mau memberi makan mereka',
                references: ['QS. Al-Kahf: 77']
            },
            {
                event: 'Menjelaskan hikmah perbuatannya',
                year: 'Setelah berpisah dengan Musa',
                description: 'Khidir menjelaskan hikmah di balik tiga perbuatannya yang aneh kepada Musa',
                references: ['QS. Al-Kahf: 78-82']
            }
        ],
        lessons: [
            'Ada hikmah Allah di balik setiap kejadian yang kita tidak pahami',
            'Ilmu manusia terbatas meski setinggi ilmu Musa',
            'Allah memberikan ilmu khusus kepada hamba-hamba pilihan-Nya',
            'Tidak semua yang terlihat buruk itu benar-benar buruk',
            'Kesabaran dalam belajar dan tidak tergesa-gesa bertanya'
        ],
        scholarlyNote: 'Para ulama berselisih tentang status Khidir. Pendapat yang lebih kuat berdasarkan dalil adalah bahwa dia hamba Allah yang shalih yang diberi ilmu laduni, bukan nabi. Namun perbedaan ini tidak mempengaruhi inti pelajaran dari kisahnya.',
        references: [
            'Al-Quran: QS. Al-Kahf: 65-82',
            'Shahih Bukhari: Kitab Tafsir Al-Quran, Bab Surah Al-Kahf',
            'Tafsir Ibn Katsir: Surah Al-Kahf ayat 65-82',
            'Tafsir Al-Qurthubi: Surah Al-Kahf',
            'Majmu\' Fatawa Ibn Taymiyyah',
            'Fatawa Nur ala ad-Darb - Ibn Baz'
        ],
        haditsShahih: [
            {
                arabic: 'إِنَّمَا سُمِّيَ الْخَضِرُ لِأَنَّهُ جَلَسَ عَلَى فَرْوَةٍ بَيْضَاءَ فَإِذَا هِيَ تَهْتَزُّ مِنْ تَحْتِهِ خَضْرَاءَ',
                latin: 'Innama summiya al-Khadhiru li\'annahu jalasa \'ala farwatin baydha\'a fa\'idha hiya tahtazzu min tahtihi khadhra\'',
                translation: 'Dia dinamakan Al-Khidir karena dia duduk di atas bulu putih, tiba-tiba bulu itu menghijau di bawahnya',
                source: 'HR. Bukhari 3401'
            }
        ]
    },
    {
        id: 'yusya',
        name: 'Yusya\' bin Nun',
        arabicName: 'يوشع بن نون',
        title: 'Yusya\' bin Nun \'Alaihissalam (status diperdebatkan)',
        category: 'disputed_nabi',
        subcategory: 'disputed',
        period: 'Setelah Musa, sebelum periode Hakim-hakim Israil',
        periodHijri: 'Sekitar 1200 tahun sebelum hijrah',
        birthPlace: 'Mesir',
        deathPlace: 'Tanah Suci (Palestina)',
        tribe: 'Bani Israil (suku Efraim)',
        father: 'Nun bin Efraim',
        mother: 'tidak diketahui',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Pemimpin Bani Israil, panglima perang',
        qualities: ['Pemimpin yang berani', 'Taat kepada Musa', 'Strategis', 'Beriman teguh'],
        disputeStatus: {
            yangMenganggapNabi: [
                'Sebagian ulama berdasarkan riwayat Israiliyyat',
                'Disebutkan dalam beberapa kitab tarikh klasik',
                'Qatadah dan beberapa tabi\'in',
                'Sebagian mufassirin dalam tafsir QS. Al-Ma\'idah: 23'
            ],
            yangTidakMenganggapNabi: [
                'Mayoritas ulama kontemporer',
                'Tidak ada dalil shahih dari Al-Quran dan hadits',
                'Hanya berdasarkan riwayat Israiliyyat yang tidak dapat dipastikan',
                'Ibn Taymiyyah dan murid-muridnya'
            ],
            dalilPendukungNabi: [
                'Memimpin Bani Israil setelah Musa menunjukkan kedudukan khusus',
                'Mukjizat menghentikan matahari dalam peperangan (riwayat Israiliyyat)',
                'Berhasil menaklukkan Tanah Suci yang dijanjikan Allah',
                'Disebutkan dalam QS. Al-Ma\'idah: 23 sebagai salah satu dari dua orang yang beriman (menurut tafsir tertentu)'
            ],
            dalilPendukungBukanNabi: [
                'Tidak disebutkan secara eksplisit sebagai nabi dalam Al-Quran',
                'Tidak ada hadits shahih yang menyebutkannya sebagai nabi',
                'Sebagian besar informasi berasal dari riwayat Israiliyyat',
                'Bisa saja hanya pemimpin yang shalih tanpa harus nabi'
            ]
        },
        biography: 'Yusya\' bin Nun adalah pemuda yang setia mengikuti Musa dan kemudian memimpin Bani Israil memasuki Tanah Suci setelah Musa wafat. Para ulama berselisih tentang statusnya sebagai nabi. Yang jelas dia adalah pemimpin yang beriman dan berhasil menjalankan amanah memimpin Bani Israil.',
        majorEvents: [
            {
                event: 'Menjadi pelayan dan murid Musa',
                year: 'Masa muda',
                description: 'Yusya\' menjadi pelayan setia dan murid Musa, menemaninya dalam berbagai perjalanan',
                references: ['QS. Al-Kahf: 60-62 (kemungkinan merujuk pada Yusya\')']
            },
            {
                event: 'Ikut serta mencari tempat bertemu Khidir',
                year: 'Bersama Musa',
                description: 'Yusya\' menemani Musa dalam perjalanan mencari majma\'ul bahrain untuk bertemu Khidir',
                references: ['QS. Al-Kahf: 60-62']
            },
            {
                event: 'Lupa tentang ikan yang hidup kembali',
                year: 'Dalam perjalanan dengan Musa',
                description: 'Yusya\' lupa memberitahu Musa tentang ikan yang hidup kembali, yang menjadi tanda tempat bertemu Khidir',
                references: ['QS. Al-Kahf: 63']
            },
            {
                event: 'Menjadi salah satu pengintai ke Tanah Suci',
                year: 'Masa Musa',
                description: 'Yusya\' adalah salah satu dari 12 orang yang diutus mengintai Tanah Suci sebelum penaklukan',
                references: ['Riwayat dalam kitab-kitab tarikh']
            },
            {
                event: 'Bersama Kaleb mendukung penyerangan',
                year: 'Setelah pengintaian',
                description: 'Yusya\' bersama Kaleb mendukung agar Bani Israil segera menyerang, bukan mundur karena takut',
                references: ['QS. Al-Ma\'idah: 23 (kemungkinan merujuk pada Yusya\' dan Kaleb)']
            },
            {
                event: 'Ditunjuk memimpin setelah Musa wafat',
                year: 'Setelah Musa wafat',
                description: 'Yusya\' ditunjuk atau dipilih untuk memimpin Bani Israil memasuki Tanah Suci',
                references: ['Riwayat dalam sirah']
            },
            {
                event: 'Memimpin penaklukan Ariha (Yerikho)',
                year: 'Awal kepemimpinan',
                description: 'Yusya\' memimpin penaklukan kota Ariha dengan strategi mengitari tembok kota',
                references: ['Riwayat dalam Kitab Yusya\'']
            },
            {
                event: 'Mukjizat menghentikan matahari',
                year: 'Dalam salah satu peperangan',
                description: 'Yusya\' berdoa dan matahari berhenti bergerak hingga peperangan selesai (riwayat Israiliyyat)',
                references: ['Riwayat Israiliyyat']
            },
            {
                event: 'Membagi Tanah Suci untuk 12 suku',
                year: 'Setelah penaklukan',
                description: 'Yusya\' membagi-bagikan wilayah Tanah Suci kepada 12 suku Bani Israil',
                references: ['Riwayat dalam Kitab Yusya\'']
            }
        ],
        lessons: [
            'Pentingnya kesetiaan kepada guru dan pemimpin',
            'Keberanian dalam menghadapi tantangan besar',
            'Kepemimpinan yang amanah dalam menjalankan tugas',
            'Tidak boleh takut menghadapi musuh jika Allah telah menjanjikan kemenangan',
            'Pentingnya membagi dengan adil hasil perjuangan'
        ],
        scholarlyNote: 'Status Yusya\' sebagai nabi masih diperdebatkan ulama. Informasi tentangnya sebagian besar berasal dari riwayat Israiliyyat. Yang pasti dia adalah pemimpin yang beriman dan berhasil memimpin Bani Israil. Tidak ada dalil qath\'i yang menetapkannya sebagai nabi.',
        references: [
            'Al-Quran: QS. Al-Kahf: 60-64 (kemungkinan)',
            'Al-Quran: QS. Al-Ma\'idah: 23 (kemungkinan)',
            'Tafsir Ibn Katsir: Surah Al-Kahf dan Al-Ma\'idah',
            'Al-Bidayah wan-Nihayah - Ibn Katsir',
            'Qishash al-Anbiya - Ibn Katsir',
            'Kitab Yusya\' (Perjanjian Lama)'
        ],
        haditsShahih: []
    },
    {
        id: 'dzulkarnain',
        name: 'Dzulkarnain',
        arabicName: 'ذو القرنين',
        title: 'Dzulkarnain \'Alaihissalam (status diperdebatkan)',
        category: 'disputed_nabi',
        subcategory: 'disputed',
        period: 'tidak diketahui',
        periodHijri: 'tidak diketahui',
        birthPlace: 'tidak diketahui',
        deathPlace: 'tidak diketahui',
        tribe: 'tidak diketahui',
        father: 'tidak diketahui',
        mother: 'tidak diketahui',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Raja yang adil dan penakluk',
        qualities: ['Adil', 'Kuat', 'Membangun peradaban', 'Melindungi yang lemah', 'Bertauhid'],
        disputeStatus: {
            yangMenganggapNabi: [
                'Sebagian ulama salaf',
                'Al-Baghawi dalam tafsirnya',
                'Sebagian mufassirin klasik',
                'Berdasarkan bahwa Allah menceritakan kisahnya dengan pujian'
            ],
            yangTidakMenganggapNabi: [
                'Mayoritas ulama kontemporer',
                'Ibn Taymiyyah',
                'Ibn Katsir cenderung ke pendapat ini',
                'Berdasarkan tidak ada penyebutan eksplisit sebagai nabi'
            ],
            identitasDisputed: [
                'Iskandar Agung (Alexander the Great) - pendapat sebagian',
                'Koresh (Cyrus) raja Persia - pendapat lain',
                'Raja Himyar dari Yaman - pendapat ketiga',
                'Sosok tersendiri yang tidak diidentifikasi - pendapat keempat'
            ],
            dalilPendukungNabi: [
                'Allah menceritakan kisahnya dalam Al-Quran dengan nada pujian',
                'Perbuatan-perbuatannya menunjukkan petunjuk ilahi',
                'Tauhidnya yang jelas dalam menjawab pertanyaan tentang kekuasaannya',
                'Pembangunan tembok untuk melindungi umat dari Ya\'juj Ma\'juj'
            ],
            dalilPendukungBukanNabi: [
                'Tidak disebutkan eksplisit sebagai nabi dalam Al-Quran',
                'Bisa saja raja yang shalih dan beriman tanpa harus nabi',
                'Allah juga memuji hamba-hamba shalih lain yang bukan nabi',
                'Tidak ada riwayat shahih yang menyebutkannya sebagai nabi'
            ]
        },
        biography: 'Dzulkarnain adalah sosok yang disebutkan dalam Al-Quran sebagai raja yang adil dan kuat. Para ulama berselisih tentang identitas dan statusnya. Yang jelas dia adalah penguasa yang beriman kepada Allah, adil kepada rakyat, dan membangun tembok untuk melindungi manusia dari Ya\'juj Ma\'juj.',
        majorEvents: [
            {
                event: 'Perjalanan ke arah matahari terbenam',
                year: 'Masa pemerintahan',
                description: 'Dzulkarnain bepergian hingga tempat matahari terbenam dan menemukan kaum di sana',
                references: ['QS. Al-Kahf: 86']
            },
            {
                event: 'Diberi pilihan tentang kaum di barat',
                year: 'Di tempat matahari terbenam',
                description: 'Allah memberi pilihan kepada Dzulkarnain untuk menghukum atau berbuat baik kepada kaum tersebut',
                references: ['QS. Al-Kahf: 86-87']
            },
            {
                event: 'Memilih keadilan dalam menghukum',
                year: 'Saat diberi pilihan',
                description: 'Dzulkarnain memilih menghukum yang zalim dan berbuat baik kepada yang beriman',
                references: ['QS. Al-Kahf: 87-88']
            },
            {
                event: 'Perjalanan ke arah matahari terbit',
                year: 'Perjalanan kedua',
                description: 'Dzulkarnain melanjutkan perjalanan ke arah matahari terbit',
                references: ['QS. Al-Kahf: 90']
            },
            {
                event: 'Menemukan kaum yang tidak berpakaian',
                year: 'Di tempat matahari terbit',
                description: 'Dzulkarnain menemukan kaum yang tidak memiliki pelindung dari sinar matahari',
                references: ['QS. Al-Kahf: 91']
            },
            {
                event: 'Perjalanan ke antara dua gunung',
                year: 'Perjalanan ketiga',
                description: 'Dzulkarnain melakukan perjalanan hingga mencapai daerah antara dua gunung (sadain)',
                references: ['QS. Al-Kahf: 93']
            },
            {
                event: 'Bertemu kaum yang kesulitan berkomunikasi',
                year: 'Di antara dua gunung',
                description: 'Dzulkarnain bertemu kaum yang hampir tidak memahami pembicaraan',
                references: ['QS. Al-Kahf: 93']
            },
            {
                event: 'Diminta membangun tembok penahan Ya\'juj Ma\'juj',
                year: 'Atas permintaan kaum tersebut',
                description: 'Kaum tersebut meminta Dzulkarnain membangun penghalang untuk melindungi mereka dari Ya\'juj Ma\'juj',
                references: ['QS. Al-Kahf: 94']
            },
            {
                event: 'Menolak upah dan meminta bantuan tenaga',
                year: 'Saat diminta membangun',
                description: 'Dzulkarnain menolak upah dan meminta bantuan tenaga untuk membangun tembok',
                references: ['QS. Al-Kahf: 95']
            },
            {
                event: 'Membangun tembok dengan besi dan tembaga',
                year: 'Proses pembangunan',
                description: 'Dzulkarnain membangun tembok dengan besi yang dilebur dan dituangi tembaga cair',
                references: ['QS. Al-Kahf: 96']
            },
            {
                event: 'Mengatributkan keberhasilan kepada Allah',
                year: 'Setelah selesai membangun',
                description: 'Dzulkarnain menyatakan bahwa keberhasilan membangun tembok adalah rahmat dari Allah',
                references: ['QS. Al-Kahf: 98']
            },
            {
                event: 'Meramalkan kehancuran tembok di akhir zaman',
                year: 'Setelah pembangunan',
                description: 'Dzulkarnain menyatakan bahwa tembok akan hancur ketika janji Allah (hari kiamat) mendekat',
                references: ['QS. Al-Kahf: 98']
            }
        ],
        lessons: [
            'Kekuasaan harus digunakan untuk keadilan dan melindungi yang lemah',
            'Pemimpin yang baik tidak mengambil keuntungan pribadi dari jabatannya',
            'Pentingnya bekerja sama dalam menghadapi ancaman bersama',
            'Semua keberhasilan harus dikembalikan kepada Allah',
            'Kekuatan fisik harus diimbangi dengan ketaqwaan'
        ],
        scholarlyNote: 'Status Dzulkarnain sebagai nabi masih diperdebatkan. Identitasnya juga tidak pasti. Yang terpenting adalah mengambil pelajaran dari sifat-sifat kepemimpinannya yang adil dan berketuhanan. Perbedaan pendapat ini tidak mempengaruhi nilai-nilai yang bisa dipetik dari kisahnya.',
        references: [
            'Al-Quran: QS. Al-Kahf: 83-98',
            'Tafsir Ibn Katsir: Surah Al-Kahf ayat 83-98',
            'Tafsir Al-Qurthubi: Surah Al-Kahf',
            'Tafsir At-Tabari: Surah Al-Kahf',
            'Al-Bidayah wan-Nihayah - Ibn Katsir',
            'Majmu\' Fatawa Ibn Taymiyyah'
        ],
        haditsShahih: []
    }
];

// Export untuk digunakan
if (typeof module !== 'undefined' && module.exports) {
    module.exports = nabiDisputed;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.nabiDisputed = nabiDisputed;
}