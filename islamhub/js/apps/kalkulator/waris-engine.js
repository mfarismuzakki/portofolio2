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

// Short Indonesian names, used inside condition and exclusion texts.
const NAME = {
    husband: 'suami', wife: 'istri', father: 'ayah', mother: 'ibu', grandfather: 'kakek',
    grandmotherPaternal: 'nenek dari ayah', grandmotherMaternal: 'nenek dari ibu',
    sons: 'anak laki-laki', daughters: 'anak perempuan', grandsons: 'cucu laki-laki', granddaughters: 'cucu perempuan',
    fullBrothers: 'saudara kandung', fullSisters: 'saudari kandung', paternalBrothers: 'saudara seayah',
    paternalSisters: 'saudari seayah', maternalBrothers: 'saudara seibu', maternalSisters: 'saudari seibu',
    fullNephews: 'keponakan (anak saudara kandung)', paternalNephews: 'keponakan (anak saudara seayah)',
    fullUncles: 'paman kandung', paternalUncles: 'paman seayah', fullCousins: 'sepupu (anak paman kandung)',
    paternalCousins: 'sepupu (anak paman seayah)', paternalAunts: 'bibi dari ayah', maternalAunts: 'bibi dari ibu',
    maternalUncles: 'paman dari ibu',
};

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
    if (h.father) exclude('grandfather', 'Terhalang oleh ayah');
    if (h.mother) {
        exclude('grandmotherPaternal', 'Terhalang oleh ibu');
        exclude('grandmotherMaternal', 'Terhalang oleh ibu');
    }
    if (h.father) exclude('grandmotherPaternal', 'Terhalang oleh ayah (pendapat jumhur)');

    if (h.sons) {
        exclude('grandsons', 'Terhalang oleh anak laki-laki');
        exclude('granddaughters', 'Terhalang oleh anak laki-laki');
    }
    if (h.daughters >= 2 && !h.grandsons) exclude('granddaughters', 'Bagian anak perempuan (2/3) sudah habis dan tidak ada cucu laki-laki yang menjadikannya asabah');

    const maleDesc = h.sons + h.grandsons > 0;
    const femaleDesc = h.daughters + h.granddaughters > 0;
    const anyDesc = maleDesc || femaleDesc;
    // Siblings counted for the mother's share before they are excluded (jumhur).
    const siblingCount = h.fullBrothers + h.fullSisters + h.paternalBrothers + h.paternalSisters + h.maternalBrothers + h.maternalSisters;

    const siblingBlocker = h.sons ? 'anak laki-laki' : h.grandsons ? 'cucu laki-laki' : h.father ? 'ayah' : h.grandfather ? 'kakek' : null;
    if (siblingBlocker) {
        ['fullBrothers', 'fullSisters', 'paternalBrothers', 'paternalSisters'].forEach(t =>
            exclude(t, `Terhalang oleh ${siblingBlocker}` + (siblingBlocker === 'kakek' ? ' (pendapat Abu Bakr, dipilih Ibnu Taimiyah dan Ibnu Utsaimin)' : '')));
    }
    const maternalBlocker = anyDesc ? 'keturunan (anak/cucu)' : h.father ? 'ayah' : h.grandfather ? 'kakek' : null;
    if (maternalBlocker) {
        exclude('maternalBrothers', `Terhalang oleh ${maternalBlocker}`);
        exclude('maternalSisters', `Terhalang oleh ${maternalBlocker}`);
    }

    // A full sister with a daughter/granddaughter is 'asabah ma'al ghair and ranks as a full brother.
    const fullSisterWithDesc = h.fullSisters > 0 && !h.fullBrothers && femaleDesc;
    if (h.fullBrothers) {
        exclude('paternalBrothers', 'Terhalang oleh saudara kandung');
        exclude('paternalSisters', 'Terhalang oleh saudara kandung');
    }
    if (fullSisterWithDesc) {
        exclude('paternalBrothers', "Terhalang oleh saudari kandung yang menjadi asabah ma'al ghair");
        exclude('paternalSisters', "Terhalang oleh saudari kandung yang menjadi asabah ma'al ghair");
    }
    if (h.fullSisters >= 2 && !h.paternalBrothers) exclude('paternalSisters', 'Bagian saudari kandung (2/3) sudah habis dan tidak ada saudara seayah');
    const paternalSisterWithDesc = h.paternalSisters > 0 && !h.paternalBrothers && !h.fullSisters && femaleDesc;

    // ---------- 2. Ashabul furudh ----------
    const fard = []; // { type, count, share, condition, spouse }
    const push = (type, share, condition, extra = {}) => fard.push({ type, count: h[type], share, condition, ...extra });

    let spouseShare = ZERO;
    if (h.husband) {
        spouseShare = anyDesc ? F(1, 4) : F(1, 2);
        push('husband', spouseShare, anyDesc ? 'Ada anak/cucu → 1/4 (QS. An-Nisa: 12)' : 'Tidak ada anak/cucu → 1/2 (QS. An-Nisa: 12)', { spouse: true });
    }
    if (h.wife) {
        spouseShare = anyDesc ? F(1, 8) : F(1, 4);
        push('wife', spouseShare, (anyDesc ? 'Ada anak/cucu → 1/8' : 'Tidak ada anak/cucu → 1/4') +
            (h.wife > 1 ? `, dibagi rata ${h.wife} istri` : '') + ' (QS. An-Nisa: 12)', { spouse: true });
    }

    if (h.mother) {
        if (anyDesc || siblingCount >= 2) {
            push('mother', F(1, 6), anyDesc ? 'Ada anak/cucu → 1/6 (QS. An-Nisa: 11)' : `Ada ${siblingCount} saudara → 1/6 (QS. An-Nisa: 11), walaupun saudara itu sendiri terhalang`);
        } else if (h.father && (h.husband || h.wife)) {
            const s = ONE.sub(spouseShare).mul(F(1, 3));
            push('mother', s, `Al-'Umariyyatan: 1/3 dari sisa setelah bagian ${h.husband ? 'suami' : 'istri'} = ${s}`, { label: '1/3 sisa' });
            notes.push("Kasus Al-'Umariyyatan (Gharrawain): ibu mendapat 1/3 sisa, bukan 1/3 harta, agar bagian ayah tetap 2× ibu (ijtihad Umar bin Khattab ra, disepakati jumhur).");
        } else {
            push('mother', F(1, 3), 'Tidak ada anak/cucu dan kurang dari 2 saudara → 1/3 (QS. An-Nisa: 11)');
        }
    }
    const gms = ['grandmotherPaternal', 'grandmotherMaternal'].filter(t => h[t]);
    if (gms.length) {
        gms.forEach(t => push(t, F(1, 6 * gms.length), gms.length > 1
            ? '1/6 dibagi rata antara dua nenek (HR. Abu Dawud & At-Tirmidzi, kisah Al-Mughirah)'
            : '1/6 (HR. Abu Dawud & At-Tirmidzi, kisah Al-Mughirah)'));
    }

    // father / grandfather: 1/6 with any descendant; 'asabah handled below
    const ascendant = h.father ? 'father' : h.grandfather ? 'grandfather' : null;
    if (ascendant && anyDesc) {
        push(ascendant, F(1, 6), `Ada keturunan → 1/6 (QS. An-Nisa: 11)${ascendant === 'grandfather' ? ', kakek menggantikan ayah' : ''}`);
    }

    if (h.daughters && !h.sons) {
        push('daughters', h.daughters === 1 ? F(1, 2) : F(2, 3), h.daughters === 1
            ? 'Seorang diri, tanpa anak laki-laki → 1/2 (QS. An-Nisa: 11)'
            : `${h.daughters} anak perempuan, tanpa anak laki-laki → 2/3 dibagi rata (QS. An-Nisa: 11)`);
    }
    if (h.granddaughters && !h.grandsons) {
        if (!h.daughters) {
            push('granddaughters', h.granddaughters === 1 ? F(1, 2) : F(2, 3),
                (h.granddaughters === 1 ? 'Seorang diri' : `${h.granddaughters} orang`) + ', tanpa anak → menggantikan anak perempuan: ' + (h.granddaughters === 1 ? '1/2' : '2/3'));
        } else {
            push('granddaughters', F(1, 6), 'Bersama satu anak perempuan → 1/6 penyempurna 2/3 (HR. Al-Bukhari dari Ibnu Mas\'ud)');
        }
    }

    if (h.fullSisters && !h.fullBrothers && !femaleDesc) {
        push('fullSisters', h.fullSisters === 1 ? F(1, 2) : F(2, 3), h.fullSisters === 1
            ? 'Kalalah, seorang diri → 1/2 (QS. An-Nisa: 176)'
            : `Kalalah, ${h.fullSisters} orang → 2/3 dibagi rata (QS. An-Nisa: 176)`);
    }
    if (h.paternalSisters && !h.paternalBrothers && !paternalSisterWithDesc) {
        if (!h.fullSisters) {
            push('paternalSisters', h.paternalSisters === 1 ? F(1, 2) : F(2, 3),
                'Tanpa saudari kandung → menggantikannya: ' + (h.paternalSisters === 1 ? '1/2' : '2/3') + ' (QS. An-Nisa: 176)');
        } else if (h.fullSisters === 1 && !fullSisterWithDesc) {
            push('paternalSisters', F(1, 6), 'Bersama satu saudari kandung → 1/6 penyempurna 2/3');
        }
    }
    const maternal = h.maternalBrothers + h.maternalSisters;
    if (maternal) {
        const total = maternal === 1 ? F(1, 6) : F(1, 3);
        const cond = maternal === 1 ? 'Seorang diri → 1/6 (QS. An-Nisa: 12)' : `${maternal} orang → 1/3, laki-laki dan perempuan sama rata (QS. An-Nisa: 12)`;
        if (h.maternalBrothers) push('maternalBrothers', total.mul(F(h.maternalBrothers, maternal)), cond);
        if (h.maternalSisters) push('maternalSisters', total.mul(F(h.maternalSisters, maternal)), cond);
    }

    let totalFard = fard.reduce((s, e) => s.add(e.share), ZERO);

    // ---------- 3. 'Awl ----------
    let hasAwl = false;
    if (totalFard.cmp(ONE) > 0) {
        hasAwl = true;
        const asl = fard.reduce((l, e) => (l * e.share.d) / gcd(l, e.share.d), 1);
        notes.push(`'Awl: jumlah bagian ${totalFard} melebihi 1, asal masalah ${asl} dinaikkan menjadi ${totalFard.mul(F(asl)).value}. Semua bagian dikurangi secara proporsional.`);
        fard.forEach(e => { e.awlFrom = e.share; e.share = e.share.div(totalFard); });
        totalFard = ONE;
    }
    let residue = ONE.sub(totalFard);

    // ---------- 4. 'Asabah: the nearest male line takes what is left ----------
    const asabah = [];
    const tie = (male, female, label, cond) => {
        // male and female of one rank: a male takes two parts, a female one (QS. An-Nisa: 11, 176)
        const parts = h[male] * 2 + h[female];
        if (h[male]) asabah.push({ type: male, part: F(h[male] * 2, parts), label: female && h[female] ? 'Sisa (2 bagian/orang)' : 'Sisa', cond });
        if (h[female]) asabah.push({ type: female, part: F(h[female], parts), label: 'Sisa (1 bagian/orang)', cond: `Asabah bil-ghair bersama ${NAME[male]}, 1 bagian/orang dari ${parts} bagian` });
        return true;
    };
    const ranks = [
        () => h.sons && tie('sons', 'daughters', '', h.daughters ? `Asabah bil-ghair: sisa dibagi ${h.sons * 2 + h.daughters} bagian, laki-laki 2 : perempuan 1 (QS. An-Nisa: 11)` : 'Asabah bin-nafsi: menghabiskan sisa'),
        () => h.grandsons && tie('grandsons', 'granddaughters', '', 'Asabah bin-nafsi: cucu laki-laki menggantikan anak laki-laki'),
        () => ascendant && (asabah.push({ type: ascendant, part: ONE, label: 'Sisa', cond: anyDesc
            ? 'Hanya ada keturunan perempuan → 1/6 + sisa sebagai asabah'
            : 'Tidak ada keturunan → asabah, mengambil seluruh sisa' }), true),
        () => h.fullBrothers && tie('fullBrothers', 'fullSisters', '', h.fullSisters ? 'Asabah bil-ghair: laki-laki 2 : perempuan 1 (QS. An-Nisa: 176)' : 'Asabah bin-nafsi'),
        () => fullSisterWithDesc && (asabah.push({ type: 'fullSisters', part: ONE, label: 'Sisa', cond: "Asabah ma'al ghair bersama anak/cucu perempuan (HR. Al-Bukhari dari Ibnu Mas'ud)" }), true),
        () => h.paternalBrothers && tie('paternalBrothers', 'paternalSisters', '', h.paternalSisters ? 'Asabah bil-ghair: laki-laki 2 : perempuan 1' : 'Asabah bin-nafsi'),
        () => paternalSisterWithDesc && (asabah.push({ type: 'paternalSisters', part: ONE, label: 'Sisa', cond: "Asabah ma'al ghair bersama anak/cucu perempuan" }), true),
        ...['fullNephews', 'paternalNephews', 'fullUncles', 'paternalUncles', 'fullCousins', 'paternalCousins'].map(t =>
            () => h[t] && (asabah.push({ type: t, part: ONE, label: 'Sisa', cond: `Asabah bin-nafsi: ${NAME[t]} adalah laki-laki terdekat yang tersisa (HR. Al-Bukhari & Muslim: "fa li-aula rajulin dzakar")` }), true)),
    ];
    const farAsabah = ['fullNephews', 'paternalNephews', 'fullUncles', 'paternalUncles', 'fullCousins', 'paternalCousins'];
    let takerRank = -1;
    for (let i = 0; i < ranks.length; i++) {
        if (ranks[i]()) { takerRank = i; break; }
    }
    if (takerRank >= 0) {
        // Everyone below the taker in the 'asabah line is excluded by it.
        const takerName = NAME[asabah[0].type];
        farAsabah.forEach(t => { if (h[t] && !asabah.some(a => a.type === t)) exclude(t, `Terhalang oleh ${takerName} yang lebih dekat`); });
        if (!residue.isZero()) {
            asabah.forEach(a => {
                const amount = residue.mul(a.part);
                const own = fard.find(e => e.type === a.type);
                if (own) {
                    own.share = own.share.add(amount);
                    own.label = `${own.awlFrom || own.share.sub(amount)} + sisa`;
                    own.category = 'Ashabul Furudh + Asabah';
                    own.condition = a.cond;
                } else {
                    fard.push({ type: a.type, count: h[a.type], share: amount, category: 'Asabah', label: a.label, condition: a.cond, asabah: true });
                }
            });
            residue = ZERO;
        } else {
            asabah.forEach(a => {
                if (fard.some(e => e.type === a.type)) return;
                excluded.push({ type: a.type, count: h[a.type], reason: 'Asabah, tetapi harta sudah habis dibagi kepada ashabul furudh (tidak ada sisa)' });
            });
            if (asabah.some(a => a.type === 'fullBrothers') && maternal >= 2) {
                notes.push('Kasus Al-Himariyyah/Musyarakah: saudara kandung tidak mendapat bagian dan tidak disekutukan dengan saudara seibu (mazhab Hanafi dan Hanbali).');
            }
        }
    }

    // ---------- 5. Radd and dhawil arham ----------
    let hasRadd = false;
    const arham = ['paternalAunts', 'maternalAunts', 'maternalUncles'].filter(t => h[t]);
    const nonSpouse = fard.filter(e => !e.spouse);
    if (!residue.isZero() && nonSpouse.length) {
        hasRadd = true;
        const base = nonSpouse.reduce((s, e) => s.add(e.share), ZERO);
        nonSpouse.forEach(e => { e.raddFrom = e.share; e.share = e.share.add(residue.mul(e.share.div(base))); e.isRadd = true; });
        notes.push(`Radd: sisa ${residue} dikembalikan kepada ashabul furudh secara proporsional. Suami/istri tidak mendapat radd (pendapat jumhur).`);
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
            const cond = side => `Dzawil arham (tanzil): menempati posisi ${side}, laki-laki dan perempuan sama (mazhab Hanbali)`;
            if (father) fard.push({ type: 'paternalAunts', count: father, share: residue.mul(fShare), category: 'Dzawil Arham', label: father && mother ? '2/3 sisa' : 'Sisa', condition: cond('ayah') });
            if (h.maternalAunts) fard.push({ type: 'maternalAunts', count: h.maternalAunts, share: residue.mul(mShare).mul(F(h.maternalAunts, mother)), category: 'Dzawil Arham', label: father ? '1/3 sisa' : 'Sisa', condition: cond('ibu') });
            if (h.maternalUncles) fard.push({ type: 'maternalUncles', count: h.maternalUncles, share: residue.mul(mShare).mul(F(h.maternalUncles, mother)), category: 'Dzawil Arham', label: father ? '1/3 sisa' : 'Sisa', condition: cond('ibu') });
            notes.push('Tidak ada ashabul furudh (selain suami/istri) maupun asabah, sehingga sisa harta diberikan kepada dzawil arham dengan metode tanzil (mazhab Hanbali).');
            residue = ZERO;
        } else {
            arham.forEach(t => excluded.push({ type: t, count: h[t], reason: 'Dzawil arham tidak mewarisi selama masih ada ashabul furudh (selain suami/istri) atau asabah' }));
        }
    }
    if (!residue.isZero()) {
        const spouses = fard.filter(e => e.spouse);
        if (spouses.length) {
            hasRadd = true;
            spouses.forEach(e => { e.raddFrom = e.share; e.share = e.share.add(residue); e.isRadd = true; });
            notes.push(`Tidak ada ahli waris lain: sisa ${residue} dikembalikan kepada suami/istri (pendapat Utsman ra, dipakai banyak lembaga fatwa modern karena baitul mal tidak berjalan).`);
            residue = ZERO;
        } else {
            notes.push('Tidak ada ahli waris yang berhak: harta diserahkan ke baitul mal.');
        }
    }
    if (h.grandfather && siblingCount && excluded.some(e => /kakek \(pendapat/.test(e.reason))) {
        notes.push('Kakek bersama saudara diperselisihkan ulama. Di sini kakek menghalangi saudara seperti ayah (pendapat Abu Bakr dan Ibnu Abbas ra, dipilih Ibnu Taimiyah dan Ibnu Utsaimin). Mazhab Syafi\'i dan Hanbali membagi bersama (muqasamah).');
    }

    // ---------- Result ----------
    const shares = fard
        .filter(e => e.count > 0)
        .map(e => ({
            type: e.type,
            count: e.count,
            category: e.category || 'Ashabul Furudh',
            share: e.share,
            fraction: e.label ? `${e.label} = ${e.share}` : e.awlFrom ? `${e.awlFrom} → ${e.share}` : e.raddFrom ? `${e.raddFrom} + radd = ${e.share}` : `${e.share}`,
            condition: e.condition + (e.awlFrom && !e.label ? ` • setelah 'awl: ${e.share}` : '') + (e.isRadd ? ` • setelah radd: ${e.share}` : ''),
            isAwl: !!e.awlFrom,
            isRadd: !!e.isRadd,
        }))
        .sort((a, b) => HEIR_KEYS.indexOf(a.type) - HEIR_KEYS.indexOf(b.type));

    return { shares, excluded, hasAwl, hasRadd, notes };
}
