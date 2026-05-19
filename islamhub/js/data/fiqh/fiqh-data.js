// Fiqh Praktis — Panduan Ibadah Sehari-hari
// Berdasarkan dalil Al-Quran dan Sunnah yang shahih

export const FIQH_CATEGORIES = [
    { id: 'thaharah', icon: 'fa-droplet',       label: 'Thaharah',     color: '#00bfff', desc: 'Bersuci, wudhu, mandi, tayamum' },
    { id: 'sholat',   icon: 'fa-hands-praying',  label: 'Sholat',       color: '#ffd700', desc: 'Syarat, rukun, dan tata cara sholat' },
    { id: 'puasa',    icon: 'fa-moon',            label: 'Puasa',        color: '#9370db', desc: 'Puasa wajib dan sunnah' },
    { id: 'zakat',    icon: 'fa-hand-holding-heart', label: 'Zakat',    color: '#00ff88', desc: 'Zakat maal, fitrah, dan profesi' },
    { id: 'haji',     icon: 'fa-kaaba',           label: 'Haji & Umrah', color: '#ff8c00', desc: 'Rukun dan wajib haji' },
    { id: 'muamalah', icon: 'fa-handshake',       label: 'Muamalah',    color: '#ff69b4', desc: 'Jual beli, hutang, dan halal haram' },
    { id: 'nikah',    icon: 'fa-heart',           label: 'Pernikahan',   color: '#ff4444', desc: 'Rukun nikah dan hak-hak suami istri' },
    { id: 'jenazah',  icon: 'fa-moon',            label: 'Jenazah',      color: '#708090', desc: 'Memandikan, sholat, dan menguburkan' },
];

export const FIQH_DATA = [
    // ===== THAHARAH =====
    {
        id: 'th_001',
        category: 'thaharah',
        question: 'Apa yang membatalkan wudhu?',
        answer: 'Hal-hal yang membatalkan wudhu ada empat:\n\n1. **Sesuatu yang keluar dari dua jalan (qubul dan dubur)**: air kecil, air besar, angin, dan sejenisnya.\n2. **Tidur nyenyak** sampai tidak merasakan dirinya (kecuali tidur sambil duduk yang mantap).\n3. **Hilangnya akal**: mabuk, pingsan, atau gila.\n4. **Menyentuh kemaluan** dengan telapak tangan tanpa pembatas — menurut pendapat yang kuat.',
        dalil: 'QS. Al-Maidah: 6; HR. Bukhari & Muslim tentang hal-hal yang membatalkan wudhu',
        catatan: 'Menyentuh wanita ajnabi (bukan mahram) tidak membatalkan wudhu menurut pendapat yang rajih (kuat), karena yang dimaksud "lāmastum" dalam QS. 4:43 adalah jima\' (menurut Ibnu Abbas dan dikuatkan Al-Albani).',
        tags: ['wudhu', 'thaharah', 'batal']
    },
    {
        id: 'th_002',
        category: 'thaharah',
        question: 'Kapan wajib mandi junub (ghusl)?',
        answer: 'Mandi wajib (ghusl) diwajibkan karena:\n\n1. **Keluarnya mani** dengan syahwat — baik laki-laki maupun perempuan.\n2. **Jima\' (berhubungan badan)** — meski tidak keluar mani.\n3. **Haid selesai**.\n4. **Nifas selesai**.\n5. **Wiladah (melahirkan)** — menurut sebagian ulama.\n6. **Kematian seorang Muslim** — yang memandikannya wajib mandi (menurut jumhur).',
        dalil: 'QS. Al-Maidah: 6; HR. Bukhari-Muslim: "Air itu dari air (mani)"',
        catatan: 'Cara mandi junub: niat, basuh tangan tiga kali, bersihkan kemaluan, berwudhu sempurna, siram kepala tiga kali sambil memasukkan air ke akar rambut, lalu siram seluruh badan mulai kanan.',
        tags: ['mandi', 'junub', 'ghusl', 'haid']
    },
    {
        id: 'th_003',
        category: 'thaharah',
        question: 'Bagaimana cara tayamum yang benar?',
        answer: 'Tayamum boleh dilakukan ketika:\n• Tidak ada air setelah berusaha mencarinya\n• Sakit yang dikhawatirkan membahayakan bila terkena air\n• Air sangat dingin yang berbahaya dan tidak ada cara menghangatkan\n\n**Cara tayamum:**\n1. Niat\n2. Tepukkan kedua telapak tangan ke tanah yang suci sekali tepuk\n3. Tiup/kibas debu berlebih\n4. Usap wajah dengan kedua telapak tangan\n5. Usap punggung tangan kanan dengan telapak tangan kiri dan sebaliknya\n\nCukup satu tepukan untuk wajah dan kedua tangan.',
        dalil: 'QS. An-Nisa: 43; HR. Bukhari-Muslim dari Ammar bin Yasir',
        catatan: 'Menurut pendapat yang kuat (Ibnu Taimiyah, Al-Albani), tayamum cukup satu tepukan untuk wajah dan tangan — tidak perlu sampai siku.',
        tags: ['tayamum', 'thaharah', 'air']
    },

    // ===== SHOLAT =====
    {
        id: 'sh_001',
        category: 'sholat',
        question: 'Apa syarat sah sholat?',
        answer: 'Syarat sah sholat ada delapan:\n\n1. **Islam** — kafir sholatnya tidak sah.\n2. **Berakal** — orang gila tidak wajib sholat.\n3. **Tamyiz** — sudah dapat membedakan baik-buruk.\n4. **Suci dari hadats** — berwudhu atau mandi junub.\n5. **Suci badan, pakaian, dan tempat** dari najis.\n6. **Menutup aurat** — laki-laki minimal pusar-lutut, perempuan seluruh tubuh kecuali wajah dan telapak tangan.\n7. **Menghadap kiblat**.\n8. **Masuk waktu sholat**.',
        dalil: 'QS. Al-Maidah: 6; HR. Bukhari no. 135: "Tidak diterima sholat tanpa bersuci"',
        catatan: 'Syarat yang tidak terpenuhi karena uzur (misalnya tidak tahu arah kiblat setelah berusaha) dimaafkan.',
        tags: ['syarat sholat', 'sholat', 'wajib']
    },
    {
        id: 'sh_002',
        category: 'sholat',
        question: 'Bolehkah sholat dijama\' dan diqashar?',
        answer: '**Sholat Qashar** (diringkas dari 4 rakaat menjadi 2 rakaat):\n• Boleh bagi musafir yang menempuh jarak minimal 80-85 km (pendapat jumhur)\n• Berlaku untuk Dzuhur, Ashar, dan Isya\n\n**Sholat Jama\'** (menggabungkan dua sholat):\n• **Jama\' Taqdim**: Dzuhur + Ashar di waktu Dzuhur; Maghrib + Isya di waktu Maghrib\n• **Jama\' Ta\'khir**: Dzuhur + Ashar di waktu Ashar; Maghrib + Isya di waktu Isya\n\nBoleh dilakukan:\n• Dalam perjalanan (safar)\n• Hujan lebat yang menyulitkan\n• Sakit berat\n• Kebutuhan mendesak (menurut Ibnu Taimiyah)',
        dalil: 'QS. An-Nisa: 101; HR. Bukhari-Muslim dari Ibnu Abbas',
        catatan: 'Musafir boleh memilih: jama\' saja, qashar saja, atau keduanya. Keduanya adalah rukhsah (keringanan) dari Allah.',
        tags: ['jama', 'qashar', 'safar', 'musafir', 'sholat']
    },
    {
        id: 'sh_003',
        category: 'sholat',
        question: 'Apa hukum sholat Jumat dan siapa yang wajib?',
        answer: 'Sholat Jumat **wajib** bagi:\n• Muslim laki-laki\n• Baligh\n• Berakal\n• Merdeka (bukan budak)\n• Muqim (bukan musafir)\n• Sehat (tidak sakit yang memberatkan)\n\n**Tidak wajib** bagi: perempuan, anak-anak, musafir, orang sakit, hamba sahaya.\n\n**Syarat sah sholat Jumat:**\n1. Dilakukan di waktu Dzuhur\n2. Di tempat yang menjadi tempat tinggal tetap (menurut jumhur)\n3. Adanya imam\n4. Dua khutbah sebelum sholat\n5. Minimal dua orang (menurut sebagian ulama, minimal 40 orang)',
        dalil: 'QS. Al-Jumuah: 9; HR. Abu Dawud: "Jumat wajib atas setiap Muslim"',
        catatan: 'Perempuan boleh ikut sholat Jumat dan sholatnya sah, namun tidak wajib.',
        tags: ['jumat', 'sholat jumat', 'wajib']
    },
    {
        id: 'sh_004',
        category: 'sholat',
        question: 'Bagaimana hukum sholat berjamaah?',
        answer: 'Sholat berjamaah **wajib** bagi laki-laki yang mampu, berdasarkan:\n• QS. Al-Baqarah: 43 — "Ruku\'lah bersama orang-orang yang ruku\'"\n• HR. Bukhari-Muslim: Nabi hampir membakar rumah orang yang tidak sholat berjamaah\n\n**Keutamaan berjamaah**: 27 derajat lebih utama dari sholat sendirian (HR. Bukhari).\n\n**Uzur yang membolehkan sholat sendiri**: hujan lebat, angin kencang di malam gelap, sakit, rasa takut, dan sejenisnya.',
        dalil: 'QS. An-Nisa: 102; HR. Bukhari no. 645',
        catatan: 'Ini adalah pendapat jumhur ulama termasuk Ibnu Taimiyah, Ibnu Baz, dan Ibnu Utsaimin.',
        tags: ['berjamaah', 'sholat berjamaah', 'masjid']
    },

    // ===== PUASA =====
    {
        id: 'pu_001',
        category: 'puasa',
        question: 'Apa yang membatalkan puasa?',
        answer: 'Hal-hal yang membatalkan puasa:\n\n1. **Makan dan minum dengan sengaja**\n2. **Jima\' (berhubungan badan)** di siang hari — wajib qadha + kaffarah berat\n3. **Keluarnya mani** dengan sengaja (onani dll)\n4. **Haid dan nifas** — wajib qadha\n5. **Muntah dengan sengaja**\n6. **Infus/suntik yang mengandung nutrisi** (menurut mayoritas ulama kontemporer)\n7. **Murtad** — batal puasanya\n\n**Tidak membatalkan**: menelan ludah, debu, berkumur tanpa menelan, suntik vitamin/obat yang tidak mengandung nutrisi, donor darah.',
        dalil: 'QS. Al-Baqarah: 187; HR. Bukhari-Muslim',
        catatan: 'Orang yang makan/minum karena lupa, sholatnya tidak batal. "Siapa yang lupa sedang ia puasa lalu ia makan atau minum, hendaknya ia sempurnakan puasanya, karena Allah yang memberinya makan dan minum" (HR. Bukhari-Muslim).',
        tags: ['batal puasa', 'puasa ramadan', 'batalkan']
    },
    {
        id: 'pu_002',
        category: 'puasa',
        question: 'Apa saja puasa sunnah yang dianjurkan?',
        answer: 'Puasa sunnah yang sangat dianjurkan:\n\n1. **Puasa 6 hari Syawal** — pahala seperti puasa setahun penuh\n2. **Puasa Senin-Kamis** — hari amal diperlihatkan kepada Allah\n3. **Puasa Ayyamul Bidh** — 13, 14, 15 setiap bulan Hijriyah\n4. **Puasa Asyura (10 Muharram)** — menghapus dosa setahun lalu\n5. **Puasa Tasu\'a (9 Muharram)** — sunnah berpuasa sehari sebelum Asyura\n6. **Puasa Arafah (9 Dzulhijjah)** — menghapus dosa dua tahun\n7. **Puasa Dawud** — sehari puasa sehari tidak (puasa paling utama)',
        dalil: 'HR. Muslim no. 1164 (6 Syawal); HR. Tirmidzi no. 747 (Senin-Kamis); HR. Muslim no. 1162 (Dawud)',
        catatan: 'Dilarang puasa pada dua hari raya (Idul Fitri & Adha) dan hari-hari Tasyriq (11, 12, 13 Dzulhijjah).',
        tags: ['puasa sunnah', 'syawal', 'senin kamis', 'ayyamul bidh', 'asyura', 'arafah']
    },

    // ===== ZAKAT =====
    {
        id: 'zk_001',
        category: 'zakat',
        question: 'Berapa nisab zakat emas dan perak?',
        answer: '**Nisab Zakat Emas:** 85 gram emas murni (20 mitsqal)\n**Nisab Zakat Perak:** 595 gram perak\n\nJika emas yang dimiliki sudah mencapai 85 gram selama satu tahun Hijriyah (haul), maka wajib mengeluarkan zakat sebesar **2,5%**.\n\n**Cara menghitung:**\n• Zakat = Nilai emas yang dimiliki × 2,5%\n\n**Catatan penting:**\n• Perhiasan emas yang dipakai sehari-hari: ulama berbeda pendapat. Pendapat rajih (Ibnu Baz, Ibnu Utsaimin): **tetap wajib zakat** karena hadits umum tentang zakat emas berlaku.',
        dalil: 'HR. Abu Dawud no. 1558; HR. Tirmidzi no. 620',
        catatan: 'Nisab dikonversi ke harga emas/perak sekarang untuk menentukan apakah harta lain sudah mencapai nisab.',
        tags: ['nisab', 'zakat emas', 'zakat perak', 'perhiasan']
    },
    {
        id: 'zk_002',
        category: 'zakat',
        question: 'Siapa saja yang berhak menerima zakat?',
        answer: 'Allah menetapkan **8 golongan** penerima zakat (QS. At-Taubah: 60):\n\n1. **Fakir** — tidak memiliki harta dan tidak mampu bekerja\n2. **Miskin** — memiliki penghasilan tapi tidak mencukupi kebutuhan\n3. **Amil zakat** — pengelola/pengumpul zakat\n4. **Muallaf** — orang yang baru masuk Islam atau perlu dikuatkan imannya\n5. **Riqab** — memerdekakan budak/tawanan Muslim\n6. **Gharim** — orang yang terlilit utang untuk kebutuhan halal\n7. **Fi Sabilillah** — pejuang di jalan Allah (ulama luaskan ke pendidikan Islam dll)\n8. **Ibnu Sabil** — musafir yang kehabisan bekal',
        dalil: 'QS. At-Taubah: 60',
        catatan: 'Zakat tidak boleh diberikan kepada: orang kaya, orang yang mampu bekerja dan tidak mau bekerja, serta keluarga yang wajib dinafkahi oleh pemberi zakat.',
        tags: ['mustahiq', 'penerima zakat', '8 asnaf', 'fakir miskin']
    },

    // ===== HAJI =====
    {
        id: 'hj_001',
        category: 'haji',
        question: 'Apa rukun haji yang wajib dipenuhi?',
        answer: '**Rukun Haji** (jika ditinggal, haji batal):\n\n1. **Ihram** — niat masuk ibadah haji\n2. **Wukuf di Arafah** — minimal berada di Arafah sejak zawal (Dzuhur) 9 Dzulhijjah sampai terbenam matahari\n3. **Thawaf Ifadhah** — mengelilingi Ka\'bah 7 kali setelah wukuf\n4. **Sa\'i** — berjalan antara Shafa dan Marwah 7 kali\n5. **Tahalul** — mencukur/memotong rambut\n6. **Tertib** — melakukan rukun sesuai urutan\n\n**Wajib Haji** (jika ditinggal, wajib dam/fidyah):\n• Ihram dari miqat\n• Bermalam di Muzdalifah\n• Bermalam di Mina\n• Melempar Jumrah\n• Thawaf Wada\'',
        dalil: 'QS. Al-Baqarah: 196-197; HR. Muslim no. 1218',
        catatan: 'Wukuf di Arafah adalah puncak haji. "Al-hajju Arafah" — haji itu (intinya) Arafah (HR. Tirmidzi).',
        tags: ['rukun haji', 'wukuf', 'arafah', 'thawaf', 'sai']
    },
    {
        id: 'hj_002',
        category: 'haji',
        question: 'Apa perbedaan Haji Ifrad, Tamattu\', dan Qiran?',
        answer: '**1. Haji Ifrad** — haji saja tanpa umrah\n• Ihram dari miqat dengan niat haji saja\n• Tidak ada dam (denda)\n\n**2. Haji Tamattu\'** — umrah dahulu, kemudian haji di bulan yang sama\n• Paling dianjurkan oleh Nabi ﷺ untuk yang datang dari jauh\n• Wajib membayar dam: seekor kambing atau puasa 3+7 hari\n\n**3. Haji Qiran** — umrah dan haji sekaligus dalam satu ihram\n• Satu niat untuk keduanya\n• Wajib membayar dam seperti tamattu\'\n\nNabi ﷺ berkata: "Andai aku bisa mengulang hajinya, aku akan tamattu\'" (HR. Muslim)',
        dalil: 'QS. Al-Baqarah: 196; HR. Muslim no. 1241',
        catatan: 'Jumhur ulama berpendapat Tamattu\' adalah yang paling utama, sesuai anjuran Nabi ﷺ kepada para sahabat.',
        tags: ['tamattu', 'ifrad', 'qiran', 'haji', 'dam']
    },

    // ===== MUAMALAH =====
    {
        id: 'mu_001',
        category: 'muamalah',
        question: 'Apa saja jual beli yang dilarang dalam Islam?',
        answer: 'Jual beli yang dilarang antara lain:\n\n1. **Jual beli barang haram**: minuman keras, babi, narkoba, patung sesembahan\n2. **Jual beli dengan unsur gharar** (ketidakjelasan): misalnya menjual ikan yang masih di air\n3. **Jual beli dengan riba**: bunga bank, pinjaman berbunga\n4. **Jual beli najasy**: pura-pura menawar untuk menaikkan harga\n5. **Jual beli \'ainain**: membeli dua harga dalam satu akad\n6. **Menjual sesuatu yang belum dimiliki**: menjual barang yang belum dibeli\n7. **Ijon** (jual beli buah sebelum matang secara keseluruhan)\n8. **Jual beli dengan cara menipu** (tadlis)',
        dalil: 'HR. Bukhari-Muslim no. 1988: larangan jual beli khamr; HR. Muslim: larangan gharar',
        catatan: 'Hukum asal muamalah adalah boleh, kecuali ada dalil yang melarang. Sehingga transaksi modern yang tidak ada unsur di atas pada dasarnya boleh.',
        tags: ['jual beli haram', 'riba', 'gharar', 'muamalah']
    },
    {
        id: 'mu_002',
        category: 'muamalah',
        question: 'Bagaimana hukum asuransi dalam Islam?',
        answer: 'Ulama berbeda pendapat:\n\n**Pendapat 1 — Tidak Boleh** (Ibnu Baz, Ibnu Utsaimin):\nAsuransi konvensional mengandung unsur:\n• Gharar (ketidakjelasan)\n• Riba\n• Maisir (judi)\n\n**Pendapat 2 — Boleh jika Terpaksa** (Yusuf Al-Qaradhawi):\nBila tidak ada alternatif syariah dan ada kebutuhan mendesak.\n\n**Solusi Islami:**\n• **Asuransi Takaful (Syariah)**: premi dikumpulkan sebagai dana bersama (tabarru\'), tidak mengandung riba, gharar, dan maisir. **Ini dibolehkan oleh mayoritas ulama kontemporer**.',
        dalil: 'Fatwa MUI No. 21/2001 tentang Pedoman Asuransi Syariah',
        catatan: 'Untuk kebutuhan yang diwajibkan negara (asuransi kendaraan, BPJS), ulama umumnya membolehkan karena termasuk kebutuhan dharurat.',
        tags: ['asuransi', 'takaful', 'muamalah modern', 'gharar']
    },

    // ===== PERNIKAHAN =====
    {
        id: 'nk_001',
        category: 'nikah',
        question: 'Apa rukun dan syarat nikah yang sah?',
        answer: '**Rukun Nikah** (jika kurang, nikah batal):\n1. **Wali** — ayah, kakek, saudara laki-laki, paman, dll. Nikah tanpa wali tidak sah!\n2. **Calon suami** yang jelas\n3. **Calon istri** yang jelas\n4. **Dua saksi laki-laki** yang adil\n5. **Ijab dan qabul** — pernyataan akad nikah\n\n**Syarat Sah:**\n• Wali dan kedua calon mempelai tidak sedang ihram haji/umrah\n• Tidak ada penghalang nikah (mahram, sudah beristri 4, dll)\n• Mahar (wajib disebutkan meskipun boleh dibayar setelah akad)',
        dalil: 'HR. Abu Dawud no. 2085: "Tidak sah nikah kecuali dengan wali"; HR. Tirmidzi: "Tidak ada nikah kecuali dengan saksi"',
        catatan: 'Nikah tanpa wali (nikah sirri tanpa sepengetahuan wali) adalah batal menurut hadits shahih.',
        tags: ['rukun nikah', 'wali', 'mahar', 'saksi', 'pernikahan']
    },

    // ===== JENAZAH =====
    {
        id: 'jn_001',
        category: 'jenazah',
        question: 'Apa kewajiban Muslim terhadap jenazah Muslim lainnya?',
        answer: 'Kewajiban kolektif (fardhu kifayah) terhadap jenazah Muslim:\n\n1. **Memandikan jenazah** — minimal sekali, disunnahkan ganjil (3, 5, atau 7 kali)\n2. **Mengkafani** — minimal satu lembar, sunnah 3 lembar untuk laki-laki dan 5 untuk perempuan\n3. **Menyolatkan** — minimal 4 takbir, tidak boleh ditinggalkan\n4. **Menguburkan** — dalam liang lahad atau syaq (celah di pinggir kubur)\n\n**Sunnah tambahan:**\n• Menyegerakan pemakaman\n• Tidak meratap atau meraung\n• Membaca doa untuk si mayit',
        dalil: 'HR. Bukhari no. 1186; HR. Muslim no. 2162',
        catatan: 'Sholat jenazah sangat dianjurkan dihadiri banyak orang. "Tidak ada seorang Muslim yang meninggal lalu disholatkan oleh 40 orang yang tidak menyekutukan Allah, melainkan Allah terima syafaat mereka untuknya" (HR. Muslim).',
        tags: ['jenazah', 'sholat jenazah', 'memandikan', 'mengkafani', 'menguburkan']
    },
];
