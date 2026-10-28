import id from './id.js';
import en from './en.js';

const DICTIONARIES = { id, en };
const LANG_KEY = 'islamhub_lang';
const listeners = new Set();

let currentLang = 'id';
try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'id') {
        currentLang = saved;
    }
} catch (e) {
    // localStorage may be unavailable
}

// Keep <html lang="..."> in sync from start
if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', currentLang);
}

export function getLang() {
    return currentLang;
}

export function setLang(lang) {
    if (lang !== 'id' && lang !== 'en') return;
    const changed = lang !== currentLang;
    currentLang = lang;
    try {
        localStorage.setItem(LANG_KEY, currentLang);
    } catch (e) {}

    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('lang', currentLang);
    }

    if (changed) {
        listeners.forEach(fn => {
            try {
                fn(currentLang);
            } catch (err) {
                console.error('[i18n] listener error:', err);
            }
        });
    }
}

export function onLangChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

export function t(key, vars) {
    if (!key) return '';
    const dict = DICTIONARIES[currentLang] || DICTIONARIES.id;
    let str = dict[key];
    if (str === undefined && currentLang !== 'id') {
        str = DICTIONARIES.id[key];
    }
    if (str === undefined) {
        return key;
    }
    if (vars && typeof vars === 'object') {
        return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
    }
    return str;
}

export function locale() {
    return currentLang === 'en' ? 'en-GB' : 'id-ID';
}

export function pick(obj, field) {
    if (!obj) return '';
    if (currentLang === 'en' && obj[field + '_en'] !== undefined && obj[field + '_en'] !== null && obj[field + '_en'] !== '') {
        return obj[field + '_en'];
    }
    return obj[field] ?? '';
}

export function applyStaticI18n(root = document) {
    if (!root) return;

    if (typeof document !== 'undefined' && (root === document || root === document.documentElement)) {
        document.title = `${t('common.appName')} - ${t('common.appSubtitle')}`;
    }

    // Direct text replacement
    const elements = root.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            el.textContent = t(key);
        }
    });

    // Inner HTML replacement for labels with formatted spans/sub-elements
    const htmlElements = root.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (key) {
            el.innerHTML = t(key);
        }
    });

    // Attributes replacement e.g. data-i18n-attr="placeholder:common.search;aria-label:common.search"
    const attrElements = root.querySelectorAll('[data-i18n-attr]');
    attrElements.forEach(el => {
        const spec = el.getAttribute('data-i18n-attr');
        if (!spec) return;
        spec.split(';').forEach(pair => {
            const idx = pair.indexOf(':');
            if (idx === -1) return;
            const attr = pair.slice(0, idx).trim();
            const key = pair.slice(idx + 1).trim();
            if (attr && key) {
                el.setAttribute(attr, t(key));
            }
        });
    });
}
