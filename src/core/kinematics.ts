// 运动学：正运动学、质心、关节角、翻腾/转体累计、入水指标
import type { AngleThresholds, FrameMetrics, MoCapRecord, Quat, SkeletonFrame, Vec3 } from './types';
import { ANGLE_CHAINS, JOINT_INDEX, type SkeletonSpec } from './skeleton';
import { angleBetween, q, quat, rad2deg, v, vec } from './math';

export interface WorldPose {
  positions: Vec3[];
  quats: Quat[];
}

/** 单帧正运动学：局部旋转 -> 世界坐标 */
export function computeWorlds(frame: SkeletonFrame, spec: SkeletonSpec): WorldPose {
  const n = spec.joints.length;
  const positions: Vec3[] = new Array(n);
  const quats: Quat[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const parent = spec.parents[i];
    const local = frame.rotations[i] ?? q();
    if (parent < 0) {
      positions[i] = { ...frame.rootPosition };
      quats[i] = quat.norm(local);
    } else {
      quats[i] = quat.norm(quat.mul(quats[parent], local));
      positions[i] = vec.add(positions[parent], quat.rotateVec(quats[parent], spec.restOffsets[i]));
    }
  }
  return { positions, quats };
}

/** 全身质心：各质量段质心按体重占比加权 */
export function computeCOM(pose: WorldPose, spec: SkeletonSpec): Vec3 {
  let sum = v();
  let total = 0;
  for (const [jointIdStr, mass] of Object.entries(spec.massFraction)) {
    const jointId = Number(jointIdStr);
    const parent = spec.parents[jointId];
    const frac = spec.comFraction[jointId] ?? 0.5;
    const center =
      parent < 0
        ? pose.positions[jointId]
        : vec.lerp(pose.positions[parent], pose.positions[jointId], frac);
    sum = vec.add(sum, vec.scale(center, mass));
    total += mass;
  }
  return vec.scale(sum, 1 / total);
}

function chainAngle(chain: readonly number[], positions: Vec3[]): number {
  const [a, b, c] = chain;
  return angleBetween(vec.sub(positions[a], positions[b]), vec.sub(positions[c], positions[b]));
}

/** 身体纵轴（髋 -> 头）单位向量 */
export function bodyLongAxis(pose: WorldPose): Vec3 {
  return vec.norm(vec.sub(pose.positions[JOINT_INDEX.Head], pose.positions[JOINT_INDEX.Hips]));
}

/** 两帧根姿态间的世界系角速度 rad/s（有限旋转向量 / dt） */
function angularVelocity(qFrom: Quat, qTo: Quat, dt: number): Vec3 {
  let d = quat.delta(qFrom, qTo);
  // 四元数双覆盖：w<0 时取等价的 -d，保证走短路径（|角| ≤ π），方向才连续
  if (d.w < 0) d = { x: -d.x, y: -d.y, z: -d.z, w: -d.w };
  const w = Math.min(1, Math.max(-1, d.w));
  let angle = 2 * Math.acos(w);
  let s = Math.sqrt(1 - w * w);
  if (s < 1e-9) {
    // 角度极小时用 sin(angle/2) ≈ angle/2 展开，避免除零
    angle = 2 * Math.hypot(d.x, d.y, d.z);
    s = Math.max(1e-9, angle / 2);
  }
  const k = angle / (s * dt);
  return v(d.x * k, d.y * k, d.z * k);
}

export interface AnalysisResult {
  metrics: FrameMetrics[];
  /** 入水角（度，0 = 完全垂直） */
  entryAngleDeg: number;
  /** 手掌先入水点（取较低一侧手）相对骨盆入水点的偏移 m */
  handEntryOffset: Vec3;
  /** 总翻腾周数（带符号） */
  totalSomersaults: number;
  /** 总转体周数（带符号） */
  totalTwists: number;
  /** 抱紧帧数占比 */
  tightRatio: number;
}

const DOWN: Vec3 = { x: 0, y: -1, z: 0 };

export function analyzeRecord(
  record: MoCapRecord,
  spec: SkeletonSpec,
  thresholds: AngleThresholds,
): AnalysisResult {
  const dt = 1 / record.sampleRate;
  const count = record.frames.length;
  const poses: WorldPose[] = record.frames.map((f) => computeWorlds(f, spec));
  const coms = poses.map((p) => computeCOM(p, spec));

  // ---- 翻腾/转体：根姿态逐帧差分 -> 世界系角速度，按轴积分 ----
  // 翻腾轴 = 固定世界 Z（侧向轴）；转体轴 = 根坐标系纵轴（世界朝向，随翻腾转动）。
  // 该分解不依赖头/髋等关节位置，团身屈体改变外形时不会污染圈数。
  const somCum: number[] = new Array(count).fill(0);
  const twistCum: number[] = new Array(count).fill(0);
  const somVelArr: number[] = new Array(count).fill(0);
  const twistVelArr: number[] = new Array(count).fill(0);
  for (let i = 1; i < count; i++) {
    const omega = angularVelocity(poses[i - 1].quats[0], poses[i].quats[0], dt);
    // 转体轴取帧间中点姿态的根 Y 轴（旋转复合链法则：在增量所在的中点体坐标系内分解）
    const midQ = quat.slerp(poses[i - 1].quats[0], poses[i].quats[0], 0.5);
    const bodyAxisY = quat.rotateVec(midQ, v(0, 1, 0));
    const somRate = omega.z;
    const twistRate = vec.dot(omega, bodyAxisY);
    somVelArr[i] = somRate;
    twistVelArr[i] = twistRate;
    somCum[i] = somCum[i - 1] + somRate * dt;
    twistCum[i] = twistCum[i - 1] + twistRate * dt;
  }

  const metrics: FrameMetrics[] = [];
  let tightCount = 0;
  for (let i = 0; i < count; i++) {
    const p = poses[i];
    const hipL = chainAngle(ANGLE_CHAINS.hipL, p.positions);
    const hipR = chainAngle(ANGLE_CHAINS.hipR, p.positions);
    const kneeL = chainAngle(ANGLE_CHAINS.kneeL, p.positions);
    const kneeR = chainAngle(ANGLE_CHAINS.kneeR, p.positions);
    const elbowL = chainAngle(ANGLE_CHAINS.elbowL, p.positions);
    const elbowR = chainAngle(ANGLE_CHAINS.elbowR, p.positions);
    const shoulderL = chainAngle(ANGLE_CHAINS.shoulderL, p.positions);
    const shoulderR = chainAngle(ANGLE_CHAINS.shoulderR, p.positions);

    const hipMin = Math.min(hipL, hipR);
    const kneeMin = Math.min(kneeL, kneeR);
    const tight = hipMin < thresholds.tuckHipDeg && kneeMin < thresholds.tuckKneeDeg;
    if (tight) tightCount++;

    const prev = coms[Math.max(0, i - 1)];
    const next = coms[Math.min(count - 1, i + 1)];
    const comVelocity = vec.scale(vec.sub(next, prev), 1 / (2 * dt));

    const dSom = somVelArr[i];
    const dTwist = twistVelArr[i];

    metrics.push({
      frame: i,
      t: record.frames[i].t,
      com: coms[i],
      comVelocity,
      somersaultAngle: somCum[i],
      twistAngle: twistCum[i],
      somersaultVel: dSom,
      twistVel: dTwist,
      pelvisQuat: poses[i].quats[0],
      hipL, hipR, kneeL, kneeR, elbowL, elbowR, shoulderL, shoulderR,
      tight,
    });
  }

  // ---- 入水指标 ----
  const e = Math.min(record.events.entryFrame, count - 1);
  const entryPose = poses[e];
  const entryAxis = bodyLongAxis(entryPose);
  const entryAngleDeg = angleBetween(entryAxis, DOWN);

  const handL = entryPose.positions[JOINT_INDEX.LeftHand];
  const handR = entryPose.positions[JOINT_INDEX.RightHand];
  const firstHand = handL.y <= handR.y ? handL : handR;
  const pelvisEntry = entryPose.positions[JOINT_INDEX.Hips];
  const handEntryOffset: Vec3 = {
    x: firstHand.x - pelvisEntry.x,
    y: firstHand.y - pelvisEntry.y,
    z: firstHand.z - pelvisEntry.z,
  };
  metrics[e].entryAngleDeg = entryAngleDeg;
  metrics[e].handEntryOffset = handEntryOffset;

  const flight = metrics.slice(record.events.takeoffFrame, e + 1);
  const totalSomersaults =
    (flight[flight.length - 1].somersaultAngle - flight[0].somersaultAngle) / (2 * Math.PI);
  const totalTwists =
    (flight[flight.length - 1].twistAngle - flight[0].twistAngle) / (2 * Math.PI);

  return {
    metrics,
    entryAngleDeg,
    handEntryOffset,
    totalSomersaults,
    totalTwists,
    tightRatio: flight.length ? tightCount / flight.length : 0,
  };
}

/** 找出 COM 最高点帧（离板与入水之间） */
export function findApexFrame(metrics: FrameMetrics[], takeoff: number, entry: number): number {
  let best = takeoff;
  for (let i = takeoff; i <= entry; i++) {
    if (metrics[i].com.y > metrics[best].com.y) best = i;
  }
  return best;
}

/** 打开帧：团身/屈体状态结束、身体重新伸直的首帧（髋角重新超过阈值） */
export function findOpenFrame(
  metrics: FrameMetrics[],
  takeoff: number,
  apex: number,
  thresholds: AngleThresholds,
): number {
  // 先找到空中最紧的时刻，再向后找髋膝同时打开的第一帧
  let tightest = takeoff;
  let minHip = Infinity;
  for (let i = takeoff; i < metrics.length; i++) {
    const m = metrics[i];
    if (m.hipL < minHip) {
      minHip = m.hipL;
      tightest = i;
    }
  }
  for (let i = tightest; i < metrics.length; i++) {
    const m = metrics[i];
    if (m.hipL > thresholds.pikeHipDeg && m.kneeL > thresholds.tuckKneeDeg + 40) return i;
  }
  return apex;
}
