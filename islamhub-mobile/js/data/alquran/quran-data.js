/* ===== Al-Quran Data Structure ===== */

// Data surat dalam Al-Qur'an
const QURAN_SURAHS = [
    { number: 1, name: "Al-Fatihah", nameArabic: "الفاتحة", verses: 7, revelation: "Makkah", startPage: 1, endPage: 1 },
    { number: 2, name: "Al-Baqarah", nameArabic: "البقرة", verses: 286, revelation: "Madinah", startPage: 2, endPage: 49 },
    { number: 3, name: "Ali 'Imran", nameArabic: "آل عمران", verses: 200, revelation: "Madinah", startPage: 50, endPage: 76 },
    { number: 4, name: "An-Nisa'", nameArabic: "النساء", verses: 176, revelation: "Madinah", startPage: 77, endPage: 106 },
    { number: 5, name: "Al-Ma'idah", nameArabic: "المائدة", verses: 120, revelation: "Madinah", startPage: 106, endPage: 127 },
    { number: 6, name: "Al-An'am", nameArabic: "الأنعام", verses: 165, revelation: "Makkah", startPage: 128, endPage: 150 },
    { number: 7, name: "Al-A'raf", nameArabic: "الأعراف", verses: 206, revelation: "Makkah", startPage: 151, endPage: 176 },
    { number: 8, name: "Al-Anfal", nameArabic: "الأنفال", verses: 75, revelation: "Madinah", startPage: 177, endPage: 187 },
    { number: 9, name: "At-Taubah", nameArabic: "التوبة", verses: 129, revelation: "Madinah", startPage: 187, endPage: 207 },
    { number: 10, name: "Yunus", nameArabic: "يونس", verses: 109, revelation: "Makkah", startPage: 208, endPage: 221 },
    { number: 11, name: "Hud", nameArabic: "هود", verses: 123, revelation: "Makkah", startPage: 221, endPage: 235 },
    { number: 12, name: "Yusuf", nameArabic: "يوسف", verses: 111, revelation: "Makkah", startPage: 235, endPage: 248 },
    { number: 13, name: "Ar-Ra'd", nameArabic: "الرعد", verses: 43, revelation: "Madinah", startPage: 249, endPage: 255 },
    { number: 14, name: "Ibrahim", nameArabic: "ابراهيم", verses: 52, revelation: "Makkah", startPage: 255, endPage: 261 },
    { number: 15, name: "Al-Hijr", nameArabic: "الحجر", verses: 99, revelation: "Makkah", startPage: 262, endPage: 267 },
    { number: 16, name: "An-Nahl", nameArabic: "النحل", verses: 128, revelation: "Makkah", startPage: 267, endPage: 281 },
    { number: 17, name: "Al-Isra'", nameArabic: "الإسراء", verses: 111, revelation: "Makkah", startPage: 282, endPage: 293 },
    { number: 18, name: "Al-Kahf", nameArabic: "الكهف", verses: 110, revelation: "Makkah", startPage: 293, endPage: 304 },
    { number: 19, name: "Maryam", nameArabic: "مريم", verses: 98, revelation: "Makkah", startPage: 305, endPage: 312 },
    { number: 20, name: "Taha", nameArabic: "طه", verses: 135, revelation: "Makkah", startPage: 312, endPage: 322 },
    { number: 21, name: "Al-Anbiya'", nameArabic: "الأنبياء", verses: 112, revelation: "Makkah", startPage: 322, endPage: 331 },
    { number: 22, name: "Al-Hajj", nameArabic: "الحج", verses: 78, revelation: "Madinah", startPage: 332, endPage: 341 },
    { number: 23, name: "Al-Mu'minun", nameArabic: "المؤمنون", verses: 118, revelation: "Makkah", startPage: 342, endPage: 349 },
    { number: 24, name: "An-Nur", nameArabic: "النور", verses: 64, revelation: "Madinah", startPage: 350, endPage: 359 },
    { number: 25, name: "Al-Furqan", nameArabic: "الفرقان", verses: 77, revelation: "Makkah", startPage: 359, endPage: 366 },
    { number: 26, name: "Ash-Shu'ara'", nameArabic: "الشعراء", verses: 227, revelation: "Makkah", startPage: 367, endPage: 377 },
    { number: 27, name: "An-Naml", nameArabic: "النمل", verses: 93, revelation: "Makkah", startPage: 377, endPage: 385 },
    { number: 28, name: "Al-Qasas", nameArabic: "القصص", verses: 88, revelation: "Makkah", startPage: 385, endPage: 396 },
    { number: 29, name: "Al-'Ankabut", nameArabic: "العنكبوت", verses: 69, revelation: "Makkah", startPage: 396, endPage: 404 },
    { number: 30, name: "Ar-Rum", nameArabic: "الروم", verses: 60, revelation: "Makkah", startPage: 404, endPage: 411 },
    { number: 31, name: "Luqman", nameArabic: "لقمان", verses: 34, revelation: "Makkah", startPage: 411, endPage: 414 },
    { number: 32, name: "As-Sajdah", nameArabic: "السجدة", verses: 30, revelation: "Makkah", startPage: 415, endPage: 417 },
    { number: 33, name: "Al-Ahzab", nameArabic: "الأحزاب", verses: 73, revelation: "Madinah", startPage: 418, endPage: 427 },
    { number: 34, name: "Saba'", nameArabic: "سبإ", verses: 54, revelation: "Makkah", startPage: 428, endPage: 434 },
    { number: 35, name: "Fatir", nameArabic: "فاطر", verses: 45, revelation: "Makkah", startPage: 434, endPage: 440 },
    { number: 36, name: "Ya Sin", nameArabic: "يس", verses: 83, revelation: "Makkah", startPage: 440, endPage: 445 },
    { number: 37, name: "As-Saffat", nameArabic: "الصافات", verses: 182, revelation: "Makkah", startPage: 446, endPage: 453 },
    { number: 38, name: "Sad", nameArabic: "ص", verses: 88, revelation: "Makkah", startPage: 453, endPage: 458 },
    { number: 39, name: "Az-Zumar", nameArabic: "الزمر", verses: 75, revelation: "Makkah", startPage: 458, endPage: 467 },
    { number: 40, name: "Ghafir", nameArabic: "غافر", verses: 85, revelation: "Makkah", startPage: 467, endPage: 477 },
    { number: 41, name: "Fussilat", nameArabic: "فصلت", verses: 54, revelation: "Makkah", startPage: 477, endPage: 482 },
    { number: 42, name: "Ash-Shura", nameArabic: "الشورى", verses: 53, revelation: "Makkah", startPage: 483, endPage: 489 },
    { number: 43, name: "Az-Zukhruf", nameArabic: "الزخرف", verses: 89, revelation: "Makkah", startPage: 489, endPage: 496 },
    { number: 44, name: "Ad-Dukhan", nameArabic: "الدخان", verses: 59, revelation: "Makkah", startPage: 496, endPage: 499 },
    { number: 45, name: "Al-Jathiyah", nameArabic: "الجاثية", verses: 37, revelation: "Makkah", startPage: 499, endPage: 502 },
    { number: 46, name: "Al-Ahqaf", nameArabic: "الأحقاف", verses: 35, revelation: "Makkah", startPage: 502, endPage: 506 },
    { number: 47, name: "Muhammad", nameArabic: "محمد", verses: 38, revelation: "Madinah", startPage: 507, endPage: 511 },
    { number: 48, name: "Al-Fath", nameArabic: "الفتح", verses: 29, revelation: "Madinah", startPage: 511, endPage: 515 },
    { number: 49, name: "Al-Hujurat", nameArabic: "الحجرات", verses: 18, revelation: "Madinah", startPage: 515, endPage: 518 },
    { number: 50, name: "Qaf", nameArabic: "ق", verses: 45, revelation: "Makkah", startPage: 518, endPage: 521 },
    { number: 51, name: "Adh-Dhariyat", nameArabic: "الذاريات", verses: 60, revelation: "Makkah", startPage: 520, endPage: 523 },
    { number: 52, name: "At-Tur", nameArabic: "الطور", verses: 49, revelation: "Makkah", startPage: 523, endPage: 526 },
    { number: 53, name: "An-Najm", nameArabic: "النجم", verses: 62, revelation: "Makkah", startPage: 526, endPage: 528 },
    { number: 54, name: "Al-Qamar", nameArabic: "القمر", verses: 55, revelation: "Makkah", startPage: 528, endPage: 531 },
    { number: 55, name: "Ar-Rahman", nameArabic: "الرحمن", verses: 78, revelation: "Madinah", startPage: 531, endPage: 534 },
    { number: 56, name: "Al-Waqi'ah", nameArabic: "الواقعة", verses: 96, revelation: "Makkah", startPage: 534, endPage: 537 },
    { number: 57, name: "Al-Hadid", nameArabic: "الحديد", verses: 29, revelation: "Madinah", startPage: 537, endPage: 541 },
    { number: 58, name: "Al-Mujadilah", nameArabic: "المجادلة", verses: 22, revelation: "Madinah", startPage: 542, endPage: 545 },
    { number: 59, name: "Al-Hashr", nameArabic: "الحشر", verses: 24, revelation: "Madinah", startPage: 545, endPage: 548 },
    { number: 60, name: "Al-Mumtahanah", nameArabic: "الممتحنة", verses: 13, revelation: "Madinah", startPage: 548, endPage: 550 },
    { number: 61, name: "As-Saff", nameArabic: "الصف", verses: 14, revelation: "Madinah", startPage: 551, endPage: 552 },
    { number: 62, name: "Al-Jumu'ah", nameArabic: "الجمعة", verses: 11, revelation: "Madinah", startPage: 553, endPage: 554 },
    { number: 63, name: "Al-Munafiqun", nameArabic: "المنافقون", verses: 11, revelation: "Madinah", startPage: 554, endPage: 555 },
    { number: 64, name: "At-Taghabun", nameArabic: "التغابن", verses: 18, revelation: "Madinah", startPage: 556, endPage: 558 },
    { number: 65, name: "At-Talaq", nameArabic: "الطلاق", verses: 12, revelation: "Madinah", startPage: 558, endPage: 560 },
    { number: 66, name: "At-Tahrim", nameArabic: "التحريم", verses: 12, revelation: "Madinah", startPage: 560, endPage: 562 },
    { number: 67, name: "Al-Mulk", nameArabic: "الملك", verses: 30, revelation: "Makkah", startPage: 562, endPage: 564 },
    { number: 68, name: "Al-Qalam", nameArabic: "القلم", verses: 52, revelation: "Makkah", startPage: 564, endPage: 566 },
    { number: 69, name: "Al-Haqqah", nameArabic: "الحاقة", verses: 52, revelation: "Makkah", startPage: 566, endPage: 568 },
    { number: 70, name: "Al-Ma'arij", nameArabic: "المعارج", verses: 44, revelation: "Makkah", startPage: 568, endPage: 570 },
    { number: 71, name: "Nuh", nameArabic: "نوح", verses: 28, revelation: "Makkah", startPage: 570, endPage: 572 },
    { number: 72, name: "Al-Jinn", nameArabic: "الجن", verses: 28, revelation: "Makkah", startPage: 572, endPage: 574 },
    { number: 73, name: "Al-Muzzammil", nameArabic: "المزمل", verses: 20, revelation: "Makkah", startPage: 574, endPage: 575 },
    { number: 74, name: "Al-Muddaththir", nameArabic: "المدثر", verses: 56, revelation: "Makkah", startPage: 575, endPage: 577 },
    { number: 75, name: "Al-Qiyamah", nameArabic: "القيامة", verses: 40, revelation: "Makkah", startPage: 577, endPage: 578 },
    { number: 76, name: "Al-Insan", nameArabic: "الإنسان", verses: 31, revelation: "Madinah", startPage: 578, endPage: 580 },
    { number: 77, name: "Al-Mursalat", nameArabic: "المرسلات", verses: 50, revelation: "Makkah", startPage: 580, endPage: 582 },
    { number: 78, name: "An-Naba'", nameArabic: "النبإ", verses: 40, revelation: "Makkah", startPage: 582, endPage: 583 },
    { number: 79, name: "An-Nazi'at", nameArabic: "النازعات", verses: 46, revelation: "Makkah", startPage: 583, endPage: 585 },
    { number: 80, name: "Abasa", nameArabic: "عبس", verses: 42, revelation: "Makkah", startPage: 585, endPage: 586 },
    { number: 81, name: "At-Takwir", nameArabic: "التكوير", verses: 29, revelation: "Makkah", startPage: 586, endPage: 587 },
    { number: 82, name: "Al-Infitar", nameArabic: "الإنفطار", verses: 19, revelation: "Makkah", startPage: 587, endPage: 587 },
    { number: 83, name: "Al-Mutaffifin", nameArabic: "المطففين", verses: 36, revelation: "Makkah", startPage: 587, endPage: 589 },
    { number: 84, name: "Al-Inshiqaq", nameArabic: "الإنشقاق", verses: 25, revelation: "Makkah", startPage: 589, endPage: 590 },
    { number: 85, name: "Al-Buruj", nameArabic: "البروج", verses: 22, revelation: "Makkah", startPage: 590, endPage: 591 },
    { number: 86, name: "At-Tariq", nameArabic: "الطارق", verses: 17, revelation: "Makkah", startPage: 591, endPage: 591 },
    { number: 87, name: "Al-A'la", nameArabic: "الأعلى", verses: 19, revelation: "Makkah", startPage: 591, endPage: 592 },
    { number: 88, name: "Al-Ghashiyah", nameArabic: "الغاشية", verses: 26, revelation: "Makkah", startPage: 592, endPage: 592 },
    { number: 89, name: "Al-Fajr", nameArabic: "الفجر", verses: 30, revelation: "Makkah", startPage: 593, endPage: 594 },
    { number: 90, name: "Al-Balad", nameArabic: "البلد", verses: 20, revelation: "Makkah", startPage: 594, endPage: 594 },
    { number: 91, name: "Ash-Shams", nameArabic: "الشمس", verses: 15, revelation: "Makkah", startPage: 595, endPage: 595 },
    { number: 92, name: "Al-Layl", nameArabic: "الليل", verses: 21, revelation: "Makkah", startPage: 595, endPage: 595 },
    { number: 93, name: "Ad-Duha", nameArabic: "الضحى", verses: 11, revelation: "Makkah", startPage: 595, endPage: 596 },
    { number: 94, name: "Ash-Sharh", nameArabic: "الشرح", verses: 8, revelation: "Makkah", startPage: 596, endPage: 596 },
    { number: 95, name: "At-Tin", nameArabic: "التين", verses: 8, revelation: "Makkah", startPage: 597, endPage: 597 },
    { number: 96, name: "Al-'Alaq", nameArabic: "العلق", verses: 19, revelation: "Makkah", startPage: 597, endPage: 597 },
    { number: 97, name: "Al-Qadr", nameArabic: "القدر", verses: 5, revelation: "Makkah", startPage: 598, endPage: 598 },
    { number: 98, name: "Al-Bayyinah", nameArabic: "البينة", verses: 8, revelation: "Madinah", startPage: 598, endPage: 599 },
    { number: 99, name: "Az-Zalzalah", nameArabic: "الزلزلة", verses: 8, revelation: "Madinah", startPage: 599, endPage: 599 },
    { number: 100, name: "Al-'Adiyat", nameArabic: "العاديات", verses: 11, revelation: "Makkah", startPage: 599, endPage: 600 },
    { number: 101, name: "Al-Qari'ah", nameArabic: "القارعة", verses: 11, revelation: "Makkah", startPage: 600, endPage: 600 },
    { number: 102, name: "At-Takathur", nameArabic: "التكاثر", verses: 8, revelation: "Makkah", startPage: 600, endPage: 600 },
    { number: 103, name: "Al-'Asr", nameArabic: "العصر", verses: 3, revelation: "Makkah", startPage: 601, endPage: 601 },
    { number: 104, name: "Al-Humazah", nameArabic: "الهمزة", verses: 9, revelation: "Makkah", startPage: 601, endPage: 601 },
    { number: 105, name: "Al-Fil", nameArabic: "الفيل", verses: 5, revelation: "Makkah", startPage: 601, endPage: 601 },
    { number: 106, name: "Quraysh", nameArabic: "قريش", verses: 4, revelation: "Makkah", startPage: 602, endPage: 602 },
    { number: 107, name: "Al-Ma'un", nameArabic: "الماعون", verses: 7, revelation: "Makkah", startPage: 602, endPage: 602 },
    { number: 108, name: "Al-Kawthar", nameArabic: "الكوثر", verses: 3, revelation: "Makkah", startPage: 602, endPage: 602 },
    { number: 109, name: "Al-Kafirun", nameArabic: "الكافرون", verses: 6, revelation: "Makkah", startPage: 603, endPage: 603 },
    { number: 110, name: "An-Nasr", nameArabic: "النصر", verses: 3, revelation: "Madinah", startPage: 603, endPage: 603 },
    { number: 111, name: "Al-Masad", nameArabic: "المسد", verses: 5, revelation: "Makkah", startPage: 603, endPage: 603 },
    { number: 112, name: "Al-Ikhlas", nameArabic: "الإخلاص", verses: 4, revelation: "Makkah", startPage: 604, endPage: 604 },
    { number: 113, name: "Al-Falaq", nameArabic: "الفلق", verses: 5, revelation: "Makkah", startPage: 604, endPage: 604 },
    { number: 114, name: "An-Nas", nameArabic: "الناس", verses: 6, revelation: "Makkah", startPage: 604, endPage: 604 }
];

// Data Juz (Para) dalam Al-Qur'an
const QURAN_JUZ = [
    { number: 1, name: "Alif Lam Mim", startPage: 1, endPage: 21, startSurah: 1, startVerse: 1, endSurah: 2, endVerse: 141 },
    { number: 2, name: "Sayaqul", startPage: 22, endPage: 41, startSurah: 2, startVerse: 142, endSurah: 2, endVerse: 252 },
    { number: 3, name: "Tilka al-Rusul", startPage: 42, endPage: 61, startSurah: 2, startVerse: 253, endSurah: 3, endVerse: 92 },
    { number: 4, name: "Lan Tanalu", startPage: 62, endPage: 81, startSurah: 3, startVerse: 93, endSurah: 4, endVerse: 23 },
    { number: 5, name: "Wa al-Muhsanat", startPage: 82, endPage: 101, startSurah: 4, startVerse: 24, endSurah: 4, endVerse: 147 },
    { number: 6, name: "La Yuhibb Allah", startPage: 102, endPage: 121, startSurah: 4, startVerse: 148, endSurah: 5, endVerse: 81 },
    { number: 7, name: "Wa Idha Sami'u", startPage: 122, endPage: 141, startSurah: 5, startVerse: 82, endSurah: 6, endVerse: 110 },
    { number: 8, name: "Wa Lau Annana", startPage: 142, endPage: 161, startSurah: 6, startVerse: 111, endSurah: 7, endVerse: 87 },
    { number: 9, name: "Qal al-Mala'", startPage: 162, endPage: 181, startSurah: 7, startVerse: 88, endSurah: 8, endVerse: 40 },
    { number: 10, name: "Wa A'lamu", startPage: 182, endPage: 201, startSurah: 8, startVerse: 41, endSurah: 9, endVerse: 92 },
    { number: 11, name: "Ya'tadhiruna", startPage: 202, endPage: 221, startSurah: 9, startVerse: 93, endSurah: 11, endVerse: 5 },
    { number: 12, name: "Wa ma min Da'bbah", startPage: 222, endPage: 241, startSurah: 11, startVerse: 6, endSurah: 12, endVerse: 52 },
    { number: 13, name: "Wa ma Ubari'u", startPage: 242, endPage: 261, startSurah: 12, startVerse: 53, endSurah: 14, endVerse: 52 },
    { number: 14, name: "Rubama", startPage: 262, endPage: 281, startSurah: 15, startVerse: 1, endSurah: 16, endVerse: 128 },
    { number: 15, name: "Subhan Alladhi", startPage: 282, endPage: 301, startSurah: 17, startVerse: 1, endSurah: 18, endVerse: 74 },
    { number: 16, name: "Qal Alam", startPage: 302, endPage: 321, startSurah: 18, startVerse: 75, endSurah: 20, endVerse: 135 },
    { number: 17, name: "Iqtarab", startPage: 322, endPage: 341, startSurah: 21, startVerse: 1, endSurah: 22, endVerse: 78 },
    { number: 18, name: "Qad Aflaha", startPage: 342, endPage: 361, startSurah: 23, startVerse: 1, endSurah: 25, endVerse: 20 },
    { number: 19, name: "Wa Qal Alladhina", startPage: 362, endPage: 381, startSurah: 25, startVerse: 21, endSurah: 27, endVerse: 55 },
    { number: 20, name: "A'man Khalaq", startPage: 382, endPage: 401, startSurah: 27, startVerse: 56, endSurah: 29, endVerse: 45 },
    { number: 21, name: "Utlu ma Uhiya", startPage: 402, endPage: 421, startSurah: 29, startVerse: 46, endSurah: 33, endVerse: 30 },
    { number: 22, name: "Wa man Yaqnut", startPage: 422, endPage: 441, startSurah: 33, startVerse: 31, endSurah: 36, endVerse: 27 },
    { number: 23, name: "Wa Mali", startPage: 442, endPage: 461, startSurah: 36, startVerse: 28, endSurah: 39, endVerse: 31 },
    { number: 24, name: "Fa man Azlam", startPage: 462, endPage: 481, startSurah: 39, startVerse: 32, endSurah: 41, endVerse: 46 },
    { number: 25, name: "Ilay-hi Yuraddu", startPage: 482, endPage: 501, startSurah: 41, startVerse: 47, endSurah: 45, endVerse: 37 },
    { number: 26, name: "Ha Mim", startPage: 502, endPage: 521, startSurah: 46, startVerse: 1, endSurah: 51, endVerse: 30 },
    { number: 27, name: "Qala Fa ma Khatbukum", startPage: 522, endPage: 541, startSurah: 51, startVerse: 31, endSurah: 57, endVerse: 29 },
    { number: 28, name: "Qad Sami'a Allah", startPage: 542, endPage: 561, startSurah: 58, startVerse: 1, endSurah: 66, endVerse: 12 },
    { number: 29, name: "Tabarak Alladhi", startPage: 562, endPage: 581, startSurah: 67, startVerse: 1, endSurah: 77, endVerse: 50 },
    { number: 30, name: "'Amma Yatasaʼalun", startPage: 582, endPage: 604, startSurah: 78, startVerse: 1, endSurah: 114, endVerse: 6 }
];

// Mapping halaman ke juz
function getJuzByPage(page) {
    return QURAN_JUZ.find(juz => page >= juz.startPage && page <= juz.endPage);
}

// Mapping halaman ke surat
function getSurahsByPage(page) {
    return QURAN_SURAHS.filter(surah => page >= surah.startPage && page <= surah.endPage);
}

// Get audio path for page
function getAudioPathForPage(page) {
    const pageStr = page.toString().padStart(3, '0');
    return `assets/audio/alquran/Page${pageStr}.mp3`;
}

// Get page info with complete metadata
function getPageInfo(page) {
    const juz = getJuzByPage(page);
    const surahs = getSurahsByPage(page);
    const audioPath = getAudioPathForPage(page);
    
    return {
        page: page,
        juz: juz,
        surahs: surahs,
        audioPath: audioPath,
        totalPages: 604
    };
}

// Export untuk digunakan di aplikasi
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        QURAN_SURAHS,
        QURAN_JUZ,
        getJuzByPage,
        getSurahsByPage,
        getAudioPathForPage,
        getPageInfo
    };
}

// Expose to window for browser/Capacitor usage
if (typeof window !== 'undefined') {
    window.QURAN_SURAHS = QURAN_SURAHS;
    window.QURAN_JUZ = QURAN_JUZ;
    window.getJuzByPage = getJuzByPage;
    window.getSurahsByPage = getSurahsByPage;
    window.getAudioPathForPage = getAudioPathForPage;
    window.getPageInfo = getPageInfo;
    
    console.log('Quran data loaded:', {
        surahs: QURAN_SURAHS.length,
        juz: QURAN_JUZ.length
    });
}