// 骨架层级定义:父关节、静止姿态偏移(按身高/臂展参数化)、关节质量权重、多厂商骨骼名
import { Joint, JOINT_COUNT } from './types';
import type { Vec3 } from './math3d';

export const JOINT_PARENT: number[] = (() => {
  const p = new Array<number>(JOINT_COUNT).fill(-1);
  p[Joint.Hips] = -1;
  p[Joint.Pelvis] = Joint.Hips;
  p[Joint.Spine] = Joint.Hips;
  p[Joint.Spine1] = Joint.Spine;
  p[Joint.Chest] = Joint.Spine1;
  p[Joint.Neck] = Joint.Spine1;
  p[Joint.Head] = Joint.Neck;
  p[Joint.LeftShoulder] = Joint.Spine1;
  p[Joint.LeftArm] = Joint.LeftShoulder;
  p[Joint.LeftForeArm] = Joint.LeftArm;
  p[Joint.LeftHand] = Joint.LeftForeArm;
  p[Joint.RightShoulder] = Joint.Spine1;
  p[Joint.RightArm] = Joint.RightShoulder;
  p[Joint.RightForeArm] = Joint.RightArm;
  p[Joint.RightHand] = Joint.RightForeArm;
  p[Joint.LeftUpLeg] = Joint.Hips;
  p[Joint.LeftLeg] = Joint.LeftUpLeg;
  p[Joint.LeftFoot] = Joint.LeftLeg;
  p[Joint.RightUpLeg] = Joint.Hips;
  p[Joint.RightLeg] = Joint.RightUpLeg;
  p[Joint.RightFoot] = Joint.RightLeg;
  return p;
})();

export const JOINT_NAMES: string[] = [
  'Hips', 'Spine', 'Spine1', 'Neck', 'Head',
  'LeftShoulder', 'LeftArm', 'LeftForeArm', 'LeftHand',
  'RightShoulder', 'RightArm', 'RightForeArm', 'RightHand',
  'LeftUpLeg', 'LeftLeg', 'LeftFoot',
  'RightUpLeg', 'RightLeg', 'RightFoot',
  'Pelvis', 'Chest',
];

/** 各关节的人体质量占比(用于重心),合计 1;Pelvis/Chest/辅助节点权重为 0 */
export const JOINT_MASS_WEIGHTS: number[] = (() => {
  const w = new Array<number>(JOINT_COUNT).fill(0);
  w[Joint.Hips] = 0.10;
  w[Joint.Spine] = 0.10;
  w[Joint.Spine1] = 0.22;   // 躯干主体
  w[Joint.Head] = 0.08;
  w[Joint.LeftArm] = 0.028; w[Joint.RightArm] = 0.028;
  w[Joint.LeftForeArm] = 0.016; w[Joint.RightForeArm] = 0.016;
  w[Joint.LeftHand] = 0.006; w[Joint.RightHand] = 0.006;
  w[Joint.LeftUpLeg] = 0.10; w[Joint.RightUpLeg] = 0.10;
  w[Joint.LeftLeg] = 0.045; w[Joint.RightLeg] = 0.045;
  w[Joint.LeftFoot] = 0.015; w[Joint.RightFoot] = 0.015;
  const sum = w.reduce((a, b) => a + b, 0);
  return w.map((x) => x / sum);
})();

export interface BodyDimensions {
  height: number;   // m
  armSpan: number;  // m
  weight: number;   // kg
}

/**
 * 静止姿态(T-pose)下各关节相对父节点的局部偏移(米)。
 * 以身高 h、臂展 s 参数化,比例参考人体测量常用系数。
 */
export function restOffsets(dim: BodyDimensions): Vec3[] {
  const h = dim.height;
  const s = dim.armSpan;
  const halfShoulder = s * 0.118;          // 肩宽≈0.236 臂展
  const upperArm = s * 0.185;              // 上臂长
  const foreArm = s * 0.165;               // 前臂长(含腕)
  const hand = s * 0.105 * 0.5;            // 手长
  const hipWidth = h * 0.062;              // 半髋宽
  const thigh = h * 0.245;
  const shin = h * 0.246;
  const footH = h * 0.039;
  const footLen = h * 0.083;
  const off: Vec3[] = new Array(JOINT_COUNT);
  for (let i = 0; i < JOINT_COUNT; i++) off[i] = [0, 0, 0];

  off[Joint.Hips] = [0, h * 0.521, 0];                       // 髋点高度
  off[Joint.Pelvis] = [0, -h * 0.035, 0];
  off[Joint.Spine] = [0, h * 0.118, 0];
  off[Joint.Spine1] = [0, h * 0.118, 0];
  off[Joint.Chest] = [0, h * 0.05, 0];
  off[Joint.Neck] = [0, h * 0.079, 0];
  off[Joint.Head] = [0, h * 0.094, 0];

  off[Joint.LeftShoulder] = [halfShoulder * 0.55, h * 0.03, 0];
  off[Joint.LeftArm] = [halfShoulder * 0.55, 0, 0];
  off[Joint.LeftForeArm] = [upperArm, 0, 0];
  off[Joint.LeftHand] = [foreArm, 0, 0];
  // 末端手再加一节偏移用于渲染/入水点
  off[Joint.LeftHand] = [foreArm + hand * 0, 0, 0];

  off[Joint.RightShoulder] = [-halfShoulder * 0.55, h * 0.03, 0];
  off[Joint.RightArm] = [-halfShoulder * 0.55, 0, 0];
  off[Joint.RightForeArm] = [-upperArm, 0, 0];
  off[Joint.RightHand] = [-foreArm, 0, 0];

  off[Joint.LeftUpLeg] = [hipWidth, -h * 0.02, 0];
  off[Joint.LeftLeg] = [0, -thigh, 0];
  off[Joint.LeftFoot] = [0, -shin, 0];
  // 脚的指向用末端延伸长度表达(沿局部 +Z),关节点本身位于踝

  off[Joint.RightUpLeg] = [-hipWidth, -h * 0.02, 0];
  off[Joint.RightLeg] = [0, -thigh, 0];
  off[Joint.RightFoot] = [0, -shin, 0];

  // 末端关节的渲染延伸长度(脚/手/头),存在单独表
  void footLen;
  return off;
}

/** 末端关节向外延伸的长度(渲染胶囊与入水点用) */
export function endEffectorLengths(dim: BodyDimensions): Record<number, number> {
  const h = dim.height;
  const s = dim.armSpan;
  return {
    [Joint.Head]: h * 0.094,
    [Joint.LeftHand]: s * 0.105,
    [Joint.RightHand]: s * 0.105,
    [Joint.LeftFoot]: h * 0.083,
    [Joint.RightFoot]: h * 0.083,
  };
}

/** 不同厂商 BVH 骨骼名 -> 本系统关节名 的内置映射表(设置页可扩展/覆盖) */
export const BUILTIN_BONE_MAPS: Record<string, Record<string, number>> = {
  // Mixamo / 通用人形
  mixamo: {
    Hips: Joint.Hips, Spine: Joint.Spine, Spine1: Joint.Spine1, Spine2: Joint.Spine1,
    Neck: Joint.Neck, Head: Joint.Head,
    LeftShoulder: Joint.LeftShoulder, LeftArm: Joint.LeftArm,
    LeftForeArm: Joint.LeftForeArm, LeftHand: Joint.LeftHand,
    RightShoulder: Joint.RightShoulder, RightArm: Joint.RightArm,
    RightForeArm: Joint.RightForeArm, RightHand: Joint.RightHand,
    LeftUpLeg: Joint.LeftUpLeg, LeftLeg: Joint.LeftLeg, LeftFoot: Joint.LeftFoot,
    RightUpLeg: Joint.RightUpLeg, RightLeg: Joint.RightLeg, RightFoot: Joint.RightFoot,
  },
  // 常见国产动捕导出(带前缀)
  generic: {
    'mixamorig:Hips': Joint.Hips, 'mixamorig:Spine': Joint.Spine, 'mixamorig:Spine1': Joint.Spine1,
    'mixamorig:Neck': Joint.Neck, 'mixamorig:Head': Joint.Head,
    'mixamorig:LeftShoulder': Joint.LeftShoulder, 'mixamorig:LeftArm': Joint.LeftArm,
    'mixamorig:LeftForeArm': Joint.LeftForeArm, 'mixamorig:LeftHand': Joint.LeftHand,
    'mixamorig:RightShoulder': Joint.RightShoulder, 'mixamorig:RightArm': Joint.RightArm,
    'mixamorig:RightForeArm': Joint.RightForeArm, 'mixamorig:RightHand': Joint.RightHand,
    'mixamorig:LeftUpLeg': Joint.LeftUpLeg, 'mixamorig:LeftLeg': Joint.LeftLeg,
    'mixamorig:LeftFoot': Joint.LeftFoot,
    'mixamorig:RightUpLeg': Joint.RightUpLeg, 'mixamorig:RightLeg': Joint.RightLeg,
    'mixamorig:RightFoot': Joint.RightFoot,
  },
};

/** 根据世界坐标快速取骨骼方向时用到的"肢体对子"(近端关节 -> 远端关节) */
export const LIMB_PAIRS: ReadonlyArray<readonly [Joint, Joint]> = [
  [Joint.LeftArm, Joint.LeftForeArm], [Joint.LeftForeArm, Joint.LeftHand],
  [Joint.RightArm, Joint.RightForeArm], [Joint.RightForeArm, Joint.RightHand],
  [Joint.LeftUpLeg, Joint.LeftLeg], [Joint.LeftLeg, Joint.LeftFoot],
  [Joint.RightUpLeg, Joint.RightLeg], [Joint.RightLeg, Joint.RightFoot],
  [Joint.Spine1, Joint.Neck],
];
