// Beranda Sakinah: kartu sholat, akses cepat, lanjutkan bacaan, arena, live, hadits.
import islamHubConfig from './config.js';
import { progress } from './utils/game-kit.js';

const PRAYERS = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
const HIJRI_MONTHS = ['Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Ula', 'Jumadil Akhirah', 'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'];
const THEME_KEY = 'islamhub_theme';

// Quick access: eight most-used apps. Icons are Font Awesome except the custom du'a icon.
const QUICK = [
    { id: 'alquran', label: 'Al-Qur’an', icon: 'fa-book-quran', tone: 'green' },
    { id: 'dzikir', label: 'Dzikir', svg: 'doa', tone: 'gold' },
    { id: 'qibla', label: 'Kiblat', icon: 'fa-compass', tone: 'blue' },
    { id: 'streaming', label: 'Kajian', icon: 'fa-tower-broadcast', tone: 'red' },
    { id: 'sholat', label: 'Sholat 3D', icon: 'fa-person-praying', tone: 'plum' },
    { id: 'haji', label: 'Manasik', icon: 'fa-kaaba', tone: 'green' },
    { id: 'kalender', label: 'Kalender', icon: 'fa-calendar-days', tone: 'gold' },
    { id: 'waris', label: 'Waris', icon: 'fa-calculator', tone: 'slate' }
];

export const doaIcon = (cls = '') => `<svg class="ic-doa ${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-doa"/></svg>`;

export function currentTheme() {
    try { return localStorage.getItem(THEME_KEY) === 'classic' ? 'classic' : 'sakinah'; } catch { return 'sakinah'; }
}

export function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* per-device preference only */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'sakinah' ? '#f6f3ea' : '#00ffff');
    const btn = document.getElementById('skThemeBtn');
    if (btn) {
        btn.innerHTML = theme === 'sakinah' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        btn.title = theme === 'sakinah' ? 'Ganti ke tema Klasik (gelap)' : 'Ganti ke tema Sakinah (terang)';
        btn.setAttribute('aria-label', btn.title);
    }
}

function hijriText() {
    // Prefer the Adzan app's (possibly corrected) Hijri date so both screens agree.
    const fromAdzan = document.querySelector('#currentDate .hijri-corrected')?.textContent
        || document.getElementById('currentDate')?.textContent?.split('•')[1];
    if (fromAdzan && /\d/.test(fromAdzan)) return fromAdzan.trim().replace(/\s*H$/, '') + ' H';
    try {
        const d = islamHubConfig.getAdjustedDate();
        const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(d);
        const get = t => Number(parts.find(p => p.type === t)?.value);
        return `${get('day')} ${HIJRI_MONTHS[get('month') - 1]} ${get('year')} H`;
    } catch { return ''; }
}

function gregorianText() {
    const s = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
    return s.replace(/^Minggu/, 'Ahad');
}

export default class SakinahHome {
    constructor(hub, appConfig) {
        this.hub = hub;
        this.apps = appConfig;
        this.root = document.getElementById('home-app');
    }

    init() {
        if (!this.root?.querySelector('.sk-home')) return;
        applyTheme(currentTheme());
        this.renderDate();
        this.renderQuick();
        this.renderContinue();
        this.renderArena();
        this.loadLive();
        this.bind();
        // Day rollover and Hijri correction changes.
        setInterval(() => this.renderDate(), 60000);
    }

    bind() {
        const go = app => this.hub.switchApp(app);
        this.root.addEventListener('click', e => {
            const t = e.target.closest('[data-go], #skPrayer, #skAllApps, #skThemeBtn, [data-resume]');
            if (!t) return;
            if (t.id === 'skThemeBtn') return applyTheme(currentTheme() === 'sakinah' ? 'classic' : 'sakinah');
            if (t.id === 'skAllApps') { e.stopPropagation(); return document.getElementById('moreAppsDropdown')?.classList.add('show'); }
            if (t.id === 'skPrayer') return go('adzan');
            if (t.dataset.resume) return this.resumeQuran();
            const app = t.dataset.go;
            if (app === 'sholat-arena') return this.openArena();
            if (app) go(app);
        });
        this.root.querySelector('#skPrayer')?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go('adzan'); } });
        // Refresh progress-driven cards when the user comes back home.
        document.addEventListener('islamhub:home', () => { this.renderContinue(); this.renderArena(); this.renderDate(); });
    }

    renderDate() {
        const el = document.getElementById('skDate');
        if (el) el.textContent = [gregorianText(), hijriText()].filter(Boolean).join(' · ');
        const hour = new Date().getHours();
        const greet = document.getElementById('skGreeting');
        if (greet) greet.textContent = 'Assalamu’alaikum';
        this.root.querySelector('.sk-home')?.setAttribute('data-daypart', hour < 11 ? 'pagi' : hour < 15 ? 'siang' : hour < 18 ? 'sore' : 'malam');
    }

    renderQuick() {
        const box = document.getElementById('skQuick');
        if (!box) return;
        box.innerHTML = QUICK.map(q => `<button class="sk-q" data-go="${q.id}" data-tone="${q.tone}">
            <span class="sk-q-ic">${q.svg ? doaIcon() : `<i class="fas ${q.icon}"></i>`}</span><span>${q.label}</span></button>`).join('');
        const all = document.getElementById('skAllApps');
        if (all) all.textContent = `Semua ${this.apps.length} ›`;
    }

    renderContinue() {
        const box = document.getElementById('skContinue');
        if (!box) return;
        let last = null;
        try { last = JSON.parse(localStorage.getItem('alquran_last_read') || 'null'); } catch { /* ignore */ }
        const surahs = window.QURAN_SURAHS || window.quranData?.surahs || null;
        if (last?.surah && last?.verse) {
            const info = Array.isArray(surahs) ? surahs.find(s => s.number === last.surah) : null;
            const total = info?.numberOfAyahs || info?.verses || info?.ayahs || null;
            const name = info?.name_latin || info?.englishName || info?.name || `Surah ${last.surah}`;
            const pct = total ? Math.min(100, Math.round(last.verse / total * 100)) : 0;
            const when = last.timestamp ? new Date(last.timestamp) : null;
            const whenText = when ? when.toLocaleString('id-ID', { weekday: 'long', hour: '2-digit', minute: '2-digit' }) : '';
            box.innerHTML = `<button class="sk-cont" data-resume="1">
                <span class="sk-cont-ic"><i class="fas fa-book-open"></i></span>
                <span class="sk-cont-body"><strong>QS. ${name} · ayat ${last.verse}</strong><small>${whenText ? `Terakhir dibaca ${whenText}` : 'Lanjutkan bacaan terakhir'}</small>
                ${total ? `<span class="sk-bar"><i style="width:${pct}%"></i></span>` : ''}</span>
                <span class="sk-go"><i class="fas fa-play"></i></span></button>`;
        } else {
            box.innerHTML = `<button class="sk-cont" data-go="alquran">
                <span class="sk-cont-ic"><i class="fas fa-book-open"></i></span>
                <span class="sk-cont-body"><strong>Mulai tilawah hari ini</strong><small>Posisi bacaan terakhir akan tersimpan di sini</small></span>
                <span class="sk-go"><i class="fas fa-play"></i></span></button>`;
        }
    }

    renderArena() {
        const el = document.getElementById('skArena');
        if (!el) return;
        const p = progress.get(), l = progress.level(p.xp);
        const best = Object.entries(p.best).sort((a, b) => b[1].stars - a[1].stars || b[1].score - a[1].score)[0];
        const names = { 'sholat-urut': 'Susun Gerakan', 'sholat-pose': 'Tebak Gerakan 3D', 'sholat-bacaan': 'Cocokkan Bacaan', 'sholat-fakta': 'Benar atau Salah', 'haji-jumrah': 'Lontar Jumrah', 'haji-hari': 'Hari Manasik', 'haji-ihram': 'Boleh atau Dilarang', 'haji-kuis': 'Kuis Manasik' };
        el.innerHTML = `<span class="sk-mini-lbl">Arena Game</span><b>Level ${l.level}</b>
            <small>${best ? `${'★'.repeat(best[1].stars)}${'☆'.repeat(3 - best[1].stars)} ${names[best[0]] || 'Manasik'}` : 'Main & kumpulkan bintang'}</small>`;
    }

    async loadLive() {
        const el = document.getElementById('skLive');
        if (!el) return;
        try {
            const res = await fetch(`js/data/live-streams.json?t=${Math.floor(Date.now() / 600000)}`);
            const data = await res.json();
            const pick = data.channels.find(c => c.group === 'kajian' && c.live) || data.channels.find(c => c.live) || data.channels[0];
            const count = data.channels.filter(c => c.live).length;
            el.innerHTML = `<span class="sk-mini-lbl"><span class="sk-dot"></span>${count ? `${count} live` : 'Kajian'}</span><b>${pick.name}</b><small>${pick.desc}</small>`;
        } catch {
            el.innerHTML = '<span class="sk-mini-lbl"><span class="sk-dot"></span>Live</span><b>Kajian & Haramain</b><small>Radio dan video kajian</small>';
        }
    }

    // Prayer chips, called whenever the Adzan app pushes new data.
    renderTimes(times, nextName) {
        const box = document.getElementById('skTimes');
        if (!box || !times) return;
        box.innerHTML = PRAYERS.filter(n => times[n]).map(n => `<span class="${n === nextName ? 'on' : ''}">${n}<b>${times[n]}</b></span>`).join('');
    }

    async resumeQuran() {
        await this.hub.switchApp('alquran');
        // The Qur'an app renders its own "last read" button; reuse its handler.
        const tryClick = (n = 0) => {
            const btn = document.querySelector('#alquran-app [data-action="resumeReading"]');
            if (btn) btn.click(); else if (n < 20) setTimeout(() => tryClick(n + 1), 150);
        };
        tryClick();
    }

    async openArena() {
        await this.hub.switchApp('sholat');
        const tab = () => document.querySelector('.sholat-tab[data-tab="arena"]');
        const wait = (n = 0) => { const t = tab(); if (t && window.sholatApp) t.click(); else if (n < 30) setTimeout(() => wait(n + 1), 150); };
        wait();
    }
}
