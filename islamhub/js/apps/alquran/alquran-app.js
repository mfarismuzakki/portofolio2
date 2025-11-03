/* ===== Al-Qur'an App - IslamHub ===== */

export default class AlQuranApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('alquran-app');

        // Get base path for assets (handles subdirectory deployment)
        this.basePath = this._getBasePath();

        this.currentPage = 1;
        this.totalPages = 604;
        this.isPlaying = false;
        this.audio = null;

        this.bookmarks = this._loadJSON('alquran_bookmarks', []);
        this.verseBookmarks = this._loadJSON('alquran_verse_bookmarks', []);
        this.history = this._loadJSON('alquran_history', []);
        this.settings = this._loadJSON('alquran_settings', {
            hideTransliteration: true,
            hideTranslation: false,
            arabicFont: 'uthmani',
            autoPlayNext: false,
            autoRepeat: 1,
            hideLastRead: false,
            hideMemorization: false
        });

        this.isMemorizationMode = false;
        
        // Mode baca: 'page' atau 'surah'
        this.readMode = 'page';
        this.currentSurah = null;
        this.currentSurahData = null;
        
        // View mode: 'reading' atau 'translation'
        this.viewMode = localStorage.getItem('alquran_view_mode') || 'translation';
        
        // Sidebar state
        this.sidebarOpen = false;
    }

    async init() {
        // restore last page
        const last = localStorage.getItem('alquran_last_page');
        if (last) this.currentPage = parseInt(last, 10) || 1;

        await this.render();
        this.setupEventListeners();
        this._updateLastRead(this.currentPage);
    }

    // Reset to home page
    async resetToHome() {
        this.readMode = 'page';
        this.currentSurah = null;
        this.currentSurahData = null;
        this.audioSetupDone = false;
        this.audioListenersAttached = false;
        
        // Hide and reset audio player
        const audioPlayer = document.getElementById('quranAudioPlayer');
        if (audioPlayer) {
            audioPlayer.style.display = 'none';
            const audioElement = document.getElementById('quranAudioElement');
            if (audioElement) {
                audioElement.pause();
                audioElement.src = '';
            }
        }
        
        await this.render();
    }

    async render() {
        if (!this.container) return;

        // Show floating prayer widget when back to home
        const floatingWidget = document.getElementById('floatingPrayerWidget');
        if (floatingWidget && floatingWidget.dataset.wasHidden === 'true') {
            floatingWidget.style.removeProperty('display');
            delete floatingWidget.dataset.wasHidden;
        }

        // Build HTML - Home menu only
        this.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'alquran-container';

        // Header
        const header = document.createElement('div');
        header.className = 'alquran-header';
        header.innerHTML = `
            <div class="alquran-title">
                <h1><i class="fas fa-book-quran"></i> Al-Qur'an</h1>
                <p>Mushaf Digital dengan Audio per Halaman</p>
            </div>
        `;

        // Quick nav - Main menu
        const quickNav = document.createElement('div');
        quickNav.className = 'quick-nav';
        quickNav.innerHTML = `
            <button class="nav-btn" data-action="surahList"><i class="fas fa-list"></i><span>Daftar Surat</span></button>
            <button class="nav-btn" data-action="juzList"><i class="fas fa-bookmark"></i><span>Daftar Juz</span></button>
            <button class="nav-btn" data-action="pageList"><i class="fas fa-file"></i><span>Buka Halaman</span></button>
            <button class="nav-btn" data-action="bookmarks"><i class="fas fa-heart"></i><span>Tersimpan</span></button>
            <button class="nav-btn" data-action="progress"><i class="fas fa-brain"></i><span>Progress Hafalan</span></button>
            <button class="nav-btn" data-action="settings"><i class="fas fa-cog"></i><span>Pengaturan</span></button>
        `;
        
        // Last Read Section
        const lastRead = this._loadJSON('alquran_last_read', null);
        let lastReadSection = '';
        if (lastRead && lastRead.surah && lastRead.verse) {
            const surahInfo = typeof QURAN_SURAHS !== 'undefined' ? QURAN_SURAHS.find(s => s.number === lastRead.surah) : null;
            if (surahInfo) {
                lastReadSection = `
                    <div class="last-read-card">
                        <div class="last-read-header">
                            <i class="fas fa-book-reader"></i>
                            <span>Lanjutkan Bacaan</span>
                        </div>
                        <div class="last-read-content" data-action="resumeReading" data-surah="${lastRead.surah}" data-verse="${lastRead.verse}">
                            <div class="last-read-surah">
                                <h3>${surahInfo.nameArabic}</h3>
                                <p>${surahInfo.name} • ${surahInfo.verses} ayat</p>
                            </div>
                            <div class="last-read-verse">
                                <span class="verse-marker">Ayat ${lastRead.verse}</span>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        // Info Section - Mushaf & Tafsir
        const infoSection = document.createElement('div');
        infoSection.className = 'quran-info-simple';
        infoSection.innerHTML = `
            <p><i class="fas fa-book"></i> <strong>Mushaf:</strong> Madinah (Rasm Utsmani)</p>
            <p><i class="fas fa-language"></i> <strong>Terjemahan:</strong> Kemenag RI</p>
            <p><i class="fas fa-book-open"></i> <strong>Tafsir:</strong> Kemenag RI</p>
            <p><i class="fas fa-microphone"></i> <strong>Qari:</strong> Mishary Rashid Alafasy</p>
        `;

        // Assemble
        wrapper.appendChild(header);
        if (lastReadSection && !this.settings.hideLastRead) {
            const lastReadDiv = document.createElement('div');
            lastReadDiv.innerHTML = lastReadSection;
            wrapper.appendChild(lastReadDiv.firstElementChild);
        }
        wrapper.appendChild(quickNav);
        wrapper.appendChild(infoSection);

        this.container.appendChild(wrapper);

        // Attach local references
        this._attachLocalElements();
    }

    _attachLocalElements() {
        // quick nav
        const navButtons = this.container.querySelectorAll('.quick-nav .nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const action = btn.dataset.action;
                if (action === 'surahList') this._showSurahList();
                else if (action === 'juzList') this._showJuzList();
                else if (action === 'pageList') this._showPageJumpModal();
                else if (action === 'bookmarks') this._showBookmarksModal();
                else if (action === 'progress') this._showMemorizationProgress();
                else if (action === 'settings') this._showSettingsModal();
            });
        });
        
        // Resume reading button
        const resumeBtn = this.container.querySelector('[data-action="resumeReading"]');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => {
                const surahNum = parseInt(resumeBtn.dataset.surah);
                const verseNum = parseInt(resumeBtn.dataset.verse);
                if (surahNum) {
                    this.readSurah(surahNum).then(() => {
                        // Scroll to verse after loading
                        if (verseNum) {
                            setTimeout(() => {
                                const verseEl = document.querySelector(`[data-verse-number="${verseNum}"]`);
                                if (verseEl) {
                                    verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    verseEl.style.background = 'rgba(0, 255, 255, 0.1)';
                                    setTimeout(() => {
                                        verseEl.style.background = '';
                                    }, 2000);
                                }
                            }, 300);
                        }
                    });
                }
            });
        }
    }

    setupEventListeners() {
        // verse actions (copy, memorize, etc)
        this.container.addEventListener('click', (e) => {
            // verse copy
            if (e.target.closest('.verse-btn-copy')) {
                const verseDiv = e.target.closest('.verse-item, .verse-item-clean, .verse-item-reading');
                if (verseDiv) {
                    const verseNumber = parseInt(verseDiv.dataset.verseNumber) || 0;
                    const surahNumber = parseInt(verseDiv.dataset.surahNumber) || 0;
                    if (verseNumber && surahNumber) {
                        this.copyVerse(surahNumber, verseNumber);
                    }
                }
            }
            // verse bookmark
            if (e.target.closest('.verse-btn-bookmark')) {
                const verseDiv = e.target.closest('.verse-item, .verse-item-clean, .verse-item-reading');
                if (verseDiv) {
                    const verseNumber = parseInt(verseDiv.dataset.verseNumber) || 0;
                    const surahNumber = parseInt(verseDiv.dataset.surahNumber) || 0;
                    if (verseNumber && surahNumber) {
                        this.bookmarkVerse(surahNumber, verseNumber);
                    }
                }
            }
            // memorization toggle
            if (e.target.closest('.verse-btn-memorize')) {
                const verseDiv = e.target.closest('.verse-item, .verse-item-clean, .verse-item-reading');
                if (verseDiv) {
                    const verseNumber = parseInt(verseDiv.dataset.verseNumber) || 0;
                    const surahNumber = parseInt(verseDiv.dataset.surahNumber) || 0;
                    if (verseNumber && surahNumber) {
                        this.markVerseMemorized(surahNumber, verseNumber);
                    }
                }
            }
        });
    }

    _buildPageContentHTML(versesData) {
        if (versesData.note) {
            return `
                <div class="content-placeholder">
                    <div class="placeholder-icon"><i class="fas fa-book-quran"></i></div>
                    <h3>Halaman ${this.currentPage}</h3>
                    <p>${versesData.note}</p>
                    <div class="placeholder-actions"><button class="primary-btn" onclick="alquranApp.loadOnlineContent()"><i class="fas fa-download"></i> Muat Konten Online</button></div>
                </div>
            `;
        }

        const parts = [];
        parts.push('<div class="verses-container">');
        const verseProgress = this._loadJSON('alquran_verse_progress', {});

        for (const verse of (versesData.verses || [])) {
            const key = `${verse.surah}:${verse.verse}`;
            const level = verseProgress[key]?.level || 0;
            parts.push(`<div class="verse-item" data-surah="${verse.surah}" data-verse="${verse.verse}">`);
            if (level > 0) parts.push(`<div class="verse-progress-indicator level-${level}">${level}</div>`);
            parts.push(`<div class="verse-number"><span>${verse.verse}</span></div>`);
            parts.push('<div class="verse-content">');
            parts.push(`<div class="arabic-text ${this.settings.arabicFont}">${verse.arabic}</div>`);
            if (!this.settings.hideTransliteration && verse.transliteration) parts.push(`<div class="transliteration-text">${verse.transliteration}</div>`);
            if (!this.settings.hideTranslation && verse.translation) parts.push(`<div class="translation-text">${verse.translation}</div>`);
            parts.push('</div>');

            // actions
            parts.push('<div class="verse-actions">');
            parts.push(`<button class="verse-btn" data-verse-play data-surah="${verse.surah}" data-verse="${verse.verse}"><i class="fas fa-play"></i></button>`);
            parts.push(`<button class="verse-btn" data-verse-copy data-surah="${verse.surah}" data-verse="${verse.verse}"><i class="fas fa-copy"></i></button>`);
            parts.push(`<button class="verse-btn" data-verse-bookmark data-surah="${verse.surah}" data-verse="${verse.verse}"><i class="fas fa-bookmark"></i></button>`);
            if (this.isMemorizationMode) {
                parts.push(`<button class="verse-btn memorization-btn" data-mark-memorized data-surah="${verse.surah}" data-verse="${verse.verse}"><i class="fas fa-brain"></i></button>`);
            }
            parts.push('</div>');

            // memorization controls
            if (this.isMemorizationMode) {
                parts.push('<div class="memorization-controls">');
                parts.push(`<button class="memorization-btn" data-mlevel="1" data-surah="${verse.surah}" data-verse="${verse.verse}">Dasar</button>`);
                parts.push(`<button class="memorization-btn" data-mlevel="2" data-surah="${verse.surah}" data-verse="${verse.verse}">Menengah</button>`);
                parts.push(`<button class="memorization-btn" data-mlevel="3" data-surah="${verse.surah}" data-verse="${verse.verse}">Lancar</button>`);
                parts.push(`<button class="memorization-btn" data-mlevel="4" data-surah="${verse.surah}" data-verse="${verse.verse}">Hafal</button>`);
                parts.push('</div>');
            }

            parts.push('</div>');
        }

        parts.push('</div>');
        return parts.join('\n');
    }

    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevPage();
            if (e.key === 'ArrowRight') this.nextPage();
            if (e.key === ' ') { e.preventDefault(); this.toggleAudio(); }
        });

        // Delegate verse buttons
        this.container.addEventListener('click', (e) => {
            const playBtn = e.target.closest('[data-verse-play]');
            const copyBtn = e.target.closest('[data-verse-copy]');
            const vBookmark = e.target.closest('[data-verse-bookmark]');
            const markBtn = e.target.closest('[data-mark-memorized]');
            const mlevelBtn = e.target.closest('[data-mlevel]');

            if (playBtn) {
                const s = playBtn.dataset.surah; const v = playBtn.dataset.verse;
                this.playVerseAudio(s, v);
            }
            if (copyBtn) {
                const s = copyBtn.dataset.surah; const v = copyBtn.dataset.verse;
                this.copyVerse(s, v);
            }
            if (vBookmark) {
                const s = vBookmark.dataset.surah; const v = vBookmark.dataset.verse;
                this.bookmarkVerse(s, v);
            }
            if (markBtn) {
                const s = markBtn.dataset.surah; const v = markBtn.dataset.verse;
                this.markVerseMemorized(s, v, 4);
            }
            if (mlevelBtn) {
                const s = mlevelBtn.dataset.surah; const v = mlevelBtn.dataset.verse; const level = parseInt(mlevelBtn.dataset.mlevel, 10);
                this.markVerseMemorized(s, v, level);
            }
        });
    }

    async toggleAudio() {
        if (this.isPlaying) return this.pauseAudio();
        return this.playAudio();
    }

    async playAudio() {
        try {
            this._stopAudio();
            const path = typeof getAudioPathForPage === 'function' ? getAudioPathForPage(this.currentPage) : `${this.basePath}/assets/audio/alquran/Page${String(this.currentPage).padStart(3,'0')}.mp3`;
            this.audio = new Audio(path);
            this.audio.preload = 'metadata';

            const audioToggle = document.getElementById('alqAudioToggle');
            if (audioToggle) audioToggle.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Memuat...</span>';

            await new Promise((resolve, reject) => {
                const onCanPlay = () => {
                    this.audio.removeEventListener('canplay', onCanPlay);
                    this.audio.removeEventListener('error', onError);
                    resolve();
                };
                const onError = (err) => {
                    this.audio.removeEventListener('canplay', onCanPlay);
                    this.audio.removeEventListener('error', onError);
                    reject(err);
                };
                this.audio.addEventListener('canplay', onCanPlay);
                this.audio.addEventListener('error', onError);
                this.audio.load();
            });

            this.audio.addEventListener('timeupdate', () => this._updateAudioProgress());
            this.audio.addEventListener('ended', () => this._onAudioEnded());

            await this.audio.play();
            this.isPlaying = true;
            if (audioToggle) audioToggle.innerHTML = '<i class="fas fa-pause"></i><span>Jeda</span>';
            const progress = document.getElementById('alqAudioProgress'); if (progress) progress.style.display = 'block';
        } catch (err) {
            console.error('Audio error', err);
            this._notify('Gagal memutar audio', 'error');
            const audioToggle = document.getElementById('alqAudioToggle'); if (audioToggle) audioToggle.innerHTML = '<i class="fas fa-play"></i><span>Putar Audio</span>';
        }
    }

    pauseAudio() {
        if (this.audio && this.isPlaying) {
            this.audio.pause(); this.isPlaying = false;
            const audioToggle = document.getElementById('alqAudioToggle'); if (audioToggle) audioToggle.innerHTML = '<i class="fas fa-play"></i><span>Putar Audio</span>';
        }
    }

    _stopAudio() {
        if (this.audio) {
            try {
                // Remove all event listeners before destroying
                const newAudio = this.audio.cloneNode();
                this.audio.pause();
                this.audio.src = '';
                this.audio = null;
            } catch(e) {
                console.error('Error stopping audio:', e);
            }
        }
        this.isPlaying = false;
        this.audioListenersAttached = false; // Reset listener flag
    }

    _updateAudioProgress() {
        if (!this.audio) return;
        const fill = document.getElementById('alqProgressFill');
        const td = document.getElementById('alqTimeDisplay');
        if (fill && this.audio.duration) fill.style.width = `${(this.audio.currentTime/this.audio.duration)*100}%`;
        if (td) td.textContent = `${this._formatTime(this.audio.currentTime)} / ${this._formatTime(this.audio.duration)}`;
    }

    _onAudioEnded() {
        this.isPlaying = false;
        const audioToggle = document.getElementById('alqAudioToggle'); if (audioToggle) audioToggle.innerHTML = '<i class="fas fa-play"></i><span>Putar Audio</span>';
        if (this.settings.autoPlayNext && this.currentPage < this.totalPages) {
            setTimeout(()=> this.nextPage(), 800);
        }
    }

    prevPage() { if (this.currentPage > 1) { this.currentPage--; this._onPageChanged(); } }
    nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this._onPageChanged(); } }
    async goToPage(val) { const p = parseInt(val,10); if (!isNaN(p) && p>=1 && p<=this.totalPages) { this.currentPage = p; await this.openPage(p); } }

    async _onPageChanged() {
        this._stopAudio();
        localStorage.setItem('alquran_last_page', String(this.currentPage));
        this._updateLastRead(this.currentPage);
        await this.render();
    }
    
    async openPage(pageNum) {
        try {
            console.log('[openPage] Opening page:', pageNum);
            
            // Find which surah contains this page
            const surah = typeof QURAN_SURAHS !== 'undefined' 
                ? QURAN_SURAHS.find(s => pageNum >= s.startPage && pageNum <= s.endPage)
                : null;
            
            if (!surah) {
                this._notify('Halaman tidak ditemukan', 'error');
                return;
            }
            
            // Open the surah and scroll to the page
            await this.readSurah(surah.number);
            
            // Wait for render to complete, then scroll to page separator
            setTimeout(() => {
                const pageSeparators = document.querySelectorAll('.page-separator');
                for (const separator of pageSeparators) {
                    const pageInfo = separator.querySelector('.page-separator-page');
                    if (pageInfo && pageInfo.textContent.includes(`Hal. ${pageNum}`)) {
                        separator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Highlight briefly
                        separator.style.background = 'rgba(0, 255, 255, 0.1)';
                        setTimeout(() => {
                            separator.style.background = '';
                        }, 2000);
                        break;
                    }
                }
            }, 500);
            
            console.log('[openPage] Opened surah and scrolling to page', pageNum);
        } catch (error) {
            console.error('[openPage] Error:', error);
            this._notify('Gagal membuka halaman: ' + error.message, 'error');
        }
    }
    
    async renderPageReader() {
        try {
            console.log('[renderPageReader] Starting render for page:', this.currentPage);
            
            if (!this.container) {
                console.error('[renderPageReader] Container not found!');
                return;
            }
        
        // Ensure viewMode is set (default to translation)
        if (!this.viewMode) {
            this.viewMode = localStorage.getItem('alquran_view_mode') || 'translation';
        }
        
        // Hide floating prayer widget when reading page
        const floatingWidget = document.getElementById('floatingPrayerWidget');
        if (floatingWidget) {
            floatingWidget.style.setProperty('display', 'none', 'important');
            floatingWidget.dataset.wasHidden = 'true';
        }
        
        // Load page data
        const pageData = await this.loadPageData(this.currentPage);
        if (!pageData) {
            this._notify('Gagal memuat halaman', 'error');
            return;
        }
        
        // Build HTML untuk mode baca halaman
        this.container.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.className = `alquran-container page-mode ${this.viewMode === 'reading' ? 'reading-view' : 'translation-view'}`;
        
        // Sidebar Backdrop
        const backdrop = document.createElement('div');
        backdrop.className = `sidebar-backdrop ${this.sidebarOpen ? 'active' : ''}`;
        backdrop.id = 'sidebarBackdrop';
        
        // Sidebar Navigation (sama seperti surah mode)
        const sidebar = document.createElement('div');
        sidebar.className = `quran-sidebar ${this.sidebarOpen ? 'open' : ''}`;
        sidebar.id = 'quranSidebar';
        sidebar.innerHTML = `
            <div class="sidebar-header">
                <h3>Navigasi</h3>
                <button class="sidebar-close" id="closeSidebar"><i class="fas fa-times"></i></button>
            </div>
            <div class="sidebar-tabs">
                <button class="sidebar-tab active" data-tab="surah">Surat</button>
                <button class="sidebar-tab" data-tab="juz">Juz</button>
                <button class="sidebar-tab" data-tab="page">Halaman</button>
            </div>
            <div class="sidebar-content">
                <div class="sidebar-search">
                    <input type="text" placeholder="Cari surat..." id="sidebarSearch">
                </div>
                <div class="sidebar-list" id="sidebarList">
                    <!-- Dynamic content -->
                </div>
            </div>
        `;
        
        // Floating Header
        const floatingHeader = document.createElement('div');
        floatingHeader.className = 'floating-header visible';
        floatingHeader.id = 'floatingHeader';
        
        // Get surah names for this page
        const surahNames = pageData.surahs.map(s => s.name).join(' • ');
        
        floatingHeader.innerHTML = `
            <div class="floating-header-left">
                <button class="floating-nav-btn" id="menuToggle" title="Menu"><i class="fas fa-bars"></i></button>
                <button class="floating-nav-btn" id="btnBackHome" title="Home"><i class="fas fa-home"></i></button>
                <div class="floating-surah-info-inline">
                    <span class="floating-surah-name">${surahNames}</span>
                    <span class="floating-surah-meta">Halaman ${this.currentPage}</span>
                </div>
            </div>
            <div class="floating-header-center">
                <div class="floating-mode-toggle">
                    <button class="floating-mode-btn ${this.viewMode === 'reading' ? 'active' : ''}" data-mode="reading" title="Mode Baca">
                        <i class="fas fa-book"></i>
                    </button>
                    <button class="floating-mode-btn ${this.viewMode === 'translation' ? 'active' : ''}" data-mode="translation" title="Mode Terjemahan">
                        <i class="fas fa-language"></i>
                    </button>
                </div>
            </div>
            <div class="floating-header-right">
                <span class="floating-page-info" id="floatingPageInfo">
                    <span class="page-juz">Juz ${pageData.juz}</span>
                    <span class="page-divider">•</span>
                    <span class="page-number">Hal. ${this.currentPage}</span>
                </span>
                <button class="floating-nav-btn" id="btnSettings" title="Pengaturan"><i class="fas fa-cog"></i></button>
            </div>
        `;
        
        // Header - Page info
        const header = document.createElement('div');
        header.className = 'page-title-section';
        header.innerHTML = `
            <div class="page-title-clean">
                <h1 class="page-number-big">Halaman ${this.currentPage}</h1>
                <h2 class="page-surah-names">${surahNames}</h2>
                <div class="page-meta-badges">
                    <span class="meta-badge">Juz ${pageData.juz}</span>
                    <span class="meta-badge">${pageData.surahs.reduce((sum, s) => sum + s.verses.length, 0)} Ayat</span>
                    <button class="page-play-btn" data-play-page="${this.currentPage}">
                        <i class="fas fa-play"></i> Putar Audio
                    </button>
                </div>
            </div>
        `;
        
        // Verses container
        const versesContainer = document.createElement('div');
        versesContainer.className = 'page-verses';
        
        // Render each surah in this page
        for (const surah of pageData.surahs) {
            // Add surah separator if multiple surahs
            if (pageData.surahs.length > 1) {
                const surahSeparator = document.createElement('div');
                surahSeparator.className = 'surah-separator';
                surahSeparator.innerHTML = `
                    <div class="surah-separator-line"></div>
                    <div class="surah-separator-info">
                        <span class="surah-name-arabic">${surah.nameArabic}</span>
                        <span class="surah-name-latin">${surah.name}</span>
                    </div>
                    <div class="surah-separator-line"></div>
                `;
                versesContainer.appendChild(surahSeparator);
                
                // Add Basmalah for new surah (except At-Taubah)
                if (surah.number !== 9 && surah.verses[0].number !== 1) {
                    const basmalahEl = document.createElement('div');
                    basmalahEl.className = 'basmalah-text';
                    basmalahEl.innerHTML = `
                        <div class="basmalah-arabic ${this.settings.arabicFont}">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
                    `;
                    versesContainer.appendChild(basmalahEl);
                }
            }
            
            // Render verses - SAMA SEPERTI SURAH MODE
            const verseProgressData = this._loadJSON('alquran_verse_progress', {});
            
            for (const verse of surah.verses) {
                const verseEl = document.createElement('div');
                verseEl.dataset.verseNumber = verse.number;
                verseEl.dataset.surahNumber = surah.number; // Tambahkan surah number
                verseEl.dataset.pageNumber = this.currentPage;
                
                const verseKey = `${surah.number}:${verse.number}`;
                const isBookmarked = this.verseBookmarks.includes(verseKey);
                const isMemorized = verseProgressData[verseKey] && verseProgressData[verseKey].level === 4;
                
                if (this.viewMode === 'reading') {
                    // Reading mode - hanya Arab dengan nomor ayat Arab
                    const arabicNumber = this._toArabicNumber(verse.number);
                    verseEl.className = 'verse-item-reading';
                    verseEl.innerHTML = `
                        <span class="verse-arabic-inline ${this.settings.arabicFont}">${verse.arabic}</span>
                        <span class="verse-number-ornament">&#xFD3F;${arabicNumber}&#xFD3E;</span>
                    `;
                } else {
                    // Translation mode - lengkap (SAMA SEPERTI SURAH MODE)
                    verseEl.className = 'verse-item-clean';
                    verseEl.innerHTML = `
                        <div class="verse-number-badge">${verse.number}</div>
                        <div class="verse-arabic ${this.settings.arabicFont}">${verse.arabic}</div>
                        ${!this.settings.hideTransliteration && verse.transliteration ? `<div class="verse-transliteration">${verse.transliteration}</div>` : ''}
                        ${!this.settings.hideTranslation && verse.translation ? `<div class="verse-translation">${verse.translation}</div>` : ''}
                        ${verse.tafsir ? `
                        <details class="verse-tafsir-details">
                            <summary class="verse-tafsir-summary"><i class="fas fa-book-open"></i> Lihat Tafsir</summary>
                            <div class="verse-tafsir-content">
                                <p>${verse.tafsir}</p>
                            </div>
                        </details>
                        ` : ''}
                        <div class="verse-actions-inline">
                            <button class="verse-btn-inline verse-btn-copy" data-copy-verse="${verse.number}" title="Salin Ayat"><i class="fas fa-copy"></i></button>
                            <button class="verse-btn-inline verse-btn-bookmark" data-bookmark-verse="${verse.number}" title="Bookmark"><i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i></button>
                            ${!this.settings.hideMemorization ? `<button class="verse-btn-inline verse-btn-memorize" data-memorize-verse="${verse.number}" title="Tandai Hafal"><i class="${isMemorized ? 'fas fa-check-circle' : 'far fa-circle'}"></i></button>` : ''}
                        </div>
                    `;
                }
                versesContainer.appendChild(verseEl);
            }
        }
        
        // Navigation buttons
        const navButtons = document.createElement('div');
        navButtons.className = 'page-navigation';
        navButtons.innerHTML = `
            <button class="page-nav-btn page-nav-btn-prev" ${this.currentPage <= 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i> Halaman Sebelumnya
            </button>
            <span class="page-nav-info">${this.currentPage} / ${this.totalPages}</span>
            <button class="page-nav-btn page-nav-btn-next" ${this.currentPage >= this.totalPages ? 'disabled' : ''}>
                Halaman Selanjutnya <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        // Assemble all parts
        wrapper.appendChild(backdrop);
        wrapper.appendChild(sidebar);
        wrapper.appendChild(floatingHeader);
        wrapper.appendChild(header);
        wrapper.appendChild(versesContainer);
        wrapper.appendChild(navButtons);
        
        this.container.appendChild(wrapper);
        
        // Attach event listeners
        this._attachPageReaderListeners();
            
        } catch (error) {
            console.error('[renderPageReader] Error:', error);
            this._notify('Gagal menampilkan halaman: ' + error.message, 'error');
        }
    }
    
    _attachPageReaderListeners() {
        if (!this.container) return;
        
        // Sidebar toggle
        const menuToggle = document.getElementById('menuToggle');
        const closeSidebar = document.getElementById('closeSidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        
        if (menuToggle) menuToggle.addEventListener('click', () => this.toggleSidebar());
        if (closeSidebar) closeSidebar.addEventListener('click', () => this.toggleSidebar());
        if (backdrop) backdrop.addEventListener('click', () => this.toggleSidebar());
        
        // Back to home
        const btnBackHome = document.getElementById('btnBackHome');
        if (btnBackHome) btnBackHome.addEventListener('click', () => this.resetToHome());
        
        // View mode toggle
        const modeButtons = this.container.querySelectorAll('.floating-mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const mode = btn.dataset.mode;
                // Stop audio completely when switching modes
                this._stopAudio();
                this.viewMode = mode;
                localStorage.setItem('alquran_view_mode', mode);
                await this.renderPageReader(); // Re-render with new mode
            });
        });
        
        // Settings button
        const btnSettings = document.getElementById('btnSettings');
        if (btnSettings) btnSettings.addEventListener('click', () => this._showSettingsModal());
        
        // Navigation buttons
        const btnPrev = this.container.querySelector('.page-nav-btn-prev');
        const btnNext = this.container.querySelector('.page-nav-btn-next');
        
        if (btnPrev && this.currentPage > 1) {
            btnPrev.addEventListener('click', () => this.openPage(this.currentPage - 1));
        }
        if (btnNext && this.currentPage < this.totalPages) {
            btnNext.addEventListener('click', () => this.openPage(this.currentPage + 1));
        }
        
        // Verse actions - SAMA SEPERTI SURAH MODE
        this.container.addEventListener('click', (e) => {
            const verseItem = e.target.closest('.verse-item-clean, .verse-item-reading');
            
            // Copy verse
            if (e.target.closest('[data-copy-verse]')) {
                const btn = e.target.closest('[data-copy-verse]');
                const verseNum = parseInt(btn.dataset.copyVerse);
                if (verseItem) {
                    const surahNum = this._getSurahNumberForVerse(verseItem);
                    if (surahNum) {
                        this._copyVerseContent(surahNum, verseNum);
                    }
                }
            }
            
            // Bookmark verse
            if (e.target.closest('[data-bookmark-verse]')) {
                const btn = e.target.closest('[data-bookmark-verse]');
                const verseNum = parseInt(btn.dataset.bookmarkVerse);
                if (verseItem) {
                    const surahNum = this._getSurahNumberForVerse(verseItem);
                    if (surahNum) {
                        this.bookmarkVerse(surahNum, verseNum);
                        // Re-render to update UI
                        this.renderPageReader();
                    }
                }
            }
            
            // Memorize verse
            if (e.target.closest('[data-memorize-verse]')) {
                const btn = e.target.closest('[data-memorize-verse]');
                const verseNum = parseInt(btn.dataset.memorizeVerse);
                if (verseItem) {
                    const surahNum = this._getSurahNumberForVerse(verseItem);
                    if (surahNum) {
                        this.markVerseMemorized(surahNum, verseNum);
                    }
                }
            }
        });
        
        // Sidebar functionality
        this._setupSidebarContent();
    }
    
    _getSurahNumberForVerse(verseElement) {
        // Get surah number from data attribute
        const surahNum = parseInt(verseElement.dataset.surahNumber);
        if (surahNum) return surahNum;
        
        // Fallback: get from nearest surah separator
        let element = verseElement;
        while (element && element.previousElementSibling) {
            element = element.previousElementSibling;
            if (element.classList && element.classList.contains('surah-separator')) {
                const arabicName = element.querySelector('.surah-name-arabic');
                if (arabicName && typeof QURAN_SURAHS !== 'undefined') {
                    const surah = QURAN_SURAHS.find(s => s.nameArabic === arabicName.textContent.trim());
                    return surah ? surah.number : null;
                }
            }
        }
        
        return null;
    }
    
    _copyVerseContent(surahNum, verseNum) {
        const surah = QURAN_SURAHS.find(s => s.number === surahNum);
        if (!surah) return;
        
        // Find verse data
        // You'll need to load this from the page data or cache
        const text = `QS ${surah.name} (${surah.nameArabic}) ${surahNum}:${verseNum}`;
        navigator.clipboard.writeText(text).then(() => {
            this._notify('Ayat berhasil disalin', 'success');
        }).catch(() => {
            this._notify('Gagal menyalin ayat', 'error');
        });
    }

    toggleBookmark() {
        if (this.bookmarks.includes(this.currentPage)) { this.removeBookmark(this.currentPage); }
        else { this.addBookmark(this.currentPage); }
        this.render();
    }

    addBookmark(page) { if (!this.bookmarks.includes(page)) { this.bookmarks.push(page); this._saveJSON('alquran_bookmarks', this.bookmarks); this._notify(`Halaman ${page} disimpan`, 'success'); } }
    removeBookmark(page) { this.bookmarks = this.bookmarks.filter(p=>p!==page); this._saveJSON('alquran_bookmarks', this.bookmarks); this._notify(`Halaman ${page} dihapus`, 'info'); }

    copyPageText() {
        const versesData = typeof getVersesByPage === 'function' ? getVersesByPage(this.currentPage) : { verses: [] };
        const text = (versesData.verses || []).map(v => `${v.arabic}\n${v.transliteration || ''}\n${v.translation || ''}\n(QS ${v.surah}:${v.verse})`).join('\n\n');
        navigator.clipboard.writeText(text).then(()=> this._notify('Teks halaman berhasil disalin','success')).catch(()=> this._notify('Gagal menyalin teks','error'));
    }

    shareCurrentPage() {
        const url = window.location.href.split('#')[0] + `#page-${this.currentPage}`;
        if (navigator.share) { navigator.share({ title: `Al-Qur'an Halaman ${this.currentPage}`, url }).catch(()=>{}); }
        else { navigator.clipboard.writeText(url).then(()=> this._notify('Link halaman disalin ke clipboard','success')); }
    }

    copyVerse(surah, verse) {
        const versesData = typeof getVersesByPage === 'function' ? getVersesByPage(this.currentPage) : { verses: [] };
        const v = (versesData.verses || []).find(x => String(x.surah)===String(surah) && String(x.verse)===String(verse));
        if (v) { const text = `${v.arabic}\n\n${v.transliteration||''}\n\n${v.translation||''}\n\n(QS ${surah}:${verse})`; navigator.clipboard.writeText(text).then(()=> this._notify('Ayat berhasil disalin','success')); }
    }

    bookmarkVerse(surah, verse) {
        const key = `${surah}:${verse}`;
        const arr = this._loadJSON('alquran_verse_bookmarks', []);
        if (arr.includes(key)) { 
            const updated = arr.filter(x=>x!==key); 
            this._saveJSON('alquran_verse_bookmarks', updated); 
            this._notify('Bookmark ayat dihapus','info');
            this.verseBookmarks = updated;
        }
        else { 
            arr.push(key); 
            this._saveJSON('alquran_verse_bookmarks', arr); 
            this._notify('Ayat dibookmark','success');
            this.verseBookmarks = arr;
        }
        
        // Update button icon
        const btn = document.querySelector(`[data-bookmark-verse="${verse}"]`);
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = this.verseBookmarks.includes(key) ? 'fas fa-bookmark' : 'far fa-bookmark';
            }
        }
    }

    markVerseMemorized(surah, verse) {
        const key = `${surah}:${verse}`;
        const prog = this._loadJSON('alquran_verse_progress', {});
        const isMemorized = prog[key] && prog[key].level === 4;
        
        if (isMemorized) {
            // Jika sudah hafal, hapus dari progress
            delete prog[key];
            this._saveJSON('alquran_verse_progress', prog);
            this._notify(`Ayat ${verse} dihapus dari hafalan`, 'info');
            
            // Update icon button if exists
            const btn = document.querySelector(`[data-memorize-verse="${verse}"]`);
            if (btn) {
                const icon = btn.querySelector('i');
                if (icon) icon.className = 'far fa-circle';
            }
        } else {
            // Tandai langsung sebagai hafal (level 4)
            prog[key] = { level: 4, timestamp: new Date().toISOString() };
            this._saveJSON('alquran_verse_progress', prog);
            this._notify(`Ayat ${verse} ditandai sebagai hafal ✓`, 'success');
            
            // Update icon button if exists
            const btn = document.querySelector(`[data-memorize-verse="${verse}"]`);
            if (btn) {
                const icon = btn.querySelector('i');
                if (icon) icon.className = 'fas fa-check-circle';
            }
        }
    }

    _memorizationLevelName(l) { return {0:'Belum',1:'Dasar',2:'Menengah',3:'Lancar',4:'Hafal'}[l]||'Belum'; }

    _showSurahList() {
        // Remove existing modal if any
        const existingModal = document.getElementById('surahListModal');
        if (existingModal) existingModal.remove();
        
        // Create new modal
        const modal = document.createElement('div');
        modal.id = 'surahListModal';
        modal.className = 'modal';
        
        const html = ['<div class="modal-content surah-list-modal-content">'];
        html.push('<div class="modal-header">');
        html.push('<h3><i class="fas fa-book-quran"></i> Daftar Surat</h3>');
        html.push('<button class="close-btn" data-close>×</button>');
        html.push('</div>');
        html.push('<div class="modal-body">');
        
        // Search box with icon
        html.push('<div class="surah-search-wrapper">');
        html.push('<i class="fas fa-search search-icon"></i>');
        html.push('<input type="text" id="surahSearchInput" placeholder="Cari surat..." class="search-input">');
        html.push('</div>');
        
        if (typeof QURAN_SURAHS !== 'undefined') {
            html.push('<div class="surah-list-simple" id="surahListSimple">');
            for (const s of QURAN_SURAHS) {
                html.push(`
                    <div class="surah-row" data-number="${s.number}" data-name="${s.name.toLowerCase()}" data-arabic="${s.nameArabic}">
                        <div class="surah-row-number">${s.number}</div>
                        <div class="surah-row-content">
                            <div class="surah-row-names">
                                <span class="surah-row-latin">${s.name}</span>
                                <span class="surah-row-arabic">${s.nameArabic}</span>
                            </div>
                            <div class="surah-row-meta">
                                <span class="surah-row-info">${s.revelation}</span>
                                <span class="surah-row-divider">•</span>
                                <span class="surah-row-info">${s.verses} ayat</span>
                            </div>
                        </div>
                        <div class="surah-row-actions">
                            <button class="surah-row-btn" data-surah="${s.number}" title="Baca ${s.name}">
                                <i class="fas fa-book-open"></i>
                            </button>
                            <button class="surah-row-btn-verse" data-surah="${s.number}" data-total-verses="${s.verses}" title="Lompat ke ayat">
                                <i class="fas fa-list-ol"></i>
                            </button>
                        </div>
                    </div>
                `);
            }
            html.push('</div>');
        } else {
            html.push('<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Data surat tidak tersedia.</p></div>');
        }
        
        html.push('</div></div>');
        modal.innerHTML = html.join('');
        
        // Append to body and show
        document.body.appendChild(modal);
        modal.style.setProperty('display', 'flex', 'important');
        
        // Close handlers
        modal.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click', ()=>{
            modal.style.display='none';
            modal.remove();
        }));
        
        // Backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display='none';
                modal.remove();
            }
        });
        
        // Search functionality
        const searchInput = document.getElementById('surahSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const rows = modal.querySelectorAll('.surah-row');
                rows.forEach(row => {
                    const name = row.dataset.name;
                    const arabic = row.dataset.arabic;
                    const number = row.dataset.number;
                    if (name.includes(query) || arabic.includes(query) || number.includes(query)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
            // Don't auto-focus on mobile to prevent keyboard popup
            // setTimeout(() => searchInput.focus(), 100);
        }
        
        // Event listener untuk tombol "Baca Surat"
        modal.querySelectorAll('.surah-row-btn').forEach(btn=>btn.addEventListener('click', (e)=>{ 
            e.stopPropagation();
            const surahNum = parseInt(btn.dataset.surah);
            this.readSurah(surahNum); 
            modal.remove();
        }));
        
        // Event listener untuk tombol "Lompat ke Ayat"
        modal.querySelectorAll('.surah-row-btn-verse').forEach(btn=>btn.addEventListener('click', (e)=>{ 
            e.stopPropagation();
            const surahNum = parseInt(btn.dataset.surah);
            const totalVerses = parseInt(btn.dataset.totalVerses);
            this._showVerseJumpModal(surahNum, totalVerses);
        }));
    }

    _showJuzList() {
        // Remove existing modal if any
        const existingModal = document.getElementById('juzListModal');
        if (existingModal) existingModal.remove();
        
        // Create new modal
        const modal = document.createElement('div');
        modal.id = 'juzListModal';
        modal.className = 'modal';
        
        const html = ['<div class="modal-content juz-list-modal-content">'];
        html.push('<div class="modal-header">');
        html.push('<h3><i class="fas fa-bookmark"></i> Daftar Juz</h3>');
        html.push('<button class="close-btn" data-close>×</button>');
        html.push('</div>');
        html.push('<div class="modal-body">');
        
        if (typeof QURAN_JUZ !== 'undefined') {
            html.push('<div class="juz-grid">');
            for (const j of QURAN_JUZ) {
                html.push(`
                    <div class="juz-card" data-start="${j.startPage}">
                        <div class="juz-header">
                            <div class="juz-number-badge">
                                <span class="juz-number">${j.number}</span>
                            </div>
                        </div>
                        <div class="juz-body">
                            <h4 class="juz-name">${j.name}</h4>
                            <div class="juz-pages">
                                <i class="fas fa-file-alt"></i>
                                <span>Halaman ${j.startPage} - ${j.endPage}</span>
                            </div>
                        </div>
                        <div class="juz-action">
                            <button class="btn-open-juz">
                                <i class="fas fa-book-open"></i>
                                <span>Buka Juz</span>
                            </button>
                        </div>
                    </div>
                `);
            }
            html.push('</div>');
        } else {
            html.push('<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Data juz tidak tersedia.</p></div>');
        }
        
        html.push('</div></div>');
        modal.innerHTML = html.join('');
        
        // Append to body and show
        document.body.appendChild(modal);
        modal.style.setProperty('display', 'flex', 'important');
        
        // Close handlers
        modal.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click', ()=>{
            modal.remove();
        }));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Juz card click handlers
        modal.querySelectorAll('.juz-card').forEach(c=>c.addEventListener('click', ()=>{ 
            const juzNum = parseInt(c.querySelector('.juz-number').textContent);
            this.readJuz(juzNum); 
            modal.remove(); 
        }));
    }

    _showBookmarksModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('bookmarksModal');
        if (existingModal) existingModal.remove();
        
        // Create new modal
        const modal = document.createElement('div');
        modal.id = 'bookmarksModal';
        modal.className = 'modal';
        
        const html = ['<div class="modal-content"><div class="modal-header"><h3><i class="fas fa-heart"></i> Tersimpan</h3><button class="close-btn" data-close>×</button></div><div class="modal-body">'];
        
        // Get verse bookmarks
        const verseBookmarks = this._loadJSON('alquran_verse_bookmarks', []);
        
        if (verseBookmarks.length === 0) {
            html.push('<div class="empty-state"><i class="fas fa-heart-broken"></i><h3>Belum Ada Favorit</h3><p>Tandai ayat favorit Anda dengan tombol bookmark</p></div>');
        } else {
            html.push('<div class="bookmarks-list">');
            for (const key of verseBookmarks) {
                const [surahNum, verseNum] = key.split(':');
                const surahInfo = typeof QURAN_SURAHS !== 'undefined' ? QURAN_SURAHS.find(s => s.number === parseInt(surahNum)) : null;
                if (surahInfo) {
                    html.push(`
                        <div class="bookmark-item verse-bookmark" data-surah="${surahNum}" data-verse="${verseNum}">
                            <div class="bookmark-info">
                                <h4>${surahInfo.nameArabic}</h4>
                                <p>${surahInfo.name} • Ayat ${verseNum}</p>
                            </div>
                            <button class="remove-bookmark" data-remove="${key}"><i class="fas fa-trash"></i></button>
                        </div>
                    `);
                }
            }
            html.push('</div>');
        }
        html.push('</div></div>');
        modal.innerHTML = html.join('');
        
        // Append to body and show
        document.body.appendChild(modal);
        modal.style.setProperty('display', 'flex', 'important');
        
        // Close handlers
        modal.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click', ()=>modal.remove()));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Click verse bookmark to navigate
        modal.querySelectorAll('.verse-bookmark').forEach(el => {
            el.addEventListener('click', (e) => {
                if (!e.target.closest('.remove-bookmark')) {
                    const surahNum = parseInt(el.dataset.surah);
                    const verseNum = parseInt(el.dataset.verse);
                    this.readSurah(surahNum).then(() => {
                        setTimeout(() => {
                            const verseEl = document.querySelector(`[data-verse-number="${verseNum}"]`);
                            if (verseEl) {
                                verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                verseEl.style.background = 'rgba(0, 255, 255, 0.15)';
                                setTimeout(() => {
                                    verseEl.style.background = '';
                                }, 2000);
                            }
                        }, 300);
                    });
                    modal.remove();
                }
            });
        });
        
        // Remove bookmark
        modal.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click', (e)=>{ 
            e.stopPropagation(); 
            const key = b.dataset.remove;
            const arr = this._loadJSON('alquran_verse_bookmarks', []);
            const updated = arr.filter(x => x !== key);
            this._saveJSON('alquran_verse_bookmarks', updated);
            this._notify('Bookmark dihapus', 'info');
            this._showBookmarksModal(); 
        }));
    }

    _showPageJumpModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'pageJumpModal';
        
        const html = ['<div class="modal-content page-jump-modal-content">'];
        html.push('<div class="modal-header">');
        html.push('<h3><i class="fas fa-file-alt"></i> Buka Halaman</h3>');
        html.push('<button class="close-btn" data-close>×</button>');
        html.push('</div>');
        html.push('<div class="modal-body">');
        
        html.push('<div class="page-jump-wrapper">');
        html.push('<div class="page-input-section">');
        html.push('<label class="input-label"><i class="fas fa-hashtag"></i> Nomor Halaman</label>');
        html.push('<div class="page-input-group">');
        html.push(`<input type="number" id="jumpPageInput" min="1" max="604" value="${this.currentPage}" class="page-jump-input" placeholder="1-604">`);
        html.push('<button class="btn-goto-page" id="btnGoToPage"><i class="fas fa-arrow-right"></i> Buka</button>');
        html.push('</div>');
        html.push('<p class="input-hint">Masukkan nomor halaman dari 1 sampai 604</p>');
        html.push('</div>');
        
        html.push('<div class="quick-access-section">');
        html.push('<h4 class="section-title"><i class="fas fa-bolt"></i> Akses Cepat</h4>');
        html.push('<div class="quick-page-grid">');
        html.push('<button class="quick-page-btn" data-page="1"><i class="fas fa-play"></i><span>Halaman 1</span><small>Awal Al-Qur\'an</small></button>');
        html.push('<button class="quick-page-btn" data-page="302"><i class="fas fa-grip-lines"></i><span>Halaman 302</span><small>Tengah Al-Qur\'an</small></button>');
        html.push('<button class="quick-page-btn" data-page="582"><i class="fas fa-star"></i><span>Halaman 582</span><small>Juz 30 (Juz \'Amma)</small></button>');
        html.push('<button class="quick-page-btn" data-page="604"><i class="fas fa-flag-checkered"></i><span>Halaman 604</span><small>Akhir Al-Qur\'an</small></button>');
        html.push('</div>');
        html.push('</div>');
        
        html.push('</div></div></div>');
        
        modal.innerHTML = html.join('');
        document.body.appendChild(modal);
        modal.style.setProperty('display', 'flex', 'important');
        
        // Close handler
        modal.querySelector('[data-close]').addEventListener('click', () => modal.remove());
        
        // Go to page button
        modal.querySelector('#btnGoToPage').addEventListener('click', () => {
            const input = modal.querySelector('#jumpPageInput');
            const page = parseInt(input.value, 10);
            if (page >= 1 && page <= 604) {
                this.openPage(page);
                modal.remove();
            } else {
                this._notify('Masukkan nomor halaman antara 1-604', 'error');
            }
        });
        
        // Quick access buttons
        modal.querySelectorAll('.quick-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page, 10);
                this.openPage(page);
                modal.remove();
            });
        });
        
        // Backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Enter key to jump
        const input = modal.querySelector('#jumpPageInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    modal.querySelector('#btnGoToPage').click();
                }
            });
            // Don't auto-focus on mobile to prevent keyboard popup
            // setTimeout(() => {
            //     input.focus();
            //     input.select();
            // }, 100);
        }
    }

    _showVerseJumpModal(surahNumber, totalVerses) {
        // Get surah info
        const surah = typeof QURAN_SURAHS !== 'undefined' ? QURAN_SURAHS.find(s => s.number === surahNumber) : null;
        if (!surah) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal verse-jump-modal';
        
        const html = ['<div class="modal-content verse-jump-content">'];
        html.push(`<div class="modal-header"><h3>Lompat ke Ayat - ${surah.name}</h3><button class="close-btn" data-close>×</button></div>`);
        html.push('<div class="modal-body">');
        html.push('<div class="verse-jump-container">');
        html.push(`<label>Pilih nomor ayat (1-${totalVerses})</label>`);
        html.push(`<input type="number" id="jumpVerseInput" min="1" max="${totalVerses}" value="1" class="verse-jump-input">`);
        html.push(`<button class="btn-jump-to-verse" id="btnJumpToVerse">Lompat ke Ayat</button>`);
        
        // Quick verse access - like Android app
        html.push('<div class="quick-verse-access">');
        html.push('<h4>Akses Cepat</h4>');
        html.push('<div class="quick-verse-grid">');
        
        // Generate quick access buttons (every 10 verses, plus first and last)
        const quickVerses = [1];
        for (let i = 10; i <= totalVerses; i += 10) {
            quickVerses.push(i);
        }
        if (quickVerses[quickVerses.length - 1] !== totalVerses) {
            quickVerses.push(totalVerses);
        }
        
        quickVerses.forEach(v => {
            html.push(`<button class="quick-verse-btn" data-verse="${v}">Ayat ${v}</button>`);
        });
        
        html.push('</div></div>');
        html.push('</div></div></div>');
        
        modal.innerHTML = html.join('');
        document.body.appendChild(modal);
        modal.style.setProperty('display', 'flex', 'important');
        
        // Close button
        modal.querySelector('[data-close]').addEventListener('click', () => modal.remove());
        
        // Jump button
        modal.querySelector('#btnJumpToVerse').addEventListener('click', () => {
            const input = modal.querySelector('#jumpVerseInput');
            const verseNum = parseInt(input.value, 10);
            if (isNaN(verseNum) || verseNum < 1 || verseNum > totalVerses) {
                this._notify(`Masukkan nomor ayat antara 1-${totalVerses}`, 'error');
                return;
            }
            this.readSurahAndJumpToVerse(surahNumber, verseNum);
            modal.remove();
            // Close the surah list modal too
            const surahModal = document.getElementById('surahListModal');
            if (surahModal) surahModal.remove();
        });
        
        // Quick verse buttons
        modal.querySelectorAll('.quick-verse-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const verseNum = parseInt(btn.dataset.verse, 10);
                this.readSurahAndJumpToVerse(surahNumber, verseNum);
                modal.remove();
                // Close the surah list modal too
                const surahModal = document.getElementById('surahListModal');
                if (surahModal) surahModal.remove();
            });
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Enter key to jump and input validation
        const input = modal.querySelector('#jumpVerseInput');
        if (input) {
            // Validate input on change
            input.addEventListener('input', (e) => {
                let val = parseInt(e.target.value, 10);
                if (val > totalVerses) {
                    e.target.value = totalVerses;
                } else if (val < 1 && e.target.value !== '') {
                    e.target.value = 1;
                }
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    modal.querySelector('#btnJumpToVerse').click();
                }
            });
            // Don't auto-focus on mobile to prevent keyboard popup
            // setTimeout(() => input.focus(), 100);
        }
    }

    async readSurahAndJumpToVerse(surahNumber, verseNumber) {
        // First, load the surah
        await this.readSurah(surahNumber);
        
        // Then, scroll to the specific verse after a short delay
        setTimeout(() => {
            const verseElement = this.container.querySelector(`[data-verse-number="${verseNumber}"]`);
            if (verseElement) {
                verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Highlight the verse temporarily
                verseElement.classList.add('verse-highlight');
                setTimeout(() => verseElement.classList.remove('verse-highlight'), 2000);
            }
        }, 300);
    }

    _showSettingsModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('settingsModal');
        if (existingModal) existingModal.remove();
        
        // Create new modal
        const modal = document.createElement('div');
        modal.id = 'settingsModal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-cog"></i> Pengaturan</h3>
                    <button class="close-btn" data-close>×</button>
                </div>
                <div class="modal-body">
                    <div class="settings-panel">
                        <div class="setting-item">
                            <div class="setting-label">
                                <i class="fas fa-eye-slash"></i>
                                <span>Sembunyikan Transliterasi</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="set_hide_translit" ${this.settings.hideTransliteration ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">
                                <i class="fas fa-language"></i>
                                <span>Sembunyikan Terjemahan</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="set_hide_trans" ${this.settings.hideTranslation ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">
                                <i class="fas fa-forward"></i>
                                <span>Auto-play halaman berikutnya</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="set_autoplay" ${this.settings.autoPlayNext ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">
                                <i class="fas fa-book-reader"></i>
                                <span>Sembunyikan Lanjutkan Bacaan</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="set_hide_lastread" ${this.settings.hideLastRead ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">
                                <i class="fas fa-brain"></i>
                                <span>Sembunyikan Fitur Hafalan</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="set_hide_memorization" ${this.settings.hideMemorization ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append to body and show
        document.body.appendChild(modal);
        modal.style.setProperty('display', 'flex', 'important');
        
        // Close handlers
        modal.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click', ()=>modal.remove()));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        document.getElementById('set_hide_translit').addEventListener('change', (e)=>{ 
            this.settings.hideTransliteration = e.target.checked; 
            this._saveJSON('alquran_settings', this.settings); 
            if (this.readMode === 'surah' && this.currentSurahData) {
                this.renderSurahMode();
            } else {
                this.render();
            }
        });
        document.getElementById('set_hide_trans').addEventListener('change', (e)=>{ 
            this.settings.hideTranslation = e.target.checked; 
            this._saveJSON('alquran_settings', this.settings); 
            if (this.readMode === 'surah' && this.currentSurahData) {
                this.renderSurahMode();
            } else {
                this.render();
            }
        });
        document.getElementById('set_autoplay').addEventListener('change', (e)=>{ 
            this.settings.autoPlayNext = e.target.checked; 
            this._saveJSON('alquran_settings', this.settings); 
        });
        document.getElementById('set_hide_lastread').addEventListener('change', (e)=>{ 
            this.settings.hideLastRead = e.target.checked; 
            this._saveJSON('alquran_settings', this.settings); 
            if (this.readMode === 'surah' && this.currentSurahData) {
                this.renderSurahMode();
            } else {
                this.render();
            }
        });
        document.getElementById('set_hide_memorization').addEventListener('change', (e)=>{ 
            this.settings.hideMemorization = e.target.checked; 
            this._saveJSON('alquran_settings', this.settings); 
            if (this.readMode === 'surah' && this.currentSurahData) {
                this.renderSurahMode();
            } else {
                this.render();
            }
        });
    }

    _showMemorizationProgress() {
        // Check if memorization feature is disabled
        if (this.settings.hideMemorization) {
            const modal = document.createElement('div'); 
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content modal-progress">
                    <div class="modal-header">
                        <h3><i class="fas fa-brain"></i> Progress Hafalan</h3>
                        <button class="close-btn" data-close>×</button>
                    </div>
                    <div class="modal-body">
                        <div class="feature-disabled-message">
                            <i class="fas fa-info-circle"></i>
                            <h4>Fitur Hafalan Dinonaktifkan</h4>
                            <p>Anda telah menonaktifkan fitur hafalan di pengaturan.</p>
                            <p>Untuk mengaktifkan kembali, silakan buka <strong>Pengaturan</strong> dan nonaktifkan opsi "Sembunyikan Fitur Hafalan".</p>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            modal.style.setProperty('display', 'flex', 'important');
            
            modal.querySelector('[data-close]').addEventListener('click', () => modal.remove());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });
            return;
        }

        const progress = this._loadJSON('alquran_memorization_progress', {});
        const verseProgress = this._loadJSON('alquran_verse_progress', {});
        
        // Calculate statistics
        const totalVerses = Object.keys(verseProgress).length;
        const surahStats = {};
        
        // Group by surah
        Object.entries(verseProgress).forEach(([key, data]) => {
            const [surahNum] = key.split(':');
            if (!surahStats[surahNum]) {
                surahStats[surahNum] = { count: 0, verses: [] };
            }
            surahStats[surahNum].count++;
            surahStats[surahNum].verses.push({ key, ...data });
        });
        
        // Build content
        let contentHtml = '';
        
        if (totalVerses === 0) {
            contentHtml = `
                <div class="empty-state">
                    <i class="fas fa-brain"></i>
                    <h4>Belum Ada Progress Hafalan</h4>
                    <p>Mulai tandai ayat yang telah Anda hafal untuk melihat progress di sini</p>
                </div>
            `;
        } else {
            // Overall stats
            contentHtml = `
                <div class="progress-summary">
                    <div class="stat-card">
                        <i class="fas fa-check-circle"></i>
                        <div class="stat-info">
                            <span class="stat-value">${totalVerses}</span>
                            <span class="stat-label">Ayat Dihafal</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-book-quran"></i>
                        <div class="stat-info">
                            <span class="stat-value">${Object.keys(surahStats).length}</span>
                            <span class="stat-label">Surat</span>
                        </div>
                    </div>
                </div>
                <div class="progress-list-header">
                    <h4>Detail Per Surat</h4>
                </div>
                <div class="progress-surah-list">
            `;
            
            // Sort by surah number
            const sortedSurahs = Object.entries(surahStats).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
            
            sortedSurahs.forEach(([surahNum, data]) => {
                const surahInfo = typeof QURAN_SURAHS !== 'undefined' ? QURAN_SURAHS.find(s => s.number === parseInt(surahNum)) : null;
                if (surahInfo) {
                    const percentage = Math.round((data.count / surahInfo.verses) * 100);
                    contentHtml += `
                        <div class="progress-surah-item">
                            <div class="progress-surah-header">
                                <div class="surah-name-progress">
                                    <span class="surah-number">${surahNum}</span>
                                    <div class="surah-info-progress">
                                        <strong>${surahInfo.name}</strong>
                                        <span>${data.count} / ${surahInfo.verses} ayat</span>
                                    </div>
                                </div>
                                <span class="progress-percentage">${percentage}%</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                }
            });
            
            contentHtml += '</div>';
        }
        
        const modal = document.createElement('div'); 
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-progress">
                <div class="modal-header">
                    <h3><i class="fas fa-brain"></i> Progress Hafalan</h3>
                    <button class="close-btn" data-close>×</button>
                </div>
                <div class="modal-body">
                    ${contentHtml}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.setProperty('display', 'flex', 'important');
        
        modal.querySelector('[data-close]').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    _toggleTranslationSetting() { this.settings.hideTranslation = !this.settings.hideTranslation; this._saveJSON('alquran_settings', this.settings); this.render(); }

    async loadPageData(pageNumber) {
        try {
            const pageStr = String(pageNumber).padStart(3, '0');
            const response = await fetch(`${this.basePath}/js/data/alquran/pages/Page${pageStr}.json`);
            
            if (!response.ok) {
                throw new Error(`Page ${pageNumber} not found`);
            }
            
            const pageData = await response.json();
            return pageData;
        } catch (error) {
            console.error(`Error loading page ${pageNumber}:`, error);
            return null;
        }
    }

    async readSurah(surahNumber) {
        try {
            // Get surah info from QURAN_SURAHS
            const surah = typeof QURAN_SURAHS !== 'undefined' ? QURAN_SURAHS.find(s => s.number === surahNumber) : null;
            if (!surah) {
                throw new Error('Data surat tidak ditemukan');
            }
            
            // Load pages for this surah (NEW: per-page system)
            const allVerses = [];
            const startPage = surah.startPage;
            const endPage = surah.endPage;
            
            // Load all pages that contain this surah
            let surahDescription = '';
            for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                const pageData = await this.loadPageData(pageNum);
                
                if (pageData && pageData.surahs) {
                    // Extract verses for this specific surah from the page
                    const surahInPage = pageData.surahs.find(s => s.number === surahNumber);
                    if (surahInPage && surahInPage.verses) {
                        // Get description from first page
                        if (!surahDescription && surahInPage.description) {
                            surahDescription = surahInPage.description;
                        }
                        
                        // Add page number to each verse
                        const versesWithPage = surahInPage.verses.map(v => ({
                            ...v,
                            page: pageNum
                        }));
                        allVerses.push(...versesWithPage);
                    }
                }
            }
            
            if (allVerses.length === 0) {
                throw new Error('Surat belum tersedia');
            }
            
            // Build complete surah data
            const surahData = {
                number: surah.number,
                name: surah.name,
                nameArabic: surah.nameArabic,
                nameTransliteration: surah.name,
                meaning: surah.name,
                revelation: surah.revelation,
                totalVerses: surah.verses,
                startPage: surah.startPage,
                endPage: surah.endPage,
                description: surahDescription || 'Informasi surat ini akan segera tersedia.',
                verses: allVerses
            };
            
            this.readMode = 'surah';
            this.currentSurah = surahNumber;
            this.currentSurahData = surahData;
            this.currentVisiblePage = surah.startPage; // Track halaman yang visible
            
            await this.renderSurahMode();
            
        } catch (error) {
            console.error('Error loading surah:', error);
            this._notify('Gagal memuat surat. Data belum tersedia.', 'error');
        }
    }

    async readJuz(juzNumber) {
        try {
            // Get juz info
            const juz = typeof QURAN_JUZ !== 'undefined' ? QURAN_JUZ.find(j => j.number === juzNumber) : null;
            if (!juz) {
                throw new Error('Data juz tidak ditemukan');
            }
            
            // Load all pages in this juz
            const allVerses = [];
            const surahsInJuz = new Set();
            
            for (let pageNum = juz.startPage; pageNum <= juz.endPage; pageNum++) {
                const pageData = await this.loadPageData(pageNum);
                
                if (pageData && pageData.surahs) {
                    for (const surahInPage of pageData.surahs) {
                        surahsInJuz.add(surahInPage.number);
                        
                        // Add page number to each verse
                        const versesWithPage = surahInPage.verses.map(v => ({
                            ...v,
                            page: pageNum,
                            surahNumber: surahInPage.number,
                            surahName: surahInPage.name,
                            surahNameArabic: surahInPage.nameArabic
                        }));
                        allVerses.push(...versesWithPage);
                    }
                }
            }
            
            if (allVerses.length === 0) {
                throw new Error('Juz belum tersedia');
            }
            
            // Build juz data
            const juzData = {
                number: juz.number,
                name: juz.name,
                startPage: juz.startPage,
                endPage: juz.endPage,
                verses: allVerses,
                surahCount: surahsInJuz.size
            };
            
            this.readMode = 'juz';
            this.currentJuz = juzNumber;
            this.currentJuzData = juzData;
            this.currentSurah = null;
            this.currentSurahData = null;
            
            await this.renderJuzMode();
            
        } catch (error) {
            console.error('Error loading juz:', error);
            this._notify('Gagal memuat juz. Data belum tersedia.', 'error');
        }
    }

    async renderJuzMode() {
        if (!this.container || !this.currentJuzData) return;
        
        const juz = this.currentJuzData;
        
        // Ensure viewMode is set (default to translation)
        if (!this.viewMode) {
            this.viewMode = localStorage.getItem('alquran_view_mode') || 'translation';
        }
        
        // Reset audio setup flag when re-rendering
        this.audioSetupDone = false;
        this.audioListenersAttached = false;
        
        // Hide floating prayer widget when reading juz - FORCE HIDE
        const floatingWidget = document.getElementById('floatingPrayerWidget');
        if (floatingWidget) {
            floatingWidget.style.setProperty('display', 'none', 'important');
            floatingWidget.dataset.wasHidden = 'true';
        }
        
        // Build HTML untuk mode baca juz
        this.container.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.className = `alquran-container juz-mode ${this.viewMode === 'reading' ? 'reading-view' : 'translation-view'}`;
        
        // Sidebar Backdrop
        const backdrop = document.createElement('div');
        backdrop.className = `sidebar-backdrop ${this.sidebarOpen ? 'active' : ''}`;
        backdrop.id = 'sidebarBackdrop';
        
        // Sidebar Navigation
        const sidebar = document.createElement('div');
        sidebar.className = `quran-sidebar ${this.sidebarOpen ? 'open' : ''}`;
        sidebar.id = 'quranSidebar';
        sidebar.innerHTML = `
            <div class="sidebar-header">
                <h3>Navigasi</h3>
                <button class="sidebar-close" id="closeSidebar"><i class="fas fa-times"></i></button>
            </div>
            <div class="sidebar-tabs">
                <button class="sidebar-tab" data-tab="surah">Surat</button>
                <button class="sidebar-tab active" data-tab="juz">Juz</button>
                <button class="sidebar-tab" data-tab="page">Halaman</button>
            </div>
            <div class="sidebar-content">
                <div class="sidebar-search">
                    <input type="text" placeholder="Cari..." id="sidebarSearch">
                </div>
                <div class="sidebar-list" id="sidebarList">
                    <!-- Dynamic content -->
                </div>
            </div>
        `;
        
        // Floating Header (Sticky from start) - dengan navigasi buttons
        const floatingHeader = document.createElement('div');
        floatingHeader.className = 'floating-header visible'; // visible from start
        floatingHeader.id = 'floatingHeader';
        
        // Get first verse to initialize header
        const firstVerse = juz.verses[0];
        
        floatingHeader.innerHTML = `
            <div class="floating-header-left">
                <button class="floating-nav-btn" id="menuToggle" title="Menu"><i class="fas fa-bars"></i></button>
                <button class="floating-nav-btn" id="btnBackHome" title="Home"><i class="fas fa-home"></i></button>
                <div class="floating-surah-info-inline">
                    <span class="floating-surah-name">${firstVerse.surahName}</span>
                    <span class="floating-surah-meta">${firstVerse.surahNameArabic}</span>
                </div>
            </div>
            <div class="floating-header-center">
                <div class="floating-mode-toggle">
                    <button class="floating-mode-btn ${this.viewMode === 'reading' ? 'active' : ''}" data-mode="reading" title="Mode Baca">
                        <i class="fas fa-book"></i>
                    </button>
                    <button class="floating-mode-btn ${this.viewMode === 'translation' ? 'active' : ''}" data-mode="translation" title="Mode Terjemahan">
                        <i class="fas fa-language"></i>
                    </button>
                </div>
            </div>
            <div class="floating-header-right">
                <span class="floating-page-info" id="floatingPageInfo">
                    <span class="page-juz">Juz ${juz.number}</span>
                    <span class="page-divider">•</span>
                    <span class="page-number">Hal. ${firstVerse.page}</span>
                </span>
                <button class="floating-nav-btn" id="btnSettings" title="Pengaturan"><i class="fas fa-cog"></i></button>
            </div>
        `;
        
        // Header - Judul Juz
        const header = document.createElement('div');
        header.className = 'surah-title-section';
        header.innerHTML = `
            <div class="surah-title-clean">
                <h1 class="surah-arabic-name">الْجُزْءُ ${this._toArabicNumber(juz.number)}</h1>
                <h2 class="surah-info-line">Juz ${juz.number}</h2>
                <div class="surah-meta-badges">
                    <span class="meta-badge">Hal. ${juz.startPage}-${juz.endPage}</span>
                    <span class="meta-badge">${juz.surahCount} Surat</span>
                    <span class="meta-badge">${juz.verses.length} Ayat</span>
                </div>
            </div>
        `;
        
        // Verses container
        const versesContainer = document.createElement('div');
        versesContainer.className = 'surah-verses';
        
        // Add initial page separator for first page
        const initialPageSeparator = document.createElement('div');
        initialPageSeparator.className = 'page-separator';
        initialPageSeparator.innerHTML = `
            <div class="page-separator-line"></div>
            <div class="page-separator-info">
                <span class="page-separator-juz">${juz.name}</span>
                <span class="page-separator-divider">•</span>
                <span class="page-separator-page">Hal. ${juz.startPage}</span>
                <button class="page-separator-play" data-play-page="${juz.startPage}" title="Putar audio halaman ini">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="page-separator-line"></div>
        `;
        versesContainer.appendChild(initialPageSeparator);
        
        let currentPageInView = juz.startPage;
        let currentSurahInView = null;
        let needsBasmalah = false;
        
        for (const verse of juz.verses) {
            const versePage = verse.page;
            const verseSurah = verse.surahNumber;
            
            // Check if surah changed (for basmalah)
            if (currentSurahInView !== null && currentSurahInView !== verseSurah) {
                // New surah started, check if needs basmalah
                needsBasmalah = verseSurah !== 9; // All surahs except At-Taubah
            } else if (currentSurahInView === null) {
                // First surah in juz, check if we're at verse 1
                needsBasmalah = verse.number === 1 && verseSurah !== 9 && verseSurah !== 1;
            }
            
            // Add surah header when surah changes
            if (currentSurahInView !== verseSurah) {
                // Get full surah info from QURAN_SURAHS
                const surahInfo = typeof QURAN_SURAHS !== 'undefined' ? QURAN_SURAHS.find(s => s.number === verseSurah) : null;
                
                const surahHeaderEl = document.createElement('div');
                surahHeaderEl.className = 'juz-surah-title-section';
                
                if (surahInfo) {
                    surahHeaderEl.innerHTML = `
                        <div class="surah-title-clean">
                            <h1 class="surah-arabic-name">${verse.surahNameArabic}</h1>
                            <h2 class="surah-info-line">${verse.surahName}</h2>
                            <div class="surah-meta-badges">
                                <span class="meta-badge">${surahInfo.revelation}</span>
                                <span class="meta-badge">${surahInfo.verses} Ayat</span>
                                <button class="info-btn juz-surah-info-btn" data-surah="${verseSurah}"><i class="fas fa-info-circle"></i> Info</button>
                            </div>
                        </div>
                    `;
                } else {
                    // Fallback if QURAN_SURAHS not available
                    surahHeaderEl.innerHTML = `
                        <div class="surah-title-clean">
                            <h1 class="surah-arabic-name">${verse.surahNameArabic}</h1>
                            <h2 class="surah-info-line">${verse.surahName}</h2>
                        </div>
                    `;
                }
                versesContainer.appendChild(surahHeaderEl);
                
                // Add basmalah after surah header if needed
                if (needsBasmalah) {
                    const basmalahEl = document.createElement('div');
                    basmalahEl.className = 'basmalah-text';
                    basmalahEl.innerHTML = `
                        <div class="basmalah-arabic ${this.settings.arabicFont}">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
                    `;
                    versesContainer.appendChild(basmalahEl);
                    needsBasmalah = false;
                }
                
                currentSurahInView = verseSurah;
            }
            
            // Add page separator when page changes
            if (currentPageInView !== versePage) {
                const pageSeparator = document.createElement('div');
                pageSeparator.className = 'page-separator';
                pageSeparator.innerHTML = `
                    <div class="page-separator-line"></div>
                    <div class="page-separator-info">
                        <span class="page-separator-juz">${juz.name}</span>
                        <span class="page-separator-divider">•</span>
                        <span class="page-separator-page">Hal. ${versePage}</span>
                        <button class="page-separator-play" data-play-page="${versePage}" title="Putar audio halaman ini">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                    <div class="page-separator-line"></div>
                `;
                versesContainer.appendChild(pageSeparator);
                currentPageInView = versePage;
            }
            
            const verseEl = document.createElement('div');
            verseEl.dataset.verseNumber = verse.number;
            verseEl.dataset.pageNumber = versePage;
            verseEl.dataset.surahNumber = verseSurah;
            
            const verseKey = `${verseSurah}:${verse.number}`;
            const isBookmarked = this.verseBookmarks.includes(verseKey);
            const verseProgress = this._loadJSON('alquran_verse_progress', {});
            const isMemorized = verseProgress[verseKey] && verseProgress[verseKey].level === 4;
            
            if (this.viewMode === 'reading') {
                // Reading mode - hanya Arab dengan nomor ayat Arab, clickable untuk play audio
                const arabicNumber = this._toArabicNumber(verse.number);
                verseEl.className = 'verse-item-reading';
                verseEl.dataset.playVerse = verseKey; // Add play verse data attribute
                verseEl.innerHTML = `
                    <span class="verse-arabic-inline ${this.settings.arabicFont}">${verse.arabic}</span>
                    <span class="verse-number-ornament">&#xFD3F;${arabicNumber}&#xFD3E;</span>
                `;
            } else {
                // Translation mode - lengkap dengan tombol play audio
                verseEl.className = 'verse-item-clean';
                verseEl.innerHTML = `
                    <div class="verse-number-badge">${verse.number}</div>
                    <div class="verse-arabic ${this.settings.arabicFont}">${verse.arabic}</div>
                    ${!this.settings.hideTransliteration ? `<div class="verse-transliteration">${verse.transliteration}</div>` : ''}
                    ${!this.settings.hideTranslation ? `<div class="verse-translation">${verse.translation}</div>` : ''}
                    <div class="verse-actions-inline">
                        <button class="verse-btn-inline" data-play-verse-audio="${verseKey}" title="Putar Audio Ayat"><i class="fas fa-play-circle"></i></button>
                        <button class="verse-btn-inline" data-copy-verse="${verseKey}" title="Salin Ayat"><i class="fas fa-copy"></i></button>
                        <button class="verse-btn-inline" data-bookmark-verse="${verseKey}" title="Bookmark"><i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i></button>
                        ${!this.settings.hideMemorization ? `<button class="verse-btn-inline" data-memorize-verse="${verseKey}" title="Tandai Hafal"><i class="${isMemorized ? 'fas fa-check-circle' : 'far fa-circle'}"></i></button>` : ''}
                        ${verse.tafsir ? `<button class="verse-btn-inline" data-tafsir-verse="${verseKey}" title="Lihat Tafsir"><i class="fas fa-book-open"></i></button>` : ''}
                    </div>
                `;
            }
            versesContainer.appendChild(verseEl);
        }
        
        // Navigation to prev/next juz
        const juzNav = document.createElement('div');
        juzNav.className = 'surah-navigation';
        const prevJuz = this.currentJuz > 1 ? this.currentJuz - 1 : null;
        const nextJuz = this.currentJuz < 30 ? this.currentJuz + 1 : null;
        juzNav.innerHTML = `
            ${prevJuz ? `<button class="nav-surah-btn prev" data-juz="${prevJuz}"><i class="fas fa-chevron-left"></i> Juz Sebelumnya</button>` : '<div></div>'}
            ${nextJuz ? `<button class="nav-surah-btn next" data-juz="${nextJuz}">Juz Selanjutnya <i class="fas fa-chevron-right"></i></button>` : '<div></div>'}
        `;
        
        // Audio Player (same design as surah mode)
        const audioPlayerHTML = `
            <div class="audio-player" id="quranAudioPlayer" style="display: none;">
                <div class="audio-info" id="audioInfo">
                    <span class="audio-surah-name" id="audioSurahName">${juz.name} - Halaman ${juz.startPage}</span>
                    <span class="audio-verse-counter" id="audioVerseCounter" style="display: none;"></span>
                </div>
                <div class="audio-controls">
                    <button class="audio-btn audio-nav-btn" id="audioPrevVerse" title="Halaman Sebelumnya">
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button class="audio-btn" id="audioPlayPause">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="audio-btn audio-nav-btn" id="audioNextVerse" title="Halaman Selanjutnya">
                        <i class="fas fa-step-forward"></i>
                    </button>
                    <div class="audio-progress">
                        <div class="audio-progress-bar">
                            <div class="audio-progress-fill" id="audioProgressFill"></div>
                        </div>
                        <div class="audio-time">
                            <span id="audioCurrentTime">0:00</span>
                            <span id="audioDuration">0:00</span>
                        </div>
                    </div>
                    <button class="audio-btn" id="audioClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <audio id="quranAudioElement" preload="metadata"></audio>
            </div>
        `;
        
        // Assemble
        wrapper.appendChild(backdrop);
        wrapper.appendChild(sidebar);
        wrapper.appendChild(floatingHeader);
        wrapper.appendChild(header);
        wrapper.appendChild(versesContainer);
        wrapper.appendChild(juzNav);
        
        // Add audio player to container
        const audioPlayerDiv = document.createElement('div');
        audioPlayerDiv.innerHTML = audioPlayerHTML;
        wrapper.appendChild(audioPlayerDiv.firstElementChild);
        
        this.container.appendChild(wrapper);
        
        // Initialize sidebar content
        this._initializeSidebar();
        
        // Event listeners
        document.getElementById('menuToggle')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('closeSidebar')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebarBackdrop')?.addEventListener('click', () => this.toggleSidebar());
        
        // Juz navigation
        document.querySelectorAll('.nav-surah-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const juzNum = parseInt(btn.dataset.juz);
                // Scroll to top immediately before loading new juz
                window.scrollTo({ top: 0, behavior: 'instant' });
                this.readJuz(juzNum);
            });
        });
        
        // Settings button
        document.getElementById('btnSettings')?.addEventListener('click', () => this._showSettingsModal());
        
        // Sidebar tabs
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this._loadSidebarContent(tab.dataset.tab);
            });
        });
        
        document.getElementById('btnBackHome')?.addEventListener('click', () => this.resetToHome());
        
        // Floating header mode toggle
        document.querySelectorAll('.floating-mode-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const mode = btn.dataset.mode;
                if (mode && mode !== this.viewMode) {
                    // Stop audio completely when switching modes
                    this._stopAudio();
                    this.viewMode = mode;
                    localStorage.setItem('alquran_view_mode', mode);
                    await this.renderJuzMode();
                    this._notify(`Mode ${mode === 'reading' ? 'Membaca' : 'Terjemahan'} Aktif`, 'info');
                }
            });
        });
        
        // Verse actions (only in translation mode)
        if (this.viewMode === 'translation') {
            // Play verse audio button
            document.querySelectorAll('[data-play-verse-audio]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const verseKey = btn.dataset.playVerseAudio;
                    const [surahNum, verseNum] = verseKey.split(':').map(Number);
                    this.playVerseAudio(surahNum, verseNum);
                });
            });
            
            // Copy verse
            document.querySelectorAll('[data-copy-verse]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const verseKey = btn.dataset.copyVerse;
                    const [surahNum, verseNum] = verseKey.split(':').map(Number);
                    const verse = juz.verses.find(v => v.surahNumber === surahNum && v.number === verseNum);
                    if (verse) {
                        const text = `${verse.surahName} (${verse.surahNameArabic}) ${verseNum}\n\n${verse.arabic}\n\n${verse.transliteration}\n\n${verse.translation}`;
                        navigator.clipboard.writeText(text).then(() => {
                            this._notify('Ayat berhasil disalin', 'success');
                        });
                    }
                });
            });
            
            // Bookmark verse
            document.querySelectorAll('[data-bookmark-verse]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const verseKey = btn.dataset.bookmarkVerse;
                    this.toggleBookmark(verseKey);
                    const icon = btn.querySelector('i');
                    if (this.verseBookmarks.includes(verseKey)) {
                        icon.className = 'fas fa-bookmark';
                        this._notify('Ayat ditandai', 'success');
                    } else {
                        icon.className = 'far fa-bookmark';
                        this._notify('Tanda ayat dihapus', 'info');
                    }
                });
            });
            
            // Memorization
            if (!this.settings.hideMemorization) {
                document.querySelectorAll('[data-memorize-verse]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const verseKey = btn.dataset.memorizeVerse;
                        this._showMemorizationModal(verseKey);
                    });
                });
            }
            
            // Tafsir
            document.querySelectorAll('[data-tafsir-verse]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const verseKey = btn.dataset.tafsirVerse;
                    const [surahNum, verseNum] = verseKey.split(':').map(Number);
                    const verse = juz.verses.find(v => v.surahNumber === surahNum && v.number === verseNum);
                    if (verse && verse.tafsir) {
                        this._showTafsirModal(verse.surahName, verseNum, verse.tafsir);
                    }
                });
            });
        } else {
            // Reading mode - clicking verse shows play popup
            document.querySelectorAll('[data-play-verse]').forEach(verseEl => {
                verseEl.addEventListener('click', (e) => {
                    const verseKey = verseEl.dataset.playVerse;
                    const [surahNum, verseNum] = verseKey.split(':').map(n => parseInt(n));
                    this._showVersePlayPopup(e, surahNum, verseNum, verseEl);
                });
            });
        }
        
        // Surah info buttons in juz mode
        document.querySelectorAll('.juz-surah-info-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const surahNum = parseInt(btn.dataset.surah);
                // Load surah data to get description
                const surahInfo = typeof QURAN_SURAHS !== 'undefined' ? QURAN_SURAHS.find(s => s.number === surahNum) : null;
                if (surahInfo) {
                    // Try to load page data to get description
                    try {
                        const pageData = await this.loadPageData(surahInfo.startPage);
                        if (pageData && pageData.surahs) {
                            const surahData = pageData.surahs.find(s => s.number === surahNum);
                            if (surahData && surahData.description) {
                                this._showSurahInfoModal({
                                    ...surahInfo,
                                    description: surahData.description
                                });
                                return;
                            }
                        }
                    } catch (e) {
                        console.error('Error loading surah description:', e);
                    }
                    // Fallback without description
                    this._showSurahInfoModal(surahInfo);
                }
            });
        });
        
        // Page audio play buttons
        document.querySelectorAll('[data-play-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const pageNum = parseInt(btn.dataset.playPage);
                this._playPageAudio(pageNum);
            });
        });
        
        // Load juz tab in sidebar by default
        this._loadSidebarContent('juz');
        
        // Set up verse tracking for updating floating header with current surah and page
        this._setupJuzVerseTracking(juz.number);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    async renderSurahMode() {
        if (!this.container || !this.currentSurahData) return;
        
        const surah = this.currentSurahData;
        
        // Ensure viewMode is set (default to translation)
        if (!this.viewMode) {
            this.viewMode = localStorage.getItem('alquran_view_mode') || 'translation';
        }
        
        // Reset audio setup flag when re-rendering
        this.audioSetupDone = false;
        this.audioListenersAttached = false;
        
        // Hide floating prayer widget when reading surah - FORCE HIDE
        const floatingWidget = document.getElementById('floatingPrayerWidget');
        if (floatingWidget) {
            floatingWidget.style.setProperty('display', 'none', 'important');
            floatingWidget.dataset.wasHidden = 'true';
        }
        
        // Build HTML untuk mode baca surat
        this.container.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.className = `alquran-container surah-mode ${this.viewMode === 'reading' ? 'reading-view' : 'translation-view'}`;
        
        // Sidebar Backdrop
        const backdrop = document.createElement('div');
        backdrop.className = `sidebar-backdrop ${this.sidebarOpen ? 'active' : ''}`;
        backdrop.id = 'sidebarBackdrop';
        
        // Sidebar Navigation
        const sidebar = document.createElement('div');
        sidebar.className = `quran-sidebar ${this.sidebarOpen ? 'open' : ''}`;
        sidebar.id = 'quranSidebar';
        sidebar.innerHTML = `
            <div class="sidebar-header">
                <h3>Navigasi</h3>
                <button class="sidebar-close" id="closeSidebar"><i class="fas fa-times"></i></button>
            </div>
            <div class="sidebar-tabs">
                <button class="sidebar-tab active" data-tab="surah">Surat</button>
                <button class="sidebar-tab" data-tab="juz">Juz</button>
                <button class="sidebar-tab" data-tab="page">Halaman</button>
            </div>
            <div class="sidebar-content">
                <div class="sidebar-search">
                    <input type="text" placeholder="Cari surat..." id="sidebarSearch">
                </div>
                <div class="sidebar-list" id="sidebarList">
                    <!-- Dynamic content -->
                </div>
            </div>
        `;
        
        // Floating Header (Sticky from start) - dengan navigasi buttons
        const floatingHeader = document.createElement('div');
        floatingHeader.className = 'floating-header visible'; // visible from start
        floatingHeader.id = 'floatingHeader';
        floatingHeader.innerHTML = `
            <div class="floating-header-left">
                <button class="floating-nav-btn" id="menuToggle" title="Menu"><i class="fas fa-bars"></i></button>
                <button class="floating-nav-btn" id="btnBackHome" title="Home"><i class="fas fa-home"></i></button>
                <div class="floating-surah-info-inline">
                    <span class="floating-surah-name">${surah.name}</span>
                    <span class="floating-surah-meta">${surah.nameArabic}</span>
                </div>
            </div>
            <div class="floating-header-center">
                <div class="floating-mode-toggle">
                    <button class="floating-mode-btn ${this.viewMode === 'reading' ? 'active' : ''}" data-mode="reading" title="Mode Baca">
                        <i class="fas fa-book"></i>
                    </button>
                    <button class="floating-mode-btn ${this.viewMode === 'translation' ? 'active' : ''}" data-mode="translation" title="Mode Terjemahan">
                        <i class="fas fa-language"></i>
                    </button>
                </div>
            </div>
            <div class="floating-header-right">
                <span class="floating-page-info" id="floatingPageInfo">
                    <span class="page-juz">Juz ${this._getJuzByPage(surah.startPage)}</span>
                    <span class="page-divider">•</span>
                    <span class="page-number">Hal. ${surah.startPage}</span>
                </span>
                <button class="floating-nav-btn" id="btnSettings" title="Pengaturan"><i class="fas fa-cog"></i></button>
            </div>
        `;
        
        // Header - Judul Surat saja (tidak ada tombol lagi)
        const header = document.createElement('div');
        header.className = 'surah-title-section';
        header.innerHTML = `
            <div class="surah-title-clean">
                <h1 class="surah-arabic-name">${surah.nameArabic}</h1>
                <h2 class="surah-info-line">${surah.name}</h2>
                <div class="surah-meta-badges">
                    <span class="meta-badge">${surah.revelation}</span>
                    <span class="meta-badge">${surah.verses ? surah.verses.length : surah.totalVerses || surah.verses} Ayat</span>
                    <button class="info-btn" id="btnSurahInfo"><i class="fas fa-info-circle"></i> Info</button>
                    ${surah.otherNames && surah.otherNames.length > 0 ? `<button class="info-btn" id="btnOtherNames"><i class="fas fa-tag"></i> Nama Lain</button>` : ''}
                </div>
            </div>
        `;
        
        // Verses container
        const versesContainer = document.createElement('div');
        versesContainer.className = 'surah-verses';
        
        // Add initial page separator for first page
        const initialPageSeparator = document.createElement('div');
        initialPageSeparator.className = 'page-separator';
        initialPageSeparator.innerHTML = `
            <div class="page-separator-line"></div>
            <div class="page-separator-info">
                <span class="page-separator-juz">Juz ${this._getJuzByPage(surah.startPage)}</span>
                <span class="page-separator-divider">•</span>
                <span class="page-separator-page">Hal. ${surah.startPage}</span>
                <button class="page-separator-play" data-play-page="${surah.startPage}" title="Putar audio halaman ini">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="page-separator-line"></div>
        `;
        versesContainer.appendChild(initialPageSeparator);
        
        // Add Basmalah at the beginning (except for At-Taubah/surah 9)
        if (surah.number !== 9 && surah.number !== 1) { // Not At-Taubah and not Al-Fatihah (already has basmalah as verse 1)
            const basmalahEl = document.createElement('div');
            basmalahEl.className = 'basmalah-text';
            basmalahEl.innerHTML = `
                <div class="basmalah-arabic ${this.settings.arabicFont}">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
            `;
            versesContainer.appendChild(basmalahEl);
        }
        
        let currentPageInView = null;
        for (const verse of surah.verses) {
            const versePage = verse.page || surah.startPage;
            
            // Add page separator when page changes
            if (currentPageInView !== null && currentPageInView !== versePage) {
                const pageSeparator = document.createElement('div');
                pageSeparator.className = 'page-separator';
                pageSeparator.innerHTML = `
                    <div class="page-separator-line"></div>
                    <div class="page-separator-info">
                        <span class="page-separator-juz">Juz ${this._getJuzByPage(versePage)}</span>
                        <span class="page-separator-divider">•</span>
                        <span class="page-separator-page">Hal. ${versePage}</span>
                        <button class="page-separator-play" data-play-page="${versePage}" title="Putar audio halaman ini">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                    <div class="page-separator-line"></div>
                `;
                versesContainer.appendChild(pageSeparator);
            }
            currentPageInView = versePage;
            
            const verseEl = document.createElement('div');
            verseEl.dataset.verseNumber = verse.number; // Add data attribute for jumping
            verseEl.dataset.pageNumber = versePage; // Add page number for tracking
            verseEl.dataset.surahNumber = surah.number; // Add surah number for audio highlighting
            
            const verseKey = `${surah.number}:${verse.number}`;
            const isBookmarked = this.verseBookmarks.includes(verseKey);
            const verseProgress = this._loadJSON('alquran_verse_progress', {});
            const isMemorized = verseProgress[verseKey] && verseProgress[verseKey].level === 4;
            
            if (this.viewMode === 'reading') {
                // Reading mode - hanya Arab dengan nomor ayat Arab, clickable untuk play audio
                const arabicNumber = this._toArabicNumber(verse.number);
                verseEl.className = 'verse-item-reading';
                verseEl.dataset.playVerse = verseKey; // Add play verse data attribute
                verseEl.innerHTML = `
                    <span class="verse-arabic-inline ${this.settings.arabicFont}">${verse.arabic}</span>
                    <span class="verse-number-ornament">&#xFD3F;${arabicNumber}&#xFD3E;</span>
                `;
            } else {
                // Translation mode - lengkap dengan tombol play audio
                verseEl.className = 'verse-item-clean';
                verseEl.innerHTML = `
                    <div class="verse-number-badge">${verse.number}</div>
                    <div class="verse-arabic ${this.settings.arabicFont}">${verse.arabic}</div>
                    ${!this.settings.hideTransliteration ? `<div class="verse-transliteration">${verse.transliteration}</div>` : ''}
                    ${!this.settings.hideTranslation ? `<div class="verse-translation">${verse.translation}</div>` : ''}
                    <div class="verse-actions-inline">
                        <button class="verse-btn-inline" data-play-verse-audio="${verse.number}" title="Putar Audio Ayat"><i class="fas fa-play-circle"></i></button>
                        <button class="verse-btn-inline" data-copy-verse="${verse.number}" title="Salin Ayat"><i class="fas fa-copy"></i></button>
                        <button class="verse-btn-inline" data-bookmark-verse="${verse.number}" title="Bookmark"><i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i></button>
                        ${!this.settings.hideMemorization ? `<button class="verse-btn-inline" data-memorize-verse="${verse.number}" title="Tandai Hafal"><i class="${isMemorized ? 'fas fa-check-circle' : 'far fa-circle'}"></i></button>` : ''}
                        ${verse.tafsir ? `<button class="verse-btn-inline" data-tafsir-verse="${verse.number}" title="Lihat Tafsir"><i class="fas fa-book-open"></i></button>` : ''}
                    </div>
                `;
            }
            versesContainer.appendChild(verseEl);
        }
        
        // Navigation to prev/next surah
        const surahNav = document.createElement('div');
        surahNav.className = 'surah-navigation';
        const prevSurah = this.currentSurah > 1 ? this.currentSurah - 1 : null;
        const nextSurah = this.currentSurah < 114 ? this.currentSurah + 1 : null;
        surahNav.innerHTML = `
            ${prevSurah ? `<button class="nav-surah-btn prev" data-surah="${prevSurah}"><i class="fas fa-chevron-left"></i> Surat Sebelumnya</button>` : '<div></div>'}
            ${nextSurah ? `<button class="nav-surah-btn next" data-surah="${nextSurah}">Surat Selanjutnya <i class="fas fa-chevron-right"></i></button>` : '<div></div>'}
        `;
        
        // Audio Player (same design as Dzikir)
        const audioPlayerHTML = `
            <div class="audio-player" id="quranAudioPlayer" style="display: none;">
                <div class="audio-info" id="audioInfo">
                    <span class="audio-surah-name" id="audioSurahName">${surah.name} - Halaman ${surah.startPage}</span>
                    <span class="audio-verse-counter" id="audioVerseCounter" style="display: none;"></span>
                </div>
                <div class="audio-controls">
                    <button class="audio-btn audio-nav-btn" id="audioPrevVerse" title="Halaman Sebelumnya">
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button class="audio-btn" id="audioPlayPause">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="audio-btn audio-nav-btn" id="audioNextVerse" title="Halaman Selanjutnya">
                        <i class="fas fa-step-forward"></i>
                    </button>
                    <div class="audio-progress">
                        <div class="audio-progress-bar">
                            <div class="audio-progress-fill" id="audioProgressFill"></div>
                        </div>
                        <div class="audio-time">
                            <span id="audioCurrentTime">0:00</span>
                            <span id="audioDuration">0:00</span>
                        </div>
                    </div>
                    <button class="audio-btn" id="audioClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <audio id="quranAudioElement" preload="metadata"></audio>
            </div>
        `;
        
        // Assemble
        wrapper.appendChild(backdrop);
        wrapper.appendChild(sidebar);
        wrapper.appendChild(floatingHeader);  // Header sticky di paling atas
        wrapper.appendChild(header);          // Nama surat di bawah
        wrapper.appendChild(versesContainer);
        wrapper.appendChild(surahNav);
        
        // Add audio player to container
        const audioPlayerDiv = document.createElement('div');
        audioPlayerDiv.innerHTML = audioPlayerHTML;
        wrapper.appendChild(audioPlayerDiv.firstElementChild);
        
        this.container.appendChild(wrapper);
        
        // Initialize sidebar content
        this._initializeSidebar();
        
        // Set up verse tracking for last read
        this._setupVerseTracking(surah.number);
        
        // Event listeners
        document.getElementById('menuToggle')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('closeSidebar')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebarBackdrop')?.addEventListener('click', () => this.toggleSidebar());
        
        // Surah navigation
        document.querySelectorAll('.nav-surah-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const surahNum = parseInt(btn.dataset.surah);
                // Scroll to top immediately before loading new surah
                window.scrollTo({ top: 0, behavior: 'instant' });
                this.readSurah(surahNum);
            });
        });
        
        // View mode slider toggle
        document.querySelectorAll('.view-slider-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                // Stop audio completely when switching modes
                this._stopAudio();
                this.viewMode = btn.dataset.mode;
                localStorage.setItem('alquran_view_mode', this.viewMode);
                await this.renderSurahMode();
                this._notify(`Mode ${this.viewMode === 'reading' ? 'Membaca' : 'Terjemahan'} Aktif`, 'info');
            });
        });
        
        // Settings button
        document.getElementById('btnSettings')?.addEventListener('click', () => this._showSettingsModal());
        
        // Sidebar tabs
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this._loadSidebarContent(tab.dataset.tab);
            });
        });
        
        // Info buttons
        document.getElementById('btnSurahInfo')?.addEventListener('click', () => this._showSurahInfoModal(surah));
        document.getElementById('btnOtherNames')?.addEventListener('click', () => this._showOtherNamesModal(surah));
        document.getElementById('btnBackHome')?.addEventListener('click', () => this.resetToHome());
        
        document.getElementById('playSurahAudio')?.addEventListener('click', () => {
            this._playAudio(surah);
        });
        
        document.getElementById('copySurah')?.addEventListener('click', () => this.copySurahText());
        
        // Floating header mode toggle
        document.querySelectorAll('.floating-mode-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const mode = btn.dataset.mode;
                if (mode && mode !== this.viewMode) {
                    // Stop audio completely when switching modes
                    this._stopAudio();
                    this.viewMode = mode;
                    localStorage.setItem('alquran_view_mode', mode);
                    await this.renderSurahMode();
                    this._notify(`Mode ${mode === 'reading' ? 'Membaca' : 'Terjemahan'} Aktif`, 'info');
                }
            });
        });
        
        // Verse actions (only in translation mode)
        if (this.viewMode === 'translation') {
            // Play verse audio button
            this.container.querySelectorAll('[data-play-verse-audio]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const verseNum = parseInt(btn.dataset.playVerseAudio);
                    this.playVerseAudio(surah.number, verseNum);
                });
            });
            
            this.container.querySelectorAll('[data-copy-verse]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const verseNum = parseInt(btn.dataset.copyVerse);
                    const verse = surah.verses.find(v => v.number === verseNum);
                    if (verse) {
                        const text = `${verse.arabic}\n\n${verse.transliteration}\n\n${verse.translation}\n\n(QS ${surah.name}:${verseNum})`;
                        navigator.clipboard.writeText(text).then(() => this._notify('Ayat disalin', 'success'));
                    }
                });
            });
            
            this.container.querySelectorAll('[data-bookmark-verse]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const verseNum = parseInt(btn.dataset.bookmarkVerse);
                    this.bookmarkVerse(surah.number, verseNum);
                });
            });
            
            // Memorize button
            this.container.querySelectorAll('[data-memorize-verse]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const verseNum = parseInt(btn.dataset.memorizeVerse);
                    this.markVerseMemorized(surah.number, verseNum);
                });
            });
            
            // Tafsir button
            this.container.querySelectorAll('[data-tafsir-verse]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const verseNum = parseInt(btn.dataset.tafsirVerse);
                    const verse = surah.verses.find(v => v.number === verseNum);
                    if (verse && verse.tafsir) {
                        this._showTafsirModal(verse, surah);
                    }
                });
            });
        } else {
            // Reading mode - clicking verse shows play popup
            this.container.querySelectorAll('[data-play-verse]').forEach(verseEl => {
                verseEl.addEventListener('click', (e) => {
                    const verseKey = verseEl.dataset.playVerse;
                    const [surahNum, verseNum] = verseKey.split(':').map(n => parseInt(n));
                    this._showVersePlayPopup(e, surahNum, verseNum, verseEl);
                });
            });
        }
        
        // Play audio from specific page (page separator buttons)
        this.container.querySelectorAll('[data-play-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const pageNum = parseInt(btn.dataset.playPage);
                // Show audio player and play from this specific page
                const audioPlayer = document.getElementById('quranAudioPlayer');
                if (audioPlayer) {
                    audioPlayer.style.display = 'block';
                    
                    // Setup controls if not already done
                    if (!this.audioSetupDone) {
                        this._setupAudioControls(surah);
                        this.audioSetupDone = true;
                    }
                    
                    // Play from specific page
                    this._playPage(surah, pageNum);
                    // Removed notification to avoid popup spam
                }
            });
        });
    }
    
    _setupVerseTracking(surahNumber) {
        // Floating header is now always visible (no need for scroll listener)
        
        // Use Intersection Observer to track visible verses and update page number
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };
        
        let trackingTimeout = null;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const verseNumber = parseInt(entry.target.dataset.verseNumber);
                    const pageNumber = parseInt(entry.target.dataset.pageNumber);
                    
                    if (verseNumber) {
                        // Update visible page number in header
                        if (pageNumber && this.currentVisiblePage !== pageNumber) {
                            this.currentVisiblePage = pageNumber;
                            const pageInfoEl = document.getElementById('floatingPageInfo');
                            if (pageInfoEl) {
                                const juz = this._getJuzByPage(pageNumber);
                                pageInfoEl.innerHTML = `
                                    <span class="page-juz">Juz ${juz}</span>
                                    <span class="page-divider">•</span>
                                    <span class="page-number">Hal. ${pageNumber}</span>
                                `;
                            }
                        }
                        
                        // Debounce the save operation
                        if (trackingTimeout) clearTimeout(trackingTimeout);
                        trackingTimeout = setTimeout(() => {
                            this._saveJSON('alquran_last_read', {
                                surah: surahNumber,
                                verse: verseNumber,
                                timestamp: new Date().toISOString()
                            });
                        }, 1000);
                    }
                }
            });
        }, observerOptions);
        
        // Observe all verse elements
        const verseElements = this.container.querySelectorAll('[data-verse-number]');
        verseElements.forEach(el => observer.observe(el));
        
        // Store observer for cleanup
        if (this.verseObserver) {
            this.verseObserver.disconnect();
        }
        this.verseObserver = observer;
    }

    _setupJuzVerseTracking(juzNumber) {
        // Use Intersection Observer to track visible verses and update surah name and page number
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };
        
        let trackingTimeout = null;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const verseNumber = parseInt(entry.target.dataset.verseNumber);
                    const pageNumber = parseInt(entry.target.dataset.pageNumber);
                    const surahNumber = parseInt(entry.target.dataset.surahNumber);
                    
                    if (verseNumber && pageNumber && surahNumber) {
                        // Get current verse data
                        const verse = this.currentJuzData.verses.find(v => 
                            v.surahNumber === surahNumber && v.number === verseNumber
                        );
                        
                        if (verse) {
                            // Update visible surah name in header
                            const surahNameEl = document.querySelector('.floating-surah-name');
                            const surahMetaEl = document.querySelector('.floating-surah-meta');
                            if (surahNameEl && surahMetaEl) {
                                surahNameEl.textContent = verse.surahName;
                                surahMetaEl.textContent = verse.surahNameArabic;
                            }
                            
                            // Update visible page number in header
                            if (this.currentVisiblePage !== pageNumber) {
                                this.currentVisiblePage = pageNumber;
                                const pageInfoEl = document.getElementById('floatingPageInfo');
                                if (pageInfoEl) {
                                    pageInfoEl.innerHTML = `
                                        <span class="page-juz">Juz ${juzNumber}</span>
                                        <span class="page-divider">•</span>
                                        <span class="page-number">Hal. ${pageNumber}</span>
                                    `;
                                }
                            }
                        }
                        
                        // Debounce the save operation
                        if (trackingTimeout) clearTimeout(trackingTimeout);
                        trackingTimeout = setTimeout(() => {
                            this._saveJSON('alquran_last_read', {
                                surah: surahNumber,
                                verse: verseNumber,
                                juz: juzNumber,
                                timestamp: new Date().toISOString()
                            });
                        }, 1000);
                    }
                }
            });
        }, observerOptions);
        
        // Observe all verse elements
        const verseElements = this.container.querySelectorAll('[data-verse-number]');
        verseElements.forEach(el => observer.observe(el));
        
        // Store observer for cleanup
        if (this.verseObserver) {
            this.verseObserver.disconnect();
        }
        this.verseObserver = observer;
    }

    copySurahText() {
        if (!this.currentSurahData) return;
        const surah = this.currentSurahData;
        const text = `${surah.nameArabic} - ${surah.name}\n${surah.meaning}\n\n` +
            surah.verses.map(v => `${v.number}. ${v.arabic}\n${v.transliteration}\n${v.translation}`).join('\n\n') +
            `\n\n(QS ${surah.name})`;
        navigator.clipboard.writeText(text).then(() => this._notify('Teks surat disalin', 'success'));
    }

    shareSurah() {
        if (!this.currentSurahData) return;
        const surah = this.currentSurahData;
        const url = window.location.href.split('#')[0] + `#surah-${surah.number}`;
        const text = `Baca Surat ${surah.name} (${surah.nameArabic}) - ${surah.meaning}`;
        
        if (navigator.share) {
            navigator.share({ title: text, url }).catch(() => {});
        } else {
            navigator.clipboard.writeText(url).then(() => this._notify('Link surat disalin', 'success'));
        }
    }

    _updateLastRead(page) {
        this.history.unshift({ page, timestamp: new Date().toISOString() }); this.history = this.history.slice(0,20); this._saveJSON('alquran_history', this.history);
    }

    _formatLastRead() {
        if (!this.history || this.history.length===0) return 'Belum pernah';
        const last = new Date(this.history[0].timestamp); return last.toLocaleString('id-ID');
    }

    _formatTime(seconds){ if (!seconds || isNaN(seconds)) return '0:00'; const m=Math.floor(seconds/60); const s=Math.floor(seconds%60); return `${m}:${String(s).padStart(2,'0')}`; }

    _notify(msg, type='info') { const n = document.createElement('div'); n.className=`notification ${type}`; n.innerHTML = `<i class="fas fa-info-circle"></i><span>${msg}</span>`; document.body.appendChild(n); setTimeout(()=>n.classList.add('show'),50); setTimeout(()=>{ n.classList.remove('show'); setTimeout(()=>n.remove(),300); },1500); }

    _saveJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
    _loadJSON(key, fallback) { try { const v = localStorage.getItem(key); return v? JSON.parse(v): fallback; } catch(e){ return fallback; } }

    _getBasePath() {
        // Get base path for assets - handles subdirectory deployment
        const path = window.location.pathname;
        const base = path.substring(0, path.lastIndexOf('/'));
        // If deployed in subdirectory like /islamhub, return the base path
        // Otherwise return empty string for root deployment
        return base || '';
    }

    _cycleRepeat() { this.settings.autoRepeat = (this.settings.autoRepeat||1) >= 5 ? 1 : (this.settings.autoRepeat||1)+1; this._saveJSON('alquran_settings', this.settings); this._notify(`Pengulangan: ${this.settings.autoRepeat}x`,'info'); }

    // Sidebar functions
    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        const sidebar = document.getElementById('quranSidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
        if (backdrop) {
            backdrop.classList.toggle('active');
        }
    }

    _initializeSidebar() {
        this._loadSidebarContent('surah');
    }

    _loadSidebarContent(tab) {
        const listContainer = document.getElementById('sidebarList');
        if (!listContainer) return;

        if (tab === 'surah') {
            this._loadSurahList(listContainer);
        } else if (tab === 'juz') {
            this._loadJuzList(listContainer);
        } else if (tab === 'page') {
            this._loadPageList(listContainer);
        }
    }

    _loadSurahList(container) {
        if (typeof QURAN_SURAHS === 'undefined') {
            container.innerHTML = '<p class="sidebar-empty">Data surat tidak tersedia</p>';
            return;
        }

        let html = '';
        for (const surah of QURAN_SURAHS) {
            const isActive = this.currentSurah === surah.number;
            html += `
                <div class="sidebar-item ${isActive ? 'active' : ''}" data-surah="${surah.number}">
                    <div class="sidebar-item-number">${surah.number}</div>
                    <div class="sidebar-item-info">
                        <div class="sidebar-item-title">${surah.name}</div>
                        <div class="sidebar-item-meta">${surah.nameArabic} • ${surah.verses} ayat</div>
                    </div>
                    <div class="sidebar-item-actions">
                        <button class="sidebar-item-btn" data-read-surah="${surah.number}" title="Baca surat">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="sidebar-item-btn" data-verse-jump="${surah.number}" data-total-verses="${surah.verses}" title="Lompat ke ayat">
                            <i class="fas fa-list-ol"></i>
                        </button>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;

        // Add click handlers for read surah
        container.querySelectorAll('[data-read-surah]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const surahNum = parseInt(btn.dataset.readSurah);
                this.readSurah(surahNum);
                this.toggleSidebar();
            });
        });

        // Add click handlers for verse jump
        container.querySelectorAll('[data-verse-jump]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const surahNum = parseInt(btn.dataset.verseJump);
                const totalVerses = parseInt(btn.dataset.totalVerses);
                this._showVerseJumpModal(surahNum, totalVerses);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('sidebarSearch');
        if (searchInput) {
            searchInput.value = '';
            searchInput.placeholder = 'Cari surat...';
            searchInput.oninput = (e) => {
                const query = e.target.value.toLowerCase();
                container.querySelectorAll('.sidebar-item').forEach(item => {
                    const title = item.querySelector('.sidebar-item-title').textContent.toLowerCase();
                    const arabic = item.querySelector('.sidebar-item-meta').textContent.toLowerCase();
                    if (title.includes(query) || arabic.includes(query)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            };
        }
    }

    _loadJuzList(container) {
        if (typeof QURAN_JUZ === 'undefined') {
            container.innerHTML = '<p class="sidebar-empty">Data juz tidak tersedia</p>';
            return;
        }

        let html = '';
        for (const juz of QURAN_JUZ) {
            html += `
                <div class="sidebar-item" data-juz="${juz.number}">
                    <div class="sidebar-juz-badge">
                        <div class="juz-label">Juz</div>
                        <div class="juz-number">${juz.number}</div>
                    </div>
                    <div class="sidebar-item-info">
                        <div class="sidebar-item-title">${juz.name}</div>
                        <div class="sidebar-item-meta">Hal ${juz.startPage} - ${juz.endPage}</div>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </div>
            `;
        }
        container.innerHTML = html;

        container.querySelectorAll('[data-juz]').forEach(item => {
            item.addEventListener('click', () => {
                const juzNum = parseInt(item.dataset.juz);
                this.readJuz(juzNum);
                this.toggleSidebar();
            });
        });

        const searchInput = document.getElementById('sidebarSearch');
        if (searchInput) {
            searchInput.value = '';
            searchInput.placeholder = 'Cari juz...';
            searchInput.oninput = null;
        }
    }

    _loadPageList(container) {
        const searchInput = document.getElementById('sidebarSearch');
        if (searchInput) {
            searchInput.value = '';
            searchInput.placeholder = 'Masukkan nomor halaman (1-604)';
        }

        // Get current page context
        let currentPage = this.currentPage;
        if (this.readMode === 'surah' && this.currentSurahData) {
            currentPage = this.currentSurahData.startPage;
        }

        container.innerHTML = `
            <div class="page-jump-container">
                <p class="page-jump-label"><i class="fas fa-bookmark"></i> Lompat ke Halaman</p>
                <div class="page-input-group">
                    <input type="number" id="pageJumpInput" min="1" max="604" placeholder="1-604" value="${currentPage}">
                    <button class="page-jump-btn" id="pageJumpBtn">
                        <i class="fas fa-arrow-right"></i> Pergi
                    </button>
                </div>
                <div class="quick-pages">
                    <button class="quick-page-btn" data-page="1">
                        <i class="fas fa-home"></i>
                        <span>Halaman 1</span>
                    </button>
                    <button class="quick-page-btn" data-page="302">
                        <i class="fas fa-book-open"></i>
                        <span>Halaman 302</span>
                    </button>
                    <button class="quick-page-btn" data-page="604">
                        <i class="fas fa-flag-checkered"></i>
                        <span>Halaman 604</span>
                    </button>
                </div>
            </div>
        `;

        const jumpInput = document.getElementById('pageJumpInput');
        const jumpBtn = document.getElementById('pageJumpBtn');

        // Enter key handler
        jumpInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                jumpBtn?.click();
            }
        });

        // Jump button handler
        jumpBtn?.addEventListener('click', () => {
            const page = parseInt(jumpInput.value);
            if (page >= 1 && page <= 604) {
                this.openPage(page);
                this.toggleSidebar();
            } else {
                this._notify('Nomor halaman tidak valid (1-604)', 'error');
            }
        });

        // Quick page buttons
        container.querySelectorAll('.quick-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                this.openPage(page);
                this.toggleSidebar();
            });
        });
    }
    
    _setupSidebarContent() {
        // Initialize sidebar with default tab (surah list)
        this._initializeSidebar();
        
        // Setup tab switching
        const tabButtons = document.querySelectorAll('.sidebar-tab');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all tabs
                tabButtons.forEach(t => t.classList.remove('active'));
                // Add active to clicked tab
                btn.classList.add('active');
                // Load content for this tab
                const tab = btn.dataset.tab;
                this._loadSidebarContent(tab);
            });
        });
    }

    // Modal popups for surah info
    _showSurahInfoModal(surah) {
        const modal = this._createModal('Tentang Surat Ini', `
            <div class="modal-surah-info">
                <div class="info-header">
                    <h3>${surah.nameArabic}</h3>
                    <h4>${surah.name} (${surah.nameTransliteration})</h4>
                    <p class="meaning">${surah.meaning}</p>
                </div>
                <div class="info-content">
                    <p>${surah.description}</p>
                </div>
            </div>
        `);
    }

    _showOtherNamesModal(surah) {
        const namesHTML = surah.otherNames.map(name => `<li><i class="fas fa-check-circle"></i> ${name}</li>`).join('');
        const modal = this._createModal('Nama Lain Surat Ini', `
            <div class="modal-list-content">
                <ul class="names-list">${namesHTML}</ul>
            </div>
        `);
    }

    _showBenefitsModal(surah) {
        const benefitsHTML = surah.benefits.map(benefit => `<li><i class="fas fa-star"></i> ${benefit}</li>`).join('');
        const modal = this._createModal('Keutamaan', `
            <div class="modal-list-content">
                <ul class="benefits-list">${benefitsHTML}</ul>
            </div>
        `);
    }

    _showTafsirModal(verse, surah) {
        const modal = this._createModal(`Tafsir QS ${surah.name}:${verse.number}`, `
            <div class="modal-tafsir">
                <div class="tafsir-verse-arabic">${verse.arabic}</div>
                <div class="tafsir-verse-trans">${verse.translation}</div>
                <div class="tafsir-content">
                    <h4><i class="fas fa-book-open"></i> Tafsir</h4>
                    <p>${verse.tafsir}</p>
                </div>
            </div>
        `);
    }

    _createModal(title, content) {
        // Remove existing modal if any
        const existing = document.querySelector('.popup-modal-overlay');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.className = 'popup-modal-overlay';
        modal.innerHTML = `
            <div class="popup-modal-content">
                <div class="popup-modal-header">
                    <h3>${title}</h3>
                    <button class="popup-close-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="popup-modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close handlers
        const closeBtn = modal.querySelector('.popup-close-btn');
        closeBtn.addEventListener('click', () => modal.remove());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // ESC key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Animate in
        setTimeout(() => modal.classList.add('show'), 10);

        return modal;
    }

    _playAudio(surah) {
        const audioPlayer = document.getElementById('quranAudioPlayer');
        if (!audioPlayer) return;
        
        // Show player
        audioPlayer.style.display = 'block';
        
        // Setup controls if not already done
        if (!this.audioSetupDone) {
            this._setupAudioControls(surah);
            this.audioSetupDone = true;
        }
        
        // Store current surah for audio playback
        this.currentAudioSurah = surah;
        this.currentAudioPage = surah.startPage;
        
        // Start playing from first page of surah
        this._playPage(surah, surah.startPage);
    }

    _setupAudioControls(surah) {
        const audioElement = document.getElementById('quranAudioElement');
        const playPauseBtn = document.getElementById('audioPlayPause');
        const prevBtn = document.getElementById('audioPrevVerse');
        const nextBtn = document.getElementById('audioNextVerse');
        const closeBtn = document.getElementById('audioClose');
        const progressFill = document.getElementById('audioProgressFill');
        const currentTimeEl = document.getElementById('audioCurrentTime');
        const durationEl = document.getElementById('audioDuration');
        
        // Remove old event listeners if they exist
        if (this.audioHandlers) {
            if (this.audioHandlers.prev) prevBtn?.removeEventListener('click', this.audioHandlers.prev);
            if (this.audioHandlers.next) nextBtn?.removeEventListener('click', this.audioHandlers.next);
        }
        
        // Initialize handlers object
        this.audioHandlers = this.audioHandlers || {};
        
        // Setup event listeners only once for static buttons
        if (!this.audioListenersAttached) {
            this.audioListenersAttached = true;
            
            // Play/Pause button
            playPauseBtn?.addEventListener('click', () => {
                if (audioElement.paused) {
                    audioElement.play().then(() => {
                        playPauseBtn.querySelector('i').className = 'fas fa-pause';
                        this.isPlaying = true;
                    }).catch(err => {
                        console.error('Audio play error:', err);
                        this._notify('Gagal memutar audio', 'error');
                    });
                } else {
                    audioElement.pause();
                    playPauseBtn.querySelector('i').className = 'fas fa-play';
                    this.isPlaying = false;
                }
            });
            
            // Close button - tutup audio player tanpa error dan hapus highlight
            closeBtn?.addEventListener('click', () => {
                try {
                    // Set flag to prevent error notification on close
                    this.isClosingAudio = true;
                    
                    audioElement.pause();
                    audioElement.src = '';
                    document.getElementById('quranAudioPlayer').style.display = 'none';
                    if (playPauseBtn && playPauseBtn.querySelector('i')) {
                        playPauseBtn.querySelector('i').className = 'fas fa-play';
                    }
                    this.isPlaying = false;
                    
                    // Remove verse highlight
                    document.querySelectorAll('.verse-item-reading.playing-audio, .verse-item-clean.playing-audio').forEach(el => {
                        el.classList.remove('playing-audio');
                    });
                    this.currentPlayingVerse = null;
                    
                    // Reset flag after a short delay
                    setTimeout(() => {
                        this.isClosingAudio = false;
                    }, 100);
                } catch (e) {
                    console.error('Error closing audio:', e);
                    this.isClosingAudio = false;
                }
            });
            
            // Time update
            audioElement?.addEventListener('timeupdate', () => {
                if (audioElement.duration) {
                    const percent = (audioElement.currentTime / audioElement.duration) * 100;
                    if (progressFill) progressFill.style.width = percent + '%';
                }
                if (currentTimeEl) currentTimeEl.textContent = this._formatTime(audioElement.currentTime);
            });
            
            // Loaded metadata
            audioElement?.addEventListener('loadedmetadata', () => {
                if (durationEl) durationEl.textContent = this._formatTime(audioElement.duration);
            });
            
            // Audio ended - handle both page and verse mode
            audioElement?.addEventListener('ended', () => {
                console.log('Audio ended, playing verse:', this.currentPlayingVerse, 'current page:', this.currentAudioPage, 'autoPlayNext:', this.settings.autoPlayNext);
                
                // Check if we're in verse mode
                if (this.currentPlayingVerse) {
                    const { surah, verse } = this.currentPlayingVerse;
                    const surahInfo = typeof QURAN_SURAHS !== 'undefined' ? QURAN_SURAHS.find(s => s.number === surah) : null;
                    const totalVerses = surahInfo ? surahInfo.verses : 286;
                    
                    if (this.settings.autoPlayNext && verse < totalVerses) {
                        // Auto-play next verse
                        this.playVerseAudio(surah, verse + 1);
                    } else {
                        // Stop at current verse
                        playPauseBtn.querySelector('i').className = 'fas fa-play';
                        this.isPlaying = false;
                        // Removed notifications for verse mode
                    }
                } else if (this.settings.autoPlayNext && this.currentAudioPage < 604) {
                    // Page mode - auto-play next page
                    this.currentAudioPage++;
                    this._playPage(this.currentAudioSurah, this.currentAudioPage);
                } else {
                    // Stop at current page
                    playPauseBtn.querySelector('i').className = 'fas fa-play';
                    this.isPlaying = false;
                    // Removed notifications for page mode
                }
            });
            
            // Audio error handling
            audioElement?.addEventListener('error', (e) => {
                // Don't show error notification if we're closing the audio player
                if (this.isClosingAudio || this.isLoadingNewAudio) {
                    return;
                }
                
                console.error('Audio error:', e);
                playPauseBtn.querySelector('i').className = 'fas fa-play';
                this.isPlaying = false;
                this._notify('Audio belum tersedia untuk halaman ini', 'error');
            });
        }
        
        // Always setup/update prev and next handlers (they change based on mode)
        // Previous button - handle both page and verse mode
        this.audioHandlers.prev = () => {
            // Check if we're in verse mode
            if (this.currentPlayingVerse) {
                const { surah, verse } = this.currentPlayingVerse;
                if (verse > 1) {
                    // Play previous verse in same surah
                    this.playVerseAudio(surah, verse - 1);
                } else {
                    this._notify('Sudah di ayat pertama surat ini', 'info');
                }
            } else {
                // Page mode
                console.log('Prev clicked, current page:', this.currentAudioPage);
                if (this.currentAudioPage > 1) {
                    this.currentAudioPage--;
                    this._playPage(this.currentAudioSurah, this.currentAudioPage);
                } else {
                    this._notify('Sudah di halaman pertama', 'info');
                }
            }
        };
        
        // Next button - handle both page and verse mode
        this.audioHandlers.next = () => {
            // Check if we're in verse mode
            if (this.currentPlayingVerse) {
                const { surah, verse } = this.currentPlayingVerse;
                const surahInfo = typeof QURAN_SURAHS !== 'undefined' ? QURAN_SURAHS.find(s => s.number === surah) : null;
                const totalVerses = surahInfo ? surahInfo.verses : 286; // fallback to max
                
                if (verse < totalVerses) {
                    // Play next verse in same surah
                    this.playVerseAudio(surah, verse + 1);
                } else {
                    this._notify('Sudah di ayat terakhir surat ini', 'info');
                }
            } else {
                // Page mode
                console.log('Next clicked, current page:', this.currentAudioPage);
                if (this.currentAudioPage < 604) {
                    this.currentAudioPage++;
                    this._playPage(this.currentAudioSurah, this.currentAudioPage);
                } else {
                    this._notify('Sudah di halaman terakhir', 'info');
                }
            }
        };
        
        // Attach the new handlers
        prevBtn?.addEventListener('click', this.audioHandlers.prev);
        nextBtn?.addEventListener('click', this.audioHandlers.next);
    }

    _playPage(surah, pageNumber) {
        const audioElement = document.getElementById('quranAudioElement');
        const surahNameEl = document.getElementById('audioSurahName');
        const playPauseBtn = document.getElementById('audioPlayPause');
        const currentTimeEl = document.getElementById('audioCurrentTime');
        const durationEl = document.getElementById('audioDuration');
        
        if (!audioElement) return;
        
        // Set flag to prevent error notification while loading new audio
        this.isLoadingNewAudio = true;
        
        this.currentAudioPage = pageNumber;
        // Clear verse mode when playing page audio
        this.currentPlayingVerse = null;
        
        // Get all surahs in this page - IMPORTANT: Update currentAudioSurah
        let displayText = '';
        let pageSurahs = [];
        
        if (typeof getSurahsByPage !== 'undefined') {
            pageSurahs = getSurahsByPage(pageNumber);
            if (pageSurahs && pageSurahs.length > 0) {
                // Update current audio surah to the first surah in this page
                this.currentAudioSurah = pageSurahs[0];
                
                // If multiple surahs in one page, show all
                if (pageSurahs.length > 1) {
                    const surahNames = pageSurahs.map(s => s.name).join(' • ');
                    displayText = `${surahNames} - Halaman ${pageNumber}`;
                } else {
                    displayText = `${pageSurahs[0].name} - Halaman ${pageNumber}`;
                }
            } else {
                displayText = `Halaman ${pageNumber}`;
            }
        } else {
            // Fallback: keep the passed surah
            this.currentAudioSurah = surah;
            displayText = `${surah.name} - Halaman ${pageNumber}`;
        }
        
        // Update info with correct surah name(s)
        if (surahNameEl) {
            surahNameEl.textContent = displayText;
        }
        
        // Reset time display
        if (currentTimeEl) currentTimeEl.textContent = '0:00';
        if (durationEl) durationEl.textContent = '0:00';
        
        // Build audio path: Page001.mp3, Page002.mp3, etc.
        const pagePadded = String(pageNumber).padStart(3, '0');
        const audioPath = `${this.basePath}/assets/audio/alquran/Page${pagePadded}.mp3`;
        
        console.log('Playing audio:', audioPath, 'Surahs:', displayText); // Debug log
        
        // Load and play
        audioElement.src = audioPath;
        audioElement.load();
        
        // Set duration when metadata is loaded (may already be cached)
        const updateDuration = () => {
            if (audioElement.duration && !isNaN(audioElement.duration) && durationEl) {
                durationEl.textContent = this._formatTime(audioElement.duration);
            }
        };
        
        // Try to update duration immediately if already loaded
        setTimeout(updateDuration, 100);
        
        audioElement.play().then(() => {
            if (playPauseBtn) {
                playPauseBtn.querySelector('i').className = 'fas fa-pause';
            }
            this.isPlaying = true;
            
            // Reset loading flag after successful play
            this.isLoadingNewAudio = false;
            
            // Update duration again after play starts (fallback)
            setTimeout(updateDuration, 200);
        }).catch(err => {
            console.error('Play error:', err, 'Path:', audioPath);
            if (playPauseBtn) {
                playPauseBtn.querySelector('i').className = 'fas fa-play';
            }
            this.isPlaying = false;
            this.isLoadingNewAudio = false; // Reset flag on error
            this._notify('Gagal memutar audio halaman ' + pageNumber, 'error');
        });
    }

    _formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    _getJuzByPage(pageNumber) {
        // Simple calculation: Juz 1 = pages 1-21, Juz 2 = 22-42, etc.
        // More accurate mapping can be added later
        if (pageNumber <= 21) return 1;
        if (pageNumber <= 41) return 2;
        if (pageNumber <= 61) return 3;
        if (pageNumber <= 81) return 4;
        if (pageNumber <= 101) return 5;
        if (pageNumber <= 121) return 6;
        if (pageNumber <= 141) return 7;
        if (pageNumber <= 161) return 8;
        if (pageNumber <= 181) return 9;
        if (pageNumber <= 201) return 10;
        if (pageNumber <= 221) return 11;
        if (pageNumber <= 241) return 12;
        if (pageNumber <= 261) return 13;
        if (pageNumber <= 281) return 14;
        if (pageNumber <= 301) return 15;
        if (pageNumber <= 321) return 16;
        if (pageNumber <= 341) return 17;
        if (pageNumber <= 361) return 18;
        if (pageNumber <= 381) return 19;
        if (pageNumber <= 401) return 20;
        if (pageNumber <= 421) return 21;
        if (pageNumber <= 441) return 22;
        if (pageNumber <= 461) return 23;
        if (pageNumber <= 481) return 24;
        if (pageNumber <= 501) return 25;
        if (pageNumber <= 521) return 26;
        if (pageNumber <= 541) return 27;
        if (pageNumber <= 561) return 28;
        if (pageNumber <= 581) return 29;
        return 30;
    }

    _toArabicNumber(num) {
        // Convert Western numerals to Arabic-Indic numerals
        const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return String(num).split('').map(digit => arabicNumerals[parseInt(digit)] || digit).join('');
    }

    // Audio per ayat functionality
    async fetchSurahAudioData(surahNumber) {
        try {
            const response = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
            if (!response.ok) throw new Error('Failed to fetch audio data');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching surah audio data:', error);
            return null;
        }
    }

    async playVerseAudio(surahNumber, verseNumber) {
        try {
            // Show and setup audio player UI
            const audioPlayer = document.getElementById('quranAudioPlayer');
            const audioElement = document.getElementById('quranAudioElement');
            const audioInfo = document.getElementById('audioSurahName');
            const playPauseBtn = document.getElementById('audioPlayPause');
            
            if (!audioPlayer || !audioElement) {
                this._notify('Audio player tidak tersedia', 'error');
                return;
            }

            // Show audio player
            audioPlayer.style.display = 'block';
            
            // Setup audio controls if not already done
            if (!this.audioSetupDone) {
                const surahInfo = typeof QURAN_SURAHS !== 'undefined' ? QURAN_SURAHS.find(s => s.number === surahNumber) : null;
                if (surahInfo) {
                    this._setupAudioControls(surahInfo);
                    this.audioSetupDone = true;
                }
            }

            // Removed notification: this._notify('Memuat audio ayat...', 'info');

            const surahStr = String(surahNumber).padStart(3, '0');
            const verseStr = String(verseNumber).padStart(3, '0');
            const localPath = `${this.basePath}/assets/audio/alquran/verses/${surahStr}/${surahStr}_${verseStr}.mp3`;

            // Set flag to prevent error notification while loading new audio
            this.isLoadingNewAudio = true;
            
            // Stop any currently playing audio
            audioElement.pause();
            audioElement.src = '';

            // Attempt to load local file (race between canplay and error)
            const tryLocal = await new Promise((resolve) => {
                let settled = false;
                const testAudio = new Audio(localPath);
                testAudio.preload = 'metadata';

                const onCanPlay = () => { if (settled) return; settled = true; cleanup(); resolve({ok: true}); };
                const onError = () => { if (settled) return; settled = true; cleanup(); resolve({ok: false}); };
                const timeout = setTimeout(() => { if (settled) return; settled = true; cleanup(); resolve({ok: false, timeout: true}); }, 3000);

                function cleanup() {
                    try { testAudio.removeEventListener('canplay', onCanPlay); } catch(e){}
                    try { testAudio.removeEventListener('error', onError); } catch(e){}
                    try { clearTimeout(timeout); } catch(e){}
                    try { testAudio.pause(); testAudio.src = ''; } catch(e){}
                }

                testAudio.addEventListener('canplay', onCanPlay);
                testAudio.addEventListener('error', onError);
                try { testAudio.load(); } catch(e) { onError(); }
            });

            let audioSrc = null;
            let surahName = '';

            if (tryLocal.ok) {
                // Use local file
                audioSrc = localPath;
                const surahInfo = typeof QURAN_SURAHS !== 'undefined' ? QURAN_SURAHS.find(s => s.number === surahNumber) : null;
                surahName = surahInfo ? surahInfo.name : `QS ${surahNumber}`;
            } else {
                // Fallback to online source (equran.id)
                if (!this.surahAudioCache) this.surahAudioCache = {};
                if (!this.surahAudioCache[surahNumber]) {
                    const audioData = await this.fetchSurahAudioData(surahNumber);
                    if (!audioData) {
                        this._notify('Gagal memuat data audio', 'error');
                        audioPlayer.style.display = 'none';
                        this.isLoadingNewAudio = false; // Reset flag
                        return;
                    }
                    this.surahAudioCache[surahNumber] = audioData;
                }

                const surahData = this.surahAudioCache[surahNumber];
                const verseObj = (surahData.ayat || []).find(a => Number(a.nomorAyat) === Number(verseNumber));
                if (!verseObj || !verseObj.audio || !verseObj.audio['05']) {
                    this._notify('Audio ayat tidak tersedia', 'error');
                    audioPlayer.style.display = 'none';
                    this.isLoadingNewAudio = false; // Reset flag
                    return;
                }
                
                audioSrc = verseObj.audio['05'];
                surahName = surahData.namaLatin || surahData.nama || `QS ${surahNumber}`;
            }

            // Set audio source and play
            audioElement.src = audioSrc;
            
            // Update audio info display
            if (audioInfo) {
                audioInfo.textContent = `${surahName} - Ayat ${verseNumber}`;
            }

            // Store current playing verse for highlighting
            this.currentPlayingVerse = { surah: surahNumber, verse: verseNumber };
            
            // Remove previous highlight
            document.querySelectorAll('.verse-item-reading.playing-audio').forEach(el => {
                el.classList.remove('playing-audio');
            });
            document.querySelectorAll('.verse-item-clean.playing-audio').forEach(el => {
                el.classList.remove('playing-audio');
            });
            
            // Highlight current verse
            const verseKey = `${surahNumber}:${verseNumber}`;
            const verseElements = document.querySelectorAll(`[data-play-verse="${verseKey}"], [data-verse-number="${verseNumber}"][data-surah-number="${surahNumber}"]`);
            verseElements.forEach(el => {
                el.classList.add('playing-audio');
            });

            try {
                await audioElement.play();
                this.isPlaying = true;
                if (playPauseBtn && playPauseBtn.querySelector('i')) {
                    playPauseBtn.querySelector('i').className = 'fas fa-pause';
                }
                // Removed notification: this._notify(`Memutar ${surahName} ayat ${verseNumber}`, 'success');
                
                // Reset loading flag after successful play
                this.isLoadingNewAudio = false;
            } catch (err) {
                console.error('Error playing verse audio:', err);
                this._notify('Gagal memutar audio ayat', 'error');
                audioPlayer.style.display = 'none';
                // Remove highlight on error
                verseElements.forEach(el => {
                    el.classList.remove('playing-audio');
                });
                // Reset loading flag
                this.isLoadingNewAudio = false;
            }
            
            // Remove highlight when audio ends
            audioElement.addEventListener('ended', () => {
                verseElements.forEach(el => {
                    el.classList.remove('playing-audio');
                });
                this.currentPlayingVerse = null;
            }, { once: true });

        } catch (error) {
            console.error('Error playing verse audio:', error);
            this._notify('Gagal memutar audio ayat', 'error');
            // Reset loading flag on error
            this.isLoadingNewAudio = false;
        }
    }

    _showVersePlayPopup(event, surahNumber, verseNumber, verseElement) {
        // Remove any existing popup
        const existingPopup = document.querySelector('.verse-play-popup');
        if (existingPopup) existingPopup.remove();

        // Create popup
        const popup = document.createElement('div');
        popup.className = 'verse-play-popup';
        
        // Get surah info
        const surahInfo = typeof QURAN_SURAHS !== 'undefined' ? QURAN_SURAHS.find(s => s.number === surahNumber) : null;
        const surahName = surahInfo ? surahInfo.name : `Surah ${surahNumber}`;
        
        popup.innerHTML = `
            <div class="verse-play-popup-content">
                <div class="verse-play-info">
                    <div class="verse-play-title">${surahName} • Ayat ${verseNumber}</div>
                </div>
                <div class="verse-play-actions">
                    <button class="verse-play-btn" id="versePlayPopupBtn">
                        <i class="fas fa-play"></i>
                        Putar
                    </button>
                    <button class="verse-play-close" id="versePlayPopupClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Show popup with animation (fixed at bottom)
        setTimeout(() => popup.classList.add('show'), 10);
        
        // Play button handler
        document.getElementById('versePlayPopupBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.playVerseAudio(surahNumber, verseNumber);
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 200);
        });
        
        // Close button handler
        document.getElementById('versePlayPopupClose').addEventListener('click', (e) => {
            e.stopPropagation();
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 200);
        });
        
        // Close popup when clicking outside
        const closePopup = (e) => {
            if (!popup.contains(e.target) && e.target !== verseElement) {
                popup.classList.remove('show');
                setTimeout(() => popup.remove(), 200);
                document.removeEventListener('click', closePopup);
            }
        };
        
        // Delay the listener to prevent immediate close
        setTimeout(() => {
            document.addEventListener('click', closePopup);
        }, 100);
    }

    // placeholder for future online content
    async loadOnlineContent() { this._notify('Fitur muat konten online akan segera tersedia','info'); }
}
