// BVH / CSV 导入导出
// 导入统一映射到 24 关节规范骨骼，缺失的扭转骨用父关节旋转填充（映射在设置里存一次以后自动用）
import type { MoCapRecord, PlatformInfo, Quat, SkeletonFrame, Vec3 } from './types';
import { JOINTS, JOINT_INDEX, buildSkeleton, type SkeletonSpec } from './skeleton';
import { q, quat, uid, v, vec } from './math';
import { detectAndRepair } from './processing';
import type { Athlete } from './types';

interface BvhJoint {
  name: string;
  offset: Vec3;
  children: number[];
  parent: number;
  channels: string[]; // 如 ['Zrotation','Xrotation','Yrotation']
}

interface ParsedBvh {
  joints: BvhJoint[];
  frameTime: number;
  frames: number[][];
}

function parseBvh(text: string): ParsedBvh {
  const tokens = text.split(/[\r\n]+/).flatMap((line) => line.trim().split(/\s+/));
  let p = 0;
  const expect = (s: string) => {
    if (tokens[p++].toUpperCase() !== s.toUpperCase()) throw new Error(`BVH 解析失败，期望 ${s}`);
  };

  expect('HIERARCHY');
  const joints: BvhJoint[] = [];
  const stack: number[] = [];

  const parseJoint = (isRoot: boolean) => {
    expect(isRoot ? 'ROOT' : 'JOINT');
    const name = tokens[p++];
    const id = joints.length;
    joints.push({ name, offset: v(), children: [], parent: -1, channels: [] });
    if (stack.length) {
      const parent = stack[stack.length - 1];
      joints[id].parent = parent;
      joints[parent].children.push(id);
    }
    expect('{');
    expect('OFFSET');
    joints[id].offset = v(Number(tokens[p++]), Number(tokens[p++]), Number(tokens[p++]));
    expect('CHANNELS');
    const n = Number(tokens[p++]);
    for (let i = 0; i < n; i++) joints[id].channels.push(tokens[p++]);
    while (tokens[p] !== '}') {
      if (tokens[p].toUpperCase() === 'JOINT') {
        stack.push(id);
        parseJoint(false);
        stack.pop();
      } else if (tokens[p].toUpperCase() === 'END') {
        // END SITE { OFFSET x y z }
        while (tokens[p].toUpperCase() !== '}') p++;
        p++; // 吃掉 }
      } else {
        p++;
      }
    }
    expect('}');
  };
  parseJoint(true);

  expect('MOTION');
  expect('FRAMES:');
  const frameCount = Number(tokens[p++]);
  expect('FRAME'); // FRAME TIME:
  expect('TIME:');
  const frameTime = Number(tokens[p++]);
  const channelCount = joints.reduce((s, j2) => s + j2.channels.length, 0);
  const rows: number[][] = [];
  for (let i = 0; i < frameCount; i++) {
    const row: number[] = [];
    for (let j = 0; j < channelCount; j++) {
      row.push(Number(tokens[p++]));
    }
    rows.push(row);
  }
  return { joints, frameTime, frames: rows };
}

function normName(s: string): string {
  return s.replace(/[\s_-]/g, '').toLowerCase();
}

/** 用厂商映射 + 别名模糊匹配，把 BVH 关节名映射到规范关节索引 */
function mapBvhJoints(
  parsed: ParsedBvh,
  profile?: Record<string, string>,
): Map<number, number> {
  const result = new Map<number, number>();
  const aliasIndex = new Map<string, number>();
  parsed.joints.forEach((j, i) => aliasIndex.set(normName(j.name), i));

  for (const canonical of JOINTS) {
    const cIdx = JOINT_INDEX[canonical];
    const candidates = [
      profile?.[canonical],
      canonical,
      // 常见命名变体
      canonical.replace('ForeTwist', 'ForeArm'),
      canonical.replace('CalfTwist', 'Leg'),
    ].filter(Boolean) as string[];
    for (const cand of candidates) {
      const hit = aliasIndex.get(normName(cand));
      if (hit !== undefined) {
        result.set(hit, cIdx);
        break;
      }
    }
  }
  return result;
}

export interface ImportOptions {
  athlete: Athlete;
  sessionId: string;
  diveCode: string;
  platform: PlatformInfo;
  boneProfile?: Record<string, string>;
  source: 'bvh' | 'csv';
}

export function importBvh(text: string, opts: ImportOptions): MoCapRecord {
  const parsed = parseBvh(text);
  const spec = buildSkeleton(opts.athlete);
  const mapping = mapBvhJoints(parsed, opts.boneProfile);
  const sampleRate = Math.round(1 / parsed.frameTime);

  // BVH 局部通道 -> 世界旋转（在 BVH 自身层级里做 FK），再写回规范骨骼的局部位姿
  const frames: SkeletonFrame[] = parsed.frames.map((row, fIdx) => {
    const worldRot: Quat[] = new Array(parsed.joints.length);
    const worldPos: Vec3[] = new Array(parsed.joints.length);
    let cursor = 0;
    const localRot: Quat[] = new Array(parsed.joints.length);
    const localPos: Vec3[] = [];
    const positions: Vec3[] = new Array(parsed.joints.length);

    for (let j = 0; j < parsed.joints.length; j++) {
      const ch = parsed.joints[j].channels;
      let rx = 0, ry = 0, rz = 0, px = 0, py = 0, pz = 0;
      // 严格按通道名取值，兼容任意通道排列（标准 BVH 旋转常为 Z X Y）
      for (const c of ch) {
        const val = Number(row[cursor++]);
        if (c === 'Xposition') px = val;
        else if (c === 'Yposition') py = val;
        else if (c === 'Zposition') pz = val;
        else if (c === 'Xrotation') rx = (val * Math.PI) / 180;
        else if (c === 'Yrotation') ry = (val * Math.PI) / 180;
        else if (c === 'Zrotation') rz = (val * Math.PI) / 180;
      }
      localRot[j] = quat.fromEuler(rx, ry, rz, 'YXZ');
      localPos[j] = v(px, py, pz);
    }
    for (let j = 0; j < parsed.joints.length; j++) {
      const parent = parsed.joints[j].parent;
      if (parent < 0) {
        worldRot[j] = localRot[j];
        worldPos[j] = localPos[j];
        positions[j] = localPos[j];
      } else {
        worldRot[j] = quat.mul(worldRot[parent], localRot[j]);
        positions[j] = vec.add(
          positions[parent],
          quat.rotateVec(worldRot[parent], parsed.joints[j].offset),
        );
        worldPos[j] = positions[j];
      }
    }

    const rotations: Quat[] = JOINTS.map(() => q());
    let rootPos = v();
    mapping.forEach((canonicalIdx, bvhIdx) => {
      rotations[canonicalIdx] = worldRot[bvhIdx];
      if (canonicalIdx === 0) rootPos = worldPos[bvhIdx];
    });
    // 扭转骨缺省时继承父关节旋转，避免出现零旋转导致的畸变
    inheritTwistBones(rotations);
    // 根位置通道缺失（如纯旋转层级导出再导入）时，用 FK 世界坐标兜底
    if (rootPos.x === 0 && rootPos.y === 0 && rootPos.z === 0 && mapping.size > 0) {
      const anyBvh = mapping.keys().next().value as number;
      rootPos = worldPos[anyBvh];
    }
    return { t: fIdx * parsed.frameTime, frame: fIdx, rootPosition: rootPos, rotations };
  });

  const record: MoCapRecord = {
    id: uid('rec_'),
    athleteId: opts.athlete.id,
    sessionId: opts.sessionId,
    diveCode: opts.diveCode.toUpperCase(),
    sampleRate,
    source: 'bvh',
    createdAt: Date.now(),
    frameCount: frames.length,
    platform: opts.platform,
    frames,
    events: { takeoffFrame: 0, apexFrame: 0, openFrame: 0, entryFrame: frames.length - 1 },
    quality: [],
    repaired: false,
  };
  return detectAndRepair(record, spec);
}

function inheritTwistBones(rot: Quat[]): void {
  const fill = (twist: number, parent: number) => {
    if (rot[twist].x === 0 && rot[twist].y === 0 && rot[twist].z === 0 && rot[twist].w === 1) {
      rot[twist] = { ...rot[parent] };
    }
  };
  fill(JOINT_INDEX.LeftForeTwist, JOINT_INDEX.LeftForeArm);
  fill(JOINT_INDEX.RightForeTwist, JOINT_INDEX.RightForeArm);
  fill(JOINT_INDEX.LeftCalfTwist, JOINT_INDEX.LeftLeg);
  fill(JOINT_INDEX.RightCalfTwist, JOINT_INDEX.RightLeg);
  if (rot[JOINT_INDEX.Pelvis].w === 1) rot[JOINT_INDEX.Pelvis] = { ...rot[0] };
}

// ---------------- CSV ----------------

/**
 * CSV 列：frame,t,rootX,rootY,rootZ,<Joint>.qx ... .qw [,<Joint>.px .py .pz]
 * 首行表头决定列含义，关节名走当前厂商映射
 */
export function importCsv(text: string, opts: ImportOptions): MoCapRecord {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const header = lines[0].split(',').map((h) => h.trim());
  const spec = buildSkeleton(opts.athlete);

  const col = (name: string) => header.findIndex((h) => h.toLowerCase() === name.toLowerCase());
  const jointCols = new Map<number, { qx: number; qy: number; qz: number; qw: number }>();
  for (const canonical of JOINTS) {
    const raw = opts.boneProfile?.[canonical] ?? canonical;
    const qx = col(`${raw}.qx`);
    if (qx >= 0) {
      jointCols.set(JOINT_INDEX[canonical], {
        qx,
        qy: qx + 1,
        qz: qx + 2,
        qw: qx + 3,
      });
    }
  }
  const tCol = col('t');
  const rx = col('rootx'), ry = col('rooty'), rz = col('rootz');

  const frames: SkeletonFrame[] = lines.slice(1).map((line, fIdx) => {
    const c = line.split(',');
    const rotations: Quat[] = JOINTS.map(() => q());
    jointCols.forEach((cols, j) => {
      rotations[j] = {
        x: Number(c[cols.qx]),
        y: Number(c[cols.qy]),
        z: Number(c[cols.qz]),
        w: Number(c[cols.qw]),
      };
    });
    inheritTwistBones(rotations);
    return {
      t: tCol >= 0 ? Number(c[tCol]) : fIdx / 240,
      frame: fIdx,
      rootPosition: v(
        rx >= 0 ? Number(c[rx]) : 0,
        ry >= 0 ? Number(c[ry]) : 0,
        rz >= 0 ? Number(c[rz]) : 0,
      ),
      rotations,
    };
  });

  const record: MoCapRecord = {
    id: uid('rec_'),
    athleteId: opts.athlete.id,
    sessionId: opts.sessionId,
    diveCode: opts.diveCode.toUpperCase(),
    sampleRate: 240,
    source: 'csv',
    createdAt: Date.now(),
    frameCount: frames.length,
    platform: opts.platform,
    frames,
    events: { takeoffFrame: 0, apexFrame: 0, openFrame: 0, entryFrame: frames.length - 1 },
    quality: [],
    repaired: false,
  };
  return detectAndRepair(record, spec);
}

// ---------------- 导出 ----------------

export function exportCsv(record: MoCapRecord, spec: SkeletonSpec): string {
  const header = [
    'frame', 't', 'rootX', 'rootY', 'rootZ',
    ...JOINTS.flatMap((j) => [`${j}.qx`, `${j}.qy`, `${j}.qz`, `${j}.qw`]),
  ];
  const rows = [header.join(',')];
  // 预计算世界坐标一并导出
  for (const f of record.frames) {
    const row: string[] = [
      String(f.frame),
      f.t.toFixed(5),
      f.rootPosition.x.toFixed(5),
      f.rootPosition.y.toFixed(5),
      f.rootPosition.z.toFixed(5),
    ];
    for (const r of f.rotations) {
      row.push(r.x.toFixed(6), r.y.toFixed(6), r.z.toFixed(6), r.w.toFixed(6));
    }
    rows.push(row.join(','));
  }
  void spec;
  return rows.join('\n');
}

export function exportBvh(record: MoCapRecord, spec: SkeletonSpec): string {
  const dt = 1 / record.sampleRate;
  const lines: string[] = ['HIERARCHY'];

  const writeJoint = (i: number, depth: number) => {
    const indent = '\t'.repeat(depth);
    const parent = spec.parents[i];
    const off = parent < 0 ? record.frames[0].rootPosition : spec.restOffsets[i];
    lines.push(`${indent}${parent < 0 ? 'ROOT' : 'JOINT'} ${spec.joints[i]}`);
    lines.push(`${indent}{`);
    lines.push(`${indent}\tOFFSET ${off.x.toFixed(5)} ${off.y.toFixed(5)} ${off.z.toFixed(5)}`);
    if (parent < 0) {
      lines.push(`${indent}\tCHANNELS 6 Xposition Yposition Zposition Zrotation Xrotation Yrotation`);
    } else {
      lines.push(`${indent}\tCHANNELS 3 Zrotation Xrotation Yrotation`);
    }
    const children = spec.parents.map((p, c) => (p === i ? c : -1)).filter((c) => c >= 0);
    if (children.length === 0) {
      lines.push(`${indent}\tEnd Site`);
      lines.push(`${indent}\t{`);
      lines.push(`${indent}\t\tOFFSET 0 0 0`);
      lines.push(`${indent}\t}`);
    } else {
      children.forEach((c) => writeJoint(c, depth + 1));
    }
    lines.push(`${indent}}`);
  };
  writeJoint(0, 0);

  lines.push('MOTION');
  lines.push(`Frames: ${record.frames.length}`);
  lines.push(`Frame Time: ${dt}`);
  for (const f of record.frames) {
    const row: string[] = [];
    for (let i = 0; i < spec.joints.length; i++) {
      const r = f.rotations[i];
      // 四元数 -> YXZ 欧拉（度），与导入侧一致
      const [rx, ry, rz] = quatToEulerYXZ(r);
      if (i === 0) {
        row.push(
          f.rootPosition.x.toFixed(5),
          f.rootPosition.y.toFixed(5),
          f.rootPosition.z.toFixed(5),
        );
      }
      row.push(
        ((rz * 180) / Math.PI).toFixed(4),
        ((rx * 180) / Math.PI).toFixed(4),
        ((ry * 180) / Math.PI).toFixed(4),
      );
    }
    lines.push(row.join(' '));
  }
  return lines.join('\n');
}

function quatToEulerYXZ(r: Quat): [number, number, number] {
  // 四元数 -> YXZ 内旋欧拉（q = qz·qx·qy，与 math.quat.fromEuler 的 YXZ 分支一致）
  // 矩阵元素：m12=2(yz-wx) m02=2(xz+wy) m22=1-2(x²+y²) m10=2(xy+wz) m11=1-2(x²+z²)
  const m12 = 2 * (r.y * r.z - r.w * r.x);
  const rx = Math.asin(Math.min(1, Math.max(-1, -m12)));
  const cosX = Math.cos(rx);
  let ry: number;
  let rz: number;
  if (Math.abs(cosX) > 1e-7) {
    const m02 = 2 * (r.x * r.z + r.w * r.y);
    const m22 = 1 - 2 * (r.x * r.x + r.y * r.y);
    const m10 = 2 * (r.x * r.y + r.w * r.z);
    const m11 = 1 - 2 * (r.x * r.x + r.z * r.z);
    ry = Math.atan2(m02, m22);
    rz = Math.atan2(m10, m11);
  } else {
    ry = 0;
    rz = Math.atan2(2 * (r.x * r.y - r.w * r.z), 1 - 2 * (r.x * r.x + r.z * r.z));
  }
  return [rx, ry, rz];
}
