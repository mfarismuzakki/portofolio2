// ===== Dzikir & Doa Harian - Main JavaScript Application =====

class DzikirDoaApp {
    constructor() {
        this.currentSection = 'home';
        this.currentDoa = null;
        this.searchResults = [];
        this.counterState = {
            current: 0,
            target: 1
        };
        this.currentCategory = null;
        this.currentDoaList = [];
        this.currentDoaIndex = -1;
        this.favorites = this.loadFavorites();
        
        // Caching system
        this.cache = {
            categories: null,
            rendered: new Map(),
            lastUpdate: null,
            version: '1.0.0'
        };
        
        this.loadFromCache();
        this.registerServiceWorker();
        this.init();
    }

    init() {
        this.bindEvents();
        
        // Fast initialization if cache available
        if (this.cache.categories && this.isValidCache()) {
            this.loadCategoriesFromCache();
            this.hideLoadingScreen(300); // Super fast with SW + cache
        } else {
            this.loadCategories();
            this.hideLoadingScreen();
        }
        
        this.loadTimeRecommendations();
        this.checkLocationIntegration();
        this.handleShortcuts();
        this.preloadPopularContent();
        
        // Initialize progressive loading after main content
        setTimeout(() => {
            this.initProgressiveLoading();
            this.measurePerformance();
        }, 100);
    }

    // ===== Service Worker Registration =====
    async registerServiceWorker() {
        // Check if running on supported protocol (not file://)
        if (location.protocol === 'file:') {
            return;
        }
        
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Show update notification
                            this.showUpdateNotification();
                        }
                    });
                });
                
                // Listen for messages from SW
                navigator.serviceWorker.addEventListener('message', event => {
                    // Message handling
                });
                
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-download"></i>
                <span>Update tersedia! Refresh untuk versi terbaru.</span>
                <button onclick="location.reload()" class="btn-update">Update</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto hide after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    // ===== Initialization Methods =====
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link, .bottom-nav-item, .nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Mobile navigation toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        navToggle?.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        const searchResults = document.getElementById('searchResults');

        searchInput?.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                searchClear.style.display = 'block';
                this.performSearch(query);
            } else {
                searchClear.style.display = 'none';
                searchResults.style.display = 'none';
            }
        });

        searchClear?.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.style.display = 'none';
            searchResults.style.display = 'none';
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                this.filterCategories(filter);
            });
        });

        // Modal controls
        const modalOverlay = document.getElementById('modalOverlay');
        const modalBack = document.getElementById('modalBack');
        const modalClose = document.getElementById('modalClose');

        modalBack?.addEventListener('click', () => this.closeModal());
        modalClose?.addEventListener('click', () => this.closeModal());
        modalOverlay?.addEventListener('click', (e) => {
            if (e.target === modalOverlay) this.closeModal();
        });

        // Doa modal controls
        const doaModalOverlay = document.getElementById('doaModalOverlay');
        const doaBack = document.getElementById('doaBack');
        const doaShare = document.getElementById('doaShare');
        const doaCopy = document.getElementById('doaCopy');

        doaBack?.addEventListener('click', () => this.closeDoaModal());
        doaModalOverlay?.addEventListener('click', (e) => {
            if (e.target === doaModalOverlay) this.closeDoaModal();
        });

        doaCopy?.addEventListener('click', () => this.copyCurrentDoa());
        doaShare?.addEventListener('click', () => this.shareDoa());
        
        // Favorite button
        const doaFavorite = document.getElementById('doaFavorite');
        doaFavorite?.addEventListener('click', () => this.toggleFavorite());

        // Counter controls
        const counterPlus = document.getElementById('counterPlus');
        const counterMinus = document.getElementById('counterMinus');
        const counterReset = document.getElementById('counterReset');

        counterPlus?.addEventListener('click', () => this.incrementCounter());
        counterMinus?.addEventListener('click', () => this.decrementCounter());
        counterReset?.addEventListener('click', () => this.resetCounter());

        // Navigation controls
        const prevDoa = document.getElementById('prevDoa');
        const nextDoa = document.getElementById('nextDoa');
        
        prevDoa?.addEventListener('click', () => this.navigatePrevDoa());
        nextDoa?.addEventListener('click', () => this.navigateNextDoa());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDoaModal();
                this.closeModal();
            } else if (e.key === 'ArrowLeft') {
                this.navigatePrevDoa();
            } else if (e.key === 'ArrowRight') {
                this.navigateNextDoa();
            }
        });
    }

    hideLoadingScreen(delay = 1500) {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            loadingScreen?.classList.add('hidden');
            setTimeout(() => {
                loadingScreen?.remove();
            }, 500);
        }, delay);
    }

    // ===== Cache Management =====
    loadFromCache() {
        try {
            const cachedData = localStorage.getItem('dzikirDoa_cache');
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                
                // Restore cache with proper Map reconstruction
                this.cache = {
                    ...this.cache,
                    categories: parsed.categories,
                    rendered: new Map(parsed.rendered || []),
                    lastUpdate: parsed.lastUpdate,
                    version: parsed.version
                };
                
            }
        } catch (error) {
            console.error('Failed to load cache:', error);
            this.clearCache();
        }
    }

    saveToCache() {
        try {
            const cacheData = {
                categories: this.cache.categories,
                rendered: Array.from(this.cache.rendered.entries()),
                lastUpdate: Date.now(),
                version: this.cache.version
            };
            localStorage.setItem('dzikirDoa_cache', JSON.stringify(cacheData));
        } catch (error) {
            console.error('Failed to save cache:', error);
        }
    }

    isValidCache() {
        const maxAge = 10 * 60 * 1000; // 10 minutes
        const now = Date.now();
        
        if (!this.cache.lastUpdate) {
            return false;
        }
        
        const cacheAge = now - this.cache.lastUpdate;
        const isExpired = cacheAge >= maxAge;
        
        if (isExpired) {
            return false;
        }
        
        return true;
    }

    clearCache() {
        this.cache = {
            categories: null,
            rendered: new Map(),
            lastUpdate: null,
            version: '1.0.0'
        };
        localStorage.removeItem('dzikirDoa_cache');
    }

    loadCategoriesFromCache() {
        if (!this.cache.categories) return false;
        
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return false;

        // Restore rendered categories from cache
        categoriesGrid.innerHTML = '';
        this.cache.categories.forEach(categoryData => {
            const card = this.createCategoryCard(categoryData.id, categoryData.data);
            categoriesGrid.appendChild(card);
        });

        return true;
    }

    preloadPopularContent() {
        // Preload commonly accessed categories in background
        const popularCategories = ['dzikir_pagi', 'dzikir_petang', 'doa_tidur', 'sholat'];
        
        setTimeout(() => {
            popularCategories.forEach(categoryId => {
                try {
                    const category = window.doaUtils.getCategoryData(categoryId);
                    if (category) {
                        const cacheKey = `modal_${categoryId}`;
                        if (!this.cache.rendered.has(cacheKey)) {
                            const doaListHTML = this.createDoaList(category.doa, categoryId);
                            this.cache.rendered.set(cacheKey, doaListHTML);
                        }
                    }
                } catch (error) {
                    // Silent fail for preloading
                }
            });
        }, 2000); // Preload after initial load
    }

    // ===== Navigation Methods =====
    navigateToSection(sectionId) {
        // Update active section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        targetSection?.classList.add('active');

        // Update active navigation
        document.querySelectorAll('.nav-link, .bottom-nav-item, .nav-item').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelectorAll(`[data-section="${sectionId}"]`).forEach(link => {
            link.classList.add('active');
        });

        this.currentSection = sectionId;

        // Scroll to top when navigating to any section
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Load section-specific content
        switch (sectionId) {
            case 'favorites':
                this.loadFavoritesSection();
                break;
        }
    }

    // ===== Categories Methods =====
    loadCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return;

        const categories = window.doaUtils.getAllCategories();
        categoriesGrid.innerHTML = '';

        // Cache categories data
        this.cache.categories = [];
        
        categories.forEach(categoryId => {
            const category = window.doaUtils.getCategoryData(categoryId);
            
            // Store in cache
            this.cache.categories.push({
                id: categoryId,
                data: category
            });
            
            const card = this.createCategoryCard(categoryId, category);
            categoriesGrid.appendChild(card);
        });

        // Save cache after loading
        this.saveToCache();
    }

    createCategoryCard(categoryId, category) {
        const card = document.createElement('div');
        card.className = 'category-card fade-in-up';
        
        card.innerHTML = `
            <div class="category-count">${category.doa.length}</div>
            <div class="category-icon">${category.icon}</div>
            <h3 class="category-title">${category.title}</h3>
            <p class="category-description">${category.description}</p>
            <div class="category-time">
                <i class="fas fa-clock"></i>
                ${category.timeRecommendation}
            </div>
        `;

        card.addEventListener('click', () => {
            this.openCategoryModal(categoryId, category);
        });

        return card;
    }

    filterCategories(filter) {
        const categoriesSection = document.querySelector('.categories-section');
        const favoritesSection = document.getElementById('favoritesSection');
        const cards = document.querySelectorAll('.category-card');
        
        if (filter === 'favorites') {
            this.currentSection = 'favorites';
            categoriesSection.style.display = 'none';
            if (favoritesSection) {
                favoritesSection.style.display = 'block';
                this.loadFavoritesSection();
            }
        } else {
            this.currentSection = 'home';
            categoriesSection.style.display = 'block';
            if (favoritesSection) {
                favoritesSection.style.display = 'none';
        }
        
        cards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
                return;
            }

                const categoryTitle = card.querySelector('.category-title').textContent.toLowerCase();
                const shouldShow = categoryTitle.includes(filter.toLowerCase()) ||
                                 (filter === 'dzikir' && categoryTitle.includes('dzikir')) ||
                                 (filter === 'doa' && categoryTitle.includes('doa')) ||
                                 (filter === 'ayat' && categoryTitle.includes('ayat'));
                
                card.style.display = shouldShow ? 'block' : 'none';
            });
        }
    }

    // ===== Modal Methods =====
    openCategoryModal(categoryId, category) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');

        modalTitle.textContent = category.title;

        // Check if content is cached
        const cacheKey = `modal_${categoryId}`;
        if (this.cache.rendered.has(cacheKey)) {
            modalContent.innerHTML = this.cache.rendered.get(cacheKey);
        } else {
            // Generate and cache content
            const doaListHTML = this.createDoaList(category.doa, categoryId);
            modalContent.innerHTML = doaListHTML;
            this.cache.rendered.set(cacheKey, doaListHTML);
        }

        // Always add fresh event listeners - simpler and more reliable
        // Remove any existing bound attribute to ensure fresh binding
        modalContent.removeAttribute('data-events-bound');
        
        // Add event delegation for doa items using a more reliable method
        const handleDoaClick = (e) => {
            const doaItem = e.target.closest('.doa-item');
            if (doaItem && doaItem.getAttribute('data-clickable') === 'true') {
                const doaId = doaItem.getAttribute('data-doa-id');
                const doaData = category.doa.find(d => d.id === doaId);
                if (doaData) {
                    const doaWithCategory = {
                        ...doaData,
                        category: categoryId,
                        categoryTitle: category.title,
                        hadistReference: doaData.hadistReference,
                        hadistText: doaData.hadistText,
                        reference: doaData.reference,
                        benefit: doaData.benefit
                    };
                    this.openDoaModal(doaWithCategory);
                }
            }
        };
        
        // Remove existing listeners and add new one
        modalContent.removeEventListener('click', modalContent._doaClickHandler);
        modalContent._doaClickHandler = handleDoaClick;
        modalContent.addEventListener('click', handleDoaClick);
        modalContent.setAttribute('data-events-bound', 'true');

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    createDoaList(doaList, categoryId) {
        const listContainer = document.createElement('div');
        listContainer.className = 'doa-list';

        doaList.forEach((doa, index) => {
            const item = document.createElement('div');
            item.className = 'doa-item';
            item.setAttribute('data-doa-id', doa.id);
            item.setAttribute('data-clickable', 'true');
            
            // Ensure all properties are preserved when adding category
            const categoryData = doaCollection[categoryId];
            const doaWithCategory = {
                ...doa,
                category: categoryId,
                categoryTitle: categoryData ? categoryData.title : 'Kategori Dzikir',
                // Explicitly preserve important properties
                hadistReference: doa.hadistReference,
                hadistText: doa.hadistText,
                reference: doa.reference,
                benefit: doa.benefit
            };
            
            item.innerHTML = `
                <div class="doa-item-header">
                    <div class="doa-item-title">${doa.title}</div>
                    ${doa.repetition > 1 ? `<div class="doa-item-repetition">${doa.repetition}x</div>` : ''}
                </div>
                <div class="doa-item-arabic">${doa.arabic}</div>
                <div class="doa-item-translation">${doa.translation}</div>
                <div class="click-indicator">
                    <i class="fas fa-chevron-right"></i>
                </div>
            `;

            // Individual click handler as backup
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openDoaModal(doaWithCategory);
            });

            listContainer.appendChild(item);
        });

        return listContainer.outerHTML;
    }

    // ===== Doa Modal Methods =====
    openDoaModal(doa) {
        this.currentDoa = doa;
        
        // Find the current category and doa list
        this.currentCategory = doa.category || this.findCategoryByDoaId(doa.id);
        this.currentDoaList = this.getCurrentDoaList();
        this.currentDoaIndex = this.currentDoaList.findIndex(d => d.id === doa.id);
        
        const doaModalOverlay = document.getElementById('doaModalOverlay');
        const doaContent = document.getElementById('doaContent');
        const doaCounter = document.getElementById('doaCounter');
        const doaFavorite = document.getElementById('doaFavorite');

        // Update favorite button state
        const isFavorite = this.favorites.some(fav => fav.id === doa.id);
        if (doaFavorite) {
            doaFavorite.innerHTML = isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            doaFavorite.classList.toggle('active', isFavorite);
        }

        // Update category name in header
        const doaCategoryName = document.getElementById('doaCategoryName');
        if (doaCategoryName && this.currentCategory) {
            const categoryData = doaCollection[this.currentCategory];
            doaCategoryName.textContent = categoryData ? categoryData.title : 'Kategori Dzikir';
        } else if (doaCategoryName) {
            // Fallback: try to get category from doa object directly
            doaCategoryName.textContent = doa.categoryTitle || 'Kategori Dzikir';
        }

        // Create doa content with integrated dalil & referensi
        let contentHtml = `
            <h2 class="doa-detail-title">${doa.title}</h2>
            
            <div class="doa-arabic-text">${doa.arabic}</div>
            
            <div class="doa-latin-text">${doa.latin}</div>
            
            <div class="doa-translation-text">${doa.translation}</div>
        `;
        
        // Add navigation controls after translation if there are multiple doa in category
        if (this.currentDoaList.length > 1) {
            contentHtml += `
                <div class="doa-navigation-inline">
                    <button class="nav-btn-inline" id="prevDoaInline" ${this.currentDoaIndex <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                        <span>Sebelumnya</span>
                    </button>
                    <div class="nav-position-inline">
                        ${this.currentDoaIndex + 1} dari ${this.currentDoaList.length}
                    </div>
                    <button class="nav-btn-inline" id="nextDoaInline" ${this.currentDoaIndex >= this.currentDoaList.length - 1 ? 'disabled' : ''}>
                        <span>Selanjutnya</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            `;
        }

        // Add dalil & referensi section inside doa-content for proper scrolling
        if (doa.reference || doa.benefit || doa.hadistText) {
            let referenceHtml = '';
            
            // Add manfaat/benefit first if available
            if (doa.benefit) {
                referenceHtml += `<div class="reference-item benefit-item"><i class="fas fa-star"></i><strong>Manfaat:</strong> ${doa.benefit}</div>`;
            }
            
            // Use only "reference" (Sumber) to avoid duplication with hadistReference
            if (doa.reference) {
                referenceHtml += `<div class="reference-item"><i class="fas fa-book-open"></i><strong>Sumber:</strong> ${doa.reference}</div>`;
            }
            
            if (doa.hadistText) {
                referenceHtml += `<div class="hadist-text"><i class="fas fa-quote-right"></i><em>"${doa.hadistText}"</em></div>`;
            }
            
            contentHtml += `
                <div class="hadist-reference">
                    <div class="hadist-title">
                        <i class="fas fa-scroll"></i>
                        Dalil & Referensi
                    </div>
                    <div class="hadist-content">
                        ${referenceHtml}
                    </div>
                </div>
            `;
        }

        doaContent.innerHTML = contentHtml;

        // Setup inline navigation event listeners
        if (this.currentDoaList.length > 1) {
            const prevBtnInline = document.getElementById('prevDoaInline');
            const nextBtnInline = document.getElementById('nextDoaInline');
            
            if (prevBtnInline) {
                prevBtnInline.addEventListener('click', () => this.navigatePrevDoa());
            }
            
            if (nextBtnInline) {
                nextBtnInline.addEventListener('click', () => this.navigateNextDoa());
            }
        }

        // Setup counter if needed
        if (doa.repetition > 1) {
            this.setupCounter(doa.repetition);
            doaCounter.style.display = 'block';
        } else {
            doaCounter.style.display = 'none';
        }

        // Setup navigation controls
        this.setupDoaNavigation();

        // Close category modal first
        this.closeModal();
        
        // Open doa detail modal with slight delay
        setTimeout(() => {
            doaModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Scroll modal content to top when opening new doa
            const doaContent = document.getElementById('doaContent');
            if (doaContent) {
                doaContent.scrollTop = 0;
            }
            
            // Also scroll modal overlay to top if needed
            if (doaModalOverlay) {
                doaModalOverlay.scrollTop = 0;
            }
        }, 100);
    }

    // Find category by doa ID
    findCategoryByDoaId(doaId) {
        for (const [categoryKey, categoryData] of Object.entries(doaCollection)) {
            if (categoryData.doa && categoryData.doa.some(d => d.id === doaId)) {
                return categoryKey;
            }
        }
        return null;
    }

    // Get current doa list from category
    getCurrentDoaList() {
        if (!this.currentCategory || !doaCollection[this.currentCategory]) {
            return [];
        }
        return doaCollection[this.currentCategory].doa || [];
    }

    // Setup navigation controls
    setupDoaNavigation() {
        const doaNavigation = document.getElementById('doaNavigation');
        const doaPosition = document.getElementById('doaPosition');
        const prevBtn = document.getElementById('prevDoa');
        const nextBtn = document.getElementById('nextDoa');

        // Hide fixed navigation since we're using inline navigation now
        if (doaNavigation) {
            doaNavigation.style.display = 'none';
        }
    }

    // Navigate to previous doa
    navigatePrevDoa() {
        if (this.currentDoaIndex > 0) {
            const prevDoa = this.currentDoaList[this.currentDoaIndex - 1];
            this.openDoaModal({...prevDoa, category: this.currentCategory});
        }
    }

    // Navigate to next doa
    navigateNextDoa() {
        if (this.currentDoaIndex < this.currentDoaList.length - 1) {
            const nextDoa = this.currentDoaList[this.currentDoaIndex + 1];
            this.openDoaModal({...nextDoa, category: this.currentCategory});
        }
    }

    closeDoaModal() {
        const doaModalOverlay = document.getElementById('doaModalOverlay');
        const doaNavigation = document.getElementById('doaNavigation');
        doaModalOverlay.classList.remove('active');
        if (doaNavigation) {
            doaNavigation.style.display = 'none';
        }
        document.body.style.overflow = '';
        
        // Reset only the modal-specific state, but don't reset category state
        // This allows proper navigation when returning to the same category
        this.currentDoa = null;
        this.currentDoaList = [];
        this.currentDoaIndex = -1;
        
        // Don't reset currentCategory to preserve category context
        // this.currentCategory = null;
    }

    // ===== Counter Methods =====
    setupCounter(target) {
        this.counterState = {
            current: 0,
            target: target
        };
        this.updateCounterDisplay();
    }

    incrementCounter() {
        if (this.counterState.current < this.counterState.target) {
            this.counterState.current++;
            this.updateCounterDisplay();
            
            if (this.counterState.current === this.counterState.target) {
                this.showToast('🎉 Selamat! Dzikir selesai');
            }
        }
    }

    decrementCounter() {
        if (this.counterState.current > 0) {
            this.counterState.current--;
            this.updateCounterDisplay();
        }
    }

    resetCounter() {
        this.counterState.current = 0;
        this.updateCounterDisplay();
        this.showToast('Counter direset');
    }

    updateCounterDisplay() {
        const counterCurrent = document.getElementById('counterCurrent');
        const counterTarget = document.getElementById('counterTarget');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        if (counterCurrent) counterCurrent.textContent = this.counterState.current;
        if (counterTarget) counterTarget.textContent = this.counterState.target;

        const percentage = (this.counterState.current / this.counterState.target) * 100;
        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${Math.round(percentage)}% selesai`;
    }



    // ===== Favorites Methods =====
    removeFavorite(index) {
        if (index >= 0 && index < this.favorites.length) {
            const doa = this.favorites[index];
            this.favorites.splice(index, 1);
            localStorage.setItem('dzikirDoa_favorites', JSON.stringify(this.favorites));
            this.loadFavoritesSection(); // Reload favorites section
            this.showToast(`"${doa.title}" dihapus dari favorit`);
        }
    }

    // ===== Search Methods =====
    performSearch(query) {
        const results = window.doaUtils.searchDoa(query);
        const searchResults = document.getElementById('searchResults');
        
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
                <div class="search-result-item" onclick="window.app.openDoaModal(window.app.searchResults[${index}])">
                    <div class="search-result-category">${doa.categoryTitle}</div>
                    <div class="search-result-title">${doa.title}</div>
                    <div class="search-result-text">${doa.translation}</div>
                </div>
            `).join('');
            
            // Store results for onclick access
            this.searchResults = results;
        }
        
        searchResults.style.display = 'block';
    }

    // ===== Time-based Recommendations =====
    loadTimeRecommendations() {
        const currentHour = new Date().getHours();
        
        const recommendations = window.doaUtils.getTimeBasedRecommendations(currentHour);
        
        const recommendationCards = document.getElementById('recommendationCards');
        const timeRecommendationsSection = document.getElementById('timeRecommendations');
        

        if (!recommendationCards || recommendations.length === 0) {
            if (timeRecommendationsSection) {
                timeRecommendationsSection.style.display = 'none';
            }
            return;
        }

        if (timeRecommendationsSection) {
            timeRecommendationsSection.style.display = 'block';
        }
        
        recommendationCards.innerHTML = recommendations.map(categoryId => {
            const category = window.doaUtils.getCategoryData(categoryId);
            return `
                <div class="recommendation-card" onclick="window.app.openCategoryModal('${categoryId}', window.doaUtils.getCategoryData('${categoryId}'))">
                    <div class="rec-header">
                        <div class="rec-icon">${category.icon}</div>
                        <div class="rec-title">${category.title}</div>
                    </div>
                    <div class="rec-description">${category.description}</div>
                    <div class="rec-time">
                        <i class="fas fa-clock"></i>
                        ${category.timeRecommendation}
                    </div>
                </div>
            `;
        }).join('');
        
    }

    // ===== Favorites Methods =====
    toggleFavorite() {
        if (!this.currentDoa) {
            console.error('No current doa to favorite');
            return;
        }

        const doaFavorite = document.getElementById('doaFavorite');
        if (!doaFavorite) {
            console.error('Favorite button not found');
            return;
        }

        
        // Check if already in favorites
        const existingIndex = this.favorites.findIndex(fav => fav.id === this.currentDoa.id);
        
        if (existingIndex !== -1) {
            // Remove from favorites
            this.favorites.splice(existingIndex, 1);
            doaFavorite.innerHTML = '<i class="far fa-heart"></i>';
            doaFavorite.classList.remove('active');
            this.showToast('Dihapus dari favorit');
        } else {
            // Ensure we save complete doa object
            const doaToSave = {
                ...this.currentDoa,
                id: this.currentDoa.id,
                title: this.currentDoa.title,
                arabic: this.currentDoa.arabic,
                latin: this.currentDoa.latin,
                translation: this.currentDoa.translation,
                reference: this.currentDoa.reference || this.currentDoa.hadistReference || 'Dzikir & Doa',
                benefit: this.currentDoa.benefit,
                hadistReference: this.currentDoa.hadistReference,
                hadistText: this.currentDoa.hadistText
            };
            
            this.favorites.push(doaToSave);
            doaFavorite.innerHTML = '<i class="fas fa-heart"></i>';
            doaFavorite.classList.add('active');
            this.showToast('Ditambah ke favorit');
        }

        this.saveFavorites();
        
        // Refresh favorites if currently viewing favorites
        if (this.currentSection === 'favorites') {
            this.loadFavoritesSection();
        }
    }

    loadFavoritesSection() {
        
        const favoritesContent = document.getElementById('favoritesContent');
        const emptyFavorites = document.getElementById('emptyFavorites');
        const favoritesList = document.getElementById('favoritesList');


        if (!favoritesContent) {
            console.error('Favorites content element not found');
            return;
        }

        if (this.favorites.length === 0) {
            if (emptyFavorites) emptyFavorites.style.display = 'block';
            if (favoritesList) favoritesList.style.display = 'none';
            return;
        }

        if (emptyFavorites) emptyFavorites.style.display = 'none';
        
        // Create favorites list if it doesn't exist
        let favoritesListElement = favoritesList;
        if (!favoritesListElement) {
            favoritesListElement = document.createElement('div');
            favoritesListElement.id = 'favoritesList';
            favoritesListElement.className = 'favorites-list';
            favoritesContent.appendChild(favoritesListElement);
        }

        favoritesListElement.style.display = 'block';
        favoritesListElement.innerHTML = this.favorites.map((doa, index) => `
            <div class="favorite-item" onclick="window.app.openDoaModal(window.app.favorites[${index}])">
                <div class="favorite-header">
                    <div class="favorite-title">${doa.title}</div>
                    <button class="remove-favorite" onclick="event.stopPropagation(); window.app.removeFavorite(${index})" title="Hapus dari favorit">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="favorite-preview">${doa.arabic}</div>
                <div class="favorite-category">${doa.reference || 'Dzikir & Doa'}</div>
            </div>
        `).join('');
        
    }



    // ===== PWA Shortcut Handler =====
    handleShortcuts() {
        const urlParams = new URLSearchParams(window.location.search);
        const shortcut = urlParams.get('shortcut');
        const section = urlParams.get('section');

        if (section) {
            this.navigateToSection(section);
        } else if (shortcut) {
            let categoryId;
            switch (shortcut) {
                case 'pagi':
                    categoryId = 'dzikir_pagi';
                    break;
                case 'petang':
                    categoryId = 'dzikir_petang';
                    break;
                case 'istighfar':
                    categoryId = 'istighfar_taubat';
                    break;
            }
            
            if (categoryId) {
                setTimeout(() => {
                    const category = window.doaUtils.getCategoryData(categoryId);
                    if (category) {
                        this.openCategoryModal(categoryId, category);
                    }
                }, 1000);
            }
        }
    }

    // ===== Utility Methods =====

    shareDoa() {
        if (!this.currentDoa) return;

        // Create comprehensive doa text with all information
        const doaText = this.createShareableDoaText(this.currentDoa);

        if (navigator.share) {
            navigator.share({
                title: this.currentDoa.title,
                text: doaText,
                url: window.location.href
            }).catch(err => {
                // Fallback to copy if share fails
                this.copyDoaToClipboard(doaText);
            });
        } else {
            // Copy to clipboard if native sharing not available
            this.copyDoaToClipboard(doaText);
        }
    }

    createShareableDoaText(doa) {
        let text = `📿 ${doa.title}\n\n`;
        
        // Arabic text
        text += `${doa.arabic}\n\n`;
        
        // Latin transliteration if available
        if (doa.latin) {
            text += `📖 Latin: ${doa.latin}\n\n`;
        }
        
        // Translation
        text += `🌟 Artinya: ${doa.translation}\n\n`;
        
        // Benefit/Manfaat if available
        if (doa.benefit) {
            text += `✨ Manfaat: ${doa.benefit}\n\n`;
        }
        
        // Reference/Source
        if (doa.reference) {
            text += `📚 Sumber: ${doa.reference}\n`;
        }
        
        // Hadist reference if available
        if (doa.hadistReference) {
            text += `📜 Hadist: ${doa.hadistReference}\n`;
        }
        
        // Hadist text if available
        if (doa.hadistText) {
            text += `💬 "${doa.hadistText}"\n`;
        }
        
        text += `\n🤲 Dibagikan dari Aplikasi Dzikir & Doa`;
        
        return text;
    }

    copyCurrentDoa() {
        if (!this.currentDoa) return;
        
        const doaText = this.createShareableDoaText(this.currentDoa);
        this.copyDoaToClipboard(doaText);
    }

    copyDoaToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('📋 Doa berhasil disalin ke clipboard!');
            }).catch(err => {
                console.error('Failed to copy to clipboard:', err);
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }

    fallbackCopyToClipboard(text) {
        // Fallback method for older browsers
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
                this.showToast('📋 Doa berhasil disalin!');
            } else {
                this.showToast('❌ Gagal menyalin doa', 'error');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showToast('❌ Gagal menyalin doa', 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-icon');

        toastMessage.textContent = message;
        
        if (type === 'success') {
            toastIcon.className = 'toast-icon fas fa-check-circle';
        } else if (type === 'error') {
            toastIcon.className = 'toast-icon fas fa-exclamation-circle';
        }

        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    resetAllData() {
        if (confirm('Yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
            localStorage.removeItem('dzikirDoa_favorites');
            
            this.favorites = [];
            this.showToast('Data berhasil direset');
            
            if (this.currentSection === 'favorites') {
                this.loadFavoritesSection();
            }
        }
    }

    // ===== Location Integration Methods =====
    checkLocationIntegration() {
        try {
            const adzanLocation = localStorage.getItem('lastLocation');
            if (adzanLocation) {
                const locationData = JSON.parse(adzanLocation);
                this.updateLocationBasedRecommendations(locationData);
            } else {
                this.showLocationNotice();
            }
        } catch (e) {
            this.showLocationNotice();
        }
    }

    updateLocationBasedRecommendations(locationData) {
        const locationInfo = document.getElementById('locationInfo');
        if (locationInfo) {
            // Show full location name but truncate if too long
            const fullLocation = locationData.display || 'Lokasi tersimpan';
            const displayLocation = fullLocation.length > 25 ? 
                fullLocation.substring(0, 25) + '...' : 
                fullLocation;
            
            locationInfo.innerHTML = `
                <i class="fas fa-map-marker-alt"></i>
                <span onclick="window.app.openAdzanLocation()" style="cursor: pointer; text-decoration: underline;" title="${fullLocation}">${displayLocation}</span>
            `;
            locationInfo.style.display = 'flex';
        }

        // Update recommendation section title dynamically based on prayer time
        this.updateTimeBasedRecommendation(locationData.timezone);
    }

    updateTimeBasedRecommendation(timezone) {
        const now = new Date();
        const recommendations = this.getTimeBasedRecommendation(now, timezone);
        
        // Update the existing recommendation cards instead of creating new banner
        const recommendationCards = document.getElementById('recommendationCards');
        if (recommendationCards && recommendations.length > 0) {
            recommendationCards.innerHTML = `
                <div class="recommendation-card time-based-card" onclick="window.app.openCategoryModal('${recommendations[0].categoryId}', window.doaUtils.getCategoryData('${recommendations[0].categoryId}'))">
                    <div class="rec-header">
                        <div class="rec-icon">⏰</div>
                        <div class="rec-title">${recommendations[0].title}</div>
                    </div>
                    <div class="rec-description">${recommendations[0].description}</div>
                    <div class="rec-time">
                        <i class="fas fa-clock"></i>
                        Setiap saat
                    </div>
                </div>
            `;
        }
        
        // Remove any existing duplicate banner
        const existingBanner = document.getElementById('timeRecommendationBanner');
        if (existingBanner) {
            existingBanner.remove();
        }
    }

    getTimeBasedRecommendation(now, timezone) {
        const hour = now.getHours();
        const recommendations = [];

        // Morning recommendations (5 AM - 11 AM)
        if (hour >= 5 && hour < 11) {
            recommendations.push({
                categoryId: 'dzikir_pagi',
                title: 'Dzikir Pagi',
                description: 'Waktunya dzikir pagi setelah sholat Subuh'
            });
        }
        // Afternoon recommendations (3 PM - 6 PM)  
        else if (hour >= 15 && hour < 18) {
            recommendations.push({
                categoryId: 'dzikir_petang',
                title: 'Dzikir Petang',
                description: 'Waktunya dzikir petang setelah sholat Ashar'
            });
        }
        // Evening recommendations (6 PM - 10 PM)
        else if (hour >= 18 && hour < 22) {
            recommendations.push({
                categoryId: 'doa_malam',
                title: 'Doa Malam',
                description: 'Waktunya memperbanyak doa dan istighfar'
            });
        }
        // Night recommendations (10 PM - 5 AM)
        else if (hour >= 22 || hour < 5) {
            recommendations.push({
                categoryId: 'doa_tidur',
                title: 'Doa Tidur',
                description: 'Waktunya mempersiapkan diri untuk istirahat'
            });
        }
        // Default recommendations
        else {
            recommendations.push({
                categoryId: 'istighfar_taubat',
                title: 'Istighfar',
                description: 'Perbanyak istighfar sepanjang hari'
            });
        }

        return recommendations;
    }

    showLocationNotice() {
        const locationInfo = document.getElementById('locationInfo');
        if (locationInfo) {
            locationInfo.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span onclick="window.app.openAdzanLocation()" style="cursor: pointer; text-decoration: underline;">Atur Lokasi</span>
            `;
            locationInfo.style.display = 'flex';
        }
        
        // Load default recommendations when no location
        this.loadTimeRecommendations();
    }

    // Open Adzan Realtime app at prayer times section
    openAdzanLocation() {
        window.open('../adzan_realtime/#prayer-times', '_blank');
    }

    // ===== Data Persistence Methods =====
    loadFavorites() {
        try {
            const stored = localStorage.getItem('dzikirDoa_favorites');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading favorites:', e);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('dzikirDoa_favorites', JSON.stringify(this.favorites));
        } catch (e) {
            console.error('Error saving favorites:', e);
        }
    }

    // ===== Progressive Loading Methods =====
    initProgressiveLoading() {
        // Lazy load images
        this.initLazyLoading();
        
        // Progressive load heavy content
        this.initProgressiveContentLoad();
        
        // Prefetch next content based on user behavior
        this.initPredictiveLoading();
    }

    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });

            // Store observer for future use
            this.imageObserver = imageObserver;
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
            });
        }
    }

    initProgressiveContentLoad() {
        // Load content in chunks to prevent blocking
        const contentSections = document.querySelectorAll('.progressive-content');
        
        contentSections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('loaded');
                
                // Trigger any animations
                const animElements = section.querySelectorAll('[data-animation]');
                animElements.forEach(el => {
                    el.classList.add(el.dataset.animation);
                });
                
            }, index * 100); // Stagger loading by 100ms
        });
    }

    initPredictiveLoading() {
        // Track user interaction patterns
        let hoveredCategories = new Set();
        
        document.addEventListener('mouseover', (e) => {
            const categoryCard = e.target.closest('[data-category]');
            if (categoryCard && !hoveredCategories.has(categoryCard.dataset.category)) {
                hoveredCategories.add(categoryCard.dataset.category);
                
                // Prefetch category data after 500ms hover
                setTimeout(() => {
                    if (categoryCard.matches(':hover')) {
                        this.prefetchCategoryData(categoryCard.dataset.category);
                    }
                }, 500);
            }
        });

        // Prefetch based on scroll position
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScrollPrefetch();
            }, 150);
        });
    }

    async prefetchCategoryData(categoryId) {
        try {
            // Check if already in cache
            if (this.cache.rendered.has(categoryId)) {
                return;
            }

            
            // Generate and cache the modal content
            const categoryData = window.doaUtils.getCategoryData(categoryId);
            if (categoryData && categoryData.doas) {
                const modalContent = this.generateCategoryModalContent(categoryData);
                this.cache.rendered.set(categoryId, {
                    html: modalContent,
                    timestamp: Date.now()
                });
                
                // Save to localStorage
                this.saveToCache();
            }
        } catch (error) {
            console.warn('Prefetch failed for category:', categoryId, error);
        }
    }

    handleScrollPrefetch() {
        // Prefetch content that's about to come into view
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPercent = scrollPosition / documentHeight;

        // If user scrolled past 70%, prefetch popular categories
        if (scrollPercent > 0.7) {
            const popularCategories = ['dzikir_pagi', 'dzikir_petang', 'doa_tidur'];
            popularCategories.forEach(categoryId => {
                this.prefetchCategoryData(categoryId);
            });
        }
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    // Performance data ready
                }, 100);
            });
        }
    }
}

// ===== Utility Functions =====
// Check if doaUtils already exists to prevent redeclaration error
if (typeof window.doaUtils === 'undefined') {
    window.doaUtils = {
        getAllCategories() {
            return Object.keys(doaCollection);
        },
        
        getCategoryData(categoryId) {
            return doaCollection[categoryId];
        },
        
        searchDoa(query) {
            const results = [];
            const searchTerm = query.toLowerCase();
            
            Object.keys(doaCollection).forEach(categoryId => {
                const category = doaCollection[categoryId];
                category.doa.forEach(doa => {
                    if (
                        doa.title.toLowerCase().includes(searchTerm) ||
                        doa.arabic.toLowerCase().includes(searchTerm) ||
                        doa.latin.toLowerCase().includes(searchTerm) ||
                        doa.translation.toLowerCase().includes(searchTerm)
                    ) {
                        results.push({
                            ...doa,
                            category: categoryId,
                            categoryTitle: category.title
                        });
                    }
                });
            });
            
            return results;
        },
        
        getTimeBasedRecommendations(hour) {
            const recommendations = [];
            
            if (hour >= 5 && hour < 11) {
                // Pagi hari (05:00 - 10:59)
                recommendations.push('dzikir_pagi');
            } else if (hour >= 11 && hour < 15) {
                // Siang hari (11:00 - 14:59) - Doa sebelum makan, doa saat hujan
                recommendations.push('doa_makan');
                if (Math.random() > 0.5) recommendations.push('doa_hujan');
            } else if (hour >= 15 && hour < 18) {
                // Sore hari (15:00 - 17:59)
                recommendations.push('dzikir_petang');
            } else if (hour >= 18 && hour < 20) {
                // Maghrib-Isya (18:00 - 19:59)
                recommendations.push('doa_makan');
                recommendations.push('doa_sore');
            } else if (hour >= 20 || hour < 5) {
                // Malam hari (20:00 - 04:59)
                recommendations.push('doa_tidur');
            }
            
            return recommendations;
        }
    };
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DzikirDoaApp();
    
    // Make globally accessible for onclick handlers
    window.app = app;
    // doaUtils is already defined as window.doaUtils above
});

// Fallback for immediate access
window.app = app;