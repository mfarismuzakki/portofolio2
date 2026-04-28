#!/usr/bin/env python3
"""
download-jadwal.py — Unduh jadwal sholat dari Aladhan API
Mengunduh seluruh kota besar Indonesia, semua metode, tahun ini + tahun depan.
Setelah selesai, app islamhub tidak perlu koneksi internet sama sekali.

Output:
  js/data/jadwal-index.json         — daftar kota (lat/lon)
  js/data/jadwal/{city-id}.json     — jadwal per kota (semua metode & bulan)
  www/ salinan otomatis

Jalankan sekali per tahun (atau saat ganti lokasi):
    python download-jadwal.py

Script mendukung resume: kota yang sudah selesai diunduh akan dilewati.
"""

import json
import urllib.request
import datetime
import time
import os
import shutil
import math

# =====================================================
# DAFTAR KOTA  (tambah/hapus sesuai kebutuhan)
# =====================================================
CITIES = [
    # ── Jawa ──────────────────────────────────────────
    {"id": "jakarta",          "name": "Jakarta",          "province": "DKI Jakarta",        "lat": -6.2088,  "lon": 106.8456},
    {"id": "bekasi",           "name": "Bekasi",           "province": "Jawa Barat",         "lat": -6.2349,  "lon": 106.9896},
    {"id": "tangerang",        "name": "Tangerang",        "province": "Banten",             "lat": -6.1781,  "lon": 106.6297},
    {"id": "depok",            "name": "Depok",            "province": "Jawa Barat",         "lat": -6.4025,  "lon": 106.7942},
    {"id": "bogor",            "name": "Bogor",            "province": "Jawa Barat",         "lat": -6.5971,  "lon": 106.8060},
    {"id": "bandung",          "name": "Bandung",          "province": "Jawa Barat",         "lat": -6.9175,  "lon": 107.6191},
    {"id": "cirebon",          "name": "Cirebon",          "province": "Jawa Barat",         "lat": -6.7320,  "lon": 108.5520},
    {"id": "tasikmalaya",      "name": "Tasikmalaya",      "province": "Jawa Barat",         "lat": -7.3274,  "lon": 108.2207},
    {"id": "sukabumi",         "name": "Sukabumi",         "province": "Jawa Barat",         "lat": -6.9277,  "lon": 106.9297},
    {"id": "serang",           "name": "Serang",           "province": "Banten",             "lat": -6.1100,  "lon": 106.1544},
    {"id": "semarang",         "name": "Semarang",         "province": "Jawa Tengah",        "lat": -6.9667,  "lon": 110.4167},
    {"id": "yogyakarta",       "name": "Yogyakarta",       "province": "DI Yogyakarta",      "lat": -7.7971,  "lon": 110.3688},
    {"id": "surakarta",        "name": "Surakarta",        "province": "Jawa Tengah",        "lat": -7.5560,  "lon": 110.8320},
    {"id": "purwokerto",       "name": "Purwokerto",       "province": "Jawa Tengah",        "lat": -7.4197,  "lon": 109.2458},
    {"id": "tegal",            "name": "Tegal",            "province": "Jawa Tengah",        "lat": -6.8671,  "lon": 109.1389},
    {"id": "pekalongan",       "name": "Pekalongan",       "province": "Jawa Tengah",        "lat": -6.8886,  "lon": 109.6753},
    {"id": "magelang",         "name": "Magelang",         "province": "Jawa Tengah",        "lat": -7.4712,  "lon": 110.2177},
    {"id": "surabaya",         "name": "Surabaya",         "province": "Jawa Timur",         "lat": -7.2575,  "lon": 112.7521},
    {"id": "malang",           "name": "Malang",           "province": "Jawa Timur",         "lat": -7.9797,  "lon": 112.6304},
    {"id": "kediri",           "name": "Kediri",           "province": "Jawa Timur",         "lat": -7.8166,  "lon": 112.0114},
    {"id": "jember",           "name": "Jember",           "province": "Jawa Timur",         "lat": -8.1845,  "lon": 113.6681},
    {"id": "madiun",           "name": "Madiun",           "province": "Jawa Timur",         "lat": -7.6298,  "lon": 111.5238},
    {"id": "banyuwangi",       "name": "Banyuwangi",       "province": "Jawa Timur",         "lat": -8.2192,  "lon": 114.3691},
    # ── Sumatera ──────────────────────────────────────
    {"id": "banda_aceh",       "name": "Banda Aceh",       "province": "Aceh",               "lat": 5.5483,   "lon": 95.3238},
    {"id": "lhokseumawe",      "name": "Lhokseumawe",      "province": "Aceh",               "lat": 5.1800,   "lon": 97.1500},
    {"id": "medan",            "name": "Medan",            "province": "Sumatera Utara",     "lat": 3.5952,   "lon": 98.6722},
    {"id": "pematang_siantar", "name": "Pematang Siantar", "province": "Sumatera Utara",     "lat": 2.9595,   "lon": 99.0687},
    {"id": "padang",           "name": "Padang",           "province": "Sumatera Barat",     "lat": -0.9471,  "lon": 100.4172},
    {"id": "bukittinggi",      "name": "Bukittinggi",      "province": "Sumatera Barat",     "lat": -0.3063,  "lon": 100.3700},
    {"id": "pekanbaru",        "name": "Pekanbaru",        "province": "Riau",               "lat": 0.5071,   "lon": 101.4478},
    {"id": "dumai",            "name": "Dumai",            "province": "Riau",               "lat": 1.6667,   "lon": 101.4500},
    {"id": "batam",            "name": "Batam",            "province": "Kepulauan Riau",     "lat": 1.1301,   "lon": 104.0529},
    {"id": "tanjung_pinang",   "name": "Tanjung Pinang",   "province": "Kepulauan Riau",     "lat": 0.9167,   "lon": 104.4667},
    {"id": "jambi",            "name": "Jambi",            "province": "Jambi",              "lat": -1.6101,  "lon": 103.6131},
    {"id": "palembang",        "name": "Palembang",        "province": "Sumatera Selatan",   "lat": -2.9761,  "lon": 104.7754},
    {"id": "bengkulu",         "name": "Bengkulu",         "province": "Bengkulu",           "lat": -3.7928,  "lon": 102.2608},
    {"id": "bandar_lampung",   "name": "Bandar Lampung",   "province": "Lampung",            "lat": -5.4294,  "lon": 105.2611},
    {"id": "metro",            "name": "Metro",            "province": "Lampung",            "lat": -5.1135,  "lon": 105.3067},
    {"id": "pangkal_pinang",   "name": "Pangkal Pinang",   "province": "Bangka Belitung",    "lat": -2.1333,  "lon": 106.1167},
    # ── Kalimantan ────────────────────────────────────
    {"id": "pontianak",        "name": "Pontianak",        "province": "Kalimantan Barat",   "lat": 0.0333,   "lon": 109.3333},
    {"id": "singkawang",       "name": "Singkawang",       "province": "Kalimantan Barat",   "lat": 0.9000,   "lon": 108.9667},
    {"id": "palangka_raya",    "name": "Palangka Raya",    "province": "Kalimantan Tengah",  "lat": -2.2167,  "lon": 113.9167},
    {"id": "banjarmasin",      "name": "Banjarmasin",      "province": "Kalimantan Selatan", "lat": -3.3186,  "lon": 114.5944},
    {"id": "banjarbaru",       "name": "Banjarbaru",       "province": "Kalimantan Selatan", "lat": -3.4422,  "lon": 114.8311},
    {"id": "samarinda",        "name": "Samarinda",        "province": "Kalimantan Timur",   "lat": -0.5022,  "lon": 117.1536},
    {"id": "balikpapan",       "name": "Balikpapan",       "province": "Kalimantan Timur",   "lat": -1.2675,  "lon": 116.8289},
    {"id": "tarakan",          "name": "Tarakan",          "province": "Kalimantan Utara",   "lat": 3.2988,   "lon": 117.6265},
    # ── Sulawesi ──────────────────────────────────────
    {"id": "makassar",         "name": "Makassar",         "province": "Sulawesi Selatan",   "lat": -5.1477,  "lon": 119.4327},
    {"id": "parepare",         "name": "Parepare",         "province": "Sulawesi Selatan",   "lat": -4.0135,  "lon": 119.6297},
    {"id": "palopo",           "name": "Palopo",           "province": "Sulawesi Selatan",   "lat": -2.9925,  "lon": 120.1967},
    {"id": "mamuju",           "name": "Mamuju",           "province": "Sulawesi Barat",     "lat": -2.6758,  "lon": 118.8876},
    {"id": "palu",             "name": "Palu",             "province": "Sulawesi Tengah",    "lat": -0.8917,  "lon": 119.8707},
    {"id": "gorontalo",        "name": "Gorontalo",        "province": "Gorontalo",          "lat": 0.5333,   "lon": 123.0667},
    {"id": "manado",           "name": "Manado",           "province": "Sulawesi Utara",     "lat": 1.4748,   "lon": 124.8421},
    {"id": "bitung",           "name": "Bitung",           "province": "Sulawesi Utara",     "lat": 1.4414,   "lon": 125.1982},
    {"id": "kendari",          "name": "Kendari",          "province": "Sulawesi Tenggara",  "lat": -3.9449,  "lon": 122.4989},
    # ── Bali & Nusa Tenggara ──────────────────────────
    {"id": "denpasar",         "name": "Denpasar",         "province": "Bali",               "lat": -8.6705,  "lon": 115.2126},
    {"id": "mataram",          "name": "Mataram",          "province": "NTB",                "lat": -8.5833,  "lon": 116.1167},
    {"id": "bima",             "name": "Bima",             "province": "NTB",                "lat": -8.4522,  "lon": 118.7264},
    {"id": "kupang",           "name": "Kupang",           "province": "NTT",                "lat": -10.1771, "lon": 123.6070},
    # ── Maluku & Papua ────────────────────────────────
    {"id": "ambon",            "name": "Ambon",            "province": "Maluku",             "lat": -3.6954,  "lon": 128.1814},
    {"id": "ternate",          "name": "Ternate",          "province": "Maluku Utara",       "lat": 0.7893,   "lon": 127.3800},
    {"id": "sorong",           "name": "Sorong",           "province": "Papua Barat",        "lat": -0.8762,  "lon": 131.2550},
    {"id": "manokwari",        "name": "Manokwari",        "province": "Papua Barat",        "lat": -0.8667,  "lon": 134.0833},
    {"id": "jayapura",         "name": "Jayapura",         "province": "Papua",              "lat": -2.5337,  "lon": 140.7180},
    {"id": "merauke",          "name": "Merauke",          "province": "Papua Selatan",      "lat": -8.4667,  "lon": 140.3333},
]

# Semua metode yang didukung aplikasi
METHODS = {
    11: "KEMENAG",
    3:  "MWL",
    2:  "ISNA",
    5:  "Egypt",
    4:  "Makkah",
    1:  "Karachi",
}

# Jeda antar request — hindari rate-limit API
DELAY_SECONDS = 0.4

# =====================================================

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
JADWAL_DIR = os.path.join(BASE_DIR, "js", "data", "jadwal")
INDEX_PATH = os.path.join(BASE_DIR, "js", "data", "jadwal-index.json")
WWW_JADWAL = os.path.join(BASE_DIR, "www", "js", "data", "jadwal")
WWW_INDEX  = os.path.join(BASE_DIR, "www", "js", "data", "jadwal-index.json")


def years_to_download():
    y = datetime.date.today().year
    return [y, y + 1]


def fetch_month(year, month, method_id, city_name, retry=2):
    url = (
        f"https://api.aladhan.com/v1/calendar/{year}/{month}"
        f"?latitude={city_name['lat']}&longitude={city_name['lon']}&method={method_id}"
    )
    for attempt in range(1, retry + 2):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "IslamHub/1.0"})
            with urllib.request.urlopen(req, timeout=30) as r:
                data = json.loads(r.read().decode())
            if data.get("code") != 200 or not isinstance(data.get("data"), list):
                raise ValueError(f"code={data.get('code')}")
            return data["data"]
        except Exception as e:
            if attempt <= retry:
                print("retry..", end="", flush=True)
                time.sleep(2)
            else:
                print(f"GAGAL ({e})")
                return None


def trim_entry(entry):
    """Simpan hanya data yang dibutuhkan app — kurangi ukuran file ~10x."""
    t = entry["timings"]
    h = entry["date"]["hijri"]
    return {
        "Im": t["Imsak"],
        "Fa": t["Fajr"],
        "Sr": t["Sunrise"],
        "Dh": t["Dhuhr"],
        "As": t["Asr"],
        "Mg": t["Maghrib"],
        "Is": t["Isha"],
        "hijri": {
            "day":         h["day"],
            "weekday":     h["weekday"],
            "month":       h["month"],
            "year":        h["year"],
            "designation": {"abbreviated": h["designation"]["abbreviated"]},
        }
    }


def city_file_path(city_id):
    return os.path.join(JADWAL_DIR, f"{city_id}.json")


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))


def main():
    now   = datetime.date.today()
    years = years_to_download()
    n_months = len(METHODS) * len(years) * 12
    total = len(CITIES) * n_months

    print("IslamHub — Download Jadwal Sholat Seluruh Indonesia")
    print(f"Kota    : {len(CITIES)} kota")
    print(f"Metode  : {len(METHODS)} ({', '.join(str(k) for k in METHODS)})")
    print(f"Tahun   : {', '.join(str(y) for y in years)}")
    print(f"Total   : ±{total} permintaan ke API  (~{total * DELAY_SECONDS / 60:.0f} menit)")
    print()

    os.makedirs(JADWAL_DIR, exist_ok=True)

    cities_done = 0
    for city in CITIES:
        out_path = city_file_path(city["id"])

        # Resume: skip kota yang sudah lengkap
        if os.path.exists(out_path):
            try:
                existing = json.loads(open(out_path, encoding="utf-8").read())
                expected_keys = len(METHODS) * len(years) * 12
                actual_keys = sum(
                    len(months)
                    for months in existing.get("methods", {}).values()
                )
                if actual_keys >= expected_keys:
                    print(f"  ✓ {city['name']} — sudah ada, dilewati")
                    cities_done += 1
                    continue
            except Exception:
                pass  # file rusak, unduh ulang

        print(f"\n── {city['name']} ({city['province']})")
        city_data = {"methods": {}}

        for method_id, method_name in METHODS.items():
            city_data["methods"][str(method_id)] = {}
            for year in years:
                for month in range(1, 13):
                    month_key = f"{year}-{month}"
                    print(f"   [{method_name}] {month:02d}/{year} ... ", end="", flush=True)
                    days = fetch_month(year, month, method_id, city)
                    if days:
                        city_data["methods"][str(method_id)][month_key] = [
                            trim_entry(d) for d in days
                        ]
                        print(f"OK ({len(days)})")
                    else:
                        city_data["methods"][str(method_id)][month_key] = []
                    time.sleep(DELAY_SECONDS)

        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(city_data, f, ensure_ascii=False)
        cities_done += 1
        print(f"   → Tersimpan: {out_path}")

    # Tulis index
    index = [
        {"id": c["id"], "name": c["name"], "province": c["province"],
         "lat": c["lat"], "lon": c["lon"]}
        for c in CITIES
    ]
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False)
    print(f"\n✓ Index    : {INDEX_PATH}")

    # Salin ke www/
    if os.path.isdir(os.path.join(BASE_DIR, "www")):
        os.makedirs(WWW_JADWAL, exist_ok=True)
        for city in CITIES:
            src = city_file_path(city["id"])
            if os.path.exists(src):
                shutil.copy2(src, os.path.join(WWW_JADWAL, f"{city['id']}.json"))
        shutil.copy2(INDEX_PATH, WWW_INDEX)
        print(f"✓ Disalin  : {WWW_JADWAL}/")

    print(f"\nSelesai! {cities_done}/{len(CITIES)} kota berhasil diunduh.")
    print("Ulangi script ini tiap tahun, atau saat mengganti lokasi masjid.")


if __name__ == "__main__":
    main()

