// Arena Sholat: four learning games built on the same poses and readings as the 3D peraga.
import Arena from '../../utils/arena.js';
import { shuffle, pick, blip, vibrate, escapeHtml } from '../../utils/game-kit.js';
import MosqueScene from './mosque-scene.js?v=4.0.1';
import { POSES } from './peraga-3d.js?v=4.0.1';

// ---------- Data ----------
const SEQUENCES = [
    { title: 'Rakaat pertama', hint: 'Susun gerakan rakaat pertama dari awal.', items: ['Takbiratul ihram', 'Bersedekap, membaca Al-Fatihah', 'Ruku’', 'I’tidal', 'Sujud pertama', 'Duduk di antara dua sujud', 'Sujud kedua'] },
    { title: 'Bacaan saat berdiri', hint: 'Urutan bacaan di rakaat pertama, mulai dari takbir.', items: ['Takbiratul ihram', 'Doa iftitah', 'Ta’awwudz', 'Basmalah', 'Al-Fatihah', 'Aamiin', 'Surat pendek'] },
    { title: 'Menutup sholat', hint: 'Dari sujud terakhir hingga selesai.', items: ['Sujud kedua rakaat terakhir', 'Duduk tasyahud akhir', 'Bacaan tasyahud', 'Sholawat Ibrahimiyyah', 'Berlindung dari empat perkara', 'Salam ke kanan', 'Salam ke kiri'] }
];

const POSE_LABELS = {
    takbir: 'Takbiratul ihram', qiyam: 'Berdiri bersedekap', ruku: 'Ruku’', itidal: 'I’tidal',
    sujud: 'Sujud', duduk: 'Duduk di antara dua sujud', salamKanan: 'Salam ke kanan', salamKiri: 'Salam ke kiri'
};
const poseKey = p => p.id.startsWith('takbir') ? 'takbir' : p.id.startsWith('qiyam') ? 'qiyam' : p.id.startsWith('ruku') ? 'ruku'
    : p.id.startsWith('itidal') ? 'itidal' : p.id.startsWith('sujud') ? 'sujud' : p.id.startsWith('duduk') ? 'duduk'
    : p.id === 'salam_kanan' ? 'salamKanan' : p.id === 'salam_kiri' ? 'salamKiri' : null;

const PLACES = ['Takbiratul ihram (membuka sholat)', 'Berdiri (qiyam)', 'Ruku’', 'Bangkit dari ruku’ hingga i’tidal', 'Sujud', 'Duduk di antara dua sujud', 'Duduk tasyahud', 'Salam (menutup sholat)'];
const READINGS = [
    { ar: 'اللَّهُ أَكْبَرُ', la: 'Allāhu akbar (takbir pertama)', at: 0 },
    { ar: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ', la: 'Allāhumma bā‘id bainī wa baina khaṭāyāya…', at: 1, note: 'Doa iftitah, dibaca setelah takbiratul ihram pada rakaat pertama.' },
    { ar: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', la: 'A‘ūdzu billāhi minasy-syaiṭānir-rajīm', at: 1, note: 'Ta’awwudz sebelum Al-Fatihah.' },
    { ar: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', la: 'Al-ḥamdu lillāhi rabbil-‘ālamīn', at: 1 },
    { ar: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', la: 'Subḥāna rabbiyal-‘aẓīm', at: 2 },
    { ar: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ', la: 'Sami‘allāhu liman ḥamidah', at: 3 },
    { ar: 'رَبَّنَا وَلَكَ الْحَمْدُ', la: 'Rabbanā wa lakal-ḥamd', at: 3 },
    { ar: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', la: 'Subḥāna rabbiyal-a‘lā', at: 4 },
    { ar: 'رَبِّ اغْفِرْ لِي', la: 'Rabbighfir lī', at: 5 },
    { ar: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ', la: 'At-taḥiyyātu lillāhi waṣ-ṣalawātu waṭ-ṭayyibāt', at: 6 },
    { ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ', la: 'Allāhumma ṣalli ‘alā Muḥammad wa ‘alā āli Muḥammad', at: 6, note: 'Sholawat Ibrahimiyyah setelah tasyahud.' },
    { ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَمِنْ عَذَابِ الْقَبْرِ', la: 'Allāhumma innī a‘ūdzu bika min ‘adzābi jahannam wa min ‘adzābil-qabr', at: 6, note: 'Berlindung dari empat perkara sebelum salam (HR. Muslim).' },
    { ar: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ', la: 'As-salāmu ‘alaikum wa raḥmatullāh', at: 7 }
];

const FACTS = [
    ['Sujud dilakukan di atas tujuh anggota badan.', true, 'Dahi bersama hidung, dua telapak tangan, dua lutut, dan ujung jari kedua kaki (HR. Bukhari & Muslim).'],
    ['Hidung tidak perlu menyentuh lantai ketika sujud.', false, 'Nabi ﷺ menunjuk hidungnya saat menyebut dahi sebagai anggota sujud.'],
    ['Saat sujud, lengan dihamparkan di lantai.', false, 'Dilarang menghamparkan lengan seperti binatang buas; lengan diangkat dan dijauhkan dari lambung.'],
    ['Bagi yang sholat sendirian, Al-Fatihah dibaca di setiap rakaat.', true, '“Tidak ada sholat bagi yang tidak membaca Al-Fatihah” (HR. Bukhari & Muslim).'],
    ['Tuma’ninah dalam ruku’ dan sujud termasuk rukun sholat.', true, 'Nabi ﷺ menyuruh orang yang sholat tergesa-gesa untuk mengulang sholatnya.'],
    ['Doa iftitah dibaca di setiap rakaat.', false, 'Doa iftitah dibaca pada rakaat pertama setelah takbiratul ihram.'],
    ['Menghadap kiblat termasuk syarat sah sholat.', true, 'QS. Al-Baqarah: 144, kecuali dalam keadaan yang dikecualikan syariat.'],
    ['Sholat fardhu sah walaupun dikerjakan sebelum masuk waktunya.', false, 'Masuk waktu termasuk syarat sah sholat (QS. An-Nisa’: 103).'],
    ['Suci dari hadats kecil dan besar adalah syarat sah sholat.', true, '“Allah tidak menerima sholat tanpa bersuci” (HR. Muslim).'],
    ['Ketika ruku’, punggung diusahakan lurus rata.', true, 'Punggung Nabi ﷺ rata saat ruku’, kepala sejajar dengan punggung.'],
    ['“Subḥāna rabbiyal-a‘lā” dibaca ketika ruku’.', false, 'Itu bacaan sujud. Saat ruku’: “Subḥāna rabbiyal-‘aẓīm”.'],
    ['Menutup aurat termasuk syarat sah sholat.', true, 'QS. Al-A‘raf: 31 dan hadits tentang khimar bagi wanita yang sudah baligh.'],
    ['Al-Fatihah dalam sholat boleh diganti terjemahannya.', false, 'Al-Fatihah dibaca dalam bahasa Arab; yang belum mampu belajar dan membaca dzikir pengganti sementara.'],
    ['Gerakan sholat boleh dilakukan secepat mungkin tanpa berhenti.', false, 'Tuma’ninah wajib; sholat yang tergesa-gesa disebut pencurian dalam sholat.'],
    ['Takbiratul ihram termasuk rukun sholat.', true, '“Pembukanya adalah takbir dan penutupnya adalah salam” (HR. Abu Dawud, At-Tirmidzi).'],
    ['Niat sholat wajib dilafalkan dengan suara keras.', false, 'Niat tempatnya di hati; melafalkannya tidak dicontohkan Nabi ﷺ.'],
    ['Sholat Subuh terdiri dari dua rakaat.', true, 'Sholat fardhu Subuh dua rakaat.'],
    ['Sholat Maghrib terdiri dari empat rakaat.', false, 'Maghrib tiga rakaat.'],
    ['Saat duduk di antara dua sujud boleh membaca “Rabbighfir lī”.', true, 'Dibaca Nabi ﷺ di antara dua sujud (HR. Abu Dawud, Ibnu Majah).'],
    ['Makan atau minum dengan sengaja membatalkan sholat.', true, 'Para ulama sepakat makan dan minum dengan sengaja membatalkan sholat.'],
    ['Sholawat atas Nabi ﷺ dibaca setelah tasyahud akhir.', true, 'Sholawat Ibrahimiyyah dibaca setelah tasyahud, sebelum doa dan salam.'],
    ['Wanita haid wajib mengqadha sholat yang ditinggalkan.', false, '“Kami diperintah mengqadha puasa, tidak diperintah mengqadha sholat” (HR. Muslim, dari ‘Aisyah).'],
    ['Sujud sahwi dilakukan karena lupa dalam sholat.', true, 'Misalnya lupa tasyahud awal atau ragu jumlah rakaat.'],
    ['Ketika i’tidal, makmum membaca “Rabbanā wa lakal-ḥamd”.', true, 'Imam membaca “Sami‘allāhu liman ḥamidah”, makmum menjawab “Rabbanā wa lakal-ḥamd”.'],
    ['Pandangan ketika berdiri diarahkan ke langit.', false, 'Mengangkat pandangan ke langit dalam sholat dilarang (HR. Bukhari).'],
    ['Salam pertama diucapkan sambil menoleh ke kanan.', true, 'Nabi ﷺ salam ke kanan lalu ke kiri hingga pipinya terlihat.']
];

// ---------- Games ----------
function sequenceGame(api) {
    let round = 0, score = 0, lives = 3, mistakes = 0, started = performance.now();
    const lines = [];
    const draw = () => {
        const seq = SEQUENCES[round];
        let next = 0;
        api.hud({ score, lives, round: round + 1, total: SEQUENCES.length });
        api.stage.innerHTML = `<div class="gk-seq">
            <p class="gk-prompt"><b>${seq.title}.</b> ${seq.hint} Ketuk kartu sesuai urutan.</p>
            <ol class="gk-slots">${seq.items.map((_, i) => `<li data-slot="${i}"><span>${i + 1}</span></li>`).join('')}</ol>
            <div class="gk-pool">${shuffle(seq.items.map((t, i) => ({ t, i }))).map(c => `<button class="gk-tile" data-i="${c.i}">${c.t}</button>`).join('')}</div></div>`;
        const t0 = performance.now();
        api.stage.querySelector('.gk-pool').onclick = e => {
            const b = e.target.closest('.gk-tile');
            if (!b || b.disabled) return;
            if (Number(b.dataset.i) === next) {
                blip('ok');
                score += 100;
                const slot = api.stage.querySelector(`[data-slot="${next}"]`);
                slot.classList.add('filled'); slot.innerHTML = `<span>${next + 1}</span>${b.textContent}`;
                b.disabled = true; b.classList.add('used');
                next++;
                api.feedback('Tepat!', 'ok');
                if (next === seq.items.length) {
                    const bonus = Math.max(0, 300 - Math.round((performance.now() - t0) / 100));
                    score += bonus;
                    api.feedback(`Urutan lengkap! Bonus waktu +${bonus}`, 'ok');
                    round++;
                    api.hud({ score });
                    setTimeout(() => round < SEQUENCES.length ? draw() : finish(), 900);
                }
            } else {
                blip('bad'); vibrate(); api.flash('bad');
                mistakes++; lives--;
                b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
                api.feedback(`Belum. Setelah “${seq.items[next - 1] || 'mulai'}” adalah langkah ke-${next + 1}.`, 'bad');
                lines.push(`${seq.title}: “${b.textContent}” bukan langkah ke-${next + 1}.`);
                if (lives <= 0) return finish();
            }
            api.hud({ score, lives });
        };
    };
    const finish = () => api.end({ score, max: 3000, lines: lines.length ? lines.slice(0, 4) : [`Selesai dalam ${Math.round((performance.now() - started) / 1000)} detik tanpa kesalahan.`] });
    draw();
}

function poseGame(api) {
    const pool = POSES.filter(p => poseKey(p));
    const keys = Object.keys(POSE_LABELS);
    const rounds = 10, limit = 12000;
    let round = 0, score = 0, lives = 3, combo = 0, timer = null, raf = null;
    const lines = [];
    api.stage.innerHTML = `<div class="gk-pose"><div class="gk-canvas-wrap"><canvas aria-label="Peraga 3D yang harus ditebak"></canvas><span class="gk-cam"></span></div><div class="gk-options"></div></div>`;
    let scene;
    try { scene = new MosqueScene(api.stage.querySelector('canvas')); scene.start(); }
    catch (e) { api.stage.innerHTML = `<p class="gk-empty">${escapeHtml(e.message)}</p>`; return; }
    api.onCleanup(() => { scene.stop(); scene.resizeObserver?.disconnect(); scene.renderer?.forceContextLoss(); scene.renderer?.dispose(); cancelAnimationFrame(raf); clearTimeout(timer); });
    let order = [];
    const ask = () => {
        if (round >= rounds || lives <= 0) return api.end({ score, max: rounds * 150, lines: lines.slice(0, 4) });
        if (!order.length) order = shuffle(pool);
        const p = order.pop(), key = poseKey(p);
        const salam = key.startsWith('salam');
        // Salam is judged from behind so left and right match the person praying.
        const view = salam ? [0.35, 0.18, 'Kamera: dari belakang peraga'] : pick([[Math.PI, 0.12, 'Kamera: depan'], [Math.PI / 2, 0.12, 'Kamera: samping'], [2.25, 0.18, 'Kamera: perspektif']], 1)[0];
        scene.setPose(p, false); scene.setView(view[0], view[1]);
        api.stage.querySelector('.gk-cam').textContent = view[2];
        const options = shuffle([key, ...pick(keys.filter(k => k !== key && !(salam && k.startsWith('salam') )), salam ? 2 : 3), ...(salam ? [key === 'salamKanan' ? 'salamKiri' : 'salamKanan'] : [])]);
        const box = api.stage.querySelector('.gk-options');
        box.innerHTML = options.map(k => `<button class="gk-option" data-k="${k}">${POSE_LABELS[k]}</button>`).join('');
        round++;
        api.hud({ score, lives, round, total: rounds, combo });
        api.feedback('Gerakan apakah ini? Seret peraga untuk memutar kamera.');
        let start = performance.now(), last = start;
        const tick = now => { if (!api.visible()) start += now - last; last = now; const r = 1 - (now - start) / limit; api.timer(r); if (r <= 0) return answer(null); raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);
        const answer = k => {
            cancelAnimationFrame(raf);
            box.querySelectorAll('button').forEach(b => { b.disabled = true; b.classList.toggle('right', b.dataset.k === key); b.classList.toggle('wrong', b.dataset.k === k && k !== key); });
            if (k === key) {
                combo++;
                const gain = 100 + Math.round(Math.max(0, 1 - (performance.now() - start) / limit) * 50) + (combo > 2 ? 20 : 0);
                score += gain; blip('ok'); api.flash('ok');
                api.feedback(`Benar: ${POSE_LABELS[key]} (+${gain})`, 'ok');
            } else {
                combo = 0; lives--; blip('bad'); vibrate(); api.flash('bad');
                api.feedback(`${k ? 'Kurang tepat' : 'Waktu habis'}. Jawabannya: <b>${POSE_LABELS[key]}</b>.`, 'bad');
                lines.push(`${p.name}: ${p.tip.split('. ')[0].replace(/\.$/, '')}.`);
            }
            api.hud({ score, lives, combo });
            timer = setTimeout(ask, 1300);
        };
        box.onclick = e => { const b = e.target.closest('button'); if (b && !b.disabled) answer(b.dataset.k); };
    };
    api.timer(1);
    setTimeout(ask, 60);
}

function readingGame(api) {
    const rounds = 10, items = pick(READINGS, rounds);
    let round = 0, score = 0, lives = 3, combo = 0, wait = null;
    const lines = [];
    api.onCleanup(() => clearTimeout(wait));
    const ask = () => {
        if (round >= items.length || lives <= 0) return api.end({ score, max: rounds * 120, lines: lines.slice(0, 4) });
        const r = items[round++];
        const options = shuffle([r.at, ...pick(PLACES.map((_, i) => i).filter(i => i !== r.at), 3)]);
        api.hud({ score, lives, round, total: rounds, combo });
        api.stage.innerHTML = `<div class="gk-reading"><p class="gk-prompt">Bacaan ini diucapkan ketika…</p>
            <div class="gk-arabic" lang="ar" dir="rtl">${r.ar}</div><div class="gk-latin">${r.la}</div>
            <div class="gk-options">${options.map(i => `<button class="gk-option" data-i="${i}">${PLACES[i]}</button>`).join('')}</div></div>`;
        api.feedback('');
        api.stage.querySelector('.gk-options').onclick = e => {
            const b = e.target.closest('button'); if (!b || b.disabled) return;
            const i = Number(b.dataset.i);
            api.stage.querySelectorAll('.gk-option').forEach(o => { o.disabled = true; o.classList.toggle('right', Number(o.dataset.i) === r.at); o.classList.toggle('wrong', o === b && i !== r.at); });
            if (i === r.at) { combo++; score += 100 + (combo > 2 ? 20 : 0); blip('ok'); api.flash('ok'); api.feedback(`Benar. ${r.note || ''}`, 'ok'); }
            else { combo = 0; lives--; blip('bad'); vibrate(); api.flash('bad'); api.feedback(`Jawabannya: <b>${PLACES[r.at]}</b>. ${r.note || ''}`, 'bad'); lines.push(`${r.la} → ${PLACES[r.at]}`); }
            api.hud({ score, lives, combo });
            wait = setTimeout(ask, 1500);
        };
    };
    ask();
}

function factGame(api) {
    const facts = shuffle(FACTS), total = 60000;
    let i = 0, score = 0, combo = 0, right = 0, raf = null, locked = false, wait = null;
    const lines = [];
    let start = performance.now(), last = start;
    api.onCleanup(() => { cancelAnimationFrame(raf); clearTimeout(wait); });
    // The clock pauses while the arena is off screen (other tab or app).
    const tick = now => { if (!api.visible()) start += now - last; last = now; const r = 1 - (now - start) / total; api.timer(r); if (r <= 0) return finish(); raf = requestAnimationFrame(tick); };
    const finish = () => { cancelAnimationFrame(raf); api.end({ score, max: 1500, lines: [`${right} dari ${i} pernyataan dijawab benar.`, ...lines.slice(0, 3)] }); };
    const show = () => {
        if (i >= facts.length) return finish();
        const [text] = facts[i];
        api.stage.innerHTML = `<div class="gk-fact"><p class="gk-prompt">Benar atau salah?</p><blockquote>${text}</blockquote>
            <div class="gk-tf"><button class="gk-btn gk-false" data-v="0">✕ Salah</button><button class="gk-btn gk-true" data-v="1">✓ Benar</button></div>
            <p class="gk-keys">Keyboard: ← salah · → benar</p></div>`;
        locked = false;
        api.stage.querySelector('.gk-tf').onclick = e => { const b = e.target.closest('button'); if (b) answer(b.dataset.v === '1'); };
    };
    const answer = v => {
        if (locked) return; locked = true;
        const [text, truth, why] = facts[i++];
        if (v === truth) { combo++; right++; score += 100 + Math.min(combo - 1, 5) * 10; blip('ok'); api.flash('ok'); api.feedback(`<b>Tepat.</b> ${why}`, 'ok'); }
        else { combo = 0; blip('bad'); vibrate(); api.flash('bad'); api.feedback(`<b>${truth ? 'Benar' : 'Salah'}.</b> ${why}`, 'bad'); lines.push(`“${text}” → ${truth ? 'benar' : 'salah'}. ${why}`); }
        api.hud({ score, combo, round: i, total: facts.length });
        wait = setTimeout(show, 1100);
    };
    const key = e => { if (e.key === 'ArrowLeft') answer(false); else if (e.key === 'ArrowRight') answer(true); };
    document.addEventListener('keydown', key);
    api.onCleanup(() => document.removeEventListener('keydown', key));
    api.hud({ score, round: 0, total: facts.length });
    show();
    raf = requestAnimationFrame(tick);
}

export const SHOLAT_GAMES = [
    { id: 'sholat-urut', icon: '🧩', tag: 'Urutan', title: 'Susun Gerakan', desc: 'Tiga ronde: gerakan rakaat pertama, bacaan saat berdiri, dan penutup sholat. Ketuk kartu sesuai urutan.', run: sequenceGame },
    { id: 'sholat-pose', icon: '🧍', tag: '3D', title: 'Tebak Gerakan 3D', desc: 'Peraga 3D berpose acak dari berbagai sudut kamera. Tebak gerakannya sebelum waktu habis.', run: poseGame },
    { id: 'sholat-bacaan', icon: '📖', tag: 'Bacaan', title: 'Cocokkan Bacaan', desc: 'Lihat teks Arab dan latin, lalu pilih kapan bacaan itu diucapkan dalam sholat.', run: readingGame },
    { id: 'sholat-fakta', icon: '⚡', tag: 'Kilat 60 detik', title: 'Benar atau Salah', desc: 'Jawab sebanyak mungkin pernyataan fiqih sholat dalam 60 detik. Combo menambah skor.', run: factGame }
];

export default function createSholatArena(root) {
    return new Arena(root, {
        eyebrow: 'ARENA SHOLAT · BELAJAR SAMBIL BERMAIN',
        title: 'Uji gerakan & bacaanmu.',
        intro: 'Empat permainan singkat untuk mengulang materi peraga. Bintang dan XP tersimpan di perangkat ini.',
        games: SHOLAT_GAMES,
        theme: 'gk-sholat'
    });
}

export { SEQUENCES, READINGS, FACTS, PLACES };
