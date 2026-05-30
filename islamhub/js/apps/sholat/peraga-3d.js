// ===== Peraga 3D Sholat =====
// Visualisasi 3D urutan gerakan sholat menggunakan Three.js
//
// Konvensi orientasi:
// - Karakter menghadap arah -Z (= arah Kiblat)
// - Sumbu +Y ke atas, lantai pada y = 0
// - "Membungkuk ke depan" = torso.rotation.x NEGATIF
// - "Menoleh ke kanan" = head.rotation.y NEGATIF (kanan = +X)

// ----- Anatomi (semua nilai dipakai oleh applyPose) -----
// Tinggi hip = legHipOffset(0.05) + upperLeg(0.55) + lowerLeg(0.45) + footHeight(0.08) = 1.13
const ANATOMY = {
    upperLegLen: 0.55,
    lowerLegLen: 0.45,
    footHeight: 0.08,
    legHipOffset: 0.05,
    standHipY: 1.13,    // hip saat berdiri (telapak kaki tepat di y=0)
    kneelHipY: 0.45,    // hip saat duduk iftirasy / di atas tumit
    sujudHipY: 0.45,    // sama dengan kneel; torso yang membungkuk ke depan
};

// ----- Pose state machine -----
// Setiap entri menentukan keadaan tubuh secara eksplisit (state-based)
// daripada angka rotasi mentah, supaya konsisten & mudah dirawat.
const POSES = [
    {
        id: 'takbiratul_ihram',
        name: 'Takbiratul Ihram',
        ruling: 'Rukun ke-1',
        arabic: 'اللَّهُ أَكْبَرُ',
        latin: 'Allahu Akbar',
        translation: 'Allah Maha Besar',
        tip: 'Angkat kedua tangan setinggi telinga sambil mengucapkan takbir.',
        duration: 3000,
        body: 'stand',
        arms: 'takbir',
        head: { tilt: 0, turn: 0 }
    },
    {
        id: 'qiyam',
        name: 'Berdiri (Qiyam) — Membaca Al-Fatihah',
        ruling: 'Rukun ke-2 & ke-3',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        latin: 'Bismillahirrahmanirrahim',
        translation: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang',
        tip: 'Berdiri tegak, tangan kanan di atas tangan kiri pada dada/perut, pandangan ke tempat sujud.',
        duration: 4000,
        body: 'stand',
        arms: 'crossed',
        head: { tilt: 0.25, turn: 0 }
    },
    {
        id: 'ruku',
        name: "Ruku' dengan Tuma'ninah",
        ruling: 'Rukun ke-4',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        latin: "Subhana Rabbiyal 'Adzim",
        translation: 'Maha Suci Tuhanku Yang Maha Agung',
        tip: 'Membungkuk hingga punggung lurus sejajar, kedua tangan memegang lutut.',
        duration: 3500,
        body: 'ruku',
        arms: 'knees',
        head: { tilt: 0.0, turn: 0 }
    },
    {
        id: 'iktidal',
        name: "I'tidal dengan Tuma'ninah",
        ruling: 'Rukun ke-5',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ، رَبَّنَا وَلَكَ الْحَمْدُ',
        latin: "Sami'allahu liman hamidah, Rabbana wa lakal hamd",
        translation: 'Allah mendengar siapa yang memuji-Nya. Wahai Tuhan kami, segala puji bagi-Mu',
        tip: 'Bangkit dari ruku dan berdiri tegak kembali dengan tenang.',
        duration: 3000,
        body: 'stand',
        arms: 'down',
        head: { tilt: 0.1, turn: 0 }
    },
    {
        id: 'sujud_1',
        name: "Sujud Pertama dengan Tuma'ninah",
        ruling: 'Rukun ke-6',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        latin: "Subhana Rabbiyal A'la",
        translation: 'Maha Suci Tuhanku Yang Maha Tinggi',
        tip: 'Tujuh anggota sujud menyentuh lantai: dahi & hidung, kedua tangan, kedua lutut, kedua jari kaki.',
        duration: 3500,
        body: 'sujud',
        arms: 'sujud',
        head: { tilt: 0, turn: 0 }
    },
    {
        id: 'duduk_diantara',
        name: 'Duduk Antara Dua Sujud',
        ruling: 'Rukun ke-7',
        arabic: 'رَبِّ اغْفِرْ لِي ، رَبِّ اغْفِرْ لِي',
        latin: 'Rabbighfirli, Rabbighfirli',
        translation: 'Wahai Tuhanku, ampunilah aku',
        tip: 'Duduk iftirasy: telapak kaki kiri dijadikan alas, telapak kaki kanan ditegakkan.',
        duration: 3000,
        body: 'sit',
        arms: 'thighs',
        head: { tilt: 0.15, turn: 0 }
    },
    {
        id: 'sujud_2',
        name: "Sujud Kedua dengan Tuma'ninah",
        ruling: 'Rukun ke-8',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        latin: "Subhana Rabbiyal A'la",
        translation: 'Maha Suci Tuhanku Yang Maha Tinggi',
        tip: "Sujud kedua sebagaimana sujud pertama dengan tuma'ninah.",
        duration: 3500,
        body: 'sujud',
        arms: 'sujud',
        head: { tilt: 0, turn: 0 }
    },
    {
        id: 'duduk_tasyahud',
        name: 'Duduk Akhir untuk Tasyahud',
        ruling: 'Rukun ke-9',
        arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ',
        latin: 'At-tahiyyatu lillahi wash-shalawatu wath-thayyibat',
        translation: 'Segala penghormatan, ibadah, dan kebaikan hanya milik Allah',
        tip: 'Duduk tawarruk: kaki kiri dimasukkan ke bawah betis kanan, telunjuk kanan diisyaratkan.',
        duration: 4500,
        body: 'sit',
        arms: 'tasyahud',
        head: { tilt: 0.15, turn: 0 }
    },
    {
        id: 'sholawat',
        name: 'Membaca Sholawat atas Nabi',
        ruling: 'Rukun ke-11',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        latin: "Allahumma shalli 'ala Muhammad wa 'ala ali Muhammad",
        translation: 'Ya Allah berikanlah rahmat kepada Muhammad dan keluarga Muhammad',
        tip: 'Diucapkan saat duduk tasyahud akhir setelah membaca tasyahud.',
        duration: 4000,
        body: 'sit',
        arms: 'tasyahud',
        head: { tilt: 0.15, turn: 0 }
    },
    {
        id: 'salam_kanan',
        name: 'Salam ke Kanan',
        ruling: 'Rukun ke-12',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        latin: "Assalamu'alaikum warahmatullah",
        translation: 'Semoga keselamatan dan rahmat Allah tercurah atasmu',
        tip: 'Menoleh ke arah kanan hingga pipi terlihat dari belakang.',
        duration: 3000,
        body: 'sit',
        arms: 'tasyahud',
        head: { tilt: 0.05, turn: -1.0 }
    },
    {
        id: 'salam_kiri',
        name: 'Salam ke Kiri',
        ruling: 'Penyempurna',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        latin: "Assalamu'alaikum warahmatullah",
        translation: 'Semoga keselamatan dan rahmat Allah tercurah atasmu',
        tip: 'Menoleh ke arah kiri hingga pipi terlihat dari belakang. Sholat selesai.',
        duration: 3000,
        body: 'sit',
        arms: 'tasyahud',
        head: { tilt: 0.05, turn: 1.0 }
    }
];

// ----- Resolve a pose entry into numerical bone targets -----
// Convention summary:
//   - shoulder.rotation order (XYZ Euler): R = R_z * R_y * R_x
//   - For LEFT arm:  positive shoulderZ tilts arm INWARD when shoulderX < 0,
//                    OUTWARD when shoulderX > 0. Use elbowZ for forearm flex
//                    around world Z axis (lateral abduction at elbow).
//   - For sedekap forearms to flex FORWARD (toward kiblat -Z), use POSITIVE
//                    elbowX (not negative — that flips backward).
function resolvePose(pose) {
    const A = ANATOMY;
    const PI = Math.PI;
    const t = {
        hipY: A.standHipY,
        torsoX: 0,
        legHipX: 0,
        legKneeX: 0,
        armL: { shoulderX: 0, shoulderY: 0, shoulderZ: 0.05, elbowX: 0, elbowZ: 0 },
        armR: { shoulderX: 0, shoulderY: 0, shoulderZ: -0.05, elbowX: 0, elbowZ: 0 },
        headX: pose.head?.tilt || 0,
        headY: pose.head?.turn || 0
    };

    switch (pose.body) {
        case 'stand':
            t.hipY = A.standHipY;
            break;
        case 'ruku':
            // Back bowed toward horizontal. Because the hips don't translate
            // backward in this rig, a fully-straight leg would push the
            // shoulders well in front of the knees and the hands could never
            // reach them. A small forward knee bend (legHipX) with vertical
            // shins (legKneeX = -legHipX, feet stay under the body) brings the
            // knees within reach so the hands rest on them — the iconic ruku.
            t.hipY = A.standHipY;
            t.torsoX = -1.35;
            t.legHipX = 0.50;
            t.legKneeX = -0.50;
            break;
        case 'sit':
            // Iftirasy: knees + shins resting flat on the floor, seated back on
            // the heels. Thighs slope down-forward to the knees (legHipX) and
            // the calves fold back flat (legKneeX). Tuned so knee & foot sit at
            // y≈0 instead of floating above an invisible chair.
            t.hipY = 0.48;
            t.legHipX = 0.95;
            t.legKneeX = -2.5;
            break;
        case 'sujud':
            // Kneeling with the forehead on the mat. Hips raised above the
            // heels (hipY higher than sitting) so the shoulders stay high
            // enough for the hands to reach the floor beside the head without
            // clipping through it. Torso folds forward and the chin tucks
            // (headX) so the forehead actually touches the mat.
            t.hipY = 0.60;
            t.legHipX = 0.65;
            t.legKneeX = -2.4;
            t.torsoX = -1.70;
            t.headX = -0.30;
            break;
    }

    switch (pose.arms) {
        case 'takbir': {
            // Upper arm horizontal-outward (shoulderZ ≈ ±π/2 abduction),
            // forearm vertical UP via elbowZ ≈ ∓π/2 (mirror of shoulderZ
            // so both bring forearm direction in the world XY plane to (0, 1, 0)).
            // Result: hands ar at ear level, palms forward toward Kiblat.
            // Slight reduction below π/2 keeps arms a bit forward of the body.
            const SZ = 1.45;
            const EZ = 1.45;
            t.armL = { shoulderX: 0,  shoulderY: 0, shoulderZ: -SZ, elbowX: 0, elbowZ: -EZ };
            t.armR = { shoulderX: 0,  shoulderY: 0, shoulderZ:  SZ, elbowX: 0, elbowZ:  EZ };
            break;
        }
        case 'crossed':
            // Sedekap: hands fold at center of body in front of belly/chest.
            // Upper arms hang slightly inward (shoulderZ small), forearms flex
            // FORWARD (elbowX positive) and slightly INWARD (elbowZ small mirror).
            t.armL = { shoulderX: 0.10, shoulderY: 0, shoulderZ:  0.55, elbowX: 1.55, elbowZ: 0 };
            t.armR = { shoulderX: 0.10, shoulderY: 0, shoulderZ: -0.55, elbowX: 1.55, elbowZ: 0 };
            break;
        case 'down':
            // I'tidal — arms hang naturally at sides
            t.armL = { shoulderX: 0, shoulderY: 0, shoulderZ:  0.10, elbowX: 0, elbowZ: 0 };
            t.armR = { shoulderX: 0, shoulderY: 0, shoulderZ: -0.10, elbowX: 0, elbowZ: 0 };
            break;
        case 'knees':
            // Ruku grip on knees. With the back bowed ~78° and a small forward
            // knee bend, the hands reach down-and-slightly-back onto the knees.
            t.armL = { shoulderX: 0.95, shoulderY: 0, shoulderZ:  0.10, elbowX: -0.10, elbowZ: 0 };
            t.armR = { shoulderX: 0.95, shoulderY: 0, shoulderZ: -0.10, elbowX: -0.10, elbowZ: 0 };
            break;
        case 'sujud':
            // Upper arm hangs straight down in world (shoulderX cancels the
            // torso tilt), then a strong forearm flex (elbowX) lays the hands
            // flat on the mat beside the head, fingers toward kiblat.
            t.armL = { shoulderX: 1.55, shoulderY: 0, shoulderZ:  0.12, elbowX: 1.80, elbowZ: 0 };
            t.armR = { shoulderX: 1.55, shoulderY: 0, shoulderZ: -0.12, elbowX: 1.80, elbowZ: 0 };
            break;
        case 'thighs':
            // Sitting hands resting on the thighs/knees.
            t.armL = { shoulderX: 0.45, shoulderY: 0, shoulderZ:  0.15, elbowX: 0.35, elbowZ: 0 };
            t.armR = { shoulderX: 0.45, shoulderY: 0, shoulderZ: -0.15, elbowX: 0.35, elbowZ: 0 };
            break;
        case 'tasyahud':
            // Hands on the thighs; right hand slightly more flexed (telunjuk isyarat).
            t.armL = { shoulderX: 0.45, shoulderY: 0, shoulderZ:  0.15, elbowX: 0.35, elbowZ: 0 };
            t.armR = { shoulderX: 0.50, shoulderY: 0, shoulderZ: -0.15, elbowX: 0.30, elbowZ: 0 };
            break;
    }

    return t;
}

export default class Peraga3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.character = null;
        this.parts = {};
        this.currentStep = 0;
        this.isPlaying = false;
        this.autoRotate = true;
        this.playTimer = null;
        this.transitionStart = 0;
        this.transitionDuration = 800;
        this.fromTargets = null;
        this.toTargets = null;
        this.currentTargets = resolvePose(POSES[0]);
        this.cameraAngle = Math.PI * 0.85; // start looking from kiblat side, character faces camera-ish
        this.dragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.cameraPitch = 0.18;
        this.cameraRadius = 6;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        if (typeof THREE === 'undefined') {
            console.error('Three.js belum dimuat');
            return;
        }

        const canvas = document.getElementById('peragaCanvas');
        if (!canvas) return;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = null;
        this.scene.fog = new THREE.Fog(0x0a0e27, 8, 22);

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        this.updateCamera();

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lights
        const ambient = new THREE.AmbientLight(0x88aaff, 0.45);
        this.scene.add(ambient);

        const keyLight = new THREE.DirectionalLight(0x00ffff, 0.85);
        keyLight.position.set(5, 8, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 25;
        keyLight.shadow.camera.left = -5;
        keyLight.shadow.camera.right = 5;
        keyLight.shadow.camera.top = 5;
        keyLight.shadow.camera.bottom = -5;
        this.scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xff00ff, 0.45);
        fillLight.position.set(-5, 4, -3);
        this.scene.add(fillLight);

        const rimLight = new THREE.PointLight(0x00ffff, 0.7, 18);
        rimLight.position.set(0, 4, -5);
        this.scene.add(rimLight);

        // World
        this.createFloor();
        this.createPlatform();
        this.createKiblatMarker();
        this.createCharacter();

        // Apply initial pose
        this.applyTargets(this.currentTargets);

        // Resize
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());

        // Drag
        this.setupInteraction(canvas);

        this.initialized = true;
        this.animate();
    }

    createFloor() {
        // Sajadah (prayer mat) menghadap arah Kiblat (-Z).
        // Mihrab arch digambar di sisi yang akan jatuh di -Z setelah rotasi.
        const matCanvas = document.createElement('canvas');
        matCanvas.width = 256;
        matCanvas.height = 512;
        const ctx = matCanvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#1a1f3a');
        grad.addColorStop(0.5, '#2a1a4a');
        grad.addColorStop(1, '#0a0e27');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 512);

        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 6;
        ctx.strokeRect(8, 8, 240, 496);

        ctx.strokeStyle = 'rgba(255, 0, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, 216, 472);

        // Mihrab arch (top of canvas — will be at -Z direction = kiblat front)
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(60, 90);
        ctx.lineTo(60, 60);
        ctx.quadraticCurveTo(128, 20, 196, 60);
        ctx.lineTo(196, 90);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        for (let y = 120; y < 480; y += 40) {
            for (let x = 40; x < 220; x += 40) {
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const matTexture = new THREE.CanvasTexture(matCanvas);
        const matGeo = new THREE.PlaneGeometry(1.5, 3.4);
        const matMat = new THREE.MeshStandardMaterial({
            map: matTexture,
            roughness: 0.7,
            metalness: 0.2,
            emissive: 0x110022,
            emissiveIntensity: 0.2
        });
        // After rotation.x = -π/2, plane's "+Y" (top of canvas) maps to -Z.
        // We want canvas-top (mihrab arch) at -Z (front/kiblat). ✓
        // The figure's footprint runs from z≈+0.25 (seated/standing, back of mat)
        // to z≈-1.35 (ruku/sujud forehead reaching forward). Centre the mat on
        // that span (≈ -0.55) and size it (1.5 × 3.4) so the body sits ON the mat
        // with a margin in front toward the kiblat — not floating beside it.
        this.sajadah = new THREE.Mesh(matGeo, matMat);
        this.sajadah.rotation.x = -Math.PI / 2;
        this.sajadah.position.set(0, 0.01, -0.55);
        this.sajadah.receiveShadow = true;
        this.scene.add(this.sajadah);
    }

    createPlatform() {
        const geo = new THREE.CircleGeometry(4, 64);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x0a0e27,
            roughness: 0.9,
            metalness: 0.3,
            transparent: true,
            opacity: 0.7
        });
        const platform = new THREE.Mesh(geo, mat);
        platform.rotation.x = -Math.PI / 2;
        platform.receiveShadow = true;
        this.scene.add(platform);

        const ringGeo = new THREE.RingGeometry(3.6, 3.9, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.005;
        this.scene.add(ring);
        this.glowRing = ring;
    }

    createKiblatMarker() {
        const group = new THREE.Group();

        const coneGeo = new THREE.ConeGeometry(0.18, 0.5, 16);
        const coneMat = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.6
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        // Rotate cone tip to point in -Z direction (away from character, toward kiblat).
        cone.rotation.x = -Math.PI / 2;
        cone.position.set(0, 0.25, -2.8);
        group.add(cone);

        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 256;
        labelCanvas.height = 64;
        const lctx = labelCanvas.getContext('2d');
        lctx.fillStyle = 'rgba(255, 0, 255, 0.95)';
        lctx.font = 'bold 32px Orbitron, sans-serif';
        lctx.textAlign = 'center';
        lctx.textBaseline = 'middle';
        lctx.fillText('▲ KIBLAT', 128, 32);
        const labelTex = new THREE.CanvasTexture(labelCanvas);
        const labelMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true });
        const label = new THREE.Sprite(labelMat);
        label.position.set(0, 0.7, -2.8);
        label.scale.set(1.6, 0.4, 1);
        group.add(label);

        this.scene.add(group);
        this.kiblatMarker = group;
    }

    createCharacter() {
        const character = new THREE.Group();

        // ----- Materials -----
        const skinMat = new THREE.MeshStandardMaterial({
            color: 0xeac8a3, roughness: 0.55, metalness: 0.0
        });
        const robeMat = new THREE.MeshStandardMaterial({
            color: 0x16223d, roughness: 0.45, metalness: 0.25,
            emissive: 0x001133, emissiveIntensity: 0.25
        });
        const robeAccent = new THREE.MeshStandardMaterial({
            color: 0x00d4ff, roughness: 0.3, metalness: 0.6,
            emissive: 0x00aaaa, emissiveIntensity: 0.45
        });
        const peciMat = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a, roughness: 0.3, metalness: 0.4,
            emissive: 0x222244, emissiveIntensity: 0.25
        });
        const peciTrim = new THREE.MeshStandardMaterial({
            color: 0xffd700, roughness: 0.3, metalness: 0.8,
            emissive: 0xaa8800, emissiveIntensity: 0.4
        });
        const beardMat = new THREE.MeshStandardMaterial({
            color: 0x222222, roughness: 0.9
        });

        // ===== Hip pivot (root) =====
        const hipGroup = new THREE.Group();
        hipGroup.position.y = ANATOMY.standHipY;
        character.add(hipGroup);

        // Hip joint (sphere) for smooth connection
        const hipJoint = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 20, 16),
            robeMat
        );
        hipJoint.castShadow = true;
        hipGroup.add(hipJoint);

        // ===== Torso group (pivots at hip) =====
        const torsoGroup = new THREE.Group();
        hipGroup.add(torsoGroup);

        // Tapered torso (cylinder, slightly smaller at top)
        const torsoMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.32, 0.40, 1.0, 24, 1),
            robeMat
        );
        torsoMesh.position.y = 0.5;
        torsoMesh.castShadow = true;
        torsoGroup.add(torsoMesh);

        // Robe collar accent (torus)
        const collar = new THREE.Mesh(
            new THREE.TorusGeometry(0.30, 0.04, 12, 32),
            robeAccent
        );
        collar.rotation.x = Math.PI / 2;
        collar.position.y = 0.95;
        torsoGroup.add(collar);

        // Vertical accent stripe down robe
        const stripe = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.85, 0.02),
            robeAccent
        );
        stripe.position.set(0, 0.5, -0.36);
        torsoGroup.add(stripe);

        // ===== Head group =====
        const headGroup = new THREE.Group();
        headGroup.position.y = 1.0;
        torsoGroup.add(headGroup);

        // Neck
        const neck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.10, 0.13, 0.12, 16),
            skinMat
        );
        neck.position.y = 0.06;
        neck.castShadow = true;
        headGroup.add(neck);

        // Head — slightly squashed sphere (egg shape)
        const headMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 24, 20),
            skinMat
        );
        headMesh.scale.set(1.0, 1.10, 0.95);
        headMesh.position.y = 0.30;
        headMesh.castShadow = true;
        headGroup.add(headMesh);

        // Peci (kopiah) — cylinder + dome on top
        const peciBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.21, 0.23, 0.18, 24),
            peciMat
        );
        peciBase.position.y = 0.55;
        peciBase.castShadow = true;
        headGroup.add(peciBase);

        const peciDome = new THREE.Mesh(
            new THREE.SphereGeometry(0.21, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
            peciMat
        );
        peciDome.position.y = 0.64;
        peciDome.castShadow = true;
        headGroup.add(peciDome);

        // Peci trim (gold band at base)
        const peciTrimRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.225, 0.012, 8, 32),
            peciTrim
        );
        peciTrimRing.rotation.x = Math.PI / 2;
        peciTrimRing.position.y = 0.46;
        headGroup.add(peciTrimRing);

        // Beard (small box on chin) — at -Z because character faces -Z
        const beard = new THREE.Mesh(
            new THREE.SphereGeometry(0.10, 16, 12),
            beardMat
        );
        beard.scale.set(1.4, 0.6, 0.5);
        beard.position.set(0, 0.20, -0.18);
        headGroup.add(beard);

        // Eyes (glow, on -Z side because face is -Z)
        const eyeGeo = new THREE.SphereGeometry(0.025, 10, 10);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.08, 0.34, -0.20);
        headGroup.add(eyeL);
        const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
        eyeR.position.set(0.08, 0.34, -0.20);
        headGroup.add(eyeR);

        // ===== Arms =====
        // Left side = +X (robust convention; "kanan-kiri" pas dilihat dari belakang)
        const armRig = (sideX) => {
            const shoulder = new THREE.Group();
            shoulder.position.set(sideX, 0.85, 0);
            torsoGroup.add(shoulder);

            // Shoulder joint sphere
            const shoulderBall = new THREE.Mesh(
                new THREE.SphereGeometry(0.13, 16, 12),
                robeMat
            );
            shoulderBall.castShadow = true;
            shoulder.add(shoulderBall);

            // Upper arm (cylinder)
            const upperArm = new THREE.Mesh(
                new THREE.CylinderGeometry(0.09, 0.08, 0.50, 16),
                robeMat
            );
            upperArm.position.y = -0.27;
            upperArm.castShadow = true;
            shoulder.add(upperArm);

            // Elbow group at end of upper arm
            const elbow = new THREE.Group();
            elbow.position.y = -0.52;
            shoulder.add(elbow);

            // Elbow joint sphere
            const elbowBall = new THREE.Mesh(
                new THREE.SphereGeometry(0.085, 14, 10),
                robeMat
            );
            elbow.add(elbowBall);

            // Forearm (cylinder, sleeve to skin)
            const lowerArm = new THREE.Mesh(
                new THREE.CylinderGeometry(0.075, 0.07, 0.40, 16),
                robeMat
            );
            lowerArm.position.y = -0.23;
            lowerArm.castShadow = true;
            elbow.add(lowerArm);

            // Hand (slightly squashed sphere)
            const hand = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 14, 10),
                skinMat
            );
            hand.scale.set(0.9, 1.2, 0.7);
            hand.position.y = -0.50;
            hand.castShadow = true;
            elbow.add(hand);

            return { shoulder, elbow };
        };

        const armL = armRig(-0.42); // left side (+character left, -X world if looking from kiblat)
        const armR = armRig(0.42);

        // ===== Legs =====
        const legRig = (sideX) => {
            const hip = new THREE.Group();
            hip.position.set(sideX, -ANATOMY.legHipOffset, 0);
            hipGroup.add(hip);

            // Hip joint
            const hipBall = new THREE.Mesh(
                new THREE.SphereGeometry(0.13, 16, 12),
                robeMat
            );
            hip.add(hipBall);

            // Upper leg
            const upperLeg = new THREE.Mesh(
                new THREE.CylinderGeometry(0.13, 0.11, ANATOMY.upperLegLen, 18),
                robeMat
            );
            upperLeg.position.y = -ANATOMY.upperLegLen / 2;
            upperLeg.castShadow = true;
            hip.add(upperLeg);

            // Knee group
            const knee = new THREE.Group();
            knee.position.y = -ANATOMY.upperLegLen;
            hip.add(knee);

            const kneeBall = new THREE.Mesh(
                new THREE.SphereGeometry(0.105, 14, 10),
                robeMat
            );
            knee.add(kneeBall);

            // Lower leg
            const lowerLeg = new THREE.Mesh(
                new THREE.CylinderGeometry(0.10, 0.08, ANATOMY.lowerLegLen, 16),
                robeMat
            );
            lowerLeg.position.y = -ANATOMY.lowerLegLen / 2;
            lowerLeg.castShadow = true;
            knee.add(lowerLeg);

            // Ankle/foot — point forward (-Z)
            const foot = new THREE.Mesh(
                new THREE.BoxGeometry(0.18, ANATOMY.footHeight, 0.32),
                skinMat
            );
            foot.position.set(0, -ANATOMY.lowerLegLen - ANATOMY.footHeight / 2, -0.07);
            foot.castShadow = true;
            knee.add(foot);

            return { hip, knee };
        };

        const legL = legRig(-0.18);
        const legR = legRig(0.18);

        this.parts = {
            character,
            hip: hipGroup,
            torso: torsoGroup,
            head: headGroup,
            armLShoulder: armL.shoulder, armLElbow: armL.elbow,
            armRShoulder: armR.shoulder, armRElbow: armR.elbow,
            legLHip: legL.hip, legLKnee: legL.knee,
            legRHip: legR.hip, legRKnee: legR.knee
        };

        this.scene.add(character);
        this.character = character;
    }

    applyTargets(t) {
        const p = this.parts;
        if (!p.hip) return;

        p.hip.position.y = t.hipY;
        p.torso.rotation.set(t.torsoX, 0, 0);
        p.head.rotation.set(t.headX, t.headY, 0);

        p.legLHip.rotation.set(t.legHipX, 0, 0);
        p.legRHip.rotation.set(t.legHipX, 0, 0);
        p.legLKnee.rotation.set(t.legKneeX, 0, 0);
        p.legRKnee.rotation.set(t.legKneeX, 0, 0);

        p.armLShoulder.rotation.set(t.armL.shoulderX, t.armL.shoulderY || 0, t.armL.shoulderZ);
        p.armRShoulder.rotation.set(t.armR.shoulderX, t.armR.shoulderY || 0, t.armR.shoulderZ);
        // Elbow uses both X (flex) and Z (lateral abduction at elbow joint)
        p.armLElbow.rotation.set(t.armL.elbowX, 0, t.armL.elbowZ || 0);
        p.armRElbow.rotation.set(t.armR.elbowX, 0, t.armR.elbowZ || 0);

        this.currentTargets = JSON.parse(JSON.stringify(t));
    }

    interpolateTargets(from, to, t) {
        const lerp = (a, b, t) => a + (b - a) * t;
        const ease = t * t * (3 - 2 * t);

        const lerpArm = (af, at) => ({
            shoulderX: lerp(af.shoulderX || 0, at.shoulderX || 0, ease),
            shoulderY: lerp(af.shoulderY || 0, at.shoulderY || 0, ease),
            shoulderZ: lerp(af.shoulderZ || 0, at.shoulderZ || 0, ease),
            elbowX:    lerp(af.elbowX    || 0, at.elbowX    || 0, ease),
            elbowZ:    lerp(af.elbowZ    || 0, at.elbowZ    || 0, ease),
        });

        const out = {
            hipY: lerp(from.hipY, to.hipY, ease),
            torsoX: lerp(from.torsoX, to.torsoX, ease),
            legHipX: lerp(from.legHipX, to.legHipX, ease),
            legKneeX: lerp(from.legKneeX, to.legKneeX, ease),
            headX: lerp(from.headX, to.headX, ease),
            headY: lerp(from.headY, to.headY, ease),
            armL: lerpArm(from.armL, to.armL),
            armR: lerpArm(from.armR, to.armR),
        };
        this.applyTargets(out);
    }

    setStep(index, animate = true) {
        const safeIdx = Math.max(0, Math.min(POSES.length - 1, index));
        const oldIndex = this.currentStep;
        this.currentStep = safeIdx;

        if (animate && oldIndex !== safeIdx) {
            this.fromTargets = JSON.parse(JSON.stringify(this.currentTargets));
            this.toTargets = resolvePose(POSES[safeIdx]);
            this.transitionStart = performance.now();
        } else {
            this.applyTargets(resolvePose(POSES[safeIdx]));
            this.fromTargets = null;
            this.toTargets = null;
        }

        this.updateUI();
    }

    nextStep() {
        if (this.currentStep < POSES.length - 1) this.setStep(this.currentStep + 1);
        else this.setStep(0);
    }
    prevStep() {
        if (this.currentStep > 0) this.setStep(this.currentStep - 1);
    }

    play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.updatePlayButton();
        this.queueNext();
    }
    pause() {
        this.isPlaying = false;
        clearTimeout(this.playTimer);
        this.updatePlayButton();
    }
    queueNext() {
        if (!this.isPlaying) return;
        const dur = POSES[this.currentStep].duration || 3000;
        clearTimeout(this.playTimer);
        this.playTimer = setTimeout(() => {
            if (this.currentStep >= POSES.length - 1) {
                this.pause();
                return;
            }
            this.nextStep();
            this.queueNext();
        }, dur);
    }
    reset() {
        this.pause();
        this.setStep(0);
        this.cameraAngle = Math.PI * 0.85;
        this.cameraPitch = 0.18;
        this.cameraRadius = 6;
    }
    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        const btn = document.getElementById('peragaRotateBtn');
        if (btn) btn.classList.toggle('active', this.autoRotate);
    }

    updateCamera() {
        if (!this.camera) return;
        const x = Math.sin(this.cameraAngle) * this.cameraRadius * Math.cos(this.cameraPitch);
        const y = 1.2 + Math.sin(this.cameraPitch) * this.cameraRadius;
        const z = Math.cos(this.cameraAngle) * this.cameraRadius * Math.cos(this.cameraPitch);
        this.camera.position.set(x, y, z);
        this.camera.lookAt(0, 0.7, -0.4);
    }

    handleResize() {
        const canvas = this.renderer.domElement;
        const parent = canvas.parentElement;
        if (!parent) return;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    setupInteraction(canvas) {
        const onDown = (x, y) => {
            this.dragging = true;
            this.lastX = x;
            this.lastY = y;
            this.autoRotate = false;
            const btn = document.getElementById('peragaRotateBtn');
            if (btn) btn.classList.remove('active');
        };
        const onMove = (x, y) => {
            if (!this.dragging) return;
            const dx = x - this.lastX;
            const dy = y - this.lastY;
            this.cameraAngle -= dx * 0.01;
            this.cameraPitch = Math.max(-0.4, Math.min(0.8, this.cameraPitch + dy * 0.005));
            this.lastX = x;
            this.lastY = y;
        };
        const onUp = () => { this.dragging = false; };

        canvas.addEventListener('mousedown', e => onDown(e.clientX, e.clientY));
        window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', onUp);
        canvas.addEventListener('touchstart', e => {
            if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        canvas.addEventListener('touchmove', e => {
            if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        canvas.addEventListener('touchend', onUp);
        canvas.addEventListener('wheel', e => {
            e.preventDefault();
            this.cameraRadius = Math.max(3, Math.min(12, this.cameraRadius + e.deltaY * 0.005));
        }, { passive: false });
    }

    updateUI() {
        const pose = POSES[this.currentStep];
        const $ = (id) => document.getElementById(id);
        if ($('peragaStepNum')) $('peragaStepNum').textContent = this.currentStep + 1;
        if ($('peragaStepTotal')) $('peragaStepTotal').textContent = POSES.length;
        if ($('peragaPoseName')) $('peragaPoseName').textContent = pose.name;
        if ($('peragaBacaanName')) $('peragaBacaanName').textContent = pose.name;
        if ($('peragaBacaanRuling')) $('peragaBacaanRuling').textContent = pose.ruling;
        if ($('peragaBacaanArabic')) $('peragaBacaanArabic').textContent = pose.arabic;
        if ($('peragaBacaanLatin')) $('peragaBacaanLatin').textContent = pose.latin;
        if ($('peragaBacaanTranslation')) $('peragaBacaanTranslation').textContent = `"${pose.translation}"`;
        if ($('peragaBacaanTip')) $('peragaBacaanTip').innerHTML = `<i class="fas fa-lightbulb"></i> ${pose.tip}`;

        const timeline = document.getElementById('peragaTimeline');
        if (timeline && timeline.children.length === POSES.length) {
            Array.from(timeline.children).forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentStep);
                dot.classList.toggle('done', i < this.currentStep);
            });
        }
    }

    updatePlayButton() {
        const btn = document.getElementById('peragaPlayBtn');
        if (!btn) return;
        btn.innerHTML = this.isPlaying
            ? '<i class="fas fa-pause"></i>'
            : '<i class="fas fa-play"></i>';
        btn.classList.toggle('playing', this.isPlaying);
    }

    buildTimeline() {
        const timeline = document.getElementById('peragaTimeline');
        if (!timeline) return;
        timeline.innerHTML = POSES.map((pose, i) => `
            <button class="peraga-dot" data-step="${i}" title="${pose.name}">
                <span class="peraga-dot-num">${i + 1}</span>
            </button>
        `).join('');
        timeline.querySelectorAll('.peraga-dot').forEach((dot) => {
            dot.addEventListener('click', () => {
                const step = parseInt(dot.dataset.step);
                this.pause();
                this.setStep(step);
            });
        });
    }

    bindControls() {
        const $ = (id) => document.getElementById(id);
        if ($('peragaPrevBtn')) $('peragaPrevBtn').addEventListener('click', () => { this.pause(); this.prevStep(); });
        if ($('peragaNextBtn')) $('peragaNextBtn').addEventListener('click', () => { this.pause(); this.nextStep(); });
        if ($('peragaPlayBtn')) $('peragaPlayBtn').addEventListener('click', () => {
            if (this.isPlaying) this.pause(); else this.play();
        });
        if ($('peragaResetBtn')) $('peragaResetBtn').addEventListener('click', () => this.reset());
        if ($('peragaRotateBtn')) {
            $('peragaRotateBtn').addEventListener('click', () => this.toggleAutoRotate());
            $('peragaRotateBtn').classList.toggle('active', this.autoRotate);
        }
    }

    animate() {
        if (!this.renderer) return;
        requestAnimationFrame(() => this.animate());

        if (this.autoRotate && !this.dragging) this.cameraAngle += 0.003;
        this.updateCamera();

        if (this.fromTargets && this.toTargets) {
            const elapsed = performance.now() - this.transitionStart;
            const t = Math.min(1, elapsed / this.transitionDuration);
            this.interpolateTargets(this.fromTargets, this.toTargets, t);
            if (t >= 1) {
                this.applyTargets(this.toTargets);
                this.fromTargets = null;
                this.toTargets = null;
            }
        }

        if (this.glowRing) {
            const time = performance.now() * 0.001;
            this.glowRing.material.opacity = 0.3 + Math.sin(time * 2) * 0.2;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onShow() {
        this.init();
        this.buildTimeline();
        this.bindControls();
        this.handleResize();
        this.updateUI();
    }
    onHide() {
        this.pause();
    }
}

export { POSES };
