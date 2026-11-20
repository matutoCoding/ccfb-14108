// 三维回放播放器：相机预设、240Hz 平滑播放、轨迹抛物线带、角速度残影、入水切片
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { AnalysisResult } from '../core/kinematics';
import type { MoCapRecord } from '../core/types';
import type { SkeletonSpec } from '../core/skeleton';
import { JOINT_INDEX } from '../core/skeleton';
import { Humanoid } from './Humanoid';
import { DiveEnvironment } from './Environment';
import { AnnotationLayer } from './AnnotationLayer';
import { clamp, lerp } from '../core/math';
import type { Annotation } from '../core/types';

export type CameraPreset = 'free' | 'follow' | 'judge' | 'underwater';

export interface PlayerOptions {
  showTrajectory: boolean;
  showGhosts: boolean;
  ghostEveryN: number;
  showEntrySlice: boolean;
}

const GHOST_COLOR_LOW = new THREE.Color(0x93c5fd); // 低角速度
const GHOST_COLOR_HIGH = new THREE.Color(0xdc2626); // 高角速度

export class Player {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private humanoid: Humanoid;
  private env: DiveEnvironment;
  private spec: SkeletonSpec;
  private record: MoCapRecord;
  private analysis: AnalysisResult;

  private raf = 0;
  private playing = false;
  private time = 0; // 秒（浮点，240Hz 帧间 SLERP 由取整帧近似 + 细粒度时间推进）
  private speed = 1;
  private lastWall = 0;

  private preset: CameraPreset = 'follow';
  private followOffset: THREE.Vector3 | null = null;
  private options: PlayerOptions = {
    showTrajectory: true,
    showGhosts: true,
    ghostEveryN: 12,
    showEntrySlice: true,
  };

  private trajectoryLine?: THREE.Line;
  private ghostGroup = new THREE.Group();
  private entryGroup = new THREE.Group();
  private annotationLayer: AnnotationLayer;
  private onFrame?: (frame: number) => void;
  private resizeObs?: ResizeObserver;

  constructor(
    container: HTMLElement,
    record: MoCapRecord,
    spec: SkeletonSpec,
    analysis: AnalysisResult,
  ) {
    this.record = record;
    this.spec = spec;
    this.analysis = analysis;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0x0f172a);
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.05,
      100,
    );
    // 初始取景聚焦离板时刻的人物，相机在正侧面（沿 +Z），翻腾平面正对屏幕
    const takeoffCom = analysis.metrics[record.events.takeoffFrame]?.com
      ?? new THREE.Vector3(0, record.platform.heightM, 0);
    this.camera.position.set(takeoffCom.x + 0.6, takeoffCom.y + 0.5, 4.2);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.set(takeoffCom.x, takeoffCom.y, takeoffCom.z);

    this.setupLights();
    this.env = new DiveEnvironment(record.platform);
    this.scene.add(this.env.group);

    this.humanoid = new Humanoid(spec);
    this.scene.add(this.humanoid.root);
    this.scene.add(this.ghostGroup);
    this.scene.add(this.entryGroup);
    this.annotationLayer = new AnnotationLayer(this.humanoid);
    this.scene.add(this.annotationLayer.group);

    this.buildTrajectory();
    this.buildGhosts();
    this.buildEntrySlice();

    this.resizeObs = new ResizeObserver(() => this.resize(container));
    this.resizeObs.observe(container);

    this.seekFrame(0);
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  private setupLights(): void {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(5, 12, 6);
    key.castShadow = true;
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0x7dd3fc, 0.5);
    fill.position.set(-6, 4, -5);
    this.scene.add(fill);
  }

  /** 质心空中抛物线带：离板->入水，按高度渐变着色 */
  private buildTrajectory(): void {
    const { takeoffFrame, entryFrame } = this.record.events;
    const pts: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];
    const cLow = new THREE.Color(0x34d399);
    const cHigh = new THREE.Color(0xfbbf24);
    for (let i = takeoffFrame; i <= entryFrame; i++) {
      const c = this.analysis.metrics[i].com;
      pts.push(new THREE.Vector3(c.x, c.y, c.z));
      const t = clamp(c.y / (this.record.platform.heightM + 2), 0, 1);
      colors.push(cLow.clone().lerp(cHigh, t));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors.flatMap((c) => [c.r, c.g, c.b]), 3));
    const mat = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 2 });
    this.trajectoryLine = new THREE.Line(geo, mat);
    this.trajectoryLine.visible = this.options.showTrajectory;
    this.scene.add(this.trajectoryLine);
  }

  /** 每 N 帧一个半透明残影，颜色按瞬时翻腾角速度由蓝到红；
   *  残影只存关节点 + 骨架连线（LineSegments），共享一份几何内存 */
  private buildGhosts(): void {
    this.clearGroup(this.ghostGroup);
    if (!this.options.showGhosts) return;
    const n = this.options.ghostEveryN;
    const vels = this.analysis.metrics.map((m) => Math.abs(m.somersaultVel));
    const maxVel = Math.max(1, ...vels);
    const parents = this.spec.parents;

    for (let i = this.record.events.takeoffFrame; i < this.record.events.entryFrame; i += n) {
      const points = this.humanoid.snapshotPositions(this.record.frames[i]);
      const linePts: THREE.Vector3[] = [];
      parents.forEach((p, c) => {
        if (p >= 0) {
          linePts.push(points[p], points[c]);
        }
      });
      const geo = new THREE.BufferGeometry().setFromPoints(linePts);
      const color = GHOST_COLOR_LOW.clone().lerp(GHOST_COLOR_HIGH, vels[i] / maxVel);
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      });
      this.ghostGroup.add(new THREE.LineSegments(geo, mat));
    }
    // 恢复当前帧姿态
    this.applyFrame(this.currentFrame);
  }

  /** 入水切片：在水面画入水角、铅垂线、手掌先入水点 */
  private buildEntrySlice(): void {
    this.clearGroup(this.entryGroup);
    if (!this.options.showEntrySlice) return;
    const e = this.record.events.entryFrame;
    const m = this.analysis.metrics[e];
    const pelvis = new THREE.Vector3(m.com.x, 0, m.com.z);

    // 铅垂线
    const plumb = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(pelvis.x, 0.6, pelvis.z),
      new THREE.Vector3(pelvis.x, -0.6, pelvis.z),
    ]);
    this.entryGroup.add(
      new THREE.Line(plumb, new THREE.LineBasicMaterial({ color: 0xe2e8f0 })),
    );

    // 身体长轴投影（入水角示意）
    const ang = (this.analysis.entryAngleDeg * Math.PI) / 180;
    const dir = new THREE.Vector3(Math.sin(ang), -Math.cos(ang), 0);
    const body = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(pelvis.x, 0.5, pelvis.z),
      new THREE.Vector3(pelvis.x, 0.5, pelvis.z).add(dir.multiplyScalar(1.0)),
    ]);
    this.entryGroup.add(
      new THREE.Line(body, new THREE.LineBasicMaterial({ color: 0xf97316, linewidth: 2 })),
    );

    // 手掌先入水点
    const off = this.analysis.handEntryOffset;
    const hand = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 14, 10),
      new THREE.MeshBasicMaterial({ color: 0x22c55e }),
    );
    hand.position.set(pelvis.x + off.x, 0.03, pelvis.z + off.z);
    this.entryGroup.add(hand);

    // 角度文字用 Sprite 标签
    const label = this.makeTextSprite(`入水角 ${this.analysis.entryAngleDeg.toFixed(1)}°`, '#fb923c');
    label.position.set(pelvis.x + 0.35, 0.45, pelvis.z);
    this.entryGroup.add(label);
  }

  private makeTextSprite(text: string, color: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 80;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(15,23,42,0.75)';
    ctx.fillRect(0, 0, 256, 80);
    ctx.font = 'bold 34px sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 40);
    const tex = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }),
    );
    sprite.scale.set(1.1, 0.35, 1);
    return sprite;
  }

  private clearGroup(g: THREE.Group): void {
    while (g.children.length) {
      const c = g.children.pop()!;
      g.remove(c);
    }
  }

  setOptions(opts: Partial<PlayerOptions>): void {
    Object.assign(this.options, opts);
    if (this.trajectoryLine) this.trajectoryLine.visible = this.options.showTrajectory;
    this.ghostGroup.visible = this.options.showGhosts;
    this.entryGroup.visible = this.options.showEntrySlice;
    if (opts.ghostEveryN !== undefined) this.buildGhosts();
  }

  setCameraPreset(preset: CameraPreset): void {
    this.preset = preset;
    const H = this.record.platform.heightM;
    if (preset === 'free') {
      // 全场俯瞰
      const dist = H >= 8 ? 8.5 : 5;
      this.controls.target.set(1.5, H * 0.5, 0);
      this.camera.position.set(dist, H * 0.7 + 1.5, dist);
    } else if (preset === 'judge') {
      const f = this.currentFrame;
      const com = this.analysis.metrics[f].com;
      this.camera.position.set(com.x + 3, 1.4, 3.4);
      this.controls.target.set(com.x, com.y, com.z);
    } else if (preset === 'underwater') {
      this.camera.position.set(1.6, -2.0, 2.6);
      this.controls.target.set(1.2, 0.6, 0);
    }
    this.controls.update();
  }

  /** 框选当前帧人物：相机移到人物斜前方约 3m，保持观察方向 */
  frameHuman(): void {
    const f = this.currentFrame;
    const com = this.analysis.metrics[f].com;
    const center = new THREE.Vector3(com.x, com.y, com.z);
    const dir = this.camera.position.clone().sub(this.controls.target).normalize();
    this.controls.target.copy(center);
    this.camera.position.copy(center).add(dir.multiplyScalar(3.2));
    this.controls.update();
  }

  setSpeed(s: number): void {
    this.speed = s;
  }

  play(): void {
    this.playing = true;
  }

  pause(): void {
    this.playing = false;
  }

  get isPlaying(): boolean {
    return this.playing;
  }

  seekFrame(frame: number): void {
    const f = clamp(Math.round(frame), 0, this.record.frames.length - 1);
    this.time = f / this.record.sampleRate;
    this.applyFrame(f);
  }

  get currentFrame(): number {
    return Math.round(this.time * this.record.sampleRate);
  }

  onFrameChange(cb: (frame: number) => void): void {
    this.onFrame = cb;
  }

  private applyFrame(f: number): void {
    const frame = this.record.frames[f];
    this.humanoid.update(frame);
    const def = this.record.platform.boardDeflectionM?.[f];
    this.env.updateBoard(def, f);
    this.annotationLayer.update();
    if (this.preset === 'follow') {
      const com = this.analysis.metrics[f].com;
      const target = new THREE.Vector3(com.x, com.y, com.z);
      // 保持相机相对重心的固定方位（侧面，正对翻腾平面 XY），只平移不漂移
      const offset = this.followOffset ?? this.camera.position.clone().sub(this.controls.target);
      this.followOffset = offset;
      this.controls.target.copy(target);
      this.camera.position.copy(target).add(offset);
    }
    this.onFrame?.(f);
  }

  private loop(now: number): void {
    this.raf = requestAnimationFrame(this.loop);
    if (!this.lastWall) this.lastWall = now;
    const wallDt = Math.min(0.05, (now - this.lastWall) / 1000);
    this.lastWall = now;

    if (this.playing) {
      this.time += wallDt * this.speed;
      const last = (this.record.frames.length - 1) / this.record.sampleRate;
      if (this.time >= last) {
        this.time = last;
        this.playing = false;
      }
      // 240Hz 数据：时间推进到任意亚帧，渲染按最近整数帧（帧间隔 4.17ms，
      // 慢放 0.1x 时每帧停留 ~42ms，肉眼无顿挫；逐帧由 UI 精确控制）
      this.applyFrame(this.currentFrame);
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  /** 关键帧截图（分析单用） */
  screenshot(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  screenshotFrame(frame: number): string {
    this.seekFrame(frame);
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  getHumanoid(): Humanoid {
    return this.humanoid;
  }

  setAnnotations(anns: Annotation[]): void {
    this.annotationLayer.setAnnotations(anns);
  }

  private resize(container: HTMLElement): void {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    this.resizeObs?.disconnect();
    this.controls.dispose();
    this.humanoid.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

export { lerp, JOINT_INDEX };
