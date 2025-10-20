// ===== Tata Cara Sholat IslamHub =====
// Panduan lengkap rukun, syarat, bacaan, dan sunnah sholat

export default class SholatApp {
    constructor(state, mainApp) {
        this.state = state;
        this.mainApp = mainApp;
        this.sholatData = [];
        this.bacaanData = [];
        this.sunnahData = [];
        this.currentTab = 'rukun'; // rukun, bacaan, sunnah
        this.searchQuery = '';
        this.currentFilter = 'all';
        this.currentItem = null; // For modal
    }

    async init() {
        console.log('Initializing Sholat App...');
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
            this.showError('Gagal memuat data sholat');
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
        if (!container) return;

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
                    <p>Tidak ada hasil ditemukan</p>
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
                <p class="sholat-description">${this.truncate(item.description || translation || 'Klik untuk melihat detail lengkap', 100)}</p>
                ${item.ruling ? `<div class="sholat-ruling">${item.ruling}</div>` : ''}
                ${item.variations ? `<div class="sholat-variations-badge"><i class="fas fa-list"></i> ${item.variations.length} Variasi</div>` : ''}
            </div>
        `;
    }

    getCategoryLabel(item) {
        if (this.currentTab === 'rukun' || this.currentTab === 'syarat') {
            return item.category === 'rukun' ? 'Rukun' : 'Syarat';
        } else if (this.currentTab === 'bacaan') {
            return item.type === 'wajib' ? 'Wajib' : 'Sunnah';
        } else if (this.currentTab === 'sunnah') {
            if (item.type === 'qabliyah') return 'Qabliyah';
            if (item.type === 'ba\'diyah') return 'Ba\'diyah';
            if (item.type === 'mutlak') return 'Mutlak';
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
                        <h4><i class="fas fa-map-marker-alt"></i> Posisi</h4>
                        <p><strong>${item.position}</strong></p>
                    </div>
                ` : ''}
                
                ${item.variations && item.variations.length > 0 ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-list"></i> Variasi Bacaan</h4>
                        ${item.variations.map((v, idx) => `
                            <div class="sholat-variation-card" style="margin-bottom: 1.5rem;">
                                <div class="variation-header">
                                    <span class="variation-number">Variasi ${v.number || idx + 1}</span>
                                    ${v.frequency ? `<span class="variation-frequency">${v.frequency}</span>` : ''}
                                </div>
                                ${v.arabic ? `<p class="sholat-detail-arabic">${v.arabic}</p>` : ''}
                                ${v.latin ? `<p class="sholat-detail-latin">${v.latin}</p>` : ''}
                                ${v.translation ? `<p class="sholat-detail-translation">"${v.translation}"</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    ${item.arabic ? `
                        <div class="sholat-detail-section">
                            <h4><i class="fas fa-language"></i> Bahasa Arab</h4>
                            <p class="sholat-detail-arabic">${item.arabic}</p>
                        </div>
                    ` : ''}
                    
                    ${item.latin ? `
                        <div class="sholat-detail-section">
                            <h4><i class="fas fa-spell-check"></i> Latin</h4>
                            <p class="sholat-detail-latin">${item.latin}</p>
                        </div>
                    ` : ''}
                    
                    ${item.translation ? `
                        <div class="sholat-detail-section">
                            <h4><i class="fas fa-quote-right"></i> Arti</h4>
                            <p class="sholat-detail-translation">${item.translation}</p>
                        </div>
                    ` : ''}
                `}
                
                ${item.description ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-info-circle"></i> Penjelasan</h4>
                        <p>${item.description}</p>
                    </div>
                ` : ''}
                
                ${item.ruling ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-gavel"></i> Hukum</h4>
                        <div class="sholat-ruling-badge">${item.ruling}</div>
                    </div>
                ` : ''}
                
                ${item.dalil && item.dalil.length > 0 ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-book"></i> Dalil</h4>
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
                        <h4><i class="fas fa-lightbulb"></i> Tips</h4>
                        <p>${item.tips}</p>
                    </div>
                ` : ''}
                
                ${item.commonMistakes ? `
                    <div class="sholat-detail-section sholat-warning">
                        <h4><i class="fas fa-exclamation-triangle"></i> Kesalahan Umum</h4>
                        <p>${item.commonMistakes}</p>
                    </div>
                ` : ''}
                
                ${item.timing ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-clock"></i> Waktu</h4>
                        <p>${item.timing}</p>
                    </div>
                ` : ''}
                
                ${item.rakaat ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-sort-numeric-up"></i> Jumlah Rakaat</h4>
                        <p>${item.rakaat} Rakaat</p>
                    </div>
                ` : ''}
                
                ${item.bacaan_sunnah && item.bacaan_sunnah.length > 0 ? `
                    <div class="sholat-detail-section">
                        <h4><i class="fas fa-book-reader"></i> Bacaan yang Disunnahkan</h4>
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
                textContent += `Variasi ${index + 1}:\n`;
                if (variation.arabic) textContent += `${variation.arabic}\n`;
                if (variation.latin) textContent += `${variation.latin}\n`;
                if (variation.translation) textContent += `Artinya: ${variation.translation}\n`;
                textContent += '\n';
            });
        } else {
            if (this.currentItem.arabic) textContent += `${this.currentItem.arabic}\n`;
            if (this.currentItem.latin) textContent += `${this.currentItem.latin}\n`;
            if (this.currentItem.translation) textContent += `Artinya: ${this.currentItem.translation}\n`;
        }
        
        if (this.currentItem.description) {
            textContent += `\nKeterangan:\n${this.currentItem.description}\n`;
        }
        
        if (this.currentItem.dalil) {
            textContent += `\nDalil:\n${this.currentItem.dalil}\n`;
        }
        
        if (this.currentItem.tips && this.currentItem.tips.length > 0) {
            textContent += `\nTips:\n`;
            this.currentItem.tips.forEach((tip, index) => {
                textContent += `${index + 1}. ${tip}\n`;
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
        this.showToast('Teks berhasil disalin!');
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
            message = 'Dihapus dari favorit';
        } else {
            // Add to favorites
            favorites.push({
                id: this.currentItem.id,
                name: this.currentItem.name,
                tab: this.currentTab,
                timestamp: Date.now()
            });
            message = 'Ditambahkan ke favorit';
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
        this.showToast('Dihapus dari favorit');
        this.displayContent();
    }

    showToast(message) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.sholat-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast
        const toast = document.createElement('div');
        toast.className = 'sholat-toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
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
                    <p>Belum ada favorit</p>
                    <small>Klik ikon hati untuk menambahkan ke favorit</small>
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
                    <p>Belum ada favorit</p>
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
                <button class="sholat-delete-favorite" onclick="window.sholatApp.removeFavorite('${item.id}', event)" title="Hapus dari favorit">
                    <i class="fas fa-trash"></i>
                </button>
                <h3 class="sholat-title">${item.name}</h3>
                ${arabicPreview ? `<p class="sholat-arabic">${arabicPreview}</p>` : ''}
                ${latinPreview ? `<p class="sholat-latin">${latinPreview}</p>` : ''}
                <p class="sholat-description">${this.truncate(item.description || translation || 'Klik untuk melihat detail lengkap', 100)}</p>
                ${item.ruling ? `<div class="sholat-ruling">${item.ruling}</div>` : ''}
            </div>
        `;
    }

    truncate(text, length) {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
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
