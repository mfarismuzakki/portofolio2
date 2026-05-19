// Asmaul Husna — 99 Nama-Nama Allah Yang Indah
import { ASMAUL_HUSNA, HADITS_ASMAUL_HUSNA } from '../../data/asmaul/asmaul-data.js';

export default class AsmaulApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('asmaul-app');
        this.searchQuery = '';
        this.selectedName = null;
    }

    async init() {
        this.render();
        this.setupEvents();
    }

    render() {
        this.container.innerHTML = `
        <div class="asmaul-container">
            <!-- Header -->
            <div class="asmaul-header">
                <h2><i class="fas fa-star-and-crescent"></i> Asmaul Husna</h2>
                <p class="asmaul-subtitle">99 Nama-Nama Allah Yang Indah</p>
            </div>

            <!-- Hadits Utama -->
            <div class="asmaul-hadits-box">
                <div class="asmaul-hadits-arabic">${HADITS_ASMAUL_HUSNA.arabic}</div>
                <div class="asmaul-hadits-latin">${HADITS_ASMAUL_HUSNA.latin}</div>
                <div class="asmaul-hadits-terjemah">"${HADITS_ASMAUL_HUSNA.translation}"</div>
                <div class="asmaul-hadits-source"><i class="fas fa-book"></i> ${HADITS_ASMAUL_HUSNA.source}</div>
                <div class="asmaul-hadits-note"><i class="fas fa-lightbulb"></i> ${HADITS_ASMAUL_HUSNA.note}</div>
            </div>

            <!-- Search -->
            <div class="asmaul-controls">
                <div class="asmaul-search-wrap">
                    <i class="fas fa-search"></i>
                    <input type="text" class="asmaul-search" id="asmaulSearch" placeholder="Cari nama atau makna...">
                </div>
            </div>

            <!-- Grid 99 Nama -->
            <div class="asmaul-grid" id="asmaulGrid">
                ${this.renderGrid()}
            </div>

            <!-- Modal Detail -->
            <div class="asmaul-modal" id="asmaulModal">
                <div class="asmaul-modal-backdrop" id="asmaulModalBackdrop"></div>
                <div class="asmaul-modal-content" id="asmaulModalContent"></div>
            </div>
        </div>`;
    }

    renderGrid() {
        const query = this.searchQuery.toLowerCase();
        return ASMAUL_HUSNA
            .filter(name => !query ||
                name.arabic.includes(query) ||
                name.latin.toLowerCase().includes(query) ||
                name.meaning.toLowerCase().includes(query) ||
                String(name.no).includes(query))
            .map(name => `
                <div class="asmaul-card" data-no="${name.no}">
                    <div class="asmaul-card-no">${name.no}</div>
                    <div class="asmaul-card-arabic">${name.arabic}</div>
                    <div class="asmaul-card-latin">${name.latin}</div>
                    <div class="asmaul-card-meaning">${name.meaning}</div>
                </div>`)
            .join('') || '<div class="asmaul-empty"><i class="fas fa-search"></i><p>Nama tidak ditemukan</p></div>';
    }

    renderModal(name) {
        return `
        <div class="asmaul-modal-inner">
            <button class="asmaul-modal-close" id="asmaulModalClose"><i class="fas fa-times"></i></button>
            <div class="asmaul-modal-no">${name.no}</div>
            <div class="asmaul-modal-arabic">${name.arabic}</div>
            <div class="asmaul-modal-latin">${name.latin}</div>
            <div class="asmaul-modal-meaning">${name.meaning}</div>
            <div class="asmaul-modal-dalil"><i class="fas fa-book-open"></i> ${name.dalil}</div>
            <div class="asmaul-modal-desc">${name.desc}</div>
        </div>`;
    }

    setupEvents() {
        const searchEl = document.getElementById('asmaulSearch');
        if (searchEl) {
            searchEl.addEventListener('input', () => {
                this.searchQuery = searchEl.value;
                this.refreshGrid();
            });
        }

        const grid = document.getElementById('asmaulGrid');
        if (grid) {
            grid.addEventListener('click', (e) => {
                const card = e.target.closest('.asmaul-card');
                if (card) this.openModal(parseInt(card.dataset.no));
            });
        }

        const modal = document.getElementById('asmaulModal');
        if (modal) {
            document.getElementById('asmaulModalBackdrop')?.addEventListener('click', () => this.closeModal());
            modal.addEventListener('click', (e) => {
                if (e.target.closest('#asmaulModalClose')) this.closeModal();
            });
        }
    }

    refreshGrid() {
        const grid = document.getElementById('asmaulGrid');
        if (grid) grid.innerHTML = this.renderGrid();
    }

    openModal(no) {
        const name = ASMAUL_HUSNA.find(n => n.no === no);
        if (!name) return;
        this.selectedName = name;
        const content = document.getElementById('asmaulModalContent');
        if (content) content.innerHTML = this.renderModal(name);
        const modal = document.getElementById('asmaulModal');
        if (modal) modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('asmaulModal');
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
        this.selectedName = null;
    }
}
