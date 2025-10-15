// ===== Kalkulator Waris - JavaScript Engine =====
// Menggunakan Metode Jumhur Ulama (Standar Mayoritas)

class WarisCalculator {
    constructor() {
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
        this.lastCalculationResult = null; // Store last calculation for sharing
        
        // Dalil dan Aturan Waris Jumhur
        this.dalilDatabase = this.initializeDalilDatabase();
        this.inheritanceRules = this.initializeInheritanceRules();
        
        this.init();
    }

    init() {
        this.setupServiceWorker();
        this.setupEventListeners();
        this.setupFormValidation();
        this.loadSettings();
        this.hideLoading();
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

    // ===== INHERITANCE RULES (JUMHUR) =====
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
            },
            hajbRules: {
                complete: [
                    { blocker: "son", blocked: ["grandson", "fullBrother", "halfBrotherFather", "paternalUncle"] },
                    { blocker: "father", blocked: ["grandfather", "fullBrother", "halfBrotherFather"] }
                ],
                partial: [
                    { condition: "child", reduces: { father: "1/6", mother: "1/6" } },
                    { condition: "twoOrMoreSiblings", reduces: { mother: "1/6" } }
                ]
            }
        };
    }

    // ===== SERVICE WORKER & PWA =====
    async setupServiceWorker() {
        // Check if running on supported protocol (not file://)
        if (location.protocol === 'file:') {
            return;
        }
        
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                
                // Listen for updates
                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
                        this.showUpdateNotification();
                    }
                });
            } catch (error) {
            }
        }
    }

    showUpdateNotification() {
        const notification = document.getElementById('updateNotification');
        notification.style.display = 'block';
    }

    updateApp() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(registration => {
                if (registration) {
                    registration.update().then(() => {
                        window.location.reload();
                    });
                }
            });
        }
    }

    hideLoading() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1000);
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleCategoryAction(action);
            });
        });

        // Form inputs
        this.setupFormInputs();
        
        // Wizard navigation
        this.setupWizardNavigation();
        
        // Modals
        this.setupModals();
    }

    setupFormInputs() {
        // Tirkah inputs
        ['totalAssets', 'funeralCosts', 'debts', 'wasiat'].forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('input', () => this.updateTirkahSummary());
            }
        });

        // Heirs checkboxes
        this.setupHeirsInputs();
    }

    setupHeirsInputs() {
        // Spouse selection
        document.querySelectorAll('input[name="spouse"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const wifeCount = document.getElementById('wifeCount');
                if (e.target.value === 'wife') {
                    wifeCount.style.display = 'flex';
                } else {
                    wifeCount.style.display = 'none';
                }
                this.updateHeirsData();
            });
        });

        // Children inputs
        ['sons', 'daughters'].forEach(type => {
            const checkbox = document.querySelector(`input[name="${type}"]`);
            const countDiv = document.getElementById(`${type}Count`);
            const numberInput = document.getElementById(`${type}Number`);
            
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

        // Siblings inputs
        ['fullBrothersSisters', 'halfBrothersSisters'].forEach(type => {
            const checkbox = document.querySelector(`input[name="${type}"]`);
            const detailsDiv = document.getElementById(`${type.replace('BrothersSisters', 'SiblingsDetails')}`);
            
            if (checkbox && detailsDiv) {
                checkbox.addEventListener('change', (e) => {
                    detailsDiv.style.display = e.target.checked ? 'block' : 'none';
                    this.updateHeirsData();
                });
            }
        });

        // Maternal siblings
        const maternalCheckbox = document.querySelector('input[name="maternalSiblings"]');
        const maternalCount = document.getElementById('maternalSiblingsCount');
        if (maternalCheckbox && maternalCount) {
            maternalCheckbox.addEventListener('change', (e) => {
                maternalCount.style.display = e.target.checked ? 'flex' : 'none';
                this.updateHeirsData();
            });
        }

        // Other heirs
        ['father', 'mother', 'grandfather', 'grandmother'].forEach(heir => {
            const checkbox = document.querySelector(`input[name="${heir}"]`);
            if (checkbox) {
                checkbox.addEventListener('change', () => this.updateHeirsData());
            }
        });
    }

    setupWizardNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const calculateBtn = document.getElementById('calculateBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousStep());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }

        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateInheritance());
        }
    }

    setupModals() {
        // Info button
        document.getElementById('infoBtn')?.addEventListener('click', () => {
            this.showModal('infoModal');
        });

        // Settings button
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettings();
        });

        // Close modal buttons
        document.querySelectorAll('.btn-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                this.closeModal(modal.id);
            });
        });

        // Click outside modal
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    // ===== NAVIGATION =====
    navigateToSection(section) {
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`[data-section="${section}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // Hide all sections
        const sections = ['hero-section', 'calculator-section', 'examplesSection', 'historySection', 'settingsSection'];
        sections.forEach(sectionClass => {
            const element = document.querySelector(`.${sectionClass}`) || document.getElementById(sectionClass);
            if (element) {
                element.style.display = 'none';
            }
        });

        // Show target section
        switch (section) {
            case 'home':
                const heroSection = document.querySelector('.hero-section');
                if (heroSection) heroSection.style.display = 'block';
                break;
            case 'calculator':
                const calcSection = document.querySelector('.calculator-section');
                if (calcSection) calcSection.style.display = 'block';
                // Reset to step 1 when navigating to calculator from other sections
                this.currentStep = 1;
                // Clear all forms when navigating to calculator
                this.resetAllForms();
                // Reset data object
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
                this.updateWizardStep();
                // Load dalil content for calculator page
                this.loadDalilCalculator();
                break;
            case 'examples':
                const examplesSection = document.getElementById('examplesSection');
                if (examplesSection) examplesSection.style.display = 'block';
                break;
            case 'history':
                const historySection = document.getElementById('historySection');
                if (historySection) {
                    historySection.style.display = 'block';
                    this.loadHistorySection();
                }
                break;
            case 'settings':
                const settingsSection = document.getElementById('settingsSection');
                if (settingsSection) settingsSection.style.display = 'block';
                break;
        }
    }

    handleCategoryAction(action) {
        switch (action) {
            case 'calculate':
                // Reset to step 1 when starting new calculation from home
                this.currentStep = 1;
                this.navigateToSection('calculator');
                break;
            case 'examples':
                this.showExamples();
                break;
            case 'history':
                this.showHistory();
                break;
            case 'dalil':
                this.showDalil();
                break;
        }
    }

    // ===== FORM VALIDATION & UPDATES =====
    updateTirkahSummary() {
        const assets = parseFloat(document.getElementById('totalAssets').value) || 0;
        const funeral = parseFloat(document.getElementById('funeralCosts').value) || 0;
        const debts = parseFloat(document.getElementById('debts').value) || 0;
        const wasiat = parseFloat(document.getElementById('wasiat').value) || 0;
        
        const deductions = funeral + debts;
        const netBeforeWasiat = assets - deductions;
        const maxWasiat = netBeforeWasiat / 3;
        
        // Validate wasiat
        if (wasiat > maxWasiat) {
            this.showToast('Wasiat melebihi 1/3 harta bersih!', 'error');
            document.getElementById('wasiat').value = Math.floor(maxWasiat);
            return;
        }
        
        const netAssets = netBeforeWasiat - wasiat;
        
        // Update summary
        document.getElementById('summaryAssets').textContent = this.formatCurrency(assets);
        document.getElementById('summaryDeductions').textContent = this.formatCurrency(deductions);
        document.getElementById('summaryWasiat').textContent = this.formatCurrency(wasiat);
        document.getElementById('summaryNet').textContent = this.formatCurrency(netAssets);
        
        // Store data
        this.data.tirkah = { assets, funeral, debts, wasiat, netAssets };
    }

    updateHeirsData() {
        const heirs = {};
        
        // Spouse
        const spouseType = document.querySelector('input[name="spouse"]:checked')?.value;
        if (spouseType) {
            if (spouseType === 'husband') {
                heirs.husband = 1;
            } else {
                const wifeCount = parseInt(document.getElementById('wifeNumber').value) || 1;
                heirs.wife = wifeCount;
            }
        }
        
        // Parents
        if (document.querySelector('input[name="father"]')?.checked) {
            heirs.father = 1;
        }
        if (document.querySelector('input[name="mother"]')?.checked) {
            heirs.mother = 1;
        }
        
        // Grandparents
        if (document.querySelector('input[name="grandfather"]')?.checked) {
            heirs.grandfather = 1;
        }
        if (document.querySelector('input[name="grandmother"]')?.checked) {
            heirs.grandmother = 1;
        }
        
        // Children
        if (document.querySelector('input[name="sons"]')?.checked) {
            const count = parseInt(document.getElementById('sonsNumber').value) || 1;
            heirs.sons = count;
        }
        if (document.querySelector('input[name="daughters"]')?.checked) {
            const count = parseInt(document.getElementById('daughtersNumber').value) || 1;
            heirs.daughters = count;
        }
        
        // Siblings
        if (document.querySelector('input[name="fullBrothersSisters"]')?.checked) {
            const brothers = parseInt(document.getElementById('fullBrothersNumber').value) || 0;
            const sisters = parseInt(document.getElementById('fullSistersNumber').value) || 0;
            if (brothers > 0) heirs.fullBrothers = brothers;
            if (sisters > 0) heirs.fullSisters = sisters;
        }
        
        if (document.querySelector('input[name="halfBrothersSisters"]')?.checked) {
            const brothers = parseInt(document.getElementById('halfBrothersNumber').value) || 0;
            const sisters = parseInt(document.getElementById('halfSistersNumber').value) || 0;
            if (brothers > 0) heirs.halfBrothers = brothers;
            if (sisters > 0) heirs.halfSisters = sisters;
        }
        
        if (document.querySelector('input[name="maternalSiblings"]')?.checked) {
            const count = parseInt(document.getElementById('maternalSiblingsNumber').value) || 1;
            heirs.maternalSiblings = count;
        }
        
        this.data.heirs = heirs;
    }

    // ===== WIZARD NAVIGATION =====
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep === 1) {
                this.currentStep = 2; // Step 1 -> Step 2
                this.updateWizardStep();
            }
            // Step 2 tidak ada next, langsung ke calculate
        }
    }

    previousStep() {
        if (this.currentStep === 2) {
            this.currentStep = 1; // Step 2 -> Step 1
        } else if (this.currentStep === 4) {
            this.currentStep = 2; // Step 4 -> Step 2 (skip settings)
        }
        this.updateWizardStep();
    }

    updateWizardStep() {
        // Update progress - map real steps to progress steps
        const progressSteps = [1, 2, 4]; // our actual steps
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const realStep = progressSteps[index];
            step.classList.remove('active', 'completed');
            
            if (realStep < this.currentStep) {
                step.classList.add('completed');
            } else if (realStep === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Show/hide steps based on actual step numbers
        document.querySelectorAll('.wizard-step').forEach((step) => {
            step.classList.remove('active');
            const stepId = step.id;
            const stepNum = parseInt(stepId.replace('step', ''));
            if (stepNum === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const calculateBtn = document.getElementById('calculateBtn');

        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'flex' : 'none';
            prevBtn.disabled = false; // Ensure button is enabled
            prevBtn.style.pointerEvents = 'auto'; // Ensure button can be clicked
        }
        
        if (nextBtn) {
            nextBtn.style.display = this.currentStep === 1 ? 'flex' : 'none';
            nextBtn.disabled = false;
            nextBtn.style.pointerEvents = 'auto';
        }
        
        if (calculateBtn) {
            calculateBtn.style.display = this.currentStep === 2 ? 'flex' : 'none';
            calculateBtn.disabled = false;
            calculateBtn.style.pointerEvents = 'auto';
        }
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                const assets = parseFloat(document.getElementById('totalAssets').value);
                if (!assets || assets <= 0) {
                    this.showToast('Masukkan total harta yang valid!', 'error');
                    return false;
                }
                return true;
            case 2:
                if (Object.keys(this.data.heirs).length === 0) {
                    this.showToast('Pilih minimal satu ahli waris!', 'error');
                    return false;
                }
                return true;
            case 3:
                return true;
            default:
                return true;
        }
    }

    // ===== INHERITANCE CALCULATION ENGINE =====
    calculateInheritance() {
        try {
            this.showLoading('Menghitung waris...');
            
            setTimeout(() => {
                const results = this.processInheritanceCalculation();
                this.data.results = results;
                this.displayResults(results);
                this.currentStep = 4;
                this.updateWizardStep();
                this.hideLoading();
            }, 1000);
            
        } catch (error) {
            console.error('Calculation error:', error);
            this.showToast('Terjadi kesalahan dalam perhitungan!', 'error');
            this.hideLoading();
        }
    }

    processInheritanceCalculation() {
        const { tirkah, heirs } = this.data;
        const netAssets = tirkah.netAssets;
        
        
        // Extract flat heirs data (support both flat and nested structure)
        let flatHeirs = heirs;
        if (heirs && heirs.valid) {
            flatHeirs = heirs.valid;
        }
        
        const results = {
            tirkah: tirkah,
            heirs: [],
            blocked: [],
            steps: [],
            dalil: [],
            totalPercentage: 0,
            hasAwl: false,
            hasRadd: false
        };

        // Langkah 1: Tentukan ahli waris yang sah (tanpa terhalang)
        const validHeirs = this.determineValidHeirsJumhur(flatHeirs);
        
        // Langkah 2: Hitung bagian Ashabul Furudh (yang pasti)
        const furudhShares = this.calculateFurudhSharesJumhur(validHeirs);
        
        // Langkah 3: Tentukan total bagian pasti
        const totalFurudh = Object.values(furudhShares).reduce((sum, share) => sum + (share.decimal || 0), 0);
        
        // Langkah 4: Handle Awl (jika total > 1)
        if (totalFurudh > 1) {
            results.hasAwl = true;
            this.applyAwlJumhur(furudhShares, totalFurudh);
            results.steps.push({
                type: 'awl',
                description: 'Terjadi Awl - pengurangan proporsional karena total bagian melebihi 100%',
                dalil: this.dalilDatabase.principles.awl
            });
        }
        
        // Langkah 5: Hitung Asabah (sisa)
        const remainingShare = Math.max(0, 1 - totalFurudh);
        const asabahHeirs = this.calculateAsabahJumhur(validHeirs, remainingShare);
        
        // Langkah 6: Handle Radd (jika ada sisa dan tidak ada asabah)
        if (remainingShare > 0 && asabahHeirs.length === 0 && Object.keys(furudhShares).length > 0) {
            results.hasRadd = true;
            this.applyRaddJumhur(furudhShares, remainingShare);
            results.steps.push({
                type: 'radd',
                description: 'Terjadi Radd - sisa dikembalikan kepada ashabul furudh',
                dalil: this.dalilDatabase.principles.radd
            });
        }
        
        // Langkah 7: Susun hasil akhir
        results.heirs = this.compileFinalResultsJumhur(furudhShares, asabahHeirs, netAssets);
        results.totalPercentage = results.heirs.reduce((sum, heir) => sum + heir.percentage, 0);
        results.dalil = this.generateDalilJumhur(results.heirs);

        return results;
    }

    // ===== JUMHUR CALCULATION METHODS =====
    determineValidHeirsJumhur(heirs) {
        
        const valid = { ...heirs };
        
        // Aturan Hajb (Penghalangan) menurut Jumhur
        const hasChildren = (heirs.sons && heirs.sons > 0) || (heirs.daughters && heirs.daughters > 0);
        const hasFather = heirs.father && heirs.father > 0;
        const hasGrandchildren = (heirs.grandsons && heirs.grandsons > 0) || (heirs.granddaughters && heirs.granddaughters > 0);
        
        
        // Anak menghalangi saudara, paman, dan cucu
        if (hasChildren) {
            delete valid.fullBrothers;
            delete valid.fullSisters;
            delete valid.halfBrothers;
            delete valid.halfSisters;
            delete valid.maternalSiblings;
            delete valid.paternalUncles;
            delete valid.grandsons;
            delete valid.granddaughters;
        }
        
        // Ayah menghalangi kakek dan saudara
        if (hasFather) {
            delete valid.grandfather;
            delete valid.fullBrothers;
            delete valid.fullSisters;
            delete valid.halfBrothers;
            delete valid.halfSisters;
            delete valid.paternalUncles;
        }
        
        // Ibu menghalangi nenek
        if (heirs.mother > 0) {
            delete valid.grandmother;
        }
        
        return valid;
    }

    calculateFurudhSharesJumhur(heirs) {
        const shares = {};
        const rules = this.inheritanceRules.ashabulFurudh;
        
        // Suami/Istri
        if (heirs.husband && heirs.husband > 0) {
            const hasChild = (heirs.sons && heirs.sons > 0) || (heirs.daughters && heirs.daughters > 0) || (heirs.grandsons && heirs.grandsons > 0) || (heirs.granddaughters && heirs.granddaughters > 0);
            shares.husband = hasChild ? rules.spouse.husband.withChild : rules.spouse.husband.withoutChild;
        }
        
        if (heirs.wife && heirs.wife > 0) {
            const hasChild = (heirs.sons && heirs.sons > 0) || (heirs.daughters && heirs.daughters > 0) || (heirs.grandsons && heirs.grandsons > 0) || (heirs.granddaughters && heirs.granddaughters > 0);
            const rule = hasChild ? rules.spouse.wife.withChild : rules.spouse.wife.withoutChild;
            shares.wife = { ...rule, count: heirs.wife };
        }
        
        // Ayah
        if (heirs.father && heirs.father > 0) {
            const hasChild = (heirs.sons && heirs.sons > 0) || (heirs.daughters && heirs.daughters > 0);
            if (hasChild) {
                shares.father = rules.parents.father.withChild;
            }
            // Jika tidak ada anak, ayah menjadi asabah
        }
        
        // Ibu
        if (heirs.mother && heirs.mother > 0) {
            const hasChild = (heirs.sons && heirs.sons > 0) || (heirs.daughters && heirs.daughters > 0) || (heirs.grandsons && heirs.grandsons > 0) || (heirs.granddaughters && heirs.granddaughters > 0);
            const siblingsCount = (heirs.fullBrothers || 0) + (heirs.fullSisters || 0) + (heirs.halfBrothers || 0) + (heirs.halfSisters || 0);
            
            if (hasChild || siblingsCount >= 2) {
                shares.mother = rules.parents.mother.withChild;
            } else {
                shares.mother = rules.parents.mother.normal;
            }
        }
        
        // Anak perempuan
        if (heirs.daughters && heirs.daughters > 0 && (!heirs.sons || heirs.sons === 0)) {
            if (heirs.daughters === 1) {
                shares.daughters = rules.children.daughter.alone;
            } else {
                shares.daughters = { ...rules.children.daughter.withSister, count: heirs.daughters };
            }
        }
        
        return shares;
    }

    calculateAsabahJumhur(heirs, remainingShare) {
        const asabahList = [];
        
        if (remainingShare <= 0) return asabahList;
        
        // Urutan Asabah menurut Jumhur: Anak laki-laki, Ayah, Kakek, Saudara laki-laki, dst
        
        // Anak laki-laki bersama perempuan
        if (heirs.sons > 0) {
            const totalChildren = heirs.sons + (heirs.daughters || 0);
            const totalParts = heirs.sons * 2 + (heirs.daughters || 0); // Laki-laki = 2 bagian, Perempuan = 1 bagian
            
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
        // Ayah sebagai asabah (jika tidak ada anak laki-laki)
        else if (heirs.father > 0 && heirs.sons === 0) {
            asabahList.push({
                type: 'father',
                count: 1,
                share: remainingShare
            });
        }
        // Kakek sebagai asabah (jika tidak ada ayah dan anak laki-laki)
        else if (heirs.grandfather > 0 && heirs.father === 0 && heirs.sons === 0) {
            asabahList.push({
                type: 'grandfather',
                count: 1,
                share: remainingShare
            });
        }
        
        return asabahList;
    }

    applyAwlJumhur(furudhShares, totalFurudh) {
        // Kurangi semua bagian secara proporsional
        Object.keys(furudhShares).forEach(heir => {
            furudhShares[heir].decimal = furudhShares[heir].decimal / totalFurudh;
            furudhShares[heir].isAwl = true;
        });
    }

    applyRaddJumhur(furudhShares, remainingShare) {
        const heirCount = Object.keys(furudhShares).length;
        if (heirCount === 0) return;
        
        // Distribusikan sisa secara proporsional kepada ashabul furudh
        const totalCurrentShare = Object.values(furudhShares).reduce((sum, share) => sum + share.decimal, 0);
        
        Object.keys(furudhShares).forEach(heir => {
            const proportionalAdd = (furudhShares[heir].decimal / totalCurrentShare) * remainingShare;
            furudhShares[heir].decimal += proportionalAdd;
            furudhShares[heir].isRadd = true;
        });
    }

    compileFinalResultsJumhur(furudhShares, asabahHeirs, netAssets) {
        const results = [];
        
        // Tambahkan Ashabul Furudh
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
                condition: share.condition,
                dalil: this.getDalilForHeir(heirType),
                isAwl: share.isAwl || false,
                isRadd: share.isRadd || false
            });
        });
        
        // Tambahkan Asabah
        asabahHeirs.forEach(heir => {
            let amount, percentage, condition;
            
            if (heir.totalParts) {
                // Untuk anak-anak dengan rasio 2:1
                amount = (heir.share * heir.shareRatio / heir.totalParts) * netAssets;
                percentage = (heir.share * heir.shareRatio / heir.totalParts) * 100;
                
                // Berikan penjelasan spesifik untuk setiap jenis asabah
                if (heir.type === 'sons') {
                    condition = 'Menghabiskan sisa (2 bagian dari rasio 2:1)';
                } else if (heir.type === 'daughters_with_sons') {
                    condition = 'Menghabiskan sisa (1 bagian dari rasio 2:1)';
                } else {
                    condition = 'Menghabiskan sisa';
                }
            } else {
                amount = heir.share * netAssets;
                percentage = heir.share * 100;
                condition = 'Menghabiskan sisa';
            }
            
            results.push({
                type: heir.type,
                category: 'Asabah',
                count: heir.count,
                fraction: 'Sisa',
                percentage: percentage,
                amount: amount,
                condition: condition,
                dalil: this.getDalilForHeir(heir.type),
                isAsabah: true
            });
        });
        
        return results;
    }

    getDalilForHeir(heirType) {
        const dalilMap = {
            husband: { ayah: "4:12", hadith: "sahabah" },
            wife: { ayah: "4:12", hadith: "sahabah" },
            father: { ayah: "4:11", hadith: "sahabah" },
            mother: { ayah: "4:11", hadith: "sahabah" },
            daughters: { ayah: "4:11", hadith: "sahabah" },
            sons: { ayah: "4:11", hadith: "sahabah" }
        };
        
        return dalilMap[heirType] || { ayah: "4:11", hadith: "sahabah" };
    }

    generateDalilJumhur(heirs) {
        const dalilList = [];
        const addedAyahs = new Set();
        
        // Tambahkan ayat-ayat Al-Quran yang relevan
        heirs.forEach(heir => {
            const dalil = heir.dalil;
            if (dalil.ayah && this.dalilDatabase.ayahQuran[dalil.ayah] && !addedAyahs.has(dalil.ayah)) {
                dalilList.push({
                    type: 'quran',
                    arabic: this.dalilDatabase.ayahQuran[dalil.ayah].arabic,
                    translation: this.dalilDatabase.ayahQuran[dalil.ayah].translation,
                    source: `QS. An-Nisa: ${dalil.ayah}`,
                    relevantTo: heir.type
                });
                addedAyahs.add(dalil.ayah);
            }
        });
        
        // Tambahkan hadith umum tentang waris
        dalilList.push({
            type: 'hadith',
            arabic: this.dalilDatabase.hadith.sahabah.arabic,
            translation: this.dalilDatabase.hadith.sahabah.translation,
            source: 'Hadits Riwayat Al-Bukhari dan Muslim dari Ibn Abbas r.a.'
        });

        // Tambahkan penjelasan prinsip-prinsip waris
        dalilList.push({
            type: 'principle',
            arabic: 'فَرَائِضُ اللَّهِ وَحُدُودُهُ',
            translation: 'Kewajiban-kewajiban Allah dan batasan-batasan-Nya dalam pembagian waris',
            source: 'Prinsip Fiqh Mawaris menurut Jumhur Ulama'
        });
        
        return dalilList;
    }

    getDefaultDalil() {
        return [
            {
                type: 'quran',
                arabic: 'يُوصِيكُمُ اللّهُ فِي أَوْلاَدِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الأُنثَيَيْنِ فَإِن كُنَّ نِسَاء فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ',
                translation: 'Allah mewasiatkan kepadamu tentang (pembagian pusaka untuk) anak-anakmu. Yaitu: bahagian seorang anak lelaki sama dengan bagahian dua orang anak perempuan. Jika anak itu semuanya perempuan lebih dari dua, maka bagi mereka dua pertiga dari harta yang ditinggalkan. Jika anak perempuan itu seorang saja, maka ia memperoleh seperdua harta.',
                source: 'QS. An-Nisa: 11',
                explanation: 'Ayat ini adalah fondasi utama hukum waris Islam yang mengatur pembagian untuk anak-anak. Prinsip 2:1 (laki-laki : perempuan) didasarkan pada tanggung jawab finansial yang berbeda dalam Islam.'
            },
            {
                type: 'quran',
                arabic: 'وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ فَإِن كَانَ لَهُنَّ وَلَدٌ فَلَكُمُ الرُّبُعُ مِمَّا تَرَكْنَ مِن بَعْدِ وَصِيَّةٍ يُوصِينَ بِهَا أَوْ دَيْنٍ',
                translation: 'Dan bagimu (suami-suami) seperdua dari harta yang ditinggalkan oleh isteri-isterimu, jika mereka tidak mempunyai anak. Jika isteri-isterimu itu mempunyai anak, maka kamu mendapat seperempat dari harta yang ditinggalkannya, sesudah dipenuhi wasiat yang mereka buat atau (dan) sesudah dibayar hutangnya.',
                source: 'QS. An-Nisa: 12',
                explanation: 'Ayat ini mengatur bagian suami dan juga menetapkan bahwa wasiat dan hutang harus dilunasi terlebih dahulu sebelum pembagian waris.'
            },
            {
                type: 'quran',
                arabic: 'وَلَهُنَّ الرُّبُعُ مِمَّا تَرَكْتُمْ إِن لَّمْ يَكُن لَّكُمْ وَلَدٌ فَإِن كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُّمُنُ مِمَّا تَرَكْتُم مِّن بَعْدِ وَصِيَّةٍ تُوصُونَ بِهَا أَوْ دَيْنٍ',
                translation: 'Para isteri memperoleh seperempat harta yang kamu tinggalkan jika kamu tidak mempunyai anak. Jika kamu mempunyai anak, maka para isteri memperoleh seperdelapan dari harta yang kamu tinggalkan sesudah dipenuhi wasiat yang kamu buat atau (dan) sesudah dibayar hutang-hutangmu.',
                source: 'QS. An-Nisa: 12',
                explanation: 'Lanjutan ayat sebelumnya yang mengatur bagian istri dari harta suami. Bagian berkurang jika ada anak karena anak juga berhak atas harta ayahnya.'
            },
            {
                type: 'quran',
                arabic: 'وَلأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُ وَلَدٌ فَإِن لَّمْ يَكُن لَّهُ وَلَدٌ وَوَرِثَهُ أَبَوَاهُ فَلأُمِّهِ الثُّلُثُ',
                translation: 'Dan untuk dua orang ibu-bapa, bagi masing-masingnya seperenam dari harta yang ditinggalkan, jika yang meninggal itu mempunyai anak. Jika orang yang meninggal tidak mempunyai anak dan ia diwarisi oleh ibu-bapanya (saja), maka ibunya mendapat sepertiga.',
                source: 'QS. An-Nisa: 11',
                explanation: 'Ayat ini mengatur bagian orang tua. Ayah dan ibu masing-masing mendapat 1/6 jika ada anak, tetapi ibu mendapat 1/3 jika tidak ada anak.'
            },
            {
                type: 'hadith',
                arabic: 'أعطوا الفرائض أهلها، فما بقي فلأولى رجل ذكر',
                translation: 'Berikanlah faraidh kepada ahlinya, maka apa yang tersisa adalah untuk laki-laki terdekat (asabah).',
                source: 'Hadits Riwayat Al-Bukhari dan Muslim dari Ibn Abbas r.a.',
                explanation: 'Hadits fundamental yang menetapkan sistem pembagian waris Islam: pertama ashabul furudh (bagian tetap), kemudian asabah (ahli waris sisa).'
            },
            {
                type: 'hadith',
                arabic: 'إن الله قد أعطى كل ذي حق حقه، فلا وصية لوارث',
                translation: 'Sesungguhnya Allah telah memberikan kepada setiap yang berhak haknya, maka tidak ada wasiat untuk ahli waris.',
                source: 'Hadits Riwayat Abu Dawud dan At-Tirmidzi',
                explanation: 'Hadits ini menegaskan bahwa bagian waris sudah ditetapkan Allah, sehingga tidak boleh ada wasiat khusus untuk ahli waris yang dapat mengubah pembagian yang telah ditentukan.'
            },
            {
                type: 'principle',
                arabic: 'تِلْكَ حُدُودُ اللّهِ وَمَن يُطِعِ اللّهَ وَرَسُولَهُ يُدْخِلْهُ جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الأَنْهَارُ خَالِدِينَ فِيهَا وَذَلِكَ الْفَوْزُ الْعَظِيمُ',
                translation: 'Itulah ketentuan-ketentuan Allah. Barangsiapa taat kepada Allah dan Rasul-Nya, niscaya Allah memasukkannya ke dalam surga yang mengalir di bawahnya sungai-sungai, sedang mereka kekal di dalamnya; dan itulah kemenangan yang besar.',
                source: 'QS. An-Nisa: 13',
                explanation: 'Ayat penutup dari ayat-ayat waris yang menegaskan bahwa mengikuti hukum waris Islam dengan benar adalah ketaatan kepada Allah dan akan mendapat pahala surga.'
            },
            {
                type: 'principle',
                arabic: 'وَمَن يَعْصِ اللّهَ وَرَسُولَهُ وَيَتَعَدَّ حُدُودَهُ يُدْخِلْهُ نَارًا خَالِدًا فِيهَا وَلَهُ عَذَابٌ مُّهِينٌ',
                translation: 'Dan barangsiapa yang mendurhakai Allah dan Rasul-Nya dan melanggar ketentuan-ketentuan-Nya, niscaya Allah memasukkannya ke dalam api neraka sedang ia kekal di dalamnya; dan baginya siksa yang menghinakan.',
                source: 'QS. An-Nisa: 14',
                explanation: 'Peringatan keras bagi yang melanggar hukum waris Islam. Ini menunjukkan betapa pentingnya mengikuti aturan pembagian waris yang telah ditetapkan Allah.'
            }
        ];
    }

    determineValidHeirs(heirs) {
        const valid = {};
        
        // Copy all heirs first
        Object.assign(valid, heirs);
        
        // Apply blocking rules
        const hasChildren = heirs.sons || heirs.daughters;
        const hasFather = heirs.father;
        
        // Children block siblings
        if (hasChildren) {
            delete valid.fullBrothers;
            delete valid.fullSisters;
            delete valid.halfBrothers;
            delete valid.halfSisters;
            delete valid.maternalSiblings;
        }
        
        // Father blocks grandfather
        if (hasFather) {
            delete valid.grandfather;
        }
        
        // Mother blocks grandmother
        if (heirs.mother) {
            delete valid.grandmother;
        }
        
        return valid;
    }

    determineBlockedHeirs(originalHeirs, validHeirs) {
        const blocked = [];
        
        Object.keys(originalHeirs).forEach(heirType => {
            if (!validHeirs[heirType]) {
                let reason = '';
                let dalil = '';
                
                if (['fullBrothers', 'fullSisters', 'halfBrothers', 'halfSisters', 'maternalSiblings'].includes(heirType)) {
                    reason = 'Dihalangi oleh anak (hijab)';
                    dalil = 'الأولاد يحجبون الإخوة - Anak menghalangi saudara (Ijma\' sahabat)';
                } else if (heirType === 'grandfather' && originalHeirs.father) {
                    reason = 'Dihalangi oleh ayah';
                    dalil = 'الأب يحجب الجد - Ayah menghalangi kakek (Ijma\' sahabat)';
                } else if (heirType === 'grandmother' && originalHeirs.mother) {
                    reason = 'Dihalangi oleh ibu';
                    dalil = 'الأم تحجب الجدة - Ibu menghalangi nenek (Ijma\' sahabat)';
                }
                
                blocked.push({
                    type: heirType,
                    count: originalHeirs[heirType].count,
                    reason,
                    dalil
                });
            }
        });
        
        return blocked;
    }

    calculateFurudhShares(heirs) {
        const shares = {};
        const hasChildren = heirs.sons || heirs.daughters;
        const hasSons = heirs.sons;
        
        // Husband
        if (heirs.husband) {
            const fraction = hasChildren ? 0.25 : 0.5; // 1/4 or 1/2
            shares.husband = {
                fraction,
                type: 'furudh',
                dalil: {
                    ayah: 'وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ',
                    translation: hasChildren 
                        ? 'Suami mendapat 1/4 jika ada anak/cucu' 
                        : 'Suami mendapat 1/2 jika tidak ada anak/cucu',
                    source: 'QS. An-Nisa 4:12'
                }
            };
        }
        
        // Wife/Wives
        if (heirs.wife) {
            const fraction = hasChildren ? 0.125 : 0.25; // 1/8 or 1/4
            shares.wife = {
                fraction,
                count: heirs.wife.count,
                type: 'furudh',
                dalil: {
                    ayah: 'وَلَهُنَّ الرُّبُعُ مِمَّا تَرَكْتُمْ إِن لَّمْ يَكُن لَّكُمْ وَلَدٌ',
                    translation: hasChildren 
                        ? 'Istri mendapat 1/8 jika ada anak/cucu' 
                        : 'Istri mendapat 1/4 jika tidak ada anak/cucu',
                    source: 'QS. An-Nisa 4:12'
                }
            };
        }
        
        // Mother
        if (heirs.mother) {
            let fraction;
            const hasMultipleSiblings = this.hasMultipleSiblings(heirs);
            
            if (hasChildren || hasMultipleSiblings) {
                fraction = 1/6;
            } else {
                fraction = 1/3;
            }
            
            shares.mother = {
                fraction,
                type: 'furudh',
                dalil: {
                    ayah: 'وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُ وَلَدٌ',
                    translation: hasChildren || hasMultipleSiblings 
                        ? 'Ibu mendapat 1/6 jika ada anak atau beberapa saudara'
                        : 'Ibu mendapat 1/3 jika tidak ada anak dan tidak ada beberapa saudara',
                    source: 'QS. An-Nisa 4:11'
                }
            };
        }
        
        // Father
        if (heirs.father) {
            if (hasChildren) {
                shares.father = {
                    fraction: 1/6,
                    type: 'furudh_asabah',
                    dalil: {
                        ayah: 'وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ',
                        translation: 'Ayah mendapat 1/6 jika ada anak, plus sisa sebagai asabah',
                        source: 'QS. An-Nisa 4:11 dan praktik sahabat'
                    }
                };
            } else {
                shares.father = {
                    fraction: 0,
                    type: 'asabah',
                    dalil: {
                        ayah: 'الأب عصبة إذا لم يكن للميت ولد',
                        translation: 'Ayah sebagai asabah (mengambil sisa) jika tidak ada anak',
                        source: 'Kaidah faraidh dari sahabat'
                    }
                };
            }
        }
        
        // Daughters (without sons)
        if (heirs.daughters && !hasSons) {
            const count = heirs.daughters.count;
            const fraction = count === 1 ? 0.5 : (2/3);
            
            shares.daughters = {
                fraction,
                count,
                type: 'furudh',
                dalil: {
                    ayah: 'وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ',
                    translation: count === 1 
                        ? 'Anak perempuan tunggal mendapat 1/2'
                        : 'Dua atau lebih anak perempuan mendapat 2/3',
                    source: 'QS. An-Nisa 4:11'
                }
            };
        }
        
        // Sons and daughters (together) - handled in asabah
        
        // Maternal siblings (kalalah only)
        if (heirs.maternalSiblings && !heirs.father && !hasChildren) {
            const count = heirs.maternalSiblings.count;
            const fraction = count === 1 ? (1/6) : (1/3);
            
            shares.maternalSiblings = {
                fraction,
                count,
                type: 'furudh',
                dalil: {
                    ayah: 'وَإِن كَانَ رَجُلٌ يُورَثُ كَلَالَةً أَوِ امْرَأَةٌ وَلَهُ أَخٌ أَوْ أُخْتٌ',
                    translation: count === 1 
                        ? 'Saudara seibu tunggal mendapat 1/6'
                        : 'Beberapa saudara seibu mendapat 1/3',
                    source: 'QS. An-Nisa 4:12'
                }
            };
        }
        
        // Full sisters (kalalah only, without full brothers)
        if (heirs.fullSisters && !heirs.fullBrothers && !heirs.father && !hasChildren) {
            const count = heirs.fullSisters.count;
            const fraction = count === 1 ? 0.5 : (2/3);
            
            shares.fullSisters = {
                fraction,
                count,
                type: 'furudh',
                dalil: {
                    ayah: 'يَسْتَفْتُونَكَ قُلِ اللَّهُ يُفْتِيكُمْ فِي الْكَلَالَةِ',
                    translation: count === 1 
                        ? 'Saudari kandung tunggal mendapat 1/2 (kalalah)'
                        : 'Beberapa saudari kandung mendapat 2/3 (kalalah)',
                    source: 'QS. An-Nisa 4:176'
                }
            };
        }
        
        return shares;
    }

    hasMultipleSiblings(heirs) {
        let totalSiblings = 0;
        
        if (heirs.fullBrothers) totalSiblings += heirs.fullBrothers.count;
        if (heirs.fullSisters) totalSiblings += heirs.fullSisters.count;
        if (heirs.halfBrothers) totalSiblings += heirs.halfBrothers.count;
        if (heirs.halfSisters) totalSiblings += heirs.halfSisters.count;
        if (heirs.maternalSiblings) totalSiblings += heirs.maternalSiblings.count;
        
        return totalSiblings >= 2;
    }

    applyAwl(furudhShares, totalFurudh) {
        // Proportional reduction
        Object.keys(furudhShares).forEach(heirType => {
            furudhShares[heirType].originalFraction = furudhShares[heirType].fraction;
            furudhShares[heirType].fraction = furudhShares[heirType].fraction / totalFurudh;
        });
    }

    calculateAsabah(heirs, furudhShares, netAssets) {
        const asabahHeirs = [];
        const furudhTotal = Object.values(furudhShares).reduce((sum, share) => sum + share.fraction, 0);
        const remainingFraction = Math.max(0, 1 - furudhTotal);
        
        // Sons and daughters together
        if (heirs.sons || (heirs.daughters && heirs.sons)) {
            const sons = heirs.sons ? heirs.sons.count : 0;
            const daughters = heirs.daughters ? heirs.daughters.count : 0;
            const totalShares = sons * 2 + daughters; // Male gets 2, female gets 1
            
            if (sons > 0) {
                asabahHeirs.push({
                    type: 'sons',
                    count: sons,
                    fraction: (sons * 2 / totalShares) * remainingFraction,
                    sharePerPerson: (2 / totalShares) * remainingFraction,
                    dalil: {
                        ayah: 'لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ',
                        translation: 'Anak laki-laki mendapat bagian seperti dua anak perempuan',
                        source: 'QS. An-Nisa 4:11'
                    }
                });
            }
            
            if (daughters > 0 && sons > 0) {
                asabahHeirs.push({
                    type: 'daughters',
                    count: daughters,
                    fraction: (daughters / totalShares) * remainingFraction,
                    sharePerPerson: (1 / totalShares) * remainingFraction,
                    dalil: {
                        ayah: 'لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ',
                        translation: 'Anak perempuan bersama anak laki-laki sebagai asabah',
                        source: 'QS. An-Nisa 4:11'
                    }
                });
            }
        }
        
        // Father as asabah (if no furudh portion or additional)
        if (heirs.father && !heirs.sons && !heirs.daughters) {
            asabahHeirs.push({
                type: 'father',
                count: 1,
                fraction: remainingFraction,
                dalil: {
                    ayah: 'الأب عصبة بنفسه',
                    translation: 'Ayah sebagai asabah mengambil sisa',
                    source: 'Kaidah faraidh'
                }
            });
        }
        
        // Full brothers and sisters (kalalah)
        if ((heirs.fullBrothers || heirs.fullSisters) && !heirs.father && !heirs.sons && !heirs.daughters) {
            const brothers = heirs.fullBrothers ? heirs.fullBrothers.count : 0;
            const sisters = heirs.fullSisters ? heirs.fullSisters.count : 0;
            const totalShares = brothers * 2 + sisters;
            
            if (brothers > 0) {
                asabahHeirs.push({
                    type: 'fullBrothers',
                    count: brothers,
                    fraction: (brothers * 2 / totalShares) * remainingFraction,
                    dalil: {
                        ayah: 'الإخوة الأشقاء عصبة',
                        translation: 'Saudara kandung laki-laki sebagai asabah',
                        source: 'Kaidah faraidh'
                    }
                });
            }
            
            if (sisters > 0 && brothers > 0) {
                asabahHeirs.push({
                    type: 'fullSisters',
                    count: sisters,
                    fraction: (sisters / totalShares) * remainingFraction,
                    dalil: {
                        ayah: 'الأخوات الشقيقات مع الإخوة عصبة',
                        translation: 'Saudari kandung bersama saudara laki-laki sebagai asabah',
                        source: 'Kaidah faraidh'
                    }
                });
            }
        }
        
        return asabahHeirs;
    }

    applyRadd(furudhShares, method) {
        const excludeFromRadd = method === 'jumhur' ? ['husband', 'wife'] : [];
        const eligibleHeirs = Object.keys(furudhShares).filter(heir => !excludeFromRadd.includes(heir));
        
        if (eligibleHeirs.length > 0) {
            const totalEligibleFraction = eligibleHeirs.reduce((sum, heir) => sum + furudhShares[heir].fraction, 0);
            const raddMultiplier = 1 / totalEligibleFraction;
            
            eligibleHeirs.forEach(heir => {
                furudhShares[heir].originalFraction = furudhShares[heir].fraction;
                furudhShares[heir].fraction = furudhShares[heir].fraction * raddMultiplier;
                furudhShares[heir].hasRadd = true;
            });
        }
    }

    calculateTotalShares(furudhShares, asabahHeirs) {
        const furudhTotal = Object.values(furudhShares).reduce((sum, share) => sum + share.fraction, 0);
        const asabahTotal = asabahHeirs.reduce((sum, heir) => sum + heir.fraction, 0);
        return furudhTotal + asabahTotal;
    }

    compileFinalResults(furudhShares, asabahHeirs, netAssets) {
        const results = [];
        
        // Add furudh heirs
        Object.entries(furudhShares).forEach(([type, data]) => {
            const amount = data.fraction * netAssets;
            const percentage = data.fraction * 100;
            
            results.push({
                type,
                name: this.getHeirDisplayName(type),
                count: data.count || 1,
                status: data.type,
                fraction: this.fractionToString(data.fraction),
                percentage: percentage,
                amount: Math.round(amount),
                dalil: data.dalil,
                hasAwl: !!data.originalFraction,
                hasRadd: !!data.hasRadd
            });
        });
        
        // Add asabah heirs
        asabahHeirs.forEach(heir => {
            const amount = heir.fraction * netAssets;
            const percentage = heir.fraction * 100;
            
            results.push({
                type: heir.type,
                name: this.getHeirDisplayName(heir.type),
                count: heir.count,
                status: 'asabah',
                fraction: this.fractionToString(heir.fraction),
                percentage: percentage,
                amount: Math.round(amount),
                dalil: heir.dalil
            });
        });
        
        return results.sort((a, b) => b.amount - a.amount);
    }

    getHeirDisplayName(type) {
        const names = {
            husband: 'Suami',
            wife: 'Istri',
            father: 'Ayah',
            mother: 'Ibu',
            grandfather: 'Kakek',
            grandmother: 'Nenek',
            sons: 'Anak Laki-laki',
            daughters: 'Anak Perempuan',
            daughters_with_sons: 'Anak Perempuan',
            fullBrothers: 'Saudara Kandung (L)',
            fullSisters: 'Saudari Kandung (P)',
            halfBrothers: 'Saudara Seayah (L)',
            halfSisters: 'Saudari Seayah (P)',
            maternalSiblings: 'Saudara Seibu'
        };
        return names[type] || type;
    }

    fractionToString(decimal) {
        // Convert decimal to fraction string
        const tolerance = 1e-9;
        const fractions = [
            [1, 1], [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], 
            [1, 6], [5, 6], [1, 8], [3, 8], [5, 8], [7, 8]
        ];
        
        for (const [num, den] of fractions) {
            if (Math.abs(decimal - num/den) < tolerance) {
                return `${num}/${den}`;
            }
        }
        
        return decimal.toFixed(4);
    }

    generateDalil(heirs) {
        const dalil = [];
        
        heirs.forEach(heir => {
            if (heir.dalil) {
                dalil.push({
                    heir: heir.name,
                    arabic: heir.dalil.ayah || '',
                    translation: heir.dalil.translation,
                    source: heir.dalil.source,
                    type: heir.status
                });
            }
        });
        
        return dalil;
    }

    // ===== RESULTS DISPLAY =====
    displayResults(results) {
        // Store the last calculation result for sharing
        this.lastCalculationResult = results;
        
        const container = document.getElementById('resultsContainer');
        container.innerHTML = this.generateResultsHTML(results);
        
        // Setup result interactions
        this.setupResultsInteractions();
    }

    generateResultsHTML(results) {
        let html = `
            <div class="result-card">
                <div class="result-header">
                    <h3 class="result-title">
                        <i class="fas fa-chart-pie"></i>
                        Hasil Perhitungan Waris
                    </h3>
                    <div class="result-actions-inline">
                        <button class="result-copy" onclick="app.copyResults()" title="Salin ke clipboard">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="result-share" onclick="app.shareResults()" title="Bagikan hasil">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="tirkah-summary">
                    <h4>Ringkasan Tirkah</h4>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span>Harta Bersih untuk Waris:</span>
                            <span class="amount">${this.formatCurrency(results.tirkah.netAssets)}</span>
                        </div>
                    </div>
                </div>
                
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Ahli Waris</th>
                            <th>Status</th>
                            <th>Bagian</th>
                            <th>Persentase</th>
                            <th>Nominal</th>
                        </tr>
                    </thead>
                    <tbody>`;
        
        results.heirs.forEach(heir => {
            const statusBadge = this.getStatusBadge(heir.category.toLowerCase().replace(' ', '_'));
            const countText = heir.count > 1 ? ` (${heir.count} orang)` : '';
            const heirName = this.getHeirDisplayName(heir.type);
            
            html += `
                <tr>
                    <td>
                        <div class="heir-name">${heirName}${countText}</div>
                        <div class="heir-condition" style="font-size: 0.8rem; color: #888;">${heir.condition}</div>
                    </td>
                    <td>${statusBadge}</td>
                    <td class="fraction">${heir.fraction}</td>
                    <td>${heir.percentage.toFixed(2)}%</td>
                    <td class="amount">${this.formatCurrency(heir.amount)}</td>
                </tr>`;
        });
        
        html += `
                    </tbody>
                </table>
                
                <div class="summary-item total" style="margin-top: 20px;">
                    <span>Total Distribusi:</span>
                    <span>${results.totalPercentage.toFixed(2)}%</span>
                </div>
            </div>`;
        
        // Blocked heirs
        if (results.blocked.length > 0) {
            html += `
                <div class="result-card">
                    <h3 class="result-title">
                        <i class="fas fa-ban"></i>
                        Ahli Waris Terhalang (Hajb)
                    </h3>
                    <div class="blocked-heirs">`;
            
            results.blocked.forEach(blocked => {
                html += `
                    <div class="blocked-heir">
                        <div class="blocked-name">${this.getHeirDisplayName(blocked.type)}</div>
                        <div class="blocked-reason">${blocked.reason}</div>
                        <div class="blocked-dalil">${blocked.dalil}</div>
                    </div>`;
            });
            
            html += `</div></div>`;
        }
        
        // Dalil section - selalu tampilkan dalil dengan lebih banyak konten
        let dalilToShow = [];
        
        // Tambahkan dalil spesifik dari hasil perhitungan jika ada
        if (results.dalil && results.dalil.length > 0) {
            dalilToShow = [...results.dalil];
        }
        
        // Selalu tambahkan dalil default untuk menampilkan dalil lengkap
        const defaultDalil = this.getDefaultDalil();
        dalilToShow = [...dalilToShow, ...defaultDalil];
        
        // Hapus duplikasi berdasarkan source
        const uniqueDalil = dalilToShow.filter((dalil, index, self) => 
            index === self.findIndex(d => d.source === dalil.source)
        );
        
        html += `
            <div class="result-card">
                <div class="dalil-section">
                    <div class="dalil-accordion">
                        <div class="dalil-header" onclick="app.toggleDalil()">
                            <h4>
                                <i class="fas fa-book-open"></i>
                                Dalil & Penjelasan Syar'i
                            </h4>
                            <i class="fas fa-chevron-down dalil-toggle"></i>
                        </div>
                        <div class="dalil-content" id="dalilContent">`;
        
        uniqueDalil.forEach(dalil => {
            html += `
                <div class="dalil-item">
                    <div class="dalil-type">${dalil.type === 'quran' ? '📖 Al-Quran' : dalil.type === 'hadith' ? '📚 Hadits' : '📝 Prinsip Syar\'i'}</div>
                    <div class="dalil-arabic" style="font-family: 'Amiri', serif; font-size: 1.2em; line-height: 1.8; text-align: right; color: #00ffff; margin: 10px 0;">${dalil.arabic}</div>
                    <div class="dalil-translation" style="font-style: italic; color: #ccc; margin: 10px 0;">"${dalil.translation}"</div>
                    <div class="dalil-source" style="font-size: 0.9em; color: #888;">— ${dalil.source}</div>
                    ${dalil.explanation ? `<div class="dalil-explanation" style="margin-top: 10px; padding: 10px; background: rgba(0,255,255,0.1); border-radius: 8px; color: #e0e0e0;">${dalil.explanation}</div>` : ''}
                </div>`;
        });
        
        html += `
                        </div>
                    </div>
                </div>
                
                <!-- Navigation Actions -->
                <div class="result-actions">
                    <button class="btn-secondary" onclick="app.startNewCalculation()">
                        <i class="fas fa-plus"></i>
                        Perhitungan Baru
                    </button>
                    <button class="btn-primary" onclick="app.saveToHistory()">
                        <i class="fas fa-save"></i>
                        Simpan ke Riwayat
                    </button>
                </div>
            </div>`;
        
        return html;
    }

    getStatusBadge(status) {
        const badges = {
            'ashabul_furudh': '<span style="background: rgba(0,255,255,0.2); color: #00ffff; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">Ashabul Furudh</span>',
            'asabah': '<span style="background: rgba(0,255,65,0.2); color: #00ff41; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">Asabah</span>',
            'furudh_asabah': '<span style="background: rgba(255,193,7,0.2); color: #ffc107; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">Furudh + Asabah</span>'
        };
        return badges[status] || status;
    }

    setupResultsInteractions() {
        // Setup any additional result interactions if needed
    }

    goBackToCalculation() {
        this.currentStep = 3;
        this.updateWizardStep();
    }

    startNewCalculation() {
        // Reset all form data
        this.resetAllForms();
        
        // Reset data object
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
        
        // Go back to step 1
        this.currentStep = 1;
        this.updateWizardStep();
        
        // Navigate to calculator section to ensure we're in the right place
        this.navigateToSection('calculator');
        
        this.showToast('Form telah direset untuk perhitungan baru!', 'success');
    }

    resetAllForms() {
        // Reset tirkah form
        const tirkahInputs = document.querySelectorAll('#step1 input[type="number"], #step1 input[type="text"]');
        tirkahInputs.forEach(input => {
            input.value = '';
        });

        // Reset tirkah summary display
        document.getElementById('summaryAssets').textContent = 'Rp 0';
        document.getElementById('summaryDeductions').textContent = 'Rp 0';
        document.getElementById('summaryWasiat').textContent = 'Rp 0';
        document.getElementById('summaryNet').textContent = 'Rp 0';

        // Reset heirs checkboxes and numbers
        const checkboxes = document.querySelectorAll('#step2 input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        const radioButtons = document.querySelectorAll('#step2 input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.checked = false;
        });

        const numberInputs = document.querySelectorAll('#step2 input[type="number"]');
        numberInputs.forEach(input => {
            input.value = '';
            input.disabled = true; // Disable initially until checkbox is checked
        });

        // Hide all number input containers
        const numberContainers = document.querySelectorAll('.number-input');
        numberContainers.forEach(container => {
            container.style.display = 'none';
        });

        // Clear results
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }

    }

    saveToHistory() {
        if (!this.data.results) {
            this.showToast('Tidak ada hasil perhitungan untuk disimpan!', 'error');
            return;
        }

        // Buat objek history entry
        const historyEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            tirkah: {
                ...this.data.tirkah
            },
            heirs: { ...this.data.heirs },
            results: {
                ...this.data.results,
                // Summary untuk tampilan cepat
                totalHeirs: this.data.results.heirs.length,
                totalAmount: this.data.results.tirkah.netAssets,
                hasAwl: this.data.results.hasAwl,
                hasRadd: this.data.results.hasRadd
            }
        };

        // Simpan ke localStorage
        this.addToHistory(historyEntry);
        
        // Tampilkan toast success
        this.showToast('Hasil perhitungan berhasil disimpan ke riwayat!', 'success');
        
        // Optional: pindah ke tab riwayat
        this.switchToHistoryTab();
    }

    addToHistory(entry) {
        let history = JSON.parse(localStorage.getItem('warisCalculationHistory') || '[]');
        
        // Tambahkan entry baru di awal array
        history.unshift(entry);
        
        // Batasi history maksimal 50 entry
        if (history.length > 50) {
            history = history.slice(0, 50);
        }
        
        // Simpan ke localStorage
        localStorage.setItem('warisCalculationHistory', JSON.stringify(history));
        
    }

    switchToHistoryTab() {
        // Pindah ke tab riwayat di bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const historyNavItem = document.querySelector('[data-section="history"]');
        if (historyNavItem) {
            historyNavItem.classList.add('active');
            // Switch to history section
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById('historySection').style.display = 'block';
            this.loadHistorySection();
        }
    }

    loadHistorySection() {
        const historyList = document.getElementById('historyList');
        const history = JSON.parse(localStorage.getItem('warisCalculationHistory') || '[]');
        
        
        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="result-card" style="text-align: center; padding: 40px;">
                    <i class="fas fa-history" style="font-size: 3rem; opacity: 0.3; margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 10px; opacity: 0.7;">Belum Ada Riwayat</h3>
                    <p style="opacity: 0.5;">Mulai perhitungan waris untuk melihat riwayat di sini</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = history.map((entry, index) => `
            <div class="result-card history-item" data-entry-id="${entry.id}">
                <div class="result-header">
                    <div>
                        <h3 class="result-title" style="font-size: 1.1rem;">
                            <i class="fas fa-file-alt"></i>
                            Perhitungan #${history.length - index}
                        </h3>
                        <p style="color: #888; font-size: 0.9rem; margin: 5px 0;">${entry.date}</p>
                    </div>
                    <div class="history-actions">
                        <button class="btn-primary" onclick="app.loadHistoryEntry('${entry.id}')" style="padding: 6px 12px; font-size: 0.8rem;">
                            <i class="fas fa-eye"></i>
                            Lihat
                        </button>
                        <button class="btn-secondary" onclick="app.deleteHistoryEntry('${entry.id}')" style="padding: 6px 8px; font-size: 0.8rem; color: #ff4444;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="history-summary">
                    <div class="summary-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        <div class="summary-item">
                            <span>Total Harta:</span>
                            <span class="amount">${this.formatCurrency(entry.results.totalAmount)}</span>
                        </div>
                        <div class="summary-item">
                            <span>Ahli Waris:</span>
                            <span>${entry.results.totalHeirs} orang</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadHistoryEntry(entryId) {
        const history = JSON.parse(localStorage.getItem('warisCalculationHistory') || '[]');
        const entry = history.find(item => item.id === entryId);
        
        if (!entry) {
            this.showToast('Entry riwayat tidak ditemukan!', 'error');
            return;
        }

        // Load data dari history ke aplikasi
        this.data = {
            tirkah: entry.tirkah,
            heirs: entry.heirs,
            results: entry.results
        };

        // Tampilkan hasil
        this.displayResults(entry.results);
        this.currentStep = 4;
        
        // Switch ke section calculator untuk menampilkan hasil
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('calculatorSection').style.display = 'block';
        this.updateWizardStep();
        
        this.showToast('Riwayat perhitungan berhasil dimuat!', 'success');
    }

    deleteHistoryEntry(entryId) {
        if (!confirm('Apakah Anda yakin ingin menghapus entry riwayat ini?')) {
            return;
        }

        let history = JSON.parse(localStorage.getItem('warisCalculationHistory') || '[]');
        history = history.filter(entry => entry.id !== entryId);
        
        localStorage.setItem('warisCalculationHistory', JSON.stringify(history));
        
        // Reload history section
        this.loadHistorySection();
        
        this.showToast('Entry riwayat berhasil dihapus!', 'success');
    }

    clearAllHistory() {
        if (!confirm('Apakah Anda yakin ingin menghapus semua riwayat perhitungan?')) {
            return;
        }

        localStorage.removeItem('warisCalculationHistory');
        this.loadHistorySection();
        
        this.showToast('Semua riwayat berhasil dihapus!', 'success');
    }

    toggleDalil() {
        const content = document.getElementById('dalilContent');
        const header = document.querySelector('.dalil-header');
        const toggle = document.querySelector('.dalil-toggle');
        
        if (content && header) {
            const isActive = content.classList.contains('active');
            
            if (isActive) {
                content.classList.remove('active');
                header.classList.remove('active');
            } else {
                content.classList.add('active');
                header.classList.add('active');
            }
            
            if (toggle) {
                toggle.style.transform = isActive ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        }
    }

    toggleDalilCalculator() {
        const content = document.getElementById('dalilCalculatorContent');
        const toggle = document.getElementById('dalilToggleCalculator');
        
        if (content) {
            const isVisible = content.style.display !== 'none';
            content.style.display = isVisible ? 'none' : 'block';
            
            if (toggle) {
                toggle.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        }
    }

    loadDalilCalculator() {
        const container = document.getElementById('dalilCalculatorContent');
        if (!container) return;

        const defaultDalil = this.getDefaultDalil();
        let html = '';

        defaultDalil.forEach(dalil => {
            html += `
                <div class="dalil-item">
                    <div class="dalil-type">${dalil.type === 'quran' ? '📖 Al-Quran' : dalil.type === 'hadith' ? '📚 Hadits' : '📝 Prinsip Syar\'i'}</div>
                    <div class="dalil-arabic" style="font-family: 'Amiri', serif; font-size: 1.1em; line-height: 1.8; text-align: right; color: #00ffff; margin: 10px 0;">${dalil.arabic}</div>
                    <div class="dalil-translation" style="font-style: italic; color: #ccc; margin: 10px 0;">"${dalil.translation}"</div>
                    <div class="dalil-source" style="font-size: 0.9em; color: #888;">— ${dalil.source}</div>
                    ${dalil.explanation ? `<div class="dalil-explanation" style="margin-top: 10px; padding: 10px; background: rgba(0,255,255,0.1); border-radius: 8px; color: #e0e0e0; font-size: 0.9em;">${dalil.explanation}</div>` : ''}
                </div>`;
        });

        container.innerHTML = html;
    }

    // ===== UTILITY FUNCTIONS =====
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    setupFormValidation() {
        // Add real-time validation
    }

    // ===== MODAL FUNCTIONS =====
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // ===== TOAST NOTIFICATIONS =====
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const icon = document.querySelector('.toast-icon');
        const messageEl = document.querySelector('.toast-message');
        
        // Set message and type
        messageEl.textContent = message;
        toast.className = `toast ${type}`;
        
        // Set icon based on type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        icon.className = `toast-icon ${icons[type] || icons.info}`;
        
        // Show toast
        toast.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    showLoading(message = 'Memuat...') {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            loadingScreen.classList.remove('hidden');
        }
    }

    // ===== STORAGE FUNCTIONS =====
    loadSettings() {
        const saved = localStorage.getItem('warisSettings');
        if (saved) {
            this.data.settings = { ...this.data.settings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        localStorage.setItem('warisSettings', JSON.stringify(this.data.settings));
    }

    // ===== ADDITIONAL FEATURES =====
    shareResults() {
        if (!this.lastCalculationResult) {
            this.showToast('Tidak ada hasil untuk dibagikan', 'warning');
            return;
        }

        // Create comprehensive result text with all information
        const resultText = this.createShareableResultText(this.lastCalculationResult);

        if (navigator.share) {
            navigator.share({
                title: 'Hasil Perhitungan Waris Syar\'i',
                text: resultText,
                url: window.location.href
            }).catch(err => {
                // Fallback to copy if share fails
                this.copyResultsToClipboard(resultText);
            });
        } else {
            // Copy to clipboard if native sharing not available
            this.copyResultsToClipboard(resultText);
        }
    }

    createShareableResultText(results) {
        let text = `📊 HASIL PERHITUNGAN WARIS SYAR'I\n`;
        text += `═══════════════════════════\n\n`;
        
        // Tirkah Summary
        text += `💰 RINGKASAN TIRKAH:\n`;
        text += `Harta Bersih untuk Waris: ${this.formatCurrency(results.tirkah.netAssets)}\n\n`;
        
        // Heirs Distribution
        text += `👥 DISTRIBUSI AHLI WARIS:\n`;
        text += `─────────────────────\n`;
        
        results.heirs.forEach((heir, index) => {
            const countText = heir.count > 1 ? ` (${heir.count} orang)` : '';
            const heirName = this.getHeirDisplayName(heir.type);
            
            text += `${index + 1}. ${heirName}${countText}\n`;
            text += `   📋 Status: ${heir.category}\n`;
            text += `   🔢 Bagian: ${heir.fraction}\n`;
            text += `   📊 Persentase: ${heir.percentage.toFixed(2)}%\n`;
            text += `   💵 Nominal: ${this.formatCurrency(heir.amount)}\n\n`;
        });
        
        // Blocked heirs if any
        if (results.blocked && results.blocked.length > 0) {
            text += `🚫 AHLI WARIS TERHALANG (HAJB):\n`;
            text += `─────────────────────\n`;
            results.blocked.forEach((blocked, index) => {
                text += `${index + 1}. ${this.getHeirDisplayName(blocked.type)}\n`;
                text += `   Alasan: ${blocked.reason}\n\n`;
            });
        }
        
        // Total Distribution
        text += `📈 TOTAL DISTRIBUSI: ${results.totalPercentage.toFixed(2)}%\n\n`;
        
        // Dalil reference
        text += `📖 DASAR HUKUM:\n`;
        text += `"يُوصِيكُمُ اللّهُ فِي أَوْلاَدِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الأُنثَيَيْنِ"\n`;
        text += `"Allah mewasiatkan kepadamu tentang (pembagian pusaka untuk) anak-anakmu. Yaitu: bahagian seorang anak lelaki sama dengan bagahian dua orang anak perempuan."\n`;
        text += `(QS. An-Nisa: 11)\n\n`;
        
        text += `⚖️ Dibagikan dari Aplikasi Kalkulator Waris Syar'i\n`;
        text += `📚 Perhitungan berdasarkan Al-Qur'an dan Sunnah sesuai pemahaman salaf`;
        
        return text;
    }

    copyResults() {
        if (!this.lastCalculationResult) {
            this.showToast('Tidak ada hasil untuk disalin', 'warning');
            return;
        }
        
        const resultText = this.createShareableResultText(this.lastCalculationResult);
        this.copyResultsToClipboard(resultText);
    }

    copyResultsToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('📋 Hasil perhitungan berhasil disalin ke clipboard!', 'success');
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
                this.showToast('📋 Hasil perhitungan berhasil disalin!', 'success');
            } else {
                this.showToast('❌ Gagal menyalin hasil perhitungan', 'error');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showToast('❌ Gagal menyalin hasil perhitungan', 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    showExamples() {
        this.showToast('Fitur contoh kasus akan segera hadir', 'info');
    }

    showHistory() {
        this.showToast('Fitur riwayat akan segera hadir', 'info');
    }

    showDalil() {
        // Populate dalil content
        this.populateDalilModal();
        this.showModal('dalilModal');
    }

    populateDalilModal() {
        const dalilContent = document.querySelector('#dalilModal #dalilContent');
        if (dalilContent) {
            const dalilData = this.getDefaultDalil();
            
            let html = '';
            dalilData.forEach(dalil => {
                html += `
                    <div class="dalil-item" style="margin-bottom: 20px; padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 12px; border-left: 4px solid #00ffff;">
                        <div class="dalil-type" style="color: #ff6b6b; font-size: 0.9rem; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                            ${dalil.type === 'quran' ? '📖 Al-Quran' : dalil.type === 'hadith' ? '📚 Hadits' : '📝 Prinsip Syar\'i'}
                        </div>
                        <div class="dalil-arabic" style="font-family: 'Amiri', serif; font-size: 1.3em; line-height: 2; text-align: right; color: #00ffff; margin: 15px 0; padding: 10px; background: rgba(0,255,255,0.1); border-radius: 8px;">
                            ${dalil.arabic}
                        </div>
                        <div class="dalil-translation" style="font-style: italic; color: #e0e0e0; margin: 15px 0; font-size: 1.05em; line-height: 1.6;">
                            "${dalil.translation}"
                        </div>
                        <div class="dalil-source" style="font-size: 0.9em; color: #00d4ff; font-weight: 500; margin: 10px 0;">
                            — ${dalil.source}
                        </div>
                        ${dalil.explanation ? `<div class="dalil-explanation" style="margin-top: 15px; padding: 15px; background: rgba(0,255,255,0.1); border-radius: 8px; color: #f0f0f0; font-size: 0.95em; line-height: 1.6; border-left: 3px solid #00ffff;">${dalil.explanation}</div>` : ''}
                    </div>`;
            });
            
            dalilContent.innerHTML = html;
        }
    }

    showExamples() {
        this.navigateToSection('examples');
        
        // Setup example click handlers
        document.querySelectorAll('.example-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const example = e.currentTarget.dataset.example;
                this.loadExample(example);
            });
        });
    }
    
    loadExample(exampleType) {
        const examples = {
            umariyah: {
                assets: { totalAssets: 120000000, funeralCosts: 5000000, debts: 0, wasiat: 0 },
                heirs: { husband: 1, father: 1, mother: 1 },
                settings: { raddMethod: 'jumhur', grandfatherMethod: 'zaid', showDalil: true }
            },
            awl: {
                assets: { totalAssets: 100000000, funeralCosts: 3000000, debts: 0, wasiat: 0 },
                heirs: { husband: 1, daughters: 2, mother: 1 },
                settings: { raddMethod: 'jumhur', grandfatherMethod: 'zaid', showDalil: true }
            },
            radd: {
                assets: { totalAssets: 90000000, funeralCosts: 2000000, debts: 0, wasiat: 0 },
                heirs: { wife: 1, daughters: 1 },
                settings: { raddMethod: 'jumhur', grandfatherMethod: 'zaid', showDalil: true }
            },
            asabah: {
                assets: { totalAssets: 200000000, funeralCosts: 5000000, debts: 10000000, wasiat: 0 },
                heirs: { wife: 1, sons: 2, daughters: 1 },
                settings: { raddMethod: 'jumhur', grandfatherMethod: 'zaid', showDalil: true }
            }
        };
        
        const example = examples[exampleType];
        if (example) {
            // Load example data
            this.data.tirkah = example.assets;
            this.data.settings = example.settings;
            
            // Navigate to calculator and fill form
            this.navigateToSection('calculator');
            this.fillFormWithData(example);
            
            // Update heirs data after form is filled (this creates flat structure)
            this.updateHeirsData();
            
            this.showToast(`Contoh kasus ${exampleType} dimuat`, 'success');
        }
    }
    
    fillFormWithData(data) {
        // Fill assets form
        if (data.assets) {
            document.getElementById('totalAssets').value = data.assets.totalAssets;
            document.getElementById('funeralCosts').value = data.assets.funeralCosts;
            document.getElementById('debts').value = data.assets.debts;
            document.getElementById('wasiat').value = data.assets.wasiat;
            this.updateTirkahSummary();
        }

        // Fill heirs form (support both flat and nested structure)
        let heirs = null;
        if (data.heirs) {
            if (data.heirs.valid) {
                heirs = data.heirs.valid;
            } else {
                heirs = data.heirs;
            }
        }
        if (heirs) {
            // Spouse
            if (heirs.husband) {
                document.querySelector('input[name="spouse"][value="husband"]').checked = true;
            }
            if (heirs.wife) {
                document.querySelector('input[name="spouse"][value="wife"]').checked = true;
                document.getElementById('wifeNumber').value = heirs.wife;
            }

            // Parents
            if (heirs.father) document.querySelector('input[name="father"]').checked = true;
            if (heirs.mother) document.querySelector('input[name="mother"]').checked = true;

            // Grandparents
            if (heirs.grandfather) document.querySelector('input[name="grandfather"]').checked = true;
            if (heirs.grandmother) document.querySelector('input[name="grandmother"]').checked = true;

            // Children
            if (heirs.sons) {
                document.querySelector('input[name="sons"]').checked = true;
                document.getElementById('sonsNumber').value = heirs.sons;
            }
            if (heirs.daughters) {
                document.querySelector('input[name="daughters"]').checked = true;
                document.getElementById('daughtersNumber').value = heirs.daughters;
            }

            // Siblings
            if (heirs.fullBrothers || heirs.fullSisters) {
                document.querySelector('input[name="fullBrothersSisters"]').checked = true;
                if (heirs.fullBrothers) document.getElementById('fullBrothersNumber').value = heirs.fullBrothers;
                if (heirs.fullSisters) document.getElementById('fullSistersNumber').value = heirs.fullSisters;
            }
            if (heirs.halfBrothers || heirs.halfSisters) {
                document.querySelector('input[name="halfBrothersSisters"]').checked = true;
                if (heirs.halfBrothers) document.getElementById('halfBrothersNumber').value = heirs.halfBrothers;
                if (heirs.halfSisters) document.getElementById('halfSistersNumber').value = heirs.halfSisters;
            }
            if (heirs.maternalSiblings) {
                document.querySelector('input[name="maternalSiblings"]').checked = true;
                document.getElementById('maternalSiblingsNumber').value = heirs.maternalSiblings;
            }

            // Trigger visibility changes
            this.updateHeirsVisibility();
        }
        
        // Fill settings (optional fields, might not exist in current form)
        if (data.settings) {
            if (data.settings.raddMethod) {
                const raddInput = document.querySelector(`input[name="raddMethod"][value="${data.settings.raddMethod}"]`);
                if (raddInput) raddInput.checked = true;
            }
            if (data.settings.grandfatherMethod) {
                const grandfatherInput = document.querySelector(`input[name="grandfatherMethod"][value="${data.settings.grandfatherMethod}"]`);
                if (grandfatherInput) grandfatherInput.checked = true;
            }
            if (data.settings.showDalil !== undefined) {
                const dalilInput = document.querySelector('input[name="showDalil"]');
                if (dalilInput) dalilInput.checked = data.settings.showDalil;
            }
        }
    }
    
    updateHeirsVisibility() {
        // Update spouse count visibility
        const spouse = document.querySelector('input[name="spouse"]:checked')?.value;
        const wifeCount = document.getElementById('wifeCount');
        if (wifeCount) {
            wifeCount.style.display = spouse === 'wife' ? 'block' : 'none';
        }
        
        // Update other heir counts
        const heirToggles = [
            { checkbox: 'sons', countDiv: 'sonsCount' },
            { checkbox: 'daughters', countDiv: 'daughtersCount' }
        ];
        
        heirToggles.forEach(({ checkbox, countDiv }) => {
            const checkboxEl = document.querySelector(`input[name="${checkbox}"]`);
            const countEl = document.getElementById(countDiv);
            
            if (checkboxEl && countEl) {
                countEl.style.display = checkboxEl.checked ? 'block' : 'none';
            }
        });
    }
    
    showHistory() {
        this.navigateToSection('history');
        this.loadHistory();
    }
    
    loadHistory() {
        const historyData = JSON.parse(localStorage.getItem('warisHistory') || '[]');
        const historyList = document.getElementById('historyList');
        
        if (historyData.length === 0) {
            historyList.innerHTML = `
                <div class="result-card" style="text-align: center; padding: 40px;">
                    <i class="fas fa-history" style="font-size: 3rem; opacity: 0.3; margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 10px; opacity: 0.7;">Belum Ada Riwayat</h3>
                    <p style="opacity: 0.5;">Mulai perhitungan waris untuk melihat riwayat di sini</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = historyData.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-header">
                    <div class="history-title">${item.title}</div>
                    <div class="history-date">${new Date(item.timestamp).toLocaleDateString('id-ID')}</div>
                </div>
                <div class="history-summary">
                    Harta: ${this.formatCurrency(item.data.tirkah.netAssets)} • 
                    ${Object.keys(item.data.heirs.valid || {}).length} Ahli Waris
                </div>
                <div class="history-actions">
                    <button class="btn-small btn-view" onclick="viewHistory('${item.id}')">
                        <i class="fas fa-eye"></i> Lihat
                    </button>
                    <button class="btn-small btn-delete" onclick="deleteHistory('${item.id}')">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    viewHistory(id) {
        const historyData = JSON.parse(localStorage.getItem('warisHistory') || '[]');
        const item = historyData.find(h => h.id === id);
        
        if (item) {
            // Load the data
            this.data = { ...item.data };
            
            // Navigate to calculator and fill form
            this.navigateToSection('calculator');
            this.fillFormWithData(item.data);
            
            // If results exist, show them
            if (item.results) {
                this.currentStep = 4;
                this.showStep(4);
                this.displayResults(item.results);
            }
            
            this.showToast('Data riwayat berhasil dimuat', 'success');
        }
    }
    
    deleteHistory(id) {
        if (confirm('Yakin ingin menghapus riwayat ini?')) {
            let historyData = JSON.parse(localStorage.getItem('warisHistory') || '[]');
            historyData = historyData.filter(h => h.id !== id);
            localStorage.setItem('warisHistory', JSON.stringify(historyData));
            
            this.loadHistory();
            this.showToast('Riwayat berhasil dihapus', 'success');
        }
    }

    clearAllHistory() {
        if (confirm('Yakin ingin menghapus seluruh riwayat? Tindakan ini tidak dapat dibatalkan.')) {
            localStorage.removeItem('warisHistory');
            this.loadHistory();
            this.showToast('Seluruh riwayat berhasil dihapus', 'success');
        }
    }

    showSettings() {
        this.navigateToSection('settings');
        this.loadSettingsForm();
    }
    
    loadSettingsForm() {
        const settings = this.data.settings;
        
        // Load current settings to form
        if (settings.raddMethod) {
            document.querySelector(`input[name="defaultRaddMethod"][value="${settings.raddMethod}"]`).checked = true;
        }
        if (settings.grandfatherMethod) {
            document.querySelector(`input[name="defaultGrandfatherMethod"][value="${settings.grandfatherMethod}"]`).checked = true;
        }
        document.querySelector('input[name="defaultShowDalil"]').checked = settings.showDalil;
        document.querySelector('input[name="defaultShowComparison"]').checked = settings.showComparison;
    }
    
    saveSettings() {
        const settings = {
            raddMethod: document.querySelector('input[name="defaultRaddMethod"]:checked')?.value || 'jumhur',
            grandfatherMethod: document.querySelector('input[name="defaultGrandfatherMethod"]:checked')?.value || 'zaid',
            showDalil: document.querySelector('input[name="defaultShowDalil"]').checked,
            showComparison: document.querySelector('input[name="defaultShowComparison"]').checked
        };
        
        this.data.settings = settings;
        localStorage.setItem('warisSettings', JSON.stringify(settings));
        
        this.showToast('Pengaturan berhasil disimpan', 'success');
    }
    
    resetSettings() {
        if (confirm('Yakin ingin mereset semua pengaturan ke default?')) {
            const defaultSettings = {
                raddMethod: 'jumhur',
                grandfatherMethod: 'zaid',
                showDalil: true,
                showComparison: false
            };
            
            this.data.settings = defaultSettings;
            localStorage.setItem('warisSettings', JSON.stringify(defaultSettings));
            
            this.loadSettingsForm();
            this.showToast('Pengaturan berhasil direset', 'success');
        }
    }
}

// Global functions
function updateApp() {
    if (window.app) {
        window.app.updateApp();
    }
}

function closeModal(modalId) {
    if (window.app) {
        window.app.closeModal(modalId);
    }
}

function viewHistory(id) {
    if (window.app) {
        window.app.viewHistory(id);
    }
}

function deleteHistory(id) {
    if (window.app) {
        window.app.deleteHistory(id);
    }
}

function saveSettings() {
    if (window.app) {
        window.app.saveSettings();
    }
}

function resetSettings() {
    if (window.app) {
        window.app.resetSettings();
    }
}

function viewHistory(id) {
    if (window.app) {
        window.app.viewHistory(id);
    }
}

function deleteHistory(id) {
    if (window.app) {
        window.app.deleteHistory(id);
    }
}

function clearAllHistory() {
    if (window.app) {
        window.app.clearAllHistory();
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WarisCalculator();
});