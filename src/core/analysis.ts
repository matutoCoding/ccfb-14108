// 前向运动学 + 动作分析:圈数累计、关节角、重心、入水指标
import { Joint, JOINT_COUNT } from './types';
import type { DiveClip, FrameMetrics, DiveAnalysis, Athlete, AppSettings } from './types';
import { JOINT_PARENT, JOINT_MASS_WEIGHTS, restOffsets } from './skeleton';
import {
  qMultiply, qRotateVec, qInverse, qFromAxisAngle, vAdd, vScale, vNormalize, vSub, vAngleDeg,
  unwrap, rad2deg, clamp,
} from './math3d';
import type { Quat, Vec3 } from './math3d';

export interface WorldPose {
  positions: Vec3[];   // 每个关节的世界坐标
  rotations: Quat[];   // 每个关节的世界旋转
}

function readLocal(clip: DiveClip, frame: number, joint: number): Quat {
  const o = (frame * JOINT_COUNT + joint) * 4;
  return [
    clip.localRotations[o],
    clip.localRotations[o + 1],
    clip.localRotations[o + 2],
    clip.localRotations[o + 3],
  ];
}

/** 单帧前向运动学:局部旋转 -> 世界变换 */
export function forwardKinematics(clip: DiveClip, frame: number, dim: { height: number; armSpan: number }): WorldPose {
  const offsets = restOffsets({ height: dim.height, armSpan: dim.armSpan, weight: 0 });
  const positions: Vec3[] = new Array(JOINT_COUNT);
  const rotations: Quat[] = new Array(JOINT_COUNT);
  for (let j = 0; j < JOINT_COUNT; j++) {
    const parent = JOINT_PARENT[j];
    const localQ = readLocal(clip, clamp(frame, 0, clip.frameCount - 1), j);
    if (parent < 0) {
      const r = clip.takeoffFrame >= 0 ? frame : frame;
      void r;
      positions[j] = [
        clip.rootPositions[frame * 3],
        clip.rootPositions[frame * 3 + 1],
        clip.rootPositions[frame * 3 + 2],
      ];
      rotations[j] = localQ;
    } else {
      rotations[j] = qMultiply(rotations[parent], localQ);
      positions[j] = vAdd(positions[parent], qRotateVec(rotations[parent], offsets[j]));
    }
  }
  return { positions, rotations };
}

const UP: Vec3 = [0, 1, 0];

/** 计算整跳的逐帧指标(圈数按骨盆朝向实时累计) */
export function analyzeClip(
  clip: DiveClip,
  athlete: Athlete,
  settings: AppSettings,
): DiveAnalysis {
  const dim = { height: athlete.heightCm / 100, armSpan: athlete.armSpanCm / 100 };
  const metrics: FrameMetrics[] = [];
  const dt = 1 / clip.sampleRate;

  // 起跳前朝向(板上静止段的骨盆 yaw),解析时先剔除
  const baseFrame = clamp(clip.takeoffFrame > 0 ? clip.takeoffFrame - 2 : 0, 0, clip.frameCount - 1);
  const baseYawQ = forwardKinematics(clip, baseFrame, dim).rotations[Joint.Hips];
  let prevBeta = 0;
  let prevGamma = 0;
  let somCum = 0;
  let twCum = 0;

  for (let f = 0; f < clip.frameCount; f++) {
    const pose = forwardKinematics(clip, f, dim);
    const pelvisQ = pose.rotations[Joint.Hips];
    const pelvisUp = qRotateVec(pelvisQ, UP);
    const pelvisFwd = qRotateVec(pelvisQ, [0, 0, 1]);

    // —— 解析分解:Qp = Qyaw * Qtw(γ) * Qsom(β) ——
    // 剔除 yaw:Q' = Qyaw^-1 * Qp = Qtw * Qsom
    const qPrime = qMultiply(qInverse(baseYawQ), pelvisQ);
    // β:Q' 作用于体纵轴(0,1,0) 后在翻腾平面 YZ 的极角
    const upAfter = qRotateVec(qPrime, UP);
    const betaRaw = Math.atan2(upAfter[2], upAfter[1]);
    const beta = unwrap(prevBeta, betaRaw);
    // γ:Qsom^-1 * Q' = Qtw,扭转分量即绕体纵轴的角
    const qSom = qFromAxisAngle([1, 0, 0], beta);
    const qTw = qMultiply(qInverse(qSom), qPrime);
    const gammaRaw = 2 * Math.atan2(
      qTw[1], // 体纵轴为 Y,twist 四元数在 Y 上的虚部
      qTw[3],
    );
    const gamma = unwrap(prevGamma, gammaRaw);
    somCum = beta;
    twCum = gamma;
    prevBeta = beta;
    prevGamma = gamma;

    // —— 重心:质量加权的关节世界坐标 ——
    const com: Vec3 = [0, 0, 0];
    for (let j = 0; j < JOINT_COUNT; j++) {
      const w = JOINT_MASS_WEIGHTS[j];
      com[0] += pose.positions[j][0] * w;
      com[1] += pose.positions[j][1] * w;
      com[2] += pose.positions[j][2] * w;
    }

    // —— 关节角 ——
    const kneeL = kneeAngle(pose, Joint.LeftUpLeg, Joint.LeftLeg, Joint.LeftFoot);
    const kneeR = kneeAngle(pose, Joint.RightUpLeg, Joint.RightLeg, Joint.RightFoot);
    const hipL = hipAngle(pose, Joint.Spine1, Joint.Hips, Joint.LeftUpLeg, Joint.LeftLeg);
    const hipR = hipAngle(pose, Joint.Spine1, Joint.Hips, Joint.RightUpLeg, Joint.RightLeg);

    // 抱膝(C/D):膝角与髋角同时小于阈值;屈体(B)/直体(A):只看髋角
    const isTuck = clip.diveCode.endsWith('C') || clip.diveCode.endsWith('D')
      ? (kneeL < settings.thresholds.tuckKneeDeg && kneeR < settings.thresholds.tuckKneeDeg
        && hipL < settings.thresholds.tuckHipDeg && hipR < settings.thresholds.tuckHipDeg)
      : (hipL < settings.thresholds.pikeHipDeg && hipR < settings.thresholds.pikeHipDeg);

    // 角速度(rad/s):本帧翻腾+转体增量
    const prev = metrics[f - 1];
    const angularVelocity = prev
      ? (Math.abs(rad2deg(somCum) - prev.somersaultCumDeg)
        + Math.abs(rad2deg(twCum) - prev.twistCumDeg)) * Math.PI / 180 / dt
      : 0;

    metrics.push({
      com, pelvisUp, pelvisForward: pelvisFwd,
      somersaultCumDeg: rad2deg(somCum),
      twistCumDeg: rad2deg(twCum),
      kneeAngles: [kneeL, kneeR],
      hipAngles: [hipL, hipR],
      isTight: isTuck,
      angularVelocity,
    });
  }

  // —— 入水指标 ——(导入片段未标事件时,用全程末帧/最高点兜底)
  const entryF = clip.entryFrame >= 0 ? clip.entryFrame : clip.frameCount - 1;
  const entryPose = forwardKinematics(clip, entryF, dim);
  const entryUp = vNormalize(qRotateVec(entryPose.rotations[Joint.Hips], UP));
  // 入水时头朝下,体纵轴与铅垂线反向;按"无向直线"取锐角偏离
  const entryAngleDeg = Math.min(vAngleDeg(entryUp, UP), vAngleDeg(entryUp, [0, -1, 0]));

  // 手掌先入水点:取两手中 y 更低者,水平偏移相对骨盆入水投影
  const hands = [entryPose.positions[Joint.LeftHand], entryPose.positions[Joint.RightHand]];
  const firstHand = hands[0][1] < hands[1][1] ? hands[0] : hands[1];
  const pelvisEntry = entryPose.positions[Joint.Hips];
  const handEntryOffset: Vec3 = [
    firstHand[0] - pelvisEntry[0], 0, firstHand[2] - pelvisEntry[2],
  ];

  const openF = detectOpenFrame(clip, metrics, settings);
  const apexF = clip.apexFrame >= 0 ? clip.apexFrame : detectApex(clip);
  const apexToOpenMs = (openF - apexF) / clip.sampleRate * 1000;

  const maxAngularVelocity = metrics.reduce((m, x) => Math.max(m, x.angularVelocity), 0);

  return {
    metrics,
    entryAngleDeg,
    handEntryOffset,
    somersaultTurns: metrics[entryF].somersaultCumDeg / 360,
    twistTurns: metrics[entryF].twistCumDeg / 360,
    apexToOpenMs,
    maxAngularVelocity,
  };
}

/** 向量从 a 转到 b 绕指定轴的有符号角(弧度) */
function signedAngleAboutAxis(a: Vec3, b: Vec3, axis: Vec3): number {
  const n = vNormalize(axis);
  const an = vNormalize(a);
  const bn = vNormalize(b);
  const dot = clamp(an[0] * bn[0] + an[1] * bn[1] + an[2] * bn[2], -1, 1);
  const cross: Vec3 = [
    an[1] * bn[2] - an[2] * bn[1],
    an[2] * bn[0] - an[0] * bn[2],
    an[0] * bn[1] - an[1] * bn[0],
  ];
  const angle = Math.acos(dot);
  const sign = cross[0] * n[0] + cross[1] * n[1] + cross[2] * n[2] >= 0 ? 1 : -1;
  return angle * sign;
}

/** 向量减去其在 axis 上的分量(投影到垂直平面) */
function rejectFromAxis(v: Vec3, axis: Vec3): Vec3 {
  const n = vNorm3(axis);
  const d = v[0] * n[0] + v[1] * n[1] + v[2] * n[2];
  return [v[0] - n[0] * d, v[1] - n[1] * d, v[2] - n[2] * d];
}

function vLen3(v: Vec3): number {
  return Math.hypot(v[0], v[1], v[2]);
}
function vNorm3(v: Vec3): Vec3 {
  const l = vLen3(v) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

/**
 * 翻腾平面(YZ)内两投影向量的有符号角增量。
 * 翻腾绕世界 X 轴:从 +X 方向看,Y->Z 的旋转为正角。
 */
function planarAngleDelta(a: Vec3, b: Vec3): number {
  const angA = Math.atan2(a[2], a[1]); // (y,z) 平面极角
  const angB = Math.atan2(b[2], b[1]);
  let d = angB - angA;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

/** 膝关节角:髋→膝向量(取反指向躯干)与膝→脚向量的夹角,伸直=180,抱紧时变小 */
function kneeAngle(pose: WorldPose, hip: Joint, knee: Joint, foot: Joint): number {
  const thighBack = vNormalize(vSub(pose.positions[hip], pose.positions[knee]));
  const shin = vNormalize(vSub(pose.positions[foot], pose.positions[knee]));
  return vAngleDeg(thighBack, shin);
}

/** 髋关节角:髋→胸向量(躯干)与髋→膝向量(大腿)的夹角,伸直=180,团身时变小 */
function hipAngle(pose: WorldPose, chest: Joint, hip: Joint, upLeg: Joint, knee: Joint): number {
  const torso = vNormalize(vSub(pose.positions[chest], pose.positions[hip]));
  const thigh = vNormalize(vSub(pose.positions[knee], pose.positions[hip]));
  return vAngleDeg(torso, thigh);
}

/** 自动找打开帧:离板后最后一段"抱紧"状态结束的位置 */
export function detectOpenFrame(
  clip: DiveClip,
  metrics: FrameMetrics[],
  settings: AppSettings,
): number {
  const start = clip.takeoffFrame >= 0 ? clip.takeoffFrame : 0;
  const end = clip.entryFrame >= 0 ? clip.entryFrame : clip.frameCount - 1;
  let lastTight = -1;
  for (let f = start; f <= end; f++) {
    if (metrics[f]?.isTight) lastTight = f;
  }
  if (lastTight < 0) return start + Math.floor((end - start) * 0.8);
  // 向后找到 isTight 由 true 转 false 的边界
  let f = lastTight;
  while (f < end && metrics[f].isTight) f++;
  void settings;
  return f;
}

/** 自动找最高点:重心 y 的峰值帧 */
export function detectApex(clip: DiveClip): number {
  let best = 0;
  let bestY = -Infinity;
  for (let f = 0; f < clip.frameCount; f++) {
    const y = clip.rootPositions[f * 3 + 1];
    if (Number.isNaN(y)) continue;
    if (y > bestY) { bestY = y; best = f; }
  }
  return best;
}

/**
 * 自动事件识别(导入外部 BVH/CSV 时使用)
 * boardTopY:板/台顶面高度;数据根节点为髋点,离板时髋高 ≈ boardTopY + 髋高
 * 离板:垂直速度由负(下压)转正且位置回到离板髋高附近的最后一帧
 * 入水:离板后根节点(髋点)下穿越"水面+髋高"线的首帧
 */
export function detectEvents(
  clip: DiveClip,
  waterLevelY: number,
  boardTopY: number,
  hipHeightAtTakeoff: number,
  hipHeightAtEntry = hipHeightAtTakeoff,
): { takeoffFrame: number; entryFrame: number } {
  const n = clip.frameCount;
  let takeoffFrame = -1;
  let entryFrame = -1;
  const y = (f: number) => clip.rootPositions[f * 3 + 1];
  const vy = (f: number) => (y(f + 1) - y(f - 1)) * 0.5 * clip.sampleRate;
  const takeoffHipY = boardTopY + hipHeightAtTakeoff;

  // 离板:板高窗口内垂直速度最大的帧——蹬伸结束瞬间起跳速度达到峰值,
  // 比"回到板高"更稳定(板回弹会让髋点在板高附近停留若干帧)。
  {
    let bestV = -Infinity;
    for (let f = 2; f < n - 2; f++) {
      if (Number.isNaN(y(f)) || Number.isNaN(y(f - 1)) || Number.isNaN(y(f + 1))) continue;
      if (Math.abs(y(f) - takeoffHipY) > 0.3) continue;
      const v = vy(f);
      if (v > bestV) { bestV = v; takeoffFrame = f; }
    }
  }
  if (takeoffFrame < 0) {
    // 兜底:前 40% 段内 vy 最大的帧
    let bestV = -Infinity;
    for (let f = 2; f < n * 0.4; f++) {
      if (Number.isNaN(y(f))) continue;
      const v = vy(f);
      if (v > bestV) { bestV = v; takeoffFrame = f; }
    }
  }

  // 入水:离板后髋点首次下探到水面+髋高线(手先入水,髋随后);阈值收紧到 8cm
  for (let f = Math.max(0, takeoffFrame) + 1; f < n; f++) {
    if (Number.isNaN(y(f))) continue;
    if (y(f) <= waterLevelY + hipHeightAtEntry + 0.08) { entryFrame = f; break; }
  }
  if (entryFrame < 0) entryFrame = n - 1;
  return { takeoffFrame, entryFrame };
}

/** 用于相机跟随的平滑重心(简单滑动平均,窗口 5 帧) */
export function smoothComPath(metrics: FrameMetrics[]): Vec3[] {
  return metrics.map((m, i) => {
    const lo = Math.max(0, i - 2);
    const hi = Math.min(metrics.length - 1, i + 2);
    const acc: Vec3 = [0, 0, 0];
    let cnt = 0;
    for (let k = lo; k <= hi; k++) {
      acc[0] += metrics[k].com[0]; acc[1] += metrics[k].com[1]; acc[2] += metrics[k].com[2];
      cnt++;
    }
    return vScale(acc, 1 / cnt);
  });
}

/** 仅为测试/工具用途:构造一个单位轴旋转 */
export function axisQuat(axis: Vec3, deg: number): Quat {
  return qFromAxisAngle(axis, (deg * Math.PI) / 180);
}
