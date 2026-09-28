import MosqueScene from './mosque-scene.js?v=4.0.1';

const POSES = [
    // ===== RAKA'AT 1 =====
    {
        id: 'takbiratul_ihram',
        name: 'Takbiratul Ihram',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'اللَّهُ أَكْبَرُ',
        latin: 'Allahu Akbar',
        translation: 'Allah Maha Besar',
        tip: 'Angkat kedua tangan sejajar bahu atau ujung telinga (keduanya shahih), jari-jari terbuka menghadap kiblat. Niat cukup di dalam hati, melafadzkan "Ushalli…" tidak ada tuntunannya dari Nabi ﷺ (Ibnu Taimiyah, Ibnul Qayyim, Al-Albani, Ibnu Baz).',
        duration: 3200,
        body: 'stand',
        arms: 'takbir',
        head: { tilt: 0, turn: 0 }
    },
    {
        id: 'qiyam_1',
        name: 'Bersedekap, Membaca Al-Fatihah (Raka\'at 1)',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        latin: 'Bismillahir-rahmanir-rahim. Alhamdu lillahi rabbil-\'alamin…',
        translation: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Rabb semesta alam…',
        tip: 'Tangan KANAN di atas tangan kiri, diletakkan DI ATAS DADA (HR. Ibnu Khuzaimah dari Wa\'il bin Hujr, dishahihkan Al-Albani). Pandangan ke tempat sujud. Urutan: Doa Iftitah → Ta\'awwudz → Al-Fatihah → surat pendek.',
        duration: 5000,
        body: 'stand',
        arms: 'sedekap',
        head: { tilt: -0.35, turn: 0 }
    },
    {
        id: 'ruku_1',
        name: 'Ruku\' dengan Tuma\'ninah (Raka\'at 1)',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        latin: 'Subhana Rabbiyal-\'Adzim (3×)',
        translation: 'Maha Suci Rabbku Yang Maha Agung',
        tip: 'Sebelum membungkuk, angkat kedua tangan (raf\'ul yadain) sambil bertakbir. Punggung lurus RATA sejajar lantai, kepala segaris punggung (tidak mendongak, tidak terkulai), kedua tangan menggenggam lutut dengan jari direnggangkan.',
        duration: 3800,
        body: 'ruku',
        arms: 'knees',
        head: { tilt: 0, turn: 0 },
        // Raf'ul yadain: angkat tangan dulu sambil berdiri sebelum membungkuk.
        via: { body: 'stand', arms: 'takbir', head: { tilt: -0.1, turn: 0 } }
    },
    {
        id: 'itidal_1',
        name: 'I\'tidal dengan Tuma\'ninah (Raka\'at 1)',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ',
        latin: 'Sami\'allahu liman hamidah. Rabbana wa lakal-hamd',
        translation: 'Allah mendengar siapa yang memuji-Nya. Wahai Rabb kami, segala puji bagi-Mu',
        tip: 'Bangkit dari ruku\' sambil raf\'ul yadain seraya mengucap "Sami\'allahu liman hamidah". Berdiri tegak sempurna dengan tenang sebelum turun sujud, jangan tergesa-gesa.',
        duration: 3200,
        body: 'stand',
        arms: 'down',
        head: { tilt: -0.25, turn: 0 },
        // Raf'ul yadain: bangkit dari ruku' dengan tangan terangkat, lalu turun.
        via: { body: 'stand', arms: 'takbir', head: { tilt: -0.1, turn: 0 } }
    },
    {
        id: 'sujud_1a',
        name: 'Sujud Pertama (Raka\'at 1)',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        latin: 'Subhana Rabbiyal-A\'la (3×)',
        translation: 'Maha Suci Rabbku Yang Maha Tinggi',
        tip: 'Sujud di atas TUJUH anggota: dahi + hidung, dua telapak tangan, dua lutut, ujung jari kedua kaki (ditegakkan menghadap kiblat). Kedua lengan DIANGKAT dari lantai dan dijauhkan dari lambung, "janganlah menghamparkan lengan seperti anjing" (HR. Bukhari–Muslim).',
        duration: 3800,
        body: 'sujud',
        arms: 'sujud',
        head: { tilt: 0, turn: 0 }
    },
    {
        id: 'duduk_1',
        name: 'Duduk Antara Dua Sujud (Iftirasy)',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'رَبِّ اغْفِرْ لِي',
        latin: 'Rabbighfir li',
        translation: 'Wahai Rabbku, ampunilah aku',
        tip: 'Duduk IFTIRASY: telapak kaki kiri dijadikan alas (diduduki), telapak kaki KANAN DITEGAKKAN dengan jari-jari menghadap kiblat. Kedua tangan di atas paha dekat lutut.',
        duration: 3500,
        body: 'iftirasy',
        arms: 'thighs',
        head: { tilt: -0.2, turn: 0 }
    },
    {
        id: 'sujud_1b',
        name: 'Sujud Kedua (Raka\'at 1)',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        latin: 'Subhana Rabbiyal-A\'la (3×)',
        translation: 'Maha Suci Rabbku Yang Maha Tinggi',
        tip: 'Sujud kedua sebagaimana sujud pertama dengan tuma\'ninah penuh. Perbanyaklah doa ketika sujud (HR. Muslim).',
        duration: 3800,
        body: 'sujud',
        arms: 'sujud',
        head: { tilt: 0, turn: 0 }
    },

    // ===== RAKA'AT 2 =====
    {
        id: 'qiyam_2',
        name: 'Berdiri, Membaca Al-Fatihah (Raka\'at 2)',
        ruling: 'Rukun • Raka\'at 2',
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        latin: 'Alhamdu lillahi rabbil-\'alamin… (Al-Fatihah + surat)',
        translation: 'Segala puji bagi Allah, Rabb semesta alam…',
        tip: 'Bangkit dengan takbir (disunnahkan duduk istirahat sejenak, jalsatul istirahah, menurut sebagian ulama). Pada raka\'at kedua langsung membaca Al-Fatihah tanpa doa iftitah.',
        duration: 5000,
        body: 'stand',
        arms: 'sedekap',
        head: { tilt: -0.35, turn: 0 }
    },
    {
        id: 'ruku_2',
        name: 'Ruku\' (Raka\'at 2)',
        ruling: 'Rukun • Raka\'at 2',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        latin: 'Subhana Rabbiyal-\'Adzim (3×)',
        translation: 'Maha Suci Rabbku Yang Maha Agung',
        tip: 'Bertakbir disertai raf\'ul yadain, lalu ruku\' dengan tuma\'ninah sebagaimana raka\'at pertama.',
        duration: 3800,
        body: 'ruku',
        arms: 'knees',
        head: { tilt: 0, turn: 0 },
        via: { body: 'stand', arms: 'takbir', head: { tilt: -0.1, turn: 0 } }
    },
    {
        id: 'itidal_2',
        name: 'I\'tidal (Raka\'at 2)',
        ruling: 'Rukun • Raka\'at 2',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ',
        latin: 'Sami\'allahu liman hamidah. Rabbana wa lakal-hamd',
        translation: 'Allah mendengar siapa yang memuji-Nya. Wahai Rabb kami, segala puji bagi-Mu',
        tip: 'Bangkit dari ruku\' dengan raf\'ul yadain, berdiri tegak sempurna dengan tuma\'ninah.',
        duration: 3200,
        body: 'stand',
        arms: 'down',
        head: { tilt: -0.25, turn: 0 },
        via: { body: 'stand', arms: 'takbir', head: { tilt: -0.1, turn: 0 } }
    },
    {
        id: 'sujud_2a',
        name: 'Sujud Pertama (Raka\'at 2)',
        ruling: 'Rukun • Raka\'at 2',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        latin: 'Subhana Rabbiyal-A\'la (3×)',
        translation: 'Maha Suci Rabbku Yang Maha Tinggi',
        tip: 'Pastikan ketujuh anggota sujud menempel sempurna: dahi & hidung, dua telapak tangan, dua lutut, ujung jari kedua kaki.',
        duration: 3800,
        body: 'sujud',
        arms: 'sujud',
        head: { tilt: 0, turn: 0 }
    },
    {
        id: 'duduk_2',
        name: 'Duduk Antara Dua Sujud (Raka\'at 2)',
        ruling: 'Rukun • Raka\'at 2',
        arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَارْزُقْنِي',
        latin: 'Rabbighfirli warhamni wahdini warzuqni',
        translation: 'Wahai Rabbku, ampunilah aku, kasihanilah aku, berilah aku petunjuk dan rizki',
        tip: 'Duduk iftirasy dengan tuma\'ninah sebagaimana raka\'at pertama.',
        duration: 3500,
        body: 'iftirasy',
        arms: 'thighs',
        head: { tilt: -0.2, turn: 0 }
    },
    {
        id: 'sujud_2b',
        name: 'Sujud Kedua (Raka\'at 2)',
        ruling: 'Rukun • Raka\'at 2',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        latin: 'Subhana Rabbiyal-A\'la (3×)',
        translation: 'Maha Suci Rabbku Yang Maha Tinggi',
        tip: 'Sujud terakhir sebelum duduk tasyahud akhir.',
        duration: 3800,
        body: 'sujud',
        arms: 'sujud',
        head: { tilt: 0, turn: 0 }
    },

    // ===== TASYAHUD AKHIR & SALAM =====
    {
        id: 'tasyahud_akhir',
        name: 'Tasyahud Akhir (Iftirasy, Dua Rakaat)',
        ruling: 'Rukun • Tasyahud',
        arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
        latin: 'At-tahiyyatu lillahi wash-shalawatu wath-thayyibat. As-salamu \'alaika ayyuhan-nabiyyu wa rahmatullahi wa barakatuh…',
        translation: 'Segala penghormatan, ibadah, dan kebaikan hanya milik Allah. Semoga keselamatan, rahmat, dan keberkahan Allah tercurah atasmu wahai Nabi…',
        tip: 'Contoh dua rakaat ini memakai iftirasy: duduk di atas kaki kiri, kaki kanan tegak. Telunjuk kanan mengarah ke kiblat, pandangan ke telunjuk. Tawarruk pada tasyahud akhir sholat tiga atau empat rakaat menurut pilihan Ibnu Baz. Ada perbedaan pendapat ulama.',
        duration: 5000,
        body: 'iftirasy',
        arms: 'tasyahud',
        head: { tilt: -0.3, turn: 0 }
    },
    {
        id: 'sholawat',
        name: 'Sholawat Ibrahimiyyah atas Nabi ﷺ',
        ruling: 'Rukun • Setelah Tasyahud',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ',
        latin: 'Allahumma shalli \'ala Muhammad wa \'ala ali Muhammad, kama shallaita \'ala Ibrahim wa \'ala ali Ibrahim…',
        translation: 'Ya Allah, limpahkanlah shalawat kepada Muhammad dan keluarga Muhammad, sebagaimana Engkau limpahkan kepada Ibrahim dan keluarga Ibrahim…',
        tip: 'Setelah sholawat, berlindunglah dari EMPAT perkara: adzab Jahannam, adzab kubur, fitnah hidup & mati, dan fitnah Al-Masih Ad-Dajjal (HR. Muslim), lalu berdoa sekehendaknya.',
        duration: 5000,
        body: 'iftirasy',
        arms: 'tasyahud',
        head: { tilt: -0.3, turn: 0 }
    },
    {
        id: 'salam_kanan',
        name: 'Salam ke Kanan',
        ruling: 'Rukun • Penutup',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        latin: 'As-salamu \'alaikum wa rahmatullah',
        translation: 'Semoga keselamatan dan rahmat Allah tercurah atas kalian',
        tip: 'Menoleh ke KANAN hingga pipi terlihat dari belakang sambil mengucapkan salam.',
        duration: 3000,
        body: 'iftirasy',
        arms: 'thighs',
        head: { tilt: 0, turn: -1.05 }
    },
    {
        id: 'salam_kiri',
        name: 'Salam ke Kiri',
        ruling: 'Penyempurna • Selesai',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        latin: 'As-salamu \'alaikum wa rahmatullah',
        translation: 'Semoga keselamatan dan rahmat Allah tercurah atas kalian',
        tip: 'Menoleh ke KIRI hingga pipi terlihat dari belakang. Sholat selesai, lanjutkan dzikir ba\'da sholat sebagaimana dicontohkan Nabi ﷺ.',
        duration: 3000,
        body: 'iftirasy',
        arms: 'thighs',
        head: { tilt: 0, turn: 1.05 }
    }
];


export default class Peraga3D {
    constructor(){this.currentStep=0;this.isPlaying=false;this.bound=false;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;}
    onShow(){
        if(!this.bound){
            this.bound=true;this.buildUI();this.bindControls();
            try{this.world=new MosqueScene(document.getElementById('peragaCanvas'));this.world.onStatus=message=>this.showSceneStatus(message);}catch(error){document.querySelector('.peraga-stage').innerHTML='<p class="peraga-fallback">'+error.message+' Bacaan dan urutan langkah tetap dapat dipelajari di bawah.</p>';}
            this.observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!document.hidden){this.world?.start();}else{this.pause();this.world?.stop();}});this.observer.observe(document.getElementById('sholatPeraga'));
            document.addEventListener('visibilitychange',()=>{if(document.hidden)this.onHide();else if(document.getElementById('sholatPeraga').offsetParent)this.world?.start();});
        }
        this.setStep(this.currentStep,false);this.world?.start();
    }
    buildUI(){
        document.getElementById('peragaTimeline').innerHTML=POSES.map((p,i)=>'<button class="peraga-dot" data-step="'+i+'" aria-label="Langkah '+(i+1)+': '+p.name+'">'+(i+1)+'</button>').join('');
        document.querySelectorAll('.peraga-dot').forEach(b=>b.addEventListener('click',()=>{this.pause();this.setStep(+b.dataset.step);}));
    }
    bindControls(){
        const on=(id,fn)=>document.getElementById(id)?.addEventListener('click',fn);
        on('peragaRecoverBtn',()=>this.world?.recover());
        on('peragaPrevBtn',()=>{this.pause();this.setStep(this.currentStep-1);});
        on('peragaNextBtn',()=>{this.pause();this.setStep(this.currentStep+1);});
        on('peragaPlayBtn',()=>this.isPlaying?this.pause():this.play());
        on('peragaResetBtn',()=>{this.pause();this.setStep(0,false);if(this.world)this.world.setView(2.25,.18);this.syncCameraButtons('2.25');});
        on('peragaRotateBtn',()=>{if(this.world){this.world.setAutoRotate(!this.world.rotate);document.getElementById('peragaRotateBtn').setAttribute('aria-pressed',this.world.rotate);}});
        document.querySelectorAll('[data-prayer-view]').forEach(b=>b.addEventListener('click',()=>{if(this.world)this.world.setView(+b.dataset.prayerView);this.syncCameraButtons(b.dataset.prayerView);}));
    }
    syncCameraButtons(view){
        document.querySelectorAll('[data-prayer-view]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.prayerView===view));
        document.getElementById('peragaRotateBtn').setAttribute('aria-pressed','false');
    }
    showSceneStatus(message){
        const status=document.getElementById('peragaSceneStatus');
        if(!status)return;status.hidden=!message;status.querySelector('p').textContent=message;
        if(message)this.pause();
    }
    setStep(index,animate=true){
        index=Math.max(0,Math.min(POSES.length-1,index));const previous=POSES[this.currentStep],p=POSES[index];this.currentStep=index;
        const via=[];
        if(animate&&p.via)via.push(p.via);
        if(animate&&previous.body==='stand'&&p.body==='sujud')via.push({body:'kneel',arms:'down'});
        if(animate&&previous.body==='sujud'&&p.body==='stand')via.push({body:'iftirasy',arms:'thighs'});
        this.world?.setPose(p,animate&&!this.reduced,via);
        const set=(id,t)=>document.getElementById(id).textContent=t;
        set('peragaStepNum',index+1);set('peragaStepTotal',POSES.length);set('peragaPoseName',p.name);set('peragaBacaanName',p.name);set('peragaBacaanRuling',index<7?'Rakaat 1':index<13?'Rakaat 2':'Tasyahud & salam');
        set('peragaBacaanArabic',p.arabic);set('peragaBacaanLatin',p.latin);set('peragaBacaanTranslation',p.translation);
        let tip=p.tip;
        if(p.id.startsWith('itidal'))tip+=' Setelah mengangkat tangan, turunkan keduanya di samping badan. Peraga memakai posisi irsal; posisi tangan setelah rukuk merupakan perkara yang diperselisihkan ulama.';
        if(p.arabic.includes('…')||p.latin.includes('…'))tip+=' Bacaan di atas adalah cuplikan. Buka tab Bacaan Sholat untuk teks lengkap.';
        set('peragaBacaanTip',tip);
        document.getElementById('peragaCanvas')?.setAttribute('aria-label',p.name+'. '+tip);
        document.getElementById('peragaPrevBtn').disabled=index===0;document.getElementById('peragaNextBtn').disabled=index===POSES.length-1;
        document.querySelectorAll('.peraga-dot').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-current',i===index?'step':'false');});
    }
    play(){if(this.currentStep===POSES.length-1)this.setStep(0,false);this.isPlaying=true;this.updatePlay();this.queue();}
    queue(){clearTimeout(this.timer);this.timer=setTimeout(()=>{if(!this.isPlaying)return;if(this.currentStep===POSES.length-1){this.pause();return;}this.setStep(this.currentStep+1);this.queue();},POSES[this.currentStep].duration+2300);}
    pause(){this.isPlaying=false;clearTimeout(this.timer);this.updatePlay();}
    updatePlay(){const b=document.getElementById('peragaPlayBtn');if(b){b.innerHTML=this.isPlaying?'⏸ Jeda':'▶ Putar';b.setAttribute('aria-label',this.isPlaying?'Jeda peragaan':'Putar peragaan');}}
    onHide(){this.pause();this.world?.stop();}
}
export { POSES };
