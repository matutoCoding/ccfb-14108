// 全局数据模型 —— 所有数据存 IndexedDB，不上传任何服务器

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Quat {
  x: number;
  y: number;
  z: number;
  w: number;
}

/** 一帧：根节点世界位置 + 每个关节的局部旋转（索引与规范骨骼 JOINT 顺序一致） */
export interface SkeletonFrame {
  /** 秒 */
  t: number;
  frame: number;
  rootPosition: Vec3;
  rotations: Quat[];
}

export type QualityKind = 'dropped' | 'flip';

/** 丢帧 / 关节翻转异常段落（导入时检出，补插值修复后仍保留标记，UI 标黄） */
export interface QualitySegment {
  startFrame: number;
  endFrame: number;
  kind: QualityKind;
  /** flip 时出问题的关节 id；dropped 为整帧缺失 */
  jointId?: number;
  repaired: boolean;
  note: string;
}

export interface DiveEvents {
  /** 离板帧 */
  takeoffFrame: number;
  /** 最高点帧（自动算，也允许手改） */
  apexFrame: number;
  /** 打开帧 */
  openFrame: number;
  /** 入水帧 */
  entryFrame: number;
}

export type DivePosition = 'A' | 'B' | 'C' | 'D';

export interface DiveCodeInfo {
  code: string;
  /** 动作组别 1..6 */
  group: number;
  /** 翻腾半周数（代码第二位/第三位原始数字） */
  halfSomersaults: number;
  /** 转体半周数（四位代码的第三位） */
  halfTwists: number;
  position: DivePosition;
  /** 翻腾总周数 */
  somersaults: number;
  /** 转体总周数 */
  twists: number;
  label: string;
}

export type MoCapSource = 'synthetic' | 'bvh' | 'csv';

export interface MoCapRecord {
  id: string;
  athleteId: string;
  sessionId: string;
  diveCode: string;
  sampleRate: number;
  source: MoCapSource;
  createdAt: number;
  frameCount: number;
  platform: PlatformInfo;
  frames: SkeletonFrame[];
  events: DiveEvents;
  quality: QualitySegment[];
  repaired: boolean;
  notes?: string;
}

export interface PlatformInfo {
  heightM: number;
  type: 'springboard' | 'platform';
  /** 每帧板尖下压量（米），与离板帧对齐；跳台为全 0 */
  boardDeflectionM?: number[];
}

export interface Athlete {
  id: string;
  name: string;
  gender: 'M' | 'F' | '';
  birthDate?: string;
  /** 身高 m */
  heightM: number;
  /** 臂展 m */
  armSpanM: number;
  /** 体重 kg */
  weightKg: number;
  createdAt: number;
}

export interface DiveLibraryEntry {
  code: string;
  dd: number;
  group: number;
  position: DivePosition;
  label: string;
  notes?: string;
}

export interface TrainingSession {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  title: string;
  athleteId: string;
  platform: PlatformInfo;
  /** 当天每一跳的 recordId，按顺序 */
  recordIds: string[];
  createdAt: number;
}

export type AnnotationType = 'note' | 'arrow';

export interface Annotation {
  id: string;
  recordId: string;
  frame: number;
  type: AnnotationType;
  /** 钉住的骨骼节点（跟随运动）；箭头用 fromJoint/toJoint 存关节 id */
  jointId?: number;
  toJointId?: number;
  text: string;
  color: string;
  createdAt: number;
}

export interface AngleThresholds {
  /** 团身：髋角小于该值 */
  tuckHipDeg: number;
  /** 团身：膝角小于该值 */
  tuckKneeDeg: number;
  /** 屈体：髋角小于该值（膝须伸直） */
  pikeHipDeg: number;
  /** 入水角合格阈值（偏离铅垂度数） */
  entryAngleDeg: number;
}

export interface AppSettings {
  sampleRate: number;
  thresholds: AngleThresholds;
  /** 厂商名 -> (规范关节名 -> 原始骨骼名) */
  boneMapProfiles: Record<string, Record<string, string>>;
  activeProfile: string;
}

/** 回放/分析中逐帧计算出的运动学指标 */
export interface FrameMetrics {
  frame: number;
  t: number;
  com: Vec3;
  comVelocity: Vec3;
  /** 累计翻腾角（弧度，带符号连续值） */
  somersaultAngle: number;
  /** 累计转体角（弧度，带符号连续值） */
  twistAngle: number;
  /** 瞬时翻腾角速度 rad/s */
  somersaultVel: number;
  /** 瞬时转体角速度 rad/s */
  twistVel: number;
  /** 骨盆世界朝向（用于相机、朝向参考） */
  pelvisQuat: Quat;
  /** 左/右 髋角 膝角 肘角 肩角（度） */
  hipL: number;
  hipR: number;
  kneeL: number;
  kneeR: number;
  elbowL: number;
  elbowR: number;
  shoulderL: number;
  shoulderR: number;
  /** 当前是否团身/屈体抱紧 */
  tight: boolean;
  /** 入水角（度，仅入水帧之后有意义） */
  entryAngleDeg?: number;
  /** 手掌先入水点相对骨盆入水点的水平偏移 m */
  handEntryOffset?: Vec3;
}
