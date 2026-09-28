// Run with Playwright installed and a local server at BASE_URL (default :8765).
// Example: NODE_PATH=<path-to-node_modules> node islamhub/tests/simulations.cjs
const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(`${process.env.BASE_URL || 'http://127.0.0.1:8765'}/islamhub/`);
        await page.waitForFunction(() => window.islamHub);
        await page.evaluate(() => window.islamHub.switchApp('sholat'));
        await page.waitForFunction(() => window.sholatApp?.peraga3D?.world);
        await page.locator('#peragaCanvas').scrollIntoViewIfNeeded();
        const model = await page.evaluate(async () => {
            const { POSES } = await import('/islamhub/js/apps/sholat/peraga-3d.js?v=4.0.0');
            const { posture } = await import('/islamhub/js/apps/sholat/mosque-scene.js');
            const kneel = posture(POSES[4]);
            const headHeight = local => kneel.head[1] + Math.cos(kneel.tilt)*local[0] - Math.sin(kneel.tilt)*local[1];
            return { count: POSES.length, finalSeat: POSES[13].body, sitting: posture(POSES[5]),
                forehead: headHeight([.08,-.105]), nose: headHeight([-.012,-.153]),
                elbows: [kneel.elbowL[1],kneel.elbowR[1]], rukuk: posture(POSES[2]),
                standing:posture(POSES[1]),rightTurn:posture(POSES[15]).turn,leftTurn:posture(POSES[16]).turn };
        });
        assert.equal(model.count,17);assert.equal(model.finalSeat,'iftirasy');
        assert.notDeepEqual(model.sitting.ankleL,model.sitting.ankleR);
        assert(model.standing.shoulderR[0]>0 && model.standing.shoulderL[0]<0,'Anatomical right is +X when facing -Z');
        assert(model.standing.wristR[1]>model.standing.wristL[1],'Right hand above left');
        assert(-Math.sin(model.rightTurn)>0 && -Math.sin(model.leftTurn)<0,'Salam turns in the anatomical direction');
        assert(Math.abs(model.forehead-.034)<.02 && Math.abs(model.nose-.034)<.02, 'Forehead and nose contact the mat');
        assert(model.elbows.every(h=>h>.2),'Forearms stay off the mat');
        assert.equal(model.rukuk.hip[1],model.rukuk.chest[1],'Back horizontal in rukuk');
        for(let i=0;i<17;i++) {
            await page.locator(`.peraga-dot[data-step="${i}"]`).click();
            assert.equal(await page.locator('#peragaStepNum').textContent(),String(i+1));
        }
        assert(await page.locator('#peragaNextBtn').isDisabled());
        await page.locator('#peragaResetBtn').click();
        for(let i=0;i<3;i++) {
            await page.locator('.sholat-tab[data-tab="rukun"]').click();
            await page.locator('.sholat-tab[data-tab="peraga"]').click();
        }
        await page.locator('#peragaNextBtn').click();
        assert.equal(await page.locator('#peragaStepNum').textContent(),'2','One click = one step after remounts');
        for(const width of [320,390,768,1440]) {
            await page.setViewportSize({width,height:900});
            assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No prayer overflow at ${width}`);
        }
        await page.locator('#peragaPlayBtn').click();
        await page.evaluate(()=>window.islamHub.switchApp('haji'));
        assert.equal(await page.evaluate(()=>window.sholatApp.peraga3D.isPlaying),false);
        await page.waitForSelector('.manasik-game canvas');
        for(const mode of ['umrah','haji']) {
            await page.locator(`[data-mode="${mode}"]`).click();
            await page.locator('[data-restart]').click();
            const missions = await page.evaluate(async mode => {
                const data=await import('/islamhub/js/apps/haji/manasik-game.js');
                return mode==='haji'?data.HAJI:data.UMRAH;
            },mode);
            for(let step=0;step<missions.length;step++) {
                const m=missions[step];
                for(let n=0;n<m.total;n++) {
                    await page.locator('[data-walk]').click();
                    await page.waitForFunction(({mode,n})=>JSON.parse(localStorage.getItem('islamhub_manasik_game_v1'))?.[mode]?.count===n+1,{mode,n});
                }
                assert(await page.locator('[data-walk]').isDisabled());
                await page.getByRole('button',{name:m.answers[1-m.correct],exact:true}).click();
                assert(await page.locator('.mg-action').isHidden(),'Wrong answers do not advance');
                await page.getByRole('button',{name:m.answers[m.correct],exact:true}).click();
                await page.locator('.mg-action').click();
            }
            assert.match(await page.locator('.mg-status').textContent(),/SELESAI/);
            console.log(`${mode}: ${missions.length} missions completed through UI`);
        }
        await page.reload();await page.waitForFunction(()=>window.islamHub);
        await page.evaluate(()=>window.islamHub.switchApp('haji'));
        await page.locator('[data-mode="haji"]').click();
        assert.match(await page.locator('.mg-status').textContent(),/SELESAI/,'Completion survives reload');
        for(const width of [320,390,768,1440]) {
            await page.setViewportSize({width,height:900});
            assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No game overflow at ${width}`);
        }
        assert.deepEqual(errors,[]);
        console.log('PASS: geometry contacts, 17 poses, remounts, pause, both game journeys, persistence, responsive layouts, no runtime errors');
    } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
