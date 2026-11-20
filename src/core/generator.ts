// 合成动捕数据生成器
// 关键约束：根姿态 = qSomer(phi) * qTwist(tw)，phi/tw 按动作代码精确积分，
// 与 kinematics.analyzeRecord 的分解数学严格对应（107B 必然累计 3.5 圈翻腾、0 转体）
import type {
  Athlete,
  DiveCodeInfo,
  MoCapRecord,
  PlatformInfo,
  Quat,
  SkeletonFrame,
  Vec3,
} from './types';
import { JOINTS, JOINT_INDEX, buildSkeleton } from './skeleton';
import { parseDiveCode } from './settings';
import { deg2rad, q, quat, uid, v } from './math';
import { detectAndRepair } from './processing';

const G = 9.81;

export interface GenOptions {
  athlete: Athlete;
  code: string;
  sampleRate?: number;
  platform: PlatformInfo;
  /** 起跳垂直速度 m/s */
  takeoffVy?: number;
  /** 水平速度 m/s（向前为正） */
  vx?: number;
  /** 打开时刻占飞行段比例 */
  openFraction?: number;
  /** 入水角误差（度，正值=入水欠垂直），用于让历次数据有离散度 */
  entryAngleError?: number;
  /** 注入异常：丢帧 + 关节翻转 */
  corrupt?: boolean;
  sessionId: string;
}

const J = JOINT_INDEX;
const smooth = (u: number): number => u * u * (3 - 2 * u);
/** 平滑区间混合 0..1 */
const ramp = (u: number, a: number, b: number): number => {
  const x = Math.min(1, Math.max(0, (u - a) / (b - a)));
  return smooth(x);
};

/** 按飞行阶段构造全身局部姿态 */
function buildPose(
  info: DiveCodeInfo,
  u: number,
  openFraction: number,
): Quat[] {
  const rot: Quat[] = JOINTS.map(() => q());
  const pos = info.position;

  // 抱紧程度：0 直体 -> 1 最紧
  const tuckIn = ramp(u, 0.1, 0.28);
  const release = ramp(u, openFraction, openFraction + 0.14);
  const tight = tuckIn * (1 - release);
  // 入水手臂上举
  const armsOverhead = ramp(u, 0.86, 0.95);

  if (pos === 'C') {
    // 团身：屈膝 + 屈髋 + 抱腿
    const kneeFlex = deg2rad(150) * tight;
    const hipFlex = deg2rad(125) * tight;
    for (const side of ['Left', 'Right'] as const) {
      const upLeg = J[`${side}UpLeg`];
      const leg = J[`${side}Leg`];
      rot[upLeg] = quat.fromAxisAngle(v(0, 0, 1), hipFlex);
      rot[leg] = quat.fromAxisAngle(v(0, 0, 1), -kneeFlex);
      // 手臂前抱
      const arm = J[`${side}Arm`];
      const fore = J[`${side}ForeArm`];
      const s = side === 'Left' ? 1 : -1;
      const shoulder = quat.fromAxisAngle(v(0, 1, 0), s * deg2rad(110) * tight);
      const entry = quat.fromAxisAngle(v(1, 0, 0), -s * deg2rad(90) * armsOverhead);
      rot[arm] = quat.mul(entry, shoulder);
      rot[fore] = quat.fromAxisAngle(v(0, 1, 0), s * deg2rad(120) * tight * (1 - armsOverhead));
    }
    rot[J.Spine] = quat.fromAxisAngle(v(0, 0, 1), -deg2rad(25) * tight);
    rot[J.Spine1] = quat.fromAxisAngle(v(0, 0, 1), -deg2rad(20) * tight);
  } else if (pos === 'B') {
    // 屈体：屈髋、膝直、手够脚尖
    const hipFlex = deg2rad(115) * tight;
    for (const side of ['Left', 'Right'] as const) {
      const upLeg = J[`${side}UpLeg`];
      rot[upLeg] = quat.fromAxisAngle(v(0, 0, 1), hipFlex);
      const s = side === 'Left' ? 1 : -1;
      const arm = J[`${side}Arm`];
      const reach = quat.fromAxisAngle(v(0, 1, 0), s * deg2rad(150) * tight);
      const entry = quat.fromAxisAngle(v(1, 0, 0), -s * deg2rad(90) * armsOverhead);
      rot[arm] = quat.mul(entry, reach);
    }
    rot[J.Spine] = quat.fromAxisAngle(v(0, 0, 1), -deg2rad(35) * tight);
    rot[J.Spine1] = quat.fromAxisAngle(v(0, 0, 1), -deg2rad(30) * tight);
  } else {
    // 直体
    for (const side of ['Left', 'Right'] as const) {
      const s = side === 'Left' ? 1 : -1;
      rot[J[`${side}Arm`]] = quat.fromAxisAngle(
        v(1, 0, 0),
        -s * deg2rad(90) * armsOverhead,
      );
    }
  }
  return rot;
}

/** 生成一跳（未修复的原始帧；corrupt 时带异常，随后走统一修复管线） */
export function generateDive(opts: GenOptions): MoCapRecord {
  const sampleRate = opts.sampleRate ?? 240;
  const dt = 1 / sampleRate;
  const info = parseDiveCode(opts.code);
  const spec = buildSkeleton(opts.athlete);
  const H = opts.platform.heightM;
  const isSpring = opts.platform.type === 'springboard';

  // 飞行方向：1 组向前 +，2/4 组向/内为负，5 组看第二位
  const forward = info.group === 1 ? 1 : -1;
  const vy = opts.takeoffVy ?? (isSpring ? 3.4 : 2.2);
  const vx = opts.vx ?? forward * (isSpring ? 0.9 : 0.6);
  const openFraction = opts.openFraction ?? 0.72;
  const entryErr = opts.entryAngleError ?? 0;

  // ---- 时间结构 ----
  const boardDur = isSpring ? 0.85 : 0.55;
  const tUp = vy / G;
  const apexAboveBoard = (vy * vy) / (2 * G);
  const tFall = Math.sqrt((2 * (H + apexAboveBoard)) / G);
  const flightDur = tUp + tFall;
  const waterDur = 0.3;
  const totalDur = boardDur + flightDur + waterDur;
  const totalFrames = Math.round(totalDur * sampleRate);
  const takeoffFrame = Math.round(boardDur * sampleRate);
  const flightFrames = Math.round(flightDur * sampleRate);

  // ---- 翻腾/转体目标角 ----
  // 后翻（2/3/5-2 等）绕 -Z；前翻绕 +Z
  const somSign = forward > 0 ? 1 : -1;
  const phiTotal = somSign * info.somersaults * 2 * Math.PI - somSign * deg2rad(entryErr);
  const twistTotal = info.twists * 2 * Math.PI;

  const boardTopY = H;
  const frames: SkeletonFrame[] = [];
  const boardDeflection: number[] = [];

  for (let f = 0; f < totalFrames; f++) {
    const t = f * dt;
    let rootPos: Vec3;
    let rootQuat: Quat;
    let pose: Quat[];

    if (f < takeoffFrame) {
      // 起跳前：板上准备，板下压-回弹
      const u = f / takeoffFrame;
      const depress = isSpring ? -0.12 * Math.sin(Math.PI * u) : 0;
      boardDeflection.push(depress);
      rootPos = v(0, boardTopY + depress, 0);
      // 轻微前摇后回到直立
      const prep = deg2rad(8) * Math.sin(Math.PI * u) * -somSign;
      rootQuat = quat.fromAxisAngle(v(0, 0, 1), prep);
      pose = buildPose(info, 0, openFraction);
    } else if (f < takeoffFrame + flightFrames) {
      const i = f - takeoffFrame;
      const tau = i * dt;
      const u = i / (flightFrames - 1);
      const y = boardTopY + vy * tau - 0.5 * G * tau * tau;
      const x = vx * tau;
      rootPos = v(x, y, 0);
      const phi = phiTotal * smooth(u);
      // 转体集中在飞行中段（抱紧凑时转），打开前完成；归一化区间末段取 0.9 保证收尾值恰为 1
      const twU = smooth(ramp(u, 0.12, 0.9));
      const tw = twistTotal * twU;
      rootQuat = quat.mul(
        quat.fromAxisAngle(v(0, 0, 1), phi),
        quat.fromAxisAngle(v(0, 1, 0), tw),
      );
      pose = buildPose(info, u, openFraction);
      boardDeflection.push(0);
    } else {
      // 入水后：减速下沉，姿态延续飞行末帧（避免根姿态跳变污染圈数积分）
      const tau = (f - (takeoffFrame + flightFrames) + 1) * dt;
      const y = -1.8 * tau;
      const x = vx * flightDur + vx * tau * 0.2;
      rootPos = v(x, y, 0);
      const twU = smooth(ramp(1, 0.12, 0.9));
      rootQuat = quat.mul(
        quat.fromAxisAngle(v(0, 0, 1), phiTotal),
        quat.fromAxisAngle(v(0, 1, 0), twistTotal * twU),
      );
      pose = buildPose(info, 1, openFraction);
      boardDeflection.push(0);
    }

    const rotations = pose.map((local, i) =>
      i === 0 ? rootQuat : local,
    );
    frames.push({ t, frame: f, rootPosition: rootPos, rotations });
  }

  // ---- 注入异常 ----
  let qualityNote: string | undefined;
  if (opts.corrupt) {
    // 1) 飞行中段丢 8 帧（时间戳出现断层，修复管线负责补回）
    const gapStart = takeoffFrame + Math.round(flightDur * sampleRate * 0.4);
    const gapEnd = gapStart + 8;
    for (let k = gapEnd - 1; k >= gapStart; k--) frames.splice(k, 1);
    // 重排 frame 号但保留真实 t，检测靠时间断层
    frames.forEach((fr, i) => (fr.frame = i));

    // 2) 左前臂关节翻转 10 帧（四元数取反等价旋转被破坏 -> 加点绕偏轴的 180°）
    const flipStart = takeoffFrame + Math.round(flightDur * sampleRate * 0.55);
    const bad = quat.fromAxisAngle(v(1, 0, 0.2), Math.PI);
    for (let k = flipStart; k < flipStart + 10 && k < frames.length; k++) {
      frames[k].rotations[J.LeftForeArm] = quat.mul(frames[k].rotations[J.LeftForeArm], bad);
    }
    qualityNote = '合成时注入：8 帧丢帧 + 左前臂 10 帧关节翻转';
  }

  const raw: MoCapRecord = {
    id: uid('rec_'),
    athleteId: opts.athlete.id,
    sessionId: opts.sessionId,
    diveCode: info.code,
    sampleRate,
    source: 'synthetic',
    createdAt: Date.now(),
    frameCount: frames.length,
    platform: {
      ...opts.platform,
      boardDeflectionM: opts.platform.type === 'springboard' ? boardDeflection : undefined,
    },
    frames,
    // 占位事件，detectAndRepair 之后由事件检测覆盖
    events: { takeoffFrame: 0, apexFrame: 0, openFrame: 0, entryFrame: frames.length - 1 },
    quality: [],
    repaired: false,
    notes: qualityNote,
  };

  const repaired = detectAndRepair(raw, spec);
  return repaired;
}
