// Learning progress is separate from the real-life manasik checklist.
const SOURCES = {
    haji:'https://rumaysho.com/2895-ringkasan-panduan-haji-7-amalan-amalan-haji.html',
    umrah:'https://rumaysho.com/36997-tata-cara-pelaksanaan-haji-rasulullah-secara-lengkap-dari-hadits-jabir.html'
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

export default class ManasikGame {
    constructor(root){
        this.root=root;this.mode='umrah';this.keys=new Set();this.player={x:100,y:330};this.storageKey='islamhub_manasik_game_v1';
        try{this.saved=JSON.parse(localStorage.getItem(this.storageKey))||{};}catch{this.saved={};}
        this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.render();this.restore();
        this.visibility=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;if(!this.visible)this.keys.clear();this.run();});this.visibility.observe(root);
        document.addEventListener('visibilitychange',()=>{if(document.hidden){this.keys.clear();this.moving=false;}this.run();});
    }
    get missions(){return this.mode==='haji'?HAJI:UMRAH;}
    get mission(){return this.missions[this.step];}
    render(){
        this.root.className='manasik-game';
        this.root.innerHTML=`<div class="mg-header"><div><span class="peraga-eyebrow">JELAJAH MANASIK</span><h3>Satu perjalanan, banyak pelajaran.</h3><p>Gerakkan jamaahmu. Temukan tempatnya. Pelajari urutan ibadahnya.</p></div><div class="mg-modes"><button data-mode="umrah" aria-pressed="true">Umrah</button><button data-mode="haji" aria-pressed="false">Haji tamattu</button></div></div>
        <div class="mg-layout"><div class="mg-world"><span class="mg-map-label">PETA ILUSTRASI · BUKAN SKALA GEOGRAFIS</span><canvas width="720" height="600" tabindex="0" aria-label="Peta permainan manasik. Klik tujuan atau gunakan tombol panah."></canvas><div class="mg-instructions"><span>Klik penanda emas atau gunakan tombol panah.</span><button data-walk>Jalan ke tujuan →</button></div></div>
        <section class="mg-mission"><div class="mg-status"></div><div class="mg-progress"><span></span></div><h4 tabindex="-1"></h4><p class="mg-description"></p><div class="mg-count"></div><div class="mg-feedback" role="status"></div><div class="mg-choices"></div><button class="mg-action" hidden>Lanjutkan perjalanan →</button></section></div>
        <div class="mg-route"></div><div class="mg-footer"><span>Progres belajar tersimpan di perangkat ini. Tanpa batas waktu.</span><button data-restart>Ulang perjalanan ini</button><a target="_blank" rel="noopener" class="mg-source">Baca rujukan manasik ↗</a><span>Latihan ini menyederhanakan perjalanan. Pelaksanaan ibadah mengikuti bimbingan manasik dan kondisi jamaah.</span></div>`;
        this.canvas=this.root.querySelector('canvas');this.ctx=this.canvas.getContext('2d');
        this.root.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{this.save();this.mode=b.dataset.mode;this.restore();});
        this.root.querySelector('[data-restart]').onclick=()=>{this.step=0;this.count=0;this.answered=false;this.complete=false;this.prepare();this.save();};
        this.root.querySelector('[data-walk]').onclick=()=>this.walk();
        this.root.querySelector('.mg-action').onclick=()=>this.next();
        this.canvas.addEventListener('pointerdown',e=>{const r=this.canvas.getBoundingClientRect(),x=(e.clientX-r.left)*720/r.width,y=(e.clientY-r.top)*600/r.height;if(this.target&&Math.hypot(x-this.target.x,y-this.target.y)<90)this.walk();else this.feedback('Ikuti penanda emas untuk mencapai tujuan berikutnya.');});
        this.canvas.addEventListener('keydown',e=>{
            if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','Enter'].includes(e.key))return;
            e.preventDefault();if(this.complete||this.moving||!this.target)return;
            if(e.key===' '||e.key==='Enter'){this.walk();return;}
            const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
            const [x,y]=directions[e.key],dx=this.target.x-this.player.x,dy=this.target.y-this.player.y;
            if(x*dx+y*dy>0 || this.mission.type==='rami')this.walk();
            else this.feedback('Pilih arah menuju penanda emas. Lintasan ibadah diikuti secara berurutan.');
        });
        this.canvas.addEventListener('keyup',e=>this.keys.delete(e.key));this.canvas.addEventListener('blur',()=>this.keys.clear());
    }
    restore(){
        const s=this.saved[this.mode]||{};this.step=Number.isInteger(s.step)?Math.max(0,Math.min(s.step,this.missions.length-1)):0;
        this.count=Number.isInteger(s.count)?Math.max(0,Math.min(s.count,this.mission.total)):0;this.answered=!!s.answered&&this.count===this.mission.total;this.complete=!!s.complete&&this.answered&&this.step===this.missions.length-1;
        this.prepare();
    }
    save(){this.saved[this.mode]={step:this.step,count:this.count,answered:this.answered,complete:this.complete};try{localStorage.setItem(this.storageKey,JSON.stringify(this.saved));}catch{/* Still playable when browser storage is unavailable. */}}
    prepare(){
        this.moving=false;this.keys.clear();const m=this.mission;
        this.angle=Math.PI/4-this.count*Math.PI/2;
        this.player=m.type==='tawaf'?this.ringPoint(this.angle):m.type==='sai'?{x:this.count%2?570:150,y:330}:{x:130,y:440};
        if(this.count>=m.total&&m.type==='visit')this.player={x:480,y:270};
        this.setTarget();this.update();this.draw();
    }
    ringPoint(angle){return{x:360+Math.cos(angle)*178,y:310+Math.sin(angle)*170};}
    setTarget(){const m=this.mission;if(this.count>=m.total){this.target=null;return;}
        this.target=m.type==='tawaf'?this.ringPoint(Math.PI/4-(this.count+1)*Math.PI/2):m.type==='sai'?{x:this.count%2?150:570,y:330}:m.type==='rami'?{x:440,y:310}:{x:480,y:270};
    }
    feedback(text){this.root.querySelector('.mg-feedback').textContent=text;}
    walk(){if(this.complete||this.moving||!this.target)return;this.moving=true;this.moveStart=performance.now();this.from={...this.player};this.startAngle=this.angle;this.endAngle=Math.PI/4-(this.count+1)*Math.PI/2;this.run();}
    arrive(){this.moving=false;this.count++;this.setTarget();this.save();this.update();}
    answer(index){const m=this.mission;if(index!==m.correct){this.feedback('Coba lagi. Baca petunjuk di atas sebelum memilih.');return;}this.answered=true;this.save();this.update();this.feedback('Benar. Pelajaran tahap ini selesai, lanjutkan saat siap.');this.root.querySelector('.mg-action').focus();}
    next(){if(!this.answered)return;if(this.step===this.missions.length-1){this.complete=true;this.save();this.update();this.draw();return;}this.step++;this.count=0;this.answered=false;this.prepare();this.save();this.root.querySelector('h4').focus();}
    update(){const q=s=>this.root.querySelector(s),m=this.mission;
        this.root.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===this.mode));
        q('.mg-source').href=SOURCES[this.mode];q('.mg-status').textContent=this.complete?'PERJALANAN BELAJAR SELESAI':`TAHAP ${this.step+1} / ${this.missions.length} · ${m.place}`;
        q('.mg-progress span').style.width=`${(this.step+(this.complete?1:0))/this.missions.length*100}%`;
        q('h4').textContent=this.complete?'Alhamdulillah, perjalanan selesai.':m.title;
        q('.mg-description').textContent=this.complete?`Kamu sudah mempelajari ${this.missions.length} tahap ${this.mode==='haji'?'haji tamattu':'umrah'}. Ulangi tahap yang perlu dipahami melalui perjalanan baru, atau pilih mode lain.`:m.text;
        q('.mg-count').textContent=m.type==='tawaf'?`${Math.floor(this.count/4)} / 7 putaran`:m.type==='sai'?`${this.count} / 7 perjalanan`:m.type==='rami'?`${this.count} / ${m.total} kerikil`:'';
        const ready=this.count>=m.total;
        q('[data-walk]').disabled=ready||this.complete;q('[data-walk]').textContent=m.type==='rami'?'Lontar satu kerikil':m.type==='tawaf'?'Ikuti lintasan ↶':'Jalan ke tujuan →';
        q('.mg-action').hidden=!this.answered||this.complete;q('.mg-action').textContent=this.step===this.missions.length-1?'Selesaikan perjalanan ✓':'Lanjutkan perjalanan →';
        q('.mg-choices').innerHTML='';
        if(ready&&!this.answered&&!this.complete){const title=document.createElement('p');title.textContent=m.question;q('.mg-choices').append(title);const options=m.answers.map((a,i)=>({a,i}));if(this.step%2)options.reverse();options.forEach(({a,i})=>{const b=document.createElement('button');b.textContent=a;b.onclick=()=>this.answer(i);q('.mg-choices').append(b);});}
        this.feedback(this.complete?'Progres ini mencatat latihan belajar, bukan pelaksanaan ibadah.':this.answered?'Tahap dipahami. Siap melanjutkan.':ready?'Tujuan tercapai. Jawab pertanyaan untuk membuka tahap berikutnya.':m.type==='tawaf'?'Ka’bah di kiri. Ikuti penanda berurutan di luar Hijr, tanpa memotong lintasan.':m.type==='sai'?`Tujuan berikutnya: ${this.count%2?'Shafa':'Marwah'}. Satu arah dihitung satu perjalanan.`:m.type==='rami'?`Lontar satu per satu. ${m.total===21?['Jumrah Ula','Jumrah Wustha','Jumrah Aqabah'][Math.min(2,Math.floor(this.count/7))]:'Jumrah Aqabah'}.`:'Temui penanda emas untuk memulai pelajaran di lokasi ini.');
        q('.mg-route').innerHTML=this.missions.map((v,i)=>`<span class="${i<this.step||this.complete?'done':''}">${i<this.step||this.complete?'✓':i+1} ${v.title}</span>`).join('');
        this.canvas.setAttribute('aria-label',`${m.title}. ${q('.mg-feedback').textContent} Gunakan tombol Jalan ke tujuan untuk gerakan terpandu.`);
    }
    run(){if(this.raf||!this.visible||document.hidden)return;this.raf=requestAnimationFrame(this.frame);}
    frame=(time)=>{this.raf=null;if(!this.visible||document.hidden)return;
        if(this.moving){const k=Math.min((time-this.moveStart)/(this.reduced?120:this.mission.type==='tawaf'?850:1000),1),ease=k*k*(3-2*k);
            if(this.mission.type==='tawaf'){this.angle=this.startAngle+(this.endAngle-this.startAngle)*ease;this.player=this.ringPoint(this.angle);}
            else if(this.mission.type!=='rami'){this.player={x:this.from.x+(this.target.x-this.from.x)*ease,y:this.from.y+(this.target.y-this.from.y)*ease};}
            this.throwProgress=this.mission.type==='rami'?k:0;
            if(k===1){this.throwProgress=0;this.arrive();}
        }
        this.draw(time);if(this.moving)this.run();
    };
    circle(x,y,r,fill,stroke){const c=this.ctx;c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
    text(text,x,y,size=16,color='#526749'){const c=this.ctx;c.font=`600 ${size}px system-ui`;c.textAlign='center';c.fillStyle=color;c.fillText(text,x,y);}
    building(x,y,w,h,color='#f5f0df'){const c=this.ctx;c.fillStyle='#00000010';c.fillRect(x+6,y+9,w,h);c.fillStyle=color;c.fillRect(x,y,w,h);c.strokeStyle='#c2cbb0';c.lineWidth=2;c.strokeRect(x,y,w,h);}
    draw(time=0){const c=this.ctx,m=this.mission;c.clearRect(0,0,720,600);c.fillStyle='#dfe7d2';c.fillRect(0,0,720,600);
        // Gentle garden/courtyard texture; stable across redraws.
        for(let i=0;i<32;i++){const x=(i*137+31)%720,y=(i*89+65)%600;this.circle(x,y,3,'#cdd8bd');}
        if(m.type==='tawaf'){
            this.circle(360,310,238,'#edeada','#c7ceb8');this.circle(360,310,201,'#f7f3e8');
            c.setLineDash([6,10]);c.lineWidth=2;this.circle(360,310,177,null,'#b7c3a2');c.setLineDash([]);
            // Hijr lies inside the complete tawaf path.
            c.beginPath();c.arc(360,270,78,Math.PI,0);c.lineWidth=8;c.strokeStyle='#cfcab3';c.stroke();
            this.building(304,255,112,110,'#2d3330');c.fillStyle='#c5a556';c.fillRect(304,281,112,13);c.fillStyle='#aa884a';c.fillRect(384,312,20,36);
            this.text('KA’BAH',360,393,13);this.text('Hijr',360,183,11);this.circle(416,365,5,'#151b17');this.text('Mulai / Hajar Aswad',499,440,11);
            this.text('↶',358,106,42,'#7c945f');
        }else if(m.type==='sai'){
            this.building(90,245,540,170);c.fillStyle='#d4dfc0';c.fillRect(110,310,500,40);c.fillStyle='#8fb98b';c.fillRect(302,265,10,130);c.fillRect(402,265,10,130);
            this.circle(150,330,48,'#b4c1a3');this.circle(570,330,48,'#b4c1a3');this.text('SHAFA',150,232,18);this.text('MARWAH',570,232,18);this.text('Area penanda hijau',359,448,13);
        }else if(m.type==='rami'){
            this.building(75,190,570,230);c.fillStyle='#e2dec8';c.fillRect(90,265,540,105);
            for(let i=0;i<3;i++){this.circle(245+i*150,310,43,'#d3cdb3');this.building(235+i*150,268,20,70,'#86947d');this.text(['Ula','Wustha','Aqabah'][i],245+i*150,393,14);}
            this.player={x:(m.total===7?545:245+Math.min(2,Math.floor(this.count/7))*150)-55,y:455};
            if(this.throwProgress){const x=this.player.x+55*this.throwProgress,y=455-145*this.throwProgress-Math.sin(this.throwProgress*Math.PI)*70;this.circle(x,y,5,'#5c6650');}
        }else{
            c.strokeStyle='#edead8';c.lineWidth=65;c.beginPath();c.moveTo(100,465);c.bezierCurveTo(280,450,260,240,520,260);c.stroke();
            if(m.place.includes('Arafah')){for(let i=0;i<5;i++){c.fillStyle=i%2?'#a4b493':'#bbc5a8';c.beginPath();c.moveTo(250+i*50,220);c.lineTo(380+i*30,90);c.lineTo(500+i*35,220);c.fill();}this.text('ARAFAH',460,246,20);}
            else if(m.place.includes('Mina')||m.place.includes('Muzdalifah')){
                for(let i=0;i<8;i++){const x=150+(i%4)*125,y=120+Math.floor(i/4)*100;this.building(x,y,90,55);c.fillStyle='#f9f7e8';c.beginPath();c.moveTo(x-5,y);c.lineTo(x+45,y-38);c.lineTo(x+95,y);c.fill();}this.text(m.place.includes('Mina')?'MINA':'MUZDALIFAH',360,355,21);
            }else{this.building(330,120,270,185);for(let i=0;i<4;i++){c.fillStyle='#567b61';c.beginPath();c.roundRect(345+i*63,192,42,90,[22,22,0,0]);c.fill();}this.circle(465,128,56,'#c1d0ad');c.fillStyle='#e0e6ce';c.fillRect(400,129,130,20);this.text(m.place.toUpperCase(),462,357,19);}
            for(const [x,y] of [[80,200],[610,420],[210,530]]){c.fillStyle='#7e946e';c.fillRect(x-3,y,6,35);this.circle(x,y-5,23,'#97b485');this.circle(x-9,y-12,13,'#acc198');}
        }
        if(this.target&&m.type!=='rami') {this.circle(this.target.x,this.target.y,25,'#c6a14d33');this.circle(this.target.x,this.target.y,13,'#bb9543');this.text('↓',this.target.x,this.target.y-32,28,'#98772f');}
        const p=this.player;this.circle(p.x+3,p.y+9,15,'#00000018');
        // Top-down pilgrim with ivory garments and a warm, minimal silhouette.
        c.fillStyle='#51674b';c.fillRect(p.x-7,p.y+9,5,10);c.fillRect(p.x+3,p.y+9,5,10);
        this.circle(p.x,p.y,14,'#fffdf0','#abb49c');this.circle(p.x,p.y-10,8,'#ae805a');this.circle(p.x-14,p.y+1,4,'#ae805a');this.circle(p.x+14,p.y+1,4,'#ae805a');
        this.text('KAMU',p.x,p.y+38,9);
        if(this.complete){c.fillStyle='#f5f1e7e8';c.fillRect(90,200,540,155);this.text('✓',360,253,40,'#5a804b');this.text('Perjalanan belajar selesai',360,304,25,'#365739');}
    }
}
