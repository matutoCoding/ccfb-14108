// 三维标注层：评语 Sprite 与箭头，钉在骨骼节点上随运动更新
import * as THREE from 'three';
import type { Annotation } from '../core/types';
import type { Humanoid } from './Humanoid';
import { JOINT_INDEX } from '../core/skeleton';

export class AnnotationLayer {
  readonly group = new THREE.Group();
  private items: { ann: Annotation; obj: THREE.Object3D }[] = [];
  private humanoid: Humanoid;

  constructor(humanoid: Humanoid) {
    this.humanoid = humanoid;
  }

  setAnnotations(anns: Annotation[]): void {
    this.clear();
    for (const ann of anns) {
      const obj =
        ann.type === 'arrow' ? this.buildArrow(ann) : this.buildNote(ann);
      this.group.add(obj);
      this.items.push({ ann, obj });
    }
  }

  private buildNote(ann: Annotation): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 110;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(11,18,32,0.85)';
    ctx.strokeStyle = ann.color;
    ctx.lineWidth = 3;
    this.roundRect(ctx, 4, 4, 312, 102, 12);
    ctx.fill();
    ctx.stroke();
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = ann.color;
    this.wrapText(ctx, ann.text, 16, 40, 288, 30);
    const tex = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }),
    );
    sprite.scale.set(1.4, 0.48, 1);
    sprite.userData.jointId = ann.jointId ?? JOINT_INDEX.Hips;
    return sprite;
  }

  private buildArrow(ann: Annotation): THREE.ArrowHelper {
    const arrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(),
      0.5,
      new THREE.Color(ann.color).getHex(),
      0.12,
      0.07,
    );
    arrow.userData.jointId = ann.jointId ?? JOINT_INDEX.Hips;
    arrow.userData.toJointId = ann.toJointId;
    return arrow;
  }

  /** 每帧把标注跟随到当前骨骼节点世界位置 */
  update(): void {
    for (const { ann, obj } of this.items) {
      if (ann.type === 'note') {
        const joint = obj.userData.jointId as number;
        const p = this.humanoid.getBoneWorldPosition(joint);
        obj.position.set(p.x, p.y + 0.28, p.z);
      } else if (obj instanceof THREE.ArrowHelper) {
        const fromJ = obj.userData.jointId as number;
        const toJ = obj.userData.toJointId as number | undefined;
        const from = this.humanoid.getBoneWorldPosition(fromJ);
        if (toJ !== undefined) {
          const to = this.humanoid.getBoneWorldPosition(toJ);
          const dir = to.clone().sub(from);
          const len = dir.length();
          if (len > 1e-4) {
            obj.position.copy(from);
            obj.setDirection(dir.normalize());
            obj.setLength(len, 0.12, 0.07);
          }
        } else {
          obj.position.copy(from);
        }
      }
    }
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxW: number,
    lh: number,
  ): void {
    const chars = text.split('');
    let line = '';
    let yy = y;
    for (const ch of chars) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, yy);
        line = ch;
        yy += lh;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, x, yy);
  }

  private clear(): void {
    while (this.group.children.length) {
      const c = this.group.children.pop()!;
      this.group.remove(c);
      if (c instanceof THREE.Sprite) {
        (c.material as THREE.SpriteMaterial).map?.dispose();
        c.material.dispose();
      }
    }
    this.items = [];
  }
}
