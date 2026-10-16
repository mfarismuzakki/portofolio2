// ===== Tata Cara Sholat IslamHub =====
// Panduan lengkap rukun, syarat, bacaan, dan sunnah sholat
import { t } from '../../i18n/index.js';

export default class SholatApp {
    constructor(state, mainApp) {
        this.state = state;
        this.mainApp = mainApp;
        this.sholatData = [];
        this.bacaanData = [];
        this.sunnahData = [];
        this.currentTab = 'peraga'; // peraga, rukun, syarat, bacaan, sunnah, favorit
        this.searchQuery = '';
        this.currentFilter = 'all';
        this.currentItem = null; // For modal
        this.peraga3D = null;
    }

    render() {
        this.displayContent();
    }

    async init() {
        console.log('Initializing Sholat App...');
        
        // Show loading state
        this.showLoading();
        
        await this.loadData();
        this.setupEventListeners();
        this.displayContent();
        
        // Make globally accessible
        window.sholatApp = this;
    }

    async loadData() {
        try {
            // Load rukun & syarat data
            const sholatModule = await import('../../data/sholat/sholat-data.js');
            this.sholatData = window.sholatData || [];
            
            // Load bacaan data
            const bacaanModule = await import('../../data/sholat/bacaan-sholat.js');
            this.bacaanData = window.bacaanSholat || [];
            
            // Load sunnah data
            const sunnahModule = await import('../../data/sholat/sunnah-sholat.js');
            this.sunnahData = window.sunnahSholat || [];
            
            console.log('Sholat data loaded:', {
                rukun: this.sholatData.length,
                bacaan: this.bacaanData.length,
                sunnah: this.sunnahData.length
            });
        } catch (error) {
            console.error('Failed to load sholat data:', error);
            this.showError(t('sholat.errorLoadData'));
        }
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.sholat-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.sholat-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentTab = tab.dataset.tab;
                this.displayContent();
            });
        });

        // Search
        const searchInput = document.getElementById('sholatSearchInput');
        const clearSearch = document.getElementById('sholatClearSearch');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.displayContent();
                if (clearSearch) clearSearch.style.display = this.searchQuery ? 'block' : 'none';
            });
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                this.searchQuery = '';
                this.displayContent();
                clearSearch.style.display = 'none';
            });
        }

        // Filter buttons
        document.querySelectorAll('.sholat-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sholat-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.displayContent();
            });
        });
    }

    displayContent() {
        const container = document.getElementById('sholatContentGrid');
        const peragaPanel = document.getElementById('sholatPeraga');
        if (!container) return;

        const arenaPanel = document.getElementById('sholatArena');
        const sources = document.querySelector('#sholat-app .peraga-sources');
        if (arenaPanel) arenaPanel.style.display = this.currentTab === 'arena' ? 'block' : 'none';
        if (sources) sources.style.display = this.currentTab === 'peraga' ? '' : 'none';
        if (this.currentTab !== 'arena' && this.arena) this.arena.menu();

        // Toggle 3D peraga viewer visibility
        if (this.currentTab === 'peraga') {
            container.style.display = 'none';
            if (peragaPanel) peragaPanel.style.display = 'block';
            this.showPeraga3D();
            return;
        } else {
            container.style.display = '';
            if (peragaPanel) peragaPanel.style.display = 'none';
            if (this.peraga3D) this.peraga3D.onHide();
        }

        if (this.currentTab === 'arena') {
            container.style.display = 'none';
            this.showArena();
            return;
        }

        // Handle favorites tab
        if (this.currentTab === 'favorit') {
            this.displayFavorites();
            return;
        }

        let data = [];
        
        switch (this.currentTab) {
            case 'rukun':
                // Only show items with category 'rukun'
                data = this.sholatData.filter(item => item.category === 'rukun');
                break;
            case 'syarat':
                // Only show items with category 'syarat'
                data = this.sholatData.filter(item => item.category === 'syarat');
                break;
            case 'bacaan':
                data = this.bacaanData;
                break;
            case 'sunnah':
                data = this.sunnahData;
                break;
        }

        // Apply filter
        if (this.currentFilter !== 'all') {
            if (this.currentTab === 'bacaan') {
                data = data.filter(item => item.type === this.currentFilter);
            } else if (this.currentTab === 'sunnah') {
                data = data.filter(item => item.type === this.currentFilter);
            }
        }

        // Apply search
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            data = data.filter(item => 
                item.name.toLowerCase().includes(query) ||
                (item.arabic && item.arabic.includes(query)) ||
                (item.latin && item.latin.toLowerCase().includes(query)) ||
                (item.description && item.description.toLowerCase().includes(query))
            );
        }

        if (data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>${t('sholat.noResults')}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(item => this.renderCard(item)).join('');

        // Add click handlers
        container.querySelectorAll('.sholat-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = card.dataset.itemId;
                const item = data.find(d => d.id === itemId);
                if (item) this.showDetailModal(item);
            });
        });
    }

    renderCard(item) {
        const categoryLabel = this.getCategoryLabel(item);
        
        // Handle items with variations (use first variation for preview)
        let arabic = item.arabic;
        let latin = item.latin;
        let translation = item.translation;
        
        if (item.variations && item.variations.length > 0) {
            const firstVariation = item.variations[0];
            arabic = firstVariation.arabic;
            latin = firstVariation.latin;
            translation = firstVariation.translation;
        }
        
        // Truncate long arabic text for card preview
        const arabicPreview = arabic ? this.truncate(arabic, 80) : '';
        const latinPreview = latin ? this.truncate(latin, 100) : '';
        
        return `
            <div class="sholat-card" data-item-id="${item.id}">
                <h3 class="sholat-title">${item.name}</h3>
                ${arabicPreview ? `<p class="sholat-arabic">${arabicPreview}</p>` : ''}
                ${latinPreview ? `<p class="sholat-latin">${latinPreview}</p>` : ''}
                <p class="sholat-description">${this.truncate(item.description || translation || t('sholat.clickDetail'), 100)}</p>
                ${item.ruling ? `<div class="sholat-ruling">${item.ruling}</div>` : ''}
                ${item.variations ? `<div class="sholat-variations-badge"><i class="fas fa-list"></i> ${t('sholat.variationsCount', { n: item.variations.length })}</div>` : ''}
            </div>
        `;
    }

    getCategoryLabel(item) {
        if (this.currentTab === 'rukun' || this.currentTab === 'syarat') {
            return item.category === 'rukun' ? t('sholat.catRukun') : t('sholat.catSyarat');
        } else if (this.currentTab === 'bacaan') {
            return item.type === 'wajib' ? t('sholat.catWajib') : t('sholat.catSunnah');
        } else if (this.currentTab === 'sunnah') {
            if (item.type === 'qabliyah') return t('sholat.catQabliyah');
            if (item.type === 'ba\'diyah') return t('sholat.catBadiyah');
            if (item.type === 'mutlak') return t('sholat.catMutlak');
        }
        return '';
    }

    showDetailModal(item) {
        const modal = document.getElementById('sholatModal');
        if (!modal) return;

        this.currentItem = item;
        document.getElementById('sholatModalTitle').textContent = item.name;
        this.updateFavoriteButton();
        
        let content = `
            <div class="sholat-detail-content">
                ${item.position ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-map-marker-alt"></i> ${t('sholat.modal.position')}</h4>
                        <p><strong>${item.position}</strong></p>
                    </div>
                ` : ''}
                
                ${item.variations && item.variations.length > 0 ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-list"></i> ${t('sholat.modal.readingVariations')}</h4>
                        ${item.variations.map((v, idx) => `
                            <div class="sholat-variation-card" style="margin-bottom: 1.5rem;">
                                <div class="variation-header">
                                    <span class="variation-number">${t('sholat.modal.variationNum', { n: v.number || idx + 1 })}</span>
                                    ${v.frequency ? `<span class="variation-frequency">${v.frequency}</span>` : ''}
                                </div>
                                ${v.arabic ? `<p class="sholat-detail-arabic">${v.arabic}</p>` : ''}
                                ${v.latin ? `<p class="sholat-detail-latin">${v.latin}</p>` : ''}
                                ${v.translation ? `<p class="sholat-detail-translation">"${v.translation}"</p>` : ''}
                                ${v.note ? `<p class="variation-note"><i class="fas fa-info-circle"></i> ${v.note}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    ${item.arabic ? `
                        <div class="sholat-detail-section">
                            <h4><i class="fas fa-language"></i> ${t('sholat.modal.arabic')}</h4>
                            <p class="sholat-detail-arabic">${item.arabic}</p>
                        </div>
                    ` : ''}
                    
                    ${item.latin ? `
                        <div class="sholat-detail-section">
                            <h4><i class="fas fa-spell-check"></i> ${t('sholat.modal.latin')}</h4>
                            <p class="sholat-detail-latin">${item.latin}</p>
                        </div>
                    ` : ''}
                    
                    ${item.translation ? `
                        <div class="sholat-detail-section">
                            <h4><i class="fas fa-quote-right"></i> ${t('sholat.modal.meaning')}</h4>
                            <p class="sholat-detail-translation">${item.translation}</p>
                        </div>
                    ` : ''}
                `}
                
                ${item.description ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-info-circle"></i> ${t('sholat.modal.explanation')}</h4>
                        <p>${item.description}</p>
                    </div>
                ` : ''}
                
                ${item.ruling ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-gavel"></i> ${t('sholat.modal.ruling')}</h4>
                        <div class="sholat-ruling-badge">${item.ruling}</div>
                    </div>
                ` : ''}
                
                ${item.dalil && item.dalil.length > 0 ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-book"></i> ${t('sholat.modal.dalil')}</h4>
                        ${item.dalil.map(d => `
                            <div class="sholat-dalil-card">
                                <div class="dalil-source">${d.source} - ${d.reference}</div>
                                <p class="dalil-arabic">${d.arabic}</p>
                                <p class="dalil-translation">"${d.translation}"</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${item.tips ? `
                    <div class="sholat-detail-section sholat-tips">
                        <h4><i class="fas fa-lightbulb"></i> ${t('sholat.modal.tips')}</h4>
                        <p>${item.tips}</p>
                    </div>
                ` : ''}
                
                ${item.commonMistakes ? `
                    <div class="sholat-detail-section sholat-warning">
                        <h4><i class="fas fa-exclamation-triangle"></i> ${t('sholat.modal.commonMistakes')}</h4>
                        <p>${item.commonMistakes}</p>
                    </div>
                ` : ''}
                
                ${item.timing ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-clock"></i> ${t('sholat.modal.timing')}</h4>
                        <p>${item.timing}</p>
                    </div>
                ` : ''}
                
                ${item.rakaat ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-sort-numeric-up"></i> ${t('sholat.modal.rakaatCount')}</h4>
                        <p>${t('sholat.modal.rakaat', { n: item.rakaat })}</p>
                    </div>
                ` : ''}
                
                ${item.bacaan_sunnah && item.bacaan_sunnah.length > 0 ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-book-reader"></i> ${t('sholat.modal.sunnahReadings')}</h4>
                        <ul>
                            ${item.bacaan_sunnah.map(b => `<li>${b}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.getElementById('sholatModalContent').innerHTML = content;
        modal.style.display = 'block';
        document.body.classList.add('sholat-modal-active');
    }

    closeModal() {
        const modal = document.getElementById('sholatModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('sholat-modal-active');
            this.currentItem = null;
        }
    }

    // Copy content functionality
    copyContent() {
        if (!this.currentItem) return;

        let textContent = `${this.currentItem.name}\n\n`;
        
        // Handle variations or single content
        if (this.currentItem.variations && this.currentItem.variations.length > 0) {
            this.currentItem.variations.forEach((variation, index) => {
                textContent += `${t('sholat.copy.variationNum', { n: index + 1 })}\n`;
                if (variation.arabic) textContent += `${variation.arabic}\n`;
                if (variation.latin) textContent += `${variation.latin}\n`;
                if (variation.translation) textContent += `${t('sholat.copy.meaning')} ${variation.translation}\n`;
                textContent += '\n';
            });
        } else {
            if (this.currentItem.arabic) textContent += `${this.currentItem.arabic}\n`;
            if (this.currentItem.latin) textContent += `${this.currentItem.latin}\n`;
            if (this.currentItem.translation) textContent += `${t('sholat.copy.meaning')} ${this.currentItem.translation}\n`;
        }
        
        if (this.currentItem.description) {
            textContent += `\n${t('sholat.copy.desc')}\n${this.currentItem.description}\n`;
        }
        
        if (this.currentItem.dalil) {
            textContent += `\n${t('sholat.copy.dalil')}\n${this.currentItem.dalil}\n`;
        }
        
        if (this.currentItem.tips && Array.isArray(this.currentItem.tips) && this.currentItem.tips.length > 0) {
            textContent += `\n${t('sholat.copy.tips')}\n`;
            this.currentItem.tips.forEach((tip, index) => {
                textContent += `${index + 1}. ${tip}\n`;
            });
        }

        // Copy to clipboard
        navigator.clipboard.writeText(textContent).then(() => {
            this.showCopySuccess();
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showToast(t('sholat.copyFailed'));
        });
    }

    showCopySuccess() {
        // Show toast first
        this.showToast(t('sholat.copied'));
        
        const copyBtn = document.getElementById('sholatCopyBtn');
        if (copyBtn) {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        }
    }

    // Favorites functionality
    getFavorites() {
        const stored = localStorage.getItem('sholatFavorites');
        return stored ? JSON.parse(stored) : [];
    }

    saveFavorites(favorites) {
        localStorage.setItem('sholatFavorites', JSON.stringify(favorites));
    }

    isFavorite(itemId) {
        const favorites = this.getFavorites();
        return favorites.some(fav => fav.id === itemId);
    }

    toggleFavorite() {
        if (!this.currentItem) return;
        
        let favorites = this.getFavorites();
        const index = favorites.findIndex(fav => fav.id === this.currentItem.id);
        
        let message = '';
        if (index > -1) {
            // Remove from favorites
            favorites.splice(index, 1);
            message = t('sholat.removedFav');
        } else {
            // Add to favorites
            favorites.push({
                id: this.currentItem.id,
                name: this.currentItem.name,
                tab: this.currentTab,
                timestamp: Date.now()
            });
            message = t('sholat.addedFav');
        }
        
        this.saveFavorites(favorites);
        this.updateFavoriteButton();
        this.showToast(message);
        
        // Refresh if on favorites tab
        if (this.currentTab === 'favorit') {
            this.displayContent();
        }
    }

    removeFavorite(itemId, event) {
        if (event) {
            event.stopPropagation(); // Prevent card click
        }
        
        let favorites = this.getFavorites();
        favorites = favorites.filter(fav => fav.id !== itemId);
        this.saveFavorites(favorites);
        this.showToast(t('sholat.removedFav'));
        this.displayContent();
    }

    showToast(message) {
        console.log('showToast called:', message);
        // Simple toast notification (same as Dzikir)
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.zIndex = '10001'; // Ensure it's above everything
        document.body.appendChild(toast);
        console.log('Toast element created and added to body', toast);

        setTimeout(() => {
            toast.classList.add('show');
            console.log('Toast show class added');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                console.log('Toast removed');
            }, 300);
        }, 2000);
    }

    updateFavoriteButton() {
        const btn = document.getElementById('sholatFavoriteBtn');
        if (!btn || !this.currentItem) return;
        
        const isFav = this.isFavorite(this.currentItem.id);
        btn.innerHTML = isFav 
            ? '<i class="fas fa-heart"></i>'
            : '<i class="far fa-heart"></i>';
        btn.classList.toggle('active', isFav);
    }

    displayFavorites() {
        const container = document.getElementById('sholatContentGrid');
        if (!container) return;

        const favorites = this.getFavorites();
        
        if (favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="far fa-heart"></i>
                    <p>${t('sholat.emptyFav')}</p>
                    <small>${t('sholat.emptyFavHint')}</small>
                </div>
            `;
            return;
        }

        // Get all items from all data sources
        const allItems = [...this.sholatData, ...this.bacaanData, ...this.sunnahData];
        
        // Map favorites to full items
        const favoriteItems = favorites.map(fav => {
            const item = allItems.find(i => i.id === fav.id);
            return item ? { ...item, favTab: fav.tab } : null;
        }).filter(item => item !== null);

        if (favoriteItems.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="far fa-heart"></i>
                    <p>${t('sholat.emptyFav')}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = favoriteItems.map(item => this.renderFavoriteCard(item)).join('');

        // Add click handlers
        container.querySelectorAll('.sholat-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = card.dataset.itemId;
                const item = favoriteItems.find(d => d.id === itemId);
                if (item) this.showDetailModal(item);
            });
        });
    }

    renderFavoriteCard(item) {
        const categoryLabel = this.getCategoryLabel(item);
        
        // Handle items with variations
        let arabic = item.arabic;
        let latin = item.latin;
        let translation = item.translation;
        
        if (item.variations && item.variations.length > 0) {
            const firstVariation = item.variations[0];
            arabic = firstVariation.arabic;
            latin = firstVariation.latin;
            translation = firstVariation.translation;
        }
        
        const arabicPreview = arabic ? this.truncate(arabic, 80) : '';
        const latinPreview = latin ? this.truncate(latin, 100) : '';
        
        return `
            <div class="sholat-card sholat-favorite-card" data-item-id="${item.id}">
                <button class="sholat-delete-favorite" onclick="window.sholatApp.removeFavorite('${item.id}', event)" title="${t('sholat.deleteFav')}">
                    <i class="fas fa-trash"></i>
                </button>
                <h3 class="sholat-title">${item.name}</h3>
                ${arabicPreview ? `<p class="sholat-arabic">${arabicPreview}</p>` : ''}
                ${latinPreview ? `<p class="sholat-latin">${latinPreview}</p>` : ''}
                <p class="sholat-description">${this.truncate(item.description || translation || t('sholat.clickDetail'), 100)}</p>
                ${item.ruling ? `<div class="sholat-ruling">${item.ruling}</div>` : ''}
            </div>
        `;
    }

    truncate(text, length) {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    async showArena() {
        if (this.arena) return;
        const host = document.getElementById('sholatArena');
        if (!host) return;
        try {
            this.arenaLoading ||= import('./sholat-arena.js?v=1.0.0');
            const { default: createSholatArena } = await this.arenaLoading;
            this.arena ||= createSholatArena(host);
        } catch (err) {
            console.error('Gagal memuat Arena Sholat:', err);
            host.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>${t('sholat.errorArena')}</p></div>`;
        }
    }

    async showPeraga3D() {
        if (!this.peraga3D) {
            try {
                // Fast tab/search changes must share one import and one renderer.
                this.peragaLoading ||= import('./peraga-3d.js?v=4.0.1').then(module => {
                    this.peraga3D ||= new module.default();
                    return this.peraga3D;
                });
                await this.peragaLoading;
            } catch (err) {
                console.error('Gagal memuat Peraga 3D:', err);
                const panel = document.getElementById('sholatPeraga');
                if (panel) {
                    panel.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>${t('sholat.errorPeraga')}</p>
                            <small>${err.message || ''}</small>
                        </div>
                    `;
                }
                return;
            }
        }
        // Defer init until canvas is visible & sized
        requestAnimationFrame(() => {
            if (this.currentTab === 'peraga' && document.getElementById('sholatPeraga')?.offsetParent) this.peraga3D.onShow();
        });
    }

    showLoading() {
        const container = document.getElementById('sholatContentGrid');
        if (container) {
            container.innerHTML = `
                <div class="loading-placeholder">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>${t('sholat.loading')}</p>
                </div>
            `;
        }
    }

    showError(message) {
        console.error(message);
        const container = document.getElementById('sholatContentGrid');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}
