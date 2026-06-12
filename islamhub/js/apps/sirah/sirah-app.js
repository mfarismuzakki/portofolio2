/* ===== Sirah Nabi App - IslamHub ===== */

export default class SirahApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('sirah-app');
        this.prophets = [];
        this.currentProphet = null;
        this.currentTab = 'biodata';
        this.currentFilter = 'timeline';
        this.searchQuery = '';
        this.favorites = this.loadFavorites();
    }

    async init() {
        console.log('Initializing Sirah Nabi App...');
        await this.render();
        await this.loadData();
        this.setupEventListeners();
        this.displayProphets();
    }

    async render() {
        this.container.innerHTML = `
            <div class="sirah-container">
                <div class="sirah-header">
                    <h2><i class="fas fa-tree"></i> Sirah Nabi, Rasul & Sahabat</h2>
                    <p class="subtitle">Kisah Para Nabi, Rasul, dan Sahabat Nabi</p>
                </div>

                <!-- Search Bar -->
                <div class="search-container">
                    <input type="text" id="sirahSearchInput" placeholder="Cari nama nabi atau sahabat..." />
                    <i class="fas fa-search"></i>
                    <button class="clear-search" id="sirahClearSearch" style="display: none;">
                        <i class="fas fa-times-circle"></i>
                    </button>
                </div>                <!-- Filter Tabs -->
                <div class="filter-tabs" id="sirahFilterTabs">
                    <button class="filter-tab active" data-filter="timeline">
                        <i class="fas fa-stream"></i> Timeline Nabi
                    </button>
                    <button class="filter-tab" data-filter="konstelasi">
                        <i class="fas fa-star-of-life"></i> Konstelasi Sahabat
                    </button>
                    <button class="filter-tab" data-filter="all">
                        <i class="fas fa-list"></i> Semua
                    </button>
                    <button class="filter-tab" data-filter="nabi">
                        <i class="fas fa-star"></i> Nabi & Rasul
                    </button>
                    <button class="filter-tab" data-filter="sahabat">
                        <i class="fas fa-users"></i> Sahabat
                    </button>
                    <button class="filter-tab" data-filter="favorit">
                        <i class="fas fa-heart"></i> Favorit
                    </button>
                </div>

                <!-- Prophets Grid -->
                <div class="prophets-grid" id="prophetsGrid">
                    <!-- Dynamic content -->
                </div>

                <!-- Prophet Detail Modal -->
                <div class="prophet-modal" id="prophetModal">
                    <div class="modal-overlay" id="prophetModalOverlay"></div>
                    <div class="modal-container">
                        <div class="modal-header">
                            <button class="modal-back" id="prophetBack">
                                <i class="fas fa-arrow-left"></i>
                            </button>
                            <h3 id="prophetName">Nama Nabi</h3>
                            <div class="modal-actions">
                                <button class="action-btn" id="prophetCopy">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="action-btn" id="prophetFavorite">
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                        </div>
                        <div class="modal-tabs" id="prophetTabs">
                            <button class="tab-btn active" data-tab="biodata">Biodata</button>
                            <button class="tab-btn" data-tab="events">Peristiwa</button>
                            <button class="tab-btn" data-tab="lessons">Hikmah</button>
                            <button class="tab-btn" data-tab="references">Referensi</button>
                        </div>
                        <div class="modal-body" id="prophetContent">
                            <!-- Dynamic content -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadData() {
        try {
            // Load all nabi and sahabat data
            const [
                { nabiPart1 },
                { nabiPart2 },
                { nabiPart3 },
                { nabiPart4 },
                { nabiPart5 },
                { nabiDatabase },
                { sahabatKhulafa },
                { sahabatAsharah },
                { sahabatMuhajirinAnshar },
                { sahabatTerkenal },
                { sahabiyat }
            ] = await Promise.all([
                import('../../../js/data/sirah/nabi-part1.js'),
                import('../../../js/data/sirah/nabi-part2.js'),
                import('../../../js/data/sirah/nabi-part3.js'),
                import('../../../js/data/sirah/nabi-part4.js'),
                import('../../../js/data/sirah/nabi-part5.js'),
                import('../../../js/data/sirah/nabi-data.js'),
                import('../../../js/data/sirah/sahabat-khulafa.js'),
                import('../../../js/data/sirah/sahabat-asharah.js'),
                import('../../../js/data/sirah/sahabat-muhajirin-anshar.js'),
                import('../../../js/data/sirah/sahabat-terkenal.js'),
                import('../../../js/data/sirah/sahabiyat.js')
            ]);

            // Combine all data
            this.prophets = [
                ...nabiPart1,
                ...nabiPart2,
                ...nabiPart3,
                ...nabiPart4,
                ...nabiPart5,
                ...nabiDatabase,
                ...sahabatKhulafa,
                ...sahabatAsharah,
                ...sahabatMuhajirinAnshar,
                ...sahabatTerkenal,
                ...sahabiyat
            ];

            console.log(`Loaded ${this.prophets.length} persons (Nabi, Rasul, dan Sahabat)`);
        } catch (error) {
            console.error('Failed to load sirah data:', error);
            this.showError('Gagal memuat data sirah');
        }
    }

    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('sirahSearchInput');
        const clearSearch = document.getElementById('sirahClearSearch');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.displayProphets();
                clearSearch.style.display = this.searchQuery ? 'block' : 'none';
            });
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                this.searchQuery = '';
                this.displayProphets();
                clearSearch.style.display = 'none';
            });
        }

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentFilter = tab.dataset.filter;
                this.displayProphets();
            });
        });

        // Modal close
        const modalBack = document.getElementById('prophetBack');
        const modalOverlay = document.getElementById('prophetModalOverlay');

        if (modalBack) {
            modalBack.addEventListener('click', () => this.closeModal());
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeModal());
        }

        // Favorite button
        const favoriteBtn = document.getElementById('prophetFavorite');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }

        // Copy button
        const copyBtn = document.getElementById('prophetCopy');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyContent());
        }

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    displayProphets() {
        const grid = document.getElementById('prophetsGrid');
        if (!grid) return;

        // Reset mode-specific classes
        grid.classList.remove('sirah-timeline-mode', 'sirah-constellation-mode');

        // Special chronological view for 25 Nabi & Rasul
        if (this.currentFilter === 'timeline') {
            grid.classList.add('sirah-timeline-mode');
            this.renderTimeline(grid);
            return;
        }

        // Innovative constellation view for Sahabat
        if (this.currentFilter === 'konstelasi') {
            grid.classList.add('sirah-constellation-mode');
            this.renderSahabatConstellation(grid);
            return;
        }

        let filtered = this.prophets;

        // Filter by category
        if (this.currentFilter === 'nabi') {
            filtered = filtered.filter(p => p.category === 'nabi' || p.category === 'rasul');
        } else if (this.currentFilter === 'sahabat') {
            filtered = filtered.filter(p => p.category === 'sahabat');
        } else if (this.currentFilter === 'favorit') {
            filtered = filtered.filter(p => this.favorites.some(f => f.id === p.id));
        }

        // Filter by search query
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(query) ||
                (p.arabicName && p.arabicName.includes(query)) ||
                (p.title && p.title.toLowerCase().includes(query)) ||
                (p.biography && p.biography.toLowerCase().includes(query))
            );
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>Tidak ada hasil ditemukan</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(prophet => {
            const isFavorite = this.favorites.some(f => f.id === prophet.id);
            const isInFavoriteView = this.currentFilter === 'favorit';
            const categoryLabel = prophet.category === 'nabi' ? 'Nabi' : 
                                  prophet.category === 'rasul' ? 'Rasul' : 
                                  prophet.category === 'sahabat' ? 'Sahabat' : 
                                  prophet.category;
            
            // Ambil kata pertama dari nama Arab saja
            const arabicFirstWord = prophet.arabicName ? prophet.arabicName.split(' ')[0] : '';
            const icon = arabicFirstWord
                ? `<span class="arabic-name">${arabicFirstWord}</span>`
                : `<span class="latin-initial">${prophet.name.charAt(0)}</span>`;
            
            const biography = prophet.biography || '';
            const preview = biography.length > 150 
                ? biography.substring(0, 150) + '...' 
                : biography;
            
            // Build badges - only show category badge once, combine with subcategory if exists
            let badges = '';
            if (prophet.subcategory) {
                // If has subcategory, show both category and subcategory
                const categoryBadge = `<span class="category-badge category-${prophet.category}">${categoryLabel}</span>`;
                const subcategoryBadge = `<span class="subcategory-badge">${prophet.subcategory.replace(/_/g, ' ')}</span>`;
                badges = categoryBadge + subcategoryBadge;
            } else {
                // If no subcategory, only show category badge once
                badges = `<span class="category-badge category-${prophet.category}">${categoryLabel}</span>`;
            }
            
            // Delete button for favorite view
            const deleteBtn = isInFavoriteView 
                ? `<button class="delete-favorite-btn" onclick="event.stopPropagation(); window.sirahApp.removeFromFavorites('${prophet.id}');" title="Hapus dari favorit">
                    <i class="fas fa-trash-alt"></i>
                   </button>` 
                : '';
            
            return `
                <div class="prophet-card" data-person-id="${prophet.id}">
                    ${isFavorite && !isInFavoriteView ? '<i class="fas fa-heart favorite-badge"></i>' : ''}
                    ${deleteBtn}
                    <div class="prophet-card-header">
                        <div class="prophet-icon">${icon}</div>
                        <div class="prophet-name-section">
                            <h3 class="prophet-name">${prophet.name}</h3>
                        </div>
                    </div>
                    <div class="prophet-details">
                        ${prophet.title ? `<p class="prophet-title">${prophet.title}</p>` : ''}
                        ${prophet.period ? `<p class="prophet-period">${prophet.period}</p>` : ''}
                    </div>
                    <div class="prophet-badges">
                        ${badges}
                    </div>
                    ${preview ? `<p class="prophet-preview">${preview}</p>` : ''}
                </div>
            `;
        }).join('');

        // Add click listeners
        grid.querySelectorAll('.prophet-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.personId;
                this.showProphetDetail(id);
            });
        });
    }

    // =====================================================================
    // TIMELINE 25 NABI & RASUL — vertical chronological journey grouped by era
    // =====================================================================
    renderTimeline(grid) {
        const eras = [
            { id: 'pra-banjir', title: 'Era Pra-Banjir Besar',
              icon: 'fas fa-mountain',
              note: 'Sejak penciptaan manusia hingga sebelum banjir besar Nabi Nuh',
              color: '#4dd0e1', accent: '#0288d1',
              ids: ['adam', 'idris'] },
            { id: 'banjir-arab', title: 'Era Pasca-Banjir & Arab Kuno',
              icon: 'fas fa-water',
              note: "Bangkitnya kaum 'Aad, Tsamud, dan keluarga Ibrahim",
              color: '#26a69a', accent: '#00838f',
              ids: ['nuh', 'hud', 'shalih'] },
            { id: 'ibrahim', title: 'Era Keluarga Ibrahim',
              icon: 'fas fa-kaaba',
              note: 'Bapak para Nabi (Khalilullah) dan keturunannya',
              color: '#ffd700', accent: '#ff6f61',
              ids: ['ibrahim', 'lut', 'ismail', 'ishaq', 'yaqub', 'yusuf', 'ayyub', 'syuaib'] },
            { id: 'bani-israel', title: 'Era Bani Israel',
              icon: 'fas fa-scroll',
              note: "Para nabi dari keturunan Ya'qub (Bani Israel)",
              color: '#66bb6a', accent: '#2e7d32',
              ids: ['musa', 'harun', 'daud', 'sulaiman', 'yunus', 'zakariya', 'ilyas', 'alyasa', 'yahya', 'isa'] },
            { id: 'akhir-zaman', title: 'Era Akhir Zaman',
              icon: 'fas fa-moon',
              note: 'Khatamun Nabiyyin — penutup para nabi',
              color: '#ce93d8', accent: '#7b1fa2',
              ids: ['muhammad'] }
        ];

        const matchesQuery = (p) => {
            if (!this.searchQuery.trim()) return true;
            const q = this.searchQuery.toLowerCase();
            return p.name.toLowerCase().includes(q) ||
                   (p.arabicName && p.arabicName.includes(q)) ||
                   (p.title && p.title.toLowerCase().includes(q)) ||
                   (p.biography && p.biography.toLowerCase().includes(q));
        };

        let totalEvents = 0, totalLessons = 0;
        this.prophets.forEach(p => {
            if (p.category === 'nabi' || p.category === 'rasul') {
                totalEvents += (p.majorEvents || []).length;
                totalLessons += (p.lessons || []).length;
            }
        });

        let html = `
            <div class="sirah-timeline-intro">
                <div class="timeline-intro-bg"></div>
                <div class="timeline-intro-icon"><i class="fas fa-stream"></i></div>
                <div class="timeline-intro-text">
                    <span class="timeline-intro-tag">PERJALANAN PARA UTUSAN</span>
                    <h3>Timeline 25 Nabi &amp; Rasul</h3>
                    <p>Dari Nabi Adam <span class="alaihissalam">عليه السلام</span> hingga Nabi Muhammad ﷺ — kisah-kisah agung yang membentuk peradaban manusia.</p>
                </div>
                <div class="timeline-intro-stats">
                    <div class="timeline-stat"><span class="timeline-stat-num">25</span><span class="timeline-stat-lbl">Nabi &amp; Rasul</span></div>
                    <div class="timeline-stat"><span class="timeline-stat-num">${totalEvents}</span><span class="timeline-stat-lbl">Peristiwa</span></div>
                    <div class="timeline-stat"><span class="timeline-stat-num">${totalLessons}</span><span class="timeline-stat-lbl">Hikmah</span></div>
                </div>
            </div>

            <div class="timeline-era-nav">
                ${eras.map((e, i) => `
                    <button class="era-nav-pill" data-era-target="${e.id}" style="--era-color:${e.color}">
                        <span class="era-nav-num">${i + 1}</span>
                        <span class="era-nav-title">${e.title.replace('Era ', '')}</span>
                    </button>
                `).join('')}
            </div>

            <div class="sirah-timeline">
        `;

        let globalIndex = 0;
        let totalRendered = 0;

        eras.forEach((era, eraIdx) => {
            const eraProphets = era.ids
                .map(id => this.prophets.find(p => p.id === id))
                .filter(p => p && matchesQuery(p));

            if (eraProphets.length === 0) return;

            html += `
                <div class="timeline-era" data-era="${era.id}" id="era-${era.id}"
                     style="--era-color:${era.color}; --era-accent:${era.accent}">
                    <div class="timeline-era-marker">
                        <div class="era-marker-dot"><i class="${era.icon}"></i></div>
                        <div class="era-marker-label">
                            <span class="era-num">Era ${eraIdx + 1} · ${eraProphets.length} Nabi</span>
                            <h4>${era.title}</h4>
                            <p>${era.note}</p>
                        </div>
                        <div class="era-marker-deco">
                            <svg viewBox="0 0 100 100" aria-hidden="true">
                                <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="1" fill="none" opacity="0.4"/>
                                <circle cx="50" cy="50" r="30" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
                                <circle cx="50" cy="50" r="20" stroke="currentColor" stroke-width="1" fill="none" opacity="0.6"/>
                            </svg>
                        </div>
                    </div>
                    <div class="timeline-era-items">
            `;

            eraProphets.forEach((prophet, idx) => {
                const side = globalIndex % 2 === 0 ? 'left' : 'right';
                const isFavorite = this.favorites.some(f => f.id === prophet.id);
                const arabicFirstWord = prophet.arabicName ? prophet.arabicName.split(' ')[0] : '';
                const preview = (prophet.biography || '').substring(0, 130) +
                                ((prophet.biography || '').length > 130 ? '…' : '');
                const eventCount = (prophet.majorEvents || []).length;
                const lessonCount = (prophet.lessons || []).length;

                html += `
                    <div class="timeline-item timeline-${side}" data-person-id="${prophet.id}" style="--delay:${idx * 80}ms">
                        <div class="timeline-item-num">${globalIndex + 1}</div>
                        <div class="timeline-item-line"></div>
                        <div class="timeline-card">
                            ${isFavorite ? '<i class="fas fa-heart timeline-card-fav"></i>' : ''}
                            <div class="timeline-card-arabic">${arabicFirstWord}</div>
                            <div class="timeline-card-body">
                                <h5 class="timeline-card-name">${prophet.name}
                                    <span class="timeline-card-as">'alaihissalam</span>
                                </h5>
                                ${prophet.title ? `<p class="timeline-card-title">${prophet.title}</p>` : ''}
                                ${prophet.period ? `<div class="timeline-card-period"><i class="fas fa-clock"></i> ${prophet.period}</div>` : ''}
                                ${preview ? `<p class="timeline-card-preview">${preview}</p>` : ''}
                                <div class="timeline-card-stats">
                                    ${eventCount ? `<span class="timeline-stat-chip"><i class="fas fa-bookmark"></i> ${eventCount} peristiwa</span>` : ''}
                                    ${lessonCount ? `<span class="timeline-stat-chip"><i class="fas fa-lightbulb"></i> ${lessonCount} hikmah</span>` : ''}
                                </div>
                                <button class="timeline-card-cta">Baca kisah lengkap <i class="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
                    </div>
                `;
                globalIndex++;
                totalRendered++;
            });

            html += `</div></div>`;
        });

        if (totalRendered === 0) {
            html += `<div class="empty-state"><i class="fas fa-search"></i><p>Tidak ada hasil untuk "${this.searchQuery}"</p></div>`;
        }
        html += '</div>';
        grid.innerHTML = html;

        grid.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('click', () => this.showProphetDetail(item.dataset.personId));
        });
        grid.querySelectorAll('.era-nav-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const target = document.getElementById('era-' + pill.dataset.eraTarget);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    pill.classList.add('clicked');
                    setTimeout(() => pill.classList.remove('clicked'), 600);
                }
            });
        });

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

            grid.querySelectorAll('.timeline-item, .timeline-era-marker').forEach(el => {
                el.classList.add('reveal');
                observer.observe(el);
            });

            const eraNavObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const eraId = entry.target.dataset.era;
                        grid.querySelectorAll('.era-nav-pill').forEach(p => {
                            p.classList.toggle('current', p.dataset.eraTarget === eraId);
                        });
                    }
                });
            }, { rootMargin: '-30% 0px -50% 0px', threshold: 0 });
            grid.querySelectorAll('.timeline-era').forEach(s => eraNavObserver.observe(s));
        }
    }

    // =====================================================================
    // KONSTELASI SAHABAT — innovative orbital "constellation" of companions
    // grouped by rank-of-closeness to Rasulullah ﷺ. Each orbit has its own
    // color theme and arabic ornament. Click sahabat to open detail.
    // =====================================================================
    renderSahabatConstellation(grid) {
        // Orbits = layers of closeness. Mirrors the way salafy ulama
        // describe the levels: Khulafa → Asyarah → Muhajirin/Anshar → Sahabiyat.
        const orbits = [
            {
                id: 'khulafa',
                title: 'Khulafāur Rāsyidīn',
                subtitle: 'Empat khalifah yang lurus — pengganti langsung Rasulullah ﷺ',
                subcats: ['khulafa_rasyidin'],
                icon: 'fas fa-crown',
                color: '#ffd54f', accent: '#f57f17',
                rank: 'Orbit Terdalam'
            },
            {
                id: 'asharah',
                title: '‘Asyarah Mubasysyarah',
                subtitle: 'Sepuluh sahabat yang dijamin masuk surga semasa hidup',
                subcats: ['asharah_mubasysyarah'],
                icon: 'fas fa-star',
                color: '#80cbc4', accent: '#00695c',
                rank: 'Orbit ke-2'
            },
            {
                id: 'muhajirin',
                title: 'Muhājirīn, Anshār & Pejuang',
                subtitle: 'Para perintis hijrah, penolong di Madinah, dan panglima perang',
                subcats: ['muhajirin', 'anshar_aus', 'anshar_khazraj', 'sahabat_awal', 'panglima', 'ahlu_bait'],
                icon: 'fas fa-route',
                color: '#90caf9', accent: '#1565c0',
                rank: 'Orbit ke-3'
            },
            {
                id: 'sahabiyat',
                title: 'Sahabiyāt — Wanita Pilihan',
                subtitle: 'Ibu kaum mukminin dan wanita-wanita mulia di sekitar Nabi ﷺ',
                subcats: ['ummahatul_mukminin', 'ummul_mukminin', 'sahabiyat_muhajirat'],
                icon: 'fas fa-dove',
                color: '#f48fb1', accent: '#ad1457',
                rank: 'Orbit ke-4'
            }
        ];

        const matchesQuery = (p) => {
            if (!this.searchQuery.trim()) return true;
            const q = this.searchQuery.toLowerCase();
            return p.name.toLowerCase().includes(q) ||
                   (p.arabicName && p.arabicName.includes(q)) ||
                   (p.title && p.title.toLowerCase().includes(q)) ||
                   (p.biography && p.biography.toLowerCase().includes(q));
        };

        // Find sahabat by subcategory list
        const findInOrbit = (subcatList) => {
            return this.prophets
                .filter(p => p.subcategory && subcatList.includes(p.subcategory))
                .filter(matchesQuery);
        };

        // Total sahabat count
        const totalSahabat = this.prophets.filter(p =>
            p.category && p.category.toLowerCase() === 'sahabat'
        ).length;

        let html = `
            <div class="konstelasi-hero">
                <div class="konstelasi-stars" aria-hidden="true">
                    ${Array.from({ length: 40 }, (_, i) => {
                        const x = (i * 53) % 100;
                        const y = (i * 31) % 100;
                        const d = 2 + (i % 4);
                        const dly = (i * 0.13) % 4;
                        return `<span class="kons-star" style="left:${x}%;top:${y}%;--sz:${d}px;--dly:${dly}s"></span>`;
                    }).join('')}
                </div>
                <div class="konstelasi-hero-body">
                    <span class="konstelasi-tag">⌖ MAP OF COMPANIONS ⌖</span>
                    <h3>Konstelasi Para Sahabat ﷺ</h3>
                    <p class="konstelasi-arabic">رَضِيَ اللَّهُ عَنْهُمْ أَجْمَعِينَ</p>
                    <p class="konstelasi-sub">Sahabat — bintang-bintang yang mengelilingi matahari risalah. Setiap orbit menggambarkan tingkat kedekatan mereka dengan Rasulullah ﷺ.</p>
                </div>
                <div class="konstelasi-hero-stats">
                    <div class="kons-stat"><span class="kons-stat-num">${totalSahabat}</span><span class="kons-stat-lbl">Total Sahabat</span></div>
                    <div class="kons-stat"><span class="kons-stat-num">${orbits.length}</span><span class="kons-stat-lbl">Orbit</span></div>
                </div>
            </div>
        `;

        // Central "core" — Rasulullah ﷺ
        html += `
            <div class="konstelasi-core">
                <div class="kons-core-ring"></div>
                <div class="kons-core-ring kons-core-ring-2"></div>
                <div class="kons-core-ring kons-core-ring-3"></div>
                <div class="kons-core-center">
                    <div class="kons-core-arabic">ﷺ</div>
                    <div class="kons-core-label">Rasulullah Muhammad</div>
                    <div class="kons-core-sub">Pusat Konstelasi Sahabat</div>
                </div>
            </div>
        `;

        let totalRendered = 0;

        orbits.forEach((orbit, oIdx) => {
            const members = findInOrbit(orbit.subcats);
            if (members.length === 0) return;

            html += `
                <section class="konstelasi-orbit" id="orbit-${orbit.id}"
                         style="--orbit-color:${orbit.color}; --orbit-accent:${orbit.accent}; --orbit-delay:${oIdx * 60}ms">
                    <header class="orbit-header">
                        <div class="orbit-header-icon"><i class="${orbit.icon}"></i></div>
                        <div class="orbit-header-text">
                            <span class="orbit-rank">${orbit.rank}</span>
                            <h4>${orbit.title}</h4>
                            <p>${orbit.subtitle}</p>
                        </div>
                        <div class="orbit-header-count">${members.length} sahabat</div>
                    </header>

                    <div class="orbit-trail" aria-hidden="true">
                        <svg viewBox="0 0 800 60" preserveAspectRatio="none">
                            <path d="M0,30 Q200,5 400,30 T800,30"
                                  fill="none" stroke="currentColor" stroke-width="1.2"
                                  stroke-dasharray="2 6" opacity="0.55"/>
                        </svg>
                    </div>

                    <div class="orbit-members">
                        ${members.map((s, i) => {
                            const isFav = this.favorites.some(f => f.id === s.id);
                            const arabicGlyph = s.arabicName ? s.arabicName.split(' ')[0] : '';
                            const role = s.title || s.kunya || '';
                            const period = s.period || '';
                            const preview = (s.biography || '').substring(0, 100) +
                                            ((s.biography || '').length > 100 ? '…' : '');
                            return `
                                <article class="orbit-card" data-person-id="${s.id}" style="--card-delay:${i * 60}ms">
                                    <div class="orbit-card-glow"></div>
                                    <div class="orbit-card-glyph">${arabicGlyph}</div>
                                    <div class="orbit-card-rank">${i + 1}</div>
                                    ${isFav ? '<i class="fas fa-heart orbit-card-fav"></i>' : ''}
                                    <div class="orbit-card-body">
                                        <h5>${s.name}</h5>
                                        ${role ? `<p class="orbit-card-role">${role}</p>` : ''}
                                        ${preview ? `<p class="orbit-card-preview">${preview}</p>` : ''}
                                        ${period ? `<div class="orbit-card-period"><i class="fas fa-history"></i> ${period}</div>` : ''}
                                    </div>
                                    <div class="orbit-card-cta">
                                        <span>Selami kisahnya</span> <i class="fas fa-arrow-right"></i>
                                    </div>
                                </article>
                            `;
                        }).join('')}
                    </div>
                </section>
            `;
            totalRendered += members.length;
        });

        if (totalRendered === 0) {
            html += `<div class="empty-state"><i class="fas fa-search"></i>
                <p>${this.searchQuery ? `Tidak ada sahabat yang cocok dengan "${this.searchQuery}"` : 'Data sahabat belum tersedia'}</p></div>`;
        }

        grid.innerHTML = html;

        grid.querySelectorAll('.orbit-card').forEach(card => {
            card.addEventListener('click', () => this.showProphetDetail(card.dataset.personId));
        });

        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('in-view');
                        io.unobserve(e.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
            grid.querySelectorAll('.orbit-card, .konstelasi-orbit').forEach(el => {
                el.classList.add('reveal');
                io.observe(el);
            });
        }
    }

    showProphetDetail(prophetId) {
        const prophet = this.prophets.find(p => p.id === prophetId);
        if (!prophet) return;

        this.currentProphet = prophet;
        const modal = document.getElementById('prophetModal');
        const nameEl = document.getElementById('prophetName');

        nameEl.textContent = prophet.name;

        // Show biodata tab by default
        this.switchTab('biodata');

        // Update favorite button
        this.updateFavoriteButton();

        // Add body class to hide scroll
        document.body.classList.add('sirah-modal-active');

        // Show modal
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Render content
        this.renderTabContent();
    }

    renderTabContent() {
        const content = document.getElementById('prophetContent');
        console.log('renderTabContent - content element:', content);
        console.log('renderTabContent - currentProphet:', this.currentProphet);
        console.log('renderTabContent - currentTab:', this.currentTab);
        
        if (!content || !this.currentProphet) return;

        const prophet = this.currentProphet;

        switch (this.currentTab) {
            case 'biodata':
                const biodataHtml = this.renderBiodata(prophet);
                console.log('Biodata HTML length:', biodataHtml.length);
                content.innerHTML = biodataHtml;
                break;
            case 'events':
                content.innerHTML = this.renderEvents(prophet);
                break;
            case 'lessons':
                content.innerHTML = this.renderLessons(prophet);
                break;
            case 'references':
                content.innerHTML = this.renderReferences(prophet);
                break;
        }

        content.scrollTo(0, 0);
    }

    renderBiodata(prophet) {
        return `
            <div class="tab-content">
                <div class="prophet-detail-header">
                    <h2>${prophet.name}</h2>
                    <p class="arabic-name">${prophet.arabicName || ''}</p>
                    <p class="prophet-title-detail">${prophet.title || ''}</p>
                </div>

                <div class="info-section">
                    <h4><i class="fas fa-user"></i> Informasi Dasar</h4>
                    <div class="info-grid">
                        ${prophet.category ? `<div class="info-item"><strong>Kategori:</strong> ${prophet.category === 'nabi' ? 'Nabi' : prophet.category === 'rasul' ? 'Rasul' : prophet.category === 'sahabat' ? 'Sahabat' : prophet.category}</div>` : ''}
                        ${prophet.subcategory ? `<div class="info-item"><strong>Sub Kategori:</strong> ${prophet.subcategory}</div>` : ''}
                        ${prophet.father ? `<div class="info-item"><strong>Ayah:</strong> ${prophet.father}</div>` : ''}
                        ${prophet.mother ? `<div class="info-item"><strong>Ibu:</strong> ${prophet.mother}</div>` : ''}
                        ${prophet.birthPlace ? `<div class="info-item"><strong>Tempat Lahir:</strong> ${prophet.birthPlace}</div>` : ''}
                        ${prophet.deathPlace ? `<div class="info-item"><strong>Tempat Wafat:</strong> ${prophet.deathPlace}</div>` : ''}
                        ${prophet.tribe ? `<div class="info-item"><strong>Kaum/Suku:</strong> ${prophet.tribe}</div>` : ''}
                        ${prophet.period ? `<div class="info-item"><strong>Periode:</strong> ${prophet.period}</div>` : ''}
                        ${prophet.periodHijri ? `<div class="info-item"><strong>Periode Hijriah:</strong> ${prophet.periodHijri}</div>` : ''}
                        ${prophet.profession ? `<div class="info-item"><strong>Profesi:</strong> ${prophet.profession}</div>` : ''}
                    </div>
                </div>

                ${prophet.wife && prophet.wife.length > 0 ? `
                <div class="info-section">
                    <h4><i class="fas fa-heart"></i> Istri</h4>
                    <ul class="info-list">
                        ${prophet.wife.map(w => `<li>${w}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                ${prophet.children && prophet.children.length > 0 ? `
                <div class="info-section">
                    <h4><i class="fas fa-users"></i> Anak</h4>
                    <ul class="info-list">
                        ${prophet.children.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                ${prophet.qualities && prophet.qualities.length > 0 ? `
                <div class="info-section">
                    <h4><i class="fas fa-star"></i> Sifat & Keutamaan</h4>
                    <ul class="info-list">
                        ${prophet.qualities.map(q => `<li>${q}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <div class="info-section">
                    <h4><i class="fas fa-book-open"></i> Biografi</h4>
                    <p class="biography-text">${prophet.biography || 'Tidak ada informasi biografi.'}</p>
                </div>
            </div>
        `;
    }

    renderEvents(prophet) {
        if (!prophet.majorEvents || prophet.majorEvents.length === 0) {
            return `<div class="empty-state"><p>Tidak ada data peristiwa</p></div>`;
        }

        return `
            <div class="tab-content">
                <div class="events-timeline">
                    ${prophet.majorEvents.map(event => `
                        <div class="event-card">
                            <div class="event-header">
                                <h5 class="event-title">${event.event}</h5>
                                ${event.year ? `<span class="event-year"><i class="fas fa-clock"></i> ${event.year}</span>` : ''}
                            </div>
                            <p class="event-description">${event.description}</p>
                            ${event.references && event.references.length > 0 ? `
                                <div class="event-refs">
                                    ${event.references.map(ref => `<span class="ref-badge"><i class="fas fa-book"></i> ${ref}</span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderLessons(prophet) {
        if (!prophet.lessons || prophet.lessons.length === 0) {
            return `<div class="empty-state"><p>Tidak ada data hikmah</p></div>`;
        }

        return `
            <div class="tab-content">
                <div class="lessons-list">
                    ${prophet.lessons.map(lesson => `
                        <div class="lesson-card">
                            <div class="lesson-icon"><i class="fas fa-lightbulb"></i></div>
                            <p>${lesson}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderReferences(prophet) {
        let html = '<div class="tab-content">';

        const hasHadits = prophet.haditsShahih && prophet.haditsShahih.length > 0;
        const hasReferences = prophet.references && prophet.references.length > 0;

        if (hasHadits || hasReferences) {
            html += '<div class="ref-section"><h4><i class="fas fa-book"></i> Referensi Al-Quran & Hadits</h4>';
            
            // Hadits Shahih (ditampilkan sebagai card)
            if (hasHadits) {
                html += prophet.haditsShahih.map(hadith => `
                    <div class="hadith-card">
                        <p class="hadith-arabic">${hadith.arabic}</p>
                        <p class="hadith-latin"><em>${hadith.latin}</em></p>
                        <p class="hadith-translation">${hadith.translation}</p>
                        <p class="hadith-source"><strong>${hadith.source}</strong></p>
                    </div>
                `).join('');
            }

            // Referensi Al-Quran & Hadits (sebagai list sederhana)
            if (hasReferences) {
                html += `<ul class="ref-list">${prophet.references.map(ref => `<li>${ref}</li>`).join('')}</ul>`;
            }

            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    closeModal() {
        const modal = document.getElementById('prophetModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
        document.body.classList.remove('sirah-modal-active');
    }

    toggleFavorite() {
        if (!this.currentProphet) return;

        const index = this.favorites.findIndex(f => f.id === this.currentProphet.id);
        if (index !== -1) {
            this.favorites.splice(index, 1);
            this.showToast('Dihapus dari favorit');
        } else {
            this.favorites.push({
                id: this.currentProphet.id,
                name: this.currentProphet.name
            });
            this.showToast('Ditambahkan ke favorit');
        }

        this.saveFavorites();
        this.updateFavoriteButton();
    }

    removeFromFavorites(prophetId) {
        const index = this.favorites.findIndex(f => f.id === prophetId);
        if (index !== -1) {
            const prophet = this.prophets.find(p => p.id === prophetId);
            this.favorites.splice(index, 1);
            this.saveFavorites();
            this.displayProphets(); // Refresh the grid
            this.showToast(`${prophet ? prophet.name : 'Item'} dihapus dari favorit`);
        }
    }

    updateFavoriteButton() {
        const btn = document.getElementById('prophetFavorite');
        if (!btn || !this.currentProphet) return;

        const isFavorite = this.favorites.some(f => f.id === this.currentProphet.id);
        btn.innerHTML = isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        btn.classList.toggle('active', isFavorite);
    }

    copyContent() {
        if (!this.currentProphet) return;

        const prophet = this.currentProphet;
        let textContent = `${prophet.name}\n`;
        textContent += `${prophet.arabicName}\n\n`;
        
        // Biodata
        textContent += `BIODATA:\n`;
        textContent += `Periode: ${prophet.period}\n`;
        if (prophet.birthPlace) textContent += `Tempat Lahir: ${prophet.birthPlace}\n`;
        if (prophet.father) textContent += `Ayah: ${prophet.father}\n`;
        if (prophet.mother) textContent += `Ibu: ${prophet.mother}\n`;
        if (prophet.age) textContent += `Usia: ${prophet.age}\n`;
        if (prophet.tribe) textContent += `Suku: ${prophet.tribe}\n`;
        if (prophet.mission) textContent += `Misi: ${prophet.mission}\n`;
        if (prophet.description) {
            textContent += `\nDeskripsi:\n${prophet.description}\n\n`;
        } else {
            textContent += `\n`;
        }
        
        // Peristiwa Penting
        if (prophet.events && prophet.events.length > 0) {
            textContent += `PERISTIWA PENTING:\n`;
            prophet.events.forEach((event, index) => {
                textContent += `${index + 1}. ${event}\n`;
            });
            textContent += '\n';
        }
        
        // Hikmah
        if (prophet.lessons && prophet.lessons.length > 0) {
            textContent += `HIKMAH & PELAJARAN:\n`;
            prophet.lessons.forEach((lesson, index) => {
                textContent += `${index + 1}. ${lesson}\n`;
            });
            textContent += '\n';
        }
        
        // Referensi
        if (prophet.haditsShahih && prophet.haditsShahih.length > 0) {
            textContent += `HADITS SHAHIH:\n`;
            prophet.haditsShahih.forEach((hadith, index) => {
                textContent += `\nHadits ${index + 1}:\n`;
                textContent += `${hadith.arabic}\n`;
                textContent += `${hadith.latin}\n`;
                textContent += `Artinya: ${hadith.translation}\n`;
                textContent += `Sumber: ${hadith.source}\n`;
            });
            textContent += '\n';
        }
        
        if (prophet.references && prophet.references.length > 0) {
            textContent += `REFERENSI:\n`;
            prophet.references.forEach((ref, index) => {
                textContent += `${index + 1}. ${ref}\n`;
            });
        }

        // Copy to clipboard
        navigator.clipboard.writeText(textContent).then(() => {
            this.showCopySuccess();
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showToast('Gagal menyalin teks');
        });
    }

    showCopySuccess() {
        const copyBtn = document.getElementById('prophetCopy');
        if (copyBtn) {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        }
        this.showToast('Teks berhasil disalin!');
    }

    loadFavorites() {
        try {
            const saved = localStorage.getItem('islamhub_sirah_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('islamhub_sirah_favorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    showError(message) {
        console.error(message);
        const grid = document.getElementById('prophetsGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-placeholder">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    resetToMainPage() {
        this.closeModal();
        this.currentFilter = 'all';
        this.searchQuery = '';
        
        const searchInput = document.getElementById('sirahSearchInput');
        if (searchInput) searchInput.value = '';
        
        const clearSearch = document.getElementById('sirahClearSearch');
        if (clearSearch) clearSearch.style.display = 'none';
        
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.filter === 'all') {
                tab.classList.add('active');
            }
        });
        
        this.displayProphets();
        window.scrollTo(0, 0);
    }
}
