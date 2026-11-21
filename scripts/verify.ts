// 核心指标验证:tsx scripts/verify.ts
// 教练验收点:107B=3.5 圈翻腾不转体、5253B=2.5 圈+1.5 转体、205C=2.5 圈
import { generateDive } from '../src/core/generator';
import { analyzeClip, detectEvents } from '../src/core/analysis';
import { detectAndRepair } from '../src/core/repair';
import { writeBVH, parseBVH } from '../src/core/bvh';
import { writeCSV, parseCSV } from '../src/core/csv';
import { BUILTIN_DIVES } from '../src/core/diveCodes';
import { Joint } from '../src/core/types';
import type { Athlete, AppSettings, DiveClip } from '../src/core/types';

const settings: AppSettings = {
  sampleRate: 240,
  thresholds: {
    tuckKneeDeg: 75, tuckHipDeg: 95, pikeHipDeg: 120,
    entryVerticalDeg: 15, boardFlexMm: 200,
  },
  boneMaps: {}, activeBoneMap: 'mixamo',
  waterLevelY: 0, comTrailStep: 12, ghostAlpha: 0.35,
};

const athlete: Athlete = {
  id: 'ath_test01', name: '测试队员', gender: 'male', birthYear: 2005,
  heightCm: 172, armSpanCm: 178, weightKg: 62, team: '省队', createdAt: 0,
};

let pass = 0;
let fail = 0;
function check(name: string, cond: boolean, detail = '') {
  if (cond) { pass++; console.log(`  ✅ ${name} ${detail}`); }
  else { fail++; console.log(`  ❌ ${name} ${detail}`); }
}
function approx(a: number, b: number, tol: number): boolean {
  return Math.abs(a - b) <= tol;
}

function gen(code: string, seed = 7, defects = false, height = 3): DiveClip {
  const dive = BUILTIN_DIVES.find((d) => d.code === code)!;
  return generateDive({
    athlete, dive, sessionId: 'sess_test', sampleRate: 240,
    platformHeight: height, boardType: height <= 3 ? 'spring' : 'platform',
    seed, injectDefects: defects,
  });
}

console.log('\n=== 1. 圈数统计(验收硬指标)===');
for (const [code, expSom, expTw] of [
  ['107B', 3.5, 0],
  ['205C', 2.5, 0],
  ['5253B', 2.5, 1.5],
] as const) {
  const clip = gen(code);
  const a = analyzeClip(clip, athlete, settings);
  check(`${code} 翻腾 ${expSom} 圈`, approx(Math.abs(a.somersaultTurns), expSom, 0.03),
    `实测 ${Math.abs(a.somersaultTurns).toFixed(3)}`);
  check(`${code} 转体 ${expTw} 圈`, approx(Math.abs(a.twistTurns), expTw, 0.03),
    `实测 ${Math.abs(a.twistTurns).toFixed(3)}`);
  check(`${code} 入水角 < 12°`, a.entryAngleDeg < 12, `实测 ${a.entryAngleDeg.toFixed(2)}°`);
  check(`${code} 抱紧检测有效`, a.metrics.slice(clip.takeoffFrame, clip.entryFrame).some((m) => m.isTight)
    || code.endsWith('A'), code);
}

console.log('\n=== 2. 多次生成稳定性(不同种子圈数恒定)===');
for (const code of ['107B', '5253B']) {
  const turns = new Set<number>();
  for (let seed = 1; seed <= 5; seed++) {
    const a = analyzeClip(gen(code, seed * 13), athlete, settings);
    turns.add(Number(Math.abs(a.somersaultTurns).toFixed(2)));
  }
  check(`${code} 各种子圈数一致`, turns.size === 1, `取值 ${[...turns].join(',')}`);
}

console.log('\n=== 3. 离板/入水事件识别 ===');
{
  const clip = gen('107B');
  // 模拟外部导入:清掉事件帧后自动识别
  const blind: DiveClip = { ...clip, takeoffFrame: -1, entryFrame: -1, apexFrame: -1, openFrame: -1 };
  const ev = detectEvents(blind, 0, 3, 1.72 * 0.521, 1.72 * 0.9);
  check('离板帧误差 ≤ 3 帧', Math.abs(ev.takeoffFrame - clip.takeoffFrame) <= 3,
    `识别 ${ev.takeoffFrame} / 真值 ${clip.takeoffFrame}`);
  check('入水帧误差 ≤ 3 帧', Math.abs(ev.entryFrame - clip.entryFrame) <= 3,
    `识别 ${ev.entryFrame} / 真值 ${clip.entryFrame}`);
  check('最高点在离板与入水之间', clip.apexFrame > clip.takeoffFrame && clip.apexFrame < clip.entryFrame,
    `apex=${clip.apexFrame}`);
  check('打开帧晚于最高点(ms 差为正)', analyzeClip(clip, athlete, settings).apexToOpenMs > 0);
}

console.log('\n=== 4. 缺陷注入与插值修复 ===');
{
  const clip = gen('107B', 99, true);
  check('检测到 1 段丢帧 + 1 段翻转', clip.defects.length === 2,
    `defects=${clip.defects.map((d) => d.type).join(',')}`);
  const beforeNaN = countNaN(clip);
  check('修复前存在 NaN 空洞', beforeNaN > 0, `${beforeNaN} 个 NaN`);
  const report = detectAndRepair(clip);
  const afterNaN = countNaN(clip);
  check('修复后无 NaN', afterNaN === 0);
  check('修复记录两段', report.repaired.length === 2);
  // 修复后圈数仍然准确
  const a = analyzeClip(clip, athlete, settings);
  check('修复后 107B 圈数仍 = 3.5', approx(Math.abs(a.somersaultTurns), 3.5, 0.05),
    `实测 ${Math.abs(a.somersaultTurns).toFixed(3)}`);
  // 翻转关节连续性:相邻帧点积应恒正
  let badDots = 0;
  for (let f = 1; f < clip.frameCount; f++) {
    const o0 = ((f - 1) * 21 + Joint.LeftForeArm) * 4;
    const o1 = (f * 21 + Joint.LeftForeArm) * 4;
    const dot = clip.localRotations[o0] * clip.localRotations[o1]
      + clip.localRotations[o0 + 3] * clip.localRotations[o1 + 3];
    if (dot < 0) badDots++;
  }
  check('翻转关节相邻帧无反号跳变', badDots === 0, `${badDots} 处`);
}

console.log('\n=== 5. BVH / CSV 往返一致性 ===');
{
  const clip = gen('5253B');
  const dim = { height: 1.72, armSpan: 1.78 };
  const bvh = writeBVH(clip, dim);
  check('BVH 含 HIERARCHY/MOTION', bvh.includes('HIERARCHY') && bvh.includes('MOTION'));
  const back = parseBVH(bvh, {
    athleteId: clip.athleteId, diveCode: clip.diveCode,
    sessionId: clip.sessionId, id: 'roundtrip',
  });
  check('BVH 往返帧数一致', back.clip.frameCount === clip.frameCount);
  check('BVH 采样率 240Hz', back.clip.sampleRate === 240);
  check('BVH 骨骼全部映射(无未解析)', back.unresolvedBones.length === 0,
    back.unresolvedBones.join(','));
  const aBvh = analyzeClip(back.clip, athlete, settings);
  check('BVH 往返翻腾圈数一致', approx(Math.abs(aBvh.somersaultTurns), 2.5, 0.05),
    `实测 ${Math.abs(aBvh.somersaultTurns).toFixed(3)}`);
  check('BVH 往返转体圈数一致', approx(Math.abs(aBvh.twistTurns), 1.5, 0.05),
    `实测 ${Math.abs(aBvh.twistTurns).toFixed(3)}`);

  const csv = writeCSV(clip);
  const csvBack = parseCSV(csv, {
    athleteId: clip.athleteId, diveCode: clip.diveCode,
    sessionId: clip.sessionId, id: 'csvround',
  });
  const aCsv = analyzeClip(csvBack.clip, athlete, settings);
  check('CSV 往返翻腾圈数一致', approx(Math.abs(aCsv.somersaultTurns), 2.5, 0.03));
  check('CSV 往返转体圈数一致', approx(Math.abs(aCsv.twistTurns), 1.5, 0.03));
}

console.log('\n=== 6. 240Hz 体量与帧率预算 ===');
{
  const clip = gen('107B');
  const totalFloats = clip.rootPositions.length + clip.localRotations.length;
  console.log(`  帧数 ${clip.frameCount},单帧 ${(totalFloats / clip.frameCount).toFixed(0)} float,`
    + `总 ${(totalFloats * 4 / 1024).toFixed(1)} KB`);
  check('单跳帧数 > 400(240Hz 约 1.7s+)', clip.frameCount > 400);
}

console.log(`\n结果:${pass} 通过 / ${fail} 失败`);
if (fail > 0) process.exit(1);

function countNaN(c: DiveClip): number {
  let n = 0;
  for (const v of c.rootPositions) if (Number.isNaN(v)) n++;
  for (const v of c.localRotations) if (Number.isNaN(v)) n++;
  return n;
}
