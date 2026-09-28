import assert from 'node:assert/strict';
import { posture, sampleTransition } from '../js/apps/sholat/mosque-scene.js';
import { POSES } from '../js/apps/sholat/peraga-3d.js';

// Regression: the next queued RAF can be older than the click/start timestamp.
// The previous implementation indexed path[-1], threw, and never scheduled again.
const from = posture(POSES[0]);
const to = posture(POSES[1]);
for (const elapsed of [-100, -1, 0, 1, 849, 850, 9999]) {
    const result = sampleTransition([from, to], elapsed, 850);
    for (const value of Object.values(result.pose)) {
        if (Array.isArray(value)) assert(value.every(Number.isFinite));
        else if (typeof value === 'number') assert(Number.isFinite(value));
    }
    assert.equal(result.complete, elapsed >= 850);
    if (elapsed <= 0) assert.deepEqual(result.pose.hip, from.hip);
    if (elapsed >= 850) assert.deepEqual(result.pose.wristR, to.wristR);
}
for (const pose of POSES.filter(p => p.id.startsWith('itidal'))) {
    assert.equal(pose.arms, 'down');
    assert.equal(pose.via.arms, 'takbir', 'Hands still raise when rising from rukuk');
    const target = posture(pose);
    assert(target.wristR[1] < target.chest[1] - .45);
    assert(target.wristL[1] < target.chest[1] - .45);
}
console.log('PASS: early RAF timestamps, transition boundaries, both itidal poses');
