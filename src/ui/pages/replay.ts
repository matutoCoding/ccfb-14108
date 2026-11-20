// 三维回放页
import type { AnalysisResult } from '../../core/kinematics';
import { analyzeRecord } from '../../core/kinematics';
import type { Annotation, AppSettings, Athlete, MoCapRecord } from '../../core/types';
import { buildSkeleton } from '../../core/skeleton';
import { JOINTS, JOINT_INDEX } from '../../core/skeleton';
import { db } from '../../core/db';
import { Player, type CameraPreset } from '../../render/Player';
import { Timeline } from '../Timeline';
import { h, clear, modal, toast, download, fmtMs } from '../dom';
import { navigate } from '../router';
import { rad2deg, uid } from '../../core/math';
import { exportBvh, exportCsv } from '../../core/io';
import { buildReportHtml, type ReportRow } from '../report';
import { parseDiveCode } from '../../core/settings';

export async function renderReplayPage(container: HTMLElement, recordId?: string): Promise<void> {
  clear(container);
  if (!recordId) {
    container.appendChild(h('div', { class: 'empty' }, '请从训练课选择一跳。',
      h('div', { style: 'margin-top:12px' },
        h('button', { class: 'primary', onclick: () => navigate('#/sessions') }, '去训练课'))));
    return;
  }

  const [maybeRec, athlete, settings] = await Promise.all([
    db.getRecord(recordId),
    db.listAthletes(),
    db.getSettings(),
  ]);
  if (!maybeRec) {
    container.appendChild(h('div', { class: 'empty' }, '记录不存在。'));
    return;
  }
  const foundAth = athlete.find((a) => a.id === maybeRec.athleteId);
  if (!foundAth) return;
  const ath0: Athlete = foundAth;
  const rec0: MoCapRecord = maybeRec;
  const spec = buildSkeleton(ath0);
  const analysis: AnalysisResult = analyzeRecord(rec0, spec, settings.thresholds);
  const info = parseDiveCode(rec0.diveCode);

  container.append(
    h('h1', { class: 'page-title' },
      `${ath0.name} · ${rec0.diveCode}`,
      h('span', { class: 'tag purple', style: 'margin-left:10px' }, info.label),
      rec0.repaired ? h('span', { class: 'tag warn', style: 'margin-left:8px' }, '异常已修复') : h('span', { class: 'tag good', style: 'margin-left:8px' }, '数据正常'),
    ),
    h('p', { class: 'page-sub' },
      `${rec0.sampleRate}Hz · ${rec0.frames.length} 帧 · 时长 ${(rec0.frames.length / rec0.sampleRate).toFixed(2)}s · 来源：${rec0.source === 'synthetic' ? '合成' : rec0.source.toUpperCase()}`),
  );

  // 视口
  const viewport = h('div', { class: 'viewport', style: 'height:56vh;min-height:380px' });
  const player = new Player(viewport, rec0, spec, analysis);
  let annotations = await db.listAnnotations(rec0.id);
  player.setAnnotations(annotations);

  // 指标浮层
  const metricsBox = h('div', { class: 'overlay-panel', style: 'left:12px;top:12px;min-width:190px' });
  const tightTag = h('span', { class: 'tag' }, '未抱紧');
  metricsBox.append(
    h('div', { style: 'font-weight:700;margin-bottom:6px;color:var(--accent)' }, '实时指标'),
    h('div', { id: 'm-som' }, '翻腾 0.00 圈'),
    h('div', { id: 'm-tw', style: 'margin-top:3px' }, '转体 0.00 圈'),
    h('div', { id: 'm-hip', style: 'margin-top:3px' }, '髋角 —'),
    h('div', { id: 'm-knee', style: 'margin-top:3px' }, '膝角 —'),
    h('div', { style: 'margin-top:6px' }, tightTag),
  );
  viewport.appendChild(metricsBox);
  const frameBox = h('div', { class: 'overlay-panel', style: 'right:12px;top:12px' }, '第 0 帧');
  viewport.appendChild(frameBox);

  // 时间轴
  const timeline = new Timeline(rec0, {
    currentFrame: () => player.currentFrame,
    onSeek: (f) => {
      player.pause();
      player.seekFrame(f);
      timeline.update();
    },
    onEventChange: async (events) => {
      rec0.events = events;
      await db.saveRecord(rec0);
      toast('事件帧已更新并保存');
    },
  });

  // 控制条
  const playBtn = h('button', { class: 'primary' }, '播放');
  const speedLabel = h('span', { style: 'color:var(--muted);font-size:12px' }, '1.0×');
  const controls = h('div', { class: 'card' },
    h('div', { class: 'row' },
      playBtn,
      h('button', { onclick: () => step(-1) }, '⏮ 上一帧'),
      h('button', { onclick: () => step(1) }, '下一帧 ⏭'),
      h('span', { style: 'width:12px' }),
      ...[0.1, 0.25, 0.5, 1].map((s) =>
        h('button', {
          class: s === 1 ? 'active' : '',
          onclick: (e) => {
            player.setSpeed(s);
            speedLabel.textContent = `${s}×`;
            (e.target as HTMLElement).parentElement!.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
            (e.target as HTMLElement).classList.add('active');
          },
        }, `${s}×`),
      ),
      speedLabel,
      h('div', { class: 'spacer' }),
      h('button', { onclick: () => player.frameHuman() }, '框选人物'),
      ...cameraButtons(),
    ),
    h('div', { class: 'row', style: 'margin-top:12px' },
      toggle('质心抛物线', true, (on) => player.setOptions({ showTrajectory: on })),
      toggle('角速度残影', true, (on) => player.setOptions({ showGhosts: on })),
      toggle('入水切片', true, (on) => player.setOptions({ showEntrySlice: on })),
      h('span', { style: 'margin-left:8px;color:var(--muted);font-size:12px' }, '残影间隔'),
      nInput(),
      h('div', { class: 'spacer' }),
      h('button', { onclick: () => addAnnotation() }, '＋ 标注'),
      h('button', { onclick: () => exportData('bvh') }, '导出 BVH'),
      h('button', { onclick: () => exportData('csv') }, '导出 CSV'),
      h('button', { class: 'primary', onclick: () => exportReport() }, '导出分析单'),
    ),
  );

  // 关键帧与打开时机
  const ev = rec0.events;
  const openDeltaMs = ((ev.openFrame - ev.apexFrame) / rec0.sampleRate) * 1000;
  const summary = h('div', { class: 'grid cols-4' },
    summaryMetric('总翻腾', Math.abs(analysis.totalSomersaults).toFixed(2), `圈 / 目标 ${info.somersaults}`,
      Math.abs(Math.abs(analysis.totalSomersaults) - info.somersaults) < 0.12),
    summaryMetric('总转体', Math.abs(analysis.totalTwists).toFixed(2), `圈 / 目标 ${info.twists}`,
      Math.abs(Math.abs(analysis.totalTwists) - info.twists) < 0.12),
    summaryMetric('入水角', analysis.entryAngleDeg.toFixed(1), '°（偏离铅垂）',
      analysis.entryAngleDeg <= settings.thresholds.entryAngleDeg),
    summaryMetric('打开 vs 最高点', `${openDeltaMs > 0 ? '+' : ''}${openDeltaMs.toFixed(0)}`, 'ms',
      Math.abs(openDeltaMs) < 200),
  );

  const keyframes = h('div', { class: 'card' },
    h('h3', {}, '关键帧（可在下方时间轴拖动修正）'),
    h('div', { class: 'grid cols-4' },
      keyFrame('离板', ev.takeoffFrame, '#34d399'),
      keyFrame('最高点', ev.apexFrame, '#fbbf24'),
      keyFrame('打开', ev.openFrame, '#a78bfa'),
      keyFrame('入水', ev.entryFrame, '#f87171'),
    ),
  );

  const annList = h('div', { class: 'card' }, h('h3', {}, '本跳标注'), h('div', { id: 'ann-list' }));
  renderAnnList();

  container.append(viewport, summary, keyframes, timeline.el, controls, annList);

  // 播放循环里更新浮层
  player.onFrameChange((f) => {
    timeline.update();
    frameBox.textContent = `第 ${f} 帧 · ${fmtMs(f, rec0.sampleRate)}`;
    const m = analysis.metrics[f];
    document.getElementById('m-som')!.textContent = `翻腾 ${(m.somersaultAngle / (2 * Math.PI)).toFixed(2)} 圈`;
    document.getElementById('m-tw')!.textContent = `转体 ${(m.twistAngle / (2 * Math.PI)).toFixed(2)} 圈`;
    document.getElementById('m-hip')!.textContent = `髋角 L${m.hipL.toFixed(0)}° R${m.hipR.toFixed(0)}°`;
    document.getElementById('m-knee')!.textContent = `膝角 L${m.kneeL.toFixed(0)}° R${m.kneeR.toFixed(0)}°`;
    tightTag.textContent = m.tight ? '抱紧中 ✓' : '未抱紧';
    tightTag.className = `tag ${m.tight ? 'good' : ''}`;
  });
  player.seekFrame(ev.takeoffFrame);

  playBtn.addEventListener('click', () => {
    if (player.isPlaying) {
      player.pause();
      playBtn.textContent = '播放';
    } else {
      if (player.currentFrame >= rec0.frames.length - 1) player.seekFrame(0);
      player.play();
      playBtn.textContent = '暂停';
    }
  });

  function step(d: number): void {
    player.pause();
    playBtn.textContent = '播放';
    player.seekFrame(player.currentFrame + d);
    timeline.update();
  }

  function cameraButtons(): HTMLElement[] {
    const presets: [CameraPreset, string][] = [
      ['free', '自由视角'],
      ['follow', '锁重心跟随'],
      ['judge', '裁判席'],
      ['underwater', '水下视角'],
    ];
    return presets.map(([p, label]) =>
      h('button', { class: p === 'follow' ? 'active' : '', onclick: (e) => {
        player.setCameraPreset(p);
        (e.target as HTMLElement).parentElement!.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        (e.target as HTMLElement).classList.add('active');
      } }, label));
  }

  function toggle(label: string, initial: boolean, onChange: (on: boolean) => void): HTMLElement {
    const btn = h('button', { class: initial ? 'active' : '' }, label);
    let on = initial;
    btn.addEventListener('click', () => {
      on = !on;
      btn.classList.toggle('active', on);
      onChange(on);
    });
    return btn;
  }

  function nInput(): HTMLElement {
    const inp = h('input', { type: 'number', min: '4', max: '48', value: '12', style: 'width:80px' }) as HTMLInputElement;
    inp.addEventListener('change', () => player.setOptions({ ghostEveryN: Number(inp.value) }));
    return inp;
  }

  function summaryMetric(k: string, val: string, unit: string, ok: boolean): HTMLElement {
    return h('div', { class: 'metric' },
      h('div', { class: 'k' }, k),
      h('div', { class: 'val', style: `color:${ok ? 'var(--good)' : 'var(--warn)'}` }, val,
        h('span', { class: 'unit', style: 'margin-left:6px' }, unit)));
  }

  function keyFrame(label: string, frame: number, color: string): HTMLElement {
    return h('div', { class: 'metric' },
      h('div', { class: 'k', style: `color:${color}` }, label),
      h('div', { class: 'val', style: 'font-size:18px' }, `第 ${frame} 帧`),
      h('div', { style: 'font-size:12px;color:var(--muted)' }, fmtMs(frame, rec0.sampleRate)));
  }

  function addAnnotation(): void {
    const f = player.currentFrame;
    const textIn = h('textarea', { rows: '3', placeholder: '评语，如：打开略晚、膝盖没夹紧' }) as HTMLTextAreaElement;
    const typeIn = h('select', {},
      h('option', { value: 'note' }, '文字评语'),
      h('option', { value: 'arrow' }, '箭头'),
    ) as HTMLSelectElement;
    const jointIn = h('select', {}, ...JOINTS.map((j) => h('option', { value: String(JOINT_INDEX[j]) }, j))) as HTMLSelectElement;
    jointIn.value = String(JOINT_INDEX.Head);
    const toIn = h('select', {}, ...JOINTS.map((j) => h('option', { value: String(JOINT_INDEX[j]) }, j))) as HTMLSelectElement;
    toIn.value = String(JOINT_INDEX.LeftHand);
    const colorIn = h('input', { type: 'color', value: '#fbbf24' }) as HTMLInputElement;

    const body = h('div', {},
      h('div', { style: 'color:var(--muted);font-size:12px;margin-bottom:10px' }, `钉在第 ${f} 帧，跟随骨骼节点运动`),
      f2('类型', typeIn), f2('挂载关节', jointIn), f2('箭头指向（仅箭头）', toIn),
      f2('颜色', colorIn), f2('内容', textIn),
    );
    const save = h('button', { class: 'primary' }, '挂上标注');
    const m = modal('新增标注', body, h('div', { class: 'row' },
      h('div', { class: 'spacer' }), h('button', { onclick: () => m.close() }, '取消'), save));
    save.addEventListener('click', async () => {
      if (!textIn.value.trim()) return toast('请填写内容');
      const ann: Annotation = {
        id: uid('ann_'),
        recordId: rec0.id,
        frame: f,
        type: typeIn.value as Annotation['type'],
        jointId: Number(jointIn.value),
        toJointId: typeIn.value === 'arrow' ? Number(toIn.value) : undefined,
        text: textIn.value.trim(),
        color: colorIn.value,
        createdAt: Date.now(),
      };
      await db.saveAnnotation(ann);
      annotations = await db.listAnnotations(rec0.id);
      player.setAnnotations(annotations);
      renderAnnList();
      m.close();
      toast('标注已挂上');
    });
  }

  function renderAnnList(): void {
    const box = document.getElementById('ann-list');
    if (!box) return;
    clear(box);
    if (!annotations.length) {
      box.appendChild(h('div', { style: 'color:var(--muted);font-size:13px' }, '暂无标注。'));
      return;
    }
    for (const a of annotations) {
      box.appendChild(h('div', {
        class: 'row',
        style: 'padding:8px 0;border-bottom:1px solid var(--border)',
      },
        h('span', { class: 'tag', style: `border-color:${a.color};color:${a.color}` }, `第${a.frame}帧`),
        h('span', { style: 'flex:1' }, a.text),
        h('button', {
          onclick: () => {
            player.seekFrame(a.frame);
            timeline.update();
          },
        }, '跳到该帧'),
        h('button', {
          class: 'danger',
          onclick: async () => {
            await db.deleteAnnotation(a.id);
            annotations = await db.listAnnotations(rec0.id);
            player.setAnnotations(annotations);
            renderAnnList();
          },
        }, '删除'),
      ));
    }
  }

  function exportData(kind: 'bvh' | 'csv'): void {
    const text = kind === 'bvh' ? exportBvh(rec0, spec) : exportCsv(rec0, spec);
    download(`${rec0.diveCode}-${rec0.id}.${kind}`, text, kind === 'bvh' ? 'text/plain' : 'text/csv');
    toast(`已导出 ${kind.toUpperCase()}`);
  }

  async function exportReport(): Promise<void> {
    const session = (await db.listSessions()).find((s) => s.id === rec0.sessionId);
    const shots = [
      { title: '离板', frame: ev.takeoffFrame, dataUrl: player.screenshotFrame(ev.takeoffFrame) },
      { title: '最高点', frame: ev.apexFrame, dataUrl: player.screenshotFrame(ev.apexFrame) },
      { title: '打开', frame: ev.openFrame, dataUrl: player.screenshotFrame(ev.openFrame) },
      { title: '入水', frame: ev.entryFrame, dataUrl: player.screenshotFrame(ev.entryFrame) },
    ];
    const row: ReportRow = { record: rec0, athlete: ath0, analysis, annotations, shots };
    const html = buildReportHtml(
      session ?? { id: rec0.sessionId, date: new Date().toISOString().slice(0, 10), title: '单跳分析', athleteId: ath0.id, platform: rec0.platform, recordIds: [rec0.id], createdAt: Date.now() },
      [row],
    );
    download(`分析单-${rec0.diveCode}-${rec0.id}.html`, html, 'text/html');
    toast('分析单已生成（含 4 张关键帧截图）');
  }
}

function f2(label: string, input: HTMLElement): HTMLElement {
  return h('div', { style: 'margin-bottom:10px' }, h('label', {}, label), input);
}

void rad2deg;
