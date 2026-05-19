// Peta Perjalanan Haji & Umrah — Panduan Visual Manasik
import { HAJI_LOCATIONS, MANASIK_HAJI, MANASIK_UMRAH, LARANGAN_IHRAM, HAJI_MIQAT } from '../../data/haji/haji-data.js';

export default class HajiApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('haji-app');
        this.activeTab = 'haji';
        this.selectedLocation = null;
        this.leafletMap = null;
    }

    async init() {
        this.render();
        this.setupEvents();
    }

    render() {
        this.container.innerHTML = `
        <div class="haji-container">
            <div class="haji-header">
                <h2><i class="fas fa-kaaba"></i> Haji & Umrah</h2>
                <p class="haji-subtitle">Panduan visual perjalanan suci menuju Baitullah</p>
            </div>

            <!-- Tabs -->
            <div class="haji-tabs">
                <button class="haji-tab active" data-tab="haji"><i class="fas fa-kaaba"></i> Manasik Haji</button>
                <button class="haji-tab" data-tab="umrah"><i class="fas fa-rotate"></i> Manasik Umrah</button>
                <button class="haji-tab" data-tab="peta"><i class="fas fa-map-marked-alt"></i> Peta Lokasi</button>
                <button class="haji-tab" data-tab="ihram"><i class="fas fa-ban"></i> Larangan Ihram</button>
            </div>

            <!-- MANASIK HAJI -->
            <div class="haji-panel" id="panel-haji">
                <div class="haji-intro">
                    <i class="fas fa-info-circle"></i>
                    <p>Haji wajib bagi Muslim yang <strong>mampu secara fisik dan finansial</strong>, sekali seumur hidup. "Dan bagi Allah atas manusia adalah kewajiban haji ke Baitullah bagi yang mampu..." (QS. Ali Imran: 97)</p>
                </div>

                <h3 class="haji-section-title"><i class="fas fa-calendar-alt"></i> Urutan Manasik Haji (Hari per Hari)</h3>
                <div class="haji-timeline">
                    ${MANASIK_HAJI.map((m, i) => `
                    <div class="haji-timeline-item">
                        <div class="haji-timeline-dot">
                            <i class="fas ${m.icon}"></i>
                        </div>
                        <div class="haji-timeline-content">
                            <div class="haji-timeline-header">
                                <span class="haji-timeline-hari">${m.hari}</span>
                                <strong>${m.nama}</strong>
                            </div>
                            <ul class="haji-timeline-amalan">
                                ${m.amalan.map(a => `<li>${a}</li>`).join('')}
                            </ul>
                        </div>
                    </div>`).join('')}
                </div>

                <h3 class="haji-section-title"><i class="fas fa-sign-in-alt"></i> Miqat — Batas Mulai Ihram</h3>
                <div class="haji-miqat-list">
                    ${HAJI_MIQAT.map(m => `
                    <div class="haji-miqat-item">
                        <div class="haji-miqat-name"><i class="fas fa-map-pin"></i> ${m.name}</div>
                        <div class="haji-miqat-detail">
                            <span><i class="fas fa-compass"></i> ${m.region}</span>
                            <span><i class="fas fa-road"></i> ${m.distance}</span>
                        </div>
                        <div class="haji-miqat-note">${m.note}</div>
                    </div>`).join('')}
                </div>
            </div>

            <!-- MANASIK UMRAH -->
            <div class="haji-panel" id="panel-umrah" style="display:none">
                <div class="haji-intro">
                    <i class="fas fa-info-circle"></i>
                    <p>Umrah adalah ibadah sunnah muakkadah yang dapat dilakukan kapan saja sepanjang tahun (kecuali hari Arafah). <em>"Umrah ke umrah berikutnya adalah penghapus dosa di antara keduanya"</em> (HR. Bukhari & Muslim)</p>
                </div>

                <h3 class="haji-section-title"><i class="fas fa-list-ol"></i> Rukun Umrah (Urutan)</h3>
                <div class="haji-steps">
                    ${MANASIK_UMRAH.map(s => `
                    <div class="haji-step">
                        <div class="haji-step-num">${s.step}</div>
                        <div class="haji-step-content">
                            <div class="haji-step-header">
                                <i class="fas ${s.icon}"></i>
                                <strong>${s.nama}</strong>
                            </div>
                            <p>${s.desc}</p>
                        </div>
                    </div>`).join('')}
                </div>

                <div class="haji-talbiyah-box">
                    <h4><i class="fas fa-microphone"></i> Bacaan Talbiyah</h4>
                    <div class="haji-talbiyah-arabic">لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ</div>
                    <div class="haji-talbiyah-latin">Labbaikallahumma labbaik, labbaika lā syarīka laka labbaik, innal-hamda wan-ni'mata laka wal-mulk, lā syarīka lak.</div>
                    <div class="haji-talbiyah-terjemah">"Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu. Tidak ada sekutu bagi-Mu, aku penuhi panggilan-Mu. Sesungguhnya segala puji, nikmat, dan kekuasaan adalah milik-Mu, tidak ada sekutu bagi-Mu."</div>
                </div>
            </div>

            <!-- PETA LOKASI -->
            <div class="haji-panel" id="panel-peta" style="display:none">
                <div class="haji-intro">
                    <i class="fas fa-info-circle"></i>
                    <p>Klik pada marker untuk melihat informasi lengkap amalan dan dalil di tiap lokasi suci.</p>
                </div>

                <!-- Leaflet Map -->
                <div id="hajiLeafletMap" class="haji-leaflet-map"></div>

                <!-- Location List -->
                <h3 class="haji-section-title" style="margin-top:20px"><i class="fas fa-list"></i> Daftar Lokasi Suci</h3>
                <div class="haji-location-list">
                    ${HAJI_LOCATIONS.map(loc => `
                    <div class="haji-location-card" data-id="${loc.id}" style="--loc-color:${loc.color}">
                        <div class="haji-location-icon"><i class="fas ${loc.icon}"></i></div>
                        <div class="haji-location-info">
                            <strong>${loc.name}</strong>
                            <span>${loc.desc.substring(0, 80)}...</span>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>`).join('')}
                </div>
            </div>

            <!-- LARANGAN IHRAM -->
            <div class="haji-panel" id="panel-ihram" style="display:none">
                <div class="haji-intro warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Larangan ihram berlaku sejak niat ihram hingga tahalul. Melanggar larangan berakibat <strong>dam (denda)</strong> berupa menyembelih hewan atau berpuasa.</p>
                </div>

                <h3 class="haji-section-title"><i class="fas fa-ban"></i> Larangan Saat Ihram</h3>
                <div class="haji-larangan-list">
                    ${LARANGAN_IHRAM.map((l, i) => `
                    <div class="haji-larangan-item">
                        <div class="haji-larangan-num">${i + 1}</div>
                        <div class="haji-larangan-content">
                            <strong>${l.larangan}</strong>
                            <span><i class="fas fa-book"></i> ${l.dalil}</span>
                        </div>
                    </div>`).join('')}
                </div>

                <div class="haji-dam-info">
                    <h4><i class="fas fa-gavel"></i> Ketentuan Dam (Denda)</h4>
                    <div class="haji-dam-grid">
                        <div class="haji-dam-item">
                            <strong>Melanggar larangan ringan</strong>
                            <p>Dam pilihan: menyembelih kambing, atau bersedekah kepada 6 orang miskin, atau puasa 3 hari (QS. Al-Baqarah: 196)</p>
                        </div>
                        <div class="haji-dam-item">
                            <strong>Jima\' sebelum tahalul pertama</strong>
                            <p>Haji tetap sah tapi wajib menyembelih unta/sapi. Wajib qadha (ulangi haji) di tahun berikutnya.</p>
                        </div>
                        <div class="haji-dam-item">
                            <strong>Berburu/membunuh hewan</strong>
                            <p>Dam sesuai nilai hewan yang dibunuh: menyembelih hewan senilai, atau bersedekah makanan, atau puasa.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Location Modal -->
            <div class="haji-modal" id="hajiModal">
                <div class="haji-modal-backdrop"></div>
                <div class="haji-modal-box" id="hajiModalBox"></div>
            </div>
        </div>`;
    }

    renderLocationDetail(loc) {
        return `
        <button class="haji-modal-close" id="hajiModalClose"><i class="fas fa-times"></i></button>
        <div class="haji-location-detail">
            <div class="haji-detail-icon" style="color:${loc.color}"><i class="fas ${loc.icon}"></i></div>
            <h3 style="color:${loc.color}">${loc.name}</h3>
            <p class="haji-detail-desc">${loc.desc}</p>
            <div class="haji-detail-dalil">
                <i class="fas fa-book-open"></i>
                <div><strong>Dalil</strong><p>${loc.dalil}</p></div>
            </div>
            <div class="haji-detail-amalan">
                <h4><i class="fas fa-list-check"></i> Amalan di Sini</h4>
                <ul>
                    ${loc.amalan.map(a => `<li><i class="fas fa-check"></i> ${a}</li>`).join('')}
                </ul>
            </div>
        </div>`;
    }

    initLeafletMap() {
        if (this.leafletMap) {
            this.leafletMap.invalidateSize();
            return;
        }
        if (!window.L) return;

        const map = L.map('hajiLeafletMap', { zoomControl: true }).setView([21.4225, 39.8262], 10);
        this.leafletMap = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);

        HAJI_LOCATIONS.forEach(loc => {
            if (!loc.latlng) return;
            const icon = L.divIcon({
                className: 'haji-leaflet-marker',
                html: `<div style="background:${loc.color};width:${loc.type==='city'?14:10}px;height:${loc.type==='city'?14:10}px;border-radius:50%;border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 8px ${loc.color}"></div>`,
                iconSize: [loc.type === 'city' ? 14 : 10, loc.type === 'city' ? 14 : 10],
                iconAnchor: [loc.type === 'city' ? 7 : 5, loc.type === 'city' ? 7 : 5]
            });
            const marker = L.marker(loc.latlng, { icon }).addTo(map);
            marker.bindTooltip(`<strong style="color:${loc.color}">${loc.name}</strong>`, { permanent: false, direction: 'top' });
            marker.on('click', () => this.openLocationModal(loc.id));
        });
    }

    setupEvents() {
        // Tabs
        this.container.querySelectorAll('.haji-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.activeTab = tab.dataset.tab;
                this.container.querySelectorAll('.haji-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                ['haji', 'umrah', 'peta', 'ihram'].forEach(t => {
                    const panel = document.getElementById(`panel-${t}`);
                    if (panel) panel.style.display = t === this.activeTab ? 'block' : 'none';
                });
                if (this.activeTab === 'peta') {
                    setTimeout(() => this.initLeafletMap(), 50);
                }
            });
        });

        // Map & location card clicks
        this.container.addEventListener('click', (e) => {
            const loc = e.target.closest('.haji-map-location, .haji-location-card');
            if (loc) {
                const id = loc.dataset.id;
                this.openLocationModal(id);
                return;
            }

            if (e.target.closest('#hajiModalClose') || e.target.closest('.haji-modal-backdrop')) {
                this.closeModal();
            }
        });
    }

    openLocationModal(id) {
        const loc = HAJI_LOCATIONS.find(l => l.id === id);
        if (!loc) return;
        const box = document.getElementById('hajiModalBox');
        if (box) box.innerHTML = this.renderLocationDetail(loc);
        const modal = document.getElementById('hajiModal');
        if (modal) modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('hajiModal');
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
