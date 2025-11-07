// ===== Kalkulator Waris IslamHub =====
// Berdasarkan kalkulator_waris standalone app
// Menggunakan Metode Jumhur Ulama

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
            this.showToast('Dihapus dari favorit');
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
            this.showToast('Perhitungan disimpan ke favorit!');
            this.updateFavoriteButton();
        }
    }

    removeFromFavorites(id) {
        this.favorites = this.favorites.filter(f => f.id !== id);
        this.saveFavorites();
        this.showFavorites();
        this.showToast('Dihapus dari favorit');
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
                ? '<i class="fas fa-star"></i> Tersimpan'
                : '<i class="far fa-star"></i> Simpan ke Favorit';
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
                    <h3>Belum Ada Favorit</h3>
                    <p>Simpan perhitungan waris Anda untuk akses cepat di masa mendatang</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.favorites.map(fav => {
            const date = new Date(fav.date).toLocaleDateString('id-ID', {
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
                            <span class="label">Harta Bersih</span>
                            <span class="value">${this.formatCurrency(fav.tirkah.netAssets)}</span>
                        </div>
                        <div class="favorite-heirs">
                            <span class="label"><i class="fas fa-users"></i> ${heirsCount} Ahli Waris</span>
                            <p class="heirs-list">${heirsList}</p>
                        </div>
                    </div>
                    <button class="waris-btn waris-btn-primary" onclick="window.warisApp.loadFavorite(${fav.id})">
                        <i class="fas fa-eye"></i> Lihat Detail
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
                totalAssetsInput.value = data.tirkah.totalAssets.toLocaleString('id-ID');
                console.log('Set totalAssets:', totalAssetsInput.value);
            }
            if (funeralCostsInput) {
                funeralCostsInput.value = data.tirkah.funeralCosts.toLocaleString('id-ID');
                console.log('Set funeralCosts:', funeralCostsInput.value);
            }
            if (debtsInput) {
                debtsInput.value = data.tirkah.debts.toLocaleString('id-ID');
                console.log('Set debts:', debtsInput.value);
            }
            if (wasiatInput) {
                wasiatInput.value = data.tirkah.wasiat.toLocaleString('id-ID');
                console.log('Set wasiat:', wasiatInput.value);
            }
            
            this.updateTirkahSummary();
        }

        // Fill heirs
        if (data.heirs) {
            // Reset all checkboxes and inputs first
            document.querySelectorAll('.waris-wizard-step input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.querySelectorAll('.waris-wizard-step input[type="number"]').forEach(inp => inp.value = '');
            
            // Spouse
            if (data.heirs.husband) {
                const husbandCheckbox = document.getElementById('waris-husband');
                if (husbandCheckbox) husbandCheckbox.checked = true;
            }
            if (data.heirs.wife) {
                const wifeCheckbox = document.getElementById('waris-wife');
                if (wifeCheckbox) wifeCheckbox.checked = true;
                const wifeCount = document.getElementById('waris-wifeCount');
                if (wifeCount) wifeCount.style.display = 'flex';
                const wifeNumberInput = document.getElementById('waris-wifeNumber');
                if (wifeNumberInput) wifeNumberInput.value = data.heirs.wife;
            }

            // Parents
            if (data.heirs.father) {
                const fatherCheckbox = document.getElementById('waris-father');
                if (fatherCheckbox) fatherCheckbox.checked = true;
            }
            if (data.heirs.mother) {
                const motherCheckbox = document.getElementById('waris-mother');
                if (motherCheckbox) motherCheckbox.checked = true;
            }

            // Children
            if (data.heirs.sons) {
                const sonsInput = document.getElementById('waris-sons');
                if (sonsInput) sonsInput.value = data.heirs.sons;
            }
            if (data.heirs.daughters) {
                const daughtersInput = document.getElementById('waris-daughters');
                if (daughtersInput) daughtersInput.value = data.heirs.daughters;
            }

            // Grandchildren
            if (data.heirs.grandsons) {
                const grandsonsInput = document.getElementById('waris-grandsons');
                if (grandsonsInput) grandsonsInput.value = data.heirs.grandsons;
            }
            if (data.heirs.granddaughters) {
                const granddaughtersInput = document.getElementById('waris-granddaughters');
                if (granddaughtersInput) granddaughtersInput.value = data.heirs.granddaughters;
            }

            // Siblings
            if (data.heirs.fullBrothers) {
                const fullBrothersInput = document.getElementById('waris-fullBrothers');
                if (fullBrothersInput) fullBrothersInput.value = data.heirs.fullBrothers;
            }
            if (data.heirs.fullSisters) {
                const fullSistersInput = document.getElementById('waris-fullSisters');
                if (fullSistersInput) fullSistersInput.value = data.heirs.fullSisters;
            }
            if (data.heirs.paternalBrothers) {
                const paternalBrothersInput = document.getElementById('waris-paternalBrothers');
                if (paternalBrothersInput) paternalBrothersInput.value = data.heirs.paternalBrothers;
            }
            if (data.heirs.paternalSisters) {
                const paternalSistersInput = document.getElementById('waris-paternalSisters');
                if (paternalSistersInput) paternalSistersInput.value = data.heirs.paternalSisters;
            }
            if (data.heirs.maternalBrothers) {
                const maternalBrothersInput = document.getElementById('waris-maternalBrothers');
                if (maternalBrothersInput) maternalBrothersInput.value = data.heirs.maternalBrothers;
            }
            if (data.heirs.maternalSisters) {
                const maternalSistersInput = document.getElementById('waris-maternalSisters');
                if (maternalSistersInput) maternalSistersInput.value = data.heirs.maternalSisters;
            }

            // Uncles
            if (data.heirs.paternalUncles) {
                const paternalUnclesInput = document.getElementById('waris-paternalUncles');
                if (paternalUnclesInput) paternalUnclesInput.value = data.heirs.paternalUncles;
            }
            
            this.updateHeirsData();
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
            value = numValue.toLocaleString('id-ID');
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
    setupHeirsInputs() {
        // Spouse selection
        document.querySelectorAll('input[name="waris-spouse"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const wifeCount = document.getElementById('waris-wifeCount');
                if (wifeCount) {
                    wifeCount.style.display = e.target.value === 'wife' ? 'flex' : 'none';
                }
                this.updateHeirsData();
            });
        });

        // Children
        ['sons', 'daughters'].forEach(type => {
            const checkbox = document.querySelector(`input[name="waris-${type}"]`);
            const countDiv = document.getElementById(`waris-${type}Count`);
            const numberInput = document.getElementById(`waris-${type}Number`);
            
            if (checkbox && countDiv) {
                checkbox.addEventListener('change', (e) => {
                    countDiv.style.display = e.target.checked ? 'flex' : 'none';
                    this.updateHeirsData();
                });
            }
            
            if (numberInput) {
                numberInput.addEventListener('input', () => this.updateHeirsData());
            }
        });

        // Parents
        ['father', 'mother'].forEach(heir => {
            const checkbox = document.querySelector(`input[name="waris-${heir}"]`);
            if (checkbox) {
                checkbox.addEventListener('change', () => this.updateHeirsData());
            }
        });
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
        
        // Spouse
        const spouseType = document.querySelector('input[name="waris-spouse"]:checked')?.value;
        if (spouseType) {
            if (spouseType === 'husband') {
                heirs.husband = 1;
            } else {
                const wifeCount = parseInt(document.getElementById('waris-wifeNumber').value) || 1;
                heirs.wife = wifeCount;
            }
        }
        
        // Parents
        if (document.querySelector('input[name="waris-father"]')?.checked) {
            heirs.father = 1;
        }
        if (document.querySelector('input[name="waris-mother"]')?.checked) {
            heirs.mother = 1;
        }
        
        // Children
        if (document.querySelector('input[name="waris-sons"]')?.checked) {
            const count = parseInt(document.getElementById('waris-sonsNumber').value) || 1;
            heirs.sons = count;
        }
        if (document.querySelector('input[name="waris-daughters"]')?.checked) {
            const count = parseInt(document.getElementById('waris-daughtersNumber').value) || 1;
            heirs.daughters = count;
        }
        
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
                    alert('Masukkan total harta yang valid!');
                    return false;
                }
                return true;
            case 2:
                if (Object.keys(this.data.heirs).length === 0) {
                    alert('Pilih minimal satu ahli waris!');
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
            alert('Terjadi kesalahan dalam perhitungan!');
        }
    }

    processInheritanceCalculation() {
        const { tirkah, heirs } = this.data;
        const netAssets = tirkah.netAssets;
        
        const results = {
            tirkah: tirkah,
            heirs: [],
            totalPercentage: 0,
            hasAwl: false,
            hasRadd: false
        };

        // Tentukan ahli waris yang sah
        const validHeirs = this.determineValidHeirs(heirs);
        
        // Hitung bagian Ashabul Furudh
        const furudhShares = this.calculateFurudhShares(validHeirs);
        
        // Total bagian pasti
        const totalFurudh = Object.values(furudhShares).reduce((sum, share) => sum + (share.decimal || 0), 0);
        
        // Handle Awl
        if (totalFurudh > 1) {
            results.hasAwl = true;
            this.applyAwl(furudhShares, totalFurudh);
        }
        
        // Hitung Asabah
        const remainingShare = Math.max(0, 1 - totalFurudh);
        const asabahHeirs = this.calculateAsabah(validHeirs, remainingShare);
        
        // Handle Radd
        if (remainingShare > 0 && asabahHeirs.length === 0 && Object.keys(furudhShares).length > 0) {
            results.hasRadd = true;
            this.applyRadd(furudhShares, remainingShare);
        }
        
        // Susun hasil akhir
        results.heirs = this.compileFinalResults(furudhShares, asabahHeirs, netAssets);
        results.totalPercentage = results.heirs.reduce((sum, heir) => sum + heir.percentage, 0);

        return results;
    }

    determineValidHeirs(heirs) {
        const valid = { ...heirs };
        
        // Aturan Hajb
        const hasChildren = (heirs.sons && heirs.sons > 0) || (heirs.daughters && heirs.daughters > 0);
        const hasFather = heirs.father && heirs.father > 0;
        
        // Anak menghalangi saudara
        if (hasChildren) {
            delete valid.fullBrothers;
            delete valid.fullSisters;
            delete valid.halfBrothers;
            delete valid.halfSisters;
        }
        
        return valid;
    }

    calculateFurudhShares(heirs) {
        const shares = {};
        const rules = this.inheritanceRules.ashabulFurudh;
        
        // Suami/Istri
        if (heirs.husband && heirs.husband > 0) {
            const hasChild = (heirs.sons && heirs.sons > 0) || (heirs.daughters && heirs.daughters > 0);
            shares.husband = hasChild ? rules.spouse.husband.withChild : rules.spouse.husband.withoutChild;
        }
        
        if (heirs.wife && heirs.wife > 0) {
            const hasChild = (heirs.sons && heirs.sons > 0) || (heirs.daughters && heirs.daughters > 0);
            const rule = hasChild ? rules.spouse.wife.withChild : rules.spouse.wife.withoutChild;
            shares.wife = { ...rule, count: heirs.wife };
        }
        
        // Ayah
        if (heirs.father && heirs.father > 0) {
            const hasChild = (heirs.sons && heirs.sons > 0) || (heirs.daughters && heirs.daughters > 0);
            if (hasChild) {
                shares.father = rules.parents.father.withChild;
            }
        }
        
        // Ibu
        if (heirs.mother && heirs.mother > 0) {
            const hasChild = (heirs.sons && heirs.sons > 0) || (heirs.daughters && heirs.daughters > 0);
            
            if (hasChild) {
                shares.mother = rules.parents.mother.withChild;
            } else {
                shares.mother = rules.parents.mother.normal;
            }
        }
        
        // Anak perempuan (tanpa anak laki-laki)
        if (heirs.daughters && heirs.daughters > 0 && (!heirs.sons || heirs.sons === 0)) {
            if (heirs.daughters === 1) {
                shares.daughters = rules.children.daughter.alone;
            } else {
                shares.daughters = { ...rules.children.daughter.withSister, count: heirs.daughters };
            }
        }
        
        return shares;
    }

    calculateAsabah(heirs, remainingShare) {
        const asabahList = [];
        
        if (remainingShare <= 0) return asabahList;
        
        // Anak laki-laki bersama perempuan
        if (heirs.sons > 0) {
            const totalParts = heirs.sons * 2 + (heirs.daughters || 0);
            
            asabahList.push({
                type: 'sons',
                count: heirs.sons,
                shareRatio: 2,
                totalParts: totalParts,
                share: remainingShare
            });
            
            if (heirs.daughters > 0) {
                asabahList.push({
                    type: 'daughters_with_sons',
                    count: heirs.daughters,
                    shareRatio: 1,
                    totalParts: totalParts,
                    share: remainingShare
                });
            }
        }
        // Ayah sebagai asabah
        else if (heirs.father > 0 && heirs.sons === 0) {
            asabahList.push({
                type: 'father',
                count: 1,
                share: remainingShare
            });
        }
        
        return asabahList;
    }

    applyAwl(furudhShares, totalFurudh) {
        Object.keys(furudhShares).forEach(heir => {
            furudhShares[heir].decimal = furudhShares[heir].decimal / totalFurudh;
            furudhShares[heir].isAwl = true;
        });
    }

    applyRadd(furudhShares, remainingShare) {
        const totalCurrentShare = Object.values(furudhShares).reduce((sum, share) => sum + share.decimal, 0);
        
        Object.keys(furudhShares).forEach(heir => {
            const proportionalAdd = (furudhShares[heir].decimal / totalCurrentShare) * remainingShare;
            furudhShares[heir].decimal += proportionalAdd;
            furudhShares[heir].isRadd = true;
        });
    }

    compileFinalResults(furudhShares, asabahHeirs, netAssets) {
        const results = [];
        
        // Ashabul Furudh
        Object.entries(furudhShares).forEach(([heirType, share]) => {
            const amount = share.decimal * netAssets;
            const percentage = share.decimal * 100;
            
            results.push({
                type: heirType,
                category: 'Ashabul Furudh',
                count: share.count || 1,
                fraction: share.fraction,
                percentage: percentage,
                amount: amount,
                condition: share.condition
            });
        });
        
        // Asabah
        asabahHeirs.forEach(heir => {
            let amount, percentage, condition;
            
            if (heir.totalParts) {
                amount = (heir.share * heir.shareRatio / heir.totalParts) * netAssets;
                percentage = (heir.share * heir.shareRatio / heir.totalParts) * 100;
                condition = heir.type === 'sons' ? 'Asabah (2 bagian)' : 'Asabah (1 bagian)';
            } else {
                amount = heir.share * netAssets;
                percentage = heir.share * 100;
                condition = 'Asabah (sisa)';
            }
            
            results.push({
                type: heir.type,
                category: 'Asabah',
                count: heir.count,
                fraction: 'Sisa',
                percentage: percentage,
                amount: amount,
                condition: condition
            });
        });
        
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
                <h4><i class="fas fa-chart-pie"></i> Ringkasan Harta</h4>
                <div class="waris-summary-grid">
                    <div class="waris-summary-item">
                        <span class="label">Total Harta</span>
                        <span class="value">${this.formatCurrency(results.tirkah.assets)}</span>
                    </div>
                    <div class="waris-summary-item">
                        <span class="label">Dikurangi Biaya & Hutang</span>
                        <span class="value negative">-${this.formatCurrency(results.tirkah.funeral + results.tirkah.debts)}</span>
                    </div>
                    <div class="waris-summary-item">
                        <span class="label">Wasiat (max 1/3)</span>
                        <span class="value negative">-${this.formatCurrency(results.tirkah.wasiat)}</span>
                    </div>
                    <div class="waris-summary-item highlight">
                        <span class="label">Harta yang Dibagi</span>
                        <span class="value">${this.formatCurrency(results.tirkah.netAssets)}</span>
                    </div>
                </div>
            </div>
        `;

        // Heirs distribution
        html += `<div class="waris-result-card"><h4><i class="fas fa-users"></i> Pembagian Ahli Waris</h4>`;
        
        results.heirs.forEach(heir => {
            const heirName = this.getHeirName(heir.type);
            const amountPerPerson = heir.amount / heir.count;
            
            html += `
                <div class="waris-heir-item">
                    <div class="waris-heir-header">
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
                        <span class="detail-item"><i class="fas fa-user"></i> ${heir.count} orang</span>
                        <span class="detail-item"><i class="fas fa-divide"></i> ${heir.fraction}</span>
                        <span class="detail-item"><i class="fas fa-coins"></i> ${this.formatCurrency(amountPerPerson)}/orang</span>
                    </div>
                    <div class="waris-heir-condition">${heir.condition}</div>
                </div>
            `;
        });

        html += '</div>';

        // Dalil
        html += `
            <div class="waris-result-card">
                <h4><i class="fas fa-book-quran"></i> Dalil & Penjelasan</h4>
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

    getHeirName(type) {
        const names = {
            husband: 'Suami',
            wife: 'Istri',
            father: 'Ayah',
            mother: 'Ibu',
            sons: 'Anak Laki-laki',
            daughters: 'Anak Perempuan',
            daughters_with_sons: 'Anak Perempuan (dgn saudara laki)'
        };
        return names[type] || type;
    }

    formatCurrency(amount) {
        if (this.currency === 'IDR') {
            return 'Rp ' + amount.toLocaleString('id-ID');
        }
        return amount.toLocaleString();
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

        // Reset form inputs
        document.querySelectorAll('.waris-wizard-step input').forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else if (input.type === 'number') {
                input.value = '';
            }
        });

        // Reset to step 1
        this.currentStep = 1;
        this.updateWizardStep();
        this.updateTirkahSummary();
    }
}
