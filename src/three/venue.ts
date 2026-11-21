// 场馆:跳板/跳台(真实尺寸)、水面、裁判席;跳板下压回弹可按离板帧驱动
import * as THREE from 'three';
import { BOARD_SPECS, VENUE } from '../core/settings';

export interface Venue {
  group: THREE.Group;
  water: THREE.Mesh;
  board: THREE.Group;
  boardTopY: number;
  /** 设置板下压量(米),0 为水平;由回放按起跳帧驱动 */
  setBoardFlex(flexMeters: number): void;
  dispose(): void;
}

export function createVenue(
  height: number,
  boardType: 'spring' | 'platform',
  waterLevelY = 0,
): Venue {
  const group = new THREE.Group();
  const spec = boardType === 'spring' ? BOARD_SPECS.spring : BOARD_SPECS.platform;

  // —— 水面 ——
  const waterGeo = new THREE.PlaneGeometry(VENUE.poolWidth, VENUE.poolLength, 1, 1);
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x1d8fd6, transparent: true, opacity: 0.55,
    roughness: 0.15, metalness: 0.1, side: THREE.DoubleSide,
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, waterLevelY, 2);
  group.add(water);

  // 池底参考
  const bottom = new THREE.Mesh(
    new THREE.PlaneGeometry(VENUE.poolWidth, VENUE.poolLength),
    new THREE.MeshStandardMaterial({ color: 0x0e3a52, roughness: 0.9 }),
  );
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.set(0, waterLevelY - VENUE.poolDepth, 2);
  group.add(bottom);

  // —— 板/台 ——
  const board = new THREE.Group();
  const boardMat = new THREE.MeshStandardMaterial({
    color: boardType === 'spring' ? 0xd97706 : 0x9ca3af, roughness: 0.6,
  });
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(spec.width, spec.thickness, spec.length), boardMat,
  );
  slab.position.z = spec.length / 2; // 板端朝 +Z
  board.add(slab);

  // 支架
  const supportMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, roughness: 0.7 });
  const support = new THREE.Mesh(
    new THREE.BoxGeometry(spec.width * 1.4, height, spec.width * 1.4), supportMat,
  );
  support.position.set(0, -height / 2 - spec.thickness / 2, -0.3);
  board.add(support);

  const boardTopY = height;
  board.position.set(0, boardTopY - spec.thickness / 2, 0);
  group.add(board);

  // —— 裁判席(固定视角标记) ——
  const judge = new THREE.Group();
  const judgeBox = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.9, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 }),
  );
  judgeBox.position.y = 0.45;
  judge.add(judgeBox);
  judge.position.set(VENUE.judgeDistance, VENUE.judgeHeight, spec.length + 1.2);
  group.add(judge);

  // 网格地面参考
  const grid = new THREE.GridHelper(20, 20, 0x475569, 0x1e293b);
  grid.position.y = waterLevelY - VENUE.poolDepth + 0.02;
  group.add(grid);

  return {
    group, water, board, boardTopY,
    setBoardFlex(flexMeters) {
      // 板根部固定、端部下压:整体绕根部 X 轴小角度旋转近似
      const angle = Math.atan2(flexMeters, spec.length);
      board.rotation.x = -angle;
    },
    dispose() {
      group.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const m = o.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose()); else m.dispose();
        }
      });
    },
  };
}
