// Kalkulator Zakat — Zakat Maal, Fitrah, dan Profesi
import { t } from '../../i18n/index.js';

export default class ZakatApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('zakat-app');
        this.currentTab = 'maal';
        // Harga emas per gram (IDR) — bisa diperbarui
        this.hargaEmas = 1180000;
        this.hargaBeras = 14000; // per kg
        this.nisabEmasGram = 85;
    }

    async init() {
        this.render();
    }

    render() {
        this.container.innerHTML = `
        <div class="zakat-container">
            <div class="zakat-header">
                <h2><i class="fas fa-hand-holding-heart"></i> ${t('zakat.title')}</h2>
                <p class="zakat-subtitle">${t('zakat.subtitle')}</p>
            </div>

            <div class="zakat-tabs">
                <button class="zakat-tab active" data-tab="maal"><i class="fas fa-coins"></i> ${t('zakat.tabMaal')}</button>
                <button class="zakat-tab" data-tab="fitrah"><i class="fas fa-wheat-awn"></i> ${t('zakat.tabFitrah')}</button>
            </div>

            <!-- ZAKAT MAAL -->
            <div class="zakat-panel" id="panel-maal">
                <div class="zakat-info-box">
                    <i class="fas fa-info-circle"></i>
                    <div>
                        <strong>${t('zakat.nisabMaalTitle')}</strong>
                        <p>${t('zakat.nisabMaalDesc', { amount: '<span id="nisabRupiah">0</span>' })}</p>
                    </div>
                </div>

                <div class="zakat-form">
                    <div class="zakat-input-group">
                        <label><i class="fas fa-coins"></i> ${t('zakat.gold')}</label>
                        <input type="number" id="inputEmas" placeholder="0" min="0">
                        <span class="zakat-hint">${t('zakat.goldHint')}</span>
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-ring"></i> ${t('zakat.silver')}</label>
                        <input type="number" id="inputPerak" placeholder="0" min="0">
                        <span class="zakat-hint">${t('zakat.silverHint')}</span>
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-piggy-bank"></i> ${t('zakat.savings')}</label>
                        <input type="number" id="inputTabungan" placeholder="0" min="0">
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-chart-line"></i> ${t('zakat.investment')}</label>
                        <input type="number" id="inputInvestasi" placeholder="0" min="0">
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-store"></i> ${t('zakat.trade')}</label>
                        <input type="number" id="inputDagang" placeholder="0" min="0">
                        <span class="zakat-hint">${t('zakat.tradeHint')}</span>
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-money-bill"></i> ${t('zakat.receivables')}</label>
                        <input type="number" id="inputPiutang" placeholder="0" min="0">
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-tag"></i> ${t('zakat.goldPrice')}</label>
                        <input type="number" id="inputHargaEmas" value="${this.hargaEmas}" min="0">
                        <span class="zakat-hint">${t('zakat.goldPriceHint')}</span>
                    </div>

                    <button class="zakat-calc-btn" id="btnHitungMaal">
                        <i class="fas fa-calculator"></i> ${t('zakat.btnCalcMaal')}
                    </button>
                </div>

                <div class="zakat-result" id="resultMaal" style="display:none">
                    <div class="zakat-result-header">
                        <i class="fas fa-check-circle"></i>
                        <h3>${t('zakat.calcResult')}</h3>
                    </div>

                    <!-- Nisab progress bar -->
                    <div class="zakat-nisab-progress">
                        <div class="zakat-nisab-progress-header">
                            <span><i class="fas fa-bullseye"></i> ${t('zakat.progressToNisab')}</span>
                            <span class="zakat-nisab-pct" id="nisabPercent">0%</span>
                        </div>
                        <div class="zakat-nisab-bar">
                            <div class="zakat-nisab-fill" id="nisabFill"></div>
                            <div class="zakat-nisab-marker"><span>${t('zakat.nisabMarker')}</span></div>
                        </div>
                    </div>

                    <!-- Breakdown donut chart of harta composition -->
                    <div class="zakat-breakdown" id="maalBreakdown"></div>

                    <div class="zakat-result-grid">
                        <div class="zakat-result-item">
                            <span class="label">${t('zakat.totalWealth')}</span>
                            <span class="value" id="totalHarta">Rp 0</span>
                        </div>
                        <div class="zakat-result-item">
                            <span class="label">${t('zakat.nisab')}</span>
                            <span class="value" id="nisabAmount">Rp 0</span>
                        </div>
                        <div class="zakat-result-item highlight">
                            <span class="label">${t('zakat.status')}</span>
                            <span class="value" id="statusMaal">-</span>
                        </div>
                        <div class="zakat-result-item highlight-gold">
                            <span class="label">${t('zakat.obligatoryZakat')}</span>
                            <span class="value" id="zakatMaalAmount">Rp 0</span>
                        </div>
                    </div>
                    <p class="zakat-note" id="noteMaal"></p>
                </div>
            </div>

            <!-- ZAKAT FITRAH -->
            <div class="zakat-panel" id="panel-fitrah" style="display:none">
                <div class="zakat-info-box">
                    <i class="fas fa-info-circle"></i>
                    <div>
                        <strong>${t('zakat.fitrahTitle')}</strong>
                        <p>${t('zakat.fitrahDesc')}</p>
                    </div>
                </div>

                <div class="zakat-form">
                    <div class="zakat-input-group">
                        <label><i class="fas fa-users"></i> ${t('zakat.soulsCount')}</label>
                        <input type="number" id="inputJiwa" value="1" min="1">
                        <span class="zakat-hint">${t('zakat.soulsHint')}</span>
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-wheat-awn"></i> ${t('zakat.paymentType')}</label>
                        <select id="inputJenisFitrah" class="zakat-select">
                            <option value="beras">${t('zakat.rice')}</option>
                            <option value="uang">${t('zakat.moneyConverted')}</option>
                        </select>
                    </div>
                    <div class="zakat-input-group" id="groupHargaBeras">
                        <label><i class="fas fa-tag"></i> ${t('zakat.ricePrice')}</label>
                        <input type="number" id="inputHargaBeras" value="${this.hargaBeras}" min="0">
                        <span class="zakat-hint">${t('zakat.ricePriceHint')}</span>
                    </div>

                    <button class="zakat-calc-btn" id="btnHitungFitrah">
                        <i class="fas fa-calculator"></i> ${t('zakat.btnCalcFitrah')}
                    </button>
                </div>

                <div class="zakat-result" id="resultFitrah" style="display:none">
                    <div class="zakat-result-header">
                        <i class="fas fa-check-circle"></i>
                        <h3>${t('zakat.calcResult')}</h3>
                    </div>
                    <div class="zakat-result-grid">
                        <div class="zakat-result-item">
                            <span class="label">${t('zakat.soulsLabel')}</span>
                            <span class="value" id="totalJiwa">0 orang</span>
                        </div>
                        <div class="zakat-result-item highlight-gold">
                            <span class="label">${t('zakat.totalRice')}</span>
                            <span class="value" id="totalBeras">0 kg</span>
                        </div>
                        <div class="zakat-result-item highlight">
                            <span class="label">${t('zakat.orMoney')}</span>
                            <span class="value" id="totalUangFitrah">Rp 0</span>
                        </div>
                    </div>
                    <div class="zakat-dalil-box">
                        <p>${t('zakat.fitrahDalil')}</p>
                    </div>
                </div>
            </div>

            <!-- Catatan: Zakat Profesi tidak diakui dalam pemahaman salaf -->
            <div class="zakat-panel-note" id="panel-profesi-info">
                <div class="zakat-info-box salafi-note">
                    <i class="fas fa-info-circle"></i>
                    <div>
                        <strong>${t('zakat.salafiNoteTitle')}</strong>
                        <p>${t('zakat.salafiNoteDesc')}</p>
                        <p style="margin-top:8px; font-size:0.85rem; opacity:0.85;">
                            ${t('zakat.salafiNoteRef')}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Keterangan Golongan Penerima -->
            <div class="zakat-mustahiq">
                <h3><i class="fas fa-users"></i> ${t('zakat.mustahiqTitle')}</h3>
                <div class="zakat-mustahiq-grid">
                    ${this.renderMustahiq()}
                </div>
                <p class="zakat-dalil">QS. At-Taubah: 60</p>
            </div>
        </div>`;

        this.setupEvents();
        this.switchTab(this.currentTab || 'maal');
    }

    renderMustahiq() {
        const golongan = [
            { icon: 'fa-person-cane', label: t('zakat.mustahiqFakir'), desc: t('zakat.mustahiqFakirDesc') },
            { icon: 'fa-hand-holding', label: t('zakat.mustahiqMiskin'), desc: t('zakat.mustahiqMiskinDesc') },
            { icon: 'fa-user-tie', label: t('zakat.mustahiqAmil'), desc: t('zakat.mustahiqAmilDesc') },
            { icon: 'fa-handshake', label: t('zakat.mustahiqMuallaf'), desc: t('zakat.mustahiqMuallafDesc') },
            { icon: 'fa-link-slash', label: t('zakat.mustahiqRiqab'), desc: t('zakat.mustahiqRiqabDesc') },
            { icon: 'fa-weight-hanging', label: t('zakat.mustahiqGharim'), desc: t('zakat.mustahiqGharimDesc') },
            { icon: 'fa-road', label: t('zakat.mustahiqFiSabilillah'), desc: t('zakat.mustahiqFiSabilillahDesc') },
            { icon: 'fa-suitcase', label: t('zakat.mustahiqIbnuSabil'), desc: t('zakat.mustahiqIbnuSabilDesc') },
        ];
        return golongan.map(g => `
            <div class="zakat-mustahiq-item">
                <i class="fas ${g.icon}"></i>
                <strong>${g.label}</strong>
                <span>${g.desc}</span>
            </div>`).join('');
    }

    setupEvents() {
        this.container.querySelectorAll('.zakat-tab').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        const btnMaal = document.getElementById('btnHitungMaal');
        if (btnMaal) btnMaal.addEventListener('click', () => this.hitungMaal());

        const btnFitrah = document.getElementById('btnHitungFitrah');
        if (btnFitrah) btnFitrah.addEventListener('click', () => this.hitungFitrah());

        // Update nisab display when harga emas changes
        const inputHargaEmas = document.getElementById('inputHargaEmas');
        if (inputHargaEmas) {
            inputHargaEmas.addEventListener('input', () => this.updateNisabDisplay());
            this.updateNisabDisplay();
        }
    }

    switchTab(tab) {
        this.currentTab = tab;
        this.container.querySelectorAll('.zakat-tab').forEach(b => {
            b.classList.toggle('active', b.dataset.tab === tab);
        });
        ['maal', 'fitrah'].forEach(t => {
            const el = document.getElementById(`panel-${t}`);
            if (el) el.style.display = t === tab ? 'block' : 'none';
        });
    }

    updateNisabDisplay() {
        const harga = parseFloat(document.getElementById('inputHargaEmas')?.value) || this.hargaEmas;
        const nisab = harga * this.nisabEmasGram;
        const el = document.getElementById('nisabRupiah');
        if (el) el.textContent = this.formatRupiah(nisab);
    }

    hitungMaal() {
        const hargaEmas = parseFloat(document.getElementById('inputHargaEmas')?.value) || this.hargaEmas;
        const emas     = (parseFloat(document.getElementById('inputEmas')?.value) || 0) * hargaEmas;
        const perak    = (parseFloat(document.getElementById('inputPerak')?.value) || 0) * 9000;
        const tabungan  = parseFloat(document.getElementById('inputTabungan')?.value) || 0;
        const investasi = parseFloat(document.getElementById('inputInvestasi')?.value) || 0;
        const dagang    = parseFloat(document.getElementById('inputDagang')?.value) || 0;
        const piutang   = parseFloat(document.getElementById('inputPiutang')?.value) || 0;

        const total  = emas + perak + tabungan + investasi + dagang + piutang;
        const nisab  = hargaEmas * this.nisabEmasGram;
        const wajib  = total >= nisab;
        const zakat  = wajib ? total * 0.025 : 0;

        document.getElementById('totalHarta').textContent = 'Rp ' + this.formatRupiah(total);
        document.getElementById('nisabAmount').textContent = 'Rp ' + this.formatRupiah(nisab);
        document.getElementById('statusMaal').textContent = wajib ? t('zakat.statusObligatory') : t('zakat.statusNotReached');
        document.getElementById('statusMaal').style.color = wajib ? '#00ff88' : '#ff6b6b';
        document.getElementById('zakatMaalAmount').textContent = 'Rp ' + this.formatRupiah(zakat);
        document.getElementById('noteMaal').textContent = wajib
            ? t('zakat.noteObligatory', { amount: this.formatRupiah(zakat) })
            : t('zakat.noteNotReached', { amount: this.formatRupiah(nisab) });

        // Update nisab progress bar
        const pct = nisab > 0 ? Math.min(100, (total / nisab) * 100) : 0;
        const nisabFill = document.getElementById('nisabFill');
        const nisabPct = document.getElementById('nisabPercent');
        if (nisabFill) {
            nisabFill.style.width = pct + '%';
            nisabFill.classList.toggle('reached', pct >= 100);
        }
        if (nisabPct) nisabPct.textContent = pct.toFixed(1) + '%';

        // Render breakdown donut chart
        this.renderMaalBreakdown({ emas, perak, tabungan, investasi, dagang, piutang, total });

        document.getElementById('resultMaal').style.display = 'block';
        document.getElementById('resultMaal').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    renderMaalBreakdown(parts) {
        const el = document.getElementById('maalBreakdown');
        if (!el) return;
        const total = parts.total || 1;
        const segments = [
            { id: 'emas',      label: t('zakat.segGold'),        value: parts.emas,      color: '#ffd700', icon: 'fas fa-coins' },
            { id: 'perak',     label: t('zakat.segSilver'),      value: parts.perak,     color: '#c0c0c0', icon: 'fas fa-ring' },
            { id: 'tabungan',  label: t('zakat.segSavings'),     value: parts.tabungan,  color: '#00d4ff', icon: 'fas fa-piggy-bank' },
            { id: 'investasi', label: t('zakat.segInvestment'),  value: parts.investasi, color: '#a78bfa', icon: 'fas fa-chart-line' },
            { id: 'dagang',    label: t('zakat.segTrade'),       value: parts.dagang,    color: '#ff8c42', icon: 'fas fa-store' },
            { id: 'piutang',   label: t('zakat.segReceivables'), value: parts.piutang,   color: '#34d399', icon: 'fas fa-money-bill' },
        ].filter(s => s.value > 0);

        if (segments.length === 0) {
            el.innerHTML = '';
            return;
        }

        const radius = 70;
        const circ = 2 * Math.PI * radius;
        let offset = 0;
        let svgSegments = '';
        let legend = '';

        segments.forEach(seg => {
            const ratio = seg.value / total;
            const dash = circ * ratio;
            svgSegments += `
                <circle class="zakat-donut-seg" cx="100" cy="100" r="${radius}"
                    fill="none" stroke="${seg.color}" stroke-width="22"
                    stroke-dasharray="${dash} ${circ}"
                    stroke-dashoffset="${-offset}"
                    transform="rotate(-90 100 100)">
                    <title>${seg.label} — ${this.formatRupiah(seg.value)} (${(ratio*100).toFixed(1)}%)</title>
                </circle>
            `;
            legend += `
                <div class="zakat-donut-leg">
                    <span class="zakat-donut-dot" style="background:${seg.color}"></span>
                    <i class="${seg.icon}" style="color:${seg.color}"></i>
                    <span class="zakat-donut-label">${seg.label}</span>
                    <span class="zakat-donut-pct">${(ratio*100).toFixed(1)}%</span>
                </div>
            `;
            offset += dash;
        });

        el.innerHTML = `
            <h4><i class="fas fa-chart-pie"></i> ${t('zakat.compositionTitle')}</h4>
            <div class="zakat-donut-wrap">
                <svg class="zakat-donut-svg" viewBox="0 0 200 200">
                    ${svgSegments}
                    <text x="100" y="92" text-anchor="middle" class="zakat-donut-center-num">
                        ${segments.length}
                    </text>
                    <text x="100" y="112" text-anchor="middle" class="zakat-donut-center-lbl">${t('zakat.assetTypes')}</text>
                </svg>
                <div class="zakat-donut-legend">${legend}</div>
            </div>
        `;
    }

    hitungFitrah() {
        const jiwa   = parseFloat(document.getElementById('inputJiwa')?.value) || 1;
        const jenis  = document.getElementById('inputJenisFitrah')?.value || 'beras';
        const hargaBeras = parseFloat(document.getElementById('inputHargaBeras')?.value) || this.hargaBeras;
        const sha   = 2.5; // kg per orang
        const totalBeras = jiwa * sha;
        const totalUang  = totalBeras * hargaBeras;

        document.getElementById('totalJiwa').textContent   = t('zakat.peopleCount', { count: jiwa });
        document.getElementById('totalBeras').textContent  = totalBeras + ' kg';
        document.getElementById('totalUangFitrah').textContent = 'Rp ' + this.formatRupiah(totalUang);
        document.getElementById('resultFitrah').style.display = 'block';
        document.getElementById('resultFitrah').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    formatRupiah(angka) {
        return Math.round(angka).toLocaleString('id-ID');
    }
}
