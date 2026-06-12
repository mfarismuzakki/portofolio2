/* =====================================================================
   FLOATING PRAYER-TIMES WIDGET
   Self-contained. Reuses the PrayTimes algorithm from adzan_realtime
   (Kemenag Indonesia parameters) so it stays consistent with the
   IslamHub apps and works fully offline. Default city: Jakarta.
   ===================================================================== */
(function () {
    'use strict';

    /* ---------------- PrayTimes math (from adzan_realtime/app.js) ------- */
    function D2R(d){ return (d*Math.PI)/180; }
    function R2D(r){ return (r*180)/Math.PI; }
    function fixAngle(a){ return a - 360*Math.floor(a/360); }
    function fixHour(a){ return a - 24*Math.floor(a/24); }
    function dsin(d){ return Math.sin(D2R(d)); }
    function dcos(d){ return Math.cos(D2R(d)); }
    function dtan(d){ return Math.tan(D2R(d)); }
    function darcsin(x){ return R2D(Math.asin(x)); }
    function darccos(x){ return R2D(Math.acos(x)); }
    function darctan2(y,x){ return R2D(Math.atan2(y,x)); }
    function darccot(x){ return R2D(Math.atan(1/x)); }

    function getSunPosition(jd){
        var D=jd-2451545.0;
        var g=fixAngle(357.529+0.98560028*D);
        var q=fixAngle(280.459+0.98564736*D);
        var L=fixAngle(q+1.915*dsin(g)+0.020*dsin(2*g));
        var e=23.439-0.00000036*D;
        var RA=darctan2(dcos(e)*dsin(L),dcos(L))/15;
        var eqt=q/15-fixHour(RA);
        var decl=darcsin(dsin(e)*dsin(L));
        return { decl:decl, eqt:eqt };
    }
    function dateToJulian(date){
        return (Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0)/86400000)+2440587.5;
    }
    // returns prayer times as decimal hours (before timezone correction)
    function getPrayerTimesRaw(date,lat,lon){
        var params={ fajrAngle:20, ishaAngle:18, asrFactor:1 }; // Kemenag Indonesia
        var jDate=dateToJulian(date)-lon/(15*24);
        var sun=getSunPosition(jDate);
        var Dd=sun.decl;
        var Z=12-fixHour(sun.eqt);
        function compute(angle,afterSun){
            return Z+(afterSun?1:-1)/15*darccos((-dsin(angle)-dsin(Dd)*dsin(lat))/(dcos(Dd)*dcos(lat)));
        }
        return {
            fajr:    compute(params.fajrAngle,false),
            sunrise: compute(0.833,false),
            dhuhr:   Z,
            asr:     Z+1/15*darccos((dsin(darccot(params.asrFactor+dtan(Math.abs(lat-Dd))))-dsin(Dd)*dsin(lat))/(dcos(Dd)*dcos(lat))),
            maghrib: compute(0.833,true),
            isha:    compute(params.ishaAngle,true)
        };
    }
    function floatToTime(time){
        if(isNaN(time)) return "--:--";
        time=fixHour(time+0.5/60);
        var h=Math.floor(time); var m=Math.floor((time-h)*60);
        return (h<10?"0":"")+h+":"+(m<10?"0":"")+m;
    }

    /* ---------------- cities (lat, lon, timezone) ---------------------- */
    var CITIES = [
        { name:'Jakarta',     lat:-6.2088, lon:106.8456, tz:7 },
        { name:'Bandung',     lat:-6.9175, lon:107.6191, tz:7 },
        { name:'Semarang',    lat:-6.9667, lon:110.4167, tz:7 },
        { name:'Yogyakarta',  lat:-7.7956, lon:110.3695, tz:7 },
        { name:'Surabaya',    lat:-7.2575, lon:112.7521, tz:7 },
        { name:'Medan',       lat: 3.5952, lon: 98.6722, tz:7 },
        { name:'Palembang',   lat:-2.9761, lon:104.7754, tz:7 },
        { name:'Pekanbaru',   lat: 0.5071, lon:101.4478, tz:7 },
        { name:'Banda Aceh',  lat: 5.5483, lon: 95.3238, tz:7 },
        { name:'Pontianak',   lat:-0.0263, lon:109.3425, tz:7 },
        { name:'Makassar',    lat:-5.1477, lon:119.4327, tz:8 },
        { name:'Denpasar',    lat:-8.6705, lon:115.2126, tz:8 },
        { name:'Banjarmasin', lat:-3.3194, lon:114.5908, tz:8 },
        { name:'Manado',      lat: 1.4748, lon:124.8421, tz:8 },
        { name:'Jayapura',    lat:-2.5337, lon:140.7181, tz:9 },
        { name:'Mekkah',      lat:21.4225, lon: 39.8262, tz:3 },
        { name:'Madinah',     lat:24.5247, lon: 39.5692, tz:3 }
    ];

    var PRAYERS = [
        { key:'fajr',    name:'Subuh',   obligatory:true  },
        { key:'sunrise', name:'Syuruq',  obligatory:false },
        { key:'dhuhr',   name:'Dzuhur',  obligatory:true  },
        { key:'asr',     name:'Ashar',   obligatory:true  },
        { key:'maghrib', name:'Maghrib', obligatory:true  },
        { key:'isha',    name:'Isya',    obligatory:true  }
    ];

    var STORE_CITY = 'pw_city_name';
    var STORE_MIN  = 'pw_minimized';
    var STORE_EXP  = 'pw_expanded';

    function currentCity(){
        var saved = localStorage.getItem(STORE_CITY);
        var c = CITIES.filter(function(x){ return x.name === saved; })[0];
        return c || CITIES[0]; // default Jakarta
    }

    // compute decimal hours (timezone-corrected) for a city on a given Y/M/D
    function cityTimes(city, y, mo, d){
        var raw = getPrayerTimesRaw(new Date(y, mo, d), city.lat, city.lon);
        var corr = city.tz - city.lon/15; // PrayTimes longitude/timezone correction
        var out = {};
        Object.keys(raw).forEach(function(k){ out[k] = raw[k] + corr; });
        return out;
    }

    // the "now" components in the city's timezone
    function cityNowParts(city){
        var d = new Date(Date.now() + city.tz*3600*1000);
        return { y:d.getUTCFullYear(), mo:d.getUTCMonth(), d:d.getUTCDate() };
    }

    // epoch (ms) of a prayer given its decimal hour, in the city's timezone
    function prayerEpoch(city, y, mo, d, hoursDec){
        var total = Math.round(fixHour(hoursDec) * 60);
        var hh = Math.floor(total / 60), mm = total % 60;
        return Date.UTC(y, mo, d, hh, mm, 0) - city.tz*3600*1000;
    }

    /* ---------------- DOM ---------------------------------------------- */
    var el, restoreBtn, ui = {};

    function build(){
        el = document.createElement('div');
        el.className = 'pw-widget';
        el.innerHTML =
            '<div class="pw-head">' +
                '<i class="fas fa-mosque pw-mosque"></i>' +
                '<select class="pw-city" aria-label="Pilih kota"></select>' +
                '<button class="pw-min" title="Sembunyikan" aria-label="Sembunyikan">&minus;</button>' +
            '</div>' +
            '<div class="pw-next">' +
                '<div class="pw-next-label">MENUJU <span class="pw-next-name">—</span></div>' +
                '<div class="pw-countdown">--:--:--</div>' +
                '<div class="pw-date">—</div>' +
            '</div>' +
            '<button class="pw-toggle"><i class="fas fa-chevron-down"></i> <span>Jadwal lengkap</span></button>' +
            '<div class="pw-list"></div>' +
            '<a class="pw-link" href="islamhub/index.html">' +
                '<i class="fas fa-kaaba"></i> Buka IslamHub' +
            '</a>';
        document.body.appendChild(el);

        restoreBtn = document.createElement('button');
        restoreBtn.className = 'pw-restore';
        restoreBtn.title = 'Jadwal Sholat';
        restoreBtn.innerHTML = '<i class="fas fa-mosque"></i>';
        document.body.appendChild(restoreBtn);

        ui.city = el.querySelector('.pw-city');
        ui.nextName = el.querySelector('.pw-next-name');
        ui.countdown = el.querySelector('.pw-countdown');
        ui.date = el.querySelector('.pw-date');
        ui.list = el.querySelector('.pw-list');

        // populate city dropdown
        CITIES.forEach(function(c){
            var o = document.createElement('option');
            o.value = c.name; o.textContent = c.name;
            ui.city.appendChild(o);
        });
        ui.city.value = currentCity().name;

        ui.city.addEventListener('change', function(){
            localStorage.setItem(STORE_CITY, ui.city.value);
            render();
        });
        el.querySelector('.pw-min').addEventListener('click', function(){ setMinimized(true); });
        restoreBtn.addEventListener('click', function(){ setMinimized(false); });

        el.querySelector('.pw-toggle').addEventListener('click', function(){
            setExpanded(!el.classList.contains('pw-expanded'));
        });
        setExpanded(localStorage.getItem(STORE_EXP) === '1'); // default: collapsed

        setMinimized(localStorage.getItem(STORE_MIN) === '1');
        render();
        tick();
        setInterval(tick, 1000);
    }

    function setMinimized(min){
        localStorage.setItem(STORE_MIN, min ? '1' : '0');
        el.classList.toggle('pw-hidden', min);
        restoreBtn.classList.toggle('pw-show', min);
    }

    function setExpanded(exp){
        localStorage.setItem(STORE_EXP, exp ? '1' : '0');
        el.classList.toggle('pw-expanded', exp);
        var lbl = el.querySelector('.pw-toggle span');
        if (lbl) lbl.textContent = exp ? 'Tutup jadwal' : 'Jadwal lengkap';
    }

    var cache = null; // { city, y, mo, d, times }

    function render(){
        var city = currentCity();
        var p = cityNowParts(city);
        var times = cityTimes(city, p.y, p.mo, p.d);
        cache = { city:city, y:p.y, mo:p.mo, d:p.d, times:times };

        // date line in city's timezone
        var dObj = new Date(Date.UTC(p.y, p.mo, p.d) );
        ui.date.textContent = dObj.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', timeZone:'UTC' }) + ' · ' + city.name;

        // prayer list
        ui.list.innerHTML = '';
        PRAYERS.forEach(function(pr){
            var row = document.createElement('div');
            row.className = 'pw-row' + (pr.obligatory ? '' : ' pw-row-soft');
            row.dataset.key = pr.key;
            row.innerHTML = '<span class="pw-row-name">' + pr.name + '</span>' +
                            '<span class="pw-row-time">' + floatToTime(times[pr.key]) + '</span>';
            ui.list.appendChild(row);
        });
    }

    function tick(){
        if(!cache) return;
        var city = cache.city;
        var now = Date.now();

        // build list of obligatory prayer epochs for today
        var upcoming = null, upcomingPr = null;
        PRAYERS.forEach(function(pr){
            if(!pr.obligatory) return;
            var ep = prayerEpoch(city, cache.y, cache.mo, cache.d, cache.times[pr.key]);
            if(ep > now && (upcoming === null || ep < upcoming)){ upcoming = ep; upcomingPr = pr; }
        });

        // none left today -> tomorrow's Subuh
        if(upcoming === null){
            var t = new Date(Date.UTC(cache.y, cache.mo, cache.d) + 86400000);
            var ty=t.getUTCFullYear(), tmo=t.getUTCMonth(), td=t.getUTCDate();
            var tt = cityTimes(city, ty, tmo, td);
            upcoming = prayerEpoch(city, ty, tmo, td, tt.fajr);
            upcomingPr = PRAYERS[0];
            // if the day rolled over in the city, refresh the schedule
            var p = cityNowParts(city);
            if(p.d !== cache.d) render();
        }

        ui.nextName.textContent = upcomingPr ? upcomingPr.name : '—';

        var diff = Math.max(0, Math.floor((upcoming - now) / 1000));
        var h = Math.floor(diff/3600), m = Math.floor((diff%3600)/60), s = diff%60;
        function pad(n){ return n<10 ? '0'+n : ''+n; }
        ui.countdown.textContent = pad(h)+':'+pad(m)+':'+pad(s);

        // highlight active next row
        Array.prototype.forEach.call(ui.list.children, function(row){
            row.classList.toggle('pw-active', upcomingPr && row.dataset.key === upcomingPr.key);
        });
    }

    function boot(){ build(); }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else { boot(); }
})();
