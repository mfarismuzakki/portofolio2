// Advanced interactivity: typing, particles, scroll progress, nav blur, tilt, counters
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Typing effect
  function typing(el, items, speed=70, hold=1200){
    if (!el || !items || items.length===0) return;
    let i=0, pos=0, dir=1; // dir: 1 typing, -1 deleting
    function step(){
      const word = items[i];
      pos += dir;
      el.textContent = word.slice(0, pos);
      if (dir>0 && pos===word.length){
        setTimeout(()=>{ dir=-1; step(); }, hold);
        return;
      }
      if (dir<0 && pos===0){ i=(i+1)%items.length; dir=1; }
      setTimeout(step, prefersReduced? 300 : (dir>0 ? speed : Math.max(20, speed-40)) );
    }
    step();
  }
  const typingEl = document.querySelector('.typing-text');
  if (typingEl){
    const roles = (typingEl.dataset.roles || 'Full Stack Developer,Data Engineer,Machine Learning').split(',');
    typing(typingEl, roles.map(s=>s.trim()));
  }

  // Particles
  const canvas = document.getElementById('particles-canvas');
  if (canvas && !prefersReduced){
    const ctx = canvas.getContext('2d');
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    let W=0,H=0; let particles=[]; const COUNT=70;
    function resize(){
      const b = canvas.getBoundingClientRect();
      W = canvas.width = b.width*DPR; H = canvas.height = b.height*DPR; ctx.scale(DPR, DPR);
    }
    function make(){
      particles = new Array(COUNT).fill(0).map(()=>({
        x: Math.random()*canvas.clientWidth,
        y: Math.random()*canvas.clientHeight,
        vx:(Math.random()-.5)*0.6, vy:(Math.random()-.5)*0.6,
        r: Math.random()*2+0.5,
        a: Math.random()*0.6+0.2
      }));
    }
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.save();
      for(const p of particles){
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<-10||p.x>canvas.clientWidth+10) p.vx*=-1;
        if(p.y<-10||p.y>canvas.clientHeight+10) p.vy*=-1;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = '#8fb0ff';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();
      requestAnimationFrame(draw);
    }
    const ro = new ResizeObserver(()=>resize());
    ro.observe(canvas);
    resize(); make(); draw();
  }

  // Scroll progress + navbar blur
  const progress = document.getElementById('scroll-progress');
  const header = document.querySelector('header');
  function onScroll(){
    const y = window.scrollY || window.pageYOffset;
    if (header){ header.classList.toggle('nav-blur', y>10); }
    if (progress){
      const h = document.documentElement;
      const scrolled = (h.scrollTop)/(h.scrollHeight - h.clientHeight) * 100;
      progress.style.width = scrolled + '%';
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Tilt effect for modern cards
  const tiltNodes = document.querySelectorAll('.modern-card');
  tiltNodes.forEach(node => {
    let rect;
    function enter(){ rect = node.getBoundingClientRect(); node.style.transition = 'transform .15s ease'; }
    function move(e){
      if (prefersReduced) return;
      const x = (e.clientX - rect.left)/rect.width - 0.5;
      const y = (e.clientY - rect.top)/rect.height - 0.5;
      node.style.transform = `rotateX(${(-y*6).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg)`;
    }
    function leave(){ node.style.transform = 'rotateX(0) rotateY(0)'; }
    node.addEventListener('mouseenter', enter);
    node.addEventListener('mousemove', move);
    node.addEventListener('mouseleave', leave);
  });

  // Counter up
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length){
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target; const target = +el.getAttribute('data-count');
        const start = performance.now(); const dur = 1100;
        function frame(now){
          const t = Math.min(1, (now-start)/dur);
          el.textContent = Math.floor(target * (t*t*(3-2*t))); // ease in-out
          if (t<1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => io.observe(el));
  }
})();
