// Koleksi Hadith Shahi  {

const sunnahHadithCollection = [
  {
    name: "Sunnah Subuh (Qabliyah)",
    arabic: "رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا",
    indonesia: "Dua rakaat sunnah Subuh lebih baik daripada dunia dan segala isinya.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      // Sunnah Subuh: sejak masuk waktu Subuh hingga terbit matahari
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Handle +24 hours case
      let fajrTime = times.fajr;
      let sunriseTime = times.sunrise;
      
      if (times.fajr > 24) fajrTime = times.fajr - 24;
      if (times.sunrise > 24) sunriseTime = times.sunrise - 24;
      
      // Validasi logis: fajr harus sebelum sunrise
      if (fajrTime < sunriseTime && !isNaN(fajrTime) && !isNaN(sunriseTime)) {
        return nowHours >= fajrTime && nowHours < sunriseTime;
      }
      
      return false;
    },
    timeDescription: "Sejak masuk waktu Subuh hingga terbit matahari"
  },
  {
    name: "Sholat Dhuha",
    arabic: "وَيُجْزِئُ مِنْ ذَلِكَ رَكْعَتَانِ يَرْكَعُهُمَا مِنَ الضُّحَى",
    indonesia: "Pada pagi hari diwajibkan bagi seluruh persendian di antara kalian untuk bersedekah. Ini semua bisa dicukupi dengan melaksanakan shalat Dhuha sebanyak 2 rakaat.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      // Sholat Dhuha: 15 menit setelah matahari terbit hingga 30 menit sebelum Dzuhur
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Handle +24 hours case
      let sunriseTime = times.sunrise;
      let dhuhrTime = times.dhuhr;
      
      if (times.sunrise > 24) sunriseTime = times.sunrise - 24;
      if (times.dhuhr > 24) dhuhrTime = times.dhuhr - 24;
      
      // Validasi data waktu sholat tersedia
      if (isNaN(sunriseTime) || isNaN(dhuhrTime)) {
        return false;
      }
      
      const dhuhaStart = sunriseTime + 0.25; // 15 menit setelah terbit matahari
      const dhuhaEnd = dhuhrTime - 0.5; // 30 menit sebelum Dzuhur
      
      // Pastikan ada jarak waktu yang logis antara sunrise dan dhuhr (minimal 3 jam)
      const timeGap = dhuhrTime - sunriseTime;
      if (timeGap < 3 || timeGap > 8) {
        return false; // Data tidak valid
      }
      
      // Dhuha valid dari 15 menit setelah sunrise hingga 30 menit sebelum dhuhr
      return nowHours >= dhuhaStart && nowHours <= dhuhaEnd;
    },
    timeDescription: "15 menit setelah terbit matahari hingga 30 menit sebelum Dzuhur"
  },
  {
    name: "Sunnah Dzuhur (Qabliyah)",
    arabic: "مَن حَافَظَ عَلَى أَرْبَعِ رَكَعَاتٍ قَبْلَ الظُّهْرِ وَأَرْبَعٍ بَعْدَهَا حَرَّمَهُ اللَّهُ عَلَى النَّارِ",
    indonesia: "Barangsiapa yang menjaga empat rakaat sebelum Dhuhur dan empat rakaat sesudahnya, Allah haramkan dia atas api neraka.",
    reference: "HR. Abu Dawud & At-Tirmidzi",
    timeCondition: (times, now) => {
      // Sunnah Qabliyah Dzuhur: setelah Dhuha selesai hingga sebelum waktu Dzuhur masuk
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Handle +24 hours case
      let sunriseTime = times.sunrise;
      let dhuhrTime = times.dhuhr;
      
      if (times.sunrise > 24) sunriseTime = times.sunrise - 24;
      if (times.dhuhr > 24) dhuhrTime = times.dhuhr - 24;
      
      // Validasi data waktu sholat tersedia
      if (isNaN(sunriseTime) || isNaN(dhuhrTime)) {
        return false;
      }
      
      // Qabliyah Dzuhur dimulai setelah waktu Dhuha selesai (30 menit sebelum Dzuhur)
      // hingga tepat sebelum waktu Dzuhur masuk
      const qabliyahStart = dhuhrTime - 0.5; // 30 menit sebelum Dzuhur
      
      return nowHours >= qabliyahStart && nowHours < dhuhrTime;
    },
    timeDescription: "30 menit sebelum waktu Dzuhur masuk"
  },
  {
    name: "Sunnah Dzuhur (Ba'diyah)",
    arabic: "مَا مِن عَبدٍ مُسلِمٍ يُصَلِّي لِلَّهِ كُلَّ يَومٍ ثِنتَي عَشرَةَ رَكعَةً تَطَوُّعًا غَيرَ فَريضَةٍ إِلاَّ بَنَى اللَّهُ لَهُ بَيتًا في الجَنَّةِ",
    indonesia: "Tidaklah seorang hamba muslim yang shalat kepada Allah setiap hari dua belas rakaat sunnah selain yang fardhu, melainkan Allah membangunkan untuknya rumah di surga.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      // Sunnah Ba'diyah Dzuhur: setelah sholat Dzuhur hingga sebelum Ashar
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Handle +24 hours case
      let dhuhrTime = times.dhuhr;
      let asrTime = times.asr;
      
      if (times.dhuhr > 24) dhuhrTime = times.dhuhr - 24;
      if (times.asr > 24) asrTime = times.asr - 24;
      
      // Validasi logis: dhuhr harus sebelum asr
      if (dhuhrTime < asrTime && !isNaN(dhuhrTime) && !isNaN(asrTime)) {
        return nowHours >= dhuhrTime && nowHours < asrTime;
      }
      
      return false;
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
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Handle +24 hours case
      let maghribTime = times.maghrib;
      let isyaTime = times.isha;
      
      if (times.maghrib > 24) maghribTime = times.maghrib - 24;
      if (times.isha > 24) isyaTime = times.isha - 24;
      
      // Validasi logis: maghrib harus sebelum isha
      if (maghribTime < isyaTime && !isNaN(maghribTime) && !isNaN(isyaTime)) {
        return nowHours >= maghribTime && nowHours < isyaTime;
      }
      
      return false;
    },
    timeDescription: "Setelah sholat Maghrib hingga sebelum Isya"
  },
  {
    name: "Sholat Witir",
    arabic: "إِنَّ اللَّهَ أَمَدَّكُمْ بِصَلاَةٍ هِيَ خَيْرٌ لَكُمْ مِنْ حُمْرِ النَّعَمِ الْوِتْرُ جَعَلَهُ اللَّهُ لَكُمْ فِيمَا بَيْنَ صَلاَةِ الْعِشَاءِ إِلَى أَنْ يَطْلُعَ الْفَجْرُ",
    indonesia: "Sesungguhnya Allah menambah bagi kalian shalat yang lebih baik bagi kalian ketimbang memiliki onta merah, yaitu shalat witir. Allah meletakkannya antara shalat Isya sampai terbitnya fajar.",
    reference: "HR. At-Tirmidzi",
    timeCondition: (times, now) => {
      // Sholat Witir: setelah Isya hingga sebelum Subuh
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Handle +24 hours case
      let isyaTime = times.isha;
      let fajrTime = times.fajr;
      
      if (times.isha > 24) isyaTime = times.isha - 24;
      if (times.fajr > 24) fajrTime = times.fajr - 24;
      
      // Validasi data tersedia
      if (isNaN(isyaTime) || isNaN(fajrTime)) {
        return false;
      }
      
      // Case 1: Setelah Isya di hari yang sama hingga tengah malam
      if (nowHours >= isyaTime && nowHours < 24) {
        return true;
      }
      
      // Case 2: Sebelum Fajr di hari berikutnya (00:00 - Fajr)
      if (nowHours >= 0 && nowHours < fajrTime) {
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
    reference: "HR. Al-Bukhari",
    timeCondition: (times, now) => {
      // Tahajjud: setelah Isya hingga sebelum Fajr (dengan penekanan pada sepertiga malam terakhir)
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Handle +24 hours case
      let isyaTime = times.isha;
      let fajrTime = times.fajr;
      
      if (times.isha > 24) isyaTime = times.isha - 24;
      if (times.fajr > 24) fajrTime = times.fajr - 24;
      
      // Validasi data tersedia
      if (isNaN(isyaTime) || isNaN(fajrTime)) {
        return false;
      }
      
      // Case 1: Setelah Isya di hari yang sama hingga tengah malam
      if (nowHours >= isyaTime && nowHours < 24) {
        return true;
      }
      
      // Case 2: Dini hari hingga sebelum Fajr (00:00 - Fajr)
      if (nowHours >= 0 && nowHours < fajrTime) {
        return true;
      }
      
      return false;
    },
    timeDescription: "Setelah Isya hingga sebelum Fajr (terbaik: sepertiga malam terakhir)"
  },
  {
    name: "Sunnah Isya (Ba'diyah)",
    arabic: "صَلَّيْتُ مَعَ النَّبيِّ – صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ – رَكْعَتَيْنِ بَعْدَ العِشَاءِ ، وَ بَيْنَ كُلِّ أذَانَيْنِ صَلاةٌ",
    indonesia: "Aku shalat bersama Nabi dua rakaat ba'diyah Isya. Dan antara dua azan terdapat shalat sunnah.",
    reference: "HR. Al-Bukhari dan Muslim",
    timeCondition: (times, now) => {
      // Sunnah Ba'diyah Isya: setelah sholat Isya hingga tengah malam
      // Berdasarkan pendapat Imam an-Nawawi, Ibn Qudamah, dan Syaikh Abdul Aziz bin Baz
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      // Validasi data waktu sholat tersedia
      if (isNaN(times.isha)) {
        return false;
      }
      
      // Tengah malam adalah pukul 24:00 (0:00 hari berikutnya)
      // Ba'diyah Isya dimulai setelah waktu Isya hingga tengah malam (00:00)
      
      let isyaTime = times.isha;
      
      // Handle case when prayer times use tomorrow's schedule (+24 hours)
      if (times.isha > 24) {
        // Convert back to today's time by subtracting 24
        isyaTime = times.isha - 24;
      }
      
      // Ba'diyah Isya valid from after today's Isya until midnight (24:00)
      return nowHours >= isyaTime && nowHours < 24;
    },
    timeDescription: "Setelah sholat Isya hingga tengah malam"
  }
];

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = sunnahHadithCollection;
}