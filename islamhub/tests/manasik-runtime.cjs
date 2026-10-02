const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const base = process.env.BASE_URL || 'http://127.0.0.1:8765';
    const errors = [];
    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 1080 }, serviceWorkers: 'block' });
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(`${base}/islamhub/`);
        await page.waitForFunction(() => window.islamHub);
        await page.evaluate(() => window.islamHub.switchApp('haji'));
        await page.locator('.mg-adventure canvas').waitFor();
        await page.locator('.mg-world').scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(os.tmpdir(), 'manasik-desktop.png') });
        await page.locator('[data-auto]').click();
        await page.waitForTimeout(1200);
        assert.match(await page.locator('.mg-live').textContent(), /TUR OTOMATIS/);
        await page.locator('[data-pause]').click();
        const paused = await page.locator('.mg-world canvas').evaluate(c => c.toDataURL());
        await page.waitForTimeout(300);
        assert.equal(await page.locator('.mg-world canvas').evaluate(c => c.toDataURL()), paused, 'Pause stops movement and rendering');
        await page.locator('[data-pause]').click();
        await page.waitForTimeout(200);
        assert.notEqual(await page.locator('.mg-world canvas').evaluate(c => c.toDataURL()), paused, 'Resume moves the character');
        await page.locator('[data-auto]').click();

        // Deterministic tests use the same production controller and renderer in a separate host.
        const result = await page.evaluate(async () => {
            const { default: Game } = await import('/islamhub/js/apps/haji/manasik-adventure.js?v=2.0.0');
            const host = document.createElement('div'); document.body.append(host);
            const g = new Game(host); g.visible = false; g.active = false;
            const check = (condition, message) => { if (!condition) throw new Error(message); };
            const counts = { umrah: [], haji: [] };
            const runStep = () => {
                const before = g.step;
                for (let n = 0; n < 20000 && g.step === before && !g.complete; n++) g.advance(80);
                check(g.step !== before || g.complete, `Stage ${before} must finish`);
            };
            for (const mode of ['umrah', 'haji']) {
                g.mode = mode; g.saved[mode] = {}; g.restore(); g.auto = true; g.running = true;
                while (!g.complete) {
                    const m = g.mission;
                    while (!g.ready) g.advance(80);
                    counts[mode].push([m.type, g.count]);
                    if (m.type === 'tawaf') {
                        check(g.count === 28, 'Exactly seven complete tawaf laps');
                        check(Math.abs(g.player.x - (360 + Math.cos(Math.PI / 4) * 184)) < .01, 'Tawaf finishes at starting line');
                    }
                    if (m.type === 'sai') check(g.count === 7 && g.player.x === 578, 'Sai ends at Marwah after seven journeys');
                    if (m.type === 'rami') check(g.count === m.total, 'Rami completes correct number of pebbles');
                    runStep();
                }
                check(g.quizAnswers.length === 0, 'Autoplay never answers quizzes for the user');
            }
            check(counts.umrah.length === 5 && counts.haji.length === 15, 'Full umrah and tamattu flows');
            g.mode = 'umrah'; g.reset(); g.step = 1; g.prepare();
            g.walk(); g.advance(1200);
            check(g.angle < Math.PI / 4, 'Tawaf moves counterclockwise on screen');
            check(Math.hypot(g.player.x - 360, g.player.y - 322) >= 164, 'Tawaf remains outside Kabah and Hijr');
            const angle = g.angle; g.togglePause(); g.advance(2000);
            check(g.angle === angle, 'Paused controller cannot advance');
            g.togglePause();
            while (g.motion) g.advance(80);
            check(g.count === 4, 'One manual click completes one lap, not one quarter');
            g.save(); g.restore(); check(g.step === 1 && g.count === 4, 'Restore keeps completed laps');
            check(!g.running && !g.auto, 'Restore does not start without user intent');
            g.saved.umrah = { step: 500, count: -3, complete: true }; g.restore();
            check(g.step === 4 && g.count === 0 && !g.complete, 'Malformed progress is clamped');
            g.saved.umrah = { step: 1, count: 3 }; g.restore();
            g.walk(); while (g.motion) g.advance(80);
            check(g.count === 4, 'Migrated quarter-lap progress completes remaining quarter');
            g.mode = 'haji'; g.restore(); check(g.complete, 'Mode switching preserves independent completion');
            g.visit(8); check(g.step === 8 && !g.complete, 'Completed stages can be replayed');
            g.answer(1); check(g.quizAnswers.length === 0, 'Wrong answer is not recorded');
            g.answer(0); check(g.quizAnswers.includes(8), 'Correct optional answer is saved');
            g.destroy(); check(g.raf === null && g.events.signal.aborted, 'Destroy stops callbacks and listeners');
            host.remove();
            return counts;
        });
        assert.equal(result.haji.length, 15);
        await page.reload();
        await page.waitForFunction(() => window.islamHub);
        await page.evaluate(() => window.islamHub.switchApp('haji'));
        await page.locator('.mg-adventure canvas').waitFor();
        await page.locator('[data-mode="umrah"]').click();
        await page.locator('.mg-world').scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(os.tmpdir(), 'manasik-tawaf-desktop.png') });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.locator('.mg-world').scrollIntoViewIfNeeded();
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No mobile horizontal overflow');
        const hit = await page.locator('[data-auto]').evaluate(el => { const r = el.getBoundingClientRect(); return { width: r.width, height: r.height }; });
        assert(hit.width >= 44 && hit.height >= 44, 'Touch target is usable');
        await page.screenshot({ path: path.join(os.tmpdir(), 'manasik-mobile.png') });
        await page.locator('[data-auto]').click();
        await page.waitForTimeout(200);
        await page.locator('.haji-tab[data-tab="haji"]').click();
        await page.waitForTimeout(200);
        await page.locator('.haji-tab[data-tab="game"]').click();
        await page.locator('.mg-world').scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        assert.match(await page.locator('.mg-live').textContent(), /TUR OTOMATIS/);
        await page.locator('[data-auto]').click();
        assert.deepEqual(errors, [], 'No browser runtime errors');
        // Real RAF and production UI: one click must finish umrah without a quiz gate.
        const tour = await browser.newPage({ viewport: { width: 1440, height: 1080 }, serviceWorkers: 'block' });
        tour.on('pageerror', e => errors.push(e.message));
        await tour.goto(`${base}/islamhub/`);
        await tour.waitForFunction(() => window.islamHub);
        await tour.evaluate(() => window.islamHub.switchApp('haji'));
        await tour.locator('[data-speed]').selectOption('3');
        await tour.locator('[data-auto]').click();
        await tour.locator('.mg-finish').waitFor({ state: 'visible', timeout: 100000 });
        assert.match(await tour.locator('.mg-finish p').textContent(), /5 tahap umrah.*0 kuis/);
        for (const width of [320, 390, 768, 1440]) {
            await tour.setViewportSize({ width, height: 1000 });
            assert(await tour.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `No game overflow at ${width}`);
        }
        assert.deepEqual(errors, [], 'Real autoplay has no browser errors');
        await tour.close();
        console.log('PASS: 5 umrah + 15 haji stages, autoplay, pause/resume, counters, optional quiz, save/reload, migration, replay, mobile and tab lifecycle');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
