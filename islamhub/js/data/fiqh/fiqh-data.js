// Fiqh Praktis — Panduan Ibadah Sehari-hari
import { EXTRA_FIQH } from './fiqh-extra.js';
// Berdasarkan dalil Al-Quran dan Sunnah yang shahih dengan pemahaman Salafus Shalih

export const FIQH_CATEGORIES = [
    { id: 'thaharah', icon: 'fa-droplet',       label: 'Thaharah',     color: '#00bfff', desc: 'Bersuci, wudhu, mandi, tayamum' },
    { id: 'sholat',   icon: 'fa-mosque',          label: 'Sholat',       color: '#ffd700', desc: 'Syarat, rukun, dan tata cara sholat' },
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
        answer: 'Hal-hal yang membatalkan wudhu:\n\n1. **Sesuatu yang keluar dari dua jalan (qubul dan dubur)**: air kecil, air besar, angin (kentut), dan sejenisnya.\n2. **Tidur nyenyak** sampai hilang kesadaran (kecuali tidur ringan/kantuk yang masih sadar sekitar).\n3. **Hilangnya akal**: mabuk, pingsan, atau gila.\n4. **Menyentuh kemaluan** secara langsung dengan telapak tangan tanpa pembatas (menurut pendapat yang kuat).',
        dalil: 'QS. Al-Maidah: 6; HR. Abu Dawud, At-Tirmidzi',
        catatan: 'Menyentuh wanita ajnabi (bukan mahram) tidak membatalkan wudhu menurut pendapat yang rajih (Ibnu Taimiyah, Ibnu Baz, Al-Albani), karena lāmastum dalam QS. 4:43 bermakna jima\' (hubungan suami istri) menurut tafsir Ibnu Abbas.',
        tags: ['wudhu', 'thaharah', 'batal']
    },
    {
        id: 'th_002',
        category: 'thaharah',
        question: 'Kapan wajib mandi junub (ghusl)?',
        answer: 'Mandi wajib (ghusl) diwajibkan karena:\n\n1. **Keluarnya mani** dengan syahwat — baik laki-laki maupun perempuan, baik saat sadar maupun mimpi basah.\n2. **Jima\' (berhubungan badan)** — bertemunya dua khitan meski tidak keluar mani.\n3. **Haid selesai**.\n4. **Nifas selesai**.\n5. **Masuk Islamnya orang kafir**.\n6. **Kematian seorang Muslim** (kecuali syahid di medan perang).',
        dalil: 'QS. Al-Maidah: 6; HR. Muslim',
        catatan: 'Cara mandi junub: niat (dalam hati), basuh tangan 3x, bersihkan kemaluan, berwudhu sempurna seperti wudhu sholat, siram kepala 3x sambil menyela akar rambut, lalu siram seluruh badan dimulai dari bagian kanan.',
        tags: ['mandi', 'junub', 'ghusl', 'haid']
    },
    {
        id: 'th_003',
        category: 'thaharah',
        question: 'Bagaimana cara tayamum yang benar?',
        answer: 'Tayamum boleh dilakukan ketika:\n• Tidak ada air sama sekali\n• Sakit yang bisa bertambah parah bila terkena air\n• Air sangat dingin yang membahayakan nyawa dan tidak ada alat pemanas\n\n**Cara tayamum sesuai Sunnah:**\n1. Niat dalam hati dan membaca Bismillah.\n2. Menepukkan kedua telapak tangan ke debu/tanah suci satu kali tepukan.\n3. Meniup telapak tangan jika debunya terlalu tebal.\n4. Mengusap wajah (sekali).\n5. Mengusap punggung telapak tangan kanan dengan tangan kiri, lalu punggung telapak tangan kiri dengan tangan kanan.',
        dalil: 'QS. An-Nisa: 43; HR. Bukhari & Muslim dari Ammar bin Yasir',
        catatan: 'Tidak perlu menepuk dua kali dan tidak perlu mengusap sampai ke siku. Cukup telapak tangan dan wajah dengan satu tepukan. Ini adalah pendapat jumhur ulama salaf.',
        tags: ['tayamum', 'thaharah', 'air']
    },
    {
        id: 'th_004',
        category: 'thaharah',
        question: 'Hukum dan cara mengusap Khuf (Sepatu/Kaos Kaki) saat wudhu?',
        answer: 'Syariat membolehkan mengusap khuf (sepatu kulit) atau jawarib (kaos kaki) sebagai pengganti mencuci kaki saat wudhu.\n\n**Syaratnya:**\n1. Dipakai dalam keadaan sudah suci (punya wudhu).\n2. Kaos kaki/sepatu menutupi area yang wajib dicuci (mata kaki).\n3. Sepatu/kaos kaki dalam keadaan suci dari najis.\n4. Mengusap hanya pada wudhu dari hadats kecil, bukan mandi junub.\n\n**Batas Waktu:**\n• **Mukim (tidak safar):** 1 hari 1 malam (24 jam)\n• **Musafir:** 3 hari 3 malam (72 jam)\nWaktu dihitung sejak usapan pertama setelah batal wudhu.\n\n**Cara mengusap:** Membasahi tangan, lalu mengusap bagian ATAS (punggung) sepatu/kaos kaki sekali usap. Bagian bawah tidak diusap.',
        dalil: 'HR. Muslim (Ali bin Abi Thalib menjelaskan cara mengusap bagian atas)',
        catatan: 'Kemudahan ini sangat berguna bagi pekerja atau musafir di musim dingin.',
        tags: ['khuf', 'kaos kaki', 'wudhu', 'sepatu']
    },
    {
        id: 'th_005',
        category: 'thaharah',
        question: 'Bagaimana membersihkan najis anjing?',
        answer: 'Air liur anjing adalah najis mughalladzah (berat). Jika anjing menjilat bejana (piring, mangkuk, wadah air), maka wajib dibersihkan dengan cara khusus:\n\n1. Dicuci sebanyak **7 kali basuhan**.\n2. Salah satu dari basuhan tersebut (utamanya yang pertama) harus dicampur dengan **tanah/debu**.\n\nSabda Nabi ﷺ:\n"Sucinya bejana salah seorang di antara kalian apabila dijilat anjing adalah dengan mencucinya tujuh kali, yang pertama dengan debu/tanah." (HR. Muslim)\n\n**Bagaimana dengan bulu anjing?**\nMenurut pendapat yang kuat (Syaikhul Islam Ibnu Taimiyah), bulu anjing yang kering jika bersentuhan dengan pakaian kering tidak menajiskan. Yang najis secara mutlak adalah air liurnya.',
        dalil: 'HR. Bukhari no. 172 & Muslim no. 279',
        catatan: 'Sabun atau disinfektan modern bisa menggantikan fungsi tanah jika fungsinya sama (membersihkan virus/bakteri rabies), namun menggunakan tanah tetap lebih utama (tekstual hadits) menurut pendapat Syaikh Ibnu Utsaimin.',
        tags: ['najis', 'anjing', 'air liur', 'thaharah']
    },

    // ===== SHOLAT =====
    {
        id: 'sh_001',
        category: 'sholat',
        question: 'Apa syarat sah sholat?',
        answer: 'Syarat sah sholat ada delapan:\n\n1. **Islam** — kafir sholatnya tidak sah.\n2. **Berakal** — orang gila tidak wajib sholat.\n3. **Tamyiz** — anak yang sudah dapat membedakan baik-buruk.\n4. **Suci dari hadats** — berwudhu atau mandi junub.\n5. **Suci badan, pakaian, dan tempat** dari najis.\n6. **Menutup aurat** — laki-laki minimal pusar-lutut, perempuan seluruh tubuh kecuali wajah dan telapak tangan.\n7. **Menghadap kiblat**.\n8. **Masuk waktu sholat**.',
        dalil: 'QS. Al-Maidah: 6; HR. Bukhari',
        catatan: 'Jika lupa belum masuk waktu lalu sholat, maka wajib diulang saat waktu masuk. Namun jika sholat tanpa sadar ada najis di bajunya, sholatnya tetap sah.',
        tags: ['syarat sholat', 'sholat', 'wajib']
    },
    {
        id: 'sh_002',
        category: 'sholat',
        question: 'Detail Shalat Jama\' dan Qashar bagi Musafir',
        answer: '**Shalat Qashar** (diringkas dari 4 rakaat menjadi 2 rakaat):\n• **Kapan?** Boleh dilakukan ketika safar (perjalanan) telah melewati batas kota/desa tempat tinggal.\n• **Jarak Safar:** Mayoritas ulama membatasi sekitar 80-85 km. Namun pendapat kuat (Ibnu Taimiyah) menyatakan safar dikembalikan pada urf (kebiasaan masyarakat setempat), jika dianggap bepergian jauh maka boleh qashar.\n• Qashar hanya berlaku untuk shalat Dzuhur, Ashar, dan Isya.\n\n**Shalat Jama\'** (menggabungkan dua sholat):\n• **Jama\' Taqdim**: Dzuhur + Ashar di waktu Dzuhur; Maghrib + Isya di waktu Maghrib\n• **Jama\' Ta\'khir**: Dzuhur + Ashar di waktu Ashar; Maghrib + Isya di waktu Isya\n• Boleh dilakukan karena safar, hujan lebat, sakit, atau ada hajat/kesulitan mendesak (sesekali).\n\n**Hukum asal safar:** Sangat ditekankan untuk mengqashar shalat (karena itu sedekah dari Allah). Sedangkan jama\' dilakukan jika memang diperlukan/memberatkan jika tidak dijama\'.',
        dalil: 'QS. An-Nisa: 101; HR. Muslim no. 686 (sedekah dari Allah)',
        catatan: 'Jika musafir bermakmum pada imam yang mukim (orang setempat), maka musafir wajib mengikuti imam shalat 4 rakaat penuh (tidak diqashar).',
        tags: ['jama', 'qashar', 'safar', 'musafir', 'sholat']
    },
    {
        id: 'sh_003',
        category: 'sholat',
        question: 'Tata Cara Shalat Khauf (Dalam Keadaan Perang/Takut)',
        answer: 'Shalat khauf disyariatkan saat kondisi perang berkecamuk atau ada ancaman musuh yang sangat nyata, sehingga tidak memungkinkan shalat normal.\n\nNabi ﷺ mengajarkan beberapa tata cara (salah satunya):\n1. Pasukan dibagi 2 kelompok. Imam shalat menghadap kiblat.\n2. Kelompok 1 ikut shalat bersama imam 1 rakaat, sementara Kelompok 2 berjaga menghadap musuh.\n3. Di rakaat kedua, imam berdiri, lalu Kelompok 1 meneruskan shalat sendiri (1 rakaat) lalu salam, kemudian pergi berjaga.\n4. Kelompok 2 datang, bergabung dengan imam di rakaat kedua imam (rakaat pertama mereka).\n5. Imam salam, lalu Kelompok 2 berdiri menyelesaikan 1 rakaat sisa mereka lalu salam.\n\n**Shalat Syiddatul Khauf (Sangat Genting):**\nJika perang sedang berkecamuk hebat (duel/lari), boleh shalat sambil berjalan kaki, atau di atas kendaraan (kuda/tank), menghadap kiblat atau tidak, dengan isyarat anggukan kepala untuk ruku\' dan sujud.',
        dalil: 'QS. An-Nisa: 102; QS. Al-Baqarah: 239; HR. Bukhari & Muslim',
        catatan: 'Ini menunjukkan betapa agungnya kedudukan shalat. Dalam keadaan perang sekalipun, shalat tidak boleh ditinggalkan.',
        tags: ['khauf', 'perang', 'takut', 'darurat']
    },
    {
        id: 'sh_004',
        category: 'sholat',
        question: 'Kapan Sujud Sahwi Dilakukan: Sebelum atau Sesudah Salam?',
        answer: 'Sujud Sahwi (2 kali sujud karena lupa dalam sholat) disyariatkan dalam 3 keadaan: Menambah, Mengurangi, atau Ragu.\n\n**1. Sujud SEBELUM Salam:**\n• Karena **mengurangi** kewajiban shalat (contoh: lupa tasyahud awal, langsung berdiri).\n• Karena **ragu** dan tidak bisa menentukan mana yang lebih yakin (contoh: ragu 3 atau 4 rakaat, maka ambil yang 3, lalu sujud sahwi sebelum salam).\n\n**2. Sujud SESUDAH Salam:**\n• Karena **menambah** (contoh: shalat dzuhur 5 rakaat, setelah sadar di akhir, salam dulu lalu sujud sahwi).\n• Karena **ragu** tapi hati lebih condong/yakin ke salah satu (contoh: ragu 3 atau 4, tapi yakin sudah 4 rakaat, maka teruskan, salam, lalu sujud sahwi).\n• Jika baru teringat lupa setelah salam (jeda sebentar), maka langsung sujud sahwi 2 kali lalu salam lagi.',
        dalil: 'HR. Bukhari no. 1224 (Hadits Dzul Yadain) & Muslim no. 572',
        catatan: 'Bacaan sujud sahwi sama seperti bacaan sujud biasa ("Subhana rabbiyal a\'la").',
        tags: ['sujud sahwi', 'lupa', 'sholat']
    },
    {
        id: 'sh_005',
        category: 'sholat',
        question: 'Aturan Masbuq: Kapan Dihitung Mendapat Satu Rakaat?',
        answer: 'Masbuq adalah makmum yang terlambat mengikuti imam.\n\n**Batas Mendapat Rakaat:**\nSeorang makmum dihitung **mendapatkan rakaat** tersebut jika ia sempat ruku\' bersama imam dengan thuma\'ninah (sempat memegang lutut), sebelum imam bangkit (I\'tidal).\n\nSabda Nabi ﷺ:\n"Barangsiapa mendapati ruku\', maka ia telah mendapati rakaat tersebut." (HR. Abu Dawud, dishahihkan Al-Albani).\n\n**Tata Cara:**\n1. Masuk shaf, ucapkan Takbiratul Ihram (berdiri tegak).\n2. Jika imam sedang ruku\', langsung ucapkan takbir intiqal (pindah) dan ikut ruku\'. (Dihitung 1 rakaat)\n3. Jika imam sedang sujud/tasyahud, langsung takbiratul ihram dan ikut posisi imam, tapi **TIDAK** dihitung mendapat rakaat.\n4. Kekurangan rakaat diganti setelah imam mengucapkan salam (salam ke kanan & kiri).',
        dalil: 'HR. Abu Dawud no. 893; HR. Bukhari-Muslim',
        catatan: 'Makmum masbuq tidak boleh langsung menepuk pundak orang untuk menariknya ke belakang membentuk shaf baru. Cukup berdiri di shaf yang kosong.',
        tags: ['masbuq', 'makmum', 'terlambat', 'ruku']
    },
    {
        id: 'sh_006',
        category: 'sholat',
        question: 'Pentingnya Meluruskan dan Merapatkan Shaf',
        answer: 'Meluruskan dan merapatkan shaf shalat berjamaah adalah bagian dari kesempurnaan shalat.\n\nNabi ﷺ bersabda:\n"Luruskanlah shaf-shaf kalian, karena meluruskan shaf termasuk kesempurnaan shalat." (HR. Bukhari & Muslim)\n\n**Cara Merapatkan Shaf menurut Sunnah:**\nBerdasarkan praktik para sahabat (seperti riwayat Anas bin Malik dan Nu\'man bin Basyir):\n• Merapatkan pundak dengan pundak sebelahnya.\n• Merapatkan mata kaki dengan mata kaki sebelahnya.\n• Merapatkan lutut dengan lutut (saat duduk/posisi memungkinkan).\n\nAncaman tidak meluruskan shaf:\n"Hendaknya kalian meluruskan shaf kalian atau (jika tidak) Allah akan memalingkan wajah-wajah (hati) kalian." (HR. Bukhari & Muslim).',
        dalil: 'HR. Bukhari no. 719 & 725',
        catatan: 'Merapatkan kaki bukan berarti mengangkang terlalu lebar berlebihan, tapi proporsional sebatas bahu, agar pundak dan kaki bisa bersentuhan dengan jamaah di kanan kiri.',
        tags: ['shaf', 'lurus', 'rapat', 'jamaah']
    },
    {
        id: 'sh_007',
        category: 'sholat',
        question: 'Apa hukum sholat Jumat dan siapa yang wajib?',
        answer: 'Sholat Jumat **wajib** bagi:\n• Muslim laki-laki\n• Baligh\n• Berakal\n• Merdeka (bukan budak)\n• Muqim (bukan musafir)\n• Sehat (tidak sakit yang memberatkan)\n\n**Tidak wajib** bagi: perempuan, anak-anak, musafir, orang sakit, hamba sahaya.\n\n**Syarat sah sholat Jumat:**\n1. Dilakukan di waktu Dzuhur\n2. Di tempat yang menjadi tempat tinggal tetap (menurut jumhur)\n3. Adanya imam\n4. Dua khutbah sebelum sholat\n5. Minimal dua orang (menurut sebagian ulama, minimal 40 orang)',
        dalil: 'QS. Al-Jumuah: 9; HR. Abu Dawud: "Jumat wajib atas setiap Muslim"',
        catatan: 'Perempuan boleh ikut sholat Jumat dan sholatnya sah, namun tidak wajib.',
        tags: ['jumat', 'sholat jumat', 'wajib']
    },
    {
        id: 'sh_008',
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
        question: 'Siapa yang Wajib Fidyah dan Bagaimana Caranya?',
        answer: 'Fidyah adalah denda (berupa makanan) bagi orang yang tidak mampu berpuasa Ramadhan dan tidak punya harapan untuk mengqadhanya.\n\n**Orang yang wajib Fidyah (tanpa qadha):**\n1. Orang tua renta yang sangat lemah.\n2. Orang sakit parah yang menurut medis tidak ada harapan sembuh.\n3. Wanita hamil/menyusui yang khawatir akan keselamatan **bayinya saja** (menurut pendapat Ibnu Abbas dan Ibnu Umar), namun jika khawatir pada dirinya wajib qadha.\n\n**Kadar dan Cara Bayar:**\nMemberi makan 1 orang miskin untuk setiap hari puasa yang ditinggalkan. Bisa berupa:\n• Makanan mentah (1 mud = ~750 gram beras) ditambah lauk pauk secukupnya.\n• Makanan matang (nasi box) yang mengenyangkan untuk 1 porsi makan.\n\nBoleh diberikan setiap hari, atau dikumpulkan di akhir bulan lalu diberikan sekaligus ke banyak orang miskin (sebagaimana praktik Anas bin Malik).',
        dalil: 'QS. Al-Baqarah: 184',
        catatan: 'Fidyah dibayar dengan makanan, bukan dengan uang (menurut mayoritas ulama salaf). Jika diberi uang, harus dipastikan uang itu dibelikan makanan untuk orang miskin tersebut.',
        tags: ['fidyah', 'puasa', 'hamil', 'sakit']
    },
    {
        id: 'pu_002',
        category: 'puasa',
        question: 'Hukum Mencicipi Masakan Saat Puasa?',
        answer: 'Mencicipi masakan bagi orang yang sedang berpuasa hukumnya **Mubah (Boleh) jika ada keperluan** (seperti koki atau ibu rumah tangga yang sedang memasak untuk berbuka).\n\n**Syaratnya:**\n• Hanya diletakkan di ujung lidah untuk merasakan garam/bumbu.\n• **Wajib diludahkan kembali**, tidak boleh ada sedikitpun yang tertelan sampai ke kerongkongan.\n\nHal ini disandarkan pada riwayat dari Ibnu Abbas radhiyallahu \'anhuma:\n"Tidak mengapa seseorang mencicipi kuah atau makanan lainnya, selama tidak sampai masuk ke kerongkongannya, dalam keadaan dia sedang berpuasa." (Riwayat Bukhari secara mu\'allaq).',
        dalil: 'Atsar Ibnu Abbas (Shahih Bukhari bab Puasa)',
        catatan: 'Meski boleh, sebaiknya dilakukan jika sangat perlu saja untuk menghindari risiko tertelan tanpa sengaja.',
        tags: ['cicipi masakan', 'mencicipi', 'puasa', 'batal']
    },
    {
        id: 'pu_003',
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
        answer: '**Nisab Zakat Emas:** 85 gram emas murni (20 mitsqal)\n**Nisab Zakat Perak:** 595 gram perak\n\nJika emas yang dimiliki sudah mencapai 85 gram selama satu tahun Hijriyah (haul), maka wajib mengeluarkan zakat sebesar **2,5%**.\n\n**Catatan penting:**\n• Perhiasan emas yang dipakai sehari-hari: ulama berbeda pendapat. Pendapat rajih (Syaikh Bin Baz, Ibnu Utsaimin): **tetap wajib zakat** karena hadits umum tentang zakat emas berlaku.',
        dalil: 'HR. Abu Dawud no. 1558',
        catatan: 'Nisab dikonversi ke harga emas/perak sekarang untuk menentukan apakah harta uang/tabungan sudah mencapai nisab.',
        tags: ['nisab', 'zakat emas', 'perhiasan']
    },
    {
        id: 'zk_002',
        category: 'zakat',
        question: 'Hukum Zakat Profesi / Penghasilan per Bulan?',
        answer: 'Istilah "Zakat Profesi" yang dikeluarkan setiap bulan (seperti pajak 2,5% dari gaji) **tidak dikenal** di zaman Nabi ﷺ, sahabat, dan 4 madzhab.\n\nFatwa ulama besar abad ini (Syaikh Bin Baz, Syaikh Utsaimin, Syaikh Al-Albani, Syaikh Shalih Al-Fauzan):\n**Gaji/penghasilan bulanan dianalogikan (qiyas) pada zakat Nuqud (uang/emas/perak).**\n\nSyarat wajibnya:\n1. Mencapai **Nisab** (senilai 85 gram emas, uang yang tersisa/ditabung, bukan kotor sebelum dipotong kebutuhan).\n2. Mencapai **Haul** (bertahan 1 tahun Hijriyah).\n\nJadi tidak wajib dipotong 2,5% setiap gajian turun. Namun, dianjurkan untuk sedekah mutlak setiap gajian. Jika uang tabungan dari gaji yang terkumpul (setelah setahun) sudah mencapai nilai 85 gram emas, barulah wajib dizakati 2,5%.',
        dalil: 'Sesuai urutan penyebutan dalam QS. An-Nisa ayat 11.',
        catatan: 'Sebagian lembaga amil zaman sekarang menggunakan qiyas ke Zakat Pertanian (potong saat panen/gajian). Ini dianggap qiyas ma\'al fariq (tidak tepat) oleh Lajnah Daimah Arab Saudi.',
        tags: ['zakat profesi', 'gaji', 'penghasilan']
    },
    {
        id: 'zk_003',
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
        question: 'Hukum Menghajikan Orang Lain (Badal Haji)?',
        answer: 'Badal haji (menggantikan haji orang lain) hukumnya **Boleh dan Sah**, namun dengan syarat yang ketat:\n\n**Siapa yang boleh di-badalkan?**\n1. Orang yang sudah meninggal dunia.\n2. Orang tua/sakit parah yang fisiknya sudah tidak mampu sama sekali untuk safar haji dan tidak ada harapan sembuh.\n\n**Syarat Orang yang Membadalkan:**\n• Orang tersebut **harus sudah pernah haji untuk dirinya sendiri** terlebih dahulu. Jika belum, hajinya akan jatuh untuk dirinya sendiri.\n• Disunnahkan dilakukan oleh anak/kerabat dekat, meski boleh menyewa orang lain yang amanah.\n\nDalil:\nNabi ﷺ mendengar seseorang bertalbiyah, "Labbaik untuk Syubrumah." Nabi bertanya, "Siapa Syubrumah?" Ia jawab, "Saudaraku." Nabi bertanya, "Apakah kamu sudah haji untuk dirimu?" Ia jawab, "Belum." Nabi bersabda, "Hajilah untuk dirimu dulu, baru untuk Syubrumah." (HR. Abu Dawud)',
        dalil: 'HR. Bukhari no. 1852; HR. Abu Dawud no. 1811',
        catatan: 'Tidak boleh membadalkan haji orang yang fisiknya sehat atau orang miskin (karena orang miskin asalnya tidak wajib haji).',
        tags: ['badal haji', 'haji badal', 'menggantikan']
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
        question: 'Hukum Dropshipping dalam Jual Beli Online',
        answer: 'Sistem Dropship secara umum adalah menjual barang yang belum dimiliki/belum ada di tangan penjual. Hukum asalnya **DILARANG**.\nNabi ﷺ bersabda kepada Hakim bin Hizam: "Janganlah engkau menjual barang yang tidak ada di sisimu." (HR. Tirmidzi).\n\n**Solusi agar Dropship Menjadi HALAL:**\n\n1. **Sistem Wakalah (Agen/Reseller Resmi)**: Anda mendaftar sebagai agen resmi dari supplier. Anda menjual atas nama supplier. Untung didapat dari bagi hasil/komisi (fee) yang disepakati.\n2. **Sistem Salam (Pre-Order)**: Pembeli membayar LUNAS di awal kepada Anda, kriteria barang jelas, waktu pengiriman jelas. Lalu Anda beli ke supplier dan kirim ke pembeli.\n3. **Hanya Menawarkan Jasa Belikan**: "Saya tidak punya barangnya, tapi saya bisa bantu carikan dan belikan." Posisi Anda sebagai wakil pembeli, bukan penjual. Anda boleh ambil fee jasa.',
        dalil: 'HR. Tirmidzi no. 1232; HR. Abu Dawud no. 3503',
        catatan: 'Marketplace modern dengan sistem resi otomatis sering bermasalah di syarat ini jika seller mengklaim barang miliknya.',
        tags: ['dropship', 'jual beli online', 'muamalah', 'reseller']
    },
    {
        id: 'mu_002',
        category: 'muamalah',
        question: 'Hukum Paylater dan Kartu Kredit',
        answer: 'Hukum Paylater dan Kartu Kredit pada dasarnya adalah **HARAM** karena mengandung akad utang-piutang yang mensyaratkan adanya **denda keterlambatan** (riba jahiliyah).\n\nKaidah Fiqh: "Setiap utang yang menarik manfaat (tambahan uang/denda) adalah RIBA."\n\nWalaupun pengguna yakin 100% bisa membayar tepat waktu (sehingga tidak kena bunga/denda 0%), **akad kesepakatannya (terms & conditions) sudah bathil** karena ia menyetujui syarat riba jika terlambat.\nSyaikh Ibnu Utsaimin menegaskan bahwa menandatangani akad yang memuat klausul riba hukumnya haram, karena sama dengan melegalkan sistem riba.\n\n**Solusi:** Gunakan kartu debit biasa, transfer tunai, atau COD.',
        dalil: 'QS. Al-Baqarah: 278-279; Fatwa Lajnah Daimah 13/524',
        catatan: 'Dikecualikan jika dalam keadaan sangat dharurat (mengancam nyawa) dan tidak ada cara lain.',
        tags: ['paylater', 'kartu kredit', 'riba', 'denda']
    },
    {
        id: 'mu_003',
        category: 'muamalah',
        question: 'Hukum e-Wallet (Gopay/OVO) dan Diskon Cashless',
        answer: 'Top up (mengisi saldo) di e-Wallet seperti Gopay, OVO, Dana, dll adalah akad **Qardh (Utang)**. Kita meminjamkan uang kita kepada perusahaan aplikasi tersebut.\n\nKaidah: "Setiap utang yang mendatangkan manfaat bagi pihak yang meminjamkan, adalah RIBA."\n\nOleh karena itu:\n1. Menggunakan aplikasinya untuk kemudahan bayar: **Boleh**.\n2. **Memanfaatkan promo/diskon/cashback** khusus karena pakai saldo e-Wallet tersebut: **HARAM (Riba)**, karena itu adalah "manfaat/hadiah dari utang".\n\n**Solusi agar tetap halal:**\nJika Anda butuh bayar ojek 15.000, top up saja persis 15.000 via driver/minimarket lalu langsung bayarkan. Jangan menahan saldo mengendap berlama-lama untuk mencari promo.',
        dalil: 'Kaidah Fiqh tentang Riba Qardh (Manfaat dari Utang)',
        catatan: 'Fatwa ini dikemukakan oleh para asatidzah pakar fiqh muamalah di Indonesia (seperti Ustadz Dr. Erwandi Tarmizi, dkk).',
        tags: ['ewallet', 'gopay', 'ovo', 'diskon', 'riba', 'cashback']
    },

    // ===== PERNIKAHAN =====
    {
        id: 'nk_001',
        category: 'nikah',
        question: 'Hukum Akad Nikah via Telepon / Video Call?',
        answer: 'Mayoritas ulama masa kini dan Majma\' Fiqh Islami membolehkan akad nikah via sarana komunikasi modern (Video Call) dengan **syarat-syarat yang sangat ketat untuk menghindari penipuan**:\n\n1. Harus ada kepastian identitas yang mutlak (saling melihat wajah dan mengenali suara wali, pengantin pria, dan saksi).\n2. Memenuhi rukun nikah: Wali, mempelai pria, ijab, qabul, dan 2 saksi adil.\n3. Ijab (dari wali) dan Qabul (dari mempelai pria) terjadi dalam satu majelis waktu (bersambung tanpa jeda yang merusak akad).\n4. Bebas dari paksaan.\n\nNamun, jika hanya via telepon suara tanpa video, rawan penipuan sehingga sebagian ulama melarangnya demi kehati-hatian menjaga kesucian akad nikah.',
        dalil: 'Keputusan Majma\' Fiqh Islami OKI',
        catatan: 'Sangat dianjurkan menggunakan sistem "Taukil Wali" (Wali mewakilkan perwaliannya kepada tokoh agama setempat di lokasi mempelai pria), ini lebih aman dan keluar dari khilaf.',
        tags: ['nikah online', 'video call', 'wali nikah']
    },
    {
        id: 'nk_002',
        category: 'nikah',
        question: 'Batasan Aurat Wanita di Depan Mahramnya',
        answer: 'Wanita Muslimah di depan mahramnya (ayah, saudara laki-laki, keponakan, mertua, paman) wajib menjaga aurat.\n\nYang boleh ditampakkan di depan mahram (menurut pendapat yang rajih dari ulama salaf seperti Ibnu Taimiyah):\n• Kepala, rambut, leher\n• Tangan sampai siku (atau sedikit di atas siku)\n• Kaki sampai betis (bawah lutut)\n\n**TIDAK BOLEH** menampakkan:\n• Payudara, dada, perut, punggung, paha, dan di atas lutut.\nBerpakaian ketat atau transparan di depan mahram tetap dilarang.\n\nPerhatian khusus: **Ipar bukanlah mahram**. Ipar adalah "Maut" (bahaya) kata Nabi ﷺ. Wanita wajib berhijab sempurna di depan ipar laki-lakinya.',
        dalil: 'QS. An-Nur: 31; HR. Bukhari (Ipar adalah maut)',
        catatan: 'Kelalaian yang sering terjadi di rumah adalah tidak berhijab di depan ipar atau sepupu laki-laki (anak paman), padahal mereka BUKAN mahram.',
        tags: ['aurat', 'mahram', 'ipar', 'keluarga']
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
    ...EXTRA_FIQH
];
