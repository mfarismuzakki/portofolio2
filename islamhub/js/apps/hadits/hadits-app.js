// Hadits Browser — Jelajahi hadits shahih dari berbagai kitab
import { HADITS_COLLECTION, HADITS_CATEGORIES } from '../../data/hadits/hadits-data.js';

export default class HaditsApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('hadits-app');
        this.currentCategory = null;
        this.searchQuery = '';
        this.favorites = this.loadFavorites();
        this.currentView = 'home'; // 'home' | 'list' | 'favorites'
    }

    async init() {
        this.render();
        this.setupEvents();
    }

    loadFavorites() {
        try {
            return new Set(JSON.parse(localStorage.getItem('islamhub_hadits_favorites') || '[]'));
        } catch { return new Set(); }
    }

    saveFavorites() {
        localStorage.setItem('islamhub_hadits_favorites', JSON.stringify([...this.favorites]));
    }

    render() {
        this.container.innerHTML = `
        <div class="hadits-container">
            <div class="hadits-header">
                <h2><i class="fas fa-scroll"></i> Hadits Browser</h2>
                <p class="hadits-subtitle">Koleksi hadits pilihan dari Kutubut Tis\'ah</p>
            </div>

            <!-- Search bar -->
            <div class="hadits-search-wrap">
                <i class="fas fa-search"></i>
                <input type="text" id="haditsSearch" class="hadits-search" placeholder="Cari hadits, kata kunci, atau perawi...">
                <button class="hadits-clear-search" id="haditsSearchClear" style="display:none"><i class="fas fa-times"></i></button>
            </div>

            <!-- View tabs -->
            <div class="hadits-view-tabs">
                <button class="hadits-view-tab active" data-view="home"><i class="fas fa-th"></i> Kategori</button>
                <button class="hadits-view-tab" data-view="all"><i class="fas fa-list"></i> Semua</button>
                <button class="hadits-view-tab" data-view="favorites"><i class="fas fa-bookmark"></i> Favorit <span class="hadits-fav-count">${this.favorites.size}</span></button>
            </div>

            <!-- Content -->
            <div class="hadits-content" id="haditsContent">
                ${this.renderHome()}
            </div>

            <!-- Detail Modal -->
            <div class="hadits-modal" id="haditsModal">
                <div class="hadits-modal-backdrop"></div>
                <div class="hadits-modal-box" id="haditsModalBox"></div>
            </div>
        </div>`;
    }

    renderHome() {
        return `
        <div class="hadits-categories">
            ${HADITS_CATEGORIES.map(cat => {
                const count = HADITS_COLLECTION.filter(h => h.category === cat.id).length;
                return `
                <div class="hadits-cat-card" data-cat="${cat.id}" style="--cat-color:${cat.color}">
                    <div class="hadits-cat-icon"><i class="fas ${cat.icon}"></i></div>
                    <div class="hadits-cat-info">
                        <strong>${cat.label}</strong>
                        <span>${count} hadits</span>
                    </div>
                    <i class="fas fa-chevron-right hadits-cat-arrow"></i>
                </div>`;
            }).join('')}
        </div>`;
    }

    renderList(hadits, title = '') {
        if (hadits.length === 0) {
            return `<div class="hadits-empty"><i class="fas fa-scroll"></i><p>Tidak ada hadits ditemukan</p></div>`;
        }
        return `
        ${title ? `<div class="hadits-list-title"><i class="fas fa-arrow-left hadits-back" id="haditsBack"></i> ${title}</div>` : ''}
        <div class="hadits-list">
            ${hadits.map(h => {
                const isFav = this.favorites.has(h.id);
                const cat = HADITS_CATEGORIES.find(c => c.id === h.category);
                return `
                <div class="hadits-card" data-id="${h.id}">
                    <div class="hadits-card-header">
                        <span class="hadits-card-cat" style="--cat-color:${cat?.color || '#fff'}">
                            <i class="fas ${cat?.icon || 'fa-scroll'}"></i> ${cat?.label || h.category}
                        </span>
                        <button class="hadits-fav-btn${isFav ? ' active' : ''}" data-id="${h.id}">
                            <i class="fas${isFav ? '' : ' far'} fa-bookmark"></i>
                        </button>
                    </div>
                    <h4 class="hadits-card-title">${h.title}</h4>
                    <div class="hadits-card-arabic">${h.arabic.length > 120 ? h.arabic.substring(0, 120) + '...' : h.arabic}</div>
                    <p class="hadits-card-translation">${h.translation.length > 100 ? h.translation.substring(0, 100) + '...' : h.translation}</p>
                    <div class="hadits-card-source"><i class="fas fa-book"></i> ${h.source}</div>
                </div>`;
            }).join('')}
        </div>`;
    }

    renderDetail(h) {
        const isFav = this.favorites.has(h.id);
        const cat = HADITS_CATEGORIES.find(c => c.id === h.category);
        return `
        <button class="hadits-modal-close" id="haditsModalClose"><i class="fas fa-times"></i></button>
        <div class="hadits-detail">
            <div class="hadits-detail-cat" style="--cat-color:${cat?.color || '#fff'}">
                <i class="fas ${cat?.icon || 'fa-scroll'}"></i> ${cat?.label || h.category}
            </div>
            <h3 class="hadits-detail-title">${h.title}</h3>
            <div class="hadits-detail-arabic">${h.arabic}</div>
            <div class="hadits-detail-latin">${h.latin}</div>
            <div class="hadits-detail-translation">"${h.translation}"</div>
            <div class="hadits-detail-meta">
                <div class="hadits-meta-item">
                    <i class="fas fa-user"></i>
                    <div><strong>Perawi</strong><span>${h.narrator}</span></div>
                </div>
                <div class="hadits-meta-item">
                    <i class="fas fa-book"></i>
                    <div><strong>Sumber</strong><span>${h.source}</span></div>
                </div>
            </div>
            <div class="hadits-detail-faidah">
                <i class="fas fa-lightbulb"></i>
                <div><strong>Faidah</strong><p>${h.faidah}</p></div>
            </div>
            <button class="hadits-detail-fav${isFav ? ' active' : ''}" data-id="${h.id}">
                <i class="fas${isFav ? '' : ' far'} fa-bookmark"></i>
                ${isFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
            </button>
        </div>`;
    }

    setupEvents() {
        const content = document.getElementById('haditsContent');
        const search  = document.getElementById('haditsSearch');
        const clearBtn = document.getElementById('haditsSearchClear');

        // Search
        if (search) {
            search.addEventListener('input', () => {
                this.searchQuery = search.value.trim();
                if (clearBtn) clearBtn.style.display = this.searchQuery ? 'block' : 'none';
                if (this.searchQuery) {
                    const results = HADITS_COLLECTION.filter(h =>
                        h.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        h.translation.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        h.arabic.includes(this.searchQuery) ||
                        h.source.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        h.narrator.toLowerCase().includes(this.searchQuery.toLowerCase())
                    );
                    if (content) content.innerHTML = this.renderList(results, `Hasil: "${this.searchQuery}"`);
                    this.bindListEvents();
                } else {
                    this.showView('home');
                }
            });
        }
        if (clearBtn) clearBtn.addEventListener('click', () => {
            search.value = '';
            this.searchQuery = '';
            clearBtn.style.display = 'none';
            this.showView('home');
        });

        // View tabs
        this.container.querySelectorAll('.hadits-view-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.hadits-view-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.showView(btn.dataset.view);
            });
        });

        // Modal
        const modal = document.getElementById('haditsModal');
        if (modal) {
            modal.querySelector('.hadits-modal-backdrop')?.addEventListener('click', () => this.closeModal());
        }

        this.bindListEvents();
    }

    bindListEvents() {
        const content = document.getElementById('haditsContent');
        if (!content) return;

        content.addEventListener('click', (e) => {
            // Category card
            const catCard = e.target.closest('.hadits-cat-card');
            if (catCard) {
                this.currentCategory = catCard.dataset.cat;
                const cat = HADITS_CATEGORIES.find(c => c.id === this.currentCategory);
                const filtered = HADITS_COLLECTION.filter(h => h.category === this.currentCategory);
                content.innerHTML = this.renderList(filtered, cat?.label || '');
                this.bindListEvents();
                return;
            }

            // Back button
            if (e.target.closest('#haditsBack')) {
                this.showView('home');
                return;
            }

            // Favorite button (list)
            const favBtn = e.target.closest('.hadits-fav-btn');
            if (favBtn) {
                e.stopPropagation();
                this.toggleFavorite(favBtn.dataset.id);
                favBtn.classList.toggle('active');
                const icon = favBtn.querySelector('i');
                if (icon) icon.className = this.favorites.has(favBtn.dataset.id) ? 'fas fa-bookmark' : 'far fa-bookmark';
                this.updateFavCount();
                return;
            }

            // Hadits card click → open modal
            const card = e.target.closest('.hadits-card');
            if (card) this.openModal(card.dataset.id);
        });

        // Modal events
        const modalBox = document.getElementById('haditsModalBox');
        if (modalBox) {
            modalBox.addEventListener('click', (e) => {
                if (e.target.closest('#haditsModalClose')) this.closeModal();

                const favBtn = e.target.closest('.hadits-detail-fav');
                if (favBtn) {
                    this.toggleFavorite(favBtn.dataset.id);
                    const h = HADITS_COLLECTION.find(h => h.id === favBtn.dataset.id);
                    if (h) modalBox.innerHTML = this.renderDetail(h);
                    this.updateFavCount();
                }
            });
        }
    }

    showView(view) {
        this.currentView = view;
        const content = document.getElementById('haditsContent');
        if (!content) return;
        if (view === 'home') {
            content.innerHTML = this.renderHome();
        } else if (view === 'all') {
            content.innerHTML = this.renderList(HADITS_COLLECTION, 'Semua Hadits');
        } else if (view === 'favorites') {
            const favs = HADITS_COLLECTION.filter(h => this.favorites.has(h.id));
            content.innerHTML = this.renderList(favs, 'Favorit Saya');
        }
        this.bindListEvents();
    }

    openModal(id) {
        const h = HADITS_COLLECTION.find(h => h.id === id);
        if (!h) return;
        const box = document.getElementById('haditsModalBox');
        if (box) box.innerHTML = this.renderDetail(h);
        const modal = document.getElementById('haditsModal');
        if (modal) modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.bindListEvents();
    }

    closeModal() {
        const modal = document.getElementById('haditsModal');
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleFavorite(id) {
        if (this.favorites.has(id)) {
            this.favorites.delete(id);
        } else {
            this.favorites.add(id);
        }
        this.saveFavorites();
    }

    updateFavCount() {
        const el = this.container.querySelector('.hadits-fav-count');
        if (el) el.textContent = this.favorites.size;
    }
}
