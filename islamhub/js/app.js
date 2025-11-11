/* ===== IslamHub - Main Application Controller ===== */

class IslamHubApp {
    constructor() {
        this.currentApp = 'home';
        this.loadedApps = new Set(['home']);
        this.state = {
            user: {
                city: 'Jakarta',
                country: 'Indonesia',
                coordinates: { lat: -6.2088, lon: 106.8456 },
                timezone: 'Asia/Jakarta'
            },
            adzan: {
                times: null,
                nextPrayer: null,
                lastFetch: null
            },
            settings: {
                notifications: true,
                sound: true,
                language: 'id'
            }
        };
        
        // Shared prayer data for widget updates
        this.prayerData = null;
        
        // Capacitor native features
        this.isNative = false;
        this.networkStatus = { connected: true, connectionType: 'wifi' };
    }

    async init() {
        console.log('Initializing IslamHub...');
        
        // Initialize native features first
        await this.initializeNativeFeatures();
        
        this.setupNavigation();
        this.setupMobileMenu();
        this.loadStateFromLocalStorage();
        
        // Load Adzan app immediately for floating widget
        await this.loadApp('adzan');
        
        // Initialize hadith ticker
        await this.initializeHadithTicker();
        
        // Hide loading with smooth transition like dzikir_doa
        this.hideLoading();
        
        // Initialize home widget with saved data
        this.initializeHomeWidget();
        
        // Check if we should restore last active app
        const lastActiveApp = localStorage.getItem('islamhub_last_active_app');
        if (lastActiveApp && lastActiveApp !== 'home') {
            console.log('Restoring last active app:', lastActiveApp);
            await this.switchApp(lastActiveApp);
        } else {
            // Show floating widget on home
            this.updateFloatingWidgetVisibility('home');
            // Set data-current-app to 'home' by default
            document.body.setAttribute('data-current-app', 'home');
        }
        
        // Setup floating widget toggle
        this.setupFloatingWidgetToggle();
        
        // Register Service Worker for PWA
        this.registerServiceWorker();
        
        // Setup PWA install button
        this.setupInstallButton();
        
        // Setup share button
        this.setupShareButton();
        
        // Setup cache management and update notifications
        this.setupCacheManagement();
        
        // Setup clear data button (Web only)
        this.setupClearDataButton();
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                console.log('Registering Service Worker...');
                
                // Detect base path from current location
                const basePath = window.location.pathname.split('/').slice(0, -1).join('/') || '/';
                const swPath = `${basePath}/sw.js`;
                
                const registration = await navigator.serviceWorker.register(swPath, {
                    scope: `${basePath}/`
                });
                
                console.log('Service Worker registered successfully:', registration.scope);
                
                // Check for updates every 5 minutes instead of 30 seconds
                setInterval(() => {
                    registration.update();
                }, 300000);
                
                // Listen for messages from service worker (cache updated)
                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'CACHE_UPDATED') {
                        console.log('Cache updated to version:', event.data.version);
                        // Don't auto-reload, let user decide via update notification
                    }
                });
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('Service Worker update found!');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('New Service Worker installed');
                            // Will trigger reload via message listener above
                        }
                    });
                });
                
                // Initial update check
                registration.update();
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        } else {
            console.log('Service Worker not supported in this browser');
        }
    }

    async initializeNativeFeatures() {
        // Check if running in Capacitor native environment
        if (typeof Capacitor !== 'undefined') {
            this.isNative = true;
            console.log('Running in native environment');
            
            // Add platform class to body for CSS targeting
            const platform = Capacitor.getPlatform();
            document.body.classList.add(`capacitor-${platform}`);
            document.body.setAttribute('data-platform', platform);
            console.log('Platform:', platform);
            
            try {
                // Initialize StatusBar
                const { StatusBar } = Capacitor.Plugins;
                if (StatusBar) {
                    await StatusBar.setStyle({ style: 'DARK' });
                    await StatusBar.setBackgroundColor({ color: '#1a472a' });
                    console.log('StatusBar initialized');
                }
            } catch (error) {
                console.error('StatusBar initialization error:', error);
            }
            
            try {
                // Initialize SplashScreen
                const { SplashScreen } = Capacitor.Plugins;
                if (SplashScreen) {
                    // Hide splash screen after app is ready
                    setTimeout(async () => {
                        await SplashScreen.hide();
                        console.log('SplashScreen hidden');
                    }, 500);
                }
            } catch (error) {
                console.error('SplashScreen error:', error);
            }
            
            try {
                // Initialize Network monitoring
                const { Network } = Capacitor.Plugins;
                if (Network) {
                    // Get current network status
                    const status = await Network.getStatus();
                    this.networkStatus = status;
                    console.log('Network status:', status);
                    
                    // Listen for network changes
                    Network.addListener('networkStatusChange', (status) => {
                        console.log('Network status changed:', status);
                        this.networkStatus = status;
                        this.handleNetworkChange(status);
                    });
                }
            } catch (error) {
                console.error('Network monitoring error:', error);
            }
            
            try {
                // Initialize Haptics for native feedback
                const { Haptics } = Capacitor.Plugins;
                if (Haptics) {
                    // Store haptics reference for later use
                    this.haptics = Haptics;
                    console.log('Haptics initialized');
                }
            } catch (error) {
                console.error('Haptics initialization error:', error);
            }
            
        } else {
            console.log('Running in web browser');
        }
    }
    
    handleNetworkChange(status) {
        // Show notification to user about network status
        if (!status.connected) {
            this.showNotification('Tidak ada koneksi internet', 'warning');
        } else if (this.networkStatus.connected === false && status.connected === true) {
            this.showNotification('Koneksi internet tersambung kembali', 'success');
        }
    }
    
    // Haptic feedback helper
    triggerHaptic(type = 'light') {
        if (this.isNative && this.haptics) {
            try {
                switch (type) {
                    case 'light':
                        this.haptics.impact({ style: 'LIGHT' });
                        break;
                    case 'medium':
                        this.haptics.impact({ style: 'MEDIUM' });
                        break;
                    case 'heavy':
                        this.haptics.impact({ style: 'HEAVY' });
                        break;
                    case 'success':
                        this.haptics.notification({ type: 'SUCCESS' });
                        break;
                    case 'warning':
                        this.haptics.notification({ type: 'WARNING' });
                        break;
                    case 'error':
                        this.haptics.notification({ type: 'ERROR' });
                        break;
                }
            } catch (error) {
                console.error('Haptic feedback error:', error);
            }
        }
    }
    
    // Share content helper
    async shareContent(title, text, url = null) {
        if (this.isNative) {
            try {
                const { Share } = Capacitor.Plugins;
                if (Share) {
                    await Share.share({
                        title: title,
                        text: text,
                        url: url,
                        dialogTitle: 'Bagikan'
                    });
                    return true;
                }
            } catch (error) {
                console.error('Share error:', error);
            }
        } else {
            // Fallback to Web Share API
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: title,
                        text: text,
                        url: url
                    });
                    return true;
                } catch (error) {
                    console.error('Web Share error:', error);
                }
            }
        }
        return false;
    }
    
    showNotification(message, type = 'info') {
        // Create or reuse notification element
        let notification = document.getElementById('app-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'app-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: opacity 0.3s ease;
                max-width: 90%;
                text-align: center;
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            document.body.appendChild(notification);
        }
        
        // Set color based on type
        const colors = {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Add logo and message - use relative path from www/
        notification.innerHTML = `
            <img src="assets/icons/icon-72x72.png" alt="IslamHub" style="width: 32px; height: 32px; border-radius: 6px; object-fit: contain;" onerror="this.style.display='none'">
            <span>${message}</span>
        `;
        notification.style.opacity = '1';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    }

    setupNavigation() {
        // Setup More Apps dropdown first (before bottom nav items)
        const moreAppsBtn = document.getElementById('moreAppsBtn');
        const moreAppsDropdown = document.getElementById('moreAppsDropdown');
        const closeDropdown = document.getElementById('closeDropdown');
        
        console.log('Setup Navigation - Elements check:', {
            btn: moreAppsBtn,
            dropdown: moreAppsDropdown,
            close: closeDropdown
        });
        
        if (moreAppsDropdown) {
            console.log('Dropdown styles:', {
                position: getComputedStyle(moreAppsDropdown).position,
                bottom: getComputedStyle(moreAppsDropdown).bottom,
                zIndex: getComputedStyle(moreAppsDropdown).zIndex,
                transform: getComputedStyle(moreAppsDropdown).transform,
                visibility: getComputedStyle(moreAppsDropdown).visibility,
                opacity: getComputedStyle(moreAppsDropdown).opacity,
                display: getComputedStyle(moreAppsDropdown).display
            });
        }
        
        if (moreAppsBtn && moreAppsDropdown && closeDropdown) {
            console.log('More Apps dropdown found, setting up...');
            
            // Remove any existing listeners by cloning and replacing
            const newBtn = moreAppsBtn.cloneNode(true);
            moreAppsBtn.parentNode.replaceChild(newBtn, moreAppsBtn);
            
            // Open dropdown
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('More Apps button clicked');
                // Haptic disabled for navigation
                moreAppsDropdown.classList.toggle('show');
            });
            
            // Close dropdown
            closeDropdown.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Closing dropdown');
                // Haptic disabled for navigation
                moreAppsDropdown.classList.remove('show');
            });
            
            // Handle app selection from dropdown
            const moreAppItems = document.querySelectorAll('.more-app-item');
            console.log(`Found ${moreAppItems.length} more app items`);
            
            moreAppItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const appName = item.dataset.app;
                    console.log(`Opening app from dropdown: ${appName}`);
                    // Haptic disabled for navigation
                    moreAppsDropdown.classList.remove('show');
                    this.switchApp(appName);
                });
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!moreAppsDropdown.contains(e.target) && !newBtn.contains(e.target)) {
                    if (moreAppsDropdown.classList.contains('show')) {
                        console.log('Clicked outside, closing dropdown');
                        moreAppsDropdown.classList.remove('show');
                    }
                }
            });
        } else {
            console.log('More Apps elements not found:', {
                btn: !!moreAppsBtn,
                dropdown: !!moreAppsDropdown,
                close: !!closeDropdown
            });
        }
        
        // Bottom navigation for all devices
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item:not(#moreAppsBtn)');
        bottomNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const appName = e.currentTarget.dataset.app;
                if (appName) {
                    // Haptic disabled for navigation
                    this.switchApp(appName);
                }
            });
        });
    }

    setupMobileMenu() {
        // Bottom navigation is always visible for all devices
    }

    async switchApp(appName) {
        console.log(`Switching to app: ${appName}`);
        
        // If switching to the same app (menu already active), reset to main page
        const isAlreadyActive = this.currentApp === appName;
        
        // Reset waris to home if clicking menu while already in waris
        if (isAlreadyActive && appName === 'waris' && window.warisApp) {
            window.warisApp.showHome();
            return; // Don't proceed with normal switch
        }
        
        // Hide current app
        document.querySelectorAll('.app-component').forEach(comp => {
            comp.classList.remove('active');
        });
        
        // Update navigation active states
        document.querySelectorAll('.bottom-nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        
        // Remove active from dropdown items
        document.querySelectorAll('.more-app-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show target app
        const targetApp = document.getElementById(`${appName}-app`);
        if (targetApp) {
            targetApp.classList.add('active');
        }
        
        // Update active nav states
        document.querySelectorAll(`.bottom-nav-item[data-app="${appName}"]`).forEach(nav => {
            nav.classList.add('active');
        });
        
        // If app is in dropdown (waris, qibla, sirah, sholat, streaming), activate 'More Apps' button
        const dropdownApps = ['waris', 'qibla', 'sirah', 'sholat', 'streaming'];
        if (dropdownApps.includes(appName)) {
            const moreAppsBtn = document.getElementById('moreAppsBtn');
            if (moreAppsBtn) {
                moreAppsBtn.classList.add('active');
            }
            // Also activate the specific item in dropdown
            document.querySelectorAll(`.more-app-item[data-app="${appName}"]`).forEach(item => {
                item.classList.add('active');
            });
        }
        
        // Load app if not loaded yet
        if (!this.loadedApps.has(appName) && appName !== 'home') {
            await this.loadApp(appName);
        }
        
        this.currentApp = appName;
        
        // Update body class untuk footer visibility
        if (appName === 'home') {
            document.body.classList.add('home-active');
        } else {
            document.body.classList.remove('home-active');
        }
        
        // Update body data attribute untuk app-specific styling (hide floating widget on alquran)
        document.body.setAttribute('data-current-app', appName);
        
        // Save last active app to localStorage
        localStorage.setItem('islamhub_last_active_app', appName);
        
        // Reset to main page of the app if already active or switching to it
        if (appName === 'dzikir') {
            // Reset dzikir app to main page
            if (window.dzikirApp) {
                window.dzikirApp.resetToMainPage();
            }
        } else if (appName === 'sirah') {
            // Reset sirah app to main page
            if (window.sirahApp) {
                window.sirahApp.resetToMainPage();
            }
        } else if (appName === 'alquran') {
            // Reset alquran app to main page
            if (window.alquranApp) {
                window.alquranApp.resetToHome();
            }
        }
        
        // Update floating widget visibility based on current app
        this.updateFloatingWidgetVisibility(appName);
        
        // Scroll to top after all DOM updates - use multiple methods for maximum compatibility
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // Force scroll reset with requestAnimationFrame to ensure browser is ready
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        });
    }

    async loadApp(appName) {
        try {
            console.log(`Loading app: ${appName}`);
            
            // Map app names to file names
            const appFiles = {
                'adzan': 'adzan-app.js',
                'dzikir': 'dzikir-app.js',
                'alquran': 'alquran-app.js',
                'waris': 'waris-app.js',
                'qibla': 'qibla-app.js',
                'sholat': 'sholat-app.js',
                'sirah': 'sirah-app.js',
                'streaming': 'streaming-app.js'
            };
            
            const fileName = appFiles[appName];
            if (!fileName) {
                throw new Error(`Unknown app: ${appName}`);
            }
            
            // Map app names to folder names
            const folderMap = {
                'adzan': 'adzan',
                'dzikir': 'dzikir',
                'alquran': 'alquran',
                'waris': 'kalkulator',
                'qibla': 'qibla',
                'sholat': 'sholat',
                'sirah': 'sirah',
                'streaming': 'streaming'
            };
            
            const folder = folderMap[appName];
            
            // Dynamic import
            const module = await import(`./apps/${folder}/${fileName}`);
            
            // Initialize app
            const AppClass = module.default;
            const appInstance = new AppClass(this.state, this);
            await appInstance.init();
            
            // Store app instances globally for reset functionality
            if (appName === 'dzikir') {
                window.dzikirApp = appInstance;
            } else if (appName === 'alquran') {
                window.alquranApp = appInstance;
            } else if (appName === 'sirah') {
                window.sirahApp = appInstance;
            } else if (appName === 'waris') {
                window.warisApp = appInstance;
            } else if (appName === 'sholat') {
                window.sholatApp = appInstance;
            } else if (appName === 'streaming') {
                window.streamingApp = appInstance;
            }
            
            this.loadedApps.add(appName);
            console.log(`App loaded successfully: ${appName}`);
        } catch (error) {
            console.error(`Failed to load ${appName}:`, error);
            this.showError(`Gagal memuat aplikasi ${appName}. ${error.message}`);
        }
    }

    hideLoading() {
        setTimeout(() => {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(() => {
                    overlay.remove();
                }, 500);
            }
        }, 800);
    }

    showError(message) {
        // Simple error notification
        console.error(message);
        alert(message);
    }

    loadStateFromLocalStorage() {
        try {
            const savedCity = localStorage.getItem('islamhub_city');
            const savedCountry = localStorage.getItem('islamhub_country');
            const savedCoords = localStorage.getItem('islamhub_coords');
            
            if (savedCity) this.state.user.city = savedCity;
            if (savedCountry) this.state.user.country = savedCountry;
            if (savedCoords) {
                const coords = JSON.parse(savedCoords);
                this.state.user.coordinates = coords;
            }
        } catch (error) {
            console.error('Failed to load state from localStorage:', error);
        }
    }

    saveStateToLocalStorage() {
        try {
            localStorage.setItem('islamhub_city', this.state.user.city);
            localStorage.setItem('islamhub_country', this.state.user.country);
            localStorage.setItem('islamhub_coords', JSON.stringify(this.state.user.coordinates));
        } catch (error) {
            console.error('Failed to save state to localStorage:', error);
        }
    }

    // Initialize home widget with prayer data
    initializeHomeWidget() {
        // Will be populated by Adzan app when it loads
        this.updateHomeWidget({
            prayerName: 'Memuat...',
            prayerTime: '--:--',
            countdown: '--:--:--',
            city: this.state.user.city
        });
    }

    // Update home widget with prayer data
    updateHomeWidget(data) {
        const prayerNameEl = document.getElementById('homePrayerName');
        const prayerTimeEl = document.getElementById('homePrayerTime');
        const countdownEl = document.getElementById('homeCountdown');
        const cityEl = document.getElementById('homeCity');
        
        if (prayerNameEl) prayerNameEl.textContent = data.prayerName;
        if (prayerTimeEl) prayerTimeEl.textContent = data.prayerTime;
        if (countdownEl) countdownEl.textContent = data.countdown;
        if (cityEl) cityEl.textContent = data.city;
    }

    // Update floating widget
    updateFloatingWidget(data) {
        const widgetPrayerName = document.getElementById('widgetPrayerName');
        const widgetCountdown = document.getElementById('widgetCountdown');
        const widgetCity = document.getElementById('widgetCity');
        
        if (widgetPrayerName) widgetPrayerName.textContent = data.prayerName;
        if (widgetCountdown) widgetCountdown.textContent = data.countdown;
        if (widgetCity) widgetCity.textContent = data.city;
    }

    // Show/hide floating widget based on current app
    updateFloatingWidgetVisibility(appName) {
        const floatingWidget = document.getElementById('floatingPrayerWidget');
        if (!floatingWidget) return;
        
        // Check if widget is manually hidden
        const isHidden = localStorage.getItem('islamhub_widget_hidden') === 'true';
        if (isHidden) {
            floatingWidget.style.display = 'none';
            return;
        }
        
        // Show widget on home and hide on adzan page
        if (appName === 'home') {
            floatingWidget.style.display = 'block';
            setTimeout(() => {
                floatingWidget.style.opacity = '1';
            }, 100);
        } else if (appName === 'adzan') {
            floatingWidget.style.opacity = '0';
            setTimeout(() => {
                floatingWidget.style.display = 'none';
            }, 300);
        } else {
            // Show on other apps
            floatingWidget.style.display = 'block';
            setTimeout(() => {
                floatingWidget.style.opacity = '1';
            }, 100);
        }
    }

    setupFloatingWidgetToggle() {
        const floatingWidget = document.getElementById('floatingPrayerWidget');
        if (!floatingWidget) return;

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'widgetToggle';
        toggleBtn.className = 'widget-toggle-btn';
        toggleBtn.innerHTML = '<i class=\"fas fa-eye-slash\"></i>';
        toggleBtn.title = 'Sembunyikan widget waktu sholat';
        
        floatingWidget.appendChild(toggleBtn);

        // Load saved state
        const isHidden = localStorage.getItem('islamhub_widget_hidden') === 'true';
        if (isHidden) {
            floatingWidget.style.display = 'none';
            this.showWidgetRestoreButton();
        }

        // Toggle handler
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingWidget.style.opacity = '0';
            setTimeout(() => {
                floatingWidget.style.display = 'none';
                localStorage.setItem('islamhub_widget_hidden', 'true');
                this.showWidgetRestoreButton();
            }, 300);
        });
    }

    showWidgetRestoreButton() {
        // Check if restore button already exists
        if (document.getElementById('widgetRestoreBtn')) return;

        const restoreBtn = document.createElement('button');
        restoreBtn.id = 'widgetRestoreBtn';
        restoreBtn.className = 'widget-restore-btn';
        restoreBtn.innerHTML = '<i class=\"fas fa-mosque\"></i>';
        restoreBtn.title = 'Tampilkan widget waktu sholat';
        
        document.body.appendChild(restoreBtn);

        restoreBtn.addEventListener('click', () => {
            const floatingWidget = document.getElementById('floatingPrayerWidget');
            if (floatingWidget) {
                floatingWidget.style.display = 'block';
                setTimeout(() => {
                    floatingWidget.style.opacity = '1';
                }, 100);
                localStorage.setItem('islamhub_widget_hidden', 'false');
                restoreBtn.remove();
            }
        });
    }

    async initializeHadithTicker() {
        try {
            const { hadithCollection } = await import('./data/hadith-collection.js');
            
            let currentIndex = 0;
            let isPlaying = true;
            let autoRotateInterval;
            const ROTATE_INTERVAL = 6000; // 6 seconds
            
            const hadithArabic = document.getElementById('hadithArabic');
            const hadithIndonesia = document.getElementById('hadithIndonesia');
            const hadithReference = document.getElementById('hadithReference');
            const hadithContent = document.getElementById('hadithContent');
            const prevBtn = document.getElementById('prevHadith');
            const nextBtn = document.getElementById('nextHadith');
            const playPauseBtn = document.getElementById('playPauseHadith');
            const progressFill = document.querySelector('.progress-fill');
            
            const showHadith = (index) => {
                const hadith = hadithCollection[index];
                
                // Fade out
                hadithContent.classList.add('fade-out');
                
                setTimeout(() => {
                    hadithArabic.textContent = hadith.arabic;
                    hadithIndonesia.textContent = hadith.indonesia;
                    hadithReference.textContent = hadith.reference;
                    
                    // Fade in
                    hadithContent.classList.remove('fade-out');
                }, 300);
                
                // Reset progress
                if (progressFill) {
                    progressFill.style.animation = 'none';
                    setTimeout(() => {
                        progressFill.style.animation = isPlaying ? `progressGrow ${ROTATE_INTERVAL}ms linear` : 'none';
                    }, 10);
                }
            };
            
            const nextHadith = () => {
                currentIndex = (currentIndex + 1) % hadithCollection.length;
                showHadith(currentIndex);
            };
            
            const prevHadith = () => {
                currentIndex = (currentIndex - 1 + hadithCollection.length) % hadithCollection.length;
                showHadith(currentIndex);
            };
            
            const togglePlayPause = () => {
                isPlaying = !isPlaying;
                const icon = playPauseBtn.querySelector('i');
                
                if (isPlaying) {
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                    playPauseBtn.classList.remove('paused');
                    startAutoRotate();
                } else {
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                    playPauseBtn.classList.add('paused');
                    stopAutoRotate();
                }
            };
            
            const startAutoRotate = () => {
                stopAutoRotate();
                autoRotateInterval = setInterval(nextHadith, ROTATE_INTERVAL);
                if (progressFill) {
                    progressFill.style.animation = `progressGrow ${ROTATE_INTERVAL}ms linear`;
                }
            };
            
            const stopAutoRotate = () => {
                if (autoRotateInterval) {
                    clearInterval(autoRotateInterval);
                }
                if (progressFill) {
                    progressFill.style.animation = 'none';
                }
            };
            
            // Event listeners
            prevBtn.addEventListener('click', () => {
                prevHadith();
                if (isPlaying) {
                    startAutoRotate();
                }
            });
            
            nextBtn.addEventListener('click', () => {
                nextHadith();
                if (isPlaying) {
                    startAutoRotate();
                }
            });
            
            playPauseBtn.addEventListener('click', togglePlayPause);
            
            // Initialize
            showHadith(0);
            startAutoRotate();
            
        } catch (error) {
            console.error('Failed to load hadith ticker:', error);
        }
    }

    setupInstallButton() {
        // Install button removed for mobile native app
        // Native app is already installed via app store
        // This function kept for web PWA compatibility
        
        // Skip setup if running as native app
        if (this.isNative) {
            return;
        }
        
        let deferredPrompt;
        const installButton = document.getElementById('installButton');

        if (!installButton) return;

        // Check if app is currently running in standalone mode (actually installed and opened)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                            window.navigator.standalone === true;
        
        if (isStandalone) {
            installButton.style.display = 'none';
            return;
        }

        // Clear any stale install state when user visits (in case they uninstalled)
        // This allows re-installation
        localStorage.removeItem('islamhub_installed');

        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installButton.style.display = 'inline-flex';
            installButton.innerHTML = '<i class="fas fa-download"></i><span>Install Aplikasi</span>';
            // Store that prompt is available
            localStorage.setItem('islamhub_prompt_available', 'true');
        });

        // Show button by default (will show instructions if prompt not available)
        installButton.style.display = 'inline-flex';

        // Handle install button click
        installButton.addEventListener('click', async () => {
            // If prompt available, show it immediately
            if (deferredPrompt) {
                try {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    
                    if (outcome === 'accepted') {
                        localStorage.setItem('islamhub_installed', 'true');
                        this.showInstallDialog('🎉 Berhasil!\n\nAplikasi IslamHub sedang diinstall.\nCek home screen atau app drawer Anda dalam beberapa detik.', 'success');
                    } else {
                        this.showInstallDialog('Install dibatalkan.\n\nAnda bisa install kapan saja dari menu browser atau klik tombol Install Aplikasi lagi.', 'info');
                    }
                    
                    deferredPrompt = null;
                    installButton.style.display = 'none';
                } catch (error) {
                    console.error('Install prompt error:', error);
                    this.showInstallDialog('❌ Gagal Install\n\nPrompt install tidak bisa ditampilkan.\n\n💡 Coba:\n• Tutup dan buka browser lagi\n• Clear cache browser\n• Kunjungi situs 2-3x lagi\n• Install manual: Menu browser → Install IslamHub', 'error');
                }
                return;
            }
            
            // No prompt available - check if recently uninstalled
            const currentlyInstalled = window.matchMedia('(display-mode: standalone)').matches;
            if (currentlyInstalled) {
                this.showInstallDialog('Aplikasi sudah terinstall! 🎉\n\nAnda sedang menjalankan aplikasi dari home screen.', 'success');
                return;
            }
            
            // Show manual install instructions
            this.showInstallDialog(
                '📱 Cara Install Manual\n\n' +
                '🔹 Android Chrome:\n' +
                '1. Tap menu (⋮) di pojok kanan atas\n' +
                '2. Pilih "Tambahkan ke layar Utama" atau "Install app"\n' +
                '3. Konfirmasi install\n\n' +
                '� Jika menu tidak muncul:\n' +
                '• Tutup Chrome sepenuhnya (kill app)\n' +
                '• Buka lagi dan kunjungi situs ini 2-3x\n' +
                '• Chrome butuh waktu untuk mengaktifkan install prompt setelah uninstall\n\n' +
                '💡 Tips: Clear cache browser (Settings → Privacy → Clear browsing data) lalu kunjungi lagi.',
                'info'
            );
        });

        // Handle app installed event
        window.addEventListener('appinstalled', () => {
            localStorage.setItem('islamhub_installed', 'true');
            installButton.style.display = 'none';
            deferredPrompt = null;
            this.showInstallDialog('✅ Install Berhasil! 🎉\n\nIslamHub sudah terinstall di perangkat Anda.\n\nBuka dari home screen untuk pengalaman terbaik!', 'success');
        });
    }
    
    showInstallDialog(message, type = 'info') {
        // Remove existing dialog if any
        const existingDialog = document.querySelector('.install-dialog');
        if (existingDialog) existingDialog.remove();
        
        // Create a more professional dialog instead of alert
        const dialog = document.createElement('div');
        dialog.className = 'install-dialog';
        
        // Force visibility with inline styles
        dialog.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.85) !important;
            backdrop-filter: blur(10px) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 999999 !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;
        
        // Check if this is install instructions
        const isInstallInstructions = message.includes('Alternatif Install');
        
        if (isInstallInstructions) {
            // SIMPLIFIED VERSION - Focus on readability
            dialog.innerHTML = `
                <div style="
                    background: #1e1e2e;
                    color: white;
                    padding: 30px;
                    border-radius: 15px;
                    max-width: 550px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    position: relative;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
                    border: 2px solid #00f3ff;
                ">
                    <button onclick="this.closest('.install-dialog').remove()" style="
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: rgba(255, 255, 255, 0.1);
                        border: none;
                        color: #00f3ff;
                        width: 35px;
                        height: 35px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 20px;
                        line-height: 35px;
                        text-align: center;
                    ">✕</button>
                    
                    <h2 style="
                        color: #00f3ff;
                        font-size: 24px;
                        font-weight: 600;
                        margin: 0 0 10px 0;
                        text-align: center;
                    ">Cara Install IslamHub</h2>
                    
                    <p style="
                        color: rgba(255, 255, 255, 0.7);
                        font-size: 14px;
                        margin: 0 0 25px 0;
                        text-align: center;
                    ">Pilih metode sesuai perangkat Anda</p>
                    
                    <div style="margin-bottom: 20px;">
                        <h3 style="
                            color: #00f3ff;
                            font-size: 18px;
                            font-weight: 600;
                            margin: 0 0 15px 0;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        ">
                            <span style="
                                background: #4285f4;
                                width: 35px;
                                height: 35px;
                                border-radius: 8px;
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 18px;
                            ">🌐</span>
                            Chrome Desktop
                        </h3>
                        <div style="
                            background: rgba(0, 243, 255, 0.05);
                            border: 1px solid rgba(0, 243, 255, 0.2);
                            border-radius: 10px;
                            padding: 15px;
                        ">
                            <div style="margin-bottom: 12px;">
                                <div style="
                                    display: flex;
                                    gap: 10px;
                                    align-items: start;
                                ">
                                    <span style="
                                        background: #00f3ff;
                                        color: #0a0a1f;
                                        width: 24px;
                                        height: 24px;
                                        border-radius: 50%;
                                        display: inline-flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: 700;
                                        font-size: 14px;
                                        flex-shrink: 0;
                                    ">1</span>
                                    <div style="flex: 1;">
                                        <strong style="color: white; display: block; margin-bottom: 3px;">Cari icon install di address bar</strong>
                                        <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 13px;">Look for ⊕ or 🖥️ icon on the right side</p>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <div style="
                                    display: flex;
                                    gap: 10px;
                                    align-items: start;
                                ">
                                    <span style="
                                        background: #00f3ff;
                                        color: #0a0a1f;
                                        width: 24px;
                                        height: 24px;
                                        border-radius: 50%;
                                        display: inline-flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: 700;
                                        font-size: 14px;
                                        flex-shrink: 0;
                                    ">2</span>
                                    <div style="flex: 1;">
                                        <strong style="color: white; display: block; margin-bottom: 3px;">Atau via menu browser</strong>
                                        <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 13px;">Menu (⋮) → "Install IslamHub..."</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style="
                                    display: flex;
                                    gap: 10px;
                                    align-items: start;
                                ">
                                    <span style="
                                        background: #00f3ff;
                                        color: #0a0a1f;
                                        width: 24px;
                                        height: 24px;
                                        border-radius: 50%;
                                        display: inline-flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: 700;
                                        font-size: 14px;
                                        flex-shrink: 0;
                                    ">3</span>
                                    <div style="flex: 1;">
                                        <strong style="color: white; display: block; margin-bottom: 3px;">Alternatif: Create Shortcut</strong>
                                        <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 13px;">Menu → More Tools → Create Shortcut<br>✓ Check "Open as window"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h3 style="
                            color: #00f3ff;
                            font-size: 18px;
                            font-weight: 600;
                            margin: 0 0 15px 0;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        ">
                            <span style="
                                background: #ff6b6b;
                                width: 35px;
                                height: 35px;
                                border-radius: 8px;
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 18px;
                            ">📱</span>
                            Mobile (Android/iOS)
                        </h3>
                        <div style="
                            background: rgba(0, 243, 255, 0.05);
                            border: 1px solid rgba(0, 243, 255, 0.2);
                            border-radius: 10px;
                            padding: 15px;
                        ">
                            <div style="margin-bottom: 12px;">
                                <div style="
                                    display: flex;
                                    gap: 10px;
                                    align-items: start;
                                ">
                                    <span style="
                                        background: #00f3ff;
                                        color: #0a0a1f;
                                        width: 24px;
                                        height: 24px;
                                        border-radius: 50%;
                                        display: inline-flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: 700;
                                        font-size: 14px;
                                        flex-shrink: 0;
                                    ">1</span>
                                    <div style="flex: 1;">
                                        <strong style="color: white; display: block; margin-bottom: 3px;">Tap menu browser</strong>
                                        <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 13px;">Tap (⋮) atau Share icon</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style="
                                    display: flex;
                                    gap: 10px;
                                    align-items: start;
                                ">
                                    <span style="
                                        background: #00f3ff;
                                        color: #0a0a1f;
                                        width: 24px;
                                        height: 24px;
                                        border-radius: 50%;
                                        display: inline-flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: 700;
                                        font-size: 14px;
                                        flex-shrink: 0;
                                    ">2</span>
                                    <div style="flex: 1;">
                                        <strong style="color: white; display: block; margin-bottom: 3px;">Install aplikasi</strong>
                                        <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 13px;">Pilih "Tambahkan ke Layar Utama" atau "Install app"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="
                        padding: 15px;
                        background: rgba(0, 243, 255, 0.1);
                        border: 1px solid rgba(0, 243, 255, 0.3);
                        border-radius: 10px;
                        margin-bottom: 20px;
                    ">
                        <h4 style="
                            color: #00f3ff;
                            font-size: 15px;
                            font-weight: 600;
                            margin: 0 0 10px 0;
                        ">✅ PWA Requirements Terpenuhi</h4>
                        <div style="
                            display: flex;
                            flex-wrap: wrap;
                            gap: 8px;
                            margin-bottom: 10px;
                        ">
                            <span style="
                                background: rgba(0, 243, 255, 0.15);
                                border: 1px solid rgba(0, 243, 255, 0.3);
                                padding: 5px 12px;
                                border-radius: 15px;
                                font-size: 12px;
                                color: white;
                            ">✅ HTTPS</span>
                            <span style="
                                background: rgba(0, 243, 255, 0.15);
                                border: 1px solid rgba(0, 243, 255, 0.3);
                                padding: 5px 12px;
                                border-radius: 15px;
                                font-size: 12px;
                                color: white;
                            ">✅ Service Worker</span>
                            <span style="
                                background: rgba(0, 243, 255, 0.15);
                                border: 1px solid rgba(0, 243, 255, 0.3);
                                padding: 5px 12px;
                                border-radius: 15px;
                                font-size: 12px;
                                color: white;
                            ">✅ Manifest</span>
                            <span style="
                                background: rgba(0, 243, 255, 0.15);
                                border: 1px solid rgba(0, 243, 255, 0.3);
                                padding: 5px 12px;
                                border-radius: 15px;
                                font-size: 12px;
                                color: white;
                            ">✅ Icons</span>
                        </div>
                        <p style="
                            color: rgba(255, 255, 255, 0.6);
                            font-size: 12px;
                            margin: 0;
                        ">ℹ️ Chrome may require 2-3 visits before showing install prompt</p>
                    </div>
                    
                    <button onclick="this.closest('.install-dialog').remove()" style="
                        background: linear-gradient(135deg, #00f3ff, #00b8ff);
                        color: #0a0a1f;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        width: 100%;
                        box-shadow: 0 4px 15px rgba(0, 243, 255, 0.4);
                    ">✓ Mengerti</button>
                </div>
            `;
        } else {
            // Regular dialog for other messages
            const formattedMessage = message
                .replace(/\n/g, '<br>')
                .replace(/•/g, '&bull;');
            
            dialog.innerHTML = `
                <div style="
                    position: relative;
                    background: #1e1e2e;
                    color: white;
                    padding: 2rem;
                    border-radius: 20px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 85vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                    border: 2px solid rgba(0, 243, 255, 0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                ">
                    <button onclick="this.closest('.install-dialog').remove()" style="
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: rgba(255, 255, 255, 0.1);
                        border: none;
                        color: #00f3ff;
                        width: 35px;
                        height: 35px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                        ✕
                    </button>
                    
                    <div style="
                        text-align: center;
                        margin-bottom: 1.5rem;
                    ">
                        <div style="
                            width: 60px;
                            height: 60px;
                            margin: 0 auto 1rem;
                            background: ${type === 'success' ? 'linear-gradient(135deg, #00f3ff, #00b8ff)' : type === 'error' ? 'linear-gradient(135deg, #ff6b6b, #ee5a6f)' : 'linear-gradient(135deg, #00f3ff, #0d47a1)'};
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 30px;
                        ">
                            ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
                        </div>
                    </div>
                    
                    <div style="
                        color: white;
                        font-size: 15px;
                        line-height: 1.6;
                        margin-bottom: 2rem;
                        white-space: pre-wrap;
                    ">${formattedMessage}</div>
                    
                    <div style="
                        display: flex;
                        justify-content: center;
                    ">
                        <button onclick="this.closest('.install-dialog').remove()" style="
                            background: linear-gradient(135deg, #00f3ff, #00b8ff);
                            color: #0a0a1f;
                            border: none;
                            padding: 12px 40px;
                            border-radius: 25px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            box-shadow: 0 4px 15px rgba(0, 243, 255, 0.4);
                            transition: all 0.3s ease;
                        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0, 243, 255, 0.6)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0, 243, 255, 0.4)'">
                            Mengerti
                        </button>
                    </div>
                </div>
            `;
        }
        
        document.body.appendChild(dialog);
        
        // Add click outside to close
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
        
        // Add escape key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                dialog.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        // Auto remove after 15 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                if (dialog.parentNode) {
                    dialog.remove();
                }
            }, 5000);
        }
    }

    // Setup Share Button
    setupShareButton() {
        const shareBtn = document.getElementById('shareAppBtn');
        
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                this.triggerHaptic('medium');
                
                const shareData = {
                    title: 'IslamHub - Islamic Applications Hub',
                    text: 'Kumpulan aplikasi islami lengkap: Al-Quran, Adzan, Dzikir, Qibla, Sholat, dan lainnya dalam satu platform!',
                    url: window.location.href
                };
                
                const success = await this.shareContent(
                    shareData.title,
                    shareData.text,
                    shareData.url
                );
                
                if (success) {
                    this.triggerHaptic('success');
                } else {
                    // Fallback: copy to clipboard
                    try {
                        await navigator.clipboard.writeText(window.location.href);
                        this.showNotification('Link berhasil disalin!', 'success');
                        this.triggerHaptic('success');
                    } catch (error) {
                        this.showNotification('Gagal membagikan', 'error');
                        this.triggerHaptic('error');
                    }
                }
            });
        }
    }

    // Cache Management Methods
    setupCacheManagement() {
        const APP_VERSION = '1.2.1';
        const STORAGE_VERSION_KEY = 'islamhub_app_version';
        
        // Check version and show update notification if needed
        this.checkForUpdates(APP_VERSION, STORAGE_VERSION_KEY);
        
        // Clear cache button removed for mobile app - native app doesn't need manual cache clearing
        // Mobile app automatically manages cache through Capacitor
        
        // Setup update notification buttons
        const updateNowBtn = document.getElementById('updateNowBtn');
        const updateLaterBtn = document.getElementById('updateLaterBtn');
        
        if (updateNowBtn) {
            updateNowBtn.addEventListener('click', async () => {
                await this.clearAllCache();
            });
        }
        
        if (updateLaterBtn) {
            updateLaterBtn.addEventListener('click', () => {
                this.hideUpdateNotification();
            });
        }
    }
    
    checkForUpdates(currentVersion, storageKey) {
        const savedVersion = localStorage.getItem(storageKey);
        const updateShown = localStorage.getItem('islamhub_update_notification_shown');
        
        if (!savedVersion || savedVersion !== currentVersion) {
            console.log('New version detected:', currentVersion, 'Previous:', savedVersion);
            
            // Save version immediately to prevent infinite loops
            localStorage.setItem(storageKey, currentVersion);
            
            // Only show notification if this is truly a new version (not first visit) 
            // and we haven't shown it in this session
            if (savedVersion && !updateShown) {
                localStorage.setItem('islamhub_update_notification_shown', 'true');
                this.showUpdateNotification(currentVersion);
            }
        }
    }
    
    showUpdateNotification(version) {
        const notification = document.getElementById('updateNotification');
        if (notification) {
            notification.classList.add('show');
            notification.classList.remove('hidden');
        }
    }
    
    hideUpdateNotification() {
        const notification = document.getElementById('updateNotification');
        if (notification) {
            notification.classList.remove('show');
            notification.classList.add('hidden');
        }
    }
    
    async showCacheClearDialog() {
        console.log('📋 showCacheClearDialog() called');
        
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal cache-clear-modal';
            modal.style.cssText = `
                display: flex !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0, 0, 0, 0.85) !important;
                backdrop-filter: blur(10px) !important;
                z-index: 99999 !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 20px !important;
            `;
            
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 500px; width: 100%; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 2px solid rgba(0, 255, 255, 0.3); border-radius: 20px; padding: 0; display: flex; flex-direction: column; max-height: 90vh;">
                    <div class="modal-header" style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(138, 43, 226, 0.1)); padding: 25px; border-bottom: 1px solid rgba(0, 255, 255, 0.2); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
                        <h3 style="margin: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 12px;">
                            <i class="fas fa-trash-alt" style="color: var(--primary-cyan);"></i>
                            Hapus Cache
                        </h3>
                        <button id="btnCloseModal" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: rgba(255, 255, 255, 0.8); width: 36px; height: 36px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s;" onmouseover="this.style.background='rgba(255, 0, 0, 0.2)'; this.style.borderColor='rgba(255, 0, 0, 0.5)'; this.style.color='#ff5555';" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.color='rgba(255, 255, 255, 0.8)';">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 30px; overflow-y: auto; flex: 1;">
                        <p style="margin-bottom: 25px; color: rgba(255, 255, 255, 0.9); line-height: 1.6;">
                            Pilih data yang ingin dihapus:
                        </p>
                        
                        <div class="cache-options" style="display: flex; flex-direction: column; gap: 15px;">
                            <label class="cache-option" style="display: flex; align-items: center; gap: 12px; padding: 15px; background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 12px; cursor: pointer; transition: all 0.3s;">
                                <input type="checkbox" id="clearAppCache" checked style="width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary-cyan);">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">Cache Aplikasi</div>
                                    <div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.6);">HTML, CSS, JavaScript, dan aset lainnya</div>
                                </div>
                            </label>
                            
                            <label class="cache-option" style="display: flex; align-items: center; gap: 12px; padding: 15px; background: rgba(138, 43, 226, 0.05); border: 1px solid rgba(138, 43, 226, 0.2); border-radius: 12px; cursor: pointer; transition: all 0.3s;">
                                <input type="checkbox" id="clearQuranCache" style="width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary-purple);">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">Data Al-Quran <span style="color: var(--primary-cyan); font-size: 0.85rem;">(~2.5 GB)</span></div>
                                    <div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.6);">Teks ayat dan audio offline</div>
                                </div>
                            </label>
                        </div>
                        
                        <div style="margin-top: 20px; padding: 15px; background: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 10px;">
                            <div style="display: flex; gap: 10px; align-items: flex-start;">
                                <i class="fas fa-info-circle" style="color: #ffc107; margin-top: 2px;"></i>
                                <div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.8); line-height: 1.5;">
                                    <strong>Catatan:</strong> Pengaturan aplikasi dan lokasi akan tetap tersimpan. Jika tidak mencentang Al-Quran, data offline akan dipertahankan.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" style="display: flex; gap: 10px; padding: 20px 30px; background: rgba(0, 0, 0, 0.2); border-top: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0 0 18px 18px; flex-shrink: 0;">
                        <button id="btnCancelClear" style="flex: 1; padding: 12px 24px; background: rgba(255, 255, 255, 0.1); color: var(--text-primary); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='rgba(255, 255, 255, 0.15)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)';">
                            <i class="fas fa-times-circle"></i> Batal
                        </button>
                        <button id="btnConfirmClear" style="flex: 1; padding: 12px 24px; background: linear-gradient(135deg, #00ffff, #8a2be2); color: #000; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0, 255, 255, 0.4);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0, 255, 255, 0.6)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0, 255, 255, 0.4)';">
                            <i class="fas fa-trash-alt"></i> Hapus Cache
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add hover effects
            const cacheOptions = modal.querySelectorAll('.cache-option');
            cacheOptions.forEach(option => {
                option.addEventListener('mouseenter', () => {
                    option.style.transform = 'translateX(5px)';
                    option.style.background = option.querySelector('#clearAppCache') 
                        ? 'rgba(0, 255, 255, 0.1)' 
                        : 'rgba(138, 43, 226, 0.1)';
                });
                option.addEventListener('mouseleave', () => {
                    option.style.transform = 'translateX(0)';
                    option.style.background = option.querySelector('#clearAppCache') 
                        ? 'rgba(0, 255, 255, 0.05)' 
                        : 'rgba(138, 43, 226, 0.05)';
                });
            });
            
            // Button handlers
            const btnClose = modal.querySelector('#btnCloseModal');
            const btnCancel = modal.querySelector('#btnCancelClear');
            const btnConfirm = modal.querySelector('#btnConfirmClear');
            const checkboxQuran = modal.querySelector('#clearQuranCache');
            
            // Close button (X)
            btnClose.addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });
            
            btnCancel.addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });
            
            btnConfirm.addEventListener('click', () => {
                const clearQuran = checkboxQuran.checked;
                modal.remove();
                resolve({
                    keepQuran: !clearQuran
                });
            });
            
            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            });
        });
    }

    async clearAllCache() {
        try {
            // Show selection dialog
            const shouldClear = await this.showCacheClearDialog();
            
            if (!shouldClear) {
                return;
            }
            
            const loadingOverlay = this.showCacheLoadingOverlay();
            
            // First, hide any update notifications to stop the loop
            this.hideUpdateNotification();
            
            // 1. Unregister all service workers
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) {
                    await registration.unregister();
                    console.log('Service worker unregistered');
                }
            }
            
            // 2. Clear all caches (with exclusions)
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => {
                        // Skip Al-Quran cache if user chose to keep it
                        if (shouldClear.keepQuran && cacheName.includes('alquran')) {
                            console.log('Keeping cache:', cacheName);
                            return Promise.resolve();
                        }
                        console.log('Deleting cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            }
            
            // 3. Clear localStorage (but keep user preferences and Al-Quran if selected)
            const preserveKeys = ['islamhub_settings', 'islamhub_location'];
            
            // If keep Al-Quran is selected, preserve all alquran keys
            if (shouldClear.keepQuran) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (key.startsWith('alquran_') || key.includes('offline'))) {
                        preserveKeys.push(key);
                    }
                }
            }
            
            const localStorageBackup = {};
            preserveKeys.forEach(key => {
                const value = localStorage.getItem(key);
                if (value) localStorageBackup[key] = value;
            });
            localStorage.clear();
            Object.keys(localStorageBackup).forEach(key => {
                localStorage.setItem(key, localStorageBackup[key]);
            });
            
            // Save current version and clear notification flags
            localStorage.setItem('islamhub_app_version', '1.2.1');
            localStorage.removeItem('islamhub_update_notification_shown');
            
            // 4. Clear sessionStorage
            sessionStorage.clear();
            
            // 5. Clear IndexedDB (if any)
            if ('indexedDB' in window) {
                const dbs = await indexedDB.databases();
                dbs.forEach(db => {
                    if (db.name && db.name.includes('islamhub')) {
                        indexedDB.deleteDatabase(db.name);
                        console.log('Deleted IndexedDB:', db.name);
                    }
                });
            }
            
            console.log('Cache cleared successfully');
            
            // Show success message briefly
            if (loadingOverlay) {
                const message = loadingOverlay.querySelector('p');
                if (message) {
                    message.textContent = '✓ Cache berhasil dihapus! Memuat ulang...';
                }
            }
            
            // Reload page after short delay
            setTimeout(() => {
                window.location.reload(true);
            }, 1500);
            
        } catch (error) {
            console.error('Error clearing cache:', error);
            if (loadingOverlay) loadingOverlay.remove();
            this.showDialog('error', 'Gagal membersihkan cache: ' + error.message);
        }
    }
    
    showCacheLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'cache-loading-overlay';
        overlay.innerHTML = `
            <div class="cache-spinner"></div>
            <h3>Membersihkan Data...</h3>
            <p>Mohon tunggu sebentar</p>
        `;
        overlay.style.display = 'flex';
        document.body.appendChild(overlay);
        console.log('[Cache Loading] Overlay appended to body');
        return overlay;
    }
    
    // Emergency function to stop update loops
    emergencyReset() {
        console.log('Emergency reset initiated...');
        
        // Clear all update-related localStorage
        localStorage.setItem('islamhub_app_version', '1.2.2');
        localStorage.removeItem('islamhub_update_notification_shown');
        localStorage.removeItem('islamhub_last_active_app');
        
        // Hide any notification
        this.hideUpdateNotification();
        
        // Unregister all service workers
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => registration.unregister());
            });
        }
        
        console.log('Emergency reset completed. Refreshing page...');
        setTimeout(() => {
            window.location.reload(true);
        }, 1000);
    }
    
    // ===== CLEAR DATA FEATURE (WEB ONLY) =====
    
    setupClearDataButton() {
        // Only show on web, not native apps
        if (this.isNative) {
            console.log('[Clear Data] Skipped - native app');
            return;
        }
        
        const clearDataSection = document.getElementById('clearDataSection');
        const btnClearData = document.getElementById('btnClearData');
        const modal = document.getElementById('clearDataModal');
        const closeModal = document.getElementById('closeClearDataModal');
        const cancelBtn = document.getElementById('cancelClearData');
        const confirmBtn = document.getElementById('confirmClearData');
        
        console.log('[Clear Data] Setup:', {
            section: !!clearDataSection,
            button: !!btnClearData,
            modal: !!modal,
            closeBtn: !!closeModal,
            cancelBtn: !!cancelBtn,
            confirmBtn: !!confirmBtn
        });
        
        // Show clear data button
        if (clearDataSection) {
            clearDataSection.style.display = 'block';
        }
        
        // Open modal
        if (btnClearData && modal) {
            btnClearData.addEventListener('click', () => {
                console.log('[Clear Data] Button clicked, opening modal');
                console.log('[Clear Data] Modal element:', modal);
                console.log('[Clear Data] Modal classes before:', modal.className);
                
                // Check current computed styles
                const beforeStyles = window.getComputedStyle(modal);
                console.log('[Clear Data] Before - Position:', beforeStyles.position, 'Z-index:', beforeStyles.zIndex, 'Display:', beforeStyles.display, 'Visibility:', beforeStyles.visibility, 'Opacity:', beforeStyles.opacity);
                
                modal.classList.add('show');
                // Force visibility with inline styles as fallback
                modal.style.opacity = '1';
                modal.style.visibility = 'visible';
                modal.style.display = 'flex';
                
                console.log('[Clear Data] Modal classes after:', modal.className);
                
                // Check after styles
                setTimeout(() => {
                    const afterStyles = window.getComputedStyle(modal);
                    console.log('[Clear Data] After - Position:', afterStyles.position, 'Z-index:', afterStyles.zIndex, 'Display:', afterStyles.display, 'Visibility:', afterStyles.visibility, 'Opacity:', afterStyles.opacity);
                }, 100);
                
                console.log('[Clear Data] Modal displayed');
            });
        }
        
        // Close modal handlers
        const closeModalHandler = () => {
            console.log('[Clear Data] Closing modal');
            if (modal) {
                modal.classList.remove('show');
                // Reset inline styles
                modal.style.opacity = '';
                modal.style.visibility = '';
                modal.style.display = '';
            }
        };
        
        if (closeModal) closeModal.addEventListener('click', closeModalHandler);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModalHandler);
        
        // Click outside to close
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModalHandler();
                }
            });
        }
        
        // Confirm clear data
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                console.log('[Clear Data] Confirm clicked');
                this.performClearData();
            });
        }
    }
    
    async performClearData() {
        const clearCache = document.getElementById('clearCache').checked;
        const clearLocalStorage = document.getElementById('clearLocalStorage').checked;
        const clearIndexedDB = document.getElementById('clearIndexedDB').checked;
        const clearAudio = document.getElementById('clearAudio').checked;
        
        console.log('Clear data requested:', { clearCache, clearLocalStorage, clearIndexedDB, clearAudio });
        
        // Close modal first
        const modal = document.getElementById('clearDataModal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        let clearedItems = [];
        
        try {
            // Show loading overlay with slight delay to ensure modal closes first
            await new Promise(resolve => setTimeout(resolve, 100));
            const overlay = this.showCacheLoadingOverlay();
            console.log('[Clear Data] Overlay created:', overlay);
            
            // 1. Clear Cache Storage
            if (clearCache && 'caches' in window) {
                const cacheNames = await caches.keys();
                for (const name of cacheNames) {
                    // Don't clear audio cache unless specifically requested
                    if (name.includes('audio') && !clearAudio) {
                        console.log('Skipping audio cache:', name);
                        continue;
                    }
                    await caches.delete(name);
                    console.log('Deleted cache:', name);
                }
                clearedItems.push('Cache aplikasi');
            }
            
            // 2. Clear LocalStorage (except audio download status if not requested)
            if (clearLocalStorage) {
                const keysToPreserve = [];
                
                if (!clearAudio) {
                    // Preserve audio download status
                    const keys = Object.keys(localStorage);
                    keys.forEach(key => {
                        if (key.includes('audio_downloaded') || key.includes('alquran_audio')) {
                            keysToPreserve.push({ key, value: localStorage.getItem(key) });
                        }
                    });
                }
                
                localStorage.clear();
                
                // Restore preserved keys
                keysToPreserve.forEach(({ key, value }) => {
                    localStorage.setItem(key, value);
                });
                
                clearedItems.push('Data lokal');
            }
            
            // 3. Clear IndexedDB
            if (clearIndexedDB && 'indexedDB' in window) {
                const databases = await indexedDB.databases();
                for (const db of databases) {
                    // Skip audio database unless requested
                    if (db.name && db.name.includes('audio') && !clearAudio) {
                        console.log('Skipping audio database:', db.name);
                        continue;
                    }
                    indexedDB.deleteDatabase(db.name);
                    console.log('Deleted IndexedDB:', db.name);
                }
                clearedItems.push('Data Al-Quran');
            }
            
            // 4. Clear Audio (if specifically requested)
            if (clearAudio && 'caches' in window) {
                const cacheNames = await caches.keys();
                for (const name of cacheNames) {
                    if (name.includes('audio')) {
                        await caches.delete(name);
                        console.log('Deleted audio cache:', name);
                    }
                }
                
                // Clear audio-related localStorage
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.includes('audio_downloaded') || key.includes('alquran_audio')) {
                        localStorage.removeItem(key);
                    }
                });
                
                clearedItems.push('Audio Al-Quran');
            }
            
            // Unregister service worker if cache cleared
            if (clearCache && 'serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                    console.log('Unregistered service worker');
                }
            }
            
            // Update overlay message
            const overlayText = overlay.querySelector('h3');
            if (overlayText) {
                overlayText.textContent = '✓ Data Berhasil Dihapus!';
            }
            const overlaySubtext = overlay.querySelector('p');
            if (overlaySubtext) {
                overlaySubtext.textContent = 'Memuat ulang aplikasi...';
            }
            
            // Close modal
            const modal = document.getElementById('clearDataModal');
            if (modal) {
                modal.classList.remove('show');
                modal.style.display = '';
            }
            
            console.log('Data cleared successfully:', clearedItems);
            
            // Reload after short delay
            if (clearedItems.length > 0) {
                setTimeout(() => {
                    window.location.reload(true);
                }, 1500);
            } else {
                overlay.remove();
                this.showToast('Tidak ada data yang dipilih', 'info');
            }
            
        } catch (error) {
            console.error('Error clearing data:', error);
            const overlay = document.querySelector('.cache-loading-overlay');
            if (overlay) overlay.remove();
            this.showToast('❌ Gagal menghapus data: ' + error.message, 'error');
        }
    }
    
    showToast(message, type = 'info') {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? 'rgba(0, 255, 102, 0.95)' : 'rgba(255, 51, 102, 0.95)'};
            color: #000;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            animation: slideDown 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize app when DOM is ready
function initApp() {
    window.islamHub = new IslamHubApp();
    window.islamHub.init();
    
    // Make emergency reset globally available
    window.emergencyReset = () => window.islamHub.emergencyReset();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM already loaded, init immediately
    initApp();
}

// Export for use in other modules
export default IslamHubApp;
