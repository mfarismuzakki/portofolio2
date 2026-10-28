// ===== Fara'id engine (jumhur method) =====
// Pure module without DOM so it can be tested (tools/test_waris_engine.mjs). Every share is
// an exact fraction, never a decimal like 0.1667, so the total is always exactly 100%.
//
// Supported heirs (input keys are counts):
//   spouse         husband (0/1), wife (0-4)
//   ascendants     father, mother, grandfather (father's father),
//                  grandmotherPaternal (father's mother), grandmotherMaternal (mother's mother)
//   descendants    sons, daughters, grandsons, granddaughters (children of a son)
//   siblings       fullBrothers, fullSisters, paternalBrothers, paternalSisters,
//                  maternalBrothers, maternalSisters
//   far 'asabah    fullNephews, paternalNephews (sons of brothers), fullUncles, paternalUncles
//                  (father's brothers), fullCousins, paternalCousins (sons of those uncles)
//   dhawil arham   paternalAunts, maternalAunts, maternalUncles
//
// Order: hajb (exclusion) -> furudh -> 'awl -> 'asabah -> radd -> dhawil arham.
// Positions taken where the madhhabs differ (stated to the user in the notes):
//   - The grandfather excludes siblings like the father does (Abu Bakr and Ibn 'Abbas, the
//     Hanafi view, chosen by Ibn Taymiyyah and Ibn 'Uthaymin), so no muqasamah/akdariyyah.
//   - No musharakah: full brothers get nothing when the furudh exhaust the estate (Hanafi and
//     Hanbali).
//   - The father excludes his own mother (jumhur).
//   - Dhawil arham inherit by tanzil, male and female equal (Hanbali), and only when there is
//     no sharer other than a spouse and no 'asabah.

import { t } from '../../i18n/index.js';

const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));

export class Frac {
    constructor(n, d = 1) {
        if (d < 0) { n = -n; d = -d; }
        const g = gcd(n, d) || 1;
        this.n = n / g;
        this.d = d / g;
    }
    add(o) { return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { return new Frac(this.n * o.n, this.d * o.d); }
    div(o) { return new Frac(this.n * o.d, this.d * o.n); }
    cmp(o) { return this.n * o.d - o.n * this.d; }
    isZero() { return this.n === 0; }
    get value() { return this.n / this.d; }
    toString() { return this.d === 1 ? `${this.n}` : `${this.n}/${this.d}`; }
}

const F = (n, d = 1) => new Frac(n, d);
const ZERO = F(0);
const ONE = F(1);
const count = v => {
    const x = parseInt(v, 10);
    return Number.isFinite(x) && x > 0 ? x : 0;
};

export const HEIR_KEYS = [
    'husband', 'wife', 'father', 'mother', 'grandfather', 'grandmotherPaternal', 'grandmotherMaternal',
    'sons', 'daughters', 'grandsons', 'granddaughters',
    'fullBrothers', 'fullSisters', 'paternalBrothers', 'paternalSisters', 'maternalBrothers', 'maternalSisters',
    'fullNephews', 'paternalNephews', 'fullUncles', 'paternalUncles', 'fullCousins', 'paternalCousins',
    'paternalAunts', 'maternalAunts', 'maternalUncles',
];

// Localized heir names, used inside condition and exclusion texts.
const heirName = k => t(`waris.heir.${k}`);
const NAME = new Proxy({}, {
    get: (_, k) => heirName(k)
});

/**
 * @param {object} input  counts per heir key (see HEIR_KEYS)
 * @returns {{ shares: Array, excluded: Array, hasAwl: boolean, hasRadd: boolean, notes: string[] }}
 *   shares[i]   = { type, count, category, fraction, share (Frac), condition }
 *   excluded[i] = { type, count, reason }
 */
export function computeFaraid(input = {}) {
    const h = {};
    HEIR_KEYS.forEach(k => { h[k] = count(input[k]); });
    ['husband', 'father', 'mother', 'grandfather', 'grandmotherPaternal', 'grandmotherMaternal'].forEach(k => { h[k] = Math.min(h[k], 1); });
    h.wife = Math.min(h.wife, 4);
    if (h.husband) h.wife = 0;

    const notes = [];
    const excluded = [];
    const exclude = (type, reason) => { if (h[type]) excluded.push({ type, count: h[type], reason }); h[type] = 0; };

    // ---------- 1. Hajb hirman (full exclusion) ----------
    if (h.father) exclude('grandfather', t('waris.exclude.byFather'));
    if (h.mother) {
        exclude('grandmotherPaternal', t('waris.exclude.byMother'));
        exclude('grandmotherMaternal', t('waris.exclude.byMother'));
    }
    if (h.father) exclude('grandmotherPaternal', t('waris.exclude.byFatherJumhur'));

    if (h.sons) {
        exclude('grandsons', t('waris.exclude.bySon'));
        exclude('granddaughters', t('waris.exclude.bySon'));
    }
    if (h.daughters >= 2 && !h.grandsons) exclude('granddaughters', t('waris.exclude.granddaughtersExhausted'));

    const maleDesc = h.sons + h.grandsons > 0;
    const femaleDesc = h.daughters + h.granddaughters > 0;
    const anyDesc = maleDesc || femaleDesc;
    // Siblings counted for the mother's share before they are excluded (jumhur).
    const siblingCount = h.fullBrothers + h.fullSisters + h.paternalBrothers + h.paternalSisters + h.maternalBrothers + h.maternalSisters;

    const siblingBlocker = h.sons ? t('waris.blocker.sons') : h.grandsons ? t('waris.blocker.grandsons') : h.father ? t('waris.blocker.father') : h.grandfather ? t('waris.blocker.grandfather') : null;
    let grandfatherExcludedSiblings = false;
    if (siblingBlocker) {
        if (h.grandfather && !h.father && !h.sons && !h.grandsons) grandfatherExcludedSiblings = true;
        ['fullBrothers', 'fullSisters', 'paternalBrothers', 'paternalSisters'].forEach(tKey =>
            exclude(tKey, h.grandfather && !h.father && !h.sons && !h.grandsons
                ? t('waris.exclude.byGrandfatherAbuBakr')
                : t('waris.exclude.byBlocker', { blocker: siblingBlocker })));
    }
    const maternalBlocker = anyDesc ? t('waris.blocker.descendant') : h.father ? t('waris.blocker.father') : h.grandfather ? t('waris.blocker.grandfather') : null;
    if (maternalBlocker) {
        exclude('maternalBrothers', t('waris.exclude.byBlocker', { blocker: maternalBlocker }));
        exclude('maternalSisters', t('waris.exclude.byBlocker', { blocker: maternalBlocker }));
    }

    // A full sister with a daughter/granddaughter is 'asabah ma'al ghair and ranks as a full brother.
    const fullSisterWithDesc = h.fullSisters > 0 && !h.fullBrothers && femaleDesc;
    if (h.fullBrothers) {
        exclude('paternalBrothers', t('waris.exclude.byFullBrother'));
        exclude('paternalSisters', t('waris.exclude.byFullBrother'));
    }
    if (fullSisterWithDesc) {
        exclude('paternalBrothers', t('waris.exclude.byFullSisterMaalGhair'));
        exclude('paternalSisters', t('waris.exclude.byFullSisterMaalGhair'));
    }
    if (h.fullSisters >= 2 && !h.paternalBrothers) exclude('paternalSisters', t('waris.exclude.paternalSistersExhausted'));
    const paternalSisterWithDesc = h.paternalSisters > 0 && !h.paternalBrothers && !h.fullSisters && femaleDesc;

    // ---------- 2. Ashabul furudh ----------
    const fard = []; // { type, count, share, condition, spouse }
    const push = (type, share, condition, extra = {}) => fard.push({ type, count: h[type], share, condition, ...extra });

    let spouseShare = ZERO;
    if (h.husband) {
        spouseShare = anyDesc ? F(1, 4) : F(1, 2);
        push('husband', spouseShare, anyDesc ? t('waris.cond.husbandWithDesc') : t('waris.cond.husbandNoDesc'), { spouse: true });
    }
    if (h.wife) {
        spouseShare = anyDesc ? F(1, 8) : F(1, 4);
        const splitStr = h.wife > 1 ? t('waris.cond.wifeSplit', { n: h.wife }) : '';
        push('wife', spouseShare, (anyDesc ? t('waris.cond.wifeWithDesc', { split: splitStr }) : t('waris.cond.wifeNoDesc', { split: splitStr })), { spouse: true });
    }

    if (h.mother) {
        if (anyDesc || siblingCount >= 2) {
            push('mother', F(1, 6), anyDesc ? t('waris.cond.motherWithDesc') : t('waris.cond.motherWithSiblings', { n: siblingCount }));
        } else if (h.father && (h.husband || h.wife)) {
            const s = ONE.sub(spouseShare).mul(F(1, 3));
            const spouseStr = h.husband ? heirName('husband') : heirName('wife');
            push('mother', s, t('waris.cond.motherUmariyyatan', { spouse: spouseStr, s: s.toString() }), { label: t('waris.label.oneThirdRem') });
            notes.push(t('waris.note.umariyyatan'));
        } else {
            push('mother', F(1, 3), t('waris.cond.motherNormal'));
        }
    }
    const gms = ['grandmotherPaternal', 'grandmotherMaternal'].filter(tKey => h[tKey]);
    if (gms.length) {
        gms.forEach(tKey => push(tKey, F(1, 6 * gms.length), gms.length > 1
            ? t('waris.cond.gmTwo')
            : t('waris.cond.gmOne')));
    }

    // father / grandfather: 1/6 with any descendant; 'asabah handled below
    const ascendant = h.father ? 'father' : h.grandfather ? 'grandfather' : null;
    if (ascendant && anyDesc) {
        const extra = ascendant === 'grandfather' ? t('waris.cond.grandfatherReplacesFather') : '';
        push(ascendant, F(1, 6), t('waris.cond.ascendantWithDesc', { extra }));
    }

    if (h.daughters && !h.sons) {
        push('daughters', h.daughters === 1 ? F(1, 2) : F(2, 3), h.daughters === 1
            ? t('waris.cond.daughterAlone')
            : t('waris.cond.daughtersPlural', { n: h.daughters }));
    }
    if (h.granddaughters && !h.grandsons) {
        if (!h.daughters) {
            const who = h.granddaughters === 1 ? t('waris.cond.whoAlone') : t('waris.cond.whoPlural', { n: h.granddaughters });
            const share = h.granddaughters === 1 ? '1/2' : '2/3';
            push('granddaughters', h.granddaughters === 1 ? F(1, 2) : F(2, 3),
                t('waris.cond.granddaughtersNoDaughter', { who, share }));
        } else {
            push('granddaughters', F(1, 6), t('waris.cond.granddaughterWithOneDaughter'));
        }
    }

    if (h.fullSisters && !h.fullBrothers && !femaleDesc) {
        push('fullSisters', h.fullSisters === 1 ? F(1, 2) : F(2, 3), h.fullSisters === 1
            ? t('waris.cond.fullSisterAlone')
            : t('waris.cond.fullSistersPlural', { n: h.fullSisters }));
    }
    if (h.paternalSisters && !h.paternalBrothers && !paternalSisterWithDesc) {
        if (!h.fullSisters) {
            const share = h.paternalSisters === 1 ? '1/2' : '2/3';
            push('paternalSisters', h.paternalSisters === 1 ? F(1, 2) : F(2, 3),
                t('waris.cond.paternalSisterReplaces', { share }));
        } else if (h.fullSisters === 1 && !fullSisterWithDesc) {
            push('paternalSisters', F(1, 6), t('waris.cond.paternalSisterWithOneFull'));
        }
    }
    const maternal = h.maternalBrothers + h.maternalSisters;
    if (maternal) {
        const total = maternal === 1 ? F(1, 6) : F(1, 3);
        const cond = maternal === 1 ? t('waris.cond.maternalAlone') : t('waris.cond.maternalPlural', { n: maternal });
        if (h.maternalBrothers) push('maternalBrothers', total.mul(F(h.maternalBrothers, maternal)), cond);
        if (h.maternalSisters) push('maternalSisters', total.mul(F(h.maternalSisters, maternal)), cond);
    }

    let totalFard = fard.reduce((s, e) => s.add(e.share), ZERO);

    // ---------- 3. 'Awl ----------
    let hasAwl = false;
    if (totalFard.cmp(ONE) > 0) {
        hasAwl = true;
        const asl = fard.reduce((l, e) => (l * e.share.d) / gcd(l, e.share.d), 1);
        notes.push(t('waris.note.awl', { total: totalFard.toString(), asl, newAsl: totalFard.mul(F(asl)).value }));
        fard.forEach(e => { e.awlFrom = e.share; e.share = e.share.div(totalFard); });
        totalFard = ONE;
    }
    let residue = ONE.sub(totalFard);

    // ---------- 4. 'Asabah: the nearest male line takes what is left ----------
    const asabah = [];
    const tie = (male, female, label, cond) => {
        // male and female of one rank: a male takes two parts, a female one (QS. An-Nisa: 11, 176)
        const parts = h[male] * 2 + h[female];
        if (h[male]) asabah.push({ type: male, part: F(h[male] * 2, parts), label: female && h[female] ? t('waris.label.residueTwoShares') : t('waris.label.residue'), cond });
        if (h[female]) asabah.push({ type: female, part: F(h[female], parts), label: t('waris.label.residueOneShare'), cond: t('waris.cond.asabahBilGhairWith', { male: NAME[male], parts }) });
        return true;
    };
    const ranks = [
        () => h.sons && tie('sons', 'daughters', '', h.daughters ? t('waris.cond.asabahBilGhairSons', { parts: h.sons * 2 + h.daughters }) : t('waris.cond.asabahBinNafsiExhausts')),
        () => h.grandsons && tie('grandsons', 'granddaughters', '', t('waris.cond.asabahGrandsonsReplace')),
        () => ascendant && (asabah.push({ type: ascendant, part: ONE, label: t('waris.label.residue'), cond: anyDesc
            ? t('waris.cond.asabahAscendantFemaleDesc')
            : t('waris.cond.asabahAscendantNoDesc') }), true),
        () => h.fullBrothers && tie('fullBrothers', 'fullSisters', '', h.fullSisters ? t('waris.cond.asabahFullSiblings') : t('waris.cond.asabahBinNafsi')),
        () => fullSisterWithDesc && (asabah.push({ type: 'fullSisters', part: ONE, label: t('waris.label.residue'), cond: t('waris.cond.asabahFullSisterMaalGhair') }), true),
        () => h.paternalBrothers && tie('paternalBrothers', 'paternalSisters', '', h.paternalSisters ? t('waris.cond.asabahPaternalSiblings') : t('waris.cond.asabahBinNafsi')),
        () => paternalSisterWithDesc && (asabah.push({ type: 'paternalSisters', part: ONE, label: t('waris.label.residue'), cond: t('waris.cond.asabahPaternalSisterMaalGhair') }), true),
        ...['fullNephews', 'paternalNephews', 'fullUncles', 'paternalUncles', 'fullCousins', 'paternalCousins'].map(tKey =>
            () => h[tKey] && (asabah.push({ type: tKey, part: ONE, label: t('waris.label.residue'), cond: t('waris.cond.asabahFar', { heir: NAME[tKey] }) }), true)),
    ];
    const farAsabah = ['fullNephews', 'paternalNephews', 'fullUncles', 'paternalUncles', 'fullCousins', 'paternalCousins'];
    let takerRank = -1;
    for (let i = 0; i < ranks.length; i++) {
        if (ranks[i]()) { takerRank = i; break; }
    }
    if (takerRank >= 0) {
        // Everyone below the taker in the 'asabah line is excluded by it.
        const takerName = NAME[asabah[0].type];
        farAsabah.forEach(tKey => { if (h[tKey] && !asabah.some(a => a.type === tKey)) exclude(tKey, t('waris.exclude.byCloserHeir', { heir: takerName })); });
        if (!residue.isZero()) {
            asabah.forEach(a => {
                const amount = residue.mul(a.part);
                const own = fard.find(e => e.type === a.type);
                if (own) {
                    own.share = own.share.add(amount);
                    own.label = t('waris.label.plusResidue', { from: own.awlFrom || own.share.sub(amount) });
                    own.category = t('waris.category.furudhAndAsabah');
                    own.condition = a.cond;
                } else {
                    fard.push({ type: a.type, count: h[a.type], share: amount, category: t('waris.category.asabah'), label: a.label, condition: a.cond, asabah: true });
                }
            });
            residue = ZERO;
        } else {
            asabah.forEach(a => {
                if (fard.some(e => e.type === a.type)) return;
                excluded.push({ type: a.type, count: h[a.type], reason: t('waris.exclude.asabahNoResidue') });
            });
            if (asabah.some(a => a.type === 'fullBrothers') && maternal >= 2) {
                notes.push(t('waris.note.himariyyah'));
            }
        }
    }

    // ---------- 5. Radd and dhawil arham ----------
    let hasRadd = false;
    const arham = ['paternalAunts', 'maternalAunts', 'maternalUncles'].filter(tKey => h[tKey]);
    const nonSpouse = fard.filter(e => !e.spouse);
    if (!residue.isZero() && nonSpouse.length) {
        hasRadd = true;
        const base = nonSpouse.reduce((s, e) => s.add(e.share), ZERO);
        nonSpouse.forEach(e => { e.raddFrom = e.share; e.share = e.share.add(residue.mul(e.share.div(base))); e.isRadd = true; });
        notes.push(t('waris.note.radd', { residue: residue.toString() }));
        residue = ZERO;
    }
    if (arham.length) {
        if (!residue.isZero()) {
            // Tanzil: a paternal aunt stands in the father's place, a maternal aunt or uncle in the
            // mother's. Father's side 2/3, mother's side 1/3 of what is left; equal per person.
            const father = h.paternalAunts;
            const mother = h.maternalAunts + h.maternalUncles;
            const fShare = father && mother ? F(2, 3) : father ? ONE : ZERO;
            const mShare = ONE.sub(fShare);
            const cond = side => t('waris.cond.dhawilArham', { side });
            if (father) fard.push({ type: 'paternalAunts', count: father, share: residue.mul(fShare), category: t('waris.category.dhawilArham'), label: father && mother ? t('waris.label.twoThirdsRem') : t('waris.label.residue'), condition: cond(heirName('father')) });
            if (h.maternalAunts) fard.push({ type: 'maternalAunts', count: h.maternalAunts, share: residue.mul(mShare).mul(F(h.maternalAunts, mother)), category: t('waris.category.dhawilArham'), label: father ? t('waris.label.oneThirdRem') : t('waris.label.residue'), condition: cond(heirName('mother')) });
            if (h.maternalUncles) fard.push({ type: 'maternalUncles', count: h.maternalUncles, share: residue.mul(mShare).mul(F(h.maternalUncles, mother)), category: t('waris.category.dhawilArham'), label: father ? t('waris.label.oneThirdRem') : t('waris.label.residue'), condition: cond(heirName('mother')) });
            notes.push(t('waris.note.dhawilArham'));
            residue = ZERO;
        } else {
            arham.forEach(tKey => excluded.push({ type: tKey, count: h[tKey], reason: t('waris.exclude.dhawilArhamBlocked') }));
        }
    }
    if (!residue.isZero()) {
        const spouses = fard.filter(e => e.spouse);
        if (spouses.length) {
            hasRadd = true;
            spouses.forEach(e => { e.raddFrom = e.share; e.share = e.share.add(residue); e.isRadd = true; });
            notes.push(t('waris.note.raddSpouse', { residue: residue.toString() }));
            residue = ZERO;
        } else {
            notes.push(t('waris.note.baitulMal'));
        }
    }
    if (h.grandfather && siblingCount && grandfatherExcludedSiblings) {
        notes.push(t('waris.note.grandfatherDispute'));
    }

    // ---------- Result ----------
    const shares = fard
        .filter(e => e.count > 0)
        .map(e => ({
            type: e.type,
            count: e.count,
            category: e.category || t('waris.category.furudh'),
            share: e.share,
            fraction: e.label ? `${e.label} = ${e.share}` : e.awlFrom ? `${e.awlFrom} → ${e.share}` : e.raddFrom ? `${e.raddFrom} + radd = ${e.share}` : `${e.share}`,
            condition: e.condition + (e.awlFrom && !e.label ? t('waris.cond.afterAwl', { share: e.share.toString() }) : '') + (e.isRadd ? t('waris.cond.afterRadd', { share: e.share.toString() }) : ''),
            isAwl: !!e.awlFrom,
            isRadd: !!e.isRadd,
        }))
        .sort((a, b) => HEIR_KEYS.indexOf(a.type) - HEIR_KEYS.indexOf(b.type));

    return { shares, excluded, hasAwl, hasRadd, notes };
}
