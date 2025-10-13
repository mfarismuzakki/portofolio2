/* === Algoritma PrayTimes.js (ringkas, sudah diintegrasikan) === */
// [kode matematis perhitungan sholat — tetap seperti file asli, tidak dipotong]

function D2R(d){return (d*Math.PI)/180;}
function R2D(r){return (r*180)/Math.PI;}
function fixAngle(a){return a - 360*Math.floor(a/360);} 
function fixHour(a){return a - 24*Math.floor(a/24);} 
function dsin(d){
  return Math.sin(D2R(d));
}

function updateLiveInfo(){
  const now = new Date();
  const nowParts = getTimePartsInZone(now, currentTimeZone);
  const nowHours = nowParts.h + nowParts.m/60 + nowParts.s/3600;
  let nextKey = null; let minDiff = Infinity;
  
  for(const k of Object.keys(_perPrayerNorm)){
    const t = _perPrayerNorm[k];
    if(isNaN(t)) continue;
    const diff = t - nowHours;
    if(diff > 0 && diff < minDiff){ minDiff = diff; nextKey = k; }
  }
  if(!nextKey){ nextKey = 'fajr'; }

  document.querySelectorAll('#prayTable tbody tr').forEach(tr=>{
    const key = tr.getAttribute('data-prayer');
    const infoCell = tr.querySelector('td[data-info="'+key+'"]');
    const t = _perPrayerNorm[key];
    if(isNaN(t)){
      infoCell.textContent = '--:--:--';
      tr.style.background = '';
      tr.style.borderLeft = '';
      tr.style.boxShadow = '';
      tr.style.transform = '';
      tr.style.transition = '';
      tr.querySelectorAll('td').forEach(td => {
        td.style.fontWeight = '';
        td.style.color = '';
        td.style.textShadow = '';
        td.style.fontSize = '';
        td.style.fontFamily = '';
      });
      return;
    }
    
    if(key === nextKey && key !== 'sunrise'){
      let diffHours = t - nowHours;
      if(diffHours < 0) diffHours += 24;
      const diffSec = Math.max(0, Math.round(diffHours * 3600));
      infoCell.textContent = formatHMS(diffSec);
      // Apply enhanced highlighting via CSS styling
      tr.style.background = 'linear-gradient(90deg, rgba(0, 255, 255, 0.2), rgba(0, 128, 255, 0.1))';
      tr.style.borderLeft = '4px solid var(--primary-cyan)';
      tr.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1)';
      tr.style.transform = 'scale(1.02)';
      tr.style.transition = 'all 0.3s ease';
      // Enhanced styling for all columns
      tr.querySelectorAll('td').forEach((td, index) => {
        td.style.fontWeight = 'bold';
        td.style.color = 'var(--text-primary)';
        td.style.textShadow = '0 0 8px rgba(0, 255, 255, 0.5)';
        
        if(index === 0) {
          // Prayer name column - most prominent
          td.style.fontSize = '18px';
          td.style.fontFamily = 'var(--font-primary)';
          td.style.color = 'var(--primary-cyan)';
          td.style.fontWeight = '700';
          td.style.textShadow = '0 0 12px rgba(0, 255, 255, 0.9)';
        } else if(index === 1) {
          // Time column - enhanced
          td.style.fontSize = '16px';
          td.style.fontFamily = 'var(--font-primary)';
          td.style.color = 'var(--primary-cyan)';
          td.style.fontWeight = '600';
          td.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.7)';
        }
      });
      // Special styling for countdown cell (Info column)
      infoCell.style.fontSize = '16px';
      infoCell.style.fontFamily = 'var(--font-primary)';
      infoCell.style.color = 'var(--primary-cyan)';
      infoCell.style.fontWeight = '700';
      infoCell.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.8)';
    } else {
      // Syuruq always shows '--:--:--' (no countdown, no "Selesai")
      if(key === 'sunrise'){
        infoCell.textContent = '--:--:--';
      } else if(t <= nowHours) {
        infoCell.textContent = 'Selesai';
      } else {
        infoCell.textContent = '--:--:--';
      }
      // Remove highlighting
      tr.style.background = '';
      tr.style.borderLeft = '';
      tr.style.boxShadow = '';
      tr.style.transform = '';
      tr.style.transition = '';
      // Reset text styling
      tr.querySelectorAll('td').forEach(td => {
        td.style.fontWeight = '';
        td.style.color = '';
        td.style.textShadow = '';
        td.style.fontSize = '';
        td.style.fontFamily = '';
      });
    }
  });
}

function updateNext(times){
  try{ if(countdownTimer) clearTimeout(countdownTimer); }catch(e){}
}

function D2R(d){return (d*Math.PI)/180;}
function R2D(r){return (r*180)/Math.PI;}
function fixAngle(a){return a - 360*Math.floor(a/360);} 
function fixHour(a){return a - 24*Math.floor(a/24);} 
function dsin(d){return Math.sin(D2R(d));}
function dcos(d){return Math.cos(D2R(d));}
function dtan(d){return Math.tan(D2R(d));}
function darcsin(x){return R2D(Math.asin(x));}
function darccos(x){return R2D(Math.acos(x));}
function darctan2(y,x){return R2D(Math.atan2(y,x));}
function darccot(x){return R2D(Math.atan(1/x));}

function getSunPosition(jd,lat,lon){
  var D=jd-2451545.0;
  var g=fixAngle(357.529+0.98560028*D);
  var q=fixAngle(280.459+0.98564736*D);
  var L=fixAngle(q+1.915*dsin(g)+0.020*dsin(2*g));
  var e=23.439-0.00000036*D;
  var RA=darctan2(dcos(e)*dsin(L),dcos(L))/15;
  var eqt=q/15-fixHour(RA);
  var decl=darcsin(dsin(e)*dsin(L));
  return {decl:decl,eqt:eqt};
}
function getJD(date){
  if(date.constructor===Date) date=dateToJulian(date);
  return date;
}
function dateToJulian(date){
  return (Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0)/86400000)+2440587.5;
}
// Local PrayTimes calculation (kept as fallback)
function getPrayerTimes(date,lat,lon,timezone,method){
  var params={fajrAngle:20,ishaAngle:18,asrFactor:1}; // Default Kemenag Indonesia
  if(method==="KEMENAG"){params={fajrAngle:20,ishaAngle:18,asrFactor:1};}
  if(method==="ISNA"){params={fajrAngle:15,ishaAngle:15,asrFactor:1};}
  if(method==="Egypt"){params={fajrAngle:19.5,ishaAngle:17.5,asrFactor:1};}
  if(method==="Makkah"){params={fajrAngle:18.5,ishaAngle:90,asrFactor:1};}
  if(method==="Karachi"){params={fajrAngle:18,ishaAngle:18,asrFactor:1};}

  var jDate=getJD(date)-lon/(15*24);
  var D=getSunPosition(jDate,lat,lon).decl;
  var Z=12-fixHour(getSunPosition(jDate,lat,lon).eqt);
  function compute(angle,afterSun){ 
    return Z+(afterSun?1:-1)/15*darccos((-dsin(angle)-dsin(D)*dsin(lat))/(dcos(D)*dcos(lat))); 
  }
  var fajr=compute(params.fajrAngle,false);
  var sunrise=compute(0.833,false);
  var dhuhr=Z;
  var asr=Z+1/15*darccos((dsin(darccot(params.asrFactor+dtan(Math.abs(lat*1-D))))-dsin(D)*dsin(lat))/(dcos(D)*dcos(lat)));
  var maghrib=compute(0.833,true);
  var isha=(params.ishaAngle===90)?maghrib+90/60:compute(params.ishaAngle,true);
  return {fajr:fajr,sunrise:sunrise,dhuhr:dhuhr,asr:asr,maghrib:maghrib,isha:isha};
}

/* === Aladhan API integration === */
const ALADHAN_METHOD_MAP = {
  KEMENAG: 11, // Kemenag Indonesia (closest equivalent in Aladhan API)
  MWL: 3,      // Muslim World League
  ISNA: 2,     // Islamic Society of North America
  Egypt: 5,    // Egyptian
  Makkah: 4,   // Umm al-Qura / Makkah
  Karachi: 1   // University of Karachi
};

async function fetchTimingsFromAladhan(date, lat, lon, methodKey){
  try{
    const methodId = ALADHAN_METHOD_MAP[methodKey] ?? 11; // Default to Kemenag
    const dt = new Date(date);
    const day = dt.getDate(); const month = dt.getMonth()+1; const year = dt.getFullYear();
    const rlat = Math.round(lat*1000)/1000; const rlon = Math.round(lon*1000)/1000;
    const cacheKey = `timings:${year}-${month}-${day}:${rlat},${rlon}:m${methodId}`;
    const cached = localStorage.getItem(cacheKey);
    if(cached){ try{ return JSON.parse(cached); }catch(e){} }
    const url = `https://api.aladhan.com/v1/timings/${Math.floor(dt.getTime()/1000)}?latitude=${lat}&longitude=${lon}&method=${methodId}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('Aladhan fetch failed');
    const body = await res.json();
    if(body && body.code===200 && body.data && body.data.timings){
      const t = body.data.timings;
      function parseToFloat(hm){
        const parts = hm.split(':');
        if(parts.length<2) return NaN;
        return parseInt(parts[0],10) + parseInt(parts[1],10)/60 + (parts[2]?parseInt(parts[2],10)/3600:0);
      }
      const out = {
        fajr: parseToFloat(t.Fajr || t.FAJR || t.fajr),
        sunrise: parseToFloat(t.Sunrise || t.SUNRISE || t.sunrise),
        dhuhr: parseToFloat(t.Dhuhr || t.DHUHR || t.Dhuha || t.dhuhr || t.Zuhr),
        asr: parseToFloat(t.Asr || t.ASR || t.asr),
        maghrib: parseToFloat(t.Maghrib || t.MAGHRIB || t.maghrib),
        isha: parseToFloat(t.Isha || t.ISHA || t.isha)
      };
      const timezone = (body.data.meta && body.data.meta.timezone) ? body.data.meta.timezone : null;
      const hijri = body.data.date && body.data.date.hijri ? body.data.date.hijri : null;
      try{ localStorage.setItem(cacheKey, JSON.stringify({timings: out, timezone: timezone, hijri: hijri})); }catch(e){}
      return {timings: out, timezone: timezone, hijri: hijri};
    }
  }catch(err){
    console.warn('Aladhan API failed, falling back to local calc',err);
  }
  return null;
}

function floatToTime(time){
  if(isNaN(time)) return "--:--";
  time=fixHour(time+0.5/60);
  var h=Math.floor(time); var m=Math.floor((time-h)*60);
  return (h<10?"0":"")+h+":"+(m<10?"0":"")+m;
}

function formatHMS(s){
  if(s<=0) return '00:00:00';
  const h=Math.floor(s/3600); 
  const m=Math.floor((s%3600)/60); 
  const sec=Math.floor(s%60);
  function pad(n){return n<10?('0'+n):n}
  return pad(h)+':'+pad(m)+':'+pad(sec);
}



/* === App utama === */
const prayNames={fajr:"Subuh",sunrise:"Syuruq",dhuhr:"Dzuhur",asr:"Ashar",maghrib:"Maghrib",isha:"Isya"};

let currentLat=null,currentLon=null,currentCity="Lokasi belum ditentukan";
let currentMethod="KEMENAG";
let countdownTimer=null;
let _lastDateStr = (new Date()).toDateString(); // track local day for auto-refresh
let _midnightTimer = null;
let _perPrayerNorm = {}; // store normalized times for live updates
let _liveInterval = null;
let currentTimeZone = null; // IANA timezone name (e.g. 'Asia/Jakarta') from API when available

// Floating Prayer Widget variables
let floatingWidget = null;
let widgetPrayerName = null;
let widgetCountdown = null;
let prayerTableSection = null;
let isWidgetVisible = false;
let currentNextPrayer = null;
let lastDecision = null; // Track intersection observer decisions for stability

// Datalist suggestion helpers (autocomplete by text input)
let _suggestionTimer = null;
let _lastQuery = '';
let _lastResults = [];

// Return {h,m,s} for given date in the specified IANA timezone (fallback to local)
function getTimePartsInZone(date, timeZone){
  try{
    if(timeZone){
      const parts = new Intl.DateTimeFormat('en-GB', {timeZone: timeZone, hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'}).formatToParts(date);
      const hh = parseInt(parts.find(p=>p.type==='hour')?.value || '0',10);
      const mm = parseInt(parts.find(p=>p.type==='minute')?.value || '0',10);
      const ss = parseInt(parts.find(p=>p.type==='second')?.value || '0',10);
      return {h:hh, m:mm, s:ss};
    }
  }catch(e){/* fallthrough to local */}
  return {h: date.getHours(), m: date.getMinutes(), s: date.getSeconds()};
}

// Return offset in hours (may be fractional) for an IANA timezone at given date
function getZoneOffsetHours(timeZone, date=new Date()){
  try{
    if(!timeZone) return -date.getTimezoneOffset()/60;
    const parts = new Intl.DateTimeFormat('en-GB', {timeZone: timeZone, hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'}).formatToParts(date);
    const hh = parseInt(parts.find(p=>p.type==='hour')?.value || '0',10);
    const mm = parseInt(parts.find(p=>p.type==='minute')?.value || '0',10);
    const ss = parseInt(parts.find(p=>p.type==='second')?.value || '0',10);
    const localParts = new Intl.DateTimeFormat('en-GB', {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'}).formatToParts(date);
    const localHH = parseInt(localParts.find(p=>p.type==='hour')?.value || '0',10);
    const localMM = parseInt(localParts.find(p=>p.type==='minute')?.value || '0',10);
    const localSS = parseInt(localParts.find(p=>p.type==='second')?.value || '0',10);
    const zoneTime = hh + mm/60 + ss/3600;
    const localTime = localHH + localMM/60 + localSS/3600;
    let diff = zoneTime - localTime;
    if(diff > 12) diff -= 24;
    if(diff < -12) diff += 24;
    return -date.getTimezoneOffset()/60 + diff;
  }catch(e){
    return -date.getTimezoneOffset()/60;
  }
}

function updateClock(){
  const now=new Date();
  function pad(n){return n<10?('0'+n):n}
  try{
    if(currentTimeZone){
      try{
        const s = now.toLocaleTimeString('en-GB', {timeZone: currentTimeZone, hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'});
        document.getElementById("nowclock").textContent = s;
      }catch(e){
        const hh = pad(now.getHours()); const mm = pad(now.getMinutes()); const ss = pad(now.getSeconds());
        document.getElementById("nowclock").textContent = `${hh}:${mm}:${ss}`;
      }
    } else {
      const hh = pad(now.getHours()); const mm = pad(now.getMinutes()); const ss = pad(now.getSeconds());
      document.getElementById("nowclock").textContent = `${hh}:${mm}:${ss}`;
    }
  }catch(e){
    const hh = pad(now.getHours()); const mm = pad(now.getMinutes()); const ss = pad(now.getSeconds());
    document.getElementById("nowclock").textContent = `${hh}:${mm}:${ss}`;
  }
  const todayStr = now.toDateString();
  if(todayStr !== _lastDateStr){
    _lastDateStr = todayStr;
    renderPrayers();
  }
  setTimeout(updateClock,1000);
}

function setLocation(lat,lon,displayName,timezone=null){
  currentLat=lat; currentLon=lon; currentCity=displayName; currentTimeZone=timezone;
  document.getElementById("locname").textContent=currentCity;
  document.getElementById("locname").classList.remove("loading");
  try{ localStorage.setItem('lastLocation',JSON.stringify({lat:lat,lon:lon,display:displayName,timezone:timezone})); }catch(e){}
  renderPrayers();
  scheduleMidnightRefresh();
}

function scheduleMidnightRefresh(){
  try{ if(_midnightTimer) clearTimeout(_midnightTimer); }catch(e){}
  const now=new Date();
  const tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,1,0);
  const ms=tomorrow.getTime()-now.getTime();
  _midnightTimer = setTimeout(()=>{
    _lastDateStr = (new Date()).toDateString();
    renderPrayers();
    scheduleMidnightRefresh();
  }, ms);
}

function renderPrayers(){
  if(currentLat===null||currentLon===null) return;
  const now=new Date();
  const clientTzOffset = -now.getTimezoneOffset()/60;
  const zoneOffset = currentTimeZone ? getZoneOffsetHours(currentTimeZone, now) : clientTzOffset;
  function formatOffset(off){ return 'GMT'+(off>=0?'+':'')+off; }
  document.getElementById("tzname").textContent = formatOffset(clientTzOffset);
  (async ()=>{
      function pad(n){return n<10?('0'+n):n}
      function formatHMS(s){
        if(s<=0) return '00:00:00';
        const h=Math.floor(s/3600); const m=Math.floor((s%3600)/60); const sec=Math.floor(s%60);
        return pad(h)+':'+pad(m)+':'+pad(sec);
      }

      const nowParts = getTimePartsInZone(now, currentTimeZone);
      const nowHours = nowParts.h + nowParts.m/60 + nowParts.s/3600;
      let apiResp = await fetchTimingsFromAladhan(now,currentLat,currentLon,currentMethod);
      let times = null;
      let apiTimezone = null;
      let hijri = null;
      if(apiResp && apiResp.timings){
        times = apiResp.timings;
        apiTimezone = apiResp.timezone || null;
        hijri = apiResp.hijri || null;
        // Update currentTimeZone if we got timezone info from API
        if(apiTimezone && !currentTimeZone) {
          currentTimeZone = apiTimezone;
        }
      } else {
        if(apiResp && typeof apiResp === 'object' && apiResp.fajr!==undefined){ times = apiResp; }
        else times = getPrayerTimes(now,currentLat,currentLon,zoneOffset,currentMethod);
      }
      try{
        const gdate = (currentTimeZone || apiTimezone)
          ? new Intl.DateTimeFormat('id-ID', {timeZone: (currentTimeZone||apiTimezone), weekday:'long', year:'numeric', month:'long', day:'numeric'}).format(now)
          : now.toLocaleDateString('id-ID', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
        let hdateStr = '';
        if(hijri && hijri.month){
          // normalization helper: remove diacritics and unify spacing/case
          function normalizeMonthName(s){
            if(!s) return '';
            // remove common diacritics and special chars
            // normalize unicode then strip combining marks
            const t = s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
            return t.replace(/[\u02BC\u02BB\u2018\u2019']/g,'').trim().toLowerCase();
          }
          const bulanMap = {
            'muharram':'Muharram','safar':'Safar','rabi al-awwal':'Rabiul Awal','rabi al-awal':'Rabiul Awal','rabi alawwal':'Rabiul Awal','rabiul-awwal':'Rabiul Awal','rabiul awal':'Rabiul Awal',
            'rabi al-thani':'Rabiul Akhir','rabi al-thaniy':'Rabiul Akhir','rabiul-akhir':'Rabiul Akhir','rabiul akhir':'Rabiul Akhir',
            'jumada al-awwal':'Jumadil Awal','jumada al-awal':'Jumadil Awal','jumada alawwal':'Jumadil Awal','jumadil-awal':'Jumadil Awal','jumadil awal':'Jumadil Awal',
            'jumada al-thani':'Jumadil Akhir','jumada al-thaniy':'Jumadil Akhir','jumadil-akhir':'Jumadil Akhir','jumadil akhir':'Jumadil Akhir',
            'rajab':'Rajab','shaban':'Syaban','sha ban':'Syaban','syaban':'Syaban',
            'ramadan':'Ramadan','ramadhan':'Ramadan','shawwal':'Syawal','syawal':'Syawal',
            'dhu al-qadah':'Dzulqaidah','dhul-qadah':'Dzulqaidah','dzulqaidah':'Dzulqaidah','dhu al-hijjah':'Dzulhijjah','dhul-hijjah':'Dzulhijjah','dzulhijjah':'Dzulhijjah'
          };
          const normalizedMonth = normalizeMonthName(hijri.month.en || '');
          const monthName = bulanMap[normalizedMonth] || hijri.month.en || '';
          if(monthName && hijri.day && hijri.year){
            hdateStr = ` • ${hijri.day} ${monthName} ${hijri.year} H`;
          }
        }
        document.getElementById("nowdate").textContent = gdate + hdateStr;
      }catch(e){ document.getElementById("nowdate").textContent = now.toLocaleDateString('id-ID', {weekday:'long', year:'numeric', month:'long', day:'numeric'}); }
      const tbody=document.querySelector('#prayTable tbody');
      tbody.innerHTML='';
      const norm = {};
      const nowHoursCheck = nowParts.h + nowParts.m/60 + nowParts.s/3600;
      for(let k of Object.keys(prayNames)){
        const v = times[k];
        if(typeof v === 'number') norm[k] = v;
        else if(typeof v === 'string'){
          const parts = v.split(':');
          if(parts.length>=2) norm[k] = parseInt(parts[0],10) + parseInt(parts[1],10)/60 + (parts[2]?parseInt(parts[2],10)/3600:0);
          else norm[k] = NaN;
        } else norm[k] = NaN;
      }
      let usedTomorrow = false;
      if(!isNaN(norm['isha']) && nowHoursCheck >= norm['isha']){
        const tomorrow = new Date(now.getTime() + 24*3600*1000);
        const tomesResp = await fetchTimingsFromAladhan(tomorrow,currentLat,currentLon,currentMethod);
        let tomes = null;
        let tomesTz = null;
        if(tomesResp && tomesResp.timings){ tomes = tomesResp.timings; tomesTz = tomesResp.timezone || null; }
        else if(tomesResp && typeof tomesResp === 'object' && tomesResp.fajr !== undefined){ tomes = tomesResp; }
        else {
          const tomZoneOffset = currentTimeZone ? getZoneOffsetHours(currentTimeZone, tomorrow) : clientTzOffset;
          tomes = getPrayerTimes(tomorrow,currentLat,currentLon,tomZoneOffset,currentMethod);
        }
        if(tomes){
          for(let k of Object.keys(prayNames)){
            const vv = tomes[k];
            if(typeof vv === 'number') norm[k] = vv + 24;
            else if(typeof vv === 'string'){
              const parts = vv.split(':');
              if(parts.length>=2) norm[k] = parseInt(parts[0],10) + parseInt(parts[1],10)/60 + (parts[2]?parseInt(parts[2],10)/3600:0) + 24;
              else norm[k] = NaN;
            } else norm[k] = NaN;
            times[k] = (typeof vv === 'number') ? vv : vv;
          }
          usedTomorrow = true;
        }
      }
      // Find next prayer first
      let nextKey = null; let minDiff = Infinity;
      const nowHoursForNext = nowParts.h + nowParts.m/60 + nowParts.s/3600;
      for(const k of Object.keys(norm)){
        const t = norm[k];
        if(isNaN(t)) continue;
        const diff = t - nowHoursForNext;
        if(diff > 0 && diff < minDiff){ minDiff = diff; nextKey = k; }
      }
      if(!nextKey){ nextKey = 'fajr'; }

      for(let k of Object.keys(prayNames)){
        const displayTime = floatToTime(times[k]);
        const t = norm[k];
        let infoText = '--:--:--';
        
        if(!isNaN(t)){
          // Syuruq always shows '--:--:--' (no countdown, no "Selesai")
          if(k === 'sunrise'){
            infoText = '--:--:--';
          } else if(t <= nowHours){
            infoText = 'Selesai';
          } else if(k === nextKey) {
            // Show countdown for next prayer
            const diffSec = Math.round((t - nowHours) * 3600);
            infoText = formatHMS(diffSec);
          }
          // All other future prayers show '--:--:--'
        }

        const tr=document.createElement('tr');
        tr.setAttribute('data-prayer', k);
        tr.innerHTML = `<td>${prayNames[k]}</td><td class="time">${displayTime}</td><td class="small" data-info="${k}">${infoText}</td>`;
        tbody.appendChild(tr);
      }
      updateNext(times);
      
      // Add sunrise to norm for calculations
      if(times.sunrise !== undefined) {
        if(typeof times.sunrise === 'number') norm.sunrise = times.sunrise;
        else if(typeof times.sunrise === 'string') {
          const parts = times.sunrise.split(':');
          if(parts.length>=2) norm.sunrise = parseInt(parts[0],10) + parseInt(parts[1],10)/60 + (parts[2]?parseInt(parts[2],10)/3600:0);
          else norm.sunrise = NaN;
        } else norm.sunrise = NaN;
      }
      
      _perPrayerNorm = Object.assign({}, norm);
      
      // Trigger floating widget update when prayer data is ready (only if not already handled)
      setTimeout(() => {
        if (floatingWidget && !isWidgetVisible) {
          console.log('Prayer data updated, checking if widget should show');
          const tableRect = prayerTableSection?.getBoundingClientRect();
          if (tableRect) {
            const tableVisibleRatio = Math.max(0, Math.min(1, 
              (Math.min(tableRect.bottom, window.innerHeight) - Math.max(tableRect.top, 0)) / tableRect.height
            ));
            
            const isMobile = window.innerWidth <= 768;
            const showThreshold = isMobile ? 0.3 : 0.2;
            
            // Only show if clearly should be shown and not already visible
            if (tableVisibleRatio <= showThreshold) {
              console.log('Post-data update: showing widget');
              updateFloatingWidget();
              showFloatingWidget();
            }
          }
        }
      }, 200);
      
      // Highlight next prayer via CSS styling only
      document.querySelectorAll('#prayTable tbody tr').forEach(tr=>{
        const key = tr.getAttribute('data-prayer');
        if(key === nextKey){
          tr.style.background = 'linear-gradient(90deg, rgba(0, 255, 255, 0.2), rgba(0, 128, 255, 0.1))';
          tr.style.borderLeft = '4px solid var(--primary-cyan)';
          tr.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1)';
        } else {
          tr.style.background = '';
          tr.style.borderLeft = '';
          tr.style.boxShadow = '';
        }
      });
      
      if(!_liveInterval){
        _liveInterval = setInterval(()=>{ 
          updateLiveInfo(); 
          updateSunnahPrayers(); 
        },1000);
      }
      
      // Initial update of sunnah prayers
      updateSunnahPrayers();
      
      // Schedule notifications for prayer times
      scheduleNotifications(norm, usedTomorrow);
  })();
}

function updateLiveInfo(){
  const now = new Date();
  const nowParts = getTimePartsInZone(now, currentTimeZone);
  const nowHours = nowParts.h + nowParts.m/60 + nowParts.s/3600;
  let nextKey = null; let minDiff = Infinity;
  
  for(const k of Object.keys(_perPrayerNorm)){
    const t = _perPrayerNorm[k];
    if(isNaN(t)) continue;
    // Skip sunrise from next prayer calculation
    if(k === 'sunrise') continue;
    const diff = t - nowHours;
    if(diff > 0 && diff < minDiff){ minDiff = diff; nextKey = k; }
  }
  if(!nextKey){ nextKey = 'fajr'; }

  document.querySelectorAll('#prayTable tbody tr').forEach(tr=>{
    const key = tr.getAttribute('data-prayer');
    const infoCell = tr.querySelector('td[data-info="'+key+'"]');
    const t = _perPrayerNorm[key];
    if(isNaN(t)){
      infoCell.textContent = '--:--:--';
      tr.classList.remove('row-next');
      return;
    }
    
    if(key === nextKey && key !== 'sunrise'){
      let diffHours = t - nowHours;
      if(diffHours < 0) diffHours += 24;
      const diffSec = Math.max(0, Math.round(diffHours * 3600));
      infoCell.textContent = formatHMS(diffSec);
      // Apply enhanced highlighting via CSS styling
      tr.style.background = 'linear-gradient(90deg, rgba(0, 255, 255, 0.2), rgba(0, 128, 255, 0.1))';
      tr.style.borderLeft = '4px solid var(--primary-cyan)';
      tr.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1)';
      tr.style.transform = 'scale(1.02)';
      tr.style.transition = 'all 0.3s ease';
      // Enhanced styling for all columns
      tr.querySelectorAll('td').forEach((td, index) => {
        td.style.fontWeight = 'bold';
        td.style.color = 'var(--text-primary)';
        td.style.textShadow = '0 0 8px rgba(0, 255, 255, 0.5)';
        
        if(index === 0) {
          // Prayer name column - most prominent
          td.style.fontSize = '18px';
          td.style.fontFamily = 'var(--font-primary)';
          td.style.color = 'var(--primary-cyan)';
          td.style.fontWeight = '700';
          td.style.textShadow = '0 0 12px rgba(0, 255, 255, 0.9)';
        } else if(index === 1) {
          // Time column - enhanced
          td.style.fontSize = '16px';
          td.style.fontFamily = 'var(--font-primary)';
          td.style.color = 'var(--primary-cyan)';
          td.style.fontWeight = '600';
          td.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.7)';
        }
      });
      // Special styling for countdown cell (Info column)
      infoCell.style.fontSize = '16px';
      infoCell.style.fontFamily = 'var(--font-primary)';
      infoCell.style.color = 'var(--primary-cyan)';
      infoCell.style.fontWeight = '700';
      infoCell.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.8)';
    } else {
      // Syuruq always shows '--:--:--' (no countdown, no "Selesai")
      if(key === 'sunrise'){
        infoCell.textContent = '--:--:--';
      } else if(t <= nowHours) {
        infoCell.textContent = 'Selesai';
      } else {
        infoCell.textContent = '--:--:--';
      }
      // Remove highlighting
      tr.style.background = '';
      tr.style.borderLeft = '';
      tr.style.boxShadow = '';
      tr.style.transform = '';
      tr.style.transition = '';
      // Reset text styling
      tr.querySelectorAll('td').forEach(td => {
        td.style.fontWeight = '';
        td.style.color = '';
        td.style.textShadow = '';
        td.style.fontSize = '';
        td.style.fontFamily = '';
      });
    }
  });
  
  // Update floating widget for mobile
  updateFloatingWidget();
}

function updateNext(times){
  try{ if(countdownTimer) clearTimeout(countdownTimer); }catch(e){}
}

// Schedule prayer notifications 5 minutes before each prayer time
function scheduleNotifications(prayerTimes, usedTomorrow) {
  // Clear any existing notification timeouts
  if (window.notificationTimeouts) {
    window.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
  }
  window.notificationTimeouts = [];

  // Check if notifications are enabled by user
  if (!isNotificationEnabled) {
    return;
  }

  // Check if notifications are supported and permitted
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const now = new Date();
  const nowParts = getTimePartsInZone(now, currentTimeZone);
  const nowHours = nowParts.h + nowParts.m/60 + nowParts.s/3600;

  // Prayer names in Indonesian
  const prayerDisplayNames = {
    'fajr': 'Subuh',
    'sunrise': 'Syuruq',
    'dhuhr': 'Dzuhur', 
    'asr': 'Ashar',
    'maghrib': 'Maghrib',
    'isha': 'Isya'
  };

  Object.keys(prayerTimes).forEach(prayerKey => {
    const prayerTime = prayerTimes[prayerKey];
    if (isNaN(prayerTime)) return;

    // Calculate notification time (5 minutes before prayer)
    const notificationTime = prayerTime - (5/60); // 5 minutes in hours
    
    // Calculate milliseconds until notification
    let hoursUntilNotification = notificationTime - nowHours;
    
    // If notification time has passed today, skip (don't schedule for yesterday)
    if (hoursUntilNotification <= 0 && !usedTomorrow) {
      return;
    }
    
    // If using tomorrow's times, don't add extra 24 hours
    if (hoursUntilNotification <= 0 && usedTomorrow) {
      hoursUntilNotification += 24;
    }

    const msUntilNotification = hoursUntilNotification * 60 * 60 * 1000;
    
    // Only schedule if within next 24 hours
    if (msUntilNotification > 0 && msUntilNotification <= 24 * 60 * 60 * 1000) {
      const timeoutId = setTimeout(async () => {
        const prayerName = prayerDisplayNames[prayerKey] || prayerKey;
        
        // Use Service Worker for better Android compatibility
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          try {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(`🕌 Waktu Sholat ${prayerName}`, {
              body: `⏰ 5 menit lagi waktu sholat ${prayerName}. Bersiaplah untuk sholat.`,
              icon: '../images/_logo.png',
              badge: '../_favicon.png',
              tag: `prayer-${prayerKey}`,
              requireInteraction: true,
              silent: false,
              vibrate: [500, 200, 500, 200, 500],
              actions: [
                {
                  action: 'open',
                  title: '📖 Buka Aplikasi'
                },
                {
                  action: 'dismiss', 
                  title: '❌ Tutup'
                }
              ],
              data: {
                prayer: prayerKey,
                time: prayerTime,
                url: 'https://mfarismuzakki.id/adzan_realtime/'
              }
            });
          } catch (error) {
            console.log('Service Worker notification failed, using fallback:', error);
            // Fallback to regular notification
            createFallbackNotification(prayerName, prayerKey);
          }
        } else {
          // Fallback for browsers without service worker
          createFallbackNotification(prayerName, prayerKey);
        }
        
        // Vibrate for mobile devices
        if ('vibrate' in navigator) {
          navigator.vibrate([500, 200, 500, 200, 500]);
        }
      }, msUntilNotification);

      window.notificationTimeouts.push(timeoutId);
      
      // Log for debugging
      console.log(`Scheduled ${prayerDisplayNames[prayerKey]} notification in ${Math.round(msUntilNotification/1000/60)} minutes`);
    }
  });
}

// Fallback notification function for compatibility
function createFallbackNotification(prayerName, prayerKey) {
  const notification = new Notification(`🕌 Waktu Sholat ${prayerName}`, {
    body: `⏰ 5 menit lagi waktu sholat ${prayerName}. Bersiaplah untuk sholat.`,
    icon: '../images/_logo.png',
    badge: '../_favicon.png',
    tag: `prayer-${prayerKey}`,
    requireInteraction: true,
    silent: false
  });

  // Auto close notification after 15 seconds for Android compatibility
  setTimeout(() => {
    notification.close();
  }, 15000);

  // Handle notification click
  notification.onclick = function() {
    window.open('https://mfarismuzakki.id/adzan_realtime/', '_blank');
    window.focus();
    notification.close();
  };
}

async function getCoordsFromCity(cityName){
  try{
    const cacheKey = `geocode:city:${cityName.toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);
    if(cached) return JSON.parse(cached);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1&addressdetails=1`;
    const res = await fetch(url,{headers:{'Accept-Language':'id'}});
    if(!res.ok) throw new Error('geocode failed');
    const data = await res.json();
    if(data && data.length > 0){
      const item = data[0];
      const lat = parseFloat(item.lat); const lon = parseFloat(item.lon);
      const display = item.display_name || cityName;
      const out = {lat:lat,lon:lon,display:display};
      try{ localStorage.setItem(cacheKey, JSON.stringify(out)); }catch(e){}
      return out;
    }
  }catch(err){console.warn('getCoordsFromCity error',err);}
  return null;
}

async function reverseGeocode(lat,lon){
  try{
    const rlat = Math.round(lat*1000)/1000;
    const rlon = Math.round(lon*1000)/1000;
    const cacheKey = `geocode:coords:${rlat},${rlon}`;
    const cached = localStorage.getItem(cacheKey);
    if(cached) return JSON.parse(cached);
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const res = await fetch(url,{headers:{'Accept-Language':'id'}});
    if(!res.ok) throw new Error('reverse geocode failed');
    const data = await res.json();
    const display = data.display_name || (data.address? (data.address.city||data.address.town||data.address.village||data.address.county) : null) || `${lat.toFixed(3)},${lon.toFixed(3)}`;
    const out = {lat:lat,lon:lon,display:display};
    try{ localStorage.setItem(cacheKey, JSON.stringify(out)); }catch(e){}
    return out;
  }catch(err){console.warn('reverseGeocode error',err); return {lat:lat,lon:lon,display:`${lat.toFixed(3)},${lon.toFixed(3)}`};}
}

document.getElementById("method").addEventListener("change",e=>{
  currentMethod=e.target.value;
  document.getElementById("methodName").textContent=e.target.options[e.target.selectedIndex].text;
  renderPrayers();
});
document.getElementById("btnRefresh").addEventListener("click",()=>{
  navigator.geolocation.getCurrentPosition(pos=>{
    (async ()=>{
      const rg = await reverseGeocode(pos.coords.latitude,pos.coords.longitude);
      setLocation(pos.coords.latitude,pos.coords.longitude, rg.display || 'GPS');
    })();
  },()=>alert("Tidak bisa ambil lokasi GPS."));
});
document.getElementById("btnCity").addEventListener("click",async()=>{
  const city=document.getElementById("cityInput").value.trim();
  const btn = document.getElementById("btnCity");
  const btnIcon = btn.querySelector('i');
  const originalText = btn.innerHTML;
  
  if(!city){alert("Masukkan nama kota!");return;}
  
  // Show loading state
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mencari...';
  btn.style.opacity = '0.7';
  
  try {
    const result = await getCoordsFromCity(city);
    if(result) {
      setLocation(result.lat, result.lon, result.display);
    } else {
      alert("Kota tidak ditemukan.");
    }
  } catch (error) {
    console.error('City geocoding error:', error);
    alert("Error saat mencari kota. Silakan coba lagi.");
  } finally {
    // Restore button state
    btn.disabled = false;
    btn.innerHTML = originalText;
    btn.style.opacity = '1';
  }
});
// Autocomplete suggestions on typing (debounced)
const cityInputEl = document.getElementById('cityInput');
const dl = document.getElementById('citySuggestions');
function debounce(fn, wait){ let t; return function(...args){ clearTimeout(t); t=setTimeout(()=>fn.apply(this,args), wait); }; }
const updateSuggestions = debounce(async function(){
  const q = cityInputEl.value.trim();
  const loader = document.getElementById('cityLoader');
  
  if(q.length < 2){ 
    dl.innerHTML=''; 
    _lastResults=[]; 
    hideLoader();
    return; 
  }
  
  if(q === _lastQuery && _lastResults.length > 0){
    dl.innerHTML = ''; 
    _lastResults.forEach(r => { 
      const opt = document.createElement('option'); 
      opt.value = r; 
      dl.appendChild(opt); 
    });
    return;
  }
  
  // Show loader
  showLoader();
  
  try{
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`;
    const res = await fetch(url, {headers:{'Accept-Language':'id'}});
    if(!res.ok) {
      hideLoader();
      return;
    }
    const data = await res.json();
    const suggestions = data.map(item => item.display_name || item.name || '').filter(Boolean).slice(0,5);
    dl.innerHTML = '';
    suggestions.forEach(s => { 
      const opt = document.createElement('option'); 
      opt.value = s; 
      dl.appendChild(opt); 
    });
    _lastQuery = q; 
    _lastResults = suggestions;
  }catch(e){
    console.error('City suggestions fetch error:', e);
  } finally {
    hideLoader();
  }
  
  function showLoader() {
    if(loader) {
      loader.style.display = 'flex';
      cityInputEl.classList.add('loading');
    }
  }
  
  function hideLoader() {
    if(loader) {
      loader.style.display = 'none';
      cityInputEl.classList.remove('loading');
    }
  }
}, 300);
cityInputEl.addEventListener('input', updateSuggestions);

// Custom Modal Functions
function showCustomModal(title, message, icon = 'fa-bell', onConfirm = null, onCancel = null) {
  return new Promise((resolve) => {
    const modal = document.getElementById('customModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalIcon = document.getElementById('modalIcon');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');
    const modalClose = document.getElementById('modalClose');
    
    // Set content
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalIcon.className = `fas ${icon}`;
    
    // Show modal
    modal.classList.add('show');
    
    // Handle confirm button
    const handleConfirm = () => {
      modal.classList.remove('show');
      if (onConfirm) onConfirm();
      resolve(true);
      cleanup();
    };
    
    // Handle cancel/close
    const handleCancel = () => {
      modal.classList.remove('show');
      if (onCancel) onCancel();
      resolve(false);
      cleanup();
    };
    
    // Cleanup function to remove event listeners
    const cleanup = () => {
      modalConfirm.removeEventListener('click', handleConfirm);
      modalCancel.removeEventListener('click', handleCancel);
      modalClose.removeEventListener('click', handleCancel);
      modal.querySelector('.modal-overlay').removeEventListener('click', handleCancel);
    };
    
    // Add event listeners
    modalConfirm.addEventListener('click', handleConfirm);
    modalCancel.addEventListener('click', handleCancel);
    modalClose.addEventListener('click', handleCancel);
    modal.querySelector('.modal-overlay').addEventListener('click', handleCancel);
  });
}

// Custom Alert Function (simpler modal for alerts)
function showCustomAlert(title, message, icon = 'fa-info-circle') {
  return new Promise((resolve) => {
    const modal = document.getElementById('customModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalIcon = document.getElementById('modalIcon');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');
    const modalClose = document.getElementById('modalClose');
    
    // Set content
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalIcon.className = `fas ${icon}`;
    
    // Hide cancel button for alerts
    modalCancel.style.display = 'none';
    modalConfirm.innerHTML = '<i class="fas fa-check"></i> OK';
    
    // Show modal
    modal.classList.add('show');
    
    // Handle OK button
    const handleOK = () => {
      modal.classList.remove('show');
      modalCancel.style.display = 'flex'; // Restore cancel button
      modalConfirm.innerHTML = '<i class="fas fa-check"></i> Setuju'; // Restore confirm text
      resolve(true);
      cleanup();
    };
    
    // Cleanup function
    const cleanup = () => {
      modalConfirm.removeEventListener('click', handleOK);
      modalClose.removeEventListener('click', handleOK);
      modal.querySelector('.modal-overlay').removeEventListener('click', handleOK);
    };
    
    // Add event listeners
    modalConfirm.addEventListener('click', handleOK);
    modalClose.addEventListener('click', handleOK);
    modal.querySelector('.modal-overlay').addEventListener('click', handleOK);
  });
}

// Notification management
let isNotificationEnabled = false;

// Load notification preference from localStorage
function loadNotificationPreference() {
  const saved = localStorage.getItem('prayerNotificationEnabled');
  isNotificationEnabled = saved === 'true';
  updateNotificationButton();
}

// Save notification preference to localStorage
function saveNotificationPreference() {
  localStorage.setItem('prayerNotificationEnabled', isNotificationEnabled.toString());
}

// Update notification button appearance
function updateNotificationButton() {
  const btn = document.getElementById('btnNotification');
  const icon = btn.querySelector('i');
  const text = btn.querySelector('.btn-text');
  
  if (isNotificationEnabled) {
    btn.classList.add('active');
    icon.className = 'fas fa-bell';
    text.textContent = 'Notifikasi Aktif';
  } else {
    btn.classList.remove('active');
    icon.className = 'fas fa-bell-slash';
    text.textContent = 'Aktifkan Notifikasi';
  }
}

// Handle notification button click
document.getElementById('btnNotification').addEventListener('click', async () => {
  if (!('Notification' in window)) {
    await showCustomAlert(
      'Browser Tidak Mendukung',
      'Browser Anda tidak mendukung notifikasi. Silakan gunakan browser yang lebih baru seperti Chrome, Firefox, atau Safari.',
      'fa-exclamation-triangle'
    );
    return;
  }
  
  if (isNotificationEnabled) {
    // Show confirmation before disabling
    const confirmed = await showCustomModal(
      'Nonaktifkan Notifikasi',
      'Apakah Anda yakin ingin menonaktifkan pengingat sholat? Anda tidak akan mendapat notifikasi 5 menit sebelum waktu sholat.',
      'fa-bell-slash'
    );
    
    if (confirmed) {
      // Disable notifications
      isNotificationEnabled = false;
      saveNotificationPreference();
      updateNotificationButton();
      
      // Clear existing notification timeouts
      if (window.notificationTimeouts) {
        window.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
        window.notificationTimeouts = [];
      }
      
      await showCustomAlert(
        'Notifikasi Dinonaktifkan',
        'Pengingat sholat telah dinonaktifkan. Anda dapat mengaktifkannya kembali kapan saja.',
        'fa-check-circle'
      );
      
      console.log('Notifikasi sholat dinonaktifkan');
    }
  } else {
    // Show explanation before enabling
    const wantsToEnable = await showCustomModal(
      'Aktifkan Pengingat Sholat',
      'Aplikasi ini akan mengirimkan notifikasi 5 menit sebelum waktu sholat untuk membantu Anda bersiap. Notifikasi hanya akan muncul pada waktu sholat yang tepat sesuai lokasi Anda.\n\nApakah Anda ingin mengaktifkan pengingat sholat?',
      'fa-bell'
    );
    
    if (wantsToEnable) {
      // Enable notifications with Android-specific handling
      let permission = Notification.permission;
      
      // Log device info for debugging
      console.log('Device info:', {
        userAgent: navigator.userAgent,
        isAndroid: /Android/i.test(navigator.userAgent),
        hasServiceWorker: 'serviceWorker' in navigator,
        currentPermission: permission
      });
      
      if (permission === 'default') {
        // For Android Chrome, request permission more explicitly
        try {
          permission = await Notification.requestPermission();
        } catch (error) {
          console.error('Permission request failed:', error);
          // Fallback for older Android versions
          if (window.Notification && window.Notification.requestPermission) {
            permission = await new Promise(resolve => {
              window.Notification.requestPermission(resolve);
            });
          }
        }
      }
      
      if (permission === 'granted') {
        isNotificationEnabled = true;
        saveNotificationPreference();
        updateNotificationButton();
        
        // Show confirmation notification with Android compatibility
        try {
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification('🕌 Notifikasi Sholat Aktif', {
              body: '✅ Anda akan mendapat pengingat 5 menit sebelum waktu sholat',
              icon: '../images/_logo.png',
              badge: '../_favicon.png',
              tag: 'notification-enabled',
              silent: false,
              vibrate: [200, 100, 200]
            });
          } else {
            new Notification('🕌 Notifikasi Sholat Aktif', {
              body: '✅ Anda akan mendapat pengingat 5 menit sebelum waktu sholat',
              icon: '../images/_logo.png',
              badge: '../_favicon.png'
            });
          }
        } catch (error) {
          console.log('Confirmation notification failed:', error);
        }
        
        // Reschedule notifications with current prayer times
        if (_perPrayerNorm && Object.keys(_perPrayerNorm).length > 0) {
          scheduleNotifications(_perPrayerNorm, false);
        }
        
        await showCustomAlert(
          'Notifikasi Diaktifkan',
          'Pengingat sholat berhasil diaktifkan! Anda akan mendapat notifikasi 5 menit sebelum setiap waktu sholat.',
          'fa-check-circle'
        );
        
        console.log('Notifikasi sholat diaktifkan');
      } else if (permission === 'denied') {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const message = isAndroid 
          ? 'Izin notifikasi ditolak. Untuk Android:\n\n1. Buka Chrome Settings (tiga titik)\n2. Pilih "Site settings" atau "Setelan situs"\n3. Pilih "Notifications" atau "Notifikasi"\n4. Cari situs ini dan ubah ke "Allow"\n\nAtau install aplikasi sebagai PWA dengan tombol "Add to Home Screen"'
          : 'Izin notifikasi ditolak. Silakan buka pengaturan browser dan izinkan notifikasi untuk situs ini.';
          
        await showCustomAlert(
          'Izin Notifikasi Ditolak',
          message,
          'fa-exclamation-triangle'
        );
      } else {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const message = isAndroid
          ? 'Untuk Android Chrome:\n\n1. Pastikan notifikasi tidak diblokir di pengaturan sistem Android\n2. Install aplikasi sebagai PWA (Add to Home Screen) untuk notifikasi yang lebih andal\n3. Atau aktifkan notifikasi di Chrome Settings > Site Settings > Notifications'
          : 'Izin notifikasi diperlukan untuk mengaktifkan pengingat sholat. Silakan aktifkan di pengaturan browser.';
          
        await showCustomAlert(
          'Izin Notifikasi Diperlukan',
          message,
          'fa-info-circle'
        );
      }
    }
  }
});

// Hadith rotation variables
let currentHadithIndex = 0;
let hadithInterval = null;
let progressInterval = null;
let currentProgress = 0;
let isHadithPaused = false;

function updateHadithProgress() {
  // Don't update progress if paused
  if (isHadithPaused) return;
  
  const progressFill = document.querySelector('.progress-fill');
  if (!progressFill) return;
  
  const totalTime = 5000; // 5 seconds total
  const progressPercentage = (currentProgress / totalTime) * 100;
  
  // Update progress bar width with smooth animation
  progressFill.style.width = progressPercentage + '%';
  
  currentProgress += 100; // Update every 100ms
  if (currentProgress >= totalTime) {
    currentProgress = 0;
  }
}

function updateSunnahPrayers() {
  if (!_perPrayerNorm || Object.keys(_perPrayerNorm).length === 0) return;
  
  const now = new Date();
  const nowParts = getTimePartsInZone(now, currentTimeZone);
  const sunnahContainer = document.getElementById('sunnahPrayersList');
  
  if (!sunnahContainer) return;
  
  // Filter only available sunnah prayers
  const availablePrayers = sunnahHadithCollection.filter(prayer => 
    prayer.timeCondition(_perPrayerNorm, nowParts)
  );
  
  if (availablePrayers.length === 0) {
    sunnahContainer.innerHTML = `
      <div class="sunnah-prayer-item no-available">
        <div class="sunnah-prayer-name">
          <i class="fas fa-info-circle status-icon not-available"></i>
          Tidak ada sholat sunnah yang dapat dikerjakan saat ini
        </div>
        <div class="sunnah-prayer-time">Silakan menunggu waktu sholat sunnah berikutnya</div>
        <div class="sunnah-prayer-dalil">Gunakan waktu ini untuk berdzikir dan berdoa kepada Allah</div>
      </div>
    `;
    return;
  }
  
  sunnahContainer.innerHTML = '';
  
  availablePrayers.forEach(prayer => {
    const prayerElement = document.createElement('div');
    prayerElement.className = 'sunnah-prayer-item available';
    
    prayerElement.innerHTML = `
      <div class="sunnah-prayer-name">
        <i class="fas fa-check-circle status-icon available"></i>
        ${prayer.name}
      </div>
      <div class="sunnah-prayer-time">${prayer.timeDescription}</div>
      <div class="sunnah-prayer-arabic">${prayer.arabic}</div>
      <div class="sunnah-prayer-indonesia">${prayer.indonesia}</div>
      <div class="sunnah-prayer-reference">${prayer.reference}</div>
    `;
    
    sunnahContainer.appendChild(prayerElement);
  });
}

function initHadithRotation() {
  const hadithArabic = document.getElementById('hadithArabic');
  const hadithIndonesia = document.getElementById('hadithIndonesia');
  const hadithReference = document.getElementById('hadithReference');
  const hadithContent = document.getElementById('hadithContent');
  
  function getRandomHadithIndex() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * hadithCollection.length);
    } while (newIndex === currentHadithIndex && hadithCollection.length > 1);
    return newIndex;
  }
  
  function showNextHadith() {
    hadithContent.classList.add('fade-out');
    currentProgress = 0; // Reset progress when changing hadith
    
    setTimeout(() => {
      currentHadithIndex = getRandomHadithIndex();
      const hadith = hadithCollection[currentHadithIndex];
      hadithArabic.textContent = hadith.arabic;
      hadithIndonesia.textContent = hadith.indonesia;
      hadithReference.textContent = hadith.reference;
      hadithContent.classList.remove('fade-out');
    }, 250);
  }

  function showHadithByIndex(index) {
    hadithContent.classList.add('fade-out');
    currentProgress = 0; // Reset progress when changing hadith
    
    setTimeout(() => {
      currentHadithIndex = index;
      const hadith = hadithCollection[currentHadithIndex];
      hadithArabic.textContent = hadith.arabic;
      hadithIndonesia.textContent = hadith.indonesia;
      hadithReference.textContent = hadith.reference;
      hadithContent.classList.remove('fade-out');
    }, 250);
  }

  function showPreviousHadith() {
    let prevIndex = currentHadithIndex - 1;
    if (prevIndex < 0) {
      prevIndex = hadithCollection.length - 1;
    }
    showHadithByIndex(prevIndex);
  }

  function showNextHadithManual() {
    let nextIndex = currentHadithIndex + 1;
    if (nextIndex >= hadithCollection.length) {
      nextIndex = 0;
    }
    showHadithByIndex(nextIndex);
  }

  function togglePlayPause() {
    const playPauseBtn = document.getElementById('playPauseHadith');
    const playPauseIcon = playPauseBtn.querySelector('i');
    
    if (isHadithPaused) {
      // Resume
      isHadithPaused = false;
      playPauseBtn.classList.remove('paused');
      playPauseIcon.className = 'fas fa-pause';
      playPauseBtn.title = 'Pause Auto';
      
      // Restart intervals
      progressInterval = setInterval(updateHadithProgress, 100);
      hadithInterval = setInterval(showNextHadith, 5000);
    } else {
      // Pause
      isHadithPaused = true;
      playPauseBtn.classList.add('paused');
      playPauseIcon.className = 'fas fa-play';
      playPauseBtn.title = 'Play Auto';
      
      // Clear intervals
      if (progressInterval) clearInterval(progressInterval);
      if (hadithInterval) clearInterval(hadithInterval);
      
      // Reset progress
      currentProgress = 0;
      const progressFill = document.querySelector('.progress-fill');
      if (progressFill) progressFill.style.width = '0%';
    }
  }

  // Add event listeners for carousel controls
  document.getElementById('prevHadith').addEventListener('click', showPreviousHadith);
  document.getElementById('nextHadith').addEventListener('click', showNextHadithManual);
  document.getElementById('playPauseHadith').addEventListener('click', togglePlayPause);
  
  // Show first hadith immediately (random)
  if (hadithCollection && hadithCollection.length > 0) {
    currentHadithIndex = Math.floor(Math.random() * hadithCollection.length);
    const hadith = hadithCollection[currentHadithIndex];
    hadithArabic.textContent = hadith.arabic;
    hadithIndonesia.textContent = hadith.indonesia;
    hadithReference.textContent = hadith.reference;
    
    // Start progress indicator
    progressInterval = setInterval(updateHadithProgress, 100);
    
    // Rotate every 5 seconds
    hadithInterval = setInterval(showNextHadith, 5000);
  }
}

updateClock();

// Initialize method name
document.getElementById("methodName").textContent = "Kemenag Indonesia";

// Initialize notification preference
loadNotificationPreference();

// Initialize hadith rotation
initHadithRotation();

// Initialize floating prayer widget for mobile
initializeFloatingWidget();
addFloatingWidgetClickHandler();

// Initial widget update with loading state
setTimeout(() => {
  updateFloatingWidget();
}, 1000);

// Restore last location if available; else try GPS; else manual
(async ()=>{
  try{
    const last = localStorage.getItem('lastLocation');
    if(last){
      const obj = JSON.parse(last);
      if(obj && typeof obj.lat==='number' && typeof obj.lon==='number'){
        console.log('Restoring cached location:', obj);
        setLocation(obj.lat, obj.lon, obj.display || 'Lokasi tersimpan', obj.timezone || null);
        scheduleMidnightRefresh();
        return;
      }
    }
  }catch(e){
    console.error('Error restoring cached location:', e);
  }
  
  navigator.geolocation.getCurrentPosition(pos=>{
    (async ()=>{
      const rg = await reverseGeocode(pos.coords.latitude,pos.coords.longitude);
      setLocation(pos.coords.latitude,pos.coords.longitude, rg.display || 'GPS');
    })();
  },()=>{document.getElementById("locname").textContent="Lokasi manual diperlukan";});
  scheduleMidnightRefresh();
})();

// PWA Install functionality
let deferredPrompt;
const pwaInstallBanner = document.getElementById('pwaInstallBanner');
const btnInstallPWA = document.getElementById('btnInstallPWA');
const btnCloseBanner = document.getElementById('btnCloseBanner');

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Check if user is on Android and hasn't dismissed banner
  const isAndroid = /Android/i.test(navigator.userAgent);
  const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
  
  if (isAndroid && !bannerDismissed) {
    // Show PWA install banner after a short delay
    setTimeout(() => {
      pwaInstallBanner.style.display = 'block';
    }, 3000);
  }
});

// Handle PWA install button click
btnInstallPWA.addEventListener('click', async () => {
  if (!deferredPrompt) {
    // Fallback instructions for manual installation
    await showCustomAlert(
      'Install Aplikasi',
      'Untuk install aplikasi:\n\n1. Tap menu Chrome (⋮)\n2. Pilih "Add to Home screen"\n3. Tap "Add" untuk install\n\nSetelah install, notifikasi akan lebih andal!',
      'fa-mobile-alt'
    );
    return;
  }

  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('PWA installed');
    await showCustomAlert(
      'Aplikasi Terinstall',
      'Aplikasi berhasil diinstall! Sekarang Anda dapat menggunakan aplikasi dari home screen dan mendapat notifikasi yang lebih andal.',
      'fa-check-circle'
    );
  }
  
  // Clear the deferredPrompt
  deferredPrompt = null;
  pwaInstallBanner.style.display = 'none';
});

// Handle banner close button
btnCloseBanner.addEventListener('click', () => {
  pwaInstallBanner.style.display = 'none';
  localStorage.setItem('pwa-banner-dismissed', 'true');
});

// Check if app is already installed
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  pwaInstallBanner.style.display = 'none';
});

// Floating Prayer Widget Logic
function initializeFloatingWidget() {
  floatingWidget = document.getElementById('floatingPrayerWidget');
  widgetPrayerName = document.getElementById('widgetPrayerName');
  widgetCountdown = document.getElementById('widgetCountdown');
  prayerTableSection = document.querySelector('#prayTable').closest('.card');
  
  if (!floatingWidget || !prayerTableSection) return;
  
  // Initialize widget with appropriate mode class based on screen size
  const isMobile = window.innerWidth <= 768;
  const isDesktop = window.innerWidth > 768;
  
  floatingWidget.classList.toggle('mobile-mode', isMobile);
  floatingWidget.classList.toggle('desktop-mode', isDesktop);
  
  // Create stable intersection observer with simplified logic
  let widgetTimeout = null;
  let lastDecision = null; // Track last decision to prevent flickering
  
  const tableObserver = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      const intersectionRatio = entry.intersectionRatio;
      const isMobile = window.innerWidth <= 768;
      const isDesktop = window.innerWidth > 768;
      
      // Clear any pending widget changes
      if (widgetTimeout) {
        clearTimeout(widgetTimeout);
        widgetTimeout = null;
      }
      
      // Update widget positioning class based on screen size
      if (floatingWidget) {
        floatingWidget.classList.toggle('desktop-mode', isDesktop);
        floatingWidget.classList.toggle('mobile-mode', isMobile);
      }
      
      // Improved thresholds - widget should hide when table is prominently visible
      const hideThreshold = isMobile ? 0.5 : 0.6; // Hide when table is 50%+ (mobile) or 60%+ (desktop) visible
      const showThreshold = isMobile ? 0.2 : 0.3; // Show when table is less than 20%/30% visible
      
      let decision = null;
      
      console.log('Intersection check:', {
        intersectionRatio: intersectionRatio.toFixed(2),
        hideThreshold,
        showThreshold,
        isMobile,
        isDesktop
      });
      
      // Clear decision zones - widget should definitely hide when table is prominent
      if (intersectionRatio >= hideThreshold) {
        decision = 'hide';
        console.log('Decision: HIDE - table is prominently visible');
      } else if (intersectionRatio <= showThreshold) {
        decision = 'show';
        console.log('Decision: SHOW - table is minimally visible');
      } else {
        // Hysteresis zone - keep current state but favor hiding for full table visibility
        decision = lastDecision || (intersectionRatio > 0.4 ? 'hide' : 'show');
        console.log('Decision: HYSTERESIS -', decision, 'based on ratio', intersectionRatio.toFixed(2));
      }
      
      // Only act if decision changed or we have prayer data
      if (decision !== lastDecision && _perPrayerNorm && Object.keys(_perPrayerNorm).length > 0) {
        console.log('Widget decision changed:', {
          intersectionRatio: intersectionRatio.toFixed(2),
          decision,
          lastDecision,
          isDesktop,
          hideThreshold,
          showThreshold
        });
        
        lastDecision = decision;
        
        // Stable timeout - no rapid changes
        widgetTimeout = setTimeout(() => {
          if (decision === 'show') {
            updateFloatingWidget();
            showFloatingWidget();
          } else {
            hideFloatingWidget();
          }
        }, decision === 'hide' ? 100 : 300); // Faster hiding, slower showing for stability
      }
    },
    {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], // Reduced thresholds for stability
      rootMargin: '0px' // No margin for precise control
    }
  );
  
  tableObserver.observe(prayerTableSection);
  
  // Periodic check to ensure widget behaves correctly
  setInterval(() => {
    if (!prayerTableSection || !_perPrayerNorm || Object.keys(_perPrayerNorm).length === 0) return;
    
    const tableRect = prayerTableSection.getBoundingClientRect();
    const tableVisibleRatio = Math.max(0, Math.min(1, 
      (Math.min(tableRect.bottom, window.innerHeight) - Math.max(tableRect.top, 0)) / tableRect.height
    ));
    
    const isMobile = window.innerWidth <= 768;
    const hideThreshold = isMobile ? 0.5 : 0.6;
    const showThreshold = isMobile ? 0.2 : 0.3;
    
    // Force correct state if widget is in wrong state
    if (tableVisibleRatio >= hideThreshold && isWidgetVisible) {
      console.log('Periodic check: Force hiding widget', {
        tableVisibleRatio: tableVisibleRatio.toFixed(2),
        hideThreshold
      });
      hideFloatingWidget();
    } else if (tableVisibleRatio <= showThreshold && !isWidgetVisible) {
      console.log('Periodic check: Force showing widget', {
        tableVisibleRatio: tableVisibleRatio.toFixed(2),
        showThreshold
      });
      updateFloatingWidget();
      showFloatingWidget();
    }
  }, 2000); // Check every 2 seconds
  
  // Add observer for header area to make widget transparent when overlapping
  const headerArea = document.querySelector('.header, h1, .intro-bg') || document.querySelector('body > *:first-child');
  if (headerArea) {
    const headerObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && floatingWidget) {
          // Widget is in header area - make it transparent
          floatingWidget.classList.add('transparent');
        } else if (floatingWidget) {
          // Widget is out of header area - remove transparency
          floatingWidget.classList.remove('transparent');
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );
    
    headerObserver.observe(headerArea);
  }
  
  // Stable initial check - single evaluation to prevent flickering
  setTimeout(() => {
    if (!_perPrayerNorm || Object.keys(_perPrayerNorm).length === 0) {
      console.log('Initial check skipped - no prayer data yet');
      return;
    }
    
    const tableRect = prayerTableSection.getBoundingClientRect();
    const tableVisibleRatio = Math.max(0, Math.min(1, 
      (Math.min(tableRect.bottom, window.innerHeight) - Math.max(tableRect.top, 0)) / tableRect.height
    ));
    
    const isMobile = window.innerWidth <= 768;
    const hideThreshold = isMobile ? 0.5 : 0.6;
    const showThreshold = isMobile ? 0.2 : 0.3;
    
    console.log('Stable initial widget check:', {
      tableVisibleRatio: tableVisibleRatio.toFixed(2),
      hideThreshold,
      showThreshold,
      shouldShow: tableVisibleRatio <= showThreshold,
      shouldHide: tableVisibleRatio >= hideThreshold,
      isMobile,
      windowWidth: window.innerWidth
    });
    
    // Clear initial decision logic
    if (tableVisibleRatio >= hideThreshold) {
      lastDecision = 'hide';
      console.log('Initial: Table is prominently visible - hiding widget');
    } else if (tableVisibleRatio <= showThreshold) {
      lastDecision = 'show';
      console.log('Initial: Table is minimally visible - showing widget');
      updateFloatingWidget();
      showFloatingWidget();
    } else {
      lastDecision = tableVisibleRatio > 0.4 ? 'hide' : 'show';
      console.log('Initial: Intermediate visibility - decision:', lastDecision);
      if (lastDecision === 'show') {
        updateFloatingWidget();
        showFloatingWidget();
      }
    }
  }, 1500); // Single check after page settles
  
  // Stable resize handler
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    
    const isMobile = window.innerWidth <= 768;
    const isDesktop = window.innerWidth > 768;
    
    // Update widget classes immediately
    if (floatingWidget) {
      floatingWidget.classList.toggle('desktop-mode', isDesktop);
      floatingWidget.classList.toggle('mobile-mode', isMobile);
    }
    
    // Debounced re-evaluation to prevent rapid changes during resize
    resizeTimeout = setTimeout(() => {
      if (!_perPrayerNorm || Object.keys(_perPrayerNorm).length === 0) return;
      
      const tableRect = prayerTableSection.getBoundingClientRect();
      const tableVisibleRatio = Math.max(0, Math.min(1, 
        (Math.min(tableRect.bottom, window.innerHeight) - Math.max(tableRect.top, 0)) / tableRect.height
      ));
      
      const hideThreshold = isMobile ? 0.5 : 0.6;
      const showThreshold = isMobile ? 0.2 : 0.3;
      
      console.log('Resize: Re-evaluating widget', {
        tableVisibleRatio: tableVisibleRatio.toFixed(2),
        hideThreshold,
        showThreshold,
        shouldShow: tableVisibleRatio <= showThreshold,
        shouldHide: tableVisibleRatio >= hideThreshold
      });
      
      // Clear decision logic for resize
      let newDecision;
      if (tableVisibleRatio >= hideThreshold) {
        newDecision = 'hide';
      } else if (tableVisibleRatio <= showThreshold) {
        newDecision = 'show';
      } else {
        newDecision = tableVisibleRatio > 0.4 ? 'hide' : 'show';
      }
      
      lastDecision = newDecision;
      
      if (newDecision === 'show') {
        updateFloatingWidget();
        showFloatingWidget();
      } else {
        hideFloatingWidget();
      }
    }, 500); // Longer debounce for stability
  });
  
  // Simplified scroll listener with better debouncing
  let scrollTimeout = null;
  let isScrolling = false;
  
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      isScrolling = true;
    }
    
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Longer timeout for stability, let intersection observer handle most cases
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      
      // Enhanced check to ensure widget hides when table is prominently visible
      const tableRect = prayerTableSection.getBoundingClientRect();
      const tableVisibleRatio = Math.max(0, Math.min(1, 
        (Math.min(tableRect.bottom, window.innerHeight) - Math.max(tableRect.top, 0)) / tableRect.height
      ));
      
      const isMobile = window.innerWidth <= 768;
      const criticalHideThreshold = isMobile ? 0.5 : 0.6; // Same as intersection observer
      
      console.log('Scroll check:', {
        tableVisibleRatio: tableVisibleRatio.toFixed(2),
        criticalHideThreshold,
        isWidgetVisible,
        shouldHide: tableVisibleRatio >= criticalHideThreshold
      });
      
      // Force hide if table is prominently visible and widget is showing
      if (tableVisibleRatio >= criticalHideThreshold && isWidgetVisible) {
        console.log('Scroll override: FORCE hiding widget - table is prominently visible');
        hideFloatingWidget();
      }
      // Also check for showing when table is barely visible
      else if (tableVisibleRatio <= (isMobile ? 0.2 : 0.3) && !isWidgetVisible && 
               _perPrayerNorm && Object.keys(_perPrayerNorm).length > 0) {
        console.log('Scroll override: showing widget - table barely visible');
        updateFloatingWidget();
        showFloatingWidget();
      }
    }, 300); // Increased timeout for stability
  }, { passive: true });
}

function updateFloatingWidget() {
  if (!floatingWidget || !widgetPrayerName || !widgetCountdown) {
    console.log('Floating widget elements not found:', {
      floatingWidget: !!floatingWidget,
      widgetPrayerName: !!widgetPrayerName,
      widgetCountdown: !!widgetCountdown
    });
    return;
  }
  
  // Safety check - don't update if table is prominently visible
  if (prayerTableSection) {
    const tableRect = prayerTableSection.getBoundingClientRect();
    const tableVisibleRatio = Math.max(0, Math.min(1, 
      (Math.min(tableRect.bottom, window.innerHeight) - Math.max(tableRect.top, 0)) / tableRect.height
    ));
    
    const isMobile = window.innerWidth <= 768;
    const hideThreshold = isMobile ? 0.5 : 0.6;
    
    if (tableVisibleRatio >= hideThreshold) {
      console.log('updateFloatingWidget: Aborting update - table is prominently visible', {
        tableVisibleRatio: tableVisibleRatio.toFixed(2),
        hideThreshold
      });
      // Instead of updating, hide the widget
      setTimeout(() => hideFloatingWidget(), 50);
      return;
    }
  }
  
  // Find next prayer from current prayer data
  if (_perPrayerNorm && Object.keys(_perPrayerNorm).length > 0) {
    const now = new Date();
    const nowHours = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    
    // Find next prayer
    let nextPrayer = null;
    let minDiff = Infinity;
    
    Object.entries(_perPrayerNorm).forEach(([key, time]) => {
      const timeHours = parseFloat(time);
      let diff = timeHours - nowHours;
      
      // Handle cross-midnight prayers
      if (diff < 0) {
        diff += 24;
      }
      
      if (diff < minDiff) {
        minDiff = diff;
        nextPrayer = {
          key,
          name: prayNames[key] || key,
          time: time,
          diff: diff
        };
      }
    });
    
    currentNextPrayer = nextPrayer;
    
    if (nextPrayer) {
      widgetPrayerName.textContent = nextPrayer.name;
      
      // Update countdown
      const diffSec = Math.max(0, Math.round(nextPrayer.diff * 3600));
      widgetCountdown.textContent = formatHMS(diffSec);
    } else {
      // Fallback when no next prayer found
      widgetPrayerName.textContent = 'Memuat...';
      widgetCountdown.textContent = '--:--:--';
    }
  } else {
    // Show loading state when no prayer data available
    widgetPrayerName.textContent = 'Memuat jadwal...';
    widgetCountdown.textContent = '--:--:--';
    console.log('No prayer data available for floating widget');
  }
}

// Stabilized show function with cooldown
let lastShowTime = 0;
let lastHideTime = 0;
const SHOW_COOLDOWN = 500; // Minimum time between show/hide operations

function showFloatingWidget() {
  const now = Date.now();
  
  // Prevent rapid show/hide cycles
  if (now - lastHideTime < SHOW_COOLDOWN) {
    console.log('showFloatingWidget: Skipped due to cooldown');
    return;
  }
  
  if (!isWidgetVisible && floatingWidget) {
    console.log('showFloatingWidget: Showing widget');
    isWidgetVisible = true;
    lastShowTime = now;
    
    floatingWidget.style.display = 'block';
    
    // Ensure stable transition
    setTimeout(() => {
      if (isWidgetVisible) { // Double-check state hasn't changed
        floatingWidget.classList.add('visible');
      }
    }, 50); // Increased delay for stability
  }
}

function hideFloatingWidget() {
  const now = Date.now();
  
  // Prevent rapid show/hide cycles
  if (now - lastShowTime < SHOW_COOLDOWN) {
    console.log('hideFloatingWidget: Skipped due to cooldown');
    return;
  }
  
  if (isWidgetVisible && floatingWidget) {
    console.log('hideFloatingWidget: Hiding widget');
    isWidgetVisible = false;
    lastHideTime = now;
    
    floatingWidget.classList.remove('visible');
    
    // Hide after animation completes
    setTimeout(() => {
      if (!isWidgetVisible) { // Double-check state hasn't changed
        floatingWidget.style.display = 'none';
      }
    }, 400);
  }
}

// Add click handler for floating widget
// Force show floating widget for debugging
function forceShowFloatingWidget() {
  if (floatingWidget && _perPrayerNorm && Object.keys(_perPrayerNorm).length > 0) {
    console.log('Force showing floating widget');
    updateFloatingWidget();
    showFloatingWidget();
    return true;
  }
  console.log('Cannot force show widget:', {
    hasWidget: !!floatingWidget,
    hasPrayerData: !!(_perPrayerNorm && Object.keys(_perPrayerNorm).length > 0)
  });
  return false;
}

// Debug function to check widget state
function debugFloatingWidget() {
  console.log('=== Floating Widget Debug ===');
  console.log('Widget element exists:', !!floatingWidget);
  console.log('Widget element ID:', floatingWidget?.id);
  console.log('Widget classes:', floatingWidget ? Array.from(floatingWidget.classList) : 'N/A');
  console.log('Widget display:', floatingWidget?.style.display);
  console.log('Widget computed display:', floatingWidget ? window.getComputedStyle(floatingWidget).display : 'N/A');
  console.log('Widget computed opacity:', floatingWidget ? window.getComputedStyle(floatingWidget).opacity : 'N/A');
  console.log('Widget computed visibility:', floatingWidget ? window.getComputedStyle(floatingWidget).visibility : 'N/A');
  console.log('Widget rect:', floatingWidget?.getBoundingClientRect());
  console.log('Is widget visible state:', isWidgetVisible);
  console.log('Prayer data exists:', !!(_perPrayerNorm && Object.keys(_perPrayerNorm).length > 0));
  console.log('Prayer data:', _perPrayerNorm);
  console.log('Window width:', window.innerWidth);
  console.log('Is mobile:', window.innerWidth <= 768);
  console.log('Is desktop:', window.innerWidth > 768);
  console.log('=== End Debug ===');
  return {
    element: floatingWidget,
    isVisible: isWidgetVisible,
    hasPrayerData: !!(_perPrayerNorm && Object.keys(_perPrayerNorm).length > 0)
  };
}

// Expose to window for debugging
window.forceShowFloatingWidget = forceShowFloatingWidget;
window.debugFloatingWidget = debugFloatingWidget;

function addFloatingWidgetClickHandler() {
  if (floatingWidget) {
    floatingWidget.addEventListener('click', () => {
      // Scroll to prayer table section
      prayerTableSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    });
  }
}