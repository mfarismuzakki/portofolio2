// Koleksi Hadith Shahi  {

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
    arabic: "وَيُجْزِئُ مِنْ ذَلِكَ رَكْعَتَانِ يَرْكَعُهُمَا مِنَ الضُّحَى",
    indonesia: "Pada pagi hari diwajibkan bagi seluruh persendian di antara kalian untuk bersedekah. Ini semua bisa dicukupi dengan melaksanakan shalat Dhuha sebanyak 2 rakaat.",
    reference: "HR. Muslim no. 1704",
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
    arabic: "إِنَّ اللَّهَ أَمَدَّكُمْ بِصَلاَةٍ هِيَ خَيْرٌ لَكُمْ مِنْ حُمْرِ النَّعَمِ الْوِتْرُ جَعَلَهُ اللَّهُ لَكُمْ فِيمَا بَيْنَ صَلاَةِ الْعِشَاءِ إِلَى أَنْ يَطْلُعَ الْفَجْرُ",
    indonesia: "Sesungguhnya Allah menambah bagi kalian shalat yang lebih baik bagi kalian ketimbang memiliki onta merah, yaitu shalat witir. Allah meletakkannya antara shalat Isya sampai terbitnya fajar.",
    reference: "HR. at-Tirmidzi",
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
    arabic: "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ اْلآخِرُ، يَقُولُ: مَنْ يَدْعُونِي فَأَسْتَجِيبَ لَهُ، مَنْ يَسْأَلُنِي فَأُعْطِيَهُ، مَنْ يَسْتَغْفِرُنِي فَأَغْفِرُ لَهُ",
    indonesia: "Rabb kami turun ke langit dunia pada setiap malam ketika tinggal sepertiga malam terakhir, lalu berfirman: 'Barangsiapa yang berdo'a kepada-Ku, niscaya akan Aku kabulkan do'anya, barangsiapa yang meminta kepada-Ku, niscaya Aku akan penuhi permintaannya, dan barangsiapa yang memohon ampunan kepada-Ku, maka Aku akan mengampuninya.'",
    reference: "HR. Bukhari",
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
    arabic: "صَلَّيْتُ مَعَ النَّبيِّ – صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ – رَكْعَتَيْنِ بَعْدَ العِشَاءِ ، وَ بَيْنَ كُلِّ أذَانَيْنِ صَلاةٌ",
    indonesia: "Aku shalat bersama Nabi dua rakaat ba'diyah Isya. Dan antara dua azan terdapat shalat sunnah.",
    reference: "HR. Bukhari dan Muslim",
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