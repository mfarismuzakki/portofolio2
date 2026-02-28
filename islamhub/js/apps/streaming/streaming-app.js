class StreamingApp {
    constructor() {
        this.currentStream = null;
        this.player = null;
        this.signalAnimationInterval = null;
        
        // Retry / reconnect state
        this.retryCount = 0;
        this.maxRetries = 8;
        this.retryBaseDelay = 3000; // ms, doubles each attempt
        this.retryTimeout = null;
        this.stalledTimeout = null;
        this.isRetrying = false;
        this._onlineHandler = null;
        
        // Radio stations
        this.radioStations = [
            {
                name: 'Radio Rodja',
                url: 'https://radioislamindonesia.com/rodja-low.mp3',
                description: 'Radio Dakwah Ahlus Sunnah',
                logo: 'assets/logo/rodja_fm.jpeg',
                color: 'rodja'
            },
            {
                name: 'Radio Tarbiyyah Sunnah',
                url: 'https://radioislamindonesia.com/tarbiyah.mp3',
                description: 'Radio Kajian Islam',
                logo: 'assets/logo/tarbiyyah_fm.png',
                color: 'tarbiyyah'
            }
        ];
        
        // Live Makkah & Madinah
        this.liveHaramain = [
            {
                name: 'Makkah Live',
                url: 'https://www.youtube.com/embed/HfN2GCUE4Ro',
                description: 'Live streaming 24/7 dari Masjidil Haram Makkah',
                icon: 'fas fa-kaaba',
                color: 'makkah'
            },
            {
                name: 'Madinah Live',
                url: 'https://www.youtube.com/embed/uzRUh-4oSj0',
                description: 'Live streaming 24/7 dari Masjid Nabawi Madinah',
                icon: 'fas fa-mosque',
                color: 'madinah'
            }
        ];
        
        // Video streaming channels
        this.videoChannels = [
            {
                name: 'Khalid Basalamah TV',
                url: 'https://www.youtube.com/embed/63ftY04qXVk',
                description: 'Kajian Ilmiah 24/7 dari Ustadz Khalid Basalamah',
                logo: 'assets/logo/khalid_tv.jpg',
                color: 'khalid'
            },
            {
                name: 'Syafiq Riza Basalamah TV',
                url: 'https://www.youtube.com/embed/UBEBkz6SKTk',
                description: 'Siaran 24 Jam dari Ustadz Syafiq Riza Basalamah',
                logo: 'assets/logo/syafiq_tv.jpg',
                color: 'syafiq'
            },
            {
                name: 'Rodja TV',
                url: 'https://rodja.tv/live/',
                description: 'Live Streaming TV Dakwah Ahlus Sunnah',
                logo: 'assets/logo/rodja_tv.png',
                color: 'rodja'
            }
        ];
        
        // YouTube channel IDs for kajian
        this.channels = [
            {
                name: 'Khalid Basalamah',
                channelId: 'UCnRJFoeLCqZXopKZhrj_z_g',
                description: 'Kajian Islam dari Ustadz Khalid Basalamah',
                icon: 'fas fa-user-tie'
            },
            {
                name: 'Ammi Nur Baits',
                channelId: 'UCT2JIqKj_CZT68qUJVvzf1Q',
                description: 'Kajian Islam dari Ustadz Ammi Nur Baits',
                icon: 'fas fa-graduation-cap'
            },
            {
                name: 'Syafiq Riza Basalamah',
                channelId: 'UCYRCsBAL4_iW9VPi7e2KO3Q',
                description: 'Kajian Islam dari Ustadz Syafiq Riza Basalamah',
                icon: 'fas fa-book-reader'
            }
        ];
    }

    render() {
        return `
            <div class="streaming-container">
                <div class="streaming-header">
                    <h1><i class="fas fa-broadcast-tower"></i> Streaming Kajian Islam</h1>
                    <p class="subtitle">Radio dan video streaming kajian Islam live 24/7</p>
                </div>

                <!-- Radio Streaming Section -->
                <div class="streaming-section">
                    <div class="section-header">
                        <i class="fas fa-radio"></i>
                        <h2>Streaming Radio Kajian</h2>
                    </div>
                    
                    ${this.radioStations.map((station, index) => `
                        <div class="radio-card radio-${station.color}">
                            <div class="radio-info">
                                <div class="radio-logo">
                                    <img src="${station.logo}" alt="${station.name}" onerror="this.style.display='none'">
                                </div>
                                <div class="radio-details">
                                    <h3>${station.name}</h3>
                                    <p>${station.description}</p>
                                    <div class="radio-status" id="radioStatus${index}">
                                        <span class="status-dot"></span>
                                        <span>Siap Streaming</span>
                                    </div>
                                </div>
                            </div>
                            <button class="btn-radio" id="btnRadio${index}" data-station-index="${index}">
                                <i class="fas fa-play"></i>
                                <span>Putar Radio</span>
                            </button>
                        </div>
                    `).join('')}
                    <!-- Radio audio is controlled via the global #quranAudioPlayer in #bottom-dock -->
                </div>

                <!-- Video Streaming Section -->
                <div class="streaming-section">
                    <div class="section-header">
                        <i class="fas fa-tv"></i>
                        <h2>Streaming Video Kajian</h2>
                    </div>
                    <p class="section-description">
                        Tonton live streaming TV dakwah Islam langsung dari browser
                    </p>
                    
                    ${this.videoChannels.map((channel, index) => `
                        <div class="video-card video-${channel.color}">
                            <div class="video-info">
                                <div class="video-logo">
                                    <img src="${channel.logo}" alt="${channel.name}" onerror="this.style.display='none'">
                                </div>
                                <div class="video-details">
                                    <h3>${channel.name}</h3>
                                    <p>${channel.description}</p>
                                    <div class="video-status">
                                        <span class="status-dot live"></span>
                                        <span>Live 24/7</span>
                                    </div>
                                </div>
                            </div>
                            <button class="btn-video" onclick="window.streamingApp.openVideoStream('${channel.url}', '${channel.name}')">
                                <i class="fas fa-play-circle"></i>
                                <span>Tonton Live</span>
                            </button>
                        </div>
                    `).join('')}
                </div>

                <!-- Live Haramain Section -->
                <div class="streaming-section">
                    <div class="section-header">
                        <i class="fas fa-kaaba"></i>
                        <h2>Live Makkah & Madinah</h2>
                    </div>
                    <p class="section-description">
                        Saksikan langsung suasana Masjidil Haram dan Masjid Nabawi 24 jam
                    </p>
                    
                    ${this.liveHaramain.map((live, index) => `
                        <div class="video-card video-${live.color}">
                            <div class="video-info">
                                <div class="video-icon">
                                    <i class="${live.icon}"></i>
                                </div>
                                <div class="video-details">
                                    <h3>${live.name}</h3>
                                    <p>${live.description}</p>
                                    <div class="video-status">
                                        <span class="status-dot live"></span>
                                        <span>Live 24/7</span>
                                    </div>
                                </div>
                            </div>
                            <button class="btn-video" onclick="window.streamingApp.openVideoStream('${live.url}', '${live.name}')">
                                <i class="fas fa-play-circle"></i>
                                <span>Tonton Live</span>
                            </button>
                        </div>
                    `).join('')}
                </div>

                <!-- Tips Section -->
                <div class="streaming-tips">
                    <div class="tip-card">
                        <i class="fas fa-lightbulb"></i>
                        <div class="tip-content">
                            <h4>Tips Streaming</h4>
                            <ul>
                                <li>Pastikan koneksi internet stabil untuk streaming lancar</li>
                                <li>Live Haramain menampilkan suasana Makkah & Madinah realtime 24/7</li>
                                <li>Radio streaming akan diputar langsung di aplikasi</li>
                                <li>Video streaming kajian akan dibuka di aplikasi</li>
                                <li>Gunakan WiFi untuk menghemat kuota internet</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Video Modal -->
            <div class="video-modal" id="videoModal">
                <div class="video-modal-content">
                    <div class="video-modal-header">
                        <h3 id="videoModalTitle">Live Streaming</h3>
                        <button class="video-modal-close" onclick="window.streamingApp.closeVideoStream()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="video-modal-body">
                        <iframe id="videoIframe" src="" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        console.log('[Streaming] Initializing...');
        
        // Render content
        const container = document.getElementById('streaming-app');
        if (container) {
            container.innerHTML = this.render();
            console.log('[Streaming] Content rendered');
        }
        
        // Setup event listeners after render
        this.setupEventListeners();
        
        console.log('[Streaming] Initialized successfully');
    }

    setupEventListeners() {
        // Setup buttons for each radio station
        this.radioStations.forEach((station, index) => {
            const btn = document.getElementById(`btnRadio${index}`);
            if (btn) {
                btn.addEventListener('click', () => this.toggleRadio(index));
            }
        });
        
        // Audio error/reconnect handling (radioPlayer is the persistent global element)
        const radioPlayer = document.getElementById('radioPlayer');
        this.setupAudioErrorHandling(radioPlayer);
        
        // Simulate signal strength animation (updates global player icon)
        this.startSignalAnimation();
    }

    setupAudioErrorHandling(radioPlayer) {
        if (!radioPlayer) return;

        // #radioPlayer is now persistent in #bottom-dock. Guard against
        // attaching duplicate listeners when a new streaming app instance is created.
        if (radioPlayer._streamingHandlersAttached) return;
        radioPlayer._streamingHandlersAttached = true;

        // All handlers delegate to window.streamingApp so they always call
        // methods on the CURRENT active instance (even after page re-init).

        // Error: network dropped, bad URL, etc.
        radioPlayer.addEventListener('error', () => {
            const sa = window.streamingApp;
            if (sa && sa.currentStream !== null && !sa.isRetrying) {
                console.warn('[Streaming] Audio error detected, scheduling retry...');
                sa.scheduleRetry('error');
            }
        });

        // Stalled: browser stopped receiving data unexpectedly
        radioPlayer.addEventListener('stalled', () => {
            const sa = window.streamingApp;
            if (sa && sa.currentStream !== null && !sa.isRetrying) {
                // Give it 8 seconds before treating stall as a real disconnect
                clearTimeout(sa.stalledTimeout);
                sa.stalledTimeout = setTimeout(() => {
                    const sa2 = window.streamingApp;
                    if (sa2 && sa2.currentStream !== null && !sa2.isRetrying) {
                        console.warn('[Streaming] Stream stalled, scheduling retry...');
                        sa2.scheduleRetry('stalled');
                    }
                }, 8000);
            }
        });

        // Waiting: temporary buffer underrun — reset stall timer
        radioPlayer.addEventListener('waiting', () => {
            const sa = window.streamingApp;
            if (sa && sa.currentStream !== null && !sa.isRetrying) {
                clearTimeout(sa.stalledTimeout);
                sa.stalledTimeout = setTimeout(() => {
                    const sa2 = window.streamingApp;
                    if (sa2 && sa2.currentStream !== null && !sa2.isRetrying) {
                        console.warn('[Streaming] Stream waiting too long, scheduling retry...');
                        sa2.scheduleRetry('waiting');
                    }
                }, 15000);
            }
        });

        // Playing: connection healthy, reset retry counters
        radioPlayer.addEventListener('playing', () => {
            const sa = window.streamingApp;
            if (!sa) return;
            if (sa.isRetrying || sa.retryCount > 0) {
                console.log('[Streaming] Stream recovered, resetting retry state.');
            }
            sa.resetRetryState();
            sa.updateSignalStatus('live');
            clearTimeout(sa.stalledTimeout);
        });

        // Ended: live streams shouldn't end — treat as disconnect
        radioPlayer.addEventListener('ended', () => {
            const sa = window.streamingApp;
            if (sa && sa.currentStream !== null && !sa.isRetrying) {
                console.warn('[Streaming] Stream ended unexpectedly, scheduling retry...');
                sa.scheduleRetry('ended');
            }
        });

        // Device came back online → retry immediately if we were retrying
        radioPlayer._onlineHandler = () => {
            const sa = window.streamingApp;
            if (sa && sa.currentStream !== null) {
                console.log('[Streaming] Network online, retrying stream immediately...');
                clearTimeout(sa.retryTimeout);
                sa.retryTimeout = null;
                sa.retryStream();
            }
        };
        window.addEventListener('online', radioPlayer._onlineHandler);
    }

    scheduleRetry(reason) {
        if (this.currentStream === null) return;
        if (this.retryCount >= this.maxRetries) {
            console.error('[Streaming] Max retries reached, giving up.');
            this.updateSignalStatus('failed');
            this.showStreamingPopup(
                'Koneksi stream terputus dan gagal dipulihkan setelah beberapa percobaan. Silakan coba putar ulang secara manual.',
                'error'
            );
            return;
        }

        this.isRetrying = true;
        const delay = Math.min(this.retryBaseDelay * Math.pow(2, this.retryCount), 30000);
        this.retryCount++;

        console.log(`[Streaming] Retry #${this.retryCount} scheduled in ${delay}ms (reason: ${reason})`);
        this.updateSignalStatus('reconnecting');

        clearTimeout(this.retryTimeout);
        this.retryTimeout = setTimeout(() => {
            this.retryStream();
        }, delay);
    }

    retryStream() {
        if (this.currentStream === null) {
            this.isRetrying = false;
            return;
        }

        const stationIndex = this.currentStream;
        const station = this.radioStations[stationIndex];
        const radioPlayer = document.getElementById('radioPlayer');

        if (!radioPlayer || !station) {
            this.isRetrying = false;
            return;
        }

        console.log(`[Streaming] Retrying stream: ${station.name} (attempt ${this.retryCount})`);
        this.updateSignalStatus('reconnecting');

        // First: clear the current source completely to flush any buffered data
        // so the browser doesn't replay the buffer instead of reconnecting.
        radioPlayer.pause();
        radioPlayer.src = '';
        radioPlayer.load();

        // Then: reconnect with a cache-busting timestamp to force a fresh request
        const bust = '?_t=' + Date.now();
        const freshUrl = station.url.includes('?') 
            ? station.url + '&_t=' + Date.now() 
            : station.url + bust;

        radioPlayer.src = freshUrl;
        radioPlayer.load();
        radioPlayer.play().then(() => {
            // 'playing' event will reset retry state
        }).catch((err) => {
            console.warn('[Streaming] Retry play() failed:', err);
            this.isRetrying = false;
            this.scheduleRetry('play-error');
        });
    }

    resetRetryState() {
        this.retryCount = 0;
        this.isRetrying = false;
        clearTimeout(this.retryTimeout);
        clearTimeout(this.stalledTimeout);
        this.retryTimeout = null;
        this.stalledTimeout = null;
    }

    updateSignalStatus(status) {
        // Update radio card status on the streaming page
        if (this.currentStream !== null) {
            const radioStatus = document.getElementById(`radioStatus${this.currentStream}`);
            if (status === 'reconnecting') {
                if (radioStatus) radioStatus.innerHTML = '<span class="status-dot loading"></span><span>Menghubungkan ulang...</span>';
            } else if (status === 'live') {
                if (radioStatus) radioStatus.innerHTML = '<span class="status-dot live"></span><span>Sedang Streaming</span>';
            } else if (status === 'failed') {
                if (radioStatus) radioStatus.innerHTML = '<span class="status-dot"></span><span>Koneksi Gagal</span>';
            }
        }

        // Update global player's play button icon and signal dot to reflect state
        const playPauseBtn = document.getElementById('audioPlayPause');
        const signalDot = document.getElementById('audioSignalDot');
        const inRadioMode = document.getElementById('quranAudioPlayer')?.dataset.mode === 'radio';
        if (playPauseBtn && inRadioMode) {
            if (status === 'reconnecting') {
                playPauseBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            } else if (status === 'live') {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else if (status === 'failed') {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
        if (signalDot && inRadioMode) {
            if (status === 'reconnecting') {
                signalDot.className = 'status-dot loading';
                signalDot.style.display = 'inline-block';
            } else if (status === 'live') {
                signalDot.className = 'status-dot live';
                signalDot.style.display = 'inline-block';
            } else if (status === 'failed') {
                signalDot.className = 'status-dot';
                signalDot.style.display = 'inline-block';
            }
        }
    }
    
    startSignalAnimation() {
        // No signal bar animation in the global player – the status dot on the
        // streaming page's radio card already indicates live/connecting state.
        // This is a no-op kept for future extensibility.
    }
    
    destroy() {
        // Cleanup when switching away from streaming page
        if (this.signalAnimationInterval) {
            clearInterval(this.signalAnimationInterval);
            this.signalAnimationInterval = null;
        }
        
        // Clear retry timers
        this.resetRetryState();
        this.isRetrying = false;
        
        // NOTE: audio error handlers on #radioPlayer are retained (it's a persistent
        // global element) and delegate to window.streamingApp at call time, so they
        // are always pointing to the correct instance.

        // NOTE: Do NOT stop radio on destroy – user may navigate away and expect
        // radio to keep playing (global player keeps it alive via #bottom-dock).
        console.log('[Streaming] Destroyed (radio continues in global player if playing)');
    }

    toggleRadio(stationIndex) {
        const radioPlayer = document.getElementById('radioPlayer');
        const btnRadio = document.getElementById(`btnRadio${stationIndex}`);
        const radioStatus = document.getElementById(`radioStatus${stationIndex}`);
        const station = this.radioStations[stationIndex];

        // If another station is playing, stop it first
        if (this.currentStream !== null && this.currentStream !== stationIndex) {
            this.stopRadio(this.currentStream);
        }

        if (this.currentStream === stationIndex) {
            // Stop current streaming
            this.stopRadio(stationIndex);
        } else {
            // Start streaming (no audioContainer – global player is always shown)
            this.startRadio(stationIndex, station, radioPlayer, btnRadio, radioStatus);
        }
    }

    async startRadio(stationIndex, station, radioPlayer, btnRadio, radioStatus) {
        try {
            // Reset retry state for fresh start
            this.resetRetryState();

            // Show loading
            btnRadio.disabled = true;
            btnRadio.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Menghubungkan...</span>';
            radioStatus.innerHTML = '<span class="status-dot loading"></span><span>Menghubungkan...</span>';

            // Set radio source (persistent global element in #bottom-dock)
            radioPlayer.src = station.url;
            radioPlayer.volume = 1.0;
            
            // Try to play
            await radioPlayer.play();
            
            this.currentStream = stationIndex;
            
            // The global #quranAudioPlayer will pick this up via _globalPlayerUpdate
            // (called every second). Trigger immediately for snappy UI.
            if (window.islamHub) window.islamHub._globalPlayerUpdate();
            
            btnRadio.innerHTML = '<i class="fas fa-stop"></i><span>Stop</span>';
            btnRadio.classList.add('active');
            btnRadio.disabled = false;
            radioStatus.innerHTML = '<span class="status-dot live"></span><span>Sedang Streaming</span>';
            
            console.log(`[Streaming] ${station.name} started`);
        } catch (error) {
            console.error('[Streaming] Radio error:', error);
            
            // Reset button
            btnRadio.disabled = false;
            btnRadio.innerHTML = '<i class="fas fa-play"></i><span>Putar Radio</span>';
            radioStatus.innerHTML = '<span class="status-dot"></span><span>Error</span>';
            
            this.showStreamingPopup(
                `Gagal memulai streaming ${station.name}. Pastikan koneksi internet Anda stabil.`,
                'error'
            );
        }
    }

    stopRadio(stationIndex = null) {
        // If no index provided, use current stream
        const indexToStop = stationIndex !== null ? stationIndex : this.currentStream;
        
        if (indexToStop === null) return;
        
        const radioPlayer = document.getElementById('radioPlayer');
        const btnRadio = document.getElementById(`btnRadio${indexToStop}`);
        const radioStatus = document.getElementById(`radioStatus${indexToStop}`);
        
        // Cancel any pending retry before stopping
        this.resetRetryState();
        this.isRetrying = false;

        if (radioPlayer) {
            radioPlayer.pause();
            radioPlayer.src = '';
        }
        
        this.currentStream = null;
        
        // Global player will hide itself via _globalPlayerUpdate (called every second).
        // Trigger immediately for snappy UI.
        if (window.islamHub) window.islamHub._globalPlayerUpdate();
        
        if (btnRadio) {
            btnRadio.innerHTML = '<i class="fas fa-play"></i><span>Putar Radio</span>';
            btnRadio.classList.remove('active');
        }
        if (radioStatus) {
            radioStatus.innerHTML = '<span class="status-dot"></span><span>Siap Streaming</span>';
        }
        
        console.log('[Streaming] Radio stopped');
    }

    openVideoStream(url, name) {
        console.log('[Streaming] Opening video stream:', name, url);
        
        const modal = document.getElementById('videoModal');
        const iframe = document.getElementById('videoIframe');
        const title = document.getElementById('videoModalTitle');
        
        if (modal && iframe && title) {
            title.textContent = name;
            iframe.src = url;
            modal.classList.add('show');
        }
    }
    
    closeVideoStream() {
        const modal = document.getElementById('videoModal');
        const iframe = document.getElementById('videoIframe');
        
        if (modal && iframe) {
            modal.classList.remove('show');
            iframe.src = '';
        }
    }
    
    openYouTubeChannel(channelId) {
        const youtubeUrl = `https://www.youtube.com/channel/${channelId}`;
        
        // Check if running in Capacitor (native app)
        if (window.Capacitor && window.Capacitor.isNativePlatform()) {
            // Try to open in YouTube app first
            const youtubeAppUrl = `vnd.youtube://channel/${channelId}`;
            
            // Open in YouTube app or fallback to browser
            window.open(youtubeUrl, '_system');
        } else {
            // Open in new tab for web
            window.open(youtubeUrl, '_blank');
        }
        
        console.log('[Streaming] Opening YouTube channel:', channelId);
    }

    showStreamingPopup(message, type = 'info', callback = null) {
        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.className = 'streaming-popup-overlay';
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-circle' : 
                     'fa-info-circle';
        
        overlay.innerHTML = `
            <div class="streaming-popup-content ${type}">
                <i class="fas ${icon}"></i>
                <p>${message}</p>
                <button class="btn-popup-close">OK</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Show animation
        setTimeout(() => overlay.classList.add('show'), 10);
        
        // Close handler
        const closePopup = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
                if (callback) callback();
            }, 300);
        };
        
        overlay.querySelector('.btn-popup-close').addEventListener('click', closePopup);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });
    }
}

// Export for use in main app
export default StreamingApp;
