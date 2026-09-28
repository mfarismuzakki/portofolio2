// Procedural teaching model. World: +Y up, -Z qibla, +X person's right.
// Explicit contact points keep the palms, knees and toes on the prayer mat.
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
        if(!this.T) throw new Error('Peraga 3D belum dapat dimuat. Periksa koneksi, lalu muat ulang.');
        const T=this.T;
        this.scene=new T.Scene(); this.scene.background=new T.Color('#e5ddd0'); this.scene.fog=new T.Fog('#e5ddd0',9,24);
        this.camera=new T.PerspectiveCamera(38,1,.1,40);
        const smallScreen=matchMedia('(max-width: 700px)').matches;
        this.renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'}); this.renderer.setPixelRatio(Math.min(devicePixelRatio,smallScreen?1.5:2));
        this.renderer.outputEncoding=T.sRGBEncoding; this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;this.renderer.shadowMap.enabled=true; this.renderer.shadowMap.type=T.PCFSoftShadowMap;
        this.scene.add(new T.HemisphereLight(0xfffaf1,0x777365,.65));
        const sun=new T.DirectionalLight(0xffeed4,.85); sun.position.set(-3,7,-4);sun.castShadow=true;
        sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-4;sun.shadow.camera.right=4;sun.shadow.camera.top=4;sun.shadow.camera.bottom=-4;sun.shadow.bias=-.0003;this.scene.add(sun);
        this.renderer.shadowMap.autoUpdate=false;
        this.mats={cloth:this.mat('#a1ad94'),pants:this.mat('#d1c8b3'),skin:this.mat('#b78464'),trim:this.mat('#b5955e'),wall:this.mat('#e8deca'),green:this.mat('#285b50'),dark:this.mat('#23483f'),cap:this.mat('#f2ebdd')};
        this.meshes={};this.room();this.figure(); this.angle=2.25;this.pitch=.18;this.radius=4.4;this.rotate=false;
        this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas.parentElement);
        canvas.addEventListener('pointerdown',e=>{this.drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);this.rotate=false;});
        canvas.addEventListener('pointermove',e=>{if(!this.drag)return;this.angle-=(e.clientX-this.drag.x)*.009;this.pitch=Math.max(.04,Math.min(.8,this.pitch+(e.clientY-this.drag.y)*.004));this.drag={x:e.clientX,y:e.clientY};this.requestRender();});
        const end=()=>this.drag=null;canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
        canvas.addEventListener('lostpointercapture',end);
        canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.contextLost=true;this.stop();this.onStatus?.('Tampilan 3D terhenti. Tekan Pulihkan tampilan. Bacaan dan tombol langkah tetap tersedia.');});
        canvas.addEventListener('webglcontextrestored',()=>{this.contextLost=false;this.renderer.shadowMap.needsUpdate=true;this.onStatus?.('');this.start();});
    }
    mat(color){return new this.T.MeshStandardMaterial({color,roughness:.88});}
    mesh(geometry,material,parent=this.scene){const m=new this.T.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
    box(x,y,z,material,pos,parent){const m=this.mesh(new this.T.BoxGeometry(x,y,z),material,parent);m.position.set(...pos);return m;}
    arch(x,z,rotation=0){
        const T=this.T,g=new T.Group();g.position.set(x,0,z);g.rotation.y=rotation;this.scene.add(g);
        this.box(.18,2.3,.20,this.mats.wall,[-.84,1.15,0],g);this.box(.18,2.3,.20,this.mats.wall,[.84,1.15,0],g);
        const curve=new T.EllipseCurve(0,2.3,.84,.92,0,Math.PI,false,0);
        const points=curve.getPoints(36).map(p=>new T.Vector3(p.x,p.y,0));
        this.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),40,.1,8,false),this.mats.wall,g);
        const inner=this.box(1.48,2.7,.08,this.mats.green,[0,1.38,.14],g);
        for(let j=-3;j<=3;j++)this.box(.018,2.2,.025,this.mats.trim,[j*.18,1.4,.08],g);
        inner.castShadow=false;
    }
    room(){
        const T=this.T,m=this.mats;
        this.box(24,.06,24,this.mat('#d2c8b4'),[0,-.05,0]);
        this.box(14,4.6,.15,m.wall,[0,2.3,4]);
        for(let x=-5;x<=5;x+=2)this.arch(x,3.86);
        this.box(.15,4.6,12,m.wall,[-5,2.3,0]);
        for(let z=-4;z<=3;z+=2.5)this.arch(-4.86,z,Math.PI/2);
        for(let x=-4;x<=4;x+=2){this.box(.2,3.8,.2,m.wall,[x,1.9,2.5]);this.box(.38,.12,.38,m.trim,[x,2.9,2.5]);}
        for(let z=-3;z<5;z+=1.7){this.box(10,.012,1.5,this.mat('#728e7a'),[0,.001,z]);this.box(10,.016,.035,m.trim,[0,.009,z-.72]);}
        this.box(1.12,.025,2.3,m.green,[0,.021,-.38]);
        for(const x of [-.51,.51])this.box(.025,.008,2.19,m.trim,[x,.038,-.38]);
        for(const z of [-1.43,.67])this.box(1.03,.008,.025,m.trim,[0,.038,z]);
        const marker=new T.Shape();marker.moveTo(-.12,0);marker.lineTo(0,.2);marker.lineTo(.12,0);marker.closePath();
        const arrow=this.mesh(new T.ShapeGeometry(marker),m.trim);arrow.rotation.x=-Math.PI/2;arrow.position.set(0,.047,-1.26);
        // Mihrab is on the qibla wall, in front of the worshipper.
        this.box(10,4.6,.12,m.wall,[0,2.3,-5]); this.arch(0,-4.9,Math.PI);
    }
    figure(){
        const T=this.T,m=this.mats;
        const tube=(name,r,material)=>this.meshes[name]=this.mesh(new T.CylinderGeometry(r*.92,r,1,24),material);
        tube('torso',.24,m.cloth);this.meshes.torso.geometry.scale(1,1,.66);
        this.meshes.hem=this.mesh(new T.CylinderGeometry(.235,.26,.31,32),m.cloth);this.meshes.hem.scale.z=.68;
        tube('neck',.057,m.skin);
        this.meshes.shoulders=this.mesh(new T.SphereGeometry(1,24,20),m.cloth);this.meshes.shoulders.scale.set(.25,.10,.145);
        this.head=new T.Group();this.scene.add(this.head);
        const skull=this.mesh(new T.SphereGeometry(1,32,24),m.skin,this.head);skull.scale.set(.12,.165,.125);
        const nose=this.mesh(new T.SphereGeometry(.027,16,12),m.skin,this.head);nose.scale.set(.6,1,1);nose.position.set(0,-.012,-.126);
        for(const side of [-1,1]){const ear=this.mesh(new T.SphereGeometry(1,16,12),m.skin,this.head);ear.scale.set(.018,.035,.024);ear.position.set(side*.12,0,0);}
        const cap=this.mesh(new T.SphereGeometry(.123,32,16,0,Math.PI*2,0,1.08),m.cap,this.head);cap.position.y=.051;
        for(const s of ['L','R']){
            tube('thigh'+s,.105,m.pants);tube('shin'+s,.079,m.pants);tube('upper'+s,.075,m.cloth);tube('fore'+s,.061,m.cloth);
            this.meshes['shoulder'+s]=this.mesh(new T.SphereGeometry(.081,24,18),m.cloth);
            this.meshes['knee'+s]=this.mesh(new T.SphereGeometry(.102,24,18),m.pants);
            this.meshes['elbow'+s]=this.mesh(new T.SphereGeometry(.074,24,18),m.cloth);
            this.meshes['foot'+s]=this.mesh(new T.SphereGeometry(1,20,16),m.skin);
            for(let i=0;i<5;i++)this.meshes['toe'+s+i]=this.mesh(new T.SphereGeometry(.013,12,10),m.skin);
            const hand=new T.Group(); this.scene.add(hand);this.meshes['hand'+s]=hand;
            const palm=this.mesh(new T.SphereGeometry(1,20,16),m.skin,hand);palm.scale.set(.041,.057,.019);
            for(let i=0;i<4;i++){const finger=this.mesh(new T.CylinderGeometry(.008,.009,.065-(i===3?.012:0),10),m.skin,hand);finger.position.set((i-1.5)*.021,.068,0);this.meshes['finger'+s+i]=finger;}
            const thumb=this.mesh(new T.SphereGeometry(1,12,12),m.skin,hand);thumb.scale.set(.013,.032,.017);thumb.position.set(s==='R'?-.046:.046,.005,0);
        }
    }
    segment(name,a,b){const T=this.T,v=new T.Vector3(...b).sub(new T.Vector3(...a));const m=this.meshes[name];m.position.set(...a).addScaledVector(v,.5);m.scale.y=v.length();m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());}
    apply(p){
        this.current=p;this.segment('torso',p.hip,p.chest);this.meshes.hem.position.set(...p.hip);this.meshes.hem.quaternion.copy(this.meshes.torso.quaternion);
        this.meshes.shoulders.position.set(...p.chest);this.meshes.shoulders.quaternion.copy(this.meshes.torso.quaternion);
        this.segment('neck',p.chest,p.head);
        this.head.position.set(...p.head);this.head.rotation.set(p.tilt,p.turn,0);
        for(const s of ['L','R']){
            this.segment('thigh'+s,p['hip'+s],p['knee'+s]);this.segment('shin'+s,p['knee'+s],p['ankle'+s]);
            this.segment('upper'+s,p['shoulder'+s],p['elbow'+s]);this.segment('fore'+s,p['elbow'+s],p['wrist'+s]);
            for(const j of ['shoulder','knee','elbow'])this.meshes[j+s].position.set(...p[j+s]);
            const a=p['ankle'+s],b=p['toe'+s],v=new this.T.Vector3(...b).sub(new this.T.Vector3(...a));
            const foot=this.meshes['foot'+s];foot.position.set(...a).addScaledVector(v,.5);foot.scale.set(.065,v.length()*.6,.042);foot.quaternion.setFromUnitVectors(new this.T.Vector3(0,1,0),v.normalize());
            const cross=new this.T.Vector3(v.z,0,-v.x).normalize();
            for(let i=0;i<5;i++)this.meshes['toe'+s+i].position.set(...b).addScaledVector(cross,(i-2)*.023);
            const hand=this.meshes['hand'+s];hand.position.set(...p['wrist'+s]);hand.rotation.set(...p['handEuler'+s]);
            for(let i=0;i<4;i++){const f=this.meshes['finger'+s+i];f.scale.y=p.hands==='tasyahud'&&s==='R'&&i!==0?.35:1;f.position.y=f.scale.y===1?.068:.040;}
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
