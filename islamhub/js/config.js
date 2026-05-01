/**
 * IslamHub — File Konfigurasi Global
 * ============================================================
 *
 * File ini mengatur konfigurasi global untuk seluruh aplikasi IslamHub.
 *
 * ──────────────────────────────────────────────────────────
 * KOREKSI TANGGAL HIJRIAH (dateOffsetDays)
 * ──────────────────────────────────────────────────────────
 * Digunakan untuk mengoreksi tampilan tanggal Hijriyah.
 * Jadwal sholat (waktu) tetap menggunakan tanggal hari ini — hanya
 * tampilan tanggal Hijriah yang disesuaikan.
 *
 * Kasus penggunaan:
 *   - Koreksi awal bulan Hijriah (rukyat vs hisab)
 *   - Menyesuaikan dengan keputusan pemerintah / ormas
 *   - Testing / debugging tampilan kalender Hijriah
 *
 * Nilai yang berlaku:
 *    0  → Tanpa koreksi (default)
 *   -1  → Mundur 1 hari Hijriah
 *   +1  → Maju 1 hari Hijriah
 *   -2  → Mundur 2 hari Hijriah, dst.
 *
 * Nilai ini bisa diubah:
 *   1. Langsung di file ini (berlaku sebagai default hard-coded)
 *   2. Via UI pengaturan di aplikasi Adzan (tersimpan di localStorage)
 * ──────────────────────────────────────────────────────────
 */

const CONFIG_DEFAULTS = {
    /**
     * Koreksi tanggal Hijriah dalam hari (integer).
     * Ubah nilai ini untuk menyesuaikan tampilan tanggal Hijriah.
     * Contoh: -1 untuk mundur 1 hari, +1 untuk maju 1 hari, 0 tanpa koreksi.
     */
    dateOffsetDays: 0
};

const STORAGE_KEY = 'islamhub_config';

class IslamHubConfig {
    constructor() {
        this._defaults = { ...CONFIG_DEFAULTS };
        this._runtime = this._loadFromStorage();
    }

    _loadFromStorage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('[IslamHubConfig] Gagal membaca konfigurasi dari storage:', e);
        }
        return {};
    }

    _saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._runtime));
        } catch (e) {
            console.warn('[IslamHubConfig] Gagal menyimpan konfigurasi ke storage:', e);
        }
    }

    /**
     * Ambil nilai konfigurasi berdasarkan key.
     * Runtime value (dari localStorage) lebih prioritas dari default.
     * @param {string} key
     * @returns {*}
     */
    get(key) {
        if (Object.prototype.hasOwnProperty.call(this._runtime, key)) {
            return this._runtime[key];
        }
        return this._defaults[key];
    }

    /**
     * Set nilai konfigurasi dan simpan ke localStorage.
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
        this._runtime[key] = value;
        this._saveToStorage();
    }

    /**
     * Reset konfigurasi ke nilai default.
     * @param {string|null} key - Jika null, reset semua konfigurasi.
     */
    reset(key = null) {
        if (key) {
            delete this._runtime[key];
        } else {
            this._runtime = {};
        }
        this._saveToStorage();
    }

    // ─── Shorthand: dateOffsetDays ───────────────────────────

    /** Offset tanggal dalam hari (baca). */
    get dateOffsetDays() {
        return this.get('dateOffsetDays');
    }

    /** Offset tanggal dalam hari (tulis). Hanya menerima integer. */
    set dateOffsetDays(value) {
        this.set('dateOffsetDays', parseInt(value, 10) || 0);
    }

    // ─── Helper Tanggal ──────────────────────────────────────

    /**
     * Kembalikan objek Date yang sudah disesuaikan dengan dateOffsetDays.
     * Jika offset = 0, kembalikan Date hari ini.
     * @returns {Date}
     */
    getAdjustedDate() {
        const now = new Date();
        const offset = this.dateOffsetDays;
        if (offset === 0) return now;
        const adjusted = new Date(now);
        adjusted.setDate(adjusted.getDate() + offset);
        return adjusted;
    }

    /**
     * Kembalikan label teks koreksi untuk ditampilkan di UI.
     * Contoh: "Tanpa koreksi", "+1 hari", "-1 hari", "+3 hari"
     * @returns {string}
     */
    getOffsetLabel() {
        const offset = this.dateOffsetDays;
        if (offset === 0) return 'Tanpa koreksi';
        if (offset > 0) return `+${offset} hari`;
        return `${offset} hari`;
    }
}

// Ekspor sebagai singleton
const islamHubConfig = new IslamHubConfig();

export default islamHubConfig;
