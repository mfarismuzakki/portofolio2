// Arena shell: game menu, HUD, result screen. Each game is { id, title, icon, desc, tag, run(api) }.
import { progress, starsFor, starText, blip, confetti, escapeHtml } from './game-kit.js';

export default class Arena {
    constructor(root, { title, eyebrow, intro, games, theme = '' }) {
        this.root = root;
        this.games = games;
        this.cleanups = [];
        this.root.className = `gk-arena ${theme}`;
        this.root.innerHTML = `
            <header class="gk-head">
                <div><span class="gk-eyebrow">${eyebrow}</span><h3>${title}</h3><p>${intro}</p></div>
                <div class="gk-level" aria-live="polite"></div>
            </header>
            <div class="gk-body"></div>`;
        this.body = this.root.querySelector('.gk-body');
        this.root.addEventListener('click', e => {
            const b = e.target.closest('button');
            if (!b || b.disabled) return;
            if (b.dataset.play) this.play(b.dataset.play);
            else if (b.hasAttribute('data-menu')) this.menu();
            else if (b.hasAttribute('data-again')) this.play(this.current.id);
            else if (b.hasAttribute('data-gk-sound')) { const on = !progress.get().sound; progress.setSound(on); this.renderLevel(); if (on) blip('tap'); }
        });
        this.menu();
    }

    renderLevel() {
        const p = progress.get(), l = progress.level(p.xp);
        this.root.querySelector('.gk-level').innerHTML = `
            <div class="gk-badge"><b>${l.level}</b><span>Level</span></div>
            <div class="gk-xp"><strong>${p.xp} XP</strong><span class="gk-bar"><i style="width:${Math.round(l.into / l.need * 100)}%"></i></span><small>${l.need - l.into} XP lagi ke level ${l.level + 1}</small></div>
            <button class="gk-sound" data-gk-sound aria-pressed="${p.sound}" title="Efek suara">${p.sound ? '🔊' : '🔈'}</button>`;
    }

    cleanup() { this.cleanups.splice(0).forEach(fn => { try { fn(); } catch (e) { console.error(e); } }); }

    menu() {
        this.cleanup();
        this.current = null;
        this.renderLevel();
        const best = progress.get().best;
        this.body.innerHTML = `<div class="gk-menu">${this.games.map(g => {
            const b = best[g.id];
            return `<article class="gk-card">
                <div class="gk-card-icon" aria-hidden="true">${g.icon}</div>
                <div class="gk-card-text"><span class="gk-tag">${g.tag}</span><h4>${g.title}</h4><p>${g.desc}</p></div>
                <div class="gk-card-foot"><span class="gk-stars" aria-label="${b ? b.stars : 0} dari 3 bintang">${starText(b ? b.stars : 0)}</span>
                <span class="gk-best">${b ? `Terbaik ${b.score}` : 'Belum dimainkan'}</span>
                <button class="gk-btn gk-primary" data-play="${g.id}">Main ▶</button></div></article>`;
        }).join('')}</div>`;
    }

    play(id) {
        this.cleanup();
        const game = this.games.find(g => g.id === id);
        if (!game) return;
        this.current = game;
        this.body.innerHTML = `
            <div class="gk-play">
                <div class="gk-hud">
                    <button class="gk-btn gk-ghost" data-menu aria-label="Kembali ke menu">← Menu</button>
                    <strong class="gk-title">${game.title}</strong>
                    <span class="gk-chip gk-round" hidden></span>
                    <span class="gk-chip gk-lives" hidden></span>
                    <span class="gk-chip gk-score">0</span>
                </div>
                <div class="gk-timer" hidden><i></i></div>
                <div class="gk-stage"></div>
                <div class="gk-feedback" role="status" aria-live="polite"></div>
            </div>`;
        const q = s => this.body.querySelector(s);
        const api = {
            stage: q('.gk-stage'),
            hud: ({ score, lives, maxLives = 3, round, total, combo } = {}) => {
                if (score !== undefined) q('.gk-score').textContent = `${score}${combo > 1 ? ` · x${combo}` : ''}`;
                if (lives !== undefined) { const el = q('.gk-lives'); el.hidden = false; el.textContent = '♥'.repeat(Math.max(0, lives)) + '♡'.repeat(Math.max(0, maxLives - lives)); el.setAttribute('aria-label', `${lives} nyawa`); }
                if (round !== undefined) { const el = q('.gk-round'); el.hidden = false; el.textContent = `${round}/${total}`; }
            },
            timer: ratio => { const el = q('.gk-timer'); el.hidden = ratio === null; if (ratio !== null) { el.querySelector('i').style.width = `${Math.max(0, ratio) * 100}%`; el.classList.toggle('low', ratio < 0.25); } },
            feedback: (html, kind = '') => { const el = q('.gk-feedback'); el.className = `gk-feedback ${kind}`; el.innerHTML = html; },
            flash: kind => { const el = q('.gk-stage'); el.classList.remove('gk-ok', 'gk-bad'); void el.offsetWidth; el.classList.add(kind === 'ok' ? 'gk-ok' : 'gk-bad'); },
            onCleanup: fn => this.cleanups.push(fn),
            visible: () => !!this.root.offsetParent && !document.hidden,
            end: result => this.result(game, result)
        };
        try { game.run(api); } catch (error) {
            console.error(error);
            api.stage.innerHTML = `<p class="gk-empty">Game belum dapat dimuat: ${escapeHtml(error.message)}</p>`;
        }
    }

    result(game, { score, max, lines = [] }) {
        this.cleanup();
        const stars = starsFor(max ? score / max : 0);
        const r = progress.record(game.id, score, stars);
        blip(stars ? 'win' : 'bad');
        this.renderLevel();
        this.body.innerHTML = `
            <div class="gk-result">
                <span class="gk-eyebrow">PERMAINAN SELESAI</span>
                <div class="gk-big-stars" aria-label="${stars} dari 3 bintang">${starText(stars)}</div>
                <h4>${['Ayo coba lagi', 'Bagus, terus berlatih', 'Hebat!', 'Sempurna, mā syā’ Allāh!'][stars]}</h4>
                <div class="gk-result-stats"><div><b>${score}</b><span>Skor</span></div><div><b>+${r.gained}</b><span>XP</span></div><div><b>${r.best.score}</b><span>${r.isBest ? 'Rekor baru!' : 'Terbaik'}</span></div></div>
                ${lines.length ? `<ul class="gk-review">${lines.map(l => `<li>${l}</li>`).join('')}</ul>` : ''}
                <div class="gk-result-actions"><button class="gk-btn gk-primary" data-again>Main lagi ↻</button><button class="gk-btn" data-menu>Pilih game lain</button></div>
            </div>`;
        if (stars >= 2) confetti(this.body.querySelector('.gk-result'));
    }

    destroy() { this.cleanup(); }
}
