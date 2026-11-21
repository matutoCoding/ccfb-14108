// 纯数值三维数学:向量/四元数均用普通数组表示,不依赖 three.js,便于 Node 下单元验证
// 四元数约定 [x, y, z, w]

export type Vec3 = [number, number, number];
export type Quat = [number, number, number, number];
export type Mat4 = Float32Array; // 列主序 4x4

export const v3 = (x = 0, y = 0, z = 0): Vec3 => [x, y, z];
export const qIdentity = (): Quat => [0, 0, 0, 1];

export function vAdd(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
export function vSub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
export function vScale(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s];
}
export function vDot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
export function vCross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
export function vLen(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2]);
}
export function vNormalize(a: Vec3): Vec3 {
  const l = vLen(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
}
export function vLerp(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}
/** 两向量夹角(度),0~180 */
export function vAngleDeg(a: Vec3, b: Vec3): number {
  const d = Math.max(-1, Math.min(1, vDot(a, b) / ((vLen(a) || 1) * (vLen(b) || 1))));
  return (Math.acos(d) * 180) / Math.PI;
}

export function qNormalize(q: Quat): Quat {
  const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
}
/** 四元数乘法 a*b(先 b 后 a) */
export function qMultiply(a: Quat, b: Quat): Quat {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}
export function qInverse(q: Quat): Quat {
  return [-q[0], -q[1], -q[2], q[3]]; // 单位四元数
}
export function qFromAxisAngle(axis: Vec3, angleRad: number): Quat {
  const n = vNormalize(axis);
  const h = angleRad / 2;
  const s = Math.sin(h);
  return [n[0] * s, n[1] * s, n[2] * s, Math.cos(h)];
}
export function qRotateVec(q: Quat, v: Vec3): Vec3 {
  // q * v * q^-1
  const qv: Quat = [v[0], v[1], v[2], 0];
  const r = qMultiply(qMultiply(q, qv), qInverse(q));
  return [r[0], r[1], r[2]];
}
export function qSlerp(a: Quat, b: Quat, t: number): Quat {
  let [bx, by, bz, bw] = b;
  let cos = a[0] * bx + a[1] * by + a[2] * bz + a[3] * bw;
  if (cos < 0) {
    // 走最短弧
    bx = -bx; by = -by; bz = -bz; bw = -bw;
    cos = -cos;
  }
  if (cos > 0.9995) {
    return qNormalize([
      a[0] + (bx - a[0]) * t,
      a[1] + (by - a[1]) * t,
      a[2] + (bz - a[2]) * t,
      a[3] + (bw - a[3]) * t,
    ]);
  }
  const theta = Math.acos(Math.min(1, cos));
  const s = Math.sin(theta);
  const wa = Math.sin((1 - t) * theta) / s;
  const wb = Math.sin(t * theta) / s;
  return [
    a[0] * wa + bx * wb,
    a[1] * wa + by * wb,
    a[2] * wa + bz * wb,
    a[3] * wa + bw * wb,
  ];
}
/** 绕 Y 轴(偏航)便捷构造 */
export function qYaw(rad: number): Quat {
  return qFromAxisAngle([0, 1, 0], rad);
}

/**
 * Swing-Twist 分解:把 q 分解为 绕指定轴 axis 的扭转(twist) 和 剩余摆动(swing)
 * 返回 { twist, swing },q = swing * twist
 */
export function qSwingTwist(q: Quat, axis: Vec3): { twist: Quat; swing: Quat } {
  const n = vNormalize(axis);
  const projection: Vec3 = [n[0] * (q[0] * n[0] + q[1] * n[1] + q[2] * n[2]),
    n[1] * (q[0] * n[0] + q[1] * n[1] + q[2] * n[2]),
    n[2] * (q[0] * n[0] + q[1] * n[1] + q[2] * n[2])];
  let twist: Quat = qNormalize([projection[0], projection[1], projection[2], q[3]]);
  // 数值退化保护
  if (Math.hypot(projection[0], projection[1], projection[2]) < 1e-8) twist = qIdentity();
  const swing = qMultiply(q, qInverse(twist));
  return { twist, swing };
}

/** twist 分量绕 axis 的有符号角度(弧度) */
export function twistAngle(q: Quat, axis: Vec3): number {
  const n = vNormalize(axis);
  const d = q[0] * n[0] + q[1] * n[1] + q[2] * n[2];
  return 2 * Math.atan2(d, q[3]);
}

/** 角度解包裹:把 incoming 角度序列约束为连续(弧度) */
export function unwrap(prev: number, next: number): number {
  let d = next - prev;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return prev + d;
}

export function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
export function deg2rad(d: number): number { return (d * Math.PI) / 180; }
export function rad2deg(r: number): number { return (r * 180) / Math.PI; }
