// ===== Mesin Hitung Fara'id (metode jumhur) =====
// Modul murni tanpa DOM supaya bisa diuji. Semua bagian memakai pecahan
// eksak (bukan desimal 0.1667) agar total selalu tepat 100%.
//
// Ahli waris yang didukung: suami / istri (1-4), ayah, ibu, anak laki-laki,
// anak perempuan. Urutan: furudh -> 'awl -> asabah -> radd.

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

const F = (n, d) => new Frac(n, d);
const ZERO = F(0, 1);
const ONE = F(1, 1);
const num = (v) => {
    const x = parseInt(v, 10);
    return Number.isFinite(x) && x > 0 ? x : 0;
};

/**
 * @param {object} input  { husband, wife, father, mother, sons, daughters } (jumlah)
 * @returns {{ shares: Array, hasAwl: boolean, hasRadd: boolean, asl: number, notes: string[] }}
 *   shares[i] = { type, count, category, fraction (string), share (Frac), condition }
 */
export function computeFaraid(input = {}) {
    const h = {
        husband: Math.min(num(input.husband), 1),
        wife: Math.min(num(input.wife), 4),
        father: Math.min(num(input.father), 1),
        mother: Math.min(num(input.mother), 1),
        sons: num(input.sons),
        daughters: num(input.daughters),
    };
    const hasChild = h.sons > 0 || h.daughters > 0;
    const notes = [];

    // ---- 1. Ashabul furudh ----
    // entries: { type, count, share, label, condition, spouse, radd }
    const fard = [];

    let spouseShare = ZERO;
    if (h.husband) {
        spouseShare = hasChild ? F(1, 4) : F(1, 2);
        fard.push({ type: 'husband', count: 1, share: spouseShare, spouse: true,
            condition: hasChild ? 'Ada anak → 1/4 (QS. An-Nisa: 12)' : 'Tidak ada anak → 1/2 (QS. An-Nisa: 12)' });
    }
    if (h.wife) {
        spouseShare = hasChild ? F(1, 8) : F(1, 4);
        fard.push({ type: 'wife', count: h.wife, share: spouseShare, spouse: true,
            condition: (hasChild ? 'Ada anak → 1/8' : 'Tidak ada anak → 1/4') +
                (h.wife > 1 ? `, dibagi rata ${h.wife} istri` : '') + ' (QS. An-Nisa: 12)' });
    }

    if (h.mother) {
        if (hasChild) {
            fard.push({ type: 'mother', count: 1, share: F(1, 6),
                condition: 'Ada anak → 1/6 (QS. An-Nisa: 11)' });
        } else if (h.father && (h.husband || h.wife)) {
            // Al-'Umariyyatan: ibu mendapat 1/3 SISA setelah bagian suami/istri
            const s = ONE.sub(spouseShare).mul(F(1, 3));
            fard.push({ type: 'mother', count: 1, share: s,
                label: '1/3 sisa',
                condition: `Al-'Umariyyatan: 1/3 dari sisa setelah bagian ${h.husband ? 'suami' : 'istri'} = ${s}` });
            notes.push("Kasus Al-'Umariyyatan (Gharrawain): ibu mendapat 1/3 sisa, bukan 1/3 harta, agar bagian ayah tetap 2× ibu (ijtihad Umar bin Khattab ra, disepakati jumhur).");
        } else {
            fard.push({ type: 'mother', count: 1, share: F(1, 3),
                condition: 'Tidak ada anak → 1/3 (QS. An-Nisa: 11)' });
        }
    }

    if (h.father && hasChild) {
        fard.push({ type: 'father', count: 1, share: F(1, 6),
            condition: 'Ada anak → 1/6 (QS. An-Nisa: 11)' });
    }

    if (h.daughters && !h.sons) {
        const s = h.daughters === 1 ? F(1, 2) : F(2, 3);
        fard.push({ type: 'daughters', count: h.daughters, share: s,
            condition: h.daughters === 1
                ? 'Seorang diri, tanpa anak laki-laki → 1/2 (QS. An-Nisa: 11)'
                : `${h.daughters} anak perempuan, tanpa anak laki-laki → 2/3 dibagi rata (QS. An-Nisa: 11)` });
    }

    let totalFard = fard.reduce((s, e) => s.add(e.share), ZERO);

    // ---- 2. 'Awl: total bagian melebihi harta ----
    let hasAwl = false;
    let asl = fard.reduce((l, e) => (l * e.share.d) / gcd(l, e.share.d), 1);
    if (totalFard.cmp(ONE) > 0) {
        hasAwl = true;
        const aulTo = totalFard.mul(F(asl, 1)).value;
        notes.push(`'Awl: jumlah bagian ${totalFard} melebihi 1, asal masalah ${asl} dinaikkan menjadi ${aulTo}. Semua bagian dikurangi secara proporsional.`);
        fard.forEach(e => { e.awlFrom = e.share; e.share = e.share.div(totalFard); });
        totalFard = ONE;
    }

    let residue = ONE.sub(totalFard);
    const out = [];

    // ---- 3. Asabah ----
    let asabahTaken = false;
    if (!residue.isZero()) {
        if (h.sons) {
            // Anak laki-laki (+ anak perempuan): lil-dzakari mitslu hazhzhil untsayain
            const parts = h.sons * 2 + h.daughters;
            out.push({ type: 'sons', count: h.sons, category: 'Asabah',
                share: residue.mul(F(h.sons * 2, parts)), label: 'Sisa (2 bagian/orang)',
                condition: h.daughters
                    ? `Asabah bil-ghair: sisa dibagi ${parts} bagian, laki-laki 2 : perempuan 1 (QS. An-Nisa: 11)`
                    : `Asabah bin-nafsi: menghabiskan sisa, dibagi rata ${h.sons} orang` });
            if (h.daughters) {
                out.push({ type: 'daughters_with_sons', count: h.daughters, category: 'Asabah',
                    share: residue.mul(F(h.daughters, parts)), label: 'Sisa (1 bagian/orang)',
                    condition: `Asabah bil-ghair bersama saudara laki-lakinya, 1 bagian/orang dari ${parts} bagian` });
            }
            asabahTaken = true;
        } else if (h.father) {
            // Ayah asabah: tanpa anak -> seluruh sisa; dengan anak perempuan -> 1/6 + sisa
            const fatherFard = fard.find(e => e.type === 'father');
            if (fatherFard) {
                fatherFard.share = fatherFard.share.add(residue);
                fatherFard.label = '1/6 + sisa';
                fatherFard.category = 'Ashabul Furudh + Asabah';
                fatherFard.condition = 'Ada anak perempuan tanpa anak laki-laki → 1/6 fardh + sisa sebagai asabah';
            } else {
                out.push({ type: 'father', count: 1, category: 'Asabah', share: residue,
                    label: 'Sisa', condition: 'Tidak ada anak → ayah menjadi asabah, mengambil seluruh sisa' });
            }
            asabahTaken = true;
        }
        if (asabahTaken) residue = ZERO;
    }

    // ---- 4. Radd: sisa dikembalikan ke ashabul furudh selain suami/istri ----
    let hasRadd = false;
    if (!residue.isZero()) {
        const raddTo = fard.filter(e => !e.spouse);
        const pool = raddTo.length ? raddTo : fard;
        if (pool.length) {
            hasRadd = true;
            const base = pool.reduce((s, e) => s.add(e.share), ZERO);
            pool.forEach(e => {
                e.raddFrom = e.share;
                e.share = e.share.add(residue.mul(e.share.div(base)));
                e.isRadd = true;
            });
            notes.push(raddTo.length
                ? `Radd: sisa ${residue} dikembalikan kepada ashabul furudh secara proporsional. Suami/istri TIDAK mendapat radd (pendapat jumhur).`
                : `Tidak ada ahli waris selain suami/istri: sisa ${residue} dikembalikan kepada suami/istri (pendapat Utsman ra, dipakai banyak lembaga fatwa modern karena baitul mal tidak berjalan).`);
            residue = ZERO;
        }
    }

    // ---- Susun hasil ----
    const order = ['husband', 'wife', 'father', 'mother', 'daughters', 'sons', 'daughters_with_sons'];
    const shares = [
        ...fard.map(e => ({
            type: e.type,
            count: e.count,
            category: e.category || 'Ashabul Furudh',
            share: e.share,
            fraction: e.label ? `${e.label} = ${e.share}` : (e.awlFrom ? `${e.awlFrom} → ${e.share}` : e.raddFrom ? `${e.raddFrom} + radd` : `${e.share}`),
            condition: e.condition + (e.awlFrom ? ` • setelah 'awl: ${e.share}` : '') + (e.isRadd ? ` • setelah radd: ${e.share}` : ''),
            isAwl: !!e.awlFrom,
            isRadd: !!e.isRadd,
        })),
        ...out.map(e => ({ ...e, fraction: `${e.label} = ${e.share}` })),
    ].sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

    return { shares, hasAwl, hasRadd, asl, notes };
}
