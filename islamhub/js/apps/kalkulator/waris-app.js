// ===== Kalkulator Waris IslamHub =====
// Berdasarkan kalkulator_waris standalone app
// Menggunakan Metode Jumhur Ulama

import { computeFaraid } from './waris-engine.js';
import { t, locale, getLang } from '../../i18n/index.js';

export default class WarisApp {
    constructor(state, mainApp) {
        this.state = state;
        this.mainApp = mainApp;
        this.data = {
            tirkah: {
                totalAssets: 0,
                funeralCosts: 0,
                debts: 0,
                wasiat: 0,
                netAssets: 0
            },
            heirs: {},
            results: null
        };
        this.currentStep = 1;
        this.currentPage = 'home'; // home, examples, calculator
        this.currency = 'IDR';
        this.favorites = []; // Initialize favorites array
        
        // Dalil dan Aturan Waris
        this.dalilDatabase = this.initializeDalilDatabase();
        this.inheritanceRules = this.initializeInheritanceRules();
        
        // Contoh perhitungan
        this.examples = {
            umariyah: {
                tirkah: { totalAssets: 120000000, funeralCosts: 5000000, debts: 0, wasiat: 0 },
                heirs: { husband: 1, father: 1, mother: 1 }
            },
            awl: {
                tirkah: { totalAssets: 100000000, funeralCosts: 3000000, debts: 0, wasiat: 0 },
                heirs: { husband: 1, daughters: 2, mother: 1 }
            },
            radd: {
                tirkah: { totalAssets: 90000000, funeralCosts: 2000000, debts: 0, wasiat: 0 },
                heirs: { wife: 1, daughters: 1 }
            },
            asabah: {
                tirkah: { totalAssets: 200000000, funeralCosts: 5000000, debts: 10000000, wasiat: 0 },
                heirs: { wife: 1, sons: 2, daughters: 1 }
            }
        };
    }

    async init() {
        console.log('Initializing Waris App...');
        this.loadFavorites();
        this.setupEventListeners();
        this.showHome();
        
        // Make globally accessible
        window.warisApp = this;
    }

    render() {
        this.renderHeirsForm();
        if (this.currentPage === 'favorites') {
            this.renderFavorites();
        } else if (this.currentPage === 'calculator' && this.data.results) {
            try {
                this.data.results = this.processInheritanceCalculation();
            } catch (e) {
                // Keep existing results if recomputation fails
            }
            this.displayResults(this.data.results);
            this.updateFavoriteButton();
        }
    }

    // ===== FAVORITES =====
    loadFavorites() {
        const saved = localStorage.getItem('warisFavorites');
        this.favorites = saved ? JSON.parse(saved) : [];
    }

    saveFavorites() {
        localStorage.setItem('warisFavorites', JSON.stringify(this.favorites));
    }

    toggleFavorite() {
        if (!this.data.results) return;

        // Check if already in favorites
        const existingIndex = this.favorites.findIndex(f => {
            return JSON.stringify(f.heirs) === JSON.stringify(this.data.heirs) &&
                   f.tirkah.netAssets === this.data.tirkah.netAssets;
        });

        if (existingIndex !== -1) {
            // Remove from favorites
            this.favorites.splice(existingIndex, 1);
            this.saveFavorites();
            this.showToast(t('waris.toast.removedFav'));
            this.updateFavoriteButton();
        } else {
            // Add to favorites
            const favorite = {
                id: Date.now(),
                date: new Date().toISOString(),
                tirkah: { ...this.data.tirkah },
                heirs: { ...this.data.heirs },
                results: this.data.results
            };

            this.favorites.unshift(favorite);
            if (this.favorites.length > 10) {
                this.favorites = this.favorites.slice(0, 10);
            }
            
            this.saveFavorites();
            this.showToast(t('waris.toast.savedFav'));
            this.updateFavoriteButton();
        }
    }

    removeFromFavorites(id) {
        this.favorites = this.favorites.filter(f => f.id !== id);
        this.saveFavorites();
        this.showFavorites();
        this.showToast(t('waris.toast.removedFav'));
    }

    isFavorite() {
        if (!this.data.results) return false;
        return this.favorites.some(f => {
            return JSON.stringify(f.heirs) === JSON.stringify(this.data.heirs) &&
                   f.tirkah.netAssets === this.data.tirkah.netAssets;
        });
    }

    updateFavoriteButton() {
        const favBtn = document.getElementById('waris-favoriteBtn');
        if (favBtn) {
            const isFav = this.isFavorite();
            favBtn.innerHTML = isFav 
                ? '<i class="fas fa-star"></i> ' + t('waris.favBtn.saved')
                : '<i class="far fa-star"></i> ' + t('waris.favBtn.save');
            favBtn.classList.toggle('saved', isFav);
        }
    }

    showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = 'waris-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ===== NAVIGATION =====
    showHome() {
        this.currentPage = 'home';
        document.getElementById('waris-home').style.display = 'block';
        document.getElementById('waris-examples').style.display = 'none';
        document.getElementById('waris-favorites').style.display = 'none';
        document.getElementById('waris-calculator').style.display = 'none';
    }

    showExamples() {
        this.currentPage = 'examples';
        document.getElementById('waris-home').style.display = 'none';
        document.getElementById('waris-examples').style.display = 'block';
        document.getElementById('waris-favorites').style.display = 'none';
        document.getElementById('waris-calculator').style.display = 'none';
    }

    showFavorites() {
        this.currentPage = 'favorites';
        document.getElementById('waris-home').style.display = 'none';
        document.getElementById('waris-examples').style.display = 'none';
        document.getElementById('waris-favorites').style.display = 'block';
        document.getElementById('waris-calculator').style.display = 'none';
        
        this.renderFavorites();
    }

    renderFavorites() {
        const container = document.getElementById('waris-favorites-list');
        if (!container) return;

        if (this.favorites.length === 0) {
            container.innerHTML = `
                <div class="waris-empty-state">
                    <i class="fas fa-star" style="font-size: 4rem; color: rgba(255,255,255,0.2); margin-bottom: 1rem;"></i>
                    <h3>${t('waris.fav.emptyTitle')}</h3>
                    <p>${t('waris.fav.emptyDesc')}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.favorites.map(fav => {
            const date = new Date(fav.date).toLocaleDateString(locale(), {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            const heirsCount = Object.keys(fav.heirs).length;
            const heirsList = Object.entries(fav.heirs).map(([type, count]) => 
                `${this.getHeirName(type)} (${count})`
            ).join(', ');

            return `
                <div class="waris-favorite-card">
                    <div class="favorite-header">
                        <div class="favorite-date">
                            <i class="fas fa-calendar"></i> ${date}
                        </div>
                        <button class="favorite-delete-btn" onclick="window.warisApp.removeFromFavorites(${fav.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="favorite-info">
                        <div class="favorite-amount">
                            <span class="label">${t('waris.fav.netAssets')}</span>
                            <span class="value">${this.formatCurrency(fav.tirkah.netAssets)}</span>
                        </div>
                        <div class="favorite-heirs">
                            <span class="label"><i class="fas fa-users"></i> ${t('waris.fav.heirsCount', { n: heirsCount })}</span>
                            <p class="heirs-list">${heirsList}</p>
                        </div>
                    </div>
                    <button class="waris-btn waris-btn-primary" onclick="window.warisApp.loadFavorite(${fav.id})">
                        <i class="fas fa-eye"></i> ${t('waris.fav.viewDetail')}
                    </button>
                </div>
            `;
        }).join('');
    }

    loadFavorite(id) {
        const favorite = this.favorites.find(f => f.id === id);
        if (!favorite) return;

        console.log('Loading favorite:', favorite); // Debug

        this.data = {
            tirkah: { ...favorite.tirkah },
            heirs: { ...favorite.heirs },
            results: favorite.results
        };

        // Show calculator and hide favorites
        this.currentPage = 'calculator';
        document.getElementById('waris-home').style.display = 'none';
        document.getElementById('waris-examples').style.display = 'none';
        document.getElementById('waris-favorites').style.display = 'none';
        document.getElementById('waris-calculator').style.display = 'block';
        
        setTimeout(() => {
            // Display results immediately
            if (favorite.results) {
                this.displayResults(favorite.results);
            }
            
            // Go to step 3 (results) directly
            this.currentStep = 3;
            this.updateWizardStep();
            this.scrollToTop();
            
            // Show result buttons
            const resetBtn = document.getElementById('waris-resetBtn');
            const homeBtn = document.getElementById('waris-homeBtn');
            const favBtn = document.getElementById('waris-favoriteBtn');
            if (resetBtn) resetBtn.style.display = 'flex';
            if (homeBtn) homeBtn.style.display = 'flex';
            if (favBtn) {
                favBtn.style.display = 'flex';
                this.updateFavoriteButton();
            }
        }, 100);
    }

    showCalculator() {
        this.currentPage = 'calculator';
        document.getElementById('waris-home').style.display = 'none';
        document.getElementById('waris-examples').style.display = 'none';
        document.getElementById('waris-favorites').style.display = 'none';
        document.getElementById('waris-calculator').style.display = 'block';
        
        // Reset to step 1
        this.currentStep = 1;
        this.updateWizardStep();
    }

    loadExample(exampleType) {
        const example = this.examples[exampleType];
        if (!example) return;

        // Load example data
        this.data.tirkah = { ...example.tirkah };
        this.data.heirs = { ...example.heirs };

        // Show calculator
        this.showCalculator();

        // Fill form with example data
        setTimeout(() => {
            this.fillFormWithData(example);
            
            // Show results notification with button to step 3
            const resetBtn = document.getElementById('waris-resetBtn');
            if (resetBtn) resetBtn.style.display = 'flex';
        }, 100);
    }

    fillFormWithData(data) {
        console.log('Filling form with data:', data); // Debug log
        
        // Fill tirkah
        if (data.tirkah) {
            const totalAssetsInput = document.getElementById('waris-totalAssets');
            const funeralCostsInput = document.getElementById('waris-funeralCosts');
            const debtsInput = document.getElementById('waris-debts');
            const wasiatInput = document.getElementById('waris-wasiat');
            
            if (totalAssetsInput) {
                totalAssetsInput.value = data.tirkah.totalAssets.toLocaleString(locale());
                console.log('Set totalAssets:', totalAssetsInput.value);
            }
            if (funeralCostsInput) {
                funeralCostsInput.value = data.tirkah.funeralCosts.toLocaleString(locale());
                console.log('Set funeralCosts:', funeralCostsInput.value);
            }
            if (debtsInput) {
                debtsInput.value = data.tirkah.debts.toLocaleString(locale());
                console.log('Set debts:', debtsInput.value);
            }
            if (wasiatInput) {
                wasiatInput.value = data.tirkah.wasiat.toLocaleString(locale());
                console.log('Set wasiat:', wasiatInput.value);
            }
            
            this.updateTirkahSummary();
        }

        // Fill heirs
        if (data.heirs) {
            this.heirCounts = { ...data.heirs };
            this.updateHeirsData();
            this.renderHeirsForm();
        }
    }

    setupEventListeners() {
        // Tirkah inputs with thousand separator
        ['totalAssets', 'funeralCosts', 'debts', 'wasiat'].forEach(field => {
            const input = document.getElementById(`waris-${field}`);
            if (input) {
                input.addEventListener('input', (e) => this.handleCurrencyInput(e));
                input.addEventListener('blur', () => this.updateTirkahSummary());
            }
        });

        // Navigation buttons
        const backToHomeBtn = document.getElementById('waris-backToHomeBtn');
        const prevBtn = document.getElementById('waris-prevBtn');
        const nextBtn = document.getElementById('waris-nextBtn');
        const calculateBtn = document.getElementById('waris-calculateBtn');
        const resetBtn = document.getElementById('waris-resetBtn');
        const homeBtn = document.getElementById('waris-homeBtn');
        const favoriteBtn = document.getElementById('waris-favoriteBtn');

        if (backToHomeBtn) backToHomeBtn.addEventListener('click', () => this.showHome());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousStep());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
        if (calculateBtn) calculateBtn.addEventListener('click', () => this.calculateInheritance());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetCalculator());
        if (homeBtn) homeBtn.addEventListener('click', () => this.showHome());
        if (favoriteBtn) favoriteBtn.addEventListener('click', () => this.toggleFavorite());

        // Heirs inputs
        this.setupHeirsInputs();
    }

    handleCurrencyInput(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        
        if (value) {
            // Convert to number and format with thousand separator
            // Using BigInt for large numbers to avoid precision loss
            const numValue = value.length > 15 ? BigInt(value) : parseInt(value);
            value = numValue.toLocaleString(locale());
        }
        e.target.value = value;
    }

    parseCurrencyValue(value) {
        if (!value) return 0;
        return parseInt(value.toString().replace(/\D/g, '')) || 0;
    }

    // ===== DALIL DATABASE =====
    initializeDalilDatabase() {
        return {
            ayahQuran: {
                "4:11": {
                    arabic: "يُوصِيكُمُ اللّهُ فِي أَوْلاَدِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الأُنثَيَيْنِ",
                    translation: "Allah mewasiatkan kepadamu tentang (pembagian pusaka untuk) anak-anakmu. Yaitu: bahagian seorang anak lelaki sama dengan bagahian dua orang anak perempuan"
                },
                "4:12": {
                    arabic: "وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ",
                    translation: "Dan bagimu (suami-suami) seperdua dari harta yang ditinggalkan oleh isteri-isterimu, jika mereka tidak mempunyai anak"
                },
                "4:176": {
                    arabic: "يَسْتَفْتُونَكَ قُلِ اللّهُ يُفْتِيكُمْ فِي الْكَلاَلَةِ",
                    translation: "Mereka meminta fatwa kepadamu (tentang kalalah). Katakanlah: 'Allah memberi fatwa kepadamu tentang kalalah'"
                }
            },
            hadith: {
                sahabah: {
                    arabic: "أعطوا الفرائض أهلها، فما بقي فلأولى رجل ذكر",
                    translation: "Berikanlah faraidh kepada ahlinya, maka apa yang tersisa adalah untuk laki-laki terdekat"
                }
            },
            principles: {
                ashabulFurudh: "Ahli waris yang mendapat bagian tertentu dari Al-Quran",
                asabah: "Ahli waris yang menghabiskan sisa setelah ashabul furudh",
                hajb: "Terhalangnya sebagian atau seluruh hak waris karena adanya ahli waris lain",
                awl: "Pengurangan proporsional ketika total bagian melebihi 100%",
                radd: "Pengembalian sisa harta kepada ashabul furudh jika tidak ada asabah"
            }
        };
    }

    initializeInheritanceRules() {
        return {
            ashabulFurudh: {
                spouse: {
                    husband: { 
                        withChild: { fraction: "1/4", decimal: 0.25, condition: "dengan anak/cucu" },
                        withoutChild: { fraction: "1/2", decimal: 0.5, condition: "tanpa anak/cucu" }
                    },
                    wife: { 
                        withChild: { fraction: "1/8", decimal: 0.125, condition: "dengan anak/cucu" },
                        withoutChild: { fraction: "1/4", decimal: 0.25, condition: "tanpa anak/cucu" }
                    }
                },
                parents: {
                    father: { 
                        withChild: { fraction: "1/6", decimal: 0.1667, condition: "dengan anak laki-laki" },
                        withoutChild: { type: "asabah", condition: "tanpa anak laki-laki" }
                    },
                    mother: { 
                        withChild: { fraction: "1/6", decimal: 0.1667, condition: "dengan anak/cucu" },
                        withSiblings: { fraction: "1/6", decimal: 0.1667, condition: "dengan 2+ saudara" },
                        normal: { fraction: "1/3", decimal: 0.3333, condition: "kondisi normal" }
                    }
                },
                children: {
                    daughter: { 
                        alone: { fraction: "1/2", decimal: 0.5, condition: "sendirian" },
                        withSister: { fraction: "2/3", decimal: 0.6667, condition: "2+ putri" },
                        withBrother: { type: "asabah", ratio: "1:2", condition: "dengan saudara laki-laki" }
                    },
                    son: { type: "asabah", condition: "menghabiskan sisa" }
                }
            }
        };
    }

    // ===== HEIRS INPUT SETUP =====
    // Every heir the engine knows, grouped as a family tree reads. max = most people allowed.
    static get HEIR_GROUPS() {
        return [
            { title: t('waris.group.spouse'), icon: 'fa-ring', items: [
                { key: 'husband', label: t('waris.heirLabel.husband'), icon: 'fa-person', max: 1 },
                { key: 'wife', label: t('waris.heirLabel.wife'), icon: 'fa-person-dress', max: 4 },
            ] },
            { title: t('waris.group.parents'), icon: 'fa-user-group', items: [
                { key: 'father', label: t('waris.heirLabel.father'), icon: 'fa-person-cane', max: 1 },
                { key: 'mother', label: t('waris.heirLabel.mother'), icon: 'fa-person-dress', max: 1 },
                { key: 'grandfather', label: t('waris.heirLabel.grandfather'), hint: t('waris.hint.fatherOfFather'), icon: 'fa-person-cane', max: 1 },
                { key: 'grandmotherPaternal', label: t('waris.heirLabel.grandmotherPaternal'), hint: t('waris.hint.motherOfFather'), icon: 'fa-person-dress', max: 1 },
                { key: 'grandmotherMaternal', label: t('waris.heirLabel.grandmotherMaternal'), hint: t('waris.hint.motherOfMother'), icon: 'fa-person-dress', max: 1 },
            ] },
            { title: t('waris.group.children'), icon: 'fa-children', items: [
                { key: 'sons', label: t('waris.heirLabel.sons'), icon: 'fa-child', max: 30 },
                { key: 'daughters', label: t('waris.heirLabel.daughters'), icon: 'fa-child-dress', max: 30 },
                { key: 'grandsons', label: t('waris.heirLabel.grandsons'), hint: t('waris.hint.fromSon'), icon: 'fa-child', max: 30 },
                { key: 'granddaughters', label: t('waris.heirLabel.granddaughters'), hint: t('waris.hint.fromSon'), icon: 'fa-child-dress', max: 30 },
            ] },
            { title: t('waris.group.siblings'), icon: 'fa-people-group', more: true, items: [
                { key: 'fullBrothers', label: t('waris.heirLabel.fullBrothers'), hint: t('waris.hint.kandung'), icon: 'fa-person', max: 30 },
                { key: 'fullSisters', label: t('waris.heirLabel.fullSisters'), hint: t('waris.hint.kandung'), icon: 'fa-person-dress', max: 30 },
                { key: 'paternalBrothers', label: t('waris.heirLabel.paternalBrothers'), hint: t('waris.hint.seayah'), icon: 'fa-person', max: 30 },
                { key: 'paternalSisters', label: t('waris.heirLabel.paternalSisters'), hint: t('waris.hint.seayah'), icon: 'fa-person-dress', max: 30 },
                { key: 'maternalBrothers', label: t('waris.heirLabel.maternalBrothers'), hint: t('waris.hint.seibu'), icon: 'fa-person', max: 30 },
                { key: 'maternalSisters', label: t('waris.heirLabel.maternalSisters'), hint: t('waris.hint.seibu'), icon: 'fa-person-dress', max: 30 },
            ] },
            { title: t('waris.group.uncles'), icon: 'fa-sitemap', more: true,
              note: t('waris.group.unclesNote'), items: [
                { key: 'fullNephews', label: t('waris.heirLabel.fullNephews'), hint: t('waris.hint.sonOfFullBrother'), icon: 'fa-child', max: 30 },
                { key: 'paternalNephews', label: t('waris.heirLabel.paternalNephews'), hint: t('waris.hint.sonOfPaternalBrother'), icon: 'fa-child', max: 30 },
                { key: 'fullUncles', label: t('waris.heirLabel.fullUncles'), hint: t('waris.hint.fullBrotherOfFather'), icon: 'fa-person', max: 30 },
                { key: 'paternalUncles', label: t('waris.heirLabel.paternalUncles'), hint: t('waris.hint.paternalBrotherOfFather'), icon: 'fa-person', max: 30 },
                { key: 'fullCousins', label: t('waris.heirLabel.fullCousins'), hint: t('waris.hint.sonOfFullUncle'), icon: 'fa-person', max: 30 },
                { key: 'paternalCousins', label: t('waris.heirLabel.paternalCousins'), hint: t('waris.hint.sonOfPaternalUncle'), icon: 'fa-person', max: 30 },
            ] },
            { title: t('waris.group.arham'), icon: 'fa-user-group', more: true,
              note: t('waris.group.arhamNote'), items: [
                { key: 'paternalAunts', label: t('waris.heirLabel.paternalAunts'), hint: t('waris.hint.sisterOfFather'), icon: 'fa-person-dress', max: 30 },
                { key: 'maternalAunts', label: t('waris.heirLabel.maternalAunts'), hint: t('waris.hint.sisterOfMother'), icon: 'fa-person-dress', max: 30 },
                { key: 'maternalUncles', label: t('waris.heirLabel.maternalUncles'), hint: t('waris.hint.brotherOfMother'), icon: 'fa-person', max: 30 },
            ] },
        ];
    }

    setupHeirsInputs() {
        this.heirCounts = this.heirCounts || {};
        this.renderHeirsForm();
    }

    renderHeirsForm() {
        const host = document.getElementById('waris-heirs-form');
        if (!host) return;
        const counts = this.heirCounts || (this.heirCounts = {});
        host.innerHTML = WarisApp.HEIR_GROUPS.map((g, gi) => {
            const picked = g.items.filter(it => counts[it.key] > 0).length;
            const cards = g.items.map(it => {
                const n = counts[it.key] || 0;
                const stepper = n && it.max > 1 ? `
                        <div class="wh-count">
                            <button type="button" data-step="${it.key}" data-d="-1" aria-label="${t('waris.btn.reduce')}"><i class="fas fa-minus"></i></button>
                            <b>${n}</b><span>${t('waris.units.people')}</span>
                            <button type="button" data-step="${it.key}" data-d="1" aria-label="${t('waris.btn.add')}"><i class="fas fa-plus"></i></button>
                        </div>` : '';
                return `
                    <div class="wh-card${n ? ' on' : ''}" data-key="${it.key}">
                        <button type="button" class="wh-toggle" data-toggle="${it.key}" aria-pressed="${n > 0}">
                            <span class="wh-ico"><i class="fas ${it.icon}"></i></span>
                            <span class="wh-name">${it.label}${it.hint ? `<small>${it.hint}</small>` : ''}</span>
                            <span class="wh-check" aria-hidden="true"></span>
                        </button>${stepper}
                    </div>`;
            }).join('');
            const body = `${g.note ? `<p class="wh-note"><i class="fas fa-circle-info"></i> ${g.note}</p>` : ''}<div class="wh-grid">${cards}</div>`;
            return g.more
                ? `<details class="wh-group" data-group="${gi}"${picked ? ' open' : ''}><summary><i class="fas ${g.icon}"></i> ${g.title}${picked ? ` <em>${picked}</em>` : ''}<i class="fas fa-chevron-down wh-caret"></i></summary>${body}</details>`
                : `<section class="wh-group" data-group="${gi}"><h4><i class="fas ${g.icon}"></i> ${g.title}</h4>${body}</section>`;
        }).join('');

        host.onclick = e => {
            const t = e.target.closest('[data-toggle], [data-step]');
            if (!t) return;
            const key = t.dataset.toggle || t.dataset.step;
            const item = WarisApp.HEIR_GROUPS.flatMap(g => g.items).find(i => i.key === key);
            let n = counts[key] || 0;
            if (t.dataset.toggle) n = n ? 0 : 1;
            else n = Math.max(1, Math.min(item.max, n + Number(t.dataset.d)));
            counts[key] = n;
            // the deceased leaves either a husband or wives, never both
            if (n && key === 'husband') counts.wife = 0;
            if (n && key === 'wife') counts.husband = 0;
            const open = [...host.querySelectorAll('details[open]')].map(d => d.dataset.group);
            this.updateHeirsData();
            this.renderHeirsForm();
            open.forEach(gi => host.querySelector(`details[data-group="${gi}"]`)?.setAttribute('open', ''));
        };
    }

    // ===== FORM VALIDATION & UPDATES =====
    updateTirkahSummary() {
        const assets = this.parseCurrencyValue(document.getElementById('waris-totalAssets').value);
        const funeral = this.parseCurrencyValue(document.getElementById('waris-funeralCosts').value);
        const debts = this.parseCurrencyValue(document.getElementById('waris-debts').value);
        const wasiat = this.parseCurrencyValue(document.getElementById('waris-wasiat').value);
        
        const deductions = funeral + debts;
        const netBeforeWasiat = assets - deductions;
        const maxWasiat = netBeforeWasiat / 3;
        
        // Validate wasiat
        if (wasiat > maxWasiat) {
            document.getElementById('waris-wasiat').value = Math.floor(maxWasiat);
            return;
        }
        
        const netAssets = netBeforeWasiat - wasiat;
        
        // Update summary
        document.getElementById('waris-summaryAssets').textContent = this.formatCurrency(assets);
        document.getElementById('waris-summaryDeductions').textContent = this.formatCurrency(deductions);
        document.getElementById('waris-summaryWasiat').textContent = this.formatCurrency(wasiat);
        document.getElementById('waris-summaryNet').textContent = this.formatCurrency(netAssets);
        
        // Store data
        this.data.tirkah = { assets, funeral, debts, wasiat, netAssets };
    }

    updateHeirsData() {
        const heirs = {};
        Object.entries(this.heirCounts || {}).forEach(([k, n]) => { if (n > 0) heirs[k] = n; });
        this.data.heirs = heirs;
    }

    // ===== WIZARD NAVIGATION =====
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep === 1) {
                this.currentStep = 2;
                this.updateWizardStep();
                this.scrollToTop();
            }
        }
    }

    previousStep() {
        if (this.currentStep === 2) {
            this.currentStep = 1;
        } else if (this.currentStep === 3) {
            this.currentStep = 2;
        }
        this.updateWizardStep();
        this.scrollToTop();
    }

    updateWizardStep() {
        // Update progress steps
        document.querySelectorAll('.waris-progress-step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            const stepNum = index + 1;
            
            if (stepNum < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNum === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Show/hide wizard steps
        document.querySelectorAll('.waris-wizard-step').forEach((step) => {
            step.classList.remove('active');
            const stepId = step.id;
            const stepNum = parseInt(stepId.replace('waris-step', ''));
            if (stepNum === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update buttons
        const backToHomeBtn = document.getElementById('waris-backToHomeBtn');
        const prevBtn = document.getElementById('waris-prevBtn');
        const nextBtn = document.getElementById('waris-nextBtn');
        const calculateBtn = document.getElementById('waris-calculateBtn');
        const resetBtn = document.getElementById('waris-resetBtn');
        const homeBtn = document.getElementById('waris-homeBtn');
        const favBtn = document.getElementById('waris-favoriteBtn');

        if (backToHomeBtn) backToHomeBtn.style.display = this.currentStep === 1 || this.currentStep === 2 ? 'flex' : 'none';
        if (prevBtn) prevBtn.style.display = this.currentStep > 1 && this.currentStep < 3 ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = this.currentStep === 1 ? 'flex' : 'none';
        if (calculateBtn) calculateBtn.style.display = this.currentStep === 2 ? 'flex' : 'none';
        if (resetBtn) resetBtn.style.display = this.currentStep === 3 ? 'flex' : 'none';
        if (homeBtn) homeBtn.style.display = this.currentStep === 3 ? 'flex' : 'none';
        if (favBtn) favBtn.style.display = this.currentStep === 3 ? 'flex' : 'none';
    }

    scrollToTop() {
        // Scroll calculator content to top
        const calculatorEl = document.getElementById('waris-calculator');
        if (calculatorEl) {
            calculatorEl.scrollTop = 0;
        }
        // Also scroll main content area
        const appContent = document.getElementById('appContent');
        if (appContent) {
            appContent.scrollTop = 0;
        }
        // Scroll window as fallback
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                const assets = this.parseCurrencyValue(document.getElementById('waris-totalAssets').value);
                if (!assets || assets <= 0) {
                    alert(t('waris.alert.invalidAssets'));
                    return false;
                }
                return true;
            case 2:
                if (Object.keys(this.data.heirs).length === 0) {
                    alert(t('waris.alert.chooseHeir'));
                    return false;
                }
                return true;
            default:
                return true;
        }
    }

    // ===== INHERITANCE CALCULATION =====
    calculateInheritance() {
        try {
            const results = this.processInheritanceCalculation();
            this.data.results = results;
            this.displayResults(results);
            this.currentStep = 3;
            this.updateWizardStep();
            this.scrollToTop();
            
            // Show additional buttons
            const homeBtn = document.getElementById('waris-homeBtn');
            const favBtn = document.getElementById('waris-favoriteBtn');
            if (homeBtn) homeBtn.style.display = 'flex';
            if (favBtn) {
                favBtn.style.display = 'flex';
                this.updateFavoriteButton();
            }
        } catch (error) {
            console.error('Calculation error:', error);
            alert(t('waris.alert.calcError'));
        }
    }

    processInheritanceCalculation() {
        const { tirkah, heirs } = this.data;
        const netAssets = tirkah.netAssets;
        const calc = computeFaraid(heirs);

        const results = {
            tirkah: tirkah,
            heirs: calc.shares.map(s => ({
                type: s.type,
                category: s.category,
                count: s.count || 1,
                fraction: s.fraction,
                percentage: s.share.value * 100,
                amount: s.share.value * netAssets,
                condition: s.condition
            })),
            excluded: calc.excluded || [],
            totalPercentage: 0,
            hasAwl: calc.hasAwl,
            hasRadd: calc.hasRadd,
            notes: calc.notes
        };
        results.totalPercentage = results.heirs.reduce((sum, heir) => sum + heir.percentage, 0);
        return results;
    }

    // ===== DISPLAY RESULTS =====
    displayResults(results) {
        const container = document.getElementById('waris-resultsContent');
        if (!container) return;

        let html = '<div class="waris-results-wrapper">';

        // Summary
        html += `
            <div class="waris-result-card waris-summary-card">
                <h4><i class="fas fa-chart-pie"></i> ${t('waris.summary.title')}</h4>
                <div class="waris-summary-grid">
                    <div class="waris-summary-item">
                        <span class="label">${t('waris.summary.totalAssets')}</span>
                        <span class="value">${this.formatCurrency(results.tirkah.assets)}</span>
                    </div>
                    <div class="waris-summary-item">
                        <span class="label">${t('waris.summary.deductions')}</span>
                        <span class="value negative">-${this.formatCurrency(results.tirkah.funeral + results.tirkah.debts)}</span>
                    </div>
                    <div class="waris-summary-item">
                        <span class="label">${t('waris.summary.wasiat')}</span>
                        <span class="value negative">-${this.formatCurrency(results.tirkah.wasiat)}</span>
                    </div>
                    <div class="waris-summary-item highlight">
                        <span class="label">${t('waris.summary.netAssets')}</span>
                        <span class="value">${this.formatCurrency(results.tirkah.netAssets)}</span>
                    </div>
                </div>
            </div>
        `;

        // Donut chart visualization of heir shares
        html += this.renderShareChart(results.heirs);

        // Heirs distribution
        html += `<div class="waris-result-card"><h4><i class="fas fa-users"></i> ${t('waris.results.distributionTitle')}</h4>`;

        results.heirs.forEach(heir => {
            const heirName = this.getHeirName(heir.type);
            const amountPerPerson = heir.amount / heir.count;
            
            html += `
                <div class="waris-heir-item" data-heir="${heir.type}">
                    <div class="waris-heir-header">
                        <span class="waris-heir-avatar" aria-hidden="true"><i class="fas ${this.getHeirIcon(heir.type)}"></i></span>
                        <div class="waris-heir-info">
                            <span class="waris-heir-name">${heirName}</span>
                            <span class="waris-heir-category">${heir.category}</span>
                        </div>
                        <div class="waris-heir-amount">
                            <span class="waris-heir-value">${this.formatCurrency(heir.amount)}</span>
                            <span class="waris-heir-percentage">${heir.percentage.toFixed(2)}%</span>
                        </div>
                    </div>
                    <div class="waris-heir-details">
                        <span class="detail-item"><i class="fas fa-user"></i> ${t('waris.results.personCount', { n: heir.count })}</span>
                        <span class="detail-item"><i class="fas fa-divide"></i> ${heir.fraction}</span>
                        <span class="detail-item"><i class="fas fa-coins"></i> ${t('waris.results.perPerson', { amount: this.formatCurrency(amountPerPerson) })}</span>
                    </div>
                    <div class="waris-heir-condition">${heir.condition}</div>
                </div>
            `;
        });

        html += '</div>';

        // Heirs who receive nothing, and why (hajb)
        if (results.excluded && results.excluded.length) {
            html += `<div class="waris-result-card waris-excluded-card"><h4><i class="fas fa-user-slash"></i> ${t('waris.results.excludedTitle')}</h4>`;
            results.excluded.forEach(x => {
                html += `
                    <div class="waris-excluded-item">
                        <span class="waris-heir-avatar muted" aria-hidden="true"><i class="fas ${this.getHeirIcon(x.type)}"></i></span>
                        <div><strong>${this.getHeirName(x.type)}${x.count > 1 ? ` · ${t('waris.results.personCount', { n: x.count })}` : ''}</strong><span>${x.reason}</span></div>
                    </div>`;
            });
            html += '</div>';
        }

        // Catatan kasus khusus ('awl, radd, Umariyyatan)
        if (results.notes && results.notes.length) {
            html += `<div class="waris-result-card"><h4><i class="fas fa-circle-info"></i> ${t('waris.results.notesTitle')}</h4>`;
            results.notes.forEach(n => { html += `<div class="waris-heir-condition">${n}</div>`; });
            html += '</div>';
        }

        // Dalil
        html += `
            <div class="waris-result-card">
                <h4><i class="fas fa-book-quran"></i> ${t('waris.results.dalilTitle')}</h4>
                <div class="waris-dalil-card">
                    <p class="dalil-arabic">${this.dalilDatabase.ayahQuran["4:11"].arabic}</p>
                    <p class="dalil-translation">${this.dalilDatabase.ayahQuran["4:11"].translation}</p>
                    <p class="dalil-source">QS. An-Nisa: 11</p>
                </div>
                <div class="waris-dalil-card">
                    <p class="dalil-arabic">${this.dalilDatabase.hadith.sahabah.arabic}</p>
                    <p class="dalil-translation">${this.dalilDatabase.hadith.sahabah.translation}</p>
                    <p class="dalil-source">HR. Al-Bukhari & Muslim</p>
                </div>
            </div>
        `;

        html += '</div>';
        container.innerHTML = html;
    }

    renderShareChart(heirs) {
        if (!heirs || heirs.length === 0) return '';

        const sakinah = document.documentElement.dataset.theme !== 'classic';
        const palette = sakinah
            ? ['#1f3d33', '#b08a3e', '#2f7258', '#c07a4a', '#5e8f7a', '#e0c27f', '#40626a', '#8a6a2a', '#9bb8a8', '#d9a777', '#244d40', '#6f7d6a']
            : ['#00ffff', '#ff00ff', '#ffd700', '#00ff88', '#ff6b6b', '#a855f7', '#ff8c42', '#4ade80', '#06b6d4', '#f43f5e', '#facc15', '#22d3ee'];

        const radius = 80;
        const cx = 100, cy = 100;
        const circ = 2 * Math.PI * radius;
        const total = heirs.reduce((s, h) => s + (h.percentage || 0), 0) || 100;

        let offset = 0;
        let segments = '';
        let legend = '';

        heirs.forEach((heir, i) => {
            const ratio = (heir.percentage || 0) / total;
            const dash = circ * ratio;
            const color = palette[i % palette.length];
            const heirName = this.getHeirName(heir.type);

            segments += `
                <circle class="waris-chart-seg" cx="${cx}" cy="${cy}" r="${radius}"
                    fill="none" stroke="${color}" stroke-width="32"
                    stroke-dasharray="${dash} ${circ}"
                    stroke-dashoffset="${-offset}"
                    transform="rotate(-90 ${cx} ${cy})">
                    <title>${heirName} — ${heir.percentage.toFixed(2)}%</title>
                </circle>
            `;

            legend += `
                <div class="waris-chart-legend-item">
                    <span class="waris-chart-swatch" data-sk-keep style="background:${color}"></span>
                    <span class="waris-chart-legend-label">${heirName}</span>
                    <span class="waris-chart-legend-pct">${heir.percentage.toFixed(2)}%</span>
                </div>
            `;

            offset += dash;
        });

        return `
            <div class="waris-result-card waris-chart-card">
                <h4><i class="fas fa-chart-pie"></i> ${t('waris.results.chartTitle')}</h4>
                <div class="waris-chart-wrapper">
                    <svg class="waris-chart-svg" viewBox="0 0 200 200">
                        ${segments}
                        <text x="100" y="95" text-anchor="middle" class="waris-chart-center-num">${heirs.length}</text>
                        <text x="100" y="115" text-anchor="middle" class="waris-chart-center-lbl">${t('waris.results.chartLabel')}</text>
                    </svg>
                    <div class="waris-chart-legend">${legend}</div>
                </div>
            </div>
        `;
    }

    getHeirIcon(type) {
        const item = WarisApp.HEIR_GROUPS.flatMap(g => g.items).find(i => i.key === type);
        if (item) return item.icon;
        return type === 'daughters_with_sons' ? 'fa-child-dress' : 'fa-user';
    }

    getHeirName(type) {
        const item = WarisApp.HEIR_GROUPS.flatMap(g => g.items).find(i => i.key === type);
        if (item) return item.hint ? `${item.label} (${item.hint})` : item.label;
        // results saved by older versions of the calculator
        return { daughters_with_sons: t('waris.heirLabel.daughtersWithSons') }[type] || type;
    }

    formatCurrency(amount) {
        const rounded = Math.round(amount);
        if (this.currency === 'IDR') {
            return 'Rp ' + rounded.toLocaleString(locale());
        }
        return rounded.toLocaleString(locale());
    }

    resetCalculator() {
        // Reset data
        this.data = {
            tirkah: {
                totalAssets: 0,
                funeralCosts: 0,
                debts: 0,
                wasiat: 0,
                netAssets: 0
            },
            heirs: {},
            results: null
        };

        // Reset heirs
        this.heirCounts = {};
        this.renderHeirsForm();

        // Reset to step 1
        this.currentStep = 1;
        this.updateWizardStep();
        this.updateTirkahSummary();
    }
}
