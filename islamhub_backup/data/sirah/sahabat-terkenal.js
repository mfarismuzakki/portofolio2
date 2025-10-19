// Database Sahabat Terkenal Lainnya
// Berdasarkan riwayat shahih dari hadits dan atsar salaf

const sahabatTerkenal = [
    // SAHABAT SENIOR (SABIQUN AL-AWWALUN)
    {
        id: 'khadijah_binti_khuwailid',
        name: 'Khadijah binti Khuwailid',
        arabicName: 'خديجة بنت خويلد',
        fullName: 'Khadijah binti Khuwailid bin Asad al-Qurasyiyyah',
        title: 'Ummul Mukminin, Sayidah Nisa\'il Alamiin',
        category: 'sahabat',
        subcategory: 'ummul_mukminin',
        period: '65 tahun (555-620 M)',
        periodHijri: '68 SH - 10 SH',
        birthPlace: 'Makkah al-Mukarramah',
        deathPlace: 'Makkah al-Mukarramah',
        tribe: 'Quraisy (Banu Asad)',
        father: 'Khuwailid bin Asad',
        mother: 'Fatimah binti Za\'idah',
        wife: ['tidak ada (beliau adalah istri)'],
        children: ['Al-Qasim', 'Abdullah', 'Zainab', 'Ruqayyah', 'Ummu Kultsum', 'Fatimah az-Zahra'],
        profession: 'Pedagang besar, Ummul Mukminin',
        qualities: ['Tahirah (yang suci)', 'Dermawan', 'Bijaksana', 'Setia', 'Penyabar', 'Mulia'],
        sahabatTag: 'Ummul Mukminin (Ibu Orang Beriman)',
        guaranteedParadise: 'Dijamin masuk surga oleh Rasulullah',
        biography: 'Khadijah binti Khuwailid adalah istri pertama Rasulullah dan ibu dari hampir semua anak beliau. Khadijah adalah wanita pedagang kaya yang mempekerjakan Muhammad sebelum menikah dengannya. Beliau adalah orang pertama yang beriman kepada Rasulullah dan memberikan dukungan penuh dalam dakwah Islam.',
        majorEvents: [
            {
                event: 'Menikah dengan Rasulullah',
                year: '15 SH (595 M)',
                description: 'Khadijah melamar Muhammad setelah terkesan dengan kejujuran dan amanahnya',
                source: 'Shahih Bukhari 3392'
            },
            {
                event: 'Orang pertama yang beriman',
                year: '13 SH (610 M)',
                description: 'Khadijah langsung beriman ketika Rasulullah menerima wahyu pertama',
                source: 'Shahih Bukhari 3'
            },
            {
                event: 'Mendukung dakwah Islam',
                year: '13-3 SH',
                description: 'Khadijah menggunakan seluruh hartanya untuk mendukung dakwah Rasulullah',
                source: 'Siyar A\'lam an-Nubala 2/109'
            }
        ],
        briefBiography: 'Istri pertama Rasulullah dan orang pertama yang beriman. Khadijah mendukung penuh dakwah Islam dengan harta dan tenaganya hingga wafat pada tahun kesedihan.'
    },

    {
        id: 'bilal_ibn_rabah',
        name: 'Bilal ibn Rabah',
        arabicName: 'بلال بن رباح',
        fullName: 'Bilal bin Rabah al-Habsyi',
        title: 'Muadzin Rasulullah, Sayyid al-Muadzdzinin',
        category: 'sahabat',
        subcategory: 'muhajirin',
        period: '60 tahun (580-640 M)',
        periodHijri: '43 SH - 20 H',
        birthPlace: 'Makkah al-Mukarramah',
        deathPlace: 'Damaskus, Syam',
        tribe: 'Habasyah (budak dari Banu Jumah)',
        father: 'Rabah (budak)',
        mother: 'Hamamah (budak)',
        wife: ['Hind binti Sa\'id al-Anshariyyah'],
        children: ['tidak diketahui'],
        profession: 'Muadzin Rasulullah, panglima perang',
        qualities: ['Sabar dalam siksaan', 'Taqwa', 'Setia', 'Suara merdu', 'Pemberani'],
        sahabatTag: 'Sahabat Muhajirin (Yang Berhijrah)',
        biography: 'Bilal ibn Rabah adalah mantan budak yang masuk Islam pada masa awal dan mengalami siksaan berat dari tuannya Umayyah bin Khalaf. Abu Bakr membebaskannya dengan membayar tebusan. Bilal menjadi muadzin pertama dalam Islam dan selalu mendampingi Rasulullah dalam perjalanan.',
        majorEvents: [
            {
                event: 'Masuk Islam dan disiksa',
                year: '13 SH (610 M)',
                description: 'Bilal masuk Islam dan disiksa berat oleh Umayyah bin Khalaf',
                source: 'Shahih Bukhari 3754'
            },
            {
                event: 'Dibebaskan Abu Bakr',
                year: '12 SH (611 M)',
                description: 'Abu Bakr membebaskan Bilal dengan membayar tebusan kepada Umayyah',
                source: 'Siyar A\'lam an-Nubala 1/347'
            },
            {
                event: 'Menjadi muadzin pertama',
                year: '1 H (622 M)',
                description: 'Rasulullah menunjuk Bilal sebagai muadzin Masjid Nabawi',
                source: 'Sunan Abu Dawud 499'
            }
        ],
        briefBiography: 'Mantan budak yang menjadi muadzin Rasulullah. Bilal terkenal dengan keteguhan imannya saat disiksa dan suaranya yang merdu dalam mengumandangkan adzan.'
    },

    {
        id: 'khalid_ibn_walid',
        name: 'Khalid ibn al-Walid',
        arabicName: 'خالد بن الوليد',
        fullName: 'Khalid bin al-Walid bin al-Mughirah al-Makhzumi',
        title: 'Saif Allah al-Maslul (Pedang Allah yang Terhunus)',
        category: 'sahabat',
        subcategory: 'panglima',
        period: '52 tahun (592-638 M)',
        periodHijri: '30 SH - 21 H',
        birthPlace: 'Makkah al-Mukarramah',
        deathPlace: 'Homs, Syam',
        tribe: 'Quraisy (Banu Makhzum)',
        father: 'Al-Walid bin al-Mughirah',
        mother: 'Lubabah as-Sughra binti al-Harits',
        wife: ['Ummu Tamim binti al-Minhal', 'dan lainnya'],
        children: ['Sulaiman', 'Abdullah', 'al-Walid', 'Muhajir'],
        profession: 'Panglima perang, penakluk',
        qualities: ['Tidak pernah kalah perang', 'Strategi genius', 'Pemberani', 'Pemimpin', 'Taktis'],
        sahabatTag: 'Sahabat Panglima Perang',
        biography: 'Khalid ibn al-Walid adalah panglima perang terhebat dalam sejarah Islam yang tidak pernah kalah dalam pertempuran. Sebelum masuk Islam, beliau mengalahkan pasukan Muslim di Uhud. Setelah masuk Islam, Khalid memimpin penaklukan Irak dan Syam dengan strategi militer yang brilian.',
        majorEvents: [
            {
                event: 'Mengalahkan Muslim di Uhud',
                year: '3 H (625 M)',
                description: 'Khalid memimpin pasukan berkuda Quraisy dan mengalahkan pasukan Muslim',
                source: 'Shahih Bukhari 4043'
            },
            {
                event: 'Masuk Islam',
                year: '8 H (629 M)',
                description: 'Khalid masuk Islam bersama Amr ibn al-Ash dan Utsman ibn Thalhah',
                source: 'Siyar A\'lam an-Nubala 1/364'
            },
            {
                event: 'Penaklukan Irak',
                year: '12-13 H (633-634 M)',
                description: 'Khalid memimpin penaklukan Irak dengan kemenangan gemilang di Zat as-Salasil',
                source: 'Tarikh ath-Thabari 4/52'
            },
            {
                event: 'Penaklukan Syam',
                year: '13-18 H (634-639 M)',
                description: 'Khalid memimpin penaklukan Syam dan meraih kemenangan besar di Yarmuk',
                source: 'Al-Bidayah wan-Nihayah 7/125'
            }
        ],
        briefBiography: 'Panglima perang yang tidak pernah kalah, dijuluki "Pedang Allah yang Terhunus". Khalid memimpin penaklukan Irak dan Syam dengan strategi militer yang gemilang.'
    },

    {
        id: 'salman_al_farisi',
        name: 'Salman al-Farisi',
        arabicName: 'سلمان الفارسي',
        fullName: 'Salman bin al-Islam al-Farisi',
        title: 'Salman Minna Ahlil Bait (Salman dari Keluarga Kami)',
        category: 'sahabat',
        subcategory: 'muhajirin',
        period: '88 tahun (568-656 M)',
        periodHijri: '55 SH - 36 H',
        birthPlace: 'Isfahan, Persia',
        deathPlace: 'Al-Mada\'in, Irak',
        tribe: 'Persia (Majusi yang masuk Islam)',
        father: 'tidak diketahui (nama Persia)',
        mother: 'tidak diketahui',
        wife: ['Buqairah (budak yang dibebaskan)'],
        children: ['tidak diketahui'],
        profession: 'Gubernur al-Mada\'in, ulama',
        qualities: ['Bijaksana', 'Zuhud', 'Pencari kebenaran', 'Alim', 'Wara\''],
        sahabatTag: 'Sahabat Muhajirin (Yang Berhijrah)',
        biography: 'Salman al-Farisi adalah seorang Persia yang mencari kebenaran hingga akhirnya menemukan Islam. Beliau yang mengusulkan strategi menggali parit dalam Perang Khandaq. Rasulullah mengatakan "Salman minna ahlil bait" (Salman dari keluarga kami). Setelah Rasulullah wafat, Salman menjadi gubernur al-Mada\'in.',
        majorEvents: [
            {
                event: 'Perjalanan mencari kebenaran',
                year: 'Sebelum Islam',
                description: 'Salman meninggalkan Majusi dan berguru kepada rahib-rahib Nasrani',
                source: 'Shahih Bukhari 3359'
            },
            {
                event: 'Bertemu Rasulullah',
                year: '1 H (622 M)',
                description: 'Salman bertemu Rasulullah di Madinah dan langsung masuk Islam',
                source: 'Musnad Ahmad 23/462'
            },
            {
                event: 'Mengusulkan strategi parit',
                year: '5 H (627 M)',
                description: 'Salman mengusulkan menggali parit untuk menghadapi gabungan suku Arab',
                source: 'Shahih Bukhari 4108'
            },
            {
                event: 'Menjadi gubernur al-Mada\'in',
                year: '16 H (637 M)',
                description: 'Umar menunjuk Salman sebagai gubernur al-Mada\'in (Ctesiphon)',
                source: 'Siyar A\'lam an-Nubala 1/506'
            }
        ],
        briefBiography: 'Sahabat dari Persia yang mencari kebenaran hingga menemukan Islam. Salman yang mengusulkan strategi parit dan dijadikan "keluarga" oleh Rasulullah.'
    },

    {
        id: 'abu_dharr_al_ghifari',
        name: 'Abu Dzarr al-Ghifari',
        arabicName: 'أبو ذر الغفاري',
        fullName: 'Jundub bin Junadah al-Ghifari',
        title: 'Abu Dzarr, Akhir man yamutu min as-Sahabah',
        category: 'sahabat',
        subcategory: 'sahabat_awal',
        period: '85 tahun (573-652 M)',
        periodHijri: '50 SH - 32 H',
        birthPlace: 'Gurun Arab (Bani Ghifar)',
        deathPlace: 'Ar-Rabadzah (dalam pengasingan)',
        tribe: 'Ghifar',
        father: 'Junadah bin Sufyan',
        mother: 'tidak diketahui',
        wife: ['Ummu Dzarr'],
        children: ['Dzarr', 'dan lainnya'],
        profession: 'Penggembala, zahid',
        qualities: ['Zuhud luar biasa', 'Jujur', 'Berani berkata benar', 'Wara\'', 'Tawadhu'],
        sahabatTag: 'Sahabat Awal (As-Sabiqun al-Awwalun)',
        biography: 'Abu Dzarr al-Ghifari adalah salah satu sahabat paling awal yang masuk Islam (keempat atau kelima). Beliau terkenal dengan sifat zuhud yang luar biasa dan keberanian dalam menyampaikan kebenaran. Abu Dzarr diasingkan ke ar-Rabadzah karena mengkritik kebijakan Utsman tentang harta.',
        majorEvents: [
            {
                event: 'Masuk Islam sangat awal',
                year: '13 SH (610 M)',
                description: 'Abu Dzarr adalah orang keempat atau kelima yang masuk Islam',
                source: 'Siyar A\'lam an-Nubala 2/46'
            },
            {
                event: 'Pertama kali berteriak takbir di Ka\'bah',
                year: '12 SH (611 M)',
                description: 'Abu Dzarr berani mengucapkan kalimat tauhid dan takbir di depan Ka\'bah',
                source: 'Musnad Ahmad 21/110'
            },
            {
                event: 'Hijrah ke Madinah',
                year: '7 H (628 M)',
                description: 'Abu Dzarr hijrah ke Madinah setelah Fath Khaibar',
                source: 'Siyar A\'lam an-Nubala 2/57'
            },
            {
                event: 'Diasingkan ke ar-Rabadzah',
                year: '30 H (651 M)',
                description: 'Utsman mengasingkan Abu Dzarr karena kritiknya terhadap kebijakan harta',
                source: 'Tarikh ath-Thabari 4/284'
            }
        ],
        briefBiography: 'Sahabat yang masuk Islam sangat awal dan terkenal dengan sifat zuhudnya. Abu Dzarr berani menyampaikan kebenaran meski harus diasingkan.'
    },

    {
        id: 'ammar_ibn_yasir',
        name: 'Ammar ibn Yasir',
        arabicName: 'عمار بن ياسر',
        fullName: 'Ammar bin Yasir bin Amir al-Ansi',
        title: 'Shahid Shiffin, Thayib al-Muthayab',
        category: 'sahabat',
        subcategory: 'muhajirin',
        period: '93 tahun (570-657 M)',
        periodHijri: '53 SH - 37 H',
        birthPlace: 'Makkah al-Mukarramah',
        deathPlace: 'Shiffin, Irak (gugur sebagai syahid)',
        tribe: 'Ans (dari Yaman)',
        father: 'Yasir bin Amir (syahid pertama dalam Islam)',
        mother: 'Sumayyah binti Khayyath (syahidah pertama dalam Islam)',
        wife: ['tidak diketahui'],
        children: ['tidak diketahui'],
        profession: 'Panglima perang, sahabat setia',
        qualities: ['Sabar dalam siksaan', 'Setia', 'Pemberani', 'Taqwa', 'Pembela kebenaran'],
        sahabatTag: 'Sahabat Muhajirin (Yang Berhijrah)',
        biography: 'Ammar ibn Yasir adalah anak dari Yasir dan Sumayyah, syahid dan syahidah pertama dalam Islam. Keluarga Ammar mengalami siksaan berat dari kaum musyrik Makkah. Ammar ikut dalam semua peperangan bersama Rasulullah dan gugur sebagai syahid dalam Perang Shiffin di pihak Ali.',
        majorEvents: [
            {
                event: 'Keluarga disiksa karena Islam',
                year: '13-10 SH (610-613 M)',
                description: 'Keluarga Ammar disiksa berat, ayah dan ibunya menjadi syahid pertama',
                source: 'Shahih Ibn Hibban 6803'
            },
            {
                event: 'Hijrah ke Madinah',
                year: '1 H (622 M)',
                description: 'Ammar hijrah bersama kaum Muhajirin ke Madinah',
                source: 'Siyar A\'lam an-Nubala 1/423'
            },
            {
                event: 'Ikut semua peperangan',
                year: '2-11 H (623-632 M)',
                description: 'Ammar ikut dalam semua ghazwah bersama Rasulullah',
                source: 'Al-Isabah fi Tamyiz as-Sahabah 4/465'
            },
            {
                event: 'Gugur di Shiffin',
                year: '37 H (657 M)',
                description: 'Ammar gugur sebagai syahid dalam Perang Shiffin di pihak Ali',
                source: 'Shahih Muslim 2916'
            }
        ],
        briefBiography: 'Anak dari syahid dan syahidah pertama dalam Islam. Ammar ikut semua peperangan dengan Rasulullah dan gugur sebagai syahid di Shiffin.'
    }
];

// Export untuk digunakan
if (typeof module !== 'undefined' && module.exports) {
    module.exports = sahabatTerkenal;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.sahabatTerkenal = sahabatTerkenal;
}