// 对比分析页:两跳按离板帧对齐,叠加(一实一虚)或左右分屏,最大角度差自动跳转
import { h, clear } from '../dom';
import { registerPageCleanup } from '../app';
import { store } from '../../core/store';
import { CompareScene, type CompareLayout } from '../../three/compareScene';

export function renderComparePage(root: HTMLElement): void {
  clear(root);
  const s = store.state;

  root.append(
    h('div', { className: 'toolbar' }, [
      h('h2', { className: 'page-title', style: 'margin:0' }, '对比分析'),
      h('span', { className: 'muted' }, '按离板帧自动对齐,公共时间轴第 0 帧 = 两跳各自离板瞬间'),
    ]),
  );

  if (s.clips.length < 2) {
    root.append(h('div', { className: 'empty' }, '至少需要两跳才能对比,请先在训练课中生成或导入'));
    return;
  }

  const clipOptions = s.clips.map((c) => {
    const a = store.athleteOf(c);
    return h('option', { value: c.id }, `${c.diveCode} · ${a?.name ?? ''} · ${c.id.slice(-6)}`);
  });

  const selA = h('select', {}, clipOptions.map((o) => o.cloneNode(true) as HTMLOptionElement));
  const selB = h('select', {}, clipOptions.map((o) => o.cloneNode(true) as HTMLOptionElement));
  selB.selectedIndex = Math.min(1, s.clips.length - 1);

  const viewport = h('div', { className: 'viewport-wrap', style: 'min-height:560px' }, [h('canvas', {})]);
  let scene: CompareScene | null = null;
  let resizeObs: ResizeObserver | null = null;

  const diffCard = h('div', { className: 'card' }, [h('h3', {}, '关节角度差'), h('div', { className: 'muted' }, '选择两跳后开始对比')]);

  function build(): void {
    const ca = store.getClip(selA.value);
    const cb = store.getClip(selB.value);
    if (!ca || !cb || ca.id === cb.id) { alert('请选择两跳不同的片段'); return; }
    const aa = store.athleteOf(ca); const ab = store.athleteOf(cb);
    if (!aa || !ab) { alert('队员档案缺失'); return; }
    scene?.dispose();
    scene = new CompareScene(
      viewport.querySelector('canvas')!,
      { clip: ca, athlete: aa, analysis: store.analysis(ca) },
      { clip: cb, athlete: ab, analysis: store.analysis(cb) },
      s.settings,
      (frame) => {
        const el = document.getElementById('cmp-frame');
        if (el) el.textContent = `对齐帧 ${frame} (${(frame / ca.sampleRate).toFixed(2)}s)`;
      },
    );
    if (!resizeObs) {
      resizeObs = new ResizeObserver(() => scene?.resize());
      resizeObs.observe(viewport);
    }
    scene.resize();
    registerPageCleanup(() => { resizeObs?.disconnect(); scene?.dispose(); });
    // 差异摘要
    const r = scene.diffRange;
    diffCard.replaceChildren(
      h('h3', {}, '关节角度差(膝/髋)'),
      h('div', { className: 'kv' }, [
        h('span', { className: 'k' }, '最大差异'),
        h('b', { style: 'color:var(--orange)' }, r ? `${r.maxDiffDeg.toFixed(1)}°` : '—'),
        h('span', { className: 'k' }, '差异区间'),
        h('span', {}, r ? `对齐帧 ${r.startFrame} ~ ${r.endFrame}` : '—'),
      ]),
      h('button', {
        className: 'primary', style: 'margin-top:10px',
        onclick: () => { scene?.jumpToMaxDiff(); flashDiff(); },
      }, '自动跳到差异最大段'),
    );
  }

  function flashDiff(): void {
    viewport.classList.remove('flash-row');
    void viewport.offsetWidth;
    viewport.classList.add('flash-row');
  }

  const controls = h('div', { className: 'card' }, [
    h('div', { className: 'row' }, [
      h('div', { style: 'flex:1;min-width:200px' }, [h('label', {}, 'A 跳(实体/绿色)'), selA]),
      h('div', { style: 'flex:1;min-width:200px' }, [h('label', {}, 'B 跳(半透明/橙色)'), selB]),
      h('button', { className: 'primary', style: 'margin-top:18px', onclick: build }, '开始对比'),
    ]),
    h('div', { className: 'row', style: 'margin-top:12px' }, [
      h('button', { id: 'cmp-play', onclick: () => { scene?.togglePlay(); } }, '播放/暂停'),
      h('button', { onclick: () => scene?.seek(Math.max(0, (scene?.getFrame() ?? 1) - 1)) }, '上一帧'),
      h('button', { onclick: () => scene?.seek((scene?.getFrame() ?? 0) + 1) }, '下一帧'),
      h('div', { className: 'pill-group' }, [
        h('button', { className: 'active', onclick: (e: Event) => { scene?.setLayout('overlay'); togglePill(e); } }, '叠加(一实一虚)'),
        h('button', { onclick: (e: Event) => { scene?.setLayout('split'); togglePill(e); } }, '左右分屏'),
      ]),
      h('div', { className: 'spacer' }),
      h('span', { className: 'tag', id: 'cmp-frame' }, '对齐帧 0'),
    ]),
  ]);
  function togglePill(e: Event): void {
    (e.currentTarget as HTMLElement).parentElement?.querySelectorAll('button')
      .forEach((b) => b.classList.remove('active'));
    (e.currentTarget as HTMLElement).classList.add('active');
  }

  root.append(controls, viewport, h('div', { style: 'height:16px' }), diffCard);
  // 自动构建一次
  setTimeout(build, 0);
}
