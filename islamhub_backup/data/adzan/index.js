/**
 * Adzan Data Index - Centralized data loader
 * Loads all adzan-related data (hadith, sunnah, prayer calculations)
 */

// Export hadith data
export { hadithCollection } from './hadith-data.js';

// Export sunnah prayer data
export { sunnahPrayersData } from './sunnah-data.js';

// Export prayer calculation methods
export const calculationMethods = {
    KEMENAG: 11,
    MWL: 3,
    ISNA: 2,
    Egypt: 5,
    Makkah: 4,
    Karachi: 1
};

// Prayer names mapping
export const prayerNames = {
    fajr: "Subuh",
    sunrise: "Syuruq", 
    dhuhr: "Dzuhur",
    asr: "Ashar",
    maghrib: "Maghrib",
    isha: "Isya"
};
