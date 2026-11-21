// 局部姿态库:各姿态下关节的局部欧拉角(度),q = qX * qY * qZ
// 静止 T-pose:手臂沿 ±X,脊柱/腿沿 ±Y,正面朝 +Z
import { Joint } from './types';
import { qFromAxisAngle, qMultiply, qIdentity, deg2rad } from './math3d';
import type { Quat } from './math3d';

export type EulerDeg = [number, number, number];
export type PoseTable = Partial<Record<Joint, EulerDeg>>;

export function eulerToQuat([ex, ey, ez]: EulerDeg): Quat {
  const qx = qFromAxisAngle([1, 0, 0], deg2rad(ex));
  const qy = qFromAxisAngle([0, 1, 0], deg2rad(ey));
  const qz = qFromAxisAngle([0, 0, 1], deg2rad(ez));
  return qMultiply(qMultiply(qx, qy), qz);
}

/** 站立/起跳:双臂上举夹头,全身伸直 */
export const POSE_STAND: PoseTable = {
  [Joint.Spine]: [0, 0, 0],
  [Joint.Spine1]: [0, 0, 0],
  [Joint.Neck]: [0, 0, 0],
  [Joint.Head]: [0, 0, 0],
  [Joint.LeftShoulder]: [0, 0, 0],
  [Joint.LeftArm]: [0, 0, 96],
  [Joint.LeftForeArm]: [0, 0, 0],
  [Joint.LeftHand]: [0, 0, 0],
  [Joint.RightShoulder]: [0, 0, 0],
  [Joint.RightArm]: [0, 0, -96],
  [Joint.RightForeArm]: [0, 0, 0],
  [Joint.RightHand]: [0, 0, 0],
  [Joint.LeftUpLeg]: [0, 0, 0],
  [Joint.LeftLeg]: [0, 0, 0],
  [Joint.LeftFoot]: [55, 0, 0],
  [Joint.RightUpLeg]: [0, 0, 0],
  [Joint.RightLeg]: [0, 0, 0],
  [Joint.RightFoot]: [55, 0, 0],
};

/** 抱膝(C):髋屈、膝屈、团身、手臂抱小腿 */
export const POSE_TUCK: PoseTable = {
  [Joint.Spine]: [-22, 0, 0],
  [Joint.Spine1]: [-18, 0, 0],
  [Joint.Neck]: [10, 0, 0],
  [Joint.Head]: [8, 0, 0],
  [Joint.LeftArm]: [-125, 0, 92],
  [Joint.LeftForeArm]: [45, 0, 0],
  [Joint.LeftHand]: [0, 0, 0],
  [Joint.RightArm]: [-125, 0, -92],
  [Joint.RightForeArm]: [45, 0, 0],
  [Joint.RightHand]: [0, 0, 0],
  [Joint.LeftUpLeg]: [-108, 0, 0],
  [Joint.LeftLeg]: [128, 0, 0],
  [Joint.LeftFoot]: [40, 0, 0],
  [Joint.RightUpLeg]: [-108, 0, 0],
  [Joint.RightLeg]: [128, 0, 0],
  [Joint.RightFoot]: [40, 0, 0],
};

/** 屈体(B):髋屈、膝直、身体折叠、手臂向脚尖延伸 */
export const POSE_PIKE: PoseTable = {
  [Joint.Spine]: [-30, 0, 0],
  [Joint.Spine1]: [-28, 0, 0],
  [Joint.Neck]: [12, 0, 0],
  [Joint.Head]: [10, 0, 0],
  [Joint.LeftArm]: [-148, 0, 92],
  [Joint.LeftForeArm]: [0, 0, 0],
  [Joint.LeftHand]: [0, 0, 0],
  [Joint.RightArm]: [-148, 0, -92],
  [Joint.RightForeArm]: [0, 0, 0],
  [Joint.RightHand]: [0, 0, 0],
  [Joint.LeftUpLeg]: [-96, 0, 0],
  [Joint.LeftLeg]: [0, 0, 0],
  [Joint.LeftFoot]: [60, 0, 0],
  [Joint.RightUpLeg]: [-96, 0, 0],
  [Joint.RightLeg]: [0, 0, 0],
  [Joint.RightFoot]: [60, 0, 0],
};

/** 直体(A)/入水流线型:身体一条线,双臂夹紧上举,脚背绷直 */
export const POSE_ENTRY: PoseTable = {
  [Joint.Spine]: [0, 0, 0],
  [Joint.Spine1]: [0, 0, 0],
  [Joint.Neck]: [0, 0, 0],
  [Joint.Head]: [0, 0, 0],
  [Joint.LeftArm]: [0, 0, 96],
  [Joint.LeftForeArm]: [0, 0, 0],
  [Joint.LeftHand]: [0, 0, 0],
  [Joint.RightArm]: [0, 0, -96],
  [Joint.RightForeArm]: [0, 0, 0],
  [Joint.RightHand]: [0, 0, 0],
  [Joint.LeftUpLeg]: [0, 0, 0],
  [Joint.LeftLeg]: [0, 0, 0],
  [Joint.LeftFoot]: [72, 0, 0],
  [Joint.RightUpLeg]: [0, 0, 0],
  [Joint.RightLeg]: [0, 0, 0],
  [Joint.RightFoot]: [72, 0, 0],
};

export const POSES = {
  stand: POSE_STAND,
  tuck: POSE_TUCK,
  pike: POSE_PIKE,
  entry: POSE_ENTRY,
  layout: POSE_ENTRY,
} as const;

export type PoseName = keyof typeof POSES;

const cache = new Map<string, Quat>();

/** 取某姿态下某关节的局部旋转(带缓存) */
export function poseJointQuat(pose: PoseName, joint: Joint): Quat {
  const key = `${pose}:${joint}`;
  let q = cache.get(key);
  if (!q) {
    const e = POSES[pose][joint];
    q = e ? eulerToQuat(e) : qIdentity();
    cache.set(key, q);
  }
  return q;
}
