// Lightweight illustrated 2.5D world. No remote models, textures, or WebGL required.
export const ringPoint = angle => ({ x: 360 + Math.cos(angle) * 184, y: 322 + Math.sin(angle) * 165 });
export function locationFor(mission) {
    if (mission.type === 'tawaf' || mission.place.includes('Maqam')) return 'Masjidil Haram';
    if (mission.type === 'sai' || mission.place === 'Marwah') return 'Shafa & Marwah';
    if (mission.type === 'rami') return 'Jamarat · Mina';
    if (mission.title.includes('Muzdalifah')) return 'Muzdalifah';
    if (mission.place.includes('Arafah')) return 'Arafah';
    if (mission.place.includes('Mina')) return 'Mina';
    return 'Miqat';
}

export default class ManasikScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.background = document.createElement('canvas');
        this.background.width = canvas.width;
        this.background.height = canvas.height;
        this.backgroundKey = '';
    }
    ellipse(x, y, rx, ry, color, stroke) {
        const c = this.ctx;
        c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        if (color) { c.fillStyle = color; c.fill(); }
        if (stroke) { c.strokeStyle = stroke; c.stroke(); }
    }
    rect(x, y, w, h, color, radius = 0) {
        const c = this.ctx;
        c.fillStyle = color; c.beginPath(); c.roundRect(x, y, w, h, radius); c.fill();
    }
    poly(points, color) {
        const c = this.ctx;
        c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
        c.closePath(); c.fillStyle = color; c.fill();
    }
    label(text, x, y, size = 12, color = '#4b6355', weight = 600) {
        const c = this.ctx;
        c.font = `${weight} ${size}px system-ui, sans-serif`;
        c.textAlign = 'center'; c.fillStyle = color; c.fillText(text, x, y);
    }
    line(points, color, width = 2, dash = []) {
        const c = this.ctx;
        c.beginPath(); c.strokeStyle = color; c.lineWidth = width; c.setLineDash(dash);
        points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
        c.stroke(); c.setLineDash([]);
    }
    block(x, y, w, d, h, color = '#e9e4cf') {
        this.poly([[x, y], [x + w, y], [x + w + 17, y + d], [x + 17, y + d]], '#183a2720');
        this.rect(x, y - h, w, d, color, 3);
        this.rect(x, y + d - h, w, h, '#c7c5ad', 2);
        this.line([[x + w, y - h], [x + w, y + d]], '#b2b59b', 2);
    }
    tree(x, y, scale = 1) {
        const c = this.ctx; c.save(); c.translate(x, y); c.scale(scale, scale);
        this.ellipse(9, 12, 22, 9, '#204d2420');
        this.rect(-3, -25, 6, 39, '#997d50', 3);
        this.ellipse(0, -32, 21, 25, '#567951');
        this.ellipse(-8, -39, 15, 19, '#7b9b66');
        this.ellipse(-9, -46, 8, 9, '#92af7c'); c.restore();
    }
    pilgrim(x, y, heading = 0, phase = 0, player = false, clothes = '#fffaf0') {
        const c = this.ctx;
        c.save(); c.translate(x, y);
        this.ellipse(4, 6, player ? 15 : 9, player ? 7 : 4, '#1d39252b');
        if (!player) c.scale(0.64, 0.64);
        if (player) { this.ellipse(0, 2, 20, 12, '#ffffff88', '#a88134'); }
        const stride = Math.sin(phase) * 3;
        this.rect(-7, -2 + stride, 5, 13, '#73634c', 3);
        this.rect(3, -2 - stride, 5, 13, '#73634c', 3);
        this.ellipse(0, -10, 11, 16, '#d8d8c9');
        this.ellipse(-2, -12, 10, 15, clothes);
        this.line([[-9, -19], [7, -5]], '#c9c9b9', 2);
        this.ellipse(-13, -8 - stride, 3, 5, '#b78a63');
        this.ellipse(12, -8 + stride, 3, 5, '#b78a63');
        this.ellipse(Math.cos(heading) * 2, -29 + Math.sin(phase) * 0.5, 7, 8, '#c19369');
        this.ellipse(Math.cos(heading) * 2 - 2, -32, 5, 4, '#775c42');
        if (player) { this.rect(-23, -59, 46, 19, '#234c3e', 7); this.label('KAMU', 0, -46, 9, '#fff9df'); }
        c.restore();
    }
    arcade() {
        this.rect(30, 84, 660, 74, '#c4c3aa', 12);
        this.rect(30, 74, 660, 65, '#efeada', 12);
        for (let i = 0; i < 17; i++) {
            this.rect(40 + i * 38, 96, 25, 43, '#788d7a', [13, 13, 0, 0]);
            this.rect(43 + i * 38, 101, 19, 38, '#a5b5a0', [10, 10, 0, 0]);
        }
        for (const x of [56, 664]) {
            this.ellipse(x + 4, 125, 21, 8, '#273f3020');
            this.rect(x - 9, 35, 18, 84, '#f7f0d7', 4);
            this.rect(x - 13, 57, 26, 6, '#c3ac70', 2);
            this.poly([[x - 10, 36], [x, 15], [x + 10, 36]], '#80967e');
        }
    }
    kabah() {
        const c = this.ctx;
        // The physical ground footprint and Hijr remain inside the tawaf ring.
        this.ellipse(365, 334, 99, 55, '#26342822');
        this.poly([[300, 258], [420, 258], [450, 354], [323, 365]], '#24352d20');
        this.rect(304, 253, 112, 106, '#242f2b', 2);
        this.rect(304, 227, 112, 96, '#303b33', 2);
        this.poly([[304, 227], [329, 207], [436, 207], [416, 227]], '#465046');
        this.poly([[416, 227], [436, 207], [436, 337], [416, 359]], '#1e2924');
        this.rect(304, 252, 112, 12, '#c5a458');
        this.poly([[416, 252], [436, 233], [436, 244], [416, 264]], '#a48542');
        for (let x = 310; x < 410; x += 14) this.rect(x, 255, 6, 5, '#e7d294', 1);
        this.rect(378, 283, 21, 36, '#b7984e', 2);
        this.rect(381, 288, 15, 27, '#d2b674', 1);
        c.beginPath(); c.ellipse(359, 236, 69, 53, 0, Math.PI, Math.PI * 2); c.strokeStyle = '#c1bba2'; c.lineWidth = 10; c.stroke();
        c.beginPath(); c.ellipse(359, 231, 69, 53, 0, Math.PI, Math.PI * 2); c.strokeStyle = '#fff8e3'; c.lineWidth = 7; c.stroke();
        this.label('HIJR', 360, 169, 9, '#7f8871');
        this.ellipse(416, 359, 5, 5, '#080e0b');
        this.label('KA’BAH', 360, 386, 12, '#46563e');
        const start = ringPoint(Math.PI / 4);
        this.line([[435, 388], [start.x + 24, start.y + 24]], '#ad8b42', 2, [5, 4]);
        this.label('HAJAR ASWAD', 562, 480, 9, '#7e692f');
    }
    mountain(x, y, scale = 1) {
        const c = this.ctx; c.save(); c.translate(x, y); c.scale(scale, scale);
        this.poly([[-70, 0], [-34, -40], [-15, -33], [4, -69], [31, -48], [65, 0]], '#afa98a');
        this.poly([[-70, 0], [-34, -40], [-15, -33], [-20, 0]], '#cbc3a2');
        this.poly([[-20, 0], [4, -69], [31, -48], [15, 0]], '#c4bb99');
        c.restore();
    }
    backgroundFor(m) {
        const c = this.ctx;
        const location = locationFor(m);
        const night = location === 'Muzdalifah';
        const gradient = c.createLinearGradient(0, 0, 720, 600);
        gradient.addColorStop(0, night ? '#637b75' : '#dfe6d2');
        gradient.addColorStop(1, night ? '#a6b09a' : '#efead7');
        this.rect(0, 0, 720, 600, gradient);
        for (let i = 0; i < 95; i++) {
            const x = (i * 139 + 21) % 720, y = (i * 79 + 37) % 600;
            this.ellipse(x, y, 1.5, 1, '#a9b79640');
        }
        if (location === 'Masjidil Haram') {
            this.arcade();
            this.ellipse(360, 333, 293, 222, '#bec4ad');
            this.ellipse(360, 325, 289, 216, '#f6f1e1');
            for (let i = 0; i < 24; i++) {
                const a = i * Math.PI / 12;
                this.line([[360 + Math.cos(a) * 95, 322 + Math.sin(a) * 87], [360 + Math.cos(a) * 281, 322 + Math.sin(a) * 205]], '#e5e2d1', 1);
            }
            for (const radius of [123, 152, 214, 249]) this.ellipse(360, 322, radius, radius * 0.9, null, '#dfdfca');
            this.kabah();
            this.block(464, 276, 20, 14, 16, '#d6b977');
            this.label('MAQAM IBRAHIM', 510, 256, 8);
            this.tree(46, 492, 1.2); this.tree(661, 477, 1.1);
        } else if (location === 'Shafa & Marwah') {
            this.arcade();
            this.rect(70, 220, 580, 234, '#c4c6b1', 35);
            this.rect(70, 205, 580, 232, '#f6f1de', 35);
            for (let y = 237; y < 435; y += 33) this.line([[91, y], [629, y]], '#e4dfca', 1);
            for (let x = 110; x < 630; x += 40) this.line([[x, 220], [x, 428]], '#e4dfca', 1);
            this.rect(163, 304, 395, 53, '#e5e8d0', 20);
            for (const x of [307, 413]) {
                this.rect(x - 7, 229, 14, 184, '#77997433', 5);
                this.rect(x - 3, 228, 6, 184, '#73a986', 3);
            }
            this.mountain(141, 303, 0.75); this.mountain(579, 303, 0.75);
            this.label('SHAFA', 143, 396, 13); this.label('MARWAH', 578, 396, 13);
            this.label('AREA PENANDA HIJAU', 360, 464, 10);
            this.tree(52, 486); this.tree(656, 487);
        } else if (m.type === 'rami') {
            this.rect(88, 193, 555, 275, '#bfc2ad', 26);
            this.rect(88, 180, 555, 270, '#eee9d7', 26);
            for (let y = 213; y < 450; y += 30) this.line([[100, y], [630, y]], '#e0dbc7', 1);
            for (let i = 0; i < 3; i++) {
                const x = 206 + i * 170;
                this.ellipse(x, 321, 53, 36, '#cbc7b2');
                this.ellipse(x, 315, 48, 30, '#e7e0ca', '#b5b79e');
                this.rect(x - 9, 245, 18, 74, '#87947c', 8);
                this.rect(x - 9, 242, 13, 70, '#a6b298', 6);
                this.label(['ULA', 'WUSTHA', 'AQABAH'][i], x, 206, 12);
            }
            this.label('JAMARAT', 360, 508, 18);
            for (let i = 0; i < 5; i++) this.tree(84 + i * 141, 552, 0.8);
        } else {
            this.line([[72, 506], [183, 455], [297, 411], [410, 381], [536, 347]], '#cbd0b9', 65);
            this.line([[72, 500], [183, 450], [297, 406], [410, 376], [536, 342]], '#eee8d1', 59);
            if (location === 'Arafah') {
                this.mountain(480, 248, 1.9); this.mountain(289, 224, 1.1);
                this.rect(484, 117, 6, 17, '#efeada', 1);
                this.label('PADANG ARAFAH', 445, 290, 16);
                this.label('Wukuf di Arafah · tidak harus mendaki bukit', 376, 532, 12);
            } else if (location === 'Mina' || night) {
                for (let i = 0; i < 10; i++) {
                    const x = 122 + (i % 5) * 108, y = 155 + Math.floor(i / 5) * 100;
                    if (night) {
                        this.rect(x, y + 20, 57, 28, '#8b9b82', 7);
                        this.rect(x + 5, y + 20, 47, 5, '#c3caaf', 2);
                        this.pilgrim(x + 27, y + 40, 0, 0, false);
                    } else {
                        this.rect(x, y, 72, 46, '#e5e2cc', 3);
                        this.poly([[x - 7, y], [x + 36, y - 41], [x + 79, y]], '#fff9e6');
                        this.poly([[x + 36, y - 41], [x + 79, y], [x + 40, y]], '#dcdac4');
                        this.rect(x + 25, y + 13, 23, 33, '#96a18b', [11, 11, 0, 0]);
                    }
                }
                this.label(location.toUpperCase(), 381, 324, 18, night ? '#f7f1d9' : '#55684e');
                if (night) { this.ellipse(608, 91, 20, 20, '#f1e4b6'); this.ellipse(615, 84, 18, 18, '#748881'); }
            } else {
                this.block(306, 186, 269, 113, 45, '#eee9d7');
                for (let i = 0; i < 5; i++) this.rect(321 + i * 49, 222, 33, 71, '#809880', [17, 17, 0, 0]);
                this.ellipse(439, 148, 65, 40, '#a3b591');
                this.rect(372, 149, 135, 21, '#dfdfc5', 3);
                this.rect(560, 99, 17, 106, '#f5efdb', 4);
                this.poly([[556, 104], [569, 80], [582, 104]], '#869e7d');
                this.label('MIQAT', 438, 326, 18);
            }
            this.tree(82, 297, 1.4); this.tree(606, 450, 1.35); this.tree(235, 553, 1.2);
        }
        // Quiet compass-like motif provides orientation without claiming geographic accuracy.
        this.ellipse(662, 529, 23, 23, '#fdf9e5aa', '#b9c2a7');
        this.poly([[662, 513], [657, 532], [662, 529], [667, 532]], '#57735d');
        this.label('JELAJAH', 662, 569, 8);
    }

    cacheBackground(m) {
        const key = `${locationFor(m)}-${m.type}`;
        if (key === this.backgroundKey) return;
        this.backgroundKey = key;
        const original = this.ctx;
        this.ctx = this.background.getContext('2d');
        this.ctx.setTransform(this.canvas.width / 720, 0, 0, this.canvas.height / 600, 0, 0);
        this.backgroundFor(m);
        this.ctx = original;
    }

    draw(game) {
        const c = this.ctx, m = game.mission;
        this.cacheBackground(m);
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.drawImage(this.background, 0, 0);
        c.setTransform(this.canvas.width / 720, 0, 0, this.canvas.height / 600, 0, 0);
        const phase = game.reduced ? 0 : game.clock / 180;
        if (m.type === 'tawaf') {
            c.lineWidth = 3; c.setLineDash([3, 9]);
            this.ellipse(360, 322, 184, 165, null, '#b4974e'); c.setLineDash([]);
            // All ambient pilgrims move in the same counter-clockwise direction.
            for (let i = 0; i < 26; i++) {
                const a = i * 2.399 - (game.reduced ? 0 : game.clock / 13000);
                const r = 220 + (i % 3) * 14;
                this.pilgrim(360 + Math.cos(a) * r, 322 + Math.sin(a) * r * 0.81, a - Math.PI / 2, phase + i, false, i % 5 ? '#fffaf0' : '#547568');
            }
            const progressAngle = Math.PI / 4 - ((game.count % 4) + (game.motion ? game.motion.units * Math.min(1, game.motion.elapsed / game.motion.duration) : 0)) * Math.PI / 2;
            c.beginPath(); c.ellipse(360, 322, 184, 165, 0, Math.PI / 4, progressAngle, true); c.strokeStyle = '#8e7135'; c.lineWidth = 5; c.stroke();
            for (const a of [-1.5, 0, 1.5, 3]) {
                const p = ringPoint(a); c.save(); c.translate(p.x, p.y); c.rotate(a - Math.PI / 2);
                this.poly([[7, 0], [-5, -5], [-3, 0], [-5, 5]], '#9f803d'); c.restore();
            }
        } else if (m.type === 'sai') {
            this.line([[142, 332], [578, 332]], '#b4974e', 3, [4, 8]);
            for (let i = 0; i < 14; i++) {
                const x = 173 + ((i * 47 + (game.reduced ? 0 : game.clock / 65)) % 370);
                this.pilgrim(x, i % 2 ? 398 : 264, 0, phase + i, false, i % 6 ? '#fffaf0' : '#6a8063');
            }
        } else if (m.type !== 'rami') {
            this.line([[130, 472], [494, 352]], '#ad914d', 3, [3, 9]);
            for (let i = 0; i < 8; i++) this.pilgrim(169 + i * 42, 365 + Math.sin(i) * 18, 0, phase + i, false);
        }
        if (game.target) {
            const p = game.target;
            const pulse = game.reduced || !game.running ? 0 : Math.sin(phase * 0.6) * 4;
            this.ellipse(p.x, p.y, 23 + pulse, 14 + pulse / 2, '#c4a15328', '#b9974b');
            this.ellipse(p.x, p.y, 11, 7, '#c3a253');
            this.poly([[p.x, p.y - 14], [p.x - 5, p.y - 22], [p.x + 5, p.y - 22]], '#9d7d33');
        }
        this.pilgrim(game.player.x, game.player.y, game.heading, game.motion && game.running ? phase : 0, true);
        if (m.type === 'rami' && game.motion) {
            const k = Math.min(1, game.motion.elapsed / game.motion.duration);
            const x = game.player.x + (game.target.x - game.player.x) * k;
            const y = game.player.y - 17 + (game.target.y - game.player.y + 17) * k - Math.sin(k * Math.PI) * 69;
            this.ellipse(x + 2, game.player.y + (game.target.y - game.player.y) * k, 4, 2, '#172b251c');
            this.ellipse(x, y, 4, 4, '#746651');
        }
    }
}
