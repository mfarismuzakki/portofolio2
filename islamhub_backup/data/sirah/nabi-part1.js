// Database Nabi dan Rasul - Part 1 (5 Nabi Pertama)
// Berdasarkan riwayat shahih dari Al-Quran, hadits, dan atsar

const nabiPart1 = [
    {
        id: 'adam',
        name: 'Adam',
        arabicName: 'آدم',
        title: 'Abul Basyar \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'tidak diketahui',
        periodHijri: 'sebelum perhitungan tarikh',
        birthPlace: 'tidak diketahui',
        deathPlace: 'tidak diketahui',
        tribe: 'tidak ada (manusia pertama)',
        father: 'tidak ada (manusia pertama)',
        mother: 'tidak ada (manusia pertama)',
        wife: ['Hawa'],
        children: ['Habil', 'Qabil', 'Syits'],
        profession: 'Nabi dan khalifah Allah di bumi',
        qualities: ['Khalifah Allah di bumi', 'Tawadhu', 'Taubat', 'Ketaatan kepada Allah'],
        biography: 'Nabi Adam alaihissalam adalah manusia pertama yang diciptakan Allah dari tanah. Allah meniupkan ruh ke dalamnya, mengajarkannya nama-nama seluruhnya, dan memerintahkan malaikat untuk bersujud kepadanya. Adam dan Hawa ditempatkan di surga, namun setelah melanggar larangan Allah, mereka turun ke bumi dan bertaubat kepada Allah dengan kalimat taubat yang Allah ajarkan.',
        majorEvents: [
            {
                event: 'Penciptaan Adam dari tanah',
                year: 'Awal penciptaan',
                description: 'Allah menciptakan Adam dari tanah liat yang kering, kemudian meniupkan ruh ke dalamnya sehingga menjadi manusia hidup',
                references: ['QS. Al-Baqarah: 30', 'QS. Ash-Shaffat: 11', 'QS. Ar-Rahman: 14']
            },
            {
                event: 'Diajarkan nama-nama',
                year: 'Setelah penciptaan',
                description: 'Allah mengajarkan Adam nama-nama seluruhnya yang tidak diketahui oleh para malaikat',
                references: ['QS. Al-Baqarah: 31-33']
            },
            {
                event: 'Sujudnya malaikat kepada Adam',
                year: 'Setelah diajarkan nama-nama',
                description: 'Semua malaikat bersujud kepada Adam atas perintah Allah, kecuali iblis yang sombong',
                references: ['QS. Al-Baqarah: 34', 'QS. Al-A\'raf: 11-12', 'QS. Al-Hijr: 28-31']
            },
            {
                event: 'Penciptaan Hawa dan tinggal di surga',
                year: 'Setelah penciptaan Adam',
                description: 'Allah menciptakan Hawa dari tulang rusuk Adam, dan mereka berdua ditempatkan di surga',
                references: ['QS. Al-Baqarah: 35', 'QS. Al-A\'raf: 19']
            },
            {
                event: 'Larangan mendekati pohon tertentu',
                year: 'Saat di surga',
                description: 'Adam dan Hawa diberi kebebasan di surga namun dilarang mendekati satu pohon tertentu',
                references: ['QS. Al-Baqarah: 35', 'QS. Al-A\'raf: 19']
            },
            {
                event: 'Godaan iblis dan memakan dari pohon',
                year: 'Saat di surga',
                description: 'Iblis menggoda Adam dan Hawa hingga mereka memakan dari pohon yang dilarang',
                references: ['QS. Al-Baqarah: 36', 'QS. Al-A\'raf: 20-22', 'QS. Taha: 120-121']
            },
            {
                event: 'Turun ke bumi',
                year: 'Setelah berbuat kesalahan',
                description: 'Adam dan Hawa diturunkan ke bumi untuk memulai kehidupan dan menjalankan tugas sebagai khalifah',
                references: ['QS. Al-Baqarah: 36-37', 'QS. Al-A\'raf: 24-25']
            },
            {
                event: 'Taubat dan ampunan Allah',
                year: 'Setelah turun ke bumi',
                description: 'Adam dan Hawa bertaubat dengan kalimat yang diajarkan Allah, dan Allah mengampuni mereka',
                references: ['QS. Al-Baqarah: 37', 'QS. Al-A\'raf: 23']
            }
        ],
        lessons: [
            'Pentingnya taubat dan istighfar ketika berbuat kesalahan',
            'Bahaya mengikuti bisikan syaitan yang menyesatkan',
            'Keutamaan Adam sebagai khalifah Allah di bumi',
            'Asal-usul manusia yang harus diingat untuk tetap tawadhu\'',
            'Allah Maha Pemaaf bagi hamba yang bertaubat dengan tulus'
        ],
        references: [
            'Al-Quran: QS. Al-Baqarah: 30-39',
            'Al-Quran: QS. Al-A\'raf: 11-25',
            'Al-Quran: QS. Taha: 115-123',
            'Al-Quran: QS. Al-Hijr: 26-43',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya 3326-3330',
            'Shahih Muslim: Kitab al-Birr was-Silah 2612',
            'Tafsir Ibn Katsir: Surah Al-Baqarah',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'كُلُّ بَنِي آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ',
                latin: 'Kullu bani Adama khaththa\'un wa khairal khaththa\'inat tawwabun',
                translation: 'Semua anak Adam itu berbuat salah, dan sebaik-baik orang yang berbuat salah adalah yang bertaubat',
                source: 'HR. At-Tirmidzi 2499, dishahihkan Al-Albani'
            },
            {
                arabic: 'إِنَّ اللَّهَ خَلَقَ آدَمَ عَلَى صُورَتِهِ طُولُهُ سِتُّونَ ذِرَاعًا',
                latin: 'Inna Allaha khalaqa Adama \'ala shuratihi thuluhu sittuna dhira\'an',
                translation: 'Sesungguhnya Allah menciptakan Adam sesuai bentuknya (bentuk yang mulia), tingginya enam puluh hasta',
                source: 'HR. Bukhari 6227'
            }
        ]
    },
    {
        id: 'idris',
        name: 'Idris',
        arabicName: 'إدريس',
        title: 'Nabi \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'tidak diketahui',
        periodHijri: 'tidak diketahui',
        birthPlace: 'tidak diketahui',
        deathPlace: 'Diangkat ke tempat yang tinggi',
        tribe: 'tidak diketahui',
        father: 'tidak diketahui',
        mother: 'tidak diketahui',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Nabi, penjahit pertama, ahli tulis-menulis',
        qualities: ['Sabar', 'Tekun beribadah', 'Ahli tulis-menulis', 'Diangkat ke tempat tinggi', 'Shiddiq'],
        biography: 'Nabi Idris \'alaihissalam adalah nabi kedua setelah Adam. Beliau dikenal sebagai orang pertama yang bisa menulis dengan pena dan menjahit pakaian. Allah mengangkatnya ke tempat yang tinggi sebagaimana disebutkan dalam Al-Quran. Beliau juga dikenal dengan kesabaran dan ketekunannya dalam beribadah, serta digelari sebagai Shiddiq karena kebenaran dan kejujurannya.',
        majorEvents: [
            {
                event: 'Diangkat menjadi nabi',
                year: 'Masa hidup',
                description: 'Allah mengangkat Idris menjadi nabi untuk menyebarkan ajaran tauhid kepada kaumnya',
                references: ['QS. Maryam: 56-57', 'QS. Al-Anbiya: 85-86']
            },

            {
                event: 'Diangkat ke tempat tinggi',
                year: 'Akhir hidup',
                description: 'Allah mengangkat Idris ke tempat yang tinggi (makan \'aliy), ada yang berpendapat ke langit keempat',
                references: ['QS. Maryam: 57', 'Riwayat Isra\' Mi\'raj']
            }
        ],
        lessons: [
            'Keutamaan ilmu dan teknologi dalam Islam',
            'Pentingnya kerja keras dan mengembangkan keterampilan',
            'Keteladanan dalam beribadah dan mendekatkan diri kepada Allah',
            'Kejujuran dan kebenaran dalam berkata dan bertindak'
        ],
        references: [
            'Al-Quran: QS. Maryam: 56-57',
            'Al-Quran: QS. Al-Anbiya: 85-86',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya',
            'Tafsir Ibn Katsir: Surah Maryam',
            'Qishash al-Anbiya - Ibn Katsir',
            'Al-Bidayah wan Nihayah - Ibn Katsir'
        ],
        haditsShahih: []
    },
    {
        id: 'nuh',
        name: 'Nuh',
        arabicName: 'نوح',
        title: 'Nabi \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: '950 tahun berdakwah (total hidup diperkirakan 1050 tahun)',
        periodHijri: 'Sebelum perhitungan tarikh',
        birthPlace: 'Mesopotamia (Irak kuno)',
        deathPlace: 'Setelah banjir besar',
        tribe: 'Keturunan Syits bin Adam',
        father: 'Lamak bin Matusalah',
        mother: 'tidak diketahui',
        wife: ['Waghilah (tidak beriman)', 'Nama istri yang beriman tidak disebutkan'],
        children: ['Sam', 'Ham', 'Yafits', 'Kan\'an (tidak beriman)'],
        profession: 'Nabi dan Rasul, tukang kayu (pembuat kapal)',
        qualities: ['Sabar dalam dakwah', 'Taat kepada Allah', 'Gigih', 'Shukur', 'Tawakkal'],
        biography: 'Nabi Nuh \'alaihissalam berdakwah selama 950 tahun kepada kaumnya yang menyembah berhala bernama Wadd, Suwa\', Yaghuts, Ya\'uq, dan Nasr. Setelah kaumnya tetap kafir dan mendustakan dakwahnya, Allah memerintahkan Nuh membuat kapal dan menurunkan banjir besar yang menenggelamkan orang-orang kafir, sementara Nuh dan pengikutnya diselamatkan.',
        majorEvents: [
            {
                event: 'Diutus menjadi rasul kepada kaumnya',
                year: 'Awal kenabian',
                description: 'Nuh diutus Allah untuk berdakwah kepada kaumnya yang telah menyimpang dari ajaran tauhid',
                references: ['QS. Nuh: 1-4', 'QS. Al-A\'raf: 59', 'QS. Hud: 25-26']
            },
            {
                event: 'Dakwah selama 950 tahun',
                year: '950 tahun masa dakwah',
                description: 'Nuh berdakwah dengan berbagai cara: siang malam, terang-terangan dan sembunyi-sembunyi, namun kaumnya tetap menolak',
                references: ['QS. Al-Ankabut: 14', 'QS. Nuh: 5-20']
            },
            {
                event: 'Doa Nuh agar kaumnya diberi hidayah',
                year: 'Selama dakwah',
                description: 'Nuh terus berdoa kepada Allah agar kaumnya diberi hidayah dan tidak dibinasakan',
                references: ['QS. Nuh: 26-27']
            },
            {
                event: 'Kaumnya mengancam dan mengejek Nuh',
                year: 'Selama dakwah',
                description: 'Kaum Nuh mengancam akan merajam dan mengejeknya, menganggap Nuh hanya manusia biasa',
                references: ['QS. Asy-Syu\'ara: 116', 'QS. Hud: 27-32']
            },
            {
                event: 'Wahyu Allah untuk membuat kapal',
                year: 'Menjelang azab',
                description: 'Allah memerintahkan Nuh membuat kapal dengan ukuran dan spesifikasi tertentu',
                references: ['QS. Hud: 37-38', 'QS. Al-Mu\'minun: 27']
            },
            {
                event: 'Pembuatan kapal dan ejekan kaum',
                year: 'Masa pembuatan kapal',
                description: 'Nuh membuat kapal di darat, kaumnya mengejek karena tidak ada laut di sekitar mereka',
                references: ['QS. Hud: 38']
            },
            {
                event: 'Dimulainya banjir besar (Tufan)',
                year: 'Setelah 950 tahun dakwah',
                description: 'Air meluap dari dalam bumi dan hujan turun dari langit, dimulailah banjir besar',
                references: ['QS. Hud: 40', 'QS. Al-Qamar: 11-12']
            },
            {
                event: 'Naik ke kapal bersama yang beriman',
                year: 'Saat banjir dimulai',
                description: 'Nuh dan keluarga yang beriman serta sepasang dari setiap jenis hewan naik ke kapal',
                references: ['QS. Hud: 40', 'QS. Al-Mu\'minun: 27-28']
            },
            {
                event: 'Tenggelamnya anak Nuh (Kan\'an)',
                year: 'Saat banjir berlangsung',
                description: 'Anak Nuh yang kafir menolak naik kapal dan akhirnya tenggelam dalam banjir',
                references: ['QS. Hud: 42-43']
            },
            {
                event: 'Kapal berlabuh di Gunung Judi',
                year: 'Setelah banjir surut',
                description: 'Setelah Allah surut air banjir, kapal Nuh berlabuh di atas Gunung Judi',
                references: ['QS. Hud: 44']
            }
        ],
        lessons: [
            'Kesabaran dalam berdakwah meskipun menghadapi penolakan bertahun-tahun',
            'Pentingnya tauhid dan bahaya menyembah selain Allah',
            'Tawakkal kepada Allah dalam menghadapi ujian berat',
            'Keadilan Allah dalam mengazab orang-orang yang durhaka',
            'Pentingnya mematuhi perintah Allah meskipun sulit dipahami'
        ],
        references: [
            'Al-Quran: QS. Nuh: 1-28',
            'Al-Quran: QS. Hud: 25-49',
            'Al-Quran: QS. Al-A\'raf: 59-64',
            'Al-Quran: QS. Al-Qamar: 9-15',
            'Al-Quran: QS. Al-Ankabut: 14-15',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya 3340-3348',
            'Shahih Muslim: Kitab al-Iman 193',
            'Tafsir Ibn Katsir: Surah Nuh dan Hud',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'إِنَّ اللَّهَ صَبُورٌ يُحِبُّ الصَّبْرَ',
                latin: 'Inna Allaha shaburun yuhibbu ash-shabr',
                translation: 'Sesungguhnya Allah Maha Sabar dan menyukai kesabaran',
                source: 'Makna dari sifat Allah dalam kisah Nuh'
            }
        ]
    },
    {
        id: 'hud',
        name: 'Hud',
        arabicName: 'هود',
        title: 'Nabi \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'Setelah Nuh, sebelum Shalih',
        periodHijri: 'Sebelum perhitungan tarikh',
        birthPlace: 'Jazirah Arab (wilayah kaum \'Ad)',
        deathPlace: 'Hadramaut, Yaman',
        tribe: 'Kaum \'Ad',
        father: 'Syalikh bin Arfakhsyad',
        mother: 'tidak diketahui',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Nabi dan Rasul',
        qualities: ['Sabar dalam dakwah', 'Tegas dalam kebenaran', 'Tawakkal kepada Allah', 'Nasih kepada kaumnya'],
        biography: 'Nabi Hud \'alaihissalam diutus kepada kaum \'Ad yang tinggal di Al-Ahqaf (bukit-bukit pasir di Hadramaut). Kaum \'Ad adalah bangsa yang kuat fisiknya, membangun istana-istana megah, namun mereka menyembah berhala dan berbuat kesombongan di muka bumi. Hud berdakwah kepada mereka untuk menyembah Allah saja, tetapi mereka menolak dan mengingkari.',
        majorEvents: [
            {
                event: 'Diutus kepada kaum \'Ad',
                year: 'Awal kenabian',
                description: 'Hud diutus Allah untuk berdakwah kepada kaum \'Ad yang telah menyimpang dari tauhid',
                references: ['QS. Al-A\'raf: 65-66', 'QS. Hud: 50', 'QS. Al-Ahqaf: 21']
            },
            {
                event: 'Dakwah tauhid kepada kaum \'Ad',
                year: 'Masa kenabian',
                description: 'Hud menyeru kaumnya untuk menyembah Allah saja dan meninggalkan penyembahan berhala',
                references: ['QS. Al-A\'raf: 65', 'QS. Hud: 50-51']
            },
            {
                event: 'Penolakan dan ancaman kaum \'Ad',
                year: 'Selama dakwah',
                description: 'Kaum \'Ad menolak dakwah Hud dan mengancamnya, mereka mengandalkan kekuatan fisik mereka',
                references: ['QS. Al-A\'raf: 66-70', 'QS. Hud: 53-57']
            },
            {
                event: 'Peringatan azab dari Hud',
                year: 'Setelah penolakan',
                description: 'Hud memperingatkan kaumnya akan datangnya azab Allah jika mereka tetap dalam kekafiran',
                references: ['QS. Hud: 57', 'QS. Al-Ahqaf: 24-25']
            },
            {
                event: 'Datangnya angin kencang (Rih Aqim)',
                year: 'Saat azab turun',
                description: 'Allah menurunkan angin kencang yang sangat dingin selama 7 malam 8 hari untuk membinasakan kaum \'Ad',
                references: ['QS. Al-Haqqah: 6-8', 'QS. Fusshilat: 16', 'QS. Al-Ahqaf: 24-25']
            },
            {
                event: 'Binasanya kaum \'Ad',
                year: 'Akhir azab',
                description: 'Kaum \'Ad binasa karena angin kencang, hanya Hud dan orang-orang yang beriman yang diselamatkan',
                references: ['QS. Al-A\'raf: 72', 'QS. Hud: 58']
            }
        ],
        lessons: [
            'Bahaya kesombongan dan keangkuhan terhadap nikmat Allah',
            'Kekuatan fisik dan kemegahan dunia tidak melindungi dari azab Allah',
            'Pentingnya bersyukur atas nikmat Allah dan tidak melampaui batas',
            'Kesetiaan nabi kepada kaumnya meskipun mereka menolaknya'
        ],
        references: [
            'Al-Quran: QS. Al-A\'raf: 65-72',
            'Al-Quran: QS. Hud: 50-60',
            'Al-Quran: QS. Al-Ahqaf: 21-26',
            'Al-Quran: QS. Al-Haqqah: 4-8',
            'Al-Quran: QS. Fusshilat: 15-16',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya',
            'Tafsir Ibn Katsir: Surah Al-A\'raf dan Hud',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: []
    },
    {
        id: 'shalih',
        name: 'Shalih',
        arabicName: 'صالح',
        title: 'Nabi \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'Setelah Hud, sebelum Ibrahim',
        periodHijri: 'Sebelum perhitungan tarikh',
        birthPlace: 'Hijr (Al-Hijr), Arabia Utara',
        deathPlace: 'Palestina (menurut sebagian riwayat)',
        tribe: 'Kaum Tsamud',
        father: 'Ubaid bin Maseh',
        mother: 'tidak diketahui',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Nabi dan Rasul',
        qualities: ['Shalih (orang yang shaleh)', 'Sabar dalam dakwah', 'Bijaksana', 'Tawakkal kepada Allah'],
        biography: 'Nabi Shalih \'alaihissalam diutus kepada kaum Tsamud yang tinggal di Al-Hijr (sekarang daerah Mada\'in Shalih di Arab Saudi). Kaum Tsamud pandai memahat rumah dari gunung batu, namun mereka menyembah berhala. Shalih berdakwah kepada mereka, dan sebagai mukjizat, Allah mengeluarkan seekor unta betina dari batu gunung atas permintaan mereka.',
        majorEvents: [
            {
                event: 'Diutus kepada kaum Tsamud',
                year: 'Awal kenabian',
                description: 'Shalih diutus Allah untuk berdakwah kepada kaum Tsamud yang menyembah berhala',
                references: ['QS. Al-A\'raf: 73', 'QS. Hud: 61', 'QS. Asy-Syu\'ara: 141-142']
            },
            {
                event: 'Dakwah tauhid kepada kaum Tsamud',
                year: 'Masa kenabian',
                description: 'Shalih menyeru kaumnya untuk menyembah Allah saja dan bersyukur atas nikmat-Nya',
                references: ['QS. Al-A\'raf: 73', 'QS. Hud: 61']
            },
            {
                event: 'Permintaan mukjizat dari kaum Tsamud',
                year: 'Selama dakwah',
                description: 'Kaum Tsamud meminta Shalih mengeluarkan unta dari batu gunung sebagai tanda kenabian',
                references: ['QS. Al-A\'raf: 77', 'QS. Asy-Syu\'ara: 154-155']
            },
            {
                event: 'Mukjizat unta betina dari batu',
                year: 'Saat diminta mukjizat',
                description: 'Allah mengeluarkan seekor unta betina besar dari batu gunung sebagai mukjizat untuk Shalih',
                references: ['QS. Al-A\'raf: 73', 'QS. Hud: 64', 'QS. Asy-Syu\'ara: 155']
            },
            {
                event: 'Peringatan tentang unta Allah',
                year: 'Setelah mukjizat unta',
                description: 'Shalih melarang kaumnya menyakiti unta Allah dan memberi peringatan tentang azab',
                references: ['QS. Al-A\'raf: 73', 'QS. Hud: 64', 'QS. Asy-Syu\'ara: 156']
            },
            {
                event: 'Penyembelihan unta oleh kaum Tsamud',
                year: 'Setelah peringatan',
                description: 'Sembilan orang dari kaum Tsamud menyembelih unta Allah dengan durhaka',
                references: ['QS. Al-A\'raf: 77', 'QS. Hud: 65', 'QS. Asy-Syu\'ara: 157']
            },
            {
                event: 'Peringatan azab tiga hari',
                year: 'Setelah unta disembelih',
                description: 'Shalih memberi peringatan bahwa azab akan datang dalam tiga hari',
                references: ['QS. Hud: 65']
            },
            {
                event: 'Datangnya gempa dan suara keras (Shaihah)',
                year: 'Hari ketiga setelah peringatan',
                description: 'Allah menurunkan gempa bumi dan suara keras yang membinasakan kaum Tsamud',
                references: ['QS. Al-A\'raf: 78', 'QS. Hud: 67', 'QS. Al-Haqqah: 5']
            },
            {
                event: 'Keselamatan Shalih dan pengikutnya',
                year: 'Saat azab turun',
                description: 'Shalih dan orang-orang yang beriman diselamatkan Allah dari azab tersebut',
                references: ['QS. Hud: 66']
            }
        ],
        lessons: [
            'Mukjizat adalah tanda kenabian yang harus dihormati',
            'Bahaya mendustakan ayat-ayat Allah setelah melihat bukti kebenaran',
            'Pentingnya menepati janji dan tidak melanggar larangan Allah',
            'Azab Allah pasti datang bagi yang mendustakan rasul-Nya'
        ],
        references: [
            'Al-Quran: QS. Al-A\'raf: 73-79',
            'Al-Quran: QS. Hud: 61-68',
            'Al-Quran: QS. Asy-Syu\'ara: 141-158',
            'Al-Quran: QS. Al-Haqqah: 4-5',
            'Al-Quran: QS. Al-Qamar: 23-31',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya',
            'Tafsir Ibn Katsir: Surah Al-A\'raf dan Hud',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'لَا تَدْخُلُوا مَسَاكِنَ الَّذِينَ ظَلَمُوا أَنْفُسَهُمْ إِلَّا أَنْ تَكُونُوا بَاكِينَ',
                latin: 'La tadkhulu masakinal ladhina zhalamu anfusahum illa an takunu bakin',
                translation: 'Janganlah kalian memasuki tempat tinggal orang-orang yang menzhalimi diri mereka sendiri kecuali dalam keadaan menangis',
                source: 'HR. Bukhari 4419 (tentang melewati bekas negeri Tsamud)'
            }
        ]
    }
];

// Export untuk digunakan
if (typeof module !== 'undefined' && module.exports) {
    module.exports = nabiPart1;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.nabiPart1 = nabiPart1;
}