// 数据缺陷检测与修复:丢帧段落插值、关节翻转(w 符号跳变)校正,段落标黄
import { Joint, JOINT_COUNT } from './types';
import type { DiveClip, ClipDefect } from './types';
import { qNormalize, qSlerp, vLerp } from './math3d';
import type { Quat, Vec3 } from './math3d';

export interface RepairReport {
  detected: ClipDefect[];
  repaired: ClipDefect[];
}

/**
 * 扫描并修复整段片段:
 * 1) 检测 NaN 空洞(丢帧)与四元数反号(关节翻转)
 * 2) 丢帧:根位置线性插值,关节旋转球面插值
 * 3) 翻转:把异常段落的四元数双号校正回连续表示后再平滑
 * 不修改原始缺陷标记;修复段落写入 repaired,时间轴据此标黄
 */
export function detectAndRepair(clip: DiveClip): RepairReport {
  const detected: ClipDefect[] = [];
  const n = clip.frameCount;

  // —— 1. 丢帧检测:任意 NaN 即视为空洞,合并相邻帧为段落 ——
  let dropStart = -1;
  const pushDrop = (start: number, end: number) => {
    if (!detected.some((d) => d.type === 'drop' && d.startFrame === start)) {
      detected.push({ type: 'drop', jointId: -1, startFrame: start, endFrame: end });
    }
  };
  for (let f = 0; f < n; f++) {
    const bad = Number.isNaN(clip.rootPositions[f * 3 + 1])
      || Number.isNaN(clip.localRotations[f * JOINT_COUNT * 4 + 3]);
    if (bad && dropStart < 0) dropStart = f;
    if (!bad && dropStart >= 0) { pushDrop(dropStart, f - 1); dropStart = -1; }
  }
  if (dropStart >= 0) pushDrop(dropStart, n - 1);
  const dropRanges = detected.filter((d) => d.type === 'drop');
  const inDrop = (f: number) => dropRanges.some((d) => f >= d.startFrame && f <= d.endFrame);

  // —— 2. 关节翻转检测:相邻有效帧点积 < 0(跳过丢帧空洞),反号边界合并为区间 ——
  for (let j = 0; j < JOINT_COUNT; j++) {
    const signFlipFrames: number[] = [];
    for (let f = 1; f < n; f++) {
      if (inDrop(f) || inDrop(f - 1)) continue;
      const a = readQ(clip, f - 1, j);
      const b = readQ(clip, f, j);
      if (!isFiniteQ(a) || !isFiniteQ(b)) continue;
      const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
      if (dot < 0) signFlipFrames.push(f);
    }
    // 间隔 ≤12 帧的反号点属于同一次翻转事件(注入式整段反号只在首尾跳号,
    // 中间帧点积为正,靠该阈值把两端边界合并成一个完整区间)
    let run: number[] = [];
    const flush = () => {
      if (run.length) {
        const start = Math.max(0, run[0] - 1);
        const end = run[run.length - 1];
        detected.push({ type: 'flip', jointId: j, startFrame: start, endFrame: end });
        run = [];
      }
    };
    for (const f of signFlipFrames) {
      if (run.length && f - run[run.length - 1] > 12) flush();
      run.push(f);
    }
    flush();
  }

  // —— 3. 执行修复:先丢帧(消除 NaN),再翻转 ——
  const repaired: ClipDefect[] = [];
  for (const d of detected.filter((x) => x.type === 'drop')) {
    repairDrop(clip, d);
    repaired.push({ ...d });
  }
  for (const d of detected.filter((x) => x.type === 'flip')) {
    repairFlip(clip, d);
    repaired.push({ ...d });
  }
  clip.defects = detected;
  clip.repaired = repaired;
  return { detected, repaired };
}

function repairFlip(clip: DiveClip, d: ClipDefect): void {
  const prev = findFiniteFrame(clip, d.startFrame - 1, -1);
  if (prev < 0) return;
  const next = findFiniteFrame(clip, d.endFrame + 1, 1);
  for (let f = d.startFrame; f <= d.endFrame; f++) {
    const q = readQ(clip, f, d.jointId);
    if (!isFiniteQ(q)) continue;
    const p = readQ(clip, f - 1, d.jointId);
    if (isFiniteQ(p)) {
      const dot = p[0] * q[0] + p[1] * q[1] + p[2] * q[2] + p[3] * q[3];
      if (dot < 0) writeQ(clip, f, d.jointId, qNormalize([-q[0], -q[1], -q[2], -q[3]]));
    }
  }
  // 边界再做一次 slerp 平滑,消除残余抖动
  if (next > d.endFrame) {
    const span = next - prev;
    for (let f = prev + 1; f < next; f++) {
      const t = (f - prev) / span;
      writeQ(clip, f, d.jointId, qSlerp(readQ(clip, prev, d.jointId), readQ(clip, next, d.jointId), t));
    }
  }
}

function repairDrop(clip: DiveClip, d: ClipDefect): void {
  const prev = findFiniteFrame(clip, d.startFrame - 1, -1);
  const next = findFiniteFrame(clip, d.endFrame + 1, 1);
  if (prev < 0 || next < 0) return; // 片段边缘无法插值
  const span = next - prev;
  for (let f = prev + 1; f < next; f++) {
    const t = (f - prev) / span;
    // 根位置线性插值
    const p0 = readPos(clip, prev);
    const p1 = readPos(clip, next);
    const p = vLerp(p0, p1, t);
    clip.rootPositions[f * 3] = p[0];
    clip.rootPositions[f * 3 + 1] = p[1];
    clip.rootPositions[f * 3 + 2] = p[2];
    // 关节旋转 slerp
    for (let j = 0; j < JOINT_COUNT; j++) {
      writeQ(clip, f, j, qSlerp(readQ(clip, prev, j), readQ(clip, next, j), t));
    }
  }
}

function findFiniteFrame(clip: DiveClip, from: number, dir: -1 | 1): number {
  for (let f = from; f >= 0 && f < clip.frameCount; f += dir) {
    if (!Number.isNaN(clip.rootPositions[f * 3 + 1])
      && !Number.isNaN(clip.localRotations[f * JOINT_COUNT * 4 + 3])) return f;
  }
  return -1;
}

function readQ(clip: DiveClip, f: number, j: number): Quat {
  const o = (f * JOINT_COUNT + j) * 4;
  return [
    clip.localRotations[o], clip.localRotations[o + 1],
    clip.localRotations[o + 2], clip.localRotations[o + 3],
  ];
}
function writeQ(clip: DiveClip, f: number, j: number, q: Quat): void {
  const o = (f * JOINT_COUNT + j) * 4;
  clip.localRotations[o] = q[0]; clip.localRotations[o + 1] = q[1];
  clip.localRotations[o + 2] = q[2]; clip.localRotations[o + 3] = q[3];
}
function readPos(clip: DiveClip, f: number): Vec3 {
  return [
    clip.rootPositions[f * 3],
    clip.rootPositions[f * 3 + 1],
    clip.rootPositions[f * 3 + 2],
  ];
}
function isFiniteQ(q: Quat): boolean {
  return Number.isFinite(q[0]) && Number.isFinite(q[3]);
}

/** 时间轴上的缺陷/修复区间(合并视图) */
export function markedRanges(clip: DiveClip): Array<{ start: number; end: number; label: string; kind: 'drop' | 'flip' }> {
  return clip.repaired.map((d) => ({
    start: d.startFrame,
    end: d.endFrame,
    label: d.type === 'drop' ? `丢帧 ${d.endFrame - d.startFrame + 1}帧(已插值)` : '关节翻转(已校正)',
    kind: d.type,
  }));
}

export { Joint };
