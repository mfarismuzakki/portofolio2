// Koleksi Hadith Shahih tentang Shalat
// Collection of Authentic Hadith about Prayer

const hadithCollection = [
  {
    arabic: "مَن صَلَّى الْفَجْرَ فِي جَمَاعَةٍ فَكَأَنَّمَا صَلَّى اللَّيْلَ كُلَّهُ",
    indonesia: "Barangsiapa yang shalat Subuh berjamaah, maka seolah-olah ia shalat sepanjang malam.",
    reference: "HR. Muslim"
  },
  {
    arabic: "صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً",
    indonesia: "Shalat berjamaah lebih utama daripada shalat sendirian dengan 27 derajat.",
    reference: "HR. Bukhari & Muslim"
  },
  {
    arabic: "خَيْرُ الْأَعْمَالِ الصَّلَاةُ عَلَى وَقْتِهَا",
    indonesia: "Sebaik-baik amal adalah shalat pada waktunya.",
    reference: "HR. Bukhari & Muslim"
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
    reference: "HR. Bukhari"
  },
  {
    arabic: "بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكُ الصَّلَاةِ",
    indonesia: "Antara seseorang dengan kesyirikan dan kekafiran adalah meninggalkan shalat.",
    reference: "HR. Muslim"
  },
  {
    arabic: "مَا مِن مُسْلِمٍ يَتَوَضَّأُ فَيُحْسِنُ وُضُوءَهُ ثُمَّ يَقُومُ فَيُصَلِّي رَكْعَتَيْنِ",
    indonesia: "Tidaklah seorang muslim berwudhu lalu memperbaiki wudhunya kemudian berdiri shalat dua rakaat, melainkan Allah akan mengampuni dosa-dosanya.",
    reference: "HR. Bukhari & Muslim"
  },
  {
    arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ وَالْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ",
    indonesia: "Bersuci adalah separuh dari iman, dan Alhamdulillahi Rabbil Alamiin memenuhi timbangan.",
    reference: "HR. Muslim"
  },
  {
    arabic: "مَن قَالَ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ فِي يَوْمٍ مِائَةَ مَرَّةٍ حُطَّت خَطَايَاهُ وَإِن كَانَت مِثْلَ زَبَدِ الْبَحْرِ",
    indonesia: "Barangsiapa yang mengucapkan Subhanallahi wa bihamdihi dalam sehari 100 kali, maka dihapuskanlah dosa-dosanya walaupun sebanyak buih lautan.",
    reference: "HR. Bukhari & Muslim"
  },
  {
    arabic: "صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي",
    indonesia: "Shalatlah kalian sebagaimana kalian melihat aku shalat.",
    reference: "HR. Bukhari"
  },
  {
    arabic: "الصَّلَاةُ خَيْرُ مَوْضُوعٍ فَمَن اسْتَطَاعَ أَن يَسْتَكْثِرَ فَلْيَسْتَكْثِرْ",
    indonesia: "Shalat adalah perkara terbaik yang ditetapkan, maka barangsiapa yang mampu memperbanyaknya, hendaklah ia memperbanyaknya.",
    reference: "HR. Abu Dawud"
  },
  {
    arabic: "لَا يَزَالُ الْعَبْدُ فِي صَلَاةٍ مَا دَامَ فِي مُصَلَّاهُ يَنْتَظِرُ الصَّلَاةَ",
    indonesia: "Seorang hamba senantiasa dalam keadaan shalat selama ia berada di tempat shalatnya menunggu shalat.",
    reference: "HR. Bukhari"
  },
  {
    arabic: "مَن صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ",
    indonesia: "Barangsiapa yang shalat dua waktu yang dingin (Subuh dan Ashar), maka ia masuk surga.",
    reference: "HR. Bukhari & Muslim"
  },
  {
    arabic: "إِنَّ أَعْظَمَ الذُّنُوبِ عِنْدَ اللَّهِ أَن تَدْعُوَ لِلَّهِ نِدًّا وَهُوَ خَلَقَكَ",
    indonesia: "Sesungguhnya dosa yang paling besar di sisi Allah adalah menjadikan sekutu bagi Allah padahal Dia yang menciptakanmu.",
    reference: "HR. Bukhari"
  },
  {
    arabic: "رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا",
    indonesia: "Dua rakaat sunnah Subuh lebih baik daripada dunia dan segala isinya.",
    reference: "HR. Muslim"
  },
  {
    arabic: "مَن حَافَظَ عَلَى أَرْبَعِ رَكَعَاتٍ قَبْلَ الظُّهْرِ وَأَرْبَعٍ بَعْدَهَا حَرَّمَهُ اللَّهُ عَلَى النَّارِ",
    indonesia: "Barangsiapa yang menjaga empat rakaat sebelum Dhuhur dan empat rakaat sesudahnya, Allah haramkan dia atas api neraka.",
    reference: "HR. Abu Dawud & Tirmidzi"
  },
  {
    arabic: "أَيُّهَا النَّاسُ عَلَيْكُم بِالسُّجُودِ فَإِنَّكُم لاَ تَسْجُدُونَ لِلَّهِ سَجْدَةً إِلاَّ رَفَعَكُمُ اللَّهُ بِهَا دَرَجَةً",
    indonesia: "Wahai manusia, perbanyaklah sujud, karena tidaklah kalian bersujud kepada Allah dengan suatu sujud melainkan Allah akan mengangkat derajat kalian satu tingkat.",
    reference: "HR. Muslim"
  },
  {
    arabic: "مَا مِن عَبدٍ مُسلِمٍ يُصَلِّي لِلَّهِ كُلَّ يَومٍ ثِنتَي عَشرَةَ رَكعَةً تَطَوُّعًا غَيرَ فَريضَةٍ إِلاَّ بَنَى اللَّهُ لَهُ بَيتًا في الجَنَّةِ",
    indonesia: "Tidaklah seorang hamba muslim yang shalat kepada Allah setiap hari dua belas rakaat sunnah selain yang fardhu, melainkan Allah membangunkan untuknya rumah di surga.",
    reference: "HR. Muslim"
  },
  {
    arabic: "لاَ تَدْعُوا صَلاَةَ اللَّيْلِ فَإِنَّ رَسُولَ اللَّهِ كَانَ لاَ يَدَعُهَا",
    indonesia: "Janganlah kalian tinggalkan shalat malam, karena Rasulullah tidak pernah meninggalkannya.",
    reference: "HR. Abu Dawud"
  },
  {
    arabic: "ضَحِّوْا بِالضَّحَى وَلَو بِرَكْعَتَيْنِ",
    indonesia: "Shalatlah Dhuha walau hanya dua rakaat.",
    reference: "HR. Abu Ya'la"
  },
  {
    arabic: "مَن صَلَّى الضُّحَى أَرْبَعَ رَكَعَاتٍ وَقَبْلَ الأُولَى أَرْبَعَ رَكَعَاتٍ بُنِيَ لَهُ بَيْتٌ فِي الْجَنَّةِ",
    indonesia: "Barangsiapa yang shalat Dhuha empat rakaat dan sebelum Dhuhur empat rakaat, maka dibangunkan untuknya rumah di surga.",
    reference: "HR. Tirmidzi"
  },
  {
    arabic: "الْوِتْرُ حَقٌّ فَمَن لَم يُوتِرْ فَلَيْسَ مِنَّا",
    indonesia: "Witir itu haq (kewajiban), barangsiapa yang tidak melakukan witir maka dia bukan dari golongan kami.",
    reference: "HR. Abu Dawud"
  },
  {
    arabic: "مَن صَلَّى اثْنَتَيْ عَشْرَةَ رَكْعَةً فِي يَوْمٍ وَلَيْلَةٍ بُنِيَ لَهُ بِهِنَّ بَيْتٌ فِي الْجَنَّةِ",
    indonesia: "Barangsiapa yang shalat dua belas rakaat dalam sehari semalam, maka dibangunkan baginya rumah di surga.",
    reference: "HR. Muslim"
  },
  {
    arabic: "إِذَا صَلَّى أَحَدُكُمُ الْمَغْرِبَ فَلْيُصَلِّ بَعْدَهَا رَكْعَتَيْنِ",
    indonesia: "Apabila salah seorang di antara kalian shalat Maghrib, hendaklah ia shalat dua rakaat sesudahnya.",
    reference: "HR. Abu Dawud"
  },
  {
    arabic: "كَانَ النَّبِيُّ لاَ يَدَعُ أَرْبَعًا قَبْلَ الظُّهْرِ وَرَكْعَتَيْنِ قَبْلَ الْغَدَاةِ",
    indonesia: "Nabi tidak pernah meninggalkan empat rakaat sebelum Dhuhur dan dua rakaat sebelum Subuh.",
    reference: "HR. Bukhari"
  }
];

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = hadithCollection;
}