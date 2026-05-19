// Hadits Browser — Koleksi Hadits Pilihan
// Terorganisir berdasarkan kategori untuk kemudahan pencarian dan belajar

export const HADITS_CATEGORIES = [
    { id: 'aqidah',    icon: 'fa-star-and-crescent', label: 'Aqidah & Tauhid',     color: '#00ffff' },
    { id: 'ibadah',    icon: 'fa-praying-hands',      label: 'Ibadah',               color: '#ffd700' },
    { id: 'akhlak',    icon: 'fa-heart',              label: 'Akhlak & Adab',        color: '#ff69b4' },
    { id: 'ilmu',      icon: 'fa-book-open',          label: 'Ilmu & Hikmah',        color: '#00ff88' },
    { id: 'keluarga',  icon: 'fa-home',               label: 'Keluarga',             color: '#ff8c00' },
    { id: 'muamalah',  icon: 'fa-handshake',          label: 'Muamalah & Sosial',    color: '#9370db' },
    { id: 'akhirat',   icon: 'fa-moon',               label: 'Akhirat & Kematian',   color: '#4682b4' },
    { id: 'doa',       icon: 'fa-hands-praying',      label: 'Doa & Dzikir',         color: '#32cd32' },
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
        source: 'HR. Bukhari no. 8 & Muslim no. 16',
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
        title: 'Larangan Menyakiti Tetangga',
        arabic: 'وَاللَّهِ لاَ يُؤْمِنُ، وَاللَّهِ لاَ يُؤْمِنُ، وَاللَّهِ لاَ يُؤْمِنُ. قِيلَ: وَمَنْ يَا رَسُولَ اللَّهِ؟ قَالَ: الَّذِي لاَ يَأْمَنُ جَارُهُ بَوَائِقَهُ',
        latin: 'Wallāhi lā yu\'min, wallāhi lā yu\'min, wallāhi lā yu\'min. Qīla: wa man yā Rasūlallāh? Qāla: alladhī lā ya\'manu jāruhu bawā\'iqah.',
        translation: 'Demi Allah tidak beriman, demi Allah tidak beriman, demi Allah tidak beriman. Ditanyakan: Siapa wahai Rasulullah? Beliau bersabda: Orang yang tetangganya tidak aman dari gangguannya.',
        source: 'HR. Bukhari no. 6016',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Menyakiti tetangga adalah tanda lemahnya iman seseorang.'
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
        faidah: 'Ilmu yang dimaksud adalah ilmu yang wajib dipelajari setiap Muslim, terutama ilmu agama untuk beribadah dengan benar.'
    },
    {
        id: 'il_002',
        category: 'ilmu',
        title: 'Amal yang Terus Mengalir Setelah Mati',
        arabic: 'إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ',
        latin: 'Idzā mātal-insānu inqatha\'a \'anhu \'amaluhu illā min tsalāts: illā min shadaqatin jāriyah, aw \'ilmin yuntafa\'u bih, aw waladin shālihin yad\'ū lah.',
        translation: 'Apabila manusia meninggal, terputuslah amalnya kecuali tiga perkara: sedekah jariyah, ilmu yang bermanfaat, atau anak sholeh yang mendoakannya.',
        source: 'HR. Muslim no. 1631',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Tiga amalan ini terus memberikan pahala meskipun pelakunya sudah meninggal dunia.'
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
        faidah: 'Menuntut ilmu adalah salah satu jalan tercepat menuju surga.'
    },
    {
        id: 'il_004',
        category: 'ilmu',
        title: 'Amalan Paling Dicintai Allah',
        arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
        latin: 'Ahabbul-a\'māli ilallāhi adwamuhā wa in qall.',
        translation: 'Amalan yang paling dicintai Allah adalah yang paling rutin dikerjakan walaupun sedikit.',
        source: 'HR. Bukhari no. 6465 & Muslim no. 783',
        narrator: 'Aisyah رضي الله عنها',
        faidah: 'Istiqomah dalam amal yang sedikit lebih baik daripada banyak amal tapi tidak berkelanjutan.'
    },

    // ===== KELUARGA =====
    {
        id: 'kl_001',
        category: 'keluarga',
        title: 'Hak Istri atas Suami',
        arabic: 'خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ، وَأَنَا خَيْرُكُمْ لِأَهْلِي',
        latin: 'Khairukum khairukum li\'ahlihī, wa ana khairukum li\'ahlī.',
        translation: 'Sebaik-baik kalian adalah yang paling baik kepada keluarganya, dan aku adalah yang paling baik di antara kalian kepada keluargaku.',
        source: 'HR. Tirmidzi no. 3895 — Shahih',
        narrator: 'Aisyah رضي الله عنها',
        faidah: 'Kebaikan kepada keluarga adalah ukuran kemuliaan seorang Muslim.'
    },
    {
        id: 'kl_002',
        category: 'keluarga',
        title: 'Kewajiban Berbakti kepada Orang Tua',
        arabic: 'رِضَا اللَّهِ فِي رِضَا الْوَالِدَيْنِ، وَسَخَطُ اللَّهِ فِي سَخَطِ الْوَالِدَيْنِ',
        latin: 'Ridhallāhi fī ridhal-wālidayn, wa sakhathullāhi fī sakhathil-wālidayn.',
        translation: 'Ridha Allah ada pada ridha kedua orang tua, dan murka Allah ada pada murka kedua orang tua.',
        source: 'HR. Tirmidzi no. 1899 — Shahih',
        narrator: 'Abdullah bin Amr رضي الله عنهما',
        faidah: 'Ridha orang tua adalah kunci ridha Allah.'
    },
    {
        id: 'kl_003',
        category: 'keluarga',
        title: 'Surga di Bawah Telapak Kaki Ibu',
        arabic: 'الْجَنَّةُ تَحْتَ أَقْدَامِ الأُمَّهَاتِ',
        latin: 'Al-jannatu tahta aqdāmil-ummahāt.',
        translation: 'Surga berada di bawah telapak kaki ibu.',
        source: 'HR. Ibnu Majah no. 2781, Ahmad — Hasan',
        narrator: 'Mu\'awiyah bin Jahimah رضي الله عنه',
        faidah: 'Bakti kepada ibu adalah jalan utama menuju surga.'
    },

    // ===== MUAMALAH =====
    {
        id: 'mu_001',
        category: 'muamalah',
        title: 'Larangan Riba',
        arabic: 'لَعَنَ رَسُولُ اللَّهِ ﷺ آكِلَ الرِّبَا وَمُوكِلَهُ وَكَاتِبَهُ وَشَاهِدَيْهِ، وَقَالَ: هُمْ سَوَاءٌ',
        latin: 'La\'ana rasūlullāhi ﷺ ākila-ribā wa mūkilahu wa kātibahu wa syāhidayhi, wa qāla: hum sawā\'.',
        translation: 'Rasulullah ﷺ melaknat pemakan riba, yang memberi makan dengannya, penulisnya, dan kedua saksinya, dan beliau bersabda: Mereka semua sama (berdosanya).',
        source: 'HR. Muslim no. 1598',
        narrator: 'Jabir رضي الله عنه',
        faidah: 'Semua pihak yang terlibat transaksi riba menanggung dosa.'
    },
    {
        id: 'mu_002',
        category: 'muamalah',
        title: 'Penjual dan Pembeli yang Jujur',
        arabic: 'الْبَيِّعَانِ بِالْخِيَارِ مَا لَمْ يَتَفَرَّقَا، فَإِنْ صَدَقَا وَبَيَّنَا بُورِكَ لَهُمَا فِي بَيْعِهِمَا، وَإِنْ كَذَبَا وَكَتَمَا مُحِقَتْ بَرَكَةُ بَيْعِهِمَا',
        latin: 'Al-bayyi\'āni bil-khiyāri mā lam yatafarraqā, fa in shadaqā wa bayyannā būrika lahumā fī bay\'ihimā, wa in kadzabā wa katamā muhiqat barakatu bay\'ihimā.',
        translation: 'Penjual dan pembeli mempunyai hak khiyar (pilih) selama belum berpisah. Jika keduanya jujur dan terus terang, maka jual-beli mereka diberkahi. Jika keduanya berbohong dan menyembunyikan (cacat), maka berkahnya dihapus.',
        source: 'HR. Bukhari no. 2079 & Muslim no. 1532',
        narrator: 'Hakim bin Hizam رضي الله عنه',
        faidah: 'Kejujuran dalam jual beli mendatangkan keberkahan.'
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
        faidah: 'Orang mukmin merasakan banyak pembatasan di dunia (halal-haram), sementara di akhirat ia akan menikmati kenikmatan sejati.'
    },
    {
        id: 'ax_002',
        category: 'akhirat',
        title: 'Mengingat Penghancur Kenikmatan',
        arabic: 'أَكْثِرُوا ذِكْرَ هَادِمِ اللَّذَّاتِ: الْمَوْتِ',
        latin: 'Aktsirū dzikra hādimil-ladzdzāt: al-mawt.',
        translation: 'Perbanyaklah mengingat penghancur kenikmatan, yaitu kematian.',
        source: 'HR. Tirmidzi no. 2307 — Hasan Shahih',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: 'Mengingat kematian adalah obat terbaik dari cinta berlebihan terhadap dunia.'
    },
    {
        id: 'ax_003',
        category: 'akhirat',
        title: 'Perbandingan Dunia dan Akhirat',
        arabic: 'مَا الدُّنْيَا فِي الآخِرَةِ إِلاَّ مِثْلُ مَا يَجْعَلُ أَحَدُكُمْ إِصْبَعَهُ فِي الْيَمِّ، فَلْيَنْظُرْ بِمَ يَرْجِعُ',
        latin: 'Mad-dunyā fil-ākhirati illā mitslu mā yaj\'alu ahadukum ishba\'ahu fil-yamm, falyanzur bima yarji\'.',
        translation: 'Tidaklah dunia dibandingkan akhirat kecuali seperti salah seorang dari kalian mencelupkan jarinya ke laut, lalu lihatlah apa yang dibawa jarinya.',
        source: 'HR. Muslim no. 2858',
        narrator: 'Al-Mustaurid رضي الله عنه',
        faidah: 'Kenikmatan dunia sangat kecil dibandingkan kenikmatan akhirat.'
    },

    // ===== DOA & DZIKIR =====
    {
        id: 'dz_001',
        category: 'doa',
        title: 'Keutamaan Dzikir',
        arabic: 'أَلاَ أُنَبِّئُكُمْ بِخَيْرِ أَعْمَالِكُمْ، وَأَزْكَاهَا عِنْدَ مَلِيكِكُمْ، وَأَرْفَعِهَا فِي دَرَجَاتِكُمْ، وَخَيْرٌ لَكُمْ مِنْ إِنْفَاقِ الذَّهَبِ وَالْوَرِقِ؟ ذِكْرُ اللَّهِ تَعَالَى',
        latin: 'Alā unabbiukum bikhairi a\'mālikum... dzikrullāhi ta\'ālā.',
        translation: 'Maukah aku kabarkan kepada kalian amalan terbaik kalian, yang paling suci di sisi Rabb kalian, yang paling tinggi derajatnya, dan lebih baik dari menginfakkan emas dan perak? Yaitu dzikrullah (mengingat Allah).',
        source: 'HR. Tirmidzi no. 3377, Ibnu Majah — Shahih',
        narrator: 'Abu Darda رضي الله عنه',
        faidah: 'Dzikrullah adalah amalan terbaik yang melebihi sedekah harta.'
    },
    {
        id: 'dz_002',
        category: 'doa',
        title: 'Kalimat Paling Dicintai Allah',
        arabic: 'أَحَبُّ الْكَلاَمِ إِلَى اللَّهِ أَرْبَعٌ: سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلاَ إِلَهَ إِلاَّ اللَّهُ، وَاللَّهُ أَكْبَرُ',
        latin: 'Ahabbul-kalāmi ilallāhi arba\': subhānallāhi, walhamdulillāhi, wa lā ilāha illallāhu, wallāhu akbar.',
        translation: 'Kalimat yang paling dicintai Allah ada empat: Subhanallah, Alhamdulillah, Lā ilāha illallāh, dan Allahu Akbar.',
        source: 'HR. Muslim no. 2137',
        narrator: 'Samurah bin Jundub رضي الله عنه',
        faidah: 'Empat kalimat ini adalah dzikir paling utama yang bisa diucapkan kapan saja.'
    },
    {
        id: 'dz_003',
        category: 'doa',
        title: 'Doa Paling Agung',
        arabic: 'سَيِّدُ الاسْتِغْفَارِ أَنْ يَقُولَ الْعَبْدُ: اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ',
        latin: 'Sayyidul-istighfāri an yaqūlal-\'abdu: Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa ana \'abduk...',
        translation: 'Penghulu istighfar adalah seorang hamba mengucapkan: Ya Allah, Engkau adalah Rabbku, tiada ilah selain Engkau. Engkau menciptakanku dan aku adalah hamba-Mu...',
        source: 'HR. Bukhari no. 6306',
        narrator: 'Syaddad bin Aus رضي الله عنه',
        faidah: 'Ini adalah sayyidul istighfar (penghulu istighfar) yang dianjurkan dibaca pagi dan petang.'
    },
    {
        id: 'dz_004',
        category: 'doa',
        title: 'Asmaul Husna Kunci Surga',
        arabic: 'إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا مِائَةً إِلاَّ وَاحِدًا مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ',
        latin: 'Inna lillāhi tis\'atan wa tis\'īna ismā, mi\'atan illā wāhidā, man ahshāhā dakhalal-jannah.',
        translation: 'Sesungguhnya Allah memiliki 99 nama — seratus kurang satu. Barangsiapa yang menjaganya maka ia akan masuk surga.',
        source: 'HR. Bukhari no. 2736 & Muslim no. 2677',
        narrator: 'Abu Hurairah رضي الله عنه',
        faidah: '"Ihsha\'" berarti menghafal, memahami maknanya, dan beribadah kepada Allah sesuai nama tersebut.'
    },
];
