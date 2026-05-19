// ===== Peraga 3D Sholat =====
// Visualisasi 3D urutan gerakan sholat 2 raka'at (misal: Subuh / sunnah)
// mengikuti tata cara yang dipraktikkan ulama Salafy seperti
// Syaikh Ibnu Bāz, Syaikh Al-Albani, dan Syaikh Al-‘Utsaimin.
// Referensi: "Sifat Shalat Nabi" (Al-Albani), "Risalah Tata Cara Shalat" (Ibnu Bāz).

// Pose-pose yang dipakai berulang — definisikan sekali agar konsisten antar raka'at.
const STAND_NEUTRAL = {
    torsoAngle: 0,
    kneeBend: 0,
    armLeftShoulder: { x: 0, y: 0, z: 0.05 },
    armRightShoulder: { x: 0, y: 0, z: -0.05 },
    armLeftElbow: 0,
    armRightElbow: 0,
    handPosition: 'down',
    headTilt: 0.2,
    sitting: false
};

const TAKBIR_HANDS_UP = {
    torsoAngle: 0,
    kneeBend: 0,
    armLeftShoulder: { x: -1.4, y: 0, z: 0.3 },
    armRightShoulder: { x: -1.4, y: 0, z: -0.3 },
    armLeftElbow: -0.3,
    armRightElbow: -0.3,
    handPosition: 'up',
    headTilt: 0,
    sitting: false
};

const SEDEKAP = {
    torsoAngle: 0,
    kneeBend: 0,
    armLeftShoulder: { x: 0.3, y: -0.2, z: 0.4 },
    armRightShoulder: { x: 0.3, y: 0.2, z: -0.4 },
    armLeftElbow: -1.6,
    armRightElbow: -1.6,
    handPosition: 'crossed',
    headTilt: 0.3,
    sitting: false
};

// Ruku': back PERFECTLY HORIZONTAL parallel to floor (≈90°) per reference
// "Sifat Shalat Nabi". Three.js positive X rotation takes +Y → +Z, so a
// positive value here tips the top of the torso forward toward kiblat.
// Head stays in line with the back — neither dropped nor lifted.
const RUKU_POSE = {
    torsoAngle: 1.55,
    kneeBend: 0,
    armLeftShoulder: { x: 0, y: 0, z: 0.3 },
    armRightShoulder: { x: 0, y: 0, z: -0.3 },
    armLeftElbow: 0,
    armRightElbow: 0,
    handPosition: 'knees',
    headTilt: 0,
    sitting: false
};

const ITIDAL_POSE = {
    torsoAngle: 0,
    kneeBend: 0,
    armLeftShoulder: { x: 0, y: 0, z: 0.1 },
    armRightShoulder: { x: 0, y: 0, z: -0.1 },
    armLeftElbow: 0,
    armRightElbow: 0,
    handPosition: 'down',
    headTilt: 0.1,
    sitting: false
};

// Sujud: lutut + ujung kaki menempel lantai (kaki ke arah kiblat), pinggul
// terangkat di atas lutut, paha hampir tegak lurus, punggung miring ke depan,
// perut TIDAK menempel paha, lengan menjauhi tulang rusuk, dahi+hidung di
// lantai sejajar/di depan posisi kedua tangan.
const SUJUD_POSE = {
    handPosition: 'sujud',
    // Strong forward chin tuck so the forehead reaches the prayer mat
    // even with the limited articulation of the box rig.
    headTilt: 0.55,
    sitting: false,
    sujud: true
};

const DUDUK_IFTIRASY = {
    torsoAngle: 0,
    kneeBend: 0,
    armLeftShoulder: { x: 0.2, y: 0, z: 0.3 },
    armRightShoulder: { x: 0.2, y: 0, z: -0.3 },
    armLeftElbow: -0.5,
    armRightElbow: -0.5,
    handPosition: 'thighs',
    headTilt: 0.2,
    sitting: true
};

// Tawarru' (tasyahud akhir): kaki kiri keluar ke bawah betis kanan, pinggul
// menempel ke lantai. Posisi ini DIFFERENT dari iftirosy (tasyahud awal).
const DUDUK_TASYAHUD = {
    torsoAngle: 0,
    kneeBend: 0,
    armLeftShoulder: { x: 0.2, y: 0, z: 0.3 },
    armRightShoulder: { x: 0.3, y: 0, z: -0.3 },
    armLeftElbow: -0.5,
    armRightElbow: -0.7,
    handPosition: 'tasyahud',
    headTilt: 0.2,
    sitting: true,
    tawarruk: true
};

const POSES = [
    // === PRA-TAKBIR ===
    {
        id: 'qiyam_niat',
        name: 'Berdiri Menghadap Kiblat & Niat',
        ruling: 'Syarat Sah',
        arabic: '',
        latin: '(Niat di dalam hati — tanpa dilafadzkan)',
        translation: 'Berdiri tegak menghadap kiblat dengan niat sholat di dalam hati.',
        tip: 'Niat tempatnya di hati. Melafadzkan "Ushalli…" tidak ada tuntunannya dari Nabi ﷺ menurut Ibnu Taimiyah, Ibnul Qayyim, Al-Albani, dan Ibnu Bāz. Pandangan diarahkan ke tempat sujud.',
        duration: 3500,
        pose: STAND_NEUTRAL
    },

    // === RAKA'AT 1 ===
    {
        id: 'takbiratul_ihram',
        name: 'Takbīratul Ihrām',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'اللَّهُ أَكْبَرُ',
        latin: 'Allāhu Akbar',
        translation: 'Allah Maha Besar',
        tip: 'Angkat kedua tangan sejajar bahu atau ujung telinga (keduanya shahih), jari-jari terbuka menghadap kiblat, lalu ucapkan takbir. Inilah pembuka sholat dan rukun pertama.',
        duration: 3000,
        pose: TAKBIR_HANDS_UP
    },
    {
        id: 'qiyam_fatihah_1',
        name: 'Bersedekap & Membaca Al-Fātihah (Raka\'at 1)',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        latin: 'Bismillāhir-rahmānir-rahīm. Al-hamdu lillāhi rabbil-‘ālamīn…',
        translation: 'Dengan menyebut nama Allah… Segala puji bagi Allah, Rabb semesta alam…',
        tip: 'Letakkan tangan kanan di atas tangan kiri di atas dada (HR. Ibnu Khuzaimah dari Wā\'il bin Hujr — shahih menurut Al-Albani). Bacaan: Doa Iftitāh → Ta\'awwudz → Al-Fātihah → surat pendek.',
        duration: 5000,
        pose: SEDEKAP
    },
    {
        id: 'ruku_1',
        name: 'Rukū\' dengan Tuma\'nīnah (Raka\'at 1)',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        latin: 'Subhāna Rabbiyal-‘Azhīm (3×)',
        translation: 'Maha Suci Rabbku Yang Maha Agung',
        tip: 'Sebelum membungkuk, angkat kedua tangan (raf\'ul yadain) sambil bertakbir — sunnah yang sangat ditekankan dan diamalkan oleh para ulama Salafy. Punggung lurus rata, kepala sejajar punggung, kedua tangan menggenggam lutut dengan jari renggang.',
        duration: 3800,
        pose: RUKU_POSE
    },
    {
        id: 'itidal_1',
        name: 'I\'tidāl dengan Tuma\'nīnah (Raka\'at 1)',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ',
        latin: 'Sami‘allāhu liman hamidah. Rabbanā wa lakal-hamd',
        translation: 'Allah mendengar siapa yang memuji-Nya. Wahai Rabb kami, segala puji bagi-Mu',
        tip: 'Bangkit dari rukū\' sambil angkat tangan (raf\'ul yadain) seraya mengucap "Sami‘allāhu liman hamidah". Setelah berdiri tegak baru ucapkan "Rabbanā wa lakal-hamd". Tegak sempurna sebelum turun sujud.',
        duration: 3500,
        pose: ITIDAL_POSE
    },
    {
        id: 'sujud_1a',
        name: 'Sujūd Pertama (Raka\'at 1)',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        latin: 'Subhāna Rabbiyal-A‘lā (3×)',
        translation: 'Maha Suci Rabbku Yang Maha Tinggi',
        tip: 'Turun dengan takbir (tanpa raf\'ul yadain). Sujud di atas tujuh anggota: dahi + hidung, dua telapak tangan, dua lutut, ujung jari kedua kaki. Tangan sejajar bahu, jari rapat menghadap kiblat. Renggangkan kedua lengan dari lambung, perut tidak menempel paha.',
        duration: 3800,
        pose: SUJUD_POSE
    },
    {
        id: 'duduk_iftirasy_1',
        name: 'Duduk Antara Dua Sujud (Iftirāsy)',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي',
        latin: 'Rabbighfirlī warhamnī wajburnī warfa‘nī warzuqnī wahdinī wa ‘āfinī wa‘fu ‘annī',
        translation: 'Wahai Rabbku, ampunilah aku, kasihanilah aku, cukupkanlah aku, angkatlah derajatku, berilah aku rizki, berilah aku petunjuk, sehatkanlah aku, dan maafkanlah aku.',
        tip: 'Duduk iftirāsy: telapak kaki kiri dijadikan alas (diduduki), kaki kanan ditegakkan dengan jari-jari menghadap kiblat. Kedua tangan diletakkan di atas paha/lutut.',
        duration: 3500,
        pose: DUDUK_IFTIRASY
    },
    {
        id: 'sujud_1b',
        name: 'Sujūd Kedua (Raka\'at 1)',
        ruling: 'Rukun • Raka\'at 1',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        latin: 'Subhāna Rabbiyal-A‘lā (3×)',
        translation: 'Maha Suci Rabbku Yang Maha Tinggi',
        tip: 'Sujud kedua sebagaimana sujud pertama dengan tuma\'nīnah penuh. Boleh menambahkan doa setelah dzikir wajib — sujud adalah waktu mustajab untuk berdoa (HR. Muslim).',
        duration: 3800,
        pose: SUJUD_POSE
    },

    // === RAKA'AT 2 ===
    {
        id: 'qiyam_fatihah_2',
        name: 'Berdiri & Membaca Al-Fātihah (Raka\'at 2)',
        ruling: 'Rukun • Raka\'at 2',
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        latin: 'Al-hamdu lillāhi rabbil-‘ālamīn… (Al-Fātihah + surat)',
        translation: 'Membaca Al-Fātihah dan surat pendek pada raka\'at kedua.',
        tip: 'Bangkit dari sujud kedua dengan takbir (sebagian ulama menyunnahkan duduk istirahat sebentar — "jalsatul istirāhah"). Pada raka\'at 2 langsung Al-Fātihah, tanpa mengulang doa iftitāh.',
        duration: 5000,
        pose: SEDEKAP
    },
    {
        id: 'ruku_2',
        name: 'Rukū\' (Raka\'at 2)',
        ruling: 'Rukun • Raka\'at 2',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        latin: 'Subhāna Rabbiyal-‘Azhīm (3×)',
        translation: 'Maha Suci Rabbku Yang Maha Agung',
        tip: 'Bertakbir disertai raf\'ul yadain, lalu rukū\' dengan tuma\'nīnah sebagaimana raka\'at pertama.',
        duration: 3800,
        pose: RUKU_POSE
    },
    {
        id: 'itidal_2',
        name: 'I\'tidāl (Raka\'at 2)',
        ruling: 'Rukun • Raka\'at 2',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ',
        latin: 'Sami‘allāhu liman hamidah. Rabbanā wa lakal-hamd',
        translation: 'Allah mendengar siapa yang memuji-Nya. Wahai Rabb kami, segala puji bagi-Mu',
        tip: 'Bangkit dari rukū\' dengan raf\'ul yadain, berdiri tegak sempurna sebelum turun sujud. Jangan tergesa-gesa.',
        duration: 3500,
        pose: ITIDAL_POSE
    },
    {
        id: 'sujud_2a',
        name: 'Sujūd Pertama (Raka\'at 2)',
        ruling: 'Rukun • Raka\'at 2',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        latin: 'Subhāna Rabbiyal-A‘lā (3×)',
        translation: 'Maha Suci Rabbku Yang Maha Tinggi',
        tip: 'Sujud sebagaimana raka\'at pertama. Pastikan tujuh anggota sujud menempel sempurna ke lantai.',
        duration: 3800,
        pose: SUJUD_POSE
    },
    {
        id: 'duduk_iftirasy_2',
        name: 'Duduk Antara Dua Sujud (Raka\'at 2)',
        ruling: 'Rukun • Raka\'at 2',
        arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَارْزُقْنِي',
        latin: 'Rabbighfirlī warhamnī wahdinī warzuqnī',
        translation: 'Wahai Rabbku, ampunilah aku, kasihanilah aku, berilah aku petunjuk, dan berilah aku rizki.',
        tip: 'Duduk iftirāsy seperti raka\'at pertama, dengan tuma\'nīnah penuh.',
        duration: 3500,
        pose: DUDUK_IFTIRASY
    },
    {
        id: 'sujud_2b',
        name: 'Sujūd Kedua (Raka\'at 2)',
        ruling: 'Rukun • Raka\'at 2',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        latin: 'Subhāna Rabbiyal-A‘lā (3×)',
        translation: 'Maha Suci Rabbku Yang Maha Tinggi',
        tip: 'Sujud terakhir sebelum duduk tasyahud akhir.',
        duration: 3800,
        pose: SUJUD_POSE
    },

    // === TASYAHUD AKHIR & SALAM ===
    {
        id: 'tasyahud_akhir',
        name: 'Duduk Tasyahud Akhir (Tawarruk)',
        ruling: 'Rukun • Bacaan Tasyahud',
        arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
        latin: 'At-tahiyyātu lillāhi wash-shalawātu wath-thayyibāt. As-salāmu ‘alayka ayyuhan-nabiyyu wa rahmatullāhi wa barakātuh…',
        translation: 'Segala penghormatan, ibadah, dan kebaikan hanya milik Allah. Semoga keselamatan, rahmat Allah, dan keberkahan-Nya tercurah atasmu wahai Nabi…',
        tip: 'Tawarruk: kaki kiri keluar ke bawah betis kanan, pinggul menempel ke lantai, kaki kanan ditegakkan. Telunjuk kanan diisyaratkan sepanjang tasyahud sambil pandangan ke arah jari (HR. Abu Dawud — shahih).',
        duration: 5000,
        pose: { ...DUDUK_TASYAHUD, isyarat: true }
    },
    {
        id: 'sholawat_ibrahimiyah',
        name: 'Sholawat Ibrāhīmiyyah atas Nabi ﷺ',
        ruling: 'Rukun • Setelah Tasyahud',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ',
        latin: 'Allāhumma shalli ‘alā Muhammad wa ‘alā āli Muhammad, kamā shallayta ‘alā Ibrāhīm wa ‘alā āli Ibrāhīm…',
        translation: 'Ya Allah, limpahkanlah shalawat kepada Muhammad dan keluarga Muhammad sebagaimana Engkau limpahkan kepada Ibrāhīm dan keluarga Ibrāhīm…',
        tip: 'Setelah sholawat, sangat dianjurkan berdoa memohon perlindungan dari empat perkara: adzab Jahannam, adzab kubur, fitnah hidup dan mati, dan fitnah Al-Masīh Ad-Dajjāl (HR. Muslim).',
        duration: 5000,
        pose: { ...DUDUK_TASYAHUD, isyarat: true }
    },
    {
        id: 'salam_kanan',
        name: 'Salām ke Kanan',
        ruling: 'Rukun • Penutup Sholat',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        latin: 'As-salāmu ‘alaykum wa rahmatullāh',
        translation: 'Semoga keselamatan dan rahmat Allah tercurah atas kalian',
        tip: 'Menoleh ke kanan hingga pipi terlihat dari belakang sambil mengucapkan salam.',
        duration: 3000,
        pose: { ...DUDUK_TASYAHUD, headTurn: -1.0 }
    },
    {
        id: 'salam_kiri',
        name: 'Salām ke Kiri',
        ruling: 'Penyempurna • Sholat Selesai',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        latin: 'As-salāmu ‘alaykum wa rahmatullāh',
        translation: 'Semoga keselamatan dan rahmat Allah tercurah atas kalian',
        tip: 'Menoleh ke kiri hingga pipi terlihat dari belakang. Dengan ini sholat telah selesai. Lanjutkan dengan dzikir-dzikir ba\'da sholat sebagaimana dicontohkan Nabi ﷺ.',
        duration: 3000,
        pose: { ...DUDUK_TASYAHUD, headTurn: 1.0 }
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
        // Start the camera behind-right of the character so the viewer sees
        // the character's back facing the kiblat (a natural learning POV).
        this.cameraAngle = Math.PI * 3 / 4;
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
        // Kiblat marker placed IN FRONT of the character (+Z).
        // Character faces +Z (eyes/beard on +Z side), so the kiblat — toward
        // which prayer is performed — must lie ahead of the character.
        const group = new THREE.Group();

        const coneGeo = new THREE.ConeGeometry(0.15, 0.4, 4);
        const coneMat = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.5
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        // Tip points AWAY from character toward kiblat (deeper into +Z).
        cone.rotation.x = Math.PI / 2;
        cone.position.z = 2.4;
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
        label.position.set(0, 0.5, 2.4);
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

    // ===================================================================
    // applyPose() — drives the rig for each prayer stance.
    //
    // Convention reminder for this rig (Three.js right-handed):
    //   • Character faces +Z (kiblat lies on +Z).
    //   • Limbs in their rest pose extend in -Y (legs/arms point down).
    //     Rotation around X axis maps +Y→+Z, so a positive .rotation.x on
    //     a downward-pointing limb sweeps it BACKWARD (-Z); a NEGATIVE
    //     rotation sweeps it FORWARD (+Z, toward kiblat).
    //   • Torso instead points +Y in its rest pose, so a POSITIVE torso
    //     rotation around X tips the head FORWARD (+Z) — that's what
    //     ruku' and sujud need.
    // ===================================================================
    applyPose(pose) {
        if (!this.parts.hip) return;
        const p = this.parts;

        // Reset any side-tilt on the spine from previous frames
        p.torso.rotation.y = 0;
        p.torso.rotation.z = 0;
        p.legLeftHip.rotation.z = 0;
        p.legRightHip.rotation.z = 0;

        if (pose.sujud) {
            this._poseSujud(p);
        } else if (pose.tawarruk) {
            this._poseTawarruk(p);
        } else if (pose.sitting) {
            this._poseIftirasy(p);
        } else {
            this._poseStanding(p, pose);
        }

        // ---- Hands / arms ----
        // For standing poses, the arm starting points come from the pose
        // (takbir, sedekap, …). Specific stances below override them via
        // handPosition.
        if (pose.armLeftShoulder && !pose.sujud) {
            p.armLeftShoulder.rotation.x = pose.armLeftShoulder.x;
            p.armLeftShoulder.rotation.y = pose.armLeftShoulder.y;
            p.armLeftShoulder.rotation.z = pose.armLeftShoulder.z;
        }
        if (pose.armRightShoulder && !pose.sujud) {
            p.armRightShoulder.rotation.x = pose.armRightShoulder.x;
            p.armRightShoulder.rotation.y = pose.armRightShoulder.y;
            p.armRightShoulder.rotation.z = pose.armRightShoulder.z;
        }
        if (!pose.sujud) {
            p.armLeftElbow.rotation.x = pose.armLeftElbow || 0;
            p.armRightElbow.rotation.x = pose.armRightElbow || 0;
        }

        this._applyHandPosition(p, pose);

        // ---- Head ----
        p.head.rotation.x = pose.headTilt || 0;
        p.head.rotation.y = pose.headTurn || 0;

        this.currentPose = JSON.parse(JSON.stringify(pose));
    }

    // ----- Stance sub-routines -----

    _poseStanding(p, pose) {
        p.hip.position.y = 1.0;
        // Bring the legs back to neutral. kneeBend is unused for sholat poses
        // in practice (we don't bend the knees while standing) — kept for
        // backwards compatibility but driven gently.
        const kb = pose.kneeBend || 0;
        p.legLeftHip.rotation.x = -kb * 0.3;
        p.legRightHip.rotation.x = -kb * 0.3;
        p.legLeftKnee.rotation.x = kb;
        p.legRightKnee.rotation.x = kb;
        p.torso.rotation.x = pose.torsoAngle || 0;
    }

    // Iftirosy — duduk antara dua sujud & tasyahud awal.
    // Telapak kaki kiri dijadikan alas (diduduki), telapak kaki kanan
    // ditegakkan dengan jari menghadap kiblat.
    _poseIftirasy(p) {
        p.hip.position.y = 0.55;
        // Both thighs swing forward then calves fold back — symmetric
        // simplification of iftirosy for the boxy rig.
        p.legLeftHip.rotation.x = -1.45;
        p.legLeftKnee.rotation.x = 2.85;
        p.legRightHip.rotation.x = -1.45;
        p.legRightKnee.rotation.x = 2.85;
        p.torso.rotation.x = 0;
    }

    // Tawarru' — tasyahud akhir.
    // Pinggul kiri turun ke lantai, kaki kiri keluar ke bawah betis kanan,
    // kaki kanan tetap ditegakkan. Untuk rig kotak ini kita dekati dengan:
    //   • hip sedikit lebih rendah dari iftirosy (pantat menyentuh lantai)
    //   • paha kiri mendatar (knee.x ~ -1.5) menghadap kanan
    //   • paha kanan tetap iftirosy (lutut kanan masih terlipat ke belakang)
    //   • torso miring sedikit ke kanan, beban bertumpu pinggul kiri
    _poseTawarruk(p) {
        p.hip.position.y = 0.40;
        // LEFT leg sweeps forward and angles slightly to the right, calf
        // flatter so the foot can slide out from under the right calf.
        p.legLeftHip.rotation.x = -1.55;
        p.legLeftHip.rotation.z = 0.35;
        p.legLeftKnee.rotation.x = 2.5;
        // RIGHT leg stays in iftirosy fold (knee bent up, foot vertical).
        p.legRightHip.rotation.x = -1.30;
        p.legRightKnee.rotation.x = 2.85;
        // Slight lean to the right because weight is on the LEFT hip on the
        // floor (the lean tilts the upper body away from the supported side).
        p.torso.rotation.x = 0;
        p.torso.rotation.z = -0.10;
    }

    // Sujud — kneeling forward with forehead toward the prayer mat.
    // Reference: "Posisi yang benar untuk sujud" diagram.
    //   • Knees on the floor, ujung-ujung jari kaki menempel ke lantai
    //     menghadap kiblat (we approximate this — the boxy foot mesh
    //     can't articulate at the ankle).
    //   • Calves fold flat BACKWARD under the body.
    //   • Pelvis raised ABOVE the heels.
    //   • Back tipped forward toward the mat, perut JAUH dari paha.
    //   • Forearms (lengan bawah) LIFT off the floor — only the palms
    //     touch — lengan menjauhi tulang rusuk.
    _poseSujud(p) {
        // Hip slightly raised — torso has length 1.0 + head 0.25, so a hip
        // around 0.55 keeps the head close to the mat after a big forward
        // tilt while the thighs stay nearly vertical.
        p.hip.position.y = 0.55;
        p.legLeftHip.rotation.x  = -0.15;   // thighs hint forward toward kiblat
        p.legRightHip.rotation.x = -0.15;
        // POSITIVE knee rotation on a -Y limb sweeps the calf BACKWARD
        // (see header comment). +π/2 folds the calves flat behind the
        // body so the toes/feet end up under the pelvis facing kiblat.
        p.legLeftKnee.rotation.x  = 1.55;
        p.legRightKnee.rotation.x = 1.55;

        // Torso tips forward ~95° so the head dips BELOW the hip line —
        // overshooting horizontal is what brings the forehead down toward
        // the mat in front of the hands. Stops short of fully folding
        // the body onto the thighs so the belly stays clear.
        p.torso.rotation.x = 1.65;

        // Arms: shoulder counter-rotates the torso bend (-torsoAngle) so
        // the upper arms drop nearly vertically in world space, with a
        // touch less rotation so the arms angle slightly forward to land
        // in front of the head. Outward .z fan keeps the forearms clear
        // of the ribs (lengan menjauhi tulang rusuk).
        p.armLeftShoulder.rotation.x  = -1.50;
        p.armLeftShoulder.rotation.y  = 0;
        p.armLeftShoulder.rotation.z  = 0.40;
        p.armRightShoulder.rotation.x = -1.50;
        p.armRightShoulder.rotation.y = 0;
        p.armRightShoulder.rotation.z = -0.40;
        // Slight elbow bend so the forearms are RAISED above the ground —
        // a defining Sunnah point: "irfa'ū siwā'idakum" (HR. Bukhari–Muslim).
        p.armLeftElbow.rotation.x  = -0.25;
        p.armRightElbow.rotation.x = -0.25;
    }

    // ----- Hand positions (called AFTER stance sub-routines so they win) -----
    _applyHandPosition(p, pose) {
        switch (pose.handPosition) {
            case 'crossed':
                // Sedekap: tangan kanan di atas tangan kiri, di atas dada.
                // Both arms angle forward (-X on local rest = +Z forward),
                // folded at the elbow to bring the hands onto the chest.
                p.armLeftShoulder.rotation.x = -0.30;
                p.armLeftShoulder.rotation.z = 0.35;
                p.armLeftElbow.rotation.x = -1.55;
                p.armRightShoulder.rotation.x = -0.30;
                p.armRightShoulder.rotation.z = -0.35;
                p.armRightElbow.rotation.x = -1.55;
                break;

            case 'knees':
                // Ruku': hands grip the knees. With torso already tipped
                // forward by +1.4 rad, a SHOULDER rotation of about -1.4
                // unwinds it back to vertical in world space so the arms
                // hang straight down to the knees.
                p.armLeftShoulder.rotation.x = -1.40;
                p.armLeftShoulder.rotation.y = 0;
                p.armLeftShoulder.rotation.z = 0.15;
                p.armRightShoulder.rotation.x = -1.40;
                p.armRightShoulder.rotation.y = 0;
                p.armRightShoulder.rotation.z = -0.15;
                p.armLeftElbow.rotation.x = -0.10;
                p.armRightElbow.rotation.x = -0.10;
                break;

            case 'sujud':
                // Handled inside _poseSujud — keep behaviour explicit so
                // future overrides can't reset the cancellation rotation.
                break;

            case 'thighs':
                // Duduk antara dua sujud: telapak tangan di atas paha/lutut.
                // Arm swings forward in local frame (negative .x) so it
                // points downward in world while the rig is upright.
                p.armLeftShoulder.rotation.x = -1.30;
                p.armLeftShoulder.rotation.z = 0.18;
                p.armLeftElbow.rotation.x = -0.20;
                p.armRightShoulder.rotation.x = -1.30;
                p.armRightShoulder.rotation.z = -0.18;
                p.armRightElbow.rotation.x = -0.20;
                break;

            case 'tasyahud':
                // Tasyahud akhir: tangan kanan di atas paha kanan dengan
                // telunjuk diisyaratkan ke kiblat. Tangan kiri menggenggam
                // lutut kiri. Untuk simplifikasi: tangan kanan sedikit lebih
                // ke depan untuk memberi kesan isyarat.
                p.armLeftShoulder.rotation.x = -1.30;
                p.armLeftShoulder.rotation.z = 0.18;
                p.armLeftElbow.rotation.x = -0.20;
                p.armRightShoulder.rotation.x = -1.35;
                p.armRightShoulder.rotation.z = -0.18;
                p.armRightElbow.rotation.x = -0.30;
                break;

            case 'up':
                // Takbir: kedua tangan diangkat sejajar bahu/telinga,
                // telapak menghadap kiblat. Shoulders rotate strongly
                // backward in local frame (positive .x) so the upper arms
                // swing UP from their resting -Y position.
                p.armLeftShoulder.rotation.x = -1.55;   // swing arm forward
                p.armLeftShoulder.rotation.z = 1.55;    // then rotate sideways UP
                p.armLeftElbow.rotation.x = -0.40;
                p.armRightShoulder.rotation.x = -1.55;
                p.armRightShoulder.rotation.z = -1.55;
                p.armRightElbow.rotation.x = -0.40;
                break;

            case 'down':
            default:
                // Posisi netral berdiri — kedua tangan turun di samping
                // badan. Apply pose.armLeftShoulder if specified, else
                // default to a near-zero shoulder rotation.
                if (!pose.armLeftShoulder && !pose.sujud) {
                    p.armLeftShoulder.rotation.x = 0;
                    p.armLeftShoulder.rotation.z = 0.05;
                    p.armRightShoulder.rotation.x = 0;
                    p.armRightShoulder.rotation.z = -0.05;
                    p.armLeftElbow.rotation.x = 0;
                    p.armRightElbow.rotation.x = 0;
                }
                break;
        }
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
            const hipY = (pose) => {
                if (pose.sujud)    return 0.48;
                if (pose.tawarruk) return 0.40;
                if (pose.sitting)  return 0.55;
                return 1.0;
            };
            const torsoAngle = (pose) => {
                if (pose.sujud) return 1.45;     // forward ~83°
                return pose.torsoAngle || 0;
            };
            this.parts.hip.position.y = lerp(hipY(from), hipY(to), ease);
            this.parts.torso.rotation.x = lerp(torsoAngle(from), torsoAngle(to), ease);
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
        this.cameraAngle = Math.PI * 3 / 4;
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
