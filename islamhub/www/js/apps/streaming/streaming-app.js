class StreamingApp {
    constructor() {
        this.currentStream = null;
        this.player = null;
        this.signalAnimationInterval = null;
        
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
                url: 'https://www.youtube.com/embed/MI-fE4uTRZg',
                description: 'Live streaming 24/7 dari Masjidil Haram Makkah',
                icon: 'fas fa-kaaba',
                color: 'makkah'
            },
            {
                name: 'Madinah Live',
                url: 'https://www.youtube.com/embed/TpT8b8JFZ6E',
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
                url: 'https://www.youtube.com/embed/bEJFMrKmBb4',
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
                    
                    <!-- Audio Player (Style Al-Quran/Dzikir) -->
                    <div class="audio-player-container" id="audioPlayerContainer" style="display: none;">
                        <div class="streaming-audio-info">
                            <div class="streaming-radio-name" id="streamingRadioName">
                                <i class="fas fa-radio"></i>
                                <span>Radio Streaming</span>
                            </div>
                            <div class="streaming-radio-status" id="streamingRadioStatus">
                                <span class="status-dot"></span>
                                <span>Live</span>
                            </div>
                            <button class="streaming-close-btn" id="streamingCloseBtn" title="Tutup Player">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="streaming-audio-controls">
                            <button class="streaming-audio-btn" id="streamingPlayPause">
                                <i class="fas fa-pause"></i>
                            </button>
                            <div class="streaming-signal-indicator">
                                <div class="signal-bars" id="signalBars">
                                    <div class="signal-bar active"></div>
                                    <div class="signal-bar active"></div>
                                    <div class="signal-bar active"></div>
                                    <div class="signal-bar active"></div>
                                </div>
                                <span class="signal-text">Koneksi Stabil</span>
                            </div>
                            <button class="streaming-mute-btn" id="streamingMuteBtn">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        <audio id="radioPlayer">
                            <source src="" type="audio/mpeg">
                        </audio>
                    </div>
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
        
        // Setup audio player controls
        const playPauseBtn = document.getElementById('streamingPlayPause');
        const muteBtn = document.getElementById('streamingMuteBtn');
        const radioPlayer = document.getElementById('radioPlayer');
        
        if (playPauseBtn && radioPlayer) {
            playPauseBtn.addEventListener('click', () => {
                if (radioPlayer.paused) {
                    radioPlayer.play();
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    radioPlayer.pause();
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
        }
        
        if (muteBtn && radioPlayer) {
            muteBtn.addEventListener('click', () => {
                radioPlayer.muted = !radioPlayer.muted;
                if (radioPlayer.muted) {
                    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    muteBtn.classList.add('muted');
                } else {
                    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    muteBtn.classList.remove('muted');
                }
            });
        }
        
        // Close button
        const closeBtn = document.getElementById('streamingCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (this.currentStream !== null) {
                    this.stopRadio(this.currentStream);
                }
            });
        }
        
        // Simulate signal strength animation
        this.startSignalAnimation();
    }
    
    startSignalAnimation() {
        const signalBars = document.querySelectorAll('.signal-bar');
        if (signalBars.length === 0) return;
        
        // Clear existing interval if any
        if (this.signalAnimationInterval) {
            clearInterval(this.signalAnimationInterval);
        }
        
        // Animate signal bars to simulate live connection strength
        this.signalAnimationInterval = setInterval(() => {
            const radioPlayer = document.getElementById('radioPlayer');
            const isPlaying = radioPlayer && !radioPlayer.paused && !radioPlayer.ended;
            
            if (isPlaying) {
                // When playing, show full signal with subtle animation
                signalBars.forEach((bar, index) => {
                    const shouldShow = Math.random() > 0.1; // 90% chance
                    if (shouldShow) {
                        bar.classList.add('active');
                    } else {
                        bar.classList.remove('active');
                    }
                });
            } else {
                // When not playing, show only first bar
                signalBars.forEach((bar, index) => {
                    if (index === 0) {
                        bar.classList.add('active');
                    } else {
                        bar.classList.remove('active');
                    }
                });
            }
        }, 1200);
    }
    
    destroy() {
        // Cleanup when switching away from streaming page
        if (this.signalAnimationInterval) {
            clearInterval(this.signalAnimationInterval);
            this.signalAnimationInterval = null;
        }
        
        // Stop any playing radio
        if (this.currentStream !== null) {
            this.stopRadio(this.currentStream);
        }
    }

    toggleRadio(stationIndex) {
        const radioPlayer = document.getElementById('radioPlayer');
        const audioContainer = document.getElementById('audioPlayerContainer');
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
            // Start streaming
            this.startRadio(stationIndex, station, radioPlayer, audioContainer, btnRadio, radioStatus);
        }
    }

    async startRadio(stationIndex, station, radioPlayer, audioContainer, btnRadio, radioStatus) {
        try {
            // Show loading
            btnRadio.disabled = true;
            btnRadio.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Menghubungkan...</span>';
            radioStatus.innerHTML = '<span class="status-dot loading"></span><span>Menghubungkan...</span>';

            // Set radio source
            radioPlayer.src = station.url;
            radioPlayer.volume = 1.0;
            
            // Try to play
            await radioPlayer.play();
            
            this.currentStream = stationIndex;
            audioContainer.style.display = 'block';
            
            // Update custom player info
            const radioName = document.getElementById('streamingRadioName');
            const radioStatusPlayer = document.getElementById('streamingRadioStatus');
            const playPauseBtn = document.getElementById('streamingPlayPause');
            const muteBtn = document.getElementById('streamingMuteBtn');
            
            if (radioName) {
                radioName.innerHTML = `<i class="fas fa-radio"></i><span>${station.name}</span>`;
            }
            if (radioStatusPlayer) {
                radioStatusPlayer.innerHTML = '<span class="status-dot"></span><span>Live Streaming</span>';
            }
            if (playPauseBtn) {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            if (muteBtn) {
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                muteBtn.classList.remove('muted');
                radioPlayer.muted = false;
            }
            
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
        const audioContainer = document.getElementById('audioPlayerContainer');
        const btnRadio = document.getElementById(`btnRadio${indexToStop}`);
        const radioStatus = document.getElementById(`radioStatus${indexToStop}`);
        
        if (radioPlayer) {
            radioPlayer.pause();
            radioPlayer.src = '';
        }
        
        this.currentStream = null;
        
        if (audioContainer) audioContainer.style.display = 'none';
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
