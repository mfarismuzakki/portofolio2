// Asmaul Husna — 99 Nama-Nama Allah Yang Indah
import { ASMAUL_HUSNA, HADITS_ASMAUL_HUSNA } from '../../data/asmaul/asmaul-data.js';

// Auto-classify each name into a theme group (for color coding).
// Keys are theme IDs, values are { color, accent, label, keywords }.
const ASMAUL_THEMES = {
    rahmah:    { color: '#ff6b9d', label: 'Kasih Sayang', kw: ['pengasih','penyayang','kasih','pemaaf','penyantun','pengampun','menerima','pemurah','pelindung','penolong','pemberi karunia','bersyukur','memberi','penolong'] },
    kekuasaan: { color: '#ff8c42', label: 'Kekuasaan',    kw: ['perkasa','merajai','kuat','raja','memaksa','agung','besar','tinggi','maha kuasa','kekuasaan','keagungan'] },
    ilmu:      { color: '#00d4ff', label: 'Ilmu & Hikmah',  kw: ['mengetahui','mengenal','melihat','mendengar','halus','bijaksana','menghitung','memberi petunjuk','membimbing','hakim','menetapkan hukum'] },
    keadilan:  { color: '#a78bfa', label: 'Keadilan',      kw: ['adil','membalas','menghukum','memutuskan','penghisab','menyempitkan','melapangkan','merendahkan','meninggikan','memuliakan','menghinakan'] },
    keesaan:   { color: '#fbbf24', label: 'Keesaan',       kw: ['esa','tunggal','satu','akhir','awal','pertama','azali','abadi','kekal','terdahulu','hidup','berdiri sendiri'] },
    keindahan: { color: '#34d399', label: 'Keindahan',     kw: ['suci','sempurna','indah','pencipta','mengadakan','membentuk','pembuat','tampak','jelas','nyata','batin','tersembunyi'] },
    rezeki:    { color: '#22d3ee', label: 'Rezeki & Karunia', kw: ['rezeki','memberi','kaya','mencukupkan','membuka','pemberi'] },
    perlindungan: { color: '#60a5fa', label: 'Perlindungan', kw: ['mengawasi','keamanan','keselamatan','memelihara','menjaga','penolong','penjamin','wakil','pelindung'] }
};

function classifyTheme(name) {
    const m = (name.meaning + ' ' + name.desc).toLowerCase();
    let best = 'keesaan';
    let bestHit = 0;
    for (const [id, theme] of Object.entries(ASMAUL_THEMES)) {
        const hits = theme.kw.reduce((c, k) => c + (m.includes(k) ? 1 : 0), 0);
        if (hits > bestHit) { bestHit = hits; best = id; }
    }
    return best;
}

// Pick "Asma Hari Ini" deterministically based on day-of-year so it changes daily.
function pickDailyAsma() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return ASMAUL_HUSNA[dayOfYear % ASMAUL_HUSNA.length];
}

export default class AsmaulApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('asmaul-app');
        this.searchQuery = '';
        this.selectedName = null;
        this.activeTheme = 'all';
        // Cache theme classification once
        this._themeMap = new Map(ASMAUL_HUSNA.map(n => [n.no, classifyTheme(n)]));
    }

    async init() {
        this.render();
        this.setupEvents();
    }

    render() {
        const daily = pickDailyAsma();
        const dailyTheme = this._themeMap.get(daily.no);
        const dailyColor = ASMAUL_THEMES[dailyTheme].color;
        const themeIds = Object.keys(ASMAUL_THEMES);

        // Count per theme for filter badge
        const themeCounts = {};
        themeIds.forEach(id => { themeCounts[id] = 0; });
        ASMAUL_HUSNA.forEach(n => {
            const t = this._themeMap.get(n.no);
            themeCounts[t] = (themeCounts[t] || 0) + 1;
        });

        this.container.innerHTML = `
        <div class="asmaul-container">
            <!-- Header -->
            <div class="asmaul-header">
                <h2><i class="fas fa-star-and-crescent"></i> Asmaul Husna</h2>
                <p class="asmaul-subtitle">99 Nama-Nama Allah Yang Indah</p>
            </div>

            <!-- Asma Hari Ini (Daily) -->
            <div class="asmaul-daily" style="--theme-color:${dailyColor}" data-no="${daily.no}">
                <div class="asmaul-daily-deco">
                    <svg viewBox="0 0 200 200" aria-hidden="true">
                        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.3"/>
                        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
                        <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.5"/>
                    </svg>
                </div>
                <div class="asmaul-daily-label"><i class="fas fa-sun"></i> ASMA HARI INI</div>
                <div class="asmaul-daily-arabic">${daily.arabic}</div>
                <div class="asmaul-daily-latin">${daily.latin}</div>
                <div class="asmaul-daily-meaning">"${daily.meaning}"</div>
                <button class="asmaul-daily-cta">Pelajari maknanya <i class="fas fa-arrow-right"></i></button>
            </div>

            <!-- Hadits Utama -->
            <div class="asmaul-hadits-box">
                <div class="asmaul-hadits-arabic">${HADITS_ASMAUL_HUSNA.arabic}</div>
                <div class="asmaul-hadits-latin">${HADITS_ASMAUL_HUSNA.latin}</div>
                <div class="asmaul-hadits-terjemah">"${HADITS_ASMAUL_HUSNA.translation}"</div>
                <div class="asmaul-hadits-source"><i class="fas fa-book"></i> ${HADITS_ASMAUL_HUSNA.source}</div>
                <div class="asmaul-hadits-note"><i class="fas fa-lightbulb"></i> ${HADITS_ASMAUL_HUSNA.note}</div>
            </div>

            <!-- Search & Theme Filter -->
            <div class="asmaul-controls">
                <div class="asmaul-search-wrap">
                    <i class="fas fa-search"></i>
                    <input type="text" class="asmaul-search" id="asmaulSearch" placeholder="Cari nama atau makna...">
                </div>
                <div class="asmaul-themes" id="asmaulThemes">
                    <button class="asmaul-theme-chip active" data-theme="all">
                        <span class="asmaul-theme-dot" style="background:linear-gradient(135deg,#00ffff,#ff00ff)"></span>
                        Semua <span class="asmaul-theme-count">99</span>
                    </button>
                    ${themeIds.map(id => `
                        <button class="asmaul-theme-chip" data-theme="${id}" style="--theme-color:${ASMAUL_THEMES[id].color}">
                            <span class="asmaul-theme-dot" style="background:${ASMAUL_THEMES[id].color}"></span>
                            ${ASMAUL_THEMES[id].label} <span class="asmaul-theme-count">${themeCounts[id]}</span>
                        </button>
                    `).join('')}
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
        const filterTheme = this.activeTheme;
        return ASMAUL_HUSNA
            .filter(name => {
                if (filterTheme !== 'all' && this._themeMap.get(name.no) !== filterTheme) return false;
                if (!query) return true;
                return name.arabic.includes(query) ||
                    name.latin.toLowerCase().includes(query) ||
                    name.meaning.toLowerCase().includes(query) ||
                    String(name.no).includes(query);
            })
            .map(name => {
                const themeId = this._themeMap.get(name.no);
                const color = ASMAUL_THEMES[themeId].color;
                return `
                <div class="asmaul-card" data-no="${name.no}" data-theme="${themeId}" style="--theme-color:${color}">
                    <div class="asmaul-card-no">${name.no}</div>
                    <div class="asmaul-card-arabic">${name.arabic}</div>
                    <div class="asmaul-card-latin">${name.latin}</div>
                    <div class="asmaul-card-meaning">${name.meaning}</div>
                </div>`;
            })
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

        // Theme filter chips
        const themesEl = document.getElementById('asmaulThemes');
        if (themesEl) {
            themesEl.addEventListener('click', (e) => {
                const chip = e.target.closest('.asmaul-theme-chip');
                if (!chip) return;
                themesEl.querySelectorAll('.asmaul-theme-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.activeTheme = chip.dataset.theme;
                this.refreshGrid();
            });
        }

        // Daily card click → open detail modal
        const dailyEl = this.container.querySelector('.asmaul-daily');
        if (dailyEl) {
            dailyEl.addEventListener('click', () => {
                const no = parseInt(dailyEl.dataset.no);
                this.openModal(no);
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
