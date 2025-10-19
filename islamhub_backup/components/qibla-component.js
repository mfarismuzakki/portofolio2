/**
 * Qibla Finder Component for Islamic SuperApps
 * Adapted from qibla_finder application with enhanced integration
 */

export default class QiblaComponent {
    constructor({ container, eventBus, sharedData, storageManager }) {
        this.container = container;
        this.eventBus = eventBus;
        this.sharedData = sharedData;
        this.storageManager = storageManager;
        
        // Kaaba coordinates
        this.kaabaLat = 21.4225;
        this.kaabaLon = 39.8262;
        
        // Current user location
        this.userLat = null;
        this.userLon = null;
        
        // Compass and orientation with smoothing
        this.currentHeading = 0;
        this.targetHeading = 0;
        this.qiblaDirection = 0;
        this.watchId = null;
        this.lastUpdateTime = 0;
        
        // Screen orientation tracking
        this.screenOrientation = 0;
        this.currentOrientationKey = 'portrait';
        
        // Absolute reference system
        this.absoluteNorthReference = null;
        this.baseCalibration = {
            portrait: null,
            landscapeLeft: null,
            portraitUpsideDown: null,
            landscapeRight: null
        };
        
        // Smoothing parameters
        this.smoothingFactor = 0.8;
        this.minimumChange = 0.5;
        this.maxChangePerFrame = 5;
        
        // Calibration
        this.calibrationCount = 0;
        this.calibrationReadings = [];
        this.isCalibrated = false;
        this.shouldCalibrateOnOrientationChange = false;
        
        // DOM elements (will be set after render)
        this.compass = null;
        this.qiblaNeedle = null;
        this.getLocationBtn = null;
    }

    async init() {
        try {
            // Check if we have shared location data
            await this.loadSharedLocationData();
            
            // Render component
            this.render();
            
            // Setup DOM elements
            this.setupDOMElements();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Create degree marks
            this.createDegreeMarks();
            
            // Check geolocation support
            this.checkGeolocationSupport();
            
            // Start smooth animation
            this.startSmoothAnimation();
            
            // If we have location data, use it
            if (this.userLat && this.userLon) {
                this.updateLocationDisplay();
                this.calculateQiblaDirection();
                this.calculateDistance();
                this.setupDeviceOrientation();
            }
            
            console.log('✅ Qibla Component initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Qibla Component:', error);
            this.renderError();
        }
    }

    async loadSharedLocationData() {
        // Check if location data is available from other components (like Adzan)
        if (this.sharedData.location) {
            this.userLat = this.sharedData.location.lat;
            this.userLon = this.sharedData.location.lon;
            console.log('📍 Using shared location data:', {
                lat: this.userLat,
                lon: this.userLon,
                city: this.sharedData.location.city
            });
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="qibla-wrapper">
                <!-- Header Section -->
                <div class="qibla-header">
                    <div class="header-content">
                        <h2>Qibla Finder</h2>
                        <p>Kompas digital untuk menentukan arah kiblat</p>
                    </div>
                    
                    <div class="status-indicators">
                        <div class="status-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span id="locationStatus">Belum ada lokasi</span>
                        </div>
                        <div class="status-item">
                            <i class="fas fa-compass"></i>
                            <span id="compassStatus">Kompas tidak aktif</span>
                        </div>
                    </div>
                </div>

                <!-- Compass Section -->
                <div class="compass-container">
                    <div class="compass-wrapper">
                        <div class="compass" id="compass">
                            <!-- Degree marks will be generated here -->
                            <div class="degree-marks"></div>
                            
                            <!-- Cardinal directions -->
                            <div class="direction-label north">N</div>
                            <div class="direction-label east">E</div>
                            <div class="direction-label south">S</div>
                            <div class="direction-label west">W</div>
                            
                            <!-- Qibla needle -->
                            <div class="qibla-needle" id="qiblaNeedle">
                                <div class="needle-point"></div>
                                <div class="needle-center"></div>
                            </div>
                            
                            <!-- Kaaba indicator -->
                            <div class="kaaba-indicator">
                                <i class="fas fa-kaaba"></i>
                            </div>
                        </div>
                        
                        <!-- Compass info overlay -->
                        <div class="compass-info">
                            <div class="qibla-direction" id="qiblaDirection">--°</div>
                            <div class="direction-text" id="directionText">--</div>
                        </div>
                    </div>
                </div>

                <!-- Location Controls -->
                <div class="location-controls">
                    <button class="location-btn primary" id="getLocationBtn">
                        <i class="fas fa-crosshairs"></i>
                        <span>Dapatkan Lokasi</span>
                    </button>
                    
                    <div class="calibration-controls">
                        <button class="calibration-btn" id="calibrateBtn">
                            <i class="fas fa-bullseye"></i>
                            <span>Kalibrasi</span>
                        </button>
                        <button class="calibration-btn secondary" id="resetCalibrationBtn">
                            <i class="fas fa-undo"></i>
                            <span>Reset</span>
                        </button>
                    </div>
                </div>

                <!-- Location Information -->
                <div class="location-info-panel">
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Lintang</div>
                            <div class="info-value" id="userLat">--°</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Bujur</div>
                            <div class="info-value" id="userLon">--°</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Arah Kiblat</div>
                            <div class="info-value" id="directionValue">--°</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Jarak ke Makkah</div>
                            <div class="info-value">
                                <span id="distanceValue">--</span> km
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Instructions -->
                <div class="instructions-panel">
                    <div class="instruction-header">
                        <i class="fas fa-info-circle"></i>
                        <span>Cara Penggunaan</span>
                    </div>
                    <ol class="instruction-list">
                        <li>Tekan tombol "Dapatkan Lokasi" untuk mendapatkan posisi Anda</li>
                        <li>Izinkan akses lokasi dan orientasi perangkat</li>
                        <li>Kalibrasi kompas dengan menekan tombol "Kalibrasi"</li>
                        <li>Arahkan perangkat sesuai dengan jarum kompas hijau</li>
                        <li>Jarum menunjuk ke arah Kiblat (Kaaba di Makkah)</li>
                    </ol>
                </div>

                <!-- Loading Overlay -->
                <div class="loading-overlay" id="loadingOverlay">
                    <div class="loading-content">
                        <div class="loading-spinner">
                            <div class="spinner-ring"></div>
                        </div>
                        <div class="loading-text">Mendapatkan lokasi...</div>
                    </div>
                </div>
            </div>
            
            <style>
            /* Qibla Component Specific Styles */
            .qibla-wrapper {
                max-width: 800px;
                margin: 0 auto;
                padding: 0;
            }

            .qibla-header {
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 25px;
                text-align: center;
                backdrop-filter: blur(20px);
            }

            .header-content h2 {
                font-family: var(--font-primary);
                font-size: 28px;
                font-weight: 700;
                color: var(--primary-cyan);
                margin-bottom: 8px;
            }

            .header-content p {
                color: var(--text-secondary);
                font-size: 14px;
                margin-bottom: 20px;
            }

            .status-indicators {
                display: flex;
                justify-content: center;
                gap: 20px;
                flex-wrap: wrap;
            }

            .status-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: var(--text-secondary);
                background: rgba(255, 255, 255, 0.05);
                padding: 8px 12px;
                border-radius: 20px;
                border: 1px solid rgba(0, 255, 255, 0.1);
            }

            .status-item i {
                color: var(--electric-blue);
            }

            .compass-container {
                display: flex;
                justify-content: center;
                margin-bottom: 30px;
            }

            .compass-wrapper {
                position: relative;
                width: 320px;
                height: 320px;
            }

            .compass {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: radial-gradient(circle, var(--surface) 0%, rgba(0, 20, 40, 0.8) 100%);
                border: 3px solid rgba(0, 255, 255, 0.3);
                box-shadow: 
                    0 0 30px rgba(0, 255, 255, 0.2),
                    inset 0 0 20px rgba(0, 255, 255, 0.1);
                position: relative;
                overflow: hidden;
            }

            .degree-marks {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }

            .degree-mark {
                position: absolute;
                width: 2px;
                height: 15px;
                background: rgba(0, 255, 255, 0.4);
                left: 50%;
                top: 5px;
                transform-origin: 50% 155px;
                margin-left: -1px;
            }

            .degree-mark.major {
                height: 25px;
                width: 3px;
                background: rgba(0, 255, 255, 0.7);
                margin-left: -1.5px;
            }

            .direction-label {
                position: absolute;
                font-family: var(--font-primary);
                font-size: 18px;
                font-weight: 700;
                color: var(--primary-cyan);
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }

            .direction-label.north {
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
            }

            .direction-label.east {
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
            }

            .direction-label.south {
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
            }

            .direction-label.west {
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
            }

            .qibla-needle {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 4px;
                height: 120px;
                z-index: 10;
                transition: transform 0.1s ease-out;
            }

            .needle-point {
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 60px solid #00ff41;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                filter: drop-shadow(0 0 8px rgba(0, 255, 65, 0.6));
            }

            .needle-center {
                width: 12px;
                height: 12px;
                background: radial-gradient(circle, #00ff41, #00cc33);
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 2px solid var(--dark-bg);
                box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
            }

            .kaaba-indicator {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: var(--primary-cyan);
                font-size: 16px;
                z-index: 5;
                text-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
            }

            .compass-info {
                position: absolute;
                bottom: -60px;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 15px;
                padding: 15px 20px;
                backdrop-filter: blur(20px);
            }

            .qibla-direction {
                font-family: var(--font-primary);
                font-size: 24px;
                font-weight: 700;
                color: var(--primary-cyan);
                text-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
                margin-bottom: 5px;
            }

            .direction-text {
                font-size: 14px;
                color: var(--text-secondary);
                font-weight: 500;
            }

            .location-controls {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-bottom: 25px;
            }

            .location-btn {
                background: var(--gradient-primary);
                border: none;
                border-radius: 12px;
                padding: 15px 25px;
                color: var(--dark-bg);
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .location-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }

            .location-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .calibration-controls {
                display: flex;
                gap: 10px;
            }

            .calibration-btn {
                flex: 1;
                background: var(--gradient-secondary);
                border: none;
                border-radius: 10px;
                padding: 12px 20px;
                color: var(--dark-bg);
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .calibration-btn.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-primary);
                border: 1px solid rgba(0, 255, 255, 0.2);
            }

            .calibration-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 15px rgba(0, 255, 65, 0.3);
            }

            .calibration-btn.secondary:hover {
                box-shadow: 0 4px 15px rgba(0, 255, 255, 0.2);
            }

            .location-info-panel {
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.1);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 25px;
            }

            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 20px;
            }

            .info-item {
                text-align: center;
            }

            .info-label {
                font-size: 12px;
                color: var(--text-secondary);
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 500;
            }

            .info-value {
                font-family: var(--font-primary);
                font-size: 18px;
                font-weight: 700;
                color: var(--primary-cyan);
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            }

            .instructions-panel {
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.1);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 20px;
            }

            .instruction-header {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 16px;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 15px;
            }

            .instruction-header i {
                color: var(--electric-blue);
            }

            .instruction-list {
                color: var(--text-secondary);
                font-size: 14px;
                line-height: 1.6;
                padding-left: 20px;
            }

            .instruction-list li {
                margin-bottom: 8px;
            }

            .loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                border-radius: 15px;
                z-index: 1000;
            }

            .loading-overlay.show {
                opacity: 1;
                visibility: visible;
            }

            .loading-content {
                text-align: center;
                color: var(--text-primary);
            }

            .loading-spinner {
                width: 50px;
                height: 50px;
                margin: 0 auto 15px;
            }

            .spinner-ring {
                width: 100%;
                height: 100%;
                border: 3px solid rgba(0, 255, 255, 0.2);
                border-top: 3px solid var(--primary-cyan);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .loading-text {
                font-size: 16px;
                color: var(--text-primary);
            }

            @media (max-width: 768px) {
                .compass-wrapper {
                    width: 280px;
                    height: 280px;
                }
                
                .calibration-controls {
                    flex-direction: column;
                }
                
                .info-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }
                
                .status-indicators {
                    flex-direction: column;
                    gap: 10px;
                }
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            </style>
        `;
    }

    setupDOMElements() {
        // Get DOM element references
        this.compass = this.container.querySelector('#compass');
        this.qiblaNeedle = this.container.querySelector('#qiblaNeedle');
        this.getLocationBtn = this.container.querySelector('#getLocationBtn');
        this.loadingOverlay = this.container.querySelector('#loadingOverlay');
        this.locationStatus = this.container.querySelector('#locationStatus');
        this.compassStatus = this.container.querySelector('#compassStatus');
        
        // Info elements
        this.userLatEl = this.container.querySelector('#userLat');
        this.userLonEl = this.container.querySelector('#userLon');
        this.distanceValueEl = this.container.querySelector('#distanceValue');
        this.directionValueEl = this.container.querySelector('#directionValue');
        this.directionTextEl = this.container.querySelector('#directionText');
        this.qiblaDirectionEl = this.container.querySelector('#qiblaDirection');
    }

    setupEventListeners() {
        // Get location button
        this.getLocationBtn?.addEventListener('click', () => {
            this.getCurrentLocation();
        });
        
        // Calibration buttons
        const calibrateBtn = this.container.querySelector('#calibrateBtn');
        const resetCalibrationBtn = this.container.querySelector('#resetCalibrationBtn');
        
        calibrateBtn?.addEventListener('click', () => {
            this.startCalibration();
        });
        
        resetCalibrationBtn?.addEventListener('click', () => {
            this.resetAllCalibration();
        });
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopWatchingOrientation();
            } else if (this.userLat && this.userLon) {
                this.setupDeviceOrientation();
            }
        });
        
        // Handle screen orientation changes
        if (screen.orientation) {
            screen.orientation.addEventListener('change', () => {
                this.handleOrientationChange();
            });
        } else {
            window.addEventListener('orientationchange', () => {
                setTimeout(() => this.handleOrientationChange(), 500);
            });
        }

        // Listen for location updates from other components
        this.eventBus?.addEventListener('locationUpdate', (event) => {
            this.handleSharedLocationUpdate(event.detail);
        });
    }

    handleSharedLocationUpdate(locationData) {
        if (locationData && locationData.lat && locationData.lon) {
            this.userLat = locationData.lat;
            this.userLon = locationData.lon;
            
            this.updateLocationStatus(`Lokasi dari ${locationData.city || 'komponen lain'}`);
            this.updateLocationDisplay();
            this.calculateQiblaDirection();
            this.calculateDistance();
            
            if (!this.isDeviceOrientationActive) {
                this.setupDeviceOrientation();
            }
        }
    }

    createDegreeMarks() {
        const degreeMarks = this.container.querySelector('.degree-marks');
        if (!degreeMarks) return;
        
        for (let i = 0; i < 360; i += 10) {
            const mark = document.createElement('div');
            mark.className = i % 30 === 0 ? 'degree-mark major' : 'degree-mark';
            mark.style.transform = `rotate(${i}deg)`;
            degreeMarks.appendChild(mark);
        }
    }

    checkGeolocationSupport() {
        if (!navigator.geolocation) {
            this.showError('Geolocation tidak didukung oleh browser Anda');
            this.getLocationBtn.disabled = true;
        }
    }

    startSmoothAnimation() {
        const animate = () => {
            this.smoothUpdateCompass();
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    smoothUpdateCompass() {
        if (Math.abs(this.targetHeading - this.currentHeading) > this.minimumChange) {
            // Calculate the shortest rotation path
            let diff = this.targetHeading - this.currentHeading;
            
            // Handle 360° wraparound
            if (diff > 180) {
                diff -= 360;
            } else if (diff < -180) {
                diff += 360;
            }
            
            // Apply smoothing and limit max change per frame
            const change = Math.sign(diff) * Math.min(Math.abs(diff) * (1 - this.smoothingFactor), this.maxChangePerFrame);
            this.currentHeading += change;
            
            // Normalize to 0-360
            this.currentHeading = (this.currentHeading + 360) % 360;
            
            this.updateCompassVisual();
        }
    }

    getCurrentLocation() {
        if (!navigator.geolocation) return;
        
        this.showLoading(true);
        this.updateLocationStatus('Mendapatkan lokasi...');
        
        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000 // 5 minutes
        };
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.onLocationSuccess(position);
            },
            (error) => {
                this.onLocationError(error);
            },
            options
        );
    }

    onLocationSuccess(position) {
        this.userLat = position.coords.latitude;
        this.userLon = position.coords.longitude;
        
        this.showLoading(false);
        this.updateLocationStatus('Lokasi berhasil didapatkan');
        this.updateLocationDisplay();
        this.calculateQiblaDirection();
        this.calculateDistance();
        
        // Update shared data
        this.sharedData.location = {
            lat: this.userLat,
            lon: this.userLon,
            city: 'Lokasi Saat Ini',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        // Notify other components
        this.eventBus?.dispatchEvent(new CustomEvent('locationUpdate', {
            detail: this.sharedData.location
        }));
        
        // Start watching device orientation
        this.setupDeviceOrientation();
        
        // Start calibration process
        this.startCalibration();
        
        this.showNotification('Lokasi berhasil didapatkan', 'success');
    }

    onLocationError(error) {
        this.showLoading(false);
        
        let errorMessage = 'Gagal mendapatkan lokasi';
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = 'Akses lokasi ditolak. Mohon izinkan akses lokasi.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = 'Informasi lokasi tidak tersedia.';
                break;
            case error.TIMEOUT:
                errorMessage = 'Timeout mendapatkan lokasi.';
                break;
        }
        
        this.updateLocationStatus(errorMessage);
        this.showNotification(errorMessage, 'error');
    }

    calculateQiblaDirection() {
        if (!this.userLat || !this.userLon) return;
        
        const lat1 = this.toRadians(this.userLat);
        const lat2 = this.toRadians(this.kaabaLat);
        const deltaLon = this.toRadians(this.kaabaLon - this.userLon);
        
        const y = Math.sin(deltaLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
        
        let bearing = Math.atan2(y, x);
        bearing = this.toDegrees(bearing);
        bearing = (bearing + 360) % 360;
        
        this.qiblaDirection = bearing;
        this.updateDirectionDisplay();
    }

    calculateDistance() {
        if (!this.userLat || !this.userLon) return;
        
        const R = 6371; // Earth's radius in kilometers
        const lat1 = this.toRadians(this.userLat);
        const lat2 = this.toRadians(this.kaabaLat);
        const deltaLat = this.toRadians(this.kaabaLat - this.userLat);
        const deltaLon = this.toRadians(this.kaabaLon - this.userLon);
        
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        const distance = R * c;
        this.updateDistanceDisplay(distance);
    }

    setupDeviceOrientation() {
        if (typeof DeviceOrientationEvent !== 'undefined') {
            // Check if we need to request permission (iOS 13+)
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            this.startWatchingOrientation();
                        } else {
                            this.updateCompassStatus('Izin orientasi perangkat diperlukan');
                        }
                    })
                    .catch(() => {
                        this.updateCompassStatus('Orientasi perangkat tidak tersedia');
                    });
            } else {
                this.startWatchingOrientation();
            }
        } else {
            this.updateCompassStatus('Orientasi perangkat tidak didukung');
        }
    }

    startWatchingOrientation() {
        this.isDeviceOrientationActive = true;
        window.addEventListener('deviceorientationabsolute', this.handleOrientation.bind(this));
        window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
        this.updateCompassStatus('Kompas aktif');
    }

    stopWatchingOrientation() {
        this.isDeviceOrientationActive = false;
        window.removeEventListener('deviceorientationabsolute', this.handleOrientation.bind(this));
        window.removeEventListener('deviceorientation', this.handleOrientation.bind(this));
    }

    handleOrientation(event) {
        if (event.alpha !== null) {
            const now = Date.now();
            
            // Throttle updates to avoid too frequent changes
            if (now - this.lastUpdateTime < 50) { // 20 FPS max
                return;
            }
            this.lastUpdateTime = now;
            
            // Get the compass heading
            let heading = event.alpha;
            
            // For iOS, we might need to adjust the heading
            if (event.webkitCompassHeading) {
                heading = event.webkitCompassHeading;
            }
            
            // Compensate for screen orientation
            heading = this.compensateForOrientation(heading);
            
            // Apply calibration if available
            const orientationCalibration = this.baseCalibration[this.currentOrientationKey];
            if (this.absoluteNorthReference !== null && orientationCalibration !== null) {
                heading = heading - this.absoluteNorthReference - orientationCalibration;
                heading = this.normalizeAngle(heading);
            }
            
            // Collect calibration data
            if (this.calibrationCount > 0 && this.calibrationReadings.length < 200) {
                this.calibrationReadings.push(heading);
            }
            
            // Only update if change is significant enough
            const diff = Math.abs(heading - this.targetHeading);
            const normalizedDiff = Math.min(diff, 360 - diff);
            
            if (normalizedDiff > this.minimumChange) {
                this.targetHeading = heading;
            }
        }
    }

    compensateForOrientation(heading) {
        let orientationAngle = 0;
        
        if (screen.orientation) {
            orientationAngle = screen.orientation.angle;
        } else if (window.orientation !== undefined) {
            orientationAngle = window.orientation;
        }
        
        this.currentOrientationKey = this.getOrientationKey(orientationAngle);
        
        // Basic orientation compensation
        let compensatedHeading = heading;
        
        switch (orientationAngle) {
            case 0:   // Portrait
                compensatedHeading = heading;
                break;
            case 90:  // Landscape left
                compensatedHeading = heading - 90;
                break;
            case 180: // Portrait upside down
                compensatedHeading = heading - 180;
                break;
            case -90: // Landscape right
            case 270:
                compensatedHeading = heading + 90;
                break;
        }
        
        return this.normalizeAngle(compensatedHeading);
    }

    getOrientationKey(angle) {
        switch (angle) {
            case 0: return 'portrait';
            case 90: return 'landscapeLeft';
            case 180: return 'portraitUpsideDown';
            case -90:
            case 270: return 'landscapeRight';
            default: return 'portrait';
        }
    }

    handleOrientationChange() {
        const newOrientation = screen.orientation ? screen.orientation.angle : (window.orientation || 0);
        const newOrientationKey = this.getOrientationKey(newOrientation);
        
        if (newOrientationKey !== this.currentOrientationKey) {
            this.screenOrientation = newOrientation;
            this.currentOrientationKey = newOrientationKey;
            
            const orientationName = this.getOrientationName();
            this.updateCompassStatus(`Orientasi: ${orientationName}`);
            
            // Check if we need calibration for this orientation
            if (this.baseCalibration[newOrientationKey] === null && this.shouldCalibrateOnOrientationChange) {
                setTimeout(() => {
                    this.updateCompassStatus(`Perlu kalibrasi untuk ${orientationName}`);
                    setTimeout(() => this.startCalibration(), 1000);
                }, 500);
            }
        }
    }

    getOrientationName() {
        const angle = screen.orientation ? screen.orientation.angle : (window.orientation || 0);
        switch (angle) {
            case 0: return 'Portrait';
            case 90: return 'Landscape Kiri';
            case 180: return 'Portrait Terbalik';
            case -90:
            case 270: return 'Landscape Kanan';
            default: return `${angle}°`;
        }
    }

    startCalibration() {
        const orientationName = this.getOrientationName();
        this.updateCompassStatus(`Kalibrasi ${orientationName}...`);
        this.calibrationCount = 0;
        this.calibrationReadings = [];
        this.isCalibrated = false;
        
        // Collect readings for calibration
        const calibrationInterval = setInterval(() => {
            this.calibrationCount++;
            
            if (this.calibrationCount >= 100) { // 5 seconds at ~20 FPS
                clearInterval(calibrationInterval);
                this.finishCalibration();
            }
        }, 50);
    }

    finishCalibration() {
        if (this.calibrationReadings.length > 20) {
            // Process calibration readings
            this.calibrationReadings.sort((a, b) => a - b);
            const median = this.calibrationReadings[Math.floor(this.calibrationReadings.length / 2)];
            const filteredReadings = this.calibrationReadings.filter(reading => 
                Math.abs(reading - median) < 30
            );
            
            if (filteredReadings.length > 10) {
                const avgReading = filteredReadings.reduce((a, b) => a + b, 0) / filteredReadings.length;
                
                // Set absolute north reference if this is first calibration
                if (this.absoluteNorthReference === null) {
                    this.absoluteNorthReference = avgReading;
                }
                
                // Store calibration for current orientation
                this.baseCalibration[this.currentOrientationKey] = avgReading - this.absoluteNorthReference;
                
                this.isCalibrated = true;
                const orientationName = this.getOrientationName();
                this.updateCompassStatus(`Kompas siap (${orientationName})`);
                this.shouldCalibrateOnOrientationChange = true;
                
                this.showNotification('Kalibrasi berhasil', 'success');
            } else {
                this.updateCompassStatus('Kalibrasi gagal - terlalu banyak noise');
                this.showNotification('Kalibrasi gagal', 'error');
            }
        } else {
            this.updateCompassStatus('Kalibrasi gagal - data tidak cukup');
            this.showNotification('Kalibrasi gagal', 'error');
        }
    }

    resetAllCalibration() {
        // Reset all calibration data
        this.absoluteNorthReference = null;
        this.baseCalibration = {
            portrait: null,
            landscapeLeft: null,
            portraitUpsideDown: null,
            landscapeRight: null
        };
        this.isCalibrated = false;
        this.calibrationReadings = [];
        this.calibrationCount = 0;
        this.shouldCalibrateOnOrientationChange = false;
        
        this.updateCompassStatus('Kalibrasi direset - mulai kalibrasi baru');
        
        // Auto-start calibration
        setTimeout(() => {
            this.startCalibration();
        }, 1000);
    }

    updateCompassVisual() {
        if (this.qiblaDirection === 0) return;
        
        // Calculate the relative direction to Qibla
        const relativeDirection = this.qiblaDirection - this.currentHeading;
        
        // Update needle rotation with smooth transition
        if (this.qiblaNeedle) {
            this.qiblaNeedle.style.transform = `translate(-50%, -50%) rotate(${relativeDirection}deg)`;
        }
    }

    updateLocationDisplay() {
        if (this.userLat && this.userLon) {
            if (this.userLatEl) {
                this.userLatEl.textContent = `${this.userLat.toFixed(4)}° ${this.userLat >= 0 ? 'N' : 'S'}`;
            }
            if (this.userLonEl) {
                this.userLonEl.textContent = `${Math.abs(this.userLon).toFixed(4)}° ${this.userLon >= 0 ? 'E' : 'W'}`;
            }
        }
    }

    updateDirectionDisplay() {
        const direction = Math.round(this.qiblaDirection);
        
        if (this.directionValueEl) {
            this.directionValueEl.textContent = direction + '°';
        }
        
        if (this.qiblaDirectionEl) {
            this.qiblaDirectionEl.textContent = direction + '°';
        }
        
        // Update direction text
        const directionText = this.getDirectionText(direction);
        if (this.directionTextEl) {
            this.directionTextEl.textContent = directionText;
        }
    }

    updateDistanceDisplay(distance) {
        const formattedDistance = distance.toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        if (this.distanceValueEl) {
            this.distanceValueEl.textContent = formattedDistance;
        }
    }

    getDirectionText(degrees) {
        const directions = [
            'Utara', 'Timur Laut', 'Timur', 'Tenggara',
            'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'
        ];
        
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    }

    updateLocationStatus(message) {
        if (this.locationStatus) {
            this.locationStatus.textContent = message;
        }
    }

    updateCompassStatus(message) {
        if (this.compassStatus) {
            this.compassStatus.textContent = message;
        }
    }

    showLoading(show) {
        if (this.loadingOverlay) {
            if (show) {
                this.loadingOverlay.classList.add('show');
            } else {
                this.loadingOverlay.classList.remove('show');
            }
        }
        
        if (this.getLocationBtn) {
            this.getLocationBtn.disabled = show;
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Use the main app's notification manager
        if (window.app && window.app.notificationManager) {
            window.app.notificationManager.show(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // Utility functions
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    normalizeAngle(angle) {
        return ((angle % 360) + 360) % 360;
    }

    renderError() {
        this.container.innerHTML = `
            <div class="component-error">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Gagal Memuat Qibla Finder</h3>
                <p>Terjadi kesalahan saat memuat kompas. Silakan coba lagi.</p>
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
        // Clean up event listeners
        this.stopWatchingOrientation();
        
        console.log('🧭 Qibla Component destroyed');
    }
}