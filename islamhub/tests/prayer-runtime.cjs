const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    try {
        // Do not use reduced motion: the freeze occurred inside the normal RAF path.
        const page = await browser.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true, reducedMotion:'no-preference', serviceWorkers:'block' });
        const errors=[];page.on('pageerror',error=>errors.push(error.message));
        await page.goto(`${process.env.BASE_URL || 'http://127.0.0.1:8765'}/islamhub/`);
        await page.waitForFunction(()=>window.islamHub);
        await page.evaluate(()=>Promise.all([window.islamHub.switchApp('sholat'),window.islamHub.switchApp('sholat')]));
        await page.waitForFunction(()=>window.sholatApp?.peraga3D?.world);
        await page.locator('.peraga-stage').scrollIntoViewIfNeeded();
        // The exact timing condition which crashed the old renderer.
        await page.evaluate(()=>{
            const a=window.sholatApp.peraga3D,w=a.world;
            a.setStep(1,true);cancelAnimationFrame(w.raf);w.frame(w.started-1);
        });
        await page.waitForFunction(()=>!window.sholatApp.peraga3D.world.path);
        assert(await page.locator('#peragaSceneStatus').isHidden(),'Early RAF must not freeze rendering');
        await page.locator('#peragaResetBtn').click();
        for(let step=1;step<17;step++){
            await page.locator('#peragaNextBtn').click();
            await page.waitForFunction(()=>!window.sholatApp.peraga3D.world.path);
            assert.equal(await page.locator('#peragaStepNum').textContent(),String(step+1));
            const state=await page.evaluate(()=>{const w=window.sholatApp.peraga3D.world;return {running:w.running,hands:w.current.hands,y:w.current.wristR[1],shadow:w.renderer.shadowMap.mapSize};});
            assert(state.running,`Renderer stays usable at step ${step+1}`);
            if(step===3||step===9){assert.equal(state.hands,'down');assert(state.y<1);}
        }
        await page.locator('#peragaResetBtn').click();
        await page.locator('#peragaPlayBtn').click();
        await page.waitForFunction(()=>window.sholatApp.peraga3D.currentStep>=2,{},{timeout:18000});
        await page.locator('#peragaPlayBtn').click();
        assert.equal(await page.evaluate(()=>window.sholatApp.peraga3D.isPlaying),false);
        // Camera updates must still render when the idle animation loop has stopped.
        await page.locator('[data-prayer-view="3.14159"]').click();
        await page.waitForFunction(()=>!window.sholatApp.peraga3D.world.path);
        await page.waitForTimeout(150);
        const idleFrame=await page.evaluate(()=>window.sholatApp.peraga3D.world.renderer.info.render.frame);
        await page.waitForTimeout(300);
        assert.equal(await page.evaluate(()=>window.sholatApp.peraga3D.world.renderer.info.render.frame),idleFrame,'Idle scene does not continuously use the GPU');
        await page.locator('[data-prayer-view="1.5708"]').click();
        await page.waitForFunction(frame=>window.sholatApp.peraga3D.world.renderer.info.render.frame>frame,idleFrame);
        // Interruption followed by recovery must not require a full page reload.
        await page.evaluate(()=>window.sholatApp.peraga3D.world.renderer.forceContextLoss());
        await page.locator('#peragaSceneStatus').waitFor({state:'visible'});
        await page.locator('#peragaNextBtn').click();
        await page.waitForTimeout(200);
        await page.locator('#peragaRecoverBtn').click();
        await page.locator('#peragaSceneStatus').waitFor({state:'hidden'});
        await page.waitForFunction(()=>!window.sholatApp.peraga3D.world.path);
        for(let i=0;i<3;i++){
            await page.locator('.sholat-tab[data-tab="rukun"]').click();
            await page.locator('.sholat-tab[data-tab="peraga"]').click();
        }
        await page.locator('#peragaResetBtn').click();await page.locator('#peragaNextBtn').click();
        assert.equal(await page.locator('#peragaStepNum').textContent(),'2','No duplicate handlers after revisits');
        await page.locator('.peraga-dot[data-step="3"]').click();
        await page.waitForFunction(()=>!window.sholatApp.peraga3D.world.path);
        await page.locator('[data-prayer-view="2.25"]').click();
        await page.locator('.peraga-viewer').scrollIntoViewIfNeeded();
        await page.screenshot({path:path.join(os.tmpdir(),'prayer-repaired-mobile.png')});
        for(const size of [{width:320,height:568},{width:390,height:844},{width:768,height:900},{width:1440,height:1000}]){
            await page.setViewportSize(size);
            assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No overflow at ${size.width}`);
            const height=await page.locator('.peraga-stage').evaluate(el=>el.clientHeight+document.querySelector('.peraga-overlay-controls').clientHeight);
            assert(height<size.height-70,'Primary controls and figure fit together');
        }
        await page.locator('.peraga-viewer').scrollIntoViewIfNeeded();
        await page.screenshot({path:path.join(os.tmpdir(),'prayer-repaired-desktop.png')});
        assert.deepEqual(errors,[]);
        console.log('PASS: normal animation for all 17 steps, early RAF regression, autoplay, pause, single initialization, idle GPU, camera, WebGL recovery, mobile layout, irsal');
    } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
