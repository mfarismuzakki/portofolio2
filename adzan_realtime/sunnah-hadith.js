// Koleksi Hadith Shahih tentang Sholat Sunnah
// Collection of Authentic Hadith about Sunnah Prayers

const sunnahHadithCollection = [
  {
    name: "Sunnah Subuh (Qabliyah)",
    arabic: "رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا",
    indonesia: "Dua rakaat sunnah Subuh lebih baik daripada dunia dan segala isinya.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      const fajrStart = times.fajr - 0.5; // 30 minutes before Fajr
      const nowHours = now.h + now.m/60 + now.s/3600;
      return nowHours >= fajrStart && nowHours < times.fajr;
    },
    timeDescription: "Sebelum sholat Subuh"
  },
  {
    name: "Sholat Dhuha",
    arabic: "مَن صَلَّى الضُّحَى أَرْبَعَ رَكَعَاتٍ وَقَبْلَ الأُولَى أَرْبَعَ رَكَعَاتٍ بُنِيَ لَهُ بَيْتٌ فِي الْجَنَّةِ",
    indonesia: "Barangsiapa yang shalat Dhuha empat rakaat dan sebelum Dhuhur empat rakaat, maka dibangunkan untuknya rumah di surga.",
    reference: "HR. Tirmidzi",
    timeCondition: (times, now) => {
      const dhuhaStart = times.sunrise + 0.25; // 15 minutes after sunrise
      const dhuhaEnd = times.dhuhr - 0.25; // 15 minutes before Dhuhr
      const nowHours = now.h + now.m/60 + now.s/3600;
      return nowHours >= dhuhaStart && nowHours <= dhuhaEnd;
    },
    timeDescription: "Setelah terbit hingga sebelum Dzuhur"
  },
  {
    name: "Sunnah Dzuhur (Qabliyah)",
    arabic: "مَن حَافَظَ عَلَى أَرْبَعِ رَكَعَاتٍ قَبْلَ الظُّهْرِ وَأَرْبَعٍ بَعْدَهَا حَرَّمَهُ اللَّهُ عَلَى النَّارِ",
    indonesia: "Barangsiapa yang menjaga empat rakaat sebelum Dhuhur dan empat rakaat sesudahnya, Allah haramkan dia atas api neraka.",
    reference: "HR. Abu Dawud & Tirmidzi",
    timeCondition: (times, now) => {
      const dhuhrStart = times.dhuhr - 0.25; // 15 minutes before Dhuhr
      const nowHours = now.h + now.m/60 + now.s/3600;
      return nowHours >= dhuhrStart && nowHours < times.dhuhr;
    },
    timeDescription: "Sebelum sholat Dzuhur"
  },
  {
    name: "Sunnah Dzuhur (Ba'diyah)",
    arabic: "مَا مِن عَبدٍ مُسلِمٍ يُصَلِّي لِلَّهِ كُلَّ يَومٍ ثِنتَي عَشرَةَ رَكعَةً تَطَوُّعًا غَيرَ فَريضَةٍ إِلاَّ بَنَى اللَّهُ لَهُ بَيتًا في الجَنَّةِ",
    indonesia: "Tidaklah seorang hamba muslim yang shalat kepada Allah setiap hari dua belas rakaat sunnah selain yang fardhu, melainkan Allah membangunkan untuknya rumah di surga.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      const dhuhrEnd = times.dhuhr + 0.25; // 15 minutes after Dhuhr
      const asrStart = times.asr - 0.25; // 15 minutes before Asr
      const nowHours = now.h + now.m/60 + now.s/3600;
      return nowHours >= times.dhuhr && nowHours <= Math.min(dhuhrEnd, asrStart);
    },
    timeDescription: "Setelah sholat Dzuhur"
  },
  {
    name: "Sunnah Maghrib (Ba'diyah)",
    arabic: "إِذَا صَلَّى أَحَدُكُمُ الْمَغْرِبَ فَلْيُصَلِّ بَعْدَهَا رَكْعَتَيْنِ",
    indonesia: "Apabila salah seorang di antara kalian shalat Maghrib, hendaklah ia shalat dua rakaat sesudahnya.",
    reference: "HR. Abu Dawud",
    timeCondition: (times, now) => {
      const maghribEnd = times.maghrib + 0.25; // 15 minutes after Maghrib
      const ishaStart = times.isha - 0.25; // 15 minutes before Isha
      const nowHours = now.h + now.m/60 + now.s/3600;
      return nowHours >= times.maghrib && nowHours <= Math.min(maghribEnd, ishaStart);
    },
    timeDescription: "Setelah sholat Maghrib"
  },
  {
    name: "Sholat Witir",
    arabic: "الْوِتْرُ حَقٌّ فَمَن لَم يُوتِرْ فَلَيْسَ مِنَّا",
    indonesia: "Witir itu haq (kewajiban), barangsiapa yang tidak melakukan witir maka dia bukan dari golongan kami.",
    reference: "HR. Abu Dawud",
    timeCondition: (times, now) => {
      const witrStart = times.isha + 0.25; // 15 minutes after Isha
      const fajrStart = times.fajr - 0.25; // 15 minutes before Fajr (next day)
      const nowHours = now.h + now.m/60 + now.s/3600;
      return nowHours >= witrStart || nowHours <= fajrStart;
    },
    timeDescription: "Setelah Isya hingga sebelum Subuh"
  },
  {
    name: "Tahajjud",
    arabic: "أَقْرَبُ مَا يَكُونُ الرَّبُّ إِلَى الْعَبْدِ فِي جَوْفِ اللَّيْلِ الآخِرِ",
    indonesia: "Keadaan paling dekat antara Rabb dengan hamba adalah pada pertengahan malam terakhir.",
    reference: "HR. Tirmidzi",
    timeCondition: (times, now) => {
      const nightStart = times.isha + 0.5; // 30 minutes after Isha
      const nightEnd = times.fajr - 0.25; // 15 minutes before Fajr
      const nowHours = now.h + now.m/60 + now.s/3600;
      // Third part of night (for tahajjud specifically)
      const thirdNightStart = nightStart + ((nightEnd + 24 - nightStart) * 2/3) % 24;
      return (nowHours >= thirdNightStart) || (nowHours <= nightEnd);
    },
    timeDescription: "Sepertiga malam terakhir"
  },
  {
    name: "Sunnah Isya (Ba'diyah)",
    arabic: "كَانَ النَّبِيُّ لاَ يَدَعُ أَرْبَعًا قَبْلَ الظُّهْرِ وَرَكْعَتَيْنِ قَبْلَ الْغَدَاةِ",
    indonesia: "Nabi tidak pernah meninggalkan empat rakaat sebelum Dhuhur dan dua rakaat sebelum Subuh.",
    reference: "HR. Bukhari",
    timeCondition: (times, now) => {
      const ishaEnd = times.isha + 0.25; // 15 minutes after Isha
      const witrStart = times.isha + 1; // 1 hour after Isha (before witr time)
      const nowHours = now.h + now.m/60 + now.s/3600;
      return nowHours >= times.isha && nowHours <= Math.min(ishaEnd, witrStart);
    },
    timeDescription: "Setelah sholat Isya"
  }
];

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = sunnahHadithCollection;
}