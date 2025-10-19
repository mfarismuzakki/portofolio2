// Collection of Authentic Hadith about Prayer and Islamic Values

const hadithCollection = [
  {
    arabic: "مَن صَلَّى الْفَجْرَ فِي جَمَاعَةٍ فَكَأَنَّمَا صَلَّى اللَّيْلَ كُلَّهُ",
    indonesia: "Barangsiapa yang shalat Subuh berjamaah, maka seolah-olah ia shalat sepanjang malam.",
    reference: "HR. Muslim"
  },
  {
    arabic: "صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً",
    indonesia: "Shalat berjamaah lebih utama daripada shalat sendirian dengan 27 derajat.",
    reference: "HR. Al-Bukhari & Muslim"
  },
  {
    arabic: "خَيْرُ الْأَعْمَالِ الصَّلَاةُ عَلَى وَقْتِهَا",
    indonesia: "Sebaik-baik amal adalah shalat pada waktunya.",
    reference: "HR. Al-Bukhari & Muslim"
  },
  {
    arabic: "الصَّلَاةُ نُورٌ",
    indonesia: "Shalat itu cahaya.",
    reference: "HR. Muslim"
  },
  {
    arabic: "أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلَاتُهُ",
    indonesia: "Yang pertama kali akan dihisab dari amal seorang hamba pada hari kiamat adalah shalatnya.",
    reference: "HR. Abu Dawud"
  },
  {
    arabic: "مَن تَرَكَ صَلَاةَ الْعَصْرِ فَقَدْ حَبِطَ عَمَلُهُ",
    indonesia: "Barangsiapa yang meninggalkan shalat Ashar, maka terhapuslah amalnya.",
    reference: "HR. Al-Bukhari"
  },
  {
    arabic: "بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكُ الصَّلَاةِ",
    indonesia: "Antara seseorang dengan kesyirikan dan kekafiran adalah meninggalkan shalat.",
    reference: "HR. Muslim"
  },
  {
    arabic: "مَا مِن مُسْلِمٍ يَتَوَضَّأُ فَيُحْسِنُ وُضُوءَهُ ثُمَّ يَقُومُ فَيُصَلِّي رَكْعَتَيْنِ",
    indonesia: "Tidaklah seorang muslim berwudhu lalu memperbaiki wudhunya kemudian berdiri shalat dua rakaat, melainkan Allah akan mengampuni dosa-dosanya.",
    reference: "HR. Al-Bukhari & Muslim"
  },
  {
    arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ وَالْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ",
    indonesia: "Bersuci adalah separuh dari iman, dan Alhamdulillahi Rabbil Alamiin memenuhi timbangan.",
    reference: "HR. Muslim"
  },
  {
    arabic: "مَن قَالَ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ فِي يَوْمٍ مِائَةَ مَرَّةٍ حُطَّت خَطَايَاهُ وَإِن كَانَت مِثْلَ زَبَدِ الْبَحْرِ",
    indonesia: "Barangsiapa yang mengucapkan 'Subhanallahi wa bihamdihi' dalam sehari seratus kali, maka akan dihapus kesalahannya walaupun sebanyak buih di lautan.",
    reference: "HR. Al-Bukhari & Muslim"
  },
  {
    arabic: "مَن دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ",
    indonesia: "Barangsiapa yang menunjukkan kepada kebaikan, maka baginya pahala seperti pahala orang yang melakukannya.",
    reference: "HR. Muslim"
  },
  {
    arabic: "الدَّالُّ عَلَى الْخَيْرِ كَفَاعِلِهِ",
    indonesia: "Orang yang menunjukkan kebaikan sama seperti orang yang melakukannya.",
    reference: "HR. Tirmidzi"
  },
  {
    arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    indonesia: "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia.",
    reference: "HR. Ahmad & Thabrani"
  },
  {
    arabic: "الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا",
    indonesia: "Mukmin dengan mukmin yang lain bagaikan sebuah bangunan yang saling menguatkan.",
    reference: "HR. Al-Bukhari & Muslim"
  },
  {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    indonesia: "Sesungguhnya segala amal itu tergantung niatnya.",
    reference: "HR. Al-Bukhari & Muslim"
  }
];

// Prayer Time Methods Configuration
const prayerMethods = {
  KEMENAG: {
    name: "Kemenag Indonesia",
    fajr: 20,
    isha: 18,
    madhab: "Shafi"
  },
  MWL: {
    name: "Muslim World League",
    fajr: 18,
    isha: 17,
    madhab: "Shafi"
  },
  ISNA: {
    name: "Islamic Society of North America",
    fajr: 15,
    isha: 15,
    madhab: "Shafi"
  },
  Egypt: {
    name: "Egyptian General Authority",
    fajr: 19.5,
    isha: 17.5,
    madhab: "Shafi"
  },
  Makkah: {
    name: "Umm al-Qura University, Makkah",
    fajr: 18.5,
    isha: "90 min",
    madhab: "Shafi"
  },
  Karachi: {
    name: "University of Islamic Sciences, Karachi",
    fajr: 18,
    isha: 18,
    madhab: "Hanafi"
  }
};