// 数据修复管线与事件检测：丢帧补插值、关节翻转检测修复、离板/入水/最高点/打开
import type { MoCapRecord, QualitySegment, SkeletonFrame } from './types';
import type { SkeletonSpec } from './skeleton';
import { JOINT_INDEX } from './skeleton';
import { analyzeRecord, findApexFrame, findOpenFrame } from './kinematics';
import { q, quat, uid, vec } from './math';
import { DEFAULT_SETTINGS } from './settings';

const FLIP_ANGLE = (120 * Math.PI) / 180;

/** 两四元数之间的旋转角（度） */
function quatAngleDeg(a: SkeletonFrame['rotations'][number], b: typeof a): number {
  const d = quat.delta(a, b);
  return (2 * Math.acos(Math.min(1, Math.abs(d.w))) * 180) / Math.PI;
}

/**
 * 1. 丢帧：时间戳相对采样率出现断层 -> 用 SLERP/线性插值补齐缺失帧
 * 2. 关节翻转：相邻帧某关节旋转跳变 > 120° -> 标记并用前后有效帧插值修复
 * 返回同一份 record（就地处理 + 质量段落）。
 */
export function detectAndRepair(record: MoCapRecord, spec: SkeletonSpec): MoCapRecord {
  const quality: QualitySegment[] = [];
  const dt = 1 / record.sampleRate;

  // ---------- 丢帧修复 ----------
  const filled: SkeletonFrame[] = [];
  for (let i = 0; i < record.frames.length; i++) {
    filled.push(record.frames[i]);
    const cur = record.frames[i];
    const nxt = record.frames[i + 1];
    if (!nxt) continue;
    const gap = Math.round((nxt.t - cur.t) / dt) - 1;
    if (gap >= 1 && gap < 60) {
      for (let k = 1; k <= gap; k++) {
        const alpha = k / (gap + 1);
        filled.push({
          t: cur.t + alpha * (nxt.t - cur.t),
          frame: filled.length,
          rootPosition: vec.lerp(cur.rootPosition, nxt.rootPosition, alpha),
          rotations: cur.rotations.map((rq, j) =>
            quat.slerp(rq, nxt.rotations[j] ?? q(), alpha),
          ),
        });
      }
      quality.push({
        startFrame: cur.frame,
        endFrame: nxt.frame,
        kind: 'dropped',
        repaired: true,
        note: `检测到 ${gap} 帧缺失（时间断层），已球面插值补齐`,
      });
    }
  }
  filled.forEach((f, i) => (f.frame = i));
  record.frames = filled;

  // ---------- 关节翻转检测与修复 ----------
  const nJoints = spec.joints.length;
  for (let j = 1; j < nJoints; j++) {
    let runStart = -1;
    for (let i = 1; i < filled.length; i++) {
      const jump = quatAngleDeg(filled[i - 1].rotations[j], filled[i].rotations[j]);
      if (jump > 120) {
        if (runStart < 0) runStart = i;
      } else if (runStart >= 0) {
        repairFlip(filled, j, runStart - 1, i);
        quality.push({
          startFrame: runStart,
          endFrame: i - 1,
          kind: 'flip',
          jointId: j,
          repaired: true,
          note: `${spec.joints[j]} 在第 ${runStart}-${i - 1} 帧角度跳变 >120°，疑似关节翻转，已插值修复`,
        });
        runStart = -1;
      }
    }
    if (runStart >= 0) {
      repairFlip(filled, j, runStart - 1, filled.length - 1);
      quality.push({
        startFrame: runStart,
        endFrame: filled.length - 1,
        kind: 'flip',
        jointId: j,
        repaired: true,
        note: `${spec.joints[j]} 末端翻转段落，已外推修复`,
      });
    }
  }

  record.quality = quality;
  record.repaired = quality.length > 0;
  record.frameCount = filled.length;

  // ---------- 事件检测 ----------
  detectEvents(record, spec);
  return record;
}

function repairFlip(frames: SkeletonFrame[], joint: number, a: number, b: number): void {
  const safeA = Math.max(0, a);
  const safeB = Math.min(frames.length - 1, b);
  const qa = frames[safeA].rotations[joint];
  const qb = frames[safeB].rotations[joint];
  const span = Math.max(1, safeB - safeA);
  for (let i = safeA + 1; i < safeB; i++) {
    frames[i].rotations[joint] = quat.slerp(qa, qb, (i - safeA) / span);
  }
}

/**
 * 离板：根 Y 速度由负/零转正后，板的接触段结束（根位置高于板顶 + 5cm 且垂直速度向上）
 * 入水：飞行段中根 Y 首次下穿水面(y<=0)的帧；质心兜底
 */
export function detectEvents(record: MoCapRecord, spec: SkeletonSpec): void {
  const frames = record.frames;
  const dt = 1 / record.sampleRate;
  const boardTop = record.platform.heightM;

  let takeoff = 0;
  for (let i = 2; i < frames.length; i++) {
    const vy = (frames[i].rootPosition.y - frames[i - 2].rootPosition.y) / (2 * dt);
    if (frames[i].rootPosition.y > boardTop + 0.05 && vy > 0.5) {
      takeoff = i;
      break;
    }
  }

  let entry = frames.length - 1;
  for (let i = takeoff + 1; i < frames.length; i++) {
    if (frames[i].rootPosition.y <= 0) {
      entry = i;
      break;
    }
  }

  const analysis = analyzeRecord(record, spec, DEFAULT_SETTINGS.thresholds);
  const apex = findApexFrame(analysis.metrics, takeoff, entry);
  const open = findOpenFrame(analysis.metrics, takeoff, apex, DEFAULT_SETTINGS.thresholds);

  record.events = { takeoffFrame: takeoff, apexFrame: apex, openFrame: open, entryFrame: entry };
}

/** 时间轴手动拖动事件后重算派生事件（最高点/打开仍可独立手改，这里只做联动兜底） */
export function refreshDerivedEvents(record: MoCapRecord, spec: SkeletonSpec): MoCapRecord {
  const analysis = analyzeRecord(record, spec, DEFAULT_SETTINGS.thresholds);
  const { takeoffFrame, entryFrame } = record.events;
  record.events.apexFrame = findApexFrame(analysis.metrics, takeoffFrame, entryFrame);
  record.events.openFrame = findOpenFrame(
    analysis.metrics,
    takeoffFrame,
    record.events.apexFrame,
    DEFAULT_SETTINGS.thresholds,
  );
  return record;
}

export function newRecordId(): string {
  return uid('rec_');
}

export { FLIP_ANGLE, JOINT_INDEX };
