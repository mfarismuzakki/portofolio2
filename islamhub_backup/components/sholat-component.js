/**
 * Tata Cara Sholat Component for Islamic SuperApps
 * Guide for prayer procedures according to Quran and Sunnah
 */

export default class SholatComponent {
    constructor({ container, eventBus, sharedData, storageManager }) {
        this.container = container;
        this.eventBus = eventBus;
        this.sharedData = sharedData;
        this.storageManager = storageManager;
        
        // Component state
        this.currentCategory = 'all';
        this.currentView = 'categories';
        this.currentItem = null;
        this.searchQuery = '';
        this.favorites = [];
        
        // Sample data (in full implementation, this would be loaded from external file)
        this.sholatData = this.initializeSholatData();
    }

    async init() {
        try {
            // Load favorites
            await this.loadFavorites();
            
            // Render component
            this.render();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Show initial view
            this.showCategories();
            
        } catch (error) {
            console.error('❌ Failed to initialize Sholat Component:', error);
            this.renderError();
        }
    }

    initializeSholatData() {
        return {
            categories: [
                {
                    id: 'wudu',
                    title: 'Tata Cara Wudhu',
                    icon: '💧',
                    description: 'Panduan lengkap wudhu sesuai sunnah',
                    color: '#4ECDC4',
                    items: [
                        {
                            id: 'wudu_niat',
                            title: 'Niat Wudhu',
                            arabic: 'نَوَيْتُ الْوُضُوْءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلّٰهِ تَعَالَى',
                            latin: 'Nawaitul wudhuu-a liraf\'il hadatsil ashghari fardhan lillaahi ta\'aala',
                            translation: 'Saya niat wudhu untuk menghilangkan hadats kecil, fardhu karena Allah Ta\'ala',
                            steps: ['Hadapkan hati kepada Allah', 'Niatkan dalam hati untuk berwudhu', 'Ucapkan niat (sunnah)']
                        },
                        {
                            id: 'wudu_steps',
                            title: 'Urutan Wudhu',
                            steps: [
                                'Baca Bismillah',
                                'Cuci kedua telapak tangan 3 kali',
                                'Berkumur 3 kali',
                                'Istinsyaq (hirup air ke hidung) 3 kali',
                                'Cuci muka 3 kali',
                                'Cuci tangan hingga siku 3 kali (kanan dulu)',
                                'Usap kepala 1 kali',
                                'Usap telinga 1 kali',
                                'Cuci kaki hingga mata kaki 3 kali (kanan dulu)'
                            ]
                        }
                    ]
                },
                {
                    id: 'sholat_fardhu',
                    title: 'Sholat Fardhu',
                    icon: '🕌',
                    description: 'Tata cara sholat lima waktu',
                    color: '#45B7D1',
                    items: [
                        {
                            id: 'niat_sholat',
                            title: 'Niat Sholat',
                            subItems: [
                                {
                                    name: 'Subuh',
                                    arabic: 'أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى',
                                    latin: 'Ushalli fardash shubhi rak\'ataini mustaqbilal qiblati adaa-an lillaahi ta\'aala',
                                    translation: 'Saya sholat fardhu Subuh dua rakaat menghadap kiblat, ada (tepat waktu) karena Allah Ta\'ala'
                                },
                                {
                                    name: 'Dzuhur',
                                    arabic: 'أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى',
                                    latin: 'Ushalli fardhaz zhuhri arba\'a raka\'aatin mustaqbilal qiblati adaa-an lillaahi ta\'aala',
                                    translation: 'Saya sholat fardhu Dzuhur empat rakaat menghadap kiblat, ada (tepat waktu) karena Allah Ta\'ala'
                                }
                            ]
                        },
                        {
                            id: 'takbiratul_ihram',
                            title: 'Takbiratul Ihram',
                            arabic: 'اللّٰهُ أَكْبَرُ',
                            latin: 'Allaahu akbar',
                            translation: 'Allah Maha Besar',
                            description: 'Takbir pembuka sholat sambil mengangkat kedua tangan'
                        }
                    ]
                },
                {
                    id: 'bacaan_sholat',
                    title: 'Bacaan dalam Sholat',
                    icon: '📖',
                    description: 'Doa dan bacaan lengkap sholat',
                    color: '#96CEB4',
                    items: [
                        {
                            id: 'fatihah',
                            title: 'Al-Fatihah',
                            arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۝ الْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ ۝ الرَّحْمٰنِ الرَّحِيْمِ ۝ مٰلِكِ يَوْمِ الدِّيْنِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِيْنُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ ۝ صِرَاطَ الَّذِيْنَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّآلِّيْنَ',
                            latin: 'Bismillaahir rahmaanir rahiim. Alhamdulillaahi rabbil \'aalamiin. Ar-rahmaanir rahiim. Maaliki yaumiddiin. Iyyaaka na\'budu wa iyyaaka nasta\'iin. Ihdinash shiraathal mustaqiim. Shiraathalladziina an\'amta \'alaihim ghairil maghdhuubi \'alaihim wa ladh dhaaliin',
                            translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang. Segala puji bagi Allah, Tuhan seluruh alam. Yang Maha Pengasih, Maha Penyayang. Pemilik hari pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan. Tunjukilah kami jalan yang lurus. (Yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya, bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.'
                        },
                        {
                            id: 'ruku',
                            title: 'Bacaan Ruku',
                            arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيْمِ وَبِحَمْدِهِ',
                            latin: 'Subhaana rabbiyal \'azhiimi wa bihamdih',
                            translation: 'Maha Suci Tuhanku Yang Maha Agung dan dengan memuji-Nya',
                            count: '3x atau lebih (ganjil)'
                        },
                        {
                            id: 'sujud',
                            title: 'Bacaan Sujud',
                            arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
                            latin: 'Subhaana rabbiyal a\'laa wa bihamdih',
                            translation: 'Maha Suci Tuhanku Yang Maha Tinggi dan dengan memuji-Nya',
                            count: '3x atau lebih (ganjil)'
                        }
                    ]
                },
                {
                    id: 'sholat_sunnah',
                    title: 'Sholat Sunnah',
                    icon: '✨',
                    description: 'Sholat-sholat sunnah dan keutamaannya',
                    color: '#FECA57',
                    items: [
                        {
                            id: 'sunnah_rawatib',
                            title: 'Sholat Rawatib',
                            description: 'Sholat sunnah yang mengikuti sholat fardhu',
                            types: [
                                'Sebelum Subuh: 2 rakaat',
                                'Sebelum Dzuhur: 4 rakaat',
                                'Setelah Dzuhur: 2 rakaat',
                                'Setelah Maghrib: 2 rakaat',
                                'Setelah Isya: 2 rakaat'
                            ]
                        },
                        {
                            id: 'tahajud',
                            title: 'Sholat Tahajud',
                            description: 'Sholat sunnah di sepertiga malam terakhir',
                            waktu: 'Setelah tidur hingga sebelum Subuh',
                            rakaat: '2-12 rakaat (kelipatan 2)',
                            keutamaan: 'Waktu mustajab untuk berdoa'
                        }
                    ]
                }
            ]
        };
    }

    render() {
        this.container.innerHTML = `
            <div class="sholat-wrapper">
                <!-- Header Section -->
                <div class="sholat-header">
                    <div class="header-content">
                        <h2>Tata Cara Sholat</h2>
                        <p>Panduan lengkap sholat sesuai Al-Quran dan Sunnah</p>
                    </div>
                    
                    <!-- Search Bar -->
                    <div class="search-container">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="searchInput" placeholder="Cari panduan sholat...">
                            <button id="clearSearch" class="clear-search">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <div class="navigation-tabs">
                    <button class="nav-tab active" data-view="categories">
                        <i class="fas fa-th-large"></i>
                        <span>Kategori</span>
                    </button>
                    <button class="nav-tab" data-view="favorites">
                        <i class="fas fa-heart"></i>
                        <span>Favorit</span>
                    </button>
                    <button class="nav-tab" data-view="guide">
                        <i class="fas fa-book-open"></i>
                        <span>Panduan</span>
                    </button>
                </div>

                <!-- Main Content Area -->
                <div class="content-area" id="contentArea">
                    <!-- Dynamic content will be loaded here -->
                </div>

                <!-- Quick Access Floating Button -->
                <div class="quick-access" id="quickAccess">
                    <button class="quick-btn" id="quickPrayerTimes">
                        <i class="fas fa-clock"></i>
                        <span>Waktu Sholat</span>
                    </button>
                </div>
            </div>
            
            <style>
            /* Sholat Component Specific Styles */
            .sholat-wrapper {
                max-width: 800px;
                margin: 0 auto;
                padding: 0;
                position: relative;
            }

            .sholat-header {
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 20px;
                backdrop-filter: blur(20px);
            }

            .header-content {
                text-align: center;
                margin-bottom: 20px;
            }

            .header-content h2 {
                font-family: var(--font-primary);
                font-size: 28px;
                font-weight: 700;
                color: var(--primary-cyan);
                margin-bottom: 8px;
            }

            .header-content p {
                color: var(--text-secondary);
                font-size: 14px;
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
                margin-bottom: 80px;
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

            .category-info .item-count {
                font-size: 12px;
                color: var(--text-secondary);
                font-weight: 500;
            }

            .category-description {
                color: var(--text-secondary);
                font-size: 14px;
                line-height: 1.5;
            }

            .item-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .item-card {
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .item-card:hover {
                border-color: rgba(0, 255, 255, 0.3);
                box-shadow: 0 4px 20px rgba(0, 255, 255, 0.1);
            }

            .item-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 15px;
            }

            .item-title {
                font-family: var(--font-primary);
                font-size: 16px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .favorite-btn {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                font-size: 18px;
                transition: color 0.3s ease;
            }

            .favorite-btn.active {
                color: #ff6b6b;
            }

            .item-arabic {
                font-size: 18px;
                line-height: 1.8;
                color: var(--text-primary);
                text-align: right;
                margin-bottom: 10px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 8px;
                border-right: 3px solid var(--primary-cyan);
            }

            .item-latin {
                font-size: 14px;
                color: var(--text-secondary);
                font-style: italic;
                margin-bottom: 10px;
                line-height: 1.5;
            }

            .item-translation {
                font-size: 14px;
                color: var(--text-primary);
                line-height: 1.6;
            }

            .item-steps {
                list-style: none;
                padding: 0;
                margin: 15px 0;
            }

            .item-steps li {
                background: rgba(0, 255, 255, 0.05);
                border-left: 3px solid var(--primary-cyan);
                padding: 10px 15px;
                margin-bottom: 8px;
                border-radius: 0 8px 8px 0;
                font-size: 14px;
                color: var(--text-primary);
            }

            .item-steps li::before {
                content: counter(step-counter);
                counter-increment: step-counter;
                background: var(--primary-cyan);
                color: var(--dark-bg);
                font-weight: 600;
                font-size: 12px;
                padding: 2px 6px;
                border-radius: 50%;
                margin-right: 10px;
                display: inline-block;
                min-width: 20px;
                text-align: center;
            }

            .item-steps {
                counter-reset: step-counter;
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

            .quick-access {
                position: fixed;
                bottom: 100px;
                right: 20px;
                z-index: 100;
            }

            .quick-btn {
                background: var(--gradient-primary);
                border: none;
                border-radius: 50px;
                padding: 12px 20px;
                color: var(--dark-bg);
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
            }

            .quick-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(0, 255, 255, 0.4);
            }

            .empty-state {
                text-align: center;
                padding: 60px 20px;
                color: var(--text-secondary);
            }

            .empty-icon {
                font-size: 64px;
                color: var(--text-muted);
                opacity: 0.5;
                margin-bottom: 20px;
            }

            .empty-state h3 {
                color: var(--text-primary);
                margin-bottom: 10px;
            }

            .guide-section {
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.1);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 20px;
            }

            .guide-header {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 18px;
                font-weight: 600;
                color: var(--primary-cyan);
                margin-bottom: 20px;
            }

            .guide-content {
                color: var(--text-secondary);
                font-size: 14px;
                line-height: 1.6;
            }

            .guide-content h4 {
                color: var(--text-primary);
                margin: 20px 0 10px 0;
                font-size: 16px;
            }

            .guide-content ul {
                padding-left: 20px;
            }

            .guide-content li {
                margin-bottom: 8px;
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
                
                .quick-access {
                    bottom: 80px;
                    right: 15px;
                }
                
                .quick-btn {
                    padding: 10px 16px;
                    font-size: 13px;
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
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
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

        // Quick access button
        const quickPrayerTimes = this.container.querySelector('#quickPrayerTimes');
        quickPrayerTimes?.addEventListener('click', () => {
            this.showPrayerTimesIntegration();
        });

        // Listen for prayer time updates from Adzan component
        this.eventBus?.addEventListener('prayerTime', (event) => {
            this.updatePrayerIntegration(event.detail);
        });
    }

    switchView(view) {
        // Update navigation state
        const navTabs = this.container.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.view === view);
        });

        this.currentView = view;

        // Load view content
        switch (view) {
            case 'categories':
                this.showCategories();
                break;
            case 'favorites':
                this.showFavorites();
                break;
            case 'guide':
                this.showGuide();
                break;
        }
    }

    showCategories() {
        const contentArea = this.container.querySelector('#contentArea');
        
        const categoriesHtml = `
            <div class="categories-grid">
                ${this.sholatData.categories.map(category => `
                    <div class="category-card" data-category="${category.id}">
                        <div class="category-header">
                            <div class="category-icon">${category.icon}</div>
                            <div class="category-info">
                                <h3>${category.title}</h3>
                                <div class="item-count">${category.items.length} item</div>
                            </div>
                        </div>
                        <div class="category-description">${category.description}</div>
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
                this.showCategoryItems(categoryId);
            });
        });
    }

    showCategoryItems(categoryId) {
        const category = this.sholatData.categories.find(c => c.id === categoryId);
        if (!category) return;

        const contentArea = this.container.querySelector('#contentArea');

        const itemsHtml = `
            <button class="back-button" id="backToCategories">
                <i class="fas fa-arrow-left"></i>
                <span>Kembali ke Kategori</span>
            </button>
            
            <div class="category-header-detail">
                <div class="category-header">
                    <div class="category-icon">${category.icon}</div>
                    <div class="category-info">
                        <h3>${category.title}</h3>
                        <div class="item-count">${category.items.length} item</div>
                    </div>
                </div>
                <div class="category-description">${category.description}</div>
            </div>

            <div class="item-list">
                ${category.items.map(item => this.renderItem(item)).join('')}
            </div>
        `;

        contentArea.innerHTML = itemsHtml;

        // Add back button handler
        const backButton = contentArea.querySelector('#backToCategories');
        backButton?.addEventListener('click', () => {
            this.showCategories();
        });

        // Add favorite button handlers
        this.setupFavoriteButtons();
    }

    renderItem(item) {
        const isFavorite = this.favorites.includes(item.id);
        
        let content = `
            <div class="item-card" data-item="${item.id}">
                <div class="item-header">
                    <div class="item-title">${item.title}</div>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-item="${item.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
        `;

        if (item.arabic) {
            content += `<div class="item-arabic">${item.arabic}</div>`;
        }

        if (item.latin) {
            content += `<div class="item-latin">${item.latin}</div>`;
        }

        if (item.translation) {
            content += `<div class="item-translation">${item.translation}</div>`;
        }

        if (item.steps) {
            content += `
                <ol class="item-steps">
                    ${item.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            `;
        }

        if (item.description) {
            content += `<div class="item-translation">${item.description}</div>`;
        }

        if (item.count) {
            content += `<div class="item-count-info"><strong>Jumlah:</strong> ${item.count}</div>`;
        }

        content += `</div>`;
        
        return content;
    }

    setupFavoriteButtons() {
        const favoriteButtons = this.container.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = e.currentTarget.dataset.item;
                this.toggleFavorite(itemId);
                e.currentTarget.classList.toggle('active');
            });
        });
    }

    toggleFavorite(itemId) {
        const index = this.favorites.indexOf(itemId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showNotification('Dihapus dari favorit', 'info');
        } else {
            this.favorites.push(itemId);
            this.showNotification('Ditambahkan ke favorit', 'success');
        }
        this.saveFavorites();
    }

    showFavorites() {
        const contentArea = this.container.querySelector('#contentArea');
        
        if (this.favorites.length === 0) {
            contentArea.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <h3>Belum Ada Favorit</h3>
                    <p>Tambahkan panduan ke favorit dengan menekan ikon ❤️</p>
                </div>
            `;
            return;
        }

        // Get favorite items from all categories
        const favoriteItems = [];
        this.sholatData.categories.forEach(category => {
            category.items.forEach(item => {
                if (this.favorites.includes(item.id)) {
                    favoriteItems.push({ ...item, categoryTitle: category.title });
                }
            });
        });

        const favoritesHtml = `
            <div class="favorites-header">
                <h3>Panduan Favorit Anda</h3>
                <p>${favoriteItems.length} item favorit</p>
            </div>
            
            <div class="item-list">
                ${favoriteItems.map(item => this.renderItem(item)).join('')}
            </div>
        `;

        contentArea.innerHTML = favoritesHtml;
        this.setupFavoriteButtons();
    }

    showGuide() {
        const contentArea = this.container.querySelector('#contentArea');
        
        contentArea.innerHTML = `
            <div class="guide-section">
                <div class="guide-header">
                    <i class="fas fa-book-open"></i>
                    <span>Panduan Umum Sholat</span>
                </div>
                <div class="guide-content">
                    <h4>Syarat Sholat</h4>
                    <ul>
                        <li>Suci dari hadats kecil dan besar (berwudhu/mandi)</li>
                        <li>Suci badan, pakaian, dan tempat dari najis</li>
                        <li>Menutup aurat</li>
                        <li>Menghadap kiblat</li>
                        <li>Mengetahui masuknya waktu sholat</li>
                        <li>Mengetahui niat</li>
                    </ul>

                    <h4>Rukun Sholat</h4>
                    <ul>
                        <li>Niat</li>
                        <li>Takbiratul ihram</li>
                        <li>Berdiri bagi yang mampu</li>
                        <li>Membaca Al-Fatihah</li>
                        <li>Ruku dan tuma'ninah</li>
                        <li>I'tidal dan tuma'ninah</li>
                        <li>Sujud dua kali dan tuma'ninah</li>
                        <li>Duduk antara dua sujud dan tuma'ninah</li>
                        <li>Duduk akhir</li>
                        <li>Membaca tasyahud akhir</li>
                        <li>Membaca sholawat</li>
                        <li>Salam</li>
                        <li>Tertib</li>
                    </ul>

                    <h4>Sunnah Sholat</h4>
                    <ul>
                        <li>Membaca doa iftitah</li>
                        <li>Membaca ta'awudz</li>
                        <li>Membaca amin</li>
                        <li>Membaca surat setelah Al-Fatihah</li>
                        <li>Mengangkat tangan saat takbir</li>
                        <li>Meletakkan tangan kanan di atas kiri</li>
                        <li>Dan sunnah-sunnah lainnya</li>
                    </ul>
                </div>
            </div>

            <div class="guide-section">
                <div class="guide-header">
                    <i class="fas fa-clock"></i>
                    <span>Waktu-waktu Sholat</span>
                </div>
                <div class="guide-content">
                    <h4>Waktu Sholat Lima Waktu</h4>
                    <ul>
                        <li><strong>Subuh:</strong> Dari terbit fajar shidiq hingga terbit matahari</li>
                        <li><strong>Dzuhur:</strong> Dari tergelincir matahari hingga bayangan sama dengan bendanya</li>
                        <li><strong>Ashar:</strong> Dari habis waktu Dzuhur hingga terbenam matahari</li>
                        <li><strong>Maghrib:</strong> Dari terbenam matahari hingga hilang mega merah</li>
                        <li><strong>Isya:</strong> Dari habis waktu Maghrib hingga terbit fajar</li>
                    </ul>
                </div>
            </div>

            <div class="guide-section">
                <div class="guide-header">
                    <i class="fas fa-info-circle"></i>
                    <span>Tips dan Etika</span>
                </div>
                <div class="guide-content">
                    <h4>Etika dalam Sholat</h4>
                    <ul>
                        <li>Bersuci dengan sempurna</li>
                        <li>Memakai pakaian yang bersih dan rapi</li>
                        <li>Khusyu dan konsentrasi</li>
                        <li>Tidak tergesa-gesa</li>
                        <li>Menghadap kiblat dengan tepat</li>
                        <li>Menjaga kebersihan tempat sholat</li>
                    </ul>

                    <h4>Yang Membatalkan Sholat</h4>
                    <ul>
                        <li>Berbicara dengan sengaja</li>
                        <li>Bergerak tiga kali berturut-turut tanpa keperluan sholat</li>
                        <li>Makan atau minum</li>
                        <li>Tertawa terbahak-bahak</li>
                        <li>Berpaling dari kiblat tanpa uzur</li>
                        <li>Batal wudhu</li>
                    </ul>
                </div>
            </div>
        `;
    }

    handleSearch(query) {
        this.searchQuery = query.toLowerCase();
        
        if (!query) {
            this.showCategories();
            return;
        }

        // Search through all items
        const searchResults = [];
        this.sholatData.categories.forEach(category => {
            category.items.forEach(item => {
                if (
                    item.title.toLowerCase().includes(query) ||
                    (item.translation && item.translation.toLowerCase().includes(query)) ||
                    (item.latin && item.latin.toLowerCase().includes(query)) ||
                    (item.description && item.description.toLowerCase().includes(query))
                ) {
                    searchResults.push({
                        ...item,
                        categoryTitle: category.title,
                        categoryIcon: category.icon
                    });
                }
            });
        });

        this.showSearchResults(searchResults, query);
    }

    showSearchResults(results, query) {
        const contentArea = this.container.querySelector('#contentArea');
        
        if (results.length === 0) {
            contentArea.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>Tidak Ditemukan</h3>
                    <p>Tidak ada hasil untuk "${query}"</p>
                </div>
            `;
            return;
        }

        const resultsHtml = `
            <div class="search-results">
                <div class="search-header">
                    <h3>Hasil Pencarian</h3>
                    <p>${results.length} hasil ditemukan untuk "${query}"</p>
                </div>
                
                <div class="item-list">
                    ${results.map(item => `
                        <div class="item-card">
                            <div class="item-header">
                                <div class="item-title">
                                    ${item.categoryIcon} ${item.title}
                                </div>
                                <div class="item-category">${item.categoryTitle}</div>
                            </div>
                            ${item.arabic ? `<div class="item-arabic">${item.arabic}</div>` : ''}
                            ${item.latin ? `<div class="item-latin">${item.latin}</div>` : ''}
                            ${item.translation ? `<div class="item-translation">${item.translation.substring(0, 150)}...</div>` : ''}
                            ${item.description ? `<div class="item-translation">${item.description.substring(0, 150)}...</div>` : ''}
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
            
            .item-category {
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

    showPrayerTimesIntegration() {
        // Switch to Adzan component
        this.eventBus?.dispatchEvent(new CustomEvent('switchApp', {
            detail: { appName: 'adzan' }
        }));
        
        this.showNotification('Beralih ke Jadwal Adzan', 'info');
    }

    updatePrayerIntegration(prayerData) {
        // Update quick access button with current prayer info
        const quickBtn = this.container.querySelector('#quickPrayerTimes');
        if (quickBtn && prayerData.nextPrayer) {
            const nextPrayer = prayerData.nextPrayer;
            quickBtn.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>${nextPrayer.name} ${nextPrayer.time}</span>
            `;
        }
    }

    async loadFavorites() {
        try {
            const saved = await this.storageManager?.get('sholat_favorites');
            this.favorites = saved || [];
        } catch (error) {
            console.warn('Failed to load favorites:', error);
            this.favorites = [];
        }
    }

    async saveFavorites() {
        try {
            await this.storageManager?.set('sholat_favorites', this.favorites);
        } catch (error) {
            console.warn('Failed to save favorites:', error);
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
                <h3>Gagal Memuat Tata Cara Sholat</h3>
                <p>Terjadi kesalahan saat memuat panduan sholat. Silakan coba lagi.</p>
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
        console.log('🕌 Sholat Component destroyed');
    }
}