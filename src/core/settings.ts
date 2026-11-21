// 默认设置与常量
import type { AppSettings } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  sampleRate: 240,
  thresholds: {
    // 与姿态库匹配:抱紧时膝≈52°、抱髋≈83°、屈髋≈96°;留合理余量
    tuckKneeDeg: 75,
    tuckHipDeg: 95,
    pikeHipDeg: 120,
    entryVerticalDeg: 15,
    boardFlexMm: 200,
  },
  boneMaps: {},
  activeBoneMap: 'mixamo',
  waterLevelY: 0,
  comTrailStep: 12,
  ghostAlpha: 0.35,
};

/** 跳板/跳台真实尺寸(米),依据 FINA 设施规范 */
export const BOARD_SPECS = {
  spring: {
    length: 4.8, width: 0.5, thickness: 0.05,
    heights: [1, 3],
    label: '弹簧跳板',
  },
  platform: {
    length: 6.0, width: 3.0, thickness: 0.2,
    heights: [5, 7.5, 10],
    label: '跳台',
  },
} as const;

/** 泳池与场馆参考尺寸(米) */
export const VENUE = {
  poolWidth: 12,
  poolLength: 16,
  poolDepth: 5,
  judgeDistance: 4.5,   // 裁判席距板端正前方
  judgeHeight: 2.2,
} as const;
