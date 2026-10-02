import { UMRAH, HAJI, SOURCES } from './manasik-game.js';
import ManasikScene, { ringPoint, locationFor } from './manasik-scene.js';

const STORAGE = 'islamhub_manasik_game_v2';
const clamp = (value, max) => Number.isInteger(value) ? Math.max(0, Math.min(value, max)) : 0;
const MOVE_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];

export default class ManasikGame {
    constructor(root) {
        this.root = root;
        this.mode = 'umrah';
        this.speed = 1;
        this.active = true;
        this.visible = false;
        this.running = false;
        this.auto = false;
        this.keys = new Set();
        this.raf = null;
        this.clock = 0;
        this.lastTime = null;
        this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.events = new AbortController();
        this.saved = this.readSave();
        this.render();
        this.scene = new ManasikScene(this.canvas);
        this.restore();
        this.bind();
        this.observer = new IntersectionObserver(entries => {
            this.visible = entries[0].isIntersecting;
            if (!this.visible) this.suspend();
            else this.run();
        });
        // Only the visible scene runs, not the long route list below it.
        this.observer.observe(this.canvas);
    }

    get missions() { return this.mode === 'haji' ? HAJI : UMRAH; }
    get mission() { return this.missions[this.step]; }
    get ready() { return this.count >= this.mission.total; }
    get canAnimate() { return this.active && this.visible && !document.hidden && !this.destroyed; }
    q(selector) { return this.root.querySelector(selector); }

    readSave() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE) || localStorage.getItem('islamhub_manasik_game_v1') || '{}');
            return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        } catch { return {}; }
    }

    render() {
        this.root.className = 'manasik-game mg-adventure';
        this.root.innerHTML = `
            <header class="mg-header">
                <div><span class="mg-eyebrow">ISLAMHUB · JELAJAH MANASIK</span>
                <h3>Langkah kecil. Perjalanan bermakna.</h3>
                <p>Ikuti jejak perjalanan suci. Cukup tekan mulai, kami pandu langkahmu.</p></div>
                <div class="mg-modes" aria-label="Pilih perjalanan">
                    <button data-mode="umrah" aria-pressed="true">Umrah <small>5 tahap</small></button>
                    <button data-mode="haji" aria-pressed="false">Haji tamattu <small>15 tahap</small></button>
                </div>
            </header>
            <div class="mg-layout">
                <div class="mg-playfield">
                    <div class="mg-world">
                        <canvas width="1080" height="900" tabindex="0" aria-label="Dunia manasik tampak atas"></canvas>
                        <div class="mg-hud"><span class="mg-location"></span><span class="mg-live">SIAP MENJELAJAH</span></div>
                        <div class="mg-world-caption"><span class="mg-scene-tip"></span><small>Ilustrasi lokasi · bukan skala geografis</small></div>
                        <div class="mg-finish" hidden><span>✦</span><h4>Perjalanan belajar selesai</h4><p></p><button data-again>Jelajahi lagi</button></div>
                    </div>
                    <div class="mg-controls">
                        <div class="mg-current-objective"><span></span><strong></strong></div>
                        <div class="mg-primary-controls"><button data-auto class="mg-primary">▶ Mulai tur otomatis</button><button data-walk>Jalan sendiri</button></div>
                        <div class="mg-secondary-controls"><label>Kecepatan <select data-speed aria-label="Kecepatan simulasi"><option value="1">1× Santai</option><option value="2">2× Cepat</option><option value="3">3× Ringkas</option></select></label><button data-pause disabled>Ⅱ Jeda</button><button data-sound aria-pressed="false" title="Bacakan petunjuk jika suara perangkat tersedia">Bacakan: mati</button></div>
                        <p class="mg-control-hint">Klik tujuan emas atau tekan Enter untuk berjalan. Tahan panah / WASD untuk mengikuti jalur. Tidak ada batas waktu.</p>
                    </div>
                </div>
                <section class="mg-mission" aria-label="Panduan tahap aktif">
                    <div class="mg-status"></div>
                    <div class="mg-progress" role="progressbar" aria-label="Progres perjalanan" aria-valuemin="0" aria-valuemax="100"><span></span></div>
                    <h4 tabindex="-1"></h4><p class="mg-description"></p>
                    <div class="mg-counter"><span class="mg-count"></span><span class="mg-counter-label"></span></div>
                    <div class="mg-tokens" aria-label="Progres tahap"></div>
                    <div class="mg-feedback" role="status" aria-live="polite"></div>
                    <button class="mg-action" hidden>Lanjut tahap →</button>
                    <details class="mg-quiz"><summary>Uji pemahaman <span>opsional</span></summary><div class="mg-choices"></div><p class="mg-quiz-result" role="status"></p></details>
                    <a class="mg-source" target="_blank" rel="noopener">Baca rujukan manasik ↗</a>
                </section>
            </div>
            <section class="mg-journey"><div class="mg-journey-heading"><div><span class="mg-eyebrow">PETA PERJALANAN</span><h4>Setiap tempat, sebuah pelajaran.</h4></div><span class="mg-save-state">Tersimpan di perangkat</span></div><div class="mg-route" aria-label="Tahapan perjalanan"></div></section>
            <footer class="mg-footer"><span>Simulasi belajar, bukan catatan pelaksanaan ibadah. Haji menggunakan contoh jalur tamattu dan nafar awal.</span><button data-restart>Ulang dari awal</button><div class="mg-reset-confirm" hidden>Hapus progres perjalanan ini? <button data-confirm-reset>Ya, ulangi</button><button data-cancel-reset>Batal</button></div></footer>`;
        this.canvas = this.q('canvas');
    }

    bind() {
        const on = (element, event, handler) => element.addEventListener(event, handler, { signal: this.events.signal });
        on(this.root, 'click', e => {
            const b = e.target.closest('button');
            if (!b || b.disabled) return;
            if (b.dataset.mode) { this.save(); this.mode = b.dataset.mode; this.restore(); }
            else if (b.hasAttribute('data-auto')) this.toggleAuto();
            else if (b.hasAttribute('data-pause')) this.togglePause();
            else if (b.hasAttribute('data-walk')) this.walk();
            else if (b.classList.contains('mg-action')) this.next();
            else if (b.hasAttribute('data-stage')) this.visit(Number(b.dataset.stage));
            else if (b.hasAttribute('data-answer')) this.answer(Number(b.dataset.answer));
            else if (b.hasAttribute('data-sound')) this.toggleNarration();
            else if (b.hasAttribute('data-again')) this.reset();
            else if (b.hasAttribute('data-restart')) this.q('.mg-reset-confirm').hidden = false;
            else if (b.hasAttribute('data-cancel-reset')) this.q('.mg-reset-confirm').hidden = true;
            else if (b.hasAttribute('data-confirm-reset')) this.reset();
        });
        on(this.q('[data-speed]'), 'change', e => { this.speed = Number(e.target.value); });
        on(this.canvas, 'pointerdown', e => {
            if (this.complete) return;
            this.canvas.focus({ preventScroll: true });
            const r = this.canvas.getBoundingClientRect();
            const point = { x: (e.clientX - r.left) * 720 / r.width, y: (e.clientY - r.top) * 600 / r.height };
            if (this.target && Math.hypot(point.x - this.target.x, point.y - this.target.y) < 85) this.walk();
            else this.q('.mg-feedback').textContent = 'Tujuan ditandai lingkaran emas. Atau tekan “Jalan sendiri” untuk mengikuti jalur.';
        });
        on(this.canvas, 'keydown', e => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (!MOVE_KEYS.includes(key) && ![' ', 'Enter'].includes(key)) return;
            e.preventDefault();
            if (e.repeat && [' ', 'Enter'].includes(key)) return;
            if (key === ' ') this.togglePause();
            else if (key === 'Enter') this.ready ? this.next() : this.walk();
            else { this.keys.add(key); this.walk(); }
        });
        on(this.canvas, 'keyup', e => this.keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key));
        on(this.canvas, 'blur', () => this.keys.clear());
        on(window, 'blur', () => this.keys.clear());
        on(document, 'visibilitychange', () => { if (document.hidden) this.suspend(); else this.run(); });
    }

    restore() {
        const s = this.saved[this.mode] || {};
        this.step = clamp(s.step, this.missions.length - 1);
        this.count = clamp(s.count, this.mission.total);
        this.furthest = Math.max(this.step, clamp(s.furthest, this.missions.length - 1));
        this.complete = s.complete === true && this.step === this.missions.length - 1 && this.ready;
        this.quizAnswers = Array.isArray(s.quizAnswers) ? s.quizAnswers.filter(n => Number.isInteger(n) && n >= 0 && n < this.missions.length) : [];
        this.auto = false;
        this.running = false;
        this.prepare();
    }

    save() {
        this.saved[this.mode] = { step: this.step, count: this.count, furthest: this.furthest, complete: this.complete, quizAnswers: this.quizAnswers };
        try { localStorage.setItem(STORAGE, JSON.stringify(this.saved)); }
        catch { this.q('.mg-save-state').textContent = 'Progres nonaktif: penyimpanan tidak tersedia'; }
    }

    reset() {
        this.saved[this.mode] = {};
        this.restore();
        this.save();
        this.q('.mg-reset-confirm').hidden = true;
        this.q('[data-auto]').focus({ preventScroll: true });
    }

    prepare() {
        this.cancelSpeech();
        this.keys.clear();
        this.motion = null;
        this.dwell = 0;
        this.lastTime = null;
        const type = this.mission.type;
        this.angle = Math.PI / 4 - this.count * Math.PI / 2;
        this.player = type === 'tawaf' ? ringPoint(this.angle) : type === 'sai' ? { x: this.count % 2 ? 578 : 142, y: 332 } : type === 'rami' ? this.ramiPosition() : this.ready ? { x: 494, y: 352 } : { x: 130, y: 472 };
        this.heading = type === 'tawaf' ? this.angle - Math.PI / 2 : 0;
        this.setTarget();
        this.update();
        this.draw();
        this.speak();
        this.run();
    }

    ramiPosition() { return { x: (this.mission.total === 7 ? 546 : 206 + Math.min(2, Math.floor(this.count / 7)) * 170) - 42, y: 431 }; }

    setTarget() {
        if (this.ready) { this.target = null; return; }
        this.target = this.mission.type === 'tawaf' ? ringPoint(Math.PI / 4 - (this.count + 1) * Math.PI / 2)
            : this.mission.type === 'sai' ? { x: this.count % 2 ? 142 : 578, y: 332 }
            : this.mission.type === 'rami' ? { x: this.mission.total === 7 ? 546 : 206 + Math.floor(this.count / 7) * 170, y: 315 }
            : { x: 494, y: 352 };
    }

    toggleAuto() {
        if (this.complete) { this.reset(); }
        this.auto = !this.auto;
        this.running = this.auto;
        this.keys.clear();
        this.lastTime = null;
        this.update();
        if (this.auto) this.speak(); else this.cancelSpeech();
        this.run();
    }

    togglePause() {
        if (this.complete || (!this.motion && !this.auto)) return;
        this.running = !this.running;
        this.lastTime = null;
        if (!this.running) this.cancelSpeech();
        this.update();
        this.run();
    }

    walk() {
        if (this.complete || this.ready) return;
        this.auto = false;
        this.running = true;
        if (!this.motion) this.startMotion();
        this.update();
        this.run();
    }

    startMotion() {
        if (!this.target || this.motion) return;
        // Manual tawaf completes a whole lap per click; count remains quarter-laps for v1 saves.
        const units = this.mission.type === 'tawaf' ? Math.min(4 - this.count % 4, this.mission.total - this.count) : 1;
        const duration = this.mission.type === 'tawaf' ? units * 1200 : this.mission.type === 'sai' ? 3400 : this.mission.type === 'rami' ? 850 : 2900;
        this.motion = { elapsed: 0, duration, from: { ...this.player }, to: { ...this.target }, fromAngle: this.angle, units };
    }

    arrive() {
        const type = this.mission.type;
        this.count = Math.min(this.mission.total, this.count + this.motion.units);
        this.motion = null;
        this.dwell = 0;
        if (type === 'rami' && !this.ready) this.player = this.ramiPosition();
        this.setTarget();
        this.save();
        if (!this.auto && (this.ready || !this.keys.size)) this.running = false;
        this.update();
    }

    next() {
        if (!this.ready || this.complete) return;
        if (this.step === this.missions.length - 1) {
            this.complete = true;
            this.running = false;
            this.auto = false;
            this.cancelSpeech();
            this.update();
            this.draw();
        } else {
            this.step++;
            this.furthest = Math.max(this.step, this.furthest);
            this.count = 0;
            this.prepare();
        }
        this.save();
    }

    visit(step) {
        if (!Number.isInteger(step) || step < 0 || step > this.furthest || step >= this.missions.length) return;
        this.step = step;
        this.count = 0;
        this.complete = false;
        this.auto = false;
        this.running = false;
        this.prepare();
        this.save();
        this.q('.mg-mission h4').focus({ preventScroll: true });
    }

    answer(index) {
        const correct = index === this.mission.correct;
        this.q('.mg-quiz-result').textContent = correct ? 'Benar. Kamu memahami inti tahap ini.' : 'Belum tepat. Coba baca petunjuk tahap ini, lalu pilih kembali.';
        if (correct && !this.quizAnswers.includes(this.step)) { this.quizAnswers.push(this.step); this.save(); }
    }

    update() {
        const m = this.mission;
        this.root.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === this.mode)));
        this.q('.mg-location').textContent = locationFor(m);
        this.q('.mg-live').textContent = this.complete ? 'SELESAI' : this.running ? (this.auto ? '● TUR OTOMATIS' : '● BERJALAN') : this.motion || this.auto ? 'Ⅱ DIJEDA' : 'SIAP MENJELAJAH';
        this.q('.mg-status').textContent = `TAHAP ${String(this.step + 1).padStart(2, '0')} / ${this.missions.length} · ${m.place}`;
        const progress = Math.round((this.step + this.count / m.total) / this.missions.length * 100);
        this.q('.mg-progress span').style.width = `${progress}%`;
        this.q('.mg-progress').setAttribute('aria-valuenow', String(progress));
        this.q('.mg-mission h4').textContent = m.title;
        this.q('.mg-current-objective span').textContent = `TAHAP ${this.step + 1}/${this.missions.length}`;
        this.q('.mg-current-objective strong').textContent = m.title;
        this.q('.mg-description').textContent = m.text;
        const units = m.type === 'tawaf' ? Math.floor(this.count / 4) : this.count;
        const total = m.type === 'tawaf' ? 7 : m.total;
        this.q('.mg-count').textContent = `${units} / ${total}`;
        this.q('.mg-counter-label').textContent = m.type === 'tawaf' ? 'putaran tawaf' : m.type === 'sai' ? 'perjalanan sa’i' : m.type === 'rami' ? 'kerikil dilontar' : 'tujuan dikunjungi';
        this.q('.mg-tokens').innerHTML = Array.from({ length: total }, (_, i) => `<span class="${i < units ? 'done' : ''}" aria-hidden="true">${i < units ? '✓' : i + 1}</span>`).join('');
        const feedback = this.complete ? 'Seluruh tahap telah dijelajahi. Kamu bisa mengulang lokasi melalui peta perjalanan.'
            : this.ready ? this.auto ? 'Tahap selesai. Baca petunjuk sejenak; tur akan berlanjut otomatis.' : 'Tujuan tercapai. Lanjutkan saat siap; kuis boleh dicoba kapan saja.'
            : m.type === 'tawaf' ? 'Ka’bah tetap di kiri. Satu putaran dihitung saat kembali ke garis Hajar Aswad; lintasan di luar Hijr.'
            : m.type === 'sai' ? `Menuju ${this.count % 2 ? 'Shafa' : 'Marwah'}. Satu arah = satu perjalanan. Selesai di Marwah.`
            : m.type === 'rami' ? `Jumrah ${m.total === 7 ? 'Aqabah' : ['Ula', 'Wustha', 'Aqabah'][Math.floor(this.count / 7)]} · satu kerikil setiap lontaran.`
            : 'Ikuti jejak emas menuju lokasi. Tur otomatis akan mengurus perjalanan untukmu.';
        this.q('.mg-feedback').textContent = feedback;
        this.q('.mg-scene-tip').textContent = this.ready ? '✓ Tujuan tahap ini tercapai' : m.type === 'tawaf' ? '↶ Ikuti lintasan · Ka’bah di kiri' : m.type === 'sai' ? `${this.count % 2 ? '← Shafa' : 'Marwah →'}` : '◇ Ikuti tujuan emas';
        const auto = this.q('[data-auto]');
        auto.textContent = this.complete ? '↻ Mulai perjalanan baru' : this.auto ? '■ Matikan auto' : this.step || this.count || this.motion ? '▶ Lanjut tur otomatis' : '▶ Mulai tur otomatis';
        auto.setAttribute('aria-pressed', String(this.auto));
        this.q('[data-pause]').disabled = this.complete || (!this.motion && !this.auto);
        this.q('[data-pause]').textContent = this.running ? 'Ⅱ Jeda' : '▶ Lanjut';
        this.q('[data-walk]').disabled = this.ready || this.complete || (!!this.motion && this.running);
        this.q('[data-walk]').textContent = m.type === 'tawaf' ? 'Jalan 1 putaran' : m.type === 'rami' ? 'Lontar 1 kerikil' : 'Jalan ke tujuan';
        this.q('.mg-action').hidden = !this.ready || this.complete;
        this.q('.mg-action').textContent = this.step === this.missions.length - 1 ? 'Selesaikan perjalanan ✓' : 'Lanjut tahap →';
        this.q('.mg-source').href = SOURCES[this.mode];
        // Only rebuild the quiz on a stage change, preserving keyboard focus while moving.
        const quizKey = `${this.mode}-${this.step}`;
        if (this.quizKey !== quizKey) {
            this.quizKey = quizKey;
            this.q('.mg-quiz').open = false;
            this.q('.mg-choices').innerHTML = `<p>${m.question}</p>${m.answers.map((answer, i) => ({ answer, i })).sort((a, b) => this.step % 2 ? b.i - a.i : a.i - b.i).map(({ answer, i }) => `<button data-answer="${i}">${answer}</button>`).join('')}`;
            this.q('.mg-quiz-result').textContent = this.quizAnswers.includes(this.step) ? 'Sudah dijawab dengan benar.' : '';
        }
        this.q('.mg-route').innerHTML = this.missions.map((stage, i) => `<button data-stage="${i}" ${i > this.furthest ? 'disabled' : ''} ${i === this.step ? 'aria-current="step"' : ''}><span>${i < this.furthest || this.complete ? '✓' : String(i + 1).padStart(2, '0')}</span><strong>${stage.title}</strong><small>${stage.place}</small></button>`).join('');
        this.q('.mg-finish').hidden = !this.complete;
        this.q('.mg-finish p').textContent = `${this.missions.length} tahap ${this.mode === 'haji' ? 'haji tamattu' : 'umrah'} telah dijelajahi. ${this.quizAnswers.length} kuis dijawab benar.`;
        this.canvas.setAttribute('aria-label', `${m.title}. ${feedback} Enter untuk berjalan; spasi untuk jeda.`);
    }

    toggleNarration() {
        if (!('speechSynthesis' in window)) {
            this.q('.mg-feedback').textContent = 'Perangkat ini belum mendukung pembacaan suara. Petunjuk tetap tersedia di panel.';
            return;
        }
        this.narration = !this.narration;
        this.q('[data-sound]').setAttribute('aria-pressed', String(this.narration));
        this.q('[data-sound]').textContent = `Bacakan: ${this.narration ? 'aktif' : 'mati'}`;
        if (this.narration) this.speak(); else this.cancelSpeech();
    }
    speak() {
        if (!this.narration || !this.canAnimate || this.complete) return;
        this.cancelSpeech();
        const utterance = new SpeechSynthesisUtterance(`${this.mission.title}. ${this.mission.text}`);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95;
        speechSynthesis.speak(utterance);
        this.utterance = utterance;
    }
    cancelSpeech() { if (this.utterance && 'speechSynthesis' in window) { speechSynthesis.cancel(); this.utterance = null; } }

    setActive(active) { this.active = active; if (!active) this.suspend(); else this.run(); }
    suspend() {
        if (this.raf !== null) cancelAnimationFrame(this.raf);
        this.raf = null;
        this.lastTime = null;
        this.keys.clear();
        this.cancelSpeech();
    }
    run() {
        if (this.raf !== null || !this.canAnimate || !this.running) return;
        this.raf = requestAnimationFrame(this.frame);
    }
    frame = time => {
        this.raf = null;
        if (!this.canAnimate || !this.running) { this.lastTime = null; return; }
        // Delta time excludes background time and is capped after a stalled frame.
        const dt = this.lastTime === null ? 0 : Math.max(0, Math.min(80, time - this.lastTime));
        this.lastTime = time;
        this.clock += dt;
        this.advance(dt);
        this.draw();
        this.run();
    };

    advance(dt) {
        if (!this.running || this.complete) return;
        if (!this.motion) {
            if (this.ready) {
                if (!this.auto) { this.running = false; return; }
                this.dwell += dt;
                // Reading time stays comfortable even at accelerated walking speed.
                if (this.dwell >= 6500 && (!this.narration || !speechSynthesis.speaking || this.dwell >= 45000)) this.next();
                return;
            }
            if (this.auto || this.keys.size) this.startMotion();
            else { this.running = false; return; }
        }
        const motion = this.motion;
        motion.elapsed += dt * this.speed;
        const t = Math.min(1, motion.elapsed / motion.duration);
        // Linear travel keeps gait and lap counts legible. No camera shake/zoom.
        if (this.mission.type === 'tawaf') {
            this.angle = motion.fromAngle - t * motion.units * Math.PI / 2;
            this.player = ringPoint(this.angle);
            this.heading = this.angle - Math.PI / 2;
        } else if (this.mission.type !== 'rami') {
            this.player = { x: motion.from.x + (motion.to.x - motion.from.x) * t, y: motion.from.y + (motion.to.y - motion.from.y) * t };
            this.heading = Math.atan2(motion.to.y - motion.from.y, motion.to.x - motion.from.x);
        }
        if (t >= 1) this.arrive();
    }
    draw() { this.scene.draw(this); }
    destroy() { this.destroyed = true; this.suspend(); this.observer.disconnect(); this.events.abort(); }
}
