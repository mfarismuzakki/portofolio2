// ===== Peraga 3D Sholat =====
// Visualisasi 3D urutan gerakan sholat menggunakan Three.js

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
        pose: {
            torsoAngle: 0,
            kneeBend: 0,
            armLeftShoulder: { x: -1.4, y: 0, z: 0.3 },
            armRightShoulder: { x: -1.4, y: 0, z: -0.3 },
            armLeftElbow: -0.3,
            armRightElbow: -0.3,
            handPosition: 'up',
            headTilt: 0,
            sitting: false
        }
    },
    {
        id: 'qiyam',
        name: 'Berdiri (Qiyam) - Membaca Al-Fatihah',
        ruling: 'Rukun ke-2 & ke-3',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        latin: 'Bismillahirrahmanirrahim',
        translation: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang',
        tip: 'Berdiri tegak, tangan kanan di atas tangan kiri pada dada/perut, pandangan ke tempat sujud.',
        duration: 4000,
        pose: {
            torsoAngle: 0,
            kneeBend: 0,
            armLeftShoulder: { x: 0.3, y: -0.2, z: 0.4 },
            armRightShoulder: { x: 0.3, y: 0.2, z: -0.4 },
            armLeftElbow: -1.6,
            armRightElbow: -1.6,
            handPosition: 'crossed',
            headTilt: 0.3,
            sitting: false
        }
    },
    {
        id: 'ruku',
        name: "Ruku' dengan Tuma'ninah",
        ruling: 'Rukun ke-4',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        latin: 'Subhana Rabbiyal \'Adzim',
        translation: 'Maha Suci Tuhanku Yang Maha Agung',
        tip: 'Membungkuk hingga punggung lurus sejajar, kedua tangan memegang lutut.',
        duration: 3500,
        pose: {
            torsoAngle: -1.4,
            kneeBend: 0,
            armLeftShoulder: { x: 0, y: 0, z: 0.3 },
            armRightShoulder: { x: 0, y: 0, z: -0.3 },
            armLeftElbow: 0,
            armRightElbow: 0,
            handPosition: 'knees',
            headTilt: 0,
            sitting: false
        }
    },
    {
        id: 'iktidal',
        name: "I'tidal dengan Tuma'ninah",
        ruling: 'Rukun ke-5',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ، رَبَّنَا وَلَكَ الْحَمْدُ',
        latin: 'Sami\'allahu liman hamidah, Rabbana wa lakal hamd',
        translation: 'Allah mendengar siapa yang memuji-Nya. Wahai Tuhan kami, segala puji bagi-Mu',
        tip: 'Bangkit dari ruku dan berdiri tegak kembali dengan tenang.',
        duration: 3000,
        pose: {
            torsoAngle: 0,
            kneeBend: 0,
            armLeftShoulder: { x: 0, y: 0, z: 0.2 },
            armRightShoulder: { x: 0, y: 0, z: -0.2 },
            armLeftElbow: 0,
            armRightElbow: 0,
            handPosition: 'down',
            headTilt: 0,
            sitting: false
        }
    },
    {
        id: 'sujud_1',
        name: "Sujud Pertama dengan Tuma'ninah",
        ruling: 'Rukun ke-6',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        latin: 'Subhana Rabbiyal A\'la',
        translation: 'Maha Suci Tuhanku Yang Maha Tinggi',
        tip: 'Tujuh anggota sujud menyentuh lantai: dahi & hidung, kedua tangan, kedua lutut, kedua jari kaki.',
        duration: 3500,
        pose: {
            torsoAngle: 0,
            kneeBend: 1.6,
            armLeftShoulder: { x: 0.5, y: 0, z: 0.3 },
            armRightShoulder: { x: 0.5, y: 0, z: -0.3 },
            armLeftElbow: -0.3,
            armRightElbow: -0.3,
            handPosition: 'sujud',
            headTilt: 0,
            sitting: false,
            sujud: true
        }
    },
    {
        id: 'duduk_diantara',
        name: 'Duduk Antara Dua Sujud',
        ruling: 'Rukun ke-7',
        arabic: 'رَبِّ اغْفِرْ لِي ، رَبِّ اغْفِرْ لِي',
        latin: 'Rabbighfirli, Rabbighfirli',
        translation: 'Wahai Tuhanku, ampunilah aku. Wahai Tuhanku, ampunilah aku',
        tip: 'Duduk iftirasy: telapak kaki kiri dijadikan alas, telapak kaki kanan ditegakkan.',
        duration: 3000,
        pose: {
            torsoAngle: 0,
            kneeBend: 0,
            armLeftShoulder: { x: 0.2, y: 0, z: 0.3 },
            armRightShoulder: { x: 0.2, y: 0, z: -0.3 },
            armLeftElbow: -0.5,
            armRightElbow: -0.5,
            handPosition: 'thighs',
            headTilt: 0.2,
            sitting: true
        }
    },
    {
        id: 'sujud_2',
        name: "Sujud Kedua dengan Tuma'ninah",
        ruling: 'Rukun ke-8',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        latin: 'Subhana Rabbiyal A\'la',
        translation: 'Maha Suci Tuhanku Yang Maha Tinggi',
        tip: 'Sujud kedua sebagaimana sujud pertama dengan tuma\'ninah.',
        duration: 3500,
        pose: {
            torsoAngle: 0,
            kneeBend: 1.6,
            armLeftShoulder: { x: 0.5, y: 0, z: 0.3 },
            armRightShoulder: { x: 0.5, y: 0, z: -0.3 },
            armLeftElbow: -0.3,
            armRightElbow: -0.3,
            handPosition: 'sujud',
            headTilt: 0,
            sitting: false,
            sujud: true
        }
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
        pose: {
            torsoAngle: 0,
            kneeBend: 0,
            armLeftShoulder: { x: 0.2, y: 0, z: 0.3 },
            armRightShoulder: { x: 0.3, y: 0, z: -0.3 },
            armLeftElbow: -0.5,
            armRightElbow: -0.7,
            handPosition: 'tasyahud',
            headTilt: 0.2,
            sitting: true
        }
    },
    {
        id: 'sholawat',
        name: 'Membaca Sholawat atas Nabi',
        ruling: 'Rukun ke-11',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        latin: 'Allahumma shalli \'ala Muhammad wa \'ala ali Muhammad',
        translation: 'Ya Allah berikanlah rahmat kepada Muhammad dan keluarga Muhammad',
        tip: 'Diucapkan saat duduk tasyahud akhir setelah membaca tasyahud.',
        duration: 4000,
        pose: {
            torsoAngle: 0,
            kneeBend: 0,
            armLeftShoulder: { x: 0.2, y: 0, z: 0.3 },
            armRightShoulder: { x: 0.3, y: 0, z: -0.3 },
            armLeftElbow: -0.5,
            armRightElbow: -0.7,
            handPosition: 'tasyahud',
            headTilt: 0.2,
            sitting: true
        }
    },
    {
        id: 'salam_kanan',
        name: 'Salam ke Kanan',
        ruling: 'Rukun ke-12',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        latin: 'Assalamu\'alaikum warahmatullah',
        translation: 'Semoga keselamatan dan rahmat Allah tercurah atasmu',
        tip: 'Menoleh ke arah kanan hingga pipi terlihat dari belakang.',
        duration: 3000,
        pose: {
            torsoAngle: 0,
            kneeBend: 0,
            armLeftShoulder: { x: 0.2, y: 0, z: 0.3 },
            armRightShoulder: { x: 0.3, y: 0, z: -0.3 },
            armLeftElbow: -0.5,
            armRightElbow: -0.7,
            handPosition: 'tasyahud',
            headTurn: -1.0,
            sitting: true
        }
    },
    {
        id: 'salam_kiri',
        name: 'Salam ke Kiri',
        ruling: 'Penyempurna',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        latin: 'Assalamu\'alaikum warahmatullah',
        translation: 'Semoga keselamatan dan rahmat Allah tercurah atasmu',
        tip: 'Menoleh ke arah kiri hingga pipi terlihat dari belakang. Sholat selesai.',
        duration: 3000,
        pose: {
            torsoAngle: 0,
            kneeBend: 0,
            armLeftShoulder: { x: 0.2, y: 0, z: 0.3 },
            armRightShoulder: { x: 0.3, y: 0, z: -0.3 },
            armLeftElbow: -0.5,
            armRightElbow: -0.7,
            handPosition: 'tasyahud',
            headTurn: 1.0,
            sitting: true
        }
    }
];

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
        this.fromPose = null;
        this.toPose = null;
        this.currentPose = JSON.parse(JSON.stringify(POSES[0].pose));
        this.cameraAngle = Math.PI / 4;
        this.dragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.cameraPitch = 0.2;
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
        this.scene.fog = new THREE.Fog(0x0a0e27, 8, 20);

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        this.updateCamera();

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lights
        const ambient = new THREE.AmbientLight(0x88aaff, 0.4);
        this.scene.add(ambient);

        const keyLight = new THREE.DirectionalLight(0x00ffff, 0.9);
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

        const fillLight = new THREE.DirectionalLight(0xff00ff, 0.4);
        fillLight.position.set(-5, 4, -3);
        this.scene.add(fillLight);

        const rimLight = new THREE.PointLight(0x00ffff, 0.6, 15);
        rimLight.position.set(0, 3, -4);
        this.scene.add(rimLight);

        // Floor (sajadah / prayer mat)
        this.createFloor();

        // Grid platform
        this.createPlatform();

        // Kiblat indicator
        this.createKiblatMarker();

        // Character
        this.createCharacter();

        // Apply initial pose
        this.applyPose(this.currentPose);

        // Resize handler
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());

        // Drag interaction
        this.setupInteraction(canvas);

        this.initialized = true;
        this.animate();
    }

    createFloor() {
        // Prayer mat (sajadah) with arched motif
        const matGeo = new THREE.PlaneGeometry(2.4, 4, 32, 32);
        const matCanvas = document.createElement('canvas');
        matCanvas.width = 256;
        matCanvas.height = 512;
        const ctx = matCanvas.getContext('2d');

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#1a1f3a');
        grad.addColorStop(0.5, '#2a1a4a');
        grad.addColorStop(1, '#0a0e27');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 512);

        // Border
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 6;
        ctx.strokeRect(8, 8, 240, 496);

        // Inner border
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, 216, 472);

        // Mihrab arch (top)
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(60, 90);
        ctx.lineTo(60, 60);
        ctx.quadraticCurveTo(128, 20, 196, 60);
        ctx.lineTo(196, 90);
        ctx.stroke();

        // Decorative pattern
        ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        for (let y = 120; y < 480; y += 40) {
            for (let x = 40; x < 220; x += 40) {
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const matTexture = new THREE.CanvasTexture(matCanvas);
        const matMat = new THREE.MeshStandardMaterial({
            map: matTexture,
            roughness: 0.7,
            metalness: 0.2,
            emissive: 0x110022,
            emissiveIntensity: 0.2
        });

        this.sajadah = new THREE.Mesh(matGeo, matMat);
        this.sajadah.rotation.x = -Math.PI / 2;
        this.sajadah.position.y = 0.01;
        this.sajadah.position.z = 0.3;
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

        // Glowing ring
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
        // Arrow indicating kiblat (forward direction)
        const group = new THREE.Group();

        const coneGeo = new THREE.ConeGeometry(0.15, 0.4, 4);
        const coneMat = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.5
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.rotation.x = Math.PI / 2;
        cone.position.z = -2.4;
        group.add(cone);

        // Kiblat label canvas
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 256;
        labelCanvas.height = 64;
        const lctx = labelCanvas.getContext('2d');
        lctx.fillStyle = 'rgba(255, 0, 255, 0.9)';
        lctx.font = 'bold 32px Orbitron, sans-serif';
        lctx.textAlign = 'center';
        lctx.textBaseline = 'middle';
        lctx.fillText('▲ KIBLAT', 128, 32);
        const labelTex = new THREE.CanvasTexture(labelCanvas);
        const labelMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true });
        const label = new THREE.Sprite(labelMat);
        label.position.set(0, 0.5, -2.4);
        label.scale.set(1.5, 0.4, 1);
        group.add(label);

        this.scene.add(group);
        this.kiblatMarker = group;
    }

    createCharacter() {
        const character = new THREE.Group();
        const skinColor = 0xe8c8a0;
        const robeColor = 0x16223d;
        const robeAccent = 0x00ccff;
        const capColor = 0xffffff;

        const skinMat = new THREE.MeshStandardMaterial({
            color: skinColor,
            roughness: 0.6,
            metalness: 0.0
        });
        const robeMat = new THREE.MeshStandardMaterial({
            color: robeColor,
            roughness: 0.4,
            metalness: 0.3,
            emissive: 0x001144,
            emissiveIntensity: 0.2
        });
        const robeAccentMat = new THREE.MeshStandardMaterial({
            color: robeAccent,
            roughness: 0.3,
            metalness: 0.6,
            emissive: 0x00aaaa,
            emissiveIntensity: 0.4
        });
        const capMat = new THREE.MeshStandardMaterial({
            color: capColor,
            roughness: 0.5,
            metalness: 0.1,
            emissive: 0x222244,
            emissiveIntensity: 0.1
        });

        // ===== Hip pivot (root) =====
        const hipGroup = new THREE.Group();
        hipGroup.position.y = 1.0;
        character.add(hipGroup);

        // ===== Torso =====
        const torsoGroup = new THREE.Group();
        hipGroup.add(torsoGroup);

        const torsoGeo = new THREE.BoxGeometry(0.8, 1.0, 0.45);
        const torso = new THREE.Mesh(torsoGeo, robeMat);
        torso.position.y = 0.5;
        torso.castShadow = true;
        torsoGroup.add(torso);

        // Robe collar (accent)
        const collarGeo = new THREE.BoxGeometry(0.6, 0.15, 0.5);
        const collar = new THREE.Mesh(collarGeo, robeAccentMat);
        collar.position.y = 0.95;
        torsoGroup.add(collar);

        // ===== Head =====
        const headGroup = new THREE.Group();
        headGroup.position.y = 1.0;
        torsoGroup.add(headGroup);

        const headGeo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
        const head = new THREE.Mesh(headGeo, skinMat);
        head.position.y = 0.25;
        head.castShadow = true;
        headGroup.add(head);

        // Cap (peci)
        const capGeo = new THREE.CylinderGeometry(0.22, 0.24, 0.18, 16);
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 0.55;
        cap.castShadow = true;
        headGroup.add(cap);

        // Beard (small)
        const beardGeo = new THREE.BoxGeometry(0.32, 0.1, 0.05);
        const beardMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
        const beard = new THREE.Mesh(beardGeo, beardMat);
        beard.position.set(0, 0.1, 0.22);
        headGroup.add(beard);

        // Eyes (glow)
        const eyeGeo = new THREE.SphereGeometry(0.025, 8, 8);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.08, 0.27, 0.22);
        headGroup.add(eyeL);
        const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
        eyeR.position.set(0.08, 0.27, 0.22);
        headGroup.add(eyeR);

        // ===== Left Arm =====
        const armLeftShoulder = new THREE.Group();
        armLeftShoulder.position.set(-0.45, 0.9, 0);
        torsoGroup.add(armLeftShoulder);

        const upperArmLGeo = new THREE.BoxGeometry(0.18, 0.5, 0.18);
        const upperArmL = new THREE.Mesh(upperArmLGeo, robeMat);
        upperArmL.position.y = -0.25;
        upperArmL.castShadow = true;
        armLeftShoulder.add(upperArmL);

        const armLeftElbow = new THREE.Group();
        armLeftElbow.position.y = -0.5;
        armLeftShoulder.add(armLeftElbow);

        const lowerArmLGeo = new THREE.BoxGeometry(0.16, 0.45, 0.16);
        const lowerArmL = new THREE.Mesh(lowerArmLGeo, robeMat);
        lowerArmL.position.y = -0.225;
        lowerArmL.castShadow = true;
        armLeftElbow.add(lowerArmL);

        const handLGeo = new THREE.BoxGeometry(0.15, 0.18, 0.1);
        const handL = new THREE.Mesh(handLGeo, skinMat);
        handL.position.y = -0.55;
        handL.castShadow = true;
        armLeftElbow.add(handL);

        // ===== Right Arm =====
        const armRightShoulder = new THREE.Group();
        armRightShoulder.position.set(0.45, 0.9, 0);
        torsoGroup.add(armRightShoulder);

        const upperArmRGeo = new THREE.BoxGeometry(0.18, 0.5, 0.18);
        const upperArmR = new THREE.Mesh(upperArmRGeo, robeMat);
        upperArmR.position.y = -0.25;
        upperArmR.castShadow = true;
        armRightShoulder.add(upperArmR);

        const armRightElbow = new THREE.Group();
        armRightElbow.position.y = -0.5;
        armRightShoulder.add(armRightElbow);

        const lowerArmRGeo = new THREE.BoxGeometry(0.16, 0.45, 0.16);
        const lowerArmR = new THREE.Mesh(lowerArmRGeo, robeMat);
        lowerArmR.position.y = -0.225;
        lowerArmR.castShadow = true;
        armRightElbow.add(lowerArmR);

        const handRGeo = new THREE.BoxGeometry(0.15, 0.18, 0.1);
        const handR = new THREE.Mesh(handRGeo, skinMat);
        handR.position.y = -0.55;
        handR.castShadow = true;
        armRightElbow.add(handR);

        // ===== Left Leg =====
        const legLeftHip = new THREE.Group();
        legLeftHip.position.set(-0.2, 0, 0);
        hipGroup.add(legLeftHip);

        const upperLegLGeo = new THREE.BoxGeometry(0.22, 0.55, 0.22);
        const upperLegL = new THREE.Mesh(upperLegLGeo, robeMat);
        upperLegL.position.y = -0.275;
        upperLegL.castShadow = true;
        legLeftHip.add(upperLegL);

        const legLeftKnee = new THREE.Group();
        legLeftKnee.position.y = -0.55;
        legLeftHip.add(legLeftKnee);

        const lowerLegLGeo = new THREE.BoxGeometry(0.2, 0.45, 0.2);
        const lowerLegL = new THREE.Mesh(lowerLegLGeo, robeMat);
        lowerLegL.position.y = -0.225;
        lowerLegL.castShadow = true;
        legLeftKnee.add(lowerLegL);

        const footLGeo = new THREE.BoxGeometry(0.22, 0.1, 0.35);
        const footL = new THREE.Mesh(footLGeo, skinMat);
        footL.position.set(0, -0.5, 0.08);
        footL.castShadow = true;
        legLeftKnee.add(footL);

        // ===== Right Leg =====
        const legRightHip = new THREE.Group();
        legRightHip.position.set(0.2, 0, 0);
        hipGroup.add(legRightHip);

        const upperLegRGeo = new THREE.BoxGeometry(0.22, 0.55, 0.22);
        const upperLegR = new THREE.Mesh(upperLegRGeo, robeMat);
        upperLegR.position.y = -0.275;
        upperLegR.castShadow = true;
        legRightHip.add(upperLegR);

        const legRightKnee = new THREE.Group();
        legRightKnee.position.y = -0.55;
        legRightHip.add(legRightKnee);

        const lowerLegRGeo = new THREE.BoxGeometry(0.2, 0.45, 0.2);
        const lowerLegR = new THREE.Mesh(lowerLegRGeo, robeMat);
        lowerLegR.position.y = -0.225;
        lowerLegR.castShadow = true;
        legRightKnee.add(lowerLegR);

        const footRGeo = new THREE.BoxGeometry(0.22, 0.1, 0.35);
        const footR = new THREE.Mesh(footRGeo, skinMat);
        footR.position.set(0, -0.5, 0.08);
        footR.castShadow = true;
        legRightKnee.add(footR);

        this.parts = {
            character,
            hip: hipGroup,
            torso: torsoGroup,
            head: headGroup,
            armLeftShoulder, armLeftElbow,
            armRightShoulder, armRightElbow,
            legLeftHip, legLeftKnee,
            legRightHip, legRightKnee,
            handL, handR
        };

        this.scene.add(character);
        this.character = character;
    }

    applyPose(pose) {
        if (!this.parts.hip) return;
        const p = this.parts;

        // Sitting vs standing
        if (pose.sitting) {
            p.hip.position.y = 0.55;
            p.legLeftHip.rotation.x = -1.5;
            p.legLeftKnee.rotation.x = 2.8;
            p.legRightHip.rotation.x = -1.5;
            p.legRightKnee.rotation.x = 2.8;
            p.legLeftHip.rotation.z = 0;
            p.legRightHip.rotation.z = 0;
            p.torso.rotation.x = 0;
        } else if (pose.sujud) {
            // Sujud pose: hip low, knees fully bent, torso forward
            p.hip.position.y = 0.65;
            p.legLeftHip.rotation.x = -1.4;
            p.legLeftKnee.rotation.x = 2.6;
            p.legRightHip.rotation.x = -1.4;
            p.legRightKnee.rotation.x = 2.6;
            p.torso.rotation.x = -1.5;
        } else {
            // Standing
            p.hip.position.y = 1.0;
            p.legLeftHip.rotation.x = pose.kneeBend ? -pose.kneeBend * 0.3 : 0;
            p.legRightHip.rotation.x = pose.kneeBend ? -pose.kneeBend * 0.3 : 0;
            p.legLeftKnee.rotation.x = pose.kneeBend || 0;
            p.legRightKnee.rotation.x = pose.kneeBend || 0;
            p.torso.rotation.x = pose.torsoAngle || 0;
        }

        // Arms
        if (pose.armLeftShoulder) {
            p.armLeftShoulder.rotation.x = pose.armLeftShoulder.x;
            p.armLeftShoulder.rotation.y = pose.armLeftShoulder.y;
            p.armLeftShoulder.rotation.z = pose.armLeftShoulder.z;
        }
        if (pose.armRightShoulder) {
            p.armRightShoulder.rotation.x = pose.armRightShoulder.x;
            p.armRightShoulder.rotation.y = pose.armRightShoulder.y;
            p.armRightShoulder.rotation.z = pose.armRightShoulder.z;
        }
        p.armLeftElbow.rotation.x = pose.armLeftElbow || 0;
        p.armRightElbow.rotation.x = pose.armRightElbow || 0;

        // Special hand positions
        if (pose.handPosition === 'crossed') {
            // Hands folded on chest/abdomen
            p.armLeftShoulder.rotation.x = 0.3;
            p.armLeftShoulder.rotation.z = 0.4;
            p.armLeftElbow.rotation.x = -1.6;
            p.armRightShoulder.rotation.x = 0.3;
            p.armRightShoulder.rotation.z = -0.4;
            p.armRightElbow.rotation.x = -1.6;
        } else if (pose.handPosition === 'knees') {
            // Hands gripping knees during ruku
            p.armLeftShoulder.rotation.x = 0.6;
            p.armLeftShoulder.rotation.z = 0.1;
            p.armLeftElbow.rotation.x = 0;
            p.armRightShoulder.rotation.x = 0.6;
            p.armRightShoulder.rotation.z = -0.1;
            p.armRightElbow.rotation.x = 0;
        } else if (pose.handPosition === 'sujud') {
            // Hands on floor next to head
            p.armLeftShoulder.rotation.x = 0.8;
            p.armLeftShoulder.rotation.z = 0.4;
            p.armLeftElbow.rotation.x = -0.8;
            p.armRightShoulder.rotation.x = 0.8;
            p.armRightShoulder.rotation.z = -0.4;
            p.armRightElbow.rotation.x = -0.8;
        } else if (pose.handPosition === 'thighs' || pose.handPosition === 'tasyahud') {
            // Hands resting on thighs
            p.armLeftShoulder.rotation.x = 0.0;
            p.armLeftShoulder.rotation.z = 0.3;
            p.armLeftElbow.rotation.x = -1.0;
            p.armRightShoulder.rotation.x = 0.0;
            p.armRightShoulder.rotation.z = -0.3;
            p.armRightElbow.rotation.x = -1.0;
        }

        // Head
        p.head.rotation.x = pose.headTilt || 0;
        p.head.rotation.y = pose.headTurn || 0;

        this.currentPose = JSON.parse(JSON.stringify(pose));
    }

    interpolatePose(from, to, t) {
        const lerp = (a, b, t) => a + (b - a) * t;
        const ease = t * t * (3 - 2 * t); // smoothstep

        // Apply boolean flags from the target pose immediately at the midpoint
        if (ease < 0.5) {
            this.applyPose(from);
        } else {
            this.applyPose(to);
        }

        // Then smooth-interpolate continuous values
        if (this.parts.hip) {
            const fromY = from.sitting ? 0.55 : (from.sujud ? 0.65 : 1.0);
            const toY = to.sitting ? 0.55 : (to.sujud ? 0.65 : 1.0);
            this.parts.hip.position.y = lerp(fromY, toY, ease);

            this.parts.torso.rotation.x = lerp(from.torsoAngle || 0, to.torsoAngle || 0, ease);
            this.parts.head.rotation.x = lerp(from.headTilt || 0, to.headTilt || 0, ease);
            this.parts.head.rotation.y = lerp(from.headTurn || 0, to.headTurn || 0, ease);
        }
    }

    setStep(index, animate = true) {
        const safeIdx = Math.max(0, Math.min(POSES.length - 1, index));
        const oldIndex = this.currentStep;
        this.currentStep = safeIdx;

        if (animate && oldIndex !== safeIdx) {
            this.fromPose = JSON.parse(JSON.stringify(this.currentPose));
            this.toPose = POSES[safeIdx].pose;
            this.transitionStart = performance.now();
        } else {
            this.applyPose(POSES[safeIdx].pose);
            this.fromPose = null;
        }

        this.updateUI();
    }

    nextStep() {
        if (this.currentStep < POSES.length - 1) {
            this.setStep(this.currentStep + 1);
        } else {
            this.setStep(0);
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.setStep(this.currentStep - 1);
        }
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
        const currentDuration = POSES[this.currentStep].duration || 3000;
        clearTimeout(this.playTimer);
        this.playTimer = setTimeout(() => {
            if (this.currentStep >= POSES.length - 1) {
                this.pause();
                return;
            }
            this.nextStep();
            this.queueNext();
        }, currentDuration);
    }

    reset() {
        this.pause();
        this.setStep(0);
        this.cameraAngle = Math.PI / 4;
        this.cameraPitch = 0.2;
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
        const y = 1.5 + Math.sin(this.cameraPitch) * this.cameraRadius;
        const z = Math.cos(this.cameraAngle) * this.cameraRadius * Math.cos(this.cameraPitch);
        this.camera.position.set(x, y, z);
        this.camera.lookAt(0, 0.8, 0);
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
            if (e.touches.length === 1) {
                onDown(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
        canvas.addEventListener('touchmove', e => {
            if (e.touches.length === 1) {
                onMove(e.touches[0].clientX, e.touches[0].clientY);
            }
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

        // Update timeline
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
            if (this.isPlaying) this.pause();
            else this.play();
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

        // Auto rotate camera
        if (this.autoRotate && !this.dragging) {
            this.cameraAngle += 0.003;
        }
        this.updateCamera();

        // Pose transition
        if (this.fromPose && this.toPose) {
            const elapsed = performance.now() - this.transitionStart;
            const t = Math.min(1, elapsed / this.transitionDuration);
            this.interpolatePose(this.fromPose, this.toPose, t);
            if (t >= 1) {
                this.applyPose(this.toPose);
                this.fromPose = null;
                this.toPose = null;
            }
        }

        // Pulse the glow ring
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
