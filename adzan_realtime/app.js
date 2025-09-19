/* === Algoritma PrayTimes.js (ringkas, sudah diintegrasikan) === */
// [kode matematis perhitungan sholat — tetap seperti file asli, tidak dipotong]

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
  var params={fajrAngle:18,ishaAngle:17,asrFactor:1};
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
  var asr=Z+1/15*darccot(params.asrFactor+dtan(Math.abs(lat-D)));
  var sunset=compute(0.833,true);
  var maghrib=sunset;
  var isha=params.ishaAngle<90?compute(params.ishaAngle,true):sunset+90/60;

  return {fajr:fajr,sunrise:sunrise,dhuhr:dhuhr,asr:asr,maghrib:maghrib,isha:isha};
}

/* === Aladhan API integration === */
const ALADHAN_METHOD_MAP = {
  MWL: 3,      // Muslim World League
  ISNA: 2,     // Islamic Society of North America
  Egypt: 5,    // Egyptian
  Makkah: 4,   // Umm al-Qura / Makkah
  Karachi: 1   // University of Karachi
};

async function fetchTimingsFromAladhan(date, lat, lon, methodKey){
  try{
    const methodId = ALADHAN_METHOD_MAP[methodKey] ?? 3;
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

/* === App utama === */
const prayNames={fajr:"Subuh",sunrise:"Terbit",dhuhr:"Dzuhur",asr:"Ashar",maghrib:"Maghrib",isha:"Isya"};

let currentLat=null,currentLon=null,currentCity="Lokasi belum ditentukan";
let currentMethod="Karachi";
let countdownTimer=null;
let _lastDateStr = (new Date()).toDateString(); // track local day for auto-refresh
let _midnightTimer = null;
let _perPrayerNorm = {}; // store normalized times for live updates
let _liveInterval = null;
let currentTimeZone = null; // IANA timezone name (e.g. 'Asia/Jakarta') from API when available

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
    const localSeconds = hh*3600 + mm*60 + ss;
    const utcSeconds = date.getUTCHours()*3600 + date.getUTCMinutes()*60 + date.getUTCSeconds();
    let diff = localSeconds - utcSeconds;
    if(diff > 12*3600) diff -= 24*3600;
    if(diff < -12*3600) diff += 24*3600;
    return diff/3600;
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
    scheduleMidnightRefresh();
  }
  requestAnimationFrame(updateClock);
}

function scheduleMidnightRefresh(){
  try{ if(_midnightTimer) clearTimeout(_midnightTimer); }catch(e){}
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
  const ms = tomorrow.getTime() - now.getTime();
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
            'jumada al-ula':'Jumadil Awal','jumada al-awwal':'Jumadil Awal','jumada al ula':'Jumadil Awal','jumadil awal':'Jumadil Awal',
            'jumada al-akhirah':'Jumadil Akhir','jumada al-akhir':'Jumadil Akhir','jumadil akhir':'Jumadil Akhir','jumada al-thaniyah':'Jumadil Akhir',
            'rajab':'Rajab','shaban':'Sya'+'ban','shaʿban':'Sya'+'ban','shaaban':'Sya'+'ban','sya ban':'Sya'+'ban',
            'ramadan':'Ramadhan','ramazan':'Ramadhan','rama dan':'Ramadhan','ramadhan':'Ramadhan',
            'shawwal':'Syawal','dhul qaadah':'Dzulqaidah','dhu al-qadah':'Dzulqaidah','dhul qadah':'Dzulqaidah','dhul-qadah':'Dzulqaidah',
            'dhul hijjah':'Dzulhijjah','dhu al-hijjah':'Dzulhijjah','dhul-hijjah':'Dzulhijjah','dzulhijjah':'Dzulhijjah'
          };
          const hijDay = hijri.day || hijri.date || '';
          const rawMonth = (hijri.month && (hijri.month.en || hijri.month.ar)) || '';
          const key = normalizeMonthName(rawMonth);
          const hijMonId = bulanMap[key] || (rawMonth || '');
          const hijYear = hijri.year || '';
          hdateStr = `${hijDay} ${hijMonId} ${hijYear} H`;
        } else {
          try{
            hdateStr = new Intl.DateTimeFormat('id-ID', {calendar: 'islamic', day: 'numeric', month: 'long', year: 'numeric'}).format(now);
          }catch(e){ try{ hdateStr = new Intl.DateTimeFormat('id-ID-u-ca-islamic').format(now); }catch(e2){ hdateStr=''; } }
        }
        document.getElementById('nowdate').textContent = gdate + (hdateStr?(' — '+hdateStr):'');
      }catch(e){ }
      if(apiTimezone){
        try{
          const tzName = apiTimezone;
          const parts = new Intl.DateTimeFormat('en-US', {timeZone: tzName, timeZoneName: 'short'}).formatToParts(now);
          const tzShort = parts.find(p => p.type === 'timeZoneName')?.value;
          if(tzShort){
            document.getElementById("tzname").textContent = tzName + ' (' + tzShort + ')';
          } else {
            document.getElementById("tzname").textContent = tzName;
          }
        }catch(e){
          document.getElementById("tzname").textContent = apiTimezone;
        }
        currentTimeZone = apiTimezone;
      }
      const tbody=document.querySelector("#prayTable tbody");
      tbody.innerHTML="";
      const norm = {};
      for(let k of Object.keys(prayNames)){
        const v = times[k];
        if(typeof v === 'number') norm[k] = v;
        else if(typeof v === 'string'){
          const parts = v.split(':');
          if(parts.length>=2) norm[k] = parseInt(parts[0],10) + parseInt(parts[1],10)/60 + (parts[2]?parseInt(parts[2],10)/3600:0);
          else norm[k] = NaN;
        } else norm[k] = NaN;
      }

      const nowHoursCheck = nowParts.h + nowParts.m/60 + nowParts.s/3600;
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
      for(let k of Object.keys(prayNames)){
        const displayTime = floatToTime(times[k]);
        const t = norm[k];
        let infoText = '—';
        if(!isNaN(t)){
          if(t <= nowHours){
            infoText = 'Selesai';
          } else {
            const diffSec = Math.round((t - nowHours) * 3600);
            infoText = formatHMS(diffSec);
          }
        }

        const tr=document.createElement('tr');
        tr.setAttribute('data-prayer', k);
        tr.innerHTML = `<td>${prayNames[k]}</td><td class="time">${displayTime}</td><td class="small" data-info="${k}">${infoText}</td>`;
        tbody.appendChild(tr);
      }
      updateNext(times);
      let nextKey = null; let minDiff = Infinity;
      const nowHoursForNext = nowParts.h + nowParts.m/60 + nowParts.s/3600;
      for(const k of Object.keys(norm)){
        const t = norm[k];
        if(isNaN(t)) continue;
        const diff = t - nowHoursForNext;
        if(diff > 0 && diff < minDiff){ minDiff = diff; nextKey = k; }
      }
      if(!nextKey){ nextKey = 'fajr'; }
      _perPrayerNorm = Object.assign({}, norm);
      if(!_liveInterval){
        _liveInterval = setInterval(()=>{ updateLiveInfo(); },1000);
      }
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
    const diff = t - nowHours;
    if(diff > 0 && diff < minDiff){ minDiff = diff; nextKey = k; }
  }
  if(!nextKey){ nextKey = 'fajr'; }

  document.querySelectorAll('#prayTable tbody tr').forEach(tr=>{
    const key = tr.getAttribute('data-prayer');
    const infoCell = tr.querySelector('td[data-info="'+key+'"]');
    const t = _perPrayerNorm[key];
    if(isNaN(t)){
      infoCell.textContent = '—';
      tr.classList.remove('row-next');
      return;
    }
    if(key === nextKey){
      let diffHours = t - nowHours;
      if(diffHours < 0) diffHours += 24;
      const diffSec = Math.max(0, Math.round(diffHours * 3600));
      const h = Math.floor(diffSec/3600); const m = Math.floor((diffSec%3600)/60); const s = diffSec%60;
      infoCell.textContent = (h<10?('0'+h):h)+':' + (m<10?('0'+m):m)+':' + (s<10?('0'+s):s);
    } else {
      if(t <= nowHours) infoCell.textContent = 'Selesai';
      else infoCell.textContent = '—';
    }
    if(key === nextKey) tr.classList.add('row-next'); else tr.classList.remove('row-next');
  });
}

function updateNext(times){
  try{ if(countdownTimer) clearTimeout(countdownTimer); }catch(e){}

  const now=new Date();
  const nowParts = getTimePartsInZone(now, currentTimeZone);
  const cur = nowParts.h + nowParts.m/60 + nowParts.s/3600;
  let upcoming=null;
  const norm={};
  for(let k of Object.keys(prayNames)){
    const v=times[k];
    if(typeof v==='number') norm[k]=v;
    else if(typeof v==='string'){
      const parts=v.split(':');
      if(parts.length>=2) norm[k]=parseInt(parts[0],10)+parseInt(parts[1],10)/60+(parts[2]?parseInt(parts[2],10)/3600:0);
      else norm[k]=NaN;
    } else norm[k]=NaN;
  }
  for(let k of Object.keys(prayNames)){
    if(norm[k]>cur){upcoming=norm[k];break;}
  }
  if(!upcoming){ upcoming = (typeof times.fajr === 'number' ? times.fajr : (isNaN(parseFloat(times.fajr)) ? NaN : parseFloat(times.fajr))) + 24; }

  if(isNaN(upcoming)) return;
  const ms = Math.max(200, Math.round((upcoming - cur) * 3600 * 1000));
  countdownTimer = setTimeout(()=>{
    renderPrayers();
  }, ms+500);
}

function setLocation(lat,lon,name, timezone=null){
  currentLat=lat;currentLon=lon;currentCity=name;
  document.getElementById("locname").textContent=name;
  if(timezone) currentTimeZone = timezone;
  renderPrayers();
  scheduleMidnightRefresh();
}

async function getCoordsFromCity(city){
  try{
    const cacheKey = `geocode:city:${city.toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);
    if(cached){
      return JSON.parse(cached);
    }
    const url=`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
    const res=await fetch(url,{headers:{'Accept-Language':'id'}});
    const data=await res.json();
    if(data && data.length>0){
      const out = {lat:parseFloat(data[0].lat),lon:parseFloat(data[0].lon),display:data[0].display_name};
      try{ localStorage.setItem(cacheKey, JSON.stringify(out)); }catch(e){}
      return out;
    }
  }catch(e){console.error(e);} 
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
  if(!city){alert("Masukkan nama kota!");return;}
  const result=await getCoordsFromCity(city);
  if(result){setLocation(result.lat,result.lon,result.display);} 
  else alert("Kota tidak ditemukan.");
});
document.getElementById("btnDefault").addEventListener("click",async()=>{
  const city = 'Lebak Bulus, Cilandak, Jakarta Selatan, Daerah Khusus Ibukota Jakarta, Jawa, Indonesia';
  const result = await getCoordsFromCity(city);
  if(result) {
    const display = 'Lebak Bulus, Cilandak, Jakarta Selatan, Daerah Khusus Ibukota Jakarta, Jawa, Indonesia';
    setLocation(result.lat,result.lon,display);
  } else alert('Gagal mengambil lokasi default.');
});

updateClock();
navigator.geolocation.getCurrentPosition(pos=>{
  (async ()=>{
    const rg = await reverseGeocode(pos.coords.latitude,pos.coords.longitude);
    setLocation(pos.coords.latitude,pos.coords.longitude, rg.display || 'GPS');
  })();
},()=>{document.getElementById("locname").textContent="Lokasi manual diperlukan";});
scheduleMidnightRefresh();
