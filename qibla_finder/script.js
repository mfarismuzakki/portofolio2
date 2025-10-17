// Qibla Finder Application
class QiblaFinder {
    constructor() {
        // Kaaba coordinates
        this.kaabaLat = 21.4225;
        this.kaabaLon = 39.8262;
        
        // Current user location
        this.userLat = null;
        this.userLon = null;
        
        // DOM elements
        this.compass = document.getElementById('compass');
        this.qiblaNeedle = document.getElementById('qiblaNeedle');
        this.getLocationBtn = document.getElementById('getLocationBtn');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.locationStatus = document.getElementById('locationStatus');
        this.compassStatus = document.getElementById('compassStatus');
        
        // Info elements
        this.userLatEl = document.getElementById('userLat');
        this.userLonEl = document.getElementById('userLon');
        this.distanceValueEl = document.getElementById('distanceValue');
        this.directionValueEl = document.getElementById('directionValue');
        this.directionTextEl = document.getElementById('directionText');
        this.qiblaDirectionEl = document.getElementById('qiblaDirection');
        
        // Compass and orientation with smoothing
        this.currentHeading = 0;
        this.targetHeading = 0;
        this.qiblaDirection = 0;
        this.watchId = null;
        this.lastUpdateTime = 0;
        this.isAnimating = false;
        
        // Smoothing parameters
        this.smoothingFactor = 0.8; // Higher = more smoothing
        this.minimumChange = 2; // Minimum degrees to trigger update
        this.maxChangePerFrame = 5; // Maximum degrees change per animation frame
        
        // Calibration
        this.calibrationCount = 0;
        this.calibrationReadings = [];
        this.isCalibrated = false;
        
        // Stability tracking
        this.lastStableHeading = null;
        this.stableReadingCount = 0;
        
        this.init();
    }
    
    init() {
        this.createDegreeMarks();
        this.setupEventListeners();
        this.checkGeolocationSupport();
        this.setupDeviceOrientation();
        this.startSmoothAnimation();
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
    
    createDegreeMarks() {
        const degreeMarks = document.querySelector('.degree-marks');
        
        for (let i = 0; i < 360; i += 10) {
            const mark = document.createElement('div');
            mark.className = i % 30 === 0 ? 'degree-mark major' : 'degree-mark';
            mark.style.transform = `rotate(${i}deg)`;
            degreeMarks.appendChild(mark);
        }
    }
    
    setupEventListeners() {
        this.getLocationBtn.addEventListener('click', () => {
            this.getCurrentLocation();
        });
        
        // Handle visibility change to manage device orientation
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopWatchingOrientation();
            } else if (this.userLat && this.userLon) {
                this.setupDeviceOrientation();
            }
        });
    }
    
    checkGeolocationSupport() {
        if (!navigator.geolocation) {
            this.showError('Geolocation tidak didukung oleh browser Anda');
            this.getLocationBtn.disabled = true;
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
        this.updateCompass();
        
        // Start watching device orientation
        this.setupDeviceOrientation();
        
        // Start calibration process
        this.startCalibration();
    }
    
    startCalibration() {
        this.updateCompassStatus('Mengkalibrasi kompas...');
        this.calibrationCount = 0;
        this.calibrationReadings = [];
        
        // Collect readings for 3 seconds
        const calibrationInterval = setInterval(() => {
            this.calibrationCount++;
            
            if (this.calibrationCount >= 60) { // 3 seconds at ~20 FPS
                clearInterval(calibrationInterval);
                this.finishCalibration();
            }
        }, 50);
    }
    
    finishCalibration() {
        if (this.calibrationReadings.length > 10) {
            // Remove outliers (values that differ more than 30° from median)
            this.calibrationReadings.sort((a, b) => a - b);
            const median = this.calibrationReadings[Math.floor(this.calibrationReadings.length / 2)];
            this.calibrationReadings = this.calibrationReadings.filter(reading => 
                Math.abs(reading - median) < 30
            );
            
            this.isCalibrated = true;
            this.updateCompassStatus('Kompas terkalibrasi dan siap');
        } else {
            this.updateCompassStatus('Kalibrasi gagal - gerakan perangkat dalam pola ∞');
        }
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
        this.showError(errorMessage);
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
        window.addEventListener('deviceorientationabsolute', this.handleOrientation.bind(this));
        window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
        this.updateCompassStatus('Kompas aktif');
    }
    
    stopWatchingOrientation() {
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
            
            // Apply calibration if available
            if (this.isCalibrated && this.calibrationReadings.length > 0) {
                const avgCalibration = this.calibrationReadings.reduce((a, b) => a + b, 0) / this.calibrationReadings.length;
                heading = (heading - avgCalibration + 360) % 360;
            }
            
            // Collect calibration data
            if (this.calibrationCount > 0 && this.calibrationReadings.length < 100) {
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
    
    updateCompassVisual() {
        if (this.qiblaDirection === 0) return;
        
        // Calculate the relative direction to Qibla
        const relativeDirection = this.qiblaDirection - this.currentHeading;
        
        // Update needle rotation with smooth transition
        this.qiblaNeedle.style.transform = `translate(-50%, -50%) rotate(${relativeDirection}deg)`;
    }
    
    updateCompass() {
        this.updateCompassVisual();
    }
    
    updateLocationDisplay() {
        if (this.userLat && this.userLon) {
            this.userLatEl.textContent = `${this.userLat.toFixed(4)}° ${this.userLat >= 0 ? 'N' : 'S'}`;
            this.userLonEl.textContent = `${Math.abs(this.userLon).toFixed(4)}° ${this.userLon >= 0 ? 'E' : 'W'}`;
        }
    }
    
    updateDirectionDisplay() {
        const direction = Math.round(this.qiblaDirection);
        this.directionValueEl.textContent = direction;
        this.qiblaDirectionEl.textContent = direction + '°';
        
        // Update direction text
        const directionText = this.getDirectionText(direction);
        this.directionTextEl.textContent = directionText;
    }
    
    updateDistanceDisplay(distance) {
        const formattedDistance = distance.toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        this.distanceValueEl.textContent = formattedDistance;
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
        this.locationStatus.textContent = message;
    }
    
    updateCompassStatus(message) {
        this.compassStatus.textContent = message;
    }
    
    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.add('show');
            this.getLocationBtn.disabled = true;
        } else {
            this.loadingOverlay.classList.remove('show');
            this.getLocationBtn.disabled = false;
        }
    }
    
    showError(message) {
        // Create error element
        const errorEl = document.createElement('div');
        errorEl.className = 'error-state';
        errorEl.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        `;
        
        // Insert after status card
        const statusCard = document.querySelector('.status-card');
        statusCard.parentNode.insertBefore(errorEl, statusCard.nextSibling);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorEl.parentNode) {
                errorEl.parentNode.removeChild(errorEl);
            }
        }, 5000);
    }
    
    showSuccess(message) {
        // Create success element
        const successEl = document.createElement('div');
        successEl.className = 'success-state';
        successEl.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        `;
        
        // Insert after status card
        const statusCard = document.querySelector('.status-card');
        statusCard.parentNode.insertBefore(successEl, statusCard.nextSibling);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (successEl.parentNode) {
                successEl.parentNode.removeChild(successEl);
            }
        }, 3000);
    }
    
    // Utility functions
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    toDegrees(radians) {
        return radians * (180 / Math.PI);
    }
    
    // Normalize angle to 0-360 range
    normalizeAngle(angle) {
        return ((angle % 360) + 360) % 360;
    }
    
    // Calculate shortest angular distance between two angles
    angularDistance(a1, a2) {
        const diff = Math.abs(a1 - a2);
        return Math.min(diff, 360 - diff);
    }
    
    // Add stability check for consistent readings
    isStableReading(newHeading) {
        if (!this.lastStableHeading) {
            this.lastStableHeading = newHeading;
            this.stableReadingCount = 1;
            return false;
        }
        
        if (this.angularDistance(newHeading, this.lastStableHeading) < this.minimumChange) {
            this.stableReadingCount++;
            return this.stableReadingCount >= 5; // Require 5 consistent readings
        } else {
            this.lastStableHeading = newHeading;
            this.stableReadingCount = 1;
            return false;
        }
    }
}

// Additional utility functions for enhanced functionality
class QiblaUtils {
    static formatCoordinate(value, type) {
        const abs = Math.abs(value);
        const direction = type === 'lat' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W');
        return `${abs.toFixed(4)}° ${direction}`;
    }
    
    static formatDistance(km) {
        if (km < 1) {
            return `${Math.round(km * 1000)} m`;
        }
        return `${km.toLocaleString('id-ID', { maximumFractionDigits: 0 })} km`;
    }
    
    static getQiblaAccuracy(distance) {
        if (distance < 1000) return 'Sangat Tinggi';
        if (distance < 5000) return 'Tinggi';
        if (distance < 10000) return 'Sedang';
        return 'Rendah';
    }
    
    static getBearingFromCoordinates(lat1, lon1, lat2, lon2) {
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const lat1Rad = lat1 * Math.PI / 180;
        const lat2Rad = lat2 * Math.PI / 180;
        
        const y = Math.sin(dLon) * Math.cos(lat2Rad);
        const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
                  Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
        
        let bearing = Math.atan2(y, x) * 180 / Math.PI;
        return (bearing + 360) % 360;
    }
    
    static getDistanceFromCoordinates(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}

// Performance monitoring and error handling
class QiblaPerformanceMonitor {
    constructor() {
        this.startTime = performance.now();
        this.locationRequests = 0;
        this.orientationUpdates = 0;
    }
    
    logLocationRequest() {
        this.locationRequests++;
        console.log(`Location requests: ${this.locationRequests}`);
    }
    
    logOrientationUpdate() {
        this.orientationUpdates++;
        if (this.orientationUpdates % 100 === 0) {
            console.log(`Orientation updates: ${this.orientationUpdates}`);
        }
    }
    
    getUptime() {
        return Math.round((performance.now() - this.startTime) / 1000);
    }
}

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/qibla_finder/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Qibla Finder
    const qiblaFinder = new QiblaFinder();
    
    // Initialize performance monitor
    const performanceMonitor = new QiblaPerformanceMonitor();
    
    // Add some enhanced features
    addEnhancedFeatures();
    
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        
        // Show user-friendly error message
        const errorNotification = document.createElement('div');
        errorNotification.className = 'error-state';
        errorNotification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>Terjadi kesalahan aplikasi. Silakan refresh halaman.</p>
        `;
        
        document.body.appendChild(errorNotification);
        
        setTimeout(() => {
            if (errorNotification.parentNode) {
                errorNotification.parentNode.removeChild(errorNotification);
            }
        }, 5000);
    });
    
    console.log('🧭 Qibla Finder initialized successfully');
});

// Enhanced features
function addEnhancedFeatures() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.key === 'l' || event.key === 'L') {
            document.getElementById('getLocationBtn').click();
        }
    });
    
    // Add touch gestures for mobile
    if ('ontouchstart' in window) {
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (event) => {
            touchStartY = event.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (event) => {
            const touchEndY = event.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            // Swipe up to get location
            if (diff > 50) {
                document.getElementById('getLocationBtn').click();
            }
        });
    }
    
    // Add compass calibration notification
    if (window.DeviceOrientationEvent) {
        let calibrationShown = false;
        
        setTimeout(() => {
            if (!calibrationShown) {
                showCalibrationTip();
                calibrationShown = true;
            }
        }, 3000);
    }
}

function showCalibrationTip() {
    const tip = document.createElement('div');
    tip.className = 'card';
    tip.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1001;
        max-width: 350px;
        text-align: center;
        background: var(--surface);
        backdrop-filter: blur(20px);
        border: 2px solid var(--primary-cyan);
        animation: fadeInScale 0.5s ease;
    `;
    
    tip.innerHTML = `
        <div style="margin-bottom: 15px;">
            <i class="fas fa-mobile-alt" style="font-size: 2rem; color: var(--primary-cyan);"></i>
        </div>
        <h3 style="color: var(--primary-cyan); margin-bottom: 10px;">Kalibrasi Kompas</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">
            Untuk akurasi maksimal, gerakkan perangkat dalam pola angka 8 beberapa kali.
        </p>
        <button onclick="this.parentElement.remove()" style="
            background: var(--gradient-primary);
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            font-family: var(--font-secondary);
        ">Mengerti</button>
    `;
    
    document.body.appendChild(tip);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        if (tip.parentNode) {
            tip.remove();
        }
    }, 10000);
}

// Add CSS animation for the calibration tip
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(style);