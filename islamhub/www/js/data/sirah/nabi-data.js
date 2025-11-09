// Database 25 Nabi dan Rasul
// Berdasarkan riwayat shahih dari Al-Quran, hadits, dan atsar

const nabiDatabase = [
    {
        id: 'idris',
        name: 'Idris',
        arabicName: 'إدريس',
        title: '\'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'Setelah Adam, sebelum Nuh',
        periodHijri: 'Sebelum tarikh',
        birthPlace: 'Babylonia',
        tribe: 'Keturunan Syits bin Adam',
        father: 'Yarid',
        mother: 'tidak diketahui',
        wife: ['tidak diketahui'],
        children: ['Matusalah'],
        profession: 'Nabi dan penjahit',
        qualities: ['Sabar', 'Tekun beribadah', 'Ahli tulis-menulis', 'Diangkat ke tempat tinggi'],
        biography: 'Nabi Idris \'alaihissalam adalah nabi kedua setelah Adam. Beliau dikenal sebagai orang pertama yang bisa menulis dengan pena dan menjahit pakaian. Allah mengangkatnya ke tempat yang tinggi sebagaimana disebutkan dalam Al-Quran. Beliau juga dikenal dengan kesabaran dan ketekunannya dalam beribadah.',
        majorEvents: [
            {
                event: 'Diangkat menjadi nabi',
                year: 'Masa hidup',
                description: 'Diutus untuk menyebarkan ajaran tauhid kepada kaumnya',
                references: ['QS. Maryam: 56-57', 'QS. Al-Anbiya: 85']
            },
            {
                event: 'Mengajarkan tulis-menulis',
                year: 'Masa kenabian',
                description: 'Mengajarkan manusia cara menulis dengan pena dan membuat pakaian',
                references: ['Tafsir Ibn Katsir tentang QS. Maryam: 56']
            },
            {
                event: 'Diangkat ke tempat tinggi',
                year: 'Akhir kehidupan',
                description: 'Allah mengangkatnya ke tempat yang tinggi (makanan mukanan \'aliyyan)',
                references: ['QS. Maryam: 57']
            }
        ],
        lessons: [
            'Pentingnya ilmu pengetahuan dan teknologi dalam Islam',
            'Ketekunan dalam beribadah kepada Allah',
            'Kesabaran dalam berdakwah menyebarkan tauhid',
            'Allah memuliakan hamba-hamba-Nya yang taat'
        ],
        references: [
            'Al-Quran: QS. Maryam: 56-57',
            'Al-Quran: QS. Al-Anbiya: 85',
            'Tafsir Ibn Katsir',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'رَفَعْنَاهُ مَكَانًا عَلِيًّا',
                latin: 'Rafa\'nahu makanan \'aliyyan',
                translation: 'Dan Kami angkat dia ke tempat yang tinggi',
                source: 'QS. Maryam: 57'
            }
        ]
    },
    {
        id: 'nuh',
        name: 'Nuh',
        arabicName: 'نوح',
        title: '\'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: '950 tahun berdakwah',
        periodHijri: 'Sebelum tarikh',
        birthPlace: 'Mesopotamia',
        tribe: 'Keturunan Syits bin Adam',
        father: 'Lamak',
        mother: 'tidak diketahui',
        wife: ['Wailah'],
        children: ['Sam', 'Ham', 'Yafits', 'Kan\'an'],
        profession: 'Nabi dan Rasul',
        qualities: ['Sabar dalam dakwah', 'Tawakkal', 'Taat kepada Allah', 'Gigih'],
        biography: 'Nabi Nuh \'alaihissalam adalah nabi yang berdakwah paling lama, yaitu 950 tahun. Beliau diutus untuk mengajak kaumnya meninggalkan penyembahan berhala dan kembali kepada tauhid. Karena kaumnya tetap kafir, Allah menurunkan banjir besar (tufan) yang menenggelamkan mereka semua kecuali yang beriman.',
        majorEvents: [
            {
                event: 'Diutus menjadi nabi',
                year: 'Awal masa kenabian',
                description: 'Diutus kepada kaumnya untuk mengajak kepada tauhid dan meninggalkan penyembahan berhala',
                references: ['QS. Al-A\'raf: 59-64', 'QS. Nuh: 1-4']
            },
            {
                event: 'Dakwah selama 950 tahun',
                year: '950 tahun',
                description: 'Nuh berdakwah dengan berbagai cara, siang malam, secara terang-terangan dan sembunyi-sembunyi',
                references: ['QS. Al-Ankabut: 14', 'QS. Nuh: 5-20']
            },
            {
                event: 'Perintah membuat kapal',
                year: 'Menjelang banjir',
                description: 'Allah memerintahkan Nuh membuat kapal sebagai persiapan menghadapi banjir besar',
                references: ['QS. Hud: 37-38', 'QS. Al-Mu\'minun: 27']
            },
            {
                event: 'Banjir besar (Tufan)',
                year: 'Setelah 950 tahun dakwah',
                description: 'Allah menurunkan banjir besar yang menenggelamkan kaum yang kafir',
                references: ['QS. Hud: 40-48', 'QS. Al-Qamar: 11-15']
            }
        ],
        lessons: [
            'Kesabaran dalam berdakwah meski menghadapi penolakan bertahun-tahun',
            'Pentingnya tauhid dan bahaya syirik dalam kehidupan',
            'Tawakkal kepada Allah dalam menghadapi ujian berat',
            'Keadilan Allah dalam mengazab orang-orang yang durhaka'
        ],
        references: [
            'Al-Quran: QS. Nuh: 1-28',
            'Al-Quran: QS. Hud: 25-48',
            'Al-Quran: QS. Al-A\'raf: 59-64',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya',
            'Qishash al-Anbiya - Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'إِنَّ اللَّهَ صَبُورٌ يُحِبُّ الصَّبْرَ',
                latin: 'Inna Allaha shaburun yuhibbu ash-shabr',
                translation: 'Sesungguhnya Allah Maha Sabar dan menyukai kesabaran',
                source: 'Makna dari sifat Allah dan kisah Nabi Nuh'
            }
        ]
    },
    {
        id: 'hud',
        name: 'Hud',
        arabicName: 'هود',
        title: '\'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'Setelah Nuh',
        periodHijri: 'Sebelum tarikh',
        birthPlace: 'Ahqaf (Yaman Selatan)',
        tribe: 'Ad',
        father: 'Syalikh',
        mother: 'tidak diketahui',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Nabi dan Rasul',
        qualities: ['Tegas dalam kebenaran', 'Sabar', 'Tidak takut kepada manusia', 'Tawakkal'],
        biography: 'Nabi Hud \'alaihissalam diutus kepada kaum Ad yang tinggal di Ahqaf. Kaumnya terkenal kuat fisiknya dan memiliki peradaban yang maju, namun mereka sombong dan menyembah berhala. Hud mengajak mereka kepada tauhid, tetapi mereka menolak sehingga Allah mengazab mereka dengan angin kencang yang menghancurkan.',
        majorEvents: [
            {
                event: 'Diutus kepada kaum Ad',
                year: 'Masa kenabian',
                description: 'Diutus untuk mengajak kaum Ad meninggalkan penyembahan berhala',
                references: ['QS. Al-A\'raf: 65-72', 'QS. Hud: 50-60']
            },
            {
                event: 'Mengingatkan kaum Ad',
                year: 'Selama berdakwah',
                description: 'Mengingatkan kaum Ad agar bersyukur atas kekuatan dan kemakmuran yang Allah berikan',
                references: ['QS. Ash-Shu\'ara: 123-140']
            },
            {
                event: 'Ancaman azab Allah',
                year: 'Setelah penolakan',
                description: 'Hud memperingatkan akan datangnya azab Allah jika mereka tetap dalam kekafiran',
                references: ['QS. Al-Ahqaf: 21-26']
            },
            {
                event: 'Azab angin kencang',
                year: 'Akhir dakwah',
                description: 'Allah mengazab kaum Ad dengan angin kencang selama 7 malam 8 hari',
                references: ['QS. Al-Haqqah: 6-8', 'QS. Fussilat: 15-16']
            }
        ],
        lessons: [
            'Bahaya kesombongan dan kekufuran meski memiliki kekuatan',
            'Nikmat Allah harus disyukuri, bukan dijadikan alat untuk berbuat maksiat',
            'Kebenaran harus disampaikan meski ditentang mayoritas',
            'Azab Allah pasti datang kepada kaum yang mendustakan rasul'
        ],
        references: [
            'Al-Quran: QS. Al-A\'raf: 65-72',
            'Al-Quran: QS. Hud: 50-60',
            'Al-Quran: QS. Al-Ahqaf: 21-26',
            'Al-Quran: QS. Ash-Shu\'ara: 123-140',
            'Tafsir Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'وَإِلَى عَادٍ أَخَاهُمْ هُودًا',
                latin: 'Wa ila \'Adin akhahum Hudan',
                translation: 'Dan kepada kaum Ad (Kami utus) saudara mereka Hud',
                source: 'QS. Al-A\'raf: 65'
            }
        ]
    },
    {
        id: 'saleh',
        name: 'Saleh',
        arabicName: 'صالح',
        title: '\'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: 'Setelah Hud',
        periodHijri: 'Sebelum tarikh',
        birthPlace: 'Hijr (Arab Saudi)',
        tribe: 'Tsamud',
        father: 'Ubaid',
        mother: 'tidak diketahui',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Nabi dan Rasul',
        qualities: ['Saleh (sholih)', 'Sabar', 'Bijaksana', 'Tegas dalam dakwah'],
        biography: 'Nabi Saleh \'alaihissalam diutus kepada kaum Tsamud yang terkenal pandai memahat gunung untuk dijadikan rumah. Mereka meminta mukjizat berupa unta yang keluar dari batu sebagai tanda kebenaran Saleh. Allah memberikan mukjizat tersebut, namun mereka kemudian membunuh unta itu sehingga Allah menurunkan azab berupa suara mengguntur yang membinasakan mereka.',
        majorEvents: [
            {
                event: 'Diutus kepada kaum Tsamud',
                year: 'Masa kenabian',
                description: 'Diutus untuk mengajak kaum Tsamud kepada tauhid dan meninggalkan penyembahan berhala',
                references: ['QS. Al-A\'raf: 73-79', 'QS. Hud: 61-68']
            },
            {
                event: 'Mukjizat unta dari batu',
                year: 'Setelah diminta tanda',
                description: 'Atas permintaan kaumnya, Allah mengeluarkan unta dari batu sebagai mukjizat',
                references: ['QS. Ash-Shu\'ara: 141-158', 'QS. Al-Qamar: 27-29']
            },
            {
                event: 'Peringatan tentang unta',
                year: 'Setelah mukjizat',
                description: 'Saleh memperingatkan agar tidak mengganggu unta Allah dan membiarkannya makan',
                references: ['QS. Al-A\'raf: 73', 'QS. Ash-Shams: 13']
            },
            {
                event: 'Pembunuhan unta',
                year: 'Kemudian',
                description: 'Kaum Tsamud membunuh unta mukjizat tersebut meski telah dilarang',
                references: ['QS. Al-Qamar: 29', 'QS. Ash-Shams: 14']
            },
            {
                event: 'Azab suara mengguntur',
                year: 'Setelah pembunuhan unta',
                description: 'Allah mengazab kaum Tsamud dengan suara mengguntur yang membinasakan',
                references: ['QS. Fussilat: 17', 'QS. Al-Haqqah: 5']
            }
        ],
        lessons: [
            'Mukjizat adalah tanda kebenaran risalah para nabi',
            'Bahaya mendustakan ayat-ayat Allah setelah melihat bukti yang jelas',
            'Kesombongan dan kedegilan dapat membawa kehancuran',
            'Allah tidak segera mengazab, tetapi memberi peringatan terlebih dahulu'
        ],
        references: [
            'Al-Quran: QS. Al-A\'raf: 73-79',
            'Al-Quran: QS. Hud: 61-68',
            'Al-Quran: QS. Ash-Shu\'ara: 141-158',
            'Al-Quran: QS. Al-Qamar: 23-32',
            'Tafsir Ibn Katsir'
        ],
        haditsShahih: [
            {
                arabic: 'وَإِلَى ثَمُودَ أَخَاهُمْ صَالِحًا',
                latin: 'Wa ila Tsamuda akhahum Salihan',
                translation: 'Dan kepada Tsamud (Kami utus) saudara mereka Saleh',
                source: 'QS. Al-A\'raf: 73'
            }
        ]
    },
    {
        id: 'ibrahim',
        name: 'Ibrahim',
        arabicName: 'إبراهيم',
        title: 'Khalilullah (Kekasih Allah) \'Alaihissalam',
        category: 'nabi',
        subcategory: 'nabi',
        period: '2166-1991 SM / 175 tahun',
        periodHijri: 'Sebelum tarikh',
        birthPlace: 'Ur, Babylonia',
        tribe: 'Keturunan Sam bin Nuh',
        father: 'Azar (Tarih)',
        mother: 'tidak diketahui',
        wife: ['Sarah', 'Hajar'],
        children: ['Ismail (dari Hajar)', 'Ishaq (dari Sarah)'],
        profession: 'Nabi dan Rasul',
        qualities: ['Khalil Allah', 'Hanif', 'Keteguhan iman', 'Ketaatan mutlak'],
        biography: 'Nabi Ibrahim \'alaihissalam adalah nabi yang dijuluki Khalilullah (Kekasih Allah) dan Abul Anbiya (Bapak para Nabi). Beliau diutus untuk memberantas penyembahan berhala di kaumnya. Ibrahim dikenal karena keteguhannya dalam tauhid, kesediaannya mengorbankan anaknya Ismail, dan membangun Ka\'bah bersama Ismail.',
        majorEvents: [
            {
                event: 'Menghancurkan berhala-berhala',
                year: 'Masa muda',
                description: 'Ibrahim menghancurkan berhala-berhala kaumnya untuk membuktikan kebatilan penyembahan selain Allah',
                references: ['QS. Al-Anbiya: 57-67', 'QS. Ash-Shaffat: 85-98']
            },
            {
                event: 'Dibakar dalam api',
                year: 'Setelah menghancurkan berhala',
                description: 'Kaum Ibrahim memasukkannya ke dalam api besar, namun Allah menyelamatkannya',
                references: ['QS. Al-Anbiya: 68-70', 'QS. Al-Ankabut: 24']
            },
            {
                event: 'Hijrah ke Palestina',
                year: 'Setelah diselamatkan dari api',
                description: 'Ibrahim hijrah meninggalkan kaumnya menuju tanah yang diberkahi Allah',
                references: ['QS. Al-Ankabut: 26', 'QS. As-Saffat: 99']
            },
            {
                event: 'Diuji dengan menyembelih Ismail',
                year: 'Ketika Ismail remaja',
                description: 'Allah menguji Ibrahim dengan perintah menyembelih anaknya Ismail dalam mimpi',
                references: ['QS. As-Saffat: 100-111']
            },
            {
                event: 'Membangun Ka\'bah',
                year: 'Bersama Ismail',
                description: 'Ibrahim dan Ismail membangun kembali Ka\'bah di Makkah atas perintah Allah',
                references: ['QS. Al-Baqarah: 125-127']
            }
        ],
        lessons: [
            'Keteguhan dalam tauhid dan pemberantasan syirik',
            'Ketaatan mutlak kepada Allah dalam segala keadaan',
            'Pentingnya hijrah fi sabilillah ketika diperlukan',
            'Keteladanan dalam mendidik anak dengan nilai-nilai tauhid'
        ],
        references: [
            'Al-Quran: QS. Al-Baqarah: 124-141',
            'Al-Quran: QS. Al-Anbiya: 51-73',
            'Al-Quran: QS. As-Saffat: 83-113',
            'Shahih Bukhari: Kitab Ahadits al-Anbiya 3364-3372',
            'Sirah Ibn Hisyam tentang sejarah Ka\'bah'
        ],
        haditsShahih: [
            {
                arabic: 'إِنَّ إِبْرَاهِيمَ حَرَّمَ مَكَّةَ وَدَعَا لَهَا',
                latin: 'Inna Ibrahima harrama Makkata wa da\'a laha',
                translation: 'Sesungguhnya Ibrahim mengharamkan (berburu di) Makkah dan berdoa untuk (keberkahan) nya',
                source: 'HR. Bukhari 1834'
            }
        ]
    }
];

// Export untuk digunakan
export { nabiDatabase };