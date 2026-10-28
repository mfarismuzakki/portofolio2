// Procedural teaching model. World: +Y up, -Z qibla, +X person's right.
// Explicit contact points keep the palms, knees and toes on the prayer mat.
import { t } from '../../i18n/index.js';
export function sampleTransition(path, elapsed, duration) {
    // A queued RAF can predate the input event that started a new transition.
    // Never use a negative segment index, including after rapid pose changes.
    const progress = Math.max(0, Math.min(1, elapsed / Math.max(1, duration)));
    if (progress === 0) return { pose: path[0], complete: false };
    if (progress === 1) return { pose: path[path.length - 1], complete: true };
    const position = progress * (path.length - 1);
    const index = Math.min(Math.floor(position), path.length - 2);
    const fraction = position - index;
    const blend = fraction * fraction * (3 - 2 * fraction);
    const from = path[index], to = path[index + 1], pose = {};
    for (const key of Object.keys(to)) {
        pose[key] = Array.isArray(to[key])
            ? to[key].map((value, axis) => from[key][axis] + (value - from[key][axis]) * blend)
            : typeof to[key] === 'number'
                ? from[key] + (to[key] - from[key]) * blend
                : blend < .5 ? from[key] : to[key];
    }
    return { pose, complete: progress === 1 };
}

export function posture(pose) {
    const p = { hip:[0,.91,0], chest:[0,1.45,0], head:[0,1.73,-.02], tilt:pose.head?.tilt || 0, turn:pose.head?.turn || 0, hands:pose.arms };
    const seated = pose.body === 'iftirasy';
    if (pose.body === 'ruku') Object.assign(p,{hip:[0,.94,.08],chest:[0,.94,-.49],head:[0,.94,-.78],tilt:-Math.PI/2});
    if (seated) Object.assign(p,{hip:[0,.32,.13],chest:[0,.86,.13],head:[0,1.14,.1]});
    if (pose.body === 'kneel') Object.assign(p,{hip:[0,.51,.10],chest:[0,1.05,.10],head:[0,1.33,.07]});
    if (pose.body === 'sujud') Object.assign(p,{hip:[0,.51,.10],chest:[0,.30,-.43],head:[0,.166,-.69],tilt:-2.026});
    for (const [side,s] of [['L',-1],['R',1]]) {
        p['hip'+side]=[s*.125,p.hip[1],p.hip[2]];
        p['knee'+side]=[s*.14,.5,0]; p['ankle'+side]=[s*.14,.12,0]; p['toe'+side]=[s*.14,.045,-.15];
        if(seated || pose.body==='sujud' || pose.body==='kneel') {
            p['knee'+side]=[s*.16,.105,seated?-.22:-.10];
            p['ankle'+side]=[s*.16,.16,.30]; p['toe'+side]=[s*.16,.045,.25];
            if(seated && side==='L') { p.ankleL=[-.04,.08,.28]; p.toeL=[.10,.045,.35]; }
        }
        p['shoulder'+side]=[s*.23,p.chest[1]-.01,p.chest[2]];
        p['elbow'+side]=[s*.29,p.chest[1]-.29,p.chest[2]];
        p['wrist'+side]=[s*.27,p.chest[1]-.52,p.chest[2]-.02];
        if(pose.arms==='takbir') {p['elbow'+side]=[s*.36,1.18,-.07];p['wrist'+side]=[s*.34,1.51,-.14];}
        if(pose.arms==='sedekap') {p['elbow'+side]=[s*.28,1.16,-.11];p['wrist'+side]=[-s*.035,1.30+(side==='R'?.035:0),-.20-(side==='R'?.045:0)];}
        if(pose.arms==='knees') {p['elbow'+side]=[s*.195,.73,-.268];p['wrist'+side]=[s*.16,.53,-.045];}
        if(pose.arms==='sujud') {p['elbow'+side]=[s*.40,.30,-.46];p['wrist'+side]=[s*.30,.053,-.70];}
        if(pose.arms==='thighs'||pose.arms==='tasyahud') {p['elbow'+side]=[s*.25,.56,.08];p['wrist'+side]=[s*.16,.23,-.17];}
        p['handEuler'+side]=pose.arms==='takbir'?[0,0,0]
            :pose.arms==='sedekap'?[0,0,side==='R'?Math.PI/2:-Math.PI/2]
            :pose.arms==='down'?[0,side==='R'?Math.PI/2:-Math.PI/2,Math.PI]
            :[-Math.PI/2,0,0];
    }
    return p;
}

export default class MosqueScene {
    constructor(canvas) {
        this.canvas=canvas; this.T=window.THREE;
        if(!this.T) throw new Error(t('sholat.errorThreeLoad'));
        const T=this.T;
        this.scene=new T.Scene(); this.scene.background=new T.Color('#f5efe3'); this.scene.fog=new T.Fog('#f5efe3',18,48);
        this.camera=new T.PerspectiveCamera(38,1,.1,40);
        const smallScreen=matchMedia('(max-width: 700px)').matches;
        this.renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'}); this.renderer.setPixelRatio(Math.min(devicePixelRatio,smallScreen?1.5:2));
        this.renderer.outputEncoding=T.sRGBEncoding; this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.08;this.renderer.shadowMap.enabled=true; this.renderer.shadowMap.type=T.PCFSoftShadowMap;
        this.scene.add(new T.HemisphereLight(0xfffaf1,0x9caf9f,.82));
        const sun=new T.DirectionalLight(0xffe6bd,1.15); sun.position.set(-3.5,7,2.5);sun.castShadow=true;
        sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-4;sun.shadow.camera.right=4;sun.shadow.camera.top=4;sun.shadow.camera.bottom=-4;sun.shadow.camera.near=.5;sun.shadow.camera.far=16;sun.shadow.bias=-.0003;sun.shadow.normalBias=.018;this.scene.add(sun);
        this.renderer.shadowMap.autoUpdate=false;
        this.mats={cloth:this.mat('#f6f1e5'),clothShade:this.mat('#e7e3d7'),trouser:this.mat('#dedbd0'),skin:this.mat('#b98262'),skinLight:this.mat('#ca9a79'),beard:this.mat('#382d26'),gold:this.mat('#b08a3e'),goldLight:this.mat('#e0c27f'),wall:this.mat('#e9dcc3'),wallShade:this.mat('#cdbd9c'),carpet:this.mat('#d8e9df'),sage:this.mat('#83a894'),deepGreen:this.mat('#1f4c3d'),mint:this.mat('#dcebe3'),cap:this.mat('#f8f5ea')};
        this.meshes={};this.room();this.figure(); this.angle=2.25;this.pitch=.18;this.radius=4.4;this.rotate=false;
        this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas.parentElement);
        canvas.addEventListener('pointerdown',e=>{this.drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);this.rotate=false;});
        canvas.addEventListener('pointermove',e=>{if(!this.drag)return;this.angle-=(e.clientX-this.drag.x)*.009;this.pitch=Math.max(.04,Math.min(.8,this.pitch+(e.clientY-this.drag.y)*.004));this.drag={x:e.clientX,y:e.clientY};this.requestRender();});
        const end=()=>this.drag=null;canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
        canvas.addEventListener('lostpointercapture',end);
        canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.contextLost=true;this.stop();this.onStatus?.(t('sholat.webglLost'));});
        canvas.addEventListener('webglcontextrestored',()=>{this.contextLost=false;this.renderer.shadowMap.needsUpdate=true;this.onStatus?.('');this.start();});
    }
    mat(color){return new this.T.MeshStandardMaterial({color,roughness:.88});}
    mesh(geometry,material,parent=this.scene){const m=new this.T.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
    box(x,y,z,material,pos,parent){const m=this.mesh(new this.T.BoxGeometry(x,y,z),material,parent);m.position.set(...pos);return m;}
    arch(x,z,rotation=0){
        const T=this.T,g=new T.Group();g.position.set(x,0,z);g.rotation.y=rotation;this.scene.add(g);
        const wall=this.mats.wall,shade=this.mats.wallShade,gold=this.mats.goldLight;
        this.box(.24,2.5,.32,wall,[-.94,1.25,0],g);this.box(.24,2.5,.32,wall,[.94,1.25,0],g);
        this.box(.34,.12,.42,shade,[-.94,.10,0],g);this.box(.34,.12,.42,shade,[.94,.10,0],g);
        this.box(.38,.13,.46,gold,[-.94,2.36,0],g);this.box(.38,.13,.46,gold,[.94,2.36,0],g);
        const curve=new T.EllipseCurve(0,2.32,.94,.98,0,Math.PI,false,0);
        const points=curve.getPoints(28).map(p=>new T.Vector3(p.x,p.y,0));
        this.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),32,.12,8,false),wall,g);
    }
    mihrab(){
        const T=this.T,g=new T.Group();g.position.set(0,0,-4.915);this.scene.add(g);
        const niche=new T.Shape();niche.moveTo(-1.18,.34);niche.lineTo(-1.18,2.18);niche.absarc(0,2.18,1.18,Math.PI,0,false);niche.lineTo(1.18,.34);niche.closePath();
        const back=this.mesh(new T.ShapeGeometry(niche,32),this.mats.deepGreen,g);back.castShadow=false;back.receiveShadow=false;
        const goldPath=[new T.Vector3(-1.18,.34,.016),new T.Vector3(-1.18,2.18,.016)];
        new T.EllipseCurve(0,2.18,1.18,1.18,Math.PI,0,false).getPoints(32).forEach(p=>goldPath.push(new T.Vector3(p.x,p.y,.016)));
        goldPath.push(new T.Vector3(1.18,.34,.016));
        const outline=this.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(goldPath),48,.026,6,false),this.mats.goldLight,g);outline.castShadow=false;
        const lineMat=new T.LineBasicMaterial({color:'#b08a3e',transparent:true,opacity:.38});
        for(let row=0;row<4;row++)for(let col=-2;col<=2;col++){
            const x=col*.34+(row%2?.17:0),y=.78+row*.32;
            if(Math.abs(x)+Math.max(0,y-2.18)*.75>1.01)continue;
            const diamond=new T.BufferGeometry().setFromPoints([new T.Vector3(x,y+.105,.024),new T.Vector3(x+.105,y,.024),new T.Vector3(x,y-.105,.024),new T.Vector3(x-.105,y,.024),new T.Vector3(x,y+.105,.024)]);
            g.add(new T.Line(diamond,lineMat));
        }
        this.box(2.48,.09,.10,this.mats.gold,[0,.31,.01],g);
    }
    room(){
        const T=this.T,m=this.mats;
        this.box(24,.06,24,m.mint,[0,-.05,0]);
        this.box(14,4.6,.18,m.wall,[0,2.3,4]);
        for(const x of [-3.65,-2.25,2.25,3.65])this.arch(x,-4.80);
        this.box(.18,4.6,12,m.wall,[-5,2.3,0]);
        for(let z=-3.5;z<=3;z+=2.5)this.arch(-4.82,z,Math.PI/2);
        for(let z=-3.9;z<4.5;z+=1.72){
            this.box(9.9,.014,1.48,m.carpet,[0,.005,z]);
            this.box(9.9,.018,.026,m.sage,[0,.017,z-.70]);
            this.box(9.9,.008,.012,m.sage,[0,.026,z+.68]);
        }
        this.box(1.18,.032,2.36,m.deepGreen,[0,.028,-.38]);
        for(const x of [-.53,.53])this.box(.03,.012,2.22,m.goldLight,[x,.051,-.38]);
        for(const z of [-1.46,.70])this.box(1.08,.012,.03,m.goldLight,[0,.051,z]);
        const matArch=new T.EllipseCurve(0,-.82,.24,.24,0,Math.PI,false,0).getPoints(18).map(p=>new T.Vector3(p.x,.057,p.y));
        const matMotif=this.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(matArch),24,.014,5,false),m.goldLight);matMotif.position.z=-.52;matMotif.castShadow=false;
        this.box(10,4.6,.16,m.wall,[0,2.3,-5]);this.mihrab();
    }
    figure(){
        const T=this.T,m=this.mats;
        const capsule=(top,bottom,material,radial=20)=>{
            const points=[new T.Vector2(0,-.5),new T.Vector2(bottom*.76,-.5),new T.Vector2(bottom,-.5+bottom*.55),new T.Vector2(bottom,.5-top*.55),new T.Vector2(top*.76,.5),new T.Vector2(0,.5)];
            return new T.LatheGeometry(points,radial);
        };
        const limb=(name,top,bottom,material)=>this.meshes[name]=this.mesh(capsule(top,bottom,material),material);
        limb('torso',.235,.27,m.cloth,24);this.meshes.torso.scale.z=.72;
        const robeProfile=[new T.Vector2(0,-.5),new T.Vector2(.305,-.5),new T.Vector2(.295,-.42),new T.Vector2(.235,-.04),new T.Vector2(.245,.20),new T.Vector2(.285,.39),new T.Vector2(.265,.5),new T.Vector2(0,.5)];
        this.meshes.robe=this.mesh(new T.LatheGeometry(robeProfile,28),m.cloth);this.meshes.robe.scale.z=.80;
        limb('neck',.062,.065,m.skin,16);
        this.meshes.shoulders=this.mesh(new T.SphereGeometry(1,24,18),m.cloth);this.meshes.shoulders.scale.set(.295,.12,.18);
        this.head=new T.Group();this.scene.add(this.head);
        const skull=this.mesh(new T.SphereGeometry(1,28,20),m.skin,this.head);skull.scale.set(.125,.17,.13);
        const nose=this.mesh(new T.SphereGeometry(.027,14,10),m.skinLight,this.head);nose.scale.set(.55,1,1);nose.position.set(0,-.008,-.13);
        for(const side of [-1,1]){const ear=this.mesh(new T.SphereGeometry(1,14,10),m.skin,this.head);ear.scale.set(.018,.032,.022);ear.position.set(side*.125,-.004,0);}
        // Short beard: a shell over the lower jaw (below the mouth line), front and sides only.
        // phi PI-0.35 .. 2PI+0.35 covers the -Z (face) half plus the cheeks; theta 1.95 .. PI is the jaw.
        const beard=this.mesh(new T.SphereGeometry(1,28,10,Math.PI-.35,Math.PI+.7,1.95,Math.PI-1.95),m.beard,this.head);
        beard.scale.set(.133,.178,.139);beard.castShadow=false;
        const cap=this.mesh(new T.SphereGeometry(.13,28,16,0,Math.PI*2,0,1.12),m.cap,this.head);cap.position.y=.052;
        for(let i=0;i<3;i++){const rib=this.mesh(new T.TorusGeometry(.113-i*.007,.004,5,22),m.clothShade,this.head);rib.rotation.x=Math.PI/2;rib.position.y=.022+i*.028;}
        for(const s of ['L','R']){
            limb('thigh'+s,.095,.085,m.trouser);limb('shin'+s,.064,.058,m.trouser);limb('upper'+s,.078,.112,m.cloth);limb('fore'+s,.058,.079,m.cloth);
            for(const joint of ['shoulder','knee','elbow']){const anchor=new T.Object3D();anchor.visible=false;this.scene.add(anchor);this.meshes[joint+s]=anchor;}
            this.meshes['foot'+s]=this.mesh(new T.SphereGeometry(1,18,14),m.skin);
            for(let i=0;i<5;i++)this.meshes['toe'+s+i]=this.mesh(new T.SphereGeometry(.012,10,8),m.skinLight);
            const hand=new T.Group(); this.scene.add(hand);this.meshes['hand'+s]=hand;
            this.meshes['cuff'+s]=this.mesh(new T.CylinderGeometry(.070,.074,.068,16),m.clothShade);
            const palm=this.mesh(new T.SphereGeometry(1,18,14),m.skin,hand);palm.scale.set(.052,.068,.028);
            for(let i=0;i<4;i++){const finger=this.mesh(capsule(.010,.011,m.skin,10),m.skin,hand);finger.scale.y=.066-(i===3?.013:0);finger.position.set((i-1.5)*.023,.088,0);this.meshes['finger'+s+i]=finger;}
            const thumb=this.mesh(capsule(.012,.014,m.skin,10),m.skin,hand);thumb.scale.set(.9,.046,.9);thumb.position.set(s==='R'?-.056:.056,.020,0);thumb.rotation.z=s==='R'?.65:-.65;
        }
    }
    segment(name,a,b){const T=this.T,v=new T.Vector3(...b).sub(new T.Vector3(...a));const m=this.meshes[name];m.position.set(...a).addScaledVector(v,.5);m.scale.y=v.length();m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());}
    apply(p){
        this.current=p;this.segment('torso',p.hip,p.chest);
        // Keep the skirt attached to the hips: the torso alone follows the bowed back.
        // It falls vertically in ruku and follows the thighs only once the worshipper kneels.
        const kneeling=p.hip[1]<.7;
        const kneeMid=[0,(p.kneeL[1]+p.kneeR[1])*.5,(p.kneeL[2]+p.kneeR[2])*.5];
        const bowing=Math.abs(p.chest[1]-p.hip[1])<.08&&p.hip[1]>=.7;
        const robeBottom=kneeling
            ? [0,Math.max(.095,kneeMid[1]+.008),kneeMid[2]]
            : [0,.30,p.hip[2]];
        const robeTop=p.hip;
        this.segment('robe',robeBottom,robeTop);
        this.meshes.shoulders.position.set(...p.chest);this.meshes.shoulders.quaternion.copy(this.meshes.torso.quaternion);
        this.segment('neck',p.chest,p.head);
        this.head.position.set(...p.head);this.head.rotation.set(p.tilt,p.turn,0);
        for(const s of ['L','R']){
            this.segment('thigh'+s,p['hip'+s],p['knee'+s]);this.segment('shin'+s,p['knee'+s],p['ankle'+s]);
            this.segment('upper'+s,p['shoulder'+s],p['elbow'+s]);this.segment('fore'+s,p['elbow'+s],p['wrist'+s]);
            const cuff=this.meshes['cuff'+s],forearm=this.meshes['fore'+s],wrist=p['wrist'+s],cuffAxis=new this.T.Vector3(0,1,0).applyQuaternion(forearm.quaternion);cuff.position.set(...wrist).addScaledVector(cuffAxis,-.034);cuff.quaternion.copy(forearm.quaternion);
            for(const j of ['shoulder','knee','elbow'])this.meshes[j+s].position.set(...p[j+s]);
            const a=p['ankle'+s],b=p['toe'+s],v=new this.T.Vector3(...b).sub(new this.T.Vector3(...a));
            const foot=this.meshes['foot'+s];foot.position.set(...a).addScaledVector(v,.5);foot.scale.set(.065,v.length()*.6,.042);foot.quaternion.setFromUnitVectors(new this.T.Vector3(0,1,0),v.normalize());
            const cross=new this.T.Vector3(v.z,0,-v.x).normalize();
            for(let i=0;i<5;i++)this.meshes['toe'+s+i].position.set(...b).addScaledVector(cross,(i-2)*.023);
            const hand=this.meshes['hand'+s];hand.position.set(...p['wrist'+s]);hand.rotation.set(...p['handEuler'+s]);
            for(let i=0;i<4;i++){const f=this.meshes['finger'+s+i],length=(p.hands==='tasyahud'&&s==='R'&&i!==0)?.024:.066-(i===3?.013:0);f.scale.y=length;f.position.y=length>.03?.088:.042;}
        }
        this.renderer.shadowMap.needsUpdate=true;
    }
    setPose(spec,animate=true,via=[]){
        const target=posture(spec);const from=this.current&&Object.fromEntries(Object.entries(this.current).map(([key,value])=>[key,Array.isArray(value)?[...value]:value]));this.path=animate&&from?[from,...via.map(posture),target]:null;
        this.started=performance.now();this.duration=this.path?(this.path.length-1)*850:0;if(!this.path)this.apply(target);this.requestRender();
    }
    resize(){const w=this.canvas.clientWidth,h=this.canvas.clientHeight;if(!w||!h)return;if(w!==this.width||h!==this.height){this.width=w;this.height=h;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.requestRender();}}
    setView(angle,pitch=.12){this.angle=angle;this.pitch=pitch;this.rotate=false;this.requestRender();}
    setAutoRotate(value){this.rotate=value;this.lastTime=0;this.requestRender();}
    requestRender(){if(this.running&&!this.contextLost&&!this.raf)this.raf=requestAnimationFrame(this.frame);}
    recover(){if(this.contextLost)this.renderer.forceContextRestore();else{this.onStatus?.('');this.start();}}
    frame=(time)=>{
        this.raf=null;
        if(!this.running||this.contextLost)return;
        try {
        const dt=Math.min((time-(this.lastTime||time))/1000,.05);this.lastTime=time;
        if(this.path){const sample=sampleTransition(this.path,time-this.started,this.duration);this.apply(sample.pose);if(sample.complete)this.path=null;}
        if(this.rotate)this.angle+=dt*.18;
        const r=this.radius*(this.camera.aspect<.8?1.12:1);this.camera.position.set(Math.sin(this.angle)*r,1+Math.sin(this.pitch)*r,Math.cos(this.angle)*r-.25);this.camera.lookAt(0,.87,-.28);
        this.renderer.render(this.scene,this.camera);
        if(this.path||this.rotate)this.requestRender();
        } catch(error) {
            this.stop();this.onStatus?.('Tampilan 3D mengalami kendala. Tekan Pulihkan tampilan untuk mencoba lagi.');
            console.error('Prayer scene render failed:',error);
        }
    };
    start(){if(this.contextLost)return;this.running=true;this.lastTime=0;this.resize();this.requestRender();}
    stop(){this.running=false;cancelAnimationFrame(this.raf);this.raf=null;}
}
