// CSV 关节数据导入/导出
// 导出格式(每行一帧):
// frame,time,root_x,root_y,root_z,<Joint>_qx..qw ×21
// 同时兼容只含位置的简化 CSV(外部系统导出):<Joint>_x/y/z,缺失旋转按静止姿态处理
import { Joint, JOINT_COUNT } from './types';
import type { DiveClip } from './types';
import { JOINT_NAMES } from './skeleton';
import { qIdentity } from './math3d';

export interface CsvParseResult {
  clip: DiveClip;
  warnings: string[];
}

export function writeCSV(clip: DiveClip): string {
  const header = ['frame', 'time', 'root_x', 'root_y', 'root_z'];
  for (const name of JOINT_NAMES) {
    header.push(`${name}_qx`, `${name}_qy`, `${name}_qz`, `${name}_qw`);
  }
  const rows: string[] = [header.join(',')];
  for (let f = 0; f < clip.frameCount; f++) {
    const row: string[] = [
      String(f),
      (f / clip.sampleRate).toFixed(5),
      clip.rootPositions[f * 3].toFixed(5),
      clip.rootPositions[f * 3 + 1].toFixed(5),
      clip.rootPositions[f * 3 + 2].toFixed(5),
    ];
    for (let j = 0; j < JOINT_COUNT; j++) {
      const o = (f * JOINT_COUNT + j) * 4;
      row.push(
        clip.localRotations[o].toFixed(6),
        clip.localRotations[o + 1].toFixed(6),
        clip.localRotations[o + 2].toFixed(6),
        clip.localRotations[o + 3].toFixed(6),
      );
    }
    rows.push(row.join(','));
  }
  return rows.join('\n');
}

export function parseCSV(
  text: string,
  meta: { athleteId: string; diveCode: string; sessionId: string; id: string; sampleRate?: number },
): CsvParseResult {
  const warnings: string[] = [];
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = lines[0].split(',').map((h) => h.trim());
  const col = (name: string) => header.findIndex((h) => h.toLowerCase() === name.toLowerCase());

  const frameCount = lines.length - 1;
  const rootPositions = new Float32Array(frameCount * 3);
  const localRotations = new Float32Array(frameCount * JOINT_COUNT * 4);
  // 默认单位旋转
  for (let f = 0; f < frameCount; f++) {
    for (let j = 0; j < JOINT_COUNT; j++) {
      const q = qIdentity();
      const o = (f * JOINT_COUNT + j) * 4;
      localRotations[o] = q[0]; localRotations[o + 1] = q[1];
      localRotations[o + 2] = q[2]; localRotations[o + 3] = q[3];
    }
  }

  const cRx = col('root_x'), cRy = col('root_y'), cRz = col('root_z');
  const cTime = col('time');
  let sampleRate = meta.sampleRate ?? 240;

  const quatCols = JOINT_NAMES.map((name) => ({
    joint: JOINT_NAMES.indexOf(name) as Joint,
    qx: col(`${name}_qx`), qy: col(`${name}_qy`), qz: col(`${name}_qz`), qw: col(`${name}_qw`),
  }));
  const hasQuat = quatCols.some((c) => c.qw >= 0);
  if (!hasQuat) warnings.push('未检测到旋转四元数列,已按静止 T-pose 填充旋转(仅有位置数据)');

  for (let f = 0; f < frameCount; f++) {
    const cells = lines[f + 1].split(',').map((c) => c.trim());
    const num = (idx: number) => (idx >= 0 ? Number(cells[idx]) : NaN);
    rootPositions[f * 3] = num(cRx);
    rootPositions[f * 3 + 1] = num(cRy);
    rootPositions[f * 3 + 2] = num(cRz);
    for (const c of quatCols) {
      if (c.qw < 0) continue;
      const o = (f * JOINT_COUNT + c.joint) * 4;
      localRotations[o] = num(c.qx);
      localRotations[o + 1] = num(c.qy);
      localRotations[o + 2] = num(c.qz);
      localRotations[o + 3] = num(c.qw);
    }
    if (f === 1 && cTime >= 0) {
      const dt = Number(cells[cTime]);
      if (dt > 0) sampleRate = Math.round(1 / dt);
    }
  }

  const clip: DiveClip = {
    id: meta.id,
    athleteId: meta.athleteId,
    diveCode: meta.diveCode,
    sessionId: meta.sessionId,
    sampleRate,
    frameCount,
    rootPositions,
    localRotations,
    takeoffFrame: -1,
    entryFrame: -1,
    apexFrame: -1,
    openFrame: -1,
    defects: [],
    repaired: [],
    createdAt: Date.now(),
  };
  return { clip, warnings };
}
