// Learning progress is separate from the real-life manasik checklist.
const SOURCES = {
    haji:'https://rumaysho.com/2895-ringkasan-panduan-haji-7-amalan-amalan-haji.html',
    umrah:'https://binbaz.org.sa/fatwas/11982/صفة-العمرة'
};
const mission=(title,place,text,question,answers,correct=0,type='visit',total=1)=>({title,place,text,question,answers,correct,type,total});
const UMRAH = [
    mission('Mulai dari miqat','Miqat','Bersiap, lalu niat masuk ibadah umrah di miqat yang sesuai rute perjalanan. Laki-laki mengenakan dua kain ihram; perempuan memakai pakaian yang sesuai syariat. Setelah niat, bertalbiyah.','Kapan mulai berihram?', ['Sebelum melewati miqat yang dilalui','Setelah tiba di hotel di Makkah']),
    mission('Tawaf umrah','Masjidil Haram','Mulai sejajar Hajar Aswad. Ikuti tujuh putaran berlawanan arah jarum jam, dengan Ka’bah di sebelah kiri. Lintasan selalu di luar Hijr. Jangan berdesakan untuk menyentuh Hajar Aswad.','Apa yang tetap di sebelah kiri saat tawaf?',['Ka’bah','Bukit Shafa'],0,'tawaf',28),
    mission('Dua rakaat setelah tawaf','Maqam Ibrahim','Sholat dua rakaat setelah tawaf, di belakang Maqam Ibrahim bila memungkinkan. Pilih tempat yang tidak menghalangi jamaah; tidak harus dekat dengan Maqam.','Jika area Maqam padat, pilih…',['Tempat lain di masjid yang tidak mengganggu','Memaksa sholat di jalur tawaf']),
    mission('Sa’i Shafa ke Marwah','Shafa & Marwah','Mulai dari Shafa dan selesai di Marwah. Satu perjalanan Shafa ke Marwah dihitung satu; arah sebaliknya satu lagi. Lengkapi tujuh perjalanan. Laki-laki berlari kecil di antara penanda hijau bila memungkinkan.','Shafa → Marwah → Shafa dihitung…',['Dua perjalanan','Satu perjalanan'],0,'sai',7),
    mission('Tahallul umrah','Marwah','Laki-laki mencukur atau memendekkan rambut secara merata; perempuan memotong sedikit ujung rambut. Setelah itu, umrah selesai dan larangan ihram berakhir.','Tahallul umrah dilakukan setelah…',['Tawaf dan sa’i selesai','Baru selesai tawaf'])
];
const HAJI = [
    ...UMRAH,
    mission('Ihram haji & menuju Mina','8 Dzulhijjah · Mina','Jalur ini adalah haji tamattu: umrah terlebih dahulu, tahallul, lalu ihram haji dari tempat tinggal di Makkah pada 8 Dzulhijjah. Menuju Mina dan bermalam hingga pagi 9 Dzulhijjah.','Setelah umrah tamattu, kapan niat ihram haji?',['Pada 8 Dzulhijjah dari tempat tinggal di Makkah','Tidak perlu ihram kembali']),
    mission('Wukuf di Arafah','9 Dzulhijjah · Arafah','Wukuf adalah rukun haji. Pada jalur ini jamaah berada di Arafah setelah zawal, berdoa dan berdzikir, lalu meninggalkan Arafah setelah matahari terbenam. Mendaki Jabal Rahmah bukan syarat wukuf.','Kapan rombongan ini berangkat ke Muzdalifah?',['Setelah matahari terbenam','Sebelum waktu Ashar']),
    mission('Mabit di Muzdalifah','Malam 10 Dzulhijjah','Setelah Arafah, menuju Muzdalifah. Menjamak Maghrib dan Isya lalu bermalam; jalur umum ini berangkat setelah Subuh. Ada keringanan waktu berangkat bagi jamaah lemah dan pendampingnya.','Setelah Arafah, tempat bermalam berikutnya…',['Muzdalifah','Langsung kembali ke hotel Makkah']),
    mission('Jumrah Aqabah','10 Dzulhijjah · Mina','Lontar Jumrah Aqabah dengan tujuh kerikil, satu demi satu, bertakbir setiap lemparan. Tujuannya masuk ke tempat lontaran, bukan melempar orang atau bangunan lain.','Jumrah yang dilontar pada 10 Dzulhijjah…',['Aqabah saja, tujuh kerikil','Ketiga jumrah sekaligus'],0,'rami',7),
    mission('Hadyu & mencukur rambut','10 Dzulhijjah · Mina','Tamattu mewajibkan hadyu bagi yang mampu; ada ketentuan puasa pengganti bagi yang tidak mampu. Contoh urutan ini: setelah melontar, hadyu, lalu mencukur atau memendekkan rambut. Tahallul awal belum menghalalkan hubungan suami istri.','Kewajiban hadyu tamattu…',['Ditunaikan; bila tidak mampu ada ketentuan puasa pengganti','Selalu boleh dilewati tanpa pengganti']),
    mission('Tawaf ifadhah','10 Dzulhijjah · Makkah','Tawaf ifadhah adalah rukun haji. Lakukan tujuh putaran di luar Hijr dengan Ka’bah di kiri, kemudian sholat dua rakaat bila memungkinkan. Jalur ini memakai urutan yang umum; terdapat kelonggaran urutan amalan hari Nahr.','Tawaf ifadhah termasuk…',['Rukun haji','Amalan yang selalu boleh ditinggalkan'],0,'tawaf',28),
    mission('Sa’i haji tamattu','Shafa & Marwah','Jamaah tamattu melakukan sa’i haji, terpisah dari sa’i umrah sebelumnya. Tujuh perjalanan dimulai di Shafa dan berakhir di Marwah. Setelah rangkaian tahallul lengkap, larangan ihram berakhir.','Sa’i umrah sebelumnya menggantikan sa’i haji tamattu?',['Tidak, lakukan sa’i haji','Ya, tidak perlu lagi'],0,'sai',7),
    mission('Mabit & tiga jumrah','11 Dzulhijjah · Mina','Bermalam di Mina pada malam 11. Setelah zawal pada tanggal 11: Ula, Wustha, lalu Aqabah, masing-masing tujuh kerikil. Berdoa setelah Ula dan Wustha; tidak berhenti berdoa setelah Aqabah.','Urutan tiga jumrah adalah…',['Ula → Wustha → Aqabah','Aqabah → Ula → Wustha'],0,'rami',21),
    mission('Hari tasyrik & nafar awal','12 Dzulhijjah · Mina','Bermalam pada malam 12 dan ulangi tiga jumrah setelah zawal. Contoh ini memilih nafar awal: keluar Mina sebelum matahari terbenam tanggal 12. Bila menetap untuk nafar tsani, bermalam lagi dan melontar pada tanggal 13.','Untuk nafar awal pada contoh ini, keluar Mina…',['Sebelum matahari terbenam tanggal 12','Kapan pun tanpa ketentuan'],0,'rami',21),
    mission('Tawaf wada’','Sebelum meninggalkan Makkah','Jadikan tawaf wada’ sebagai amalan terakhir sebelum pulang. Tujuh putaran tanpa sa’i. Wanita haid dan nifas mendapatkan keringanan untuk tidak melakukannya.','Apakah tawaf wada’ disertai sa’i lagi?',['Tidak','Ya, selalu'],0,'tawaf',28)
];
export { UMRAH, HAJI };

// Shared learning content; gameplay and rendering live in separate modules.
export { SOURCES };
