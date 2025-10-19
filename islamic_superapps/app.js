/**
 * Islamic SuperApps - Main Application Controller
 * Menggabungkan semua aplikasi Islam dalam satu platform
 */

class IslamicSuperApps {
    constructor() {
        this.currentApp = 'home';
        this.components = new Map();
        this.sharedData = {
            location: null,
            prayerTimes: null,
            settings: {}
        };
        this.eventBus = new EventTarget();
        this.storageManager = new StorageManager();
        this.notificationManager = new NotificationManager();
        
        this.init();
    }

    async init() {
        console.log('🌟 Initializing IslamHub...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize storage
        await this.storageManager.init();
        
        // Load shared settings
        await this.loadSharedSettings();
        
        // Setup navigation
        this.setupNavigation();
        
        // Load home component and setup click handlers
        this.setupLandingPage();
        await this.loadComponent('home');
        
        // Setup install prompt
        this.setupInstallPrompt();
        
        // Hide loading overlay
        this.hideLoadingOverlay();
        
        // Enable test mode if in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.enableTestMode();
        }
        
        console.log('✅ IslamHub initialized successfully');
    }

    setupEventListeners() {
        // Navigation events
        document.querySelectorAll('.nav-tab, .bottom-nav-item').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const appName = e.currentTarget.dataset.app;
                this.switchApp(appName);
            });
        });

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                document.querySelector('.nav-tabs').classList.toggle('mobile-open');
            });
        }

        // Swipe gestures for mobile
        this.setupSwipeGestures();

        // Cross-component communication
        this.eventBus.addEventListener('prayerTime', (e) => {
            this.handlePrayerTimeUpdate(e.detail);
        });

        this.eventBus.addEventListener('locationUpdate', (e) => {
            this.handleLocationUpdate(e.detail);
        });

        // Initialize floating widget for mobile
        this.initializeFloatingWidget();
        
        // Test floating widget with dummy data (for development)
        setTimeout(() => {
            this.testFloatingWidget();
        }, 3000);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                const keyMap = {
                    '0': 'home',
                    '1': 'adzan',
                    '2': 'dzikir',
                    '3': 'kalkulator',
                    '4': 'qibla',
                    '5': 'tata-cara',
                    '9': 'test'
                };
                
                if (keyMap[e.key]) {
                    e.preventDefault();
                    this.switchApp(keyMap[e.key]);
                }
            }
        });

        // Window events
        window.addEventListener('online', () => {
            this.notificationManager.show('Koneksi internet tersambung kembali', 'success');
        });

        window.addEventListener('offline', () => {
            this.notificationManager.show('Mode offline - data tersimpan lokal', 'info');
        });
    }

    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only process horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                const apps = ['home', 'adzan', 'dzikir', 'kalkulator', 'qibla', 'tata-cara', 'test'];
                const currentIndex = apps.indexOf(this.currentApp);
                
                if (diffX > 0 && currentIndex < apps.length - 1) {
                    // Swipe left - next app
                    this.switchApp(apps[currentIndex + 1]);
                } else if (diffX < 0 && currentIndex > 0) {
                    // Swipe right - previous app
                    this.switchApp(apps[currentIndex - 1]);
                }
            }
            
            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    setupNavigation() {
        // Set active states
        this.updateNavigationState();
        
        // Update floating prayer widget
        this.updateFloatingWidget();
    }

    async switchApp(appName) {
        if (this.currentApp === appName) return;
        
        console.log(`🔄 Switching to ${appName} app`);
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update navigation states
        document.querySelectorAll('.nav-tab, .bottom-nav-item').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.app === appName) {
                tab.classList.add('active');
            }
        });
        
        // Hide current component
        const currentComponent = document.getElementById(`${this.currentApp}-app`);
        if (currentComponent) {
            currentComponent.classList.remove('active');
        }
        
        // Load and show new component
        await this.loadComponent(appName);
        
        const newComponent = document.getElementById(`${appName}-app`);
        if (newComponent) {
            newComponent.classList.add('active');
        }
        
        this.currentApp = appName;
        
        // Update floating widget visibility
        this.updateFloatingWidgetVisibility();
        
        // Track usage
        this.trackUsage(appName);
        
        // Update page title
        this.updatePageTitle(appName);
    }

    setupLandingPage() {
        // Setup click handlers for app cards in landing page (both old and new styles)
        document.addEventListener('click', (e) => {
            // Handle new compact cards
            const appCardSmall = e.target.closest('.app-card-small');
            if (appCardSmall && !appCardSmall.classList.contains('disabled')) {
                const appName = appCardSmall.dataset.app;
                if (appName) {
                    this.switchApp(appName);
                }
                return;
            }
            
            // Handle old large cards (fallback)
            const appCard = e.target.closest('.app-card');
            if (appCard) {
                const appName = appCard.dataset.app;
                if (appName) {
                    this.switchApp(appName);
                }
            }
        });
    }

    enableTestMode() {
        const testTab = document.querySelector('[data-app="test"]');
        if (testTab) {
            testTab.style.display = 'flex';
            console.log('🧪 Test mode enabled - Alt+9 untuk Test Component');
        }
    }

    async loadComponent(appName) {
        // Home tidak perlu loading component, sudah ada di HTML
        if (appName === 'home') {
            this.components.set('home', { type: 'static' });
            return this.components.get('home');
        }

        if (this.components.has(appName)) {
            // Component already loaded
            return this.components.get(appName);
        }
        
        try {
            const componentContainer = document.getElementById(`${appName}-app`);
            if (!componentContainer) {
                throw new Error(`Container for ${appName} not found`);
            }
            
            // Show loading state
            componentContainer.innerHTML = `
                <div class="component-loading">
                    <div class="loading-spinner small">
                        <div class="spinner-ring"></div>
                    </div>
                    <p>Memuat ${this.getAppDisplayName(appName)}...</p>
                </div>
            `;
            
            // Dynamic import component dengan path yang benar
            let componentPath = `./components/${appName}-component.js`;
            if (appName === 'kalkulator') {
                componentPath = './components/waris-component.js';
            } else if (appName === 'tata-cara') {
                componentPath = './components/sholat-component.js';
            }
            
            console.log(`📦 Loading component from: ${componentPath}`);
            
            const module = await import(componentPath);
            const ComponentClass = module.default || module[Object.keys(module)[0]];
            
            if (!ComponentClass) {
                throw new Error(`Component class not found in ${componentPath}`);
            }
            
            // Initialize component
            const component = new ComponentClass({
                container: componentContainer,
                eventBus: this.eventBus,
                sharedData: this.sharedData,
                storageManager: this.storageManager
            });
            
            await component.init();
            
            this.components.set(appName, component);
            
            console.log(`✅ Component ${appName} loaded successfully`);
            return component;
            
        } catch (error) {
            console.error(`❌ Failed to load component ${appName}:`, error);
            
            // Show error state dengan link eksternal jika ada
            const componentContainer = document.getElementById(`${appName}-app`);
            const externalLinks = {
                'adzan': '../adzan_realtime/',
                'dzikir': '../dzikir_doa/',
                'kalkulator': '../kalkulator_waris/',
                'qibla': '../qibla_finder/',
                'tata-cara': '../tata_cara_sholat/'
            };
            
            const externalLink = externalLinks[appName];
            
            componentContainer.innerHTML = `
                <div class="component-loading">
                    <div style="color: #ff4757; margin-bottom: 15px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 24px;"></i>
                    </div>
                    <p>Gagal memuat ${this.getAppDisplayName(appName)}</p>
                    <div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                        <button onclick="app.loadComponent('${appName}')" 
                                style="padding: 8px 16px; background: var(--gradient-primary); 
                                       border: none; border-radius: 8px; color: var(--dark-bg); cursor: pointer;">
                            Coba Lagi
                        </button>
                        ${externalLink ? `
                            <a href="${externalLink}" 
                               style="padding: 8px 16px; background: var(--gradient-secondary); 
                                      border: none; border-radius: 8px; color: var(--dark-bg); 
                                      text-decoration: none; display: inline-block;">
                                Buka Aplikasi Terpisah
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    }

    getAppDisplayName(appName) {
        const names = {
            'home': 'Beranda',
            'adzan': 'Jadwal Adzan',
            'dzikir': 'Dzikir & Doa',
            'kalkulator': 'Kalkulator Waris',
            'qibla': 'Qibla Finder',
            'tata-cara': 'Tata Cara Sholat',
            'test': 'Test Component'
        };
        return names[appName] || appName;
    }

    updateNavigationState() {
        document.querySelectorAll('.nav-tab, .bottom-nav-item').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.app === this.currentApp) {
                tab.classList.add('active');
            }
        });
    }

    updatePageTitle(appName) {
        const titles = {
            'home': 'IslamHub - Aplikasi Islam Terpadu',
            'adzan': 'Jadwal Adzan - IslamHub',
            'dzikir': 'Dzikir & Doa - IslamHub',
            'kalkulator': 'Kalkulator Waris - IslamHub',
            'qibla': 'Qibla Finder - IslamHub',
            'tata-cara': 'Tata Cara Sholat - IslamHub',
            'test': 'Test - IslamHub'
        };
        document.title = titles[appName] || 'IslamHub';
    }

    async loadSharedSettings() {
        try {
            this.sharedData.settings = await this.storageManager.getSettings() || {};
            this.sharedData.location = await this.storageManager.getLocation();
            
            console.log('📱 Shared settings loaded:', this.sharedData.settings);
        } catch (error) {
            console.error('❌ Failed to load shared settings:', error);
        }
    }

    async saveSharedSettings() {
        try {
            await this.storageManager.saveSettings(this.sharedData.settings);
            console.log('💾 Shared settings saved');
        } catch (error) {
            console.error('❌ Failed to save shared settings:', error);
        }
    }

    handlePrayerTimeUpdate(prayerData) {
        this.sharedData.prayerTimes = prayerData;
        this.updateFloatingWidget();
        
        // Notify other components
        this.eventBus.dispatchEvent(new CustomEvent('sharedPrayerUpdate', {
            detail: prayerData
        }));
    }

    handleLocationUpdate(locationData) {
        this.sharedData.location = locationData;
        this.storageManager.saveLocation(locationData);
        
        // Notify components that depend on location
        this.eventBus.dispatchEvent(new CustomEvent('sharedLocationUpdate', {
            detail: locationData
        }));
    }

    updateFloatingWidget() {
        const widget = document.getElementById('floatingPrayerWidget');
        if (!widget) return;
        
        // Hanya tampilkan widget di home dan adzan
        if (this.currentApp !== 'home' && this.currentApp !== 'adzan') {
            widget.style.display = 'none';
            return;
        }
        
        if (!this.sharedData.prayerTimes) {
            widget.style.display = 'none';
            return;
        }
        
        const { nextPrayer, countdown } = this.sharedData.prayerTimes;
        
        if (nextPrayer && countdown) {
            const prayerNameEl = widget.querySelector('.widget-prayer-name');
            const countdownEl = widget.querySelector('.widget-countdown');
            
            if (prayerNameEl) prayerNameEl.textContent = nextPrayer.name || 'Sholat Berikutnya';
            if (countdownEl) countdownEl.textContent = countdown;
            
            widget.style.display = 'block';
        } else {
            widget.style.display = 'none';
        }
    }
    
    updateFloatingWidgetVisibility() {
        // Update widget visibility based on current app
        if (this.currentApp === 'home' || this.currentApp === 'adzan') {
            this.updateFloatingWidget();
        } else {
            this.hideFloatingWidget();
        }
    }

    // Floating Widget Management Methods
    initializeFloatingWidget() {
        this.floatingWidget = document.getElementById('floatingPrayerWidget');
        this.widgetPrayerName = document.getElementById('widgetPrayerName');
        this.widgetCountdown = document.getElementById('widgetCountdown');
        this.isWidgetVisible = false;
        this.lastWidgetUpdate = 0;
        this.nextPrayerData = null;
        
        // Widget visibility cooldowns
        this.SHOW_COOLDOWN = 2000; // 2 seconds
        this.lastShowTime = 0;
        this.lastHideTime = 0;
        
        if (!this.floatingWidget) {
            console.warn('⚠️ Floating widget element not found');
            return;
        }
        
        // Add click handler for floating widget
        this.floatingWidget.addEventListener('click', () => {
            console.log('🔄 Widget clicked - switching to adzan');
            this.switchApp('adzan');
        });
        
        console.log('✅ Floating widget initialized', {
            widget: !!this.floatingWidget,
            prayerName: !!this.widgetPrayerName,
            countdown: !!this.widgetCountdown
        });
    }

    updateFloatingWidget() {
        console.log('🔄 Updating floating widget', {
            currentApp: this.currentApp,
            hasWidget: !!this.floatingWidget,
            hasData: !!this.nextPrayerData,
            nextPrayerData: this.nextPrayerData
        });

        if (!this.floatingWidget || !this.widgetPrayerName || !this.widgetCountdown) {
            console.warn('⚠️ Widget elements missing:', {
                widget: !!this.floatingWidget,
                prayerName: !!this.widgetPrayerName,
                countdown: !!this.widgetCountdown
            });
            return;
        }

        // Only show widget on home and adzan pages
        if (this.currentApp !== 'home' && this.currentApp !== 'adzan') {
            console.log('📱 Hiding widget - wrong page:', this.currentApp);
            this.hideFloatingWidget();
            return;
        }

        // Update widget content if we have prayer data
        if (this.nextPrayerData) {
            this.widgetPrayerName.textContent = this.nextPrayerData.name || 'Sholat Berikutnya';
            
            // Always show countdown if available, otherwise show time
            if (this.nextPrayerData.countdown) {
                this.widgetCountdown.textContent = this.nextPrayerData.countdown;
            } else if (this.nextPrayerData.time) {
                // Calculate countdown from time
                this.calculateAndShowCountdown(this.nextPrayerData.time);
            } else {
                this.widgetCountdown.textContent = '--:--:--';
            }
            
            console.log('📱 Widget content updated:', {
                name: this.nextPrayerData.name,
                time: this.nextPrayerData.time,
                countdown: this.nextPrayerData.countdown
            });
            
            // Show widget if we have valid data and are on correct page
            if (this.currentApp === 'home' || this.currentApp === 'adzan') {
                this.showFloatingWidget();
            }
        } else {
            console.log('📱 No prayer data - hiding widget');
            // Hide widget if no prayer data
            this.hideFloatingWidget();
        }
    }
    
    calculateAndShowCountdown(targetTime) {
        // Parse target time (HH:MM format)
        if (!targetTime || !targetTime.includes(':')) {
            this.widgetCountdown.textContent = '--:--:--';
            return;
        }
        
        const [hours, minutes] = targetTime.split(':').map(Number);
        const now = new Date();
        const target = new Date();
        target.setHours(hours, minutes, 0, 0);
        
        // If target is in the past, it's tomorrow
        if (target < now) {
            target.setDate(target.getDate() + 1);
        }
        
        const diff = target - now;
        
        if (diff < 0) {
            this.widgetCountdown.textContent = '--:--:--';
            return;
        }
        
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        
        this.widgetCountdown.textContent = 
            `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        
        // Update countdown every second
        if (!this.widgetCountdownTimer) {
            this.widgetCountdownTimer = setInterval(() => {
                if (this.nextPrayerData && this.nextPrayerData.time) {
                    this.calculateAndShowCountdown(this.nextPrayerData.time);
                }
            }, 1000);
        }
    }

    showFloatingWidget() {
        const now = Date.now();
        
        // Prevent rapid show/hide cycles
        if (now - this.lastHideTime < this.SHOW_COOLDOWN) {
            console.log('📱 Show widget blocked - cooldown active');
            return;
        }
        
        if (!this.isWidgetVisible && this.floatingWidget) {
            this.isWidgetVisible = true;
            this.lastShowTime = now;
            
            console.log('📱 Showing floating widget');
            this.floatingWidget.style.display = 'block';
            
            // Ensure stable transition
            setTimeout(() => {
                if (this.isWidgetVisible) { // Double-check state hasn't changed
                    this.floatingWidget.classList.add('visible');
                    console.log('📱 Widget animation started');
                }
            }, 50);
        }
    }

    hideFloatingWidget() {
        const now = Date.now();
        
        // Prevent rapid show/hide cycles
        if (now - this.lastShowTime < this.SHOW_COOLDOWN) {
            return;
        }
        
        if (this.isWidgetVisible && this.floatingWidget) {
            this.isWidgetVisible = false;
            this.lastHideTime = now;
            
            this.floatingWidget.classList.remove('visible');
            
            // Hide after animation completes
            setTimeout(() => {
                if (!this.isWidgetVisible) { // Double-check state hasn't changed
                    this.floatingWidget.style.display = 'none';
                }
            }, 400);
        }
    }

    handlePrayerTimeUpdate(prayerData) {
        console.log('🕌 Prayer time update received:', prayerData);
        
        // Store prayer data for widget
        if (prayerData && prayerData.nextPrayer) {
            this.nextPrayerData = {
                name: prayerData.nextPrayer.name,
                time: prayerData.nextPrayer.time,
                countdown: prayerData.countdown,
                prayer: prayerData.nextPrayer.prayer
            };
        } else if (prayerData && prayerData.times) {
            // Fallback - extract next prayer from times
            this.nextPrayerData = this.calculateNextPrayer(prayerData.times);
        }
        
        // Update widget display
        this.updateFloatingWidget();
    }

    calculateNextPrayer(times) {
        if (!times) return null;
        
        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;
        
        const prayers = [
            { key: 'fajr', name: 'Subuh', time: times.fajr },
            { key: 'dhuhr', name: 'Dzuhur', time: times.dhuhr },
            { key: 'asr', name: 'Ashar', time: times.asr },
            { key: 'maghrib', name: 'Maghrib', time: times.maghrib },
            { key: 'isha', name: 'Isya', time: times.isha }
        ];
        
        // Find next prayer
        for (const prayer of prayers) {
            if (prayer.time && prayer.time > currentHour) {
                return {
                    name: prayer.name,
                    time: this.formatTime(prayer.time),
                    prayer: prayer.key
                };
            }
        }
        
        // If no prayer today, next is tomorrow's Fajr
        return {
            name: 'Subuh',
            time: times.fajr ? this.formatTime(times.fajr) : '--:--',
            prayer: 'fajr'
        };
    }

    formatTime(timeFloat) {
        if (typeof timeFloat !== 'number') return '--:--';
        const hours = Math.floor(timeFloat);
        const minutes = Math.floor((timeFloat - hours) * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // Test method for floating widget (development only)
    testFloatingWidget() {
        console.log('🧪 Testing floating widget with dummy data');
        this.nextPrayerData = {
            name: 'Dzuhur',
            time: '12:30',
            countdown: '01:45:23',
            prayer: 'dhuhr'
        };
        this.updateFloatingWidget();
    }

    trackUsage(appName) {
        const usage = this.sharedData.settings.usage || {};
        usage[appName] = (usage[appName] || 0) + 1;
        usage.lastUsed = appName;
        usage.lastAccess = new Date().toISOString();
        
        this.sharedData.settings.usage = usage;
        this.saveSharedSettings();
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 1000);
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', async () => {
                try {
                    const registration = await navigator.serviceWorker.register('./sw.js');
                    console.log('🔧 Service Worker registered:', registration);
                    
                    // Listen for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                this.notificationManager.show(
                                    'Update tersedia! Refresh untuk memperbarui aplikasi.',
                                    'info'
                                );
                            }
                        });
                    });
                } catch (error) {
                    console.error('❌ Service Worker registration failed:', error);
                }
            });
        }
    }

    setupInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install prompt after delay
            setTimeout(() => {
                this.showInstallPrompt(deferredPrompt);
            }, 3000);
        });
        
        window.addEventListener('appinstalled', () => {
            this.notificationManager.show('Islamic SuperApps berhasil diinstall!', 'success');
            this.hideInstallPrompt();
            deferredPrompt = null;
        });
    }

    showInstallPrompt(deferredPrompt) {
        const prompt = document.getElementById('installPrompt');
        if (!prompt || !deferredPrompt) return;
        
        prompt.classList.add('show');
        
        document.getElementById('btnInstall').onclick = async () => {
            deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;
            
            if (result.outcome === 'accepted') {
                console.log('✅ User accepted install prompt');
            } else {
                console.log('❌ User dismissed install prompt');
            }
            
            this.hideInstallPrompt();
            deferredPrompt = null;
        };
        
        document.getElementById('btnDismiss').onclick = () => {
            this.hideInstallPrompt();
        };
    }

    hideInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.classList.remove('show');
        }
    }
}

/**
 * Storage Manager - Unified storage for all components
 */
class StorageManager {
    constructor() {
        this.dbName = 'IslamicSuperApps';
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        if (!('indexedDB' in window)) {
            console.warn('⚠️ IndexedDB not supported, falling back to localStorage');
            return;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
                
                if (!db.objectStoreNames.contains('prayerTimes')) {
                    db.createObjectStore('prayerTimes', { keyPath: 'date' });
                }
                
                if (!db.objectStoreNames.contains('cache')) {
                    db.createObjectStore('cache', { keyPath: 'key' });
                }
            };
        });
    }

    async getSettings() {
        try {
            if (this.db) {
                const transaction = this.db.transaction(['settings'], 'readonly');
                const store = transaction.objectStore('settings');
                const request = store.get('userSettings');
                
                return new Promise((resolve) => {
                    request.onsuccess = () => resolve(request.result?.value || {});
                    request.onerror = () => resolve({});
                });
            } else {
                const data = localStorage.getItem('islamicApps_settings');
                return data ? JSON.parse(data) : {};
            }
        } catch (error) {
            console.error('❌ Failed to get settings:', error);
            return {};
        }
    }

    async saveSettings(settings) {
        try {
            if (this.db) {
                const transaction = this.db.transaction(['settings'], 'readwrite');
                const store = transaction.objectStore('settings');
                await store.put({ key: 'userSettings', value: settings });
            } else {
                localStorage.setItem('islamicApps_settings', JSON.stringify(settings));
            }
        } catch (error) {
            console.error('❌ Failed to save settings:', error);
        }
    }

    async getLocation() {
        try {
            if (this.db) {
                const transaction = this.db.transaction(['settings'], 'readonly');
                const store = transaction.objectStore('settings');
                const request = store.get('userLocation');
                
                return new Promise((resolve) => {
                    request.onsuccess = () => resolve(request.result?.value || null);
                    request.onerror = () => resolve(null);
                });
            } else {
                const data = localStorage.getItem('islamicApps_location');
                return data ? JSON.parse(data) : null;
            }
        } catch (error) {
            console.error('❌ Failed to get location:', error);
            return null;
        }
    }

    async saveLocation(location) {
        try {
            if (this.db) {
                const transaction = this.db.transaction(['settings'], 'readwrite');
                const store = transaction.objectStore('settings');
                await store.put({ key: 'userLocation', value: location });
            } else {
                localStorage.setItem('islamicApps_location', JSON.stringify(location));
            }
        } catch (error) {
            console.error('❌ Failed to save location:', error);
        }
    }
}

/**
 * Notification Manager - Unified notifications
 */
class NotificationManager {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.notifications = new Map();
    }

    show(message, type = 'info', duration = 5000) {
        const id = Date.now().toString();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${this.getIcon(type)}"></i>
                <span style="flex: 1;">${message}</span>
                <button onclick="app.notificationManager.hide('${id}')" 
                        style="background: transparent; border: none; color: inherit; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        this.container.appendChild(notification);
        this.notifications.set(id, notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto hide
        if (duration > 0) {
            setTimeout(() => this.hide(id), duration);
        }
        
        return id;
    }

    hide(id) {
        const notification = this.notifications.get(id);
        if (notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
                this.notifications.delete(id);
            }, 300);
        }
    }

    getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize application
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new IslamicSuperApps();
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('❌ Global error:', event.error);
    if (app && app.notificationManager) {
        app.notificationManager.show('Terjadi kesalahan. Silakan refresh halaman.', 'error');
    }
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
    if (app && app.notificationManager) {
        app.notificationManager.show('Terjadi kesalahan jaringan.', 'error');
    }
});

// Export for use in components
window.IslamicSuperApps = IslamicSuperApps;