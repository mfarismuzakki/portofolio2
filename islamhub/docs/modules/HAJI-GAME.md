# Game Jelajah Manasik

Game tampak atas dengan ilustrasi bangunan 2.5D di Haji & Umrah → Game Manasik.
Versi web/PWA ini menggunakan Canvas 2D, tanpa model atau tekstur dari jaringan.
Ilustrasi lokasi bukan denah geografis atau simulasi kerumunan dunia nyata.

## Cara bermain

- **Tur otomatis:** satu klik untuk mengikuti seluruh perjalanan. Berhenti sejenak
  selama 6,5 detik di akhir tahap agar petunjuk dapat dibaca; tidak menjawab kuis
  atas nama pengguna. Kecepatan 1×–3× memengaruhi perjalanan, bukan waktu membaca.
- **Manual terpandu:** klik penanda emas atau tombol berjalan. Satu klik tawaf
  menyelesaikan satu putaran. Sa’i satu arah; lontaran satu kerikil.
- **Keyboard:** fokuskan kanvas; Enter berjalan/lanjut tahap, spasi jeda/lanjut,
  tahan panah atau WASD untuk mengikuti lintasan terpandu (bukan gerak bebas).
- **Jeda:** menghentikan animasi di tempat; tab tersembunyi/kanvas di luar layar
  tidak menghabiskan waktu simulasi. Tidak ada timer yang mengejar waktu di latar.
- **Bacakan:** opsional, menggunakan suara bahasa Indonesia dari perangkat jika
  tersedia. Tidak memerlukan layanan suara berbayar; kualitas tergantung browser.
- **Kuis:** opsional. Jawaban salah tidak menutup akses ke tahap berikutnya.
- **Progres:** disimpan per mode setelah gerakan selesai. Membuka ulang halaman
  melanjutkan dari gerakan yang sudah selesai, dalam keadaan berhenti.
  Tahap yang sudah terbuka bisa diulang melalui peta perjalanan.

## Materi dan batas simulasi

Umrah memiliki 5 tahap, haji tamattu dengan nafar awal memiliki 15 tahap. Penghitung
tawaf tetap menyimpan satuan seperempat putaran untuk migrasi progres v1; tampilan
menghitung tujuh putaran penuh. Sa’i berakhir di Marwah pada perjalanan ketujuh.
Lontaran Aqabah berjumlah 7; tiga jumrah berjumlah 21 dengan urutan Ula, Wustha,
Aqabah. Gerakan karakter adalah representasi perpindahan lokasi, bukan peraga
rinci setiap amalan. Progres belajar terpisah dari checklist manasik asli.

Rujukan:
- [Tata cara umrah — Syaikh Ibn Baz](https://binbaz.org.sa/fatwas/11982/صفة-العمرة)
- [Ringkasan amalan haji — Rumaysho](https://rumaysho.com/2895-ringkasan-panduan-haji-7-amalan-amalan-haji.html)

## Implementasi dan validasi

- `manasik-game.js`: data tahap dan rujukan.
- `manasik-adventure.js`: status, kontrol, progres, narasi, dan loop waktu.
- `manasik-scene.js`: gambar dunia dan karakter; latar disimpan pada canvas terpisah.
- `manasik-game.css`: tampilan desktop/ponsel dan kontrol sentuh.

Jalankan server statis pada root repo, lalu `node islamhub/tests/manasik-runtime.cjs`
dengan Playwright tersedia. `BASE_URL` dapat diarahkan ke deployment. Pengujian
mencakup seluruh jalur, putaran/arah, jeda, penyimpanan, migrasi v1, replay, kuis,
pergantian tab, responsivitas, serta tur umrah satu klik melalui RAF browser asli.
`node islamhub/tests/simulations.cjs` juga memeriksa integrasi dengan peraga sholat.

## Usulan pengembangan IslamHub berikutnya

1. **Murajaah terjadwal:** perluasan penanda hafalan yang sudah ada menjadi jadwal
   pengulangan, antrian ayat hari ini, dan audio A–B.
2. **Pencarian lintas aplikasi:** satu pencarian untuk ayat, hadits, doa, dan fiqh,
   dengan rujukan pada setiap hasil.
3. **Paket safar offline:** panduan manasik, doa, checklist barang/dokumen, serta
   kartu hotel dan kontak rombongan yang disimpan lokal secara opsional.
4. **Pengingat sholat saat halaman ditutup:** notifikasi terjadwal native atau
   Web Push dari server; pilihan ini perlu mengikuti platform yang digunakan.
5. **Belajar lima menit:** rangkaian materi singkat, kuis opsional, dan tombol
   lanjut terakhir untuk sirah, fiqh, dan hadits tanpa papan peringkat ibadah.
