// 对比场景:两跳按离板帧对齐,同一套骨骼一实一虚,或左右分屏同步
import * as THREE from 'three';
import { Joint, JOINT_COUNT } from '../core/types';
import type { DiveClip, DiveAnalysis, Athlete, AppSettings } from '../core/types';
import { createFigure, type SkinnedFigure } from './figure';
import type { Quat, Vec3 } from '../core/math3d';

export type CompareLayout = 'overlay' | 'split';

export interface CompareSource {
  clip: DiveClip;
  athlete: Athlete;
  analysis: DiveAnalysis;
}

export class CompareScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, 1, 0.05, 100);
  private figA: SkinnedFigure;
  private figB: SkinnedFigure;
  private layout: CompareLayout = 'overlay';
  private raf = 0;
  private disposed = false;
  private frame = 0;
  private playing = false;
  private lastTime = 0;
  private accumulator = 0;
  private speed = 1;
  private onFrame?: (frame: number) => void;
  private readonly settings: AppSettings;
  private readonly a: CompareSource;
  private readonly b: CompareSource;
  /** 最大关节角度差区间(自动跳转用) */
  diffRange: { startFrame: number; endFrame: number; maxDiffDeg: number } | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    a: CompareSource,
    b: CompareSource,
    settings: AppSettings,
    onFrame?: (frame: number) => void,
  ) {
    this.a = a; this.b = b; this.settings = settings; this.onFrame = onFrame;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.scene.background = new THREE.Color(0x0b1220);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(4, 10, 6);
    this.scene.add(key);

    this.figA = createFigure(
      { height: a.athlete.heightCm / 100, armSpan: a.athlete.armSpanCm / 100, weight: 0 },
      0x22c55e,
    );
    this.figB = createFigure(
      { height: b.athlete.heightCm / 100, armSpan: b.athlete.armSpanCm / 100, weight: 0 },
      0xf97316,
    );
    this.figB.setOpacity(0.4);
    this.scene.add(this.figA.root, this.figB.root);

    this.camera.position.set(3.5, 4, 6);
    this.camera.lookAt(0, 3, 1);
    this.computeDiffRange();
    this.seek(0);
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  setLayout(layout: CompareLayout): void {
    this.layout = layout;
    if (layout === 'split') {
      this.figA.root.position.x = -1.2;
      this.figB.root.position.x = 1.2;
    } else {
      this.figA.root.position.x = 0;
      this.figB.root.position.x = 0;
    }
  }

  /** 对齐后的公共时间轴长度(取两跳离板->入水的较短者) */
  alignedFlightFrames(): number {
    const fa = this.a.clip.entryFrame - this.a.clip.takeoffFrame;
    const fb = this.b.clip.entryFrame - this.b.clip.takeoffFrame;
    return Math.min(fa, fb);
  }

  /** 按离板帧对齐取帧:公共帧 0 = 两跳各自的 takeoffFrame */
  private alignedFrame(src: CompareSource, aligned: number): number {
    return THREE.MathUtils.clamp(
      src.clip.takeoffFrame + aligned, 0, src.clip.frameCount - 1,
    );
  }

  private readFrame(src: CompareSource, f: number): { pos: Vec3; quats: Quat[] } {
    const i = f * 3;
    const pos: Vec3 = [
      src.clip.rootPositions[i], src.clip.rootPositions[i + 1], src.clip.rootPositions[i + 2],
    ];
    const quats: Quat[] = [];
    for (let j = 0; j < JOINT_COUNT; j++) {
      const o = (f * JOINT_COUNT + j) * 4;
      quats.push([
        src.clip.localRotations[o], src.clip.localRotations[o + 1],
        src.clip.localRotations[o + 2], src.clip.localRotations[o + 3],
      ]);
    }
    return { pos, quats };
  }

  seek(alignedFrame: number): void {
    this.frame = THREE.MathUtils.clamp(alignedFrame, 0, this.alignedFlightFrames());
    const fa = this.alignedFrame(this.a, this.frame);
    const fb = this.alignedFrame(this.b, this.frame);
    const da = this.readFrame(this.a, fa);
    const db = this.readFrame(this.b, fb);
    this.figA.applyFrame(da.pos, da.quats);
    this.figB.applyFrame(db.pos, db.quats);
    this.renderer.render(this.scene, this.camera);
    this.onFrame?.(this.frame);
  }

  /** 计算关节角度差最大的连续区间(逐帧左右膝髋等角度差之和) */
  private computeDiffRange(): void {
    const n = this.alignedFlightFrames();
    const diffs: number[] = [];
    for (let u = 0; u < n; u++) {
      const ma = this.a.analysis.metrics[this.alignedFrame(this.a, u)];
      const mb = this.b.analysis.metrics[this.alignedFrame(this.b, u)];
      if (!ma || !mb) { diffs.push(0); continue; }
      const d =
        Math.abs(ma.kneeAngles[0] - mb.kneeAngles[0])
        + Math.abs(ma.kneeAngles[1] - mb.kneeAngles[1])
        + Math.abs(ma.hipAngles[0] - mb.hipAngles[0])
        + Math.abs(ma.hipAngles[1] - mb.hipAngles[1]);
      diffs.push(d);
    }
    // 找峰值及周边 ±15 帧区间
    let peak = 0; let peakV = -1;
    diffs.forEach((d, i) => { if (d > peakV) { peakV = d; peak = i; } });
    this.diffRange = {
      startFrame: Math.max(0, peak - 15),
      endFrame: Math.min(n - 1, peak + 15),
      maxDiffDeg: peakV,
    };
  }

  jumpToMaxDiff(): void {
    if (this.diffRange) this.seek(this.diffRange.startFrame);
  }

  play(): void { this.playing = true; }
  pause(): void { this.playing = false; }
  togglePlay(): void { this.playing = !this.playing; }
  setSpeed(s: number): void { this.speed = s; }
  getFrame(): number { return this.frame; }
  isPlaying(): boolean { return this.playing; }

  private loop(now: number): void {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    if (!this.lastTime) this.lastTime = now;
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    if (this.playing) {
      this.accumulator += dt * this.speed;
      const rate = this.a.clip.sampleRate;
      while (this.accumulator >= 1 / rate) {
        this.accumulator -= 1 / rate;
        if (this.frame >= this.alignedFlightFrames()) { this.playing = false; break; }
        this.frame++;
      }
      this.seek(this.frame);
    }
  }

  resize(): void {
    const el = this.renderer.domElement;
    const parent = el.parentElement;
    if (!parent) return;
    this.renderer.setSize(parent.clientWidth, parent.clientHeight, false);
    this.camera.aspect = parent.clientWidth / Math.max(1, parent.clientHeight);
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.figA.dispose();
    this.figB.dispose();
    this.renderer.dispose();
  }
}
