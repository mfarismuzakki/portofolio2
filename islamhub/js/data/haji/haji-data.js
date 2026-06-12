// Data Peta Perjalanan Haji & Umrah
// Waypoints, urutan manasik, dan informasi tiap lokasi

export const HAJI_MIQAT = [
    { id: 'dzulhulaifah', name: 'Dzul Hulaifah (Bir Ali)', region: 'Dari Madinah', distance: '~450 km dari Makkah', note: 'Miqat paling jauh dari Makkah' },
    { id: 'juhfah',       name: 'Juhfah (Rabigh)',         region: 'Dari Syam/Mesir/Maroko', distance: '~183 km dari Makkah', note: 'Jemaah dari arah barat' },
    { id: 'qarnulmanazil', name: 'Qarnul Manazil (As-Sayl)', region: 'Dari Najd', distance: '~94 km dari Makkah', note: 'Miqat jemaah dari arah timur' },
    { id: 'yalamlam',     name: 'Yalamlam',                region: 'Dari Yaman', distance: '~94 km dari Makkah', note: 'Miqat jemaah dari arah selatan' },
    { id: 'dzaturirq',   name: 'Dzatu Irq',               region: 'Dari Iraq', distance: '~94 km dari Makkah', note: 'Miqat jemaah dari arah timur-laut' },
];

export const HAJI_LOCATIONS = [
    {
        id: 'madinah',
        name: 'Madinah Al-Munawwarah',
        icon: 'fa-mosque',
        color: '#00ff88',
        coord: { x: 15, y: 20 },
        latlng: [24.4672, 39.6116],
        type: 'city',
        desc: 'Kota Nabi ﷺ. Meskipun bukan rukun haji, sangat dianjurkan berziarah ke Masjid Nabawi dan Makam Rasulullah ﷺ. Sholat di Masjid Nabawi bernilai 1.000 kali dibandingkan masjid lain.',
        dalil: 'HR. Bukhari no. 1190: "Sholat di masjidku ini lebih utama 1.000 kali dibanding sholat di masjid lain selain Masjidil Haram"',
        amalan: ['Ziarah Masjid Nabawi', 'Sholat di Raudhah', 'Ziarah Makam Nabi ﷺ', 'Ziarah Baqi\'']
    },
    {
        id: 'makkah',
        name: 'Makkah Al-Mukarramah',
        icon: 'fa-kaaba',
        color: '#ffd700',
        coord: { x: 50, y: 55 },
        latlng: [21.4225, 39.8262],
        type: 'city',
        desc: 'Kota suci pertama dalam Islam. Tempat Masjidil Haram dan Ka\'bah. Pusat ibadah haji dan umrah. Sholat di Masjidil Haram bernilai 100.000 kali dibanding masjid lain.',
        dalil: 'HR. Ibnu Majah no. 1406 — Shahih: "Sholat di Masjidil Haram lebih utama 100.000 kali"',
        amalan: ['Thawaf', 'Sa\'i', 'Thawaf Ifadhah', 'Thawaf Wada\'']
    },
    {
        id: 'kabah',
        name: 'Ka\'bah (Baitullah)',
        icon: 'fa-cube',
        color: '#ffd700',
        coord: { x: 50, y: 52 },
        latlng: [21.4225, 39.8262],
        type: 'landmark',
        desc: 'Ka\'bah adalah kiblat umat Islam sedunia, dibangun pertama kali oleh Nabi Ibrahim dan Ismail عليهما السلام. Di dalamnya terdapat Hajar Aswad — batu dari surga yang akan bersaksi di hari kiamat.',
        dalil: 'QS. Al-Baqarah: 127; HR. Tirmidzi no. 877: "Hajar Aswad adalah batu dari surga"',
        amalan: ['Thawaf mengelilingi Ka\'bah 7 kali', 'Mencium/menyentuh Hajar Aswad', 'Sholat di Hijr Ismail', 'Minum air Zamzam']
    },
    {
        id: 'zamzam',
        name: 'Sumur Zamzam',
        icon: 'fa-droplet',
        color: '#00bfff',
        coord: { x: 52, y: 54 },
        latlng: [21.4228, 39.8264],
        type: 'landmark',
        desc: 'Air Zamzam adalah air yang paling suci di bumi, muncul pertama kali untuk Hajar dan bayi Ismail عليهما السلام. Air ini "thibun li mā syuriba lahu" — obat untuk penyakit apapun sesuai niat yang dibawa saat meminumnya.',
        dalil: 'HR. Abu Dawud no. 3735 — Shahih: "Air Zamzam adalah obat bagi apa yang dimaksudkan saat meminumnya"',
        amalan: ['Minum sambil menghadap kiblat', 'Berdoa sebelum minum', 'Boleh dibawa pulang sebagai oleh-oleh']
    },
    {
        id: 'shafa_marwah',
        name: 'Shafa dan Marwah',
        icon: 'fa-arrows-left-right',
        color: '#ff8c00',
        coord: { x: 53, y: 57 },
        latlng: [21.4231, 39.8274],
        type: 'landmark',
        desc: 'Dua bukit tempat Hajar berlari mencari air untuk putranya, Ismail عليهما السلام. Sa\'i — berjalan bolak-balik antara keduanya 7 kali — adalah rukun haji dan umrah yang wajib.',
        dalil: 'QS. Al-Baqarah: 158; HR. Bukhari no. 1792',
        amalan: ['Sa\'i 7 kali (Shafa→Marwah = 1 putaran)', 'Berdoa di atas Shafa dan Marwah', 'Berjalan biasa, kecuali antara dua lampu hijau (laki-laki berlari kecil)']
    },
    {
        id: 'mina',
        name: 'Mina',
        icon: 'fa-tent',
        color: '#ff6347',
        coord: { x: 65, y: 52 },
        latlng: [21.4113, 39.8938],
        type: 'location',
        desc: 'Kota tenda besar sekitar 5 km dari Makkah. Jemaah haji bermalam (mabit) di Mina pada malam 11, 12, 13 Dzulhijjah setelah wukuf. Di sini terdapat tiga jumrah: Sughra, Wustha, dan Kubra (Aqabah).',
        dalil: 'HR. Abu Dawud no. 1973: "Seluruh Mina adalah tempat menyembelih"',
        amalan: ['Mabit (bermalam) di Mina', 'Melempar Jumrah Aqabah (10 Dzulhijjah)', 'Melempar 3 Jumrah (11, 12, 13 Dzulhijjah)', 'Menyembelih hewan kurban/hadyu']
    },
    {
        id: 'arafah',
        name: 'Padang Arafah',
        icon: 'fa-mountain',
        color: '#9370db',
        coord: { x: 78, y: 60 },
        latlng: [21.3539, 39.9842],
        type: 'location',
        desc: 'Tempat paling agung dalam ibadah haji. Wukuf (berdiam) di Arafah pada 9 Dzulhijjah adalah rukun terpenting haji — siapa yang tidak wukuf, hajinya batal. "Al-hajju Arafah." Juga tempat bertemu Adam dan Hawa setelah turun dari surga.',
        dalil: 'HR. Tirmidzi no. 889: "Al-hajju Arafah (Haji itu intinya Arafah)"',
        amalan: ['Wukuf dari zawal hingga terbenam matahari', 'Banyak berdoa dan berdzikir', 'Membaca talbiyah', 'Menghadap kiblat saat berdoa', 'Dengarkan khutbah Arafah']
    },
    {
        id: 'muzdalifah',
        name: 'Muzdalifah',
        icon: 'fa-star',
        color: '#4682b4',
        coord: { x: 68, y: 57 },
        latlng: [21.3867, 39.9392],
        type: 'location',
        desc: 'Terletak antara Arafah dan Mina. Jemaah bermalam di sini setelah wukuf Arafah (wajib haji). Di sini jemaah mengumpulkan batu kerikil untuk melempar jumrah. Sholat Maghrib dan Isya dijama\' taqdim atau ta\'khir di sini.',
        dalil: 'HR. Muslim no. 1218; QS. Al-Baqarah: 198',
        amalan: ['Bermalam minimal setelah tengah malam', 'Kumpulkan 49 atau 70 kerikil', 'Sholat Subuh di awal waktu', 'Banyak berdzikir hingga terbit fajar']
    },
    {
        id: 'jabal_rahmah',
        name: 'Jabal Rahmah',
        icon: 'fa-hill-rockslide',
        color: '#daa520',
        coord: { x: 80, y: 58 },
        latlng: [21.3556, 39.9856],
        type: 'landmark',
        desc: 'Bukit di Arafah tempat Nabi ﷺ melaksanakan wukuf dan menyampaikan khutbah haji wada\'. Dinamakan "Bukit Kasih Sayang" karena di sinilah Allah menurunkan kasih sayang-Nya kepada jemaah haji. Wukuf boleh di mana saja di Arafah, tidak harus di atas bukit.',
        dalil: 'HR. Muslim no. 1218: "Aku wukuf di sini dan seluruh Arafah adalah tempat wukuf"',
        amalan: ['Memperbanyak doa dan dzikir', 'Bertaubat dan mohon ampun', 'Membaca Al-Quran']
    },
];

export const MANASIK_HAJI = [
    { hari: '8 Dzulhijjah', nama: 'Yaumut Tarwiyah', amalan: ['Berihram dari Makkah/miqat', 'Berangkat ke Mina', 'Mabit di Mina — sholat 5 waktu (diqashar, tidak dijama\')'], icon: 'fa-flag' },
    { hari: '9 Dzulhijjah', nama: 'Yaumul Arafah', amalan: ['Berangkat ke Arafah setelah matahari terbit', 'Wukuf di Arafah (RUKUN TERPENTING)', 'Sholat Dzuhur + Ashar dijama\' taqdim', 'Banyak berdoa hingga Maghrib', 'Berangkat ke Muzdalifah setelah Maghrib', 'Mabit di Muzdalifah — kumpulkan kerikil'], icon: 'fa-mountain' },
    { hari: '10 Dzulhijjah', nama: 'Yaumun Nahr (Idul Adha)', amalan: ['Melempar Jumrah Aqabah 7 kerikil', 'Menyembelih hewan hadyu (bagi tamattu\' & qiran)', 'Tahalul awal — cukur/potong rambut', 'Thawaf Ifadhah & Sa\'i (boleh ditunda)', 'Kembali ke Mina — mabit'], icon: 'fa-sun' },
    { hari: '11 Dzulhijjah', nama: 'Hari Tasyriq 1', amalan: ['Mabit di Mina', 'Melempar 3 Jumrah setelah zawal (Sughra → Wustha → Kubra, masing-masing 7 kerikil)', 'Sholat 5 waktu di Mina (diqashar)'], icon: 'fa-circle-dot' },
    { hari: '12 Dzulhijjah', nama: 'Hari Tasyriq 2 / Nafar Awal', amalan: ['Melempar 3 Jumrah setelah zawal', 'Boleh meninggalkan Mina sebelum Maghrib (Nafar Awal)', 'Atau bermalam lagi (Nafar Tsani — lebih utama)'], icon: 'fa-circle-dot' },
    { hari: '13 Dzulhijjah', nama: 'Hari Tasyriq 3 / Nafar Tsani', amalan: ['Bagi yang Nafar Tsani: melempar 3 Jumrah', 'Meninggalkan Mina', 'Thawaf Wada\' sebelum meninggalkan Makkah (wajib)'], icon: 'fa-flag-checkered' },
];

export const MANASIK_UMRAH = [
    { step: 1, nama: 'Ihram dari Miqat', desc: 'Mandi, pakai pakaian ihram (2 lembar putih untuk laki-laki), niat umrah, ucapkan talbiyah: "Labbaik Allahumma umrah"', icon: 'fa-tshirt' },
    { step: 2, nama: 'Talbiyah', desc: 'Baca talbiyah terus-menerus selama dalam ihram hingga melihat Ka\'bah: "Labbaikallahumma labbaik, labbaika lā syarīka laka labbaik, innal-hamda wan-ni\'mata laka wal-mulk, lā syarīka lak"', icon: 'fa-microphone' },
    { step: 3, nama: 'Thawaf', desc: 'Mengelilingi Ka\'bah 7 kali berlawanan arah jarum jam. Mulai dari Hajar Aswad, akhiri di Hajar Aswad. Berdoa sesuai kehendak. Usahakan menyentuh/mencium Hajar Aswad atau isyaratkan tangan.', icon: 'fa-rotate' },
    { step: 4, nama: 'Sa\'i', desc: 'Berjalan bolak-balik antara Shafa dan Marwah 7 kali. Dimulai dari Shafa dan diakhiri di Marwah. Naiki Shafa dan Marwah sambil menghadap Ka\'bah dan berdoa.', icon: 'fa-arrows-left-right' },
    { step: 5, nama: 'Tahalul', desc: 'Cukur atau potong rambut minimal 3 helai (sunnah mencukur habis untuk laki-laki). Dengan ini ihram umrah selesai dan semua larangan ihram menjadi halal kembali.', icon: 'fa-scissors' },
];

export const LARANGAN_IHRAM = [
    { larangan: 'Memotong rambut atau kuku', dalil: 'QS. Al-Baqarah: 196' },
    { larangan: 'Memakai wewangian (parfum)', dalil: 'HR. Bukhari-Muslim' },
    { larangan: 'Menutup kepala (bagi laki-laki)', dalil: 'HR. Bukhari no. 1838' },
    { larangan: 'Memakai pakaian berjahit (bagi laki-laki)', dalil: 'HR. Bukhari no. 1838' },
    { larangan: 'Menutup wajah (bagi perempuan)', dalil: 'HR. Bukhari no. 1838' },
    { larangan: 'Berburu atau membunuh hewan darat', dalil: 'QS. Al-Maidah: 95' },
    { larangan: 'Berhubungan badan (jima\')', dalil: 'QS. Al-Baqarah: 197' },
    { larangan: 'Menikah atau menikahkan', dalil: 'HR. Muslim no. 1409' },
    { larangan: 'Berlaku fasik, bertengkar, dan berkata kotor', dalil: 'QS. Al-Baqarah: 197' },
];
