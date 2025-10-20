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
    }

    async init() {
        console.log('Initializing IslamHub...');
        
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
        
        // Show floating widget on home
        this.updateFloatingWidgetVisibility('home');
        
        // Setup floating widget toggle
        this.setupFloatingWidgetToggle();
        
        // Setup PWA install button
        this.setupInstallButton();
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
                moreAppsDropdown.classList.toggle('show');
            });
            
            // Close dropdown
            closeDropdown.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Closing dropdown');
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
        
        // Show target app
        const targetApp = document.getElementById(`${appName}-app`);
        if (targetApp) {
            targetApp.classList.add('active');
        }
        
        // Update active nav states
        document.querySelectorAll(`.bottom-nav-item[data-app="${appName}"]`).forEach(nav => {
            nav.classList.add('active');
        });
        
        // Load app if not loaded yet
        if (!this.loadedApps.has(appName) && appName !== 'home') {
            await this.loadApp(appName);
        }
        
        this.currentApp = appName;
        
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
                'waris': 'waris-app.js',
                'qibla': 'qibla-app.js',
                'sholat': 'sholat-app.js',
                'sirah': 'sirah-app.js'
            };
            
            const fileName = appFiles[appName];
            if (!fileName) {
                throw new Error(`Unknown app: ${appName}`);
            }
            
            // Map app names to folder names
            const folderMap = {
                'adzan': 'adzan',
                'dzikir': 'dzikir',
                'waris': 'kalkulator',
                'qibla': 'qibla',
                'sholat': 'sholat',
                'sirah': 'sirah'
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
            } else if (appName === 'sirah') {
                window.sirahApp = appInstance;
            } else if (appName === 'waris') {
                window.warisApp = appInstance;
            } else if (appName === 'sholat') {
                window.sholatApp = appInstance;
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
        let deferredPrompt;
        const installButton = document.getElementById('installButton');

        if (!installButton) {
            console.log('Install button not found');
            return;
        }

        // Check if app is already installed (standalone mode)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                            window.navigator.standalone === true;
        
        if (isStandalone) {
            console.log('App already running in standalone mode');
            installButton.style.display = 'none';
            return;
        }

        console.log('Checking PWA install eligibility...');

        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired!');
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = e;
            // Show install button
            installButton.style.display = 'inline-flex';
            console.log('PWA install button shown');
        });

        // Show button immediately if not standalone
        if (!isStandalone) {
            console.log('Showing install button (available)');
            installButton.style.display = 'inline-flex';
        }

        // Handle install button click
        installButton.addEventListener('click', async () => {
            if (!deferredPrompt) {
                console.log('No deferred prompt, showing manual instructions');
                // If no install prompt, show info message
                alert('Untuk menginstall aplikasi:\n\n' +
                      'Mobile Chrome: Menu (⋮) → "Tambahkan ke Layar Utama"\n' +
                      'Mobile Safari: Share → "Add to Home Screen"\n' +
                      'Desktop Chrome: Klik icon ⊕ di address bar\n' +
                      'Desktop Edge: Menu → "Aplikasi" → "Install IslamHub"\n\n' +
                      'Pastikan menggunakan HTTPS dan browser mendukung PWA.');
                return;
            }

            console.log('Showing native install prompt...');
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            
            // Clear the deferredPrompt
            deferredPrompt = null;
            installButton.style.display = 'none';
        });

        // Handle app installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed successfully!');
            installButton.style.display = 'none';
            deferredPrompt = null;
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.islamHub = new IslamHubApp();
    window.islamHub.init();
});

// Export for use in other modules
export default IslamHubApp;
