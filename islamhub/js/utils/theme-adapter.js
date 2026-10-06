// Sakinah theme: recolour inline colours written by app code (category chips, era pills,
// countdown digits...). Stylesheets are handled at build time by tools/build_sakinah_theme.py;
// this mirrors the same palette mapping for style="" attributes. Originals are kept in
// data-sk-orig and restored when switching back to the classic theme.

const INK = [31, 61, 51], INK2 = [74, 91, 81], MUTED = [87, 100, 90];
const CARD = [255, 253, 247];
const ACCENTS = {
    green: [[36, 88, 69], [47, 114, 88]],
    teal: [[36, 88, 69], [47, 114, 88]],
    plum: [[91, 74, 150], [107, 90, 166]],
    red: [[160, 70, 50], [181, 84, 63]],
    amber: [[135, 82, 22], [168, 98, 30]],
    gold: [[120, 90, 32], [138, 102, 36]],
    blue: [[38, 92, 128], [47, 111, 138]]
};
const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g;
const NAMED = { white: [255, 255, 255, 1], gold: [255, 215, 0, 1], cyan: [0, 255, 255, 1] };

function parse(tok) {
    const t = tok.toLowerCase();
    if (NAMED[t]) return NAMED[t];
    if (t[0] === '#') {
        let h = t.slice(1);
        if (h.length <= 4) h = [...h].map(c => c + c).join('');
        return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
    }
    const n = t.match(/[\d.]+%?/g);
    if (!n || n.length < 3) return null;
    return [...n.slice(0, 3).map(v => parseFloat(v) * (v.endsWith('%') ? 2.55 : 1)), n[3] ? parseFloat(n[3]) / (n[3].endsWith('%') ? 100 : 1) : 1];
}

const fmt = (c, a) => a >= 0.995 ? `rgb(${c.join(', ')})` : `rgba(${c.join(', ')}, ${Math.round(Math.max(0, a) * 1000) / 1000})`;

function family(r, g, b) {
    const max = Math.max(r, g, b) / 255, min = Math.min(r, g, b) / 255;
    const s = max ? (max - min) / max : 0;
    if (s < 0.35 || max < 0.35) return null;
    let h;
    const d = max - min, R = r / 255, G = g / 255, B = b / 255;
    if (max === R) h = ((G - B) / d) % 6; else if (max === G) h = (B - R) / d + 2; else h = (R - G) / d + 4;
    const deg = (h * 60 + 360) % 360;
    if ((deg >= 45 && deg < 70) || (deg >= 35 && deg < 45 && s < 0.75)) return 'gold';
    if (deg >= 20 && deg < 45) return 'amber';
    if (deg >= 70 && deg < 160) return 'green';
    if (deg >= 160 && deg < 195) return 'teal';
    if (deg >= 195 && deg < 230) return 'blue';
    if (deg >= 230 && deg < 300) return 'plum';
    return 'red';
}

function mapColor([r, g, b, a], kind) {
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    const fam = family(r, g, b);
    if (fam) {
        const [text, fill] = ACCENTS[fam];
        if (kind === 'text') return fmt(text, a > 0.4 ? Math.max(a, 0.9) : a + 0.3);
        if (kind === 'border') return fmt(fill, Math.min(0.55, a + 0.1));
        if (kind === 'shadow') return fmt(INK, Math.min(0.12, a * 0.3));
        return fmt(fill, a);
    }
    if (luma > 200) {
        if (kind === 'text') return fmt(a >= 0.85 ? INK : a >= 0.55 ? INK2 : MUTED, 1);
        if (kind === 'border') return fmt(INK, Math.min(0.16, 0.06 + a * 0.5));
        if (kind === 'shadow') return fmt(INK, Math.min(0.08, a * 0.3));
        return fmt(CARD, a >= 0.12 ? 1 : 0.55 + a * 3.5);
    }
    if (luma < 45) {
        if (kind === 'text') return fmt(INK, a);
        if (kind === 'border') return fmt(INK, 0.1);
        if (kind === 'shadow') return fmt(INK, Math.min(0.14, a * 0.22));
        return fmt(CARD, Math.max(0.92, a));
    }
    if (kind === 'text') return fmt(luma > 120 ? MUTED : INK2, Math.max(a, 0.9));
    if (kind === 'border') return fmt(INK, 0.12);
    return fmt([236, 233, 220], a);
}

function kindFor(prop) {
    if (prop === 'color' || prop === 'fill' || prop === 'stroke' || prop === '-webkit-text-fill-color') return 'text';
    if (prop.includes('shadow')) return 'shadow';
    if (prop.startsWith('border') || prop.startsWith('outline')) return 'border';
    if (prop.startsWith('--')) return /bg|background|fill|surface/i.test(prop) ? 'bg' : 'text';
    return 'bg';
}

const touched = new WeakMap(); // element -> style string we wrote

function adapt(el) {
    const current = el.getAttribute('style');
    if (!current || touched.get(el) === current) return;
    const original = current;
    if (!COLOR_RE.test(original)) { COLOR_RE.lastIndex = 0; return; }
    COLOR_RE.lastIndex = 0;
    if (!el.dataset.skOrig) el.dataset.skOrig = original;
    const s = el.style;
    for (let i = 0; i < s.length; i++) {
        const prop = s[i];
        const val = s.getPropertyValue(prop);
        if (!val || !/#|rgb/i.test(val)) continue;
        if (prop === 'text-shadow') { s.setProperty(prop, 'none', s.getPropertyPriority(prop)); continue; }
        const kind = kindFor(prop);
        const next = val.replace(COLOR_RE, tok => { const c = parse(tok); return c ? mapColor(c, kind) : tok; });
        if (next !== val) s.setProperty(prop, next, s.getPropertyPriority(prop));
    }
    touched.set(el, el.getAttribute('style'));
}

function restore() {
    document.querySelectorAll('[data-sk-orig]').forEach(el => {
        el.setAttribute('style', el.dataset.skOrig);
        delete el.dataset.skOrig;
        touched.delete(el);
    });
}

let observer = null;

export function syncInlineColors() {
    const on = document.documentElement.dataset.theme === 'sakinah';
    const root = document.getElementById('appContent') || document.body;
    if (!on) {
        observer?.disconnect();
        observer = null;
        restore();
        return;
    }
    root.querySelectorAll('[style]').forEach(adapt);
    if (observer) return;
    observer = new MutationObserver(records => {
        for (const r of records) {
            if (r.type === 'attributes') adapt(r.target);
            else r.addedNodes.forEach(n => {
                if (n.nodeType !== 1) return;
                if (n.hasAttribute('style')) adapt(n);
                n.querySelectorAll?.('[style]').forEach(adapt);
            });
        }
    });
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['style'] });
}
