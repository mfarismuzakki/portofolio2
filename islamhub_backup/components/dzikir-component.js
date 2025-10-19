/**
 * Dzikir & Doa Component for Islamic SuperApps
 * Adapted from dzikir_doa application
 */

export default class DzikirComponent {
    constructor({ container, eventBus, sharedData, storageManager }) {
        this.container = container;
        this.eventBus = eventBus;
        this.sharedData = sharedData;
        this.storageManager = storageManager;
        
        // State management
        this.currentSection = 'categories';
        this.currentCategory = null;
        this.currentDoa = null;
        this.searchResults = [];
        this.favorites = [];
        this.counterState = {
            current: 0,
            target: 1
        };
        
        // Data
        this.doaCollection = null;
        this.categories = [];
    }

    async init() {
        try {
            // Load favorites from storage
            await this.loadFavorites();
            
            // Load doa collection data
            await this.loadDoaCollection();
            
            // Render component
            this.render();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load categories view
            this.showCategories();
            
            console.log('✅ Dzikir Component initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Dzikir Component:', error);
            this.renderError();
        }
    }

    async loadDoaCollection() {
        // For now, we'll create a simplified version of the doa collection
        // In a full implementation, you would load this from the external file
        this.doaCollection = {
            dzikir_pagi: {
                title: "Dzikir Pagi",
                icon: "🌅",
                description: "Dzikir yang dibaca setelah sholat Subuh hingga terbit matahari",
                timeRecommendation: "Setelah Subuh - Syuruq",
                color: "#FFD700",
                doa: [
                    {
                        id: "pagi_001",
                        title: "Ayat Kursi (1x)",
                        arabic: "اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
                        latin: "Allāhu lā ilāha illa huwal-hayyu'l-qayyūm, lā ta'khudzuhū sinatun wa lā nawm...",
                        translation: "Allah, tidak ada sesembahan yang berhak disembah kecuali Dia Yang Hidup Kekal lagi terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur...",
                        repetition: 1,
                        category: "ayat"
                    },
                    {
                        id: "pagi_002",
                        title: "Surat Al-Ikhlas (3x)",
                        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
                        latin: "Qul huwallāhu ahad, Allāhush-shamad, lam yalid wa lam yūlad, wa lam yakun lahū kufuwan ahad",
                        translation: "Katakanlah: Dia-lah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu...",
                        repetition: 3,
                        category: "surat"
                    }
                ]
            },
            dzikir_sore: {
                title: "Dzikir Sore",
                icon: "🌅",
                description: "Dzikir yang dibaca setelah sholat Ashar hingga Maghrib",
                timeRecommendation: "Setelah Ashar - Maghrib",
                color: "#FF8C00",
                doa: [
                    {
                        id: "sore_001",
                        title: "Ayat Kursi (1x)",
                        arabic: "اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
                        latin: "Allāhu lā ilāha illa huwal-hayyu'l-qayyūm...",
                        translation: "Allah, tidak ada sesembahan yang berhak disembah kecuali Dia...",
                        repetition: 1,
                        category: "ayat"
                    }
                ]
            },
            doa_harian: {
                title: "Doa Harian",
                icon: "🤲",
                description: "Kumpulan doa-doa harian yang sering digunakan",
                timeRecommendation: "Kapan saja",
                color: "#32CD32",
                doa: [
                    {
                        id: "harian_001",
                        title: "Doa Sebelum Makan",
                        arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
                        latin: "Bismillāhi wa 'alā barakatillāh",
                        translation: "Dengan nama Allah dan atas berkah Allah",
                        repetition: 1,
                        category: "doa"
                    },
                    {
                        id: "harian_002",
                        title: "Doa Sesudah Makan",
                        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
                        latin: "Alhamdulillāhil-ladhī ath'amanā wa saqānā wa ja'alanā muslimīn",
                        translation: "Segala puji bagi Allah yang telah memberi kami makan dan minum dan menjadikan kami muslim",
                        repetition: 1,
                        category: "doa"
                    }
                ]
            },
            doa_quran: {
                title: "Doa dalam Al-Quran",
                icon: "📖",
                description: "Doa-doa yang terdapat dalam Al-Quran",
                timeRecommendation: "Kapan saja",
                color: "#9370DB",
                doa: [
                    {
                        id: "quran_001",
                        title: "Doa Rabbana Atina",
                        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
                        latin: "Rabbanā ātinā fid-dunyā hasanatan wa fil-ākhirati hasanatan wa qinā 'adzāban-nār",
                        translation: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari siksa neraka",
                        repetition: 1,
                        category: "doa"
                    }
                ]
            },
            asmaul_husna: {
                title: "Asmaul Husna",
                icon: "✨",
                description: "99 Nama Allah Yang Maha Indah",
                timeRecommendation: "Kapan saja",
                color: "#FF69B4",
                doa: [
                    {
                        id: "asma_001",
                        title: "Ar-Rahman",
                        arabic: "الرَّحْمَـٰنُ",
                        latin: "Ar-Rahmān",
                        translation: "Yang Maha Pemurah",
                        repetition: 1,
                        category: "asma"
                    },
                    {
                        id: "asma_002",
                        title: "Ar-Rahim",
                        arabic: "الرَّحِيمُ",
                        latin: "Ar-Rahīm",
                        translation: "Yang Maha Penyayang",
                        repetition: 1,
                        category: "asma"
                    }
                ]
            }
        };

        // Extract categories
        this.categories = Object.keys(this.doaCollection).map(key => ({
            id: key,
            ...this.doaCollection[key]
        }));
    }

    render() {
        this.container.innerHTML = `
            <div class="dzikir-wrapper">
                <!-- Header with Search -->
                <div class="dzikir-header">
                    <div class="header-content">
                        <h2>Dzikir & Doa</h2>
                        <div class="search-container">
                            <div class="search-box">
                                <i class="fas fa-search"></i>
                                <input type="text" id="searchInput" placeholder="Cari dzikir atau doa...">
                                <button id="clearSearch" class="clear-search">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <div class="navigation-tabs">
                    <button class="nav-tab active" data-section="categories">
                        <i class="fas fa-th-large"></i>
                        <span>Kategori</span>
                    </button>
                    <button class="nav-tab" data-section="favorites">
                        <i class="fas fa-heart"></i>
                        <span>Favorit</span>
                    </button>
                    <button class="nav-tab" data-section="counter">
                        <i class="fas fa-hand-holding-heart"></i>
                        <span>Counter</span>
                    </button>
                </div>

                <!-- Main Content Area -->
                <div class="content-area" id="contentArea">
                    <!-- Dynamic content will be loaded here -->
                </div>

                <!-- Prayer Time Integration -->
                <div class="prayer-time-widget" id="prayerTimeWidget" style="display: none;">
                    <div class="widget-header">
                        <i class="fas fa-clock"></i>
                        <span>Rekomendasi Dzikir</span>
                    </div>
                    <div class="widget-content" id="prayerRecommendation">
                        <!-- Prayer-based recommendations -->
                    </div>
                </div>
            </div>
            
            <style>
            /* Dzikir Component Specific Styles */
            .dzikir-wrapper {
                max-width: 800px;
                margin: 0 auto;
                padding: 0;
            }

            .dzikir-header {
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 20px;
                backdrop-filter: blur(20px);
            }

            .header-content h2 {
                font-family: var(--font-primary);
                font-size: 28px;
                font-weight: 700;
                color: var(--primary-cyan);
                margin-bottom: 15px;
                text-align: center;
            }

            .search-container {
                position: relative;
            }

            .search-box {
                display: flex;
                align-items: center;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 25px;
                padding: 8px 20px;
                transition: all 0.3s ease;
            }

            .search-box:focus-within {
                border-color: var(--primary-cyan);
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
            }

            .search-box i {
                color: var(--text-secondary);
                margin-right: 10px;
            }

            .search-box input {
                flex: 1;
                background: none;
                border: none;
                outline: none;
                color: var(--text-primary);
                font-size: 14px;
            }

            .search-box input::placeholder {
                color: var(--text-muted);
            }

            .clear-search {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 5px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .clear-search.visible {
                opacity: 1;
            }

            .navigation-tabs {
                display: flex;
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.1);
                border-radius: 12px;
                padding: 5px;
                margin-bottom: 20px;
                gap: 5px;
            }

            .nav-tab {
                flex: 1;
                background: none;
                border: none;
                border-radius: 8px;
                padding: 12px 8px;
                color: var(--text-secondary);
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }

            .nav-tab i {
                font-size: 18px;
            }

            .nav-tab.active {
                background: var(--gradient-primary);
                color: var(--dark-bg);
                box-shadow: 0 2px 10px rgba(0, 255, 255, 0.3);
            }

            .nav-tab:hover:not(.active) {
                background: rgba(0, 255, 255, 0.1);
                color: var(--text-primary);
            }

            .content-area {
                min-height: 400px;
                margin-bottom: 20px;
            }

            .categories-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                padding: 10px 0;
            }

            .category-card {
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.1);
                border-radius: 15px;
                padding: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .category-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, transparent, var(--primary-cyan), transparent);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .category-card:hover {
                transform: translateY(-5px);
                border-color: rgba(0, 255, 255, 0.3);
                box-shadow: var(--shadow-glow);
            }

            .category-card:hover::before {
                opacity: 1;
            }

            .category-header {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 15px;
            }

            .category-icon {
                font-size: 32px;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 255, 255, 0.1);
                border-radius: 50%;
            }

            .category-info h3 {
                font-family: var(--font-primary);
                font-size: 18px;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 5px;
            }

            .category-info .doa-count {
                font-size: 12px;
                color: var(--text-secondary);
                font-weight: 500;
            }

            .category-description {
                color: var(--text-secondary);
                font-size: 14px;
                line-height: 1.5;
                margin-bottom: 10px;
            }

            .category-time {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 12px;
                color: var(--electric-blue);
                font-weight: 500;
            }

            .doa-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .doa-card {
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }

            .doa-card:hover {
                border-color: rgba(0, 255, 255, 0.3);
                box-shadow: 0 4px 20px rgba(0, 255, 255, 0.1);
            }

            .doa-header {
                display: flex;
                justify-content: between;
                align-items: flex-start;
                margin-bottom: 15px;
            }

            .doa-title {
                font-family: var(--font-primary);
                font-size: 16px;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 5px;
            }

            .doa-repetition {
                background: var(--gradient-secondary);
                color: var(--dark-bg);
                font-size: 12px;
                font-weight: 600;
                padding: 4px 8px;
                border-radius: 12px;
                margin-left: auto;
            }

            .doa-arabic {
                font-size: 20px;
                line-height: 1.8;
                color: var(--text-primary);
                text-align: right;
                margin-bottom: 10px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 8px;
                border-right: 3px solid var(--primary-cyan);
            }

            .doa-latin {
                font-size: 14px;
                color: var(--text-secondary);
                font-style: italic;
                margin-bottom: 10px;
                line-height: 1.5;
            }

            .doa-translation {
                font-size: 14px;
                color: var(--text-primary);
                line-height: 1.6;
            }

            .favorites-list {
                text-align: center;
                padding: 60px 20px;
                color: var(--text-secondary);
            }

            .favorites-list.empty {
                display: block;
            }

            .empty-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }

            .empty-icon {
                font-size: 64px;
                color: var(--text-muted);
                opacity: 0.5;
            }

            .counter-section {
                text-align: center;
                padding: 40px 20px;
            }

            .counter-display {
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 20px;
                padding: 40px;
                margin-bottom: 30px;
            }

            .counter-number {
                font-family: var(--font-primary);
                font-size: 72px;
                font-weight: 700;
                color: var(--primary-cyan);
                text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
                margin-bottom: 15px;
            }

            .counter-target {
                font-size: 18px;
                color: var(--text-secondary);
                margin-bottom: 20px;
            }

            .counter-controls {
                display: flex;
                justify-content: center;
                gap: 15px;
                flex-wrap: wrap;
            }

            .counter-btn {
                background: var(--gradient-primary);
                border: none;
                border-radius: 50px;
                padding: 15px 30px;
                color: var(--dark-bg);
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .counter-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }

            .counter-btn.secondary {
                background: var(--gradient-secondary);
            }

            .prayer-time-widget {
                background: linear-gradient(135deg, var(--surface), rgba(0, 255, 255, 0.05));
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 20px;
            }

            .widget-header {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 16px;
                font-weight: 600;
                color: var(--primary-cyan);
                margin-bottom: 15px;
            }

            .back-button {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 10px;
                padding: 10px 20px;
                color: var(--text-primary);
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 20px;
                width: fit-content;
            }

            .back-button:hover {
                background: rgba(0, 255, 255, 0.1);
                border-color: var(--primary-cyan);
            }

            @media (max-width: 768px) {
                .categories-grid {
                    grid-template-columns: 1fr;
                    gap: 15px;
                }
                
                .navigation-tabs {
                    margin-bottom: 15px;
                }
                
                .nav-tab {
                    padding: 10px 5px;
                    font-size: 12px;
                }
                
                .nav-tab i {
                    font-size: 16px;
                }
                
                .counter-number {
                    font-size: 56px;
                }
                
                .counter-controls {
                    gap: 10px;
                }
                
                .counter-btn {
                    padding: 12px 20px;
                    font-size: 14px;
                }
            }
            </style>
        `;
    }

    setupEventListeners() {
        // Navigation tabs
        const navTabs = this.container.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Search functionality
        const searchInput = this.container.querySelector('#searchInput');
        const clearSearch = this.container.querySelector('#clearSearch');
        
        searchInput?.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            this.handleSearch(query);
            clearSearch.classList.toggle('visible', query.length > 0);
        });

        clearSearch?.addEventListener('click', () => {
            searchInput.value = '';
            clearSearch.classList.remove('visible');
            this.handleSearch('');
        });

        // Listen for prayer time updates
        this.eventBus?.addEventListener('prayerTime', (event) => {
            this.updatePrayerRecommendations(event.detail);
        });
    }

    switchSection(section) {
        // Update navigation state
        const navTabs = this.container.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.section === section);
        });

        this.currentSection = section;

        // Load section content
        switch (section) {
            case 'categories':
                this.showCategories();
                break;
            case 'favorites':
                this.showFavorites();
                break;
            case 'counter':
                this.showCounter();
                break;
        }
    }

    showCategories() {
        const contentArea = this.container.querySelector('#contentArea');
        
        const categoriesHtml = `
            <div class="categories-grid">
                ${this.categories.map(category => `
                    <div class="category-card" data-category="${category.id}">
                        <div class="category-header">
                            <div class="category-icon">${category.icon}</div>
                            <div class="category-info">
                                <h3>${category.title}</h3>
                                <div class="doa-count">${category.doa.length} doa</div>
                            </div>
                        </div>
                        <div class="category-description">${category.description}</div>
                        <div class="category-time">
                            <i class="fas fa-clock"></i>
                            <span>${category.timeRecommendation}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        contentArea.innerHTML = categoriesHtml;

        // Add category click handlers
        const categoryCards = contentArea.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const categoryId = e.currentTarget.dataset.category;
                this.showCategoryDoas(categoryId);
            });
        });
    }

    showCategoryDoas(categoryId) {
        const category = this.doaCollection[categoryId];
        if (!category) return;

        this.currentCategory = categoryId;
        const contentArea = this.container.querySelector('#contentArea');

        const doasHtml = `
            <button class="back-button" id="backToCategories">
                <i class="fas fa-arrow-left"></i>
                <span>Kembali ke Kategori</span>
            </button>
            
            <div class="category-header-detail">
                <div class="category-header">
                    <div class="category-icon">${category.icon}</div>
                    <div class="category-info">
                        <h3>${category.title}</h3>
                        <div class="doa-count">${category.doa.length} doa</div>
                    </div>
                </div>
                <div class="category-description">${category.description}</div>
            </div>

            <div class="doa-list">
                ${category.doa.map(doa => `
                    <div class="doa-card" data-doa="${doa.id}">
                        <div class="doa-header">
                            <div class="doa-title">${doa.title}</div>
                            <div class="doa-repetition">${doa.repetition}x</div>
                        </div>
                        <div class="doa-arabic">${doa.arabic}</div>
                        <div class="doa-latin">${doa.latin}</div>
                        <div class="doa-translation">${doa.translation}</div>
                    </div>
                `).join('')}
            </div>
        `;

        contentArea.innerHTML = doasHtml;

        // Add back button handler
        const backButton = contentArea.querySelector('#backToCategories');
        backButton?.addEventListener('click', () => {
            this.showCategories();
        });

        // Add doa card handlers
        const doaCards = contentArea.querySelectorAll('.doa-card');
        doaCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const doaId = e.currentTarget.dataset.doa;
                this.showDoaDetail(categoryId, doaId);
            });
        });
    }

    showDoaDetail(categoryId, doaId) {
        const category = this.doaCollection[categoryId];
        const doa = category?.doa.find(d => d.id === doaId);
        if (!doa) return;

        // For now, just show an alert - in full implementation this would be a modal or full view
        alert(`Doa Detail: ${doa.title}\n\n${doa.translation}`);
    }

    showFavorites() {
        const contentArea = this.container.querySelector('#contentArea');
        
        if (this.favorites.length === 0) {
            contentArea.innerHTML = `
                <div class="favorites-list empty">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-heart"></i>
                        </div>
                        <h3>Belum Ada Favorit</h3>
                        <p>Tambahkan doa ke favorit dengan menekan ikon ❤️ pada setiap doa</p>
                    </div>
                </div>
            `;
        } else {
            // Show favorite doas (implementation would be similar to category doas)
            contentArea.innerHTML = `
                <div class="favorites-list">
                    <h3>Doa Favorit Anda</h3>
                    <p>Fitur favorit akan segera hadir...</p>
                </div>
            `;
        }
    }

    showCounter() {
        const contentArea = this.container.querySelector('#contentArea');
        
        contentArea.innerHTML = `
            <div class="counter-section">
                <div class="counter-display">
                    <div class="counter-number" id="counterNumber">${this.counterState.current}</div>
                    <div class="counter-target">Target: ${this.counterState.target}</div>
                    
                    <div class="counter-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(this.counterState.current / this.counterState.target) * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="counter-controls">
                    <button class="counter-btn" id="incrementCounter">
                        <i class="fas fa-plus"></i>
                        <span>Tambah</span>
                    </button>
                    <button class="counter-btn secondary" id="resetCounter">
                        <i class="fas fa-undo"></i>
                        <span>Reset</span>
                    </button>
                    <button class="counter-btn secondary" id="setTarget">
                        <i class="fas fa-target"></i>
                        <span>Set Target</span>
                    </button>
                </div>
                
                <div class="counter-info">
                    <p>Gunakan counter untuk menghitung dzikir atau doa yang Anda baca.</p>
                </div>
            </div>
            
            <style>
            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-top: 15px;
            }
            
            .progress-fill {
                height: 100%;
                background: var(--gradient-primary);
                transition: width 0.3s ease;
                border-radius: 4px;
            }
            
            .counter-info {
                margin-top: 30px;
                color: var(--text-secondary);
                font-size: 14px;
            }
            </style>
        `;

        // Add counter functionality
        this.setupCounterEvents();
    }

    setupCounterEvents() {
        const incrementBtn = this.container.querySelector('#incrementCounter');
        const resetBtn = this.container.querySelector('#resetCounter');
        const setTargetBtn = this.container.querySelector('#setTarget');
        const counterNumber = this.container.querySelector('#counterNumber');
        const progressFill = this.container.querySelector('.progress-fill');

        incrementBtn?.addEventListener('click', () => {
            this.counterState.current++;
            this.updateCounterDisplay();
            
            // Haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });

        resetBtn?.addEventListener('click', () => {
            if (confirm('Reset counter ke 0?')) {
                this.counterState.current = 0;
                this.updateCounterDisplay();
            }
        });

        setTargetBtn?.addEventListener('click', () => {
            const newTarget = prompt('Masukkan target baru:', this.counterState.target);
            if (newTarget && !isNaN(newTarget) && newTarget > 0) {
                this.counterState.target = parseInt(newTarget);
                this.updateCounterDisplay();
            }
        });
    }

    updateCounterDisplay() {
        const counterNumber = this.container.querySelector('#counterNumber');
        const progressFill = this.container.querySelector('.progress-fill');
        const counterTarget = this.container.querySelector('.counter-target');

        if (counterNumber) {
            counterNumber.textContent = this.counterState.current;
        }

        if (counterTarget) {
            counterTarget.textContent = `Target: ${this.counterState.target}`;
        }

        if (progressFill) {
            const percentage = Math.min((this.counterState.current / this.counterState.target) * 100, 100);
            progressFill.style.width = `${percentage}%`;
        }

        // Check if target reached
        if (this.counterState.current >= this.counterState.target) {
            this.showNotification('🎉 Target tercapai! Barakallahu fiik', 'success');
        }

        // Save state
        this.saveCounterState();
    }

    handleSearch(query) {
        if (!query) {
            this.showCategories();
            return;
        }

        // Simple search implementation
        this.searchResults = [];
        
        Object.keys(this.doaCollection).forEach(categoryId => {
            const category = this.doaCollection[categoryId];
            category.doa.forEach(doa => {
                if (
                    doa.title.toLowerCase().includes(query.toLowerCase()) ||
                    doa.translation.toLowerCase().includes(query.toLowerCase()) ||
                    doa.latin.toLowerCase().includes(query.toLowerCase())
                ) {
                    this.searchResults.push({
                        ...doa,
                        categoryId,
                        categoryTitle: category.title
                    });
                }
            });
        });

        this.showSearchResults(query);
    }

    showSearchResults(query) {
        const contentArea = this.container.querySelector('#contentArea');
        
        if (this.searchResults.length === 0) {
            contentArea.innerHTML = `
                <div class="search-results empty">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <h3>Tidak Ditemukan</h3>
                        <p>Tidak ada hasil untuk "${query}"</p>
                    </div>
                </div>
            `;
            return;
        }

        const resultsHtml = `
            <div class="search-results">
                <div class="search-header">
                    <h3>Hasil Pencarian</h3>
                    <p>${this.searchResults.length} hasil ditemukan untuk "${query}"</p>
                </div>
                
                <div class="doa-list">
                    ${this.searchResults.map(doa => `
                        <div class="doa-card" data-doa="${doa.id}" data-category="${doa.categoryId}">
                            <div class="doa-header">
                                <div class="doa-title">${doa.title}</div>
                                <div class="doa-category">${doa.categoryTitle}</div>
                            </div>
                            <div class="doa-arabic">${doa.arabic.substring(0, 100)}...</div>
                            <div class="doa-translation">${doa.translation.substring(0, 150)}...</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <style>
            .search-header {
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(0, 255, 255, 0.1);
            }
            
            .search-header h3 {
                color: var(--text-primary);
                margin-bottom: 5px;
            }
            
            .search-header p {
                color: var(--text-secondary);
                font-size: 14px;
            }
            
            .doa-category {
                background: rgba(0, 255, 255, 0.1);
                color: var(--primary-cyan);
                font-size: 12px;
                padding: 4px 8px;
                border-radius: 8px;
                font-weight: 500;
            }
            </style>
        `;

        contentArea.innerHTML = resultsHtml;
    }

    updatePrayerRecommendations(prayerData) {
        const widget = this.container.querySelector('#prayerTimeWidget');
        const recommendation = this.container.querySelector('#prayerRecommendation');
        
        if (!prayerData || !widget || !recommendation) return;

        // Show recommendations based on current prayer time
        const currentTime = new Date().getHours();
        let recommendedCategory = null;

        if (currentTime >= 5 && currentTime < 7) {
            recommendedCategory = 'dzikir_pagi';
        } else if (currentTime >= 15 && currentTime < 18) {
            recommendedCategory = 'dzikir_sore';
        }

        if (recommendedCategory && this.doaCollection[recommendedCategory]) {
            const category = this.doaCollection[recommendedCategory];
            
            recommendation.innerHTML = `
                <div class="recommendation-content">
                    <div class="recommendation-header">
                        <span class="category-icon">${category.icon}</span>
                        <div>
                            <h4>${category.title}</h4>
                            <p>Waktu yang tepat untuk ${category.description.toLowerCase()}</p>
                        </div>
                    </div>
                    <button class="recommendation-btn" data-category="${recommendedCategory}">
                        <i class="fas fa-play"></i>
                        <span>Mulai ${category.title}</span>
                    </button>
                </div>
                
                <style>
                .recommendation-content {
                    text-align: left;
                }
                
                .recommendation-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 15px;
                }
                
                .recommendation-header h4 {
                    color: var(--text-primary);
                    margin: 0 0 4px 0;
                    font-size: 16px;
                }
                
                .recommendation-header p {
                    color: var(--text-secondary);
                    margin: 0;
                    font-size: 13px;
                }
                
                .recommendation-btn {
                    background: var(--gradient-secondary);
                    border: none;
                    border-radius: 8px;
                    padding: 10px 15px;
                    color: var(--dark-bg);
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .recommendation-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(0, 255, 65, 0.3);
                }
                </style>
            `;

            // Add click handler
            const recBtn = recommendation.querySelector('.recommendation-btn');
            recBtn?.addEventListener('click', () => {
                this.switchSection('categories');
                setTimeout(() => {
                    this.showCategoryDoas(recommendedCategory);
                }, 100);
            });

            widget.style.display = 'block';
        } else {
            widget.style.display = 'none';
        }
    }

    async loadFavorites() {
        try {
            const saved = await this.storageManager?.get('dzikir_favorites');
            this.favorites = saved || [];
        } catch (error) {
            console.warn('Failed to load favorites:', error);
            this.favorites = [];
        }
    }

    async saveFavorites() {
        try {
            await this.storageManager?.set('dzikir_favorites', this.favorites);
        } catch (error) {
            console.warn('Failed to save favorites:', error);
        }
    }

    async saveCounterState() {
        try {
            await this.storageManager?.set('dzikir_counter', this.counterState);
        } catch (error) {
            console.warn('Failed to save counter state:', error);
        }
    }

    async loadCounterState() {
        try {
            const saved = await this.storageManager?.get('dzikir_counter');
            if (saved) {
                this.counterState = { ...this.counterState, ...saved };
            }
        } catch (error) {
            console.warn('Failed to load counter state:', error);
        }
    }

    showNotification(message, type = 'info') {
        // Use the main app's notification manager
        if (window.app && window.app.notificationManager) {
            window.app.notificationManager.show(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    renderError() {
        this.container.innerHTML = `
            <div class="component-error">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Gagal Memuat Dzikir & Doa</h3>
                <p>Terjadi kesalahan saat memuat aplikasi dzikir. Silakan coba lagi.</p>
                <button onclick="this.closest('.app-component').dispatchEvent(new CustomEvent('retry'))" 
                        class="retry-btn">
                    <i class="fas fa-redo"></i>
                    Coba Lagi
                </button>
            </div>
            
            <style>
            .component-error {
                text-align: center;
                padding: 60px 20px;
                color: var(--text-secondary);
            }
            
            .error-icon {
                font-size: 48px;
                color: #ff4757;
                margin-bottom: 20px;
            }
            
            .component-error h3 {
                color: var(--text-primary);
                margin-bottom: 10px;
            }
            
            .retry-btn {
                background: var(--gradient-primary);
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                color: var(--dark-bg);
                font-weight: 600;
                cursor: pointer;
                margin-top: 20px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            }
            
            .retry-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }
            </style>
        `;

        // Add retry event listener
        this.container.addEventListener('retry', () => {
            this.init();
        });
    }

    destroy() {
        console.log('📿 Dzikir Component destroyed');
    }
}