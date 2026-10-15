// Textbook cases for js/apps/kalkulator/waris-engine.js.
//   node islamhub/tools/test_waris_engine.mjs
import { computeFaraid } from '../js/apps/kalkulator/waris-engine.js';

const CASES = [
    ['husband + full sister', { husband: 1, fullSisters: 1 }, { husband: '1/2', fullSisters: '1/2' }],
    ['wife + daughter + full sister (ma\'al ghair)', { wife: 1, daughters: 1, fullSisters: 1 }, { wife: '1/8', daughters: '1/2', fullSisters: '3/8' }],
    ['Ibn Mas\'ud: daughter + granddaughter + full sister', { daughters: 1, granddaughters: 1, fullSisters: 1 }, { daughters: '1/2', granddaughters: '1/6', fullSisters: '1/3' }],
    ['2 daughters + grandson + granddaughter', { daughters: 2, grandsons: 1, granddaughters: 1 }, { daughters: '2/3', grandsons: '2/9', granddaughters: '1/9' }],
    ['2 daughters + granddaughter (excluded) + uncle', { daughters: 2, granddaughters: 1, fullUncles: 1 }, { daughters: '2/3', fullUncles: '1/3' }],
    ['father + mother + 2 brothers (mother 1/6)', { father: 1, mother: 1, fullBrothers: 2 }, { father: '5/6', mother: '1/6' }],
    ['Umariyyah: husband + father + mother', { husband: 1, father: 1, mother: 1 }, { husband: '1/2', mother: '1/6', father: '1/3' }],
    ['Umariyyah: wife + father + mother', { wife: 1, father: 1, mother: 1 }, { wife: '1/4', mother: '1/4', father: '1/2' }],
    ['grandfather + mother + wife: no Umariyyah', { wife: 1, grandfather: 1, mother: 1 }, { wife: '1/4', mother: '1/3', grandfather: '5/12' }],
    ['Himariyyah: husband + mother + 2 maternal + full brother', { husband: 1, mother: 1, maternalBrothers: 2, fullBrothers: 1 }, { husband: '1/2', mother: '1/6', maternalBrothers: '1/3' }],
    ['grandfather excludes brother', { grandfather: 1, fullBrothers: 1 }, { grandfather: '1' }],
    ['wife + paternal uncle', { wife: 1, fullUncles: 1 }, { wife: '1/4', fullUncles: '3/4' }],
    ['nephew excluded by brother', { fullBrothers: 1, fullNephews: 2 }, { fullBrothers: '1' }],
    ['\'awl to 10', { husband: 1, fullSisters: 2, maternalSisters: 2, mother: 1 }, { husband: '3/10', fullSisters: '2/5', maternalSisters: '1/5', mother: '1/10' }],
    ['\'awl: husband + 2 daughters + mother (13)', { husband: 1, daughters: 2, mother: 1 }, { husband: '3/13', daughters: '8/13', mother: '2/13' }],
    ['radd: mother + daughter', { mother: 1, daughters: 1 }, { mother: '1/4', daughters: '3/4' }],
    ['radd: full sister + paternal sister', { fullSisters: 1, paternalSisters: 1 }, { fullSisters: '3/4', paternalSisters: '1/4' }],
    ['radd with spouse: wife + daughter', { wife: 1, daughters: 1 }, { wife: '1/8', daughters: '7/8' }],
    ['two grandmothers + son', { grandmotherPaternal: 1, grandmotherMaternal: 1, sons: 1 }, { grandmotherPaternal: '1/12', grandmotherMaternal: '1/12', sons: '5/6' }],
    ['father excludes paternal grandmother', { father: 1, grandmotherPaternal: 1, grandmotherMaternal: 1 }, { father: '5/6', grandmotherMaternal: '1/6' }],
    ['father + daughter: 1/6 + residue', { father: 1, daughters: 1 }, { father: '1/2', daughters: '1/2' }],
    ['full sister ma\'al ghair excludes paternal brother', { daughters: 1, fullSisters: 1, paternalBrothers: 1 }, { daughters: '1/2', fullSisters: '1/2' }],
    ['full brother + sister 2:1', { fullBrothers: 1, fullSisters: 1 }, { fullBrothers: '2/3', fullSisters: '1/3' }],
    ['2 full sisters + paternal brother + paternal sister', { fullSisters: 2, paternalBrothers: 1, paternalSisters: 1 }, { fullSisters: '2/3', paternalBrothers: '2/9', paternalSisters: '1/9' }],
    ['dhawil arham: wife + paternal aunt + maternal aunt', { wife: 1, paternalAunts: 1, maternalAunts: 1 }, { wife: '1/4', paternalAunts: '1/2', maternalAunts: '1/4' }],
    ['dhawil arham excluded by uncle', { paternalAunts: 1, fullUncles: 1 }, { fullUncles: '1' }],
    ['dhawil arham: maternal aunt + maternal uncle equal', { maternalAunts: 1, maternalUncles: 1 }, { maternalAunts: '1/2', maternalUncles: '1/2' }],
    ['wife alone: radd to spouse', { wife: 1 }, { wife: '1' }],
    ['son + 2 daughters + wife + mother', { sons: 1, daughters: 2, wife: 1, mother: 1 }, { wife: '1/8', mother: '1/6', sons: '17/48', daughters: '17/48' }],
];

let fail = 0;
for (const [name, input, expected] of CASES) {
    const r = computeFaraid(input);
    const got = Object.fromEntries(r.shares.map(s => [s.type, s.share.toString()]));
    const total = r.shares.reduce((s, x) => s.add(x.share), r.shares[0]?.share.sub(r.shares[0].share) ?? null);
    const ok = JSON.stringify(Object.entries(got).sort()) === JSON.stringify(Object.entries(expected).sort())
        && (!total || total.toString() === '1');
    if (!ok) fail++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${ok ? '' : `\n     expected ${JSON.stringify(expected)}\n     got      ${JSON.stringify(got)} total ${total}`}`);
}
console.log(fail ? `${fail} failed` : `all ${CASES.length} passed`);
process.exit(fail ? 1 : 0);
