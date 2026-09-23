/* =====================================================================
   LECTURE.JS — shared behaviour for all "Rangkuman Kuliah" pages
   Auto-wires: ID/EN i18n, pills-nav scroll-spy, back-to-top, search/filter.
   ===================================================================== */
(function () {
    'use strict';

    var LANG_KEY = 'iou-lang';
    var COMMON = {
        back: { id: 'Kembali ke Rangkuman Kuliah', en: 'Back to Lecture Summaries' },
        top: { id: 'Kembali ke atas', en: 'Back to top' },
        lang: { id: 'Bahasa', en: 'Language' }
    };

    function getLang() {
        return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'id';
    }

    function setLang(lang) {
        localStorage.setItem(LANG_KEY, lang);
    }

    /* ---------------- i18n engine (data-en / data-en-html) ---------------- */
    function captureIdDefaults() {
        document.querySelectorAll('[data-en]').forEach(function (el) {
            if (el.hasAttribute('data-id')) return;
            var text = '';
            if (el.querySelector(':scope > .num')) {
                // Pill: keep only label text after the number span
                var clone = el.cloneNode(true);
                var num = clone.querySelector('.num');
                if (num) num.remove();
                text = clone.textContent.replace(/\s+/g, ' ').trim();
            } else if (el.classList.contains('lec-back-link')) {
                var c2 = el.cloneNode(true);
                var ico = c2.querySelector('i');
                if (ico) ico.remove();
                text = c2.textContent.replace(/\s+/g, ' ').trim();
            } else {
                text = el.textContent;
            }
            el.setAttribute('data-id', text);
        });
        document.querySelectorAll('[data-en-html]').forEach(function (el) {
            if (!el.hasAttribute('data-id-html')) {
                el.setAttribute('data-id-html', el.innerHTML);
            }
        });
        document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
            if (!el.hasAttribute('data-id-placeholder')) {
                el.setAttribute('data-id-placeholder', el.getAttribute('placeholder') || '');
            }
        });
        document.querySelectorAll('[data-en-aria]').forEach(function (el) {
            if (!el.hasAttribute('data-id-aria')) {
                el.setAttribute('data-id-aria', el.getAttribute('aria-label') || '');
            }
        });
        var titleCarrier = document.querySelector('html[data-en-title], head[data-en-title], title[data-en-title], body[data-en-title]');
        if (!titleCarrier) titleCarrier = document.documentElement;
        if (document.documentElement.hasAttribute('data-en-title') && !document.documentElement.hasAttribute('data-id-title')) {
            document.documentElement.setAttribute('data-id-title', document.title);
        }
    }

    function applyI18n(lang) {
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-en]').forEach(function (el) {
            var idText = el.getAttribute('data-id');
            var enText = el.getAttribute('data-en');
            if (idText === null) return;
            var label = lang === 'en' ? enText : idText;
            var numEl = el.querySelector(':scope > .num');
            var icoEl = el.classList.contains('lec-back-link') ? el.querySelector(':scope > i') : null;
            if (numEl) {
                el.innerHTML = '';
                el.appendChild(numEl);
                el.appendChild(document.createTextNode(' ' + label));
            } else if (icoEl) {
                el.innerHTML = '';
                el.appendChild(icoEl);
                el.appendChild(document.createTextNode(' ' + label));
            } else if (el.tagName === 'TEXT' || el.namespaceURI === 'http://www.w3.org/2000/svg') {
                el.textContent = label;
            } else {
                el.textContent = label;
            }
        });

        document.querySelectorAll('[data-en-html]').forEach(function (el) {
            var idHtml = el.getAttribute('data-id-html');
            var enHtml = el.getAttribute('data-en-html');
            if (idHtml === null) return;
            el.innerHTML = lang === 'en' ? enHtml : idHtml;
        });

        document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
            el.setAttribute('placeholder', lang === 'en'
                ? el.getAttribute('data-en-placeholder')
                : el.getAttribute('data-id-placeholder'));
        });

        document.querySelectorAll('[data-en-aria]').forEach(function (el) {
            el.setAttribute('aria-label', lang === 'en'
                ? el.getAttribute('data-en-aria')
                : el.getAttribute('data-id-aria'));
        });

        if (document.documentElement.hasAttribute('data-en-title')) {
            document.title = lang === 'en'
                ? document.documentElement.getAttribute('data-en-title')
                : document.documentElement.getAttribute('data-id-title');
        }

        var back = document.querySelector('.lec-back-link');
        if (back && !back.hasAttribute('data-en')) {
            var ico = back.querySelector('i');
            back.innerHTML = (ico ? ico.outerHTML + ' ' : '') + COMMON.back[lang];
        }

        var topBtn = document.querySelector('.lec-top-btn');
        if (topBtn) {
            topBtn.setAttribute('aria-label', COMMON.top[lang]);
        }

        document.querySelectorAll('.lec-lang-switch button').forEach(function (btn) {
            btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
        });
        var sw = document.querySelector('.lec-lang-switch');
        if (sw) sw.setAttribute('aria-label', COMMON.lang[lang]);
    }

    function initI18n() {
        var topbar = document.querySelector('.lec-topbar');
        if (!topbar) return;

        var badge = topbar.querySelector('.lec-topbar-badge');
        var actions = document.createElement('div');
        actions.className = 'lec-topbar-actions';

        var sw = document.createElement('div');
        sw.className = 'lec-lang-switch';
        sw.setAttribute('role', 'group');
        sw.innerHTML =
            '<button type="button" data-lang="id" aria-pressed="true">ID</button>' +
            '<button type="button" data-lang="en" aria-pressed="false">EN</button>';

        actions.appendChild(sw);
        if (badge) actions.appendChild(badge);
        topbar.appendChild(actions);

        // Ensure back-link has data-en for cleaner swaps
        var back = topbar.querySelector('.lec-back-link');
        if (back && !back.hasAttribute('data-en')) {
            back.setAttribute('data-en', COMMON.back.en);
            // Strip icon from stored id text
            var clone = back.cloneNode(true);
            var ci = clone.querySelector('i');
            if (ci) ci.remove();
            back.setAttribute('data-id', clone.textContent.replace(/^\s+/, '').trim());
        }

        captureIdDefaults();

        var lang = getLang();
        applyI18n(lang);

        sw.querySelectorAll('button').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var next = btn.getAttribute('data-lang');
                if (next === getLang()) return;
                setLang(next);
                applyI18n(next);
            });
        });
    }

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
        btn.setAttribute('aria-label', COMMON.top[getLang()]);
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
        initI18n();
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
