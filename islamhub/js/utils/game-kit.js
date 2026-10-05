// Shared mini-game helpers: progress, stars, sound blips and confetti.
// Learning games only: no leaderboards for worship, progress stays on the device.

const STORE = 'islamhub_arena_v1';

export const shuffle = list => {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

export const pick = (list, n) => shuffle(list).slice(0, n);

export const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function read() {
    try {
        const data = JSON.parse(localStorage.getItem(STORE) || '{}');
        return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch { return {}; }
}

function write(data) {
    try { localStorage.setItem(STORE, JSON.stringify(data)); } catch { /* storage off: progress lives in memory */ }
}

export const progress = {
    get() {
        const d = read();
        return { xp: Number.isFinite(d.xp) ? d.xp : 0, best: d.best && typeof d.best === 'object' ? d.best : {}, sound: d.sound !== false };
    },
    level(xp) {
        // Each level needs a little more XP than the last.
        let level = 1, need = 100, rest = xp;
        while (rest >= need) { rest -= need; level++; need += 50; }
        return { level, into: rest, need };
    },
    record(gameId, score, stars) {
        const d = read();
        d.best = d.best && typeof d.best === 'object' ? d.best : {};
        const prev = d.best[gameId] || { score: 0, stars: 0, plays: 0 };
        const isBest = score > prev.score;
        d.best[gameId] = { score: Math.max(prev.score, score), stars: Math.max(prev.stars, stars), plays: prev.plays + 1 };
        const gained = Math.round(score / 10) + stars * 10;
        d.xp = (Number.isFinite(d.xp) ? d.xp : 0) + gained;
        write(d);
        return { isBest, gained, xp: d.xp, best: d.best[gameId] };
    },
    setSound(on) { const d = read(); d.sound = on; write(d); }
};

export const starsFor = (ratio) => ratio >= 0.9 ? 3 : ratio >= 0.65 ? 2 : ratio >= 0.35 ? 1 : 0;
export const starText = n => '★'.repeat(n) + '☆'.repeat(3 - n);

let audio = null;
export function blip(kind = 'ok') {
    if (!progress.get().sound) return;
    try {
        audio ||= new (window.AudioContext || window.webkitAudioContext)();
        const tones = { ok: [660, 880], bad: [220, 160], tap: [520], win: [523, 659, 784, 1046] }[kind] || [440];
        tones.forEach((f, i) => {
            const o = audio.createOscillator(), g = audio.createGain();
            const t = audio.currentTime + i * 0.09;
            o.type = kind === 'bad' ? 'triangle' : 'sine';
            o.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(0.12, t + 0.015);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
            o.connect(g).connect(audio.destination);
            o.start(t); o.stop(t + 0.18);
        });
    } catch { /* audio is optional */ }
}

export function confetti(host) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = document.createElement('div');
    layer.className = 'gk-confetti';
    const colors = ['#c9a14a', '#2f7d5b', '#e8d9a8', '#7fb59a', '#b5654a'];
    for (let i = 0; i < 46; i++) {
        const s = document.createElement('i');
        s.style.left = `${Math.random() * 100}%`;
        s.style.background = colors[i % colors.length];
        s.style.animationDelay = `${Math.random() * 0.35}s`;
        s.style.setProperty('--dx', `${(Math.random() - 0.5) * 160}px`);
        s.style.setProperty('--r', `${Math.random() * 720}deg`);
        layer.append(s);
    }
    host.append(layer);
    setTimeout(() => layer.remove(), 2200);
}

export function vibrate(ms = 30) { try { navigator.vibrate?.(ms); } catch { /* optional */ } }
