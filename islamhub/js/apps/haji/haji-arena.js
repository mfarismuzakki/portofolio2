// Arena Manasik: four learning games for hajj and umrah.
import Arena from '../../utils/arena.js';
import { shuffle, pick, blip, vibrate } from '../../utils/game-kit.js';
import { UMRAH, HAJI } from './manasik-game.js';

const DAYS = ['8 Dzulhijjah · Tarwiyah', '9 Dzulhijjah · Arafah', '10 Dzulhijjah · Nahr', '11–13 Dzulhijjah · Tasyrik'];
const DAY_CARDS = [
    ['Berihram haji dari tempat tinggal di Makkah lalu berangkat ke Mina', [0], 'Hari Tarwiyah, 8 Dzulhijjah.'],
    ['Bermalam di Mina, sholat empat rakaat diqashar tanpa dijamak', [0], 'Mabit malam 9 di Mina pada hari Tarwiyah.'],
    ['Wukuf di Arafah hingga matahari terbenam', [1], 'Wukuf adalah rukun haji: “Haji adalah Arafah.”'],
    ['Dzuhur dan Ashar dijamak taqdim dan diqashar', [1], 'Dilakukan di Arafah sebelum wukuf.'],
    ['Hari yang dianjurkan berpuasa bagi yang tidak berhaji', [1], 'Puasa Arafah menghapus dosa dua tahun (HR. Muslim); jamaah haji tidak berpuasa.'],
    ['Bermalam di Muzdalifah', [2], 'Malam 10 Dzulhijjah: hari hijriah dimulai sejak maghrib tanggal 9.'],
    ['Melontar Jumrah Aqabah saja dengan tujuh kerikil', [2], 'Hari Nahr hanya Jumrah Aqabah.'],
    ['Mencukur atau memendekkan rambut, tahallul awal', [2], 'Setelah melontar Aqabah pada hari Nahr.'],
    ['Menyembelih hadyu tamattu', [2, 3], 'Utamanya hari Nahr; waktunya berlanjut hingga akhir hari tasyrik.'],
    ['Tawaf ifadhah', [2, 3], 'Utamanya hari Nahr; boleh diakhirkan.'],
    ['Melontar tiga jumrah setelah zawal: Ula, Wustha, Aqabah', [3], 'Dilakukan pada hari-hari tasyrik.'],
    ['Nafar awal: meninggalkan Mina sebelum matahari terbenam tanggal 12', [3], 'QS. Al-Baqarah: 203.'],
    ['Hari yang dilarang berpuasa, kecuali jamaah yang tidak mendapat hadyu', [3], 'Hadits ‘Aisyah dan Ibnu ‘Umar (HR. Bukhari).'],
    ['Hari raya Idul Adha', [2], '10 Dzulhijjah adalah Yaumun Nahr.']
];

const IHRAM = [
    ['Memakai parfum setelah berniat ihram', false, 'Wewangian termasuk larangan ihram (HR. Bukhari & Muslim).'],
    ['Mandi dan membersihkan badan', true, 'Nabi ﷺ mandi ketika ihram (HR. Bukhari & Muslim, dari Abu Ayyub).'],
    ['Laki-laki memakai peci atau topi', false, 'Laki-laki tidak menutup kepala dengan sesuatu yang menempel.'],
    ['Berteduh di bawah payung atau tenda', true, 'Nabi ﷺ dinaungi kain saat melontar jumrah (HR. Muslim).'],
    ['Memotong kuku', false, 'Termasuk larangan ihram menurut kesepakatan ulama, diqiyaskan dengan rambut.'],
    ['Memakai jam tangan, cincin, atau kacamata', true, 'Tidak termasuk pakaian yang dilarang.'],
    ['Memakai sabuk atau tas pinggang', true, 'Boleh untuk menyimpan uang dan barang.'],
    ['Laki-laki memakai kaus dan celana', false, 'Laki-laki dilarang memakai pakaian berjahit yang membentuk badan (HR. Bukhari).'],
    ['Perempuan memakai niqab (cadar)', false, '“Wanita yang ihram tidak memakai niqab dan sarung tangan” (HR. Bukhari).'],
    ['Perempuan memakai sarung tangan', false, 'Larangan yang sama dalam hadits Ibnu ‘Umar (HR. Bukhari).'],
    ['Perempuan memakai pakaian biasa yang menutup aurat', true, 'Tidak ada warna atau model khusus ihram bagi perempuan.'],
    ['Berburu hewan darat', false, 'QS. Al-Ma’idah: 95.'],
    ['Membunuh kalajengking atau tikus yang mengganggu', true, 'Lima hewan pengganggu boleh dibunuh walau sedang ihram (HR. Bukhari & Muslim).'],
    ['Melangsungkan akad nikah', false, '“Orang yang ihram tidak menikah dan tidak menikahkan” (HR. Muslim).'],
    ['Bertengkar dan berkata kotor', false, '“Tidak boleh rafats, fasik, dan berbantah-bantahan dalam haji” (QS. Al-Baqarah: 197).'],
    ['Memakai sandal', true, 'Laki-laki memakai sandal; bila tidak ada, boleh khuf yang dipotong.'],
    ['Mengganti kain ihram dengan kain ihram lain yang bersih', true, 'Boleh berganti kain ihram.'],
    ['Menggaruk kepala dengan lembut', true, 'Boleh selama tidak sengaja mencabut rambut.'],
    ['Mencabut bulu ketiak', false, 'Termasuk menghilangkan rambut yang dilarang.'],
    ['Bersiwak atau menyikat gigi', true, 'Tidak termasuk larangan ihram.'],
    ['Laki-laki menutup kepala dengan selimut saat tidur', false, 'Kepala laki-laki tetap terbuka selama ihram.']
];

const QUIZ = [...UMRAH, ...HAJI.slice(UMRAH.length)].map(m => ({ q: m.question, a: m.answers, c: m.correct, place: m.title }));

// ---------- Lontar Jumrah ----------
function jumrahGame(api) {
    const NAMES = ['Ula', 'Wustha', 'Aqabah'];
    const W = 720, H = 360, X = [180, 360, 540];
    let throws = 0, spares = 5, score = 0, combo = 0, choice = 0, needle = 0, dir = 1, zone = null, flying = null, raf = null, last = null, msg = null, done = false;
    const lines = [];
    api.stage.innerHTML = `<div class="gk-throw">
        <p class="gk-prompt">Hari tasyrik: lontar <b>Ula → Wustha → Aqabah</b>, masing-masing 7 kerikil. Pilih jumrah, lalu tekan <b>Lontar</b> saat jarum di zona hijau. Kerikil yang meleset tidak dihitung, gunakan kerikil cadangan.</p>
        <canvas width="${W * 2}" height="${H * 2}" aria-label="Arena lontar jumrah"></canvas>
        <div class="gk-throw-controls"><div class="gk-pillars" role="group" aria-label="Pilih jumrah">${NAMES.map((n, i) => `<button data-p="${i}" aria-pressed="${i === 0}">${n}</button>`).join('')}</div>
        <button class="gk-btn gk-primary" data-throw>🤲 Lontar</button><span class="gk-chip gk-spares"></span></div></div>`;
    const canvas = api.stage.querySelector('canvas'), c = canvas.getContext('2d');
    c.scale(2, 2);
    const newZone = () => { const width = Math.max(0.1, 0.24 - throws * 0.006); const start = 0.08 + Math.random() * (0.84 - width); zone = [start, start + width]; };
    newZone();
    const target = () => Math.min(2, Math.floor(throws / 7));
    const hud = () => { api.hud({ score, round: throws, total: 21, combo }); api.stage.querySelector('.gk-spares').textContent = `Cadangan: ${'●'.repeat(Math.max(0, spares))}${'○'.repeat(Math.max(0, 5 - Math.max(0, spares)))}`; };
    const draw = () => {
        c.clearRect(0, 0, W, H);
        const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f4efdf'); g.addColorStop(1, '#e3dcc6'); c.fillStyle = g; c.fillRect(0, 0, W, H);
        for (let i = 0; i < 3; i++) {
            const x = X[i], active = i === target();
            c.fillStyle = '#cbc5ad'; c.beginPath(); c.ellipse(x, 214, 70, 30, 0, 0, Math.PI * 2); c.fill();
            c.fillStyle = active ? '#efe3bf' : '#e8e1cc'; c.strokeStyle = active ? '#a07b32' : '#b8b39b'; c.lineWidth = active ? 3 : 1.5;
            c.beginPath(); c.ellipse(x, 208, 62, 25, 0, 0, Math.PI * 2); c.fill(); c.stroke();
            c.fillStyle = '#8b977f'; c.fillRect(x - 12, 112, 24, 96); c.fillStyle = '#a7b399'; c.fillRect(x - 12, 112, 15, 92);
            c.fillStyle = '#21483b'; c.font = '700 13px system-ui'; c.textAlign = 'center';
            c.fillText(NAMES[i].toUpperCase(), x, 96);
            const n = Math.max(0, Math.min(7, throws - i * 7));
            for (let k = 0; k < 7; k++) { c.fillStyle = k < n ? '#2f7d5b' : '#d6d1bd'; c.beginPath(); c.arc(x - 27 + k * 9, 250, 3.4, 0, Math.PI * 2); c.fill(); }
            if (i === choice) { c.strokeStyle = '#21483b'; c.setLineDash([4, 4]); c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, 208, 74, 32, 0, 0, Math.PI * 2); c.stroke(); c.setLineDash([]); }
        }
        // Player and power meter.
        c.fillStyle = '#fffaf0'; c.beginPath(); c.ellipse(X[choice], 320, 12, 16, 0, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#c19369'; c.beginPath(); c.arc(X[choice], 298, 8, 0, Math.PI * 2); c.fill();
        const mx = 120, mw = 480, my = 344;
        c.fillStyle = '#e5e9dc'; c.fillRect(mx, my, mw, 9);
        c.fillStyle = '#2f7d5b88'; c.fillRect(mx + zone[0] * mw, my, (zone[1] - zone[0]) * mw, 9);
        c.fillStyle = '#21483b'; c.fillRect(mx + needle * mw - 2, my - 4, 4, 17);
        if (flying) {
            const k = flying.t;
            const tx = X[flying.p] + flying.off, ty = 208 + (flying.hit ? 0 : 46);
            const x = X[choice] + (tx - X[choice]) * k, y = 296 + (ty - 296) * k - Math.sin(k * Math.PI) * 120;
            c.fillStyle = '#6e5f49'; c.beginPath(); c.arc(x, y, 4.5, 0, Math.PI * 2); c.fill();
        }
        if (msg) { c.globalAlpha = Math.max(0, msg.life / 900); c.fillStyle = msg.color; c.font = '800 20px system-ui'; c.fillText(msg.text, msg.x, 60 - (900 - msg.life) / 30); c.globalAlpha = 1; }
    };
    const frame = now => {
        const dt = last === null ? 0 : Math.min(50, now - last); last = now;
        if (api.visible()) {
            if (!flying) { needle += dir * dt * (0.0006 + throws * 0.00003); if (needle > 1) { needle = 1; dir = -1; } if (needle < 0) { needle = 0; dir = 1; } }
            else { flying.t = Math.min(1, flying.t + dt / 650); if (flying.t >= 1) land(); }
            if (msg) { msg.life -= dt; if (msg.life <= 0) msg = null; }
            draw();
        }
        if (!done) raf = requestAnimationFrame(frame);
    };
    const land = () => {
        const f = flying; flying = null;
        if (f.wrong) return;
        if (f.hit) {
            throws++; combo++;
            const gain = 80 + f.accuracy + (combo > 3 ? 20 : 0);
            score += gain; blip('ok');
            msg = { text: 'Allāhu akbar!', x: X[f.p], color: '#2f7d5b', life: 900 };
            api.feedback(`Masuk kolam ${NAMES[f.p]} (+${gain}).${throws % 7 === 0 && throws < 21 ? ` ${NAMES[f.p]} selesai. ${f.p < 2 ? 'Berdoa sejenak, lalu lanjut ke ' + NAMES[f.p + 1] + '.' : ''}` : ''}`, 'ok');
            newZone();
            if (throws >= 21) { done = true; setTimeout(() => api.end({ score, max: 21 * 140, lines: [`${21} kerikil masuk, ${5 - spares} kerikil cadangan terpakai.`, ...lines.slice(0, 3)] }), 700); }
        } else {
            combo = 0; spares--; blip('bad'); vibrate(); api.flash('bad');
            msg = { text: 'Meleset', x: X[f.p], color: '#b5543f', life: 900 };
            api.feedback('Kerikil tidak masuk kolam sehingga tidak dihitung. Lontar lagi dengan kerikil cadangan.', 'bad');
            lines.push('Kerikil harus masuk ke kolam jumrah; yang meleset diganti.');
            if (spares < 0) { done = true; setTimeout(() => api.end({ score, max: 21 * 140, lines: [`Kerikil cadangan habis setelah ${throws} lontaran masuk.`, ...lines.slice(0, 3)] }), 600); }
        }
        hud();
    };
    const fire = () => {
        if (flying || done) return;
        const t = target();
        if (choice !== t) {
            combo = 0; score = Math.max(0, score - 30); blip('bad'); api.flash('bad');
            api.feedback(`Urutannya Ula → Wustha → Aqabah. Sekarang giliran <b>${NAMES[t]}</b> (−30).`, 'bad');
            lines.push(`Melontar ${NAMES[choice]} sebelum ${NAMES[t]} tidak sesuai urutan.`);
            hud(); return;
        }
        const hit = needle >= zone[0] && needle <= zone[1];
        const mid = (zone[0] + zone[1]) / 2, half = (zone[1] - zone[0]) / 2;
        flying = { t: 0, p: choice, hit, off: hit ? (needle - mid) / half * 30 : (needle < mid ? -90 : 90), accuracy: hit ? Math.round((1 - Math.abs(needle - mid) / half) * 60) : 0 };
        blip('tap');
    };
    api.stage.querySelector('.gk-pillars').onclick = e => { const b = e.target.closest('button'); if (!b) return; choice = Number(b.dataset.p); api.stage.querySelectorAll('.gk-pillars button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); };
    api.stage.querySelector('[data-throw]').onclick = fire;
    canvas.addEventListener('pointerdown', e => {
        const r = canvas.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width;
        const near = X.findIndex(px => Math.abs(px - x) < 90);
        if (near >= 0 && near !== choice) api.stage.querySelector(`[data-p="${near}"]`).click(); else fire();
    });
    const key = e => { if (e.code === 'Space' && api.visible()) { e.preventDefault(); fire(); } };
    document.addEventListener('keydown', key);
    api.onCleanup(() => { done = true; cancelAnimationFrame(raf); document.removeEventListener('keydown', key); });
    hud();
    api.feedback('Mulai dari Jumrah Ula. Tekan spasi atau ketuk area untuk melontar.');
    raf = requestAnimationFrame(frame);
}

// ---------- Hari Manasik ----------
function dayGame(api) {
    const cards = shuffle(DAY_CARDS).slice(0, 12);
    let i = 0, score = 0, lives = 3, combo = 0, wait = null;
    const lines = [];
    api.onCleanup(() => clearTimeout(wait));
    const show = () => {
        if (i >= cards.length || lives <= 0) return api.end({ score, max: cards.length * 115, lines: lines.slice(0, 4) });
        const [text, ok, why] = cards[i++];
        api.hud({ score, lives, round: i, total: cards.length, combo });
        api.stage.innerHTML = `<p class="gk-prompt">Amalan ini dilakukan pada hari…</p><div class="gk-card-big">${text}</div>
            <div class="gk-days">${DAYS.map((d, k) => `<button class="gk-option" data-k="${k}">${d}</button>`).join('')}</div>`;
        api.feedback('');
        api.stage.querySelector('.gk-days').onclick = e => {
            const b = e.target.closest('button'); if (!b || b.disabled) return;
            const k = Number(b.dataset.k), right = ok.includes(k);
            api.stage.querySelectorAll('.gk-option').forEach(o => { o.disabled = true; o.classList.toggle('right', ok.includes(Number(o.dataset.k))); o.classList.toggle('wrong', o === b && !right); });
            if (right) { combo++; score += 100 + (combo > 2 ? 15 : 0); blip('ok'); api.flash('ok'); api.feedback(`Tepat. ${why}`, 'ok'); }
            else { combo = 0; lives--; blip('bad'); vibrate(); api.flash('bad'); api.feedback(`${why}`, 'bad'); lines.push(`${text}: ${ok.map(x => DAYS[x]).join(' / ')}.`); }
            api.hud({ score, lives, combo });
            wait = setTimeout(show, 1700);
        };
    };
    show();
}

// ---------- Boleh atau Dilarang ----------
function ihramGame(api) {
    const items = shuffle(IHRAM), total = 60000;
    let i = 0, score = 0, combo = 0, right = 0, raf = null, locked = false, wait = null;
    const lines = [];
    let start = performance.now(), last = start;
    api.onCleanup(() => { cancelAnimationFrame(raf); clearTimeout(wait); });
    const finish = () => { cancelAnimationFrame(raf); clearTimeout(wait); api.end({ score, max: 1500, lines: [`${right} dari ${i} keadaan dijawab benar.`, ...lines.slice(0, 3)] }); };
    const tick = now => { if (!api.visible()) start += now - last; last = now; const r = 1 - (now - start) / total; api.timer(r); if (r <= 0) return finish(); raf = requestAnimationFrame(tick); };
    const show = () => {
        if (i >= items.length) return finish();
        api.stage.innerHTML = `<div class="gk-fact"><p class="gk-prompt">Saat sedang ihram, hal ini…</p><blockquote>${items[i][0]}</blockquote>
            <div class="gk-tf"><button class="gk-btn gk-false" data-v="0">⛔ Dilarang</button><button class="gk-btn gk-true" data-v="1">✓ Boleh</button></div>
            <p class="gk-keys">Keyboard: ← dilarang · → boleh</p></div>`;
        locked = false;
        api.stage.querySelector('.gk-tf').onclick = e => { const b = e.target.closest('button'); if (b) answer(b.dataset.v === '1'); };
    };
    const answer = v => {
        if (locked || i >= items.length) return; locked = true;
        const [text, allowed, why] = items[i++];
        if (v === allowed) { combo++; right++; score += 100 + Math.min(combo - 1, 5) * 10; blip('ok'); api.flash('ok'); api.feedback(`<b>Tepat.</b> ${why}`, 'ok'); }
        else { combo = 0; blip('bad'); vibrate(); api.flash('bad'); api.feedback(`<b>${allowed ? 'Boleh' : 'Dilarang'}.</b> ${why}`, 'bad'); lines.push(`${text}: ${allowed ? 'boleh' : 'dilarang'}. ${why}`); }
        api.hud({ score, combo, round: i, total: items.length });
        wait = setTimeout(show, 1100);
    };
    const key = e => { if (!api.visible()) return; if (e.key === 'ArrowLeft') answer(false); else if (e.key === 'ArrowRight') answer(true); };
    document.addEventListener('keydown', key);
    api.onCleanup(() => document.removeEventListener('keydown', key));
    api.hud({ score, round: 0, total: items.length });
    show();
    raf = requestAnimationFrame(tick);
}

// ---------- Kuis Kilat ----------
function quizGame(api) {
    const qs = shuffle(QUIZ).slice(0, 12), limit = 15000;
    let i = 0, score = 0, lives = 3, combo = 0, raf = null, wait = null;
    const lines = [];
    api.onCleanup(() => { cancelAnimationFrame(raf); clearTimeout(wait); });
    const ask = () => {
        if (i >= qs.length || lives <= 0) return api.end({ score, max: qs.length * 150, lines: lines.slice(0, 4) });
        const q = qs[i++];
        api.hud({ score, lives, round: i, total: qs.length, combo });
        const order = shuffle(q.a.map((t, k) => ({ t, k })));
        api.stage.innerHTML = `<p class="gk-prompt">${q.place}</p><div class="gk-card-big">${q.q}</div><div class="gk-options">${order.map(o => `<button class="gk-option" data-k="${o.k}">${o.t}</button>`).join('')}</div>`;
        api.feedback('');
        let start = performance.now(), last = start;
        const tick = now => { if (!api.visible()) start += now - last; last = now; const r = 1 - (now - start) / limit; api.timer(r); if (r <= 0) return answer(null); raf = requestAnimationFrame(tick); };
        const answer = k => {
            cancelAnimationFrame(raf);
            api.stage.querySelectorAll('.gk-option').forEach(o => { o.disabled = true; o.classList.toggle('right', Number(o.dataset.k) === q.c); o.classList.toggle('wrong', Number(o.dataset.k) === k && k !== q.c); });
            if (k === q.c) { combo++; const gain = 100 + Math.round(Math.max(0, 1 - (performance.now() - start) / limit) * 50); score += gain; blip('ok'); api.flash('ok'); api.feedback(`Benar (+${gain}).`, 'ok'); }
            else { combo = 0; lives--; blip('bad'); vibrate(); api.flash('bad'); api.feedback(`${k === null ? 'Waktu habis.' : 'Kurang tepat.'} Jawaban: <b>${q.a[q.c]}</b>`, 'bad'); lines.push(`${q.q} → ${q.a[q.c]}`); }
            api.hud({ score, lives, combo });
            wait = setTimeout(ask, 1500);
        };
        api.stage.querySelector('.gk-options').onclick = e => { const b = e.target.closest('button'); if (b && !b.disabled) answer(Number(b.dataset.k)); };
        raf = requestAnimationFrame(tick);
    };
    ask();
}

export const HAJI_GAMES = [
    { id: 'haji-jumrah', icon: '🎯', tag: 'Ketangkasan', title: 'Lontar Jumrah', desc: '21 kerikil di hari tasyrik. Pilih jumrah sesuai urutan dan lontar saat jarum di zona hijau. Zona makin sempit.', run: jumrahGame },
    { id: 'haji-hari', icon: '📅', tag: 'Kalender', title: 'Hari Manasik', desc: 'Tebak amalan dilakukan pada 8, 9, 10, atau hari tasyrik.', run: dayGame },
    { id: 'haji-ihram', icon: '🧕', tag: 'Kilat 60 detik', title: 'Boleh atau Dilarang?', desc: 'Pilah keadaan saat ihram secepat mungkin. Setiap jawaban disertai dalil singkat.', run: ihramGame },
    { id: 'haji-kuis', icon: '⏱️', tag: 'Kuis', title: 'Kuis Kilat Manasik', desc: '12 soal acak dari tahap umrah dan haji tamattu, 15 detik per soal.', run: quizGame }
];

export default function createHajiArena(root) {
    return new Arena(root, {
        eyebrow: 'ARENA MANASIK · BELAJAR SAMBIL BERMAIN',
        title: 'Siap berangkat? Uji manasikmu.',
        intro: 'Empat permainan singkat pelengkap Jelajah Manasik. Bintang dan XP digabung dengan Arena Sholat.',
        games: HAJI_GAMES,
        theme: 'gk-haji'
    });
}

export { DAY_CARDS, IHRAM };
