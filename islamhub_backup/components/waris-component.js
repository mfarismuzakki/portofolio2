/**
 * Waris Calculator Component for Islamic SuperApps
 * Simplified version for inheritance calculation
 */

export default class WarisComponent {
    constructor({ container, eventBus, sharedData, storageManager }) {
        this.container = container;
        this.eventBus = eventBus;
        this.sharedData = sharedData;
        this.storageManager = storageManager;
        
        // Calculation data
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
        this.totalSteps = 3;
    }

    async init() {
        try {
            // Render component
            this.render();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize first step
            this.showStep(1);
            
            console.log('✅ Waris Component initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Waris Component:', error);
            this.renderError();
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="waris-wrapper">
                <!-- Header Section -->
                <div class="waris-header">
                    <div class="header-content">
                        <h2>Kalkulator Waris</h2>
                        <p>Hitung pembagian harta warisan sesuai syariat Islam</p>
                    </div>
                    
                    <!-- Progress Indicator -->
                    <div class="progress-indicator">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                        <div class="step-indicators">
                            <div class="step-indicator active" data-step="1">
                                <span class="step-number">1</span>
                                <span class="step-label">Harta</span>
                            </div>
                            <div class="step-indicator" data-step="2">
                                <span class="step-number">2</span>
                                <span class="step-label">Ahli Waris</span>
                            </div>
                            <div class="step-indicator" data-step="3">
                                <span class="step-number">3</span>
                                <span class="step-label">Hasil</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Steps Container -->
                <div class="steps-container" id="stepsContainer">
                    <!-- Step 1: Tirkah (Assets) -->
                    <div class="step-content" id="step1">
                        <div class="step-header">
                            <h3>Langkah 1: Data Harta (Tirkah)</h3>
                            <p>Masukkan total harta dan kewajiban yang harus dipenuhi</p>
                        </div>
                        
                        <div class="form-section">
                            <div class="input-group">
                                <label for="totalAssets">Total Harta (Rp)</label>
                                <input type="number" id="totalAssets" placeholder="Masukkan total harta..." min="0">
                                <div class="input-help">Termasuk rumah, kendaraan, tabungan, emas, dll.</div>
                            </div>
                            
                            <div class="input-group">
                                <label for="funeralCosts">Biaya Pemakaman (Rp)</label>
                                <input type="number" id="funeralCosts" placeholder="Biaya pemakaman..." min="0">
                                <div class="input-help">Biaya yang dikeluarkan untuk pemakaman</div>
                            </div>
                            
                            <div class="input-group">
                                <label for="debts">Utang/Tanggungan (Rp)</label>
                                <input type="number" id="debts" placeholder="Total utang..." min="0">
                                <div class="input-help">Utang yang harus dilunasi sebelum pembagian warisan</div>
                            </div>
                            
                            <div class="input-group">
                                <label for="wasiat">Wasiat (Rp)</label>
                                <input type="number" id="wasiat" placeholder="Nilai wasiat..." min="0">
                                <div class="input-help">Maksimal 1/3 dari harta bersih (setelah utang)</div>
                            </div>
                        </div>
                        
                        <div class="tirkah-summary" id="tirkahSummary">
                            <h4>Ringkasan Harta</h4>
                            <div class="summary-item">
                                <span>Total Harta:</span>
                                <span id="totalAssetsDisplay">Rp 0</span>
                            </div>
                            <div class="summary-item">
                                <span>Dikurangi Biaya Pemakaman:</span>
                                <span id="funeralCostsDisplay">Rp 0</span>
                            </div>
                            <div class="summary-item">
                                <span>Dikurangi Utang:</span>
                                <span id="debtsDisplay">Rp 0</span>
                            </div>
                            <div class="summary-item">
                                <span>Dikurangi Wasiat:</span>
                                <span id="wasiatDisplay">Rp 0</span>
                            </div>
                            <div class="summary-item total">
                                <span>Harta Bersih untuk Dibagi:</span>
                                <span id="netAssetsDisplay">Rp 0</span>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Heirs -->
                    <div class="step-content" id="step2" style="display: none;">
                        <div class="step-header">
                            <h3>Langkah 2: Ahli Waris</h3>
                            <p>Pilih ahli waris yang masih hidup</p>
                        </div>
                        
                        <div class="heirs-section">
                            <!-- Suami/Istri -->
                            <div class="heirs-group">
                                <h4>Pasangan</h4>
                                <div class="heir-options">
                                    <label class="heir-checkbox">
                                        <input type="radio" name="spouse" value="husband">
                                        <div class="checkbox-content">
                                            <span class="heir-name">Suami</span>
                                            <span class="heir-share">1/2 atau 1/4</span>
                                        </div>
                                    </label>
                                    <label class="heir-checkbox">
                                        <input type="radio" name="spouse" value="wife">
                                        <div class="checkbox-content">
                                            <span class="heir-name">Istri</span>
                                            <span class="heir-share">1/4 atau 1/8</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Anak -->
                            <div class="heirs-group">
                                <h4>Anak</h4>
                                <div class="heir-options">
                                    <label class="heir-checkbox">
                                        <input type="checkbox" name="sons">
                                        <div class="checkbox-content">
                                            <span class="heir-name">Anak Laki-laki</span>
                                            <span class="heir-share">Asabah</span>
                                        </div>
                                    </label>
                                    <div class="count-input" id="sonsCount" style="display: none;">
                                        <label>Jumlah:</label>
                                        <input type="number" id="sonsNumber" min="1" max="20" value="1">
                                    </div>
                                    
                                    <label class="heir-checkbox">
                                        <input type="checkbox" name="daughters">
                                        <div class="checkbox-content">
                                            <span class="heir-name">Anak Perempuan</span>
                                            <span class="heir-share">1/2 atau 2/3</span>
                                        </div>
                                    </label>
                                    <div class="count-input" id="daughtersCount" style="display: none;">
                                        <label>Jumlah:</label>
                                        <input type="number" id="daughtersNumber" min="1" max="20" value="1">
                                    </div>
                                </div>
                            </div>

                            <!-- Orang Tua -->
                            <div class="heirs-group">
                                <h4>Orang Tua</h4>
                                <div class="heir-options">
                                    <label class="heir-checkbox">
                                        <input type="checkbox" name="father">
                                        <div class="checkbox-content">
                                            <span class="heir-name">Ayah</span>
                                            <span class="heir-share">1/6 atau Asabah</span>
                                        </div>
                                    </label>
                                    <label class="heir-checkbox">
                                        <input type="checkbox" name="mother">
                                        <div class="checkbox-content">
                                            <span class="heir-name">Ibu</span>
                                            <span class="heir-share">1/6 atau 1/3</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Saudara -->
                            <div class="heirs-group">
                                <h4>Saudara Kandung</h4>
                                <div class="heir-options">
                                    <label class="heir-checkbox">
                                        <input type="checkbox" name="fullBrothers">
                                        <div class="checkbox-content">
                                            <span class="heir-name">Saudara Laki-laki Kandung</span>
                                            <span class="heir-share">Asabah</span>
                                        </div>
                                    </label>
                                    <div class="count-input" id="fullBrothersCount" style="display: none;">
                                        <label>Jumlah:</label>
                                        <input type="number" id="fullBrothersNumber" min="1" max="20" value="1">
                                    </div>
                                    
                                    <label class="heir-checkbox">
                                        <input type="checkbox" name="fullSisters">
                                        <div class="checkbox-content">
                                            <span class="heir-name">Saudara Perempuan Kandung</span>
                                            <span class="heir-share">1/2 atau 2/3</span>
                                        </div>
                                    </label>
                                    <div class="count-input" id="fullSistersCount" style="display: none;">
                                        <label>Jumlah:</label>
                                        <input type="number" id="fullSistersNumber" min="1" max="20" value="1">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Results -->
                    <div class="step-content" id="step3" style="display: none;">
                        <div class="step-header">
                            <h3>Hasil Perhitungan Waris</h3>
                            <p>Pembagian harta warisan sesuai syariat Islam</p>
                        </div>
                        
                        <div class="results-container" id="resultsContainer">
                            <!-- Results will be displayed here -->
                        </div>
                        
                        <div class="actions-section">
                            <button class="action-btn primary" id="shareResults">
                                <i class="fas fa-share"></i>
                                <span>Bagikan Hasil</span>
                            </button>
                            <button class="action-btn secondary" id="printResults">
                                <i class="fas fa-print"></i>
                                <span>Cetak</span>
                            </button>
                            <button class="action-btn secondary" id="newCalculation">
                                <i class="fas fa-redo"></i>
                                <span>Hitung Lagi</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="navigation-buttons">
                    <button class="nav-btn secondary" id="prevBtn" style="display: none;">
                        <i class="fas fa-arrow-left"></i>
                        <span>Sebelumnya</span>
                    </button>
                    <button class="nav-btn primary" id="nextBtn">
                        <span>Selanjutnya</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <button class="nav-btn primary" id="calculateBtn" style="display: none;">
                        <i class="fas fa-calculator"></i>
                        <span>Hitung Waris</span>
                    </button>
                </div>

                <!-- Important Notes -->
                <div class="notes-section">
                    <div class="note-header">
                        <i class="fas fa-info-circle"></i>
                        <span>Catatan Penting</span>
                    </div>
                    <ul class="notes-list">
                        <li>Perhitungan menggunakan metode Jumhur Ulama (mayoritas ulama)</li>
                        <li>Wasiat maksimal 1/3 dari harta bersih setelah utang</li>
                        <li>Utang dan biaya pemakaman dibayar terlebih dahulu</li>
                        <li>Konsultasikan dengan ahli syariah untuk kasus kompleks</li>
                        <li>Aplikasi ini hanya untuk simulasi dan pembelajaran</li>
                    </ul>
                </div>
            </div>
            
            <style>
            /* Waris Component Specific Styles */
            .waris-wrapper {
                max-width: 800px;
                margin: 0 auto;
                padding: 0;
            }

            .waris-header {
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 25px;
                text-align: center;
                backdrop-filter: blur(20px);
            }

            .header-content h2 {
                font-family: var(--font-primary);
                font-size: 28px;
                font-weight: 700;
                color: var(--primary-cyan);
                margin-bottom: 8px;
            }

            .header-content p {
                color: var(--text-secondary);
                font-size: 14px;
                margin-bottom: 25px;
            }

            .progress-indicator {
                margin-top: 20px;
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 20px;
            }

            .progress-fill {
                height: 100%;
                background: var(--gradient-primary);
                width: 33.33%;
                transition: width 0.3s ease;
                border-radius: 3px;
            }

            .step-indicators {
                display: flex;
                justify-content: space-between;
                max-width: 400px;
                margin: 0 auto;
            }

            .step-indicator {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                opacity: 0.5;
                transition: opacity 0.3s ease;
            }

            .step-indicator.active {
                opacity: 1;
            }

            .step-indicator.completed {
                opacity: 1;
                color: var(--neon-green);
            }

            .step-number {
                width: 32px;
                height: 32px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(0, 255, 255, 0.3);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-primary);
                font-weight: 600;
                color: var(--text-secondary);
                transition: all 0.3s ease;
            }

            .step-indicator.active .step-number {
                background: var(--gradient-primary);
                border-color: var(--primary-cyan);
                color: var(--dark-bg);
            }

            .step-indicator.completed .step-number {
                background: var(--neon-green);
                border-color: var(--neon-green);
                color: var(--dark-bg);
            }

            .step-label {
                font-size: 12px;
                color: var(--text-secondary);
                font-weight: 500;
            }

            .step-indicator.active .step-label {
                color: var(--primary-cyan);
            }

            .steps-container {
                background: var(--surface);
                border: 1px solid rgba(0, 255, 255, 0.1);
                border-radius: 15px;
                padding: 30px;
                margin-bottom: 25px;
            }

            .step-content {
                min-height: 400px;
            }

            .step-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .step-header h3 {
                font-family: var(--font-primary);
                font-size: 20px;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 8px;
            }

            .step-header p {
                color: var(--text-secondary);
                font-size: 14px;
            }

            .form-section {
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-bottom: 30px;
            }

            .input-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .input-group label {
                font-size: 14px;
                font-weight: 500;
                color: var(--text-primary);
            }

            .input-group input {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 10px;
                padding: 12px 15px;
                color: var(--text-primary);
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .input-group input:focus {
                outline: none;
                border-color: var(--primary-cyan);
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            }

            .input-help {
                font-size: 12px;
                color: var(--text-muted);
                font-style: italic;
            }

            .tirkah-summary {
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(0, 128, 255, 0.05));
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 12px;
                padding: 20px;
            }

            .tirkah-summary h4 {
                color: var(--primary-cyan);
                margin-bottom: 15px;
                font-family: var(--font-primary);
                font-size: 16px;
                font-weight: 600;
            }

            .summary-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                font-size: 14px;
                color: var(--text-secondary);
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            .summary-item.total {
                border-top: 2px solid rgba(0, 255, 255, 0.3);
                border-bottom: none;
                padding-top: 12px;
                margin-top: 8px;
                font-weight: 600;
                color: var(--text-primary);
                font-size: 16px;
            }

            .heirs-section {
                display: flex;
                flex-direction: column;
                gap: 25px;
            }

            .heirs-group h4 {
                color: var(--primary-cyan);
                margin-bottom: 15px;
                font-family: var(--font-primary);
                font-size: 16px;
                font-weight: 600;
                border-bottom: 1px solid rgba(0, 255, 255, 0.1);
                padding-bottom: 8px;
            }

            .heir-options {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .heir-checkbox {
                display: flex;
                align-items: center;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(0, 255, 255, 0.1);
                border-radius: 10px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .heir-checkbox:hover {
                background: rgba(0, 255, 255, 0.05);
                border-color: rgba(0, 255, 255, 0.2);
            }

            .heir-checkbox input {
                margin-right: 12px;
                width: 18px;
                height: 18px;
                accent-color: var(--primary-cyan);
            }

            .checkbox-content {
                display: flex;
                justify-content: space-between;
                width: 100%;
                align-items: center;
            }

            .heir-name {
                font-size: 14px;
                font-weight: 500;
                color: var(--text-primary);
            }

            .heir-share {
                font-size: 12px;
                color: var(--text-secondary);
                background: rgba(0, 255, 255, 0.1);
                padding: 4px 8px;
                border-radius: 12px;
            }

            .count-input {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-left: 30px;
                margin-top: 8px;
                margin-bottom: 8px;
            }

            .count-input label {
                font-size: 13px;
                color: var(--text-secondary);
            }

            .count-input input {
                width: 60px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 6px;
                padding: 6px 8px;
                color: var(--text-primary);
                font-size: 13px;
            }

            .results-container {
                margin-bottom: 30px;
            }

            .result-summary {
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 128, 255, 0.1));
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 25px;
                text-align: center;
            }

            .result-summary h4 {
                color: var(--primary-cyan);
                font-family: var(--font-primary);
                font-size: 18px;
                margin-bottom: 15px;
            }

            .net-assets-amount {
                font-family: var(--font-primary);
                font-size: 32px;
                font-weight: 700;
                color: var(--neon-green);
                text-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
            }

            .inheritance-results {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .heir-result {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(0, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .heir-info h5 {
                color: var(--text-primary);
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 5px;
            }

            .heir-details {
                font-size: 13px;
                color: var(--text-secondary);
            }

            .heir-amount {
                text-align: right;
            }

            .heir-share-text {
                font-size: 14px;
                color: var(--electric-blue);
                font-weight: 500;
                margin-bottom: 5px;
            }

            .heir-amount-text {
                font-family: var(--font-primary);
                font-size: 18px;
                font-weight: 700;
                color: var(--neon-green);
            }

            .navigation-buttons {
                display: flex;
                justify-content: space-between;
                gap: 15px;
                margin-bottom: 25px;
            }

            .nav-btn {
                flex: 1;
                background: var(--gradient-primary);
                border: none;
                border-radius: 12px;
                padding: 15px 25px;
                color: var(--dark-bg);
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .nav-btn.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-primary);
                border: 1px solid rgba(0, 255, 255, 0.2);
            }

            .nav-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }

            .nav-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .actions-section {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                margin-bottom: 25px;
            }

            .action-btn {
                flex: 1;
                min-width: 140px;
                background: var(--gradient-secondary);
                border: none;
                border-radius: 10px;
                padding: 12px 20px;
                color: var(--dark-bg);
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .action-btn.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-primary);
                border: 1px solid rgba(0, 255, 255, 0.2);
            }

            .action-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 15px rgba(0, 255, 65, 0.3);
            }

            .notes-section {
                background: var(--surface);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 20px;
            }

            .note-header {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 16px;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 15px;
            }

            .note-header i {
                color: var(--electric-blue);
            }

            .notes-list {
                color: var(--text-secondary);
                font-size: 13px;
                line-height: 1.6;
                padding-left: 20px;
            }

            .notes-list li {
                margin-bottom: 8px;
            }

            @media (max-width: 768px) {
                .step-indicators {
                    gap: 20px;
                }
                
                .step-number {
                    width: 28px;
                    height: 28px;
                    font-size: 12px;
                }
                
                .step-label {
                    font-size: 11px;
                }
                
                .navigation-buttons {
                    flex-direction: column;
                }
                
                .actions-section {
                    flex-direction: column;
                }
                
                .action-btn {
                    min-width: auto;
                }
                
                .heir-result {
                    flex-direction: column;
                    text-align: center;
                    gap: 15px;
                }
                
                .heir-amount {
                    text-align: center;
                }
            }
            </style>
        `;
    }

    setupEventListeners() {
        // Navigation buttons
        const prevBtn = this.container.querySelector('#prevBtn');
        const nextBtn = this.container.querySelector('#nextBtn');
        const calculateBtn = this.container.querySelector('#calculateBtn');

        prevBtn?.addEventListener('click', () => this.previousStep());
        nextBtn?.addEventListener('click', () => this.nextStep());
        calculateBtn?.addEventListener('click', () => this.calculateInheritance());

        // Tirkah inputs
        ['totalAssets', 'funeralCosts', 'debts', 'wasiat'].forEach(field => {
            const input = this.container.querySelector(`#${field}`);
            if (input) {
                input.addEventListener('input', () => this.updateTirkahSummary());
            }
        });

        // Heirs inputs
        this.setupHeirsEventListeners();

        // Action buttons
        const shareBtn = this.container.querySelector('#shareResults');
        const printBtn = this.container.querySelector('#printResults');
        const newCalculationBtn = this.container.querySelector('#newCalculation');

        shareBtn?.addEventListener('click', () => this.shareResults());
        printBtn?.addEventListener('click', () => this.printResults());
        newCalculationBtn?.addEventListener('click', () => this.newCalculation());
    }

    setupHeirsEventListeners() {
        // Spouse selection
        const spouseRadios = this.container.querySelectorAll('input[name="spouse"]');
        spouseRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateHeirsData());
        });

        // Children checkboxes and counts
        ['sons', 'daughters', 'fullBrothers', 'fullSisters'].forEach(type => {
            const checkbox = this.container.querySelector(`input[name="${type}"]`);
            const countDiv = this.container.querySelector(`#${type}Count`);
            const numberInput = this.container.querySelector(`#${type}Number`);
            
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

        // Parents and other heirs
        ['father', 'mother'].forEach(heir => {
            const checkbox = this.container.querySelector(`input[name="${heir}"]`);
            if (checkbox) {
                checkbox.addEventListener('change', () => this.updateHeirsData());
            }
        });
    }

    showStep(step) {
        // Hide all steps
        for (let i = 1; i <= this.totalSteps; i++) {
            const stepElement = this.container.querySelector(`#step${i}`);
            const indicator = this.container.querySelector(`[data-step="${i}"]`);
            
            if (stepElement) {
                stepElement.style.display = i === step ? 'block' : 'none';
            }
            
            if (indicator) {
                indicator.classList.remove('active', 'completed');
                if (i === step) {
                    indicator.classList.add('active');
                } else if (i < step) {
                    indicator.classList.add('completed');
                }
            }
        }

        // Update progress bar
        const progressFill = this.container.querySelector('#progressFill');
        if (progressFill) {
            const percentage = (step / this.totalSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }

        // Update navigation buttons
        const prevBtn = this.container.querySelector('#prevBtn');
        const nextBtn = this.container.querySelector('#nextBtn');
        const calculateBtn = this.container.querySelector('#calculateBtn');

        if (prevBtn) {
            prevBtn.style.display = step > 1 ? 'flex' : 'none';
        }

        if (nextBtn) {
            nextBtn.style.display = step < this.totalSteps ? 'flex' : 'none';
        }

        if (calculateBtn) {
            calculateBtn.style.display = step === 2 ? 'flex' : 'none';
        }

        this.currentStep = step;
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            // Validate current step before proceeding
            if (this.validateCurrentStep()) {
                this.showStep(this.currentStep + 1);
            }
        }
    }

    validateCurrentStep() {
        if (this.currentStep === 1) {
            // Validate tirkah data
            const totalAssets = parseFloat(this.container.querySelector('#totalAssets').value) || 0;
            if (totalAssets <= 0) {
                this.showNotification('Mohon masukkan total harta yang valid', 'warning');
                return false;
            }
            return true;
        }
        
        if (this.currentStep === 2) {
            // Validate heirs data
            const hasHeirs = this.hasSelectedHeirs();
            if (!hasHeirs) {
                this.showNotification('Mohon pilih minimal satu ahli waris', 'warning');
                return false;
            }
            return true;
        }
        
        return true;
    }

    hasSelectedHeirs() {
        // Check if any heir is selected
        const spouseSelected = this.container.querySelector('input[name="spouse"]:checked');
        const childrenSelected = this.container.querySelector('input[name="sons"]:checked') || 
                               this.container.querySelector('input[name="daughters"]:checked');
        const parentsSelected = this.container.querySelector('input[name="father"]:checked') || 
                              this.container.querySelector('input[name="mother"]:checked');
        const siblingsSelected = this.container.querySelector('input[name="fullBrothers"]:checked') || 
                               this.container.querySelector('input[name="fullSisters"]:checked');
        
        return spouseSelected || childrenSelected || parentsSelected || siblingsSelected;
    }

    updateTirkahSummary() {
        const totalAssets = parseFloat(this.container.querySelector('#totalAssets').value) || 0;
        const funeralCosts = parseFloat(this.container.querySelector('#funeralCosts').value) || 0;
        const debts = parseFloat(this.container.querySelector('#debts').value) || 0;
        const wasiat = parseFloat(this.container.querySelector('#wasiat').value) || 0;
        
        const netAssets = Math.max(0, totalAssets - funeralCosts - debts - wasiat);
        
        // Update display
        this.container.querySelector('#totalAssetsDisplay').textContent = this.formatCurrency(totalAssets);
        this.container.querySelector('#funeralCostsDisplay').textContent = this.formatCurrency(funeralCosts);
        this.container.querySelector('#debtsDisplay').textContent = this.formatCurrency(debts);
        this.container.querySelector('#wasiatDisplay').textContent = this.formatCurrency(wasiat);
        this.container.querySelector('#netAssetsDisplay').textContent = this.formatCurrency(netAssets);
        
        // Update data
        this.data.tirkah = {
            totalAssets,
            funeralCosts,
            debts,
            wasiat,
            netAssets
        };
        
        // Validate wasiat (max 1/3 of net assets before wasiat)
        const maxWasiat = (totalAssets - funeralCosts - debts) / 3;
        if (wasiat > maxWasiat) {
            this.showNotification(`Wasiat melebihi batas maksimal (1/3): ${this.formatCurrency(maxWasiat)}`, 'warning');
        }
    }

    updateHeirsData() {
        this.data.heirs = {};
        
        // Spouse
        const spouseType = this.container.querySelector('input[name="spouse"]:checked')?.value;
        if (spouseType) {
            this.data.heirs[spouseType] = { count: 1 };
        }
        
        // Children
        const sonsCheckbox = this.container.querySelector('input[name="sons"]');
        if (sonsCheckbox?.checked) {
            const count = parseInt(this.container.querySelector('#sonsNumber').value) || 1;
            this.data.heirs.sons = { count };
        }
        
        const daughtersCheckbox = this.container.querySelector('input[name="daughters"]');
        if (daughtersCheckbox?.checked) {
            const count = parseInt(this.container.querySelector('#daughtersNumber').value) || 1;
            this.data.heirs.daughters = { count };
        }
        
        // Parents
        ['father', 'mother'].forEach(parent => {
            const checkbox = this.container.querySelector(`input[name="${parent}"]`);
            if (checkbox?.checked) {
                this.data.heirs[parent] = { count: 1 };
            }
        });
        
        // Siblings
        const fullBrothersCheckbox = this.container.querySelector('input[name="fullBrothers"]');
        if (fullBrothersCheckbox?.checked) {
            const count = parseInt(this.container.querySelector('#fullBrothersNumber').value) || 1;
            this.data.heirs.fullBrothers = { count };
        }
        
        const fullSistersCheckbox = this.container.querySelector('input[name="fullSisters"]');
        if (fullSistersCheckbox?.checked) {
            const count = parseInt(this.container.querySelector('#fullSistersNumber').value) || 1;
            this.data.heirs.fullSisters = { count };
        }
    }

    calculateInheritance() {
        try {
            // Update heirs data before calculation
            this.updateHeirsData();
            
            if (this.data.tirkah.netAssets <= 0) {
                this.showNotification('Tidak ada harta bersih untuk dibagi', 'error');
                return;
            }
            
            // Simplified inheritance calculation
            const results = this.performSimplifiedCalculation();
            
            this.data.results = results;
            this.displayResults(results);
            this.showStep(3);
            
            this.showNotification('Perhitungan waris berhasil', 'success');
            
        } catch (error) {
            console.error('Calculation error:', error);
            this.showNotification('Terjadi kesalahan dalam perhitungan', 'error');
        }
    }

    performSimplifiedCalculation() {
        const netAssets = this.data.tirkah.netAssets;
        const heirs = this.data.heirs;
        const results = [];
        
        let remainingAssets = netAssets;
        let ashabulFurudhTotal = 0;
        
        // Simplified calculation based on basic rules
        
        // 1. Spouse inheritance
        if (heirs.husband) {
            const hasChildren = heirs.sons || heirs.daughters;
            const share = hasChildren ? 0.25 : 0.5; // 1/4 with children, 1/2 without
            const amount = netAssets * share;
            
            results.push({
                heir: 'Suami',
                share: hasChildren ? '1/4' : '1/2',
                amount: amount,
                percentage: share * 100
            });
            
            ashabulFurudhTotal += share;
        }
        
        if (heirs.wife) {
            const hasChildren = heirs.sons || heirs.daughters;
            const share = hasChildren ? 0.125 : 0.25; // 1/8 with children, 1/4 without
            const amount = netAssets * share;
            
            results.push({
                heir: 'Istri',
                share: hasChildren ? '1/8' : '1/4',
                amount: amount,
                percentage: share * 100
            });
            
            ashabulFurudhTotal += share;
        }
        
        // 2. Parents inheritance
        if (heirs.father) {
            const hasChildren = heirs.sons || heirs.daughters;
            if (hasChildren) {
                const share = 1/6; // 1/6 with children
                const amount = netAssets * share;
                
                results.push({
                    heir: 'Ayah',
                    share: '1/6',
                    amount: amount,
                    percentage: share * 100
                });
                
                ashabulFurudhTotal += share;
            }
            // If no children, father gets residue (asabah)
        }
        
        if (heirs.mother) {
            const hasChildren = heirs.sons || heirs.daughters;
            const hasSiblings = heirs.fullBrothers || heirs.fullSisters;
            
            let share;
            if (hasChildren || hasSiblings) {
                share = 1/6; // 1/6 with children or siblings
            } else {
                share = 1/3; // 1/3 normal
            }
            
            const amount = netAssets * share;
            
            results.push({
                heir: 'Ibu',
                share: share === 1/6 ? '1/6' : '1/3',
                amount: amount,
                percentage: share * 100
            });
            
            ashabulFurudhTotal += share;
        }
        
        // 3. Children inheritance (simplified)
        if (heirs.daughters && !heirs.sons) {
            // Only daughters
            const daughterCount = heirs.daughters.count;
            let share;
            if (daughterCount === 1) {
                share = 0.5; // 1/2 for one daughter
            } else {
                share = 2/3; // 2/3 for two or more daughters
            }
            
            const totalAmount = netAssets * share;
            const perDaughter = totalAmount / daughterCount;
            
            results.push({
                heir: `${daughterCount} Anak Perempuan`,
                share: daughterCount === 1 ? '1/2' : '2/3',
                amount: totalAmount,
                amountPerPerson: perDaughter,
                percentage: share * 100
            });
            
            ashabulFurudhTotal += share;
        }
        
        // 4. Calculate residue (asabah)
        const residueShare = Math.max(0, 1 - ashabulFurudhTotal);
        const residueAmount = netAssets * residueShare;
        
        if (residueAmount > 0) {
            // Distribute residue to asabah (sons, father without children, etc.)
            if (heirs.sons) {
                const sonsCount = heirs.sons.count;
                const daughtersCount = heirs.daughters?.count || 0;
                
                if (daughtersCount > 0) {
                    // Sons and daughters together (2:1 ratio)
                    const totalShares = (sonsCount * 2) + daughtersCount;
                    const perShare = residueAmount / totalShares;
                    
                    // Add to existing daughters result or create new
                    const daughtersResult = results.find(r => r.heir.includes('Anak Perempuan'));
                    if (daughtersResult) {
                        daughtersResult.amount += perShare * daughtersCount;
                        daughtersResult.amountPerPerson = daughtersResult.amount / daughtersCount;
                        daughtersResult.share += ' + Asabah';
                    }
                    
                    results.push({
                        heir: `${sonsCount} Anak Laki-laki`,
                        share: 'Asabah (2:1)',
                        amount: perShare * sonsCount * 2,
                        amountPerPerson: perShare * 2,
                        percentage: (perShare * sonsCount * 2 / netAssets) * 100
                    });
                } else {
                    // Only sons
                    const perSon = residueAmount / sonsCount;
                    
                    results.push({
                        heir: `${sonsCount} Anak Laki-laki`,
                        share: 'Asabah',
                        amount: residueAmount,
                        amountPerPerson: perSon,
                        percentage: (residueAmount / netAssets) * 100
                    });
                }
            } else if (heirs.father && !heirs.sons && !heirs.daughters) {
                // Father as asabah
                results.push({
                    heir: 'Ayah',
                    share: 'Asabah',
                    amount: residueAmount,
                    percentage: (residueAmount / netAssets) * 100
                });
            }
        }
        
        return results;
    }

    displayResults(results) {
        const resultsContainer = this.container.querySelector('#resultsContainer');
        
        const summaryHtml = `
            <div class="result-summary">
                <h4>Harta Bersih untuk Dibagi</h4>
                <div class="net-assets-amount">${this.formatCurrency(this.data.tirkah.netAssets)}</div>
            </div>
        `;
        
        const resultsHtml = `
            <div class="inheritance-results">
                ${results.map(result => `
                    <div class="heir-result">
                        <div class="heir-info">
                            <h5>${result.heir}</h5>
                            <div class="heir-details">
                                Bagian: ${result.share}
                                ${result.amountPerPerson ? ` • Per orang: ${this.formatCurrency(result.amountPerPerson)}` : ''}
                            </div>
                        </div>
                        <div class="heir-amount">
                            <div class="heir-share-text">${result.percentage.toFixed(1)}%</div>
                            <div class="heir-amount-text">${this.formatCurrency(result.amount)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        resultsContainer.innerHTML = summaryHtml + resultsHtml;
    }

    shareResults() {
        if (!this.data.results) return;
        
        const shareText = this.generateShareText();
        
        if (navigator.share) {
            navigator.share({
                title: 'Hasil Perhitungan Waris',
                text: shareText
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Hasil disalin ke clipboard', 'success');
            }).catch(() => {
                this.showNotification('Gagal menyalin hasil', 'error');
            });
        }
    }

    generateShareText() {
        const { netAssets } = this.data.tirkah;
        const results = this.data.results;
        
        let text = `Hasil Perhitungan Waris Islam\n`;
        text += `=====================================\n`;
        text += `Harta Bersih: ${this.formatCurrency(netAssets)}\n\n`;
        text += `Pembagian Warisan:\n`;
        
        results.forEach(result => {
            text += `• ${result.heir}: ${this.formatCurrency(result.amount)} (${result.share})\n`;
            if (result.amountPerPerson) {
                text += `  Per orang: ${this.formatCurrency(result.amountPerPerson)}\n`;
            }
        });
        
        text += `\nCatatan: Perhitungan menggunakan metode Jumhur Ulama. Konsultasikan dengan ahli syariah untuk kasus kompleks.`;
        
        return text;
    }

    printResults() {
        const printWindow = window.open('', '_blank');
        const printContent = this.generatePrintContent();
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    generatePrintContent() {
        return `
            <html>
            <head>
                <title>Hasil Perhitungan Waris</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
                    .result-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .footer { margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Hasil Perhitungan Waris Islam</h1>
                    <p>Sesuai Metode Jumhur Ulama</p>
                </div>
                
                <div class="summary">
                    <h3>Harta Bersih untuk Dibagi</h3>
                    <h2>${this.formatCurrency(this.data.tirkah.netAssets)}</h2>
                </div>
                
                <h3>Pembagian Warisan:</h3>
                ${this.data.results.map(result => `
                    <div class="result-item">
                        <div>
                            <strong>${result.heir}</strong><br>
                            <small>Bagian: ${result.share}</small>
                        </div>
                        <div style="text-align: right;">
                            <strong>${this.formatCurrency(result.amount)}</strong><br>
                            <small>${result.percentage.toFixed(1)}%</small>
                        </div>
                    </div>
                `).join('')}
                
                <div class="footer">
                    <p><strong>Catatan Penting:</strong></p>
                    <ul>
                        <li>Perhitungan menggunakan metode Jumhur Ulama (mayoritas ulama)</li>
                        <li>Aplikasi ini hanya untuk simulasi dan pembelajaran</li>
                        <li>Konsultasikan dengan ahli syariah untuk kasus kompleks</li>
                        <li>Tanggal perhitungan: ${new Date().toLocaleDateString('id-ID')}</li>
                    </ul>
                </div>
            </body>
            </html>
        `;
    }

    newCalculation() {
        // Reset all data
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
        this.container.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '';
        });
        
        this.container.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            input.checked = false;
        });
        
        // Hide count inputs
        this.container.querySelectorAll('.count-input').forEach(div => {
            div.style.display = 'none';
        });
        
        // Update displays
        this.updateTirkahSummary();
        
        // Go back to step 1
        this.showStep(1);
        
        this.showNotification('Data direset, siap untuk perhitungan baru', 'info');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    showNotification(message, type = 'info') {
        // Use the main app's notification manager
        if (window.app && window.app.notificationManager) {
            window.app.notificationManager.show(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    renderError() {
        this.container.innerHTML = `
            <div class="component-error">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Gagal Memuat Kalkulator Waris</h3>
                <p>Terjadi kesalahan saat memuat aplikasi. Silakan coba lagi.</p>
                <button onclick="this.closest('.app-component').dispatchEvent(new CustomEvent('retry'))" 
                        class="retry-btn">
                    <i class="fas fa-redo"></i>
                    Coba Lagi
                </button>
            </div>
            
            <style>
            .component-error {
                text-align: center;
                padding: 60px 20px;
                color: var(--text-secondary);
            }
            
            .error-icon {
                font-size: 48px;
                color: #ff4757;
                margin-bottom: 20px;
            }
            
            .component-error h3 {
                color: var(--text-primary);
                margin-bottom: 10px;
            }
            
            .retry-btn {
                background: var(--gradient-primary);
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                color: var(--dark-bg);
                font-weight: 600;
                cursor: pointer;
                margin-top: 20px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            }
            
            .retry-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }
            </style>
        `;

        // Add retry event listener
        this.container.addEventListener('retry', () => {
            this.init();
        });
    }

    destroy() {
        console.log('🏦 Waris Component destroyed');
    }
}