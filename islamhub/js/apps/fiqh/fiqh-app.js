// Fiqh Praktis — Panduan Ibadah Sehari-hari
import { FIQH_DATA, FIQH_CATEGORIES } from '../../data/fiqh/fiqh-data.js';

export default class FiqhApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('fiqh-app');
        this.currentCategory = null;
        this.searchQuery = '';
        this.openItems = new Set();
    }

    async init() {
        this.render();
        this.setupEvents();
    }

    parseMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n•/g, '<br>•')
            .replace(/\n(\d+\.)/g, '<br>$1')
            .replace(/\n/g, '<br>');
    }

    render() {
        this.container.innerHTML = `
        <div class="fiqh-container">
            <div class="fiqh-header">
                <h2><i class="fas fa-scale-balanced"></i> Fiqh Praktis</h2>
                <p class="fiqh-subtitle">Panduan ibadah sesuai Al-Qur\'an dan Sunnah shahih</p>
            </div>

            <!-- Search -->
            <div class="fiqh-search-wrap">
                <i class="fas fa-search"></i>
                <input type="text" id="fiqhSearch" class="fiqh-search" placeholder="Cari topik, pertanyaan, atau keyword...">
            </div>

            <!-- Kategori -->
            <div class="fiqh-categories" id="fiqhCategories">
                <button class="fiqh-cat-btn active" data-cat="">
                    <i class="fas fa-th"></i> Semua
                </button>
                ${FIQH_CATEGORIES.map(cat => `
                <button class="fiqh-cat-btn" data-cat="${cat.id}" style="--cat-color:${cat.color}">
                    <i class="fas ${cat.icon}"></i> ${cat.label}
                </button>`).join('')}
            </div>

            <!-- Disclaimer -->
            <div class="fiqh-disclaimer">
                <i class="fas fa-info-circle"></i>
                <p>Panduan ini bersifat umum. Untuk masalah fiqh yang lebih spesifik dan kompleks, konsultasikan dengan ulama atau dai yang amanah di lingkungan Anda.</p>
            </div>

            <!-- Daftar Fiqh (Accordion) -->
            <div class="fiqh-list" id="fiqhList">
                ${this.renderList()}
            </div>
        </div>`;
    }

    renderList() {
        const query = this.searchQuery.toLowerCase();
        const filtered = FIQH_DATA.filter(item => {
            const matchCat = !this.currentCategory || item.category === this.currentCategory;
            const matchSearch = !query ||
                item.question.toLowerCase().includes(query) ||
                item.answer.toLowerCase().includes(query) ||
                (item.tags && item.tags.some(t => t.includes(query)));
            return matchCat && matchSearch;
        });

        if (filtered.length === 0) {
            return `<div class="fiqh-empty"><i class="fas fa-search"></i><p>Tidak ada hasil untuk "${this.searchQuery}"</p></div>`;
        }

        // Group by category
        const grouped = {};
        filtered.forEach(item => {
            if (!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push(item);
        });

        return Object.entries(grouped).map(([catId, items]) => {
            const cat = FIQH_CATEGORIES.find(c => c.id === catId);
            return `
            <div class="fiqh-section">
                <div class="fiqh-section-header" style="--cat-color:${cat?.color || '#00ffff'}">
                    <i class="fas ${cat?.icon || 'fa-book'}"></i>
                    <h3>${cat?.label || catId}</h3>
                    <span>${cat?.desc || ''}</span>
                </div>
                <div class="fiqh-items">
                    ${items.map(item => this.renderItem(item)).join('')}
                </div>
            </div>`;
        }).join('');
    }

    renderItem(item) {
        const isOpen = this.openItems.has(item.id);
        return `
        <div class="fiqh-item${isOpen ? ' open' : ''}" data-id="${item.id}">
            <button class="fiqh-question">
                <span>${item.question}</span>
                <i class="fas fa-chevron-down fiqh-chevron"></i>
            </button>
            <div class="fiqh-answer-wrap" style="${isOpen ? '' : 'display:none'}">
                <div class="fiqh-answer">
                    <p>${this.parseMarkdown(item.answer)}</p>
                </div>
                <div class="fiqh-dalil">
                    <i class="fas fa-book-open"></i>
                    <strong>Dalil:</strong> ${item.dalil}
                </div>
                ${item.catatan ? `
                <div class="fiqh-catatan">
                    <i class="fas fa-lightbulb"></i>
                    <div><strong>Catatan:</strong> ${item.catatan}</div>
                </div>` : ''}
                ${item.tags && item.tags.length ? `
                <div class="fiqh-tags">
                    ${item.tags.map(t => `<span class="fiqh-tag">${t}</span>`).join('')}
                </div>` : ''}
            </div>
        </div>`;
    }

    setupEvents() {
        // Search
        const searchEl = document.getElementById('fiqhSearch');
        if (searchEl) {
            searchEl.addEventListener('input', () => {
                this.searchQuery = searchEl.value.trim();
                this.refreshList();
            });
        }

        // Category filter
        const categories = document.getElementById('fiqhCategories');
        if (categories) {
            categories.addEventListener('click', (e) => {
                const btn = e.target.closest('.fiqh-cat-btn');
                if (!btn) return;
                this.currentCategory = btn.dataset.cat;
                this.openItems.clear();
                categories.querySelectorAll('.fiqh-cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.refreshList();
            });
        }

        // Accordion toggle (delegated)
        const list = document.getElementById('fiqhList');
        if (list) {
            list.addEventListener('click', (e) => {
                const question = e.target.closest('.fiqh-question');
                if (!question) return;
                const item = question.closest('.fiqh-item');
                if (!item) return;
                const id = item.dataset.id;
                const answerWrap = item.querySelector('.fiqh-answer-wrap');
                if (this.openItems.has(id)) {
                    this.openItems.delete(id);
                    item.classList.remove('open');
                    if (answerWrap) answerWrap.style.display = 'none';
                } else {
                    this.openItems.add(id);
                    item.classList.add('open');
                    if (answerWrap) answerWrap.style.display = 'block';
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }
    }

    refreshList() {
        const list = document.getElementById('fiqhList');
        if (list) list.innerHTML = this.renderList();
    }
}
