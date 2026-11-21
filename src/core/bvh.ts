// BVH 导入/导出:解析层级与 MOTION 通道,经骨骼名映射进入本系统 21 关节骨架
import { Joint, JOINT_COUNT } from './types';
import type { DiveClip } from './types';
import { JOINT_NAMES, JOINT_PARENT, restOffsets, BUILTIN_BONE_MAPS } from './skeleton';
import { qFromAxisAngle, qMultiply, deg2rad, clamp } from './math3d';
import type { Quat } from './math3d';

interface BvhJoint {
  name: string;
  offset: [number, number, number];
  children: number[];
  parent: number;
  channels: string[];      // 如 ['Zrotation','Xrotation','Yrotation']
  channelOffset: number;   // 在帧通道数组中的起始下标
  isEndSite: boolean;
}

export interface BvhParseResult {
  clip: DiveClip;
  unresolvedBones: string[];   // 未映射上的骨骼名(设置页提示手动对一次)
  frameTime: number;
}

/** 解析 BVH 文本。boneMap:外部骨骼名 -> 本系统关节索引 */
export function parseBVH(
  text: string,
  meta: { athleteId: string; diveCode: string; sessionId: string; id: string },
  boneMap?: Record<string, number>,
): BvhParseResult {
  const tokens = text.split(/[\r\n]+/).flatMap((line) => line.trim().split(/\s+/)).filter(Boolean);
  let pos = 0;
  const expect = (w: string) => {
    if (tokens[pos++] !== w) throw new Error(`BVH 解析失败:期望 ${w},实际 ${tokens[pos - 1] ?? 'EOF'}`);
  };

  expect('HIERARCHY');
  const joints: BvhJoint[] = [];

  function parseNode(parent: number): number {
    const kw = tokens[pos++]; // ROOT / JOINT
    if (kw !== 'ROOT' && kw !== 'JOINT') throw new Error(`BVH 解析失败:非法节点关键字 ${kw}`);
    const name = tokens[pos++];
    const idx = joints.push({
      name, offset: [0, 0, 0], children: [], parent,
      channels: [], channelOffset: -1, isEndSite: false,
    }) - 1;
    if (parent >= 0) joints[parent].children.push(idx);
    expect('{');
    expect('OFFSET');
    joints[idx].offset = [Number(tokens[pos++]), Number(tokens[pos++]), Number(tokens[pos++])];
    if (tokens[pos] === 'CHANNELS') {
      pos++;
      const chCount = Number(tokens[pos++]);
      joints[idx].channels = tokens.slice(pos, pos + chCount);
      pos += chCount;
    }
    // 子节点:JOINT 递归,End Site 整体跳过
    while (tokens[pos] === 'JOINT' || (tokens[pos] === 'End' && tokens[pos + 1] === 'Site')) {
      if (tokens[pos] === 'End') {
        pos += 2; // End Site
        expect('{');
        expect('OFFSET');
        pos += 3;
        expect('}');
      } else {
        parseNode(idx);
      }
    }
    expect('}');
    return idx;
  }
  parseNode(-1);

  expect('MOTION');
  expect('Frames:');
  const frameCount = Number(tokens[pos++]);
  expect('Frame'); expect('Time:');
  const frameTime = Number(tokens[pos++]);
  const sampleRate = Math.round(1 / frameTime);

  // —— 骨骼名映射 ——(根节点强制对应 Hips)
  const map = boneMap ?? buildAutoMap(joints);
  const unresolvedBones: string[] = [];
  const extToSys = new Map<number, number>();
  joints.forEach((j, idx) => {
    if (idx === 0) {
      extToSys.set(0, Joint.Hips);
      return;
    }
    const mapped = map[j.name] ?? map[stripPrefix(j.name)];
    if (mapped === undefined) {
      unresolvedBones.push(j.name);
      return;
    }
    extToSys.set(idx, mapped);
  });

  // 每个节点在帧通道数组中的起始下标(按层级出现顺序累加)
  let channelCursor = 0;
  for (const j of joints) {
    j.channelOffset = channelCursor;
    channelCursor += j.channels.length;
  }
  const totalChannels = channelCursor;

  const frames: number[][] = [];
  for (let f = 0; f < frameCount; f++) {
    const row: number[] = [];
    for (let c = 0; c < totalChannels; c++) row.push(Number(tokens[pos++]));
    frames.push(row);
  }

  const rootPositions = new Float32Array(frameCount * 3);
  const localRotations = new Float32Array(frameCount * JOINT_COUNT * 4);
  const rootExt = joints[0];

  for (let f = 0; f < frameCount; f++) {
    const row = frames[f];
    // 根位移(厘米 -> 米)
    let tx = 0, ty = 0, tz = 0;
    rootExt.channels.forEach((ch, i) => {
      const v = row[rootExt.channelOffset + i] / 100;
      if (ch === 'Xposition') tx = v;
      if (ch === 'Yposition') ty = v;
      if (ch === 'Zposition') tz = v;
    });
    rootPositions[f * 3] = tx;
    rootPositions[f * 3 + 1] = ty;
    rootPositions[f * 3 + 2] = tz;

    for (const [extIdx, sysJ] of extToSys) {
      const ej = joints[extIdx];
      const qChannels = ej.channels.filter((c) => c.startsWith('Q'));
      const o = (f * JOINT_COUNT + sysJ) * 4;
      if (qChannels.length === 4) {
        // 四元数通道 Qx Qy Qz Qw:按通道名显式定位列
        const qi = (name: string) => ej.channelOffset + ej.channels.indexOf(name);
        localRotations[o] = row[qi('Qx')];
        localRotations[o + 1] = row[qi('Qy')];
        localRotations[o + 2] = row[qi('Qz')];
        localRotations[o + 3] = row[qi('Qw')];
      } else {
        // 标准欧拉旋转通道(如 Zrotation Xrotation Yrotation),按通道顺序相乘
        const rotBase = ej.channelOffset + ej.channels.findIndex((c) => c.endsWith('rotation'));
        const rotDeg: Record<string, number> = {};
        ej.channels.forEach((ch, i) => {
          if (ch.endsWith('rotation')) rotDeg[ch[0]] = row[rotBase + i];
        });
        let q: Quat = [0, 0, 0, 1];
        for (const ch of ej.channels) {
          if (!ch.endsWith('rotation')) continue;
          const axis = ch[0] === 'X' ? [1, 0, 0] as const : ch[0] === 'Y' ? [0, 1, 0] as const : [0, 0, 1] as const;
          q = qMultiply(q, qFromAxisAngle([...axis], deg2rad(rotDeg[ch[0]])));
        }
        localRotations[o] = q[0]; localRotations[o + 1] = q[1];
        localRotations[o + 2] = q[2]; localRotations[o + 3] = q[3];
      }
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
  return { clip, unresolvedBones, frameTime };
}

function stripPrefix(name: string): string {
  const i = name.lastIndexOf(':');
  return i >= 0 ? name.slice(i + 1) : name;
}

/** 自动映射:精确名 -> 去前缀名 -> 内置表 */
function buildAutoMap(joints: BvhJoint[]): Record<string, number> {
  const map: Record<string, number> = {};
  const nameToSys = new Map<string, number>();
  JOINT_NAMES.forEach((n, i) => nameToSys.set(n.toLowerCase(), i));
  const allBuiltin = { ...BUILTIN_BONE_MAPS.mixamo, ...BUILTIN_BONE_MAPS.generic };
  for (const j of joints) {
    if (j.isEndSite) continue;
    const direct = nameToSys.get(j.name.toLowerCase()) ?? nameToSys.get(stripPrefix(j.name).toLowerCase());
    if (direct !== undefined) map[j.name] = direct;
    else if (allBuiltin[j.name] !== undefined) map[j.name] = allBuiltin[j.name];
  }
  return map;
}

/** 导出 BVH:本系统 21 关节骨架写出标准层级,旋转用 ZYX Euler(度),位移厘米 */
export function writeBVH(clip: DiveClip, dim: { height: number; armSpan: number }): string {
  const offsets = restOffsets({ height: dim.height, armSpan: dim.armSpan, weight: 0 });
  const lines: string[] = [];
  const indent = (d: number) => '\t'.repeat(d);

  function writeJoint(j: number, depth: number, isRoot: boolean): void {
    const name = JOINT_NAMES[j];
    const off = offsets[j].map((v) => (v * 100).toFixed(3));
    if (isRoot) {
      lines.push(`${indent(depth)}ROOT ${name}`);
    } else {
      lines.push(`${indent(depth)}JOINT ${name}`);
    }
    lines.push(`${indent(depth)}{`);
    lines.push(`${indent(depth + 1)}OFFSET ${off.join(' ')}`);
    if (isRoot) {
      lines.push(`${indent(depth + 1)}CHANNELS 7 Xposition Yposition Zposition Qx Qy Qz Qw`);
    } else {
      lines.push(`${indent(depth + 1)}CHANNELS 4 Qx Qy Qz Qw`);
    }
    const kids = childrenOf(j);
    if (kids.length === 0) {
      // End Site:沿关节方向延伸 5cm
      lines.push(`${indent(depth + 1)}End Site`);
      lines.push(`${indent(depth + 1)}{`);
      const endY = j === Joint.Head ? 10 : -5;
      lines.push(`${indent(depth + 2)}OFFSET 0.000 ${endY.toFixed(3)} 0.000`);
      lines.push(`${indent(depth + 1)}}`);
    } else {
      kids.forEach((k) => writeJoint(k, depth + 1, false));
    }
    lines.push(`${indent(depth)}}`);
  }
  function childrenOf(j: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < JOINT_COUNT; i++) if (JOINT_PARENT[i] === j) out.push(i);
    return out;
  }

  lines.push('HIERARCHY');
  writeJoint(Joint.Hips, 0, true);
  lines.push('MOTION');
  lines.push(`Frames: ${clip.frameCount}`);
  lines.push(`Frame Time: ${(1 / clip.sampleRate).toFixed(6)}`);

  for (let f = 0; f < clip.frameCount; f++) {
    const row: number[] = [
      clip.rootPositions[f * 3] * 100,
      clip.rootPositions[f * 3 + 1] * 100,
      clip.rootPositions[f * 3 + 2] * 100,
    ];
    for (let j = 0; j < JOINT_COUNT; j++) {
      const o = (f * JOINT_COUNT + j) * 4;
      row.push(
        clip.localRotations[o],
        clip.localRotations[o + 1],
        clip.localRotations[o + 2],
        clip.localRotations[o + 3],
      );
    }
    lines.push(row.map((v) => v.toFixed(6)).join(' '));
  }
  return lines.join('\n');
}
