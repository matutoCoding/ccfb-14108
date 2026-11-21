// 蒙皮人体:按身高/臂展参数化,含 Swing-Twist 扭转约束(前臂/大腿防糖纸效应)
import * as THREE from 'three';
import { Joint, JOINT_COUNT } from '../core/types';
import { JOINT_PARENT, JOINT_NAMES, restOffsets, endEffectorLengths } from '../core/skeleton';
import { qSwingTwist } from '../core/math3d';
import type { Quat, Vec3 } from '../core/math3d';

/** 允许扭转的关节及最大扭转角(弧度),超过部分被限制 */
const TWIST_LIMITS: Partial<Record<Joint, number>> = {
  [Joint.LeftForeArm]: THREE.MathUtils.degToRad(85),
  [Joint.RightForeArm]: THREE.MathUtils.degToRad(85),
  [Joint.LeftUpLeg]: THREE.MathUtils.degToRad(45),
  [Joint.RightUpLeg]: THREE.MathUtils.degToRad(45),
  [Joint.LeftArm]: THREE.MathUtils.degToRad(60),
  [Joint.RightArm]: THREE.MathUtils.degToRad(60),
};

/** 关节局部纵轴(扭转约束轴,静止姿态方向) */
const JOINT_TWIST_AXIS: Partial<Record<Joint, Vec3>> = {
  [Joint.LeftArm]: [1, 0, 0], [Joint.LeftForeArm]: [1, 0, 0], [Joint.LeftHand]: [1, 0, 0],
  [Joint.RightArm]: [-1, 0, 0], [Joint.RightForeArm]: [-1, 0, 0], [Joint.RightHand]: [-1, 0, 0],
  [Joint.LeftUpLeg]: [0, -1, 0], [Joint.LeftLeg]: [0, -1, 0], [Joint.LeftFoot]: [0, -1, 0],
  [Joint.RightUpLeg]: [0, -1, 0], [Joint.RightLeg]: [0, -1, 0], [Joint.RightFoot]: [0, -1, 0],
  [Joint.Spine]: [0, 1, 0], [Joint.Spine1]: [0, 1, 0], [Joint.Neck]: [0, 1, 0],
};

export interface SkinnedFigure {
  root: THREE.Group;
  bones: THREE.Bone[];
  /** 应用一帧局部旋转(已做扭转约束)与根位移 */
  applyFrame(rootPos: Vec3, localQuats: Quat[]): void;
  setOpacity(alpha: number): void;
  setColor(hex: number): void;
  dispose(): void;
}

const BONE_RADII: Record<number, number> = {
  [Joint.Hips]: 0.075, [Joint.Spine]: 0.07, [Joint.Spine1]: 0.085, [Joint.Neck]: 0.045,
  [Joint.Head]: 0.09,
  [Joint.LeftShoulder]: 0.05, [Joint.LeftArm]: 0.045, [Joint.LeftForeArm]: 0.038, [Joint.LeftHand]: 0.03,
  [Joint.RightShoulder]: 0.05, [Joint.RightArm]: 0.045, [Joint.RightForeArm]: 0.038, [Joint.RightHand]: 0.03,
  [Joint.LeftUpLeg]: 0.06, [Joint.LeftLeg]: 0.05, [Joint.LeftFoot]: 0.035,
  [Joint.RightUpLeg]: 0.06, [Joint.RightLeg]: 0.05, [Joint.RightFoot]: 0.035,
};

export function createFigure(
  dim: { height: number; armSpan: number; weight: number },
  color = 0x3b82f6,
): SkinnedFigure {
  const offsets = restOffsets(dim);
  const endLen = endEffectorLengths(dim);
  const root = new THREE.Group();
  const bones: THREE.Bone[] = [];
  const meshes: THREE.Mesh[] = [];
  const mat = new THREE.MeshStandardMaterial({
    color, roughness: 0.55, metalness: 0.08, transparent: true,
  });

  // 1) 建骨骼层级
  for (let j = 0; j < JOINT_COUNT; j++) {
    const bone = new THREE.Bone();
    bone.name = JOINT_NAMES[j];
    bone.position.fromArray(offsets[j]);
    bones.push(bone);
  }
  for (let j = 0; j < JOINT_COUNT; j++) {
    const p = JOINT_PARENT[j];
    if (p >= 0) bones[p].add(bones[j]);
  }
  root.add(bones[Joint.Hips]);

  // 2) 每段骨骼建连接体(胶囊),两端关节点建球体
  const sphereGeo = new THREE.SphereGeometry(1, 16, 12);
  for (let j = 0; j < JOINT_COUNT; j++) {
    const parent = JOINT_PARENT[j];
    if (parent < 0) continue;
    const from = new THREE.Vector3(...offsets[parent]);
    const to = new THREE.Vector3(...offsets[j]);
    const len = from.distanceTo(to);
    if (len < 1e-4) continue;
    const radius = BONE_RADII[j] ?? 0.04;
    const geo = new THREE.CapsuleGeometry(radius, Math.max(0.01, len - radius * 2), 6, 12);
    const mesh = new THREE.Mesh(geo, mat);
    // 胶囊默认沿 Y,把它对齐到骨段方向
    mesh.position.copy(from).add(to).multiplyScalar(0.5);
    const dir = to.clone().sub(from).normalize();
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    // 挂到父骨骼下,位置转父局部坐标
    bones[parent].add(mesh);
    mesh.position.copy(to.clone().sub(from).multiplyScalar(0.5));
    meshes.push(mesh);
  }
  // 关节球 + 末端延伸(头/手/脚)
  for (let j = 0; j < JOINT_COUNT; j++) {
    const r = BONE_RADII[j] ?? 0.04;
    const jointMesh = new THREE.Mesh(sphereGeo, mat);
    jointMesh.scale.setScalar(r * 1.15);
    bones[j].add(jointMesh);
    meshes.push(jointMesh);
    if (endLen[j]) {
      const axis = j === Joint.Head ? [0, 1, 0]
        : (j === Joint.LeftHand || j === Joint.RightHand)
          ? (j === Joint.LeftHand ? [1, 0, 0] : [-1, 0, 0])
          : [0, 0, 1]; // 脚沿 +Z
      const geo = new THREE.CapsuleGeometry(r * 0.9, Math.max(0.02, endLen[j] - r), 6, 12);
      const ext = new THREE.Mesh(geo, mat);
      ext.position.set(axis[0] * endLen[j] * 0.5, axis[1] * endLen[j] * 0.5, axis[2] * endLen[j] * 0.5);
      ext.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(...axis).normalize(),
      );
      bones[j].add(ext);
      meshes.push(ext);
    }
  }

  const tmpQ = new THREE.Quaternion();
  const constrainedQ = (j: Joint, q: Quat): Quat => {
    const limit = TWIST_LIMITS[j];
    const axis = JOINT_TWIST_AXIS[j];
    if (!limit || !axis) return q;
    const { twist, swing } = qSwingTwist(q, axis);
    // 限制 twist 的角度分量
    const twAngle = 2 * Math.atan2(
      Math.hypot(twist[0], twist[1], twist[2]), twist[3],
    );
    if (twAngle <= limit) return q;
    const clamped = twAngle > 0 ? limit : -limit;
    const n: Vec3 = [axis[0], axis[1], axis[2]];
    const h = clamped / 2;
    const s = Math.sin(h);
    const limitedTwist: Quat = [n[0] * s, n[1] * s, n[2] * s, Math.cos(h)];
    // q = swing * twist
    return [
      swing[3] * limitedTwist[0] + swing[0] * limitedTwist[3] + swing[1] * limitedTwist[2] - swing[2] * limitedTwist[1],
      swing[3] * limitedTwist[1] - swing[0] * limitedTwist[2] + swing[1] * limitedTwist[3] + swing[2] * limitedTwist[0],
      swing[3] * limitedTwist[2] + swing[0] * limitedTwist[1] - swing[1] * limitedTwist[0] + swing[2] * limitedTwist[3],
      swing[3] * limitedTwist[3] - swing[0] * limitedTwist[0] - swing[1] * limitedTwist[1] - swing[2] * limitedTwist[2],
    ];
  };

  return {
    root,
    bones,
    applyFrame(rootPos, localQuats) {
      root.position.set(rootPos[0], rootPos[1], rootPos[2]);
      for (let j = 0; j < JOINT_COUNT; j++) {
        const q = constrainedQ(j, localQuats[j]);
        tmpQ.set(q[0], q[1], q[2], q[3]);
        bones[j].quaternion.copy(tmpQ);
      }
      root.updateMatrixWorld(true);
    },
    setOpacity(alpha) {
      mat.opacity = alpha;
      mat.depthWrite = alpha >= 0.95;
    },
    setColor(hex) {
      mat.color.setHex(hex);
    },
    dispose() {
      meshes.forEach((m) => { m.geometry.dispose(); });
      sphereGeo.dispose();
      mat.dispose();
    },
  };
}
