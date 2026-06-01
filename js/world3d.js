/* =====================================================================
   WORLD3D — opt-in 3D explorable portfolio (Three.js r128, local vendor)
   A neon low-poly world. Walk an avatar to glowing altars; each altar
   opens the matching portfolio section (content cloned from the page,
   so it stays in sync). Keyboard + mouse on desktop, joystick on touch.
   ===================================================================== */
(function () {
    'use strict';

    var TOUCH = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    var THREE_SRC = 'js/vendor/three.min.js';

    // section altars: id, short label, emoji, color, full title, content selector
    var ALTARS = [
        { id: 'about',      label: 'Asal-Usul',  icon: '📜', color: 0x00ffff, full: 'About',      sel: '#about .about-content' },
        { id: 'experience', label: 'Perjalanan', icon: '🗺️', color: 0xffd34d, full: 'Experience', sel: '#experience .timeline' },
        { id: 'skills',     label: 'Keahlian',   icon: '🌳', color: 0x00ff41, full: 'Tech Stack',  sel: '#skills .skills-grid' },
        { id: 'tools',      label: 'Bengkel',    icon: '⚒️', color: 0xff8a3d, full: 'Tools',       sel: '#tools .tools-grid' },
        { id: 'services',   label: 'Guild',      icon: '🏛️', color: 0x6bb8ff, full: 'Services',    sel: '#services .services-grid' },
        { id: 'education',  label: 'Akademi',    icon: '🎓', color: 0xb06bff, full: 'Education',   sel: '#education .timeline' }
    ];

    var THREE, scene, camera, renderer, clock;
    var overlay, panel, prompt, actionBtn, loaderEl;
    var avatar, altarMeshes = [], orbitLight, trail = [];
    var built = false, running = false, paused = false;
    var keys = {}, joy = { x: 0, z: 0 }, drag = { on: false, lx: 0, ly: 0 };
    var camYaw = 0, camPitch = 0.52, camDist = 17;
    var currentAltar = null;
    var WORLD_R = 58, RING_R = 34, TRIGGER = 7.5, SPEED = 20;

    function el(tag, cls, html) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (html != null) n.innerHTML = html;
        return n;
    }

    /* ---------------- overlay DOM ---------------- */
    function buildOverlay() {
        overlay = el('div', 'world3d-overlay');
        overlay.id = 'world3d';

        loaderEl = el('div', 'w3d-loader',
            '<div><div class="w3d-spin"></div>' +
            '<div class="w3d-load-text">MEMUAT DUNIA…</div>' +
            '<div class="w3d-load-sub">Menyiapkan altar & medan neon</div></div>');
        overlay.appendChild(loaderEl);

        overlay.appendChild(el('div', 'w3d-topbar',
            'DUNIA FARIS · <b>jelajahi</b> & dekati altar untuk membuka kontennya'));

        var exit = el('div', 'w3d-exit', '✕ KELUAR');
        exit.addEventListener('click', deactivate);
        overlay.appendChild(exit);

        prompt = el('div', 'w3d-prompt',
            '<div class="w3d-prompt-name">—</div>' +
            '<div>Tekan <span class="w3d-key">E</span> untuk masuk</div>');
        overlay.appendChild(prompt);

        panel = el('div', 'w3d-panel',
            '<div class="w3d-panel-head"><h2>—</h2>' +
            '<div class="w3d-panel-close" title="Tutup">✕</div></div>' +
            '<div class="w3d-panel-body"></div>');
        panel.querySelector('.w3d-panel-close').addEventListener('click', closePanel);
        overlay.appendChild(panel);

        // mobile controls
        var stick = el('div', 'w3d-joystick', '<div class="w3d-stick"></div>');
        overlay.appendChild(stick);
        wireJoystick(stick);

        actionBtn = el('div', 'w3d-action', 'E');
        actionBtn.addEventListener('click', interact);
        overlay.appendChild(actionBtn);

        overlay.appendChild(el('div', 'w3d-hint',
            'WASD / panah: gerak · seret mouse: putar kamera · E: interaksi · ESC: keluar'));

        document.body.appendChild(overlay);
    }

    /* ---------------- lazy three.js loader ---------------- */
    function loadThree(cb) {
        if (window.THREE) { THREE = window.THREE; cb(); return; }
        var s = document.createElement('script');
        s.src = THREE_SRC;
        s.onload = function () { THREE = window.THREE; cb(); };
        s.onerror = function () {
            loaderEl.innerHTML = '<div style="color:#ff6a7a;font-family:Orbitron">Gagal memuat mesin 3D.</div>';
        };
        document.head.appendChild(s);
    }

    /* ---------------- text sprite labels ---------------- */
    function makeLabel(text, sub, colorCss) {
        var c = document.createElement('canvas');
        c.width = 512; c.height = 256;
        var x = c.getContext('2d');
        x.fillStyle = 'rgba(8,12,22,0.78)';
        roundRect(x, 16, 70, 480, 120, 24); x.fill();
        x.strokeStyle = colorCss; x.lineWidth = 4;
        roundRect(x, 16, 70, 480, 120, 24); x.stroke();
        x.font = '70px Orbitron, Arial';
        x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillStyle = '#fff';
        x.fillText(sub || '', 256, 132);
        x.font = '54px Arial';
        x.fillText(text, 256, 40);
        var tex = new THREE.CanvasTexture(c);
        tex.anisotropy = 4;
        var spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
        spr.scale.set(10, 5, 1);
        return spr;
    }
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    /* ---------------- fake-bloom glow sprite ---------------- */
    var _glowTex = null;
    function glowTexture() {
        if (_glowTex) return _glowTex;
        var c = document.createElement('canvas');
        c.width = c.height = 128;
        var x = c.getContext('2d');
        var g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.35, 'rgba(255,255,255,0.35)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = g; x.fillRect(0, 0, 128, 128);
        _glowTex = new THREE.CanvasTexture(c);
        return _glowTex;
    }
    function glowSprite(color, size) {
        var s = new THREE.Sprite(new THREE.SpriteMaterial({
            map: glowTexture(), color: color, transparent: true,
            blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9
        }));
        s.scale.set(size, size, 1);
        return s;
    }

    /* ---------------- scene build ---------------- */
    function buildScene() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x04060c);
        scene.fog = new THREE.FogExp2(0x04060c, 0.012);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 600);

        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        overlay.appendChild(renderer.domElement);
        overlay.appendChild(el('div', 'w3d-vignette')); // cinematic edges

        clock = new THREE.Clock();

        // lights
        scene.add(new THREE.AmbientLight(0x4466aa, 0.7));
        var hemi = new THREE.HemisphereLight(0x88aaff, 0x050510, 0.5);
        scene.add(hemi);
        var key = new THREE.PointLight(0x00ffff, 0.8, 200); key.position.set(0, 40, 0); scene.add(key);

        // ground disc
        var ground = new THREE.Mesh(
            new THREE.CircleGeometry(WORLD_R, 64),
            new THREE.MeshStandardMaterial({ color: 0x070d18, emissive: 0x04101e, metalness: 0.4, roughness: 0.7 })
        );
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);

        var grid = new THREE.GridHelper(WORLD_R * 2, 56, 0x00ffff, 0x10324a);
        grid.material.transparent = true; grid.material.opacity = 0.28;
        grid.position.y = 0.02;
        scene.add(grid);

        // boundary ring
        var ring = new THREE.Mesh(
            new THREE.TorusGeometry(WORLD_R, 0.35, 12, 80),
            new THREE.MeshBasicMaterial({ color: 0x00ffff })
        );
        ring.rotation.x = -Math.PI / 2; ring.position.y = 0.2;
        scene.add(ring);

        // starfield
        var sc = 1200, pos = new Float32Array(sc * 3);
        for (var i = 0; i < sc; i++) {
            var rr = 120 + Math.random() * 260;
            var th = Math.random() * Math.PI * 2;
            var ph = Math.acos(2 * Math.random() - 1);
            pos[i*3]   = rr * Math.sin(ph) * Math.cos(th);
            pos[i*3+1] = Math.abs(rr * Math.cos(ph)) * 0.7 + 4;
            pos[i*3+2] = rr * Math.sin(ph) * Math.sin(th);
        }
        var sg = new THREE.BufferGeometry();
        sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        scene.add(new THREE.Points(sg, new THREE.PointsMaterial({
            color: 0x9fdfff, size: 1.1, sizeAttenuation: true, transparent: true, opacity: 0.85
        })));

        buildMonument();
        buildAltars();
        buildAvatar();
        buildMotes();

        // orbiting colour-cycling rim light for ambience
        orbitLight = new THREE.PointLight(0xff66cc, 1.2, 120);
        orbitLight.position.set(40, 18, 0);
        scene.add(orbitLight);
    }

    var motes = null;
    function buildMotes() {
        var n = 150, p = new Float32Array(n * 3), v = new Float32Array(n);
        for (var i = 0; i < n; i++) {
            var rr = Math.random() * WORLD_R;
            var a = Math.random() * Math.PI * 2;
            p[i*3]   = Math.cos(a) * rr;
            p[i*3+1] = Math.random() * 40;
            p[i*3+2] = Math.sin(a) * rr;
            v[i] = 1.2 + Math.random() * 2.2;
        }
        var g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(p, 3));
        var pts = new THREE.Points(g, new THREE.PointsMaterial({
            map: glowTexture(), color: 0x9fe8ff, size: 1.6, sizeAttenuation: true,
            transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false
        }));
        motes = { pts: pts, vel: v, n: n };
        scene.add(pts);
    }

    function buildMonument() {
        var g = new THREE.Group();
        var pedestal = new THREE.Mesh(
            new THREE.CylinderGeometry(5, 6.5, 1.6, 8),
            new THREE.MeshStandardMaterial({ color: 0x0c1830, emissive: 0x0a2240, metalness: 0.6, roughness: 0.4 })
        );
        pedestal.position.y = 0.8; g.add(pedestal);

        var crystal = new THREE.Mesh(
            new THREE.OctahedronGeometry(3, 0),
            new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00aacc, emissiveIntensity: 1.2,
                metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.92 })
        );
        crystal.position.y = 7; crystal.name = 'crystal'; g.add(crystal);
        crystal.add(glowSprite(0x00ffff, 11)); // fake bloom halo
        g.userData.crystal = crystal;

        var pl = new THREE.PointLight(0x00ffff, 1.4, 80); pl.position.set(0, 8, 0); g.add(pl);

        var label = makeLabel('🏯 MARKAS UTAMA', 'FARIS', '#00ffff');
        label.scale.set(15, 7.5, 1);
        label.position.set(0, 11.6, 0);
        g.add(label);

        scene.add(g);
        scene.userData.monument = g;
    }

    function buildAltars() {
        ALTARS.forEach(function (a, i) {
            var ang = (i / ALTARS.length) * Math.PI * 2;
            var x = Math.cos(ang) * RING_R, z = Math.sin(ang) * RING_R;
            var col = new THREE.Color(a.color);

            var g = new THREE.Group();
            g.position.set(x, 0, z);

            // glowing ground ring (trigger marker)
            var ringM = new THREE.Mesh(
                new THREE.RingGeometry(TRIGGER - 0.6, TRIGGER, 48),
                new THREE.MeshBasicMaterial({ color: a.color, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
            );
            ringM.rotation.x = -Math.PI / 2; ringM.position.y = 0.05; g.add(ringM);

            // obelisk
            var obe = new THREE.Mesh(
                new THREE.CylinderGeometry(0.6, 1.4, 7, 6),
                new THREE.MeshStandardMaterial({ color: 0x0c1426, emissive: a.color, emissiveIntensity: 0.5, metalness: 0.5, roughness: 0.4 })
            );
            obe.position.y = 3.5; g.add(obe);

            // floating shard
            var shard = new THREE.Mesh(
                new THREE.IcosahedronGeometry(1.4, 0),
                new THREE.MeshStandardMaterial({ color: a.color, emissive: a.color, emissiveIntensity: 1.0, metalness: 0.3, roughness: 0.2 })
            );
            shard.position.y = 9; g.add(shard);
            shard.add(glowSprite(a.color, 6)); // fake bloom halo

            var pl = new THREE.PointLight(a.color, 1.0, 40); pl.position.set(0, 8, 0); g.add(pl);

            var label = makeLabel(a.icon + ' ' + a.label, a.full, '#' + col.getHexString());
            label.position.set(0, 11.6, 0); g.add(label);

            // ley line to center
            var dist = Math.sqrt(x*x + z*z);
            var line = new THREE.Mesh(
                new THREE.BoxGeometry(0.25, 0.05, dist - TRIGGER - 6),
                new THREE.MeshBasicMaterial({ color: a.color, transparent: true, opacity: 0.25 })
            );
            line.position.set(x/2 * (1 - (TRIGGER+6)/dist), 0.06, z/2 * (1 - (TRIGGER+6)/dist));
            line.rotation.y = -ang + Math.PI / 2;
            scene.add(line);

            g.userData = { altar: a, shard: shard, ring: ringM, light: pl, base: a.color };
            altarMeshes.push(g);
            scene.add(g);
        });
    }

    function buildAvatar() {
        avatar = new THREE.Group();
        var body = new THREE.Mesh(
            new THREE.SphereGeometry(1.1, 24, 24),
            new THREE.MeshStandardMaterial({ color: 0x7cf7ff, emissive: 0x00ffff, emissiveIntensity: 0.9, metalness: 0.3, roughness: 0.2 })
        );
        body.position.y = 1.4; avatar.add(body);
        body.add(glowSprite(0x00ffff, 4.5)); // soft aura
        avatar.userData.body = body;

        var cone = new THREE.Mesh(
            new THREE.ConeGeometry(0.5, 1.2, 16),
            new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x66ffff, emissiveIntensity: 0.8 })
        );
        cone.rotation.x = Math.PI / 2; cone.position.set(0, 1.4, 1.0); avatar.add(cone);

        var halo = new THREE.Mesh(
            new THREE.TorusGeometry(1.5, 0.08, 8, 32),
            new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 })
        );
        halo.rotation.x = -Math.PI / 2; halo.position.y = 0.2; avatar.add(halo);
        avatar.userData.halo = halo;

        var pl = new THREE.PointLight(0x00ffff, 1.2, 24); pl.position.y = 2; avatar.add(pl);

        avatar.position.set(0, 0, RING_R - 8);
        avatar.rotation.y = Math.PI; // face the central monument
        scene.add(avatar);

        // light trail that follows the avatar
        trail = [];
        for (var i = 0; i < 14; i++) {
            var t = glowSprite(0x00ffff, 2.4 * (1 - i / 16));
            t.material.opacity = 0.5 * (1 - i / 14);
            t.position.copy(avatar.position); t.position.y = 1.2;
            trail.push(t); scene.add(t);
        }
    }

    /* ---------------- input ---------------- */
    function wireInput() {
        window.addEventListener('keydown', onKey);
        window.addEventListener('keyup', onKey);

        renderer.domElement.addEventListener('pointerdown', function (e) {
            drag.on = true; drag.lx = e.clientX; drag.ly = e.clientY;
            overlay.classList.add('w3d-dragging');
        });
        window.addEventListener('pointerup', function () {
            drag.on = false; overlay.classList.remove('w3d-dragging');
        });
        window.addEventListener('pointermove', function (e) {
            if (!drag.on) return;
            camYaw -= (e.clientX - drag.lx) * 0.005;
            camPitch += (e.clientY - drag.ly) * 0.004;
            camPitch = Math.max(0.12, Math.min(1.2, camPitch));
            drag.lx = e.clientX; drag.ly = e.clientY;
        });
        // zoom
        renderer.domElement.addEventListener('wheel', function (e) {
            camDist = Math.max(8, Math.min(26, camDist + Math.sign(e.deltaY) * 1.2));
        }, { passive: true });

        window.addEventListener('resize', onResize);
    }

    function onKey(e) {
        var down = e.type === 'keydown';
        var k = e.key.toLowerCase();
        if (k === 'escape' && down) { deactivate(); return; }
        if ((k === 'e' || k === ' ' || k === 'enter') && down) { interact(); }
        if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].indexOf(k) !== -1) {
            keys[k] = down;
            if (down) e.preventDefault();
        }
    }

    function wireJoystick(stick) {
        var knob = stick.querySelector('.w3d-stick');
        var active = false, cx = 0, cy = 0;
        function start(e) {
            active = true;
            var r = stick.getBoundingClientRect();
            cx = r.left + r.width / 2; cy = r.top + r.height / 2;
            move(e);
        }
        function move(e) {
            if (!active) return;
            var t = e.touches ? e.touches[0] : e;
            var dx = t.clientX - cx, dy = t.clientY - cy;
            var max = 40, d = Math.min(max, Math.hypot(dx, dy));
            var a = Math.atan2(dy, dx);
            var nx = Math.cos(a) * d, ny = Math.sin(a) * d;
            knob.style.transform = 'translate(' + nx + 'px,' + ny + 'px)';
            joy.x = nx / max; joy.z = ny / max;
        }
        function end() {
            active = false; joy.x = 0; joy.z = 0;
            knob.style.transform = 'translate(0,0)';
        }
        stick.addEventListener('touchstart', start, { passive: true });
        stick.addEventListener('touchmove', function (e) { move(e); }, { passive: true });
        stick.addEventListener('touchend', end);
        stick.addEventListener('pointerdown', start);
        window.addEventListener('pointermove', function (e) { if (active) move(e); });
        window.addEventListener('pointerup', end);
    }

    /* ---------------- interaction ---------------- */
    function interact() {
        if (paused) return;
        if (currentAltar) openPanel(currentAltar.userData.altar);
    }

    function openPanel(a) {
        var body = panel.querySelector('.w3d-panel-body');
        panel.querySelector('h2').textContent = a.full;
        body.innerHTML = '';
        var src = document.querySelector(a.sel);
        if (src) {
            body.appendChild(src.cloneNode(true));
        } else {
            body.innerHTML = '<p style="color:#9ab">Konten tidak ditemukan.</p>';
        }
        panel.classList.add('w3d-open');
        paused = true;
    }

    function closePanel() {
        panel.classList.remove('w3d-open');
        paused = false;
    }

    /* ---------------- loop ---------------- */
    function update(dt) {
        // input vector
        var f = (keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0) - joy.z;
        var r = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0) + joy.x;

        if (!paused && (Math.abs(f) > 0.01 || Math.abs(r) > 0.01)) {
            // camera-relative ground axes
            var fwd = new THREE.Vector3();
            fwd.subVectors(avatar.position, camera.position); fwd.y = 0; fwd.normalize();
            var right = new THREE.Vector3(-fwd.z, 0, fwd.x);
            var move = new THREE.Vector3();
            move.addScaledVector(fwd, f).addScaledVector(right, r);
            if (move.lengthSq() > 0) {
                move.normalize();
                avatar.position.addScaledVector(move, SPEED * dt);
                // keep inside the world
                var d = Math.hypot(avatar.position.x, avatar.position.z);
                if (d > WORLD_R - 2) {
                    avatar.position.x *= (WORLD_R - 2) / d;
                    avatar.position.z *= (WORLD_R - 2) / d;
                }
                avatar.rotation.y = Math.atan2(move.x, move.z);
            }
        }

        // avatar idle bob
        var t = clock.elapsedTime;
        if (avatar.userData.body) avatar.userData.body.position.y = 1.4 + Math.sin(t * 3) * 0.12;
        if (avatar.userData.halo) avatar.userData.halo.rotation.z += dt * 1.5;

        // light trail follows the avatar (chain lerp)
        if (trail.length) {
            trail[0].position.lerp(new THREE.Vector3(avatar.position.x, 1.3, avatar.position.z), 1 - Math.pow(0.0001, dt));
            for (var ti = 1; ti < trail.length; ti++) {
                trail[ti].position.lerp(trail[ti - 1].position, 1 - Math.pow(0.02, dt));
            }
        }

        // drifting ambient motes
        if (motes) {
            var arr = motes.pts.geometry.attributes.position.array;
            for (var mi = 0; mi < motes.n; mi++) {
                arr[mi*3+1] += motes.vel[mi] * dt;
                if (arr[mi*3+1] > 42) arr[mi*3+1] = 0;
            }
            motes.pts.geometry.attributes.position.needsUpdate = true;
            motes.pts.rotation.y += dt * 0.02;
        }

        // orbiting colour-cycling light
        if (orbitLight) {
            orbitLight.position.set(Math.cos(t * 0.4) * 42, 16 + Math.sin(t * 0.6) * 6, Math.sin(t * 0.4) * 42);
            orbitLight.color.setHSL((t * 0.05) % 1, 0.7, 0.55);
        }

        // camera follow
        var ox = Math.cos(camPitch) * Math.sin(camYaw) * camDist;
        var oy = Math.sin(camPitch) * camDist;
        var oz = Math.cos(camPitch) * Math.cos(camYaw) * camDist;
        var target = new THREE.Vector3(
            avatar.position.x + ox,
            avatar.position.y + oy + 2,
            avatar.position.z + oz
        );
        camera.position.lerp(target, 1 - Math.pow(0.001, dt));
        camera.lookAt(avatar.position.x, avatar.position.y + 2, avatar.position.z);

        // monument crystal spin
        var mon = scene.userData.monument;
        if (mon && mon.userData.crystal) {
            mon.userData.crystal.rotation.y += dt * 0.6;
            mon.userData.crystal.position.y = 7 + Math.sin(t * 1.5) * 0.4;
        }

        // altars: animate + proximity
        var nearest = null, nd = TRIGGER;
        altarMeshes.forEach(function (g) {
            g.userData.shard.rotation.y += dt * 1.2;
            g.userData.shard.position.y = 9 + Math.sin(t * 2 + g.position.x) * 0.3;
            var d = Math.hypot(avatar.position.x - g.position.x, avatar.position.z - g.position.z);
            var active = d < TRIGGER;
            g.userData.ring.material.opacity = active ? 0.7 : 0.32;
            g.userData.light.intensity = active ? 2.2 : 1.0;
            if (d < nd) { nd = d; nearest = g; }
        });

        if (!paused && nearest) {
            if (currentAltar !== nearest) {
                currentAltar = nearest;
                prompt.querySelector('.w3d-prompt-name').textContent =
                    currentAltar.userData.altar.icon + '  ' + currentAltar.userData.altar.full;
            }
            prompt.classList.add('w3d-show');
            if (actionBtn) actionBtn.classList.add('w3d-ready');
        } else {
            currentAltar = null;
            prompt.classList.remove('w3d-show');
            if (actionBtn) actionBtn.classList.remove('w3d-ready');
        }
    }

    function loop() {
        if (!running) return;
        requestAnimationFrame(loop);
        var dt = Math.min(clock.getDelta(), 0.05);
        update(dt);
        renderer.render(scene, camera);
    }

    function onResize() {
        if (!renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /* ---------------- activate / deactivate ---------------- */
    function activate() {
        if (!overlay) buildOverlay();
        overlay.classList.add('w3d-active');
        document.body.style.overflow = 'hidden';
        if (TOUCH) document.body.classList.add('w3d-touch');

        if (built) {
            running = true; clock.start(); loop();
            return;
        }
        loadThree(function () {
            buildScene();
            wireInput();
            built = true; running = true;
            if (loaderEl) loaderEl.style.display = 'none';
            clock.start(); loop();
        });
    }

    function deactivate() {
        running = false;
        if (overlay) overlay.classList.remove('w3d-active');
        document.body.style.overflow = '';
        closePanel();
    }

    /* ---------------- boot: wire entry button ---------------- */
    function boot() {
        var btn = document.getElementById('enter3d');
        if (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                activate();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else { boot(); }

    // public API
    window.World3D = { activate: activate, deactivate: deactivate };
})();
