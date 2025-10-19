/**
 * Adzan Component for Islamic SuperApps
 * Real-time prayer schedule with location-based calculations
 */

export default class AdzanComponent {
    constructor({ container, eventBus, sharedData, storageManager }) {
        this.container = container;
        this.eventBus = eventBus;
        this.sharedData = sharedData;
        this.storageManager = storageManager;
        
        // Component state
        this.currentLocation = null;
        this.currentMethod = 'KEMENAG';
        this.prayerTimes = null;
        this.countdownTimer = null;
        this.notificationsEnabled = false;
        this.clockTimer = null;
        this.hadithTimer = null;
        this.currentHadithIndex = 0;
        this.hadithAutoPlay = true;
        
        // API settings - use external data if available
        this.ALADHAN_METHOD_MAP = window.calculationMethods || {
            KEMENAG: 11,
            MWL: 3,
            ISNA: 2,
            Egypt: 5,
            Makkah: 4,
            Karachi: 1
        };
        
        // Prayer names - use external data if available
        this.prayNames = {
            fajr: "Subuh",
            sunrise: "Syuruq", 
            dhuhr: "Dzuhur",
            asr: "Ashar",
            maghrib: "Maghrib",
            isha: "Isya"
        };
        // Hadith data - use external data if available
        this.hadithData = window.hadithCollection || [];
    }

    async init() {
        try {
            // Load saved location if available
            await this.loadSavedLocation();
            
            // Render component HTML
            this.render();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize prayer times
            await this.renderPrayers();
            
            // Start live updates
            this.startLiveUpdates();
            
            // Setup midnight refresh
            this.setupMidnightRefresh();
            
            console.log('✅ Adzan Component initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Adzan Component:', error);
            this.renderError();
        }
    }

    async loadSavedLocation() {
        if (this.sharedData.location) {
            this.currentLat = this.sharedData.location.lat;
            this.currentLon = this.sharedData.location.lon;
            this.currentCity = this.sharedData.location.city || this.currentCity;
            this.currentTimeZone = this.sharedData.location.timezone || this.currentTimeZone;
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="adzan-wrapper">
                <div class="card prayer-header">
                    <div class="row" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px;">
                        <div>
                            <div class="clock" id="currentTime">--:--:--</div>
                            <div class="sub" id="currentDate">Memuat...</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="sub"><i class="fas fa-map-marker-alt"></i> Lokasi</div>
                            <div id="locname" class="small loading">Jakarta (Default)</div>
                            <div style="margin-top: 4px;" class="smaller">
                                <i class="fas fa-info-circle"></i> Klik untuk ubah sesuai kota Anda
                            </div>
                            <div style="margin-top: 6px;" class="small">Timezone: <span id="tzname">Asia/Jakarta</span></div>
                        </div>
                    </div>
                </div>

                <!-- Hadith Ticker -->
                <div class="card hadith-ticker" style="margin-top: 20px;">
                    <div class="hadith-content" id="hadithContent">
                        <i class="fas fa-quote-right"></i>
                        <div class="hadith-text-container">
                            <div class="hadith-arabic" id="hadithArabic">Loading...</div>
                            <div class="hadith-indonesia" id="hadithIndonesia">Memuat hadith...</div>
                            <div class="hadith-reference" id="hadithReference">-</div>
                        </div>
                    </div>
                    <div class="hadith-controls">
                        <button class="hadith-btn" id="prevHadith" title="Hadist Sebelumnya">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="hadith-btn" id="playPauseHadith" title="Pause/Play Auto">
                            <i class="fas fa-pause"></i>
                        </button>
                        <button class="hadith-btn" id="nextHadith" title="Hadist Selanjutnya">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="hadith-progress">
                        <div class="progress-bar-container">
                            <div class="progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Prayer Times Table -->
                <div class="card" style="margin-top: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
                        <div>
                            <div class="sub"><i class="fas fa-mosque"></i> Jadwal sholat hari ini</div>
                            <div class="small">Metode: <span id="methodName">Kemenag Indonesia</span></div>
                        </div>
                        <div class="controls">
                            <select id="methodSelect" title="Pilih metode perhitungan">
                                <option value="KEMENAG" selected>Kemenag Indonesia</option>
                                <option value="MWL">Muslim World League</option>
                                <option value="ISNA">ISNA</option>
                                <option value="Egypt">Egypt</option>
                                <option value="Makkah">Umm al-Qura / Makkah</option>
                                <option value="Karachi">University of Karachi</option>
                            </select>
                            <div class="city-input-container">
                                <input id="cityInput" list="citySuggestions" type="text" placeholder="🔍 Ketik nama kota...">
                                <div class="city-loader" id="cityLoader" style="display: none;">
                                    <div class="loader-spinner"></div>
                                </div>
                            </div>
                            <datalist id="citySuggestions"></datalist>
                            <button id="btnCity"><i class="fas fa-city"></i> Gunakan kota</button>
                            <button id="btnRefresh"><i class="fas fa-location-arrow"></i> GPS</button>
                        </div>
                    </div>

                    <table id="prayTable">
                        <thead>
                            <tr>
                                <th><i class="fas fa-pray"></i> Sholat</th>
                                <th><i class="fas fa-clock"></i> Waktu</th>
                                <th><i class="fas fa-info-circle"></i> Info</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>

                <!-- Sunnah Prayers Section -->
                <div class="card sunnah-section" style="margin-top: 20px;">
                    <div class="sub"><i class="fas fa-moon"></i> Sholat Sunnah Saat Ini</div>
                    <div class="small" style="margin-bottom: 15px;">Amalan sunnah yang dapat dikerjakan pada waktu ini</div>
                    <div id="sunnahPrayersList" class="sunnah-prayers-list">
                        <!-- Sunnah prayers will be populated by JavaScript -->
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // GPS button  
        const btnRefresh = this.container.querySelector('#btnRefresh');
        btnRefresh?.addEventListener('click', () => this.getCurrentLocation());

        // City search
        const btnCity = this.container.querySelector('#btnCity');
        const cityInput = this.container.querySelector('#cityInput');
        
        btnCity?.addEventListener('click', () => this.searchCity());
        cityInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCity();
        });

        // Method selector
        const methodSelect = this.container.querySelector('#methodSelect');
        methodSelect?.addEventListener('change', (e) => {
            this.currentMethod = e.target.value;
            const methodNameEl = this.container.querySelector('#methodName');
            if (methodNameEl) {
                const methodNames = {
                    'KEMENAG': 'Kemenag Indonesia',
                    'MWL': 'Muslim World League',
                    'ISNA': 'ISNA',
                    'Egypt': 'Egypt',
                    'Makkah': 'Umm al-Qura / Makkah',
                    'Karachi': 'University of Karachi'
                };
                methodNameEl.textContent = methodNames[e.target.value] || e.target.value;
            }
            this.renderPrayers();
        });

        // Set initial method value
        if (methodSelect) {
            methodSelect.value = this.currentMethod;
        }

        // Hadith controls
        const prevBtn = this.container.querySelector('#prevHadith');
        const nextBtn = this.container.querySelector('#nextHadith');
        const playPauseBtn = this.container.querySelector('#playPauseHadith');

        prevBtn?.addEventListener('click', () => this.previousHadith());
        nextBtn?.addEventListener('click', () => this.nextHadith());
        playPauseBtn?.addEventListener('click', () => this.toggleHadithAutoPlay());

        // Start hadith auto-rotation
        this.startHadithRotation();
        
        // Display first hadith
        this.displayCurrentHadith();
    }

    async getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showNotification('Geolocation tidak didukung browser ini', 'error');
            return;
        }

        const locationBtn = this.container.querySelector('#getCurrentLocationBtn');
        const btnText = locationBtn.querySelector('span');
        const btnIcon = locationBtn.querySelector('i');
        
        btnText.textContent = 'Mendapatkan lokasi...';
        btnIcon.className = 'fas fa-spinner fa-spin';

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                });
            });

            const { latitude, longitude } = position.coords;
            await this.updateLocation(latitude, longitude, 'Lokasi Saat Ini');
            
        } catch (error) {
            console.error('Geolocation error:', error);
            this.showNotification('Gagal mendapatkan lokasi. Pastikan lokasi diizinkan.', 'error');
        } finally {
            btnText.textContent = 'Gunakan Lokasi Saat Ini';
            btnIcon.className = 'fas fa-crosshairs';
        }
    }

    async searchCity() {
        const cityInput = this.container.querySelector('#cityInput');
        const searchBtn = this.container.querySelector('#searchCityBtn');
        const query = cityInput.value.trim();
        
        if (!query) {
            this.showNotification('Masukkan nama kota', 'warning');
            return;
        }

        const btnIcon = searchBtn.querySelector('i');
        btnIcon.className = 'fas fa-spinner fa-spin';

        try {
            // Use a geocoding service (you can replace with your preferred service)
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=your_api_key`);
            
            if (!response.ok) {
                throw new Error('City search failed');
            }

            const data = await response.json();
            
            if (data.length > 0) {
                const city = data[0];
                await this.updateLocation(city.lat, city.lon, `${city.name}, ${city.country}`);
                cityInput.value = '';
            } else {
                this.showNotification('Kota tidak ditemukan', 'warning');
            }
            
        } catch (error) {
            console.error('City search error:', error);
            this.showNotification('Gagal mencari kota. Coba lagi nanti.', 'error');
        } finally {
            btnIcon.className = 'fas fa-search';
        }
    }

    async updateLocation(lat, lon, cityName) {
        this.currentLat = lat;
        this.currentLon = lon;
        this.currentCity = cityName;

        // Update shared data
        this.sharedData.location = {
            lat: lat,
            lon: lon,
            city: cityName,
            timezone: this.currentTimeZone
        };

        // Notify other components
        this.eventBus.dispatchEvent(new CustomEvent('locationUpdate', {
            detail: this.sharedData.location
        }));

        // Update display
        const locnameEl = this.container.querySelector('#locname');
        if (locnameEl) {
            locnameEl.textContent = cityName;
        }

        // Refresh prayer times
        await this.renderPrayers();
        
        this.showNotification('Lokasi berhasil diperbarui', 'success');
    }

    // Mathematical prayer calculation functions (adapted from original)
    D2R(d) { return (d * Math.PI) / 180; }
    R2D(r) { return (r * 180) / Math.PI; }
    fixAngle(a) { return a - 360 * Math.floor(a / 360); }
    fixHour(a) { return a - 24 * Math.floor(a / 24); }
    dsin(d) { return Math.sin(this.D2R(d)); }
    dcos(d) { return Math.cos(this.D2R(d)); }
    dtan(d) { return Math.tan(this.D2R(d)); }
    darcsin(x) { return this.R2D(Math.asin(x)); }
    darccos(x) { return this.R2D(Math.acos(x)); }
    darctan2(y, x) { return this.R2D(Math.atan2(y, x)); }
    darccot(x) { return this.R2D(Math.atan(1 / x)); }

    getSunPosition(jd, lat, lon) {
        const D = jd - 2451545.0;
        const g = this.fixAngle(357.529 + 0.98560028 * D);
        const q = this.fixAngle(280.459 + 0.98564736 * D);
        const L = this.fixAngle(q + 1.915 * this.dsin(g) + 0.020 * this.dsin(2 * g));
        const e = 23.439 - 0.00000036 * D;
        const RA = this.darctan2(this.dcos(e) * this.dsin(L), this.dcos(L)) / 15;
        const eqt = q / 15 - this.fixHour(RA);
        const decl = this.darcsin(this.dsin(e) * this.dsin(L));
        return { decl: decl, eqt: eqt };
    }

    dateToJulian(date) {
        return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0) / 86400000) + 2440587.5;
    }

    getPrayerTimes(date, lat, lon, timezone, method) {
        const params = { fajrAngle: 20, ishaAngle: 18, asrFactor: 1 }; // Default Kemenag
        
        if (method === "KEMENAG") { params.fajrAngle = 20; params.ishaAngle = 18; params.asrFactor = 1; }
        if (method === "ISNA") { params.fajrAngle = 15; params.ishaAngle = 15; params.asrFactor = 1; }
        if (method === "Egypt") { params.fajrAngle = 19.5; params.ishaAngle = 17.5; params.asrFactor = 1; }
        if (method === "Makkah") { params.fajrAngle = 18.5; params.ishaAngle = 90; params.asrFactor = 1; }
        if (method === "Karachi") { params.fajrAngle = 18; params.ishaAngle = 18; params.asrFactor = 1; }

        const jDate = this.dateToJulian(date) - lon / (15 * 24);
        const D = this.getSunPosition(jDate, lat, lon).decl;
        const Z = 12 - this.fixHour(this.getSunPosition(jDate, lat, lon).eqt);
        
        const compute = (angle, afterSun) => {
            return Z + (afterSun ? 1 : -1) / 15 * this.darccos((-this.dsin(angle) - this.dsin(D) * this.dsin(lat)) / (this.dcos(D) * this.dcos(lat)));
        };

        const fajr = compute(params.fajrAngle, false);
        const sunrise = compute(0.833, false);
        const dhuhr = Z;
        const asr = Z + 1 / 15 * this.darccos((this.dsin(this.darccot(params.asrFactor + this.dtan(Math.abs(lat * 1 - D)))) - this.dsin(D) * this.dsin(lat)) / (this.dcos(D) * this.dcos(lat)));
        const maghrib = compute(0.833, true);
        const isha = (params.ishaAngle === 90) ? maghrib + 90 / 60 : compute(params.ishaAngle, true);

        return { fajr, sunrise, dhuhr, asr, maghrib, isha };
    }

    async fetchTimingsFromAladhan(date, lat, lon, methodKey) {
        try {
            const methodId = this.ALADHAN_METHOD_MAP[methodKey] ?? 11;
            const dt = new Date(date);
            const day = dt.getDate();
            const month = dt.getMonth() + 1;
            const year = dt.getFullYear();
            const rlat = Math.round(lat * 1000) / 1000;
            const rlon = Math.round(lon * 1000) / 1000;
            const cacheKey = `timings:${year}-${month}-${day}:${rlat},${rlon}:m${methodId}`;
            
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try {
                    return JSON.parse(cached);
                } catch (e) { }
            }

            const url = `https://api.aladhan.com/v1/timings/${Math.floor(dt.getTime() / 1000)}?latitude=${lat}&longitude=${lon}&method=${methodId}`;
            const res = await fetch(url);
            
            if (!res.ok) throw new Error('Aladhan fetch failed');
            
            const body = await res.json();
            
            if (body && body.code === 200 && body.data && body.data.timings) {
                const t = body.data.timings;
                
                const parseToFloat = (hm) => {
                    const parts = hm.split(':');
                    if (parts.length < 2) return NaN;
                    return parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60 + (parts[2] ? parseInt(parts[2], 10) / 3600 : 0);
                };

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

                try {
                    localStorage.setItem(cacheKey, JSON.stringify({ timings: out, timezone: timezone, hijri: hijri }));
                } catch (e) { }

                return { timings: out, timezone: timezone, hijri: hijri };
            }
        } catch (err) {
            console.warn('Aladhan API failed, falling back to local calc', err);
        }
        return null;
    }

    floatToTime(time) {
        if (isNaN(time)) return "--:--";
        time = this.fixHour(time + 0.5 / 60);
        const h = Math.floor(time);
        const m = Math.floor((time - h) * 60);
        return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
    }

    formatHMS(s) {
        if (s <= 0) return '00:00:00';
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = Math.floor(s % 60);
        const pad = (n) => n < 10 ? ('0' + n) : n;
        return pad(h) + ':' + pad(m) + ':' + pad(sec);
    }

    async renderPrayers() {
        try {
            const today = new Date();
            const localTimezoneOffset = -today.getTimezoneOffset() / 60;

            // Try Aladhan API first
            let apiResult = await this.fetchTimingsFromAladhan(today, this.currentLat, this.currentLon, this.currentMethod);
            let times, hijriInfo;

            if (apiResult && apiResult.timings) {
                times = apiResult.timings;
                hijriInfo = apiResult.hijri;
                if (apiResult.timezone) {
                    this.currentTimeZone = apiResult.timezone;
                }
            } else {
                // Fallback to local calculation
                times = this.getPrayerTimes(today, this.currentLat, this.currentLon, localTimezoneOffset, this.currentMethod);
                hijriInfo = null;
            }

            // Store normalized times for live updates
            this.perPrayerNorm = times;

            // Update display
            this.updateTimeDisplay(hijriInfo);
            this.updatePrayerCardsDisplay(times);

            // Update shared data for other components
            this.updateSharedPrayerData(times);

        } catch (error) {
            console.error('❌ Error rendering prayers:', error);
            this.renderError();
        }
    }

    updateTimeDisplay(hijriInfo) {
        const currentTimeEl = this.container.querySelector('#currentTime');
        const currentDateEl = this.container.querySelector('#currentDate');
        const hijriDateEl = this.container.querySelector('#hijriDate');
        const locnameEl = this.container.querySelector('#locname');
        const tznameEl = this.container.querySelector('#tzname');

        // Update current time (will be updated by live interval)
        this.updateCurrentTime();

        // Update date
        const today = new Date();
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: this.currentTimeZone
        };
        
        if (currentDateEl) {
            currentDateEl.textContent = today.toLocaleDateString('id-ID', dateOptions);
        }

        // Update Hijri date
        if (hijriDateEl) {
            if (hijriInfo && hijriInfo.date) {
                hijriDateEl.textContent = `${hijriInfo.date} ${hijriInfo.month.en} ${hijriInfo.year} H`;
            } else {
                hijriDateEl.textContent = 'Tanggal Hijriah tidak tersedia';
            }
        }

        // Update location and timezone
        if (locnameEl) {
            locnameEl.textContent = this.currentCity;
        }
        
        if (tznameEl) {
            tznameEl.textContent = this.currentTimeZone;
        }
    }

    updateCurrentTime() {
        const currentTimeEl = this.container.querySelector('#currentTime');
        if (currentTimeEl) {
            const now = new Date();
            const timeOptions = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: this.currentTimeZone
            };
            currentTimeEl.textContent = now.toLocaleTimeString('id-ID', timeOptions);
        }
    }

    updatePrayerCardsDisplay(times) {
        const tbody = this.container.querySelector('#prayTable tbody');
        if (!tbody) return;

        const now = new Date();
        const currentTime = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

        // Clear existing rows
        tbody.innerHTML = '';

        // Find next prayer
        const prayers = Object.keys(this.prayNames);
        let nextKey = null;
        let minDiff = Infinity;

        for (const k of prayers) {
            const t = times[k];
            if (isNaN(t)) continue;
            if (k === 'sunrise') continue; // Skip sunrise for next prayer
            
            const diff = t - currentTime;
            if (diff > 0 && diff < minDiff) {
                minDiff = diff;
                nextKey = k;
            }
        }

        if (!nextKey) {
            nextKey = 'fajr'; // Next day's fajr
        }

        // Create table rows
        for (let k of prayers) {
            const time = times[k];
            const displayTime = this.floatToTime(time);
            const prayerName = this.prayNames[k];
            
            let infoText = '--:--:--';
            
            if (!isNaN(time)) {
                if (time <= currentTime) {
                    infoText = 'Selesai';
                } else if (k === nextKey) {
                    // Show countdown for next prayer
                    const diffSec = Math.round((time - currentTime) * 3600);
                    infoText = this.formatHMS(diffSec);
                }
            }

            const tr = document.createElement('tr');
            tr.setAttribute('data-prayer', k);
            tr.innerHTML = `
                <td>${prayerName}</td>
                <td class="time">${displayTime}</td>
                <td class="small" data-info="${k}">${infoText}</td>
            `;

            // Highlight next prayer
            if (k === nextKey) {
                tr.classList.add('row-next');
                tr.style.background = 'linear-gradient(90deg, rgba(0, 255, 255, 0.2), rgba(0, 128, 255, 0.1))';
                tr.style.borderLeft = '4px solid var(--primary-cyan)';
                tr.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1)';
            }

            tbody.appendChild(tr);
        }

        // Start live update for countdown
        this.startLiveInfoUpdate(times, nextKey);
    }

    startLiveInfoUpdate(times, initialNextKey) {
        if (this.liveInfoInterval) {
            clearInterval(this.liveInfoInterval);
        }

        this.liveInfoInterval = setInterval(() => {
            const now = new Date();
            const currentTime = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

            // Find current next prayer
            const prayers = Object.keys(this.prayNames);
            let nextKey = null;
            let minDiff = Infinity;

            for (const k of prayers) {
                const t = times[k];
                if (isNaN(t)) continue;
                if (k === 'sunrise') continue;
                
                const diff = t - currentTime;
                if (diff > 0 && diff < minDiff) {
                    minDiff = diff;
                    nextKey = k;
                }
            }

            if (!nextKey) {
                nextKey = 'fajr';
            }

            // Update each row
            const tbody = this.container.querySelector('#prayTable tbody');
            if (!tbody) return;

            tbody.querySelectorAll('tr').forEach(tr => {
                const key = tr.getAttribute('data-prayer');
                const infoCell = tr.querySelector(`td[data-info="${key}"]`);
                const t = times[key];

                if (isNaN(t)) {
                    infoCell.textContent = '--:--:--';
                    tr.classList.remove('row-next');
                    tr.style.background = '';
                    tr.style.borderLeft = '';
                    tr.style.boxShadow = '';
                    return;
                }

                if (key === nextKey) {
                    let diffHours = t - currentTime;
                    if (diffHours < 0) diffHours += 24;
                    const diffSec = Math.max(0, Math.round(diffHours * 3600));
                    infoCell.textContent = this.formatHMS(diffSec);

                    // Highlight
                    tr.classList.add('row-next');
                    tr.style.background = 'linear-gradient(90deg, rgba(0, 255, 255, 0.2), rgba(0, 128, 255, 0.1))';
                    tr.style.borderLeft = '4px solid var(--primary-cyan)';
                    tr.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1)';
                } else {
                    if (t <= currentTime) {
                        infoCell.textContent = 'Selesai';
                    } else {
                        infoCell.textContent = '--:--:--';
                    }

                    // Remove highlight
                    tr.classList.remove('row-next');
                    tr.style.background = '';
                    tr.style.borderLeft = '';
                    tr.style.boxShadow = '';
                }
            });

            // Update shared prayer data with countdown
            if (nextKey && times[nextKey]) {
                const diffHours = times[nextKey] - currentTime;
                const diffSec = Math.max(0, Math.round((diffHours > 0 ? diffHours : diffHours + 24) * 3600));
                
                this.eventBus.dispatchEvent(new CustomEvent('prayerTime', {
                    detail: {
                        times: times,
                        nextPrayer: {
                            name: this.prayNames[nextKey],
                            time: this.floatToTime(times[nextKey]),
                            prayer: nextKey
                        },
                        countdown: this.formatHMS(diffSec)
                    }
                }));
            }
        }, 1000);
    }

    isCurrentPrayer(prayer, times, currentTime) {
        // Skip sunrise for current prayer logic
        if (prayer === 'sunrise') return false;
        
        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        const prayerIndex = prayers.indexOf(prayer);
        
        if (prayerIndex === -1) return false;
        
        const prayerTime = times[prayer];
        const nextPrayerTime = prayerIndex < prayers.length - 1 ? 
            times[prayers[prayerIndex + 1]] : 
            times['fajr'] + 24; // Next day's fajr
            
        return currentTime >= prayerTime && currentTime < nextPrayerTime;
    }

    updateSharedPrayerData(times, nextPrayer = null) {
        this.sharedData.prayerTimes = {
            times: times,
            nextPrayer: nextPrayer,
            location: {
                city: this.currentCity,
                lat: this.currentLat,
                lon: this.currentLon,
                timezone: this.currentTimeZone
            },
            method: this.currentMethod
        };

        // Notify other components
        this.eventBus.dispatchEvent(new CustomEvent('prayerTime', {
            detail: this.sharedData.prayerTimes
        }));
    }

    startLiveUpdates() {
        if (this.liveInterval) {
            clearInterval(this.liveInterval);
        }

        this.liveInterval = setInterval(() => {
            this.updateCurrentTime();
            
            // Check if we need to refresh for a new day
            const currentDateStr = (new Date()).toDateString();
            if (currentDateStr !== this.lastDateStr) {
                this.lastDateStr = currentDateStr;
                this.renderPrayers();
            }
        }, 1000);
    }

    setupMidnightRefresh() {
        if (this.midnightTimer) {
            clearTimeout(this.midnightTimer);
        }

        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 1, 0); // 00:00:01 tomorrow
        
        const msUntilMidnight = tomorrow.getTime() - now.getTime();
        
        this.midnightTimer = setTimeout(() => {
            this.renderPrayers();
            this.setupMidnightRefresh(); // Setup for next day
        }, msUntilMidnight);
    }

    showNotification(message, type = 'info') {
        // Use the main app's notification manager
        if (window.app && window.app.notificationManager) {
            window.app.notificationManager.show(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // Hadith Management Methods
    displayCurrentHadith() {
        if (!this.hadithData || this.hadithData.length === 0) {
            console.warn('No hadith data available');
            return;
        }

        const hadith = this.hadithData[this.currentHadithIndex];
        const arabicEl = this.container.querySelector('#hadithArabic');
        const indonesiaEl = this.container.querySelector('#hadithIndonesia');
        const referenceEl = this.container.querySelector('#hadithReference');

        if (arabicEl) arabicEl.textContent = hadith.arabic || '';
        if (indonesiaEl) indonesiaEl.textContent = hadith.indonesia || hadith.text || '';
        if (referenceEl) referenceEl.textContent = hadith.reference || hadith.source || '';

        // Reset and animate progress bar
        this.resetHadithProgress();
    }

    previousHadith() {
        this.currentHadithIndex = (this.currentHadithIndex - 1 + this.hadithData.length) % this.hadithData.length;
        this.displayCurrentHadith();
    }

    nextHadith() {
        this.currentHadithIndex = (this.currentHadithIndex + 1) % this.hadithData.length;
        this.displayCurrentHadith();
    }

    toggleHadithAutoPlay() {
        this.hadithAutoPlay = !this.hadithAutoPlay;
        const playPauseBtn = this.container.querySelector('#playPauseHadith i');
        
        if (playPauseBtn) {
            playPauseBtn.className = this.hadithAutoPlay ? 'fas fa-pause' : 'fas fa-play';
        }

        if (this.hadithAutoPlay) {
            this.startHadithRotation();
        } else {
            this.stopHadithRotation();
        }
    }

    startHadithRotation() {
        if (!this.hadithAutoPlay) return;
        
        this.stopHadithRotation(); // Clear existing timer
        
        this.hadithTimer = setInterval(() => {
            if (this.hadithAutoPlay) {
                this.nextHadith();
            }
        }, 15000); // 15 seconds per hadith
    }

    stopHadithRotation() {
        if (this.hadithTimer) {
            clearInterval(this.hadithTimer);
            this.hadithTimer = null;
        }
    }

    resetHadithProgress() {
        const progressFill = this.container.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.animation = 'none';
            setTimeout(() => {
                progressFill.style.animation = this.hadithAutoPlay ? 'fillProgress 15s linear' : 'none';
            }, 10);
        }
    }

    renderError() {
        this.container.innerHTML = `
            <div class="component-error">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Gagal Memuat Jadwal Adzan</h3>
                <p>Terjadi kesalahan saat memuat jadwal sholat. Silakan coba lagi.</p>
                <button onclick="this.closest('.app-component').dispatchEvent(new CustomEvent('retry'))" 
                        class="retry-btn">
                    <i class="fas fa-redo"></i>
                    Coba Lagi
                </button>
            </div>
            
            <style>
            .component-error {
                text-align: center;
                padding: 60px 20px;
                color: var(--text-secondary);
            }
            
            .error-icon {
                font-size: 48px;
                color: #ff4757;
                margin-bottom: 20px;
            }
            
            .component-error h3 {
                color: var(--text-primary);
                margin-bottom: 10px;
            }
            
            .retry-btn {
                background: var(--gradient-primary);
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                color: var(--dark-bg);
                font-weight: 600;
                cursor: pointer;
                margin-top: 20px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            }
            
            .retry-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }
            </style>
        `;

        // Add retry event listener
        this.container.addEventListener('retry', () => {
            this.init();
        });
    }

    destroy() {
        // Clear all timers and intervals
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
        
        if (this.liveInterval) {
            clearInterval(this.liveInterval);
        }
        
        if (this.liveInfoInterval) {
            clearInterval(this.liveInfoInterval);
        }
        
        if (this.midnightTimer) {
            clearTimeout(this.midnightTimer);
        }

        if (this.hadithTimer) {
            clearInterval(this.hadithTimer);
        }

        console.log('🕌 Adzan Component destroyed');
    }
}