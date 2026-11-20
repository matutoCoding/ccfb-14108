// 全局默认设置与动作代码解析
import type { AppSettings, DiveCodeInfo, DivePosition } from './types';
import { JOINTS } from './skeleton';

export const DEFAULT_SETTINGS: AppSettings = {
  sampleRate: 240,
  thresholds: {
    tuckHipDeg: 90,
    tuckKneeDeg: 70,
    pikeHipDeg: 90,
    entryAngleDeg: 15,
  },
  activeProfile: 'generic',
  boneMapProfiles: {
    // 通用别名表：规范关节名 -> 常见厂商 BVH 关节名（导入时大小写/空格不敏感匹配）
    generic: Object.fromEntries(
      [...JOINTS].map((j) => [j, j]),
    ) as Record<string, string>,
    noitom: {
      Hips: 'Hips',
      Spine: 'Spine',
      Spine1: 'Spine1',
      Neck: 'Neck',
      Head: 'Head',
      LeftShoulder: 'LeftShoulder',
      LeftArm: 'LeftArm',
      LeftForeArm: 'LeftForeArm',
      LeftForeTwist: 'LeftForeArm',
      LeftHand: 'LeftHand',
      RightShoulder: 'RightShoulder',
      RightArm: 'RightArm',
      RightForeArm: 'RightForeArm',
      RightForeTwist: 'RightForeArm',
      RightHand: 'RightHand',
      LeftUpLeg: 'LeftUpLeg',
      LeftLeg: 'LeftLeg',
      LeftCalfTwist: 'LeftLeg',
      LeftFoot: 'LeftFoot',
      RightUpLeg: 'RightUpLeg',
      RightLeg: 'RightLeg',
      RightCalfTwist: 'RightLeg',
      RightFoot: 'RightFoot',
      Pelvis: 'Hips',
    },
    xsens: {
      Hips: 'pelvis',
      Spine: 'spine',
      Spine1: 'chest',
      Neck: 'neck',
      Head: 'head',
      LeftShoulder: 'left_collar',
      LeftArm: 'left_upper_arm',
      LeftForeArm: 'left_forearm',
      LeftForeTwist: 'left_forearm',
      LeftHand: 'left_hand',
      RightShoulder: 'right_collar',
      RightArm: 'right_upper_arm',
      RightForeArm: 'right_forearm',
      RightForeTwist: 'right_forearm',
      RightHand: 'right_hand',
      LeftUpLeg: 'left_upper_leg',
      LeftLeg: 'left_lower_leg',
      LeftCalfTwist: 'left_lower_leg',
      LeftFoot: 'left_foot',
      RightUpLeg: 'right_upper_leg',
      RightLeg: 'right_lower_leg',
      RightCalfTwist: 'right_lower_leg',
      RightFoot: 'right_foot',
      Pelvis: 'pelvis',
    },
  },
};

const GROUP_LABEL: Record<number, string> = {
  1: '向前',
  2: '向后',
  3: '反身',
  4: '向内',
  5: '转体',
  6: '臂立',
};

const POSITION_LABEL: Record<DivePosition, string> = {
  A: '直体',
  B: '屈体',
  C: '团身',
  D: '任意',
};

/**
 * 解析跳水动作代码
 * 三位：107B / 205C —— 组(1-4,6) 0 翻腾半周数 姿势
 * 四位：5253B —— 5 飞行动作组 翻腾半周数 转体半周数 姿势
 */
export function parseDiveCode(code: string): DiveCodeInfo {
  const c = code.trim().toUpperCase();
  if (!/^[1-6]\d{2,3}[A-D]$/.test(c)) throw new Error(`无法识别的动作代码: ${code}`);
  const position = c.slice(-1) as DivePosition;
  const digits = c.slice(0, -1);
  const group = Number(digits[0]);

  let halfSomersaults: number;
  let halfTwists = 0;
  if (digits.length === 3) {
    halfSomersaults = Number(digits[2]);
  } else {
    halfSomersaults = Number(digits[2]);
    halfTwists = Number(digits[3]);
  }
  const somersaults = halfSomersaults / 2;
  const twists = halfTwists / 2;
  const label =
    group === 5
      ? `${GROUP_LABEL[5]} ${GROUP_LABEL[Number(digits[1])] ?? ''} ${somersaults} 周翻腾 ${twists} 周转体 ${POSITION_LABEL[position]}`
      : `${GROUP_LABEL[group] ?? ''} ${somersaults} 周翻腾 ${POSITION_LABEL[position]}`;

  return { code: c, group, halfSomersaults, halfTwists, position, somersaults, twists, label };
}

// 常用动作难度系数（FINA 规则表节选；表中没有的按线性估计兜底）
const DD_TABLE: Record<string, number> = {
  '101B': 1.3, '103B': 1.6, '105B': 2.6, '107B': 3.0,
  '201B': 1.8, '203B': 2.3, '205B': 2.9, '205C': 2.8, '207C': 3.3,
  '301B': 1.9, '303B': 2.4, '305B': 3.0, '305C': 2.8,
  '401B': 1.5, '403B': 2.0, '405B': 2.7, '405C': 2.7,
  '5152B': 2.9, '5253B': 3.2, '5337D': 3.4, '5255B': 3.6,
};

export function difficultyOf(code: string): number {
  const info = parseDiveCode(code);
  if (DD_TABLE[info.code]) return DD_TABLE[info.code];
  // 兜底估计：翻腾每半周 +0.35，转体每半周 +0.2，姿势微调
  const posAdj = { A: 0.2, B: 0, C: -0.1, D: 0 }[info.position];
  return Math.round((1.2 + info.halfSomersaults * 0.35 + info.halfTwists * 0.2 + posAdj) * 10) / 10;
}
