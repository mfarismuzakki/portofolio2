// Prayer Times Data and Configuration

const prayerNames = {
  fajr: { 
    name: "Subuh", 
    icon: "fas fa-sun", 
    color: "#FFD700",
    description: "Waktu subuh dimulai dari terbit fajar sadiq hingga terbit matahari"
  },
  dhuhr: { 
    name: "Dzuhur", 
    icon: "fas fa-sun", 
    color: "#FF6B35",
    description: "Waktu dzuhur dimulai dari matahari tergelincir hingga bayangan sama panjang"
  },
  asr: { 
    name: "Ashar", 
    icon: "fas fa-cloud-sun", 
    color: "#FF8C42",
    description: "Waktu ashar dimulai ketika bayangan lebih panjang dari bendanya"
  },
  maghrib: { 
    name: "Maghrib", 
    icon: "fas fa-moon", 
    color: "#FF5722",
    description: "Waktu maghrib dimulai dari terbenam matahari hingga hilang mega merah"
  },
  isha: { 
    name: "Isya", 
    icon: "fas fa-moon", 
    color: "#673AB7",
    description: "Waktu isya dimulai dari hilangnya mega merah hingga terbit fajar"
  }
};

// Calculation methods for Aladhan API
const calculationMethods = {
    KEMENAG: 11,
    MWL: 3,
    ISNA: 2,
    Egypt: 5,
    Makkah: 4,
    Karachi: 1
};

// Default prayer times (will be updated from API)
const defaultPrayerTimes = {
  fajr: "05:00",
  dhuhr: "12:00", 
  asr: "15:30",
  maghrib: "18:00",
  isha: "19:30"
};

// Indonesian cities data for autocomplete
const indonesianCities = [
  "Jakarta", "Surabaya", "Bandung", "Bekasi", "Medan",
  "Tangerang", "Depok", "Semarang", "Palembang", "Makassar",
  "South Tangerang", "Batam", "Bogor", "Pekanbaru", "Bandar Lampung",
  "Padang", "Malang", "Yogyakarta", "Denpasar", "Samarinda",
  "Banjarmasin", "Tasikmalaya", "Pontianak", "Cimahi", "Balikpapan",
  "Jambi", "Surakarta", "Kupang", "Cilegon", "Mataram",
  "Manado", "Serang", "Bengkulu", "Palu", "Kediri",
  "Sukabumi", "Cirebon", "Jember", "Purwokerto", "Magelang",
  "Tegal", "Binjai", "Pematangsiantar", "Jayapura", "Gorontalo"
];

// Storage keys for local data
const storageKeys = {
  location: 'islamhub_location',
  prayerTimes: 'islamhub_prayer_times',
  method: 'islamhub_prayer_method',
  notifications: 'islamhub_notifications',
  lastUpdate: 'islamhub_last_update'
};

// API endpoints
const apiEndpoints = {
  aladhan: 'https://api.aladhan.com/v1/timingsByCity',
  geocoding: 'https://api.opencagedata.com/geocode/v1/json'
};

// Make data available globally
window.prayerNames = prayerNames;
window.calculationMethods = calculationMethods;
window.defaultPrayerTimes = defaultPrayerTimes;
window.indonesianCities = indonesianCities;
window.storageKeys = storageKeys;
window.apiEndpoints = apiEndpoints;