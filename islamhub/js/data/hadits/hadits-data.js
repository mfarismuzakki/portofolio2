// Hadits Browser — Koleksi Hadits Pilihan
// Terorganisir berdasarkan kategori untuk kemudahan pencarian dan belajar dengan manhaj Salaf
import { EXTRA_HADITS } from './hadits-extra.js';

export const HADITS_CATEGORIES = [
    { id: 'aqidah',    icon: 'fa-star-and-crescent', label: 'Aqidah & Tauhid',     color: '#00ffff' },
    { id: 'ibadah',    icon: 'fa-mosque',             label: 'Ibadah',               color: '#ffd700' },
    { id: 'akhlak',    icon: 'fa-heart',              label: 'Akhlak & Adab',        color: '#ff69b4' },
    { id: 'ilmu',      icon: 'fa-book-open',          label: 'Ilmu & Hikmah',        color: '#00ff88' },
    { id: 'keluarga',  icon: 'fa-home',               label: 'Keluarga',             color: '#ff8c00' },
    { id: 'muamalah',  icon: 'fa-handshake',          label: 'Muamalah & Sosial',    color: '#9370db' },
    { id: 'akhirat',   icon: 'fa-moon',               label: 'Akhirat & Kematian',   color: '#4682b4' },
    { id: 'doa',       icon: 'fa-hands',              label: 'Doa & Dzikir',         color: '#32cd32' },
];

export const HADITS_COLLECTION = [
    // ===== AQIDAH & TAUHID =====
    {
        id: 'aq_001',
        category: 'aqidah',
        title: 'Pondasi Islam',
        arabic: 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالحَجِّ، وَصَوْمِ رَمَضَانَ',
        latin: 'Buniyal-islāmu \'alā khams: syahādati an lā ilāha illallāhu wa anna Muhammadan rasūlullāhi, wa iqāmish-shalāh, wa ītā\'iz-zakāh, wal-hajj, wa shaumi Ramadhān.',
        translation: 'Islam dibangun di atas lima perkara: persaksian bahwa tidak ada ilah yang berhak disembah selain Allah dan Muhammad adalah utusan Allah, mendirikan sholat, menunaikan zakat, haji, dan puasa Ramadan.',
        source: 'HR. Bukhari no. 8 & Muslim no. 16 — Muttafaqun \'Alaih',
        narrator: 'Abdullah bin Umar رضي الله عنهما',
        faidah: 'Hadits ini menjelaskan rukun Islam yang lima sebagai fondasi kehidupan seorang Muslim.'
    },
    {
        id: 'aq_002',
        category: 'aqidah',
        title: 'Iman, Islam, dan Ihsan',
        arabic: 'الإِيمَانُ أَنْ تُؤْمِنَ بِاللَّهِ وَمَلاَئِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَاليَوْمِ الآخِرِ وَتُؤْمِنَ بِالقَدَرِ خَيْرِهِ وَشَرِّهِ',
        latin: 'Al-īmānu an tu\'mina billāhi wa malā\'ikatihī wa kutubihī wa rusulihī wal-yawmil-ākhiri wa tu\'mina bil-qadari khairihī wa syarrih.',
        translation: 'Iman adalah engkau beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, hari akhir, dan engkau beriman kepada takdir yang baik dan yang buruk.',
        source: 'HR. Muslim no. 8',
        narrator: 'Umar bin Al-Khaththab رضي الله عنه',
        faidah: 'Hadits Jibril ini menjelaskan rukun iman yang enam secara lengkap.'
    },
    {
        id: 'aq_003',
        category: 'aqidah',
        title: 'Kemuliaan Kalimat Tauhid',
        arabic: 'مَنْ قَالَ لاَ إِلَهَ إِلاَّ اللَّهُ وَكَفَرَ بِمَا يُعْبَدُ مِنْ دُونِ اللَّهِ حَرُمَ مَالُهُ وَدَمُهُ وَحِسَابُهُ عَلَى اللَّهِ',
        latin: 'Man qāla lā ilāha illallāhu wa kafara bimā yu\'badu min dūnillāhi haruma māluhu wa damuhu wa hisābuhu \'alallāh.',
        translation: 'Barangsiapa mengucapkan lā ilāha illallāh dan mengingkari semua yang disembah selain Allah, maka harta dan darahnya terlindungi, dan perhitungannya ada pada Allah.',
        source: 'HR. Muslim no. 23',
        narrator: 'Thariq bin Asyam رضي الله عنه',
        faidah: 'Tauhid adalah syarat perlindungan jiwa dan harta dalam Islam.'
    },
    {
        id: 'aq_004',
        category: 'aqidah',
        title: 'Larangan Mendatangi Dukun/Peramal',
        arabic: 'مَنْ أَتَى عَرَّافًا فَسَأَلَهُ عَنْ شَىْءٍ لَمْ تُقْبَلْ لَهُ صَلاَةٌ أَرْبَعِينَ لَيْلَةً',
        latin: 'Man atā \'arrāfan fasa\'alahu \'an syai\'in lam tuqbal lahu shalātun arba\'īna laylah.',
        translation: 'Barangsiapa mendatangi peramal lalu bertanya kepadanya tentang sesuatu, maka shalatnya tidak diterima selama empat puluh malam.',
        source: 'HR. Muslim no. 2230',
        narrator: 'Hafshah binti Umar رضي الله عنها',
        faidah: 'Sekedar bertanya tanpa membenarkan (percaya) menyebabkan shalat tidak diterima 40 hari. Jika membenarkannya, maka ia telah kufur terhadap ajaran yang diturunkan kepada Muhammad ﷺ (HR. Abu Dawud).'
    },
    {
        id: 'aq_005',
        category: 'aqidah',
        title: 'Pentingnya Ittiba\' (Mengikuti Sunnah) dan Larangan Bid\'ah',
        arabic: 'مَنْ أَحْدَثَ فِى أَمْرِنَا هَذَا مَا لَيْسَ فِيهِ فَهُوَ رَدٌّ',
        latin: 'Man ahdatsa fī amrinā hādzā mā laysa fīhi fahuwa radd.',
        translation: 'Barangsiapa membuat suatu perkara baru dalam urusan kami ini (agama) yang tidak ada asalnya, maka perkara tersebut tertolak.',
        source: 'HR. Bukhari no. 2697 & Muslim no. 1718',
        narrator: 'Aisyah رضي الله عنها',
        faidah: 'Syarat diterimanya amal ada dua: Ikhlas karena Allah, dan Ittiba\' (sesuai tuntunan Rasulullah ﷺ). Segala bentuk ibadah mahdhah yang tidak ada dalilnya adalah tertolak.'
    },

    // ===== IBADAH =====
    {
        id: 'ib_001',
        category: 'ibadah',
        title: 'Keutamaan Sholat Lima Waktu',
        arabic: 'أَرَأَيْتُمْ لَوْ أَنَّ نَهَرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ مِنْهُ كُلَّ يَوْمٍ خَمْسًا مَا تَقُولُ ذَلِكَ يُبْقِي مِنْ دَرَنِهِ؟ قَالُوا: لاَ يُبْقِي مِنْ دَرَنِهِ شَيْئًا. قَالَ: فَذَلِكَ مَثَلُ الصَّلَوَاتِ الخَمْسِ',
        latin: 'Ara\'aytum law anna naharan bibābi ahadikum yaghtasilu minhu kulla yawmin khamsā, mā taqūlu dzālika yabqī min daranihī? Qālū: lā yabqī min daranihī syay\'an. Qāla: fa dzālika matsalush-shalawātil-khams.',
        translation: 'Bagaimana pendapat kalian jika ada sungai di depan pintu salah seorang dari kalian, ia mandi di sana setiap hari lima kali — apakah masih ada kotoran yang tersisa? Mereka menjawab: Tidak ada kotoran tersisa. Beliau bersabda: Begitulah perumpamaan sholat lima waktu.',
        source: 'HR. Bukhari no. 528 & Muslim no. 667',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Sholat lima waktu menghapus dosa-dosa kecil seperti air menghapus kotoran.'
    },
    {
        id: 'ib_002',
        category: 'ibadah',
        title: 'Keutamaan Puasa Ramadan',
        arabic: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
        latin: 'Man shāma Ramadhāna īmānan wahtisāban ghufira lahu mā taqaddama min dzanbih.',
        translation: 'Barangsiapa berpuasa Ramadan dengan penuh keimanan dan mengharap pahala (dari Allah), maka diampuni dosa-dosanya yang telah lalu.',
        source: 'HR. Bukhari no. 38 & Muslim no. 760',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Kunci diterimanya puasa Ramadan adalah iman dan ihtisab (mengharap pahala dari Allah).'
    },
    {
        id: 'ib_003',
        category: 'ibadah',
        title: 'Doa Tidak Tertolak Saat Puasa',
        arabic: 'ثَلاَثَةٌ لاَ تُرَدُّ دَعْوَتُهُمْ: الصَّائِمُ حَتَّى يُفْطِرَ، وَالإِمَامُ الْعَادِلُ، وَدَعْوَةُ الْمَظْلُومِ',
        latin: 'Tsalātsatun lā turaddu da\'watuhum: ash-shā\'imu hattā yufthira, wal-imāmul-\'ādil, wa da\'watul-mazhlūm.',
        translation: 'Tiga orang yang doanya tidak ditolak: orang yang berpuasa hingga ia berbuka, pemimpin yang adil, dan doa orang yang dizalimi.',
        source: 'HR. Tirmidzi no. 3598 — Shahih',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Waktu berbuka puasa adalah waktu mustajab untuk berdoa.'
    },
    {
        id: 'ib_004',
        category: 'ibadah',
        title: 'Keutamaan Sholat Dhuha',
        arabic: 'يُصْبِحُ عَلَى كُلِّ سُلاَمَى مِنْ أَحَدِكُمْ صَدَقَةٌ، فَكُلُّ تَسْبِيحَةٍ صَدَقَةٌ، وَكُلُّ تَحْمِيدَةٍ صَدَقَةٌ، وَكُلُّ تَهْلِيلَةٍ صَدَقَةٌ، وَكُلُّ تَكْبِيرَةٍ صَدَقَةٌ، وَأَمْرٌ بِالمَعْرُوفِ صَدَقَةٌ، وَنَهْيٌ عَنِ المُنْكَرِ صَدَقَةٌ، وَيُجْزِئُ مِنْ ذَلِكَ رَكْعَتَانِ يَرْكَعُهُمَا مِنَ الضُّحَى',
        latin: 'Yushbihu \'alā kulli sulāmā min ahadikum shadaqah... wa yujzi\'u min dzālika rak\'atāni yarka\'uhumā minadh-dhuhā.',
        translation: 'Setiap pagi, setiap persendian kalian wajib membayar sedekah. Setiap tasbih adalah sedekah, setiap tahmid sedekah, setiap tahlil sedekah, setiap takbir sedekah, amar makruf sedekah, nahi mungkar sedekah — dan dua rakaat sholat Dhuha sudah mencukupi semuanya.',
        source: 'HR. Muslim no. 720',
        narrator: 'Abu Dzarr رضي الله عنه',
        faidah: 'Dua rakaat sholat Dhuha setara dengan sedekah untuk 360 persendian tubuh.'
    },
    {
        id: 'ib_005',
        category: 'ibadah',
        title: 'Keutamaan Haji Mabrur',
        arabic: 'الْعُمْرَةُ إِلَى الْعُمْرَةِ كَفَّارَةٌ لِمَا بَيْنَهُمَا، وَالْحَجُّ الْمَبْرُورُ لَيْسَ لَهُ جَزَاءٌ إِلاَّ الْجَنَّةُ',
        latin: 'Al-\'umratu ilal-\'umrati kaffāratun limā baynahumā, wal-hajjul-mabrūru laysa lahu jazā\'un illal-jannah.',
        translation: 'Umrah ke umrah berikutnya adalah penghapus dosa di antara keduanya, dan haji yang mabrur tidak ada balasannya selain surga.',
        source: 'HR. Bukhari no. 1773 & Muslim no. 1349',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Haji mabrur adalah haji yang diterima Allah, yang ditandai dengan membaiknya akhlak setelah haji.'
    },
    {
        id: 'ib_006',
        category: 'ibadah',
        title: 'Keutamaan Shalat Sunnah Rawatib (12 Rakaat)',
        arabic: 'مَا مِنْ عَبْدٍ مُسْلِمٍ يُصَلِّي لِلَّهِ كُلَّ يَوْمٍ ثِنْتَيْ عَشْرَةَ رَكْعَةً تَطَوُّعًا غَيْرَ فَرِيضَةٍ إِلاَّ بَنَى اللَّهُ لَهُ بَيْتًا فِي الْجَنَّةِ',
        latin: 'Mā min \'abdin muslimin yushallī lillāhi kulla yawmin tsintay \'asyrata rak\'atan tathawwu\'an ghayra farīdhatin illā banallāhu lahu baytan fil-jannah.',
        translation: 'Tidaklah seorang hamba Muslim shalat sunnah karena Allah setiap hari dua belas rakaat di luar shalat fardhu, melainkan Allah akan membangunkan untuknya sebuah rumah di surga.',
        source: 'HR. Muslim no. 728',
        narrator: 'Ummu Habibah رضي الله عنها',
        faidah: 'Rincian 12 rakaat: 4 sebelum Dzuhur, 2 setelah Dzuhur, 2 setelah Maghrib, 2 setelah Isya, 2 sebelum Subuh (HR. Tirmidzi).'
    },
    {
        id: 'ib_007',
        category: 'ibadah',
        title: 'Ancaman Meninggalkan Shalat Ashar',
        arabic: 'مَنْ تَرَكَ صَلاَةَ الْعَصْرِ فَقَدْ حَبِطَ عَمَلُهُ',
        latin: 'Man taraka shalātal-\'ashri faqad habitha \'amaluhu.',
        translation: 'Barangsiapa meninggalkan shalat Ashar, maka terhapuslah amalannya.',
        source: 'HR. Bukhari no. 553',
        narrator: 'Buraidah رضي الله عنه',
        faidah: 'Shalat Ashar adalah Shalat Wustha yang sangat ditekankan pemeliharaannya. Meninggalkannya dengan sengaja adalah dosa besar yang dapat menghapus pahala amal kebaikan di hari itu.'
    },

    // ===== AKHLAK & ADAB =====
    {
        id: 'ak_001',
        category: 'akhlak',
        title: 'Akhlak yang Paling Sempurna',
        arabic: 'أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا',
        latin: 'Akmalul-mu\'minīna īmānan ahsanuhum khuluqā.',
        translation: 'Orang mukmin yang paling sempurna imannya adalah yang paling baik akhlaknya.',
        source: 'HR. Abu Dawud no. 4682, Tirmidzi no. 1162 — Shahih',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Iman dan akhlak adalah dua hal yang tidak terpisahkan.'
    },
    {
        id: 'ak_002',
        category: 'akhlak',
        title: 'Kebaikan dan Dosa',
        arabic: 'الْبِرُّ حُسْنُ الْخُلُقِ، وَالإِثْمُ مَا حَاكَ فِي نَفْسِكَ وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ',
        latin: 'Al-birru husnut-khuluq, wal-itsmu mā hāka fī nafsika wa karihta an yaththali\'a \'alayhinnās.',
        translation: 'Kebaikan adalah akhlak yang mulia. Dan dosa adalah sesuatu yang mengganjal dalam dirimu (hatimu tidak tentram karenanya) dan kamu tidak suka orang lain mengetahuinya.',
        source: 'HR. Muslim no. 2553',
        narrator: 'An-Nawwas bin Sam\'an رضي الله عنه',
        faidah: 'Hati yang bersih adalah barometer kebaikan dan dosa yang paling jujur.'
    },
    {
        id: 'ak_003',
        category: 'akhlak',
        title: 'Larangan Hasad',
        arabic: 'إِيَّاكُمْ وَالْحَسَدَ، فَإِنَّ الْحَسَدَ يَأْكُلُ الْحَسَنَاتِ كَمَا تَأْكُلُ النَّارُ الْحَطَبَ',
        latin: 'Iyyākum wal-hasad, fa innal-hasada ya\'kulul-hasanāti kamā ta\'kulun-nārul-hatab.',
        translation: 'Jauhilah hasad (dengki), karena hasad memakan kebaikan-kebaikan sebagaimana api memakan kayu bakar.',
        source: 'HR. Abu Dawud no. 4903 — Hasan Shahih',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Hasad adalah dosa yang menghancurkan amal kebaikan secara diam-diam.'
    },
    {
        id: 'ak_004',
        category: 'akhlak',
        title: 'Keutamaan Senyum',
        arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
        latin: 'Tabassmuka fī wajhi akhīka laka shadaqah.',
        translation: 'Senyummu di hadapan saudaramu adalah sedekah bagimu.',
        source: 'HR. Tirmidzi no. 1956 — Hasan Shahih',
        narrator: 'Abu Dzarr رضي الله عنه',
        faidah: 'Islam mengajarkan bahwa kebaikan sekecil apapun bernilai ibadah.'
    },
    {
        id: 'ak_005',
        category: 'akhlak',
        title: 'Berkata Baik Atau Diam',
        arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
        latin: 'Man kāna yu\'minu billāhi wal-yawmil-ākhiri fal-yaqul khairan aw liyashmut.',
        translation: 'Barangsiapa beriman kepada Allah dan hari akhir, hendaklah ia berkata yang baik atau diam.',
        source: 'HR. Bukhari no. 6018 & Muslim no. 47',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Menjaga lisan adalah tanda kesempurnaan iman. Diam lebih baik daripada berbicara keburukan.'
    },
    {
        id: 'ak_006',
        category: 'akhlak',
        title: 'Larangan Ghibah (Menggunjing)',
        arabic: 'أَتَدْرُونَ مَا الْغِيبَةُ؟ قَالُوا اللَّهُ وَرَسُولُهُ أَعْلَمُ. قَالَ ذِكْرُكَ أَخَاكَ بِمَا يَكْرَهُ. قِيلَ أَفَرَأَيْتَ إِنْ كَانَ فِى أَخِى مَا أَقُولُ؟ قَالَ إِنْ كَانَ فِيهِ مَا تَقُولُ فَقَدِ اغْتَبْتَهُ وَإِنْ لَمْ يَكُنْ فِيهِ فَقَدْ بَهَتَّهُ',
        latin: 'Atadrūna mal-ghībah? ... dzikruka akhāka bimā yakrah. ... in kāna fīhi mā taqūl faqadightabtahu wa in lam yakun fīhi faqad bahattahu.',
        translation: 'Tahukah kalian apa itu ghibah? Mereka menjawab: Allah dan Rasul-Nya lebih tahu. Beliau bersabda: Engkau menyebutkan tentang saudaramu sesuatu yang ia benci. Ditanyakan: Bagaimana jika yang aku katakan itu benar ada padanya? Beliau bersabda: Jika benar, engkau telah mengghibahnya. Jika tidak benar, engkau telah memfitnahnya.',
        source: 'HR. Muslim no. 2589',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Ghibah membicarakan aib yang benar ada, memfitnah membicarakan kebohongan. Keduanya dosa besar.'
    },

    // ===== ILMU & HIKMAH =====
    {
        id: 'il_001',
        category: 'ilmu',
        title: 'Kewajiban Mencari Ilmu',
        arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
        latin: 'Thalabul-\'ilmi farīdhatun \'alā kulli muslim.',
        translation: 'Mencari ilmu adalah kewajiban atas setiap Muslim.',
        source: 'HR. Ibnu Majah no. 224 — Shahih',
        narrator: 'Anas bin Malik رضي الله عنه',
        faidah: 'Ilmu yang dimaksud adalah ilmu yang wajib dipelajari setiap Muslim (Fardhu \'Ain), terutama ilmu tauhid dan tata cara ibadah yang benar.'
    },
    {
        id: 'il_002',
        category: 'ilmu',
        title: 'Ulama Pewaris Para Nabi',
        arabic: 'وَإِنَّ الْعُلَمَاءَ وَرَثَةُ الأَنْبِيَاءِ وَإِنَّ الأَنْبِيَاءَ لَمْ يُوَرِّثُوا دِينَارًا وَلاَ دِرْهَمًا وَرَّثُوا الْعِلْمَ فَمَنْ أَخَذَهُ أَخَذَ بِحَظٍّ وَافِرٍ',
        latin: 'Wa innal-\'ulamā\'a waratsatul-anbiyā\', wa innal-anbiyā\'a lam yuwarritshū dīnāran wa lā dirhaman, warratshul-\'ilma faman akhadzahu akhadza bihazhzhin wāfir.',
        translation: 'Sesungguhnya ulama adalah pewaris para nabi. Para nabi tidak mewariskan dinar maupun dirham, mereka hanya mewariskan ilmu. Barangsiapa yang mengambilnya, maka ia telah mengambil bagian yang sangat banyak.',
        source: 'HR. Abu Dawud no. 3641 — Shahih',
        narrator: 'Abu Darda رضي الله عنه',
        faidah: 'Kemuliaan seorang berilmu melampaui orang yang hanya rajin ibadah, sebagaimana perbandingan bulan purnama atas bintang-bintang.'
    },
    {
        id: 'il_003',
        category: 'ilmu',
        title: 'Keutamaan Menuntut Ilmu',
        arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
        latin: 'Man salaka tarīqan yaltamisu fīhi \'ilman sahhalallāhu lahu tarīqan ilal-jannah.',
        translation: 'Barangsiapa menempuh suatu jalan untuk mencari ilmu, Allah akan memudahkan baginya jalan menuju surga.',
        source: 'HR. Muslim no. 2699',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Menuntut ilmu agama adalah salah satu jalan tercepat dan termudah menuju surga Allah.'
    },

    // ===== KELUARGA =====
    {
        id: 'kl_001',
        category: 'keluarga',
        title: 'Hak Istri atas Suami',
        arabic: 'خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ، وَأَنَا خَيْرُكُمْ لِأَهْلِي',
        latin: 'Khairukum khairukum li\'ahlihī, wa ana khairukum li\'ahlī.',
        translation: 'Sebaik-baik kalian adalah yang paling baik kepada keluarganya (istrinya), dan aku adalah yang paling baik di antara kalian kepada keluargaku.',
        source: 'HR. Tirmidzi no. 3895 — Shahih',
        narrator: 'Aisyah رضي الله عنها',
        faidah: 'Kebaikan kepada keluarga di dalam rumah adalah ujian karakter dan akhlak yang paling hakiki.'
    },
    {
        id: 'kl_002',
        category: 'keluarga',
        title: 'Surga di Bawah Telapak Kaki Ibu (Bakti pada Ibu)',
        arabic: 'إِلْزَمْهَا فَإِنَّ الْجَنَّةَ تَحْتَ أَقْدَامِهَا',
        latin: 'Ilzamhā fa innal-jannata tahta aqdāmihā.',
        translation: 'Berbaktilah selalu kepadanya (ibumu), karena sesungguhnya surga itu di bawah kedua kakinya.',
        source: 'HR. An-Nasa\'i no. 3104 — Shahih',
        narrator: 'Mu\'awiyah bin Jahimah رضي الله عنه',
        faidah: 'Keridhaan ibu adalah jalan utama yang menghantarkan seorang hamba masuk surga.'
    },

    // ===== MUAMALAH =====
    {
        id: 'mu_001',
        category: 'muamalah',
        title: 'Larangan Menipu dalam Jual Beli',
        arabic: 'مَنْ غَشَّنَا فَلَيْسَ مِنَّا',
        latin: 'Man ghasysyanā falaysa minnā.',
        translation: 'Barangsiapa yang menipu kami, maka ia bukan termasuk golongan kami.',
        source: 'HR. Muslim no. 101',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Menyembunyikan cacat barang dagangan adalah bentuk penipuan yang diharamkan secara mutlak dan menghilangkan keberkahan.'
    },
    {
        id: 'mu_002',
        category: 'muamalah',
        title: 'Dosa Riba Lebih Buruk dari Zina',
        arabic: 'دِرْهَمُ رِبًا يَأْكُلُهُ الرَّجُلُ وَهُوَ يَعْلَمُ أَشَدُّ مِنْ سِتَّةٍ وَثَلَاثِينَ زَنْيَةً',
        latin: 'Dirhamu riban ya\'kuluhur-rajulu wa huwa ya\'lamu asyaddu min sittatin wa tsalātsīna zanyah.',
        translation: 'Satu dirham riba yang dimakan seseorang dalam keadaan ia mengetahuinya, lebih besar dosanya daripada berzina tiga puluh enam kali.',
        source: 'HR. Ahmad no. 21957 — Shahih',
        narrator: 'Abdullah bin Hanzhalah رضي الله عنه',
        faidah: 'Riba adalah dosa yang sangat besar di sisi Allah, bahkan diancam akan diperangi oleh Allah dan Rasul-Nya (QS. Al-Baqarah: 279).'
    },
    {
        id: 'mu_003',
        category: 'muamalah',
        title: 'Kelonggaran dalam Berutang',
        arabic: 'مَنْ أَنْظَرَ مُعْسِرًا أَوْ وَضَعَ عَنْهُ أَظَلَّهُ اللَّهُ فِى ظِلِّهِ',
        latin: 'Man andzhara mu\'siran aw wadha\'a \'anhu adzhallahullāhu fī dzhillih.',
        translation: 'Barangsiapa memberi tenggang waktu bagi orang yang kesulitan (membayar utang), atau membebaskan utangnya, niscaya Allah akan menaunginya di bawah naungan-Nya.',
        source: 'HR. Muslim no. 3006',
        narrator: 'Abu Al-Yasar رضي الله عنه',
        faidah: 'Islam sangat memuliakan orang yang berlapang dada memaafkan/menangguhkan utang saudaranya yang kesulitan finansial.'
    },

    // ===== AKHIRAT =====
    {
        id: 'ax_001',
        category: 'akhirat',
        title: 'Dunia adalah Penjara Mukmin',
        arabic: 'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ',
        latin: 'Ad-dunyā sijnul-mu\'mini wa jannatul-kāfir.',
        translation: 'Dunia adalah penjara bagi orang mukmin dan surga bagi orang kafir.',
        source: 'HR. Muslim no. 2956',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Orang mukmin merasakan banyak pembatasan syariat di dunia, sementara di akhirat ia akan menikmati kebebasan dan kenikmatan abadi.'
    },
    {
        id: 'ax_002',
        category: 'akhirat',
        title: 'Perbandingan Dunia dan Akhirat',
        arabic: 'مَا الدُّنْيَا فِي الآخِرَةِ إِلاَّ مِثْلُ مَا يَجْعَلُ أَحَدُكُمْ إِصْبَعَهُ فِي الْيَمِّ، فَلْيَنْظُرْ بِمَ يَرْجِعُ',
        latin: 'Mad-dunyā fil-ākhirati illā mitslu mā yaj\'alu ahadukum ishba\'ahu fil-yamm, falyanzur bima yarji\'.',
        translation: 'Tidaklah dunia dibandingkan akhirat kecuali seperti salah seorang dari kalian mencelupkan jarinya ke laut, lalu lihatlah apa yang dibawa (menetes dari) jarinya.',
        source: 'HR. Muslim no. 2858',
        narrator: 'Al-Mustaurid رضي الله عنه',
        faidah: 'Kenikmatan dunia sangat fana dan kecil. Mengorbankan akhirat demi dunia adalah kerugian nyata.'
    },

    // ===== DOA & DZIKIR =====
    {
        id: 'dz_001',
        category: 'doa',
        title: 'Kalimat Paling Dicintai Allah',
        arabic: 'أَحَبُّ الْكَلاَمِ إِلَى اللَّهِ أَرْبَعٌ: سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلاَ إِلَهَ إِلاَّ اللَّهُ، وَاللَّهُ أَكْبَرُ',
        latin: 'Ahabbul-kalāmi ilallāhi arba\': subhānallāhi, walhamdulillāhi, wa lā ilāha illallāhu, wallāhu akbar.',
        translation: 'Kalimat yang paling dicintai Allah ada empat: Subhanallah, Alhamdulillah, Lā ilāha illallāh, dan Allahu Akbar.',
        source: 'HR. Muslim no. 2137',
        narrator: 'Samurah bin Jundub رضي الله عنه',
        faidah: 'Empat kalimat ini adalah dzikir mutlak yang bisa diucapkan kapan saja untuk memperberat timbangan amal.'
    },
    {
        id: 'dz_002',
        category: 'doa',
        title: 'Doa Penghulu Istighfar',
        arabic: 'سَيِّدُ الاسْتِغْفَارِ أَنْ يَقُولَ الْعَبْدُ: اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ',
        latin: 'Sayyidul-istighfāri an yaqūlal-\'abdu: Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa ana \'abduk...',
        translation: 'Penghulu istighfar adalah seorang hamba mengucapkan: Ya Allah, Engkau adalah Rabbku, tiada ilah yang berhak disembah selain Engkau. Engkau menciptakanku dan aku adalah hamba-Mu...',
        source: 'HR. Bukhari no. 6306',
        narrator: 'Syaddad bin Aus رضي الله عنه',
        faidah: 'Barangsiapa membacanya di pagi hari dengan yakin lalu meninggal, ia masuk surga. Begitu pula saat sore hari.'
    },
    ...EXTRA_HADITS
];
