// Koleksi Hadith Shahih tentang Sholat Sunnah
// Collection of Authentic Hadith about Sunnah Prayers

const sunnahHadithCollection = [
  {
    name: "Sunnah Subuh (Qabliyah)",
    arabic: "رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا",
    indonesia: "Dua rakaat sunnah Subuh lebih baik daripada dunia dan segala isinya.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      // Sunnah Subuh: sejak masuk waktu Subuh hingga sebelum sholat Subuh dilakukan
      // Bisa dilakukan kapan saja selama waktu Subuh belum terlewat
      const nowHours = now.h + now.m/60 + now.s/3600;
      return nowHours >= times.fajr && nowHours < times.sunrise;
    },
    timeDescription: "Sejak masuk waktu Subuh hingga terbit matahari"
  },
  {
    name: "Sholat Dhuha",
    arabic: "مَن صَلَّى الضُّحَى أَرْبَعَ رَكَعَاتٍ وَقَبْلَ الأُولَى أَرْبَعَ رَكَعَاتٍ بُنِيَ لَهُ بَيْتٌ فِي الْجَنَّةِ",
    indonesia: "Barangsiapa yang shalat Dhuha empat rakaat dan sebelum Dhuhur empat rakaat, maka dibangunkan untuknya rumah di surga.",
    reference: "HR. Tirmidzi",
    timeCondition: (times, now) => {
      // Sholat Dhuha: 15 menit setelah matahari terbit hingga sebelum sholat Dzuhur
      // Waktu utama: ketika matahari naik setinggi tombak (sekitar 7-8 meter)
      const dhuhaStart = times.sunrise + 0.25; // 15 menit setelah terbit
      const dhuhaEnd = times.dhuhr; // Hingga sebelum Dzuhur (tanpa batasan 15 menit)
      const nowHours = now.h + now.m/60 + now.s/3600;
      return nowHours >= dhuhaStart && nowHours < dhuhaEnd;
    },
    timeDescription: "15 menit setelah terbit hingga sebelum Dzuhur"
  },
  {
    name: "Sunnah Dzuhur (Qabliyah)",
    arabic: "مَن حَافَظَ عَلَى أَرْبَعِ رَكَعَاتٍ قَبْلَ الظُّهْرِ وَأَرْبَعٍ بَعْدَهَا حَرَّمَهُ اللَّهُ عَلَى النَّارِ",
    indonesia: "Barangsiapa yang menjaga empat rakaat sebelum Dhuhur dan empat rakaat sesudahnya, Allah haramkan dia atas api neraka.",
    reference: "HR. Abu Dawud & Tirmidzi",
    timeCondition: (times, now) => {
      // Sunnah Qabliyah Dzuhur: sejak masuk waktu Dzuhur hingga sebelum sholat Dzuhur dilakukan
      // Bisa dilakukan kapan saja selama waktu Dzuhur belum terlewat
      const nowHours = now.h + now.m/60 + now.s/3600;
      return nowHours >= times.dhuhr && nowHours < times.asr;
    },
    timeDescription: "Sejak masuk waktu Dzuhur hingga sebelum Ashar"
  },
  {
    name: "Sunnah Dzuhur (Ba'diyah)",
    arabic: "مَا مِن عَبدٍ مُسلِمٍ يُصَلِّي لِلَّهِ كُلَّ يَومٍ ثِنتَي عَشرَةَ رَكعَةً تَطَوُّعًا غَيرَ فَريضَةٍ إِلاَّ بَنَى اللَّهُ لَهُ بَيتًا في الجَنَّةِ",
    indonesia: "Tidaklah seorang hamba muslim yang shalat kepada Allah setiap hari dua belas rakaat sunnah selain yang fardhu, melainkan Allah membangunkan untuknya rumah di surga.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      // Sunnah Ba'diyah Dzuhur: setelah sholat Dzuhur hingga sebelum masuk waktu Ashar
      // Waktu yang lebih baik: segera setelah sholat Dzuhur
      const nowHours = now.h + now.m/60 + now.s/3600;
      return nowHours >= times.dhuhr && nowHours < times.asr;
    },
    timeDescription: "Setelah sholat Dzuhur hingga sebelum Ashar"
  },
  {
    name: "Sunnah Maghrib (Ba'diyah)",
    arabic: "إِذَا صَلَّى أَحَدُكُمُ الْمَغْرِبَ فَلْيُصَلِّ بَعْدَهَا رَكْعَتَيْنِ",
    indonesia: "Apabila salah seorang di antara kalian shalat Maghrib, hendaklah ia shalat dua rakaat sesudahnya.",
    reference: "HR. Abu Dawud",
    timeCondition: (times, now) => {
      // Sunnah Ba'diyah Maghrib: setelah sholat Maghrib hingga sebelum masuk waktu Isya
      // Waktu yang lebih baik: segera setelah sholat Maghrib
      const nowHours = now.h + now.m/60 + now.s/3600;
      return nowHours >= times.maghrib && nowHours < times.isha;
    },
    timeDescription: "Setelah sholat Maghrib hingga sebelum Isya"
  },
  {
    name: "Sholat Witir",
    arabic: "الْوِتْرُ حَقٌّ فَمَن لَم يُوتِرْ فَلَيْسَ مِنَّا",
    indonesia: "Witir itu haq (kewajiban), barangsiapa yang tidak melakukan witir maka dia bukan dari golongan kami.",
    reference: "HR. Abu Dawud",
    timeCondition: (times, now) => {
      // Sholat Witir: setelah Isya hingga sebelum Subuh
      // Waktu terbaik: sepertiga malam terakhir atau sebelum tidur
      const nowHours = now.h + now.m/60 + now.s/3600;
      // Dari setelah Isya sampai sebelum Subuh (menggunakan logika 24 jam)
      if (times.isha < times.fajr) {
        // Normal case: Isha dan Fajr di hari yang sama
        return nowHours >= times.isha && nowHours < times.fajr;
      } else {
        // Cross midnight case: Fajr di hari berikutnya
        return nowHours >= times.isha || nowHours < times.fajr;
      }
    },
    timeDescription: "Setelah Isya hingga sebelum Subuh"
  },
  {
    name: "Tahajjud",
    arabic: "أَقْرَبُ مَا يَكُونُ الرَّبُّ إِلَى الْعَبْدِ فِي جَوْفِ اللَّيْلِ الآخِرِ",
    indonesia: "Keadaan paling dekat antara Rabb dengan hamba adalah pada pertengahan malam terakhir.",
    reference: "HR. Tirmidzi",
    timeCondition: (times, now) => {
      // Tahajjud: sepertiga malam terakhir (waktu terbaik untuk tahajjud)
      // Dihitung dari tengah malam hingga sebelum Subuh
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Hitung durasi malam (dari Isya sampai Fajr)
      let nightDuration;
      if (times.fajr > times.isha) {
        nightDuration = times.fajr - times.isha;
      } else {
        nightDuration = (24 - times.isha) + times.fajr;
      }
      
      // Sepertiga malam terakhir dimulai 2/3 setelah Isya
      const tahajjudStart = (times.isha + (nightDuration * 2/3)) % 24;
      
      if (tahajjudStart < times.fajr) {
        return nowHours >= tahajjudStart && nowHours < times.fajr;
      } else {
        return nowHours >= tahajjudStart || nowHours < times.fajr;
      }
    },
    timeDescription: "Sepertiga malam terakhir (waktu mustajab)"
  },
  {
    name: "Sunnah Isya (Ba'diyah)",
    arabic: "كَانَ النَّبِيُّ لاَ يَدَعُ أَرْبَعًا قَبْلَ الظُّهْرِ وَرَكْعَتَيْنِ قَبْلَ الْغَدَاةِ",
    indonesia: "Nabi tidak pernah meninggalkan empat rakaat sebelum Dhuhur dan dua rakaat sebelum Subuh.",
    reference: "HR. Bukhari",
    timeCondition: (times, now) => {
      // Sunnah Ba'diyah Isya: setelah sholat Isya hingga sebelum tidur
      // Waktu yang baik: segera setelah sholat Isya sebelum sholat Witir
      const nowHours = now.h + now.m/60 + now.s/3600;
      const isyaPlus1Hour = (times.isha + 1) % 24; // 1 jam setelah Isya
      
      if (times.isha < isyaPlus1Hour) {
        return nowHours >= times.isha && nowHours < isyaPlus1Hour;
      } else {
        return nowHours >= times.isha || nowHours < isyaPlus1Hour;
      }
    },
    timeDescription: "Setelah sholat Isya (sebelum Witir)"
  }
];

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = sunnahHadithCollection;
}