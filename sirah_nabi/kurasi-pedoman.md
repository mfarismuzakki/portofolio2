# Pedoman Kurasi Database Nabi dan Rasul

## Prinsip Utama
1. **Hanya sumber Islam shahih**: Al-Quran, Hadits Shahih, Atsar Salaf
2. **Hindari israiliyat** yang tidak ada dasarnya dalam Islam
3. **Kosongkan info spekulatif** tanpa dalil yang jelas
4. **Gunakan manhaj salaf** dalam pemahaman

## Field yang Harus Dikurasi

### Info Pribadi
- `period`: Hanya jika disebutkan dalam nash atau riwayat shahih
- `birthPlace`: Kosongkan jika tidak ada dalil
- `deathPlace`: Kosongkan jika tidak ada dalil  
- `father/mother`: Hanya jika disebutkan dalam nash
- `tribe`: Hanya jika ada dalam dalil shahih
- `children`: Sesuai yang disebutkan dalam Al-Quran/hadits

### Riwayat dan Kisah
- Hapus detail yang bersumber dari Kitab Suci lain
- Fokus pada yang disebutkan Al-Quran dan hadits sahih
- Cantumkan referensi yang jelas

### Referensi yang Diperbolehkan
- Al-Quran
- Hadits dalam Kutub as-Sittah (terutama Bukhari-Muslim)
- Tafsir ulama salaf (Ibnu Katsir, Qurtubi, Tabari)
- Sirah Ibnu Hisyam, Tarikh Tabari (yang sesuai dengan dalil)

### Yang Harus Dihindari
- Kisah dari Kitab Taurat/Injil tanpa konfirmasi Islam
- Detail spekulatif tanpa sandaran
- Riwayat dha'if atau maudu'
- Perkiraan tanggal/tempat tanpa dasar

## Template Field yang Aman
```javascript
period: 'Tidak disebutkan dalam nash shahih',
birthPlace: 'Tidak disebutkan dalam nash',
deathPlace: 'Tidak disebutkan dalam nash',
father: 'Tidak disebutkan dalam nash',
mother: 'Tidak disebutkan dalam nash',
```