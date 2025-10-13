// Koleksi Hadith Shahih tentang Sholat Sunnah

const sunnahHadithCollection = [
  {
    name: "Sunnah Subuh (Qabliyah)",
    arabic: "رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا",
    indonesia: "Dua rakaat sunnah Subuh lebih baik daripada dunia dan segala isinya.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      // Sunnah Subuh: sejak masuk waktu Subuh hingga terbit matahari
      // Hanya valid di pagi hari sebelum sunrise
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Validasi logis: fajr harus sebelum sunrise
      if (times.fajr < times.sunrise) {
        return nowHours >= times.fajr && nowHours < times.sunrise;
      } else {
        // Jika ada masalah data, return false
        return false;
      }
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
      // Hanya berlaku di pagi hari (6-12 siang)
      const dhuhaStart = times.sunrise + 0.25; // 15 menit setelah terbit
      const dhuhaEnd = times.dhuhr; // Hingga sebelum Dzuhur
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Validasi ketat: Dhuha hanya di pagi hari
      // Sunrise biasanya 5-7 AM, Dhuhr biasanya 11-13 PM
      if (nowHours >= 6 && nowHours <= 13 && 
          dhuhaStart >= 5 && dhuhaStart <= 8 && 
          dhuhaEnd >= 11 && dhuhaEnd <= 14) {
        return nowHours >= dhuhaStart && nowHours < dhuhaEnd;
      }
      return false;
    },
    timeDescription: "15 menit setelah terbit hingga sebelum Dzuhur"
  },
  {
    name: "Sunnah Dzuhur (Qabliyah)",
    arabic: "مَن حَافَظَ عَلَى أَرْبَعِ رَكَعَاتٍ قَبْلَ الظُّهْرِ وَأَرْبَعٍ بَعْدَهَا حَرَّمَهُ اللَّهُ عَلَى النَّارِ",
    indonesia: "Barangsiapa yang menjaga empat rakaat sebelum Dhuhur dan empat rakaat sesudahnya, Allah haramkan dia atas api neraka.",
    reference: "HR. Abu Dawud & Tirmidzi",
    timeCondition: (times, now) => {
      // Sunnah Qabliyah Dzuhur: sejak masuk waktu Dzuhur hingga sebelum Ashar
      // Validasi bahwa kita di siang hari, bukan malam
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Validasi logis: dhuhr harus sebelum asr
      if (times.dhuhr < times.asr) {
        return nowHours >= times.dhuhr && nowHours < times.asr;
      } else {
        return false;
      }
    },
    timeDescription: "Sejak masuk waktu Dzuhur hingga sebelum Ashar"
  },
  {
    name: "Sunnah Dzuhur (Ba'diyah)",
    arabic: "مَا مِن عَبدٍ مُسلِمٍ يُصَلِّي لِلَّهِ كُلَّ يَومٍ ثِنتَي عَشرَةَ رَكعَةً تَطَوُّعًا غَيرَ فَريضَةٍ إِلاَّ بَنَى اللَّهُ لَهُ بَيتًا في الجَنَّةِ",
    indonesia: "Tidaklah seorang hamba muslim yang shalat kepada Allah setiap hari dua belas rakaat sunnah selain yang fardhu, melainkan Allah membangunkan untuknya rumah di surga.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      // Sunnah Ba'diyah Dzuhur: setelah sholat Dzuhur hingga sebelum Ashar
      // Validasi bahwa kita di siang hari
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Validasi logis: dhuhr harus sebelum asr
      if (times.dhuhr < times.asr) {
        return nowHours >= times.dhuhr && nowHours < times.asr;
      } else {
        return false;
      }
    },
    timeDescription: "Setelah sholat Dzuhur hingga sebelum Ashar"
  },
  {
    name: "Sunnah Maghrib (Ba'diyah)",
    arabic: "إِذَا صَلَّى أَحَدُكُمُ الْمَغْرِبَ فَلْيُصَلِّ بَعْدَهَا رَكْعَتَيْنِ",
    indonesia: "Apabila salah seorang di antara kalian shalat Maghrib, hendaklah ia shalat dua rakaat sesudahnya.",
    reference: "HR. Abu Dawud",
    timeCondition: (times, now) => {
      // Sunnah Ba'diyah Maghrib: setelah sholat Maghrib hingga sebelum Isya
      // Validasi bahwa kita di sore hari
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Validasi logis: maghrib harus sebelum isha
      if (times.maghrib < times.isha) {
        return nowHours >= times.maghrib && nowHours < times.isha;
      } else {
        return false;
      }
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
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Witir bisa dilakukan setelah Isya (biasanya sekitar 19:00-20:00)
      // hingga sebelum Fajr (biasanya sekitar 04:00-05:00)
      
      // Case 1: Setelah Isya di hari yang sama (19:00-24:00)
      if (nowHours >= times.isha && nowHours < 24) {
        return true;
      }
      
      // Case 2: Sebelum Fajr di hari berikutnya (00:00 - Fajr)
      if (nowHours >= 0 && nowHours < times.fajr) {
        return true;
      }
      
      return false;
    },
    timeDescription: "Setelah Isya hingga sebelum Subuh"
  },
  {
    name: "Tahajjud",
    arabic: "أَقْرَبُ مَا يَكُونُ الرَّبُّ إِلَى الْعَبْدِ فِي جَوْفِ اللَّيْلِ الآخِرِ",
    indonesia: "Keadaan paling dekat antara Rabb dengan hamba adalah pada pertengahan malam terakhir.",
    reference: "HR. Tirmidzi",
    timeCondition: (times, now) => {
      // Sholat Tahajjud: sepertiga malam terakhir (biasanya 01:00-04:00)
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Tahajjud waktu yang tepat adalah sepertiga malam terakhir
      // Untuk kemudahan, kita set mulai pukul 01:00 hingga sebelum Fajr
      
      // Case 1: Dini hari (01:00 - Fajr)
      if (nowHours >= 1 && nowHours < times.fajr) {
        return true;
      }
      
      // Case 2: Tengah malam lewat (23:00 - 24:00) - untuk yang suka tahajjud lebih awal
      if (nowHours >= 23 && nowHours < 24) {
        return true;
      }
      
      return false;
    },
    timeDescription: "Sepertiga malam terakhir (waktu mustajab)"
  },
  {
    name: "Sunnah Isya (Ba'diyah)",
    arabic: "كَانَ النَّبِيُّ لاَ يَدَعُ أَرْبَعًا قَبْلَ الظُّهْرِ وَرَكْعَتَيْنِ قَبْلَ الْغَدَاةِ",
    indonesia: "Nabi tidak pernah meninggalkan empat rakaat sebelum Dhuhur dan dua rakaat sebelum Subuh.",
    reference: "HR. Bukhari",
    timeCondition: (times, now) => {
      // Sunnah Ba'diyah Isya: setelah sholat Isya hingga sebelum Witir
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Ba'diyah Isya bisa dilakukan setelah Isya hingga maksimal 2 jam setelahnya
      const isyaEnd = times.isha + 2; // 2 jam setelah Isya
      
      // Case 1: Same day (Isya hingga Isya + 2 jam, tidak melewati tengah malam)
      if (isyaEnd <= 24) {
        return nowHours >= times.isha && nowHours <= isyaEnd;
      }
      
      // Case 2: Cross midnight (Isya + 2 jam melewati tengah malam)
      const nextDayEnd = isyaEnd - 24;
      if (nowHours >= times.isha || (nowHours >= 0 && nowHours <= nextDayEnd)) {
        return true;
      }
      
      return false;
    },
    timeDescription: "Setelah sholat Isya (sebelum Witir)"
  }
];

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = sunnahHadithCollection;
}