// 自研三维数学库（不依赖 three.js，可在 Node 测试中直接用）
// 坐标系：Y 向上，X 向跳板前方（跳水池方向），Z 侧向，右手系
import type { Quat, Vec3 } from './types';

export const v = (x = 0, y = 0, z = 0): Vec3 => ({ x, y, z });
export const q = (x = 0, y = 0, z = 0, w = 1): Quat => ({ x, y, z, w });

export const vec = {
  add: (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
  sub: (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
  scale: (a: Vec3, s: number): Vec3 => ({ x: a.x * s, y: a.y * s, z: a.z * s }),
  dot: (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z,
  cross: (a: Vec3, b: Vec3): Vec3 => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }),
  len: (a: Vec3): number => Math.hypot(a.x, a.y, a.z),
  dist: (a: Vec3, b: Vec3): number => vec.len(vec.sub(a, b)),
  norm(a: Vec3): Vec3 {
    const l = vec.len(a) || 1;
    return { x: a.x / l, y: a.y / l, z: a.z / l };
  },
  lerp: (a: Vec3, b: Vec3, t: number): Vec3 => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  }),
  neg: (a: Vec3): Vec3 => ({ x: -a.x, y: -a.y, z: -a.z }),
};

export const quat = {
  identity: (): Quat => ({ x: 0, y: 0, z: 0, w: 1 }),

  /** 绕任意单位轴旋转 angle 弧度 */
  fromAxisAngle(axis: Vec3, angle: number): Quat {
    const n = vec.norm(axis);
    const h = angle * 0.5;
    const s = Math.sin(h);
    return { x: n.x * s, y: n.y * s, z: n.z * s, w: Math.cos(h) };
  },

  /** 欧拉角（弧度），顺序 YXZ（three.js 兼容，BVH 常用） */
  fromEuler(rx: number, ry: number, rz: number, order = 'YXZ'): Quat {
    const cx = Math.cos(rx / 2), sx = Math.sin(rx / 2);
    const cy = Math.cos(ry / 2), sy = Math.sin(ry / 2);
    const cz = Math.cos(rz / 2), sz = Math.sin(rz / 2);
    switch (order) {
      case 'XYZ':
        return quat.mul(
          quat.fromAxisAngle(v(0, 0, 1), rz),
          quat.mul(quat.fromAxisAngle(v(0, 1, 0), ry), quat.fromAxisAngle(v(1, 0, 0), rx)),
        );
      case 'ZYX':
        return quat.mul(
          quat.fromAxisAngle(v(1, 0, 0), rx),
          quat.mul(quat.fromAxisAngle(v(0, 1, 0), ry), quat.fromAxisAngle(v(0, 0, 1), rz)),
        );
      case 'ZXY':
        return quat.mul(
          quat.fromAxisAngle(v(0, 1, 0), ry),
          quat.mul(quat.fromAxisAngle(v(1, 0, 0), rx), quat.fromAxisAngle(v(0, 0, 1), rz)),
        );
      case 'YZX':
        return quat.mul(
          quat.fromAxisAngle(v(1, 0, 0), rx),
          quat.mul(quat.fromAxisAngle(v(0, 0, 1), rz), quat.fromAxisAngle(v(0, 1, 0), ry)),
        );
      case 'XZY':
        return quat.mul(
          quat.fromAxisAngle(v(0, 1, 0), ry),
          quat.mul(quat.fromAxisAngle(v(0, 0, 1), rz), quat.fromAxisAngle(v(1, 0, 0), rx)),
        );
      case 'YXZ':
      default:
        return quat.mul(
          quat.fromAxisAngle(v(0, 0, 1), rz),
          quat.mul(quat.fromAxisAngle(v(1, 0, 0), rx), quat.fromAxisAngle(v(0, 1, 0), ry)),
        );
    }
  },

  mul(a: Quat, b: Quat): Quat {
    return {
      x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
      y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
      z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
      w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    };
  },

  conj(a: Quat): Quat {
    return { x: -a.x, y: -a.y, z: -a.z, w: a.w };
  },

  norm(a: Quat): Quat {
    const l = Math.hypot(a.x, a.y, a.z, a.w) || 1;
    return { x: a.x / l, y: a.y / l, z: a.z / l, w: a.w / l };
  },

  /** 球面线性插值；t 可超出 [0,1] 用于外推 */
  slerp(a: Quat, b: Quat, t: number): Quat {
    let cosom = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    let bb = b;
    if (cosom < 0) {
      cosom = -cosom;
      bb = { x: -b.x, y: -b.y, z: -b.z, w: -b.w };
    }
    if (cosom > 0.9995) {
      return quat.norm({
        x: a.x + (bb.x - a.x) * t,
        y: a.y + (bb.y - a.y) * t,
        z: a.z + (bb.z - a.z) * t,
        w: a.w + (bb.w - a.w) * t,
      });
    }
    const theta0 = Math.acos(Math.min(1, cosom));
    const theta = theta0 * t;
    const sin0 = Math.sin(theta0);
    const s1 = Math.cos(theta) - (cosom * Math.sin(theta)) / sin0;
    const s0 = Math.sin(theta) / sin0;
    return {
      x: s1 * a.x + s0 * bb.x,
      y: s1 * a.y + s0 * bb.y,
      z: s1 * a.z + s0 * bb.z,
      w: s1 * a.w + s0 * bb.w,
    };
  },

  rotateVec(a: Quat, p: Vec3): Vec3 {
    // q * p * q^-1 的展开形式
    const u = v(a.x, a.y, a.z);
    const dot = vec.dot(u, p);
    const cross = vec.cross(u, p);
    return {
      x: 2 * dot * u.x + (a.w * a.w - vec.dot(u, u)) * p.x + 2 * a.w * cross.x,
      y: 2 * dot * u.y + (a.w * a.w - vec.dot(u, u)) * p.y + 2 * a.w * cross.y,
      z: 2 * dot * u.z + (a.w * a.w - vec.dot(u, u)) * p.z + 2 * a.w * cross.z,
    };
  },

  /** 世界系下的姿态差：delta = qTo * qFrom^-1 */
  delta(from: Quat, to: Quat): Quat {
    return quat.mul(to, quat.conj(from));
  },

  /** 旋转量在指定世界轴上的有符号角（弧度，范围 (-π, π]） */
  angleAroundAxis(delta: Quat, axis: Vec3): number {
    const n = vec.norm(axis);
    const w = Math.min(1, Math.max(-1, delta.w));
    const ang = 2 * Math.acos(Math.abs(w));
    // 旋转轴方向：取 delta 向量部（与轴同向时为正）
    const vPart = v(delta.x, delta.y, delta.z);
    const sign = vec.dot(vPart, n) >= 0 ? 1 : -1;
    return ang * sign;
  },
};

/** 解包裹：把跳变到 ±π 的角度序列接成连续值 */
export function unwrapAngles(angles: number[]): number[] {
  const out: number[] = [angles[0] ?? 0];
  for (let i = 1; i < angles.length; i++) {
    let d = angles[i] - angles[i - 1];
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    out.push(out[i - 1] + d);
  }
  return out;
}

export const rad2deg = (r: number): number => (r * 180) / Math.PI;
export const deg2rad = (d: number): number => (d * Math.PI) / 180;
export const clamp = (x: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, x));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** 两段向量夹角（度，0..180） */
export function angleBetween(a: Vec3, b: Vec3): number {
  const na = vec.norm(a);
  const nb = vec.norm(b);
  const c = clamp(vec.dot(na, nb), -1, 1);
  return rad2deg(Math.acos(c));
}

export function uid(prefix = ''): string {
  return prefix + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}
