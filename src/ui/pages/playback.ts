// 三维回放分析页:慢放/逐帧、相机视角、关键帧、圈数实时累计、标注、分析单导出
import { h, clear, download } from '../dom';
import { registerPageCleanup } from '../app';
import { store, uid } from '../../core/store';
import { DiveScene, type CameraMode } from '../../three/scene';
import { createTimeline, updateTimelineCursor } from '../timeline';
import { markedRanges } from '../../core/repair';
import { detectApex, detectOpenFrame } from '../../core/analysis';
import { JOINT_NAMES } from '../../core/skeleton';
import { Joint } from '../../core/types';
import type { Annotation, Athlete, DiveClip, DiveAnalysis } from '../../core/types';
import { createEntryAngleScatter } from '../scatter';
import { writeBVH } from '../../core/bvh';
import { writeCSV } from '../../core/csv';

export function renderPlaybackPage(root: HTMLElement): void {
  clear(root);
  const s = store.state;
  const maybeClip = store.getClip(s.activeClipId);
  if (!maybeClip) {
    root.append(h('div', { className: 'empty' }, '请先在「训练课」中选择一跳进行回放'));
    return;
  }
  const maybeAthlete = store.athleteOf(maybeClip);
  if (!maybeAthlete) {
    root.append(h('div', { className: 'empty' }, '该片段缺少队员档案,请先在队员页补建'));
    return;
  }
  const clip: DiveClip = maybeClip;
  const athlete: Athlete = maybeAthlete;
  const analysis = store.analysis(clip);

  // —— 片段选择条 ——
  const selector = h('div', { className: 'toolbar' }, [
    h('h2', { className: 'page-title', style: 'margin:0' }, '三维回放分析'),
    h('select', {
      onchange: (e: Event) => store.navigate('playback', (e.target as HTMLSelectElement).value),
    }, s.clips.map((c) => h('option', { value: c.id, selected: c.id === clip.id },
      `${c.diveCode} · ${store.athleteOf(c)?.name ?? ''} · ${c.frameCount}帧`))),
    h('div', { className: 'spacer' }),
    h('button', { onclick: () => exportBVH(clip) }, '导出 BVH'),
    h('button', { onclick: () => exportCSV(clip) }, '导出 CSV'),
    h('button', { className: 'primary', onclick: () => exportReport(clip) }, '导出分析单'),
  ]);
  root.append(selector);

  const layout = h('div', { className: 'playback-layout' });
  root.append(layout);

  const viewport = h('div', { className: 'viewport-wrap' }, [h('canvas', {})]);
  const side = h('div', { className: 'side-panel' });
  layout.append(viewport, side);

  const scene = new DiveScene({
    canvas: viewport.querySelector('canvas')!,
    clip, athlete, analysis, settings: s.settings,
  });
  const resizeObs = new ResizeObserver(() => scene.resize());
  resizeObs.observe(viewport);
  registerPageCleanup(() => { resizeObs.disconnect(); scene.dispose(); });

  // —— HUD ——
  const hud = h('div', { className: 'hud' }, [
    h('span', {}, ['动作 ', h('b', {}, clip.diveCode)]),
    h('span', {}, ['翻腾 ', h('b', { id: 'hud-som' }, '0.00')]),
    h('span', {}, ['转体 ', h('b', { id: 'hud-tw' }, '0.00')]),
    h('span', {}, ['帧 ', h('b', { id: 'hud-frame' }, '0')]),
    h('span', {}, ['时间 ', h('b', { id: 'hud-time' }, '0.00s')]),
  ]);
  viewport.append(hud);

  // —— 播放控制 ——
  const ctrl = h('div', { className: 'card' }, [
    h('div', { className: 'row' }, [
      h('button', { id: 'btn-play', className: 'primary', onclick: () => { scene.togglePlay(); updatePlayBtn(); } }, '播放'),
      h('button', { onclick: () => scene.seek(scene.getFrame() - 1) }, '上一帧'),
      h('button', { onclick: () => scene.seek(scene.getFrame() + 1) }, '下一帧'),
      h('span', { className: 'muted' }, '速度'),
      h('div', { className: 'pill-group' }, ['0.1', '0.25', '0.5', '1'].map((sp) =>
        h('button', {
          className: Number(sp) === 1 ? 'active' : '',
          onclick: (e: Event) => {
            scene.setSpeed(Number(sp));
            (e.currentTarget as HTMLElement).parentElement!.querySelectorAll('button')
              .forEach((b) => b.classList.remove('active'));
            (e.currentTarget as HTMLElement).classList.add('active');
          },
        }, `${sp}x`))),
    ]),
  ]);
  function updatePlayBtn(): void {
    const btn = ctrl.querySelector('#btn-play') as HTMLButtonElement;
    btn.textContent = scene.isPlaying() ? '暂停' : '播放';
  }

  // —— 相机 ——
  const camCard = h('div', { className: 'card' }, [
    h('h3', {}, '相机视角'),
    h('div', { className: 'pill-group' }, [
      camBtn('free', '自由环绕'), camBtn('follow', '锁重心跟随'),
      camBtn('judge', '裁判席'), camBtn('underwater', '水下'),
    ]),
  ]);
  function camBtn(mode: CameraMode, label: string): HTMLElement {
    return h('button', {
      className: mode === 'free' ? 'active' : '',
      onclick: (e: Event) => {
        scene.setCameraMode(mode);
        camCard.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
      },
    }, label);
  }

  // —— 实时指标 ——
  const metricsCard = h('div', { className: 'card' }, [
    h('h3', {}, '实时指标'),
    h('div', { className: 'grid cols-2' }, [
      metric('累计翻腾', 'm-som', '0.00 周'),
      metric('累计转体', 'm-tw', '0.00 周'),
      metric('左/右膝角', 'm-knee', '—'),
      metric('左/右髋角', 'm-hip', '—'),
      metric('抱紧状态', 'm-tight', '—'),
      metric('角速度', 'm-omega', '0 rad/s'),
    ]),
  ]);
  function metric(k: string, id: string, v: string): HTMLElement {
    return h('div', { className: 'metric' }, [
      h('div', { className: 'k' }, k),
      h('div', { className: 'v', id, style: 'font-size:17px' }, v),
    ]);
  }

  // —— 整跳结论 ——
  const conclusion = h('div', { className: 'card' }, [
    h('h3', {}, '整跳分析'),
    h('div', { className: 'kv' }, [
      h('span', { className: 'k' }, '翻腾圈数'), h('b', { style: 'color:var(--accent)' }, `${Math.abs(analysis.somersaultTurns).toFixed(2)} 周`),
      h('span', { className: 'k' }, '转体圈数'), h('b', {}, `${Math.abs(analysis.twistTurns).toFixed(2)} 周`),
      h('span', { className: 'k' }, '入水角'), h('span', {}, `${analysis.entryAngleDeg.toFixed(1)}°(偏离铅垂)`),
      h('span', { className: 'k' }, '手掌入水偏移'), h('span', {},
        `水平 ${Math.hypot(analysis.handEntryOffset[0], analysis.handEntryOffset[2]).toFixed(2)} m`),
      h('span', { className: 'k' }, '打开时机'), h('span', {},
        `${analysis.apexToOpenMs >= 0 ? '晚于' : '早于'}最高点 ${Math.abs(analysis.apexToOpenMs).toFixed(0)} ms`),
      h('span', { className: 'k' }, '峰值角速度'), h('span', {}, `${analysis.maxAngularVelocity.toFixed(1)} rad/s`),
    ]),
  ]);

  // —— 标注 ——
  const annotCard = h('div', { className: 'card' }, [h('h3', {}, '帧标注')]);
  let lastAnnotFrame = -1;
  let annotVersion = 0;
  function refreshAnnotations(force = false): void {
    const f = scene.getFrame();
    // 帧没变且非强制(增删后)时跳过,避免播放时每帧重建 DOM
    if (!force && f === lastAnnotFrame) return;
    lastAnnotFrame = f;
    const list = store.annotationsOf(clip.id);
    annotCard.replaceChildren(h('h3', {}, '帧标注'));
    annotCard.append(
      h('div', { className: 'row' }, [
        h('button', { onclick: () => addAnnotation('comment') }, '+ 挂评语'),
        h('button', { onclick: () => addAnnotation('arrow') }, '+ 画箭头'),
      ]),
    );
    const atFrame = list.filter((a) => a.frame === scene.getFrame());
    if (atFrame.length === 0) {
      annotCard.append(h('p', { className: 'muted', style: 'font-size:12px' }, '当前帧暂无标注'));
    }
    for (const a of atFrame) {
      annotCard.append(h('div', { className: 'annotation-item', style: `border-left-color:${a.color}` }, [
        h('div', { className: 'row' }, [
          h('b', {}, a.kind === 'comment' ? '评语' : '箭头'),
          h('span', { className: 'muted' }, `第${a.frame}帧 · ${JOINT_NAMES[a.anchorJoint]}`),
          h('div', { className: 'spacer' }),
          h('button', {
            className: 'danger', onclick: async () => {
              await store.deleteAnnotation(a.id); annotVersion++; refreshAnnotations(true);
            },
          }, '删'),
        ]),
        a.text ? h('div', { style: 'margin-top:4px' }, a.text) : null,
      ]));
    }
    scene.setAnnotations(list);
  }
  function addAnnotation(kind: Annotation['kind']): void {
    const frame = scene.getFrame();
    const anchorJoint = Joint.Hips;
    const color = kind === 'comment' ? '#38bdf8' : '#f97316';
    if (kind === 'comment') {
      const text = prompt('输入评语:');
      if (!text) return;
      void store.saveAnnotation({
        id: uid('ann'), clipId: clip.id, frame, kind, text, anchorJoint, color, createdAt: Date.now(),
      }).then(() => { annotVersion++; refreshAnnotations(true); });
    } else {
      void store.saveAnnotation({
        id: uid('ann'), clipId: clip.id, frame, kind, anchorJoint,
        offset: [0.4, 0.3, 0], color, createdAt: Date.now(),
      }).then(() => { annotVersion++; refreshAnnotations(true); });
    }
  }

  side.append(ctrl, camCard, metricsCard, conclusion, annotCard);
  side.append(createEntryAngleScatter(clip.diveCode));
  refreshAnnotations();

  // —— 时间轴 ——
  const timelineWrap = h('div', { className: 'card', style: 'margin-top:16px' }, [
    h('div', { className: 'row' }, [
      h('b', {}, '时间轴'),
      h('span', { className: 'muted', style: 'font-size:12px' },
        '黄段=丢帧/翻转已修复;绿色离板、红色入水标记可直接拖动修正'),
    ]),
  ]);
  let timeline = createTimeline(clip, 0, {
    onSeek: (f) => { scene.seek(f); },
    onMoveEvent: async (kind, f) => {
      (clip as any)[kind] = f;
      // 离板/入水改动后,最高点与打开帧重新识别
      clip.apexFrame = detectApex(clip);
      const fresh = store.analysis(clip);
      clip.openFrame = detectOpenFrame(clip, fresh.metrics, store.state.settings);
      await store.saveClip(clip);
      store.invalidateAnalysis(clip.id);
      timelineWrap.replaceChildren();
      timeline = rebuildTimeline();
      timelineWrap.append(timeline);
      scene.seek(scene.getFrame());
    },
  });
  function rebuildTimeline(): HTMLElement {
    return createTimeline(clip, scene.getFrame(), {
      onSeek: (f) => scene.seek(f),
      onMoveEvent: async (kind, f) => {
        (clip as any)[kind] = f;
        clip.apexFrame = detectApex(clip);
        const fresh = store.analysis(clip);
        clip.openFrame = detectOpenFrame(clip, fresh.metrics, store.state.settings);
        await store.saveClip(clip);
        store.invalidateAnalysis(clip.id);
      },
    });
  }
  timelineWrap.append(timeline);
  layout.append(timelineWrap);
  // 网格:左列 viewport + 时间轴,右列 side 跨两行
  viewport.style.gridRow = '1 / 2';
  timelineWrap.style.gridRow = '2 / 3';
  timelineWrap.style.gridColumn = '1 / 2';
  side.style.gridRow = '1 / 3';
  side.style.gridColumn = '2 / 3';

  // —— 帧联动 ——
  scene.onFrame = (f) => {
    updateTimelineCursor(timeline, f, clip.frameCount);
    const m = analysis.metrics[f];
    setText('hud-frame', String(f));
    setText('hud-time', `${(f / clip.sampleRate).toFixed(2)}s`);
    if (m) {
      setText('hud-som', (m.somersaultCumDeg / 360).toFixed(2));
      setText('hud-tw', (m.twistCumDeg / 360).toFixed(2));
      setText('m-som', `${(m.somersaultCumDeg / 360).toFixed(2)} 周`);
      setText('m-tw', `${(m.twistCumDeg / 360).toFixed(2)} 周`);
      setText('m-knee', `${m.kneeAngles[0].toFixed(0)}° / ${m.kneeAngles[1].toFixed(0)}°`);
      setText('m-hip', `${m.hipAngles[0].toFixed(0)}° / ${m.hipAngles[1].toFixed(0)}°`);
      const tightEl = document.getElementById('m-tight');
      if (tightEl) {
        tightEl.textContent = m.isTight ? '抱紧 ✓' : '未抱紧';
        tightEl.style.color = m.isTight ? 'var(--accent-2)' : 'var(--fg-dim)';
      }
      setText('m-omega', `${m.angularVelocity.toFixed(1)} rad/s`);
    }
    refreshAnnotations();
  };
  scene.seek(0);

  function setText(id: string, v: string): void {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  }

  function exportBVH(c: DiveClip): void {
    const text = writeBVH(c, { height: athlete.heightCm / 100, armSpan: athlete.armSpanCm / 100 });
    download(`${c.diveCode}_${c.id}.bvh`, text);
  }
  function exportCSV(c: DiveClip): void {
    download(`${c.diveCode}_${c.id}.csv`, writeCSV(c), 'text/csv');
  }
  function exportReport(c: DiveClip): void {
    // 关键帧截图
    const shots: Array<[string, string]> = [];
    for (const [f, label] of [
      [c.takeoffFrame, '离板'], [c.apexFrame, '最高点'], [c.openFrame, '打开'], [c.entryFrame, '入水'],
    ] as const) {
      if (f < 0) continue;
      scene.seek(f);
      shots.push([label, scene.screenshot()]);
    }
    scene.seek(0);
    const a = store.analysis(c);
    const ranges = markedRanges(c);
    const annots = store.annotationsOf(c.id);
    const html = buildReportHtml(c, athlete.name, a, shots, ranges, annots);
    download(`${c.diveCode}_分析单.html`, html, 'text/html');
  }
}

function buildReportHtml(
  clip: DiveClip,
  athleteName: string,
  a: DiveAnalysis,
  shots: Array<[string, string]>,
  ranges: ReturnType<typeof markedRanges>,
  annots: Annotation[],
): string {
  const c = clip;
  const rows = shots.map(([label, src]) =>
    `<figure><img src="${src}"/><figcaption>${label} 第${({
      离板: c.takeoffFrame, 最高点: c.apexFrame, 打开: c.openFrame, 入水: c.entryFrame,
    } as any)[label]}帧</figcaption></figure>`).join('');
  const defects = ranges.length
    ? ranges.map((r) => `<li>${r.label}:第${r.start}-${r.end}帧</li>`).join('')
    : '<li>无数据缺陷</li>';
  const notes = annots.length
    ? annots.map((x) => `<li>第${x.frame}帧 ${x.kind === 'comment' ? `评语:${x.text ?? ''}` : '箭头标注'}</li>`).join('')
    : '<li>无</li>';
  return `<!doctype html><html lang="zh"><head><meta charset="utf-8">
<title>${c.diveCode} 动作分析单</title>
<style>
body{font-family:"Microsoft YaHei",sans-serif;max-width:900px;margin:24px auto;color:#1f2937}
h1{border-bottom:3px solid #0ea5e9;padding-bottom:8px}
table{border-collapse:collapse;width:100%;margin:12px 0}td,th{border:1px solid #cbd5e1;padding:8px;text-align:left}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}figure{margin:0;border:1px solid #cbd5e1;border-radius:8px;overflow:hidden}
figure img{width:100%;display:block}figcaption{padding:6px 10px;background:#f1f5f9;font-size:13px}
.tag{background:#fef3c7;padding:2px 8px;border-radius:6px}
</style></head><body>
<h1>${c.diveCode} 动作分析单</h1>
<table>
<tr><th>队员</th><td>${athleteName}</td><th>采样率</th><td>${c.sampleRate} Hz / ${c.frameCount} 帧</td></tr>
<tr><th>翻腾圈数</th><td><b>${Math.abs(a.somersaultTurns).toFixed(2)}</b> 周</td><th>转体圈数</th><td><b>${Math.abs(a.twistTurns).toFixed(2)}</b> 周</td></tr>
<tr><th>入水角</th><td>${a.entryAngleDeg.toFixed(1)}°</td><th>打开时机</th><td>${a.apexToOpenMs >= 0 ? '晚于' : '早于'}最高点 ${Math.abs(a.apexToOpenMs).toFixed(0)} ms</td></tr>
<tr><th>手掌入水水平偏移</th><td>${Math.hypot(a.handEntryOffset[0], a.handEntryOffset[2]).toFixed(2)} m</td><th>峰值角速度</th><td>${a.maxAngularVelocity.toFixed(1)} rad/s</td></tr>
</table>
<h2>关键帧截图</h2><div class="grid">${rows}</div>
<h2>数据质量</h2><ul>${defects}</ul>
<h2>教练标注</h2><ul>${notes}</ul>
<p class="tag">由跳水动作分析系统生成 · ${new Date().toLocaleString('zh-CN')}</p>
</body></html>`;
}
