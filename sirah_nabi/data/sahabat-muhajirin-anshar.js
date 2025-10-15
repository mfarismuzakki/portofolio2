// Database Sahabat - Muhajirin dan Anshar
// Para sahabat yang hijrah dan yang membantu di Madinah

const sahabatMuhajirinAnshar = [
    // MUHAJIRIN TERKEMUKA
    {
        id: 'bilal_ibn_rabah',
        name: 'Bilal ibn Rabah',
        arabicName: 'بلال بن رباح',
        fullName: 'Bilal bin Rabah al-Habsyi',
        title: 'Muadzin Rasulullah, Sayyid al-Muadzdzinin',
        category: 'sahabat',
        subcategory: 'muhajirin',
        period: 'Sekitar 70 tahun (580-640 M)',
        periodHijri: '43 SH - 20 H',
        birthPlace: 'Makkah al-Mukarramah',
        deathPlace: 'Damascus, Syam',
        tribe: 'Habasyah (budak Arab)',
        father: 'Rabah (budak)',
        mother: 'Hamamah (budak Habasyah)',
        status: 'Mantan budak yang dimerdekakan Abu Bakr',
        wife: ['Hind (budak yang dimerdekakan)', 'dan lainnya'],
        children: ['Abdullah', 'Muhammad', 'dan lainnya'],
        profession: 'Muadzin, panglima perang',
        qualities: ['Suara indah', 'Setia', 'Pemberani', 'Taat', 'Rendah hati'],
        specialVirtue: 'Muadzin pertama dalam Islam dan suaranya paling merdu',
        biography: 'Bilal ibn Rabah adalah seorang budak Habasyah yang masuk Islam dan disiksa berat oleh tuannya. Abu Bakr membelinya dan memerdekakannya. Bilal menjadi muadzin Rasulullah dan terkenal dengan suaranya yang merdu. Setelah wafat Rasulullah, Bilal tidak pernah lagi azan karena sedih.',
        majorEvents: [
            {
                event: 'Masuk Islam dan disiksa berat',
                year: 'Awal dakwah',
                description: 'Bilal masuk Islam dan disiksa tuannya Umayyah bin Khalaf dengan cara dibaringkan di pasir panas',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Dimerdekakan oleh Abu Bakr',
                year: 'Masa awal Islam',
                description: 'Abu Bakr membeli Bilal dari tuannya dan memerdekakannya karena Allah',
                references: ['Shahih Bukhari']
            },
            {
                event: 'Hijrah ke Madinah',
                year: '1 H',
                description: 'Bilal hijrah ke Madinah bersama kaum muslimin lainnya',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Diangkat sebagai muadzin Masjid Nabawi',
                year: '1 H',
                description: 'Rasulullah mengangkat Bilal sebagai muadzin karena suaranya yang merdu dan indah',
                references: ['Sunan Tirmidzi']
            },
            {
                event: 'Ikut dalam Perang Badr',
                year: '2 H',
                description: 'Bilal ikut dalam Perang Badr dan membunuh bekas tuannya Umayyah bin Khalaf',
                references: ['Shahih Bukhari']
            },
            {
                event: 'Azan di atas Kakbah saat Fath Makkah',
                year: '8 H',
                description: 'Bilal naik ke atas Kakbah dan mengumandangkan azan setelah Makkah ditaklukkan',
                references: ['Sunan Abu Dawud']
            },
            {
                event: 'Menolak azan setelah wafat Rasulullah',
                year: 'Setelah 11 H',
                description: 'Bilal tidak mau lagi menjadi muadzin karena sedih ditinggal Rasulullah',
                references: ['Riwayat dalam kitab sirah']
            },
            {
                event: 'Ikut jihad ke Syam',
                year: '13 H ke atas',
                description: 'Bilal ikut jihad ke Syam dan menetap di sana hingga wafat',
                references: ['Tarikh at-Tabari']
            }
        ],
        virtues: [
            'Sabar dalam menghadapi siksaan karena keimanan',
            'Setia kepada Rasulullah hingga akhir hayat',
            'Suara azan yang paling merdu dan menyentuh hati',
            'Pemberani dalam peperangan membela Islam',
            'Rendah hati meski dekat dengan Rasulullah'
        ],
        briefBiography: 'Mantan budak Habasyah yang menjadi muadzin Rasulullah. Bilal disiksa berat karena Islam namun tetap teguh. Suara azannya yang merdu menggetarkan hati dan beliau tidak pernah azan lagi setelah Rasulullah wafat.',
        references: [
            'Sirah Ibn Hisyam',
            'Shahih Bukhari: Kitab Manaqib al-Anshar',
            'Al-Isabah fi Tamyiz as-Sahabah - Ibn Hajar'
        ],
        haditsShahih: [
            {
                arabic: 'أَحَدٌ أَحَدٌ',
                latin: 'Ahadun Ahadun',
                translation: 'Allah itu Esa, Allah itu Esa (yang diucapkan Bilal saat disiksa)',
                source: 'Diriwayatkan dalam sirah'
            }
        ]
    },
    {
        id: 'ammar_ibn_yasir',
        name: 'Ammar ibn Yasir',
        arabicName: 'عمار بن ياسر',
        fullName: 'Ammar bin Yasir bin Amir al-Ansi',
        title: 'Ath-Thayyib al-Muthayyab',
        category: 'sahabat',
        subcategory: 'muhajirin',
        period: '93 tahun (570-657 M)',
        periodHijri: '53 SH - 37 H',
        birthPlace: 'Makkah al-Mukarramah',
        deathPlace: 'Shiffin (Perang Shiffin)',
        tribe: 'Ansi (Yaman)',
        father: 'Yasir bin Amir (syahid pertama laki-laki)',
        mother: 'Sumayyah binti Khayyath (syahidah pertama)',
        wife: ['Salma binti Qais', 'dan lainnya'],
        children: ['Yazid', 'dan lainnya'],
        profession: 'Panglima perang, gubernur Kufah',
        qualities: ['Pemberani', 'Setia kepada Ali', 'Jujur', 'Sabar', 'Mujahid'],
        specialVirtue: 'Anak dari syuhada pertama dalam Islam (Yasir dan Sumayyah)',
        biography: 'Ammar ibn Yasir adalah anak dari syuhada pertama dalam Islam. Keluarganya disiksa berat oleh kaum kafir. Ammar menjadi sahabat yang sangat setia dan pemberani, dan gugur dalam Perang Shiffin membela Ali ibn Abi Thalib.',
        majorEvents: [
            {
                event: 'Keluarganya masuk Islam masa awal',
                year: 'Awal dakwah',
                description: 'Ammar, ayah Yasir, dan ibu Sumayyah masuk Islam pada masa awal dakwah',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Orang tuanya menjadi syuhada pertama',
                year: 'Masa awal Islam',
                description: 'Yasir dan Sumayyah disiksa hingga mati, menjadi syuhada pertama dalam Islam',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Ammar dipaksa mengucapkan kekufuran',
                year: 'Masa siksaan',
                description: 'Ammar dipaksa mengucapkan kata-kata kufur, lalu turun ayat QS. An-Nahl: 106 tentang ikrah',
                references: ['Tafsir at-Tabari QS. An-Nahl: 106']
            },
            {
                event: 'Hijrah ke Madinah',
                year: '1 H',
                description: 'Ammar hijrah ke Madinah bersama kaum muslimin lainnya',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Ikut membangun Masjid Nabawi',
                year: '1 H',
                description: 'Ammar ikut bergotong royong membangun Masjid Nabawi di Madinah',
                references: ['Shahih Bukhari']
            },
            {
                event: 'Berperan dalam berbagai peperangan',
                year: '2-10 H',
                description: 'Ammar ikut dalam berbagai peperangan membela Islam dan selalu menunjukkan keberanian',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Diangkat sebagai gubernur Kufah',
                year: '21 H',
                description: 'Khalifah Umar mengangkat Ammar sebagai gubernur Kufah',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Berpihak kepada Ali dalam fitnah',
                year: '35 H',
                description: 'Ammar berpihak kepada Ali ibn Abi Thalib dalam konflik politik setelah pembunuhan Utsman',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Gugur dalam Perang Shiffin',
                year: '37 H',
                description: 'Ammar gugur dalam Perang Shiffin melawan pasukan Muawiyah, sesuai hadits Rasulullah',
                references: ['Shahih Muslim 1064']
            }
        ],
        virtues: [
            'Keluarga syuhada yang rela berkorban untuk Islam',
            'Pemberani dan tidak pernah mundur dalam jihad',
            'Setia kepada kebenaran meski harus berkorban',
            'Rajin beribadah dan membangun masjid',
            'Jujur dan amanah dalam kepemimpinan'
        ],
        briefBiography: 'Anak dari syuhada pertama Islam yang menjadi pemberani dan setia. Ammar berpihak kepada Ali dan gugur dalam Perang Shiffin, sesuai dengan ramalan Rasulullah tentang kematiannya.',
        references: [
            'Sirah Ibn Hisyam',
            'Shahih Muslim: Kitab Fadha\'il as-Sahabah',
            'Tarikh at-Tabari',
            'Al-Isabah fi Tamyiz as-Sahabah - Ibn Hajar'
        ],
        haditsShahih: [
            {
                arabic: 'تَقْتُلُ عَمَّارًا الْفِئَةُ الْبَاغِيَةُ',
                latin: 'Taqtulu Ammaran al-fi\'ah al-baghiyah',
                translation: 'Ammar akan dibunuh oleh kelompok yang melampaui batas',
                source: 'HR. Muslim 1064'
            }
        ]
    },

    // ANSHAR TERKEMUKA  
    {
        id: 'sad_ibn_muadz',
        name: 'Sa\'d ibn Mu\'adz',
        arabicName: 'سعد بن معاذ',
        fullName: 'Sa\'d bin Mu\'adz bin an-Nu\'man al-Asyhali',
        title: 'Sayyid al-Aus',
        category: 'sahabat',
        subcategory: 'anshar_aus',
        period: '37 tahun (591-627 M)',
        periodHijri: '32 SH - 5 H',
        birthPlace: 'Yatsrib (Madinah)',
        deathPlace: 'Madinah al-Munawwarah',
        tribe: 'Aus (Banu Abd al-Asyhal)',
        father: 'Mu\'adz bin an-Nu\'man',
        mother: 'Kabsyah binti Rafi\'',
        wife: ['Hind binti Simmak', 'dan lainnya'],
        children: ['Amr', 'Abdullah', 'dan lainnya'],
        profession: 'Pemimpin suku, panglima perang',
        qualities: ['Pemimpin bijaksana', 'Pemberani', 'Tegas', 'Adil', 'Dicintai Allah'],
        sahabatTag: 'Sahabat Anshar (Penolong)',
        specialVirtue: 'Arsy Allah bergetar karena kematiannya',
        biography: 'Sa\'d ibn Mu\'adz adalah pemimpin suku Aus yang masuk Islam melalui dakwah Mush\'ab ibn Umair. Beliau menjadi pemimpin yang bijaksana dan gugur dalam Perang Khandaq. Rasulullah bersabda bahwa Arsy Allah bergetar karena kematian Sa\'d.',
        majorEvents: [
            {
                event: 'Masuk Islam melalui Mush\'ab ibn Umair',
                year: '12 tahun sebelum Hijrah',
                description: 'Sa\'d masuk Islam setelah mendengar dakwah Mush\'ab ibn Umair di Madinah',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Seluruh sukunya masuk Islam bersamanya',
                year: 'Setelah Sa\'d masuk Islam',
                description: 'Setelah Sa\'d masuk Islam, seluruh suku Banu Abd al-Asyhal mengikuti jejak pemimpinnya',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Menyambut kedatangan Rasulullah',
                year: '1 H',
                description: 'Sa\'d menyambut baik kedatangan Rasulullah ke Madinah dan memberikan dukungan penuh',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Berperan penting dalam Perang Badr',
                year: '2 H',
                description: 'Sa\'d ikut dalam Perang Badr dan memberikan kontribusi penting bagi kemenangan Muslim',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Memimpin suku Aus dalam Perang Uhud',
                year: '3 H',
                description: 'Sa\'d memimpin suku Aus dengan baik dalam Perang Uhud',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Terluka parah dalam Perang Khandaq',
                year: '5 H',
                description: 'Sa\'d terluka parah karena panah yang mengenai pembuluh darahnya dalam Perang Khandaq',
                references: ['Shahih Bukhari 4121']
            },
            {
                event: 'Memutuskan hukuman untuk Banu Quraizhah',
                year: '5 H',
                description: 'Sa\'d diminta memutuskan hukuman untuk Banu Quraizhah yang berkhianat, dan keputusannya sesuai hukum Taurat',
                references: ['Shahih Bukhari 4121']
            },
            {
                event: 'Wafat dan Arsy Allah bergetar',
                year: '5 H',
                description: 'Sa\'d wafat karena lukanya, dan Rasulullah bersabda bahwa Arsy Allah bergetar karenanya',
                references: ['Sunan an-Nasa\'i 2063']
            }
        ],
        virtues: [
            'Pemimpin yang bijaksana dan disegani sukunya',
            'Pemberani dan tidak takut mati dalam jihad',
            'Adil dalam memutuskan hukum meski berat',
            'Setia kepada Rasulullah dan Islam',
            'Dicintai Allah hingga Arsy-Nya bergetar'
        ],
        briefBiography: 'Pemimpin suku Aus yang masuk Islam dan membawa seluruh sukunya beriman. Sa\'d gugur dalam Perang Khandaq dan Rasulullah bersabda bahwa Arsy Allah bergetar karena kematiannya.',
        references: [
            'Sirah Ibn Hisyam',
            'Shahih Bukhari: Kitab Maghazi',
            'Sunan an-Nasa\'i: Kitab al-Jana\'iz',
            'Al-Isabah fi Tamyiz as-Sahabah - Ibn Hajar'
        ],
        haditsShahih: [
            {
                arabic: 'اهْتَزَّ عَرْشُ الرَّحْمَنِ لِمَوْتِ سَعْدِ بْنِ مُعَاذٍ',
                latin: 'Ihtazza \'arsyu ar-Rahmani li mawti Sa\'d bin Mu\'adz',
                translation: 'Arsy Allah Yang Maha Pengasih bergetar karena kematian Sa\'d bin Mu\'adz',
                source: 'HR. an-Nasa\'i 2063'
            }
        ]
    },
    {
        id: 'sad_ibn_ubadah',
        name: 'Sa\'d ibn Ubadah',
        arabicName: 'سعد بن عبادة',
        fullName: 'Sa\'d bin Ubadah bin Dulaim al-Khazraji',
        title: 'Sayyid al-Khazraj',
        category: 'sahabat',
        subcategory: 'anshar_khazraj',
        period: 'Sekitar 60 tahun (560-635 M)',
        periodHijri: '63 SH - 14 H',
        birthPlace: 'Yatsrib (Madinah)',
        deathPlace: 'Hauran, Syam',
        tribe: 'Khazraj (Banu Sa\'idah)',
        father: 'Ubadah bin Dulaim',
        mother: 'Amrah binti Mas\'ud',
        wife: ['Fukayhah binti Ubaid', 'dan lainnya'],
        children: ['Qais', 'Suhayl', 'dan lainnya'],
        profession: 'Pemimpin suku, dermawan',
        qualities: ['Pemimpin karismatik', 'Dermawan', 'Pemberani', 'Setia kawan', 'Mulia'],
        sahabatTag: 'Sahabat Anshar (Penolong)',
        specialVirtue: 'Pemimpin suku Khazraj yang sangat dermawan dan mulia',
        biography: 'Sa\'d ibn Ubadah adalah pemimpin suku Khazraj yang sangat dihormati. Beliau terkenal dermawan dan mulia akhlaknya. Sa\'d ikut dalam Bai\'at Aqabah dan menjadi salah satu tokoh penting Anshar, meski tidak setuju dengan pemilihan Abu Bakr sebagai khalifah.',
        majorEvents: [
            {
                event: 'Ikut dalam Bai\'at Aqabah Kedua',
                year: '13 tahun sebelum Hijrah',
                description: 'Sa\'d ikut dalam Bai\'at Aqabah Kedua dan berjanji melindungi Rasulullah',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Menyambut kedatangan Rasulullah',
                year: '1 H',
                description: 'Sa\'d menyambut Rasulullah dengan sangat baik dan memberikan dukungan penuh',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Terkenal sangat dermawan kepada tamu',
                year: 'Sepanjang hidup',
                description: 'Sa\'d terkenal sangat dermawan, rumahnya selalu terbuka untuk tamu dan orang miskin',
                references: ['Al-Isabah fi Tamyiz as-Sahabah']
            },
            {
                event: 'Ikut dalam berbagai peperangan',
                year: '2-10 H',
                description: 'Sa\'d ikut dalam berbagai peperangan membela Islam bersama Rasulullah',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Dicalonkan sebagai khalifah di Saqifah',
                year: '11 H',
                description: 'Dalam pertemuan Saqifah Bani Sa\'idah, Sa\'d dicalonkan Anshar sebagai khalifah',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Tidak setuju pemilihan Abu Bakr',
                year: '11 H',
                description: 'Sa\'d tidak setuju dengan pemilihan Abu Bakr dan tidak membai\'at',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Pindah ke Syam',
                year: '13 H',
                description: 'Sa\'d pindah ke Syam dan menetap di sana hingga wafat',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Wafat di Hauran, Syam',
                year: '14 H',
                description: 'Sa\'d wafat di Hauran, Syam dalam keadaan yang masih diperdebatkan para sejarawan',
                references: ['Tarikh at-Tabari']
            }
        ],
        virtues: [
            'Pemimpin suku yang bijaksana dan karismatik',
            'Sangat dermawan kepada tamu dan fakir miskin',
            'Pemberani dalam membela Islam dan Rasulullah',
            'Setia kepada prinsip yang diyakini benar',
            'Akhlaq yang mulia dan disenangi kawan'
        ],
        briefBiography: 'Pemimpin suku Khazraj yang sangat dermawan dan mulia. Sa\'d ikut Bai\'at Aqabah dan mendukung Rasulullah, namun tidak setuju dengan sistem khalifah setelah wafat Rasulullah.',
        references: [
            'Sirah Ibn Hisyam',
            'Tarikh at-Tabari',
            'Al-Isabah fi Tamyiz as-Sahabah - Ibn Hajar'
        ],
        haditsShahih: []
    },
    {
        id: 'usaid_ibn_hudair',
        name: 'Usaid ibn Hudair',
        arabicName: 'أسيد بن حضير',
        fullName: 'Usaid bin Hudair bin Simak al-Asyhali',
        title: 'Salah satu Nuqaba Anshar',
        category: 'sahabat',
        subcategory: 'anshar_aus',
        period: 'Sekitar 60 tahun (570-635 M)',
        periodHijri: '53 SH - 20 H',
        birthPlace: 'Yatsrib (Madinah)',
        deathPlace: 'Madinah al-Munawwarah',
        tribe: 'Aus (Banu Abd al-Asyhal)',
        father: 'Hudair bin Simak',
        mother: 'Khansa binti Khuzaim',
        wife: ['Salma binti Qais', 'dan lainnya'],
        children: ['Muhammad', 'Abdullah', 'dan lainnya'],
        profession: 'Pemimpin suku, qari',
        qualities: ['Suara merdu', 'Bijaksana', 'Setia', 'Pemberani', 'Qari Al-Quran'],
        sahabatTag: 'Sahabat Anshar (Penolong)',
        specialVirtue: 'Suara bacaan Al-Qurannya yang merdu hingga malaikat turun mendengarkan',
        biography: 'Usaid ibn Hudair adalah salah satu pemimpin Anshar yang masuk Islam bersama Sa\'d ibn Mu\'adz. Beliau terkenal dengan suara bacaan Al-Qurannya yang sangat merdu. Suatu malam, malaikat turun mendengarkan bacaannya hingga kuda Usaid takut.',
        majorEvents: [
            {
                event: 'Masuk Islam bersama Sa\'d ibn Mu\'adz',
                year: '12 tahun sebelum Hijrah',
                description: 'Usaid masuk Islam bersamaan dengan Sa\'d ibn Mu\'adz setelah mendengar dakwah Mush\'ab',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Ikut dalam Bai\'at Aqabah',
                year: '13 tahun sebelum Hijrah',
                description: 'Usaid ikut dalam Bai\'at Aqabah dan menjadi salah satu Nuqaba (perwakilan) Anshar',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Menyambut Rasulullah di Madinah',
                year: '1 H',
                description: 'Usaid menyambut kedatangan Rasulullah dengan penuh suka cita',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Ikut dalam semua peperangan',
                year: '2-10 H',
                description: 'Usaid ikut dalam semua peperangan bersama Rasulullah dan menunjukkan keberanian',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Malaikat turun mendengar bacaan Qurannya',
                year: 'Masa Madinah',
                description: 'Suatu malam, malaikat turun mendengarkan bacaan Al-Quran Usaid yang merdu',
                references: ['Shahih Bukhari 5018']
            },
            {
                event: 'Menjadi pemimpin yang bijaksana',
                year: 'Sepanjang hidup',
                description: 'Usaid menjadi pemimpin yang bijaksana dan disenangi oleh sukunya',
                references: ['Al-Isabah fi Tamyiz as-Sahabah']
            }
        ],
        virtues: [
            'Suara bacaan Al-Quran yang sangat merdu',
            'Pemimpin yang bijaksana dan disenangi',
            'Pemberani dalam membela Islam',
            'Setia kepada Rasulullah dan sahabat',
            'Qari yang mahir dan tekun beribadah'
        ],
        briefBiography: 'Pemimpin Anshar yang terkenal dengan suara bacaan Al-Qurannya yang merdu hingga malaikat turun mendengarkan. Usaid adalah sahabat setia yang ikut dalam semua peperangan.',
        references: [
            'Sirah Ibn Hisyam',
            'Shahih Bukhari: Kitab Fadha\'il al-Quran',
            'Al-Isabah fi Tamyiz as-Sahabah - Ibn Hajar'
        ],
        haditsShahih: [
            {
                arabic: 'تِلْكَ الْمَلاَئِكَةُ كَانَتْ تَسْتَمِعُ لَكَ',
                latin: 'Tilka al-mala\'ikatu kanat tastami\'u lak',
                translation: 'Itu adalah malaikat yang sedang mendengarkan bacaanmu',
                source: 'HR. Bukhari 5018'
            }
        ]
    }
];

// Export untuk digunakan
if (typeof module !== 'undefined' && module.exports) {
    module.exports = sahabatMuhajirinAnshar;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.sahabatMuhajirinAnshar = sahabatMuhajirinAnshar;
}