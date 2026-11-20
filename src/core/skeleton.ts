// 规范骨骼：24 关节，含前臂/小腿独立扭转骨（扭转只走扭转骨，杜绝糖纸效应）
// 静止姿态：T-Pose，Y 向上，+X 为跳板前方（水池），±Z 为左右
import type { Athlete, Vec3 } from './types';
import { v } from './math';

export const JOINTS = [
  'Hips', // 0 根
  'Spine', // 1
  'Spine1', // 2 胸
  'Neck', // 3
  'Head', // 4
  'LeftShoulder', // 5
  'LeftArm', // 6 上臂
  'LeftForeArm', // 7 前臂（屈肘）
  'LeftForeTwist', // 8 前臂扭转
  'LeftHand', // 9
  'RightShoulder', // 10
  'RightArm', // 11
  'RightForeArm', // 12
  'RightForeTwist', // 13
  'RightHand', // 14
  'LeftUpLeg', // 15 大腿
  'LeftLeg', // 16 小腿（屈膝）
  'LeftCalfTwist', // 17 小腿扭转
  'LeftFoot', // 18
  'RightUpLeg', // 19
  'RightLeg', // 20
  'RightCalfTwist', // 21
  'RightFoot', // 22
  'Pelvis', // 23 骨盆扭转参考
] as const;

export type JointName = (typeof JOINTS)[number];

export const JOINT_INDEX: Record<JointName, number> = Object.fromEntries(
  JOINTS.map((name, i) => [name, i]),
) as Record<JointName, number>;

// 父关节索引，-1 表示根
export const PARENTS: number[] = [
  -1, // Hips
  0, // Spine
  1, // Spine1
  2, // Neck
  3, // Head
  2, // LeftShoulder
  5, // LeftArm
  6, // LeftForeArm
  7, // LeftForeTwist
  8, // LeftHand —— 手挂在扭转骨末端，扭转自然传到手
  2, // RightShoulder
  10, // RightArm
  11, // RightForeArm
  12, // RightForeTwist
  13, // RightHand
  0, // LeftUpLeg
  15, // LeftLeg
  16, // LeftCalfTwist
  17, // LeftFoot
  0, // RightUpLeg
  19, // RightLeg
  20, // RightCalfTwist
  21, // RightFoot
  0, // Pelvis
];

/** 身高比例（相对身高 h），臂链最终再按实测臂展整体缩放 */
const R = {
  hipCenterY: 0.53,
  spine: 0.12,
  spine1: 0.115,
  neck: 0.055,
  head: 0.095,
  shoulderHalf: 0.085,
  pelvisHalf: 0.05,
  upperArm: 0.186,
  foreArm: 0.15,
  foreTwist: 0.06,
  hand: 0.065,
  hipHalf: 0.095,
  thigh: 0.245,
  calf: 0.24,
  calfTwist: 0.1,
  footY: 0.04,
  footForward: 0.14,
};

export interface SkeletonSpec {
  joints: string[];
  parents: number[];
  /** T-Pose 下每个关节相对父关节的局部偏移（米） */
  restOffsets: Vec3[];
  /** 每个质量段挂在哪个关节上（关节 id -> 体重占比） */
  massFraction: Record<number, number>;
  /** 段质心在 父->该关节 方向上的位置比例 */
  comFraction: Record<number, number>;
}

export function buildSkeleton(athlete: Pick<Athlete, 'heightM' | 'armSpanM'>): SkeletonSpec {
  const h = athlete.heightM;
  const off: Vec3[] = JOINTS.map(() => v());
  const zL = 1; // 左侧 +Z
  const zR = -1;

  off[JOINT_INDEX.Spine] = v(0, R.spine * h, 0);
  off[JOINT_INDEX.Spine1] = v(0, R.spine1 * h, 0);
  off[JOINT_INDEX.Neck] = v(0, R.neck * h, 0);
  off[JOINT_INDEX.Head] = v(0, R.head * h, 0);
  off[JOINT_INDEX.Pelvis] = v(0, 0, R.pelvisHalf * h);

  // 臂链按臂展缩放：单侧臂长 = (臂展 - 肩宽) / 2
  const shoulderWidth = 2 * R.shoulderHalf * h;
  const sideArm = Math.max(0.2, (athlete.armSpanM - shoulderWidth) / 2);
  const restSide = R.upperArm + R.foreArm + R.foreTwist + R.hand;
  const armScale = sideArm / (restSide * h);
  const uArm = R.upperArm * h * armScale;
  const fArm = R.foreArm * h * armScale;
  const fTwist = R.foreTwist * h * armScale;
  const hand = R.hand * h * armScale;

  for (const [side, s] of [
    ['Left', zL],
    ['Right', zR],
  ] as const) {
    const sh = JOINT_INDEX[`${side}Shoulder` as JointName];
    const arm = JOINT_INDEX[`${side}Arm` as JointName];
    const fore = JOINT_INDEX[`${side}ForeArm` as JointName];
    const twist = JOINT_INDEX[`${side}ForeTwist` as JointName];
    const handJ = JOINT_INDEX[`${side}Hand` as JointName];
    off[sh] = v(0, 0, s * R.shoulderHalf * h);
    off[arm] = v(0, 0, s * uArm);
    off[fore] = v(0, 0, s * fArm);
    off[twist] = v(0, 0, s * fTwist);
    off[handJ] = v(0, 0, s * hand);
  }

  for (const [side, s] of [
    ['Left', zL],
    ['Right', zR],
  ] as const) {
    const thighJ = JOINT_INDEX[`${side}UpLeg` as JointName];
    const legJ = JOINT_INDEX[`${side}Leg` as JointName];
    const twist = JOINT_INDEX[`${side}CalfTwist` as JointName];
    const foot = JOINT_INDEX[`${side}Foot` as JointName];
    off[thighJ] = v(0, -R.thigh * h, s * R.hipHalf * h);
    off[legJ] = v(0, -R.calf * h, 0);
    off[twist] = v(0, -R.calfTwist * h, 0);
    off[foot] = v(R.footForward * h, -R.footY * h, 0);
  }

  // 质量段（合计 100%，de Leva 人体惯性参数简化）
  const massFraction: Record<number, number> = {
    [JOINT_INDEX.Hips]: 11.0,
    [JOINT_INDEX.Pelvis]: 4.0,
    [JOINT_INDEX.Spine]: 14.0,
    [JOINT_INDEX.Spine1]: 14.46,
    [JOINT_INDEX.Head]: 6.94,
    [JOINT_INDEX.LeftArm]: 2.71,
    [JOINT_INDEX.RightArm]: 2.71,
    [JOINT_INDEX.LeftForeArm]: 1.62,
    [JOINT_INDEX.RightForeArm]: 1.62,
    [JOINT_INDEX.LeftHand]: 0.61,
    [JOINT_INDEX.RightHand]: 0.61,
    [JOINT_INDEX.LeftUpLeg]: 14.16,
    [JOINT_INDEX.RightUpLeg]: 14.16,
    [JOINT_INDEX.LeftLeg]: 4.33,
    [JOINT_INDEX.RightLeg]: 4.33,
    [JOINT_INDEX.LeftFoot]: 1.37,
    [JOINT_INDEX.RightFoot]: 1.37,
  };
  const comFraction: Record<number, number> = {
    [JOINT_INDEX.Hips]: 0,
    [JOINT_INDEX.Pelvis]: 0.5,
    [JOINT_INDEX.Spine]: 0.5,
    [JOINT_INDEX.Spine1]: 0.5,
    [JOINT_INDEX.Head]: 0.5,
    [JOINT_INDEX.LeftArm]: 0.436,
    [JOINT_INDEX.RightArm]: 0.436,
    [JOINT_INDEX.LeftForeArm]: 0.43,
    [JOINT_INDEX.RightForeArm]: 0.43,
    [JOINT_INDEX.LeftHand]: 0.5,
    [JOINT_INDEX.RightHand]: 0.5,
    [JOINT_INDEX.LeftUpLeg]: 0.433,
    [JOINT_INDEX.RightUpLeg]: 0.433,
    [JOINT_INDEX.LeftLeg]: 0.433,
    [JOINT_INDEX.RightLeg]: 0.433,
    [JOINT_INDEX.LeftFoot]: 0.5,
    [JOINT_INDEX.RightFoot]: 0.5,
  };

  return { joints: [...JOINTS], parents: PARENTS, restOffsets: off, massFraction, comFraction };
}

// 常用关节角度计算所需的关节三元组（顶点关节 + 两端）
export const ANGLE_CHAINS = {
  hipL: [JOINT_INDEX.Spine1, JOINT_INDEX.LeftUpLeg, JOINT_INDEX.LeftLeg],
  hipR: [JOINT_INDEX.Spine1, JOINT_INDEX.RightUpLeg, JOINT_INDEX.RightLeg],
  kneeL: [JOINT_INDEX.LeftUpLeg, JOINT_INDEX.LeftLeg, JOINT_INDEX.LeftFoot],
  kneeR: [JOINT_INDEX.RightUpLeg, JOINT_INDEX.RightLeg, JOINT_INDEX.RightFoot],
  elbowL: [JOINT_INDEX.LeftArm, JOINT_INDEX.LeftForeArm, JOINT_INDEX.LeftHand],
  elbowR: [JOINT_INDEX.RightArm, JOINT_INDEX.RightForeArm, JOINT_INDEX.RightHand],
  shoulderL: [JOINT_INDEX.Spine1, JOINT_INDEX.LeftArm, JOINT_INDEX.LeftForeArm],
  shoulderR: [JOINT_INDEX.Spine1, JOINT_INDEX.RightArm, JOINT_INDEX.RightForeArm],
} as const;
