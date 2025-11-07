// Database Nabi dan Rasul - Part 3 (5 Nabi: Yusuf - Harun)

const nabiPart3 = [
    {
        id: 'yusuf',
        name: 'Yusuf',
        arabicName: 'يوسف',
        title: 'Nabi \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'Disebutkan wafat di usia 110 tahun',
        periodHijri: 'Jauh sebelum zaman Nabi Muhammad',
        birthPlace: 'Tanah Suci (Palestina)',
        deathPlace: 'Mesir',
        tribe: 'Bani Israil (keturunan Ishaq)',
        father: 'Ya\'qub \'alaihissalam',
        mother: 'tidak diketahui',
        wife: ['Disebutkan menikah di Mesir'],
        children: ['Disebutkan memiliki keturunan'],
        profession: 'Nabi dan Rasul, Menteri Keuangan Mesir',
        qualities: ['Ahsanu Qashash (Sebaik-baik kisah)', 'Sabar', 'Istiqamah', 'Jujur', 'Amanah', 'Memaafkan'],
        biography: 'Nabi Yusuf \'alaihissalam memiliki kisah yang Allah sebut sebagai "Ahsanu Qashash" (sebaik-baik kisah). Dari mimpi di masa kecil, dijual saudara, menjadi budak, dipenjara karena fitnah, hingga menjadi menteri di Mesir dan bertemu kembali dengan keluarga. Kisahnya penuh hikmah tentang kesabaran, keikhlasan, dan keajaiban takdir Allah.',
        majorEvents: [
            {
                event: 'Mimpi 11 bintang, matahari, dan bulan',
                year: 'Masa kecil',
                description: 'Yusuf bermimpi melihat 11 bintang, matahari, dan bulan bersujud kepadanya',
                references: ['QS. Yusuf: 4']
            },
            {
                event: 'Peringatan Ya\'qub tentang mimpi',
                year: 'Setelah menceritakan mimpi',
                description: 'Ya\'qub meminta Yusuf tidak menceritakan mimpinya kepada saudara-saudaranya karena khawatir mereka iri',
                references: ['QS. Yusuf: 5']
            },
            {
                event: 'Rencana jahat saudara-saudara Yusuf',
                year: 'Masa remaja',
                description: 'Saudara-saudara Yusuf berencana membunuhnya karena iri atas kasih sayang Ya\'qub yang lebih kepada Yusuf',
                references: ['QS. Yusuf: 8-10']
            },
            {
                event: 'Dimasukkan ke dalam sumur',
                year: 'Usia remaja',
                description: 'Saudara-saudaranya membawa Yusuf ke padang dan memasukkannya ke dalam sumur yang dalam',
                references: ['QS. Yusuf: 10-15']
            },
            {
                event: 'Wahyu Allah kepada Yusuf di sumur',
                year: 'Saat di sumur',
                description: 'Allah memberikan wahyu kepada Yusuf bahwa suatu hari dia akan memberitahu saudara-saudaranya tentang perbuatan mereka ini',
                references: ['QS. Yusuf: 15']
            },
            {
                event: 'Ditemukan dan dijual pedagang',
                year: 'Setelah di sumur',
                description: 'Kafilah pedagang menemukan Yusuf di sumur dan menjualnya ke Mesir dengan harga murah',
                references: ['QS. Yusuf: 19-20']
            },
            {
                event: 'Dibeli oleh Al-Aziz (menteri Mesir)',
                year: 'Setibanya di Mesir',
                description: 'Al-Aziz (menteri Mesir) membeli Yusuf dan meminta istrinya memuliakan Yusuf',
                references: ['QS. Yusuf: 21']
            },
            {
                event: 'Tumbuh dewasa di rumah Al-Aziz',
                year: 'Masa pertumbuhan',
                description: 'Yusuf tumbuh dewasa dan Allah memberikannya ilmu pengetahuan dan kebijaksanaan',
                references: ['QS. Yusuf: 22']
            },
            {
                event: 'Godaan istri Al-Aziz (Zulaikha)',
                year: 'Setelah dewasa dan tampan',
                description: 'Istri Al-Aziz menggoda Yusuf, namun Yusuf menolak dan berlindung kepada Allah',
                references: ['QS. Yusuf: 23-29']
            },
            {
                event: 'Fitnah dan penjara',
                year: 'Setelah menolak godaan',
                description: 'Yusuf difitnah dan dimasukkan penjara meski dia tidak bersalah',
                references: ['QS. Yusuf: 32-35']
            },
            {
                event: 'Menafsirkan mimpi di penjara',
                year: 'Selama di penjara',
                description: 'Yusuf menafsirkan mimpi dua tahanan: juru roti dan juru minuman raja',
                references: ['QS. Yusuf: 36-42']
            },
            {
                event: 'Mimpi raja tentang 7 sapi dan 7 bulir',
                year: 'Setelah beberapa tahun di penjara',
                description: 'Raja bermimpi tentang 7 sapi gemuk dimakan 7 sapi kurus dan 7 bulir hijau serta 7 bulir kering',
                references: ['QS. Yusuf: 43']
            },
            {
                event: 'Menafsirkan mimpi raja dan keluar penjara',
                year: 'Akhir masa penjara',
                description: 'Yusuf menafsirkan mimpi raja tentang 7 tahun subur dan 7 tahun paceklik, lalu dibebaskan dari penjara',
                references: ['QS. Yusuf: 44-50']
            },
            {
                event: 'Diangkat menjadi menteri keuangan',
                year: 'Setelah keluar penjara',
                description: 'Raja mengangkat Yusuf menjadi menteri yang mengurus perbendaharaan dan makanan Mesir',
                references: ['QS. Yusuf: 54-55']
            },
            {
                event: 'Mengelola masa subur dan paceklik',
                year: '7 tahun subur + 7 tahun paceklik',
                description: 'Yusuf berhasil mengelola persediaan makanan selama 7 tahun subur untuk menghadapi 7 tahun paceklik',
                references: ['QS. Yusuf: 47-49']
            },
            {
                event: 'Kedatangan saudara-saudara ke Mesir',
                year: 'Saat masa paceklik',
                description: 'Saudara-saudara Yusuf datang ke Mesir untuk membeli makanan, Yusuf mengenali mereka tapi mereka tidak',
                references: ['QS. Yusuf: 58-62']
            },
            {
                event: 'Meminta mereka membawa Bunyamin',
                year: 'Kunjungan pertama saudara-saudara',
                description: 'Yusuf memberikan makanan dan meminta mereka membawa adik mereka (Bunyamin) pada kunjungan berikutnya',
                references: ['QS. Yusuf: 59-62']
            },
            {
                event: 'Kedatangan Bunyamin',
                year: 'Kunjungan kedua',
                description: 'Saudara-saudara membawa Bunyamin, Yusuf sangat gembira bertemu adik kandungnya',
                references: ['QS. Yusuf: 69']
            },
            {
                event: 'Menyembunyikan piala di karung Bunyamin',
                year: 'Saat Bunyamin berkunjung',
                description: 'Yusuf menyuruh meletakkan piala emas di karung Bunyamin sebagai cara menahan adiknya',
                references: ['QS. Yusuf: 70-76']
            },
            {
                event: 'Memperkenalkan diri kepada saudara-saudara',
                year: 'Kunjungan ketiga',
                description: 'Yusuf akhirnya memperkenalkan diri dan memaafkan kesalahan saudara-saudaranya',
                references: ['QS. Yusuf: 89-92']
            },
            {
                event: 'Mengirim baju kepada Ya\'qub',
                year: 'Setelah memperkenalkan diri',
                description: 'Yusuf mengirim bajunya kepada Ya\'qub, mata ayahnya yang buta kembali terang',
                references: ['QS. Yusuf: 93-96']
            },
            {
                event: 'Pertemuan dengan Ya\'qub dan keluarga',
                year: 'Akhir kisah',
                description: 'Ya\'qub dan seluruh keluarga datang ke Mesir, mimpi Yusuf tentang 11 bintang menjadi kenyataan',
                references: ['QS. Yusuf: 99-100']
            }
        ],
        lessons: [
            'Kesabaran dalam menghadapi ujian dan fitnah',
            'Menjaga diri dari maksiat meskipun ada kesempatan',
            'Memaafkan orang yang pernah berbuat jahat kepada kita',
            'Amanah dalam menjalankan tugas dan kepercayaan',
            'Takdir Allah yang indah meski melalui jalan yang sulit'
        ],
        references: [
            'Al-Quran: QS. Yusuf: 1-111',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya 3372-3390',
            'Shahih Muslim: Kitab al-Fadail 2369',
            'Tafsir Ibn Katsir: Surah Yusuf',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'لَوْ لَبِثْتُ فِي السِّجْنِ مَا لَبِثَ يُوسُفُ لَأَجَبْتُ الدَّاعِيَ',
                latin: 'Law labitstu fi as-sijni ma labista Yusuf la\'ajabtu ad-da\'i',
                translation: 'Seandainya aku dipenjara selama Yusuf dipenjara, pasti aku akan memenuhi panggilan itu (segera keluar)',
                source: 'HR. Bukhari 3372'
            },
            {
                arabic: 'الْكَرِيمُ ابْنُ الْكَرِيمِ ابْنِ الْكَرِيمِ ابْنِ الْكَرِيمِ يُوسُفُ بْنُ يَعْقُوبَ بْنِ إِسْحَاقَ بْنِ إِبْرَاهِيمَ',
                latin: 'Al-karimu ibnu al-karimi ibni al-karimi ibni al-karim, Yusuf ibnu Ya\'qub ibni Ishaq ibni Ibrahim',
                translation: 'Yang mulia putra yang mulia putra yang mulia putra yang mulia: Yusuf putra Ya\'qub putra Ishaq putra Ibrahim',
                source: 'HR. Bukhari 3390'
            }
        ]
    },
    {
        id: 'ayyub',
        name: 'Ayyub',
        arabicName: 'أيوب',
        title: 'Ash-Shabur (Yang Sangat Sabar) \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'Disebutkan dalam Al-Quran',
        periodHijri: 'Sebelum zaman Nabi Muhammad',
        birthPlace: 'Tidak disebutkan secara rinci dalam nash shahih',
        deathPlace: 'Tidak disebutkan dalam nash shahih',
        tribe: 'Bani Israil',
        father: 'Tidak disebutkan dalam nash shahih',
        mother: 'Tidak disebutkan dalam nash shahih',
        wife: ['Tidak disebutkan namanya dalam nash shahih'],
        children: ['Dikembalikan keluarganya oleh Allah (tidak disebutkan jumlah pasti)'],
        profession: 'Nabi dan Rasul, peternak kaya',
        qualities: ['Sabar luar biasa', 'Syukur', 'Tawakkal', 'Zuhud', 'Tawakal', 'Ridha'],
        biography: 'Nabi Ayyub \'alaihissalam dikenal sebagai simbol kesabaran tertinggi dalam menghadapi ujian. Allah mengujinya dengan kehilangan harta, keluarga, dan kesehatan. Meski mengalami penyakit yang sangat parah, Ayyub tetap bersabar, bersyukur, dan tidak pernah mengeluh kepada Allah. Kisahnya menjadi teladan kesabaran dalam Al-Quran.',
        majorEvents: [
            {
                event: 'Diangkat menjadi nabi',
                year: 'Disebutkan dalam Al-Quran',
                description: 'Allah mengangkat Ayyub menjadi nabi dan beliau berdakwah kepada kaumnya',
                references: ['QS. Al-An\'am: 84', 'QS. Al-Anbiya: 83']
            },
            {
                event: 'Diuji dengan kehilangan harta dan keluarga',
                year: 'Masa ujian',
                description: 'Allah menguji Ayyub dengan menghilangkan hartanya dan keluarganya sebagai ujian kesabaran',
                references: ['QS. Al-Anbiya: 83', 'QS. Ash-Shad: 41']
            },
            {
                event: 'Diuji dengan penyakit yang sangat parah',
                year: 'Masa ujian',
                description: 'Syaitan menyentuh Ayyub dengan penderitaan dan penyakit, namun Ayyub tetap sabar',
                references: ['QS. Ash-Shad: 41']
            },
            {
                event: 'Tetap sabar dan berdoa kepada Allah',
                year: 'Sepanjang masa ujian',
                description: 'Ayyub tetap bersabar dan akhirnya berdoa: "Bahwa aku telah ditimpa penyakit dan Engkau adalah Tuhan Yang Paling Penyayang"',
                references: ['QS. Al-Anbiya: 83-84', 'QS. Ash-Shad: 41']
            },
            {
                event: 'Perintah Allah untuk menghentak tanah',
                year: 'Saat Allah mengabulkan doa',
                description: 'Allah menyuruh Ayyub menghentak tanah dengan kakinya, lalu keluarlah mata air untuk mandi dan minum',
                references: ['QS. Ash-Shad: 42']
            },
            {
                event: 'Dikembalikan keluarga dan harta berlipat ganda',
                year: 'Setelah sembuh',
                description: 'Allah menyembuhkan Ayyub dan mengembalikan keluarganya serta harta bendanya berlipat ganda sebagai rahmat',
                references: ['QS. Ash-Shad: 43-44', 'QS. Al-Anbiya: 84']
            },
            {
                event: 'Menjadi pelajaran bagi yang sabar',
                year: 'Setelah ujian berakhir',
                description: 'Allah memberikan Ayyub anak-anak lagi sebanyak yang pernah dimilikinya, bahkan lebih',
                references: ['QS. Ash-Shad: 43']
            }
        ],
        lessons: [
            'Kesabaran tertinggi dalam menghadapi ujian Allah',
            'Bersyukur dalam susah maupun senang',
            'Ujian Allah adalah tanda kasih sayang-Nya',
            'Kesetiaan pasangan dalam suka dan duka',
            'Allah akan memberikan ganti yang lebih baik bagi hamba yang sabar'
        ],
        references: [
            'Al-Quran: QS. Al-Anbiya: 83-84',
            'Al-Quran: QS. Ash-Shad: 41-44',
            'Al-Quran: QS. An-Nisa: 163',
            'Al-Quran: QS. Al-An\'am: 84',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya',
            'Tafsir Ibn Katsir: Surah Al-Anbiya dan Ash-Shad',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ',
                latin: 'Ajaban li\'amril mu\'min, inna amrahu kullahu khair, wa laysa dzalika li\'ahadin illa lil mu\'min',
                translation: 'Sungguh menakjubkan urusan orang mukmin, seluruh urusannya adalah kebaikan, dan itu tidak ada pada siapapun kecuali orang mukmin',
                source: 'HR. Muslim 2999 (mengandung hikmah kesabaran Ayyub)'
            }
        ]
    },
    {
        id: 'syuaib',
        name: 'Syu\'aib',
        arabicName: 'شعيب',
        title: 'Khatib al-Anbiya (Orator Para Nabi) \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'Sezaman dengan Musa (sebelum Musa)',
        periodHijri: 'Sekitar 1400 tahun sebelum hijrah',
        birthPlace: 'Madyan',
        deathPlace: 'Madyan',
        tribe: 'Kaum Madyan',
        father: 'Tidak disebutkan dalam nash shahih',
        mother: 'Tidak disebutkan dalam nash shahih',
        wife: ['Putri Syu\'aib (yang menikah dengan Musa)'],
        children: ['Putri yang menikah dengan Musa', 'anak-anak lainnya'],
        profession: 'Nabi dan Rasul, pedagang',
        qualities: ['Fasih berbicara', 'Adil dalam perdagangan', 'Sabar dalam dakwah', 'Jujur', 'Amanah'],
        biography: 'Nabi Syu\'aib \'alaihissalam dikenal sebagai Khatib al-Anbiya (Orator Para Nabi) karena kefasihannya berbicara. Beliau diutus kepada kaum Madyan dan Ashab al-Aikah yang curang dalam timbangan dan takaran, serta menyembah pohon Aikah. Syu\'aib juga adalah mertua Nabi Musa.',
        majorEvents: [
            {
                event: 'Diutus kepada kaum Madyan',
                year: 'Awal kenabian',
                description: 'Syu\'aib diutus Allah untuk berdakwah kepada kaum Madyan yang curang dalam perdagangan',
                references: ['QS. Al-A\'raf: 85', 'QS. Hud: 84', 'QS. Asy-Syu\'ara: 177']
            },
            {
                event: 'Dakwah tentang tauhid dan keadilan',
                year: 'Masa kenabian',
                description: 'Syu\'aib menyeru kaumnya menyembah Allah dan berlaku adil dalam takaran dan timbangan',
                references: ['QS. Al-A\'raf: 85', 'QS. Hud: 84-85']
            },
            {
                event: 'Peringatan tentang kecurangan dalam perdagangan',
                year: 'Selama dakwah',
                description: 'Syu\'aib memperingatkan bahaya mengurangi takaran dan timbangan serta berbuat kerusakan di bumi',
                references: ['QS. Asy-Syu\'ara: 181-183', 'QS. Hud: 85-86']
            },
            {
                event: 'Penolakan dan ancaman dari kaumnya',
                year: 'Selama dakwah',
                description: 'Kaum Madyan menolak dakwah Syu\'aib dan mengancam akan merajamnya atau mengusirnya',
                references: ['QS. Al-A\'raf: 88', 'QS. Hud: 87-89']
            },
            {
                event: 'Diutus kepada Ashab al-Aikah',
                year: 'Masa kenabian',
                description: 'Syu\'aib juga diutus kepada Ashab al-Aikah (penyembah pohon) dengan dakwah yang sama',
                references: ['QS. Asy-Syu\'ara: 176-191', 'QS. Al-Hijr: 78-79']
            },
            {
                event: 'Kedatangan Musa ke Madyan',
                year: 'Saat Musa mengungsi dari Mesir',
                description: 'Musa datang ke Madyan dan menolong kedua putri Syu\'aib di sumur, lalu diundang ke rumah',
                references: ['QS. Al-Qashash: 23-26']
            },
            {
                event: 'Pernikahan putrinya dengan Musa',
                year: 'Setelah Musa di Madyan',
                description: 'Syu\'aib menikahkan putrinya dengan Musa dengan syarat Musa bekerja selama 8-10 tahun',
                references: ['QS. Al-Qashash: 27-28']
            },
            {
                event: 'Musa bekerja sebagai penggembala',
                year: 'Selama 10 tahun',
                description: 'Musa bekerja menggembala kambing Syu\'aib selama 10 tahun di Madyan',
                references: ['QS. Al-Qashash: 29']
            },
            {
                event: 'Azab bagi kaum Madyan yang menolak',
                year: 'Akhir dakwah',
                description: 'Kaum Madyan yang menolak dakwah Syu\'aib dibinasakan dengan azab hari yang gelap (yawm az-zullah)',
                references: ['QS. Asy-Syu\'ara: 189', 'QS. Al-A\'raf: 91', 'QS. Hud: 94']
            },
            {
                event: 'Keselamatan Syu\'aib dan pengikutnya',
                year: 'Saat azab turun',
                description: 'Syu\'aib dan orang-orang yang beriman diselamatkan dari azab yang menimpa kaumnya',
                references: ['QS. Al-A\'raf: 94', 'QS. Hud: 94']
            }
        ],
        lessons: [
            'Pentingnya jujur dan adil dalam bermuamalah',
            'Bahaya kecurangan dalam takaran dan timbangan',
            'Keramahan kepada tamu dan orang yang membutuhkan bantuan',
            'Menepati janji dan kontrak kerja',
            'Dakwah harus disertai dengan teladan dalam bermuamalah'
        ],
        references: [
            'Al-Quran: QS. Al-A\'raf: 85-93',
            'Al-Quran: QS. Hud: 84-95',
            'Al-Quran: QS. Asy-Syu\'ara: 176-191',
            'Al-Quran: QS. Al-Qashash: 22-29',
            'Al-Quran: QS. Al-Hijr: 78-79',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya',
            'Tafsir Ibn Katsir: Surah Al-A\'raf dan Al-Qashash',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: []
    },
    {
        id: 'musa',
        name: 'Musa',
        arabicName: 'موسى',
        title: 'Kalimullah (Yang Diajak Bicara Allah) \'Alaihissalam',
        category: 'nabi',
        subcategory: 'rasul',
        period: '120 tahun',
        periodHijri: 'Sekitar 1300 tahun sebelum hijrah',
        birthPlace: 'Mesir',
        deathPlace: 'Palestina (Lembah Muqaddas)',
        tribe: 'Bani Israil',
        father: 'Imran',
        mother: 'Yukabid',
        wife: ['Shafura (putri Syu\'aib)'],
        children: ['Gersom', 'Eliezer'],
        profession: 'Nabi dan Rasul, penggembala, pemimpin Bani Israil',
        qualities: ['Kalimullah', 'Pemberani', 'Tegas', 'Adil', 'Sabar', 'Bertanggung jawab'],
        biography: 'Nabi Musa \'alaihissalam adalah Kalimullah (yang diajak bicara Allah secara langsung). Beliau membebaskan Bani Israil dari perbudakan Fir\'aun, menerima Kitab Taurat, dan membelah laut merah. Musa adalah salah satu Ulul Azmi (nabi yang paling kuat) dan paling banyak disebutkan dalam Al-Quran.',
        majorEvents: [
            {
                event: 'Kelahiran di masa pembunuhan bayi laki-laki',
                year: 'Tahun pembantaian',
                description: 'Musa lahir ketika Fir\'aun memerintahkan pembunuhan semua bayi laki-laki Bani Israil',
                references: ['QS. Al-Qashash: 4', 'QS. Al-Baqarah: 49']
            },
            {
                event: 'Dibuang ke sungai Nil dalam peti',
                year: 'Saat bayi',
                description: 'Ibu Musa menghanyutkannya di sungai Nil dalam peti atas wahyu Allah untuk menyelamatkannya',
                references: ['QS. Al-Qashash: 7', 'QS. Taha: 38-39']
            },
            {
                event: 'Dipungut keluarga Fir\'aun',
                year: 'Saat bayi',
                description: 'Peti Musa ditemukan keluarga Fir\'aun dan istri Fir\'aun meminta untuk memeliharanya',
                references: ['QS. Al-Qashash: 8-9', 'QS. Taha: 40']
            },
            {
                event: 'Menolak menyusui kecuali pada ibunya',
                year: 'Masa bayi',
                description: 'Musa menolak menyusui pada siapapun hingga kakaknya mencarikan ibunya sendiri',
                references: ['QS. Al-Qashash: 12', 'QS. Taha: 40']
            },
            {
                event: 'Tumbuh besar di istana Fir\'aun',
                year: 'Masa kanak-kanak hingga dewasa',
                description: 'Musa dibesarkan di istana Fir\'aun dengan pendidikan terbaik dan menjadi pemuda yang kuat',
                references: ['QS. Al-Qashash: 14']
            },
            {
                event: 'Membunuh orang Qibti secara tidak sengaja',
                year: 'Masa dewasa',
                description: 'Musa membantu orang Israil yang dipukuli orang Mesir, memukulnya hingga mati tanpa disengaja',
                references: ['QS. Al-Qashash: 15-16']
            },
            {
                event: 'Bertaubat dan meminta ampun Allah',
                year: 'Setelah membunuh',
                description: 'Musa bertaubat kepada Allah dan berjanji tidak akan membantu orang-orang yang berbuat dosa',
                references: ['QS. Al-Qashash: 16-17']
            },
            {
                event: 'Melarikan diri ke Madyan',
                year: 'Setelah dikejar Fir\'aun',
                description: 'Musa melarikan diri ke Madyan setelah diketahui membunuh dan akan ditangkap Fir\'aun',
                references: ['QS. Al-Qashash: 21-22']
            },
            {
                event: 'Bertemu dan menolong putri Syu\'aib',
                year: 'Setibanya di Madyan',
                description: 'Musa menolong dua putri Syu\'aib mengambil air untuk ternak mereka di sumur',
                references: ['QS. Al-Qashash: 23-24']
            },
            {
                event: 'Menikah dengan putri Syu\'aib',
                year: 'Setelah di Madyan',
                description: 'Syu\'aib menikahkan putrinya dengan Musa dengan syarat bekerja 8-10 tahun sebagai penggembala',
                references: ['QS. Al-Qashash: 27-28']
            },
            {
                event: 'Bekerja sebagai penggembala selama 10 tahun',
                year: 'Masa di Madyan',
                description: 'Musa bekerja menggembala kambing Syu\'aib selama 10 tahun untuk memenuhi syarat pernikahan',
                references: ['QS. Al-Qashash: 29']
            },
            {
                event: 'Melihat api di Gunung Tursina',
                year: 'Dalam perjalanan kembali ke Mesir',
                description: 'Musa melihat api di Gunung Tursina dan mendekatinya untuk mengambil bara api',
                references: ['QS. Al-Qashash: 29', 'QS. Taha: 10']
            },
            {
                event: 'Allah berbicara langsung dengan Musa',
                year: 'Di Gunung Tursina',
                description: 'Allah memanggil Musa dan berbicara langsung dengannya dari pohon yang diberkahi',
                references: ['QS. Taha: 11-16', 'QS. Al-Qashash: 30']
            },
            {
                event: 'Diangkat menjadi rasul kepada Fir\'aun',
                year: 'Saat di Gunung Tursina',
                description: 'Allah mengangkat Musa menjadi rasul dan memerintahkannya berdakwah kepada Fir\'aun',
                references: ['QS. Taha: 17-24']
            },
            {
                event: 'Mukjizat tongkat dan tangan putih',
                year: 'Saat diangkat menjadi rasul',
                description: 'Allah memberikan mukjizat tongkat yang menjadi ular dan tangan yang bercahaya putih',
                references: ['QS. Taha: 17-23', 'QS. Al-A\'raf: 106-108']
            },
            {
                event: 'Meminta Harun sebagai pembantu',
                year: 'Setelah diangkat rasul',
                description: 'Musa meminta Allah agar saudaranya Harun dijadikan pembantu karena lebih fasih berbicara',
                references: ['QS. Taha: 25-35', 'QS. Al-Qashash: 34-35']
            }
        ],
        lessons: [
            'Kekuasaan Allah dalam melindungi hamba pilihan-Nya',
            'Pentingnya bertaubat segera setelah berbuat salah',
            'Kerja keras dan menepati janji dalam bermuamalah',
            'Keberanian menghadapi penguasa yang zalim',
            'Mukjizat Allah sebagai bukti kenabian'
        ],
        references: [
            'Al-Quran: QS. Al-Baqarah: 49-74',
            'Al-Quran: QS. Al-A\'raf: 103-171',
            'Al-Quran: QS. Taha: 9-98',
            'Al-Quran: QS. Al-Qashash: 3-44',
            'Al-Quran: QS. Asy-Syu\'ara: 10-68',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya 3392-3404',
            'Shahih Muslim: Kitab al-Fadail 2372-2375',
            'Tafsir Ibn Katsir: Surah Al-Baqarah, Al-A\'raf, Taha',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'أُوذِيَ مُوسَى أَكْثَرَ مِنْ ذَلِكَ فَصَبَرَ',
                latin: 'Udziya Musa aktsara min dzalika fa shabara',
                translation: 'Musa disakiti lebih dari itu, namun dia bersabar',
                source: 'HR. Bukhari 3404'
            },
            {
                arabic: 'لاَ تُفَضِّلُونِي عَلَى مُوسَى فَإِنَّ النَّاسَ يَصْعَقُونَ يَوْمَ الْقِيَامَةِ فَأَصْعَقُ مَعَهُمْ',
                latin: 'La tufaddhiluni \'ala Musa fa inna an-nasa yash\'aquna yawmal qiyamati fa\'ash\'aqu ma\'ahum',
                translation: 'Janganlah kalian melebihkanku atas Musa, karena semua manusia akan pingsan di hari kiamat, dan aku akan pingsan bersama mereka',
                source: 'HR. Bukhari 2411'
            }
        ]
    },
    {
        id: 'harun',
        name: 'Harun',
        arabicName: 'هارون',
        title: 'Nabi \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: '123 tahun',
        periodHijri: 'Sekitar 1300 tahun sebelum hijrah',
        birthPlace: 'Mesir',
        deathPlace: 'Gunung Hor (dekat Petra, Yordania)',
        tribe: 'Bani Israil',
        father: 'Imran',
        mother: 'Yukabid',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Nabi dan Rasul, pembantu Musa',
        qualities: ['Fasih berbicara', 'Sabar', 'Pendukung setia', 'Lemah lembut', 'Bijaksana'],
        biography: 'Nabi Harun \'alaihissalam adalah saudara kandung Musa yang lebih tua 3 tahun. Beliau diangkat Allah menjadi nabi dan pembantu Musa karena lebih fasih berbicara. Harun membantu Musa dalam menghadapi Fir\'aun dan memimpin Bani Israil, namun menghadapi ujian ketika kaumnya menyembah anak lembu emas.',
        majorEvents: [
            {
                event: 'Kelahiran sebagai kakak Musa',
                year: '3 tahun sebelum Musa lahir',
                description: 'Harun lahir 3 tahun sebelum Musa di masa pemerintahan Fir\'aun yang menindas Bani Israil',
                references: ['Riwayat dalam kitab-kitab sirah']
            },
            {
                event: 'Mencari ibu menyusui untuk Musa bayi',
                year: 'Saat Musa bayi',
                description: 'Harun membantu kakaknya mencari ibu yang bisa menyusui Musa yang menolak menyusu selain ibunya',
                references: ['QS. Al-Qashash: 11-12']
            },
            {
                event: 'Dipilih Allah sebagai pembantu Musa',
                year: 'Saat Musa diangkat rasul',
                description: 'Allah mengabulkan permohonan Musa agar Harun dijadikan pembantunya karena fasih berbicara',
                references: ['QS. Taha: 29-32', 'QS. Al-Furqan: 35']
            },
            {
                event: 'Diangkat menjadi nabi',
                year: 'Bersamaan dengan Musa',
                description: 'Allah mengangkat Harun menjadi nabi untuk membantu Musa berdakwah kepada Fir\'aun',
                references: ['QS. Taha: 42', 'QS. Asy-Syu\'ara: 13']
            },
            {
                event: 'Bersama Musa menghadapi Fir\'aun',
                year: 'Awal dakwah',
                description: 'Harun mendampingi Musa menemui Fir\'aun untuk menyampaikan risalah Allah',
                references: ['QS. Al-A\'raf: 121-122', 'QS. Taha: 43-48']
            },
            {
                event: 'Menghadapi tukang sihir Fir\'aun',
                year: 'Saat kontes dengan penyihir',
                description: 'Harun bersama Musa menghadapi para penyihir Fir\'aun dan menyaksikan mukjizat tongkat yang menelan sihir mereka',
                references: ['QS. Al-A\'raf: 116-126', 'QS. Asy-Syu\'ara: 43-48']
            },
            {
                event: 'Memimpin Bani Israil saat Musa ke Gunung Tursina',
                year: 'Saat Musa menerima Taurat',
                description: 'Harun memimpin Bani Israil selama Musa pergi 40 hari ke Gunung Tursina untuk menerima Taurat',
                references: ['QS. Al-A\'raf: 142', 'QS. Taha: 83-85']
            },
            {
                event: 'Ujian penyembahan anak lembu emas',
                year: 'Saat Musa di gunung',
                description: 'Samiri membuat anak lembu emas dan sebagian Bani Israil menyembahnya, Harun berusaha melarang namun tidak didengar',
                references: ['QS. Taha: 85-94', 'QS. Al-A\'raf: 148-150']
            },
            {
                event: 'Mencoba menasihati kaumnya',
                year: 'Saat penyembahan lembu',
                description: 'Harun berusaha mengingatkan kaumnya bahwa menyembah lembu adalah ujian dan kesesatan',
                references: ['QS. Taha: 90-91']
            },
            {
                event: 'Dimarahi Musa saat kembali',
                year: 'Setelah Musa kembali dari gunung',
                description: 'Musa marah kepada Harun karena tidak mencegah penyembahan lembu, Harun menjelaskan situasinya',
                references: ['QS. Taha: 92-94', 'QS. Al-A\'raf: 150']
            },
            {
                event: 'Berdoa bersama Musa memohon ampun',
                year: 'Setelah insiden lembu emas',
                description: 'Harun dan Musa berdoa kepada Allah memohon ampun untuk diri mereka dan Bani Israil',
                references: ['QS. Al-A\'raf: 151']
            },
            {
                event: 'Wafat sebelum Musa',
                year: 'Sebelum masuk Tanah Suci',
                description: 'Harun wafat di Gunung Hor sebelum Bani Israil memasuki Tanah Suci, 3 tahun sebelum Musa wafat',
                references: ['Riwayat dalam kitab-kitab sirah']
            }
        ],
        lessons: [
            'Pentingnya saling membantu dalam dakwah dan kebaikan',
            'Kesulitan memimpin kaum yang suka membangkang',
            'Hikmah dalam menghadapi situasi sulit tanpa kekerasan',
            'Pentingnya bersabar dan tetap berpegang pada kebenaran',
            'Persaudaraan sejati dalam menjalankan misi dakwah'
        ],
        references: [
            'Al-Quran: QS. Taha: 29-94',
            'Al-Quran: QS. Al-A\'raf: 142-151',
            'Al-Quran: QS. Asy-Syu\'ara: 13-48',
            'Al-Quran: QS. Al-Furqan: 35-36',
            'Al-Quran: QS. Al-Qashash: 34-35',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya',
            'Tafsir Ibn Katsir: Surah Taha dan Al-A\'raf',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: []
    }
];

// Export untuk digunakan
export { nabiPart3 };