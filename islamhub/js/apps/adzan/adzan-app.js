/* ===== Adzan App - IslamHub ===== */
/* Logic from adzan_realtime with adaptations for IslamHub */

export default class AdzanApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('adzan-app');
        this.API_URL = 'https://api.aladhan.com/v1/timings';
        this.updateInterval = null;
        this.countdownInterval = null;
        
        // Default Jakarta
        this.lat = -6.2088;
        this.lon = 106.8456;
        this.city = 'Jakarta';
        this.country = 'Indonesia';
        this.timezone = 'Asia/Jakarta';
        this.gmtOffset = '+7';
        this.locationDisplay = 'Jakarta, Indonesia';
        this.method = 'KEMENAG';
        
        this.prayerTimes = {};
        this.nextPrayer = null;
        this.citySearchResults = [];
    }

    async init() {
        console.log('Initializing Adzan App...');
        await this.render();
        await this.loadSavedLocation();
        await this.fetchPrayerTimes();
        this.startCountdown();
        this.setupEventListeners();
        this.updateClock();
    }

    async render() {
        this.container.innerHTML = `
            <div class="adzan-container">
                <div class="adzan-header">
                    <div class="clock-section">
                        <div class="current-time" id="currentTime">--:--:--</div>
                        <div class="current-gmt" id="currentGMT">GMT+7</div>
                        <div class="current-date" id="currentDate">Memuat...</div>
                    </div>
                    <div class="location-section">
                        <div class="location-info">
                            <i class="fas fa-map-marker-alt"></i>
                            <span class="location-name" id="locationName">Jakarta, Indonesia</span>
                        </div>
                        <button class="btn-change-location" id="btnChangeLocation">
                            <i class="fas fa-edit"></i> Ubah Lokasi
                        </button>
                    </div>
                </div>

                <!-- Next Prayer Card -->
                <div class="next-prayer-card">
                    <div class="card-header">
                        <i class="fas fa-clock"></i>
                        <span>Sholat Berikutnya</span>
                    </div>
                    <div class="card-body">
                        <h2 class="prayer-name" id="nextPrayerName">Memuat...</h2>
                        <div class="countdown-timer" id="countdownTimer">--:--:--</div>
                    </div>
                </div>

                <!-- Prayer Times Table -->
                <div class="prayer-times-section">
                    <h3><i class="fas fa-mosque"></i> Jadwal Sholat Hari Ini</h3>
                    <div class="method-selector">
                        <label for="methodSelect">Metode: </label>
                        <select id="methodSelect">
                            <option value="KEMENAG">Kemenag Indonesia</option>
                            <option value="MWL">Muslim World League</option>
                            <option value="ISNA">ISNA</option>
                            <option value="Egypt">Egypt</option>
                            <option value="Makkah">Umm al-Qura</option>
                            <option value="Karachi">University of Karachi</option>
                        </select>
                    </div>
                    
                    <div class="prayer-times-grid" id="prayerTimesGrid">
                        <!-- Will be populated dynamically -->
                    </div>
                </div>

                <!-- Sunnah Prayers Section -->
                <div class="sunnah-section">
                    <div class="section-header">
                        <i class="fas fa-moon"></i>
                        <h3>Sholat Sunnah Saat Ini</h3>
                    </div>
                    <p class="section-description">Sholat sunnah yang dapat dikerjakan pada waktu ini</p>
                    <div id="sunnahPrayersList" class="sunnah-prayers-list">
                        <!-- Will be populated dynamically -->
                    </div>
                </div>

                <!-- Location Modal -->
                <div class="modal" id="locationModal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Ubah Lokasi</h3>
                            <button class="modal-close" id="modalClose">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group">
                                <input type="text" id="cityInput" placeholder="Ketik nama kota..." autocomplete="off">
                                <button class="btn-primary" id="btnSearchCity">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                            <div class="city-search-loader" id="citySearchLoader" style="display: none;">
                                <div class="loader-spinner"></div>
                                <span>Mencari kota...</span>
                            </div>
                            <div class="city-dropdown" id="cityDropdown" style="display: none;">
                                <!-- Dynamic city list -->
                            </div>
                            <button class="btn-secondary" id="btnUseGPS">
                                <i class="fas fa-location-arrow"></i> Gunakan GPS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadSavedLocation() {
        try {
            const saved = localStorage.getItem('islamhub_adzan_location');
            if (saved) {
                const data = JSON.parse(saved);
                this.lat = data.lat;
                this.lon = data.lon;
                this.city = data.city;
                this.country = data.country || 'Unknown';
                this.timezone = data.timezone || 'Asia/Jakarta';
                this.gmtOffset = data.gmtOffset || '+7';
                this.locationDisplay = data.locationDisplay || this.city;
                
                this.updateLocationDisplay();
            }
        } catch (error) {
            console.error('Failed to load saved location:', error);
        }
    }

    async fetchPrayerTimes() {
        try {
            const now = new Date();
            const timestamp = Math.floor(now.getTime() / 1000);
            
            // Map method to Aladhan API method numbers
            const methodMap = {
                'KEMENAG': 11,
                'MWL': 3,
                'ISNA': 2,
                'Egypt': 5,
                'Makkah': 4,
                'Karachi': 1
            };
            
            const methodId = methodMap[this.method] || 11;
            const url = `${this.API_URL}/${timestamp}?latitude=${this.lat}&longitude=${this.lon}&method=${methodId}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.code === 200 && data.data) {
                this.prayerTimes = {
                    Subuh: data.data.timings.Fajr,
                    Syuruq: data.data.timings.Sunrise,
                    Dzuhur: data.data.timings.Dhuhr,
                    Ashar: data.data.timings.Asr,
                    Maghrib: data.data.timings.Maghrib,
                    Isya: data.data.timings.Isha
                };
                
                // Update date with Hijri
                if (data.data.date && data.data.date.hijri) {
                    const hijri = data.data.date.hijri;
                    this.updateDate(hijri);
                }
                
                this.renderPrayerTimes();
                this.calculateNextPrayer();
                this.updateHomeWidget();
                
                // Update sunnah prayers recommendations
                await this.updateSunnahPrayers();
            }
        } catch (error) {
            console.error('Failed to fetch prayer times:', error);
            this.showError('Gagal memuat jadwal sholat');
        }
    }

    renderPrayerTimes() {
        const grid = document.getElementById('prayerTimesGrid');
        if (!grid) return;
        
        const prayers = Object.entries(this.prayerTimes);
        grid.innerHTML = prayers.map(([name, time]) => `
            <div class="prayer-time-card" data-prayer="${name}">
                <div class="prayer-icon">
                    <i class="fas fa-mosque"></i>
                </div>
                <div class="prayer-info">
                    <div class="prayer-name">${name}</div>
                    <div class="prayer-time">${time}</div>
                </div>
            </div>
        `).join('');
    }

    calculateNextPrayer() {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        let nextPrayer = null;
        let minDiff = Infinity;
        
        for (const [name, time] of Object.entries(this.prayerTimes)) {
            if (name === 'Syuruq') continue; // Skip sunrise
            
            const [hours, minutes] = time.split(':').map(Number);
            const prayerMinutes = hours * 60 + minutes;
            let diff = prayerMinutes - currentMinutes;
            
            if (diff < 0) diff += 1440; // Add 24 hours if passed
            
            if (diff < minDiff) {
                minDiff = diff;
                nextPrayer = { name, time, diff };
            }
        }
        
        this.nextPrayer = nextPrayer;
        this.updateNextPrayerDisplay();
        
        // Highlight next prayer in grid
        document.querySelectorAll('.prayer-time-card').forEach(card => {
            card.classList.remove('next-prayer');
        });
        
        if (nextPrayer) {
            const nextCard = document.querySelector(`[data-prayer="${nextPrayer.name}"]`);
            if (nextCard) {
                nextCard.classList.add('next-prayer');
            }
        }
    }

    updateNextPrayerDisplay() {
        if (!this.nextPrayer) return;
        
        const nameEl = document.getElementById('nextPrayerName');
        const timeEl = document.getElementById('nextPrayerTime');
        
        if (nameEl) nameEl.textContent = this.nextPrayer.name;
        if (timeEl) timeEl.textContent = this.nextPrayer.time;
    }

    startCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    updateCountdown() {
        if (!this.nextPrayer) return;
        
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const currentSeconds = now.getSeconds();
        
        const [hours, minutes] = this.nextPrayer.time.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;
        
        // Calculate difference in minutes
        let diffMinutes = prayerMinutes - currentMinutes;
        if (diffMinutes < 0) {
            diffMinutes += 1440; // Add 24 hours (1440 minutes) if prayer is tomorrow
        }
        
        // Convert to total seconds
        const totalSeconds = (diffMinutes * 60) - currentSeconds;
        
        // If negative or zero, recalculate next prayer
        if (totalSeconds <= 0) {
            this.calculateNextPrayer();
            return;
        }
        
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        
        const countdown = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        const countdownEl = document.getElementById('countdownTimer');
        if (countdownEl) {
            countdownEl.textContent = countdown;
        }
        
        // Update home widget
        if (this.mainApp) {
            this.mainApp.updateHomeWidget({
                prayerName: this.nextPrayer.name,
                prayerTime: this.nextPrayer.time,
                countdown: countdown,
                city: this.city
            });
            
            this.mainApp.updateFloatingWidget({
                prayerName: this.nextPrayer.name,
                countdown: countdown,
                city: this.city
            });
        }
        
        // Update sunnah prayers every minute
        if (secs === 0) {
            this.updateSunnahPrayers();
        }
    }

    updateClock() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                timeZone: this.timezone 
            });
            
            const timeEl = document.getElementById('currentTime');
            if (timeEl) {
                timeEl.textContent = timeString;
            }
            
            const gmtEl = document.getElementById('currentGMT');
            if (gmtEl) {
                gmtEl.textContent = `GMT${this.gmtOffset}`;
            }
            
            setTimeout(updateTime, 1000);
        };
        
        updateTime();
    }

    updateDate(hijri) {
        const now = new Date();
        const dateString = now.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        let fullDate = dateString;
        
        if (hijri && hijri.month) {
            // Normalize month name like adzan_realtime
            function normalizeMonthName(s) {
                if (!s) return '';
                const t = s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
                return t.replace(/[\u02BC\u02BB\u2018\u2019']/g, '').trim().toLowerCase();
            }
            
            const bulanMap = {
                'muharram': 'Muharram',
                'safar': 'Safar',
                'rabi al-awwal': 'Rabiul Awal',
                'rabi al-awal': 'Rabiul Awal',
                'rabi alawwal': 'Rabiul Awal',
                'rabiul-awwal': 'Rabiul Awal',
                'rabiul awal': 'Rabiul Awal',
                'rabi al-thani': 'Rabiul Akhir',
                'rabi al-thaniy': 'Rabiul Akhir',
                'rabiul-akhir': 'Rabiul Akhir',
                'rabiul akhir': 'Rabiul Akhir',
                'jumada al-awwal': 'Jumadil Awal',
                'jumada al-awal': 'Jumadil Awal',
                'jumada alawwal': 'Jumadil Awal',
                'jumadil-awal': 'Jumadil Awal',
                'jumadil awal': 'Jumadil Awal',
                'jumada al-thani': 'Jumadil Akhir',
                'jumada al-thaniy': 'Jumadil Akhir',
                'jumadil-akhir': 'Jumadil Akhir',
                'jumadil akhir': 'Jumadil Akhir',
                'rajab': 'Rajab',
                'shaban': 'Syaban',
                'sha ban': 'Syaban',
                'syaban': 'Syaban',
                'ramadan': 'Ramadan',
                'ramadhan': 'Ramadan',
                'shawwal': 'Syawal',
                'syawal': 'Syawal',
                'dhu al-qadah': 'Dzulqaidah',
                'dhul-qadah': 'Dzulqaidah',
                'dzulqaidah': 'Dzulqaidah',
                'dhu al-hijjah': 'Dzulhijjah',
                'dhul-hijjah': 'Dzulhijjah',
                'dzulhijjah': 'Dzulhijjah'
            };
            
            const normalizedMonth = normalizeMonthName(hijri.month.en || '');
            const monthName = bulanMap[normalizedMonth] || hijri.month.en || '';
            
            if (monthName && hijri.day && hijri.year) {
                fullDate += ` • ${hijri.day} ${monthName} ${hijri.year} H`;
            }
        }
        
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            dateEl.textContent = fullDate;
        }
    }

    updateLocationDisplay() {
        const locationNameEl = document.getElementById('locationName');
        
        if (locationNameEl) {
            locationNameEl.textContent = this.locationDisplay;
        }
    }

    updateHomeWidget() {
        if (!this.mainApp || !this.nextPrayer) return;
        
        this.mainApp.updateHomeWidget({
            prayerName: this.nextPrayer.name,
            prayerTime: this.nextPrayer.time,
            countdown: '--:--:--',
            city: this.city
        });
    }

    setupEventListeners() {
        // Change location button
        const btnChangeLocation = document.getElementById('btnChangeLocation');
        if (btnChangeLocation) {
            btnChangeLocation.addEventListener('click', () => {
                this.showLocationModal();
            });
        }
        
        // Modal close
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.hideLocationModal();
            });
        }
        
        // Search city
        const btnSearchCity = document.getElementById('btnSearchCity');
        if (btnSearchCity) {
            btnSearchCity.addEventListener('click', () => {
                this.searchCity();
            });
        }
        
        // Use GPS
        const btnUseGPS = document.getElementById('btnUseGPS');
        if (btnUseGPS) {
            btnUseGPS.addEventListener('click', () => {
                this.useGPS();
            });
        }
        
        // Method selector
        const methodSelect = document.getElementById('methodSelect');
        if (methodSelect) {
            methodSelect.value = this.method;
            methodSelect.addEventListener('change', (e) => {
                this.method = e.target.value;
                this.fetchPrayerTimes();
            });
        }
        
        // City input autocomplete
        const cityInput = document.getElementById('cityInput');
        if (cityInput) {
            cityInput.addEventListener('input', (e) => {
                this.handleCityInput(e.target.value);
            });
            
            cityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchCity();
                }
            });
        }
    }

    showLocationModal() {
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    hideLocationModal() {
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    async handleCityInput(value) {
        const dropdown = document.getElementById('cityDropdown');
        const loader = document.getElementById('citySearchLoader');
        if (!dropdown) return;
        
        if (value.length < 2) {
            dropdown.style.display = 'none';
            dropdown.innerHTML = '';
            loader.style.display = 'none';
            this.citySearchResults = [];
            return;
        }
        
        // Show loader
        loader.style.display = 'flex';
        dropdown.style.display = 'none';
        
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=10&addressdetails=1`;
            const response = await fetch(url, {headers: {'Accept-Language': 'id'}});
            const results = await response.json();
            
            this.citySearchResults = results;
            
            // Hide loader
            loader.style.display = 'none';
            
            if (results && results.length > 0) {
                dropdown.innerHTML = results.map((result, index) => {
                    const address = result.address || {};
                    const city = address.city || address.town || address.village || address.state || result.name;
                    const country = address.country || '';
                    const displayName = `${city}${country ? ', ' + country : ''}`;
                    
                    return `
                        <div class="city-item" data-index="${index}">
                            <div class="city-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="city-info">
                                <div class="city-name">${city}</div>
                                <div class="city-country">${country}</div>
                            </div>
                            <div class="city-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    `;
                }).join('');
                
                dropdown.style.display = 'block';
                
                // Add click listeners
                dropdown.querySelectorAll('.city-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const index = parseInt(item.dataset.index);
                        this.selectCity(results[index]);
                    });
                });
                
                console.log('City suggestions loaded:', results.length);
            } else {
                dropdown.innerHTML = `
                    <div class="city-empty">
                        <i class="fas fa-search"></i>
                        <p>Kota tidak ditemukan</p>
                    </div>
                `;
                dropdown.style.display = 'block';
            }
        } catch (error) {
            console.error('Failed to fetch city suggestions:', error);
            loader.style.display = 'none';
            dropdown.innerHTML = `
                <div class="city-empty">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Gagal mencari kota</p>
                </div>
            `;
            dropdown.style.display = 'block';
        }
    }

    async selectCity(selectedResult) {
        const input = document.getElementById('cityInput');
        const dropdown = document.getElementById('cityDropdown');
        
        if (selectedResult) {
            this.lat = parseFloat(selectedResult.lat);
            this.lon = parseFloat(selectedResult.lon);
            
            const address = selectedResult.address || {};
            this.city = address.city || address.town || address.village || address.state || selectedResult.name;
            this.country = address.country || 'Unknown';
            this.locationDisplay = `${this.city}, ${this.country}`;
            
            // Get timezone from coordinates
            await this.fetchTimezoneFromCoords();
            
            this.saveLocation();
            await this.fetchPrayerTimes();
            this.hideLocationModal();
            this.updateLocationDisplay();
            
            if (input) input.value = '';
            if (dropdown) {
                dropdown.style.display = 'none';
                dropdown.innerHTML = '';
            }
            this.citySearchResults = [];
        }
    }

    async searchCity() {
        const input = document.getElementById('cityInput');
        if (!input) return;
        
        const cityName = input.value.trim();
        if (!cityName) {
            alert('Masukkan nama kota');
            return;
        }
        
        const loader = document.getElementById('citySearchLoader');
        const dropdown = document.getElementById('cityDropdown');
        
        try {
            // Show loader
            if (loader) loader.style.display = 'flex';
            if (dropdown) dropdown.style.display = 'none';
            
            // Search for city
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1&addressdetails=1`;
            const response = await fetch(url);
            const data = await response.json();
            
            // Hide loader
            if (loader) loader.style.display = 'none';
            
            if (data && data.length > 0) {
                await this.selectCity(data[0]);
            } else {
                alert('Kota tidak ditemukan');
            }
            
            if (input) input.value = '';
            if (dropdown) {
                dropdown.style.display = 'none';
                dropdown.innerHTML = '';
            }
            this.citySearchResults = [];
        } catch (error) {
            console.error('Failed to search city:', error);
            if (loader) loader.style.display = 'none';
            alert('Gagal mencari kota');
        }
    }

    async useGPS() {
        if (!navigator.geolocation) {
            alert('GPS tidak didukung di browser ini');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                this.lat = position.coords.latitude;
                this.lon = position.coords.longitude;
                
                // Reverse geocode to get city name
                try {
                    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.lat}&lon=${this.lon}&addressdetails=1`;
                    const response = await fetch(url);
                    const data = await response.json();
                    
                    const address = data.address || {};
                    this.city = address.city || address.town || address.village || address.state || 'Lokasi GPS';
                    this.country = address.country || 'Unknown';
                    this.locationDisplay = `${this.city}, ${this.country}`;
                } catch (error) {
                    this.city = 'Lokasi GPS';
                    this.country = 'Unknown';
                    this.locationDisplay = this.city;
                }
                
                // Get timezone from coordinates
                await this.fetchTimezoneFromCoords();
                
                this.saveLocation();
                await this.fetchPrayerTimes();
                this.hideLocationModal();
                this.updateLocationDisplay();
            },
            (error) => {
                console.error('GPS error:', error);
                alert('Gagal mengambil lokasi GPS');
            }
        );
    }

    async fetchTimezoneFromCoords() {
        try {
            // Use timezone API to get accurate timezone
            const timestamp = Math.floor(Date.now() / 1000);
            const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=demo&format=json&by=position&lat=${this.lat}&lng=${this.lon}&time=${timestamp}`;
            
            // Fallback to calculation if API fails
            try {
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.status === 'OK') {
                    this.timezone = data.zoneName;
                    const offsetSeconds = data.gmtOffset;
                    const offsetHours = offsetSeconds / 3600;
                    this.gmtOffset = offsetHours >= 0 ? `+${offsetHours}` : `${offsetHours}`;
                    return;
                }
            } catch (apiError) {
                console.log('Timezone API failed, using calculation');
            }
            
            // Fallback: estimate timezone from longitude
            const offsetHours = Math.round(this.lon / 15);
            this.gmtOffset = offsetHours >= 0 ? `+${offsetHours}` : `${offsetHours}`;
            
            // Try to guess timezone name (basic)
            const timezones = {
                7: 'Asia/Jakarta',
                8: 'Asia/Singapore',
                9: 'Asia/Tokyo',
                '-5': 'America/New_York',
                '-8': 'America/Los_Angeles',
                0: 'Europe/London',
                1: 'Europe/Paris'
            };
            
            this.timezone = timezones[offsetHours] || 'UTC';
        } catch (error) {
            console.error('Failed to fetch timezone:', error);
            this.timezone = 'UTC';
            this.gmtOffset = '+0';
        }
    }

    async updateSunnahPrayers() {
        try {
            const { sunnahPrayersCollection } = await import('../../data/sunnah-prayers.js');
            
            const now = new Date();
            const currentTime = {
                h: now.getHours(),
                m: now.getMinutes(),
                s: now.getSeconds()
            };
            
            // Convert prayer times to decimal hours
            const times = {
                fajr: this.convertToDecimal(this.prayerTimes.Subuh),
                sunrise: this.convertToDecimal(this.prayerTimes.Syuruq),
                dhuhr: this.convertToDecimal(this.prayerTimes.Dzuhur),
                asr: this.convertToDecimal(this.prayerTimes.Ashar),
                maghrib: this.convertToDecimal(this.prayerTimes.Maghrib),
                isha: this.convertToDecimal(this.prayerTimes.Isya)
            };
            
            const sunnahList = document.getElementById('sunnahPrayersList');
            if (!sunnahList) return;
            
            let html = '';
            
            sunnahPrayersCollection.forEach(sunnah => {
                const isAvailable = sunnah.timeCondition(times, currentTime);
                const statusIcon = isAvailable ? 
                    '<i class="fas fa-check-circle status-icon available"></i>' : 
                    '<i class="fas fa-times-circle status-icon not-available"></i>';
                
                const availableClass = isAvailable ? 'available' : 'not-available';
                
                html += `
                    <div class="sunnah-prayer-item ${availableClass}">
                        <div class="sunnah-prayer-name">
                            ${statusIcon}
                            ${sunnah.name}
                        </div>
                        <div class="sunnah-prayer-time">${sunnah.timeDescription}</div>
                        <div class="sunnah-prayer-arabic">${sunnah.arabic}</div>
                        <div class="sunnah-prayer-indonesia">${sunnah.indonesia}</div>
                        <div class="sunnah-prayer-reference">${sunnah.reference}</div>
                    </div>
                `;
            });
            
            sunnahList.innerHTML = html;
            
        } catch (error) {
            console.error('Failed to load sunnah prayers:', error);
        }
    }

    convertToDecimal(timeString) {
        if (!timeString) return 0;
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours + (minutes / 60);
    }

    saveLocation() {
        try {
            const data = {
                lat: this.lat,
                lon: this.lon,
                city: this.city,
                country: this.country,
                timezone: this.timezone,
                gmtOffset: this.gmtOffset,
                locationDisplay: this.locationDisplay
            };
            
            localStorage.setItem('islamhub_adzan_location', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save location:', error);
        }
    }

    showError(message) {
        console.error(message);
        alert(message);
    }
}
