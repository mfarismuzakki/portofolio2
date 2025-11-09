// Koleksi Sholat Sunnah dengan Hadith Shahih
export const sunnahPrayersCollection = [
  {
    name: "Sunnah Subuh (Qabliyah)",
    arabic: "رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا",
    indonesia: "Dua rakaat sunnah Subuh lebih baik daripada dunia dan segala isinya.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      // Sunnah Subuh: sejak masuk waktu Subuh hingga terbit matahari
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      let fajrTime = times.fajr;
      let sunriseTime = times.sunrise;
      
      if (times.fajr > 24) fajrTime = times.fajr - 24;
      if (times.sunrise > 24) sunriseTime = times.sunrise - 24;
      
      if (fajrTime < sunriseTime && !isNaN(fajrTime) && !isNaN(sunriseTime)) {
        return nowHours >= fajrTime && nowHours < sunriseTime;
      }
      
      return false;
    },
    timeDescription: "Sejak masuk waktu Subuh hingga terbit matahari"
  },
  {
    name: "Sholat Dhuha",
    arabic: "يُصْبِحُ عَلَى كُلِّ سُلاَمَى مِنْ أَحَدِكُمْ صَدَقَةٌ فَكُلُّ تَسْبِيحَةٍ صَدَقَةٌ وَكُلُّ تَحْمِيدَةٍ صَدَقَةٌ وَكُلُّ تَهْلِيلَةٍ صَدَقَةٌ وَكُلُّ تَكْبِيرَةٍ صَدَقَةٌ وَأَمْرٌ بِالْمَعْرُوفِ صَدَقَةٌ وَنَهْىٌ عَنِ الْمُنْكَرِ صَدَقَةٌ وَيُجْزِئُ مِنْ ذَلِكَ رَكْعَتَانِ يَرْكَعُهُمَا مِنَ الضُّحَى",
    indonesia: "Pada pagi hari diwajibkan bagi seluruh persendian di antara kalian untuk bersedekah. Setiap tasbih adalah sedekah, setiap tahmid adalah sedekah, setiap tahlil adalah sedekah, setiap takbir adalah sedekah, amar ma'ruf adalah sedekah, dan nahi munkar adalah sedekah. Semua itu bisa dicukupi dengan melaksanakan dua rakaat shalat Dhuha.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      // Sholat Dhuha: 15 menit setelah matahari terbit hingga 30 menit sebelum Dzuhur
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      let sunriseTime = times.sunrise;
      let dhuhrTime = times.dhuhr;
      
      if (times.sunrise > 24) sunriseTime = times.sunrise - 24;
      if (times.dhuhr > 24) dhuhrTime = times.dhuhr - 24;
      
      if (isNaN(sunriseTime) || isNaN(dhuhrTime)) {
        return false;
      }
      
      const dhuhaStart = sunriseTime + 0.25; // 15 menit setelah terbit matahari
      const dhuhaEnd = dhuhrTime - 0.5; // 30 menit sebelum Dzuhur
      
      const timeGap = dhuhrTime - sunriseTime;
      if (timeGap < 3 || timeGap > 8) {
        return false;
      }
      
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
      // Sunnah Qabliyah Dzuhur: setelah masuk waktu Dzuhur hingga sebelum Ashar
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      let dhuhrTime = times.dhuhr;
      let asrTime = times.asr;
      
      if (times.dhuhr > 24) dhuhrTime = times.dhuhr - 24;
      if (times.asr > 24) asrTime = times.asr - 24;
      
      if (isNaN(dhuhrTime) || isNaN(asrTime)) {
        return false;
      }
      
      return nowHours >= dhuhrTime && nowHours < asrTime;
    },
    timeDescription: "Setelah masuk waktu Dzuhur hingga waktu Ashar"
  },
  {
    name: "Sunnah Dzuhur (Ba'diyah)",
    arabic: "مَا مِن عَبدٍ مُسلِمٍ يُصَلِّي لِلَّهِ كُلَّ يَومٍ ثِنتَي عَشرَةَ رَكعَةً تَطَوُّعًا غَيرَ فَريضَةٍ إِلاَّ بَنَى اللَّهُ لَهُ بَيتًا في الجَنَّةِ",
    indonesia: "Tidaklah seorang hamba muslim yang shalat kepada Allah setiap hari dua belas rakaat sunnah selain yang fardhu, melainkan Allah membangunkan untuknya rumah di surga.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      // Sunnah Ba'diyah Dzuhur: setelah sholat Dzuhur hingga sebelum Ashar
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      let dhuhrTime = times.dhuhr;
      let asrTime = times.asr;
      
      if (times.dhuhr > 24) dhuhrTime = times.dhuhr - 24;
      if (times.asr > 24) asrTime = times.asr - 24;
      
      if (isNaN(dhuhrTime) || isNaN(asrTime)) {
        return false;
      }
      
      return nowHours >= dhuhrTime && nowHours < asrTime;
    },
    timeDescription: "Setelah sholat Dzuhur hingga sebelum Ashar"
  },
  {
    name: "Sunnah Maghrib (Ba'diyah)",
    arabic: "مَا مِن عَبدٍ مُسلِمٍ يُصَلِّي لِلَّهِ كُلَّ يَومٍ ثِنتَي عَشرَةَ رَكعَةً تَطَوُّعًا غَيرَ فَريضَةٍ إِلاَّ بَنَى اللَّهُ لَهُ بَيتًا في الجَنَّةِ",
    indonesia: "Tidaklah seorang hamba muslim yang shalat kepada Allah setiap hari dua belas rakaat sunnah selain yang fardhu, melainkan Allah membangunkan untuknya rumah di surga.",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      // Sunnah Ba'diyah Maghrib: setelah sholat Maghrib hingga sebelum Isya
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      let maghribTime = times.maghrib;
      let ishaTime = times.isha;
      
      if (times.maghrib > 24) maghribTime = times.maghrib - 24;
      if (times.isha > 24) ishaTime = times.isha - 24;
      
      if (isNaN(maghribTime) || isNaN(ishaTime)) {
        return false;
      }
      
      return nowHours >= maghribTime && nowHours < ishaTime;
    },
    timeDescription: "Setelah sholat Maghrib hingga sebelum Isya"
  },
  {
    name: "Sholat Tahajud",
    arabic: "أَفْضَلُ الصَّلَاةِ بَعْدَ الْفَرِيضَةِ صَلَاةُ اللَّيْلِ",
    indonesia: "Shalat paling utama setelah shalat fardhu adalah shalat malam (tahajud).",
    reference: "HR. Muslim",
    timeCondition: (times, now) => {
      // Sholat Tahajud: setelah Isya hingga sebelum Subuh (lebih baik di sepertiga malam akhir)
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      let ishaTime = times.isha;
      let fajrTime = times.fajr;
      
      if (times.isha > 24) ishaTime = times.isha - 24;
      if (times.fajr > 24) fajrTime = times.fajr - 24;
      
      if (isNaN(ishaTime) || isNaN(fajrTime)) {
        return false;
      }
      
      // Handle transition through midnight
      if (ishaTime > fajrTime) {
        // Normal case: Isha is before midnight, Fajr is after midnight
        return nowHours >= ishaTime || nowHours < fajrTime;
      } else {
        // Unusual case
        return nowHours >= ishaTime && nowHours < fajrTime;
      }
    },
    timeDescription: "Setelah sholat Isya hingga sebelum Subuh (terbaik di sepertiga malam akhir)"
  },
  {
    name: "Sholat Witir",
    arabic: "إِنَّ اللَّهَ وِتْرٌ يُحِبُّ الْوِتْرَ فَأَوْتِرُوا يَا أَهْلَ الْقُرْآنِ",
    indonesia: "Sesungguhnya Allah itu Witir (ganjil) dan menyukai yang witir, maka shalatlah witir wahai ahli Al-Qur'an.",
    reference: "HR. Abu Dawud & At-Tirmidzi",
    timeCondition: (times, now) => {
      // Sholat Witir: setelah Isya hingga sebelum Subuh
      const nowHours = now.h + now.m/60 + now.s/3600;
      
      let ishaTime = times.isha;
      let fajrTime = times.fajr;
      
      if (times.isha > 24) ishaTime = times.isha - 24;
      if (times.fajr > 24) fajrTime = times.fajr - 24;
      
      if (isNaN(ishaTime) || isNaN(fajrTime)) {
        return false;
      }
      
      if (ishaTime > fajrTime) {
        return nowHours >= ishaTime || nowHours < fajrTime;
      } else {
        return nowHours >= ishaTime && nowHours < fajrTime;
      }
    },
    timeDescription: "Setelah sholat Isya hingga sebelum Subuh"
  }
];
