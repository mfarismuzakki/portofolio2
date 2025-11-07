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
        
        // Get base path for assets
        this.basePath = this._getBasePath();
        
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
        this.notificationEnabled = false;
        this.notificationPermission = 'default';
        this.scheduledNotifications = [];
        this.notificationCheckInterval = null;
        this.lastNotificationCheck = {};
        this.searchDebounceTimer = null;
    }

    async init() {
        console.log('Initializing Adzan App...');
        await this.render();
        this.setupEventListeners(); // Setup event listeners after render
        await this.loadSavedLocation();
        await this.fetchPrayerTimes();
        this.startCountdown();
        this.updateCountdown(); // Initial countdown display
        this.updateClock();
        await this.initNotifications();
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
                        <div class="location-actions">
                            <button class="btn-notification" id="btnToggleNotification" title="Toggle Notifikasi">
                                <i class="far fa-bell-slash"></i>
                            </button>
                            <button class="btn-change-location" id="btnChangeLocation">
                                <i class="fas fa-edit"></i> Ubah Lokasi
                            </button>
                        </div>
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
                <div class="modal" id="locationModal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Ubah Lokasi</h3>
                            <button class="modal-close" id="modalClose" type="button">
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
                            <div class="gps-loader" id="gpsLoader" style="display: none;">
                                <div class="loader-spinner"></div>
                                <span>Mengambil lokasi GPS...</span>
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
                
                // Reschedule notifications if enabled
                if (this.notificationEnabled) {
                    this.scheduleNotifications();
                }
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
        if (!this.prayerTimes || Object.keys(this.prayerTimes).length === 0) return;
        
        const now = new Date();
        const nowHours = now.getHours() + now.getMinutes()/60 + now.getSeconds()/3600;
        
        let nextPrayer = null;
        let minDiff = Infinity;
        
        for (const [name, time] of Object.entries(this.prayerTimes)) {
            // Skip Syuruq for next prayer calculation (it's not a prayer time)
            if (name === 'Syuruq') continue;
            
            const [hours, minutes] = time.split(':').map(Number);
            const prayerHours = hours + minutes/60;
            
            // Calculate difference in hours
            let diff = prayerHours - nowHours;
            
            // If prayer time has passed today, it's tomorrow (add 24 hours)
            if (diff <= 0) {
                diff += 24;
            }
            
            // Find the prayer with minimum difference (closest upcoming prayer)
            if (diff < minDiff) {
                minDiff = diff;
                nextPrayer = { name, time };
            }
        }
        
        // Only update if we found a next prayer
        if (nextPrayer) {
            this.nextPrayer = nextPrayer;
            this.updateNextPrayerDisplay();
            
            // Highlight next prayer in grid
            document.querySelectorAll('.prayer-time-card').forEach(card => {
                card.classList.remove('next-prayer');
            });
            
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
        if (!this.prayerTimes || Object.keys(this.prayerTimes).length === 0) return;
        
        const now = new Date();
        const nowHours = now.getHours() + now.getMinutes()/60 + now.getSeconds()/3600;
        
        // Recalculate next prayer every time (like adzan_realtime does)
        let nextKey = null;
        let minDiff = Infinity;
        
        for (const [name, time] of Object.entries(this.prayerTimes)) {
            // Skip Syuruq for next prayer calculation
            if (name === 'Syuruq') continue;
            
            const [hours, minutes] = time.split(':').map(Number);
            const prayerHours = hours + minutes/60;
            
            let diff = prayerHours - nowHours;
            
            // If negative, it's tomorrow
            if (diff <= 0) {
                diff += 24;
            }
            
            if (diff < minDiff) {
                minDiff = diff;
                nextKey = name;
            }
        }
        
        // If we found a different next prayer, update it
        if (nextKey && (!this.nextPrayer || this.nextPrayer.name !== nextKey)) {
            this.nextPrayer = { name: nextKey, time: this.prayerTimes[nextKey] };
            this.updateNextPrayerDisplay();
            
            // Update highlight
            document.querySelectorAll('.prayer-time-card').forEach(card => {
                card.classList.remove('next-prayer');
            });
            const nextCard = document.querySelector(`[data-prayer="${nextKey}"]`);
            if (nextCard) {
                nextCard.classList.add('next-prayer');
            }
        }
        
        if (!this.nextPrayer) return;
        
        // Calculate countdown
        const [hours, minutes] = this.nextPrayer.time.split(':').map(Number);
        const prayerHours = hours + minutes/60;
        let diffHours = prayerHours - nowHours;
        
        if (diffHours <= 0) {
            diffHours += 24;
        }
        
        const totalSeconds = Math.max(0, Math.round(diffHours * 3600));
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        
        const countdown = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        // Update countdown display
        const countdownEl = document.getElementById('countdownTimer');
        if (countdownEl) {
            countdownEl.textContent = countdown;
        }
        
        // Update widgets
        if (this.mainApp) {
            this.mainApp.updateHomeWidget({
                prayerName: this.nextPrayer.name,
                prayerTime: this.nextPrayer.time,
                countdown: countdown,
                city: this.city
            });
            
            if (this.mainApp.updateFloatingWidget) {
                this.mainApp.updateFloatingWidget({
                    prayerName: this.nextPrayer.name,
                    countdown: countdown,
                    city: this.city
                });
            }
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
        let dateString = now.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        // Ganti Minggu menjadi Ahad
        if (dateString.startsWith('Minggu')) {
            dateString = dateString.replace('Minggu', 'Ahad');
        }
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
                // Jumadil Ula (Awal)
                'jumada al-awwal': 'Jumadil Ula',
                'jumada al-awal': 'Jumadil Ula',
                'jumada al-ula': 'Jumadil Ula',
                'jumādá al-ūlá': 'Jumadil Ula',
                'jumada alawwal': 'Jumadil Ula',
                'jumadil-awal': 'Jumadil Ula',
                'jumadil awal': 'Jumadil Ula',
                'jumadil ula': 'Jumadil Ula',
                // Jumadil Akhir
                'jumada al-thani': 'Jumadil Akhir',
                'jumada al-thaniy': 'Jumadil Akhir',
                'jumada al-akhir': 'Jumadil Akhir',
                'jumada al-ukhra': 'Jumadil Akhir',
                'jumādá al-ākhirah': 'Jumadil Akhir',
                'jumadil-akhir': 'Jumadil Akhir',
                'jumadil akhir': 'Jumadil Akhir',
                'jumadil ukhra': 'Jumadil Akhir',
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
        
        // Just update the prayer info, countdown will be updated by updateCountdown()
        this.mainApp.updateHomeWidget({
            prayerName: this.nextPrayer.name,
            prayerTime: this.nextPrayer.time,
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
        
        // Toggle notification button
        const btnToggleNotification = document.getElementById('btnToggleNotification');
        if (btnToggleNotification) {
            btnToggleNotification.addEventListener('click', () => {
                this.toggleNotifications();
            });
        }
        
        // Modal close button
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.hideLocationModal();
            });
        }
        
        // Modal backdrop close (click outside)
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                // Only close if clicking directly on the modal backdrop, not the content
                if (e.target === modal) {
                    this.hideLocationModal();
                }
            });
        }
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('locationModal');
                if (modal && modal.classList.contains('show')) {
                    this.hideLocationModal();
                }
            }
        });
        
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
        
        // Handle visibility change to reschedule notifications when app becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.notificationEnabled) {
                console.log('App became visible, checking notification schedule...');
                // Reschedule if needed
                this.scheduleNotifications();
            }
        });
    }

    showLocationModal() {
        console.log('Opening location modal...');
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.add('show');
            // Clear previous search results
            const cityDropdown = document.getElementById('cityDropdown');
            if (cityDropdown) {
                cityDropdown.style.display = 'none';
                cityDropdown.innerHTML = '';
            }
        }
    }

    hideLocationModal() {
        console.log('Closing location modal...');
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.remove('show');
            // Clear input
            const cityInput = document.getElementById('cityInput');
            if (cityInput) {
                cityInput.value = '';
            }
        }
    }

    async handleCityInput(value) {
        const dropdown = document.getElementById('cityDropdown');
        const loader = document.getElementById('citySearchLoader');
        if (!dropdown) return;
        
        // Clear previous timer
        if (this.searchDebounceTimer) {
            clearTimeout(this.searchDebounceTimer);
        }
        
        if (value.length < 2) {
            dropdown.style.display = 'none';
            dropdown.innerHTML = '';
            if (loader) loader.style.display = 'none';
            this.citySearchResults = [];
            return;
        }
        
        // Show loader immediately (user is still typing)
        if (loader) loader.style.display = 'flex';
        dropdown.style.display = 'none';
        
        // Wait for user to finish typing (500ms delay)
        this.searchDebounceTimer = setTimeout(async () => {
            await this.performCitySearch(value, dropdown, loader);
        }, 500);
    }
    
    async performCitySearch(value, dropdown, loader) {
        // No need to show loader again, already shown in handleCityInput
        
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
        const modal = document.getElementById('locationModal');
        
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
                // Select city and close modal immediately
                await this.selectCity(data[0]);
                
                // Clear input and hide modal
                if (input) input.value = '';
                if (modal) modal.classList.remove('show');
                if (dropdown) {
                    dropdown.style.display = 'none';
                    dropdown.innerHTML = '';
                }
                this.citySearchResults = [];
            } else {
                alert('Kota tidak ditemukan');
            }
        } catch (error) {
            console.error('Failed to search city:', error);
            if (loader) loader.style.display = 'none';
            alert('Gagal mencari kota');
        }
    }

    async useGPS() {
        const gpsLoader = document.getElementById('gpsLoader');
        const btnUseGPS = document.getElementById('btnUseGPS');
        
        // Show loader and disable button
        if (gpsLoader) gpsLoader.style.display = 'flex';
        if (btnUseGPS) btnUseGPS.disabled = true;
        
        try {
            let position;
            
            // Check if running as native app (Capacitor)
            if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Geolocation) {
                const { Geolocation } = window.Capacitor.Plugins;
                console.log('Using Capacitor Geolocation');
                position = await Geolocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
                this.lat = position.coords.latitude;
                this.lon = position.coords.longitude;
            } else if (navigator.geolocation) {
                // Web fallback
                console.log('Using Web Geolocation');
                position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    });
                });
                this.lat = position.coords.latitude;
                this.lon = position.coords.longitude;
            } else {
                throw new Error('GPS tidak didukung di perangkat ini');
            }
            
            console.log('GPS Location:', this.lat, this.lon);
            
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
            
        } catch (error) {
            console.error('GPS error:', error);
            alert(`Gagal mengambil lokasi GPS: ${error.message || error}`);
        } finally {
            // Hide loader and enable button
            if (gpsLoader) gpsLoader.style.display = 'none';
            if (btnUseGPS) btnUseGPS.disabled = false;
        }
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

    // ============= NOTIFICATION FEATURES =============
    
    async initNotifications() {
        // Load notification state from localStorage
        const savedState = localStorage.getItem('islamhub_adzan_notifications_enabled');
        this.notificationEnabled = savedState === 'true';
        
        // Check permission
        if ('Notification' in window) {
            this.notificationPermission = Notification.permission;
        }
        
        // Update button state
        this.updateNotificationButton();
        
        // Schedule notifications if enabled
        if (this.notificationEnabled && this.notificationPermission === 'granted') {
            this.scheduleNotifications();
        }
    }
    
    updateNotificationButton() {
        const btn = document.getElementById('btnToggleNotification');
        if (!btn) return;
        
        const icon = btn.querySelector('i');
        
        if (this.notificationEnabled) {
            btn.classList.add('active');
            btn.title = 'Notifikasi Aktif - Klik untuk Menonaktifkan';
            if (icon) icon.className = 'fas fa-bell';
        } else {
            btn.classList.remove('active');
            btn.title = 'Notifikasi Nonaktif - Klik untuk Mengaktifkan';
            if (icon) icon.className = 'far fa-bell-slash';
        }
    }
    
    async toggleNotifications() {
        // Check if running in Capacitor (native app)
        const isNativeApp = window.Capacitor && window.Capacitor.isNativePlatform();
        
        // For native apps, notifications are always available
        // For web, check browser support
        if (!isNativeApp && !('Notification' in window)) {
            this.showNotificationPopup('Browser Anda tidak mendukung notifikasi', 'error');
            return;
        }
        
        // If currently disabled, enable it
        if (!this.notificationEnabled) {
            // For native apps, request permission via Capacitor
            if (isNativeApp) {
                try {
                    // Check if LocalNotifications plugin is available
                    if (!window.Capacitor.Plugins || !window.Capacitor.Plugins.LocalNotifications) {
                        console.error('LocalNotifications plugin not found');
                        this.showNotificationPopup('⚠️ Plugin notifikasi belum tersedia. Pastikan aplikasi sudah di-build dengan benar.', 'error');
                        return;
                    }
                    
                    const { LocalNotifications } = window.Capacitor.Plugins;
                    
                    // Check current permission
                    const permissionStatus = await LocalNotifications.checkPermissions();
                    console.log('Current notification permission:', permissionStatus);
                    
                    // Request permission if not granted
                    if (permissionStatus.display !== 'granted') {
                        const result = await LocalNotifications.requestPermissions();
                        console.log('Permission request result:', result);
                        
                        if (result.display !== 'granted') {
                            this.showNotificationPopup('❌ Izin notifikasi ditolak. Silakan aktifkan di pengaturan aplikasi', 'error');
                            return;
                        }
                    }
                    
                    this.notificationPermission = 'granted';
                } catch (error) {
                    console.error('Error requesting notification permission:', error);
                    this.showNotificationPopup('❌ Gagal meminta izin notifikasi: ' + error.message, 'error');
                    return;
                }
            } else {
                // For web, use browser notification API
                if (this.notificationPermission !== 'granted') {
                    const permission = await Notification.requestPermission();
                    this.notificationPermission = permission;
                    
                    if (permission !== 'granted') {
                        this.showNotificationPopup('Izin notifikasi ditolak. Silakan aktifkan di pengaturan browser', 'error');
                        return;
                    }
                }
            }
            
            // Enable notifications
            this.notificationEnabled = true;
            localStorage.setItem('islamhub_adzan_notifications_enabled', 'true');
            
            // Update button state immediately
            this.updateNotificationButton();
            
            this.scheduleNotifications();
            this.showNotificationPopup('✓ Notifikasi waktu sholat diaktifkan', 'success');
            
            // Show welcome notification to confirm it's working
            this.showWelcomeNotification();
            
        } else {
            // Disable notifications
            this.notificationEnabled = false;
            localStorage.setItem('islamhub_adzan_notifications_enabled', 'false');
            
            // Update button state immediately
            this.updateNotificationButton();
            
            this.cancelScheduledNotifications();
            this.showNotificationPopup('✗ Notifikasi waktu sholat dinonaktifkan', 'info');
        }
    }
    
    showNotificationPopup(message, type = 'info') {
        // Create popup element
        const popup = document.createElement('div');
        popup.className = `notification-popup ${type}`;
        popup.innerHTML = `
            <div class="popup-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Show with animation
        setTimeout(() => popup.classList.add('show'), 10);
        
        // Hide and remove after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }, 3000);
    }
    
    scheduleNotifications() {
        // Cancel existing scheduled notifications
        this.cancelScheduledNotifications();
        
        if (!this.prayerTimes || Object.keys(this.prayerTimes).length === 0) {
            console.warn('No prayer times available for scheduling notifications');
            return;
        }
        
        // Save prayer times to localStorage for service worker access
        localStorage.setItem('islamhub_prayer_times', JSON.stringify(this.prayerTimes));
        localStorage.setItem('islamhub_notification_scheduled_at', new Date().toISOString());
        
        const now = new Date();
        // Use Indonesian names to match prayerTimes keys
        const prayers = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
        
        prayers.forEach(prayer => {
            const prayerTime = this.prayerTimes[prayer];
            if (!prayerTime) return;
            
            // Parse prayer time
            const [hours, minutes] = prayerTime.split(':').map(Number);
            const prayerDate = new Date();
            prayerDate.setHours(hours, minutes, 0, 0);
            
            // Schedule notification 5 minutes BEFORE prayer time
            const notificationDate = new Date(prayerDate.getTime() - 5 * 60 * 1000);
            
            // If notification time has passed today, schedule for tomorrow
            if (notificationDate <= now) {
                notificationDate.setDate(notificationDate.getDate() + 1);
            }
            
            const timeUntilNotification = notificationDate.getTime() - now.getTime();
            
            // Only schedule if within next 24 hours
            if (timeUntilNotification > 0 && timeUntilNotification <= 24 * 60 * 60 * 1000) {
                const timeoutId = setTimeout(() => {
                    this.showPrayerNotification(prayer, prayerTime);
                    // Reschedule for next day
                    setTimeout(() => this.scheduleNotifications(), 1000);
                }, timeUntilNotification);
                
                this.scheduledNotifications.push(timeoutId);
                
                console.log(`Scheduled notification for ${prayer} at ${notificationDate.toLocaleTimeString()} (in ${Math.round(timeUntilNotification / 60000)} minutes)`);
            }
        });
        
        // Set up a periodic check every minute to ensure notifications aren't missed
        // This is a fallback in case setTimeout fails
        if (this.notificationCheckInterval) {
            clearInterval(this.notificationCheckInterval);
        }
        
        this.notificationCheckInterval = setInterval(() => {
            this.checkPendingNotifications();
        }, 60000); // Check every minute
        
        console.log(`Scheduled ${this.scheduledNotifications.length} prayer notifications with fallback checker`);
    }
    
    cancelScheduledNotifications() {
        this.scheduledNotifications.forEach(timeoutId => clearTimeout(timeoutId));
        this.scheduledNotifications = [];
        
        if (this.notificationCheckInterval) {
            clearInterval(this.notificationCheckInterval);
            this.notificationCheckInterval = null;
        }
    }
    
    checkPendingNotifications() {
        if (!this.notificationEnabled || this.notificationPermission !== 'granted') {
            return;
        }
        
        if (!this.prayerTimes || Object.keys(this.prayerTimes).length === 0) {
            return;
        }
        
        const now = new Date();
        const currentMinute = `${now.getHours()}:${now.getMinutes()}`;
        const prayers = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
        
        prayers.forEach(prayer => {
            const prayerTime = this.prayerTimes[prayer];
            if (!prayerTime) return;
            
            // Parse prayer time
            const [hours, minutes] = prayerTime.split(':').map(Number);
            const prayerDate = new Date();
            prayerDate.setHours(hours, minutes, 0, 0);
            
            // Calculate notification time (5 minutes before)
            const notificationDate = new Date(prayerDate.getTime() - 5 * 60 * 1000);
            const notificationMinute = `${notificationDate.getHours()}:${notificationDate.getMinutes()}`;
            
            // Check if current time matches notification time
            if (currentMinute === notificationMinute) {
                // Check if we haven't already sent this notification today
                const checkKey = `${prayer}-${now.toDateString()}`;
                if (!this.lastNotificationCheck[checkKey]) {
                    console.log(`Fallback notification triggered for ${prayer}`);
                    this.showPrayerNotification(prayer, prayerTime);
                    this.lastNotificationCheck[checkKey] = true;
                    
                    // Clean up old check keys (keep only today's)
                    const todayStr = now.toDateString();
                    Object.keys(this.lastNotificationCheck).forEach(key => {
                        if (!key.endsWith(todayStr)) {
                            delete this.lastNotificationCheck[key];
                        }
                    });
                }
            }
        });
    }
    
    async showPrayerNotification(prayerName, prayerTime) {
        if (!this.notificationEnabled || this.notificationPermission !== 'granted') {
            return;
        }
        
        const prayerNames = {
            'Subuh': 'Subuh',
            'Dzuhur': 'Dzuhur',
            'Ashar': 'Ashar',
            'Maghrib': 'Maghrib',
            'Isya': 'Isya'
        };
        
        const displayName = prayerNames[prayerName] || prayerName;
        const title = `🕌 Waktu ${displayName}`;
        const body = `⏰ 5 menit lagi waktu sholat ${displayName} (${prayerTime}). Bersiaplah untuk sholat.`;
        
        const options = {
            body: body,
            icon: `${this.basePath}/assets/icons/icon-192x192.png`,
            badge: `${this.basePath}/assets/icons/icon-96x96.png`,
            tag: `prayer-${prayerName}`,
            requireInteraction: true,
            silent: false,
            vibrate: [500, 200, 500, 200, 500]
        };
        
        // Try Service Worker first (better for mobile)
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification(title, options);
                return;
            } catch (error) {
                console.log('Service Worker notification failed, using fallback:', error);
            }
        }
        
        // Fallback to regular Notification API
        try {
            const notification = new Notification(title, options);
            setTimeout(() => notification.close(), 10000);
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        } catch (error) {
            console.error('Prayer notification failed:', error);
        }
    }
    
    async showWelcomeNotification() {
        if (this.notificationPermission !== 'granted') return;
        
        const title = '🕌 IslamHub - Notifikasi Aktif';
        const body = `Anda akan menerima notifikasi saat waktu sholat tiba. Semoga istiqomah dalam ibadah 🤲`;
        
        // Check if running as native app (Capacitor)
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications) {
            try {
                const { LocalNotifications } = window.Capacitor.Plugins;
                await LocalNotifications.schedule({
                    notifications: [{
                        id: 999999,
                        title: title,
                        body: body,
                        largeBody: body,
                        summaryText: 'IslamHub',
                        sound: null,
                        smallIcon: 'ic_stat_icon_config_sample',
                        iconColor: '#00FFFF',
                        attachments: null,
                        actionTypeId: '',
                        extra: null
                    }]
                });
                console.log('Native notification shown');
                return;
            } catch (error) {
                console.error('Native notification failed:', error);
            }
        }
        
        const options = {
            body: body,
            icon: `${this.basePath}/assets/icons/icon-192x192.png`,
            badge: `${this.basePath}/assets/icons/icon-96x96.png`,
            tag: 'welcome',
            requireInteraction: false,
            silent: false,
            vibrate: [200, 100, 200]
        };
        
        // Try Service Worker first (better for mobile web)
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification(title, options);
                return;
            } catch (error) {
                console.log('Service Worker notification failed, using fallback:', error);
            }
        }
        
        // Fallback to regular Notification API
        try {
            const notification = new Notification(title, options);
            setTimeout(() => notification.close(), 8000);
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        } catch (error) {
            console.error('Notification failed:', error);
        }
    }

    _getBasePath() {
        // Get base path for assets - handles subdirectory deployment
        const path = window.location.pathname;
        const base = path.substring(0, path.lastIndexOf('/'));
        return base || '';
    }
}
