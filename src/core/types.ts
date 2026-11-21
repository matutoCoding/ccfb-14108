// 全系统共享类型定义
import type { Quat, Vec3 } from './math3d';

/** 21 关节骨架索引(顺序即 BVH/数组中的关节顺序) */
export enum Joint {
  Hips = 0,
  Spine = 1,
  Spine1 = 2,
  Neck = 3,
  Head = 4,
  LeftShoulder = 5,
  LeftArm = 6,
  LeftForeArm = 7,
  LeftHand = 8,
  RightShoulder = 9,
  RightArm = 10,
  RightForeArm = 11,
  RightHand = 12,
  LeftUpLeg = 13,
  LeftLeg = 14,
  LeftFoot = 15,
  RightUpLeg = 16,
  RightLeg = 17,
  RightFoot = 18,
  Pelvis = 19,   // 骨盆朝向专用辅助关节(挂在 Hips 下)
  Chest = 20,    // 胸腔朝向辅助关节
}

export const JOINT_COUNT = 21;

/** 每跳动作:240Hz(可配)下的一整段动捕片段 */
export interface DiveClip {
  id: string;
  athleteId: string;
  diveCode: string;        // 如 107B
  sessionId: string;
  sampleRate: number;      // Hz,通常 240
  frameCount: number;
  /** 每帧根节点(Hips)世界位移,长度 frameCount*3 */
  rootPositions: Float32Array;
  /** 每帧每关节局部旋转(相对父关节),长度 frameCount*JOINT_COUNT*4,xyzw */
  localRotations: Float32Array;
  /** 关键事件帧(可被教练手动覆盖);-1 表示未识别 */
  takeoffFrame: number;    // 离板
  entryFrame: number;      // 入水
  apexFrame: number;       // 最高点(自动计算)
  openFrame: number;       // 打开(自动计算,可手动覆盖)
  /** 数据缺陷段落(丢帧/关节翻转),时间轴标黄 */
  defects: ClipDefect[];
  /** 插值修复记录(与 defects 对应) */
  repaired: ClipDefect[];
  createdAt: number;
  note?: string;
}

export interface ClipDefect {
  type: 'drop' | 'flip';
  jointId: number;        // drop 时可为 -1(整帧)
  startFrame: number;
  endFrame: number;
}

/** 队员档案 */
export interface Athlete {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  heightCm: number;       // 身高
  armSpanCm: number;      // 臂展
  weightKg: number;       // 体重
  team: string;
  createdAt: number;
}

/** 动作库条目(按跳水动作代码归档) */
export interface DiveDefinition {
  code: string;           // 107B / 5253B
  group: number;          // 1-6 组
  name: string;           // 向前翻腾三周半屈体
  somersaults: number;    // 翻腾周数(可为半周,如 3.5)
  twists: number;         // 转体周数
  position: 'A' | 'B' | 'C' | 'D'; // 直体/屈体/抱膝/任意
  dd: number;             // 难度系数
  platform: 'spring' | 'platform' | 'both';
}

/** 训练课:按日期串起当天每一跳 */
export interface TrainingSession {
  id: string;
  date: string;           // YYYY-MM-DD
  venue: string;
  platformHeight: number; // 米, 1 / 3 / 5 / 7.5 / 10
  boardType: 'spring' | 'platform';
  note: string;
  clipIds: string[];
  createdAt: number;
}

/** 帧标注:评语或箭头,钉在关节/世界坐标上随骨骼运动 */
export interface Annotation {
  id: string;
  clipId: string;
  frame: number;
  kind: 'comment' | 'arrow';
  text?: string;
  anchorJoint: number;    // 钉住的关节 id
  /** 箭头终点(相对锚点的世界偏移,米);comment 时忽略 */
  offset?: Vec3;
  color: string;
  createdAt: number;
}

/** 关节角度阈值等可配置项 */
export interface ThresholdSettings {
  tuckKneeDeg: number;        // 抱膝:膝关节角小于此值算抱紧
  tuckHipDeg: number;         // 抱膝:髋关节角小于此值算抱紧
  pikeHipDeg: number;         // 屈体:髋关节角小于此值算抱紧
  entryVerticalDeg: number;   // 入水:身体偏离铅垂告警阈值
  boardFlexMm: number;        // 跳板下压参考量
}

export interface AppSettings {
  sampleRate: number;
  thresholds: ThresholdSettings;
  /** 厂商骨骼名 -> 本系统关节索引 的映射,按厂商名存多套 */
  boneMaps: Record<string, Record<string, number>>;
  activeBoneMap: string;
  waterLevelY: number;        // 水面世界高度(米)
  comTrailStep: number;       // 残影每隔 N 帧
  ghostAlpha: number;
}

/** 每帧分析指标(惰性计算并缓存) */
export interface FrameMetrics {
  com: Vec3;                       // 全身重心
  pelvisUp: Vec3;                  // 骨盆纵轴(世界)
  pelvisForward: Vec3;             // 骨盆朝向(世界)
  somersaultCumDeg: number;        // 累计翻腾角(度,有符号)
  twistCumDeg: number;             // 累计转体角(度,有符号)
  kneeAngles: [number, number];    // 左右膝角
  hipAngles: [number, number];     // 左右髋角
  isTight: boolean;                // 当前帧是否抱紧(按阈值)
  angularVelocity: number;         // 骨盆角速度 rad/s(用于残影着色)
}

export interface DiveAnalysis {
  metrics: FrameMetrics[];
  entryAngleDeg: number;           // 入水瞬间身体偏离铅垂
  handEntryOffset: Vec3;           // 手掌先入水点相对骨盆入水点的水平偏移
  somersaultTurns: number;         // 全程翻腾圈数(带符号)
  twistTurns: number;              // 全程转体圈数
  apexToOpenMs: number;            // 打开相对最高点的时间差(正=晚于最高点)
  maxAngularVelocity: number;
}

export type PoseFrame = {
  rootPos: Vec3;
  joints: Quat[]; // JOINT_COUNT 个局部旋转
};
