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
        
        // Check if we should restore last active app
        const lastActiveApp = localStorage.getItem('islamhub_last_active_app');
        if (lastActiveApp && lastActiveApp !== 'home') {
            console.log('Restoring last active app:', lastActiveApp);
            await this.switchApp(lastActiveApp);
        } else {
            // Show floating widget on home
            this.updateFloatingWidgetVisibility('home');
        }
        
        // Setup floating widget toggle
        this.setupFloatingWidgetToggle();
        
        // Register Service Worker for PWA
        this.registerServiceWorker();
        
        // Setup PWA install button
        this.setupInstallButton();
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                console.log('Registering Service Worker...');
                const registration = await navigator.serviceWorker.register('/islamhub/sw.js', {
                    scope: '/islamhub/'
                });
                
                console.log('Service Worker registered successfully:', registration.scope);
                
                // Check for updates on page load
                registration.update();
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('Service Worker update found!');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('New Service Worker installed, refresh to update');
                            // Optionally show a notification to the user
                            if (confirm('Update aplikasi tersedia. Refresh sekarang?')) {
                                window.location.reload();
                            }
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        } else {
            console.log('Service Worker not supported in this browser');
        }
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
        
        // If app is in dropdown (waris, qibla, sirah, sholat), activate 'More Apps' button
        const dropdownApps = ['waris', 'qibla', 'sirah', 'sholat'];
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
                'alquran': 'alquran',
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
            } else if (appName === 'alquran') {
                window.alquranApp = appInstance;
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
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.islamHub = new IslamHubApp();
    window.islamHub.init();
});

// Export for use in other modules
export default IslamHubApp;
