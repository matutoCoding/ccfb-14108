// 跳水动捕数据生成器
// 设计原则:骨盆世界朝向 = Qsom * Qtw,其中
//   Qsom = 绕世界 X 轴 β(翻腾),Qtw = 绕当前体纵轴 γ(转体)
// 分析端用同一套轴约定做逆向解算,圈数可精确还原(107B 必然 = 3.5)
import { Joint, JOINT_COUNT } from './types';
import type { DiveClip, DiveDefinition, Athlete } from './types';
import {
  qFromAxisAngle, qMultiply, qSlerp, qYaw, qIdentity,
  smoothstep, clamp, v3,
} from './math3d';
import type { Quat, Vec3 } from './math3d';
import { parseDiveCode, groupName } from './diveCodes';
import { poseJointQuat, type PoseName } from './poses';

export interface GenerateOptions {
  athlete: Athlete;
  dive: DiveDefinition;
  sessionId: string;
  sampleRate?: number;
  platformHeight: number;     // m
  boardType: 'spring' | 'platform';
  seed?: number;
  /** 注入缺陷:丢帧 + 关节翻转 */
  injectDefects?: boolean;
}

/** 确定性伪随机(种子化,保证可复现) */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const POSE_AIR: Record<'A' | 'B' | 'C' | 'D', PoseName> = {
  A: 'layout', B: 'pike', C: 'tuck', D: 'tuck',
};

/** 各组翻腾方向(绕世界 X 的符号):向内组为 +,其余为 - */
function somersaultSign(group: number, direction?: number): number {
  const g = group === 5 ? direction ?? 1 : group;
  return g === 4 ? 1 : -1;
}

export function generateDive(opts: GenerateOptions): DiveClip {
  const rate = opts.sampleRate ?? 240;
  const rnd = mulberry32(opts.seed ?? hashStr(opts.dive.code + opts.athlete.id));
  const parsed = parseDiveCode(opts.dive.code)!;
  const sSign = somersaultSign(parsed.group, parsed.direction);
  const somRad = sSign * opts.dive.somersaults * 2 * Math.PI;
  const twRad = (opts.dive.twists || 0) * 2 * Math.PI; // 转体方向取正(绕体纵轴)

  const h = opts.athlete.heightCm / 100;
  const boardY = opts.platformHeight;
  const hipAtTakeoff = boardY + h * 0.521;

  // —— 时间分段(秒)——
  const boardDur = 0.55;                    // 板上起跳段
  const flightDur = round3(1.18 + rnd() * 0.16 + (opts.platformHeight >= 10 ? 0.22 : 0));
  const waterDur = 0.5;                     // 入水后
  const takeoffT = boardDur;
  const entryT = boardDur + flightDur;
  const totalT = entryT + waterDur;
  const frameCount = Math.round(totalT * rate) + 1;

  // —— 起跳速度:由飞行时长反推,保证入水帧正好到达水面 ——
  // y(t) = hipAtTakeoff + vy0 τ - 0.5 g τ²,entry 时 y = 水面(髋高≈0.9h 入水)
  const g = 9.81;
  const hipAtEntry = h * 0.9;
  const vy0 = (hipAtEntry - hipAtTakeoff + 0.5 * g * flightDur * flightDur) / flightDur;
  const forward = (parsed.group === 5 ? parsed.direction! : parsed.group) === 1
    || (parsed.group === 5 && parsed.direction === 1);
  const inward = (parsed.group === 4) || (parsed.group === 5 && parsed.direction === 4);
  const vx0 = forward ? 0.55 + rnd() * 0.25 : inward ? -0.25 - rnd() * 0.15 : 0.12 + rnd() * 0.18;
  const vz0 = (rnd() - 0.5) * 0.08;

  // 板下压(仅弹簧板):正弦式下压-回弹,离板帧归零
  const maxFlex = opts.boardType === 'spring' ? 0.16 + rnd() * 0.05 : 0;

  // —— 姿态时间线(占飞行段比例)——
  const airPose = POSE_AIR[opts.dive.position];
  const tuckStart = 0.12 + rnd() * 0.05;
  const openAt = opts.dive.twists > 0 ? 0.80 + rnd() * 0.04 : 0.78 + rnd() * 0.05;
  const entryBlend = 0.94;

  // 转体窗口(5 组):中段完成
  const twStart = 0.14;
  const twEnd = 0.86;

  // 起跳前朝向(背立/向内背对池)
  const facingAway = parsed.group === 2 || parsed.group === 3
    || (parsed.group === 5 && (parsed.direction === 2 || parsed.direction === 3));
  const baseYaw = facingAway ? Math.PI : 0;

  const rootPositions = new Float32Array(frameCount * 3);
  const localRotations = new Float32Array(frameCount * JOINT_COUNT * 4);
  const defects: DiveClip['defects'] = [];

  for (let f = 0; f < frameCount; f++) {
    const t = f / rate;
    let pos: Vec3;
    let pelvisQ: Quat;
    let poseName: PoseName = 'stand';
    let poseBlend = 1;

    if (t < takeoffT) {
      // —— 板上:下压回弹 ——
      const p = t / takeoffT;
      const flex = maxFlex * Math.sin(Math.PI * p) * (1 - smoothstep(0.72, 1, p) * 0.4);
      pos = [0, hipAtTakeoff - flex, 0];
      pelvisQ = qYaw(baseYaw);
      poseName = 'stand';
    } else if (t < entryT) {
      // —— 空中(离板帧 t=takeoffT 起即含翻腾角) ——
      const tau = t - takeoffT;
      const u = clamp(tau / flightDur, 0, 1);
      pos = [
        vx0 * tau,
        hipAtTakeoff + vy0 * tau - 0.5 * g * tau * tau,
        vz0 * tau,
      ];
      // 翻腾角:线性累计,总量精确 = somRad
      const beta = somRad * u;
      const qSom = qFromAxisAngle([1, 0, 0], beta);
      // 转体角:窗口内线性,总量精确 = twRad
      // 分解约定 Qp = Qyaw * Qtw * Qsom:先翻腾,再绕体纵轴自旋,最后起跳朝向
      let gamma = 0;
      if (twRad !== 0) {
        const twU = clamp((u - twStart) / (twEnd - twStart), 0, 1);
        gamma = twRad * twU;
      }
      const bodyUpAfterSom = qRotate(qSom, [0, 1, 0]);
      const qTw = qFromAxisAngle(bodyUpAfterSom, gamma);
      pelvisQ = qMultiply(qMultiply(qYaw(baseYaw), qTw), qSom);

      // 姿态混合:stand -> air(tuck/pike/layout) -> entry
      if (u < tuckStart) {
        poseBlend = smoothstep(0.02, tuckStart, u);
        poseName = airPose;
      } else if (u < openAt) {
        poseName = airPose; poseBlend = 1;
      } else if (u < entryBlend) {
        const k = smoothstep(openAt, entryBlend, u);
        pelvisQ = pelvisQ; // 打开只改肢体姿态,不改骨盆朝向
        poseName = airPose; poseBlend = 1 - k;
      } else {
        poseName = 'entry'; poseBlend = smoothstep(entryBlend, 1, u);
      }
    } else {
      // —— 入水后:保持流线型下沉减速 ——
      const tau = t - entryT;
      const k = clamp(tau / waterDur, 0, 1);
      pos = [
        vx0 * flightDur + vx0 * tau * (1 - k * 0.6),
        hipAtEntry - 2.2 * k + 0.5 * g * tau * tau * 0.12,
        vz0 * flightDur,
      ];
      // 入水角微扰:绕体前轴小幅侧倾(不影响翻腾/转体累计),±6°
      const tilt = (rnd() - 0.5) * 0.21 * smoothstep(0, 0.25, k);
      pelvisQ = qMultiply(qFromAxisAngle([0, 0, 1], tilt), entryPelvis(somRad, twRad, baseYaw));
      poseName = 'entry'; poseBlend = 1;
    }

    rootPositions[f * 3] = pos[0];
    rootPositions[f * 3 + 1] = pos[1];
    rootPositions[f * 3 + 2] = pos[2];

    // 组装各关节局部旋转
    for (let j = 0; j < JOINT_COUNT; j++) {
      let q: Quat;
      if (j === Joint.Hips || j === Joint.Pelvis) {
        q = j === Joint.Hips ? pelvisQ : qIdentity();
      } else if (j === Joint.Chest) {
        q = qIdentity();
      } else {
        const target = poseJointQuat(poseName, j);
        q = poseBlend >= 0.999 ? target : qSlerp(qIdentity(), target, poseBlend);
      }
      const o = (f * JOINT_COUNT + j) * 4;
      localRotations[o] = q[0]; localRotations[o + 1] = q[1];
      localRotations[o + 2] = q[2]; localRotations[o + 3] = q[3];
    }
  }

  const takeoffFrame = Math.round(takeoffT * rate);
  const entryFrame = Math.round(entryT * rate);
  const apexFrame = Math.round((takeoffT + vy0 / g) * rate);

  const clip: DiveClip = {
    id: `dive_${opts.dive.code}_${opts.athlete.id.slice(0, 4)}_${(opts.seed ?? 0).toString(36)}`,
    athleteId: opts.athlete.id,
    diveCode: opts.dive.code,
    sessionId: opts.sessionId,
    sampleRate: rate,
    frameCount,
    rootPositions,
    localRotations,
    takeoffFrame,
    entryFrame,
    apexFrame,
    openFrame: Math.round(takeoffT + openAt * flightDur * rate),
    defects,
    repaired: [],
    createdAt: Date.now(),
  };

  if (opts.injectDefects) injectDefectData(clip, rnd);
  return clip;
}

/** 入水瞬间的骨盆朝向(末端姿态基准) */
function entryPelvis(somRad: number, twRad: number, baseYaw: number): Quat {
  const qSom = qFromAxisAngle([1, 0, 0], somRad);
  const bodyUp = qRotate(qSom, [0, 1, 0]);
  const qTw = qFromAxisAngle(bodyUp, twRad);
  return qMultiply(qMultiply(qYaw(baseYaw), qTw), qSom);
}

function qRotate(q: Quat, v: Vec3): Vec3 {
  const qv: Quat = [v[0], v[1], v[2], 0];
  const conj: Quat = [-q[0], -q[1], -q[2], q[3]];
  const r = qMultiply(qMultiply(q, qv), conj);
  return [r[0], r[1], r[2]];
}

/**
 * 注入两类真实动捕缺陷:
 * 1) 整段丢帧:帧时间戳不连续,数据表现为 NaN 空洞(8~14 帧)
 * 2) 关节翻转:某关节四元数分量突然反号(w 符号跳变),持续 5~9 帧
 */
function injectDefectData(clip: DiveClip, rnd: () => number): void {
  const f0 = clip.takeoffFrame + Math.floor(clip.frameCount * 0.35);
  const dropLen = 8 + Math.floor(rnd() * 7);
  for (let f = f0; f < Math.min(f0 + dropLen, clip.frameCount); f++) {
    for (let k = 0; k < 3; k++) clip.rootPositions[f * 3 + k] = NaN;
    for (let k = 0; k < JOINT_COUNT * 4; k++) clip.localRotations[f * JOINT_COUNT * 4 + k] = NaN;
  }
  clip.defects.push({ type: 'drop', jointId: -1, startFrame: f0, endFrame: f0 + dropLen - 1 });

  const f1 = clip.takeoffFrame + Math.floor(clip.frameCount * 0.55);
  const flipLen = 5 + Math.floor(rnd() * 5);
  const joint = Joint.LeftForeArm;
  for (let f = f1; f < Math.min(f1 + flipLen, clip.frameCount); f++) {
    const o = (f * JOINT_COUNT + joint) * 4;
    // 反号 = 同一旋转的另一表示,连续播放表现为剧烈翻转
    clip.localRotations[o] *= -1;
    clip.localRotations[o + 1] *= -1;
    clip.localRotations[o + 2] *= -1;
    clip.localRotations[o + 3] *= -1;
  }
  clip.defects.push({ type: 'flip', jointId: joint, startFrame: f1, endFrame: f1 + flipLen - 1 });
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function round3(x: number): number {
  return Math.round(x * 1000) / 1000;
}

export function describeDirection(clip: { diveCode: string }): string {
  const p = parseDiveCode(clip.diveCode);
  if (!p) return '';
  return groupName(p.group, p.direction);
}
