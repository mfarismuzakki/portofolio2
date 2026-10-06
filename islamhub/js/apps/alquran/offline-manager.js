// Mode Offline for the Qur'an app: what is really stored on this device, and downloads
// that can be resumed. Status is read from Cache Storage, never from a saved flag.
//
//  - Text: the 604 page files (translation + tafsir) and the Mushaf Standar Indonesia text.
//    Both are cached by sw.js when fetched; "Simpan semua teks" fetches every page once.
//  - Audio: page murottal (Mishary Alafasy) from jsDelivr, stored in 'islamhub-alquran-audio'
//    per juz, because the full set is ~1.6 GB.

const AUDIO_CACHE = 'islamhub-alquran-audio';
const DATA_CACHE = 'islamhub-data';
const PAGES = 604;
const AVG_PAGE_MB = 1.6 * 1024 / PAGES; // measured: 1.6 GB for 604 page files

const pad = n => String(n).padStart(3, '0');
const mb = n => n >= 1024 ? `${(n / 1024).toFixed(1)} GB` : `${Math.round(n)} MB`;

function juzPages(juz) {
    const j = (window.QURAN_JUZ || []).find(x => x.number === juz);
    if (!j) return [];
    return Array.from({ length: j.endPage - j.startPage + 1 }, (_, i) => j.startPage + i);
}

async function cachedAudioPages() {
    if (!('caches' in window)) return new Set();
    const cache = await caches.open(AUDIO_CACHE);
    const keys = await cache.keys();
    return new Set(keys.map(r => (/Page(\d{3})\.mp3/.exec(r.url) || [])[1]).filter(Boolean).map(Number));
}

async function cachedTextPages() {
    if (!('caches' in window)) return { pages: 0, kemenag: 0 };
    const keys = await (await caches.open(DATA_CACHE)).keys();
    let pages = 0, kemenag = 0;
    for (const r of keys) {
        if (/\/alquran\/pages\/Page\d{3}\.json/.test(r.url)) pages++;
    }
    // The Indonesian text ships with the app shell; count it from the shell cache.
    for (const name of await caches.keys()) {
        if (!name.startsWith('islamhub-shell-')) continue;
        for (const r of await (await caches.open(name)).keys()) if (/\/alquran\/kemenag\/Page\d{3}\.json/.test(r.url)) kemenag++;
    }
    return { pages, kemenag };
}

export default class QuranOfflineManager {
    constructor(app) {
        this.app = app;
        this.abort = null;
    }

    async open() {
        document.getElementById('offlineModal')?.remove();
        const modal = document.createElement('div');
        modal.id = 'offlineModal';
        modal.className = 'modal modal-fullscreen show';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content modal-content-fullscreen qo-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-cloud-arrow-down"></i> Mode Offline</h2>
                    <button class="modal-close" data-close aria-label="Tutup"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body modal-body-fullscreen">
                    <p class="qo-intro">Simpan Al-Qur'an di perangkat ini agar bisa dibaca dan didengar tanpa internet. Status di bawah dibaca langsung dari penyimpanan perangkat.</p>
                    <section class="offline-card qo-card" data-qo="text">
                        <div class="offline-card-header"><i class="fas fa-book-quran offline-card-icon"></i>
                            <div class="offline-card-title"><h4>Teks, terjemahan & tafsir</h4><p class="qo-text-status">Memeriksa…</p></div></div>
                        <div class="qo-bar"><i></i></div>
                        <button class="btn-primary qo-text-btn" type="button"><i class="fas fa-download"></i> Simpan semua teks (±16 MB)</button>
                    </section>
                    <section class="offline-card qo-card" data-qo="audio">
                        <div class="offline-card-header"><i class="fas fa-headphones offline-card-icon"></i>
                            <div class="offline-card-title"><h4>Audio murottal per halaman</h4><p>Mishary Rashid Alafasy · ±${Math.round(AVG_PAGE_MB * 20)} MB per juz</p></div></div>
                        <label class="qo-label">Pilih juz
                            <select class="font-select qo-juz">
                                ${Array.from({ length: 30 }, (_, i) => `<option value="${i + 1}">Juz ${i + 1}</option>`).join('')}
                                <option value="all">Semua juz (±${mb(AVG_PAGE_MB * PAGES)})</option>
                            </select>
                        </label>
                        <p class="qo-audio-status">Memeriksa…</p>
                        <div class="qo-bar"><i></i></div>
                        <div class="qo-actions">
                            <button class="btn-primary qo-audio-btn" type="button"><i class="fas fa-download"></i> Unduh</button>
                            <button class="btn-secondary qo-delete-btn" type="button"><i class="fas fa-trash-alt"></i> Hapus</button>
                        </div>
                        <p class="qo-total"></p>
                    </section>
                    <p class="qo-note"><i class="fas fa-circle-info"></i> Unduhan bisa dilanjutkan: file yang sudah tersimpan dilewati. Hapus Data Cache di Beranda tidak menghapus audio kecuali dipilih.</p>
                </div>
            </div>`;
        document.body.appendChild(modal);
        this.modal = modal;
        const q = sel => modal.querySelector(sel);
        modal.addEventListener('click', e => {
            if (e.target === modal || e.target.closest('[data-close]')) this.close();
        });
        q('.qo-juz').addEventListener('change', () => this.refresh());
        q('.qo-text-btn').addEventListener('click', () => this.busy ? this.cancel() : this.downloadText());
        q('.qo-audio-btn').addEventListener('click', () => this.busy ? this.cancel() : this.downloadAudio());
        q('.qo-delete-btn').addEventListener('click', () => this.deleteAudio());
        navigator.storage?.persist?.().catch(() => {});
        await this.refresh();
    }

    close() {
        this.cancel();
        this.modal?.remove();
    }

    cancel() { this.abort?.abort(); }

    selected() {
        const v = this.modal.querySelector('.qo-juz').value;
        return v === 'all' ? Array.from({ length: PAGES }, (_, i) => i + 1) : juzPages(Number(v));
    }

    async refresh() {
        if (!this.modal?.isConnected) return;
        const q = sel => this.modal.querySelector(sel);
        const { pages, kemenag } = await cachedTextPages();
        q('.qo-text-status').textContent = `${pages} / ${PAGES} halaman tersimpan · teks Standar Indonesia ${kemenag ? 'tersedia' : 'belum tersimpan'}`;
        q('[data-qo="text"] .qo-bar i').style.width = `${pages / PAGES * 100}%`;
        if (!this.busy) q('.qo-text-btn').innerHTML = pages >= PAGES ? '<i class="fas fa-check"></i> Semua teks tersimpan' : '<i class="fas fa-download"></i> Simpan semua teks (±16 MB)';
        q('.qo-text-btn').disabled = !this.busy && pages >= PAGES;

        const have = await cachedAudioPages();
        const sel = this.selected();
        const got = sel.filter(p => have.has(p)).length;
        q('.qo-audio-status').textContent = `${got} / ${sel.length} halaman tersimpan · sisa ±${mb((sel.length - got) * AVG_PAGE_MB)}`;
        q('[data-qo="audio"] .qo-bar i').style.width = `${sel.length ? got / sel.length * 100 : 0}%`;
        if (!this.busy) q('.qo-audio-btn').innerHTML = got >= sel.length ? '<i class="fas fa-check"></i> Sudah tersimpan' : `<i class="fas fa-download"></i> Unduh ${got ? 'sisanya' : ''}`;
        q('.qo-audio-btn').disabled = !this.busy && got >= sel.length;
        q('.qo-delete-btn').disabled = this.busy || got === 0;
        let total = `Audio tersimpan: ${have.size} halaman (±${mb(have.size * AVG_PAGE_MB)}).`;
        try {
            const est = await navigator.storage?.estimate?.();
            if (est?.quota) total += ` Ruang tersedia untuk aplikasi: ±${mb((est.quota - est.usage) / 1048576)}.`;
        } catch (e) { /* estimate unsupported */ }
        q('.qo-total').textContent = total;
    }

    async run(items, task, button, label) {
        this.busy = true;
        this.abort = new AbortController();
        const signal = this.abort.signal;
        let done = 0, failed = 0;
        const queue = [...items];
        const btn = this.modal.querySelector(button);
        const update = () => { btn.innerHTML = `<i class="fas fa-stop"></i> Hentikan (${done}/${items.length}${failed ? `, ${failed} gagal` : ''})`; };
        update();
        const worker = async () => {
            while (queue.length && !signal.aborted) {
                const item = queue.shift();
                try { await task(item, signal); done++; } catch (e) { if (!signal.aborted) failed++; }
                update();
                if (done % 5 === 0) this.refresh();
            }
        };
        await Promise.all([worker(), worker(), worker()]);
        this.busy = false;
        const stopped = signal.aborted;
        this.abort = null;
        await this.refresh();
        const msg = stopped ? `${label} dihentikan. ${done} berhasil disimpan, bisa dilanjutkan kapan saja.`
            : failed ? `${label}: ${done} berhasil, ${failed} gagal. Periksa koneksi lalu tekan unduh lagi untuk melanjutkan.`
            : `${label} selesai: ${done} file tersimpan.`;
        this.app._notify?.(msg, failed && !stopped ? 'warning' : 'success');
    }

    async downloadText() {
        const cache = await caches.open(DATA_CACHE);
        const have = new Set((await cache.keys()).map(r => (/pages\/Page(\d{3})\.json/.exec(r.url) || [])[1]).filter(Boolean).map(Number));
        const todo = Array.from({ length: PAGES }, (_, i) => i + 1).filter(p => !have.has(p));
        const base = this.app.basePath || '.';
        await this.run(todo, async (p, signal) => {
            const url = new URL(`${base}/js/data/alquran/pages/Page${pad(p)}.json`, location.href).href;
            const res = await fetch(url, { signal });
            if (!res.ok) throw new Error(res.status);
            await cache.put(url, res);
            // Also warm the Indonesian text for the page (served from the shell when installed).
            fetch(new URL(`${base}/js/data/alquran/kemenag/Page${pad(p)}.json`, location.href).href, { signal }).catch(() => {});
        }, '.qo-text-btn', 'Simpan teks');
    }

    async downloadAudio() {
        const cache = await caches.open(AUDIO_CACHE);
        const have = await cachedAudioPages();
        const todo = this.selected().filter(p => !have.has(p));
        await this.run(todo, async (p, signal) => {
            const url = getAudioPathForPage(p);
            const res = await fetch(url, { mode: 'cors', signal });
            if (!res.ok) throw new Error(res.status);
            await cache.put(url, res);
        }, '.qo-audio-btn', 'Unduh audio');
    }

    async deleteAudio() {
        const sel = this.selected();
        const label = this.modal.querySelector('.qo-juz').selectedOptions[0].textContent;
        if (!confirm(`Hapus audio ${label} dari perangkat ini?`)) return;
        const cache = await caches.open(AUDIO_CACHE);
        await Promise.all(sel.map(p => cache.delete(getAudioPathForPage(p))));
        await this.refresh();
        this.app._notify?.(`Audio ${label} dihapus dari perangkat.`, 'success');
    }
}
