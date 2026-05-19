// Kalender Hijriyah — Konversi & Tampilan Kalender Islam

export default class KalenderApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('kalender-app');
        this.today = new Date();
        this.viewYear  = this.today.getFullYear();
        this.viewMonth = this.today.getMonth(); // 0-based
        this.hijriMonths = [
            'Muharram','Shafar','Rabi\'ul Awwal','Rabi\'ul Akhir',
            'Jumadal Ula','Jumadal Akhirah','Rajab','Sya\'ban',
            'Ramadan','Syawal','Dzulqa\'dah','Dzulhijjah'
        ];
        this.islamicEvents = this.buildEvents();
    }

    async init() {
        this.render();
        this.setupEvents();
    }

    // Gregorian → Hijri (Tabular Islamic Calendar)
    toHijri(year, month, day) {
        // month is 1-based
        const jd = this._gjd(year, month, day);
        return this._jdToHijri(jd);
    }

    _gjd(y, m, d) {
        const a = Math.floor((14 - m) / 12);
        const yr = y + 4800 - a;
        const mo = m + 12 * a - 3;
        return d + Math.floor((153 * mo + 2) / 5) + 365 * yr +
               Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
    }

    _jdToHijri(jd) {
        const l = jd - 1948440 + 10632;
        const n = Math.floor((l - 1) / 10631);
        const l2 = l - 10631 * n + 354;
        const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) +
                  (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
        const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
                   (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
        const month = Math.floor((24 * l3) / 709);
        const day   = l3 - Math.floor((709 * month) / 24);
        const year  = 30 * n + j - 30;
        return { year, month, day };
    }

    buildEvents() {
        // key: "hijriMonth-hijriDay" (month is 1-based)
        return {
            '1-1':  { label: 'Tahun Baru Hijriyah',        color: '#00ffff', icon: '🌙' },
            '1-10': { label: 'Hari Asyura',                 color: '#ffd700', icon: '⭐' },
            '3-12': { label: 'Maulid Nabi ﷺ',             color: '#00ff88', icon: '🕌' },
            '7-27': { label: 'Isra\' Mi\'raj',             color: '#9370db', icon: '✨' },
            '8-15': { label: 'Nisfu Sya\'ban',             color: '#ff8c00', icon: '🌙' },
            '9-1':  { label: 'Awal Ramadan',               color: '#ffd700', icon: '☪️' },
            '9-17': { label: 'Nuzulul Quran',              color: '#00ffff', icon: '📖' },
            '9-21': { label: '10 Malam Terakhir Ramadan',  color: '#ff69b4', icon: '🌟' },
            '9-30': { label: 'Akhir Ramadan',              color: '#ffd700', icon: '🌙' },
            '10-1': { label: 'Idul Fitri',                 color: '#ffd700', icon: '🎉' },
            '10-2': { label: 'Hari Tasyriq Fitri',         color: '#ffd700', icon: '🎊' },
            '10-3': { label: 'Hari Tasyriq Fitri',         color: '#ffd700', icon: '🎊' },
            '12-9': { label: 'Hari Arafah (Puasa Sunnah)', color: '#00ff88', icon: '🏔️' },
            '12-10':{ label: 'Idul Adha',                  color: '#ff8c00', icon: '🐑' },
            '12-11':{ label: 'Hari Tasyriq',               color: '#ff8c00', icon: '🐑' },
            '12-12':{ label: 'Hari Tasyriq',               color: '#ff8c00', icon: '🐑' },
            '12-13':{ label: 'Hari Tasyriq',               color: '#ff8c00', icon: '🐑' },
        };
    }

    getEventForHijriDate(hm, hd) {
        return this.islamicEvents[`${hm}-${hd}`] || null;
    }

    daysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    firstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay(); // 0=Sun
    }

    render() {
        const todayHijri = this.toHijri(
            this.today.getFullYear(),
            this.today.getMonth() + 1,
            this.today.getDate()
        );

        this.container.innerHTML = `
        <div class="kalender-container">
            <div class="kalender-header">
                <h2><i class="fas fa-calendar-alt"></i> Kalender Hijriyah</h2>
                <div class="kalender-today-hijri">
                    <span class="kalender-hijri-date">${todayHijri.day} ${this.hijriMonths[todayHijri.month - 1]} ${todayHijri.year} H</span>
                    <span class="kalender-masehi-date">${this.today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            <!-- Kalender Bulanan -->
            <div class="kalender-nav">
                <button class="kalender-nav-btn" id="prevMonth"><i class="fas fa-chevron-left"></i></button>
                <div class="kalender-month-label" id="monthLabel"></div>
                <button class="kalender-nav-btn" id="nextMonth"><i class="fas fa-chevron-right"></i></button>
            </div>

            <div class="kalender-grid-wrapper">
                <div class="kalender-weekdays">
                    ${['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d =>
                        `<div class="kalender-weekday${d === 'Jum' ? ' friday' : ''}">${d}</div>`).join('')}
                </div>
                <div class="kalender-grid" id="kalenderGrid"></div>
            </div>

            <!-- Event bulan ini -->
            <div class="kalender-events" id="kalenderEvents"></div>

            <!-- Konversi Tanggal -->
            <div class="kalender-convert">
                <h3><i class="fas fa-exchange-alt"></i> Konversi Tanggal</h3>
                <div class="kalender-convert-form">
                    <div class="kalender-convert-input">
                        <label>Tanggal Masehi</label>
                        <input type="date" id="convertInput" value="${this.today.toISOString().split('T')[0]}">
                    </div>
                    <button class="kalender-convert-btn" id="btnConvert">
                        <i class="fas fa-arrow-right"></i> Konversi
                    </button>
                    <div class="kalender-convert-result" id="convertResult"></div>
                </div>
            </div>

            <!-- Keterangan Bulan Hijriyah -->
            <div class="kalender-months-info">
                <h3><i class="fas fa-info-circle"></i> Bulan-Bulan Hijriyah</h3>
                <div class="kalender-months-grid">
                    ${this.hijriMonths.map((m, i) => `
                        <div class="kalender-month-item">
                            <span class="kalender-month-num">${i + 1}</span>
                            <span class="kalender-month-name">${m}</span>
                        </div>`).join('')}
                </div>
            </div>
        </div>`;

        this.renderCalendar();
    }

    renderCalendar() {
        const totalDays  = this.daysInMonth(this.viewYear, this.viewMonth);
        const firstDay   = this.firstDayOfMonth(this.viewYear, this.viewMonth);
        const monthNames = ['Januari','Februari','Maret','April','Mei','Juni',
                            'Juli','Agustus','September','Oktober','November','Desember'];

        // Update label
        const hijriFirst = this.toHijri(this.viewYear, this.viewMonth + 1, 1);
        const hijriLast  = this.toHijri(this.viewYear, this.viewMonth + 1, totalDays);
        const label = document.getElementById('monthLabel');
        if (label) {
            label.innerHTML = `<span>${monthNames[this.viewMonth]} ${this.viewYear}</span>
                <small>${this.hijriMonths[hijriFirst.month - 1]} – ${this.hijriMonths[hijriLast.month - 1]} ${hijriFirst.year}H</small>`;
        }

        const grid = document.getElementById('kalenderGrid');
        if (!grid) return;

        let html = '';
        // Empty cells for offset
        for (let i = 0; i < firstDay; i++) html += '<div class="kalender-cell empty"></div>';

        const eventsThisMonth = [];

        for (let d = 1; d <= totalDays; d++) {
            const h = this.toHijri(this.viewYear, this.viewMonth + 1, d);
            const isToday = d === this.today.getDate() &&
                            this.viewMonth === this.today.getMonth() &&
                            this.viewYear  === this.today.getFullYear();
            const event = this.getEventForHijriDate(h.month, h.day);
            const isFriday = new Date(this.viewYear, this.viewMonth, d).getDay() === 5;

            if (event) eventsThisMonth.push({ day: d, hijri: h, event });

            html += `<div class="kalender-cell${isToday ? ' today' : ''}${isFriday ? ' friday' : ''}${event ? ' has-event' : ''}"
                         style="${event ? `--event-color:${event.color}` : ''}">
                <span class="kalender-cell-masehi">${d}</span>
                <span class="kalender-cell-hijri">${h.day} ${this.hijriMonths[h.month - 1].substring(0,3)}</span>
                ${event ? `<span class="kalender-event-dot" title="${event.label}">${event.icon}</span>` : ''}
            </div>`;
        }

        grid.innerHTML = html;

        // Render events list
        const eventsEl = document.getElementById('kalenderEvents');
        if (eventsEl) {
            if (eventsThisMonth.length > 0) {
                eventsEl.innerHTML = `<h4><i class="fas fa-star"></i> Hari Penting Bulan Ini</h4>
                    <div class="kalender-event-list">
                        ${eventsThisMonth.map(e => `
                            <div class="kalender-event-item" style="--event-color:${e.event.color}">
                                <span class="event-icon">${e.event.icon}</span>
                                <div class="event-info">
                                    <strong>${e.event.label}</strong>
                                    <span>${e.day} ${monthNames[this.viewMonth]} / ${e.hijri.day} ${this.hijriMonths[e.hijri.month - 1]} ${e.hijri.year}H</span>
                                </div>
                            </div>`).join('')}
                    </div>`;
            } else {
                eventsEl.innerHTML = '<p class="kalender-no-events"><i class="fas fa-calendar"></i> Tidak ada hari penting Islam bulan ini.</p>';
            }
        }
    }

    setupEvents() {
        const prev = document.getElementById('prevMonth');
        const next = document.getElementById('nextMonth');
        if (prev) prev.addEventListener('click', () => {
            this.viewMonth--;
            if (this.viewMonth < 0) { this.viewMonth = 11; this.viewYear--; }
            this.renderCalendar();
        });
        if (next) next.addEventListener('click', () => {
            this.viewMonth++;
            if (this.viewMonth > 11) { this.viewMonth = 0; this.viewYear++; }
            this.renderCalendar();
        });

        const btnConvert = document.getElementById('btnConvert');
        if (btnConvert) btnConvert.addEventListener('click', () => this.convertDate());
    }

    convertDate() {
        const input = document.getElementById('convertInput');
        if (!input || !input.value) return;
        const [y, m, d] = input.value.split('-').map(Number);
        const h = this.toHijri(y, m, d);
        const resultEl = document.getElementById('convertResult');
        if (resultEl) {
            resultEl.innerHTML = `
                <div class="convert-output">
                    <div class="convert-masehi">
                        <i class="fas fa-calendar"></i>
                        <span>${d} ${['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][m-1]} ${y} M</span>
                    </div>
                    <div class="convert-arrow"><i class="fas fa-equals"></i></div>
                    <div class="convert-hijri">
                        <i class="fas fa-moon"></i>
                        <span>${h.day} ${this.hijriMonths[h.month - 1]} ${h.year} H</span>
                    </div>
                </div>`;
        }
    }
}
