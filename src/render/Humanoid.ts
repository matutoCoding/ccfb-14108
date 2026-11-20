// 蒙皮人体：胶囊段 + 刚性绑定（rigid skinning）
// 关键：每段几何体只挂一个骨骼权重，前臂/小腿的扭转全部由独立扭转骨承担，
// 蒙皮本身永远不做沿长轴的扭曲插值 —— 从机制上杜绝糖纸效应
import * as THREE from 'three';
import type { SkeletonFrame } from '../core/types';
import type { SkeletonSpec } from '../core/skeleton';
import { JOINT_INDEX } from '../core/skeleton';

const UP = new THREE.Vector3(0, 1, 0);

export class Humanoid {
  readonly root = new THREE.Group();
  private bones: THREE.Bone[] = [];
  private meshes: THREE.SkinnedMesh[] = [];
  private spec: SkeletonSpec;
  private material: THREE.MeshStandardMaterial;
  private skeleton: THREE.Skeleton;
  private twistBoneIds: Set<number>;

  constructor(spec: SkeletonSpec, color = 0x3b82f6) {
    this.spec = spec;
    this.material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.55,
      metalness: 0.08,
    });
    this.twistBoneIds = new Set([
      JOINT_INDEX.LeftForeTwist,
      JOINT_INDEX.RightForeTwist,
      JOINT_INDEX.LeftCalfTwist,
      JOINT_INDEX.RightCalfTwist,
    ]);
    this.buildBones();
    this.skeleton = new THREE.Skeleton(this.bones);
    // 先把骨骼层级挂进 root，再绑定蒙皮；否则 bind() 时 boneInverses 拿不到 matrixWorld
    this.bones.forEach((b) => {
      if (!b.parent) this.root.add(b);
    });
    this.root.updateMatrixWorld(true);
    this.buildSkin();
  }

  setColor(color: number, opacity = 1): void {
    this.material.color.setHex(color);
    this.material.transparent = opacity < 1;
    this.material.opacity = opacity;
    this.material.depthWrite = opacity >= 0.95;
  }

  setWireframe(on: boolean): void {
    this.material.wireframe = on;
  }

  private buildBones(): void {
    this.bones = this.spec.joints.map((name) => {
      const b = new THREE.Bone();
      b.name = name;
      return b;
    });
    this.spec.parents.forEach((parent, i) => {
      if (parent < 0) this.root.add(this.bones[i]);
      else this.bones[parent].add(this.bones[i]);
    });
  }

  private segmentRadius(i: number): number {
    const name = this.spec.joints[i];
    if (name.includes('Hand')) return 0.028;
    if (name.includes('Twist')) return 0.036;
    if (name.includes('ForeArm')) return 0.038;
    if (name.includes('Arm')) return 0.052;
    if (name.includes('Foot')) return 0.045;
    if (name.includes('Leg')) return 0.055;
    if (name.includes('UpLeg')) return 0.075;
    if (name === 'Head') return 0.095;
    if (name === 'Neck') return 0.05;
    if (name === 'Pelvis') return 0.01;
    return 0.085;
  }

  /** 生成受单个骨骼刚性驱动的蒙皮网格 */
  private rigidMesh(geometry: THREE.BufferGeometry, driverBone: number): THREE.SkinnedMesh {
    const count = geometry.attributes.position.count;
    // three 的 SkinnedMesh 固定按 4 分量读取 skinIndex/skinWeight，必须用 itemSize=4
    const idx = new Float32Array(count * 4);
    const wt = new Float32Array(count * 4);
    for (let k = 0; k < count; k++) {
      idx[k * 4] = driverBone;
      wt[k * 4] = 1;
    }
    geometry.setAttribute('skinIndex', new THREE.BufferAttribute(idx, 4));
    geometry.setAttribute('skinWeight', new THREE.BufferAttribute(wt, 4));
    const mesh = new THREE.SkinnedMesh(geometry, this.material);
    mesh.bind(this.skeleton);
    mesh.frustumCulled = false;
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 1, 0), 4);
    this.meshes.push(mesh);
    this.root.add(mesh);
    return mesh;
  }

  private buildSkin(): void {
    // 胶囊段：位于父关节与本关节之间，受父骨骼驱动（扭转骨不生成可见几何）
    for (let i = 1; i < this.bones.length; i++) {
      if (this.twistBoneIds.has(i) || this.spec.joints[i] === 'Pelvis') continue;
      const parent = this.spec.parents[i];
      const off = new THREE.Vector3(
        this.spec.restOffsets[i].x,
        this.spec.restOffsets[i].y,
        this.spec.restOffsets[i].z,
      );
      const len = off.length();
      const radius = this.segmentRadius(i);
      const geom = new THREE.CapsuleGeometry(
        radius,
        Math.max(0.001, len - 2 * radius),
        6,
        12,
      );
      const dir = off.clone().normalize();
      geom.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, dir));
      geom.translate(off.x / 2, off.y / 2, off.z / 2);
      this.rigidMesh(geom, parent < 0 ? i : parent);
    }

    // 关节球：受自身关节骨骼驱动
    for (let i = 0; i < this.bones.length; i++) {
      if (this.twistBoneIds.has(i) || this.spec.joints[i] === 'Pelvis') continue;
      const r = this.segmentRadius(i) * 0.95;
      const geom = new THREE.SphereGeometry(r, 14, 10);
      this.rigidMesh(geom, i);
    }
  }

  /** 每帧更新：根位置 + 各关节局部旋转 */
  update(frame: SkeletonFrame): void {
    this.root.position.set(
      frame.rootPosition.x,
      frame.rootPosition.y,
      frame.rootPosition.z,
    );
    for (let i = 0; i < this.bones.length; i++) {
      const r = frame.rotations[i];
      if (!r) continue;
      this.bones[i].quaternion.set(r.x, r.y, r.z, r.w);
    }
    this.root.updateMatrixWorld(true);
  }

  getBoneWorldPosition(jointId: number, out = new THREE.Vector3()): THREE.Vector3 {
    return this.bones[jointId].getWorldPosition(out);
  }

  getBoneWorldQuaternion(jointId: number, out = new THREE.Quaternion()): THREE.Quaternion {
    return this.bones[jointId].getWorldQuaternion(out);
  }

  /** 某一帧所有关节的世界坐标快照（用于轻量残影，不复制几何/材质） */
  snapshotPositions(frame: SkeletonFrame): THREE.Vector3[] {
    this.update(frame);
    return this.bones.map((b) => b.getWorldPosition(new THREE.Vector3()));
  }

  dispose(): void {
    this.meshes.forEach((m) => m.geometry.dispose());
    this.material.dispose();
  }
}
