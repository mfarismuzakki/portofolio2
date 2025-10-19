/* ===== Qibla Finder App - IslamHub ===== */
/* Find qibla direction using GPS and device compass */

export default class QiblaApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('qibla-app');
        
        // Kaaba coordinates
        this.kaabaLat = 21.4225;
        this.kaabaLon = 39.8262;
        
        // User location
        this.userLat = null;
        this.userLon = null;
        
        // Compass
        this.currentHeading = 0;
        this.targetHeading = 0;
        this.qiblaDirection = 0;
        this.smoothingFactor = 0.8;
        this.isTracking = false;
    }

    async init() {
        console.log('Initializing Qibla App...');
        await this.render();
        this.setupEventListeners();
        this.checkPermissions();
    }

    async render() {
        this.container.innerHTML = `
            <div class="qibla-container">
                <div class="qibla-header">
                    <h2><i class="fas fa-compass"></i> Pencari Arah Kiblat</h2>
                    <p class="subtitle">Temukan arah kiblat dengan presisi tinggi</p>
                </div>

                <!-- Status Card -->
                <div class="qibla-status">
                    <div class="status-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span id="locationStatus">Tekan tombol untuk mendapatkan lokasi</span>
                    </div>
                    <div class="status-item">
                        <i class="fas fa-satellite-dish"></i>
                        <span id="compassStatus">Kompas siap</span>
                    </div>
                </div>

                <button id="getLocationBtn" class="qibla-btn">
                    <i class="fas fa-crosshairs"></i>
                    <span>Dapatkan Lokasi</span>
                </button>

                <!-- Compass -->
                <div class="compass-wrapper">
                    <div class="compass-container" id="compassContainer">
                        <div class="compass-ring">
                            <div class="cardinal north">N</div>
                            <div class="cardinal east">E</div>
                            <div class="cardinal south">S</div>
                            <div class="cardinal west">W</div>
                            <div class="degree-marks" id="degreeMarks"></div>
                        </div>
                        
                        <div class="qibla-needle" id="qiblaNeedle">
                            <div class="needle-head">
                                <i class="fas fa-kaaba"></i>
                            </div>
                            <div class="needle-tail"></div>
                        </div>
                        
                        <div class="compass-center"></div>
                    </div>
                    
                    <div class="qibla-info">
                        <div class="qibla-degree">
                            <span id="qiblaDirection">---°</span>
                            <label>Arah Kiblat</label>
                        </div>
                    </div>
                </div>

                <!-- Location Info -->
                <div class="location-info" id="locationInfo" style="display: none;">
                    <div class="info-grid">
                        <div class="info-item">
                            <i class="fas fa-location-dot"></i>
                            <div>
                                <label>Koordinat</label>
                                <span id="coordinates">---</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-ruler"></i>
                            <div>
                                <label>Jarak ke Kakbah</label>
                                <span id="distance">---</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-compass"></i>
                            <div>
                                <label>Arah</label>
                                <span id="direction">---</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Instructions -->
                <div class="qibla-instructions">
                    <h3><i class="fas fa-info-circle"></i> Cara Penggunaan</h3>
                    <ol>
                        <li>Tekan tombol "Dapatkan Lokasi" untuk mengaktifkan GPS</li>
                        <li>Izinkan akses lokasi dan kompas pada browser</li>
                        <li>Pegang HP tegak dan putar sampai jarum menunjuk lurus ke atas</li>
                        <li>Arah yang ditunjuk jarum adalah arah kiblat</li>
                    </ol>
                    <div class="note">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Pastikan HP tidak dekat dengan benda magnetik untuk akurasi maksimal</span>
                    </div>
                </div>
            </div>
        `;

        // Create degree marks
        this.createDegreeMarks();
    }

    createDegreeMarks() {
        const marks = document.getElementById('degreeMarks');
        if (!marks) return;

        for (let i = 0; i < 360; i += 10) {
            const mark = document.createElement('div');
            mark.className = i % 30 === 0 ? 'degree-mark major' : 'degree-mark';
            mark.style.transform = `rotate(${i}deg)`;
            marks.appendChild(mark);
        }
    }

    setupEventListeners() {
        const btn = document.getElementById('getLocationBtn');
        btn?.addEventListener('click', () => this.getLocation());

        // Start smooth animation
        this.startAnimation();
    }

    checkPermissions() {
        if (!navigator.geolocation) {
            this.showError('Geolocation tidak didukung');
            return;
        }

        if (!window.DeviceOrientationEvent) {
            this.showError('Kompas tidak didukung');
            return;
        }
    }

    async getLocation() {
        const btn = document.getElementById('getLocationBtn');
        const statusEl = document.getElementById('locationStatus');

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mendapatkan lokasi...';
        statusEl.textContent = 'Mendapatkan lokasi GPS...';

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            this.userLat = position.coords.latitude;
            this.userLon = position.coords.longitude;

            // Calculate qibla direction
            this.qiblaDirection = this.calculateQiblaDirection();

            // Update UI
            this.updateLocationInfo();
            
            // Start compass
            await this.startCompass();

            btn.innerHTML = '<i class="fas fa-check"></i> Lokasi Ditemukan';
            statusEl.textContent = `Lokasi: ${this.userLat.toFixed(4)}°, ${this.userLon.toFixed(4)}°`;

        } catch (error) {
            console.error('Geolocation error:', error);
            this.showError('Gagal mendapatkan lokasi: ' + error.message);
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-crosshairs"></i> Coba Lagi';
        }
    }

    calculateQiblaDirection() {
        // Convert to radians
        const lat1 = this.userLat * Math.PI / 180;
        const lon1 = this.userLon * Math.PI / 180;
        const lat2 = this.kaabaLat * Math.PI / 180;
        const lon2 = this.kaabaLon * Math.PI / 180;

        // Calculate bearing
        const dLon = lon2 - lon1;
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        let bearing = Math.atan2(y, x) * 180 / Math.PI;
        
        // Normalize to 0-360
        bearing = (bearing + 360) % 360;

        return bearing;
    }

    calculateDistance() {
        const R = 6371; // Earth radius in km
        const lat1 = this.userLat * Math.PI / 180;
        const lon1 = this.userLon * Math.PI / 180;
        const lat2 = this.kaabaLat * Math.PI / 180;
        const lon2 = this.kaabaLon * Math.PI / 180;

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    }

    updateLocationInfo() {
        const infoEl = document.getElementById('locationInfo');
        const coordsEl = document.getElementById('coordinates');
        const distanceEl = document.getElementById('distance');
        const directionEl = document.getElementById('direction');
        const qiblaEl = document.getElementById('qiblaDirection');

        if (infoEl) infoEl.style.display = 'block';
        
        if (coordsEl) coordsEl.textContent = `${this.userLat.toFixed(4)}°, ${this.userLon.toFixed(4)}°`;
        
        const distance = this.calculateDistance();
        if (distanceEl) distanceEl.textContent = `${distance.toFixed(2)} km`;
        
        if (directionEl) directionEl.textContent = this.getDirectionText(this.qiblaDirection);
        if (qiblaEl) qiblaEl.textContent = `${Math.round(this.qiblaDirection)}°`;
    }

    getDirectionText(degree) {
        const directions = [
            'Utara', 'Utara Timur Laut', 'Timur Laut', 'Timur Timur Laut',
            'Timur', 'Timur Tenggara', 'Tenggara', 'Selatan Tenggara',
            'Selatan', 'Selatan Barat Daya', 'Barat Daya', 'Barat Barat Daya',
            'Barat', 'Barat Barat Laut', 'Barat Laut', 'Utara Barat Laut'
        ];
        const index = Math.round(degree / 22.5) % 16;
        return directions[index];
    }

    async startCompass() {
        const compassStatus = document.getElementById('compassStatus');

        // Request permission for iOS 13+
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission !== 'granted') {
                    this.showError('Izin kompas ditolak');
                    return;
                }
            } catch (error) {
                console.error('Permission error:', error);
                this.showError('Gagal meminta izin kompas');
                return;
            }
        }

        // Start listening to device orientation
        window.addEventListener('deviceorientationabsolute', (e) => this.handleOrientation(e), true);
        window.addEventListener('deviceorientation', (e) => this.handleOrientation(e), true);

        this.isTracking = true;
        compassStatus.textContent = 'Kompas aktif';
    }

    handleOrientation(event) {
        if (!this.isTracking) return;

        let heading = null;

        // Get compass heading
        if (event.webkitCompassHeading !== undefined) {
            // iOS
            heading = event.webkitCompassHeading;
        } else if (event.alpha !== null) {
            // Android
            heading = 360 - event.alpha;
        }

        if (heading !== null) {
            this.targetHeading = heading;
        }
    }

    startAnimation() {
        const animate = () => {
            this.smoothUpdate();
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    smoothUpdate() {
        // Smooth heading transition
        let diff = this.targetHeading - this.currentHeading;
        
        // Handle 360° wraparound
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        const change = diff * (1 - this.smoothingFactor);
        this.currentHeading += change;
        this.currentHeading = (this.currentHeading + 360) % 360;

        // Update visual
        this.updateCompass();
    }

    updateCompass() {
        const compass = document.getElementById('compassContainer');
        const needle = document.getElementById('qiblaNeedle');

        if (compass) {
            compass.style.transform = `rotate(${-this.currentHeading}deg)`;
        }

        if (needle && this.qiblaDirection !== 0) {
            needle.style.transform = `rotate(${this.qiblaDirection}deg)`;
        }
    }

    showError(message) {
        const statusEl = document.getElementById('locationStatus');
        if (statusEl) {
            statusEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            statusEl.style.color = 'var(--error-color, #ff4444)';
        }
    }

    cleanup() {
        this.isTracking = false;
        window.removeEventListener('deviceorientationabsolute', this.handleOrientation);
        window.removeEventListener('deviceorientation', this.handleOrientation);
    }
}
