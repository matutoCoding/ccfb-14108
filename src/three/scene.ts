// 三维回放场景:播放引擎、相机视角、重心轨迹、残影、关键帧标记
import * as THREE from 'three';
import { Joint, JOINT_COUNT } from '../core/types';
import type { DiveClip, DiveAnalysis, Athlete, Annotation, AppSettings } from '../core/types';
import { forwardKinematics } from '../core/analysis';
import { createFigure, type SkinnedFigure } from './figure';
import { createVenue, type Venue } from './venue';
import { VENUE } from '../core/settings';

export type CameraMode = 'follow' | 'judge' | 'underwater' | 'free';

export interface SceneOptions {
  canvas: HTMLCanvasElement;
  clip: DiveClip;
  athlete: Athlete;
  analysis: DiveAnalysis;
  settings: AppSettings;
  onFrame?: (frame: number) => void;
}

const KEYFRAME_COLORS = {
  takeoff: 0x22c55e,
  apex: 0xeab308,
  open: 0xf97316,
  entry: 0xef4444,
};

export class DiveScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private figure: SkinnedFigure;
  private venue: Venue;
  private clip: DiveClip;
  private analysis: DiveAnalysis;
  private settings: AppSettings;

  private frame = 0;
  private playing = false;
  private speed = 1;
  private accumulator = 0;
  private lastTime = 0;
  private cameraMode: CameraMode = 'free';
  private raf = 0;
  private disposed = false;
  /** 帧回调(回放页用于联动 HUD/时间轴),可外部覆盖 */
  onFrame?: (frame: number) => void;

  private trailLine?: THREE.Line;
  private ghostGroup = new THREE.Group();
  private markerGroup = new THREE.Group();
  private annotationGroup = new THREE.Group();
  private comMarker: THREE.Mesh;
  private arrowHelpers: THREE.ArrowHelper[] = [];
  private readonly bodyHeight: number;
  private readonly bodyArmSpan: number;

  // 自由相机轨道参数
  private orbit = { azim: 0.6, elev: 0.25, dist: 5.5 };
  private dragging = false;
  private lastPointer = { x: 0, y: 0 };

  constructor(opts: SceneOptions) {
    this.clip = opts.clip;
    this.analysis = opts.analysis;
    this.settings = opts.settings;
    this.onFrame = opts.onFrame;
    this.bodyHeight = opts.athlete.heightCm / 100;
    this.bodyArmSpan = opts.athlete.armSpanCm / 100;

    this.renderer = new THREE.WebGLRenderer({
      canvas: opts.canvas, antialias: true, preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    this.scene.background = new THREE.Color(0x0b1220);
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.05, 100);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(4, 10, 6);
    key.castShadow = true;
    this.scene.add(key);
    this.scene.add(new THREE.DirectionalLight(0x93c5fd, 0.35));

    this.venue = createVenue(3, 'spring', this.settings.waterLevelY);
    this.scene.add(this.venue.group);

    this.figure = createFigure({
      height: opts.athlete.heightCm / 100,
      armSpan: opts.athlete.armSpanCm / 100,
      weight: opts.athlete.weightKg,
    });
    this.scene.add(this.figure.root);
    this.scene.add(this.ghostGroup);
    this.scene.add(this.markerGroup);
    this.scene.add(this.annotationGroup);

    this.comMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0xfde047 }),
    );
    this.scene.add(this.comMarker);

    this.buildTrail();
    this.buildGhosts();
    this.buildKeyframeMarkers();
    this.buildEntrySlice();
    this.bindPointer();
    this.resize();
    this.seek(0);
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  // —— 重心抛物线轨迹带 ——
  private buildTrail(): void {
    const pts = this.analysis.metrics.map((m) => new THREE.Vector3(...m.com));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineDashedMaterial({
      color: 0x38bdf8, dashSize: 0.12, gapSize: 0.06, transparent: true, opacity: 0.85,
    });
    this.trailLine = new THREE.Line(geo, mat);
    this.trailLine.computeLineDistances();
    this.scene.add(this.trailLine);
  }

  // —— 半透明残影,颜色随角速度深浅过渡 ——
  private buildGhosts(): void {
    const step = this.settings.comTrailStep;
    const maxW = this.analysis.maxAngularVelocity || 1;
    for (let f = this.clip.takeoffFrame; f < this.clip.entryFrame; f += step) {
      const m = this.analysis.metrics[f];
      const ghost = createFigure(
        { height: this.bodyHeight, armSpan: this.bodyArmSpan, weight: 0 },
        this.ghostColor(m.angularVelocity / maxW),
      );
      ghost.setOpacity(this.settings.ghostAlpha);
      ghost.applyFrame(this.readRootPos(f), this.readLocalQuats(f));
      this.ghostGroup.add(ghost.root);
    }
  }

  private ghostColor(t: number): number {
    // 慢=浅蓝,快=深紫红
    const c0 = new THREE.Color(0x93c5fd);
    const c1 = new THREE.Color(0xc026d3);
    return c0.lerp(c1, THREE.MathUtils.clamp(t, 0, 1)).getHex();
  }

  // —— 关键帧标记:离板/最高点/打开/入水 ——
  private buildKeyframeMarkers(): void {
    const defs: Array<[number, string, number]> = [
      [this.clip.takeoffFrame, '离板', KEYFRAME_COLORS.takeoff],
      [this.clip.apexFrame, '最高点', KEYFRAME_COLORS.apex],
      [this.clip.openFrame, '打开', KEYFRAME_COLORS.open],
      [this.clip.entryFrame, '入水', KEYFRAME_COLORS.entry],
    ];
    for (const [frame, label, color] of defs) {
      if (frame < 0) continue;
      const com = this.analysis.metrics[frame]?.com;
      if (!com) continue;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.012, 8, 32),
        new THREE.MeshBasicMaterial({ color }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(com[0], com[1], com[2]);
      this.markerGroup.add(ring);
      const sprite = this.makeTextSprite(label, color);
      sprite.position.set(com[0], com[1] + 0.28, com[2]);
      this.markerGroup.add(sprite);
    }
  }

  private makeTextSprite(text: string, color: number): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 48;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = `#${new THREE.Color(color).getHexString()}`;
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 24);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sp = new THREE.Sprite(mat);
    sp.scale.set(0.55, 0.21, 1);
    return sp;
  }

  // —— 水面切片:入水角与手掌先入水点 ——
  private buildEntrySlice(): void {
    const f = this.clip.entryFrame;
    if (f < 0) return;
    const pose = forwardKinematics(
      this.clip, f, { height: this.bodyHeight, armSpan: this.bodyArmSpan },
    );
    const waterY = this.settings.waterLevelY;
    const slice = new THREE.Group();

    // 切片参考方框(2m × 2m),落在水面
    const size = 2;
    const pts = [
      new THREE.Vector3(-size / 2, waterY + 0.01, -size / 2),
      new THREE.Vector3(size / 2, waterY + 0.01, -size / 2),
      new THREE.Vector3(size / 2, waterY + 0.01, size / 2),
      new THREE.Vector3(-size / 2, waterY + 0.01, size / 2),
      new THREE.Vector3(-size / 2, waterY + 0.01, -size / 2),
    ];
    slice.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.7 }),
    ));

    // 铅垂参考线(从骨盆入水投影向下)
    const pelvis = pose.positions[Joint.Hips];
    const origin = new THREE.Vector3(pelvis[0], waterY + 0.02, pelvis[2]);
    const vertical = new THREE.ArrowHelper(
      new THREE.Vector3(0, -1, 0), origin, 1.6, 0x94a3b8, 0.14, 0.08,
    );
    slice.add(vertical);

    // 身体实际入水方向(体纵轴),与铅垂的夹角即入水角
    const bodyUp = new THREE.Vector3(...this.analysis.metrics[f].pelvisUp);
    const bodyDir = bodyUp.y > 0 ? bodyUp.clone().negate() : bodyUp.clone();
    const bodyArrow = new THREE.ArrowHelper(
      bodyDir.normalize(), origin, 1.6, 0xef4444, 0.16, 0.09,
    );
    slice.add(bodyArrow);

    // 手掌先入水点(红色球)与相对骨盆的水平偏移连线
    const hands = [pose.positions[Joint.LeftHand], pose.positions[Joint.RightHand]];
    const firstHand = hands[0][1] < hands[1][1] ? hands[0] : hands[1];
    const handPoint = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xf97316 }),
    );
    handPoint.position.set(firstHand[0], waterY + 0.03, firstHand[2]);
    slice.add(handPoint);
    const offsetLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pelvis[0], waterY + 0.025, pelvis[2]),
        new THREE.Vector3(firstHand[0], waterY + 0.025, firstHand[2]),
      ]),
      new THREE.LineDashedMaterial({ color: 0xf97316, dashSize: 0.08, gapSize: 0.05 }),
    );
    offsetLine.computeLineDistances();
    slice.add(offsetLine);

    const label = this.makeTextSprite(
      `入水角 ${this.analysis.entryAngleDeg.toFixed(1)}°`, 0xef4444,
    );
    label.position.set(pelvis[0], waterY + 0.35, pelvis[2]);
    slice.add(label);
    this.markerGroup.add(slice);
  }

  // —— 标注(评语/箭头),钉在关节上随骨骼运动 ——
  setAnnotations(annotations: Annotation[]): void {
    this.annotationGroup.clear();
    this.arrowHelpers = [];
    const dim = { height: this.bodyHeight, armSpan: this.bodyArmSpan };
    for (const a of annotations) {
      if (a.frame !== this.frame) continue;
      const pose = forwardKinematics(this.clip, a.frame, dim);
      const anchor = new THREE.Vector3(...pose.positions[a.anchorJoint]);
      if (a.kind === 'arrow') {
        const dir = new THREE.Vector3(...(a.offset ?? [0, 1, 0]));
        const len = dir.length() || 0.5;
        const arrow = new THREE.ArrowHelper(
          dir.clone().normalize(), anchor, len, a.color, 0.12, 0.07,
        );
        this.annotationGroup.add(arrow);
        this.arrowHelpers.push(arrow);
      } else {
        const sp = this.makeTextSprite(a.text ?? '', new THREE.Color(a.color).getHex());
        sp.position.copy(anchor).add(new THREE.Vector3(0, 0.25, 0));
        this.annotationGroup.add(sp);
      }
    }
  }

  // —— 读取片段数据 ——
  private readRootPos(f: number): [number, number, number] {
    const i = f * 3;
    return [this.clip.rootPositions[i], this.clip.rootPositions[i + 1], this.clip.rootPositions[i + 2]];
  }
  private readLocalQuats(f: number): import('../core/math3d').Quat[] {
    const out: import('../core/math3d').Quat[] = [];
    for (let j = 0; j < JOINT_COUNT; j++) {
      const o = (f * JOINT_COUNT + j) * 4;
      out.push([
        this.clip.localRotations[o], this.clip.localRotations[o + 1],
        this.clip.localRotations[o + 2], this.clip.localRotations[o + 3],
      ]);
    }
    return out;
  }

  // —— 播放控制 ——
  play(): void { this.playing = true; }
  pause(): void { this.playing = false; }
  togglePlay(): void { this.playing = !this.playing; }
  isPlaying(): boolean { return this.playing; }
  setSpeed(s: number): void { this.speed = s; }
  getFrame(): number { return this.frame; }

  seek(frame: number): void {
    this.frame = THREE.MathUtils.clamp(Math.round(frame), 0, this.clip.frameCount - 1);
    const f = this.frame;
    this.figure.applyFrame(this.readRootPos(f), this.readLocalQuats(f));
    const com = this.analysis.metrics[f]?.com;
    if (com) this.comMarker.position.set(com[0], com[1], com[2]);
    // 跳板下压:板上阶段按正弦驱动,离板帧归零
    this.updateBoardFlex(f);
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
    this.onFrame?.(f);
  }

  private updateBoardFlex(f: number): void {
    const t0 = this.clip.takeoffFrame;
    if (f > t0 || t0 <= 0) { this.venue.setBoardFlex(0); return; }
    const p = f / t0;
    const flex = 0.18 * Math.sin(Math.PI * p);
    this.venue.setBoardFlex(flex);
  }

  private loop(now: number): void {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    if (!this.lastTime) this.lastTime = now;
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    if (this.playing) {
      // 240Hz 数据按真实采样率推进,速度倍率只改变播放节奏
      this.accumulator += dt * this.speed;
      const frameDur = 1 / this.clip.sampleRate;
      let advanced = false;
      while (this.accumulator >= frameDur) {
        this.accumulator -= frameDur;
        if (this.frame >= this.clip.frameCount - 1) {
          this.playing = false;
          break;
        }
        this.frame++;
        advanced = true;
      }
      if (advanced) this.seek(this.frame);
    }
    this.renderer.render(this.scene, this.camera);
  }

  // —— 相机 ——
  setCameraMode(mode: CameraMode): void {
    this.cameraMode = mode;
    this.updateCamera();
  }
  getCameraMode(): CameraMode { return this.cameraMode; }

  private updateCamera(): void {
    const com = this.analysis.metrics[this.frame]?.com;
    const target = com ? new THREE.Vector3(...com) : new THREE.Vector3();
    if (this.cameraMode === 'follow') {
      // 锁重心,沿用当前轨道角
      const r = this.orbit.dist;
      this.camera.position.set(
        target.x + r * Math.cos(this.orbit.elev) * Math.sin(this.orbit.azim),
        target.y + r * Math.sin(this.orbit.elev),
        target.z + r * Math.cos(this.orbit.elev) * Math.cos(this.orbit.azim),
      );
      this.camera.lookAt(target);
    } else if (this.cameraMode === 'judge') {
      this.camera.position.set(
        VENUE.judgeDistance, VENUE.judgeHeight,
        (this.clip.takeoffFrame >= 0 ? 4.8 : 5) + 1.2,
      );
      this.camera.lookAt(target.x * 0.3, target.y, target.z * 0.5);
    } else if (this.cameraMode === 'underwater') {
      this.camera.position.set(target.x, this.settings.waterLevelY - 2.2, target.z + 1.2);
      this.camera.lookAt(target);
    } else {
      // free:绕原点/重心轨道
      const r = this.orbit.dist;
      this.camera.position.set(
        r * Math.cos(this.orbit.elev) * Math.sin(this.orbit.azim),
        3 + r * Math.sin(this.orbit.elev),
        r * Math.cos(this.orbit.elev) * Math.cos(this.orbit.azim),
      );
      this.camera.lookAt(0, 3, 1);
    }
  }

  private bindPointer(): void {
    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.lastPointer = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('pointerup', () => { this.dragging = false; });
    window.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.lastPointer.x;
      const dy = e.clientY - this.lastPointer.y;
      this.lastPointer = { x: e.clientX, y: e.clientY };
      this.orbit.azim -= dx * 0.006;
      this.orbit.elev = THREE.MathUtils.clamp(this.orbit.elev + dy * 0.006, -1.2, 1.2);
      this.updateCamera();
    });
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.orbit.dist = THREE.MathUtils.clamp(this.orbit.dist + e.deltaY * 0.004, 1.5, 18);
      this.updateCamera();
    }, { passive: false });
  }

  resize(): void {
    const el = this.renderer.domElement;
    const parent = el.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
  }

  /** 关键帧截图(用于分析单导出) */
  screenshot(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.figure.dispose();
    this.venue.dispose();
    this.ghostGroup.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
    this.renderer.dispose();
  }
}
