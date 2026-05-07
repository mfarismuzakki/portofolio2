/* ===== Dzikir & Doa App - IslamHub ===== */
/* Simplified version from dzikir_doa with core features */

import audioManager from '../../utils/audio-manager.js';

export default class DzikirApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('dzikir-app');
        this.categories = [];
        this.currentDoa = null;
        this.currentCategory = null;
        this.currentDoaIndex = -1;
        this.counterState = { current: 0, target: 33 };
        this.favorites = this.loadFavorites();
        this.searchQuery = '';
        this.currentFilter = 'semua';
        this.currentView = 'home'; // 'home', 'category', 'favorites'
        this.isPlayingPlaylist = false;
        this.playlistIndex = 0;
        this.audioManager = audioManager;
    }

    async init() {
        console.log('Initializing Dzikir App...');
        await this.render();
        await this.loadCategories();
        this.setupEventListeners();
        this.initDzikirWheel();
    }

    // ----- Daily Dzikir Cycle Wheel -----
    initDzikirWheel() {
        // 8 time slots covering 24 hours. Each spans 3h (45° in the SVG circle).
        // startHour is when the slot begins; filter is the dzikir filter category.
        const slots = [
            { id: 'subuh',   label: 'Subuh',   icon: '🌅', startHour: 4,  filter: 'pagi',   color: '#7dd3fc' },
            { id: 'pagi',    label: 'Pagi',    icon: '☀️', startHour: 7,  filter: 'pagi',   color: '#fbbf24' },
            { id: 'dhuha',   label: 'Dhuha',   icon: '🌞', startHour: 10, filter: 'harian', color: '#fcd34d' },
            { id: 'dzuhur',  label: 'Dzuhur',  icon: '🌤️', startHour: 12, filter: 'harian', color: '#fde047' },
            { id: 'ashar',   label: 'Ashar',   icon: '🌇', startHour: 15, filter: 'sore',   color: '#fb923c' },
            { id: 'maghrib', label: 'Maghrib', icon: '🌆', startHour: 18, filter: 'sore',   color: '#f97316' },
            { id: 'isya',    label: 'Isya',    icon: '🌃', startHour: 19, filter: 'khusus', color: '#a78bfa' },
            { id: 'tidur',   label: 'Tidur',   icon: '🌙', startHour: 22, filter: 'khusus', color: '#6366f1' },
        ];

        const segGroup = document.getElementById('wheelSegments');
        if (!segGroup) return;

        const slotCount = slots.length;
        const segAngle = 360 / slotCount; // 45° each
        const radius = 75;
        const labelRadius = 56;
        const innerRadius = 40;

        // Build SVG path for each segment
        slots.forEach((slot, i) => {
            // Map startHour (0-24) to angle. Hour 0 → -90° (top of clock, 12 o'clock).
            // 24h = 360°, so each hour = 15°.
            const startAng = (slot.startHour / 24) * 360 - 90;
            const nextSlot = slots[(i + 1) % slotCount];
            const endHour = i === slotCount - 1 ? slots[0].startHour + 24 : nextSlot.startHour;
            const endAng = (endHour / 24) * 360 - 90;
            const sweep = endAng - startAng;
            const largeArc = sweep > 180 ? 1 : 0;

            const a1 = startAng * Math.PI / 180;
            const a2 = endAng * Math.PI / 180;
            const xOuter1 = Math.cos(a1) * radius;
            const yOuter1 = Math.sin(a1) * radius;
            const xOuter2 = Math.cos(a2) * radius;
            const yOuter2 = Math.sin(a2) * radius;
            const xInner1 = Math.cos(a1) * innerRadius;
            const yInner1 = Math.sin(a1) * innerRadius;
            const xInner2 = Math.cos(a2) * innerRadius;
            const yInner2 = Math.sin(a2) * innerRadius;

            const d = `M ${xInner1} ${yInner1}
                       L ${xOuter1} ${yOuter1}
                       A ${radius} ${radius} 0 ${largeArc} 1 ${xOuter2} ${yOuter2}
                       L ${xInner2} ${yInner2}
                       A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${xInner1} ${yInner1}
                       Z`;

            // Label position (middle of arc)
            const midAng = (startAng + endAng) / 2 * Math.PI / 180;
            const lx = Math.cos(midAng) * labelRadius;
            const ly = Math.sin(midAng) * labelRadius;

            const segId = `wheel-seg-${slot.id}`;
            segGroup.insertAdjacentHTML('beforeend', `
                <g class="wheel-slot" data-slot="${slot.id}" data-filter="${slot.filter}" data-label="${slot.label}">
                    <path id="${segId}" d="${d}" fill="${slot.color}" fill-opacity="0.18" stroke="${slot.color}" stroke-width="0.6"/>
                    <text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle"
                          font-size="6" fill="#fff" font-weight="600" pointer-events="none"
                          style="font-family: Orbitron, sans-serif;">
                        ${slot.label.toUpperCase()}
                    </text>
                    <text x="${lx}" y="${ly + 7}" text-anchor="middle" dominant-baseline="middle"
                          font-size="9" pointer-events="none">${slot.icon}</text>
                </g>
            `);
        });

        // Click handlers — apply matching filter
        segGroup.querySelectorAll('.wheel-slot').forEach(el => {
            el.addEventListener('click', () => {
                const filter = el.dataset.filter;
                const label = el.dataset.label;
                this.applyWheelFilter(filter, label);
                el.classList.add('clicked');
                setTimeout(() => el.classList.remove('clicked'), 600);
            });
        });

        // Animate clock hand to current time
        this.updateWheelClock(slots);
        if (this._wheelTimer) clearInterval(this._wheelTimer);
        this._wheelTimer = setInterval(() => this.updateWheelClock(slots), 30000);
    }

    updateWheelClock(slots) {
        const now = new Date();
        const hh = now.getHours();
        const mm = now.getMinutes();
        const fractionalHour = hh + mm / 60;
        const angleDeg = (fractionalHour / 24) * 360 - 90; // -90° offset for top start
        const angleRad = angleDeg * Math.PI / 180;
        const handLen = 72;
        const tipX = Math.cos(angleRad) * handLen;
        const tipY = Math.sin(angleRad) * handLen;

        const hand = document.getElementById('wheelHand');
        const tip = document.getElementById('wheelHandTip');
        if (hand) {
            hand.setAttribute('x2', tipX.toFixed(2));
            hand.setAttribute('y2', tipY.toFixed(2));
        }
        if (tip) {
            tip.setAttribute('cx', tipX.toFixed(2));
            tip.setAttribute('cy', tipY.toFixed(2));
        }

        // Find current slot
        let currentSlot = slots[slots.length - 1];
        for (let i = 0; i < slots.length; i++) {
            const start = slots[i].startHour;
            const next = i === slots.length - 1 ? 24 + slots[0].startHour : slots[i + 1].startHour;
            if (fractionalHour >= start && fractionalHour < next) {
                currentSlot = slots[i];
                break;
            } else if (start > 20 && fractionalHour < slots[0].startHour) {
                // Late night wraps to last slot (Tidur)
                currentSlot = slots[slots.length - 1];
            }
        }

        // Update label & highlight current segment
        const timeEl = document.getElementById('wheelNowTime');
        const lblEl = document.getElementById('wheelNowLabel');
        if (timeEl) timeEl.textContent =
            String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
        if (lblEl) lblEl.textContent = `Waktu ${currentSlot.label}`;

        document.querySelectorAll('.wheel-slot').forEach(el => {
            el.classList.toggle('current', el.dataset.slot === currentSlot.id);
        });
    }

    applyWheelFilter(filter, label) {
        // Trigger the existing filter tab system so categories update
        const targetTab = document.querySelector(`.filter-tab[data-filter="${filter}"]`);
        if (targetTab) targetTab.click();

        // Smooth-scroll to category grid
        const grid = document.getElementById('categoriesGrid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async render() {
        this.container.innerHTML = `
            <div class="dzikir-container">
                <div class="dzikir-header">
                    <h2><i class="fas fa-hands"></i> Dzikir & Doa Harian</h2>
                    <p class="subtitle">Kumpulan dzikir dan doa dari Al-Quran dan Hadist Shahih</p>
                </div>

                <!-- Daily Cycle Wheel -->
                <div class="dzikir-wheel-section">
                    <div class="dzikir-wheel-info">
                        <span class="dzikir-wheel-now-time" id="wheelNowTime">--:--</span>
                        <span class="dzikir-wheel-now-label" id="wheelNowLabel">Memuat...</span>
                        <p class="dzikir-wheel-hint">Klik segmen untuk dzikir di waktu tersebut</p>
                    </div>
                    <div class="dzikir-wheel-container">
                        <svg class="dzikir-wheel" id="dzikirWheel" viewBox="-100 -100 200 200" aria-hidden="true">
                            <defs>
                                <linearGradient id="wheelHandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stop-color="#00ffff"/>
                                    <stop offset="100%" stop-color="#ff00ff"/>
                                </linearGradient>
                            </defs>
                            <!-- 8 segments are drawn dynamically by JS -->
                            <g id="wheelSegments"></g>
                            <!-- Inner ring -->
                            <circle cx="0" cy="0" r="38" fill="rgba(10,14,39,0.85)" stroke="rgba(0,255,255,0.3)" stroke-width="0.5"/>
                            <!-- Time hand (current time) -->
                            <line id="wheelHand" x1="0" y1="0" x2="0" y2="-72" stroke="url(#wheelHandGrad)" stroke-width="2" stroke-linecap="round"/>
                            <circle id="wheelHandTip" cx="0" cy="-72" r="3" fill="#ff00ff"/>
                            <!-- Center dot -->
                            <circle cx="0" cy="0" r="4" fill="#00ffff"/>
                        </svg>
                    </div>
                </div>

                <!-- Time-based Recommendations -->
                <div class="time-recommendations-section" id="timeRecommendationsSection" style="display: none;">
                    <div class="recommendations-header">
                        <h3><i class="fas fa-clock"></i> Rekomendasi Doa Saat Ini</h3>
                        <p class="recommendations-subtitle">Doa yang dianjurkan sesuai waktu</p>
                    </div>
                    <div class="recommendations-cards" id="recommendationsCards">
                        <!-- Dynamic recommendation cards -->
                    </div>
                </div>

                <!-- Search Bar -->
                <div class="search-container">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Cari dzikir atau doa..." />
                    <button class="clear-search" id="clearSearch" style="display: none;">
                        <i class="fas fa-times-circle"></i>
                    </button>
                </div>

                <!-- Search Results -->
                <div class="search-results" id="searchResults" style="display: none;">
                    <!-- Dynamic search results -->
                </div>

                <!-- Filter Tabs -->
                <div class="filter-tabs">
                    <button class="filter-tab active" data-filter="semua">
                        <i class="fas fa-th-large"></i> Semua
                    </button>
                    <button class="filter-tab" data-filter="pagi">
                        <i class="fas fa-sun"></i> Pagi
                    </button>
                    <button class="filter-tab" data-filter="sore">
                        <i class="fas fa-sunset"></i> Sore
                    </button>
                    <button class="filter-tab" data-filter="harian">
                        <i class="fas fa-calendar-day"></i> Harian
                    </button>
                    <button class="filter-tab" data-filter="khusus">
                        <i class="fas fa-star"></i> Waktu Khusus
                    </button>
                    <button class="filter-tab" data-filter="favorit">
                        <i class="fas fa-heart"></i> Favorit
                    </button>
                </div>

                <!-- Time Recommendations -->
                <div class="time-recommendations" id="timeRecommendations" style="display: none;">
                    <div class="recommendation-header">
                        <i class="fas fa-clock"></i>
                        <span>Rekomendasi Saat Ini</span>
                    </div>
                    <div class="recommendation-list" id="recommendationList"></div>
                </div>

                <!-- Categories Grid -->
                <div class="categories-grid" id="categoriesGrid">
                    <div class="loading-placeholder">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Memuat dzikir...</p>
                    </div>
                </div>

                <!-- Doa Modal -->
                <div class="doa-modal" id="doaModal">
                    <div class="modal-overlay" id="doaModalOverlay"></div>
                    <div class="modal-container">
                        <div class="modal-header">
                            <button class="modal-back" id="doaBack">
                                <i class="fas fa-arrow-left"></i>
                            </button>
                            <h3 id="doaTitle">Judul Doa</h3>
                            <div class="modal-actions">
                                <button class="action-btn" id="doaCopy">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="action-btn" id="doaAudio" title="Putar Audio">
                                    <i class="fas fa-volume-up"></i>
                                </button>
                                <button class="action-btn" id="doaFavorite">
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                        </div>
                        <div class="modal-body" id="doaContent">
                            <!-- Doa content here -->
                        </div>
                        
                        <!-- Audio Player -->
                        <div class="audio-player" id="audioPlayer" style="display: none;">
                            <div class="audio-info" id="audioInfo">
                                <span class="audio-doa-name" id="audioDoaName">Memuat audio...</span>
                                <span class="audio-playlist-counter" id="audioPlaylistCounter" style="display: none;"></span>
                            </div>
                            <div class="audio-controls">
                                <button class="audio-btn audio-nav-btn" id="audioPrev" style="display: none;" title="Audio Sebelumnya">
                                    <i class="fas fa-step-backward"></i>
                                </button>
                                <button class="audio-btn" id="audioPlayPause">
                                    <i class="fas fa-play"></i>
                                </button>
                                <button class="audio-btn audio-nav-btn" id="audioNext" style="display: none;" title="Audio Selanjutnya">
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
                            <audio id="doaAudioElement" preload="metadata"></audio>
                        </div>
                        
                        <div class="modal-footer">
                            <div class="navigation-buttons">
                                <button class="nav-btn" id="prevDoa" disabled>
                                    <i class="fas fa-chevron-left"></i> Sebelumnya
                                </button>
                                <button class="nav-btn" id="nextDoa">
                                    Selanjutnya <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadCategories() {
        // Import data from external file
        try {
            const module = await import('../../data/dzikir/doa-collection.js');
            const doaData = module.default || module.doaCollection;
            
            this.categories = Object.entries(doaData).map(([key, value]) => ({
                id: key,
                ...value
            }));
            
            this.showTimeRecommendations();
            this.renderCategories();
        } catch (error) {
            console.error('Failed to load dzikir data:', error);
            this.showError('Gagal memuat data dzikir');
        }
    }

    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        if (!grid) return;

        const filtered = this.getFilteredCategories();

        // Special handling for favorites - show as doa cards, not categories
        if (this.currentFilter === 'favorit') {
            if (this.favorites.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-heart"></i>
                        <p>Belum ada doa favorit</p>
                    </div>
                `;
                return;
            }

            // Render favorites as individual doa cards
            grid.innerHTML = this.favorites.map(doa => {
                const description = doa.translation || doa.latin || 'Doa favorit';
                const displayDesc = description.length > 100 ? description.substring(0, 100) + '...' : description;
                return `
                <div class="category-card favorite-card" data-favorite-doa="${doa.id}">
                    <button class="favorite-delete-btn" data-doa-id="${doa.id}" title="Hapus dari favorit">
                        <i class="fas fa-trash"></i>
                    </button>
                    <div class="category-header">
                        <div class="category-icon">
                            ${doa.categoryIcon || '📖'}
                        </div>
                        <h3>${doa.title || 'Doa'}</h3>
                    </div>
                    <p class="category-description">${displayDesc}</p>
                    <div class="category-footer">
                        <span class="category-badge">
                            <i class="fas fa-tag"></i> ${doa.categoryTitle || 'Doa'}
                        </span>
                        <span class="doa-count">
                            <i class="fas fa-heart" style="color: #ff006e;"></i> Favorit
                        </span>
                    </div>
                </div>
                `;
            }).join('');

            // Add click listeners for delete buttons
            grid.querySelectorAll('.favorite-delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent opening doa detail
                    const doaId = btn.dataset.doaId;
                    this.removeFavoriteFromList(doaId);
                });
            });

            // Add click listeners for favorite doa cards
            grid.querySelectorAll('[data-favorite-doa]').forEach(card => {
                card.addEventListener('click', (e) => {
                    // Don't open if clicking delete button
                    if (e.target.closest('.favorite-delete-btn')) return;
                    const doaId = card.dataset.favoriteDoa;
                    const favDoa = this.favorites.find(f => f.id === doaId);
                    if (favDoa) {
                        // Find the category and show the doa
                        let category = this.currentCategory;
                        
                        // If we have categoryId in favDoa, find the category
                        if (favDoa.categoryId) {
                            category = this.categories.find(c => c.id === favDoa.categoryId);
                        }
                        
                        // If category not found, search through all categories
                        if (!category) {
                            for (const cat of this.categories) {
                                const doaIndex = cat.doa.findIndex(d => d.id === favDoa.id);
                                if (doaIndex !== -1) {
                                    category = cat;
                                    break;
                                }
                            }
                        }
                        
                        if (category) {
                            this.currentCategory = category;
                            this.currentDoaIndex = category.doa.findIndex(d => d.id === favDoa.id);
                            this.showDoaDetail(favDoa, true);
                        } else {
                            // If still no category found, just show the doa with minimal category
                            this.currentCategory = {
                                id: 'favorit',
                                title: 'Doa Favorit',
                                icon: 'fas fa-heart',
                                doa: [favDoa]
                            };
                            this.currentDoaIndex = 0;
                            this.showDoaDetail(favDoa, true);
                        }
                    }
                });
            });
            return;
        }

        // Normal category rendering
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>Tidak ada kategori ditemukan</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(category => `
            <div class="category-card" data-category="${category.id}">
                <div class="category-header">
                    <div class="category-icon">
                        ${category.icon || '📖'}
                    </div>
                    <h3>${category.title}</h3>
                </div>
                <p class="category-description">${category.description}</p>
                <div class="category-footer">
                    ${category.timeRecommendation ? `
                        <span class="category-badge">
                            <i class="fas fa-clock"></i> ${category.timeRecommendation}
                        </span>
                    ` : ''}
                    <span class="doa-count">
                        <i class="fas fa-book-open"></i> ${category.doa.length} Doa
                    </span>
                </div>
            </div>
        `).join('');

        // Add click listeners
        grid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.dataset.category;
                this.showCategoryDoa(categoryId);
            });
        });
    }

    getFilteredCategories() {
        let filtered = [...this.categories];

        // Filter by tab
        if (this.currentFilter === 'favorit') {
            // Show categories that have favorited doas
            filtered = filtered.filter(cat => 
                cat.doa.some(doa => this.favorites.some(fav => fav.id === doa.id))
            );
        } else if (this.currentFilter === 'pagi') {
            filtered = filtered.filter(cat => 
                cat.id.includes('pagi') || cat.timeRecommendation?.includes('Subuh')
            );
        } else if (this.currentFilter === 'sore') {
            filtered = filtered.filter(cat => 
                cat.id.includes('petang') || cat.id.includes('sore') || cat.timeRecommendation?.includes('Ashar')
            );
        } else if (this.currentFilter === 'harian') {
            filtered = filtered.filter(cat => 
                cat.id.includes('harian') || cat.id.includes('makan') || cat.id.includes('tidur') || cat.id.includes('bangun')
            );
        } else if (this.currentFilter === 'khusus') {
            filtered = filtered.filter(cat => 
                cat.id.includes('safar') || cat.id.includes('sakit') || 
                cat.id.includes('hujan') || cat.id.includes('cuaca') ||
                cat.id.includes('rezeki') || cat.id.includes('ilmu') ||
                cat.id.includes('keluarga') || cat.id.includes('kendaraan')
            );
        }

        return filtered;
    }

    performSearch(query) {
        const searchResults = document.getElementById('searchResults');
        const categoriesGrid = document.getElementById('categoriesGrid');
        const filterTabs = document.querySelector('.filter-tabs');
        
        if (!searchResults) return;

        // Search through all doas
        const results = [];
        this.categories.forEach(category => {
            category.doa.forEach(doa => {
                const searchText = `${doa.title} ${doa.translation} ${doa.latin}`.toLowerCase();
                if (searchText.includes(query.toLowerCase())) {
                    results.push({
                        ...doa,
                        categoryId: category.id,
                        categoryTitle: category.title,
                        categoryIcon: category.icon
                    });
                }
            });
        });

        // Store results for access
        this.searchResults = results;

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><i class="fas fa-search"></i></div>
                    <h3>Tidak ditemukan</h3>
                    <p>Tidak ada dzikir atau doa yang cocok dengan pencarian "${query}"</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = results.map((doa, index) => `
                <div class="search-result-card" data-result-index="${index}">
                    <div class="search-card-header">
                        <div class="search-category-badge">
                            <span class="category-icon-small">${doa.categoryIcon}</span>
                            <span>${doa.categoryTitle}</span>
                        </div>
                        ${doa.repetition > 1 ? `<div class="search-repeat-badge"><i class="fas fa-redo"></i> ${doa.repetition}x</div>` : ''}
                    </div>
                    <div class="search-card-title">${doa.title}</div>
                    <div class="search-card-arabic">${doa.arabic.split('\n')[0]}...</div>
                    <div class="search-card-translation">${doa.translation.length > 150 ? doa.translation.substring(0, 150) + '...' : doa.translation}</div>
                    <div class="search-card-footer">
                        <span class="search-benefit-tag"><i class="fas fa-gift"></i> Keutamaan</span>
                        <span class="search-arrow"><i class="fas fa-chevron-right"></i></span>
                    </div>
                </div>
            `).join('');

            // Add click listeners to search results
            document.querySelectorAll('.search-result-card').forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.dataset.resultIndex);
                    const doa = this.searchResults[index];
                    
                    // Set current category for navigation
                    this.currentCategory = this.categories.find(c => c.id === doa.categoryId);
                    this.currentDoaIndex = this.currentCategory.doa.findIndex(d => d.id === doa.id);
                    
                    this.showDoaDetail(doa, true);
                });
            });
        }

        // Show search results, hide categories and filter tabs
        searchResults.style.display = 'block';
        if (categoriesGrid) categoriesGrid.style.display = 'none';
        if (filterTabs) filterTabs.style.display = 'none';
    }

    hideSearchResults() {
        const searchResults = document.getElementById('searchResults');
        const categoriesGrid = document.getElementById('categoriesGrid');
        const filterTabs = document.querySelector('.filter-tabs');
        
        if (searchResults) searchResults.style.display = 'none';
        if (categoriesGrid) categoriesGrid.style.display = 'grid';
        if (filterTabs) filterTabs.style.display = 'flex';
    }

    getTimeRecommendations() {
        const now = new Date();
        const hour = now.getHours();
        const recommendations = [];

        // Pagi (05:00 - 11:00): Dzikir Pagi
        if (hour >= 5 && hour < 11) {
            const category = this.categories.find(c => c.id === 'dzikir_pagi');
            if (category) recommendations.push(category);
        }

        // Siang (11:00 - 13:00): Doa Makan
        if (hour >= 11 && hour < 13) {
            const category = this.categories.find(c => c.id === 'doa_makan');
            if (category) recommendations.push(category);
        }

        // Sore (15:00 - 18:00): Dzikir Petang
        if (hour >= 15 && hour < 18) {
            const category = this.categories.find(c => c.id === 'dzikir_petang');
            if (category) recommendations.push(category);
        }

        // Malam (18:00 - 22:00): Doa Malam
        if (hour >= 18 && hour < 22) {
            const category = this.categories.find(c => c.id === 'doa_malam');
            if (category) recommendations.push(category);
        }

        // Tidur (22:00 - 05:00): Doa Sebelum Tidur
        if (hour >= 22 || hour < 5) {
            const category = this.categories.find(c => c.id === 'doa_tidur');
            if (category) recommendations.push(category);
        }

        // Istighfar & Taubat selalu direkomendasikan
        const istighfar = this.categories.find(c => c.id === 'istighfar_taubat');
        if (istighfar) recommendations.push(istighfar);

        return recommendations;
    }

    showTimeRecommendations() {
        const recommendations = this.getTimeRecommendations();
        const section = document.getElementById('timeRecommendationsSection');
        const cards = document.getElementById('recommendationsCards');

        if (!section || !cards || recommendations.length === 0) {
            if (section) section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        cards.innerHTML = recommendations.map(cat => `
            <div class="recommendation-card" data-category="${cat.id}">
                <div class="rec-icon">${cat.icon}</div>
                <div class="rec-content">
                    <h4>${cat.title}</h4>
                    <p>${cat.description}</p>
                    <span class="rec-badge"><i class="fas fa-clock"></i> ${cat.timeRecommendation}</span>
                </div>
                <i class="fas fa-chevron-right rec-arrow"></i>
            </div>
        `).join('');

        // Add click listeners
        document.querySelectorAll('.recommendation-card').forEach(card => {
            card.addEventListener('click', () => {
                const catId = card.dataset.category;
                this.showCategoryDoa(catId);
            });
        });
    }

    showCategoryDoa(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;

        this.currentCategory = category;
        this.currentDoaIndex = -1;
        this.openedFromFavoriteOrSearch = false;

        // Show list of doa in this category (modal with list)
        const modal = document.getElementById('doaModal');
        const title = document.getElementById('doaTitle');
        const content = document.getElementById('doaContent');
        const footer = modal.querySelector('.modal-footer');
        const modalActions = modal.querySelector('.modal-actions');

        title.textContent = category.title;
        
        // Check if category has any audio
        const hasAudio = category.doa.some(doa => doa.audio);
        
        // Show only audio button in category view if audio exists, hide copy and favorite
        const copyBtn = document.getElementById('doaCopy');
        const favoriteBtn = document.getElementById('doaFavorite');
        const audioBtn = document.getElementById('doaAudio');
        if (copyBtn) copyBtn.style.display = 'none';
        if (favoriteBtn) favoriteBtn.style.display = 'none';
        if (audioBtn) audioBtn.style.display = hasAudio ? 'flex' : 'none';
        if (modalActions) modalActions.style.display = 'flex';

        // Create doa list HTML - NO FAVORITE BUTTONS HERE (only in detail)
        content.innerHTML = `
            <div class="doa-list">
                ${category.doa.map((doa, index) => `
                    <div class="doa-item" data-doa-index="${index}">
                        <div class="doa-item-header">
                            <span class="doa-number">${index + 1}</span>
                            <span class="doa-title-text">${doa.title}</span>
                            ${doa.repetition > 1 ? `<span class="doa-repeat"><i class="fas fa-redo"></i> ${doa.repetition}x</span>` : ''}
                        </div>
                        ${doa.translation ? `
                            <p class="doa-preview">${doa.translation.substring(0, 100)}${doa.translation.length > 100 ? '...' : ''}</p>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;

        // Hide footer navigation and floating counter when showing list
        if (footer) footer.style.display = 'none';
        
        // Hide floating counter button in category view
        const floatingCounter = document.body.querySelector('.counter-restore-btn');
        if (floatingCounter) floatingCounter.style.display = 'none';

        // Add click listeners to each doa item
        document.querySelectorAll('.doa-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.doaIndex);
                this.currentDoaIndex = index;
                this.showDoaDetail(category.doa[index]);
            });
        });

        // Add body class to hide body scroll
        document.body.classList.add('doa-modal-active');
        
        // Show modal
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }

    showDoaDetail(doa, openedFromFavoriteOrSearch = false) {
        if (!doa) return;

        this.currentDoa = doa;
        this.openedFromFavoriteOrSearch = openedFromFavoriteOrSearch;
        const modal = document.getElementById('doaModal');
        const content = document.getElementById('doaContent');
        const title = document.getElementById('doaTitle');
        const footer = modal.querySelector('.modal-footer');
        
        // Check if audio is available for this doa
        const audioPath = this.getAudioPath(doa);
        const hasAudio = audioPath !== null;
        
        // Show all action buttons in detail view
        const copyBtn = document.getElementById('doaCopy');
        const favoriteBtn = document.getElementById('doaFavorite');
        const audioBtn = document.getElementById('doaAudio');
        if (copyBtn) copyBtn.style.display = 'flex';
        if (favoriteBtn) favoriteBtn.style.display = 'flex';
        // Only show audio button if audio is available
        if (audioBtn) audioBtn.style.display = hasAudio ? 'flex' : 'none';

        title.textContent = doa.title;

        // GUARD: Remove any existing counter from body to prevent duplicates
        const existingCounter = document.body.querySelector('.counter-section');
        if (existingCounter) {
            existingCounter.remove();
        }
        const existingRestore = document.body.querySelector('.counter-restore-btn');
        if (existingRestore) {
            existingRestore.remove();
        }

        content.innerHTML = `
            <div class="doa-section">
                <h4><i class="fas fa-book"></i> Arab</h4>
                <div class="doa-arabic">${doa.arabic.replace(/\n/g, '<br>')}</div>
            </div>

            <div class="doa-section">
                <h4><i class="fas fa-language"></i> Latin</h4>
                <div class="doa-latin">${doa.latin.replace(/\n/g, '<br>')}</div>
            </div>

            <div class="doa-section">
                <h4><i class="fas fa-comment-dots"></i> Terjemahan</h4>
                <div class="doa-translation">${doa.translation}</div>
            </div>

            ${doa.benefit ? `
                <div class="doa-section">
                    <h4><i class="fas fa-gift"></i> Keutamaan</h4>
                    <div class="doa-benefit"><p>${doa.benefit}</p></div>
                </div>
            ` : ''}

            ${doa.hadistText ? `
                <div class="doa-section hadist-section">
                    <h4><i class="fas fa-scroll"></i> Penjelasan Dalil</h4>
                    <div class="doa-hadist-text">
                        <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                        <p>${doa.hadistText}</p>
                    </div>
                </div>
            ` : ''}

            ${doa.reference ? `
                <div class="doa-section">
                    <h4><i class="fas fa-bookmark"></i> Referensi</h4>
                    <div class="doa-reference">${doa.reference}</div>
                </div>
            ` : ''}

            ${doa.repetition > 1 ? `
                <div class="counter-section">
                    <h4><i class="fas fa-redo"></i> Pengulangan ${doa.repetition}x</h4>
                    <div class="counter-container">
                        <div class="counter-ring-wrapper">
                            <svg class="counter-ring" viewBox="0 0 200 200" aria-hidden="true">
                                <defs>
                                    <linearGradient id="counterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#00ffff"/>
                                        <stop offset="100%" stop-color="#ff00ff"/>
                                    </linearGradient>
                                </defs>
                                <circle class="counter-ring-bg" cx="100" cy="100" r="88"/>
                                <circle class="counter-ring-progress" id="counterRingProgress"
                                    cx="100" cy="100" r="88"
                                    stroke="url(#counterGrad)"
                                    stroke-dasharray="552.92"
                                    stroke-dashoffset="552.92"
                                    transform="rotate(-90 100 100)"/>
                            </svg>
                            <div class="counter-display">
                                <span class="counter-current" id="counterCurrent">0</span>
                                <span class="counter-separator">/</span>
                                <span class="counter-target" id="counterTarget">${doa.repetition}</span>
                            </div>
                        </div>
                        <div class="counter-controls">
                            <button class="counter-btn" id="counterMinus" aria-label="Kurangi">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="counter-btn primary" id="counterPlus" aria-label="Tambah">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="counter-btn" id="counterReset" aria-label="Reset">
                                <i class="fas fa-redo"></i>
                            </button>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;

        // Initialize counter state
        this.counterState = { current: 0, target: doa.repetition || 1 };

        // Show modal first so any restore button checks see the modal as active
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Add body class to hide floating widgets
        document.body.classList.add('doa-modal-active');

        // If counter exists inside modal, move it to document.body so it won't be clipped
        // by modal overflow and will position relative to viewport (fixed)
        const createdCounter = content.querySelector('.counter-section');
        if (createdCounter && createdCounter.parentElement !== document.body) {
            document.body.appendChild(createdCounter);
        }

        // Initialize counter listeners and toggle after modal is active
        this.setupCounterListeners();
        this.setupCounterToggle();

        // Show modal-actions (favorite and copy buttons)
        const modalActions = modal.querySelector('.modal-actions');
        if (modalActions) modalActions.style.display = 'flex';
        
        // Update favorite button
        this.updateFavoriteButton();

        // Show footer navigation
        if (footer) footer.style.display = 'block';

        // Update navigation buttons
        this.updateNavigationButtons();

        // Modal already active, just scroll modal body to top
        content.scrollTo(0, 0);
    }

    showDoa(doa) {
        // Alias for showDoaDetail for compatibility
        this.showDoaDetail(doa);
    }

    setupCounterListeners() {
        const plus = document.getElementById('counterPlus');
        const minus = document.getElementById('counterMinus');
        const reset = document.getElementById('counterReset');

        if (plus) {
            plus.addEventListener('click', () => {
                if (this.counterState.current < this.counterState.target) {
                    this.counterState.current++;
                    this.updateCounterDisplay();
                    
                    // Vibrate on complete
                    if (this.counterState.current === this.counterState.target) {
                        if (navigator.vibrate) {
                            navigator.vibrate([100, 50, 100]);
                        }
                    }
                }
            });
        }

        if (minus) {
            minus.addEventListener('click', () => {
                if (this.counterState.current > 0) {
                    this.counterState.current--;
                    this.updateCounterDisplay();
                }
            });
        }

        if (reset) {
            reset.addEventListener('click', () => {
                this.counterState.current = 0;
                this.updateCounterDisplay();
            });
        }
    }

    updateCounterDisplay() {
        const current = document.getElementById('counterCurrent');
        const ring = document.getElementById('counterRingProgress');

        if (current) {
            current.textContent = this.counterState.current;
            if (this.counterState.current === this.counterState.target) {
                current.classList.add('complete');
                setTimeout(() => current.classList.remove('complete'), 500);
            }
        }

        if (ring) {
            const circumference = 552.92; // 2 * π * 88
            const ratio = Math.min(1, this.counterState.current / Math.max(1, this.counterState.target));
            ring.style.strokeDashoffset = String(circumference * (1 - ratio));
            const wrapper = ring.closest('.counter-ring-wrapper');
            if (wrapper) wrapper.classList.toggle('full', ratio >= 1);
        }
    }

    setupCounterToggle() {
        const counterSection = document.querySelector('.counter-section');
        if (!counterSection) return;

        // Check if counter is hidden
        const isHidden = localStorage.getItem('islamhub_counter_hidden') === 'true';
        if (isHidden) {
            counterSection.classList.add('hidden');
            this.showCounterRestoreButton();
            return;
        }

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'counter-toggle-btn';
        toggleBtn.innerHTML = '<i class=\"fas fa-eye-slash\"></i>';
        toggleBtn.title = 'Sembunyikan counter';
        
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            counterSection.classList.add('hidden');
            localStorage.setItem('islamhub_counter_hidden', 'true');
            this.showCounterRestoreButton();
        });

        counterSection.appendChild(toggleBtn);
    }

    showCounterRestoreButton() {
        // Remove existing restore button
        const existingBtn = document.querySelector('.counter-restore-btn');
        if (existingBtn) existingBtn.remove();

        // Create restore button
        const restoreBtn = document.createElement('button');
        restoreBtn.className = 'counter-restore-btn';
        restoreBtn.innerHTML = '<i class=\"fas fa-redo\"></i>';
        restoreBtn.title = 'Tampilkan counter';
        
        // Only show restore button when doa modal is active
        const modal = document.getElementById('doaModal');
        const modalIsActive = modal && modal.classList.contains('active');

        restoreBtn.addEventListener('click', () => {
            const counterSection = document.querySelector('.counter-section');
            if (counterSection) {
                counterSection.classList.remove('hidden');
                localStorage.setItem('islamhub_counter_hidden', 'false');
                restoreBtn.remove();
                
                // Re-setup toggle button
                this.setupCounterToggle();
            }
        });

        if (modalIsActive) {
            document.body.appendChild(restoreBtn);
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevDoa');
        const nextBtn = document.getElementById('nextDoa');
        const navButtons = document.querySelector('.navigation-buttons');

        if (!this.currentCategory) return;

        const totalDoa = this.currentCategory.doa.length;

        // If only one doa in category, hide navigation buttons completely
        if (totalDoa <= 1) {
            if (navButtons) navButtons.style.display = 'none';
            return;
        } else {
            if (navButtons) navButtons.style.display = 'flex';
        }

        if (prevBtn) {
            prevBtn.disabled = this.currentDoaIndex === 0;
            prevBtn.style.display = this.currentDoaIndex === 0 ? 'none' : 'flex';
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentDoaIndex === totalDoa - 1;
            nextBtn.style.display = this.currentDoaIndex === totalDoa - 1 ? 'none' : 'flex';
        }
    }

    showPrevDoa() {
        if (this.currentDoaIndex > 0) {
            this.currentDoaIndex--;
            this.showDoa(this.currentCategory.doa[this.currentDoaIndex]);
        }
    }

    showNextDoa() {
        if (this.currentDoaIndex < this.currentCategory.doa.length - 1) {
            this.currentDoaIndex++;
            this.showDoa(this.currentCategory.doa[this.currentDoaIndex]);
        }
    }

    closeDoaModal() {
        const modal = document.getElementById('doaModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
        
        // Remove body class to show floating widgets again
        document.body.classList.remove('doa-modal-active');

        // Remove ALL counter-related elements from body to prevent persistence
        document.querySelectorAll('.counter-restore-btn').forEach(el => el.remove());
        document.querySelectorAll('.counter-section').forEach(el => {
            if (el.parentElement === document.body) {
                el.remove();
            }
        });

        // If opened from favorite or search, go back to main dzikir page
        if (this.openedFromFavoriteOrSearch) {
            this.currentFilter = 'semua';
            this.hideSearchResults();
            this.renderCategories();
            this.openedFromFavoriteOrSearch = false;
        }
        // If we were showing doa detail from category list, go back to category list
        else if (this.currentCategory && this.currentDoaIndex >= 0) {
            this.showCategoryDoa(this.currentCategory.id);
        }
    }

    loadFavorites() {
        try {
            const saved = localStorage.getItem('islamhub_dzikir_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('islamhub_dzikir_favorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    }

    toggleFavorite() {
        if (!this.currentDoa) return;

        const index = this.favorites.findIndex(f => f.id === this.currentDoa.id);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast(`${this.currentDoa.title} dihapus dari favorit`);
        } else {
            // Save complete doa data with category info
            this.favorites.push({
                ...this.currentDoa,
                categoryId: this.currentCategory.id,
                categoryTitle: this.currentCategory.title,
                categoryIcon: this.currentCategory.icon
            });
            this.showToast(`${this.currentDoa.title} ditambahkan ke favorit`);
        }

        this.saveFavorites();
        this.updateFavoriteButton();
    }

    removeFavoriteFromList(doaId) {
        const index = this.favorites.findIndex(f => f.id === doaId);
        
        if (index > -1) {
            const doaTitle = this.favorites[index].title || 'Doa';
            this.favorites.splice(index, 1);
            this.saveFavorites();
            this.showToast(`${doaTitle} dihapus dari favorit`);
            
            // Refresh favorites display
            this.renderCategories();
        }
    }

    toggleFavoriteFromList(doa, category, btnElement) {
        const index = this.favorites.findIndex(f => f.id === doa.id);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            btnElement.innerHTML = '<i class="far fa-heart"></i>';
            btnElement.title = 'Tambah ke favorit';
            this.showToast(`${doa.title} dihapus dari favorit`);
        } else {
            // Save complete doa data with category info
            this.favorites.push({
                ...doa,
                categoryId: category.id,
                categoryTitle: category.title,
                categoryIcon: category.icon
            });
            btnElement.innerHTML = '<i class="fas fa-heart"></i>';
            btnElement.title = 'Hapus dari favorit';
            this.showToast(`${doa.title} ditambahkan ke favorit`);
        }

        this.saveFavorites();
    }

    updateFavoriteButton() {
        const btn = document.getElementById('doaFavorite');
        if (!btn || !this.currentDoa) return;

        const isFavorite = this.favorites.some(f => f.id === this.currentDoa.id);
        const icon = btn.querySelector('i');
        
        if (icon) {
            icon.className = isFavorite ? 'fas fa-heart' : 'far fa-heart';
        }
    }

    async copyDoa() {
        if (!this.currentDoa) return;

        let text = `${this.currentDoa.title}\n\n`;
        text += `Arab:\n${this.currentDoa.arabic}\n\n`;
        text += `Latin:\n${this.currentDoa.latin}\n\n`;
        text += `Terjemahan:\n${this.currentDoa.translation}\n\n`;
        
        // Add repetition if exists
        if (this.currentDoa.repetition && this.currentDoa.repetition > 1) {
            text += `Dibaca: ${this.currentDoa.repetition}x\n\n`;
        }
        
        // Add benefit if exists
        if (this.currentDoa.benefit) {
            text += `Keutamaan:\n${this.currentDoa.benefit}\n\n`;
        }
        
        // Add reference if exists
        if (this.currentDoa.reference) {
            text += `Referensi:\n${this.currentDoa.reference}\n\n`;
        }
        
        // Add hadith text if exists
        if (this.currentDoa.hadistText) {
            text += `Hadits:\n${this.currentDoa.hadistText}\n\n`;
        }
        
        text += `---\nSumber: IslamHub - Dzikir & Doa Harian`;

        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Doa berhasil disalin!');
        } catch (error) {
            this.showToast('Gagal menyalin doa');
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.trim();
                if (clearSearch) {
                    clearSearch.style.display = this.searchQuery ? 'block' : 'none';
                }
                
                if (this.searchQuery) {
                    this.performSearch(this.searchQuery);
                } else {
                    this.hideSearchResults();
                }
            });
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                this.searchQuery = '';
                clearSearch.style.display = 'none';
                this.hideSearchResults();
            });
        }

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentFilter = tab.dataset.filter;
                this.renderCategories();
            });
        });

        // Modal controls
        const doaBack = document.getElementById('doaBack');
        const doaModalOverlay = document.getElementById('doaModalOverlay');
        const doaCopy = document.getElementById('doaCopy');
        const doaFavorite = document.getElementById('doaFavorite');
        const prevDoa = document.getElementById('prevDoa');
        const nextDoa = document.getElementById('nextDoa');

        if (doaBack) {
            doaBack.addEventListener('click', () => {
                // If viewing doa detail, go back to list
                if (this.currentDoaIndex >= 0) {
                    // Hide floating counter when going back to category list
                    const floatingCounter = document.body.querySelector('.counter-restore-btn');
                    if (floatingCounter) floatingCounter.style.display = 'none';
                    
                    this.showCategoryDoa(this.currentCategory.id);
                } else {
                    // If viewing list, close modal
                    this.closeDoaModal();
                }
            });
        }

        if (doaModalOverlay) {
            doaModalOverlay.addEventListener('click', () => this.closeDoaModal());
        }

        if (doaCopy) {
            doaCopy.addEventListener('click', () => this.copyDoa());
        }

        if (doaFavorite) {
            doaFavorite.addEventListener('click', () => this.toggleFavorite());
        }

        if (prevDoa) {
            prevDoa.addEventListener('click', () => this.showPrevDoa());
        }

        if (nextDoa) {
            nextDoa.addEventListener('click', () => this.showNextDoa());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('doaModal');
            if (!modal || !modal.classList.contains('active')) return;

            if (e.key === 'Escape') {
                this.closeDoaModal();
            } else if (e.key === 'ArrowLeft') {
                this.showPrevDoa();
            } else if (e.key === 'ArrowRight') {
                this.showNextDoa();
            }
        });
        
        // Audio player controls
        this.setupAudioPlayer();
    }
    
    setupAudioPlayer() {
        const audioBtn = document.getElementById('doaAudio');
        const audioPlayer = document.getElementById('audioPlayer');
        const audioElement = document.getElementById('doaAudioElement');
        const playPauseBtn = document.getElementById('audioPlayPause');
        const closeBtn = document.getElementById('audioClose');
        const prevBtn = document.getElementById('audioPrev');
        const nextBtn = document.getElementById('audioNext');
        const progressFill = document.getElementById('audioProgressFill');
        const currentTimeEl = document.getElementById('audioCurrentTime');
        const durationEl = document.getElementById('audioDuration');
        const audioDoaName = document.getElementById('audioDoaName');
        const playlistCounter = document.getElementById('audioPlaylistCounter');
        
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                // Check if we're in category list view or detail view
                if (this.currentDoaIndex === -1 && this.currentCategory) {
                    // Category view - play all doa sequentially
                    this.playlistIndex = 0;
                    this.isPlayingPlaylist = true;
                    
                    // Show playlist controls
                    if (prevBtn) prevBtn.style.display = 'flex';
                    if (nextBtn) nextBtn.style.display = 'flex';
                    if (playlistCounter) playlistCounter.style.display = 'block';
                    
                    this.playNextInPlaylist();
                } else if (this.currentDoa) {
                    // Detail view - play single doa
                    this.isPlayingPlaylist = false;
                    
                    // Hide playlist controls
                    if (prevBtn) prevBtn.style.display = 'none';
                    if (nextBtn) nextBtn.style.display = 'none';
                    if (playlistCounter) playlistCounter.style.display = 'none';
                    
                    // Get audio path asynchronously
                    this.getAudioPath(this.currentDoa).then(audioPath => {
                        if (audioElement && audioPath) {
                            audioElement.src = audioPath;
                            if (audioPlayer) audioPlayer.style.display = 'block';
                            if (audioDoaName) audioDoaName.textContent = this.currentDoa.title;
                            audioElement.play();
                            if (playPauseBtn) {
                                playPauseBtn.querySelector('i').className = 'fas fa-pause';
                            }
                        } else {
                            this.showToast('Audio belum tersedia untuk doa ini');
                        }
                    }).catch(error => {
                        console.error('Failed to load audio:', error);
                        this.showToast('Gagal memuat audio');
                    });
                }
            });
        }
        
        if (playPauseBtn && audioElement) {
            playPauseBtn.addEventListener('click', () => {
                if (audioElement.paused) {
                    audioElement.play();
                    playPauseBtn.querySelector('i').className = 'fas fa-pause';
                } else {
                    audioElement.pause();
                    playPauseBtn.querySelector('i').className = 'fas fa-play';
                }
            });
        }
        
        // Prev button for playlist
        if (prevBtn && audioElement) {
            prevBtn.addEventListener('click', () => {
                if (this.isPlayingPlaylist && this.playlistIndex > 1) {
                    this.playlistIndex -= 2; // Go back 2 because playNextInPlaylist will increment
                    this.playNextInPlaylist();
                }
            });
        }
        
        // Next button for playlist
        if (nextBtn && audioElement) {
            nextBtn.addEventListener('click', () => {
                if (this.isPlayingPlaylist) {
                    this.playNextInPlaylist();
                }
            });
        }
        
        if (closeBtn && audioPlayer && audioElement) {
            closeBtn.addEventListener('click', () => {
                audioElement.pause();
                audioElement.currentTime = 0;
                audioPlayer.style.display = 'none';
                this.isPlayingPlaylist = false;
                
                // Hide playlist controls
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                if (playlistCounter) playlistCounter.style.display = 'none';
                
                if (playPauseBtn) {
                    playPauseBtn.querySelector('i').className = 'fas fa-play';
                }
            });
        }
        
        if (audioElement) {
            // Update progress bar
            audioElement.addEventListener('timeupdate', () => {
                if (audioElement.duration) {
                    const progress = (audioElement.currentTime / audioElement.duration) * 100;
                    if (progressFill) progressFill.style.width = `${progress}%`;
                    
                    if (currentTimeEl) {
                        currentTimeEl.textContent = this.formatTime(audioElement.currentTime);
                    }
                }
            });
            
            // Update duration
            audioElement.addEventListener('loadedmetadata', () => {
                if (durationEl) {
                    durationEl.textContent = this.formatTime(audioElement.duration);
                }
            });
            
            // Auto-pause icon when audio ends
            audioElement.addEventListener('ended', () => {
                if (playPauseBtn) {
                    playPauseBtn.querySelector('i').className = 'fas fa-play';
                }
                
                // If playing playlist, play next doa
                if (this.isPlayingPlaylist) {
                    this.playNextInPlaylist();
                }
            });
        }
    }
    
    async playNextInPlaylist() {
        if (!this.currentCategory || !this.currentCategory.doa) return;
        
        const audioElement = document.getElementById('doaAudioElement');
        const audioPlayer = document.getElementById('audioPlayer');
        const playPauseBtn = document.getElementById('audioPlayPause');
        const audioDoaName = document.getElementById('audioDoaName');
        const playlistCounter = document.getElementById('audioPlaylistCounter');
        const prevBtn = document.getElementById('audioPrev');
        const nextBtn = document.getElementById('audioNext');
        
        if (this.playlistIndex >= this.currentCategory.doa.length) {
            // Playlist finished
            this.isPlayingPlaylist = false;
            this.playlistIndex = 0;
            if (audioPlayer) audioPlayer.style.display = 'none';
            if (playPauseBtn) playPauseBtn.querySelector('i').className = 'fas fa-play';
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (playlistCounter) playlistCounter.style.display = 'none';
            this.showToast('Selesai memutar semua dzikir');
            return;
        }
        
        const doa = this.currentCategory.doa[this.playlistIndex];
        const audioPath = await this.getAudioPath(doa);
        const currentNum = this.playlistIndex + 1;
        const total = this.currentCategory.doa.length;
        
        // Update playlist counter
        if (playlistCounter) {
            playlistCounter.textContent = `${currentNum} / ${total}`;
        }
        
        // Update prev button state
        if (prevBtn) {
            prevBtn.disabled = currentNum === 1;
            prevBtn.style.opacity = currentNum === 1 ? '0.3' : '1';
        }
        
        // Update next button state
        if (nextBtn) {
            nextBtn.disabled = currentNum === total;
            nextBtn.style.opacity = currentNum === total ? '0.3' : '1';
        }
        
        if (audioElement && audioPath) {
            audioElement.src = audioPath;
            if (audioPlayer) audioPlayer.style.display = 'block';
            if (audioDoaName) audioDoaName.textContent = doa.title;
            
            audioElement.play().then(() => {
                if (playPauseBtn) {
                    playPauseBtn.querySelector('i').className = 'fas fa-pause';
                }
                this.playlistIndex++;
            }).catch(err => {
                console.error('Audio play error:', err);
                // Skip to next if current fails
                this.playlistIndex++;
                this.playNextInPlaylist();
            });
        } else {
            // Skip to next if audio not found
            console.log(`Audio not found for: ${doa.title}`);
            this.playlistIndex++;
            this.playNextInPlaylist();
        }
    }
    
    async getAudioPath(doa) {
        if (!doa || !doa.id) return null;
        
        // Check if doa has audio property defined
        if (doa.audio) {
            try {
                // Use audio manager to get URL (cached or remote)
                const audioUrl = await this.audioManager.getAudioUrl(doa.audio);
                return audioUrl;
            } catch (error) {
                console.error('Failed to get audio URL:', error);
                return null;
            }
        }
        
        // If no audio property, return null (audio not available)
        return null;
    }
    
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    showError(message) {
        console.error(message);
        const grid = document.getElementById('categoriesGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-placeholder">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn-retry">Coba Lagi</button>
                </div>
            `;
        }
    }

    resetToMainPage() {
        // Set flag to prevent closeDoaModal from navigating
        this.isResetting = true;
        
        // Close any open modals
        const modal = document.getElementById('doaModal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
        
        // Remove body class and counter elements
        document.body.classList.remove('doa-modal-active');
        document.querySelectorAll('.counter-restore-btn').forEach(el => el.remove());
        document.querySelectorAll('.counter-section').forEach(el => {
            if (el.parentElement === document.body) {
                el.remove();
            }
        });
        
        // Reset filter to 'semua'
        this.currentFilter = 'semua';
        
        // Hide search results
        this.hideSearchResults();
        
        // Clear search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        // Update filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.filter === 'semua') {
                tab.classList.add('active');
            }
        });
        
        // Render main categories
        this.renderCategories();
        
        // Reset flags
        this.openedFromFavoriteOrSearch = false;
        this.currentCategory = null;
        this.currentDoaIndex = -1;
        this.isResetting = false;
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}
