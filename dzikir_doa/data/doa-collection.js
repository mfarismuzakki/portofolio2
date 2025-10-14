// Database Doa & Dzikir Harian
// Berdasarkan Hadist Shahih dan Amalan Ulama Salaf

const doaCollection = {
  dzikir_pagi: {
    title: "Dzikir Pagi", 
    icon: "🌅",
    description: "Dzikir yang dibaca setelah sholat Subuh hingga terbit matahari",
    timeRecommendation: "Setelah Subuh - Syuruq",
    doa: [
      {
        id: "pagi_001", 
        title: "Dzikir Pagi - Ayat Kursi (Dibaca 1x)",
        arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\n\nاللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُۥ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        latin: "A'ūdzu billāhi mina'sy-syaitāni'r-rajīm\n\nAllāhu lā ilāha illa huwal-hayyu'l-qayyūm, lā ta'khudzuhū sinatun wa lā nawm, lahū mā fis-samāwāti wa mā fil-ardh, man dzā'lladhī yasyfa'u 'indahū illā bi-idznih, ya'lamu mā bayna aydīhim wa mā khalfahum, wa lā yuhītūna bi-syay'in min 'ilmihī illā bimā syā', wasi'a kursiyyuhus-samāwāti wal-ardh, wa lā ya'ūduhū hifzhuhuma, wa huwal-'aliyyul-'azhīm",
        translation: "Aku berlindung kepada Allah dari godaan syaitan yang terkutuk. Allah, tidak ada sesembahan yang berhak disembah kecuali Dia Yang Hidup Kekal lagi terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Siapakah yang dapat memberi syafa'at di sisi Allah tanpa izin-Nya? Allah mengetahui apa-apa yang di hadapan dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi, dan Allah tidak merasa berat memelihara keduanya. Dan Allah Maha Tinggi lagi Maha Besar. (Al-Baqarah [2]: 255).",
        benefit: "Barangsiapa membaca kalimat ini ketika pagi hari, maka ia dijaga dari (ganguan) jin hingga sore hari. Dan barangsiapa mengucapkannya ketika sore hari, maka ia dijaga dari (ganguan) jin hingga pagi hari.",
        reference: "HR. An-Nasai dalam Amalul Yaum wal Lailah No. 100 dan Ibnus Sinni no. 121, dinyatakan shahih oleh Al-Albani dalam Shahih Al-Jami' 5/329 dan Silsilah Hadits Shahih, 2/697 no. 972",
        hadistText: "Dari Ubay bin Ka'ab radliallahu 'anhu, bahwa suatu ketika ada seorang jin yang mencuri kebun kurmanya. Jin itu beliau tangkap, untuk dilaporkan kepada Nabi shallallahu 'alaihi wa sallam. Jin itupun memelas agar dilepaskan. Sebagai gantinya, dia memberikan satu wirid kepada Ubay. Jin itu mengatakan: (dzikir di atas). Barangsiapa yang membacanya ketika sore maka dia akan dilindungi dari (gangguan) kami sampai pagi. Barangsiapa yang membacanya ketika pagi maka dia akan dilindungi dari (gangguan) kami sampai sore. Kemudian, Ubay mendatangi Nabi shallallahu 'alaihi wa sallam dan menceritakan kejadian yang dia jumpai. Nabi shallallahu 'alaihi wa sallam bersabda: 'Si makhluk jelek itu benar.' (maksud makhluk jelek adalah jin tersebut). (HR. An Nasa'i dan At Thabrani dan dishahihkan Al Albani).",
        repetition: 1,
        category: "ayat"
      },
      {
        id: "pagi_002",
        title: "Dzikir Pagi - Surat Al-Ikhlas (Dibaca 3x)",
        arabic: "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ\n\nقُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
        latin: "Bismillāhir-rahmānir-rahīm\n\nQul huwallāhu ahad, Allāhush-shamad, lam yalid wa lam yūlad, wa lam yakun lahū kufuwan ahad",
        translation: "Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang. (1) Katakanlah: Dia-lah Allah, Yang Maha Esa. (2) Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. (3) Dia tiada beranak dan tiada pula diperanakkan, (4) dan tidak ada seorang pun yang setara dengan Dia. (Al-Ikhlas [112]: 1-4).",
        benefit: "Barangsiapa membaca tiga surat tersebut (surat Al-Ikhlas, Al-Falaq dan An-Naas, ketiganya dinamakan Al-Mu'awwidzaat) sebanyak 3x setiap pagi dan sore hari, maka itu (tiga surat tersebut) cukup baginya dari segala sesuatu. (Yaitu melindunginya dari segala bentuk bahaya dengan izin Allah).",
        reference: "HR. Abu Dawud 2/86, An-Nasai 3/68. Lihat pula Shahih At-Tirmidzi 2/8",
        hadistText: "Ketiga surat (surat Al-Ikhlas, Al-Falaq dan An-Naas) dinamakan Al-Mu'awwidzaat, lihat pula Fathul Baari 9/62.",
        repetition: 3,
        category: "surat"
      },
      {
        id: "pagi_003",
        title: "Dzikir Pagi - Surat Al-Falaq (Dibaca 3x)",
        arabic: "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ\n\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّـٰثَـٰتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        latin: "Bismillāhir-rahmānir-rahīm\n\nQul a'ūdzu bi rabbil-falaq, min syarri mā khalaq, wa min syarri ghāsiqin idzā waqab, wa min syarrin-naffātsāti fil-'uqad, wa min syarri hāsidin idzā hasad",
        translation: "Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang. (1) Katakanlah: Aku berlindung kepada Rabb yang menguasai Subuh. (2) Dari kejahatan makhluk-Nya. (3) Dan dari kejahatan malam apabila telah gelap gulita. (4) Dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul. (5) Dan dari kejahatan orang yang dengki apabila ia dengki. (Al-Falaq [113]: 1-5).",
        benefit: "Barangsiapa membaca tiga surat tersebut (surat Al-Ikhlas, Al-Falaq dan An-Naas, ketiganya dinamakan Al-Mu'awwidzaat) sebanyak 3x setiap pagi dan sore hari, maka itu (tiga surat tersebut) cukup baginya dari segala sesuatu. (Yaitu melindunginya dari segala bentuk bahaya dengan izin Allah).",
        reference: "HR. Abu Dawud 2/86, An-Nasai 3/68. Lihat pula Shahih At-Tirmidzi 2/8",
        hadistText: "Ketiga surat (surat Al-Ikhlas, Al-Falaq dan An-Naas) dinamakan Al-Mu'awwidzaat, lihat pula Fathul Baari 9/62.",
        repetition: 3,
        category: "surat"
      },
      {
        id: "pagi_004",
        title: "Dzikir Pagi - Surat An-Naas (Dibaca 3x)",
        arabic: "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ\n\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَـٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
        latin: "Bismillāhir-rahmānir-rahīm\n\nQul a'ūdzu bi rabbin-nās, malikin-nās, ilāhin-nās, min syarril-waswāsil-khannās, alladhī yuwaswisu fī sudūrin-nās, minal-jinnati wan-nās",
        translation: "Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang. (1) Katakanlah: Aku berlindung kepada Rabb manusia. (2) Raja manusia. (3) Sembahan manusia. (4) Dari kejahatan (bisikan) syaitan yang biasa bersembunyi. (5) Yang membisikkan (kejahatan) ke dalam dada manusia. (6) Dari jin dan manusia. (An-Nas [114]: 1-6).",
        benefit: "Barangsiapa membaca tiga surat tersebut (surat Al-Ikhlas, Al-Falaq dan An-Naas, ketiganya dinamakan Al-Mu'awwidzaat) sebanyak 3x setiap pagi dan sore hari, maka itu (tiga surat tersebut) cukup baginya dari segala sesuatu. (Yaitu melindunginya dari segala bentuk bahaya dengan izin Allah).",
        reference: "HR. Abu Dawud 2/86, An-Nasai 3/68. Lihat pula Shahih At-Tirmidzi 2/8",
        hadistText: "Ketiga surat (surat Al-Ikhlas, Al-Falaq dan An-Naas) dinamakan Al-Mu'awwidzaat, lihat pula Fathul Baari 9/62.",
        repetition: 3,
        category: "surat"
      },
      {
        id: "pagi_005",
        title: "Dzikir Pagi Ke-1 (Dibaca 1x)",
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَـٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَـٰذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِن شَرِّ مَا فِي هَـٰذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
        latin: "Ash-bahnā wa ash-bahal-mulku lillāh, wal-hamdulillāh, lā ilāha illallāh wahdahū lā syarīka lah, lahul-mulku wa lahul-hamd wa huwa 'alā kulli syay'in qadīr. Rabbi as'aluka khayra mā fī hādzal-yaumi wa khayra mā ba'dah, wa a'ūdzu bika min syarri mā fī hādzal-yaumi wa syarri mā ba'dah, rabbi a'ūdzu bika minal-kasali wa sū'il-kibar, rabbi a'ūdzu bika min 'adzābin fin-nāri wa 'adzābin fil-qabr",
        translation: "Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada sesembahan yang berhak disembah kecuali Allah, Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya pujian. Dan Dia Maha Kuasa atas segala sesuatu. Hai Tuhan, aku mohon kepada-Mu kebaikan di hari ini dan kebaikan sesudahnya. Aku berlindung kepadaMu dari kejahatan hari ini dan kejahatan sesudahnya. Wahai Tuhan, aku berlindung kepadaMu dari kemalasan dan kejelekan di hari tua. Wahai Tuhan, aku berlindung kepadaMu dari siksaan di Neraka dan kubur.",
        benefit: "Doa ini menunjukkan sikap ketundukan seorang muslim kepada Allah. Dia mengawali paginya dengan ikrar dan berbagai pengakuan tentang keabadian kerajaan Allah, memuji Allah, berikrar tentang lā ilāha illallāh, kemudian berdoa memohon kebaikan dan berlindung dari segala keburukan.",
        reference: "HR. Muslim 4/2088",
        hadistText: "Dari Ibnu Mas'ud radhiyallahu 'anhu, bahwa Nabi shallallahu 'alaihi wa sallam ketika pagi membaca doa di atas.",
        repetition: 1,
        category: "doa"
      },
      {
        id: "pagi_006",
        title: "Dzikir Pagi Ke-2 (Dibaca 1x)",
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        latin: "Allāhumma bika ash-bahnā, wa bika amsaynā, wa bika nahyā, wa bika namūtu, wa ilaykan-nusyūr",
        translation: "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu sore. Dengan rahmat dan pertolongan-Mu kami hidup dan dengan kehendak-Mu kami mati. Dan kepada-Mu kebangkitan (bagi semua makhluk).",
        benefit: "Doa ini menunjukkan betapa orang yang membacanya adalah orang yang sangat pasrah kepada Allah. Dia mengakui bahwa dirinya mampu hidup di hari itu, semata karena nikmat dari Allah ta'ala. Dia senantiasa dalam kondisi mengakui hal itu selama hidup dan matinya.",
        reference: "HR. At-Tirmidzi 3391 dan dishahihkan Al-Albani",
        hadistText: "Dari Abu Hurairah radhiyallahu 'anhu, beliau berkata: Ketika masuk waktu pagi, Nabi shallallahu 'alaihi wa sallam biasa membaca dzikir pagi dan ketika sore beliau membaca dzikir sore.",
        repetition: 1,
        category: "doa"
      },
      {
        id: "pagi_007",
        title: "Dzikir Pagi Ke-3 (Dibaca 1x) - Sayyidul Istighfar",
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي، لَا إِلَـٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي، وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِن شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        latin: "Allāhumma anta rabbī, lā ilāha illā anta, khalaqtanī, wa anā 'abduka, wa anā 'alā 'ahdika wa wa'dika mas-tatha'tu, a'ūdzu bika min syarri mā shana'tu, abū'u laka bi-ni'matika 'alayya, wa abū'u bi-dzanbī, fa-ghfir lī, fa-innahū lā yaghfirudz-dzunūba illā anta",
        translation: "Ya Allah, Engkau adalah Tuhanku, tidak ada sesembahan yang berhak disembah kecuali Engkau, Engkaulah yang menciptakan aku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku dengan-Mu semampuku. Aku berlindung kepada-Mu dari kejelekan yang kuperbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku, oleh karena itu, ampunilah aku. Sesungguhnya tiada yang mengampuni dosa kecuali Engkau.",
        benefit: "Barangsiapa yang membaca doa ini dengan penuh keyakinan di sore hari, kemudian dia mati pada malam harinya (sebelum pagi) maka dia termasuk ahli surga. Dan barangsiapa yang membacanya dengan penuh keyakinan di pagi hari, kemudian dia mati pada siang harinya (sebelum sore) maka dia termasuk ahli surga.",
        reference: "HR. Al-Bukhari no. 5522, 6306 dan 6323, At-Tirmidzi no. 3393, An-Nasa'i no. 5522",
        hadistText: "Dari Syaddad bin Aus radhiyallahu 'anhu bahwa Nabi shallallahu 'alaihi wa sallam bersabda: 'Sayyidul Istighfar adalah bacaan: (doa di atas).' Dinamakan Sayyidul Istighfar, karena bacaan istighfar di atas adalah lafal istighfar yang paling mulia dibandingkan lafal istighfar lainnya.",
        repetition: 1,
        category: "istighfar"
      },
      {
        id: "pagi_008",
        title: "Dzikir Pagi Ke-4 (Dibaca 3x)",
        arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَٰهَ إِلَّا أَنتَ",
        latin: "Allāhumma 'āfinī fī badanī, Allāhumma 'āfinī fī sam'ī, Allāhumma 'āfinī fī basharī, lā ilāha illā anta. Allāhumma innī a'ūdzu bika minal-kufri wal-faqr, wa a'ūdzu bika min 'adzābil-qabri, lā ilāha illā anta",
        translation: "Ya Allah, berilah kesehatan pada badanku. Ya Allah, berilah kesehatan pada pendengaranku. Ya Allah, berilah kesehatan pada penglihatanku. Tidak ada Tuhan selain Engkau. Ya Allah, sesungguhnya aku berlindung kepada-Mu dari kekafiran dan kefakiran. Dan aku berlindung kepada-Mu dari siksaan kubur. Tidak ada Tuhan selain Engkau.",
        benefit: "Doa untuk memohon kesehatan jasmani dan rohani serta perlindungan dari berbagai marabahaya dunia dan akhirat.",
        reference: "HR. Abu Dawud no. 5090, dishahihkan Al-Albani",
        hadistText: "Dari 'Abdullah bin Khubaib radhiyallahu 'anhu berkata: Rasulullah shallallahu 'alaihi wasallam bersabda kepadaku: 'Bacalah!' Aku berkata: 'Apa yang harus kubaca?' Beliau bersabda: 'Bacalah Qul Huwa Allahu Ahad dan Mu'awwidzatain (Surat Al-Falaq dan An-Naas) di sore dan pagi hari masing-masing tiga kali, niscaya akan mencukupimu dari segala sesuatu.'",
        repetition: 3,
        category: "doa"
      },
      {
        id: "pagi_009",
        title: "Dzikir Pagi Ke-5 (Dibaca 3x)",
        arabic: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالأَرْضِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلٰهَ إِلاَّ أَنْتَ، أَعُوذُ بِكَ مِن شَرِّ نَفْسِي وَمِن شَرِّ الشَّيْطَان وَشِرْكِهِ",
        latin: "Allāhumma 'ālimal-ghaybi wasy-syahādati fāthiras-samāwāti wal-ardhi, rabba kulli syay'in wa malīkah, asyhadu an lā ilāha illā anta, a'ūdzu bika min syarri nafsī wa min syarrisy-syaythāni wa syirkih",
        translation: "Ya Allah yang mengetahui yang ghaib dan yang nyata, Pencipta langit dan bumi, Tuhan segala sesuatu dan Raja-Nya. Aku bersaksi bahwa tidak ada Tuhan selain Engkau. Aku berlindung kepada-Mu dari kejahatan diriku, dari kejahatan syaitan dan balatentaranya (syirik).",
        benefit: "Barangsiapa yang mengucapkan doa ini ketika pagi hari, maka dia akan dilindungi dari hal-hal yang tidak diinginkan sampai sore. Dan barangsiapa mengucapkannya ketika sore hari, maka akan dilindungi sampai pagi hari.",
        reference: "HR. Abu Dawud no. 5067, At-Tirmidzi no. 3392, dishahihkan Al-Albani",
        hadistText: "Dari Abu Hurairah radhiyallahu 'anhu bahwa Abu Bakar Ash-Shiddiq radhiyallahu 'anhu berkata: Ya Rasulullah, ajarkanlah kepadaku doa yang akan aku baca di pagi dan sore hari. Beliau bersabda: 'Katakanlah: (doa di atas) di pagi dan sore hari.'",
        repetition: 3,
        category: "doa"
      },
      {
        id: "pagi_010",
        title: "Dzikir Pagi Ke-6 (Dibaca 3x)",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِيْنِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ استُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِن بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَن شِمَالِي وَمِن فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِن تَحْتِي",
        latin: "Allāhumma innī as'aluka-l'afwa wal-'āfiyata fid-dunyā wal-ākhirah. Allāhumma innī as'aluka-l'afwa wal-'āfiyata fī dīnī wa dunyāya wa ahlī wa mālī. Allāhumma-stur 'awrātī wa āmin raw'ātī. Allāhumma-hfazhnī min bayni yadayya wa min khalfī wa 'an yamīnī wa 'an syimālī wa min fawqī, wa a'ūdzu bi'azhamatika an ughtāla min tahtī",
        translation: "Ya Allah, sesungguhnya aku memohon kepada-Mu ampunan dan afiat di dunia dan akhirat. Ya Allah, sesungguhnya aku memohon kepada-Mu ampunan dan afiat dalam agama, dunia, keluarga dan hartaku. Ya Allah, tutupilah auratku (aib dan sesuatu yang tidak layak dilihat orang) dan tenangkanlah aku dari rasa takut. Ya Allah, peliharalah aku dari muka, belakang, kanan, kiri dan atasku. Aku berlindung dengan kebesaran-Mu, agar aku tidak disambar dari bawahku (agar tidak karam, tidak ditimpa gempa, dan lain-lain yang membuat aku jatuh).",
        benefit: "Doa yang sangat komprehensif memohon afiat dalam segala hal dan perlindungan Allah dari segala arah.",
        reference: "HR. Abu Dawud no. 5074, Ibnu Majah no. 3871, dishahihkan Al-Albani",
        hadistText: "Dari Abdullah bin Umar radhiyallahu 'anhuma berkata: Rasulullah shallallahu 'alaihi wasallam tidak pernah meninggalkan doa-doa ini ketika pagi dan petang. (Doa di atas)",
        repetition: 3,
        category: "doa"
      },
      {
        id: "pagi_011",
        title: "Dzikir Pagi Ke-7 (Dibaca 3x)",
        arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        latin: "Bismillāhil-ladhī lā yadhurru ma'as-mihī syay'un fil-ardhi wa lā fis-samā'i wa huwas-samī'ul-'alīm",
        translation: "Dengan nama Allah yang tidak ada sesuatu pun yang dapat membahayakan bersama nama-Nya, baik di bumi maupun di langit. Dan Dia Maha Mendengar lagi Maha Mengetahui.",
        benefit: "Barangsiapa mengucapkan doa ini 3 kali di pagi hari, tidak akan mendapat mudarat (kecelakaan) secara tiba-tiba hingga sore hari. Dan barangsiapa mengucapkan 3 kali di sore hari, tidak akan mendapat mudarat secara tiba-tiba hingga pagi hari.",
        reference: "HR. Abu Dawud no. 5088, At-Tirmidzi no. 3388, dishahihkan Al-Albani",
        hadistText: "Dari Utsman bin Affan radhiyallahu 'anhu berkata: Rasulullah shallallahu 'alaihi wasallam bersabda: 'Tidaklah seorang hamba yang mengucapkan (doa di atas) ketika pagi hari, melainkan tidak akan membahayakan sesuatu apapun hingga sore hari. Dan tidaklah dia mengucapkannya ketika sore hari, melainkan tidak akan membahayakan sesuatu apapun hingga pagi hari.'",
        repetition: 3,
        category: "doa"
      },
      {
        id: "pagi_012",
        title: "Dzikir Pagi Ke-8 (Dibaca 3x)",
        arabic: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ رَسُولًا",
        latin: "Radhītu billāhi rabban, wa bil-islāmi dīnan, wa bi muhammadin shallallāhu 'alayhi wa sallama rasūlan",
        translation: "Aku ridha Allah sebagai Tuhanku, Islam sebagai agamaku, dan Muhammad shallallahu 'alaihi wasallam sebagai utusan-Nya.",
        benefit: "Barangsiapa yang mengucapkan doa ini 3 kali ketika pagi hari dan 3 kali ketika petang hari, Allah akan meridhainya pada hari kiamat.",
        reference: "HR. Abu Dawud no. 5072, At-Tirmidzi no. 3389, dishahihkan Al-Albani",
        hadistText: "Dari Abu Sa'id Al-Khudri radhiyallahu 'anhu berkata: Rasulullah shallallahu 'alaihi wasallam bersabda: 'Barangsiapa berkata ketika pagi: Radhītu billāhi rabban wa bil islāmi dīnan wa bi muhammadin rasūlan, maka aku akan menjadi penjaminnya untuk masuk surga.'",
        repetition: 3,
        category: "doa"
      },
      {
        id: "pagi_013",
        title: "Dzikir Pagi Ke-9 (Dibaca 4x)",
        arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
        latin: "Allāhumma innī ashbahtu usyhiduka wa usyhidu hamalata 'arsyika wa malā'ikataka wa jamī'a khalqika, annaka antal-lāhu lā ilāha illā anta wahdaka lā syarīka laka, wa anna muhammadan 'abduka wa rasūluk",
        translation: "Ya Allah, di pagi hari ini aku bersaksi kepada-Mu, aku bersaksi kepada para pemikulArsy-Mu, malaikat-malaikat-Mu, dan seluruh makhluk-Mu, bahwa Engkau adalah Allah, tidak ada Tuhan selain Engkau, Yang Maha Esa, tidak ada sekutu bagi-Mu, dan bahwa Muhammad adalah hamba-Mu dan utusan-Mu.",
        benefit: "Barangsiapa yang mengucapkan doa ini 4 kali di pagi hari, Allah akan membebaskannya dari api neraka.",
        reference: "HR. Abu Dawud no. 5077, dishahihkan Al-Albani",
        hadistText: "Dari Anas bin Malik radhiyallahu 'anhu berkata: Rasulullah shallallahu 'alaihi wasallam bersabda: 'Barangsiapa berkata ketika pagi: Allāhumma innī ashbahtu usyhiduka... 1 kali, Allah akan memerdekakan seperempat tubuhnya dari neraka. Jika 2 kali, Allah akan memerdekakan separuh tubuhnya. Jika 3 kali, Allah akan memerdekakan tiga perempatnya. Jika 4 kali, Allah akan memerdekakan seluruh tubuhnya dari neraka.'",
        repetition: 4,
        category: "syahadat"
      },
      {
        id: "pagi_014",
        title: "Dzikir Pagi Ke-10 (Dibaca 100x)",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        latin: "Subhānallāhi wa bihamdih",
        translation: "Maha Suci Allah dan segala puji bagi-Nya.",
        benefit: "Barangsiapa yang mengucapkan kalimat ini 100 kali ketika pagi dan petang hari, tidak ada yang datang pada hari kiamat dengan amalan yang lebih baik dari amalannya kecuali orang yang mengucapkan seperti ucapannya atau lebih dari itu.",
        reference: "HR. Muslim no. 2692",
        hadistText: "Dari Abu Hurairah radhiyallahu 'anhu, Rasulullah shallallahu 'alaihi wasallam bersabda: 'Barangsiapa yang mengucapkan: Subhānallāhi wa bihamdih, dalam sehari 100 kali, dosanya akan diampuni meskipun sebanyak buih di lautan.'",
        repetition: 100,
        category: "dzikir"
      },
      {
        id: "pagi_015",
        title: "Dzikir Pagi Ke-11 (Dibaca 100x)",
        arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        latin: "Lā ilāha illallāhu wahdahu lā syarīka lah, lahul-mulku wa lahul-hamdu wa huwa 'alā kulli syay'in qadīr",
        translation: "Tidak ada Tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya pujian. Dan Dia Maha Kuasa atas segala sesuatu.",
        benefit: "Barangsiapa yang mengucapkan kalimat ini 100 kali sehari, baginya kebaikan seperti memerdekakan 10 orang budak, ditulis baginya 100 kebaikan, dihapus darinya 100 kejelekan dan menjadi perlindungan baginya dari setan pada hari itu hingga sore.",
        reference: "HR. Al-Bukhari no. 3293, Muslim no. 2691",
        hadistText: "Dari Abu Hurairah radhiyallahu 'anhu, Rasulullah shallallahu 'alaihi wasallam bersabda: 'Barangsiapa yang mengucapkan: Lā ilāha illallāhu wahdahu lā syarīka lah... dalam sehari 100 kali, maka baginya ganjaran seperti memerdekakan 10 budak, dicatat baginya 100 kebaikan, dihapus darinya 100 kesalahan, dan ucapan itu menjadi penjaganya dari setan selama hari itu hingga petang.'",
        repetition: 100,
        category: "dzikir"
      }
    ]
  },

  dzikir_petang: {
    title: "Dzikir Sore",
    icon: "🌇",
    description: "Dzikir yang dibaca setelah sholat Ashar hingga Maghrib",
    timeRecommendation: "Setelah Ashar - Maghrib", 
    doa: [
      {
        id: "sore_001", 
        title: "Dzikir Sore - Ayat Kursi (Dibaca 1x)",
        arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\n\nاللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُۥ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        latin: "A'ūdzu billāhi mina'sy-syaitāni'r-rajīm\n\nAllāhu lā ilāha illa huwal-hayyu'l-qayyūm, lā ta'khudzuhū sinatun wa lā nawm, lahū mā fis-samāwāti wa mā fil-ardh, man dzā'lladhī yasyfa'u 'indahū illā bi-idznih, ya'lamu mā bayna aydīhim wa mā khalfahum, wa lā yuhītūna bi-syay'in min 'ilmihī illā bimā syā', wasi'a kursiyyuhus-samāwāti wal-ardh, wa lā ya'ūduhū hifzhuhuma, wa huwal-'aliyyul-'azhīm",
        translation: "Aku berlindung kepada Allah dari godaan syaitan yang terkutuk. Allah, tidak ada sesembahan yang berhak disembah kecuali Dia Yang Hidup Kekal lagi terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Siapakah yang dapat memberi syafa'at di sisi Allah tanpa izin-Nya? Allah mengetahui apa-apa yang di hadapan dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi, dan Allah tidak merasa berat memelihara keduanya. Dan Allah Maha Tinggi lagi Maha Besar. (Al-Baqarah [2]: 255).",
        benefit: "Barangsiapa membaca kalimat ini ketika pagi hari, maka ia dijaga dari (ganguan) jin hingga sore hari. Dan barangsiapa mengucapkannya ketika sore hari, maka ia dijaga dari (ganguan) jin hingga pagi hari.",
        reference: "HR. An-Nasai dalam Amalul Yaum wal Lailah No. 100 dan Ibnus Sinni no. 121, dinyatakan shahih oleh Al-Albani dalam Shahih Al-Jami' 5/329 dan Silsilah Hadits Shahih, 2/697 no. 972",
        hadistText: "Dari Ubay bin Ka'ab radliallahu 'anhu, bahwa suatu ketika ada seorang jin yang mencuri kebun kurmanya. Jin itu beliau tangkap, untuk dilaporkan kepada Nabi shallallahu 'alaihi wa sallam. Jin itupun memelas agar dilepaskan. Sebagai gantinya, dia memberikan satu wirid kepada Ubay. Jin itu mengatakan: (dzikir di atas). Barangsiapa yang membacanya ketika sore maka dia akan dilindungi dari (gangguan) kami sampai pagi. Barangsiapa yang membacanya ketika pagi maka dia akan dilindungi dari (gangguan) kami sampai sore. Kemudian, Ubay mendatangi Nabi shallallahu 'alaihi wa sallam dan menceritakan kejadian yang dia jumpai. Nabi shallallahu 'alaihi wa sallam bersabda: 'Si makhluk jelek itu benar.' (maksud makhluk jelek adalah jin tersebut). (HR. An Nasa'i dan At Thabrani dan dishahihkan Al Albani).",
        repetition: 1,
        category: "ayat"
      },
      {
        id: "sore_002",
        title: "Dzikir Sore - Surat Al-Ikhlas (Dibaca 3x)",
        arabic: "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ\n\nقُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
        latin: "Bismillāhir-rahmānir-rahīm\n\nQul huwallāhu ahad, Allāhush-shamad, lam yalid wa lam yūlad, wa lam yakun lahū kufuwan ahad",
        translation: "Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang. (1) Katakanlah: Dia-lah Allah, Yang Maha Esa. (2) Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. (3) Dia tiada beranak dan tiada pula diperanakkan, (4) dan tidak ada seorang pun yang setara dengan Dia. (Al-Ikhlas [112]: 1-4).",
        benefit: "Barangsiapa membaca tiga surat tersebut (surat Al-Ikhlas, Al-Falaq dan An-Naas, ketiganya dinamakan Al-Mu'awwidzaat) sebanyak 3x setiap pagi dan sore hari, maka itu (tiga surat tersebut) cukup baginya dari segala sesuatu. (Yaitu melindunginya dari segala bentuk bahaya dengan izin Allah).",
        reference: "HR. Abu Dawud 2/86, An-Nasai 3/68. Lihat pula Shahih At-Tirmidzi 2/8",
        hadistText: "Ketiga surat (surat Al-Ikhlas, Al-Falaq dan An-Naas) dinamakan Al-Mu'awwidzaat, lihat pula Fathul Baari 9/62.",
        repetition: 3,
        category: "surat"
      },
      {
        id: "sore_003",
        title: "Dzikir Sore - Surat Al-Falaq (Dibaca 3x)",
        arabic: "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ\n\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّـٰثَـٰتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        latin: "Bismillāhir-rahmānir-rahīm\n\nQul a'ūdzu bi rabbil-falaq, min syarri mā khalaq, wa min syarri ghāsiqin idzā waqab, wa min syarrin-naffātsāti fil-'uqad, wa min syarri hāsidin idzā hasad",
        translation: "Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang. (1) Katakanlah: Aku berlindung kepada Rabb yang menguasai Subuh. (2) Dari kejahatan makhluk-Nya. (3) Dan dari kejahatan malam apabila telah gelap gulita. (4) Dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul. (5) Dan dari kejahatan orang yang dengki apabila ia dengki. (Al-Falaq [113]: 1-5).",
        benefit: "Barangsiapa membaca tiga surat tersebut (surat Al-Ikhlas, Al-Falaq dan An-Naas, ketiganya dinamakan Al-Mu'awwidzaat) sebanyak 3x setiap pagi dan sore hari, maka itu (tiga surat tersebut) cukup baginya dari segala sesuatu. (Yaitu melindunginya dari segala bentuk bahaya dengan izin Allah).",
        reference: "HR. Abu Dawud 2/86, An-Nasai 3/68. Lihat pula Shahih At-Tirmidzi 2/8",
        hadistText: "Ketiga surat (surat Al-Ikhlas, Al-Falaq dan An-Naas) dinamakan Al-Mu'awwidzaat, lihat pula Fathul Baari 9/62.",
        repetition: 3,
        category: "surat"
      },
      {
        id: "sore_004",
        title: "Dzikir Sore - Surat An-Naas (Dibaca 3x)",
        arabic: "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ\n\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَـٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
        latin: "Bismillāhir-rahmānir-rahīm\n\nQul a'ūdzu bi rabbin-nās, malikin-nās, ilāhin-nās, min syarril-waswāsil-khannās, alladhī yuwaswisu fī sudūrin-nās, minal-jinnati wan-nās",
        translation: "Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang. (1) Katakanlah: Aku berlindung kepada Rabb (yang memelihara dan menguasai) manusia. (2) Raja manusia. (3) Sesembahan manusia. (4) Dari kejahatan (bisikan) syaitan yang biasa bersembunyi, (5) yang membisikkan (kejahatan) ke dalam dada manusia, (6) dari (golongan) jin dan manusia. (An-Naas [114]: 1-6).",
        benefit: "Barangsiapa membaca tiga surat tersebut (surat Al-Ikhlas, Al-Falaq dan An-Naas, ketiganya dinamakan Al-Mu'awwidzaat) sebanyak 3x setiap pagi dan sore hari, maka itu (tiga surat tersebut) cukup baginya dari segala sesuatu. (Yaitu melindunginya dari segala bentuk bahaya dengan izin Allah).",
        reference: "HR. Abu Dawud 2/86, An-Nasai 3/68. Lihat pula Shahih At-Tirmidzi 2/8",
        hadistText: "Ketiga surat (surat Al-Ikhlas, Al-Falaq dan An-Naas) dinamakan Al-Mu'awwidzaat, lihat pula Fathul Baari 9/62.",
        repetition: 3,
        category: "surat"
      },
      {
        id: "sore_005",
        title: "Dzikir Sore Ke-1 (Dibaca 1x)",
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَـٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَاذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَاذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
        latin: "Amsainā wa amsal mulku lillāh, walhamdulillāh, lā ilāha illallāh wahdahū lā syarīka lah, lahul mulku wa lahul hamdu, wa huwa 'alā kulli syai'in qadīr. Rabbi as'aluka khaira mā fī hādzihil lailati wa khaira mā ba'dahā, wa a'ūdzu bika min syarri mā fī hādzihil lailati wa syarri mā ba'dahā, rabbi a'ūdzu bika minal kasali wa sū'il kibar, rabbi a'ūdzu bika min 'adzābin fin nāri wa 'adzābin fil qabr",
        translation: "Kami telah memasuki waktu sore dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada sesembahan yang berhak disembah kecuali Allah, Yang Maha Esa, tiada sekutu bagiNya. Bagi-Nya kerajaan dan bagiNya pujian. Dia-lah Yang Mahakuasa atas segala sesuatu. Hai Tuhan, aku mohon kepada-Mu kebaikan di malam ini dan kebaikan sesudahnya. Aku berlindung kepadaMu dari kejahatan malam ini dan kejahatan sesudahnya. Wahai Tuhan, aku berlindung kepadaMu dari kemalasan dan kejelekan di hari tua. Wahai Tuhan, aku berlindung kepadaMu dari siksaan di Neraka dan kubur.",
        benefit: "Doa ini menunjukkan sikap ketundukan seorang muslim kepada Allah dengan pengakuan kerajaan Allah, memuji Allah, dan berlindung dari berbagai keburukan.",
        reference: "HR. Muslim 4/2088",
        hadistText: "Dari Ibnu Mas'ud radliallahu 'anhu, bahwa Nabi shallallahu 'alaihi wa sallam ketika sore membaca doa di atas.",
        repetition: 1,
        category: "doa"
      },
      {
        id: "sore_006",
        title: "Dzikir Sore Ke-2 (Dibaca 1x)",
        arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
        latin: "Allāhumma bika amsainā, wa bika aṣbaḥnā, wa bika naḥyā, wa bika namūtu, wa ilaikal maṣīr",
        translation: "Ya Allah, dengan rahmat dan pertolonganMu kami memasuki waktu sore, dan dengan rahmat dan pertolonganMu kami memasuki waktu pagi. Dengan rahmat dan pertolonganMu kami hidup dan dengan kehendakMu kami mati. Dan kepadaMu tempat kembali (bagi semua makhluk).",
        benefit: "Doa ini menunjukkan kepasrahan total kepada Allah, mengakui bahwa segala kehidupan semata karena nikmat dari Allah.",
        reference: "HR. At-Tirmidzi 3391 dan dishahihkan Al-Albani",
        hadistText: "Dari Abu Hurairah radliallahu 'anhu, beliau berkata: Ketika masuk waktu pagi, Nabi shallallahu 'alaihi wa sallam biasa membaca dzikir pagi dan ketika sore beliau membaca dzikir sore.",
        repetition: 1,
        category: "doa"
      },
      {
        id: "sore_007",
        title: "Dzikir Sore Ke-3 - Sayyidul Istighfar (Dibaca 1x)",
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
        latin: "Allāhumma anta rabbī lā ilāha illa ant, khalaqtanī wa ana 'abduk, wa ana 'alā 'ahdika wa wa'dika ma'stata't, a'ūdzu bika min syarri mā sana't, abū'u laka bi ni'matika 'alayya wa abū'u bi dzanbī, fa'ghfir lī fa innahū lā yaghfiru'dz-dzunūba illā ant",
        translation: "Ya Allah, Engkau adalah Rabbku, tidak ada Tuhan selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu. Aku berada dalam perjanjian dan janji-Mu semampuku. Aku berlindung kepada-Mu dari kejahatan apa yang telah aku perbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku. Maka ampunilah aku, karena sesungguhnya tidak ada yang dapat mengampuni dosa kecuali Engkau",
        benefit: "Barangsiapa mengucapkannya di petang hari dengan penuh keyakinan lalu meninggal pada malam hari, maka dia termasuk penghuni surga",
        reference: "HR. Al-Bukhari no. 6306",
        repetition: 1,
        category: "doa"
      },
      {
        id: "sore_008",
        title: "Dzikir Sore Ke-4 - Doa Afiyah (Dibaca 3x)",
        arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَـٰهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَـٰهَ إِلَّا أَنْتَ",
        latin: "Allāhumma 'āfinī fī badanī, allāhumma 'āfinī fī sam'ī, allāhumma 'āfinī fī baṣarī, lā ilāha illā ant. Allāhumma innī a'ūdzu bika minal kufri walfaqr, wa a'ūdzu bika min 'adzābil qabr, lā ilāha illā ant",
        translation: "Ya Allah, selamatkan tubuhku (dari penyakit dan yang tidak aku inginkan). Ya Allah, selamatkan pendengaranku (dari penyakit dan maksiat atau sesuatu yang tidak aku inginkan). Ya Allah, selamatkan penglihatanku, tidak ada sesembahan yang berhak disembah kecuali Engkau. Ya Allah, sesungguhnya aku berlindung kepadaMu dari kekufuran dan kefakiran. Aku berlindung kepadaMu dari siksa kubur, tidak ada sesembahan yang berhak disembah kecuali Engkau.",
        benefit: "Meminta perlindungan untuk badan, pendengaran, dan penglihatan, serta berlindung dari kufur, fakir, dan siksa kubur.",
        reference: "HR. Abu Dawud 4/324, Ahmad 5/42, An-Nasai dalam 'Amalul Yaum wal Lailah no. 22, halaman 146, Ibnus Sunni no. 69. Al-Bukhari dalam Al-Adabul Mufrad. Syaikh Abdul Aziz bin Baaz menyatakan sanad hadits tersebut hasan.",
        hadistText: "Dari Abdurrahman bin Abi Bakrah, bahwa dia bertanya kepada bapaknya: Wahai ayahku, aku selalu mendengar engkau membaca dzikir ini, dan engkau mengulanginya 3x setiap pagi dan 3x setiap sore. Kemudian Abu Bakrah radliallahu 'anhu mengatakan: Aku mendengar Rasulullah shallallahu 'alaihi wa sallam membaca doa ini, dan aku senang meniru sunnah beliau.",
        repetition: 3,
        category: "perlindungan"
      },
      {
        id: "sore_009",
        title: "Bismillahilladzi la Yadurru",
        arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        latin: "Bismillāhi'lladhī lā yadurru ma'a'smihī syay'un fi'l-ardhi wa lā fi's-samā'i wa huwa's-samī'u'l-'alīm",
        translation: "Dengan nama Allah yang dengan nama-Nya tidak akan membahayakan sesuatu pun di bumi dan tidak pula di langit. Dan Dia Maha Mendengar, Maha Mengetahui",
        benefit: "Barangsiapa mengucapkannya 3 kali di sore hari, tidak akan ditimpa bahaya secara tiba-tiba hingga pagi",
        reference: "HR. Abu Dawud no. 5088, At-Tirmidzi no. 3388",
        repetition: 3,
        category: "perlindungan"
      },
      {
        id: "sore_010",
        title: "Dzikir Sore Ke-5 - Riza Allah sebagai Tuhan (Dibaca 3x)",
        arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ صلى الله عليه وسلم رَسُولاً",
        latin: "Radlītu billāhi rabban, wa bil-islāmi dīnan, wa bi muhammadin rasūlan",
        translation: "Aku rida Allah sebagai Tuhanku, Islam sebagai agamaku, dan Muhammad shallallahu 'alaihi wa sallam sebagai utusan-Ku.",
        benefit: "Wajib bagi Allah untuk membahagiakan orang yang mengucapkannya tiga kali di waktu sore.",
        reference: "HR. Abu Dawud 4/318. At-Tirmidzi 5/465. Ahmad 4/337. Dishahihkan oleh Syaikh Al-Albani dalam Shahih At-Tirmidzi 3/155.",
        hadistText: "Barangsiapa yang berkata 'Radlītu billāhi rabban, wa bil-islāmi dīnan, wa bi muhammadin rasūlan' tiga kali setiap pagi, maka wajib bagi Allah untuk membahagiakan dia pada hari itu.",
        repetition: 3,
        category: "keimanan"
      }
      ,
      {
        id: "sore_011",
        title: "Dzikir Sore Ke-6 - Surat Al-Ikhlas (Dibaca 3x)",
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَّهُ كُفُوًا أَحَدٌ",
        latin: "Qul huwallāhu ahad, allāhush-shamad, lam yalid wa lam yūlad, wa lam yakun lahu kufuwan ahad",
        translation: "Katakanlah: 'Dia-lah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorangpun yang setara dengan Dia.'",
        benefit: "Membaca Al-Ikhlas, Al-Falaq, dan An-Nas masing-masing 3 kali di sore hari sudah cukup (untuk perlindungan).",
        reference: "QS. Al-Ikhlas 112:1-4. HR. Abu Dawud 4/322, At-Tirmidzi 5/567. Dishahihkan Al-Albani dalam Shahih At-Tirmidzi.",
        hadistText: "Dari Abdullah bin Khubaib radliallahu 'anhu, beliau berkata: Keluar kepada kami Rasulullah shallallahu 'alaihi wa sallam di suatu malam yang gelap gulita, kemudian beliau bersabda: 'Ucapkanlah!' Aku bertanya: 'Apa yang harus kuucapkan wahai Rasulullah?' Beliau bersabda: 'Qul huwallahu ahad dan mu'awwidzatain (Al-Falaq dan An-Nas) setiap sore dan pagi 3 kali, niscaya akan mencukupimu dari segala sesuatu.'",
        repetition: 3,
        category: "surat"
      },
      {
        id: "sore_012",
        title: "Dzikir Sore Ke-7 - Surat Al-Falaq (Dibaca 3x)",
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِنْ شَرِّ مَا خَلَقَ ۞ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        latin: "Qul a'ūdzu birabbi'l-falaq, min syarri mā khalaq, wa min syarri ghāsiqin idzā waqab, wa min syarri'n-naffātsāti fi'l-'uqad, wa min syarri hāsidin idzā hasad",
        translation: "Katakanlah: 'Aku berlindung kepada Tuhan yang menguasai subuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam yang gelap gulita apabila telah tiba, dan dari kejahatan wanita-wanita tukang sihir yang meniup pada buhul-buhul, dan dari kejahatan orang yang dengki apabila ia dengki.'",
        benefit: "Perlindungan dari kejahatan makhluk, kegelapan malam, sihir, dan kedengkian.",
        reference: "QS. Al-Falaq 113:1-5. HR. Abu Dawud 4/322, At-Tirmidzi 5/567.",
        repetition: 3,
        category: "surat"
      },
      {
        id: "sore_013",
        title: "Dzikir Sore Ke-8 - Surat An-Nas (Dibaca 3x)",
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ ۞ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ",
        latin: "Qul a'ūdzu birabbi'n-nās, maliki'n-nās, ilāhi'n-nās, min syarri'l-waswāsi'l-khannās, alladhī yuwaswisu fī shudūri'n-nās, mina'l-jinnati wa'n-nās",
        translation: "Katakanlah: 'Aku berlindung kepada Tuhan (yang memelihara dan menguasai) manusia, Raja manusia, sembahan manusia, dari kejahatan (bisikan) syaitan yang biasa bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari golongan jin dan manusia.'",
        benefit: "Perlindungan dari bisikan syaitan dan kejahatan dari jin maupun manusia.",
        reference: "QS. An-Nas 114:1-6. HR. Abu Dawud 4/322, At-Tirmidzi 5/567.",
        repetition: 3,
        category: "surat"
      },
      {
        id: "sore_014",
        title: "Dzikir Sore Ke-9 - Subhanallah wa Bihamdih (Dibaca 100x)",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        latin: "Subhāna'llāhi wa bihamdih",
        translation: "Maha Suci Allah dan dengan memuji-Nya",
        benefit: "Barangsiapa yang mengucapkannya 100 kali di pagi dan sore hari, tidak ada yang datang pada hari kiamat dengan amalan yang lebih baik kecuali orang yang mengucapkan seperti itu atau lebih.",
        reference: "HR. Muslim no. 2692",
        hadistText: "Dari Abu Hurairah radliallahu 'anhu, Rasulullah shallallahu 'alaihi wa sallam bersabda: 'Barangsiapa yang berkata: Subhāna'llāhi wa bihamdih seratus kali dalam sehari, dosanya akan dihapuskan meskipun sebanyak buih laut.'",
        repetition: 100,
        category: "tasbih"
      },
      {
        id: "sore_015",
        title: "Dzikir Sore Ke-10 - La Hawla wa la Quwwata illa Billah (Dibaca 100x)",
        arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        latin: "Lā hawla wa lā quwwata illā billāh",
        translation: "Tidak ada daya dan kekuatan kecuali dengan pertolongan Allah",
        benefit: "Merupakan salah satu kanzut (harta karun) dari surga. Obat dari 99 penyakit, yang paling ringan adalah kegelisahan.",
        reference: "HR. Al-Bukhari dan Muslim",
        hadistText: "Dari Abu Musa Al-Asy'ari radliallahu 'anhu, Rasulullah shallallahu 'alaihi wa sallam berkata kepadanya: 'Maukah aku tunjukkan kepadamu salah satu harta karun surga?' Aku menjawab: 'Tentu, wahai Rasulullah!' Beliau bersabda: 'Lā hawla wa lā quwwata illā billāh'",
        repetition: 100,
        category: "dzikir"
      }
    ]
  },

  doa_tidur: {
    title: "Doa Sebelum Tidur",
    icon: "😴",
    description: "Doa dan dzikir yang dibaca sebelum tidur",
    timeRecommendation: "Sebelum tidur malam",
    doa: [
      {
        id: "tidur_001",
        title: "Doa Sebelum Tidur",
        arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
        latin: "Allāhumma bismika amūtu wa ahyā",
        translation: "Ya Allah, dengan nama-Mu aku mati dan aku hidup",
        benefit: "Perlindungan Allah selama tidur dan kebangkitan yang baik",
        reference: "HR. Al-Bukhari no. 6324",
        repetition: 1,
        category: "doa"
      },
      {
        id: "tidur_002",
        title: "Membaca Al-Ikhlas, Al-Falaq, An-Nas",
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ...",
        latin: "Qul huwa'llāhu ahad...",
        translation: "Katakanlah: Dia-lah Allah, Yang Maha Esa...",
        benefit: "Perlindungan dari segala kejahatan dan gangguan",
        reference: "HR. At-Tirmidzi, dishahihkan Al-Albani",
        repetition: 3,
        category: "surat"
      }
    ]
  },

  doa_bangun: {
    title: "Doa Bangun Tidur",
    icon: "🌅",
    description: "Doa ketika bangun dari tidur",
    timeRecommendation: "Saat bangun tidur",
    doa: [
      {
        id: "bangun_001",
        title: "Doa Bangun Tidur",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        latin: "Alhamdu lillāhi'lladhī ahyānā ba'da mā amātanā wa ilayhi'n-nusyūr",
        translation: "Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami dan kepada-Nya kebangkitan",
        benefit: "Bersyukur atas nikmat kehidupan yang diberikan Allah",
        reference: "HR. Al-Bukhari no. 6325",
        repetition: 1,
        category: "doa"
      }
    ]
  },

  doa_safar: {
    title: "Doa Safar & Perjalanan",
    icon: "🧳",
    description: "Doa untuk bepergian dan dalam perjalanan",
    timeRecommendation: "Saat bepergian",
    doa: [
      {
        id: "safar_001",
        title: "Doa Keluar Rumah",
        arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ",
        latin: "Bismillāh, tawakkaltu 'ala'llāh, wa lā hawla wa lā quwwata illā billāh",
        translation: "Dengan nama Allah, aku bertawakkal kepada Allah, tiada daya dan kekuatan kecuali dengan pertolongan Allah",
        benefit: "Akan dicukupkan, diberi petunjuk dan dilindungi",
        reference: "HR. Abu Dawud no. 5095",
        repetition: 1,
        category: "doa"
      },
      {
        id: "safar_002",
        title: "Takbir di Tempat Tinggi",
        arabic: "اللَّهُ أَكْبَرُ",
        latin: "Allāhu akbar",
        translation: "Allah Maha Besar",
        benefit: "Sunnah bertakbir saat naik ke tempat tinggi dalam perjalanan",
        reference: "HR. Al-Bukhari no. 2993",
        repetition: 3,
        category: "dzikir"
      }
    ]
  },

  doa_makan: {
    title: "Doa Makan & Minum",
    icon: "🍽️",
    description: "Doa sebelum dan sesudah makan minum",
    timeRecommendation: "Saat makan dan minum",
    doa: [
      {
        id: "makan_001",
        title: "Doa Sebelum Makan",
        arabic: "بِسْمِ اللَّهِ",
        latin: "Bismillāh",
        translation: "Dengan nama Allah",
        benefit: "Keberkahan dalam makanan dan perlindungan dari bahaya",
        reference: "HR. Abu Dawud no. 3767",
        repetition: 1,
        category: "doa"
      },
      {
        id: "makan_002",
        title: "Doa Sesudah Makan",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        latin: "Alhamdu lillāhi'lladhī at'amanā wa saqānā wa ja'alanā muslimīn",
        translation: "Segala puji bagi Allah yang memberi kami makan dan minum serta menjadikan kami muslim",
        benefit: "Bersyukur atas rezeki yang diberikan Allah",
        reference: "HR. Abu Dawud no. 3850",
        repetition: 1,
        category: "doa"
      }
    ]
  },

  istighfar_taubat: {
    title: "Doa Istighfar & Taubat", 
    icon: "🤲",
    description: "Doa mohon ampun dan bertaubat kepada Allah",
    timeRecommendation: "Setiap saat",
    doa: [
      {
        id: "istighfar_001",
        title: "Istighfar Sederhana",
        arabic: "أَسْتَغْفِرُ اللَّهَ",
        latin: "Astaghfiru'llāh",
        translation: "Aku mohon ampun kepada Allah",
        benefit: "Allah memberikan jalan keluar dari setiap kesulitan dan rezeki dari arah yang tidak disangka",
        reference: "HR. Abu Dawud no. 1518",
        repetition: 100,
        category: "istighfar"
      },
      {
        id: "istighfar_002", 
        title: "Istighfar Lengkap",
        arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لاَ إِلَهَ إِلاَّ هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ",
        latin: "Astaghfiru'llāha'l-'aẓīma'lladhī lā ilāha illa huwa'l-hayya'l-qayyūm wa atūbu ilayh",
        translation: "Aku mohon ampun kepada Allah Yang Maha Agung, yang tiada Tuhan selain Dia, Yang Maha Hidup, Yang Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya",
        benefit: "Dosa diampuni meskipun sebanyak buih di lautan",
        reference: "HR. Abu Dawud no. 1517",
        repetition: 3,
        category: "istighfar"
      }
    ]
  },

  doa_sholat: {
    title: "Doa Setelah Sholat",
    icon: "🕌",
    description: "Doa dan dzikir yang dibaca setelah sholat fardhu",
    timeRecommendation: "Setelah sholat fardhu",
    doa: [
      {
        id: "sholat_001",
        title: "Istighfar (Dibaca 3x)",
        arabic: "أَسْتَغْفِرُ اللهَ",
        latin: "Astaghfiru'llāh",
        translation: "Aku mohon ampun kepada Allah",
        benefit: "Membersihkan dosa-dosa kecil setelah pelaksanaan sholat",
        reference: "HR. Muslim no. 591",
        repetition: 3,
        category: "istighfar"
      },
      {
        id: "sholat_002",
        title: "Allahumma Anta As-Salam (Dibaca 1x)",
        arabic: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ ذَا الْجَلاَلِ وَالإِكْرَامِ",
        latin: "Allāhumma anta's-salāmu wa minka's-salām, tabārakta yā dhā'l-jalāli wa'l-ikrām",
        translation: "Ya Allah, Engkau adalah As-Salam (Yang Maha Pemberi Keselamatan) dan dari-Mu lah keselamatan, Maha Berkah Engkau, wahai Dzat yang memiliki keagungan dan kemuliaan",
        benefit: "Doa yang langsung dibaca setelah salam dari sholat",
        reference: "HR. Muslim no. 592",
        repetition: 1,
        category: "doa"
      },
      {
        id: "sholat_003",
        title: "Subhanallah (Dibaca 33x)",
        arabic: "سُبْحَانَ اللَّهِ",
        latin: "Subhāna'llāh",
        translation: "Maha Suci Allah",
        benefit: "Bersama Alhamdulillah dan Allahu Akbar dapat menghapus dosa meskipun sebanyak buih laut",
        reference: "HR. Muslim no. 597",
        repetition: 33,
        category: "tasbih"
      },
      {
        id: "sholat_004",
        title: "Alhamdulillah (Dibaca 33x)",
        arabic: "الْحَمْدُ لِلَّهِ",
        latin: "Alhamdu lillāh",
        translation: "Segala puji bagi Allah",
        benefit: "Bersama dzikir lainnya dapat menghapus dosa sebanyak buih laut",
        reference: "HR. Muslim no. 597",
        repetition: 33,
        category: "tahmid"
      },
      {
        id: "sholat_005",
        title: "Allahu Akbar (Dibaca 34x)",
        arabic: "اللَّهُ أَكْبَرُ",
        latin: "Allāhu akbar",
        translation: "Allah Maha Besar",
        benefit: "Melengkapi dzikir 100x setelah sholat yang dapat menghapus dosa",
        reference: "HR. Muslim no. 597",
        repetition: 34,
        category: "takbir"
      },
      {
        id: "sholat_006",
        title: "La ilaha illallahu wahdahu (Dibaca 1x)",
        arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        latin: "Lā ilāha illa'llāhu wahdahu lā syarīka lah, lahu'l-mulku wa lahu'l-hamd, wa huwa 'alā kulli syay'in qadīr",
        translation: "Tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya, bagi-Nya kerajaan dan bagi-Nya segala puji, dan Dia Maha Kuasa atas segala sesuatu",
        benefit: "Diampuni dosanya walaupun sebanyak buih lautan",
        reference: "HR. Muslim no. 597",
        repetition: 1,
        category: "tahlil"
      },
      {
        id: "sholat_007",
        title: "Ayat Kursi (Dibaca 1x)",
        arabic: "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَهُ مَا فِي السَّمَوَاتِ وَمَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        latin: "Allāhu lā ilāha illā huwa'l-hayyu'l-qayyūm, lā ta'khudhuhū sinatun wa lā nawm, lahū mā fi's-samāwāti wa mā fi'l-ardh, man dhā'lladhī yashfa'u 'indahū illā bi'idhnih, ya'lamu mā bayna aydīhim wa mā khalfahum, wa lā yuhītūna bi syay'in min 'ilmihī illā bi mā syā', wasi'a kursiyyuhu's-samāwāti wa'l-ardh, wa lā ya'ūduhū hifzhunumā wa huwa'l-'aliyyu'l-'azhīm",
        translation: "Allah, tidak ada Tuhan selain Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafaat di sisi Allah tanpa izin-Nya. Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar.",
        benefit: "Tidak ada penghalang masuk surga kecuali maut",
        reference: "QS. Al-Baqarah: 255. HR. An-Nasai dalam 'Amalul Yaum wal Lailah no. 100",
        repetition: 1,
        category: "ayat"
      },
      {
        id: "sholat_008",
        title: "Surat Al-Ikhlas (Dibaca 1x)",
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَّهُ كُفُوًا أَحَدٌ",
        latin: "Qul huwallāhu ahad, allāhush-shamad, lam yalid wa lam yūlad, wa lam yakun lahu kufuwan ahad",
        translation: "Katakanlah: Dia-lah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorangpun yang setara dengan Dia.",
        benefit: "Setara dengan membaca sepertiga Al-Quran",
        reference: "QS. Al-Ikhlas 112:1-4. HR. Al-Bukhari no. 5013",
        repetition: 1,
        category: "surat"
      },
      {
        id: "sholat_009",
        title: "Surat Al-Falaq (Dibaca 1x)",
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِنْ شَرِّ مَا خَلَقَ ۞ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        latin: "Qul a'ūdzu birabbi'l-falaq, min syarri mā khalaq, wa min syarri ghāsiqin idhā waqab, wa min syarri'n-naffātsāti fi'l-'uqad, wa min syarri hāsidin idhā hasad",
        translation: "Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam yang gelap gulita apabila telah tiba, dan dari kejahatan wanita-wanita tukang sihir yang meniup pada buhul-buhul, dan dari kejahatan orang yang dengki apabila ia dengki.",
        benefit: "Perlindungan dari segala kejahatan makhluk",
        reference: "QS. Al-Falaq 113:1-5. HR. Abu Dawud no. 1523",
        repetition: 1,
        category: "surat"
      },
      {
        id: "sholat_010",
        title: "Surat An-Nas (Dibaca 1x)",
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ ۞ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ",
        latin: "Qul a'ūdzu birabbi'n-nās, maliki'n-nās, ilāhi'n-nās, min syarri'l-waswāsi'l-khannās, alladhī yuwaswisu fī shudūri'n-nās, mina'l-jinnati wa'n-nās",
        translation: "Katakanlah: Aku berlindung kepada Tuhan manusia, Raja manusia, sembahan manusia, dari kejahatan (bisikan) syaitan yang biasa bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari golongan jin dan manusia.",
        benefit: "Perlindungan dari bisikan syaitan dan kejahatan jin serta manusia",
        reference: "QS. An-Nas 114:1-6. HR. Abu Dawud no. 1523",
        repetition: 1,
        category: "surat"
      }
    ]
  },

  tahlil_tahmid: {
    title: "Tahlil & Tahmid",
    icon: "☪️",
    description: "Dzikir La ilaha illallah dan Alhamdulillah",
    timeRecommendation: "Setiap saat",
    doa: [
      {
        id: "tahlil_001",
        title: "La ilaha illallah",
        arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ",
        latin: "Lā ilāha illa'llāh",
        translation: "Tiada Tuhan selain Allah",
        benefit: "Kalimat terbaik, lebih berat timbangannya dari langit dan bumi",
        reference: "HR. At-Tirmidzi no. 3383",
        repetition: 100,
        category: "tahlil"
      },
      {
        id: "tahlil_002",
        title: "Tahlil Lengkap",
        arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        latin: "Lā ilāha illa'llāhu wahdahu lā syarīka lah, lahu'l-mulku wa lahu'l-hamd, wa huwa 'alā kulli syay'in qadīr",
        translation: "Tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya, bagi-Nya kerajaan dan bagi-Nya segala puji, dan Dia Maha Kuasa atas segala sesuatu",
        benefit: "Mendapat pahala seperti memerdekakan 10 budak, ditulis 100 kebaikan, dihapus 100 kesalahan",
        reference: "HR. Al-Bukhari no. 6404",
        repetition: 10,
        category: "tahlil"
      }
    ]
  },

  doa_kafaratul_majlis: {
    title: "Kafaratul Majlis",
    icon: "💬",
    description: "Doa penutup majlis dan penebus dosa dalam pertemuan",
    timeRecommendation: "Akhir pertemuan/majlis",
    doa: [
      {
        id: "majlis_001",
        title: "Kafaratul Majlis",
        arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
        latin: "Subhānaka'llāhumma wa bihamdika, asyhadu an lā ilāha illa anta, astaghfiruka wa atūbu ilayk",
        translation: "Maha Suci Engkau ya Allah dan segala puji bagi-Mu, aku bersaksi bahwa tiada Tuhan selain Engkau, aku mohon ampun dan bertaubat kepada-Mu",
        benefit: "Menebus dosa-dosa yang terjadi dalam majlis/pertemuan",
        reference: "HR. Abu Dawud no. 4859",
        repetition: 1,
        category: "doa"
      }
    ]
  },

  doa_masuk_wc: {
    title: "Doa Masuk & Keluar WC",
    icon: "🚪",
    description: "Doa adab masuk dan keluar kamar mandi",
    timeRecommendation: "Saat ke kamar mandi",
    doa: [
      {
        id: "wc_001",
        title: "Doa Masuk WC",
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        latin: "Allāhumma innī a'ūdzu bika mina'l-khubutsi wa'l-khabā'its",
        translation: "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari setan laki-laki dan setan perempuan",
        benefit: "Perlindungan dari gangguan setan di tempat najis",
        reference: "HR. Al-Bukhari no. 142",
        repetition: 1,
        category: "doa"
      },
      {
        id: "wc_002",
        title: "Doa Keluar WC",
        arabic: "غُفْرَانَكَ",
        latin: "Ghufrānak",
        translation: "Aku mohon ampunan-Mu",
        benefit: "Meminta ampunan Allah setelah menjalankan hajat",
        reference: "HR. Abu Dawud no. 30",
        repetition: 1,
        category: "doa"
      }
    ]
  },

  doa_wudhu: {
    title: "Doa Wudhu",
    icon: "💧",
    description: "Doa sebelum dan sesudah berwudhu",
    timeRecommendation: "Saat berwudhu",
    doa: [
      {
        id: "wudhu_001",
        title: "Doa Sebelum Wudhu",
        arabic: "بِسْمِ اللَّهِ",
        latin: "Bismillāh",
        translation: "Dengan nama Allah",
        benefit: "Memulai wudhu dengan menyebut nama Allah",
        reference: "HR. Abu Dawud no. 101",
        repetition: 1,
        category: "doa"
      },
      {
        id: "wudhu_002",
        title: "Doa Sesudah Wudhu",
        arabic: "أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        latin: "Asyhadu an lā ilāha illa'llāhu wahdahu lā syarīka lah, wa asyhadu anna Muhammadan 'abduhu wa rasūluh",
        translation: "Aku bersaksi bahwa tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya",
        benefit: "Dibukakan 8 pintu surga, boleh masuk dari pintu mana saja yang dikehendaki",
        reference: "HR. Muslim no. 234",
        repetition: 1,
        category: "doa"
      }
    ]
  },

  doa_masuk_masjid: {
    title: "Doa Masuk & Keluar Masjid",
    icon: "🕌",
    description: "Doa adab masuk dan keluar masjid",
    timeRecommendation: "Saat ke masjid",
    doa: [
      {
        id: "masjid_001",
        title: "Doa Masuk Masjid",
        arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        latin: "Allāhumma'ftah lī abwāba rahmatik",
        translation: "Ya Allah, bukakanlah untuk ku pintu-pintu rahmat-Mu",
        benefit: "Memohon dibukakan pintu rahmat Allah",
        reference: "HR. Muslim no. 713",
        repetition: 1,
        category: "doa"
      },
      {
        id: "masjid_002",
        title: "Doa Keluar Masjid",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ",
        latin: "Allāhumma innī as'aluka min fadlika wa rahmatik",
        translation: "Ya Allah, sesungguhnya aku memohon kepada-Mu sebagian dari karunia dan rahmat-Mu",
        benefit: "Memohon karunia dan rahmat Allah",
        reference: "HR. Muslim no. 713",
        repetition: 1,
        category: "doa"
      }
    ]
  },

  doa_kendaraan: {
    title: "Doa Naik Kendaraan",
    icon: "🚗",
    description: "Doa saat naik kendaraan dan dalam perjalanan",
    timeRecommendation: "Saat naik kendaraan",
    doa: [
      {
        id: "kendaraan_001",
        title: "Doa Naik Kendaraan",
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        latin: "Subhāna'lladhī sakhkhara lanā hādzā wa mā kunnā lahu muqrinīn, wa innā ilā rabbinā lamunqalibūn",
        translation: "Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Rabb kami",
        benefit: "Keselamatan dalam perjalanan dan perlindungan Allah",
        reference: "HR. Abu Dawud no. 2602",
        repetition: 1,
        category: "doa"
      }
    ]
  },

  doa_cuaca: {
    title: "Doa Saat Turun Hujan",
    icon: "🌧️", 
    description: "Doa ketika turun hujan dan petir",
    timeRecommendation: "Saat hujan dan petir",
    doa: [
      {
        id: "cuaca_001",
        title: "Doa Turun Hujan",
        arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
        latin: "Allāhumma sayyiban nāfi'an",
        translation: "Ya Allah, jadikanlah hujan yang bermanfaat",
        benefit: "Memohon keberkahan dari hujan yang turun",
        reference: "HR. Al-Bukhari no. 1032",
        repetition: 1,
        category: "doa"
      },
      {
        id: "cuaca_002",
        title: "Doa Saat Petir",
        arabic: "سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلاَئِكَةُ مِنْ خِيفَتِهِ",
        latin: "Subhāna'lladhī yusabbihu'rra'du bihamdihī wa'l-malā'ikatu min khīfatih",
        translation: "Maha Suci Allah yang petir bertasbih dengan memuji-Nya dan para malaikat pun bertasbih karena takut kepada-Nya",
        benefit: "Perlindungan dari bahaya petir dan bencana",
        reference: "HR. Al-Bukhari dalam Adabul Mufrad no. 723",
        repetition: 1,
        category: "doa"
      }
    ]
  },

  doa_rezeki: {
    title: "Doa Memohon Rezeki",
    icon: "💰",
    description: "Doa memohon rezeki yang halal dan berkah",
    timeRecommendation: "Setiap saat",
    doa: [
      {
        id: "rezeki_001",
        title: "Doa Memohon Rezeki Halal",
        arabic: "اللَّهُمَّ اكْفِنِي بِحَلاَلِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
        latin: "Allāhumma'kfinī bihalālika 'an harāmik, wa aghninī bifadlika 'amman siwāk",
        translation: "Ya Allah, cukupkanlah aku dengan rezeki halal-Mu dari yang haram, dan kayakanlah aku dengan karunia-Mu dari selain-Mu",
        benefit: "Dicukupkan dengan rezeki halal dan tidak bergantung pada selain Allah",
        reference: "HR. At-Tirmidzi no. 3563",
        repetition: 1,
        category: "doa"
      }
    ]
  },

  doa_ilmu: {
    title: "Doa Menuntut Ilmu",
    icon: "📚",
    description: "Doa memohon ilmu yang bermanfaat dan kebijaksanaan",
    timeRecommendation: "Sebelum belajar",
    doa: [
      {
        id: "ilmu_001",
        title: "Doa Memohon Ilmu Bermanfaat",
        arabic: "اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا",
        latin: "Allāhumma'nfa'nī bimā 'allamtanī wa 'allimnī mā yanfa'unī wa zidnī 'ilman",
        translation: "Ya Allah, berikanlah manfaat kepada ku dengan apa yang telah Engkau ajarkan kepada ku, dan ajarikanlah kepada ku apa yang bermanfaat bagi ku, serta tambahkanlah ilmu kepada ku",
        benefit: "Dimudahkan dalam menuntut ilmu dan diberi ilmu yang bermanfaat",
        reference: "HR. Ibn Majah no. 251",
        repetition: 1,
        category: "doa"
      },
      {
        id: "ilmu_002",
        title: "Doa Sebelum Belajar",
        arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
        latin: "Rabbi'shrah lī sadrī wa yassir lī amrī wa'hlul 'uqdatan min lisānī yafqahū qawlī",
        translation: "Ya Rabbku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku agar mereka mengerti perkataanku",
        benefit: "Dimudahkan dalam memahami dan menyampaikan ilmu",
        reference: "QS. Taha: 25-28",
        repetition: 1,
        category: "doa"
      }
    ]
  },

  doa_orang_sakit: {
    title: "Doa untuk Orang Sakit",
    icon: "🏥",
    description: "Doa ketika sakit dan menjenguk orang sakit",
    timeRecommendation: "Saat sakit",
    doa: [
      {
        id: "sakit_001",
        title: "Doa Ketika Sakit",
        arabic: "اللَّهُمَّ أَذْهِبِ الْبَاسَ رَبَّ النَّاسِ وَاشْفِ أَنْتَ الشَّافِي لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ شِفَاءً لاَ يُغَادِرُ سَقَمًا",
        latin: "Allāhumma adzhib il-ba'sa rabba'n-nās, wa'shfi anta'sh-syāfī lā syifā'a illā syifā'uk, syifā'an lā yughādiru saqaman",
        translation: "Ya Allah, hilangkanlah penyakit ini wahai Rabb manusia, sembuhkanlah, Engkau Yang Maha Menyembuhkan, tiada kesembuhan kecuali kesembuhan dari-Mu, kesembuhan yang tidak meninggalkan penyakit",
        benefit: "Memohon kesembuhan yang sempurna dari Allah",
        reference: "HR. Al-Bukhari no. 5675",
        repetition: 3,
        category: "doa"
      }
    ]
  }
};

// Utility functions
const doaUtils = {
  getAllCategories: () => Object.keys(doaCollection),
  
  getCategoryData: (categoryId) => doaCollection[categoryId],
  
  searchDoa: (query) => {
    const results = [];
    Object.entries(doaCollection).forEach(([categoryId, category]) => {
      category.doa.forEach(doa => {
        if (doa.title.toLowerCase().includes(query.toLowerCase()) ||
            doa.translation.toLowerCase().includes(query.toLowerCase()) ||
            doa.latin.toLowerCase().includes(query.toLowerCase())) {
          results.push({...doa, categoryId, categoryTitle: category.title});
        }
      });
    });
    return results;
  },
  
  getDoaById: (id) => {
    for (const [categoryId, category] of Object.entries(doaCollection)) {
      const doa = category.doa.find(d => d.id === id);
      if (doa) {
        return {...doa, categoryId, categoryTitle: category.title};
      }
    }
    return null;
  },

  getTimeBasedRecommendations: (currentHour) => {
    const recommendations = [];
    
    // Pagi (05:00 - 07:00): Dzikir Pagi
    if (currentHour >= 5 && currentHour <= 7) {
      recommendations.push('dzikir_pagi');
    }
    
    // Siang (11:00 - 13:00): Doa Makan
    if (currentHour >= 11 && currentHour <= 13) {
      recommendations.push('doa_makan');
    }
    
    // Sore (15:00 - 18:00): Dzikir Petang  
    if (currentHour >= 15 && currentHour <= 18) {
      recommendations.push('dzikir_petang');
    }
    
    // Malam (21:00 - 23:00): Doa Sebelum Tidur
    if (currentHour >= 21 && currentHour <= 23) {
      recommendations.push('doa_tidur');
    }
    
    // Istighfar selalu direkomendasikan
    recommendations.push('istighfar_taubat');
    
    return recommendations;
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { doaCollection, doaUtils };
}