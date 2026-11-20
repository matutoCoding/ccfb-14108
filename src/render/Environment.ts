// 真实尺寸场馆：水面、3m 跳板（含下压回弹）、10m 跳台、裁判席/水下机位标记
import * as THREE from 'three';
import type { PlatformInfo } from '../core/types';

export class DiveEnvironment {
  readonly group = new THREE.Group();
  private boardTip?: THREE.Object3D;
  private boardBaseY: number;
  private platform: PlatformInfo;

  constructor(platform: PlatformInfo) {
    this.platform = platform;
    this.boardBaseY = platform.heightM;
    this.buildWater();
    this.buildPool();
    if (platform.type === 'springboard') this.buildSpringboard();
    else this.buildPlatform();
    this.buildCameraMarkers();
  }

  private buildWater(): void {
    const geo = new THREE.PlaneGeometry(12, 10, 1, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0e7490,
      transparent: true,
      opacity: 0.28,
      roughness: 0.3,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const water = new THREE.Mesh(geo, mat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(2, 0, 0);
    water.name = 'water';
    this.group.add(water);

    // 水面网格线
    const grid = new THREE.GridHelper(12, 24, 0x0ea5e9, 0x7dd3fc);
    grid.position.set(2, 0.01, 0);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    this.group.add(grid);
  }

  private buildPool(): void {
    // 水下体积（半透明蓝），深 5m
    const geo = new THREE.BoxGeometry(12, 5, 10);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0c4a6e,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    });
    const pool = new THREE.Mesh(geo, mat);
    pool.position.set(2, -2.5, 0);
    this.group.add(pool);
  }

  /** 标准 3m 跳板：长 4.88m、宽 0.5m，支点距板尖 1.5m，板尖高出水面 3m */
  private buildSpringboard(): void {
    const board = new THREE.Group();
    const geo = new THREE.BoxGeometry(4.88, 0.05, 0.5);
    const mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = 2.44; // 根部在 x=0，板尖 x=4.88
    board.add(mesh);

    // 支点（滚筒）
    const fulcrum = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.6, 16),
      new THREE.MeshStandardMaterial({ color: 0x475569 }),
    );
    fulcrum.rotation.x = Math.PI / 2;
    fulcrum.position.set(3.38, -0.12, 0);
    board.add(fulcrum);

    board.position.set(0, this.boardBaseY, 0);
    this.group.add(board);
    this.boardTip = board;

    // 支架
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, this.boardBaseY, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 }),
    );
    stand.position.set(0, this.boardBaseY / 2, 0);
    this.group.add(stand);
  }

  /** 10m 跳台：钢筋混凝土平台，宽 3m 长 6m，前沿距水面 10m */
  private buildPlatform(): void {
    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.3, 3),
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.8 }),
    );
    deck.position.set(-3, this.boardBaseY - 0.15, 0);
    this.group.add(deck);

    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, this.boardBaseY, 2),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 }),
    );
    tower.position.set(-5.4, this.boardBaseY / 2, 0);
    this.group.add(tower);
    this.boardTip = deck;
  }

  private buildCameraMarkers(): void {
    // 裁判席：板侧前方 5m、高 1.2m
    const judge = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.4, 16),
      new THREE.MeshBasicMaterial({ color: 0xef4444 }),
    );
    judge.position.set(4, 1.2, 3.2);
    judge.name = 'marker-judge';
    this.group.add(judge);

    // 水下机位
    const under = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.4, 16),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee }),
    );
    under.position.set(1.5, -2.2, 2.4);
    under.name = 'marker-underwater';
    this.group.add(under);
  }

  /** 板下压：把每帧挠度（米）映射到板整体绕支点的微小转动，板尖位移与起跳帧对齐 */
  updateBoard(deflectionM: number | undefined, frame: number): void {
    if (!this.boardTip || this.platform.type !== 'springboard' || deflectionM === undefined) {
      void frame;
      return;
    }
    // 板尖位于支点前 1.5m，按几何换算倾角
    const angle = Math.atan2(deflectionM, 1.5);
    this.boardTip.rotation.z = -angle;
  }

  get waterY(): number {
    return 0;
  }
}
