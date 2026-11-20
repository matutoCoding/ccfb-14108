// 对比分析：两跳按离板帧对齐，实虚叠加或左右分屏同步播放，自动定位关节角度差最大段
import { analyzeRecord, type AnalysisResult } from '../../core/kinematics';
import type { Athlete, MoCapRecord } from '../../core/types';
import { buildSkeleton, JOINTS } from '../../core/skeleton';
import { db } from '../../core/db';
import { Player } from '../../render/Player';
import { Humanoid } from '../../render/Humanoid';
import { h, clear, toast } from '../dom';
import { Timeline } from '../Timeline';
import { ANGLE_CHAINS } from '../../core/skeleton';

type Mode = 'overlay' | 'split';

interface Aligned {
  record: MoCapRecord;
  analysis: AnalysisResult;
  athlete: Athlete;
}

export async function renderComparePage(
  container: HTMLElement,
  idA?: string,
  idB?: string,
): Promise<void> {
  clear(container);
  const [records, athletes, settings] = await Promise.all([
    db.listRecords(),
    db.listAthletes(),
    db.getSettings(),
  ]);

  container.append(
    h('h1', { class: 'page-title' }, '对比分析'),
    h('p', { class: 'page-sub' }, '两跳按离板帧自动对齐，同步播放；系统自动找出关节角度差最大的时间段。'),
  );

  const selA = h('select', {}, ...records.map((r) => h('option', { value: r.id }, labelOf(r)))) as HTMLSelectElement;
  const selB = h('select', {}, ...records.map((r) => h('option', { value: r.id }, labelOf(r)))) as HTMLSelectElement;
  if (idA) selA.value = idA;
  if (idB && records.some((r) => r.id === idB)) selB.value = idB;
  else if (records.length > 1) selB.value = records[1].id;

  const modeBtn = h('button', {}, '当前：实虚叠加（切换分屏）');
  const startBtn = h('button', { class: 'primary' }, '开始对比');
  container.appendChild(h('div', { class: 'card' }, h('div', { class: 'row' },
    h('div', { style: 'flex:1' }, h('label', {}, '跳 A（实体）'), selA),
    h('div', { style: 'flex:1' }, h('label', {}, '跳 B（半透明虚影）'), selB),
    h('div', {}, h('label', {}, ' '), modeBtn),
    h('div', {}, h('label', {}, ' '), startBtn),
  )));

  const stage = h('div', {});
  container.appendChild(stage);

  let mode: Mode = 'overlay';
  modeBtn.addEventListener('click', () => {
    mode = mode === 'overlay' ? 'split' : 'overlay';
    modeBtn.textContent = mode === 'overlay' ? '当前：实虚叠加（切换分屏）' : '当前：左右分屏（切换叠加）';
  });
  startBtn.addEventListener('click', () => {
    if (selA.value === selB.value) return toast('请选择两跳不同的记录');
    run(selA.value, selB.value);
  });
  if (idA && idB) run(idA, idB);

  async function run(aId: string, bId: string): Promise<void> {
    clear(stage);
    const ra = await db.getRecord(aId);
    const rb = await db.getRecord(bId);
    if (!ra || !rb) return toast('记录不存在');
    const aa = athletes.find((x) => x.id === ra.athleteId)!;
    const ab = athletes.find((x) => x.id === rb.athleteId)!;
    const aligned: Aligned[] = [
      { record: ra, analysis: analyzeRecord(ra, buildSkeleton(aa), settings.thresholds), athlete: aa },
      { record: rb, analysis: analyzeRecord(rb, buildSkeleton(ab), settings.thresholds), athlete: ab },
    ];

    // 差异分析：以离板帧为 t=0，逐对齐帧计算 8 个关节角的差异
    const diff = computeDiff(aligned[0], aligned[1]);
    const metricCards = Object.entries(diff.perJointMax).map(([name, val]) =>
      h('div', { class: 'metric' },
        h('div', { class: 'k' }, name),
        h('div', { class: 'val', style: 'font-size:18px' }, val.toFixed(0),
          h('span', { class: 'unit' }, '° 最大差'))));
    const diffCard = h('div', { class: 'card' },
      h('h3', {}, '关节角度差异（按离板帧对齐）'),
      h('div', { class: 'grid cols-4' }, ...metricCards),
      h('div', { class: 'row', style: 'margin-top:12px' },
        h('span', { class: 'tag bad' },
          `差异最大：${diff.worstJoint}，第 ${diff.worstFrameA} 帧（A）/ 第 ${diff.worstFrameB} 帧（B）`),
        h('button', { class: 'primary', onclick: () => jumpWorst() }, '跳到差异最大处'),
      ),
    );
    stage.appendChild(diffCard);

    // 视口
    const viewportWrap = h('div', { class: mode === 'split' ? 'grid cols-2' : '' });
    const vpA = h('div', { class: 'viewport', style: 'height:54vh;min-height:360px' });
    const vpB = h('div', { class: 'viewport', style: 'height:54vh;min-height:360px' });
    viewportWrap.append(vpA, mode === 'split' ? vpB : h('span'));
    stage.appendChild(viewportWrap);

    const playerA = new Player(vpA, ra, buildSkeleton(aa), aligned[0].analysis);
    let playerB: Player | null = null;
    if (mode === 'split') {
      playerB = new Player(vpB, rb, buildSkeleton(ab), aligned[1].analysis);
    } else {
      // 叠加模式：在 A 的场景里加一个半透明 B（时间轴按离板对齐驱动）
      const ghost = new Humanoid(buildSkeleton(ab), 0xf59e0b);
      ghost.setColor(0xf59e0b, 0.45);
      playerA.scene.add(ghost.root);
      (playerA as unknown as { overlayGhost?: typeof ghost }).overlayGhost = ghost;
      playerA.onFrameChange((f) => {
        const fb = alignedFrameB(f);
        ghost.update(rb.frames[clampFrame(fb, rb)]);
      });
    }

    // 同步时间轴（离板对齐）
    const t0A = ra.events.takeoffFrame;
    const t0B = rb.events.takeoffFrame;
    const alignedFrameB = (fA: number) => fA - t0A + t0B;
    const clampFrame = (f: number, r: MoCapRecord) => Math.min(r.frames.length - 1, Math.max(0, f));

    const timeline = new Timeline(ra, {
      currentFrame: () => playerA.currentFrame,
      onSeek: (f) => {
        playerA.pause();
        playerA.seekFrame(f);
        if (playerB) playerB.seekFrame(clampFrame(alignedFrameB(f), rb));
        timeline.update();
      },
      onEventChange: () => undefined,
    });
    stage.appendChild(timeline.el);

    const playBtn = h('button', { class: 'primary' }, '同步播放');
    let playing = false;
    playBtn.addEventListener('click', () => {
      playing = !playing;
      playBtn.textContent = playing ? '暂停' : '同步播放';
      if (playing) {
        playerA.play();
        playerB?.play();
        tick();
      } else {
        playerA.pause();
        playerB?.pause();
      }
    });
    const tick = () => {
      if (!playing) return;
      const fA = playerA.currentFrame;
      if (playerB) playerB.seekFrame(clampFrame(alignedFrameB(fA), rb));
      timeline.update();
      if (!playerA.isPlaying) {
        playing = false;
        playBtn.textContent = '同步播放';
        return;
      }
      requestAnimationFrame(tick);
    };

    stage.appendChild(h('div', { class: 'card' }, h('div', { class: 'row' },
      playBtn,
      h('button', { onclick: () => { playerA.seekFrame(t0A); playerB?.seekFrame(t0B); timeline.update(); } }, '回到离板帧'),
      h('span', { class: 'tag' }, `A 离板帧 ${t0A} ↔ B 离板帧 ${t0B}，已对齐`),
    )));

    function jumpWorst(): void {
      playerA.pause();
      playerB?.pause();
      playerA.seekFrame(diff.worstFrameA);
      playerB?.seekFrame(diff.worstFrameB);
      timeline.update();
      toast(`已跳到 ${diff.worstJoint} 差异最大处`);
    }
  }
}

interface DiffResult {
  perJointMax: Record<string, number>;
  worstJoint: string;
  worstFrameA: number;
  worstFrameB: number;
}

function computeDiff(a: Aligned, b: Aligned): DiffResult {
  const t0a = a.record.events.takeoffFrame;
  const t0b = b.record.events.takeoffFrame;
  const end = Math.min(
    a.record.events.entryFrame - t0a,
    b.record.events.entryFrame - t0b,
  );
  const perJointMax: Record<string, number> = {};
  let worst = -1;
  let worstName = '';
  let worstFa = t0a;
  let worstFb = t0b;

  for (const [name, chain] of Object.entries(ANGLE_CHAINS)) {
    let max = 0;
    for (let k = 0; k <= end; k++) {
      const fa = t0a + k;
      const fb = t0b + k;
      const va = angleOf(a.analysis, fa, chain);
      const vb = angleOf(b.analysis, fb, chain);
      const d = Math.abs(va - vb);
      if (d > max) {
        max = d;
        if (d > worst) {
          worst = d;
          worstName = name;
          worstFa = fa;
          worstFb = fb;
        }
      }
    }
    perJointMax[name] = max;
  }
  return { perJointMax, worstJoint: worstName, worstFrameA: worstFa, worstFrameB: worstFb };
}

function angleOf(an: AnalysisResult, frame: number, chain: readonly number[]): number {
  const m = an.metrics[frame];
  const key = chain === ANGLE_CHAINS.hipL ? 'hipL'
    : chain === ANGLE_CHAINS.hipR ? 'hipR'
    : chain === ANGLE_CHAINS.kneeL ? 'kneeL'
    : chain === ANGLE_CHAINS.kneeR ? 'kneeR'
    : chain === ANGLE_CHAINS.elbowL ? 'elbowL'
    : chain === ANGLE_CHAINS.elbowR ? 'elbowR'
    : chain === ANGLE_CHAINS.shoulderL ? 'shoulderL' : 'shoulderR';
  return m[key] as number;
}

function labelOf(r: MoCapRecord): string {
  return `${r.diveCode} · ${r.id.slice(-5)} · ${r.source}`;
}

void JOINTS;
