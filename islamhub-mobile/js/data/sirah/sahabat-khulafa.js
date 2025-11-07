// Database Sahabat - Khulafa ar-Rasyidin (4 Khalifah Pertama)
// Berdasarkan riwayat shahih dalam hadits dan sirah

const sahabatKhulafa = [
    {
        id: 'abu_bakr',
        name: 'Abu Bakr ash-Shiddiq',
        arabicName: 'أبو بكر الصديق',
        fullName: 'Abdullah bin Abi Quhafah at-Taimi',
        title: 'Ash-Shiddiq, Khalifah Rasulullah',
        category: 'sahabat',
        subcategory: 'khulafa_rasyidin',
        period: '63 tahun (573-634 M)',
        periodHijri: '51 SH - 13 H',
        birthPlace: 'Makkah al-Mukarramah',
        deathPlace: 'Madinah al-Munawwarah',
        tribe: 'Quraisy (Banu Taim)',
        father: 'Utsman bin Amir (Abu Quhafah)',
        mother: 'Ummu Khayr Salma binti Shakhr',
        wife: ['Qutailah binti Abdul Uzza', 'Ummu Ruman Zainab binti Amir', 'Asma binti Umais', 'Habibah binti Kharijah'],
        children: ['Abdullah', 'Abdul Rahman', 'Aisyah (Ummul Mukminin)', 'Asma'],
        profession: 'Khalifah pertama, pedagang kain',
        qualities: ['Ash-Shiddiq (Yang Membenarkan)', 'Taqwa', 'Dermawan', 'Pemberani', 'Setia', 'Bijaksana'],
        guaranteedParadise: 'Dijamin masuk surga oleh Rasulullah',
        biography: 'Abu Bakr ash-Shiddiq adalah sahabat terbaik Rasulullah dan khalifah pertama. Beliau orang pertama yang beriman dari kalangan dewasa, mendampingi Rasulullah dalam hijrah, dan menjadi teladan dalam keimanan dan pengorbanan. Setelah Rasulullah wafat, Abu Bakr memimpin umat Islam selama 2 tahun 3 bulan dengan penuh kebijaksanaan.',
        majorEvents: [
            {
                event: 'Masuk Islam sebagai orang dewasa pertama',
                year: 'Awal dakwah (610 M)',
                description: 'Abu Bakr langsung beriman ketika Rasulullah menyampaikan Islam kepadanya tanpa ragu-ragu',
                references: ['Sirah Ibn Hisyam', 'Shahih Bukhari 3661']
            },
            {
                event: 'Memerdekakan budak-budak Muslim',
                year: 'Masa dakwah Makkah',
                description: 'Abu Bakr membeli dan memerdekakan budak-budak Muslim yang disiksa seperti Bilal bin Rabah',
                references: ['Sirah Ibn Hisyam', 'Sunan Abu Dawud 3958']
            },
            {
                event: 'Membenarkan peristiwa Isra Mi\'raj',
                year: '621 M',
                description: 'Abu Bakr langsung membenarkan peristiwa Isra Mi\'raj tanpa ragu, sehingga dijuluki Ash-Shiddiq',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Menemani Rasulullah dalam hijrah',
                year: '622 M (1 H)',
                description: 'Abu Bakr dipilih Rasulullah sebagai teman dalam hijrah ke Madinah dan bersembunyi di gua Tsur',
                references: ['QS. At-Tawbah: 40', 'Shahih Bukhari 3905']
            },
            {
                event: 'Menjadi imam shalat saat Rasulullah sakit',
                year: '11 H',
                description: 'Rasulullah menunjuk Abu Bakr untuk menjadi imam shalat saat beliau sakit sebelum wafat',
                references: ['Shahih Bukhari 678', 'Shahih Muslim 418']
            },
            {
                event: 'Menenangkan umat saat Rasulullah wafat',
                year: '11 H',
                description: 'Abu Bakr menenangkan umat dengan khutbah terkenal: "Barang siapa menyembah Muhammad, maka Muhammad telah wafat..."',
                references: ['Shahih Bukhari 1241']
            },
            {
                event: 'Dibaiat sebagai khalifah pertama',
                year: '11 H',
                description: 'Abu Bakr dibaiat sebagai khalifah pertama di Saqifah Bani Sa\'idah',
                references: ['Shahih Bukhari 6830']
            },
            {
                event: 'Memerangi orang-orang murtad',
                year: '11-12 H',
                description: 'Abu Bakr memimpin perang Riddah melawan suku-suku Arab yang murtad setelah Rasulullah wafat',
                references: ['Al-Bidayah wan-Nihayah Ibn Katsir']
            },
            {
                event: 'Memerangi Musailamah al-Kadzdzab',
                year: '12 H',
                description: 'Abu Bakr mengirim pasukan untuk memerangi Musailamah yang mengaku nabi di Yamamah',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Memulai pengumpulan Al-Quran',
                year: '12 H',
                description: 'Abu Bakr memerintahkan Zaid bin Tsabit mengumpulkan Al-Quran dalam satu mushaf',
                references: ['Shahih Bukhari 4986']
            },
            {
                event: 'Memulai penaklukan Irak dan Syam',
                year: '12-13 H',
                description: 'Abu Bakr mengirim pasukan ke Irak dan Syam untuk menyebarkan Islam',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Wafat dan wasiatnya',
                year: '13 H',
                description: 'Abu Bakr wafat setelah sakit 15 hari dan berwasiat agar Umar menggantikannya',
                references: ['Tarikh at-Tabari']
            }
        ],
        virtues: [
            'Sahabat terbaik Rasulullah dan yang paling dicintai',
            'Orang yang paling banyak berjasa dalam dakwah Islam',
            'Dermawan luar biasa hingga menghabiskan seluruh hartanya',
            'Pemberani yang siap berkorban untuk Islam',
            'Pemimpin yang bijaksana dalam menghadapi krisis'
        ],
        references: [
            'Al-Quran: QS. At-Tawbah: 40 (tentang hijrah)',
            'Shahih Bukhari: Kitab Fadha\'il Ashhab an-Nabi',
            'Shahih Muslim: Kitab Fadha\'il as-Shahabah',
            'Sirah Ibn Hisyam',
            'Al-Bidayah wan-Nihayah - Ibn Katsir',
            'Tarikh at-Tabari'
        ],
        haditsShahih: [
            {
                arabic: 'لَوْ كُنْتُ مُتَّخِذًا خَلِيلاً لاَتَّخَذْتُ أَبَا بَكْرٍ خَلِيلاً',
                latin: 'Law kuntu muttakhidzan khalilan, lattakhadtu Aba Bakrin khalila',
                translation: 'Seandainya aku mengambil seorang kekasih, pasti aku akan mengambil Abu Bakr sebagai kekasih',
                source: 'HR. Bukhari 3656'
            },
            {
                arabic: 'مَا لِأَحَدٍ عِنْدَنَا يَدٌ إِلاَّ وَقَدْ كَافَأْنَاهُ إِلاَّ أَبُو بَكْرٍ',
                latin: 'Ma li\'ahadin \'indana yadun illa wa qad kafaanahu illa Abu Bakr',
                translation: 'Tidak ada seseorang yang berbuat baik kepada kami kecuali kami telah membalasnya, kecuali Abu Bakr',
                source: 'HR. Tirmidzi 3661'
            }
        ]
    },
    {
        id: 'umar_ibn_khattab',
        name: 'Umar ibn al-Khattab',
        arabicName: 'عمر بن الخطاب',
        fullName: 'Umar bin al-Khattab bin Nufail al-Adawi',
        title: 'Al-Faruq, Amir al-Mukminin',
        category: 'sahabat',
        subcategory: 'khulafa_rasyidin',
        period: '63 tahun (584-644 M)',
        periodHijri: '40 SH - 23 H',
        birthPlace: 'Makkah al-Mukarramah',
        deathPlace: 'Madinah al-Munawwarah (dibunuh)',
        tribe: 'Quraisy (Banu Adi)',
        father: 'Al-Khattab bin Nufail',
        mother: 'Hantamah binti Hasyim',
        wife: ['Zainab binti Madh\'un', 'Maliykah binti Jarwal', 'Quraibah binti Abi Umayyah', 'Ummu Hakim binti al-Harits', 'Jamhilah binti Asim', 'Atikah binti Zaid', 'Ummu Kultsum binti Ali', 'Luhyah (budak)'],
        children: ['Abdullah', 'Hafshah (Ummul Mukminin)', 'Abdurrahman Akbar', 'Abdurrahman Ashghar', 'Zaid', 'Ubaidullah', 'Asim', 'Fatimah'],
        profession: 'Khalifah kedua, pedagang',
        qualities: ['Al-Faruq (Yang Membedakan)', 'Adil', 'Tegas', 'Zuhud', 'Wara\'', 'Pemberani'],
        guaranteedParadise: 'Dijamin masuk surga oleh Rasulullah',
        biography: 'Umar ibn al-Khattab al-Faruq adalah khalifah kedua yang memerintah selama 10 tahun. Beliau dikenal dengan keadilannya yang luar biasa hingga dijuluki Al-Faruq. Di bawah kepemimpinannya, wilayah Islam meluas ke Persia, Syam, Mesir, dan sebagian besar wilayah Bizantium. Umar wafat sebagai syahid setelah ditikam Abu Lu\'luah al-Majusi.',
        majorEvents: [
            {
                event: 'Masuk Islam setelah membaca Al-Quran',
                year: '616 M (6 tahun setelah dakwah)',
                description: 'Umar masuk Islam setelah mendengar bacaan QS. Thaha dari saudarinya Fatimah binti Khattab',
                references: ['Sirah Ibn Hisyam', 'Mustadrak al-Hakim']
            },
            {
                event: 'Shalat pertama secara terang-terangan di Ka\'bah',
                year: 'Setelah masuk Islam',
                description: 'Setelah Umar masuk Islam, kaum muslimin berani shalat terang-terangan di Ka\'bah',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Ikut hijrah ke Madinah',
                year: '622 M (1 H)',
                description: 'Umar hijrah ke Madinah secara terang-terangan dengan pedang terhunus',
                references: ['Al-Bidayah wan-Nihayah']
            },
            {
                event: 'Berperan penting dalam Perang Badr',
                year: '2 H',
                description: 'Umar ikut serta dalam Perang Badr dan memberikan saran-saran penting',
                references: ['Shahih Bukhari']
            },
            {
                event: 'Menyarankan hijab untuk istri Nabi',
                year: 'Masa Madinah',
                description: 'Umar menyarankan agar istri-istri Nabi berhijab, lalu turun ayat hijab',
                references: ['Shahih Bukhari 146']
            },
            {
                event: 'Pendapat tentang tawanan Badr sesuai wahyu',
                year: '2 H',
                description: 'Pendapat Umar tentang tawanan Badr (dibunuh, bukan ditebus) sesuai dengan wahyu yang turun',
                references: ['Shahih Muslim 1763']
            },
            {
                event: 'Diangkat sebagai khalifah kedua',
                year: '13 H',
                description: 'Umar diangkat sebagai khalifah kedua atas wasiat Abu Bakr ash-Shiddiq',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Menaklukkan Irak dari Sassaniyah',
                year: '14-16 H',
                description: 'Pasukan Islam di bawah Khalid bin Walid dan Sa\'d bin Abi Waqqash menaklukkan Irak',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Menaklukkan Syam dari Bizantium',
                year: '15-16 H',
                description: 'Pasukan Islam menaklukkan Damaskus, dan Umar datang sendiri untuk menerima kunci Baitul Maqdis',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Menaklukkan Mesir',
                year: '18-21 H',
                description: 'Amr ibn al-Ash menaklukkan Mesir atas perintah Umar',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Mendirikan sistem administrasi (Diwan)',
                year: '15 H',
                description: 'Umar mendirikan sistem administrasi negara dan pembagian gaji untuk tentara dan rakyat',
                references: ['Al-Bidayah wan-Nihayah']
            },
            {
                event: 'Mendirikan sistem penanggalan Hijriyah',
                year: '17 H',
                description: 'Umar menetapkan sistem penanggalan Hijriyah yang dimulai dari hijrah Rasulullah',
                references: ['Shahih Bukhari 3934']
            },
            {
                event: 'Menangani tahun paceklik (\'Am ar-Ramadah)',
                year: '18 H',
                description: 'Umar memimpin penanganan bencana kelaparan dengan membuka gudang negara dan mendatangkan bantuan',
                references: ['Al-Bidayah wan-Nihayah']
            },
            {
                event: 'Ditikam Abu Lu\'luah dan wafat',
                year: '23 H',
                description: 'Umar ditikam Abu Lu\'luah al-Majusi saat shalat subuh dan wafat 3 hari kemudian',
                references: ['Shahih Bukhari 3700']
            }
        ],
        virtues: [
            'Keadilan yang luar biasa hingga musuh takut dan hormat',
            'Kehidupan zuhud meski memimpin imperium luas',
            'Kebijaksanaan dalam mengatur negara dan tentara',
            'Keberanian yang membuat syaitan takut kepadanya',
            'Visi jauh ke depan dalam membangun peradaban'
        ],
        references: [
            'Shahih Bukhari: Kitab Fadha\'il Ashhab an-Nabi',
            'Shahih Muslim: Kitab Fadha\'il as-Shahabah',
            'Sirah Ibn Hisyam',
            'Al-Bidayah wan-Nihayah - Ibn Katsir',
            'Tarikh at-Tabari',
            'Al-Farouq - Shibli Nu\'mani'
        ],
        haditsShahih: [
            {
                arabic: 'إِنَّ اللَّهَ جَعَلَ الْحَقَّ عَلَى لِسَانِ عُمَرَ وَقَلْبِهِ',
                latin: 'Inna Allaha ja\'ala al-haqqa \'ala lisani Umara wa qalbihi',
                translation: 'Sesungguhnya Allah meletakkan kebenaran pada lisan dan hati Umar',
                source: 'HR. Tirmidzi 3682'
            },
            {
                arabic: 'وَالَّذِي نَفْسِي بِيَدِهِ مَا لَقِيَكَ الشَّيْطَانُ سَالِكًا فَجًّا إِلاَّ سَلَكَ فَجًّا غَيْرَ فَجِّكَ',
                latin: 'Walladzii nafsii biyadihi ma laqiyakasy syaithaanu salikan fajjan illa salaka fajjan ghaira fajjik',
                translation: 'Demi Dzat yang jiwaku di tangan-Nya, tidaklah syaitan menjumpaimu berjalan di suatu jalan kecuali dia akan mengambil jalan lain',
                source: 'HR. Bukhari 3683'
            }
        ]
    },
    {
        id: 'utsman_ibn_affan',
        name: 'Utsman ibn Affan',
        arabicName: 'عثمان بن عفان',
        fullName: 'Utsman bin Affan bin al-Ash bin Umayyah al-Umawi',
        title: 'Dzun-Nurain, Amir al-Mukminin',
        category: 'sahabat',
        subcategory: 'khulafa_rasyidin',
        period: '70 tahun (576-656 M)',
        periodHijri: '47 SH - 35 H',
        birthPlace: 'Makkah al-Mukarramah',
        deathPlace: 'Madinah al-Munawwarah (dibunuh)',
        tribe: 'Quraisy (Banu Umayyah)',
        father: 'Affan bin al-Ash',
        mother: 'Arwa binti Kuraiz',
        wife: ['Ruqayyah binti Rasulullah', 'Ummu Kultsum binti Rasulullah', 'Fakhitah binti Ghazwan', 'Ummu Amr binti Jundub', 'Fatimah binti al-Walid', 'Ummu al-Banin binti Uyainah', 'Ramlah binti Syaibah', 'Nailah binti al-Farafisah'],
        children: ['Abdullah (dari Ruqayyah)', 'Ibrahim', 'Khadijah', 'Ummu Amr', 'Aisyah', 'Maryam', 'Ummu Aban', 'Walid', 'Sa\'id', 'Umar'],
        profession: 'Khalifah ketiga, pedagang kaya',
        qualities: ['Dzun-Nurain (Pemilik Dua Cahaya)', 'Dermawan', 'Penyabar', 'Malu', 'Taqwa', 'Pemurah'],
        guaranteedParadise: 'Dijamin masuk surga oleh Rasulullah',
        biography: 'Utsman ibn Affan Dzun-Nurain adalah khalifah ketiga yang memerintah selama 12 tahun. Beliau dijuluki Dzun-Nurain karena menikahi dua putri Rasulullah: Ruqayyah dan Ummu Kultsum. Utsman dikenal sangat dermawan dan penyabar. Masa pemerintahannya diwarnai dengan penyatuan Al-Quran dalam satu mushaf dan ekspansi Islam yang luas.',
        majorEvents: [
            {
                event: 'Masuk Islam melalui Abu Bakr',
                year: 'Awal dakwah (610-611 M)',
                description: 'Utsman masuk Islam setelah diajak oleh Abu Bakr ash-Shiddiq, termasuk orang yang pertama beriman',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Menikah dengan Ruqayyah',
                year: 'Sebelum hijrah',
                description: 'Utsman menikah dengan Ruqayyah binti Rasulullah, putri tertua beliau',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Hijrah ke Habasyah bersama Ruqayyah',
                year: '615 M',
                description: 'Utsman dan Ruqayyah termasuk yang hijrah pertama ke Habasyah untuk menghindari siksaan',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Hijrah ke Madinah',
                year: '622 M (1 H)',
                description: 'Utsman hijrah ke Madinah bersama kaum muslimin lainnya',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Tidak ikut Perang Badr karena merawat istri',
                year: '2 H',
                description: 'Utsman tidak ikut Perang Badr karena merawat Ruqayyah yang sakit, namun tetap mendapat pahala',
                references: ['Shahih Bukhari']
            },
            {
                event: 'Wafatnya Ruqayyah',
                year: '2 H',
                description: 'Ruqayyah wafat saat kaum muslimin merayakan kemenangan Badr',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Menikah dengan Ummu Kultsum',
                year: '3 H',
                description: 'Rasulullah menikahkan Ummu Kultsum dengan Utsman setelah Ruqayyah wafat',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Membeli sumur Raumah untuk kaum muslimin',
                year: 'Awal Madinah',
                description: 'Utsman membeli sumur Raumah dari seorang Yahudi dan mewakafkannya untuk kaum muslimin',
                references: ['Sunan Tirmidzi 3703']
            },
            {
                event: 'Membiayai pasukan dalam Perang Tabuk',
                year: '9 H',
                description: 'Utsman menyediakan 1000 unta lengkap dengan perlengkapannya untuk pasukan Tabuk',
                references: ['Sunan Tirmidzi 3701']
            },
            {
                event: 'Diangkat sebagai khalifah ketiga',
                year: '23 H',
                description: 'Utsman terpilih sebagai khalifah ketiga melalui syura yang dibentuk Umar sebelum wafat',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Menyatukan Al-Quran dalam satu mushaf',
                year: '25 H',
                description: 'Utsman memerintahkan penyatuan Al-Quran dalam satu mushaf dan membakar mushaf-mushaf lain',
                references: ['Shahih Bukhari 4987']
            },
            {
                event: 'Ekspansi ke Afrika Utara dan Asia Tengah',
                year: '25-35 H',
                description: 'Pasukan Islam menaklukkan wilayah-wilayah baru di Afrika Utara dan Asia Tengah',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Pembangunan armada laut pertama',
                year: '28 H',
                description: 'Utsman membangun armada laut untuk menaklukkan pulau Siprus',
                references: ['Al-Bidayah wan-Nihayah']
            },
            {
                event: 'Fitnah dan pemberontakan',
                year: '35 H',
                description: 'Terjadi fitnah dan pemberontakan terhadap Utsman yang dipicu oleh isu-isu politik',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Terbunuh saat membaca Al-Quran',
                year: '35 H',
                description: 'Utsman dibunuh oleh pemberontak saat sedang membaca Al-Quran di rumahnya',
                references: ['Tarikh at-Tabari']
            }
        ],
        virtues: [
            'Satu-satunya yang menikahi dua putri Nabi (Dzun-Nurain)',
            'Dermawan luar biasa yang menginfakkan hartanya untuk Islam',
            'Penyatu Al-Quran dalam satu mushaf untuk seluruh umat',
            'Malu dan wara\' yang luar biasa',
            'Sabar dalam menghadapi fitnah dan tidak membalas dendam'
        ],
        references: [
            'Shahih Bukhari: Kitab Fadha\'il Ashhab an-Nabi',
            'Shahih Muslim: Kitab Fadha\'il as-Shahabah',
            'Sirah Ibn Hisyam',
            'Al-Bidayah wan-Nihayah - Ibn Katsir',
            'Tarikh at-Tabari',
            'Sunan Tirmidzi: Kitab Manaqib'
        ],
        haditsShahih: [
            {
                arabic: 'أَلاَ أَسْتَحِي مِنْ رَجُلٍ تَسْتَحِي مِنْهُ الْمَلاَئِكَةُ',
                latin: 'Ala astahyii min rajulin tastahyii minhu al-mala\'ikah',
                translation: 'Tidakkah aku malu kepada orang yang malaikat saja malu kepadanya',
                source: 'HR. Muslim 2401'
            },
            {
                arabic: 'مَنْ حَفَرَ رُومَةَ فَلَهُ الْجَنَّةُ',
                latin: 'Man hafara Rumata falahu al-jannah',
                translation: 'Barang siapa menggali (membeli) sumur Raumah maka baginya surga',
                source: 'HR. Tirmidzi 3703'
            }
        ]
    },
    {
        id: 'ali_ibn_abi_thalib',
        name: 'Ali ibn Abi Thalib',
        arabicName: 'علي بن أبي طالب',
        fullName: 'Ali bin Abi Thalib bin Abdul Muthalib al-Hasyimi',
        title: 'Amir al-Mukminin, Asadullah al-Ghalib',
        category: 'sahabat',
        subcategory: 'khulafa_rasyidin',
        period: '63 tahun (601-661 M)',
        periodHijri: '30 SH - 40 H',
        birthPlace: 'Makkah al-Mukarramah (di dalam Ka\'bah)',
        deathPlace: 'Kufah, Irak (dibunuh)',
        tribe: 'Quraisy (Banu Hasyim)',
        father: 'Abu Thalib bin Abdul Muthalib',
        mother: 'Fatimah binti Asad',
        wife: ['Fatimah az-Zahra binti Rasulullah', 'Ummu al-Banin binti Hizam', 'Lailah binti Mas\'ud', 'Asma binti Umais', 'Ummu Sa\'id binti Urwah', 'Muhyath binti Imri\'il Qais', 'Umamah binti Abi al-Ash', 'Khaulah binti Ja\'far'],
        children: ['Al-Hasan', 'Al-Husain', 'Muhsin (gugur)', 'Zainab', 'Ummu Kultsum', 'Muhammad ibn al-Hanafiyyah', 'Umar', 'Yahya', 'Abbas', 'Ja\'far', 'Abdullah', 'Utsman'],
        profession: 'Khalifah keempat, panglima perang',
        qualities: ['Asadullah (Singa Allah)', 'Pemberani', 'Alim', 'Adil', 'Faqih', 'Penyair'],
        guaranteedParadise: 'Dijamin masuk surga oleh Rasulullah',
        biography: 'Ali ibn Abi Thalib adalah sepupu dan menantu Rasulullah, suami Fatimah az-Zahra. Beliau anak pertama yang masuk Islam, dibesarkan Rasulullah sejak kecil, dan menjadi panglima perang yang tidak pernah kalah. Setelah menjadi khalifah keempat, Ali menghadapi berbagai fitnah besar termasuk perang dengan Aisyah, Muawiyah, dan Khawarij.',
        majorEvents: [
            {
                event: 'Lahir di dalam Ka\'bah',
                year: '601 M (30 SH)',
                description: 'Ali lahir di dalam Ka\'bah, satu-satunya orang yang lahir di tempat suci tersebut',
                references: ['Al-Mustadrak al-Hakim', 'Tarikh Baghdad']
            },
            {
                event: 'Dibesarkan oleh Rasulullah',
                year: 'Sejak kecil',
                description: 'Ali dibesarkan di rumah Rasulullah sejak kecil karena Abu Thalib mengalami kesulitan ekonomi',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Anak pertama yang masuk Islam',
                year: '610 M (awal dakwah)',
                description: 'Ali adalah anak pertama yang masuk Islam saat berusia 10 tahun',
                references: ['Sirah Ibn Hisyam', 'Sunan Tirmidzi']
            },
            {
                event: 'Tidur di tempat tidur Rasulullah saat hijrah',
                year: '622 M (1 H)',
                description: 'Ali tidur di tempat tidur Rasulullah saat hijrah untuk mengelabui kaum kafir Quraisy',
                references: ['Sirah Ibn Hisyam', 'Tafsir at-Tabari QS. Al-Baqarah: 207']
            },
            {
                event: 'Menikah dengan Fatimah az-Zahra',
                year: '2 H',
                description: 'Ali menikah dengan Fatimah, putri kesayangan Rasulullah',
                references: ['Shahih Bukhari 3729']
            },
            {
                event: 'Berperan heroik dalam Perang Badr',
                year: '2 H',
                description: 'Ali menunjukkan keberanian luar biasa dalam Perang Badr, membunuh beberapa tokoh kafir Quraisy',
                references: ['Sirah Ibn Hisyam']
            },
            {
                event: 'Membunuh Marhab dalam Perang Khaibar',
                year: '7 H',
                description: 'Ali membunuh Marhab, panglima Yahudi Khaibar yang terkenal kuat',
                references: ['Shahih Bukhari 4206']
            },
            {
                event: 'Diutus ke Yaman sebagai qadhi dan da\'i',
                year: '10 H',
                description: 'Rasulullah mengutus Ali ke Yaman untuk menjadi hakim dan da\'i',
                references: ['Shahih Bukhari 3009']
            },
            {
                event: 'Memandikan dan mengkafani Rasulullah',
                year: '11 H',
                description: 'Ali bersama keluarga memandikan dan mengkafani Rasulullah setelah wafat',
                references: ['Sunan Abu Dawud 3141']
            },
            {
                event: 'Tidak ikut dalam baiat Abu Bakr di awal',
                year: '11 H',
                description: 'Ali tidak langsung membaiat Abu Bakr karena sibuk mengurus pemakaman Rasulullah',
                references: ['Shahih Bukhari 4240']
            },
            {
                event: 'Diangkat sebagai khalifah keempat',
                year: '35 H',
                description: 'Ali dibaiat sebagai khalifah keempat setelah Utsman terbunuh',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Perang Jamal melawan Aisyah',
                year: '36 H',
                description: 'Ali berperang melawan pasukan yang dipimpin Aisyah, Thalhah, dan Zubair di Bashrah',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Perang Shiffin melawan Muawiyah',
                year: '37 H',
                description: 'Ali berperang melawan Muawiyah bin Abi Sufyan yang menolak baiatnya',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Arbitrase (tahkim) pasca Shiffin',
                year: '37 H',
                description: 'Ali menerima arbitrase dengan Muawiyah yang kemudian memicu munculnya Khawarij',
                references: ['Tarikh at-Tabari']
            },
            {
                event: 'Perang Nahrawan melawan Khawarij',
                year: '38 H',
                description: 'Ali memerangi kelompok Khawarij yang menentangnya di Nahrawan',
                references: ['Shahih Bukhari 3414']
            },
            {
                event: 'Terbunuh oleh Ibn Muljam',
                year: '40 H',
                description: 'Ali ditikam oleh Abdurrahman ibn Muljam al-Khariji saat shalat subuh di masjid Kufah',
                references: ['Tarikh at-Tabari']
            }
        ],
        virtues: [
            'Pemberani yang tidak pernah kalah dalam perang (Asadullah)',
            'Alim dan faqih yang mendalam ilmunya',
            'Orator dan penyair yang fasih',
            'Adil dan zuhud dalam kepemimpinan',
            'Ayah dari cucu-cucu Rasulullah (Hasan dan Husain)'
        ],
        references: [
            'Shahih Bukhari: Kitab Fadha\'il Ashhab an-Nabi',
            'Shahih Muslim: Kitab Fadha\'il as-Shahabah',
            'Sirah Ibn Hisyam',
            'Al-Bidayah wan-Nihayah - Ibn Katsir',
            'Tarikh at-Tabari',
            'Nahj al-Balaghah (kumpulan khutbah Ali)'
        ],
        haditsShahih: [
            {
                arabic: 'أَنْتَ مِنِّي بِمَنْزِلَةِ هَارُونَ مِنْ مُوسَى إِلاَّ أَنَّهُ لاَ نَبِيَّ بَعْدِي',
                latin: 'Anta minni bi manzilati Haruna min Musa illa annahu la nabiyya ba\'di',
                translation: 'Engkau kedudukanmu dariku seperti kedudukan Harun dari Musa, kecuali tidak ada nabi setelahku',
                source: 'HR. Bukhari 3706'
            },
            {
                arabic: 'اللَّهُمَّ وَالِ مَنْ وَالاَهُ وَعَادِ مَنْ عَادَاهُ',
                latin: 'Allahumma waali man walaahu wa \'aadi man \'aadaah',
                translation: 'Ya Allah, bertemanlah dengan siapa yang berteman dengannya dan bermusuhanlah dengan siapa yang memusuhinya',
                source: 'HR. Ahmad 950'
            }
        ]
    }
];

// Export untuk digunakan
export { sahabatKhulafa };