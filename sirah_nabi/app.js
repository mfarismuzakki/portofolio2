// Sirah Nabi-Nabi & Sahabat Application
class SirahApp {
    constructor() {
        this.currentFilter = 'all';
        this.currentPerson = null;
        this.favorites = this.loadFavorites();
        this.currentTab = 'biodata';
        this.currentSection = 'home';
        
        // Initialize cache manager dengan error handling
        try {
            this.cacheManager = new SirahCacheManager();
        } catch (error) {
            console.error('Failed to initialize cache manager:', error);
            this.cacheManager = null;
        }
        
        // Data akan di-load secara progressive
        this.loadedData = {
            nabi: [],
            sahabat: [],
            sahabiyat: []
        };
        
        this.dataLoadStatus = {
            nabiComplete: false,
            sahabatComplete: false,
            sahabiyatComplete: false
        };
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        
        // Load ALL data saat init untuk pengalaman yang lebih baik
        if (this.cacheManager) {
            try {
                // Load semua data sekaligus menggunakan cache manager
                await this.cacheManager.preloadAllData();
                
                // Setelah cache manager selesai, populate loadedData dari cache
                await this.populateDataFromCache();
            } catch (error) {
                console.warn('Could not preload all data:', error);
                // Jika preload gagal, coba load minimal scripts
                await this.loadAllScripts();
            }
        } else {
            // Fallback: load all scripts directly
            await this.loadAllScripts();
        }
        
        // Load initial data (akan menggunakan data yang sudah di-cache)
        await this.loadInitialData();
        
        this.displayPersons();
        this.updateFavoritesCount();
        this.hideLoading();
    }

    // Load essential scripts as fallback
    async loadEssentialScripts() {
        const essentialScripts = [
            './data/nabi-part1.js',
            './data/sahabat-khulafa.js', 
            './data/sahabiyat.js'
        ];

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        try {
            await Promise.all(essentialScripts.map(loadScript));
        } catch (error) {
            console.warn('Some essential scripts failed to load:', error);
        }
    }

    // Load ALL scripts at once for complete data
    async loadAllScripts() {
        const allScripts = [
            './data/nabi-part1.js',
            './data/nabi-part2.js',
            './data/nabi-part3.js', 
            './data/nabi-part4.js',
            './data/nabi-part5.js',
            './data/nabi-disputed.js',
            './data/sahabat-khulafa.js',
            './data/sahabat-asharah.js',
            './data/sahabat-muhajirin-anshar.js',
            './data/sahabiyat.js'
        ];

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        try {
            await Promise.all(allScripts.map(loadScript));
            
            // Setelah semua script dimuat, isi loadedData langsung
            this.loadedData.nabi = [
                ...(window.nabiPart1 || []),
                ...(window.nabiPart2 || []),
                ...(window.nabiPart3 || []),
                ...(window.nabiPart4 || []),
                ...(window.nabiPart5 || []),
                ...(window.nabiDisputed || [])
            ];
            
            this.loadedData.sahabat = [
                ...(window.sahabatKhulafa || []),
                ...(window.sahabatAsharah || []),
                ...(window.sahabatMuhajirinAnshar || []),
                ...(window.sahabatTerkenal || [])
            ];
            
            this.loadedData.sahabiyat = [...(window.sahabiyat || [])];
            
            // Mark sebagai complete
            this.dataLoadStatus.nabiComplete = true;
            this.dataLoadStatus.sahabatComplete = true;
            
        } catch (error) {
            console.warn('Some scripts failed to load:', error);
        }
    }

    // Populate loadedData dari cache setelah preloadAllData
    async populateDataFromCache() {
        try {
            // Load semua data nabi
            const nabiParts = await Promise.all([
                this.cacheManager.loadData('nabi_part1'),
                this.cacheManager.loadData('nabi_part2'), 
                this.cacheManager.loadData('nabi_part3'),
                this.cacheManager.loadData('nabi_part4'),
                this.cacheManager.loadData('nabi_part5'),
                this.cacheManager.loadData('nabi_disputed')
            ]);
            
            this.loadedData.nabi = [].concat(...nabiParts);
            
            // Load semua data sahabat
            const sahabatParts = await Promise.all([
                this.cacheManager.loadData('sahabat_khulafa'),
                this.cacheManager.loadData('sahabat_asharah'),
                this.cacheManager.loadData('sahabat_muhajirin_anshar')
            ]);
            
            this.loadedData.sahabat = [].concat(...sahabatParts);
            
            // Load sahabiyat
            this.loadedData.sahabiyat = await this.cacheManager.loadData('sahabiyat');
            
            // Mark sebagai complete
            this.dataLoadStatus.nabiComplete = true;
            this.dataLoadStatus.sahabatComplete = true;
            
        } catch (error) {
            console.error('Error populating data from cache:', error);
        }
    }

    hideLoading() {
        setTimeout(() => {
            const loading = document.getElementById('loadingScreen');
            if (loading) {
                loading.classList.add('hidden');
            }
        }, 1000);
    }

    // Load data initial yang penting
    async loadInitialData() {
        // Jika data sudah lengkap dimuat di init(), skip loading ulang
        if (this.dataLoadStatus.nabiComplete && this.dataLoadStatus.sahabatComplete) {
            return;
        }

        try {
            // Cek apakah cache manager tersedia
            if (!this.cacheManager) {
                throw new Error('Cache manager not available');
            }

            // Load data Nabi Part 1 (Adam sampai Shalih) untuk tampilan awal - hanya jika belum lengkap
            if (!this.dataLoadStatus.nabiComplete) {
                try {
                    const nabiPart1 = await this.cacheManager.loadData('nabi_part1');
                    this.loadedData.nabi = [...nabiPart1];
                } catch (error) {
                    console.warn('Could not load nabi_part1, using fallback');
                    this.loadedData.nabi = window.nabiPart1 || window.nabiData || [];
                }
            }

            // Load Khulafa Rasyidin sebagai sahabat utama - hanya jika belum lengkap
            if (!this.dataLoadStatus.sahabatComplete) {
                try {
                    const sahabatKhulafa = await this.cacheManager.loadData('sahabat_khulafa');
                    this.loadedData.sahabat = [...sahabatKhulafa];
                } catch (error) {
                    console.warn('Could not load sahabat_khulafa, using fallback');
                    this.loadedData.sahabat = window.sahabatKhulafa || window.sahabatData || [];
                }
            }

            // Load sahabiyat utama - hanya jika belum dimuat
            if (this.loadedData.sahabiyat.length === 0) {
                try {
                    const sahabiyat = await this.cacheManager.loadData('sahabiyat');
                    this.loadedData.sahabiyat = [...sahabiyat];
                } catch (error) {
                    console.warn('Could not load sahabiyat, using fallback');
                    this.loadedData.sahabiyat = window.sahabiyat || [];
                }
            }


        } catch (error) {
            console.error('Error loading initial data:', error);
            // Fallback lengkap ke data yang ada
            this.loadedData.nabi = window.nabiPart1 || window.nabiData || [];
            this.loadedData.sahabat = window.sahabatKhulafa || window.sahabatData || [];
            this.loadedData.sahabiyat = window.sahabiyat || [];
        }
    }

    // Load data lengkap untuk kategori tertentu
    async loadCompleteNabiData() {
        if (this.dataLoadStatus.nabiComplete) return;

        try {

            if (!this.cacheManager) {
                // Fallback: gunakan data global jika ada
                const additionalNabi = [
                    ...(window.nabiPart2 || []),
                    ...(window.nabiPart3 || []),
                    ...(window.nabiPart4 || []),
                    ...(window.nabiPart5 || []),
                    ...(window.nabiDisputed || [])
                ];
                this.loadedData.nabi = [...this.loadedData.nabi, ...additionalNabi];
                this.dataLoadStatus.nabiComplete = true;
                return;
            }

            // Load semua part Nabi dengan individual error handling
            const parts = ['nabi_part2', 'nabi_part3', 'nabi_part4', 'nabi_part5', 'nabi_disputed'];
            
            for (const part of parts) {
                try {
                    const data = await this.cacheManager.loadData(part);
                    this.loadedData.nabi = [...this.loadedData.nabi, ...data];
                } catch (error) {
                    console.warn(`Could not load ${part}:`, error);
                    // Coba fallback ke window global
                    const fallbackData = window[part.replace('_', '')] || [];
                    this.loadedData.nabi = [...this.loadedData.nabi, ...fallbackData];
                }
            }

            this.dataLoadStatus.nabiComplete = true;
        } catch (error) {
            console.error('Error loading complete Nabi data:', error);
            this.dataLoadStatus.nabiComplete = true; // Mark as complete to avoid retry loops
        }
    }

    // Load data lengkap untuk sahabat
    async loadCompleteSahabatData() {
        if (this.dataLoadStatus.sahabatComplete) return;

        try {

            if (!this.cacheManager) {
                // Fallback: gunakan data global jika ada
                const additionalSahabat = [
                    ...(window.sahabatAsharah || []),
                    ...(window.sahabatMuhajirinAnshar || []),
                    ...(window.sahabatTerkenal || [])
                ];
                this.loadedData.sahabat = [...this.loadedData.sahabat, ...additionalSahabat];
                this.dataLoadStatus.sahabatComplete = true;
                return;
            }

            // Load semua data sahabat dengan individual error handling
            const parts = ['sahabat_asharah', 'sahabat_muhajirin_anshar', 'sahabat_terkenal'];
            
            for (const part of parts) {
                try {
                    const data = await this.cacheManager.loadData(part);
                    this.loadedData.sahabat = [...this.loadedData.sahabat, ...data];
                } catch (error) {
                    console.warn(`Could not load ${part}:`, error);
                    // Coba fallback ke window global
                    const fallbackData = window[part.replace('_', '').replace('sahabat', 'sahabat')] || [];
                    this.loadedData.sahabat = [...this.loadedData.sahabat, ...fallbackData];
                }
            }

            this.dataLoadStatus.sahabatComplete = true;
        } catch (error) {
            console.error('Error loading complete Sahabat data:', error);
            this.dataLoadStatus.sahabatComplete = true; // Mark as complete to avoid retry loops
        }
    }

    // Dapatkan semua data yang sudah di-load
    getAllLoadedData() {
        return [
            ...this.loadedData.nabi,
            ...this.loadedData.sahabat,
            ...this.loadedData.sahabiyat
        ];
    }

    // Cari person berdasarkan ID
    getPersonById(id) {
        const allData = this.getAllLoadedData();
        return allData.find(person => person.id === id);
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        searchClear.addEventListener('click', () => this.clearSearch());

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.handleFilter(e.currentTarget.dataset.filter));
        });

        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.addEventListener('click', (e) => this.handleNavigation(e.currentTarget.dataset.section));
        });

        // Modal detail tabs
        document.querySelectorAll('.detail-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.handleDetailTab(e.currentTarget.dataset.tab));
        });

        // Modal actions
        document.getElementById('favoriteBtn').addEventListener('click', () => this.toggleFavorite());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareCurrentPerson());

        // Close modal on overlay click
        document.getElementById('detailModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleSearch(query) {
        const searchClear = document.getElementById('searchClear');
        searchClear.style.display = query ? 'block' : 'none';
        
        this.displayPersons(query);
    }

    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        
        searchInput.value = '';
        searchClear.style.display = 'none';
        
        this.displayPersons();
    }

    handleFilter(filter) {
        
        // Update active filter tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const filterTab = document.querySelector(`[data-filter="${filter}"]`);
        if (filterTab) {
            filterTab.classList.add('active');
        } else {
            console.warn('⚠️ Filter tab not found for:', filter);
        }
        
        this.currentFilter = filter;
        
        // Untuk filter nabi dan sahabat, tetap di halaman utama tapi filter data
        this.showHomeSection();
    }

    handleNavigation(section) {
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        
        const navItem = document.querySelector(`[data-section="${section}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
        
        // Hide all sections
        const contentSection = document.getElementById('contentSection');
        const favoritesSection = document.getElementById('favoritesSection');
        
        if (contentSection) {
            contentSection.style.display = 'none';
        }
        if (favoritesSection) {
            favoritesSection.style.display = 'none';
        }
        
        const previousSection = this.currentSection;
        this.currentSection = section;
        
        switch (section) {
            case 'home':
                this.showHomeSection(previousSection);
                break;
            case 'favorites':
                this.showFavoritesSection();
                break;
            default:
                // Untuk section yang tidak dikenali, tampilkan home
                this.showHomeSection(previousSection);
                break;
        }
    }

    showHomeSection(previousSection = null) {
        const contentSection = document.getElementById('contentSection');
        if (contentSection) {
            contentSection.style.display = 'block';
        }
        
        // Hanya reset filter jika navigasi dari section lain ke home  
        if (previousSection && previousSection !== 'home') {
            this.currentFilter = 'all';
            this.updateActiveFilter('all');
        }
        
        this.displayPersons();
    }

    showFavoritesSection() {
        const favoritesSection = document.getElementById('favoritesSection');
        if (favoritesSection) {
            favoritesSection.style.display = 'block';
        }
        this.displayFavorites();
    }

    updateActiveFilter(filter) {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const filterTab = document.querySelector(`[data-filter="${filter}"]`);
        if (filterTab) {
            filterTab.classList.add('active');
        }
    }

    async displayPersons(query = '') {
        const grid = document.getElementById('sirahGrid');
        const resultsInfo = document.getElementById('resultsInfo');
        const resultsCount = document.getElementById('resultsCount');
        const emptyState = document.getElementById('emptyState');
        
        // Pastikan elemen ada sebelum digunakan
        if (!grid) {
            console.error('sirahGrid element not found');
            return;
        }
        
        // Load data lengkap jika diperlukan
        if (this.currentFilter === 'nabi' && !this.dataLoadStatus.nabiComplete) {
            await this.loadCompleteNabiData();
        } else if (this.currentFilter === 'sahabat' && !this.dataLoadStatus.sahabatComplete) {
            await this.loadCompleteSahabatData();
        }
        
        const persons = this.searchLoadedData(query, this.currentFilter);
        
        // Update results count
        if (resultsCount) {
            resultsCount.textContent = persons.length;
        }
        if (resultsInfo) {
            resultsInfo.style.display = persons.length > 0 ? 'block' : 'none';
        }
        
        if (persons.length === 0) {
            grid.style.display = 'none';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }
        
        grid.style.display = 'grid';
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        grid.innerHTML = persons.map(person => this.createPersonCard(person)).join('');
        
        // Add click listeners to cards
        grid.querySelectorAll('.sirah-card').forEach(card => {
            card.addEventListener('click', () => {
                const personId = card.dataset.personId;
                this.showPersonDetail(personId);
            });
        });
    }

    // Search dalam data yang sudah di-load
    searchLoadedData(query = '', filter = 'all') {
        let data = [];
        

        
        // Pilih data berdasarkan filter
        switch (filter) {
            case 'nabi':
                data = this.loadedData.nabi || [];
                break;
            case 'sahabat':
                data = this.loadedData.sahabat || [];
                break;
            case 'sahabat-wanita':
                data = this.loadedData.sahabiyat || [];
                break;
            default:
                data = this.getAllLoadedData();
        }
        
        // Jika ada query, lakukan pencarian
        if (query.trim()) {
            const searchTerm = query.toLowerCase();
            return data.filter(person => {
                if (!person || typeof person !== 'object') return false;
                
                const biography = person.biography || person.briefBiography || person.description || '';
                return (person.name && person.name.toLowerCase().includes(searchTerm)) ||
                       (person.arabicName && person.arabicName.toLowerCase().includes(searchTerm)) ||
                       (person.title && person.title.toLowerCase().includes(searchTerm)) ||
                       (biography && biography.toLowerCase().includes(searchTerm)) ||
                       (person.specialVirtue && person.specialVirtue.toLowerCase().includes(searchTerm));
            });
        }
        
        return data;
    }

    createPersonCard(person) {
        if (!person || typeof person !== 'object') {
            console.warn('Invalid person object:', person);
            return '';
        }
        
        const icon = this.getPersonIcon(person);
        const badges = this.getPersonBadges(person);
        // Support different biography field names
        const biography = person.biography || person.briefBiography || person.description || '';
        const preview = biography.length > 150 
            ? biography.substring(0, 150) + '...' 
            : biography;
            
        return `
            <div class="sirah-card" data-person-id="${person.id || ''}">
                <div class="sirah-card-header">
                    <div class="sirah-icon">${icon}</div>
                    <div class="sirah-info">
                        <h3 class="sirah-name">${person.name || 'Unknown'}</h3>
                        <p class="sirah-title">${person.title || ''}</p>
                        <p class="sirah-period">${person.period || ''}</p>
                    </div>
                </div>
                <div class="sirah-badges">
                    ${badges}
                </div>
                <p class="sirah-preview">${preview}</p>
            </div>
        `;
    }

    getPersonIcon(person) {
        if (!person || typeof person !== 'object') {
            return '<span class="latin-initial">?</span>';
        }
        
        // Gunakan tulisan Arab singkat nama mereka
        if (person.arabicName) {
            return `<span class="arabic-name">${person.arabicName}</span>`;
        } else {
            // Fallback jika tidak ada arabicName
            const name = person.name || 'Unknown';
            const firstLetter = name.charAt(0);
            return `<span class="latin-initial">${firstLetter}</span>`;
        }
    }

    getPersonBadges(person) {
        const badges = [];
        
        if (!person || typeof person !== 'object') {
            return '';
        }
        
        if (person.category === 'nabi') {
            badges.push('<span class="sirah-badge nabi">Nabi & Rasul</span>');
            
            // Tambahan badge untuk nabi yang disputed
            if (person.subcategory === 'disputed') {
                badges.push('<span class="sirah-badge disputed">Diperdebatkan</span>');
            }
        } else if (person.category === 'sahabat') {
            // Subcategory sahabat
            switch (person.subcategory) {
                case 'khulafa_rasyidin':
                    badges.push('<span class="sirah-badge khulafa">Khulafaur Rasyidin</span>');
                    break;
                case 'asharah_mubasysyarah':
                    badges.push('<span class="sirah-badge sahabat">Sahabat</span>');
                    break;
                case 'muhajirin':
                    badges.push('<span class="sirah-badge muhajirin">Muhajirin</span>');
                    break;
                case 'anshar_aus':
                case 'anshar_khazraj':
                    badges.push('<span class="sirah-badge anshar">Anshar</span>');
                    break;
                default:
                    badges.push('<span class="sirah-badge sahabat">Sahabat</span>');
            }
        } else if (person.category === 'sahabiyat') {
            badges.push('<span class="sirah-badge sahabiyat">Sahabiyat</span>');
            
            // Tambahan badge khusus
            if (person.subcategory === 'ummahatul_mukminin') {
                badges.push('<span class="sirah-badge ummaha">Ummahatul Mukminin</span>');
            } else if (person.subcategory === 'ahlu_bait') {
                badges.push('<span class="sirah-badge ahlul_bait">Ahlu Bait</span>');
            }
        } else {
            badges.push('<span class="sirah-badge default">Tokoh Islam</span>');
        }
        
        // Badge khusus berdasarkan virtue
        if (person.guaranteedParadise) {
            badges.push('<span class="sirah-badge paradise">Dijamin Surga</span>');
        }
        
        return badges.join('');
    }

    showPersonDetail(personId) {
        const person = this.getPersonById(personId);
        if (!person) return;
        
        this.currentPerson = person;
        this.currentTab = 'biodata';
        
        // Update modal header
        document.getElementById('modalTitle').textContent = person.name;
        document.getElementById('modalSubtitle').textContent = person.title;
        
        // Update favorite button
        this.updateFavoriteButton();
        
        // Update active tab
        this.handleDetailTab('biodata');
        
        // Show modal
        const modal = document.getElementById('detailModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    handleDetailTab(tab) {
        // Update active tab
        document.querySelectorAll('.detail-tab').forEach(t => {
            t.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        this.currentTab = tab;
        this.displayTabContent();
    }

    displayTabContent() {
        const content = document.getElementById('modalContent');
        const person = this.currentPerson;
        
        if (!person) return;
        
        switch (this.currentTab) {
            case 'biodata':
                content.innerHTML = this.generateBiodataContent(person);
                break;
            case 'biography':
                content.innerHTML = this.generateBiographyContent(person);
                break;
            case 'events':
                content.innerHTML = this.generateEventsContent(person);
                break;
            case 'lessons':
                content.innerHTML = this.generateLessonsContent(person);
                break;
            case 'hadits':
                content.innerHTML = this.generateHaditsContent(person);
                break;
        }
    }

    generateBiodataContent(person) {
        // Helper function to format array values as lists
        const formatArrayValue = (value) => {
            if (Array.isArray(value) && value.length > 1) {
                return `<ul class="biodata-list">${value.map(item => `<li>${item}</li>`).join('')}</ul>`;
            } else if (Array.isArray(value) && value.length === 1) {
                return value[0];
            } else {
                return value;
            }
        };

        const biodataItems = [
            { label: 'Nama Lengkap', value: person.name },
            { label: 'Gelar', value: person.title },
            { label: 'Kategori', value: this.getCategoryLabel(person) },
            { label: 'Periode Masehi', value: person.period },
            { label: 'Periode Hijriyah', value: person.periodHijri || '-' },
            { label: 'Tempat Lahir', value: person.birthPlace },
            { label: 'Suku/Kabilah', value: person.tribe },
            { label: 'Ayah', value: person.father },
            { label: 'Ibu', value: person.mother },
            { label: 'Istri', value: formatArrayValue(person.wife) },
            { label: 'Anak', value: formatArrayValue(person.children) },
            { label: 'Profesi', value: person.profession }
        ];

        const biodataGrid = biodataItems.map(item => `
            <div class="biodata-item">
                <div class="biodata-label">${item.label}</div>
                <div class="biodata-value">${item.value || '-'}</div>
            </div>
        `).join('');

        const qualitiesSection = person.qualities ? `
            <div class="biodata-item" style="grid-column: 1 / -1;">
                <div class="biodata-label">Sifat-sifat Utama</div>
                <div class="biodata-value multiple">
                    ${person.qualities.map(quality => `<span class="biodata-tag">${quality}</span>`).join('')}
                </div>
            </div>
        ` : '';

        return `
            <div class="biodata-grid">
                ${biodataGrid}
                ${qualitiesSection}
            </div>
        `;
    }

    generateBiographyContent(person) {
        return `
            <div class="biography-content">
                <p>${person.biography}</p>
            </div>
        `;
    }

    generateEventsContent(person) {
        if (!person.majorEvents || person.majorEvents.length === 0) {
            return '<p>Tidak ada data peristiwa penting yang tersedia.</p>';
        }

        const eventsHtml = person.majorEvents.map(event => `
            <div class="event-item">
                <div class="event-year">${event.year}</div>
                <h4 class="event-title">${event.event}</h4>
                <p class="event-description">${event.description}</p>
                ${event.references ? `<div class="event-references">
                    <strong>Referensi:</strong> ${event.references.join(', ')}
                </div>` : ''}
            </div>
        `).join('');

        return `
            <div class="events-timeline">
                ${eventsHtml}
            </div>
        `;
    }

    generateLessonsContent(person) {
        if (!person.lessons || person.lessons.length === 0) {
            return '<p>Tidak ada data pelajaran yang tersedia.</p>';
        }

        const lessonsHtml = person.lessons.map((lesson, index) => `
            <div class="lesson-item">
                <h4>Pelajaran ${index + 1}</h4>
                <p>${lesson}</p>
            </div>
        `).join('');

        return `
            <div class="lessons-grid">
                ${lessonsHtml}
            </div>
        `;
    }

    generateHaditsContent(person) {
        if (!person.haditsShahih || person.haditsShahih.length === 0) {
            return '<p>Tidak ada hadits/atsar yang tersedia.</p>';
        }

        const haditsHtml = person.haditsShahih.map(hadits => `
            <div class="hadits-item">
                <div class="hadits-arabic">${hadits.arabic}</div>
                ${hadits.latin ? `<div class="hadits-latin">${hadits.latin}</div>` : ''}
                <div class="hadits-translation">"${hadits.translation}"</div>
                <div class="hadits-source">${hadits.source}</div>
            </div>
        `).join('');

        // Add references if available
        const referencesHtml = person.references ? `
            <div class="hadits-item">
                <h4 style="color: #00ffff; margin-bottom: 15px;">
                    <i class="fas fa-book"></i> Referensi Lengkap
                </h4>
                <div style="color: rgba(255, 255, 255, 0.8); line-height: 1.6;">
                    ${person.references.map(ref => `<div style="margin-bottom: 5px;">• ${ref}</div>`).join('')}
                </div>
            </div>
        ` : '';

        return `
            <div class="hadits-list">
                ${haditsHtml}
                ${referencesHtml}
            </div>
        `;
    }

    getCategoryLabel(person) {
        if (person.category === 'nabi') {
            return 'Nabi & Rasul';
        } else if (person.subcategory === 'khulafaur-rasyidin') {
            return 'Khulafaur Rasyidin';
        } else if (person.subcategory === 'sahabat-wanita') {
            return 'Sahabat Wanita';
        } else {
            return 'Sahabat';
        }
    }

    toggleFavorite() {
        if (!this.currentPerson) return;
        
        const personId = this.currentPerson.id;
        const index = this.favorites.indexOf(personId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast('Dihapus dari favorit', 'info');
        } else {
            this.favorites.push(personId);
            this.showToast('Ditambahkan ke favorit', 'success');
        }
        
        this.saveFavorites();
        this.updateFavoriteButton();
        this.updateFavoritesCount();
    }

    updateFavoriteButton() {
        const favoriteBtn = document.getElementById('favoriteBtn');
        const isFavorite = this.favorites.includes(this.currentPerson.id);
        
        favoriteBtn.classList.toggle('active', isFavorite);
        favoriteBtn.querySelector('i').className = isFavorite ? 'fas fa-heart' : 'far fa-heart';
        favoriteBtn.title = isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit';
    }

    shareCurrentPerson() {
        if (!this.currentPerson) return;
        
        const person = this.currentPerson;
        const shareText = this.createShareText(person);
        
        if (navigator.share) {
            navigator.share({
                title: `Sirah ${person.name}`,
                text: shareText,
                url: window.location.href
            }).catch(err => {
                this.copyToClipboard(shareText);
            });
        } else {
            this.copyToClipboard(shareText);
        }
    }

    createShareText(person) {
        let text = `📿 SIRAH ${person.name.toUpperCase()}\n`;
        text += `${person.title}\n\n`;
        
        text += `📅 Periode: ${person.period}\n`;
        text += `🏛️ Tempat Lahir: ${person.birthPlace}\n`;
        text += `👥 Suku: ${person.tribe}\n\n`;
        
        text += `📖 Ringkasan:\n${person.biography}\n\n`;
        
        if (person.qualities && person.qualities.length > 0) {
            text += `✨ Sifat-sifat Utama:\n`;
            person.qualities.forEach(quality => {
                text += `• ${quality}\n`;
            });
            text += '\n';
        }
        
        if (person.haditsShahih && person.haditsShahih.length > 0) {
            const hadits = person.haditsShahih[0];
            text += `🕌 Hadits/Atsar:\n`;
            text += `"${hadits.translation}"\n`;
            text += `(${hadits.source})\n\n`;
        }
        
        text += `🌟 Dibagikan dari Aplikasi Sirah Nabi-Nabi & Sahabat\n`;
        text += `📚 Berdasarkan riwayat shahih sesuai pemahaman salaf`;
        
        return text;
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('📋 Berhasil disalin ke clipboard!', 'success');
            }).catch(err => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showToast('📋 Berhasil disalin!', 'success');
            } else {
                this.showToast('❌ Gagal menyalin', 'error');
            }
        } catch (err) {
            this.showToast('❌ Gagal menyalin', 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    displayFavorites() {
        const grid = document.getElementById('favoritesGrid');
        const emptyFavorites = document.getElementById('emptyFavorites');
        
        if (this.favorites.length === 0) {
            grid.style.display = 'none';
            emptyFavorites.style.display = 'block';
            return;
        }
        
        const favoritePersons = this.favorites
            .map(id => this.getPersonById(id))
            .filter(person => person !== undefined);
        
        grid.style.display = 'grid';
        emptyFavorites.style.display = 'none';
        
        grid.innerHTML = favoritePersons.map(person => this.createPersonCard(person)).join('');
        
        // Add click listeners
        grid.querySelectorAll('.sirah-card').forEach(card => {
            card.addEventListener('click', () => {
                const personId = card.dataset.personId;
                this.showPersonDetail(personId);
            });
        });
    }

    updateFavoritesCount() {
        // Update navigation badge if needed
        const favoritesNav = document.querySelector('[data-section="favorites"]');
        if (this.favorites.length > 0) {
            // Add visual indicator for favorites
            favoritesNav.style.position = 'relative';
        }
    }

    closeModal() {
        const modal = document.getElementById('detailModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentPerson = null;
    }

    handleKeyboard(e) {
        // Close modal with Escape key
        if (e.key === 'Escape' && this.currentPerson) {
            this.closeModal();
        }
    }

    loadFavorites() {
        try {
            const saved = localStorage.getItem('sirahFavorites');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('sirahFavorites', JSON.stringify(this.favorites));
        } catch (e) {
            console.error('Failed to save favorites:', e);
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const icon = toast.querySelector('.toast-icon');
        const messageEl = toast.querySelector('.toast-message');
        
        // Set icon based on type
        switch (type) {
            case 'success':
                icon.className = 'toast-icon fas fa-check-circle';
                break;
            case 'error':
                icon.className = 'toast-icon fas fa-times-circle';
                break;
            default:
                icon.className = 'toast-icon fas fa-info-circle';
        }
        
        toast.className = `toast ${type}`;
        messageEl.textContent = message;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SirahApp();
});

// Service Worker Registration
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
            })
            .catch(registrationError => {
            });
    });
}