/* =====================================================================
   LECTURE.JS — shared behaviour for all "Rangkuman Kuliah" pages
   Auto-wires: pills-nav scroll-spy, back-to-top button, and a generic
   table search/filter for any [data-lec-search] + [data-lec-filter].
   ===================================================================== */
(function () {
    'use strict';

    /* ---------------- scroll-spy on .lec-pill / .lec-session ---------------- */
    function initScrollSpy() {
        var pills = document.querySelectorAll('.lec-pill[href^="#"]');
        var targets = [];
        pills.forEach(function (p) {
            var id = p.getAttribute('href').slice(1);
            var el = document.getElementById(id);
            if (el) targets.push({ pill: p, el: el });
        });
        if (!targets.length) return;

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var match = targets.filter(function (t) { return t.el === entry.target; })[0];
                if (!match) return;
                if (entry.isIntersecting) {
                    pills.forEach(function (p) { p.classList.remove('is-active'); });
                    match.pill.classList.add('is-active');
                    match.pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        targets.forEach(function (t) { obs.observe(t.el); });
    }

    /* ---------------- horizontal wheel-scroll for the pills strip ---------------- */
    // Lets a normal vertical mouse wheel scroll the pills-nav sideways
    // (touchpads/touch already scroll it horizontally without this).
    function initPillsWheelScroll() {
        document.querySelectorAll('.lec-pills-inner').forEach(function (strip) {
            strip.addEventListener('wheel', function (e) {
                if (strip.scrollWidth <= strip.clientWidth) return;
                if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
                e.preventDefault();
                strip.scrollLeft += e.deltaY;
            }, { passive: false });
        });
    }

    /* ---------------- back-to-top button ---------------- */
    function initBackToTop() {
        var btn = document.createElement('button');
        btn.className = 'lec-top-btn';
        btn.setAttribute('aria-label', 'Kembali ke atas');
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(btn);

        window.addEventListener('scroll', function () {
            btn.classList.toggle('is-visible', window.scrollY > 600);
        }, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------------- generic status filter (hadith-style tables) ---------------- */
    // Usage: buttons with [data-lec-filter="all|shahih|..."] toggle rows
    // whose closest tr has [data-status] matching the value.
    function initStatusFilter() {
        var buttons = document.querySelectorAll('[data-lec-filter]');
        if (!buttons.length) return;
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var status = btn.getAttribute('data-lec-filter');
                buttons.forEach(function (b) { b.classList.remove('is-active'); });
                btn.classList.add('is-active');
                document.querySelectorAll('[data-status]').forEach(function (row) {
                    var show = status === 'all' || row.getAttribute('data-status') === status;
                    row.classList.toggle('lec-hidden', !show);
                });
            });
        });
    }

    /* ---------------- generic table text search ---------------- */
    // Usage: <input data-lec-search="#targetTableBodySelector">
    function initTextSearch() {
        var inputs = document.querySelectorAll('[data-lec-search]');
        inputs.forEach(function (input) {
            var scope = document.querySelector(input.getAttribute('data-lec-search'));
            if (!scope) return;
            input.addEventListener('input', function () {
                var q = input.value.toLowerCase();
                scope.querySelectorAll('tr[data-status], tr[data-search]').forEach(function (row) {
                    var text = row.textContent.toLowerCase();
                    row.classList.toggle('lec-hidden', q.length > 0 && text.indexOf(q) === -1);
                });
            });
        });
    }

    function boot() {
        initScrollSpy();
        initPillsWheelScroll();
        initBackToTop();
        initStatusFilter();
        initTextSearch();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else { boot(); }
})();
