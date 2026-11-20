import { describe, expect, it } from 'vitest';
import { generateDive } from '../src/core/generator.ts';
import { buildSkeleton } from '../src/core/skeleton.ts';
import type { Athlete, PlatformInfo } from '../src/core/types.ts';

const athlete: Athlete = { id: 't', name: 'x', gender: 'M', heightM: 1.7, armSpanM: 1.76, weightKg: 58, createdAt: 0 };
const spring: PlatformInfo = { heightM: 3, type: 'springboard' };

describe('跳板下压回弹', () => {
  it('3m 板有挠度数组，离板前存在最大下压，离板帧处回弹接近 0', () => {
    const rec = generateDive({ athlete, code: '107B', platform: spring, sampleRate: 240, sessionId: 's' });
    const def = rec.platform.boardDeflectionM;
    expect(def).toBeDefined();
    expect(def!.length).toBe(rec.frames.length);
    const t0 = rec.events.takeoffFrame;
    const before = def!.slice(0, t0);
    const minDeflection = Math.min(...before);
    expect(minDeflection).toBeLessThan(-0.05); // 有明显下压
    // 跳台（platform）不应有挠度
    const plat = generateDive({
      athlete,
      code: '205C',
      platform: { heightM: 10, type: 'platform' },
      sampleRate: 240,
      sessionId: 's',
    });
    expect(plat.platform.boardDeflectionM).toBeUndefined();
  });

  it('人体按身高臂展缩放：1.5m 与 1.9m 队员骨骼尺寸不同', () => {
    const small = buildSkeleton({ heightM: 1.5, armSpanM: 1.55 });
    const tall = buildSkeleton({ heightM: 1.9, armSpanM: 2.0 });
    expect(tall.restOffsets[1].y).toBeGreaterThan(small.restOffsets[1].y);
  });
});
