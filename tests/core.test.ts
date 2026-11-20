import { describe, expect, it } from 'vitest';
import { parseDiveCode, difficultyOf } from '../src/core/settings';
import { generateDive } from '../src/core/generator';
import { buildSkeleton } from '../src/core/skeleton';
import { analyzeRecord, findApexFrame } from '../src/core/kinematics';
import { DEFAULT_SETTINGS } from '../src/core/settings';
import { exportBvh, importBvh, exportCsv, importCsv } from '../src/core/io';
import type { Athlete, PlatformInfo } from '../src/core/types';

const athlete: Athlete = {
  id: 't1',
  name: '测试员',
  gender: 'M',
  heightM: 1.7,
  armSpanM: 1.76,
  weightKg: 58,
  createdAt: 0,
};
const spec = buildSkeleton(athlete);
const spring: PlatformInfo = { heightM: 3, type: 'springboard' };
const platform: PlatformInfo = { heightM: 10, type: 'platform' };
const thr = DEFAULT_SETTINGS.thresholds;

function gen(code: string, pf: PlatformInfo, corrupt = false) {
  return generateDive({ athlete, code, platform: pf, sampleRate: 240, sessionId: 's', corrupt });
}

describe('动作代码解析', () => {
  it('107B = 3.5 周翻腾屈体、无转体', () => {
    const d = parseDiveCode('107b');
    expect(d.somersaults).toBe(3.5);
    expect(d.twists).toBe(0);
    expect(d.position).toBe('B');
    expect(d.group).toBe(1);
  });
  it('5253B = 2.5 周翻腾 + 1.5 周转体', () => {
    const d = parseDiveCode('5253B');
    expect(d.somersaults).toBe(2.5);
    expect(d.twists).toBe(1.5);
    expect(d.group).toBe(5);
  });
  it('205C 难度系数取表值 2.8', () => {
    expect(difficultyOf('205C')).toBe(2.8);
  });
  it('非法代码抛错', () => {
    expect(() => parseDiveCode('99X')).toThrow();
  });
});

describe('圈数累计（核心验收）', () => {
  it('107B 累计翻腾 3.5 圈、转体 0 圈（误差 <0.08 圈）', () => {
    const rec = gen('107B', spring);
    const a = analyzeRecord(rec, spec, thr);
    expect(Math.abs(a.totalSomersaults - 3.5)).toBeLessThan(0.08);
    expect(Math.abs(a.totalTwists)).toBeLessThan(0.05);
  });

  it('205C 累计翻腾 2.5 圈（后翻符号为负）、转体 0', () => {
    const rec = gen('205C', platform);
    const a = analyzeRecord(rec, spec, thr);
    expect(Math.abs(Math.abs(a.totalSomersaults) - 2.5)).toBeLessThan(0.08);
    expect(a.totalSomersaults).toBeLessThan(0);
    expect(Math.abs(a.totalTwists)).toBeLessThan(0.05);
  });

  it('5253B 翻腾 2.5 圈且转体 1.5 圈', () => {
    const rec = gen('5253B', platform);
    const a = analyzeRecord(rec, spec, thr);
    expect(Math.abs(Math.abs(a.totalSomersaults) - 2.5)).toBeLessThan(0.1);
    expect(Math.abs(Math.abs(a.totalTwists) - 1.5)).toBeLessThan(0.1);
  });

  it('105B = 2.5 圈、305B = 2.5 圈、5152B = 2.5 圈 + 1 转体', () => {
    for (const [code, som, tw] of [
      ['105B', 2.5, 0],
      ['305B', 2.5, 0],
      ['5152B', 2.5, 1],
    ] as const) {
      const rec = gen(code, platform);
      const a = analyzeRecord(rec, spec, thr);
      expect(Math.abs(Math.abs(a.totalSomersaults) - som)).toBeLessThan(0.1);
      expect(Math.abs(Math.abs(a.totalTwists) - tw)).toBeLessThan(0.1);
    }
  });
});

describe('离板与事件对齐', () => {
  it('离板帧处根 Y 高于板顶且速度向上，入水帧处根 Y 接近水面', () => {
    const rec = gen('107B', spring);
    const { takeoffFrame, entryFrame } = rec.events;
    const dt = 1 / rec.sampleRate;
    const vy =
      (rec.frames[takeoffFrame + 1].rootPosition.y -
        rec.frames[takeoffFrame - 1].rootPosition.y) /
      (2 * dt);
    expect(rec.frames[takeoffFrame].rootPosition.y).toBeGreaterThan(3.05);
    expect(vy).toBeGreaterThan(0.5);
    expect(Math.abs(rec.frames[entryFrame].rootPosition.y)).toBeLessThan(0.15);
  });

  it('最高点帧落在离板与入水之间且为质心最大高度', () => {
    const rec = gen('107B', spring);
    const a = analyzeRecord(rec, spec, thr);
    const apex = findApexFrame(a.metrics, rec.events.takeoffFrame, rec.events.entryFrame);
    expect(apex).toBeGreaterThan(rec.events.takeoffFrame);
    expect(apex).toBeLessThan(rec.events.entryFrame);
    expect(a.metrics[apex].com.y).toBeGreaterThanOrEqual(
      a.metrics[rec.events.takeoffFrame].com.y,
    );
  });

  it('240Hz 时间戳严格等间隔（无重复帧/无倒退）', () => {
    const rec = gen('107B', spring);
    const dt = 1 / 240;
    for (let i = 1; i < rec.frames.length; i++) {
      expect(rec.frames[i].t - rec.frames[i - 1].t).toBeCloseTo(dt, 6);
    }
  });
});

describe('丢帧与关节翻转修复', () => {
  it('损坏跳被检出并修复，时间戳恢复等间隔，圈数仍为 3.5 圈', () => {
    const rec = gen('107B', spring, true);
    expect(rec.repaired).toBe(true);
    expect(rec.quality.some((q2) => q2.kind === 'dropped')).toBe(true);
    expect(rec.quality.some((q2) => q2.kind === 'flip')).toBe(true);
    const dt = 1 / 240;
    for (let i = 1; i < rec.frames.length; i++) {
      expect(rec.frames[i].t - rec.frames[i - 1].t).toBeCloseTo(dt, 6);
    }
    const a = analyzeRecord(rec, spec, thr);
    expect(Math.abs(a.totalSomersaults - 3.5)).toBeLessThan(0.12);
  });
});

describe('BVH / CSV 往返', () => {
  it('导出再导入 BVH，圈数保持 3.5 圈', () => {
    const rec = gen('107B', spring);
    const text = exportBvh(rec, spec);
    const back = importBvh(text, {
      athlete,
      sessionId: 's',
      diveCode: '107B',
      platform: spring,
      source: 'bvh',
    });
    const a = analyzeRecord(back, buildSkeleton(athlete), thr);
    expect(Math.abs(Math.abs(a.totalSomersaults) - 3.5)).toBeLessThan(0.2);
  });

  it('CSV 往返圈数保持 2.5 圈', () => {
    const rec = gen('205C', platform);
    const text = exportCsv(rec, spec);
    const back = importCsv(text, {
      athlete,
      sessionId: 's',
      diveCode: '205C',
      platform,
      source: 'csv',
    });
    const a = analyzeRecord(back, spec, thr);
    expect(Math.abs(Math.abs(a.totalSomersaults) - 2.5)).toBeLessThan(0.1);
  });
});
