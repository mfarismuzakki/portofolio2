// Kalkulator Zakat — Zakat Maal, Fitrah, dan Profesi

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
        this.setupEvents();
        this.switchTab('maal');
    }

    render() {
        this.container.innerHTML = `
        <div class="zakat-container">
            <div class="zakat-header">
                <h2><i class="fas fa-hand-holding-heart"></i> Kalkulator Zakat</h2>
                <p class="zakat-subtitle">Hitung zakat maal, fitrah, dan profesi sesuai syariat Islam</p>
            </div>

            <div class="zakat-tabs">
                <button class="zakat-tab active" data-tab="maal"><i class="fas fa-coins"></i> Zakat Maal</button>
                <button class="zakat-tab" data-tab="fitrah"><i class="fas fa-wheat-awn"></i> Zakat Fitrah</button>
            </div>

            <!-- ZAKAT MAAL -->
            <div class="zakat-panel" id="panel-maal">
                <div class="zakat-info-box">
                    <i class="fas fa-info-circle"></i>
                    <div>
                        <strong>Nisab Zakat Maal</strong>
                        <p>Setara 85 gram emas (≈ Rp <span id="nisabRupiah">0</span>). Jika total harta mencapai nisab dan sudah dimiliki 1 tahun Hijriyah (haul), wajib zakat <strong>2,5%</strong>.</p>
                    </div>
                </div>

                <div class="zakat-form">
                    <div class="zakat-input-group">
                        <label><i class="fas fa-coins"></i> Emas (gram)</label>
                        <input type="number" id="inputEmas" placeholder="0" min="0">
                        <span class="zakat-hint">Termasuk perhiasan yang disimpan</span>
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-ring"></i> Perak (gram)</label>
                        <input type="number" id="inputPerak" placeholder="0" min="0">
                        <span class="zakat-hint">Nisab perak = 595 gram</span>
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-piggy-bank"></i> Tabungan / Deposito (Rp)</label>
                        <input type="number" id="inputTabungan" placeholder="0" min="0">
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-chart-line"></i> Saham / Investasi (Rp)</label>
                        <input type="number" id="inputInvestasi" placeholder="0" min="0">
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-store"></i> Harta Dagang (Rp)</label>
                        <input type="number" id="inputDagang" placeholder="0" min="0">
                        <span class="zakat-hint">Nilai stok barang dagangan</span>
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-money-bill"></i> Piutang yang diharapkan kembali (Rp)</label>
                        <input type="number" id="inputPiutang" placeholder="0" min="0">
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-tag"></i> Harga Emas Saat Ini (Rp/gram)</label>
                        <input type="number" id="inputHargaEmas" value="${this.hargaEmas}" min="0">
                        <span class="zakat-hint">Sesuaikan dengan harga emas terkini</span>
                    </div>

                    <button class="zakat-calc-btn" id="btnHitungMaal">
                        <i class="fas fa-calculator"></i> Hitung Zakat Maal
                    </button>
                </div>

                <div class="zakat-result" id="resultMaal" style="display:none">
                    <div class="zakat-result-header">
                        <i class="fas fa-check-circle"></i>
                        <h3>Hasil Perhitungan</h3>
                    </div>

                    <!-- Nisab progress bar -->
                    <div class="zakat-nisab-progress">
                        <div class="zakat-nisab-progress-header">
                            <span><i class="fas fa-bullseye"></i> Progress menuju Nisab</span>
                            <span class="zakat-nisab-pct" id="nisabPercent">0%</span>
                        </div>
                        <div class="zakat-nisab-bar">
                            <div class="zakat-nisab-fill" id="nisabFill"></div>
                            <div class="zakat-nisab-marker"><span>Nisab</span></div>
                        </div>
                    </div>

                    <!-- Breakdown donut chart of harta composition -->
                    <div class="zakat-breakdown" id="maalBreakdown"></div>

                    <div class="zakat-result-grid">
                        <div class="zakat-result-item">
                            <span class="label">Total Harta</span>
                            <span class="value" id="totalHarta">Rp 0</span>
                        </div>
                        <div class="zakat-result-item">
                            <span class="label">Nisab</span>
                            <span class="value" id="nisabAmount">Rp 0</span>
                        </div>
                        <div class="zakat-result-item highlight">
                            <span class="label">Status</span>
                            <span class="value" id="statusMaal">-</span>
                        </div>
                        <div class="zakat-result-item highlight-gold">
                            <span class="label">Zakat yang Wajib (2,5%)</span>
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
                        <strong>Zakat Fitrah</strong>
                        <p>Wajib bagi setiap Muslim yang mampu. Besarnya <strong>1 sha\' (± 2,5 kg)</strong> makanan pokok per jiwa. Dibayarkan sebelum sholat Idul Fitri.</p>
                    </div>
                </div>

                <div class="zakat-form">
                    <div class="zakat-input-group">
                        <label><i class="fas fa-users"></i> Jumlah Jiwa (termasuk diri sendiri)</label>
                        <input type="number" id="inputJiwa" value="1" min="1">
                        <span class="zakat-hint">Tanggungan yang wajib dibayarkan zakatsnya</span>
                    </div>
                    <div class="zakat-input-group">
                        <label><i class="fas fa-wheat-awn"></i> Jenis Pembayaran</label>
                        <select id="inputJenisFitrah" class="zakat-select">
                            <option value="beras">Beras</option>
                            <option value="uang">Uang (dikonversi ke beras)</option>
                        </select>
                    </div>
                    <div class="zakat-input-group" id="groupHargaBeras">
                        <label><i class="fas fa-tag"></i> Harga Beras (Rp/kg)</label>
                        <input type="number" id="inputHargaBeras" value="${this.hargaBeras}" min="0">
                        <span class="zakat-hint">Beras kualitas yang biasa dikonsumsi</span>
                    </div>

                    <button class="zakat-calc-btn" id="btnHitungFitrah">
                        <i class="fas fa-calculator"></i> Hitung Zakat Fitrah
                    </button>
                </div>

                <div class="zakat-result" id="resultFitrah" style="display:none">
                    <div class="zakat-result-header">
                        <i class="fas fa-check-circle"></i>
                        <h3>Hasil Perhitungan</h3>
                    </div>
                    <div class="zakat-result-grid">
                        <div class="zakat-result-item">
                            <span class="label">Jumlah Jiwa</span>
                            <span class="value" id="totalJiwa">0 orang</span>
                        </div>
                        <div class="zakat-result-item highlight-gold">
                            <span class="label">Total Beras</span>
                            <span class="value" id="totalBeras">0 kg</span>
                        </div>
                        <div class="zakat-result-item highlight">
                            <span class="label">Atau Uang</span>
                            <span class="value" id="totalUangFitrah">Rp 0</span>
                        </div>
                    </div>
                    <div class="zakat-dalil-box">
                        <p><strong>Dalil:</strong> "Rasulullah ﷺ mewajibkan zakat fitrah satu sha\' kurma atau satu sha\' gandum atas setiap Muslim, merdeka maupun hamba, laki-laki maupun perempuan, kecil maupun besar." (HR. Bukhari & Muslim)</p>
                    </div>
                </div>
            </div>

            <!-- Catatan: Zakat Profesi tidak diakui dalam pemahaman salaf -->
            <div class="zakat-panel-note" id="panel-profesi-info">
                <div class="zakat-info-box salafi-note">
                    <i class="fas fa-info-circle"></i>
                    <div>
                        <strong>Mengenai "Zakat Profesi/Penghasilan"</strong>
                        <p>
                            Mayoritas ulama Ahlus Sunnah berpaham salaf — di antaranya
                            <strong>Syaikh 'Abdul 'Aziz bin Baz</strong>,
                            <strong>Syaikh Muhammad bin Shalih al-'Utsaimin</strong>,
                            <strong>Syaikh al-Albani</strong>,
                            <strong>Syaikh Shalih al-Fauzan</strong>, dan
                            <strong>Al-Lajnah ad-Da'imah</strong> (Komite Tetap Riset Ilmiah
                            &amp; Fatwa Kerajaan Arab Saudi) — tidak mengenal istilah
                            "zakat profesi". Penghasilan/gaji termasuk dalam zakat <em>maal</em>
                            (zakat harta), yang dizakati setelah <strong>tersimpan sampai
                            haul (1 tahun Hijriyah)</strong> dan mencapai <strong>nisab</strong>
                            (85 gram emas). Cukup masukkan saldo tabungan / gaji yang
                            tersisa di akhir tahun ke kalkulator <em>Zakat Maal</em> di atas.
                        </p>
                        <p style="margin-top:8px; font-size:0.85rem; opacity:0.85;">
                            <i class="fas fa-book-open"></i> Rujukan:
                            <em>Fatawa Lajnah Da'imah</em> Jilid 9 hal. 281,
                            <em>Majmu' Fatawa Ibn Baz</em> 14/134,
                            <em>Asy-Syarhul Mumti'</em> karya Syaikh al-'Utsaimin Jilid 6.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Keterangan Golongan Penerima -->
            <div class="zakat-mustahiq">
                <h3><i class="fas fa-users"></i> 8 Golongan Penerima Zakat</h3>
                <div class="zakat-mustahiq-grid">
                    ${this.renderMustahiq()}
                </div>
                <p class="zakat-dalil">QS. At-Taubah: 60</p>
            </div>
        </div>`;
    }

    renderMustahiq() {
        const golongan = [
            { icon: 'fa-person-cane', label: 'Fakir', desc: 'Tidak memiliki harta sama sekali' },
            { icon: 'fa-hand-holding', label: 'Miskin', desc: 'Berpenghasilan tapi tidak cukup' },
            { icon: 'fa-user-tie', label: 'Amil', desc: 'Pengelola zakat' },
            { icon: 'fa-hands-praying', label: 'Muallaf', desc: 'Orang yang baru masuk Islam' },
            { icon: 'fa-link-slash', label: 'Riqab', desc: 'Memerdekakan budak' },
            { icon: 'fa-weight-hanging', label: 'Gharim', desc: 'Terlilit utang halal' },
            { icon: 'fa-road', label: 'Fi Sabilillah', desc: 'Di jalan Allah' },
            { icon: 'fa-suitcase', label: 'Ibnu Sabil', desc: 'Musafir kehabisan bekal' },
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
        document.getElementById('statusMaal').textContent = wajib ? '✅ WAJIB ZAKAT' : '❌ Belum Mencapai Nisab';
        document.getElementById('statusMaal').style.color = wajib ? '#00ff88' : '#ff6b6b';
        document.getElementById('zakatMaalAmount').textContent = 'Rp ' + this.formatRupiah(zakat);
        document.getElementById('noteMaal').textContent = wajib
            ? `Alhamdulillah, harta Anda mencapai nisab. Segera tunaikan zakat sebesar Rp ${this.formatRupiah(zakat)} kepada 8 golongan yang berhak menerimanya.`
            : `Total harta Anda belum mencapai nisab (Rp ${this.formatRupiah(nisab)}). Belum wajib zakat, namun sangat dianjurkan bersedekah.`;

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
            { id: 'emas',      label: 'Emas',       value: parts.emas,      color: '#ffd700', icon: 'fas fa-coins' },
            { id: 'perak',     label: 'Perak',      value: parts.perak,     color: '#c0c0c0', icon: 'fas fa-ring' },
            { id: 'tabungan',  label: 'Tabungan',   value: parts.tabungan,  color: '#00d4ff', icon: 'fas fa-piggy-bank' },
            { id: 'investasi', label: 'Investasi',  value: parts.investasi, color: '#a78bfa', icon: 'fas fa-chart-line' },
            { id: 'dagang',    label: 'Dagang',     value: parts.dagang,    color: '#ff8c42', icon: 'fas fa-store' },
            { id: 'piutang',   label: 'Piutang',    value: parts.piutang,   color: '#34d399', icon: 'fas fa-money-bill' },
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
            <h4><i class="fas fa-chart-pie"></i> Komposisi Harta</h4>
            <div class="zakat-donut-wrap">
                <svg class="zakat-donut-svg" viewBox="0 0 200 200">
                    ${svgSegments}
                    <text x="100" y="92" text-anchor="middle" class="zakat-donut-center-num">
                        ${segments.length}
                    </text>
                    <text x="100" y="112" text-anchor="middle" class="zakat-donut-center-lbl">JENIS HARTA</text>
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

        document.getElementById('totalJiwa').textContent   = jiwa + ' orang';
        document.getElementById('totalBeras').textContent  = totalBeras + ' kg';
        document.getElementById('totalUangFitrah').textContent = 'Rp ' + this.formatRupiah(totalUang);
        document.getElementById('resultFitrah').style.display = 'block';
        document.getElementById('resultFitrah').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    formatRupiah(angka) {
        return Math.round(angka).toLocaleString('id-ID');
    }
}
