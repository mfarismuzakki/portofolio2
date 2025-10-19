// Aplikasi Tata Cara Sholat - Main JavaScript
// Berdasarkan Al-Quran dan Hadits Shahih

class TataCaraSholatApp {
    constructor() {
        this.currentCategory = 'semua';
        this.favoriteItems = this.loadFavorites();
        this.searchQuery = '';
        this.currentModal = null;
        this.cache = {
            data: null,
            timestamp: null,
            duration: 10 * 60 * 1000 // 10 menit
        };
        
        this.init();
    }

    init() {
        // Tampilkan loading screen terlebih dahulu
        const loadingSection = document.getElementById('loadingSection');
        if (loadingSection) {
            loadingSection.style.display = 'flex';
        }
        
        // Tunggu sebentar untuk memastikan semua script data sudah dijalankan
        setTimeout(() => {
            console.log('Initializing app...');
            this.loadData();
            this.setupEventListeners();
            this.setupServiceWorker();
            this.renderItems();
            this.updateStats();
            
            // Sembunyikan loading screen setelah semua selesai dengan smooth transition
            if (loadingSection) {
                setTimeout(() => {
                    loadingSection.classList.add('hidden');
                    setTimeout(() => {
                        loadingSection.style.display = 'none';
                    }, 500);
                }, 300);
            }
        }, 300);
    }

    // Load data dari berbagai sumber
    loadData() {
        try {
            // Cek cache dulu
            if (this.isDataCached()) {
                this.allData = this.cache.data;
                console.log('Data loaded from cache');
                return;
            }

            // Load data dari file JavaScript dengan null checking
            const sholatData = Array.isArray(window.sholatData) ? window.sholatData : [];
            const bacaanSholat = Array.isArray(window.bacaanSholat) ? window.bacaanSholat : [];
            const sunnahSholat = Array.isArray(window.sunnahSholat) ? window.sunnahSholat : [];
            
            this.allData = [...sholatData, ...bacaanSholat, ...sunnahSholat];

            // Update cache
            this.cache.data = this.allData;
            this.cache.timestamp = Date.now();
            
            console.log(`Loaded ${this.allData.length} items (sholat: ${sholatData.length}, bacaan: ${bacaanSholat.length}, sunnah: ${sunnahSholat.length})`);
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('Error memuat data', 'error');
        }
    }

    // Cek apakah data masih dalam cache
    isDataCached() {
        if (!this.cache.data || !this.cache.timestamp) return false;
        return Date.now() - this.cache.timestamp < this.cache.duration;
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.renderItems();
            });
        }

        // Category filters
        document.querySelectorAll('.filter-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentCategory = e.target.dataset.category;
                this.updateActiveFilter(e.target);
                this.renderItems();
            });
        });

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('close-modal')) {
                this.closeModal();
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = item.dataset.page;
                this.handleNavigation(action);
            });
        });



        // Modal tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-tab') || e.target.closest('.modal-tab')) {
                const tabButton = e.target.classList.contains('modal-tab') ? e.target : e.target.closest('.modal-tab');
                const tabName = tabButton.dataset.tab;
                this.switchModalTab(tabName);
            }
        });
    }

    // Setup Service Worker
    setupServiceWorker() {
        if ('serviceWorker' in navigator && location.protocol !== 'file:') {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
    }

    // Filter data berdasarkan kategori dan pencarian
    getFilteredData() {
        let filtered = Array.isArray(this.allData) ? this.allData : [];

        // Filter berdasarkan kategori
        if (this.currentCategory !== 'all' && this.currentCategory !== 'semua') {
            if (this.currentCategory === 'favorites') {
                filtered = filtered.filter(item => item && this.favoriteItems.includes(item.id));
            } else {
                filtered = filtered.filter(item => item && item.category === this.currentCategory);
            }
        }

        // Filter berdasarkan pencarian
        if (this.searchQuery) {
            filtered = filtered.filter(item => {
                if (!item) return false;
                return (
                    (item.name && item.name.toLowerCase().includes(this.searchQuery)) ||
                    (item.description && item.description.toLowerCase().includes(this.searchQuery)) ||
                    (item.latin && item.latin.toLowerCase().includes(this.searchQuery)) ||
                    (item.translation && item.translation.toLowerCase().includes(this.searchQuery))
                );
            });
        }

        return filtered;
    }

    // Render items ke dalam grid
    renderItems() {
        const container = document.getElementById('contentGrid');
        if (!container) {
            console.error('Container contentGrid not found');
            return;
        }

        const filteredData = this.getFilteredData();
        console.log(`Rendering ${filteredData.length} items`);

        if (filteredData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>Tidak ada hasil</h3>
                    <p>Total data: ${this.allData ? this.allData.length : 0} item. Coba ubah filter atau kata kunci.</p>
                </div>
            `;
            return;
        }

        try {
            const cards = filteredData.map(item => this.createItemCard(item)).filter(card => card !== '');
            container.innerHTML = cards.join('');
            console.log(`Successfully rendered ${cards.length} cards`);
        } catch (error) {
            console.error('Error rendering cards:', error);
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚠️</div>
                    <h3>Error Rendering</h3>
                    <p>Terjadi kesalahan saat memuat data. Silakan refresh halaman.</p>
                </div>
            `;
        }
    }

    // Buat card untuk setiap item
    createItemCard(item) {
        if (!item || !item.id) return '';
        
        const isFavorite = this.favoriteItems.includes(item.id);
        const icon = item.icon || this.getDefaultIcon(item.category || 'default');
        
        return `
            <div class="content-item" onclick="app.showDetail('${item.id}')">
                <div class="content-body">
                    <h3 class="content-title">${item.name || 'Tanpa Judul'}</h3>
                    <div class="content-arabic">${item.arabic || ''}</div>
                    <div class="content-latin">${item.latin || ''}</div>
                    <div class="content-description">${this.truncateText(item.description || 'Tidak ada deskripsi', 100)}</div>
                    <div class="content-badges">
                        <span class="badge badge-${item.category || 'default'}">${this.getCategoryLabel(item.category)}</span>
                        ${item.ruling ? `<span class="badge badge-ruling">${item.ruling}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Tampilkan detail item dalam modal
    showDetail(itemId) {
        const item = this.allData.find(i => i.id === itemId);
        if (!item) return;

        const modal = document.getElementById('detailModal');
        const modalTitle = document.getElementById('modalTitle');
        const penjelasanTab = document.getElementById('penjelasanTab');
        const bacaanTab = document.getElementById('bacaanTab');
        const dalilTab = document.getElementById('dalilTab');
        const tipsTab = document.getElementById('tipsTab');
        
        if (!modal || !modalTitle) {
            console.error('Modal elements not found');
            return;
        }
        
        // Set title
        modalTitle.textContent = item.name || 'Detail Sholat';
        
        // Reset tab to default (Penjelasan) when opening new detail
        this.switchModalTab('penjelasan');
        
        // Populate content tabs
        if (penjelasanTab) {
            penjelasanTab.innerHTML = this.createPenjelasanContent(item);
        }
        if (bacaanTab) {
            bacaanTab.innerHTML = this.createBacaanContent(item);
        }
        if (dalilTab) {
            dalilTab.innerHTML = this.createDalilContent(item);
        }
        if (tipsTab) {
            tipsTab.innerHTML = this.createTipsContent(item);
        }
        
        // Update favorite button state
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn) {
            const isFavorite = this.favoriteItems.includes(item.id);
            favoriteBtn.classList.toggle('active', isFavorite);
            favoriteBtn.dataset.id = item.id;
        }
        
        modal.classList.add('active');
        this.currentModal = modal;
        
        // Disable scroll pada body
        document.body.style.overflow = 'hidden';
    }

    // Create content for Penjelasan tab
    createPenjelasanContent(item) {
        return `
            <div class="detail-section">
                <div class="arabic-text">${item.arabic || ''}</div>
                <div class="latin-text">${item.latin || ''}</div>
                <div class="translation-text">${item.translation || ''}</div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Penjelasan</h4>
                <p>${item.description || 'Tidak ada penjelasan tersedia'}</p>
            </div>
            
            ${item.ruling ? `
                <div class="detail-section">
                    <h4><i class="fas fa-gavel"></i> Hukum</h4>
                    <span class="ruling-badge">${item.ruling}</span>
                </div>
            ` : ''}
            
            ${item.position ? `
                <div class="detail-section">
                    <h4><i class="fas fa-map-marker-alt"></i> Posisi/Waktu</h4>
                    <p>${item.position}</p>
                </div>
            ` : ''}
            
            ${item.timing ? `
                <div class="detail-section">
                    <h4><i class="fas fa-clock"></i> Waktu</h4>
                    <p>${item.timing}</p>
                </div>
            ` : ''}
            
            ${item.rakaat ? `
                <div class="detail-section">
                    <h4><i class="fas fa-pray"></i> Jumlah Rakaat</h4>
                    <p>${item.rakaat}</p>
                </div>
            ` : ''}
        `;
    }

    // Create content for Bacaan tab
    createBacaanContent(item) {
        let content = '';
        
        // Jika ada variations (format baru untuk doa yang bervariasi)
        if (item.variations && item.variations.length > 0) {
            content += `
                <div class="detail-section">
                    <h4><i class="fas fa-book-open"></i> Variasi Bacaan</h4>
                    <div class="variations-container">
                        ${item.variations.map(variation => `
                            <div class="variation-item">
                                <div class="variation-header">
                                    <span class="variation-number">${variation.number}</span>
                                    ${variation.note ? `<span class="variation-note">${variation.note}</span>` : ''}
                                    ${variation.frequency ? `<span class="variation-frequency">${variation.frequency}</span>` : ''}
                                </div>
                                <div class="arabic-text large">${variation.arabic}</div>
                                <div class="latin-text large">${variation.latin}</div>
                                <div class="translation-text">${variation.translation}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            // Format lama untuk data yang tidak memiliki variations
            if (item.arabic) {
                content += `
                    <div class="detail-section">
                        <h4><i class="fas fa-book-open"></i> Bacaan Arab</h4>
                        <div class="arabic-text large">${item.arabic}</div>
                    </div>
                `;
            }
            
            if (item.latin) {
                content += `
                    <div class="detail-section">
                        <h4><i class="fas fa-language"></i> Bacaan Latin</h4>
                        <div class="latin-text large">${item.latin}</div>
                    </div>
                `;
            }
            
            if (item.translation) {
                content += `
                    <div class="detail-section">
                        <h4><i class="fas fa-globe"></i> Terjemahan</h4>
                        <div class="translation-text">${item.translation}</div>
                    </div>
                `;
            }
        }
        
        if (item.bacaan_sunnah && item.bacaan_sunnah.length > 0) {
            content += `
                <div class="detail-section">
                    <h4><i class="fas fa-star"></i> Bacaan yang Dianjurkan</h4>
                    <ul class="bacaan-list">
                        ${item.bacaan_sunnah.map(bacaan => `<li>${bacaan}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        return content || '<p>Tidak ada informasi bacaan tersedia.</p>';
    }

    // Create content for Dalil tab
    createDalilContent(item) {
        if (!item.dalil || item.dalil.length === 0) {
            return '<p>Tidak ada dalil tersedia untuk item ini.</p>';
        }
        
        return `
            <div class="detail-section">
                <h4><i class="fas fa-book"></i> Dalil</h4>
                ${item.dalil.map(dalil => `
                    <div class="dalil-item">
                        <div class="dalil-source">${dalil.source} - ${dalil.reference}</div>
                        <div class="dalil-arabic">${dalil.arabic}</div>
                        <div class="dalil-translation">"${dalil.translation}"</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Create content for Tips tab
    createTipsContent(item) {
        let content = '';
        
        if (item.tips) {
            content += `
                <div class="detail-section">
                    <h4><i class="fas fa-lightbulb"></i> Tips</h4>
                    <p>${item.tips}</p>
                </div>
            `;
        }
        
        if (item.commonMistakes) {
            content += `
                <div class="detail-section">
                    <h4><i class="fas fa-exclamation-triangle"></i> Kesalahan Umum</h4>
                    <p>${item.commonMistakes}</p>
                </div>
            `;
        }
        
        return content || '<p>Tidak ada tips atau informasi kesalahan umum tersedia.</p>';
    }

    // Buat konten detail untuk modal (deprecated - keeping for compatibility)
    createDetailContent(item) {
        const isFavorite = this.favoriteItems.includes(item.id);
        
        let content = `
            <div class="modal-header">
                <div class="modal-title-section">
                    <span class="modal-icon">${item.icon || this.getDefaultIcon(item.category)}</span>
                    <h2>${item.name}</h2>
                </div>
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                        data-id="${item.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>

            <div class="modal-body">
                <div class="detail-section">
                    <div class="arabic-text">${item.arabic}</div>
                    <div class="latin-text">${item.latin}</div>
                    <div class="translation-text">${item.translation}</div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> Penjelasan</h4>
                    <p>${item.description}</p>
                </div>

                ${item.ruling ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-gavel"></i> Hukum</h4>
                        <span class="ruling-badge">${item.ruling}</span>
                    </div>
                ` : ''}

                ${item.position ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-map-marker-alt"></i> Posisi/Waktu</h4>
                        <p>${item.position}</p>
                    </div>
                ` : ''}

                ${item.timing ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-clock"></i> Waktu</h4>
                        <p>${item.timing}</p>
                    </div>
                ` : ''}

                ${item.rakaat ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-pray"></i> Jumlah Rakaat</h4>
                        <p>${item.rakaat}</p>
                    </div>
                ` : ''}
        `;

        // Dalil section
        if (item.dalil && item.dalil.length > 0) {
            content += `
                <div class="detail-section">
                    <h4><i class="fas fa-book"></i> Dalil</h4>
                    ${item.dalil.map(dalil => `
                        <div class="dalil-item">
                            <div class="dalil-source">${dalil.source} - ${dalil.reference}</div>
                            <div class="dalil-arabic">${dalil.arabic}</div>
                            <div class="dalil-translation">"${dalil.translation}"</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Tips section
        if (item.tips) {
            content += `
                <div class="detail-section">
                    <h4><i class="fas fa-lightbulb"></i> Tips</h4>
                    <p>${item.tips}</p>
                </div>
            `;
        }

        // Common mistakes section
        if (item.commonMistakes) {
            content += `
                <div class="detail-section">
                    <h4><i class="fas fa-exclamation-triangle"></i> Kesalahan Umum</h4>
                    <p>${item.commonMistakes}</p>
                </div>
            `;
        }

        // Bacaan sunnah untuk sholat sunnah
        if (item.bacaan_sunnah && item.bacaan_sunnah.length > 0) {
            content += `
                <div class="detail-section">
                    <h4><i class="fas fa-book-open"></i> Bacaan yang Dianjurkan</h4>
                    <ul class="bacaan-list">
                        ${item.bacaan_sunnah.map(bacaan => `<li>${bacaan}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        content += `</div>`;
        
        return content;
    }

    // Switch modal tab
    switchModalTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.modal-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const targetTab = document.getElementById(`${tabName}Tab`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    // Tutup modal
    closeModal() {
        if (this.currentModal) {
            this.currentModal.classList.remove('active');
            this.currentModal = null;
            document.body.style.overflow = '';
        }
    }

    // Toggle favorite item
    toggleFavorite(itemId) {
        // Jika dipanggil tanpa parameter, ambil dari modal button
        if (!itemId) {
            const modalFavBtn = document.getElementById('favoriteBtn');
            if (modalFavBtn && modalFavBtn.dataset.id) {
                itemId = modalFavBtn.dataset.id;
            } else {
                return;
            }
        }
        
        const index = this.favoriteItems.indexOf(itemId);
        
        if (index > -1) {
            this.favoriteItems.splice(index, 1);
            this.showNotification('Dihapus dari favorit', 'info');
        } else {
            this.favoriteItems.push(itemId);
            this.showNotification('Ditambah ke favorit', 'success');
        }
        
        this.saveFavorites();
        this.renderItems();
        this.updateStats();
        
        // Update favorite button jika ada dalam modal
        const modalFavBtn = document.getElementById('favoriteBtn');
        if (modalFavBtn && modalFavBtn.dataset.id === itemId) {
            const isFavorite = this.favoriteItems.includes(itemId);
            modalFavBtn.classList.toggle('active', isFavorite);
        }
    }

    // Share content
    shareContent() {
        const modalFavBtn = document.getElementById('favoriteBtn');
        if (!modalFavBtn || !modalFavBtn.dataset.id) return;
        
        const itemId = modalFavBtn.dataset.id;
        const item = this.allData.find(i => i.id === itemId);
        if (!item) return;
        
        const shareData = {
            title: `Tata Cara Sholat - ${item.name}`,
            text: `${item.description || item.name}\n\nDari aplikasi Tata Cara Sholat - Panduan berdasarkan Al-Qur'an & Hadits Shahih`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData).catch(err => {
                console.log('Error sharing:', err);
                this.fallbackShare(shareData);
            });
        } else {
            this.fallbackShare(shareData);
        }
    }
    
    // Copy content to clipboard
    copyContent() {
        const modalFavBtn = document.getElementById('favoriteBtn');
        if (!modalFavBtn || !modalFavBtn.dataset.id) return;
        
        const itemId = modalFavBtn.dataset.id;
        const item = this.allData.find(i => i.id === itemId);
        if (!item) return;
        
        const copyText = this.createCopyText(item);
        this.copyToClipboard(copyText);
    }

    // Create formatted text for copying
    createCopyText(item) {
        let text = `🕌 ${item.name}\n\n`;
        
        if (item.description) {
            text += `📝 ${item.description}\n\n`;
        }
        
        if (item.arabic) {
            text += `${item.arabic}\n\n`;
        }
        
        if (item.latin) {
            text += `📖 Latin: ${item.latin}\n\n`;
        }
        
        if (item.translation) {
            text += `🌟 Artinya: ${item.translation}\n\n`;
        }
        
        if (item.steps && Array.isArray(item.steps)) {
            text += `📋 Langkah-langkah:\n`;
            item.steps.forEach((step, index) => {
                text += `${index + 1}. ${step}\n`;
            });
            text += '\n';
        }
        
        if (item.dalil && Array.isArray(item.dalil)) {
            text += `📚 Dalil:\n`;
            item.dalil.forEach(dalil => {
                if (dalil.source === 'Hadits' && dalil.reference) {
                    text += `📜 ${dalil.reference}\n`;
                    if (dalil.arabic) text += `"${dalil.arabic}"\n`;
                    if (dalil.translation) text += `Artinya: "${dalil.translation}"\n\n`;
                } else if (dalil.source === 'Al-Quran' && dalil.reference) {
                    text += `📖 ${dalil.reference}\n\n`;
                }
            });
        }
        
        if (item.tips) {
            text += `💡 Tips: ${item.tips}\n\n`;
        }
        
        text += `🤲 Dibagikan dari Aplikasi Tata Cara Sholat`;
        
        return text;
    }

    // Copy to clipboard with fallback
    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('📋 Konten berhasil disalin ke clipboard!');
            }).catch(err => {
                console.error('Failed to copy to clipboard:', err);
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }

    // Fallback copy method
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
                this.showToast('📋 Konten berhasil disalin!');
            } else {
                this.showToast('❌ Gagal menyalin konten', 'error');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showToast('❌ Gagal menyalin konten', 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        const icon = toast.querySelector('.toast-icon');
        const messageEl = toast.querySelector('.toast-message');
        
        // Set content
        messageEl.textContent = message;
        
        // Set icon and styling based on type
        if (type === 'success') {
            icon.className = 'toast-icon fas fa-check-circle';
            toast.className = 'toast toast-success';
        } else if (type === 'error') {
            icon.className = 'toast-icon fas fa-exclamation-circle';
            toast.className = 'toast toast-error';
        }
        
        // Show toast
        toast.style.display = 'flex';
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 300);
        }, 3000);
    }

    // Fallback share method
    fallbackShare(shareData) {
        const text = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Konten disalin ke clipboard', 'success');
            }).catch(() => {
                this.manualCopy(text);
            });
        } else {
            this.manualCopy(text);
        }
    }
    
    // Manual copy fallback
    manualCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showNotification('Konten disalin ke clipboard', 'success');
    }

    // Handle bottom navigation
    handleNavigation(action) {
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`[data-page="${action}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        const sectionTitle = document.querySelector('.section-title');
        
        switch (action) {
            case 'home':
                this.currentCategory = 'semua';
                this.updateActiveFilter(document.querySelector('[data-category="semua"]'));
                // Kembalikan section title asli
                if (sectionTitle) {
                    sectionTitle.innerHTML = `
                        <i class="fas fa-layer-group"></i>
                        Kategori Panduan Sholat
                    `;
                }
                break;
            case 'favorites':
                this.currentCategory = 'favorites';
                // Reset semua filter tabs karena favorites bukan filter tab
                document.querySelectorAll('.filter-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                // Update section title untuk favorites
                if (sectionTitle) {
                    sectionTitle.innerHTML = `
                        <i class="fas fa-heart"></i>
                        Item Favorit
                    `;
                }
                break;
            case 'search':
                document.getElementById('searchInput').focus();
                break;
            case 'info':
                this.showInfoModal();
                break;
        }
        
        this.renderItems();
    }

    // Update active filter button
    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // Update statistics
    updateStats() {
        const totalItems = this.allData ? this.allData.length : 0;
        const favoriteCount = this.favoriteItems.length;
        
        // Update counter jika ada
        const favCounter = document.querySelector('.favorite-counter');
        if (favCounter) {
            favCounter.textContent = favoriteCount;
            favCounter.style.display = favoriteCount > 0 ? 'block' : 'none';
        }
    }

    // Show info modal
    showInfoModal() {
        const modal = document.getElementById('detailModal');
        const content = document.getElementById('modalContent');
        
        content.innerHTML = `
            <div class="modal-header">
                <div class="modal-title-section">
                    <span class="modal-icon">ℹ️</span>
                    <h2>Tentang Aplikasi</h2>
                </div>
            </div>
            <div class="modal-body">
                <div class="detail-section">
                    <h4>Tata Cara Sholat</h4>
                    <p>Aplikasi panduan lengkap sholat berdasarkan Al-Quran dan Hadits shahih menurut pemahaman salaf.</p>
                </div>
                
                <div class="detail-section">
                    <h4>Fitur</h4>
                    <ul>
                        <li>Panduan lengkap rukun dan syarat sholat</li>
                        <li>Bacaan-bacaan sholat dengan audio</li>
                        <li>Sholat sunnah rawatib dan khusus</li>
                        <li>Dalil dari Al-Quran dan Hadits</li>
                        <li>Tips dan kesalahan umum</li>
                        <li>Favorit dan pencarian</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4>Sumber</h4>
                    <ul>
                        <li>Al-Quran dan Hadits Shahih</li>
                        <li>Al-Mulakhkhas fil Fiqih - Syaikh Shalih Al-Fauzan</li>
                        <li>Zad al-Ma'ad - Ibnu Qayyim</li>
                        <li>Fiqh as-Sunnah - Sayyid Sabiq</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4>Feedback</h4>
                    <p>Jika ada data yang kurang tepat, bug, atau saran, silakan hubungi kami di Instagram 
                    <a href="https://instagram.com/mfarismuzakki" target="_blank">@mfarismuzakki</a></p>
                </div>
                
                <div class="detail-section">
                    <h4>Statistik</h4>
                    <p>Total konten: ${this.allData ? this.allData.length : 0} item</p>
                    <p>Favorit Anda: ${this.favoriteItems.length} item</p>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        this.currentModal = modal;
        document.body.style.overflow = 'hidden';
    }

    // Helper functions
    getDefaultIcon(category) {
        const icons = {
            'rukun': '🕌',
            'syarat': '✅',
            'bacaan': '📖',
            'sunnah': '🌟',
            'khusus': '⭐'
        };
        return icons[category] || '🕌';
    }

    getCategoryLabel(category) {
        if (!category) return 'Lainnya';
        const labels = {
            'rukun': 'Rukun',
            'syarat': 'Syarat',
            'bacaan': 'Bacaan',
            'sunnah': 'Sunnah',
            'khusus': 'Khusus'
        };
        return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    truncateText(text, maxLength) {
        if (!text || typeof text !== 'string') return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    // Local storage functions
    loadFavorites() {
        try {
            const saved = localStorage.getItem('tatacara_sholat_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('tatacara_sholat_favorites', JSON.stringify(this.favoriteItems));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    // Notification system
    showNotification(message, type = 'info') {
        // Hapus notifikasi sebelumnya
        const existingNotif = document.querySelector('.notification');
        if (existingNotif) {
            existingNotif.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TataCaraSholatApp();
});

// Tambahan CSS untuk notification (inline)
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid #00ffff;
        border-radius: 8px;
        padding: 12px 16px;
        color: #00ffff;
        font-size: 14px;
        z-index: 10000;
        backdrop-filter: blur(10px);
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .notification-success {
        border-color: #4ade80;
        color: #4ade80;
    }
    
    .notification-error {
        border-color: #f87171;
        color: #f87171;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #8b9dc3;
        grid-column: 1 / -1;
    }
    
    .empty-icon {
        font-size: 4rem;
        margin-bottom: 16px;
        opacity: 0.5;
    }
    
    .empty-state h3 {
        margin: 0 0 8px 0;
        color: #ddd;
    }
    
    .favorite-counter {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #00ffff;
        color: #0f0f23;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        display: none;
    }
    
    .nav-item {
        position: relative;
    }
`;
document.head.appendChild(style);