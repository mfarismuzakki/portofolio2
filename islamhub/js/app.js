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
        
        // If app is in dropdown (waris, qibla, sirah), activate 'More Apps' button
        const dropdownApps = ['waris', 'qibla', 'sirah'];
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

        console.log('Setting up PWA install button...');

        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired! PWA is installable');
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = e;
            // Show install button
            installButton.style.display = 'inline-flex';
            installButton.innerHTML = '<i class="fas fa-download"></i><span>Install Aplikasi</span>';
        });

        // Show button by default (will show instructions if prompt not available)
        installButton.style.display = 'inline-flex';

        // Handle install button click
        installButton.addEventListener('click', async () => {
            console.log('Install button clicked');
            
            if (!deferredPrompt) {
                console.warn('No deferred prompt available');
                console.log('Checking PWA criteria...');
                
                const issues = [];
                
                // Check service worker
                if (!('serviceWorker' in navigator)) {
                    issues.push('Browser tidak mendukung Service Worker');
                } else {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    if (registrations.length === 0) {
                        console.error('Service worker not registered');
                        issues.push('Service Worker belum registered');
                    } else {
                        console.log('Service worker registered:', registrations.length);
                        const sw = registrations[0];
                        console.log('SW State:', sw.active?.state);
                        console.log('SW Scope:', sw.scope);
                    }
                }
                
                // Check manifest
                const manifestLink = document.querySelector('link[rel="manifest"]');
                if (!manifestLink) {
                    console.error('Manifest link not found');
                    issues.push('Manifest link tidak ditemukan');
                } else {
                    console.log('Manifest link exists:', manifestLink.href);
                    
                    // Fetch and validate manifest
                    try {
                        const response = await fetch(manifestLink.href);
                        const manifest = await response.json();
                        console.log('Manifest content:', manifest);
                        
                        // Check required fields
                        if (!manifest.name && !manifest.short_name) {
                            issues.push('Manifest: name/short_name missing');
                        }
                        if (!manifest.start_url) {
                            issues.push('Manifest: start_url missing');
                        }
                        if (!manifest.display || manifest.display === 'browser') {
                            issues.push('Manifest: display must be standalone/fullscreen');
                        }
                        if (!manifest.icons || manifest.icons.length === 0) {
                            issues.push('Manifest: icons missing');
                        } else {
                            const has192 = manifest.icons.some(icon => 
                                icon.sizes.includes('192x192') || icon.sizes.includes('192')
                            );
                            const has512 = manifest.icons.some(icon => 
                                icon.sizes.includes('512x512') || icon.sizes.includes('512')
                            );
                            if (!has192 || !has512) {
                                issues.push('Manifest: perlu icon 192x192 dan 512x512');
                            }
                        }
                        
                        if (issues.length === 0) {
                            console.log('Manifest valid');
                        }
                    } catch (error) {
                        console.error('Failed to fetch manifest:', error);
                        issues.push('Gagal load manifest.json');
                    }
                }
                
                // Check HTTPS
                if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
                    console.warn('Not HTTPS');
                    issues.push('Bukan HTTPS (butuh HTTPS untuk PWA)');
                } else {
                    console.log('Using secure context');
                }
                
                // Check if already installed
                if (window.matchMedia('(display-mode: standalone)').matches) {
                    console.log('App already running in standalone mode');
                    issues.push('Aplikasi sudah terinstall');
                }
                
                // Build message
                let message = '';
                if (issues.length > 0) {
                    message += 'Status PWA:\n\n' + issues.join('\n') + '\n\n';
                }
                

                try {
                    this.showInstallDialog(message);
                    console.log('✅ Dialog shown successfully');
                } catch (error) {
                    console.error('Error showing dialog:', error);
                    // Fallback to alert if dialog fails
                    alert(message);
                }
                return;
            }

            console.log('📱 Showing native install prompt...');
            
            try {
                // Show the install prompt
                deferredPrompt.prompt();
                
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                
                console.log(`User response: ${outcome}`);
                
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    this.showInstallDialog('Terima kasih! Aplikasi sedang diinstall...', 'success');
                } else {
                    console.log('User dismissed the install prompt');
                }
                
                // Clear the deferredPrompt
                deferredPrompt = null;
                installButton.style.display = 'none';
            } catch (error) {
                console.error('Error showing install prompt:', error);
                this.showInstallDialog('Gagal menampilkan prompt install.\n\nSilakan coba refresh halaman atau install manual dari menu browser.');
            }
        });

        // Handle app installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed successfully!');
            installButton.style.display = 'none';
            deferredPrompt = null;
            this.showInstallDialog('Aplikasi berhasil diinstall! 🎉', 'success');
        });
    }
    
    showInstallDialog(message, type = 'info') {
        console.log('showInstallDialog called with type:', type);
        
        // Remove existing dialog if any
        const existingDialog = document.querySelector('.install-dialog');
        if (existingDialog) {
            existingDialog.remove();
            console.log('Removed existing dialog');
        }
        
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
            // Special styling for install instructions
            dialog.innerHTML = `
                <div class="install-dialog-content install-instructions" style="
                    background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
                    color: #ffffff;
                    padding: 2.5rem;
                    border-radius: 20px;
                    max-width: 650px;
                    width: 90%;
                    max-height: 85vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                    border: 2px solid rgba(0, 243, 255, 0.4);
                    position: relative;
                ">
                    <button class="dialog-close" onclick="this.closest('.install-dialog').remove()" style="
                        position: absolute;
                        top: 1.5rem;
                        right: 1.5rem;
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        color: #00f3ff;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                        transition: all 0.3s ease;
                        z-index: 10;
                    ">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="dialog-header" style="text-align: center; margin-bottom: 2rem;">
                        <div class="dialog-icon-large" style="
                            width: 80px;
                            height: 80px;
                            background: linear-gradient(135deg, #00f3ff, #00b8ff);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 1.5rem;
                            font-size: 2.5rem;
                            color: #0a0a1f;
                            box-shadow: 0 10px 30px rgba(0, 243, 255, 0.3);
                        ">
                            <i class="fas fa-download"></i>
                        </div>
                        <h2 style="
                            font-size: 2rem;
                            font-weight: 700;
                            background: linear-gradient(135deg, #00f3ff, #ffffff);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            margin-bottom: 0.5rem;
                        ">Cara Install IslamHub</h2>
                        <p class="dialog-subtitle" style="
                            font-size: 1rem;
                            color: rgba(255, 255, 255, 0.7);
                            margin: 0;
                        ">Pilih metode sesuai perangkat Anda</p>
                    </div>
                    
                    <div class="install-methods" style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <!-- Chrome Desktop -->
                        <div class="install-method" style="
                            background: rgba(255, 255, 255, 0.05);
                            border: 1px solid rgba(0, 243, 255, 0.2);
                            border-radius: 15px;
                            padding: 1.5rem;
                        ">
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                                <div class="method-icon" style="
                                    width: 50px;
                                    height: 50px;
                                    background: linear-gradient(135deg, #4285f4, #0d47a1);
                                    border-radius: 12px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 1.8rem;
                                    color: white;
                                ">
                                    <i class="fab fa-chrome"></i>
                                </div>
                                <h3 style="
                                    font-size: 1.3rem;
                                    font-weight: 600;
                                    color: #00f3ff;
                                    margin: 0;
                                ">Chrome Desktop</h3>
                            </div>
                            <div class="method-steps" style="display: flex; flex-direction: column; gap: 1rem;">
                                <div class="step" style="display: flex; gap: 1rem; align-items: start;">
                                    <span class="step-number" style="
                                        min-width: 30px;
                                        height: 30px;
                                        background: linear-gradient(135deg, #00f3ff, #00b8ff);
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: 700;
                                        color: #0a0a1f;
                                        flex-shrink: 0;
                                    ">1</span>
                                    <div class="step-content">
                                        <strong style="color: #ffffff; display: block; margin-bottom: 0.25rem;">Cari icon install di address bar</strong>
                                        <p style="color: rgba(255, 255, 255, 0.7); margin: 0; font-size: 0.9rem;">Look for ⊕ or 🖥️ icon on the right side</p>
                                    </div>
                                </div>
                                <div class="step" style="display: flex; gap: 1rem; align-items: start;">
                                    <span class="step-number" style="
                                        min-width: 30px;
                                        height: 30px;
                                        background: linear-gradient(135deg, #00f3ff, #00b8ff);
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: 700;
                                        color: #0a0a1f;
                                        flex-shrink: 0;
                                    ">2</span>
                                    <div class="step-content">
                                        <strong style="color: #ffffff; display: block; margin-bottom: 0.25rem;">Atau via menu browser</strong>
                                        <p style="color: rgba(255, 255, 255, 0.7); margin: 0; font-size: 0.9rem;">Menu (⋮) → "Install IslamHub..."</p>
                                    </div>
                                </div>
                                <div class="step" style="display: flex; gap: 1rem; align-items: start;">
                                    <span class="step-number" style="
                                        min-width: 30px;
                                        height: 30px;
                                        background: linear-gradient(135deg, #00f3ff, #00b8ff);
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: 700;
                                        color: #0a0a1f;
                                        flex-shrink: 0;
                                    ">3</span>
                                    <div class="step-content">
                                        <strong style="color: #ffffff; display: block; margin-bottom: 0.25rem;">Alternatif: Create Shortcut</strong>
                                        <p style="color: rgba(255, 255, 255, 0.7); margin: 0; font-size: 0.9rem;">Menu → More Tools → Create Shortcut<br>
                                        ✓ Check "Open as window"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                            </div>
                        </div>
                        
                        <!-- Mobile Instructions -->
                        <div class="install-method" style="
                            background: rgba(255, 255, 255, 0.05);
                            border: 1px solid rgba(0, 243, 255, 0.2);
                            border-radius: 15px;
                            padding: 1.5rem;
                        ">
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                                <div class="method-icon" style="
                                    width: 50px;
                                    height: 50px;
                                    background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
                                    border-radius: 12px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 1.8rem;
                                    color: white;
                                ">
                                    <i class="fas fa-mobile-alt"></i>
                                </div>
                                <h3 style="
                                    font-size: 1.3rem;
                                    font-weight: 600;
                                    color: #00f3ff;
                                    margin: 0;
                                ">Mobile (Android/iOS)</h3>
                            </div>
                            <div class="method-steps" style="display: flex; flex-direction: column; gap: 1rem;">
                                <div class="step" style="display: flex; gap: 1rem; align-items: start;">
                                    <span class="step-number" style="
                                        min-width: 30px;
                                        height: 30px;
                                        background: linear-gradient(135deg, #00f3ff, #00b8ff);
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: 700;
                                        color: #0a0a1f;
                                        flex-shrink: 0;
                                    ">1</span>
                                    <div class="step-content">
                                        <strong style="color: #ffffff; display: block; margin-bottom: 0.25rem;">Tap menu browser</strong>
                                        <p style="color: rgba(255, 255, 255, 0.7); margin: 0; font-size: 0.9rem;">Tap (⋮) atau Share icon</p>
                                    </div>
                                </div>
                                <div class="step" style="display: flex; gap: 1rem; align-items: start;">
                                    <span class="step-number" style="
                                        min-width: 30px;
                                        height: 30px;
                                        background: linear-gradient(135deg, #00f3ff, #00b8ff);
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: 700;
                                        color: #0a0a1f;
                                        flex-shrink: 0;
                                    ">2</span>
                                    <div class="step-content">
                                        <strong style="color: #ffffff; display: block; margin-bottom: 0.25rem;">Install aplikasi</strong>
                                        <p style="color: rgba(255, 255, 255, 0.7); margin: 0; font-size: 0.9rem;">Pilih "Tambahkan ke Layar Utama" atau "Install app"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dialog-footer" style="
                        margin-top: 2rem;
                        padding-top: 1.5rem;
                        border-top: 1px solid rgba(0, 243, 255, 0.2);
                        text-align: center;
                    ">
                        <div class="pwa-requirements">
                            <h4 style="
                                font-size: 1.1rem;
                                color: #00f3ff;
                                margin-bottom: 1rem;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 0.5rem;
                            "><i class="fas fa-check-circle"></i> PWA Requirements Terpenuhi</h4>
                            <div class="requirements-list" style="
                                display: flex;
                                flex-wrap: wrap;
                                gap: 0.75rem;
                                justify-content: center;
                                margin-bottom: 1rem;
                            ">
                                <span class="req-item" style="
                                    background: rgba(0, 243, 255, 0.1);
                                    border: 1px solid rgba(0, 243, 255, 0.3);
                                    padding: 0.5rem 1rem;
                                    border-radius: 20px;
                                    font-size: 0.85rem;
                                    color: rgba(255, 255, 255, 0.9);
                                ">✅ HTTPS/Localhost</span>
                                <span class="req-item" style="
                                    background: rgba(0, 243, 255, 0.1);
                                    border: 1px solid rgba(0, 243, 255, 0.3);
                                    padding: 0.5rem 1rem;
                                    border-radius: 20px;
                                    font-size: 0.85rem;
                                    color: rgba(255, 255, 255, 0.9);
                                ">✅ Service Worker</span>
                                <span class="req-item" style="
                                    background: rgba(0, 243, 255, 0.1);
                                    border: 1px solid rgba(0, 243, 255, 0.3);
                                    padding: 0.5rem 1rem;
                                    border-radius: 20px;
                                    font-size: 0.85rem;
                                    color: rgba(255, 255, 255, 0.9);
                                ">✅ Manifest.json</span>
                                <span class="req-item" style="
                                    background: rgba(0, 243, 255, 0.1);
                                    border: 1px solid rgba(0, 243, 255, 0.3);
                                    padding: 0.5rem 1rem;
                                    border-radius: 20px;
                                    font-size: 0.85rem;
                                    color: rgba(255, 255, 255, 0.9);
                                ">✅ Icons Ready</span>
                            </div>
                            <p class="note" style="
                                font-size: 0.9rem;
                                color: rgba(255, 255, 255, 0.6);
                                margin: 0;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 0.5rem;
                            ">
                                <i class="fas fa-info-circle"></i>
                                Chrome may require 2-3 visits before showing install prompt
                            </p>
                        </div>
                    </div>
                    
                    <div class="dialog-buttons" style="
                        display: flex;
                        justify-content: center;
                        margin-top: 1.5rem;
                    ">
                        <button class="dialog-btn primary" onclick="this.closest('.install-dialog').remove()" style="
                            background: linear-gradient(135deg, #00f3ff, #00b8ff);
                            color: #0a0a1f;
                            border: none;
                            padding: 1rem 2.5rem;
                            border-radius: 50px;
                            font-size: 1.1rem;
                            font-weight: 600;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 0.75rem;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 15px rgba(0, 243, 255, 0.4);
                        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0, 243, 255, 0.6)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0, 243, 255, 0.4)'">
                            <i class="fas fa-check"></i> Mengerti
                        </button>
                    </div>
                </div>
            `;
        } else {
            // Regular dialog for other messages
            const formattedMessage = message
                .replace(/\n/g, '<br>')
                .replace(/•/g, '&bull;')
                .replace(/✅/g, '<span class="check-icon">✅</span>')
                .replace(/❌/g, '<span class="cross-icon">❌</span>')
                .replace(/⚠️/g, '<span class="warn-icon">⚠️</span>')
                .replace(/ℹ️/g, '<span class="info-icon">ℹ️</span>')
                .replace(/💡/g, '<span class="bulb-icon">💡</span>')
                .replace(/📋/g, '<span class="clipboard-icon">📋</span>')
                .replace(/🔍/g, '<span class="search-icon">🔍</span>');
            
            dialog.innerHTML = `
                <div class="install-dialog-content ${type}">
                    <button class="dialog-close" onclick="this.closest('.install-dialog').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="dialog-icon">
                        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                    </div>
                    <div class="dialog-message">${formattedMessage}</div>
                    <div class="dialog-buttons">
                        <button class="dialog-btn primary" onclick="this.closest('.install-dialog').remove()">
                            Mengerti
                        </button>
                    </div>
                </div>
            `;
        }
        
        document.body.appendChild(dialog);
        console.log('✅ Dialog appended to body');
        
        // Force content visibility
        const content = dialog.querySelector('.install-dialog-content');
        if (content) {
            content.style.cssText = `
                position: relative !important;
                background: var(--bg-card, #1e1e2e) !important;
                padding: 2rem !important;
                border-radius: 20px !important;
                max-width: 600px !important;
                width: 90% !important;
                max-height: 85vh !important;
                overflow-y: auto !important;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8) !important;
                border: 2px solid rgba(0, 243, 255, 0.3) !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                z-index: 1000000 !important;
            `;
            console.log('✅ Content styled inline');
        }
        
        // Debug: Log element existence
        console.log('Dialog element:', dialog);
        console.log('Dialog computed style:', window.getComputedStyle(dialog));
        console.log('Is dialog in body?', document.body.contains(dialog));
        
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
