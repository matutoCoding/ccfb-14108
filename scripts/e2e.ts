// 端到端冒烟:模拟应用完整业务流(不依赖浏览器 API)
import { generateDive } from '../src/core/generator';
import { analyzeClip, detectEvents, detectApex, detectOpenFrame, forwardKinematics } from '../src/core/analysis';
import { detectAndRepair, markedRanges } from '../src/core/repair';
import { writeBVH, parseBVH } from '../src/core/bvh';
import { writeCSV, parseCSV } from '../src/core/csv';
import { BUILTIN_DIVES, parseDiveCode } from '../src/core/diveCodes';
import { DEFAULT_SETTINGS } from '../src/core/settings';
import { restOffsets } from '../src/core/skeleton';
import { Joint } from '../src/core/types';
import type { Athlete } from '../src/core/types';

const athlete: Athlete = {
  id: 'ath_e2e', name: '冒烟队员', gender: 'female', birthYear: 2007,
  heightCm: 165, armSpanCm: 170, weightKg: 54, team: '测试', createdAt: 0,
};
const settings = structuredClone(DEFAULT_SETTINGS);
let failures = 0;
const ok = (name: string, cond: boolean, extra = '') => {
  if (cond) console.log(`  ✅ ${name} ${extra}`);
  else { failures++; console.log(`  ❌ ${name} ${extra}`); }
};

console.log('=== E2E 1. 三个动作各生成 3 跳,圈数全部精确 ===');
for (const code of ['107B', '205C', '5253B']) {
  const dive = BUILTIN_DIVES.find((d) => d.code === code)!;
  for (let seed = 1; seed <= 3; seed++) {
    const clip = generateDive({
      athlete, dive, sessionId: 's', sampleRate: 240,
      platformHeight: code === '5253B' ? 10 : 3,
      boardType: code === '5253B' ? 'platform' : 'spring', seed,
    });
    const a = analyzeClip(clip, athlete, settings);
    ok(`${code}#${seed} 翻腾`, Math.abs(Math.abs(a.somersaultTurns) - dive.somersaults) < 0.02,
      `${a.somersaultTurns.toFixed(2)} vs ${dive.somersaults}`);
    ok(`${code}#${seed} 转体`, Math.abs(Math.abs(a.twistTurns) - dive.twists) < 0.02,
      `${a.twistTurns.toFixed(2)} vs ${dive.twists}`);
  }
}

console.log('=== E2E 2. 缺陷跳:检测→修复→分析全链路 ===');
{
  const clip = generateDive({
    athlete, dive: BUILTIN_DIVES[0], sessionId: 's', sampleRate: 240,
    platformHeight: 3, boardType: 'spring', seed: 999, injectDefects: true,
  });
  const report = detectAndRepair(clip);
  ok('检测并修复 2 段缺陷', report.repaired.length === 2);
  ok('时间轴标黄区间非空', markedRanges(clip).length === 2);
  // 模拟导入流程:事件识别
  const hipH = athlete.heightCm / 100 * 0.521;
  const ev = detectEvents(clip, 0, 3, hipH, athlete.heightCm / 100 * 0.9);
  clip.takeoffFrame = ev.takeoffFrame; clip.entryFrame = ev.entryFrame;
  clip.apexFrame = detectApex(clip);
  const a = analyzeClip(clip, athlete, settings);
  clip.openFrame = detectOpenFrame(clip, a.metrics, settings);
  ok('离板/入水/打开帧均有效', clip.takeoffFrame > 0 && clip.entryFrame > clip.takeoffFrame && clip.openFrame > 0);
  ok('修复后圈数 3.5', Math.abs(Math.abs(a.somersaultTurns) - 3.5) < 0.05,
    `实测 ${a.somersaultTurns.toFixed(3)}`);
  ok('入水角可计算', Number.isFinite(a.entryAngleDeg) && a.entryAngleDeg >= 0);

  console.log('=== E2E 3. BVH/CSV 导出再导入 ===');
  const dim = { height: 1.65, armSpan: 1.7 };
  const bvhBack = parseBVH(writeBVH(clip, dim), {
    athleteId: athlete.id, diveCode: '107B', sessionId: 's', id: 'b1',
  });
  ok('BVH 再导入帧数一致', bvhBack.clip.frameCount === clip.frameCount);
  ok('BVH 无未解析骨骼', bvhBack.unresolvedBones.length === 0);
  const csvBack = parseCSV(writeCSV(clip), {
    athleteId: athlete.id, diveCode: '107B', sessionId: 's', id: 'c1',
  });
  ok('CSV 再导入帧数一致', csvBack.clip.frameCount === clip.frameCount);

  console.log('=== E2E 4. 三维层数据契约(FK 输出可直接喂 three.js)===');
  const pose = forwardKinematics(clip, clip.entryFrame, dim);
  ok('21 个关节世界坐标', pose.positions.length === 21
    && pose.positions.every((p) => Number.isFinite(p[1])));
  ok('所有世界旋转为单位四元数', pose.rotations.every((q) =>
    Math.abs(Math.hypot(q[0], q[1], q[2], q[3]) - 1) < 1e-4));
  const offsets = restOffsets({ height: 1.65, armSpan: 1.7, weight: 54 });
  ok('骨架偏移参数化(身高变化生效)',
    Math.abs(offsets[Joint.Head][1] - restOffsets({ height: 1.8, armSpan: 1.8, weight: 70 })[Joint.Head][1]) > 1e-4);

  console.log('=== E2E 5. 动作代码解析 ===');
  for (const [code, som, tw] of [['107B', 3.5, 0], ['205C', 2.5, 0], ['5253B', 2.5, 1.5]] as const) {
    const p = parseDiveCode(code)!;
    ok(`${code} 解析`, p.halfSomersault / 2 === som && p.halfTwist / 2 === tw);
  }
}

console.log(`\nE2E 结果:${failures === 0 ? '全部通过 ✅' : `${failures} 项失败 ❌`}`);
if (failures) process.exit(1);
